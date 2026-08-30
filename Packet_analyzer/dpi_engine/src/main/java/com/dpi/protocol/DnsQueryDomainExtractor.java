package com.dpi.protocol;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
public final class DnsQueryDomainExtractor {
    private DnsQueryDomainExtractor() {}
    public static boolean isDnsQuery(byte[] payload, int offset, int length) {
        if (length < 12) return false;
        int flags = payload[offset + 2] & 0xFF;
        if ((flags & 0x80) != 0) return false;
        int qdcount = ((payload[offset + 4] & 0xFF) << 8) | (payload[offset + 5] & 0xFF);
        return qdcount > 0;
    }
    public static Optional<String> extractQuery(byte[] payload, int payloadOffset, int payloadLength) {
        if (!isDnsQuery(payload, payloadOffset, payloadLength)) {
            return Optional.empty();
        }
        int off = payloadOffset + 12; 
        int end = payloadOffset + payloadLength;
        StringBuilder domain = new StringBuilder();
        while (off < end) {
            int labelLength = payload[off] & 0xFF;
            if (labelLength == 0) break; 
            if (labelLength > 63) break; 
            off++;
            if (off + labelLength > end) break;
            if (domain.length() > 0) {
                domain.append('.');
            }
            domain.append(new String(payload, off, labelLength, StandardCharsets.US_ASCII));
            off += labelLength;
        }
        return domain.length() == 0 ? Optional.empty() : Optional.of(domain.toString());
    }
}