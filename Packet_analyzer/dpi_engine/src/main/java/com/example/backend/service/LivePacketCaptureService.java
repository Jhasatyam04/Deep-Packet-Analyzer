package com.example.backend.service;
import com.dpi.engine.DeepPacketInspectionEngine;
import com.dpi.engine.TcpRstInjector;
import com.dpi.rules.BlockingRuleManager;
import org.pcap4j.core.BpfProgram;
import org.pcap4j.core.PcapHandle;
import org.pcap4j.core.PcapNetworkInterface;
import org.pcap4j.core.Pcaps;
import org.springframework.stereotype.Service;
import com.dpi.core.PacketAction;
import com.dpi.core.PacketJob;
import com.dpi.packet.RawPacket;
import com.dpi.packet.PcapFileHeader;
import org.pcap4j.core.PacketListener;
import org.pcap4j.packet.Packet;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
@Service
public class LivePacketCaptureService {
    private final BlockingRuleManager ruleManager;
    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private Thread captureThread;
    private PcapHandle captureHandle;
    private DeepPacketInspectionEngine engine;
    public LivePacketCaptureService(BlockingRuleManager ruleManager) {
        this.ruleManager = ruleManager;
        DeepPacketInspectionEngine.Config config = new DeepPacketInspectionEngine.Config();
        this.engine = new DeepPacketInspectionEngine(config, ruleManager);
        this.engine.initialize();
        this.engine.startLive();
    }
    public boolean isRunning() {
        return isRunning.get();
    }
    public DeepPacketInspectionEngine getEngine() {
        return engine;
    }
    public void simulateLiveTraffic(String pcapFile) {
        Thread simThread = new Thread(() -> {
            System.out.println("[LiveIDS] Simulating live traffic from " + pcapFile);
            com.dpi.packet.PcapFileReader reader = new com.dpi.packet.PcapFileReader();
            if (!reader.open(pcapFile)) {
                System.err.println("[LiveIDS] Failed to open PCAP for simulation");
                return;
            }
            com.dpi.packet.RawPacket raw = new com.dpi.packet.RawPacket();
            while (reader.readNextPacket(raw)) {
                engine.processLivePacket(raw);
                try {
                    Thread.sleep(10); 
                } catch (InterruptedException e) {
                    break;
                }
            }
            reader.close();
            System.out.println("[LiveIDS] Finished simulating traffic from " + pcapFile);
        }, "TrafficSimulator");
        simThread.start();
    }
    public void startLiveCapture() {
        if (isRunning.get()) return;
        try {
            List<PcapNetworkInterface> allDevs = Pcaps.findAllDevs();
            PcapNetworkInterface nif = null;
            PcapNetworkInterface wifiNif = null;
            PcapNetworkInterface ethNif = null;
            for (PcapNetworkInterface dev : allDevs) {
                if (!dev.isLoopBack() && dev.isUp() && dev.getAddresses().size() > 0) {
                    if (nif == null) nif = dev; 
                    String desc = dev.getDescription() != null ? dev.getDescription().toLowerCase() : "";
                    String name = dev.getName() != null ? dev.getName().toLowerCase() : "";
                    if (desc.contains("vmware") || desc.contains("virtual") || name.contains("vmware") || name.contains("virtual")) {
                        continue;
                    }
                    if (desc.contains("wi-fi") || desc.contains("wireless") || name.contains("wi-fi") || name.contains("wlan")) {
                        wifiNif = dev;
                    } else if (desc.contains("ethernet") || name.contains("ethernet") || name.contains("eth")) {
                        ethNif = dev;
                    }
                }
            }
            if (wifiNif != null) {
                nif = wifiNif;
            } else if (ethNif != null) {
                nif = ethNif;
            }
            if (nif == null) {
                throw new RuntimeException("No active network interface found for live capture.");
            }
            System.out.println("[LiveIDS] Binding to interface: " + nif.getName() + " (" + nif.getDescription() + ")");
            int snapLen = 65536;
            int timeout = 10;
            captureHandle = nif.openLive(snapLen, PcapNetworkInterface.PromiscuousMode.PROMISCUOUS, timeout);
            captureHandle.setFilter("tcp", BpfProgram.BpfCompileMode.OPTIMIZE);
            PcapHandle sendHandle = nif.openLive(snapLen, PcapNetworkInterface.PromiscuousMode.PROMISCUOUS, timeout);
            TcpRstInjector rstInjector = new TcpRstInjector(sendHandle);
            isRunning.set(true);
            engine.setCustomOutputHandler((job, action) -> {
                if (action == PacketAction.DROP) {
                    engine.getStats().droppedPackets.incrementAndGet();
                    System.out.println("[LiveIDS] DROPPING connection to IP " + job.getTuple().getDstIp());
                    try {
                        Packet pcapPacket = org.pcap4j.packet.EthernetPacket.newPacket(job.getData(), 0, job.getData().length);
                        rstInjector.injectRst(pcapPacket);
                    } catch (Exception e) {
                        System.err.println("[LiveIDS] Failed to forge RST: " + e.getMessage());
                    }
                } else {
                    engine.getStats().forwardedPackets.incrementAndGet();
                }
            });
            captureThread = new Thread(() -> {
                try {
                    PacketListener listener = new PacketListener() {
                        @Override
                        public void gotPacket(Packet packet) {
                            if (!isRunning.get()) return;
                            byte[] packetBytes = packet.getRawData();
                            RawPacket raw = new RawPacket();
                            raw.data = packetBytes;
                            long now = System.currentTimeMillis();
                            raw.header.tsSec = (int) (now / 1000);
                            raw.header.tsUsec = (int) ((now % 1000) * 1000);
                            raw.header.inclLen = packetBytes.length;
                            raw.header.origLen = packetBytes.length;
                            engine.processLivePacket(raw);
                        }
                    };
                    captureHandle.loop(-1, listener);
                } catch (Exception e) {
                    System.err.println("[LiveIDS] Capture loop ended: " + e.getMessage());
                }
            }, "LiveCapture");
            captureThread.start();
            System.out.println("[LiveIDS] Live network capture started.");
        } catch (Exception e) {
            e.printStackTrace();
            isRunning.set(false);
        }
    }
    public void stopLiveCapture() {
        if (!isRunning.get()) return;
        isRunning.set(false);
        if (captureHandle != null && captureHandle.isOpen()) {
            try {
                captureHandle.breakLoop();
                captureHandle.close();
            } catch (Exception ignored) {}
        }
        System.out.println("[LiveIDS] Live network capture stopped.");
    }
}