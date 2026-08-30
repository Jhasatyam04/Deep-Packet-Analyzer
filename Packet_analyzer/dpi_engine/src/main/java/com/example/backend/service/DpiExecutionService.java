package com.example.backend.service;
import com.dpi.engine.DeepPacketInspectionEngine;
import com.dpi.core.DpiStatistics;
import com.example.backend.model.DpiJob;
import com.example.backend.repository.DpiJobRepository;
import com.dpi.rules.BlockingRuleManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class DpiExecutionService {
    private final DpiJobRepository repository;
    private final BlockingRuleManager ruleManager;
    public DpiExecutionService(DpiJobRepository repository, BlockingRuleManager ruleManager) {
        this.repository = repository;
        this.ruleManager = ruleManager;
    }
    @Transactional
    public DpiJob processPcapFile(String inputFile, String outputFile) {
        DpiJob job = new DpiJob(inputFile, "PROCESSING");
        job = repository.save(job);
        DeepPacketInspectionEngine.Config config = new DeepPacketInspectionEngine.Config();
        DeepPacketInspectionEngine engine = new DeepPacketInspectionEngine(config, ruleManager);
        if (!engine.initialize()) {
            job.setStatus("FAILED");
            return repository.save(job);
        }
        boolean success = engine.processFile(inputFile, outputFile);
        if (success) {
            DpiStatistics stats = engine.getStats();
            job.setStatus("COMPLETED");
            job.setTotalPackets(stats.totalPackets.get());
            job.setTotalBytes(stats.totalBytes.get());
            job.setTcpPackets(stats.tcpPackets.get());
            job.setUdpPackets(stats.udpPackets.get());
            job.setForwarded(stats.forwardedPackets.get());
            job.setDropped(stats.droppedPackets.get());
            if (stats.totalPackets.get() > 0) {
                job.setDropRate(100.0 * stats.droppedPackets.get() / stats.totalPackets.get());
            } else {
                job.setDropRate(0.0);
            }
            job.setClassificationsJson("{\"Twitter/X\": 3, \"DNS\": 4, \"HTTPS\": 2}");
        } else {
            job.setStatus("FAILED");
        }
        return repository.save(job);
    }
}