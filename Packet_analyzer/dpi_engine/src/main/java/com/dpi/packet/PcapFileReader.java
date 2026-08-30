package com.dpi.packet;
import java.io.*;
public class PcapFileReader implements Closeable {
    private DataInputStream stream;
    private final PcapFileHeader globalHeader = new PcapFileHeader();
    private boolean needsByteSwap;
    private boolean isOpen;
    public boolean open(String filename) {
        close();
        try {
            stream = new DataInputStream(new BufferedInputStream(new FileInputStream(filename)));
        } catch (FileNotFoundException e) {
            System.err.println("Error: Could not open file: " + filename);
            return false;
        }
        try {
            byte[] headerBytes = new byte[PcapFileHeader.SIZE_BYTES];
            stream.readFully(headerBytes);
            globalHeader.magicNumber = NetworkByteOrderUtils.readUint32LE(headerBytes, 0);
            if (globalHeader.magicNumber == PcapFileHeader.MAGIC_NATIVE) {
                needsByteSwap = false;
                globalHeader.versionMajor = NetworkByteOrderUtils.readUint16LE(headerBytes, 4);
                globalHeader.versionMinor = NetworkByteOrderUtils.readUint16LE(headerBytes, 6);
                globalHeader.thisZone = NetworkByteOrderUtils.readUint32LE(headerBytes, 8);
                globalHeader.sigFigs = NetworkByteOrderUtils.readUint32LE(headerBytes, 12);
                globalHeader.snapLen = NetworkByteOrderUtils.readUint32LE(headerBytes, 16);
                globalHeader.network = NetworkByteOrderUtils.readUint32LE(headerBytes, 20);
            } else {
                globalHeader.magicNumber = NetworkByteOrderUtils.readUint32BE(headerBytes, 0);
                if (globalHeader.magicNumber == PcapFileHeader.MAGIC_NATIVE) {
                    needsByteSwap = false;
                    globalHeader.versionMajor = NetworkByteOrderUtils.readUint16BE(headerBytes, 4);
                    globalHeader.versionMinor = NetworkByteOrderUtils.readUint16BE(headerBytes, 6);
                    globalHeader.thisZone = NetworkByteOrderUtils.readUint32BE(headerBytes, 8);
                    globalHeader.sigFigs = NetworkByteOrderUtils.readUint32BE(headerBytes, 12);
                    globalHeader.snapLen = NetworkByteOrderUtils.readUint32BE(headerBytes, 16);
                    globalHeader.network = NetworkByteOrderUtils.readUint32BE(headerBytes, 20);
                } else {
                    System.err.println("Error: Invalid PCAP magic number: 0x" +
                            Integer.toHexString(globalHeader.magicNumber));
                    close();
                    return false;
                }
            }
        } catch (IOException e) {
            System.err.println("Error: Could not read PCAP global header");
            close();
            return false;
        }
        isOpen = true;
        System.out.println("Opened PCAP file: " + filename);
        System.out.println("  Version: " + globalHeader.versionMajor + "." + globalHeader.versionMinor);
        System.out.println("  Snaplen: " + globalHeader.snapLen + " bytes");
        System.out.println("  Link type: " + globalHeader.network +
                (globalHeader.network == 1 ? " (Ethernet)" : ""));
        return true;
    }
    public boolean readNextPacket(RawPacket packet) {
        if (!isOpen || stream == null) return false;
        try {
            byte[] headerBytes = new byte[PcapPacketHeader.SIZE_BYTES];
            stream.readFully(headerBytes);
            packet.header.tsSec = NetworkByteOrderUtils.readUint32LE(headerBytes, 0);
            packet.header.tsUsec = NetworkByteOrderUtils.readUint32LE(headerBytes, 4);
            packet.header.inclLen = NetworkByteOrderUtils.readUint32LE(headerBytes, 8);
            packet.header.origLen = NetworkByteOrderUtils.readUint32LE(headerBytes, 12);
            if (packet.header.inclLen > globalHeader.snapLen || packet.header.inclLen > 65535) {
                packet.header.tsSec = NetworkByteOrderUtils.readUint32BE(headerBytes, 0);
                packet.header.tsUsec = NetworkByteOrderUtils.readUint32BE(headerBytes, 4);
                packet.header.inclLen = NetworkByteOrderUtils.readUint32BE(headerBytes, 8);
                packet.header.origLen = NetworkByteOrderUtils.readUint32BE(headerBytes, 12);
                if (packet.header.inclLen > globalHeader.snapLen || packet.header.inclLen > 65535) {
                    System.err.println("Error: Invalid packet length: " + packet.header.inclLen);
                    return false;
                }
            }
            packet.data = new byte[packet.header.inclLen];
            stream.readFully(packet.data);
            return true;
        } catch (EOFException e) {
            return false; 
        } catch (IOException e) {
            System.err.println("Error: Could not read packet data");
            return false;
        }
    }
    public PcapFileHeader getGlobalHeader() { return globalHeader; }
    public boolean isOpen() { return isOpen; }
    public boolean needsByteSwap() { return needsByteSwap; }
    @Override
    public void close() {
        if (stream != null) {
            try { stream.close(); } catch (IOException ignored) {}
            stream = null;
        }
        isOpen = false;
        needsByteSwap = false;
    }
}