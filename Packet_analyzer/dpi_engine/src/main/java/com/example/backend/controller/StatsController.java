package com.example.backend.controller;

import com.dpi.core.Connection;
import com.dpi.core.AppType;
import com.dpi.core.ConnectionState;
import com.dpi.core.FiveTuple;
import com.example.backend.service.LivePacketCaptureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final LivePacketCaptureService liveCaptureService;

    public StatsController(LivePacketCaptureService liveCaptureService) {
        this.liveCaptureService = liveCaptureService;
    }

    private List<Connection> getConnections() {
        if (liveCaptureService.getEngine() == null) {
            return Collections.emptyList();
        }
        var connTable = liveCaptureService.getEngine().getGlobalConnTable();
        if (connTable == null) return Collections.emptyList();
        return connTable.getAllConnections();
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Map<String, Object>>> getApplications() {
        List<Connection> connections = getConnections();
        Map<AppType, AppStats> appMap = new HashMap<>();

        for (Connection c : connections) {
            AppType app = c.getAppType();
            if (app == null) app = AppType.UNKNOWN;
            
            AppStats stats = appMap.computeIfAbsent(app, k -> new AppStats());
            stats.packets += (c.getPacketsIn() + c.getPacketsOut());
            stats.bytes += (c.getBytesIn() + c.getBytesOut());
            stats.flows += 1;
            if (c.getState() == ConnectionState.BLOCKED) {
                stats.status = "blocked";
            }
        }

        long totalBytes = appMap.values().stream().mapToLong(s -> s.bytes).sum();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<AppType, AppStats> entry : appMap.entrySet()) {
            AppStats s = entry.getValue();
            double percent = totalBytes > 0 ? (s.bytes * 100.0 / totalBytes) : 0;
            result.add(Map.of(
                "name", entry.getKey().displayName(),
                "packets", s.packets,
                "bytes", s.bytes,
                "flows", s.flows,
                "status", s.status,
                "percent", percent
            ));
        }
        
        result.sort((a, b) -> Long.compare(((Number)b.get("bytes")).longValue(), ((Number)a.get("bytes")).longValue()));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/domains")
    public ResponseEntity<Map<String, Object>> getDomains(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "25") int pageSize,
            @RequestParam(defaultValue = "bytes") String sort,
            @RequestParam(defaultValue = "desc") String dir,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(required = false) String application,
            @RequestParam(defaultValue = "") String q) {

        List<Connection> connections = getConnections();
        Map<String, DomainStats> domainMap = new HashMap<>();

        for (Connection c : connections) {
            String sni = c.getSni();
            if (sni == null || sni.isEmpty()) continue;
            
            String appName = c.getAppType() != null ? c.getAppType().displayName() : "UNKNOWN";
            if (application != null && !application.isEmpty() && !appName.equals(application)) continue;
            
            String connStatus = c.getState() == ConnectionState.BLOCKED ? "blocked" : "allowed";
            if (!status.equals("all") && !connStatus.equals(status)) continue;
            
            if (!q.isEmpty() && !sni.toLowerCase().contains(q.toLowerCase())) continue;

            DomainStats ds = domainMap.computeIfAbsent(sni, k -> new DomainStats());
            ds.id = sni;
            ds.domain = sni;
            ds.packets += (c.getPacketsIn() + c.getPacketsOut());
            ds.bytes += (c.getBytesIn() + c.getBytesOut());
            ds.flows += 1;
            ds.status = connStatus;
            ds.application = appName;
            
            String nowStr = java.time.Instant.now().toString();
            if (ds.firstSeen == null) ds.firstSeen = nowStr;
            ds.lastSeen = nowStr;
        }

        List<DomainStats> list = new ArrayList<>(domainMap.values());
        
        Comparator<DomainStats> comp = switch (sort) {
            case "packets" -> Comparator.comparingLong(d -> d.packets);
            case "flows" -> Comparator.comparingLong(d -> d.flows);
            case "domain" -> Comparator.comparing(d -> d.domain);
            default -> Comparator.comparingLong(d -> d.bytes);
        };
        if ("desc".equals(dir)) comp = comp.reversed();
        list.sort(comp);

        int total = list.size();
        int totalPages = (int) Math.ceil((double) total / pageSize);
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, total);
        
        List<DomainStats> paginated = (start < total) ? list.subList(start, end) : Collections.emptyList();

        return ResponseEntity.ok(Map.of(
            "items", paginated,
            "total", total,
            "page", page,
            "pageSize", pageSize,
            "totalPages", totalPages
        ));
    }

    @GetMapping("/flows")
    public ResponseEntity<Map<String, Object>> getFlows(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "25") int pageSize,
            @RequestParam(defaultValue = "bytes") String sort,
            @RequestParam(defaultValue = "desc") String dir,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(required = false) String application,
            @RequestParam(defaultValue = "") String q) {

        List<Connection> connections = getConnections();
        List<Map<String, Object>> flowList = new ArrayList<>();

        for (Connection c : connections) {
            String appName = c.getAppType() != null ? c.getAppType().displayName() : "UNKNOWN";
            if (application != null && !application.isEmpty() && !appName.equals(application)) continue;
            
            String connStatus = c.getState() == ConnectionState.BLOCKED ? "blocked" : "allowed";
            if (!status.equals("all") && !connStatus.equals(status)) continue;

            FiveTuple t = c.getTuple();
            String srcIp = FiveTuple.formatIp(t.getSrcIp());
            String dstIp = FiveTuple.formatIp(t.getDstIp());
            String proto = t.getProtocol() == 6 ? "TCP" : (t.getProtocol() == 17 ? "UDP" : String.valueOf(t.getProtocol()));
            
            if (!q.isEmpty()) {
                String search = srcIp + " " + dstIp + " " + t.getSrcPort() + " " + t.getDstPort();
                if (!search.contains(q)) continue;
            }

            Map<String, Object> f = new HashMap<>();
            f.put("id", srcIp + ":" + t.getSrcPort() + "-" + dstIp + ":" + t.getDstPort() + "-" + proto);
            f.put("srcIp", srcIp);
            f.put("srcPort", t.getSrcPort());
            f.put("dstIp", dstIp);
            f.put("dstPort", t.getDstPort());
            f.put("protocol", proto);
            f.put("application", appName);
            f.put("domain", c.getSni() != null ? c.getSni() : "");
            f.put("packets", c.getPacketsIn() + c.getPacketsOut());
            f.put("bytes", c.getBytesIn() + c.getBytesOut());
            f.put("status", connStatus);
            f.put("startTime", java.time.Instant.now().toString());
            f.put("lastSeen", java.time.Instant.now().toString());
            flowList.add(f);
        }

        Comparator<Map<String, Object>> comp = (a, b) -> {
            return switch (sort) {
                case "packets" -> Long.compare(((Number)a.get("packets")).longValue(), ((Number)b.get("packets")).longValue());
                case "srcIp" -> ((String)a.get("srcIp")).compareTo((String)b.get("srcIp"));
                default -> Long.compare(((Number)a.get("bytes")).longValue(), ((Number)b.get("bytes")).longValue());
            };
        };
        if ("desc".equals(dir)) comp = comp.reversed();
        flowList.sort(comp);

        int total = flowList.size();
        int totalPages = (int) Math.ceil((double) total / pageSize);
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, total);
        
        List<Map<String, Object>> paginated = (start < total) ? flowList.subList(start, end) : Collections.emptyList();

        return ResponseEntity.ok(Map.of(
            "items", paginated,
            "total", total,
            "page", page,
            "pageSize", pageSize,
            "totalPages", totalPages
        ));
    }

    private static class AppStats {
        long packets;
        long bytes;
        long flows;
        String status = "allowed";
    }
    
    public static class DomainStats {
        public String id;
        public String domain;
        public String firstSeen;
        public String lastSeen;
        public long packets;
        public long bytes;
        public long flows;
        public String status;
        public String application;
    }
}
