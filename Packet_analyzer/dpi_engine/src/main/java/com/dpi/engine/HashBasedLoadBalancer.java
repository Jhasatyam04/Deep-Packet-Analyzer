package com.dpi.engine;
import com.dpi.core.*;
import com.dpi.threading.BoundedBlockingPacketQueue;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
public class HashBasedLoadBalancer implements Runnable {
    private final int lbId;
    private final int fpStartId;
    private final List<BoundedBlockingPacketQueue<PacketJob>> fpQueues;
    private final int numFps;
    private final BoundedBlockingPacketQueue<PacketJob> inputQueue;
    private final AtomicLong packetsReceived = new AtomicLong();
    private final AtomicLong packetsDispatched = new AtomicLong();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private Thread thread;
    public HashBasedLoadBalancer(int lbId, List<BoundedBlockingPacketQueue<PacketJob>> fpQueues, int fpStartId) {
        this.lbId = lbId;
        this.fpQueues = fpQueues;
        this.fpStartId = fpStartId;
        this.numFps = fpQueues.size();
        this.inputQueue = new BoundedBlockingPacketQueue<>(10000);
    }
    public void start() {
        if (running.get()) return;
        running.set(true);
        thread = new Thread(this, "LB-" + lbId);
        thread.start();
        System.out.println("[LB" + lbId + "] Started (serving FP" + fpStartId +
                "-FP" + (fpStartId + numFps - 1) + ")");
    }
    public void stop() {
        if (!running.get()) return;
        running.set(false);
        inputQueue.shutdown();
        if (thread != null) {
            try { thread.join(); } catch (InterruptedException ignored) {}
        }
        System.out.println("[LB" + lbId + "] Stopped");
    }
    @Override
    public void run() {
        while (running.get()) {
            Optional<PacketJob> jobOpt = inputQueue.popWithTimeout(100);
            if (jobOpt.isEmpty()) continue;
            packetsReceived.incrementAndGet();
            int fpIndex = selectFp(jobOpt.get().getTuple());
            fpQueues.get(fpIndex).push(jobOpt.get());
            packetsDispatched.incrementAndGet();
        }
    }
    private int selectFp(FiveTuple tuple) {
        int hash = tuple.hashCode();
        return Math.floorMod(hash, numFps);
    }
    public BoundedBlockingPacketQueue<PacketJob> getInputQueue() { return inputQueue; }
    public int getLbId() { return lbId; }
    public boolean isRunning() { return running.get(); }
    public long getPacketsReceived() { return packetsReceived.get(); }
    public long getPacketsDispatched() { return packetsDispatched.get(); }
}