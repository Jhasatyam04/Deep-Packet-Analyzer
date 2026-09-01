package com.example.backend.controller;

import com.dpi.core.DpiStatistics;
import com.example.backend.service.LivePacketCaptureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/session")
@CrossOrigin(origins = "*")
public class SessionController {

    private final LivePacketCaptureService liveCaptureService;
    private final Instant startTime = Instant.now();

    public SessionController(LivePacketCaptureService liveCaptureService) {
        this.liveCaptureService = liveCaptureService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSession() {
        if (liveCaptureService.getEngine() == null) {
            return ResponseEntity.notFound().build();
        }

        DpiStatistics stats = liveCaptureService.getEngine().getStats();
        Map<String, Object> response = new HashMap<>();
        
        response.put("id", "live-session");
        response.put("status", liveCaptureService.isRunning() ? "processing" : "completed");
        response.put("progress", 100);
        response.put("inputPcap", "Live Interface / Dropzone Simulation");
        response.put("outputPcap", "N/A");
        response.put("startTime", startTime.toString());
        response.put("durationMs", Instant.now().toEpochMilli() - startTime.toEpochMilli());
        
        long total = stats.totalPackets.get();
        response.put("totalPackets", total);
        response.put("totalBytes", stats.totalBytes.get());
        response.put("forwardedPackets", stats.forwardedPackets.get());
        response.put("droppedPackets", stats.droppedPackets.get());
        
        response.put("flows", liveCaptureService.getEngine().getGlobalConnTable().getAllConnections().size());
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
        
        response.put("applications", uniqueApps.size()); 
        response.put("domains", uniqueDomains.size());
        response.put("activeRules", 0); 
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/reprocess")
    public ResponseEntity<Map<String, Object>> reprocess() {
        return getSession();
    }
}
