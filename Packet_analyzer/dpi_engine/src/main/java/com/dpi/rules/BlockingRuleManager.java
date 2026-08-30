package com.dpi.rules;
import com.dpi.core.*;
import org.springframework.stereotype.Service;
import java.io.*;
import java.util.*;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import jakarta.annotation.PostConstruct;
@Service
public class BlockingRuleManager {
    public enum BlockReasonType { IP, APP, DOMAIN, PORT }
    public record BlockReason(BlockReasonType type, String detail) {}
    private static final String RULES_FILE = "dpi_rules.txt";
    @PostConstruct
    public void init() {
        loadRules(RULES_FILE);
    }
    private void persistRules() {
        saveRules(RULES_FILE);
    }
    private final ReadWriteLock ipLock = new ReentrantReadWriteLock();
    private final Set<Integer> blockedIps = new HashSet<>();
    private final ReadWriteLock appLock = new ReentrantReadWriteLock();
    private final Set<AppType> blockedApps = new HashSet<>();
    private final Set<AppType> throttledApps = new HashSet<>();
    private final ReadWriteLock domainLock = new ReentrantReadWriteLock();
    private final Set<String> blockedDomains = new HashSet<>();
    private final List<String> domainPatterns = new ArrayList<>();
    private final ReadWriteLock portLock = new ReentrantReadWriteLock();
    private final Set<Integer> blockedPorts = new HashSet<>();
    public void blockIp(int ip) {
        ipLock.writeLock().lock();
        try {
            blockedIps.add(ip);
        } finally {
            ipLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked IP: " + FiveTuple.formatIp(ip));
        persistRules();
    }
    public void blockIp(String ip) {
        blockIp(FiveTuple.parseIp(ip));
    }
    public void unblockIp(String ip) {
        int addr = FiveTuple.parseIp(ip);
        ipLock.writeLock().lock();
        try {
            blockedIps.remove(addr);
        } finally {
            ipLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Unblocked IP: " + ip);
        persistRules();
    }
    public boolean isIpBlocked(int ip) {
        ipLock.readLock().lock();
        try {
            return blockedIps.contains(ip);
        } finally {
            ipLock.readLock().unlock();
        }
    }
    public List<String> getBlockedIps() {
        ipLock.readLock().lock();
        try {
            List<String> result = new ArrayList<>();
            for (int ip : blockedIps) result.add(FiveTuple.formatIp(ip));
            return result;
        } finally {
            ipLock.readLock().unlock();
        }
    }
    public void blockApp(AppType app) {
        appLock.writeLock().lock();
        try {
            blockedApps.add(app);
        } finally {
            appLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked app: " + app.displayName());
        persistRules();
    }
    public void unblockApp(AppType app) {
        appLock.writeLock().lock();
        try {
            blockedApps.remove(app);
        } finally {
            appLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Unblocked app: " + app.displayName());
        persistRules();
    }
    public boolean isAppBlocked(AppType app) {
        appLock.readLock().lock();
        try {
            return blockedApps.contains(app);
        } finally {
            appLock.readLock().unlock();
        }
    }
    public void throttleApp(AppType app) {
        appLock.writeLock().lock();
        try {
            throttledApps.add(app);
        } finally {
            appLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Throttled app: " + app.displayName());
        persistRules();
    }
    public void unthrottleApp(AppType app) {
        appLock.writeLock().lock();
        try {
            throttledApps.remove(app);
        } finally {
            appLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Unthrottled app: " + app.displayName());
        persistRules();
    }
    public boolean isAppThrottled(AppType app) {
        appLock.readLock().lock();
        try {
            return throttledApps.contains(app);
        } finally {
            appLock.readLock().unlock();
        }
    }
    public void blockDomain(String domain) {
        domainLock.writeLock().lock();
        try {
            if (domain.contains("*")) {
                domainPatterns.add(domain);
            } else {
                blockedDomains.add(domain);
            }
        } finally {
            domainLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked domain: " + domain);
        persistRules();
    }
    public void unblockDomain(String domain) {
        domainLock.writeLock().lock();
        try {
            if (domain.contains("*")) {
                domainPatterns.remove(domain);
            } else {
                blockedDomains.remove(domain);
            }
        } finally {
            domainLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Unblocked domain: " + domain);
        persistRules();
    }
    public boolean isDomainBlocked(String domain) {
        domainLock.readLock().lock();
        try {
            if (blockedDomains.contains(domain)) return true;
            String lowerDomain = domain.toLowerCase();
            for (String blocked : blockedDomains) {
                String lowerBlocked = blocked.toLowerCase();
                if (lowerDomain.equals(lowerBlocked) || lowerDomain.endsWith("." + lowerBlocked)) {
                    return true;
                }
            }
            for (String pattern : domainPatterns) {
                if (domainMatchesPattern(lowerDomain, pattern.toLowerCase())) return true;
            }
            return false;
        } finally {
            domainLock.readLock().unlock();
        }
    }
    private static boolean domainMatchesPattern(String domain, String pattern) {
        if (pattern.length() >= 2 && pattern.charAt(0) == '*' && pattern.charAt(1) == '.') {
            String suffix = pattern.substring(1); 
            if (domain.endsWith(suffix)) return true;
            if (domain.equals(pattern.substring(2))) return true; 
        }
        return false;
    }
    public void blockPort(int port) {
        portLock.writeLock().lock();
        try {
            blockedPorts.add(port);
        } finally {
            portLock.writeLock().unlock();
        }
        System.out.println("[RuleManager] Blocked port: " + port);
        persistRules();
    }
    public boolean isPortBlocked(int port) {
        portLock.readLock().lock();
        try {
            return blockedPorts.contains(port);
        } finally {
            portLock.readLock().unlock();
        }
    }
    public Optional<BlockReason> shouldBlock(int srcIp, int dstPort, AppType app, String domain) {
        if (isIpBlocked(srcIp))
            return Optional.of(new BlockReason(BlockReasonType.IP, FiveTuple.formatIp(srcIp)));
        if (isPortBlocked(dstPort))
            return Optional.of(new BlockReason(BlockReasonType.PORT, String.valueOf(dstPort)));
        if (isAppBlocked(app))
            return Optional.of(new BlockReason(BlockReasonType.APP, app.displayName()));
        if (domain != null && !domain.isEmpty() && isDomainBlocked(domain))
            return Optional.of(new BlockReason(BlockReasonType.DOMAIN, domain));
        return Optional.empty();
    }
    public boolean shouldThrottle(int srcIp, int dstPort, AppType app, String domain) {
        return isAppThrottled(app);
    }
    public boolean saveRules(String filename) {
        try (PrintWriter out = new PrintWriter(new FileWriter(filename))) {
            out.println("[BLOCKED_IPS]");
            for (String ip : getBlockedIps()) out.println(ip);
            out.println("\n[BLOCKED_APPS]");
            appLock.readLock().lock();
            try {
                for (AppType app : blockedApps) out.println(app.displayName());
            } finally {
                appLock.readLock().unlock();
            }
            out.println("\n[THROTTLED_APPS]");
            appLock.readLock().lock();
            try {
                for (AppType app : throttledApps) out.println(app.displayName());
            } finally {
                appLock.readLock().unlock();
            }
            out.println("\n[BLOCKED_DOMAINS]");
            domainLock.readLock().lock();
            try {
                for (String d : blockedDomains) out.println(d);
                for (String d : domainPatterns) out.println(d);
            } finally {
                domainLock.readLock().unlock();
            }
            out.println("\n[BLOCKED_PORTS]");
            portLock.readLock().lock();
            try {
                for (int p : blockedPorts) out.println(p);
            } finally {
                portLock.readLock().unlock();
            }
            System.out.println("[RuleManager] Rules saved to: " + filename);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
    public boolean loadRules(String filename) {
        try (BufferedReader in = new BufferedReader(new FileReader(filename))) {
            String line;
            String currentSection = "";
            while ((line = in.readLine()) != null) {
                if (line.isEmpty()) continue;
                if (line.startsWith("[")) {
                    currentSection = line;
                    continue;
                }
                switch (currentSection) {
                    case "[BLOCKED_IPS]" -> blockIp(line);
                    case "[BLOCKED_APPS]" -> {
                        AppType app = AppType.fromDisplayName(line);
                        if (app != null) blockApp(app);
                    }
                    case "[THROTTLED_APPS]" -> {
                        AppType app = AppType.fromDisplayName(line);
                        if (app != null) throttleApp(app);
                    }
                    case "[BLOCKED_DOMAINS]" -> blockDomain(line);
                    case "[BLOCKED_PORTS]" -> blockPort(Integer.parseInt(line.trim()));
                }
            }
            System.out.println("[RuleManager] Rules loaded from: " + filename);
            return true;
        } catch (IOException | NumberFormatException e) {
            return false;
        }
    }
    public void clearAll() {
        ipLock.writeLock().lock();
        try { blockedIps.clear(); } finally { ipLock.writeLock().unlock(); }
        appLock.writeLock().lock();
        try { blockedApps.clear(); throttledApps.clear(); } finally { appLock.writeLock().unlock(); }
        domainLock.writeLock().lock();
        try { blockedDomains.clear(); domainPatterns.clear(); } finally { domainLock.writeLock().unlock(); }
        portLock.writeLock().lock();
        try { blockedPorts.clear(); } finally { portLock.writeLock().unlock(); }
        System.out.println("[RuleManager] All rules cleared");
    }
    public int getBlockedIpCount() {
        ipLock.readLock().lock();
        try { return blockedIps.size(); } finally { ipLock.readLock().unlock(); }
    }
    public int getBlockedAppCount() {
        appLock.readLock().lock();
        try { return blockedApps.size(); } finally { appLock.readLock().unlock(); }
    }
    public int getBlockedDomainCount() {
        domainLock.readLock().lock();
        try { return blockedDomains.size() + domainPatterns.size(); } finally { domainLock.readLock().unlock(); }
    }
    public int getBlockedPortCount() {
        portLock.readLock().lock();
        try { return blockedPorts.size(); } finally { portLock.readLock().unlock(); }
    }
}