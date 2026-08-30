package com.dpi.packet;
public class PcapPacketHeader {
    public int tsSec;     
    public int tsUsec;    
    public int inclLen;   
    public int origLen;   
    public static final int SIZE_BYTES = 16;
}