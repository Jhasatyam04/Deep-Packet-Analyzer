package com.dpi.protocol;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
public final class HttpRequestHostExtractor {
    private static final byte[][] HTTP_METHOD_PREFIXES = {
        "GET ".getBytes(StandardCharsets.US_ASCII),
        "POST".getBytes(StandardCharsets.US_ASCII),
        "PUT ".getBytes(StandardCharsets.US_ASCII),
        "HEAD".getBytes(StandardCharsets.US_ASCII),
        "DELE".getBytes(StandardCharsets.US_ASCII),
        "PATC".getBytes(StandardCharsets.US_ASCII),
        "OPTI".getBytes(StandardCharsets.US_ASCII),
    };
    private HttpRequestHostExtractor() {}
    public static boolean isHttpRequest(byte[] payload, int offset, int length) {
        if (length < 4) return false;
        for (byte[] method : HTTP_METHOD_PREFIXES) {
            boolean match = true;
            for (int i = 0; i < 4; i++) {
                if (payload[offset + i] != method[i]) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }
        return false;
    }
    public static Optional<String> extract(byte[] payload, int payloadOffset, int payloadLength) {
        if (!isHttpRequest(payload, payloadOffset, payloadLength)) {
            return Optional.empty();
        }
        int end = payloadOffset + payloadLength;
        for (int i = payloadOffset; i + 6 < end; i++) {
            int b0 = payload[i] & 0xFF;
            int b1 = payload[i + 1] & 0xFF;
            int b2 = payload[i + 2] & 0xFF;
            int b3 = payload[i + 3] & 0xFF;
            int b4 = payload[i + 4] & 0xFF;
            if ((b0 == 'H' || b0 == 'h') &&
                (b1 == 'o' || b1 == 'O') &&
                (b2 == 's' || b2 == 'S') &&
                (b3 == 't' || b3 == 'T') &&
                b4 == ':') {
                int start = i + 5;
                while (start < end && (payload[start] == ' ' || payload[start] == '\t')) {
                    start++;
                }
                int lineEnd = start;
                while (lineEnd < end && payload[lineEnd] != '\r' && payload[lineEnd] != '\n') {
                    lineEnd++;
                }
                if (lineEnd > start) {
                    String host = new String(payload, start, lineEnd - start, StandardCharsets.US_ASCII);
                    int colonPos = host.indexOf(':');
                    if (colonPos >= 0) {
                        host = host.substring(0, colonPos);
                    }
                    return Optional.of(host);
                }
            }
        }
        return Optional.empty();
    }
}