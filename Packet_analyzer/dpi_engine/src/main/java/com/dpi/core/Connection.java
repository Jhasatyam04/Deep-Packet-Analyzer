package com.dpi.core;
public class Connection {
    private FiveTuple tuple;
    private ConnectionState state = ConnectionState.NEW;
    private AppType appType = AppType.UNKNOWN;
    private String sni = "";
    private long packetsIn;
    private long packetsOut;
    private long bytesIn;
    private long bytesOut;
    private long firstSeenNanos;
    private long lastSeenNanos;
    private PacketAction action = PacketAction.FORWARD;
    private boolean synSeen;
    private boolean synAckSeen;
    private boolean finSeen;
    public Connection() {
        long now = System.nanoTime();
        this.firstSeenNanos = now;
        this.lastSeenNanos = now;
    }
    public FiveTuple getTuple() { return tuple; }
    public void setTuple(FiveTuple tuple) { this.tuple = tuple; }
    public ConnectionState getState() { return state; }
    public void setState(ConnectionState state) { this.state = state; }
    public AppType getAppType() { return appType; }
    public void setAppType(AppType appType) { this.appType = appType; }
    public String getSni() { return sni; }
    public void setSni(String sni) { this.sni = sni; }
    public long getPacketsIn() { return packetsIn; }
    public void setPacketsIn(long packetsIn) { this.packetsIn = packetsIn; }
    public long getPacketsOut() { return packetsOut; }
    public void setPacketsOut(long packetsOut) { this.packetsOut = packetsOut; }
    public long getBytesIn() { return bytesIn; }
    public void setBytesIn(long bytesIn) { this.bytesIn = bytesIn; }
    public long getBytesOut() { return bytesOut; }
    public void setBytesOut(long bytesOut) { this.bytesOut = bytesOut; }
    public long getFirstSeenNanos() { return firstSeenNanos; }
    public void setFirstSeenNanos(long firstSeenNanos) { this.firstSeenNanos = firstSeenNanos; }
    public long getLastSeenNanos() { return lastSeenNanos; }
    public void setLastSeenNanos(long lastSeenNanos) { this.lastSeenNanos = lastSeenNanos; }
    public PacketAction getAction() { return action; }
    public void setAction(PacketAction action) { this.action = action; }
    public boolean isSynSeen() { return synSeen; }
    public void setSynSeen(boolean synSeen) { this.synSeen = synSeen; }
    public boolean isSynAckSeen() { return synAckSeen; }
    public void setSynAckSeen(boolean synAckSeen) { this.synAckSeen = synAckSeen; }
    public boolean isFinSeen() { return finSeen; }
    public void setFinSeen(boolean finSeen) { this.finSeen = finSeen; }
}