package com.dpi.engine;
import com.dpi.core.*;
import com.dpi.protocol.*;
import com.dpi.rules.BlockingRuleManager;
import com.dpi.threading.BoundedBlockingPacketQueue;
import com.dpi.tracking.PerFlowConnectionTracker;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.BiConsumer;
public class FastPathPacketProcessor implements Runnable {
    private final int fpId;
    private final BoundedBlockingPacketQueue<PacketJob> inputQueue;
    private final PerFlowConnectionTracker connTracker;
    private final BlockingRuleManager ruleManager;
    private final BiConsumer<PacketJob, PacketAction> outputCallback;
    private final AtomicLong packetsProcessed = new AtomicLong();
    private final AtomicLong packetsForwarded = new AtomicLong();
    private final AtomicLong packetsDropped = new AtomicLong();
    private final AtomicLong sniExtractions = new AtomicLong();
    private final AtomicLong classificationHits = new AtomicLong();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread thread;
    public FastPathPacketProcessor(int fpId, BlockingRuleManager ruleManager,
                                   BiConsumer<PacketJob, PacketAction> outputCallback) {
        this.fpId = fpId;
        this.inputQueue = new BoundedBlockingPacketQueue<>(10000);
        this.connTracker = new PerFlowConnectionTracker(fpId);
        this.ruleManager = ruleManager;
        this.outputCallback = outputCallback;
    }
    public void start() {
        if (running.get()) return;
        running.set(true);
        thread = new Thread(this, "FP-" + fpId);
        thread.start();
        System.out.println("[FP" + fpId + "] Started");
    }
    public void stop() {
        if (!running.get()) return;
        running.set(false);
        inputQueue.shutdown();
        if (thread != null) {
            try { thread.join(); } catch (InterruptedException ignored) {}
        }
        System.out.println("[FP" + fpId + "] Stopped (processed " + packetsProcessed.get() + " packets)");
    }
    @Override
    public void run() {
        while (running.get()) {
            Optional<PacketJob> jobOpt = inputQueue.popWithTimeout(100);
            if (jobOpt.isEmpty()) {
                connTracker.cleanupStale(300_000_000_000L);
                continue;
            }
            packetsProcessed.incrementAndGet();
            PacketJob job = jobOpt.get();
            PacketAction action = processPacket(job);
            if (outputCallback != null) {
                outputCallback.accept(job, action);
            }
            if (action == PacketAction.DROP) {
                packetsDropped.incrementAndGet();
            } else {
                packetsForwarded.incrementAndGet();
            }
        }
    }
    private PacketAction processPacket(PacketJob job) {
        Connection conn = connTracker.getOrCreateConnection(job.getTuple());
        if (conn == null) return PacketAction.FORWARD;
        connTracker.updateConnection(conn, job.getData().length, true);
        if (job.getTuple().getProtocol() == 6) { 
            updateTcpState(conn, job.getTcpFlags());
        }
        if (conn.getState() == ConnectionState.BLOCKED) {
            return PacketAction.DROP;
        }
        if (conn.getState() != ConnectionState.CLASSIFIED && job.getPayloadLength() > 0) {
            inspectPayload(job, conn);
        }
        if (ruleManager != null && ruleManager.shouldThrottle(
                job.getTuple().getSrcIp(),
                job.getTuple().getDstPort(),
                conn.getAppType(),
                conn.getSni())) {
            try {
                Thread.sleep(10);
            } catch (InterruptedException ignored) {}
        }
        return checkRules(job, conn);
    }
    private void inspectPayload(PacketJob job, Connection conn) {
        if (job.getPayloadLength() == 0 || job.getPayloadOffset() >= job.getData().length) return;
        if (tryExtractSni(job, conn)) return;
        if (tryExtractHttpHost(job, conn)) return;
        if (job.getTuple().getDstPort() == 53 || job.getTuple().getSrcPort() == 53) {
            Optional<String> domain = DnsQueryDomainExtractor.extractQuery(
                    job.getData(), job.getPayloadOffset(), job.getPayloadLength());
            if (domain.isPresent()) {
                connTracker.classifyConnection(conn, AppType.DNS, domain.get());
                return;
            }
        }
        if (job.getTuple().getDstPort() == 80) {
            connTracker.classifyConnection(conn, AppType.HTTP, "");
        } else if (job.getTuple().getDstPort() == 443) {
            if (job.getTuple().getProtocol() == 17) { 
                connTracker.classifyConnection(conn, AppType.QUIC, "");
            } else {
                connTracker.classifyConnection(conn, AppType.HTTPS, "");
            }
        }
    }
    private boolean tryExtractSni(PacketJob job, Connection conn) {
        if (job.getTuple().getDstPort() != 443 && job.getPayloadLength() < 50) return false;
        if (job.getPayloadOffset() >= job.getData().length || job.getPayloadLength() == 0) return false;
        Optional<String> sni = TlsClientHelloSniExtractor.extract(
                job.getData(), job.getPayloadOffset(), job.getPayloadLength());
        if (sni.isPresent()) {
            sniExtractions.incrementAndGet();
            AppType app = AppType.fromSni(sni.get());
            connTracker.classifyConnection(conn, app, sni.get());
            if (app != AppType.UNKNOWN && app != AppType.HTTPS) {
                classificationHits.incrementAndGet();
            }
            return true;
        }
        return false;
    }
    private boolean tryExtractHttpHost(PacketJob job, Connection conn) {
        if (job.getTuple().getDstPort() != 80) return false;
        if (job.getPayloadOffset() >= job.getData().length || job.getPayloadLength() == 0) return false;
        Optional<String> host = HttpRequestHostExtractor.extract(
                job.getData(), job.getPayloadOffset(), job.getPayloadLength());
        if (host.isPresent()) {
            AppType app = AppType.fromSni(host.get());
            connTracker.classifyConnection(conn, app, host.get());
            if (app != AppType.UNKNOWN && app != AppType.HTTP) {
                classificationHits.incrementAndGet();
            }
            return true;
        }
        return false;
    }
    private PacketAction checkRules(PacketJob job, Connection conn) {
        if (ruleManager == null) return PacketAction.FORWARD;
        Optional<BlockingRuleManager.BlockReason> reason = ruleManager.shouldBlock(
                job.getTuple().getSrcIp(),
                job.getTuple().getDstPort(),
                conn.getAppType(),
                conn.getSni());
        if (reason.isPresent()) {
            System.out.println("[FP" + fpId + "] BLOCKED packet: " +
                    reason.get().type() + " " + reason.get().detail());
            connTracker.blockConnection(conn);
            return PacketAction.DROP;
        }
        return PacketAction.FORWARD;
    }
    private void updateTcpState(Connection conn, int tcpFlags) {
        if ((tcpFlags & 0x02) != 0) { 
            if ((tcpFlags & 0x10) != 0) { 
                conn.setSynAckSeen(true);
            } else {
                conn.setSynSeen(true);
            }
        }
        if (conn.isSynSeen() && conn.isSynAckSeen() && (tcpFlags & 0x10) != 0) {
            if (conn.getState() == ConnectionState.NEW) {
                conn.setState(ConnectionState.ESTABLISHED);
            }
        }
        if ((tcpFlags & 0x01) != 0) conn.setFinSeen(true); 
        if ((tcpFlags & 0x04) != 0) conn.setState(ConnectionState.CLOSED); 
        if (conn.isFinSeen() && (tcpFlags & 0x10) != 0) {
            conn.setState(ConnectionState.CLOSED);
        }
    }
    public BoundedBlockingPacketQueue<PacketJob> getInputQueue() { return inputQueue; }
    public PerFlowConnectionTracker getConnectionTracker() { return connTracker; }
    public int getFpId() { return fpId; }
    public boolean isRunning() { return running.get(); }
    public long getPacketsProcessed() { return packetsProcessed.get(); }
    public long getPacketsForwarded() { return packetsForwarded.get(); }
    public long getPacketsDropped() { return packetsDropped.get(); }
    public long getSniExtractions() { return sniExtractions.get(); }
    public long getClassificationHits() { return classificationHits.get(); }
}