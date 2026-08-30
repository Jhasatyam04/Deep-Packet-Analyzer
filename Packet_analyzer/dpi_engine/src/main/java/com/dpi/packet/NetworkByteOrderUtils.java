package com.dpi.packet;
public final class NetworkByteOrderUtils {
    private NetworkByteOrderUtils() {}
    public static int swapBytes16(int value) {
        return ((value & 0xFF00) >> 8) | ((value & 0x00FF) << 8);
    }
    public static int swapBytes32(int value) {
        return ((value & 0xFF000000) >>> 24) |
               ((value & 0x00FF0000) >>> 8) |
               ((value & 0x0000FF00) << 8) |
               ((value & 0x000000FF) << 24);
    }
    public static int readUint16BE(byte[] data, int offset) {
        return ((data[offset] & 0xFF) << 8) | (data[offset + 1] & 0xFF);
    }
    public static int readUint32BE(byte[] data, int offset) {
        return ((data[offset] & 0xFF) << 24) |
               ((data[offset + 1] & 0xFF) << 16) |
               ((data[offset + 2] & 0xFF) << 8) |
               (data[offset + 3] & 0xFF);
    }
    public static int readUint16LE(byte[] data, int offset) {
        return (data[offset] & 0xFF) | ((data[offset + 1] & 0xFF) << 8);
    }
    public static int readUint32LE(byte[] data, int offset) {
        return (data[offset] & 0xFF) |
               ((data[offset + 1] & 0xFF) << 8) |
               ((data[offset + 2] & 0xFF) << 16) |
               ((data[offset + 3] & 0xFF) << 24);
    }
    public static int readUint24BE(byte[] data, int offset) {
        return ((data[offset] & 0xFF) << 16) |
               ((data[offset + 1] & 0xFF) << 8) |
               (data[offset + 2] & 0xFF);
    }
}