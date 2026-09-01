package com.example.backend.controller;
import com.example.backend.service.LivePacketCaptureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dpi.core.DpiStatistics;
import java.util.Map;
import java.util.HashMap;
@RestController
@RequestMapping("/api/v1/live")
@CrossOrigin(origins = "*") 
public class LiveCaptureController {
    private final LivePacketCaptureService liveCaptureService;
    public LiveCaptureController(LivePacketCaptureService liveCaptureService) {
        this.liveCaptureService = liveCaptureService;
    }
    @PostMapping("/start")
    public ResponseEntity<Map<String, String>> startLive() {
        if (liveCaptureService.isRunning()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Live capture is already running"));
        }
        liveCaptureService.startLiveCapture();
        return ResponseEntity.ok(Map.of("message", "Live capture started successfully"));
    }
    @PostMapping("/stop")
    public ResponseEntity<Map<String, String>> stopLive() {
        if (!liveCaptureService.isRunning()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Live capture is not running"));
        }
        liveCaptureService.stopLiveCapture();
        return ResponseEntity.ok(Map.of("message", "Live capture stopped successfully"));
    }
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        boolean running = liveCaptureService.isRunning();
        Map<String, Object> status = new HashMap<>();
        status.put("isRunning", running);
        status.put("name", "DPI Engine (Backend)");
        status.put("version", "2.0.0");
        status.put("status", running ? "online" : "idle");
        status.put("capture", running ? "Live Interface" : null);
        status.put("lastUpdated", java.time.Instant.now().toString());
        status.put("uptimeSeconds", 1000); 
        status.put("connected", true);
        return ResponseEntity.ok(status);
    }
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        if (liveCaptureService.getEngine() == null) {
            Map<String, Object> empty = new HashMap<>();
            Map<String, Object> emptyOverview = new HashMap<>();
            emptyOverview.put("totalPackets", 0);
            emptyOverview.put("packetsPerSec", 0);
            emptyOverview.put("totalBytes", 0);
            emptyOverview.put("throughputBps", 0);
            emptyOverview.put("forwardedPackets", 0);
            emptyOverview.put("forwardedPercent", 0);
            emptyOverview.put("droppedPackets", 0);
            emptyOverview.put("droppedPercent", 0);
            emptyOverview.put("activeFlows", 0);
            emptyOverview.put("detectedApplications", 0);
            emptyOverview.put("detectedDomains", 0);
            empty.put("overview", emptyOverview);
            empty.put("timeseries", java.util.List.of());
            return ResponseEntity.ok(empty);
        }
        DpiStatistics stats = liveCaptureService.getEngine().getStats();
        Map<String, Object> response = new HashMap<>();
        long total = stats.totalPackets.get();
        long dropped = stats.droppedPackets.get();
        long forwarded = stats.forwardedPackets.get();
        double droppedPercent = total > 0 ? ((double) dropped / total) * 100.0 : 0.0;
        double forwardedPercent = total > 0 ? ((double) forwarded / total) * 100.0 : 0.0;
        
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalPackets", total);
        overview.put("packetsPerSec", 0); 
        overview.put("totalBytes", stats.totalBytes.get());
        overview.put("throughputBps", 0);
        overview.put("forwardedPackets", forwarded);
        overview.put("forwardedPercent", forwardedPercent);
        overview.put("droppedPackets", dropped);
        overview.put("droppedPercent", droppedPercent);
        overview.put("activeFlows", liveCaptureService.getEngine().getGlobalConnTable().getAllConnections().size());
        var connections = liveCaptureService.getEngine().getGlobalConnTable().getAllConnections();
        java.util.Set<String> uniqueApps = new java.util.HashSet<>();
        java.util.Set<String> uniqueDomains = new java.util.HashSet<>();
        for (com.dpi.core.Connection c : connections) {
            if (c.getAppType() != null && c.getAppType() != com.dpi.core.AppType.UNKNOWN) {
                uniqueApps.add(c.getAppType().name());
            }
            if (c.getSni() != null && !c.getSni().isEmpty()) {
                uniqueDomains.add(c.getSni());
            }
        }
        
        overview.put("detectedApplications", uniqueApps.size());
        overview.put("detectedDomains", uniqueDomains.size());

        response.put("overview", overview);
        response.put("timeseries", liveCaptureService.getEngine().getTimeseries());
        return ResponseEntity.ok(response);
    }
}