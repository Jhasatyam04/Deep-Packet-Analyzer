package com.example.backend.service;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
@Service
public class DirectoryMonitorService {
    @Value("${dpi.pcap.dropzone:pcap_dropzone}")
    private String dropzoneDir;
    @Value("${dpi.pcap.output:pcap_processed}")
    private String outputDir;
    private final DpiExecutionService executionService;
    private final Set<String> processedFiles = new HashSet<>();
    public DirectoryMonitorService(DpiExecutionService executionService) {
        this.executionService = executionService;
    }
    @PostConstruct
    public void init() throws Exception {
        Files.createDirectories(Paths.get(dropzoneDir));
        Files.createDirectories(Paths.get(outputDir));
        System.out.println("Monitoring directory: " + dropzoneDir);
    }
    @Scheduled(fixedDelay = 5000)
    public void checkDirectory() {
        File dir = new File(dropzoneDir);
        File[] files = dir.listFiles((d, name) -> name.endsWith(".pcap"));
        if (files == null) return;
        for (File file : files) {
            String absPath = file.getAbsolutePath();
            if (!processedFiles.contains(absPath)) {
                System.out.println("New PCAP detected: " + absPath);
                processedFiles.add(absPath);
                String outPath = Paths.get(outputDir, "out_" + file.getName()).toString();
                try {
                    executionService.processPcapFile(absPath, outPath);
                } catch (Exception e) {
                    System.err.println("Error processing PCAP: " + e.getMessage());
                }
            }
        }
    }
}