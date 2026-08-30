package com.dpi.tracking;
import com.dpi.core.*;
import java.util.*;
import java.util.function.Consumer;
public class PerFlowConnectionTracker {
    private final int fpId;
    private final int maxConnections;
    private final HashMap<FiveTuple, Connection> connections = new HashMap<>();
    private long totalSeen;
    private long classifiedCount;
    private long blockedCount;
    public PerFlowConnectionTracker(int fpId) {
        this(fpId, 100000);
    }
    public PerFlowConnectionTracker(int fpId, int maxConnections) {
        this.fpId = fpId;
        this.maxConnections = maxConnections;
    }
    public Connection getOrCreateConnection(FiveTuple tuple) {
        Connection conn = connections.get(tuple);
        if (conn != null) return conn;
        if (connections.size() >= maxConnections) {
            evictOldest();
        }
        conn = new Connection();
        conn.setTuple(tuple);
        conn.setState(ConnectionState.NEW);
        connections.put(tuple, conn);
        totalSeen++;
        return conn;
    }
    public Connection getConnection(FiveTuple tuple) {
        Connection conn = connections.get(tuple);
        if (conn != null) return conn;
        return connections.get(tuple.reverse());
    }
    public void updateConnection(Connection conn, long packetSize, boolean isOutbound) {
        if (conn == null) return;
        conn.setLastSeenNanos(System.nanoTime());
        if (isOutbound) {
            conn.setPacketsOut(conn.getPacketsOut() + 1);
            conn.setBytesOut(conn.getBytesOut() + packetSize);
        } else {
            conn.setPacketsIn(conn.getPacketsIn() + 1);
            conn.setBytesIn(conn.getBytesIn() + packetSize);
        }
    }
    public void classifyConnection(Connection conn, AppType app, String sni) {
        if (conn == null) return;
        if (conn.getState() != ConnectionState.CLASSIFIED) {
            conn.setAppType(app);
            conn.setSni(sni);
            conn.setState(ConnectionState.CLASSIFIED);
            classifiedCount++;
        }
    }
    public void blockConnection(Connection conn) {
        if (conn == null) return;
        conn.setState(ConnectionState.BLOCKED);
        conn.setAction(PacketAction.DROP);
        blockedCount++;
    }
    public void closeConnection(FiveTuple tuple) {
        Connection conn = connections.get(tuple);
        if (conn != null) {
            conn.setState(ConnectionState.CLOSED);
        }
    }
    public int cleanupStale(long timeoutNanos) {
        long now = System.nanoTime();
        int removed = 0;
        Iterator<Map.Entry<FiveTuple, Connection>> it = connections.entrySet().iterator();
        while (it.hasNext()) {
            Connection conn = it.next().getValue();
            long age = now - conn.getLastSeenNanos();
            if (age > timeoutNanos || conn.getState() == ConnectionState.CLOSED) {
                it.remove();
                removed++;
            }
        }
        return removed;
    }
    public List<Connection> getAllConnections() {
        return new ArrayList<>(connections.values());
    }
    public int getActiveCount() {
        return connections.size();
    }
    public void forEach(Consumer<Connection> callback) {
        connections.values().forEach(callback);
    }
    public void clear() {
        connections.clear();
    }
    private void evictOldest() {
        if (connections.isEmpty()) return;
        FiveTuple oldestKey = null;
        long oldestTime = Long.MAX_VALUE;
        for (Map.Entry<FiveTuple, Connection> entry : connections.entrySet()) {
            if (entry.getValue().getLastSeenNanos() < oldestTime) {
                oldestTime = entry.getValue().getLastSeenNanos();
                oldestKey = entry.getKey();
            }
        }
        if (oldestKey != null) {
            connections.remove(oldestKey);
        }
    }
    public long getTotalSeen() { return totalSeen; }
    public long getClassifiedCount() { return classifiedCount; }
    public long getBlockedCount() { return blockedCount; }
    public int getFpId() { return fpId; }
}