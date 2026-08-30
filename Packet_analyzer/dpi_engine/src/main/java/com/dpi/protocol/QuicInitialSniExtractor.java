package com.dpi.protocol;
import java.util.Optional;
public final class QuicInitialSniExtractor {
    private QuicInitialSniExtractor() {}
    public static boolean isQuicInitial(byte[] payload, int offset, int length) {
        if (length < 5) return false;
        int firstByte = payload[offset] & 0xFF;
        return (firstByte & 0x80) != 0;
    }
    public static Optional<String> extract(byte[] payload, int payloadOffset, int payloadLength) {
        if (!isQuicInitial(payload, payloadOffset, payloadLength)) {
            return Optional.empty();
        }
        for (int i = payloadOffset; i + 50 < payloadOffset + payloadLength; i++) {
            if ((payload[i] & 0xFF) == 0x01) {
                int start = Math.max(payloadOffset, i - 5);
                int len = payloadOffset + payloadLength - start;
                Optional<String> result = TlsClientHelloSniExtractor.extract(payload, start, len);
                if (result.isPresent()) return result;
            }
        }
        return Optional.empty();
    }
}