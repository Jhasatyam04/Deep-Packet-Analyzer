package com.dpi.engine;
import com.dpi.core.*;
import com.dpi.threading.BoundedBlockingPacketQueue;
import java.util.ArrayList;
import java.util.List;
public class LoadBalancerPool {
    private final List<HashBasedLoadBalancer> lbs = new ArrayList<>();
    private final int fpsPerLb;
    public LoadBalancerPool(int numLbs, int fpsPerLb,
                            List<BoundedBlockingPacketQueue<PacketJob>> fpQueues) {
        this.fpsPerLb = fpsPerLb;
        for (int lbId = 0; lbId < numLbs; lbId++) {
            int fpStart = lbId * fpsPerLb;
            List<BoundedBlockingPacketQueue<PacketJob>> lbFpQueues = new ArrayList<>();
            for (int i = 0; i < fpsPerLb; i++) {
                lbFpQueues.add(fpQueues.get(fpStart + i));
            }
            lbs.add(new HashBasedLoadBalancer(lbId, lbFpQueues, fpStart));
        }
        System.out.println("[LBManager] Created " + numLbs + " load balancers, " +
                fpsPerLb + " FPs each");
    }
    public void startAll() {
        for (HashBasedLoadBalancer lb : lbs) lb.start();
    }
    public void stopAll() {
        for (HashBasedLoadBalancer lb : lbs) lb.stop();
    }
    public HashBasedLoadBalancer getLbForPacket(FiveTuple tuple) {
        int hash = tuple.hashCode();
        int index = Math.floorMod(hash, lbs.size());
        return lbs.get(index);
    }
    public HashBasedLoadBalancer getLb(int id) { return lbs.get(id); }
    public int getNumLbs() { return lbs.size(); }
    public long getTotalReceived() {
        long total = 0;
        for (HashBasedLoadBalancer lb : lbs) total += lb.getPacketsReceived();
        return total;
    }
    public long getTotalDispatched() {
        long total = 0;
        for (HashBasedLoadBalancer lb : lbs) total += lb.getPacketsDispatched();
        return total;
    }
}