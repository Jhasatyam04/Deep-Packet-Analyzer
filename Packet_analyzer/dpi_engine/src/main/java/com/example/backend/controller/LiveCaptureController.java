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
    public ResponseEntity<Map<String, Boolean>> getStatus() {
        return ResponseEntity.ok(Map.of("isRunning", liveCaptureService.isRunning()));
    }
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        if (!liveCaptureService.isRunning() || liveCaptureService.getEngine() == null) {
            return ResponseEntity.ok(Map.of());
        }
        DpiStatistics stats = liveCaptureService.getEngine().getStats();
        Map<String, Object> response = new HashMap<>();
        long total = stats.totalPackets.get();
        long dropped = stats.droppedPackets.get();
        double dropRate = total > 0 ? ((double) dropped / total) * 100.0 : 0.0;
        response.put("totalPackets", total);
        response.put("totalBytes", stats.totalBytes.get());
        response.put("tcpPackets", stats.tcpPackets.get());
        response.put("udpPackets", stats.udpPackets.get());
        response.put("forwarded", stats.forwardedPackets.get());
        response.put("dropped", dropped);
        response.put("dropRate", dropRate);
        response.put("classificationsJson", "Live mode active");
        return ResponseEntity.ok(response);
    }
}