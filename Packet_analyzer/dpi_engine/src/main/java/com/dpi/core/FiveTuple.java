package com.dpi.core;
import java.util.Objects;
public final class FiveTuple {
    private int srcIp;
    private int dstIp;
    private int srcPort;  
    private int dstPort;  
    private int protocol; 
    public FiveTuple() {}
    public FiveTuple(int srcIp, int dstIp, int srcPort, int dstPort, int protocol) {
        this.srcIp = srcIp;
        this.dstIp = dstIp;
        this.srcPort = srcPort;
        this.dstPort = dstPort;
        this.protocol = protocol;
    }
    public FiveTuple reverse() {
        return new FiveTuple(dstIp, srcIp, dstPort, srcPort, protocol);
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FiveTuple t)) return false;
        return srcIp == t.srcIp && dstIp == t.dstIp &&
               srcPort == t.srcPort && dstPort == t.dstPort &&
               protocol == t.protocol;
    }
    @Override
    public int hashCode() {
        long h = 0;
        h ^= Integer.hashCode(srcIp)  + 0x9e3779b9L + (h << 6) + (h >> 2);
        h ^= Integer.hashCode(dstIp)  + 0x9e3779b9L + (h << 6) + (h >> 2);
        h ^= Integer.hashCode(srcPort) + 0x9e3779b9L + (h << 6) + (h >> 2);
        h ^= Integer.hashCode(dstPort) + 0x9e3779b9L + (h << 6) + (h >> 2);
        h ^= Integer.hashCode(protocol) + 0x9e3779b9L + (h << 6) + (h >> 2);
        return (int) h;
    }
    @Override
    public String toString() {
        return formatIp(srcIp) + ":" + srcPort +
               " -> " +
               formatIp(dstIp) + ":" + dstPort +
               " (" + (protocol == 6 ? "TCP" : protocol == 17 ? "UDP" : "?") + ")";
    }
    public static String formatIp(int ip) {
        return (ip & 0xFF) + "." +
               ((ip >> 8) & 0xFF) + "." +
               ((ip >> 16) & 0xFF) + "." +
               ((ip >> 24) & 0xFF);
    }
    public static int parseIp(String ip) {
        int result = 0;
        int octet = 0;
        int shift = 0;
        for (int i = 0; i < ip.length(); i++) {
            char c = ip.charAt(i);
            if (c == '.') {
                result |= (octet << shift);
                shift += 8;
                octet = 0;
            } else if (c >= '0' && c <= '9') {
                octet = octet * 10 + (c - '0');
            }
        }
        result |= (octet << shift);
        return result;
    }
    public int getSrcIp() { return srcIp; }
    public void setSrcIp(int srcIp) { this.srcIp = srcIp; }
    public int getDstIp() { return dstIp; }
    public void setDstIp(int dstIp) { this.dstIp = dstIp; }
    public int getSrcPort() { return srcPort; }
    public void setSrcPort(int srcPort) { this.srcPort = srcPort; }
    public int getDstPort() { return dstPort; }
    public void setDstPort(int dstPort) { this.dstPort = dstPort; }
    public int getProtocol() { return protocol; }
    public void setProtocol(int protocol) { this.protocol = protocol; }
}