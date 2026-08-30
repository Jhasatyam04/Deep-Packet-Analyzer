package com.dpi.engine;
import com.dpi.core.*;
import com.dpi.rules.BlockingRuleManager;
import com.dpi.threading.BoundedBlockingPacketQueue;
import java.util.*;
import java.util.function.BiConsumer;
public class FastPathProcessorPool {
    private final List<FastPathPacketProcessor> fps = new ArrayList<>();
    public FastPathProcessorPool(int numFps, BlockingRuleManager ruleManager,
                                 BiConsumer<PacketJob, PacketAction> outputCallback) {
        for (int i = 0; i < numFps; i++) {
            fps.add(new FastPathPacketProcessor(i, ruleManager, outputCallback));
        }
        System.out.println("[FPManager] Created " + numFps + " fast path processors");
    }
    public void startAll() {
        for (FastPathPacketProcessor fp : fps) fp.start();
    }
    public void stopAll() {
        for (FastPathPacketProcessor fp : fps) fp.stop();
    }
    public FastPathPacketProcessor getFp(int id) { return fps.get(id); }
    public BoundedBlockingPacketQueue<PacketJob> getFpQueue(int id) {
        return fps.get(id).getInputQueue();
    }
    public List<BoundedBlockingPacketQueue<PacketJob>> getAllQueues() {
        List<BoundedBlockingPacketQueue<PacketJob>> queues = new ArrayList<>();
        for (FastPathPacketProcessor fp : fps) queues.add(fp.getInputQueue());
        return queues;
    }
    public int getNumFps() { return fps.size(); }
    public long getTotalProcessed() {
        long total = 0;
        for (FastPathPacketProcessor fp : fps) total += fp.getPacketsProcessed();
        return total;
    }
    public long getTotalForwarded() {
        long total = 0;
        for (FastPathPacketProcessor fp : fps) total += fp.getPacketsForwarded();
        return total;
    }
    public long getTotalDropped() {
        long total = 0;
        for (FastPathPacketProcessor fp : fps) total += fp.getPacketsDropped();
        return total;
    }
    public long getTotalConnections() {
        long total = 0;
        for (FastPathPacketProcessor fp : fps) total += fp.getConnectionTracker().getActiveCount();
        return total;
    }
    public String generateClassificationReport() {
        Map<AppType, Long> appCounts = new HashMap<>();
        Map<String, Long> domainCounts = new HashMap<>();
        long totalClassified = 0;
        long totalUnknown = 0;
        for (FastPathPacketProcessor fp : fps) {
            fp.getConnectionTracker().forEach(conn -> {
                appCounts.merge(conn.getAppType(), 1L, Long::sum);
                if (conn.getSni() != null && !conn.getSni().isEmpty()) {
                    domainCounts.merge(conn.getSni(), 1L, Long::sum);
                }
            });
        }
        for (Map.Entry<AppType, Long> e : appCounts.entrySet()) {
            if (e.getKey() == AppType.UNKNOWN) totalUnknown += e.getValue();
            else totalClassified += e.getValue();
        }
        long total = totalClassified + totalUnknown;
        double classifiedPct = total > 0 ? (100.0 * totalClassified / total) : 0;
        double unknownPct = total > 0 ? (100.0 * totalUnknown / total) : 0;
        StringBuilder sb = new StringBuilder();
        sb.append("\n╔══════════════════════════════════════════════════════════════╗\n");
        sb.append("║                 APPLICATION CLASSIFICATION REPORT             ║\n");
        sb.append("╠══════════════════════════════════════════════════════════════╣\n");
        sb.append(String.format("║ Total Connections:    %10d                           ║\n", total));
        sb.append(String.format("║ Classified:           %10d (%4.1f%%)                  ║\n", totalClassified, classifiedPct));
        sb.append(String.format("║ Unidentified:         %10d (%4.1f%%)                  ║\n", totalUnknown, unknownPct));
        sb.append("╠══════════════════════════════════════════════════════════════╣\n");
        sb.append("║                    APPLICATION DISTRIBUTION                   ║\n");
        sb.append("╠══════════════════════════════════════════════════════════════╣\n");
        List<Map.Entry<AppType, Long>> sorted = new ArrayList<>(appCounts.entrySet());
        sorted.sort((a, b) -> Long.compare(b.getValue(), a.getValue()));
        for (Map.Entry<AppType, Long> entry : sorted) {
            double pct = total > 0 ? (100.0 * entry.getValue() / total) : 0;
            int barLen = (int) (pct / 5);
            String bar = "#".repeat(barLen);
            sb.append(String.format("║ %-15s%8d %5.1f%% %-20s   ║\n",
                    entry.getKey().displayName(), entry.getValue(), pct, bar));
        }
        sb.append("╚══════════════════════════════════════════════════════════════╝\n");
        return sb.toString();
    }
}