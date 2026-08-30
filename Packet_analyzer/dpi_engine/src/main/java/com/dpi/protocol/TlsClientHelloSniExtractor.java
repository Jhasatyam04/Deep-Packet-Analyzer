package com.dpi.protocol;
import com.dpi.packet.NetworkByteOrderUtils;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
public final class TlsClientHelloSniExtractor {
    private static final int CONTENT_TYPE_HANDSHAKE = 0x16;
    private static final int HANDSHAKE_CLIENT_HELLO = 0x01;
    private static final int EXTENSION_SNI = 0x0000;
    private static final int SNI_TYPE_HOSTNAME = 0x00;
    private TlsClientHelloSniExtractor() {}
    public static boolean isTlsClientHello(byte[] payload, int offset, int length) {
        if (length < 9) return false;
        if ((payload[offset] & 0xFF) != CONTENT_TYPE_HANDSHAKE) return false;
        int version = NetworkByteOrderUtils.readUint16BE(payload, offset + 1);
        if (version < 0x0300 || version > 0x0304) return false;
        int recordLength = NetworkByteOrderUtils.readUint16BE(payload, offset + 3);
        if (recordLength > length - 5) return false;
        if ((payload[offset + 5] & 0xFF) != HANDSHAKE_CLIENT_HELLO) return false;
        return true;
    }
    public static Optional<String> extract(byte[] payload, int payloadOffset, int payloadLength) {
        if (!isTlsClientHello(payload, payloadOffset, payloadLength)) {
            return Optional.empty();
        }
        int off = payloadOffset;
        int end = payloadOffset + payloadLength;
        off += 5;
        if (off + 4 > end) return Optional.empty();
        off += 4;
        off += 2;
        off += 32;
        if (off >= end) return Optional.empty();
        int sessionIdLength = payload[off] & 0xFF;
        off += 1 + sessionIdLength;
        if (off + 2 > end) return Optional.empty();
        int cipherSuitesLength = NetworkByteOrderUtils.readUint16BE(payload, off);
        off += 2 + cipherSuitesLength;
        if (off >= end) return Optional.empty();
        int compressionMethodsLength = payload[off] & 0xFF;
        off += 1 + compressionMethodsLength;
        if (off + 2 > end) return Optional.empty();
        int extensionsLength = NetworkByteOrderUtils.readUint16BE(payload, off);
        off += 2;
        int extensionsEnd = off + extensionsLength;
        if (extensionsEnd > end) {
            extensionsEnd = end; 
        }
        while (off + 4 <= extensionsEnd) {
            int extensionType = NetworkByteOrderUtils.readUint16BE(payload, off);
            int extensionLength = NetworkByteOrderUtils.readUint16BE(payload, off + 2);
            off += 4;
            if (off + extensionLength > extensionsEnd) break;
            if (extensionType == EXTENSION_SNI) {
                if (extensionLength < 5) break;
                int sniListLength = NetworkByteOrderUtils.readUint16BE(payload, off);
                if (sniListLength < 3) break;
                int sniType = payload[off + 2] & 0xFF;
                int sniLength = NetworkByteOrderUtils.readUint16BE(payload, off + 3);
                if (sniType != SNI_TYPE_HOSTNAME) break;
                if (sniLength > extensionLength - 5) break;
                String sni = new String(payload, off + 5, sniLength, StandardCharsets.US_ASCII);
                return Optional.of(sni);
            }
            off += extensionLength;
        }
        return Optional.empty();
    }
}