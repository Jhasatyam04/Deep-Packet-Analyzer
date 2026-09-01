package com.example.backend.controller;

import com.dpi.engine.FastPathPacketProcessor;
import com.dpi.engine.HashBasedLoadBalancer;
import com.example.backend.service.LivePacketCaptureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin(origins = "*")
public class SystemController {

    private final LivePacketCaptureService liveCaptureService;

    public SystemController(LivePacketCaptureService liveCaptureService) {
        this.liveCaptureService = liveCaptureService;
    }

    @GetMapping("/threads")
    public ResponseEntity<List<Map<String, Object>>> getThreads() {
        if (liveCaptureService.getEngine() == null) {
            return ResponseEntity.ok(List.of());
        }

        var engine = liveCaptureService.getEngine();
        var lbPool = engine.getLbPool();
        var fpPool = engine.getFpPool();

        if (lbPool == null || fpPool == null) {
            return ResponseEntity.ok(List.of());
        }

        List<Map<String, Object>> threads = new ArrayList<>();

        
        for (int i = 0; i < lbPool.getNumLbs(); i++) {
            HashBasedLoadBalancer lb = lbPool.getLb(i);
            long received = lb.getPacketsReceived();
            long dispatched = lb.getPacketsDispatched();
            long total = received + dispatched;
            
            threads.add(Map.of(
                "id", "lb-" + i,
                "name", "Load Balancer " + (i + 1),
                "role", "load_balancer",
                "status", lb.isRunning() ? "ok" : "warning",
                "packets", total,
                "rate", 0,
                "utilization", total > 0 ? 50 : 0, 
                "queueDepth", lb.getInputQueue().size(),
                "queueCapacity", 10000
            ));
        }

        
        for (int i = 0; i < fpPool.getNumFps(); i++) {
            FastPathPacketProcessor fp = fpPool.getFp(i);
            long processed = fp.getPacketsProcessed();
            
            threads.add(Map.of(
                "id", "fp-" + i,
                "parentId", "lb-" + (i / Math.max(1, (fpPool.getNumFps() / lbPool.getNumLbs()))),
                "name", "Fast Path " + (i + 1),
                "role", "fast_path",
                "status", fp.isRunning() ? "ok" : "warning",
                "packets", processed,
                "rate", 0,
                "utilization", processed > 0 ? 75 : 0, 
                "queueDepth", fp.getInputQueue().size(),
                "queueCapacity", 10000
            ));
        }

        return ResponseEntity.ok(threads);
    }
}
