package com.example.backend.controller;
import com.dpi.rules.BlockingRuleManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/rules")
@CrossOrigin(origins = "*") 
public class RuleController {
    private final BlockingRuleManager ruleManager;
    public RuleController(BlockingRuleManager ruleManager) {
        this.ruleManager = ruleManager;
    }
    @PostMapping("/block-domain")
    public ResponseEntity<Map<String, String>> blockDomain(@RequestBody Map<String, String> request) {
        String domain = request.get("domain");
        if (domain == null || domain.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Domain is required"));
        }
        ruleManager.blockDomain(domain.trim());
        return ResponseEntity.ok(Map.of("message", "Successfully blocked " + domain));
    }
    @GetMapping("/blocked-domains")
    public ResponseEntity<Map<String, Integer>> getBlockedDomainCount() {
        return ResponseEntity.ok(Map.of("count", ruleManager.getBlockedDomainCount()));
    }
}