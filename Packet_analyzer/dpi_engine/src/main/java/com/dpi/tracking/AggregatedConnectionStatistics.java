package com.dpi.tracking;
import com.dpi.core.*;
import java.util.*;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
public class AggregatedConnectionStatistics {
    private final PerFlowConnectionTracker[] trackers;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    public AggregatedConnectionStatistics(int numFps) {
        trackers = new PerFlowConnectionTracker[numFps];
    }
    public void registerTracker(int fpId, PerFlowConnectionTracker tracker) {
        lock.writeLock().lock();
        try {
            if (fpId < trackers.length) {
                trackers[fpId] = tracker;
            }
        } finally {
            lock.writeLock().unlock();
        }
    }
    public List<Connection> getAllConnections() {
        lock.readLock().lock();
        try {
            List<Connection> all = new ArrayList<>();
            for (PerFlowConnectionTracker tracker : trackers) {
                if (tracker != null) {
                    all.addAll(tracker.getAllConnections());
                }
            }
            return all;
        } finally {
            lock.readLock().unlock();
        }
    }
    public String generateReport() {
        lock.readLock().lock();
        try {
            long totalActive = 0;
            long totalSeen = 0;
            Map<AppType, Long> appDistribution = new HashMap<>();
            Map<String, Long> domainCounts = new HashMap<>();
            for (PerFlowConnectionTracker tracker : trackers) {
                if (tracker == null) continue;
                totalActive += tracker.getActiveCount();
                totalSeen += tracker.getTotalSeen();
                tracker.forEach(conn -> {
                    appDistribution.merge(conn.getAppType(), 1L, Long::sum);
                    if (conn.getSni() != null && !conn.getSni().isEmpty()) {
                        domainCounts.merge(conn.getSni(), 1L, Long::sum);
                    }
                });
            }
            StringBuilder sb = new StringBuilder();
            sb.append("\n╔══════════════════════════════════════════════════════════════╗\n");
            sb.append("║               CONNECTION STATISTICS REPORT                    ║\n");
            sb.append("╠══════════════════════════════════════════════════════════════╣\n");
            sb.append(String.format("║ Active Connections:     %10d                          ║\n", totalActive));
            sb.append(String.format("║ Total Connections Seen: %10d                          ║\n", totalSeen));
            sb.append("╠══════════════════════════════════════════════════════════════╣\n");
            sb.append("║                    APPLICATION BREAKDOWN                      ║\n");
            sb.append("╠══════════════════════════════════════════════════════════════╣\n");
            long total = appDistribution.values().stream().mapToLong(Long::longValue).sum();
            List<Map.Entry<AppType, Long>> sorted = new ArrayList<>(appDistribution.entrySet());
            sorted.sort((a, b) -> Long.compare(b.getValue(), a.getValue()));
            for (Map.Entry<AppType, Long> entry : sorted) {
                double pct = total > 0 ? (100.0 * entry.getValue() / total) : 0;
                sb.append(String.format("║ %-20s%10d (%5.1f%%)           ║\n",
                        entry.getKey().displayName(), entry.getValue(), pct));
            }
            if (!domainCounts.isEmpty()) {
                sb.append("╠══════════════════════════════════════════════════════════════╣\n");
                sb.append("║                      TOP DOMAINS                             ║\n");
                sb.append("╠══════════════════════════════════════════════════════════════╣\n");
                List<Map.Entry<String, Long>> domainSorted = new ArrayList<>(domainCounts.entrySet());
                domainSorted.sort((a, b) -> Long.compare(b.getValue(), a.getValue()));
                int count = Math.min(domainSorted.size(), 20);
                for (int i = 0; i < count; i++) {
                    Map.Entry<String, Long> entry = domainSorted.get(i);
                    String domain = entry.getKey();
                    if (domain.length() > 35) domain = domain.substring(0, 32) + "...";
                    sb.append(String.format("║ %-40s%10d           ║\n", domain, entry.getValue()));
                }
            }
            sb.append("╚══════════════════════════════════════════════════════════════╝\n");
            return sb.toString();
        } finally {
            lock.readLock().unlock();
        }
    }
}