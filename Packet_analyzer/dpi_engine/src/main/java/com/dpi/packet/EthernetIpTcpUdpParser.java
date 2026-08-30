package com.dpi.packet;
public final class EthernetIpTcpUdpParser {
    public static final int ETHERTYPE_IPV4 = 0x0800;
    public static final int ETHERTYPE_IPV6 = 0x86DD;
    public static final int ETHERTYPE_ARP  = 0x0806;
    public static final int PROTOCOL_ICMP = 1;
    public static final int PROTOCOL_TCP  = 6;
    public static final int PROTOCOL_UDP  = 17;
    public static final int TCP_FIN = 0x01;
    public static final int TCP_SYN = 0x02;
    public static final int TCP_RST = 0x04;
    public static final int TCP_PSH = 0x08;
    public static final int TCP_ACK = 0x10;
    public static final int TCP_URG = 0x20;
    private static final int ETH_HEADER_LEN = 14;
    private static final int MIN_IP_HEADER_LEN = 20;
    private static final int MIN_TCP_HEADER_LEN = 20;
    private static final int UDP_HEADER_LEN = 8;
    private EthernetIpTcpUdpParser() {}
    public static boolean parse(RawPacket raw, ParsedPacketInfo parsed) {
        parsed.hasIp = false;
        parsed.hasTcp = false;
        parsed.hasUdp = false;
        parsed.payloadLength = 0;
        parsed.timestampSec = raw.header.tsSec;
        parsed.timestampUsec = raw.header.tsUsec;
        byte[] data = raw.data;
        int len = data.length;
        int[] offsetHolder = {0}; 
        if (!parseEthernet(data, len, parsed, offsetHolder)) {
            return false;
        }
        if (parsed.etherType == ETHERTYPE_IPV4) {
            if (!parseIPv4(data, len, parsed, offsetHolder)) {
                return false;
            }
            if (parsed.protocol == PROTOCOL_TCP) {
                if (!parseTCP(data, len, parsed, offsetHolder)) {
                    return false;
                }
            } else if (parsed.protocol == PROTOCOL_UDP) {
                if (!parseUDP(data, len, parsed, offsetHolder)) {
                    return false;
                }
            }
        }
        int offset = offsetHolder[0];
        if (offset < len) {
            parsed.payloadLength = len - offset;
        } else {
            parsed.payloadLength = 0;
        }
        return true;
    }
    private static boolean parseEthernet(byte[] data, int len, ParsedPacketInfo parsed, int[] offset) {
        if (len < ETH_HEADER_LEN) return false;
        parsed.destMac = macToString(data, 0);
        parsed.srcMac = macToString(data, 6);
        parsed.etherType = NetworkByteOrderUtils.readUint16BE(data, 12);
        offset[0] = ETH_HEADER_LEN;
        return true;
    }
    private static boolean parseIPv4(byte[] data, int len, ParsedPacketInfo parsed, int[] offset) {
        int off = offset[0];
        if (len < off + MIN_IP_HEADER_LEN) return false;
        int versionIhl = data[off] & 0xFF;
        parsed.ipVersion = (versionIhl >> 4) & 0x0F;
        int ihl = versionIhl & 0x0F;
        if (parsed.ipVersion != 4) return false;
        int ipHeaderLen = ihl * 4;
        if (ipHeaderLen < MIN_IP_HEADER_LEN || len < off + ipHeaderLen) return false;
        parsed.ttl = data[off + 8] & 0xFF;
        parsed.protocol = data[off + 9] & 0xFF;
        int srcIp = ((data[off + 12] & 0xFF)) |
                    ((data[off + 13] & 0xFF) << 8) |
                    ((data[off + 14] & 0xFF) << 16) |
                    ((data[off + 15] & 0xFF) << 24);
        parsed.srcIp = ipToString(srcIp);
        int destIp = ((data[off + 16] & 0xFF)) |
                     ((data[off + 17] & 0xFF) << 8) |
                     ((data[off + 18] & 0xFF) << 16) |
                     ((data[off + 19] & 0xFF) << 24);
        parsed.destIp = ipToString(destIp);
        parsed.hasIp = true;
        offset[0] = off + ipHeaderLen;
        return true;
    }
    private static boolean parseTCP(byte[] data, int len, ParsedPacketInfo parsed, int[] offset) {
        int off = offset[0];
        if (len < off + MIN_TCP_HEADER_LEN) return false;
        parsed.srcPort = NetworkByteOrderUtils.readUint16BE(data, off);
        parsed.destPort = NetworkByteOrderUtils.readUint16BE(data, off + 2);
        parsed.seqNumber = Integer.toUnsignedLong(NetworkByteOrderUtils.readUint32BE(data, off + 4));
        parsed.ackNumber = Integer.toUnsignedLong(NetworkByteOrderUtils.readUint32BE(data, off + 8));
        int dataOffset = (data[off + 12] >> 4) & 0x0F;
        int tcpHeaderLen = dataOffset * 4;
        parsed.tcpFlags = data[off + 13] & 0xFF;
        if (tcpHeaderLen < MIN_TCP_HEADER_LEN || len < off + tcpHeaderLen) return false;
        parsed.hasTcp = true;
        offset[0] = off + tcpHeaderLen;
        return true;
    }
    private static boolean parseUDP(byte[] data, int len, ParsedPacketInfo parsed, int[] offset) {
        int off = offset[0];
        if (len < off + UDP_HEADER_LEN) return false;
        parsed.srcPort = NetworkByteOrderUtils.readUint16BE(data, off);
        parsed.destPort = NetworkByteOrderUtils.readUint16BE(data, off + 2);
        parsed.hasUdp = true;
        offset[0] = off + UDP_HEADER_LEN;
        return true;
    }
    public static String macToString(byte[] data, int offset) {
        StringBuilder sb = new StringBuilder(17);
        for (int i = 0; i < 6; i++) {
            if (i > 0) sb.append(':');
            sb.append(String.format("%02x", data[offset + i] & 0xFF));
        }
        return sb.toString();
    }
    public static String ipToString(int ip) {
        return (ip & 0xFF) + "." +
               ((ip >> 8) & 0xFF) + "." +
               ((ip >> 16) & 0xFF) + "." +
               ((ip >> 24) & 0xFF);
    }
    public static String protocolToString(int protocol) {
        return switch (protocol) {
            case PROTOCOL_ICMP -> "ICMP";
            case PROTOCOL_TCP -> "TCP";
            case PROTOCOL_UDP -> "UDP";
            default -> "Unknown(" + protocol + ")";
        };
    }
    public static String tcpFlagsToString(int flags) {
        StringBuilder sb = new StringBuilder();
        if ((flags & TCP_SYN) != 0) sb.append("SYN ");
        if ((flags & TCP_ACK) != 0) sb.append("ACK ");
        if ((flags & TCP_FIN) != 0) sb.append("FIN ");
        if ((flags & TCP_RST) != 0) sb.append("RST ");
        if ((flags & TCP_PSH) != 0) sb.append("PSH ");
        if ((flags & TCP_URG) != 0) sb.append("URG ");
        if (sb.length() > 0) sb.setLength(sb.length() - 1); 
        return sb.length() == 0 ? "none" : sb.toString();
    }
}