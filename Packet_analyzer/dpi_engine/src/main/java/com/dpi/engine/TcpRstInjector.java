package com.dpi.engine;
import org.pcap4j.core.NotOpenException;
import org.pcap4j.core.PcapHandle;
import org.pcap4j.core.PcapNativeException;
import org.pcap4j.packet.EthernetPacket;
import org.pcap4j.packet.IpV4Packet;
import org.pcap4j.packet.IpV4Rfc791Tos;
import org.pcap4j.packet.Packet;
import org.pcap4j.packet.TcpPacket;
import org.pcap4j.packet.UnknownPacket;
import org.pcap4j.packet.namednumber.DataLinkType;
import org.pcap4j.packet.namednumber.EtherType;
import org.pcap4j.packet.namednumber.IpNumber;
import org.pcap4j.packet.namednumber.IpVersion;
import org.pcap4j.packet.namednumber.TcpPort;
import org.pcap4j.util.MacAddress;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
public class TcpRstInjector {
    private final PcapHandle sendHandle;
    public TcpRstInjector(PcapHandle sendHandle) {
        this.sendHandle = sendHandle;
    }
    public void injectRst(Packet originalPacket) {
        if (sendHandle == null || !sendHandle.isOpen()) return;
        EthernetPacket eth = originalPacket.get(EthernetPacket.class);
        if (eth == null) return;
        IpV4Packet ipv4 = originalPacket.get(IpV4Packet.class);
        if (ipv4 == null) return;
        TcpPacket tcp = originalPacket.get(TcpPacket.class);
        if (tcp == null) return;
        try {
            Packet rstToClient = forgeRst(
                    eth.getHeader().getDstAddr(), eth.getHeader().getSrcAddr(), 
                    ipv4.getHeader().getDstAddr(), ipv4.getHeader().getSrcAddr(), 
                    tcp.getHeader().getDstPort(), tcp.getHeader().getSrcPort(), 
                    tcp.getHeader().getAcknowledgmentNumberAsLong(), 
                    0 
            );
            sendHandle.sendPacket(rstToClient);
            Packet rstToServer = forgeRst(
                    eth.getHeader().getSrcAddr(), eth.getHeader().getDstAddr(), 
                    ipv4.getHeader().getSrcAddr(), ipv4.getHeader().getDstAddr(), 
                    tcp.getHeader().getSrcPort(), tcp.getHeader().getDstPort(), 
                    tcp.getHeader().getSequenceNumberAsLong() + Math.max(1, tcp.getPayload() != null ? tcp.getPayload().length() : 0), 
                    0 
            );
            sendHandle.sendPacket(rstToServer);
        } catch (PcapNativeException | NotOpenException e) {
            System.err.println("[RSTInjector] Failed to inject RST: " + e.getMessage());
        }
    }
    private Packet forgeRst(MacAddress srcMac, MacAddress dstMac,
                            Inet4Address srcIp, Inet4Address dstIp,
                            TcpPort srcPort, TcpPort dstPort,
                            long seq, long ack) {
        UnknownPacket.Builder payloadBuilder = new UnknownPacket.Builder()
                .rawData(new byte[0]);
        TcpPacket.Builder tcpBuilder = new TcpPacket.Builder()
                .srcPort(srcPort)
                .dstPort(dstPort)
                .srcAddr(srcIp)
                .dstAddr(dstIp)
                .sequenceNumber((int) seq)
                .acknowledgmentNumber((int) ack)
                .dataOffset((byte) 5)
                .rst(true)
                .window((short) 0)
                .payloadBuilder(payloadBuilder)
                .correctChecksumAtBuild(true)
                .correctLengthAtBuild(true);
        IpV4Packet.Builder ipv4Builder = new IpV4Packet.Builder()
                .version(IpVersion.IPV4)
                .tos(IpV4Rfc791Tos.newInstance((byte) 0))
                .ttl((byte) 64)
                .protocol(IpNumber.TCP)
                .srcAddr(srcIp)
                .dstAddr(dstIp)
                .payloadBuilder(tcpBuilder)
                .correctChecksumAtBuild(true)
                .correctLengthAtBuild(true)
                .paddingAtBuild(true);
        EthernetPacket.Builder ethBuilder = new EthernetPacket.Builder()
                .srcAddr(srcMac)
                .dstAddr(dstMac)
                .type(EtherType.IPV4)
                .payloadBuilder(ipv4Builder)
                .paddingAtBuild(true);
        return ethBuilder.build();
    }
}