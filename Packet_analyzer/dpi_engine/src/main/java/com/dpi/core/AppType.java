package com.dpi.core;
public enum AppType {
    UNKNOWN,
    HTTP,
    HTTPS,
    DNS,
    TLS,
    QUIC,
    GOOGLE,
    FACEBOOK,
    YOUTUBE,
    TWITTER,
    INSTAGRAM,
    NETFLIX,
    AMAZON,
    MICROSOFT,
    APPLE,
    WHATSAPP,
    TELEGRAM,
    TIKTOK,
    SPOTIFY,
    ZOOM,
    DISCORD,
    GITHUB,
    CLOUDFLARE,
    TWITCH,
    LINKEDIN,
    REDDIT,
    PINTEREST,
    SLACK,
    SIGNAL;
    public String displayName() {
        return switch (this) {
            case UNKNOWN -> "Unknown";
            case HTTP -> "HTTP";
            case HTTPS -> "HTTPS";
            case DNS -> "DNS";
            case TLS -> "TLS";
            case QUIC -> "QUIC";
            case GOOGLE -> "Google";
            case FACEBOOK -> "Facebook";
            case YOUTUBE -> "YouTube";
            case TWITTER -> "Twitter/X";
            case INSTAGRAM -> "Instagram";
            case NETFLIX -> "Netflix";
            case AMAZON -> "Amazon";
            case MICROSOFT -> "Microsoft";
            case APPLE -> "Apple";
            case WHATSAPP -> "WhatsApp";
            case TELEGRAM -> "Telegram";
            case TIKTOK -> "TikTok";
            case SPOTIFY -> "Spotify";
            case ZOOM -> "Zoom";
            case DISCORD -> "Discord";
            case GITHUB -> "GitHub";
            case CLOUDFLARE -> "Cloudflare";
            case TWITCH -> "Twitch";
            case LINKEDIN -> "LinkedIn";
            case REDDIT -> "Reddit";
            case PINTEREST -> "Pinterest";
            case SLACK -> "Slack";
            case SIGNAL -> "Signal";
        };
    }
    public static AppType fromSni(String sni) {
        if (sni == null || sni.isEmpty()) return UNKNOWN;
        String lower = sni.toLowerCase();
        if (lower.contains("youtube") || lower.contains("ytimg") ||
            lower.contains("youtu.be") || lower.contains("yt3.ggpht")) {
            return YOUTUBE;
        }
        if (lower.contains("google") || lower.contains("gstatic") ||
            lower.contains("googleapis") || lower.contains("ggpht") ||
            lower.contains("gvt1")) {
            return GOOGLE;
        }
        if (lower.contains("instagram") || lower.contains("cdninstagram")) {
            return INSTAGRAM;
        }
        if (lower.contains("whatsapp") || lower.contains("wa.me")) {
            return WHATSAPP;
        }
        if (lower.contains("facebook") || lower.contains("fbcdn") ||
            lower.contains("fb.com") || lower.contains("fbsbx") ||
            lower.contains("meta.com")) {
            return FACEBOOK;
        }
        if (lower.contains("twitter") || lower.contains("twimg") ||
            lower.contains("x.com") || lower.contains("t.co")) {
            return TWITTER;
        }
        if (lower.contains("netflix") || lower.contains("nflxvideo") ||
            lower.contains("nflximg")) {
            return NETFLIX;
        }
        if (lower.contains("amazon") || lower.contains("amazonaws") ||
            lower.contains("cloudfront") || lower.contains("aws")) {
            return AMAZON;
        }
        if (lower.contains("microsoft") || lower.contains("msn.com") ||
            lower.contains("office") || lower.contains("azure") ||
            lower.contains("live.com") || lower.contains("outlook") ||
            lower.contains("bing")) {
            return MICROSOFT;
        }
        if (lower.contains("apple") || lower.contains("icloud") ||
            lower.contains("mzstatic") || lower.contains("itunes")) {
            return APPLE;
        }
        if (lower.contains("telegram") || lower.contains("t.me")) {
            return TELEGRAM;
        }
        if (lower.contains("tiktok") || lower.contains("tiktokcdn") ||
            lower.contains("musical.ly") || lower.contains("bytedance")) {
            return TIKTOK;
        }
        if (lower.contains("spotify") || lower.contains("scdn.co")) {
            return SPOTIFY;
        }
        if (lower.contains("zoom")) {
            return ZOOM;
        }
        if (lower.contains("discord") || lower.contains("discordapp")) {
            return DISCORD;
        }
        if (lower.contains("github") || lower.contains("githubusercontent")) {
            return GITHUB;
        }
        if (lower.contains("cloudflare") || lower.contains("cf-")) {
            return CLOUDFLARE;
        }
        if (lower.contains("twitch") || lower.contains("ttvnw") || lower.contains("jtvnw")) {
            return TWITCH;
        }
        if (lower.contains("linkedin") || lower.contains("licdn")) {
            return LINKEDIN;
        }
        if (lower.contains("reddit") || lower.contains("redditmedia")) {
            return REDDIT;
        }
        if (lower.contains("pinterest") || lower.contains("pinimg")) {
            return PINTEREST;
        }
        if (lower.contains("slack") || lower.contains("slack-edge") || lower.contains("slack-msgs")) {
            return SLACK;
        }
        if (lower.contains("signal.org") || lower.contains("whispersystems")) {
            return SIGNAL;
        }
        return HTTPS;
    }
    public static AppType fromDisplayName(String name) {
        for (AppType t : values()) {
            if (t.displayName().equals(name)) {
                return t;
            }
        }
        return null;
    }
}