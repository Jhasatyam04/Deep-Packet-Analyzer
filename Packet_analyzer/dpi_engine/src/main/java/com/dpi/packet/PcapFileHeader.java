package com.dpi.packet;
public class PcapFileHeader {
    public int magicNumber;      
    public int versionMajor;     
    public int versionMinor;     
    public int thisZone;         
    public int sigFigs;          
    public int snapLen;          
    public int network;          
    public static final int SIZE_BYTES = 24;
    public static final int MAGIC_NATIVE = 0xa1b2c3d4;
    public static final int MAGIC_SWAPPED = 0xd4c3b2a1;
}