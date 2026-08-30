package com.dpi.threading;
import java.util.LinkedList;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;
public class BoundedBlockingPacketQueue<T> {
    private final LinkedList<T> queue = new LinkedList<>();
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notEmpty = lock.newCondition();
    private final Condition notFull = lock.newCondition();
    private final int maxSize;
    private volatile boolean shutdown;
    public BoundedBlockingPacketQueue() {
        this(10000);
    }
    public BoundedBlockingPacketQueue(int maxSize) {
        this.maxSize = maxSize;
    }
    public void push(T item) {
        lock.lock();
        try {
            while (queue.size() >= maxSize && !shutdown) {
                try { notFull.await(); } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
            if (shutdown) return;
            queue.add(item);
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }
    public Optional<T> pop() {
        lock.lock();
        try {
            while (queue.isEmpty() && !shutdown) {
                try { notEmpty.await(); } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return Optional.empty();
                }
            }
            if (queue.isEmpty()) return Optional.empty();
            T item = queue.poll();
            notFull.signal();
            return Optional.of(item);
        } finally {
            lock.unlock();
        }
    }
    public Optional<T> popWithTimeout(long timeoutMs) {
        lock.lock();
        try {
            if (queue.isEmpty() && !shutdown) {
                try {
                    notEmpty.await(timeoutMs, TimeUnit.MILLISECONDS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return Optional.empty();
                }
            }
            if (queue.isEmpty()) return Optional.empty();
            T item = queue.poll();
            notFull.signal();
            return Optional.of(item);
        } finally {
            lock.unlock();
        }
    }
    public boolean isEmpty() {
        lock.lock();
        try { return queue.isEmpty(); } finally { lock.unlock(); }
    }
    public int size() {
        lock.lock();
        try { return queue.size(); } finally { lock.unlock(); }
    }
    public void shutdown() {
        lock.lock();
        try {
            shutdown = true;
            notEmpty.signalAll();
            notFull.signalAll();
        } finally {
            lock.unlock();
        }
    }
    public boolean isShutdown() {
        return shutdown;
    }
}