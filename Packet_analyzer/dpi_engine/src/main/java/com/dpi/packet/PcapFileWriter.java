package com.dpi.packet;
import java.io.*;
public class PcapFileWriter implements Closeable {
    private DataOutputStream stream;
    public boolean open(String filename) {
        try {
            stream = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(filename)));
            return true;
        } catch (FileNotFoundException e) {
            System.err.println("Error: Cannot open output file: " + filename);
            return false;
        }
    }
    public boolean writeGlobalHeader(PcapFileHeader header) {
        if (stream == null) return false;
        try {
            writeInt32LE(header.magicNumber);
            writeInt16LE(header.versionMajor);
            writeInt16LE(header.versionMinor);
            writeInt32LE(header.thisZone);
            writeInt32LE(header.sigFigs);
            writeInt32LE(header.snapLen);
            writeInt32LE(header.network);
            stream.flush();
            return true;
        } catch (IOException e) {
            return false;
        }
    }
    public synchronized void writePacket(int tsSec, int tsUsec, byte[] data) {
        if (stream == null) return;
        try {
            writeInt32LE(tsSec);
            writeInt32LE(tsUsec);
            writeInt32LE(data.length);
            writeInt32LE(data.length);
            stream.write(data);
        } catch (IOException e) {
            System.err.println("Error writing packet");
        }
    }
    private void writeInt32LE(int value) throws IOException {
        stream.write(value & 0xFF);
        stream.write((value >> 8) & 0xFF);
        stream.write((value >> 16) & 0xFF);
        stream.write((value >> 24) & 0xFF);
    }
    private void writeInt16LE(int value) throws IOException {
        stream.write(value & 0xFF);
        stream.write((value >> 8) & 0xFF);
    }
    @Override
    public void close() {
        if (stream != null) {
            try {
                stream.flush();
                stream.close();
            } catch (IOException ignored) {}
            stream = null;
        }
    }
}