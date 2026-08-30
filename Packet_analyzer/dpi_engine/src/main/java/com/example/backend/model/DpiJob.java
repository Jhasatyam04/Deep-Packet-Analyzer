package com.example.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "dpi_jobs")
public class DpiJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String filename;
    private String status;
    private LocalDateTime processedAt;
    private long totalPackets;
    private long totalBytes;
    private long tcpPackets;
    private long udpPackets;
    private long forwarded;
    private long dropped;
    private double dropRate;
    @Column(columnDefinition = "TEXT")
    private String classificationsJson;
    public DpiJob() {}
    public DpiJob(String filename, String status) {
        this.filename = filename;
        this.status = status;
        this.processedAt = LocalDateTime.now();
    }
    public Long getId() { return id; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
    public long getTotalPackets() { return totalPackets; }
    public void setTotalPackets(long totalPackets) { this.totalPackets = totalPackets; }
    public long getTotalBytes() { return totalBytes; }
    public void setTotalBytes(long totalBytes) { this.totalBytes = totalBytes; }
    public long getTcpPackets() { return tcpPackets; }
    public void setTcpPackets(long tcpPackets) { this.tcpPackets = tcpPackets; }
    public long getUdpPackets() { return udpPackets; }
    public void setUdpPackets(long udpPackets) { this.udpPackets = udpPackets; }
    public long getForwarded() { return forwarded; }
    public void setForwarded(long forwarded) { this.forwarded = forwarded; }
    public long getDropped() { return dropped; }
    public void setDropped(long dropped) { this.dropped = dropped; }
    public double getDropRate() { return dropRate; }
    public void setDropRate(double dropRate) { this.dropRate = dropRate; }
    public String getClassificationsJson() { return classificationsJson; }
    public void setClassificationsJson(String classificationsJson) { this.classificationsJson = classificationsJson; }
}