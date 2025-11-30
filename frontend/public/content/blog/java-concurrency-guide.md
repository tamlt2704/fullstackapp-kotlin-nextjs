---
title: "Java Concurrency Complete Guide"
date: "2024-12-08"
category: "Backend"
tags: ["Java", "Concurrency", "Multithreading", "Performance", "Advanced"]
---

# Java Concurrency Complete Guide

*Published on December 8, 2024*

## 1. Java Concurrency Fundamentals

### What is Concurrency?
Concurrency is the ability to execute multiple tasks simultaneously, improving application performance and responsiveness. Java provides rich concurrency support through threads, synchronization mechanisms, and high-level utilities.

### Thread Basics
```java
// Creating threads
public class ThreadExample {
    // Method 1: Extending Thread class
    static class MyThread extends Thread {
        @Override
        public void run() {
            System.out.println("Thread: " + Thread.currentThread().getName());
        }
    }
    
    // Method 2: Implementing Runnable interface
    static class MyRunnable implements Runnable {
        @Override
        public void run() {
            System.out.println("Runnable: " + Thread.currentThread().getName());
        }
    }
    
    public static void main(String[] args) {
        // Start threads
        new MyThread().start();
        new Thread(new MyRunnable()).start();
        
        // Lambda expression
        new Thread(() -> {
            System.out.println("Lambda: " + Thread.currentThread().getName());
        }).start();
    }
}
```

### Thread States
```java
public class ThreadStates {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        System.out.println("NEW: " + thread.getState());
        
        thread.start();
        System.out.println("RUNNABLE: " + thread.getState());
        
        Thread.sleep(100);
        System.out.println("TIMED_WAITING: " + thread.getState());
        
        thread.join();
        System.out.println("TERMINATED: " + thread.getState());
    }
}
```

### Q&A: Java Concurrency Fundamentals

**Q1: What's the difference between Thread and Runnable?**
A: Thread is a class, Runnable is an interface. Implementing Runnable is preferred as it allows extending other classes and promotes composition.

**Q2: What happens when you call run() instead of start()?**
A: run() executes in the current thread, start() creates a new thread and calls run() in that new thread.

**Q3: What are the different thread states in Java?**
A: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.

**Q4: What's the difference between sleep() and wait()?**
A: sleep() doesn't release locks, wait() releases the object's monitor lock and must be called within synchronized block.

**Q5: How do you handle InterruptedException?**
A: Either propagate it or restore the interrupt status with Thread.currentThread().interrupt().

## 2. Synchronization Mechanisms

### Synchronized Keyword
```java
public class SynchronizedExample {
    private int count = 0;
    private final Object lock = new Object();
    
    // Synchronized method
    public synchronized void incrementMethod() {
        count++;
    }
    
    // Synchronized block on this
    public void incrementBlock() {
        synchronized (this) {
            count++;
        }
    }
    
    // Synchronized block on custom object
    public void incrementCustomLock() {
        synchronized (lock) {
            count++;
        }
    }
    
    // Static synchronized method
    public static synchronized void staticMethod() {
        // Synchronized on class object
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

### Volatile Keyword
```java
public class VolatileExample {
    private volatile boolean flag = false;
    private volatile int counter = 0;
    
    public void writer() {
        counter = 42;
        flag = true;  // Memory barrier - ensures counter write is visible
    }
    
    public void reader() {
        if (flag) {  // Memory barrier - ensures fresh read of counter
            System.out.println("Counter: " + counter);  // Will see 42
        }
    }
}
```

### Atomic Classes
```java
import java.util.concurrent.atomic.*;

public class AtomicExample {
    private AtomicInteger atomicCounter = new AtomicInteger(0);
    private AtomicReference<String> atomicString = new AtomicReference<>("initial");
    private AtomicBoolean atomicFlag = new AtomicBoolean(false);
    
    public void atomicOperations() {
        // Atomic increment
        int newValue = atomicCounter.incrementAndGet();
        
        // Compare and swap
        boolean success = atomicCounter.compareAndSet(1, 2);
        
        // Atomic update with function
        atomicCounter.updateAndGet(x -> x * 2);
        
        // Atomic reference operations
        String oldValue = atomicString.getAndSet("new value");
        atomicString.compareAndSet("new value", "newer value");
    }
}
```

### Locks
```java
import java.util.concurrent.locks.*;

public class LockExample {
    private final ReentrantLock lock = new ReentrantLock();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();
    private int value = 0;
    
    // ReentrantLock usage
    public void updateWithLock() {
        lock.lock();
        try {
            value++;
        } finally {
            lock.unlock();
        }
    }
    
    // Try lock with timeout
    public boolean tryUpdate() {
        try {
            if (lock.tryLock(1, TimeUnit.SECONDS)) {
                try {
                    value++;
                    return true;
                } finally {
                    lock.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return false;
    }
    
    // ReadWriteLock usage
    public int readValue() {
        readLock.lock();
        try {
            return value;
        } finally {
            readLock.unlock();
        }
    }
    
    public void writeValue(int newValue) {
        writeLock.lock();
        try {
            value = newValue;
        } finally {
            writeLock.unlock();
        }
    }
}
```

### Q&A: Synchronization Mechanisms

**Q1: What's the difference between synchronized and ReentrantLock?**
A: ReentrantLock offers more features: tryLock(), timed locking, interruptible locking, and condition variables. Synchronized is simpler and has less overhead.

**Q2: When should you use volatile?**
A: For simple flags or variables that are written by one thread and read by others, when you need visibility guarantees without full synchronization.

**Q3: What's the difference between atomic operations and synchronized blocks?**
A: Atomic operations are lock-free and generally faster for simple operations. Synchronized blocks can protect multiple operations as a unit.

**Q4: What are the benefits of ReadWriteLock?**
A: Allows multiple concurrent readers when no writer is active, improving performance for read-heavy workloads.

**Q5: What is lock fairness and when should you use it?**
A: Fair locks grant access in FIFO order, preventing starvation but with performance cost. Use when fairness is more important than throughput.

## 3. Thread Pools and Executors

### Executor Framework
```java
import java.util.concurrent.*;

public class ExecutorExample {
    public static void main(String[] args) {
        // Fixed thread pool
        ExecutorService fixedPool = Executors.newFixedThreadPool(4);
        
        // Cached thread pool
        ExecutorService cachedPool = Executors.newCachedThreadPool();
        
        // Single thread executor
        ExecutorService singleExecutor = Executors.newSingleThreadExecutor();
        
        // Scheduled executor
        ScheduledExecutorService scheduledExecutor = Executors.newScheduledThreadPool(2);
        
        // Submit tasks
        Future<String> future = fixedPool.submit(() -> {
            Thread.sleep(1000);
            return "Task completed";
        });
        
        // Schedule tasks
        scheduledExecutor.schedule(() -> {
            System.out.println("Delayed task");
        }, 5, TimeUnit.SECONDS);
        
        scheduledExecutor.scheduleAtFixedRate(() -> {
            System.out.println("Periodic task");
        }, 0, 1, TimeUnit.SECONDS);
        
        // Shutdown executors
        fixedPool.shutdown();
        try {
            if (!fixedPool.awaitTermination(60, TimeUnit.SECONDS)) {
                fixedPool.shutdownNow();
            }
        } catch (InterruptedException e) {
            fixedPool.shutdownNow();
        }
    }
}
```

### Custom ThreadPoolExecutor
```java
public class CustomThreadPool {
    public static void main(String[] args) {
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
            2,                              // corePoolSize
            4,                              // maximumPoolSize
            60L,                            // keepAliveTime
            TimeUnit.SECONDS,               // time unit
            new LinkedBlockingQueue<>(100), // work queue
            new ThreadFactory() {           // thread factory
                private int counter = 0;
                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r, "CustomThread-" + counter++);
                    t.setDaemon(false);
                    return t;
                }
            },
            new ThreadPoolExecutor.CallerRunsPolicy() // rejection policy
        );
        
        // Monitor thread pool
        executor.prestartAllCoreThreads();
        
        // Submit tasks
        for (int i = 0; i < 10; i++) {
            final int taskId = i;
            executor.submit(() -> {
                System.out.println("Task " + taskId + " executed by " + 
                    Thread.currentThread().getName());
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }
        
        // Monitor statistics
        System.out.println("Active threads: " + executor.getActiveCount());
        System.out.println("Pool size: " + executor.getPoolSize());
        System.out.println("Queue size: " + executor.getQueue().size());
        
        executor.shutdown();
    }
}
```

### CompletableFuture
```java
import java.util.concurrent.CompletableFuture;

public class CompletableFutureExample {
    public static void main(String[] args) {
        // Simple async computation
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return "Hello";
        });
        
        // Chain operations
        CompletableFuture<String> result = future
            .thenApply(s -> s + " World")
            .thenApply(String::toUpperCase)
            .thenCompose(s -> CompletableFuture.supplyAsync(() -> s + "!"));
        
        // Handle exceptions
        CompletableFuture<String> handled = result
            .exceptionally(throwable -> {
                System.err.println("Error: " + throwable.getMessage());
                return "Default value";
            });
        
        // Combine multiple futures
        CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> "Hello");
        CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> "World");
        
        CompletableFuture<String> combined = future1.thenCombine(future2, 
            (s1, s2) -> s1 + " " + s2);
        
        // Wait for all
        CompletableFuture<Void> allOf = CompletableFuture.allOf(future1, future2);
        
        // Wait for any
        CompletableFuture<Object> anyOf = CompletableFuture.anyOf(future1, future2);
        
        // Get result (blocking)
        try {
            String finalResult = combined.get(5, TimeUnit.SECONDS);
            System.out.println(finalResult);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Q&A: Thread Pools and Executors

**Q1: What's the difference between submit() and execute()?**
A: submit() returns a Future and can handle Callable tasks; execute() returns void and only handles Runnable tasks.

**Q2: When should you use different types of thread pools?**
A: FixedThreadPool for known workload, CachedThreadPool for many short tasks, SingleThreadExecutor for sequential execution.

**Q3: What are the different rejection policies?**
A: AbortPolicy (throws exception), CallerRunsPolicy (runs in caller thread), DiscardPolicy (silently discards), DiscardOldestPolicy (discards oldest).

**Q4: How do you handle exceptions in CompletableFuture?**
A: Use exceptionally(), handle(), or whenComplete() methods to process exceptions and provide fallback values.

**Q5: What's the difference between thenApply() and thenCompose()?**
A: thenApply() transforms the result; thenCompose() flattens nested CompletableFutures (like flatMap).

## 4. Concurrent Collections

### Thread-Safe Collections
```java
import java.util.concurrent.*;

public class ConcurrentCollectionsExample {
    public static void main(String[] args) {
        // ConcurrentHashMap
        ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("key1", 1);
        concurrentMap.putIfAbsent("key2", 2);
        concurrentMap.compute("key1", (key, value) -> value + 1);
        concurrentMap.merge("key3", 1, Integer::sum);
        
        // CopyOnWriteArrayList - good for read-heavy scenarios
        CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>();
        cowList.add("item1");
        cowList.add("item2");
        
        // BlockingQueue implementations
        BlockingQueue<String> arrayQueue = new ArrayBlockingQueue<>(10);
        BlockingQueue<String> linkedQueue = new LinkedBlockingQueue<>();
        BlockingQueue<String> priorityQueue = new PriorityBlockingQueue<>();
        BlockingQueue<String> synchronousQueue = new SynchronousQueue<>();
        
        // Producer-Consumer with BlockingQueue
        ExecutorService executor = Executors.newFixedThreadPool(4);
        
        // Producer
        executor.submit(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    arrayQueue.put("Item " + i);
                    System.out.println("Produced: Item " + i);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        // Consumer
        executor.submit(() -> {
            try {
                while (true) {
                    String item = arrayQueue.take();
                    System.out.println("Consumed: " + item);
                    Thread.sleep(200);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        executor.shutdown();
    }
}
```

### Custom Concurrent Data Structures
```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ThreadSafeCounter {
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private long count = 0;
    
    public void increment() {
        lock.writeLock().lock();
        try {
            count++;
        } finally {
            lock.writeLock().unlock();
        }
    }
    
    public long getCount() {
        lock.readLock().lock();
        try {
            return count;
        } finally {
            lock.readLock().unlock();
        }
    }
}

// Lock-free implementation using AtomicLong
public class LockFreeCounter {
    private final AtomicLong count = new AtomicLong(0);
    
    public void increment() {
        count.incrementAndGet();
    }
    
    public long getCount() {
        return count.get();
    }
}
```

### Producer-Consumer Pattern
```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class ProducerConsumerExample {
    private static final int BUFFER_SIZE = 10;
    private static final BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(BUFFER_SIZE);
    
    static class Producer implements Runnable {
        @Override
        public void run() {
            try {
                for (int i = 0; i < 20; i++) {
                    queue.put(i);
                    System.out.println("Produced: " + i);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    static class Consumer implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    Integer item = queue.take();
                    System.out.println("Consumed: " + item);
                    Thread.sleep(150);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    public static void main(String[] args) {
        Thread producer = new Thread(new Producer());
        Thread consumer1 = new Thread(new Consumer());
        Thread consumer2 = new Thread(new Consumer());
        
        producer.start();
        consumer1.start();
        consumer2.start();
    }
}
```

### Q&A: Concurrent Collections

**Q1: When should you use ConcurrentHashMap vs Collections.synchronizedMap()?**
A: ConcurrentHashMap offers better performance with segment-based locking and atomic operations. SynchronizedMap synchronizes the entire map.

**Q2: What's the difference between BlockingQueue implementations?**
A: ArrayBlockingQueue (bounded, array-based), LinkedBlockingQueue (optionally bounded, linked nodes), PriorityBlockingQueue (unbounded, priority-ordered).

**Q3: When should you use CopyOnWriteArrayList?**
A: For read-heavy scenarios where writes are infrequent, as it creates a new copy on every write operation.

**Q4: What's the performance characteristic of ConcurrentHashMap?**
A: O(1) average case for get/put operations, with high concurrency through segment-based locking (Java 7) or CAS operations (Java 8+).

**Q5: How does SynchronousQueue work?**
A: It has no internal capacity; each put operation must wait for a corresponding take operation and vice versa.

## 5. Advanced Concurrency Patterns

### Fork-Join Framework
```java
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveTask;

public class ForkJoinExample {
    // Recursive task for parallel computation
    static class SumTask extends RecursiveTask<Long> {
        private static final int THRESHOLD = 1000;
        private final int[] array;
        private final int start;
        private final int end;
        
        public SumTask(int[] array, int start, int end) {
            this.array = array;
            this.start = start;
            this.end = end;
        }
        
        @Override
        protected Long compute() {
            if (end - start <= THRESHOLD) {
                // Base case: compute directly
                long sum = 0;
                for (int i = start; i < end; i++) {
                    sum += array[i];
                }
                return sum;
            } else {
                // Recursive case: split the task
                int mid = (start + end) / 2;
                SumTask leftTask = new SumTask(array, start, mid);
                SumTask rightTask = new SumTask(array, mid, end);
                
                // Fork the left task
                leftTask.fork();
                
                // Compute right task in current thread
                long rightResult = rightTask.compute();
                
                // Join the left task
                long leftResult = leftTask.join();
                
                return leftResult + rightResult;
            }
        }
    }
    
    public static void main(String[] args) {
        int[] array = new int[10000];
        for (int i = 0; i < array.length; i++) {
            array[i] = i + 1;
        }
        
        ForkJoinPool pool = new ForkJoinPool();
        SumTask task = new SumTask(array, 0, array.length);
        
        long startTime = System.currentTimeMillis();
        Long result = pool.invoke(task);
        long endTime = System.currentTimeMillis();
        
        System.out.println("Sum: " + result);
        System.out.println("Time: " + (endTime - startTime) + "ms");
        
        pool.shutdown();
    }
}
```

### Parallel Streams
```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

public class ParallelStreamsExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Sequential processing
        long sequentialSum = numbers.stream()
            .mapToInt(Integer::intValue)
            .map(n -> n * n)
            .sum();
        
        // Parallel processing
        long parallelSum = numbers.parallelStream()
            .mapToInt(Integer::intValue)
            .map(n -> n * n)
            .sum();
        
        // Parallel range processing
        long rangeSum = IntStream.range(1, 1000000)
            .parallel()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .sum();
        
        // Custom parallel processing with reduce
        int parallelProduct = numbers.parallelStream()
            .reduce(1, 
                (a, b) -> a * b,           // accumulator
                (a, b) -> a * b);          // combiner
        
        System.out.println("Sequential sum: " + sequentialSum);
        System.out.println("Parallel sum: " + parallelSum);
        System.out.println("Range sum: " + rangeSum);
        System.out.println("Parallel product: " + parallelProduct);
    }
}
```

### Synchronization Utilities
```java
import java.util.concurrent.*;

public class SynchronizationUtilities {
    public static void main(String[] args) throws InterruptedException {
        // CountDownLatch - wait for multiple threads to complete
        CountDownLatch latch = new CountDownLatch(3);
        
        for (int i = 0; i < 3; i++) {
            new Thread(() -> {
                try {
                    Thread.sleep(1000);
                    System.out.println("Task completed by " + Thread.currentThread().getName());
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();
                }
            }).start();
        }
        
        latch.await(); // Wait for all tasks to complete
        System.out.println("All tasks completed");
        
        // CyclicBarrier - synchronize threads at a barrier point
        CyclicBarrier barrier = new CyclicBarrier(3, () -> {
            System.out.println("All threads reached the barrier");
        });
        
        for (int i = 0; i < 3; i++) {
            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " working...");
                    Thread.sleep(1000);
                    System.out.println(Thread.currentThread().getName() + " reached barrier");
                    barrier.await();
                    System.out.println(Thread.currentThread().getName() + " continuing...");
                } catch (InterruptedException | BrokenBarrierException e) {
                    Thread.currentThread().interrupt();
                }
            }).start();
        }
        
        // Semaphore - control access to a resource
        Semaphore semaphore = new Semaphore(2); // Allow 2 concurrent accesses
        
        for (int i = 0; i < 5; i++) {
            new Thread(() -> {
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + " acquired semaphore");
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    System.out.println(Thread.currentThread().getName() + " released semaphore");
                    semaphore.release();
                }
            }).start();
        }
        
        // Exchanger - exchange data between two threads
        Exchanger<String> exchanger = new Exchanger<>();
        
        new Thread(() -> {
            try {
                String data = "Data from thread 1";
                String received = exchanger.exchange(data);
                System.out.println("Thread 1 received: " + received);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
        
        new Thread(() -> {
            try {
                String data = "Data from thread 2";
                String received = exchanger.exchange(data);
                System.out.println("Thread 2 received: " + received);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}
```

### Q&A: Advanced Concurrency Patterns

**Q1: When should you use Fork-Join framework vs regular thread pools?**
A: Fork-Join is ideal for recursive, divide-and-conquer algorithms. Regular thread pools are better for independent tasks.

**Q2: What are the performance considerations for parallel streams?**
A: Overhead of parallelization, data size, computation complexity, and available CPU cores. Not always faster than sequential.

**Q3: What's the difference between CountDownLatch and CyclicBarrier?**
A: CountDownLatch is one-time use, threads wait for countdown to zero. CyclicBarrier is reusable, threads wait for each other.

**Q4: When should you use Semaphore?**
A: To control access to a limited resource pool, like database connections or file handles.

**Q5: What's work-stealing in Fork-Join framework?**
A: Idle threads steal work from busy threads' queues, improving load balancing and CPU utilization.

## 6. Performance and Best Practices

### Thread Safety Best Practices
```java
// Immutable objects are inherently thread-safe
public final class ImmutablePoint {
    private final int x;
    private final int y;
    
    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public int getX() { return x; }
    public int getY() { return y; }
    
    public ImmutablePoint move(int dx, int dy) {
        return new ImmutablePoint(x + dx, y + dy);
    }
}

// Thread-local storage
public class ThreadLocalExample {
    private static final ThreadLocal<SimpleDateFormat> dateFormat = 
        ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
    
    public String formatDate(Date date) {
        return dateFormat.get().format(date);
    }
}

// Double-checked locking for lazy initialization
public class Singleton {
    private volatile static Singleton instance;
    
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

### Performance Monitoring
```java
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;

public class PerformanceMonitoring {
    public static void monitorThreads() {
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        
        System.out.println("Thread count: " + threadBean.getThreadCount());
        System.out.println("Peak thread count: " + threadBean.getPeakThreadCount());
        System.out.println("Daemon thread count: " + threadBean.getDaemonThreadCount());
        
        // Get thread info
        long[] threadIds = threadBean.getAllThreadIds();
        for (long threadId : threadIds) {
            ThreadInfo info = threadBean.getThreadInfo(threadId);
            if (info != null) {
                System.out.println("Thread: " + info.getThreadName() + 
                    ", State: " + info.getThreadState());
            }
        }
        
        // Detect deadlocks
        long[] deadlockedThreads = threadBean.findDeadlockedThreads();
        if (deadlockedThreads != null) {
            System.out.println("Deadlocked threads detected: " + deadlockedThreads.length);
        }
    }
    
    // Measure execution time
    public static void measureExecutionTime(Runnable task) {
        long startTime = System.nanoTime();
        task.run();
        long endTime = System.nanoTime();
        
        System.out.println("Execution time: " + (endTime - startTime) / 1_000_000 + " ms");
    }
}
```

### Common Concurrency Issues
```java
// Race condition example
public class RaceConditionExample {
    private int counter = 0;
    
    // Unsafe increment
    public void unsafeIncrement() {
        counter++; // Read-modify-write operation, not atomic
    }
    
    // Safe increment
    public synchronized void safeIncrement() {
        counter++;
    }
}

// Deadlock example
public class DeadlockExample {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized (lock1) {
            System.out.println("Method1: Acquired lock1");
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            synchronized (lock2) {
                System.out.println("Method1: Acquired lock2");
            }
        }
    }
    
    public void method2() {
        synchronized (lock2) {
            System.out.println("Method2: Acquired lock2");
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            synchronized (lock1) {
                System.out.println("Method2: Acquired lock1");
            }
        }
    }
}
```

### Q&A: Performance and Best Practices

**Q1: What are the main causes of poor concurrency performance?**
A: Excessive synchronization, lock contention, false sharing, context switching overhead, and inappropriate thread pool sizing.

**Q2: How do you detect and prevent deadlocks?**
A: Use consistent lock ordering, timeout-based locking, deadlock detection tools, and avoid nested locks when possible.

**Q3: What is false sharing and how do you prevent it?**
A: When threads modify variables in the same cache line, causing cache invalidation. Prevent with padding or @Contended annotation.

**Q4: How do you choose the right thread pool size?**
A: For CPU-bound tasks: number of cores. For I/O-bound tasks: higher number based on blocking factor and response time requirements.

**Q5: What are the best practices for exception handling in concurrent code?**
A: Always handle InterruptedException properly, use UncaughtExceptionHandler, and ensure resources are cleaned up in finally blocks.

---

*This comprehensive Java concurrency guide covers fundamental concepts to advanced patterns and performance optimization. Practice with real-world scenarios and always consider thread safety in your designs.*