package com.dpi.packet;
public class RawPacket {
    public final PcapPacketHeader header = new PcapPacketHeader();
    public byte[] data;
}