package com.example.backend.controller;

import com.dpi.rules.BlockingRuleManager;
import com.dpi.core.AppType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.time.Instant;

@RestController
@RequestMapping("/api/v1/rules")
@CrossOrigin(origins = "*") 
public class RuleController {
    private final BlockingRuleManager ruleManager;

    public RuleController(BlockingRuleManager ruleManager) {
        this.ruleManager = ruleManager;
    }

    public static class RuleDto {
        public String id;
        public String type; 
        public String value;
        public boolean enabled;
        public long packetsAffected;
        public String createdAt;
        public String updatedAt;
    }

    @GetMapping
    public ResponseEntity<List<RuleDto>> getRules(@RequestParam(defaultValue = "all") String type) {
        List<RuleDto> rules = new ArrayList<>();
        String now = Instant.now().toString();

        if (type.equals("all") || type.equals("ip")) {
            for (String ip : ruleManager.getBlockedIps()) {
                RuleDto r = new RuleDto();
                r.id = "ip|" + ip;
                r.type = "ip";
                r.value = ip;
                r.enabled = true;
                r.packetsAffected = 0;
                r.createdAt = now;
                r.updatedAt = now;
                rules.add(r);
            }
        }
        if (type.equals("all") || type.equals("application")) {
            for (String app : ruleManager.getBlockedAppsList()) {
                RuleDto r = new RuleDto();
                r.id = "application|" + app;
                r.type = "application";
                r.value = app;
                r.enabled = true;
                r.packetsAffected = 0;
                r.createdAt = now;
                r.updatedAt = now;
                rules.add(r);
            }
        }
        if (type.equals("all") || type.equals("domain")) {
            for (String domain : ruleManager.getBlockedDomainsList()) {
                RuleDto r = new RuleDto();
                r.id = "domain|" + domain;
                r.type = "domain";
                r.value = domain;
                r.enabled = true;
                r.packetsAffected = 0;
                r.createdAt = now;
                r.updatedAt = now;
                rules.add(r);
            }
        }
        return ResponseEntity.ok(rules);
    }

    @PostMapping
    public ResponseEntity<RuleDto> createRule(@RequestBody RuleDto request) {
        if ("ip".equals(request.type)) {
            ruleManager.blockIp(request.value);
        } else if ("application".equals(request.type)) {
            AppType app = AppType.fromDisplayName(request.value);
            if (app != null) ruleManager.blockApp(app);
        } else if ("domain".equals(request.type)) {
            ruleManager.blockDomain(request.value);
        }
        request.id = request.type + "|" + request.value;
        request.enabled = true;
        String now = Instant.now().toString();
        request.createdAt = now;
        request.updatedAt = now;
        return ResponseEntity.status(201).body(request);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RuleDto> updateRule(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        String[] parts = id.split("\\|");
        RuleDto r = new RuleDto();
        if (parts.length == 2) {
            r.type = parts[0];
            r.value = parts[1];
        }
        r.id = id;
        r.enabled = true;
        if (updates.containsKey("enabled")) {
            r.enabled = (Boolean) updates.get("enabled");
            if (!r.enabled) {
                if ("ip".equals(r.type)) ruleManager.unblockIp(r.value);
                else if ("application".equals(r.type)) {
                    AppType app = AppType.fromDisplayName(r.value);
                    if (app != null) ruleManager.unblockApp(app);
                } else if ("domain".equals(r.type)) ruleManager.unblockDomain(r.value);
            } else {
                if ("ip".equals(r.type)) ruleManager.blockIp(r.value);
                else if ("application".equals(r.type)) {
                    AppType app = AppType.fromDisplayName(r.value);
                    if (app != null) ruleManager.blockApp(app);
                } else if ("domain".equals(r.type)) ruleManager.blockDomain(r.value);
            }
        }
        return ResponseEntity.ok(r);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteRule(@PathVariable String id) {
        String[] parts = id.split("\\|");
        if (parts.length == 2) {
            String type = parts[0];
            String value = parts[1];
            if ("ip".equals(type)) ruleManager.unblockIp(value);
            else if ("application".equals(type)) {
                AppType app = AppType.fromDisplayName(value);
                if (app != null) ruleManager.unblockApp(app);
            }
            else if ("domain".equals(type)) ruleManager.unblockDomain(value);
        }
        return ResponseEntity.ok(Map.of("ok", true));
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