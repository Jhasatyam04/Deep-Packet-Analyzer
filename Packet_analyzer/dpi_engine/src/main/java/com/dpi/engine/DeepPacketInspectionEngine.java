package com.dpi.engine;
import com.dpi.core.*;
import com.dpi.packet.*;
import com.dpi.rules.BlockingRuleManager;
import com.dpi.threading.BoundedBlockingPacketQueue;
import com.dpi.tracking.AggregatedConnectionStatistics;
import java.util.concurrent.atomic.AtomicBoolean;
public class DeepPacketInspectionEngine {
    public static class Config {
        public int numLoadBalancers = 2;
        public int fpsPerLb = 2;
        public int queueSize = 10000;
        public String rulesFile = "";
        public boolean verbose = false;
    }
    private final Config config;
    private final DpiStatistics stats = new DpiStatistics();
    private BlockingRuleManager ruleManager;
    private FastPathProcessorPool fpPool;
    private LoadBalancerPool lbPool;
    private AggregatedConnectionStatistics globalConnTable;
    private final BoundedBlockingPacketQueue<PacketJob> outputQueue = new BoundedBlockingPacketQueue<>(10000);
    private Thread outputThread;
    private PcapFileWriter outputWriter;
    private final Object outputLock = new Object();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread readerThread;
    private Thread statsThread;
    
    public static class TimeSeriesPoint {
        public String ts;
        public long packets;
        public long bytes;
        public long forwarded;
        public long dropped;
    }
    private final java.util.LinkedList<TimeSeriesPoint> timeseries = new java.util.LinkedList<>();

    public DeepPacketInspectionEngine(Config config, BlockingRuleManager ruleManager) {
        this.config = config;
        this.ruleManager = ruleManager;
        int totalFps = config.numLoadBalancers * config.fpsPerLb;
        System.out.println();
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.println("║              DPI ENGINE v2.0 (Multi-threaded)                 ║");
        System.out.println("╠══════════════════════════════════════════════════════════════╣");
        System.out.printf("║ Load Balancers: %2d    FPs per LB: %2d    Total FPs: %2d     ║%n",
                config.numLoadBalancers, config.fpsPerLb, totalFps);
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
        System.out.println();
    }
    public boolean initialize() {
        if (!config.rulesFile.isEmpty()) {
            ruleManager.loadRules(config.rulesFile);
        }
        int totalFps = config.numLoadBalancers * config.fpsPerLb;
        fpPool = new FastPathProcessorPool(totalFps, ruleManager, this::defaultHandleOutput);
        lbPool = new LoadBalancerPool(config.numLoadBalancers, config.fpsPerLb, fpPool.getAllQueues());
        globalConnTable = new AggregatedConnectionStatistics(totalFps);
        for (int i = 0; i < totalFps; i++) {
            globalConnTable.registerTracker(i, fpPool.getFp(i).getConnectionTracker());
        }
        System.out.println("[DPIEngine] Initialized successfully");
        return true;
    }
    public boolean processFile(String inputFile, String outputFile) {
        System.out.println("\n[DPIEngine] Processing: " + inputFile);
        System.out.println("[DPIEngine] Output to:  " + outputFile + "\n");
        if (ruleManager == null) {
            if (!initialize()) return false;
        }
        outputWriter = new PcapFileWriter();
        if (!outputWriter.open(outputFile)) {
            System.err.println("[DPIEngine] Error: Cannot open output file");
            return false;
        }
        start();
        readerThread = new Thread(() -> readerThreadFunc(inputFile), "Reader");
        readerThread.start();
        waitForCompletion();
        try { Thread.sleep(200); } catch (InterruptedException ignored) {}
        stop();
        if (outputWriter != null) {
            outputWriter.close();
        }
        System.out.print(generateReport());
        System.out.print(fpPool.generateClassificationReport());
        return true;
    }
    public void startLive() {
        if (ruleManager == null) {
            initialize();
        }
        start();
    }
    private void start() {
        if (running.get()) return;
        running.set(true);
        outputThread = new Thread(this::outputThreadFunc, "OutputWriter");
        outputThread.start();
        statsThread = new Thread(this::statsThreadFunc, "StatsLogger");
        statsThread.start();
        fpPool.startAll();
        lbPool.startAll();
        System.out.println("[DPIEngine] All threads started");
    }
    private void stop() {
        if (!running.get()) return;
        running.set(false);
        if (lbPool != null) lbPool.stopAll();
        if (fpPool != null) fpPool.stopAll();
        outputQueue.shutdown();
        if (outputThread != null) {
            try { outputThread.join(); } catch (InterruptedException ignored) {}
        }
        if (statsThread != null) {
            try { statsThread.join(); } catch (InterruptedException ignored) {}
        }
        System.out.println("[DPIEngine] All threads stopped");
    }
    private void waitForCompletion() {
        if (readerThread != null) {
            try { readerThread.join(); } catch (InterruptedException ignored) {}
        }
        try { Thread.sleep(500); } catch (InterruptedException ignored) {}
    }
    private final java.util.concurrent.atomic.AtomicInteger packetCounter = new java.util.concurrent.atomic.AtomicInteger(0);
    public void processLivePacket(RawPacket raw) {
        if (!running.get()) return;
        ParsedPacketInfo parsed = new ParsedPacketInfo();
        if (!EthernetIpTcpUdpParser.parse(raw, parsed)) return;
        if (!parsed.hasIp || (!parsed.hasTcp && !parsed.hasUdp)) return;
        PacketJob job = createPacketJob(raw, parsed, packetCounter.getAndIncrement());
        stats.totalPackets.incrementAndGet();
        stats.totalBytes.addAndGet(raw.data.length);
        if (parsed.hasTcp) stats.tcpPackets.incrementAndGet();
        else if (parsed.hasUdp) stats.udpPackets.incrementAndGet();
        HashBasedLoadBalancer lb = lbPool.getLbForPacket(job.getTuple());
        lb.getInputQueue().push(job);
    }
    private void readerThreadFunc(String inputFile) {
        PcapFileReader reader = new PcapFileReader();
        if (!reader.open(inputFile)) {
            System.err.println("[Reader] Error: Cannot open input file");
            return;
        }
        synchronized (outputLock) {
            if (outputWriter != null) {
                outputWriter.writeGlobalHeader(reader.getGlobalHeader());
            }
        }
        RawPacket raw = new RawPacket();
        System.out.println("[Reader] Processing packets...");
        while (reader.readNextPacket(raw)) {
            processLivePacket(raw);
        }
        System.out.println("[Reader] Done reading " + packetCounter.get() + " packets");
        reader.close();
    }
    private PacketJob createPacketJob(RawPacket raw, ParsedPacketInfo parsed, int packetId) {
        PacketJob job = new PacketJob();
        job.setPacketId(packetId);
        job.setTsSec(raw.header.tsSec);
        job.setTsUsec(raw.header.tsUsec);
        job.setTcpFlags(parsed.tcpFlags);
        job.setData(raw.data.clone());
        FiveTuple tuple = new FiveTuple();
        tuple.setSrcIp(FiveTuple.parseIp(parsed.srcIp));
        tuple.setDstIp(FiveTuple.parseIp(parsed.destIp));
        tuple.setSrcPort(parsed.srcPort);
        tuple.setDstPort(parsed.destPort);
        tuple.setProtocol(parsed.protocol);
        job.setTuple(tuple);
        job.setEthOffset(0);
        job.setIpOffset(14); 
        byte[] data = job.getData();
        if (data.length > 14) {
            int ipIhl = data[14] & 0x0F;
            int ipHeaderLen = ipIhl * 4;
            int transportOffset = 14 + ipHeaderLen;
            job.setTransportOffset(transportOffset);
            if (parsed.hasTcp && data.length > transportOffset + 12) {
                int tcpDataOffset = (data[transportOffset + 12] >> 4) & 0x0F;
                int tcpHeaderLen = tcpDataOffset * 4;
                job.setPayloadOffset(transportOffset + tcpHeaderLen);
            } else if (parsed.hasUdp) {
                job.setPayloadOffset(transportOffset + 8);
            }
            if (job.getPayloadOffset() < data.length) {
                job.setPayloadLength(data.length - job.getPayloadOffset());
            }
        }
        return job;
    }
    private void outputThreadFunc() {
        while (running.get() || !outputQueue.isEmpty()) {
            var jobOpt = outputQueue.popWithTimeout(100);
            if (jobOpt.isPresent()) {
                PacketJob job = jobOpt.get();
                synchronized (outputLock) {
                    if (outputWriter != null) {
                        outputWriter.writePacket(job.getTsSec(), job.getTsUsec(), job.getData());
                    }
                }
            }
        }
    }
    private void statsThreadFunc() {
        while (running.get()) {
            try {
                Thread.sleep(2000); 
                long total = stats.totalPackets.get();
                long forwarded = stats.forwardedPackets.get();
                long dropped = stats.droppedPackets.get();
                double dropRate = total > 0 ? (100.0 * dropped / total) : 0.0;
                System.out.printf("[Live Stats] Processed: %d | Forwarded: %d | Dropped: %d | Drop Rate: %.2f%%%n", 
                        total, forwarded, dropped, dropRate);
                
                TimeSeriesPoint point = new TimeSeriesPoint();
                point.ts = java.time.Instant.now().toString();
                point.packets = total;
                point.bytes = stats.totalBytes.get();
                point.forwarded = forwarded;
                point.dropped = dropped;
                synchronized (timeseries) {
                    timeseries.add(point);
                    if (timeseries.size() > 32) {
                        timeseries.removeFirst();
                    }
                }
            } catch (InterruptedException e) {
                break;
            }
        }
    }
    private java.util.function.BiConsumer<PacketJob, PacketAction> customOutputHandler = null;
    public void setCustomOutputHandler(java.util.function.BiConsumer<PacketJob, PacketAction> handler) {
        this.customOutputHandler = handler;
    }
    private void defaultHandleOutput(PacketJob job, PacketAction action) {
        if (customOutputHandler != null) {
            customOutputHandler.accept(job, action);
            return;
        }
        if (action == PacketAction.DROP) {
            stats.droppedPackets.incrementAndGet();
            return;
        }
        stats.forwardedPackets.incrementAndGet();
        outputQueue.push(job);
    }
    public void blockIp(String ip) { if (ruleManager != null) ruleManager.blockIp(ip); }
    public void unblockIp(String ip) { if (ruleManager != null) ruleManager.unblockIp(ip); }
    public void blockApp(String appName) {
        AppType app = AppType.fromDisplayName(appName);
        if (app != null && ruleManager != null) ruleManager.blockApp(app);
        else System.err.println("[DPIEngine] Unknown app: " + appName);
    }
    public void unblockApp(String appName) {
        AppType app = AppType.fromDisplayName(appName);
        if (app != null && ruleManager != null) ruleManager.unblockApp(app);
    }
    public void blockDomain(String domain) { if (ruleManager != null) ruleManager.blockDomain(domain); }
    public void unblockDomain(String domain) { if (ruleManager != null) ruleManager.unblockDomain(domain); }
    public boolean loadRules(String filename) {
        return ruleManager != null && ruleManager.loadRules(filename);
    }
    public boolean saveRules(String filename) {
        return ruleManager != null && ruleManager.saveRules(filename);
    }
    public String generateReport() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n╔══════════════════════════════════════════════════════════════╗\n");
        sb.append("║                    DPI ENGINE STATISTICS                      ║\n");
        sb.append("╠══════════════════════════════════════════════════════════════╣\n");
        sb.append("║ PACKET STATISTICS                                             ║\n");
        sb.append(String.format("║   Total Packets:      %12d                        ║\n", stats.totalPackets.get()));
        sb.append(String.format("║   Total Bytes:        %12d                        ║\n", stats.totalBytes.get()));
        sb.append(String.format("║   TCP Packets:        %12d                        ║\n", stats.tcpPackets.get()));
        sb.append(String.format("║   UDP Packets:        %12d                        ║\n", stats.udpPackets.get()));
        sb.append("╠══════════════════════════════════════════════════════════════╣\n");
        sb.append("║ FILTERING STATISTICS                                          ║\n");
        sb.append(String.format("║   Forwarded:          %12d                        ║\n", stats.forwardedPackets.get()));
        sb.append(String.format("║   Dropped/Blocked:    %12d                        ║\n", stats.droppedPackets.get()));
        if (stats.totalPackets.get() > 0) {
            double dropRate = 100.0 * stats.droppedPackets.get() / stats.totalPackets.get();
            sb.append(String.format("║   Drop Rate:          %11.2f%%                        ║\n", dropRate));
        }
        if (lbPool != null) {
            sb.append("╠══════════════════════════════════════════════════════════════╣\n");
            sb.append("║ LOAD BALANCER STATISTICS                                      ║\n");
            sb.append(String.format("║   LB Received:        %12d                        ║\n", lbPool.getTotalReceived()));
            sb.append(String.format("║   LB Dispatched:      %12d                        ║\n", lbPool.getTotalDispatched()));
        }
        if (fpPool != null) {
            sb.append("╠══════════════════════════════════════════════════════════════╣\n");
            sb.append("║ FAST PATH STATISTICS                                          ║\n");
            sb.append(String.format("║   FP Processed:       %12d                        ║\n", fpPool.getTotalProcessed()));
            sb.append(String.format("║   FP Forwarded:       %12d                        ║\n", fpPool.getTotalForwarded()));
            sb.append(String.format("║   FP Dropped:         %12d                        ║\n", fpPool.getTotalDropped()));
            sb.append(String.format("║   Active Connections: %12d                        ║\n", fpPool.getTotalConnections()));
        }
        if (ruleManager != null) {
            sb.append("╠══════════════════════════════════════════════════════════════╣\n");
            sb.append("║ BLOCKING RULES                                                ║\n");
            sb.append(String.format("║   Blocked IPs:        %12d                        ║\n", ruleManager.getBlockedIpCount()));
            sb.append(String.format("║   Blocked Apps:       %12d                        ║\n", ruleManager.getBlockedAppCount()));
            sb.append(String.format("║   Blocked Domains:    %12d                        ║\n", ruleManager.getBlockedDomainCount()));
            sb.append(String.format("║   Blocked Ports:      %12d                        ║\n", ruleManager.getBlockedPortCount()));
        }
        sb.append("╚══════════════════════════════════════════════════════════════╝\n");
        return sb.toString();
    }
    public DpiStatistics getStats() { return stats; }
    public Config getConfig() { return config; }
    public AggregatedConnectionStatistics getGlobalConnTable() { return globalConnTable; }
    public FastPathProcessorPool getFpPool() { return fpPool; }
    public LoadBalancerPool getLbPool() { return lbPool; }
    public java.util.List<TimeSeriesPoint> getTimeseries() {
        synchronized (timeseries) {
            return new java.util.ArrayList<>(timeseries);
        }
    }
}