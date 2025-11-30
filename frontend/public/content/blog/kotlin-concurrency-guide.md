---
title: "Kotlin Concurrency Complete Guide"
date: "2024-12-09"
category: "Backend"
tags: ["Kotlin", "Concurrency", "Coroutines", "Async", "Performance"]
---

# Kotlin Concurrency Complete Guide

*Published on December 9, 2024*

## 1. Kotlin Coroutines Fundamentals

### What are Coroutines?
Coroutines are lightweight threads that can be suspended and resumed without blocking the underlying thread. They provide a way to write asynchronous code that looks and feels like synchronous code.

### Basic Coroutine Concepts
```kotlin
import kotlinx.coroutines.*

// Basic coroutine launch
fun main() = runBlocking {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}

// Async and await
suspend fun fetchUserData(): String {
    delay(1000L) // Simulate network call
    return "User data"
}

suspend fun fetchUserPosts(): List<String> {
    delay(800L) // Simulate network call
    return listOf("Post 1", "Post 2", "Post 3")
}

fun main() = runBlocking {
    val userData = async { fetchUserData() }
    val userPosts = async { fetchUserPosts() }
    
    println("User: ${userData.await()}")
    println("Posts: ${userPosts.await()}")
}
```

### Coroutine Builders
```kotlin
import kotlinx.coroutines.*

class CoroutineBuilders {
    
    // runBlocking - blocks current thread
    fun runBlockingExample() {
        runBlocking {
            delay(1000L)
            println("Blocking coroutine")
        }
    }
    
    // launch - fire and forget
    fun launchExample() = runBlocking {
        val job = launch {
            repeat(5) { i ->
                println("Coroutine $i")
                delay(500L)
            }
        }
        job.join() // Wait for completion
    }
    
    // async - returns Deferred<T>
    suspend fun asyncExample(): String = coroutineScope {
        val deferred1 = async { computeValue1() }
        val deferred2 = async { computeValue2() }
        
        "${deferred1.await()} ${deferred2.await()}"
    }
    
    private suspend fun computeValue1(): String {
        delay(1000L)
        return "Hello"
    }
    
    private suspend fun computeValue2(): String {
        delay(1000L)
        return "World"
    }
}
```

### Q&A: Kotlin Coroutines Fundamentals

**Q1: What's the difference between launch and async?**
A: launch returns Job and is used for fire-and-forget operations. async returns Deferred<T> and is used when you need a result.

**Q2: What's the difference between delay() and Thread.sleep()?**
A: delay() is a suspending function that doesn't block the thread. Thread.sleep() blocks the current thread.

**Q3: What is a suspending function?**
A: A function marked with suspend keyword that can be paused and resumed without blocking the thread.

**Q4: What's the difference between runBlocking and coroutineScope?**
A: runBlocking blocks the current thread until completion. coroutineScope suspends and doesn't block the thread.

**Q5: When should you use Job.join() vs Deferred.await()?**
A: Use join() to wait for completion without getting a result. Use await() to wait and get the result.

## 2. Coroutine Context and Dispatchers

### Coroutine Context
```kotlin
import kotlinx.coroutines.*
import kotlin.coroutines.CoroutineContext

class CoroutineContextExample {
    
    fun contextElements() = runBlocking {
        // Coroutine context contains multiple elements
        val job = Job()
        val dispatcher = Dispatchers.IO
        val handler = CoroutineExceptionHandler { _, exception ->
            println("Caught exception: $exception")
        }
        
        val context: CoroutineContext = job + dispatcher + handler
        
        launch(context) {
            println("Running in context: $coroutineContext")
            throw RuntimeException("Test exception")
        }
        
        job.join()
    }
    
    // Coroutine name for debugging
    fun namedCoroutines() = runBlocking {
        launch(CoroutineName("Background-Task")) {
            println("Coroutine name: ${coroutineContext[CoroutineName]}")
        }
    }
}
```

### Dispatchers
```kotlin
import kotlinx.coroutines.*

class DispatcherExamples {
    
    fun dispatcherTypes() = runBlocking {
        // Default dispatcher - CPU intensive work
        launch(Dispatchers.Default) {
            val result = heavyComputation()
            println("Computation result: $result")
        }
        
        // IO dispatcher - I/O operations
        launch(Dispatchers.IO) {
            val data = readFromFile()
            println("File data: $data")
        }
        
        // Main dispatcher - UI updates (Android/Desktop)
        // launch(Dispatchers.Main) {
        //     updateUI()
        // }
        
        // Unconfined dispatcher - not recommended for general use
        launch(Dispatchers.Unconfined) {
            println("Unconfined: ${Thread.currentThread().name}")
            delay(100)
            println("After delay: ${Thread.currentThread().name}")
        }
        
        // Custom dispatcher
        val customDispatcher = newFixedThreadPoolContext(4, "CustomPool")
        launch(customDispatcher) {
            println("Custom dispatcher: ${Thread.currentThread().name}")
        }
        customDispatcher.close()
    }
    
    private suspend fun heavyComputation(): Int {
        return withContext(Dispatchers.Default) {
            var result = 0
            repeat(1000000) {
                result += it
            }
            result
        }
    }
    
    private suspend fun readFromFile(): String {
        return withContext(Dispatchers.IO) {
            delay(100) // Simulate file I/O
            "File content"
        }
    }
}
```

### Thread Confinement
```kotlin
import kotlinx.coroutines.*
import java.util.concurrent.Executors

class ThreadConfinement {
    
    fun threadConfinementExample() = runBlocking {
        // Single-threaded context
        val singleThreadContext = newSingleThreadContext("MyThread")
        
        launch(singleThreadContext) {
            println("Working in: ${Thread.currentThread().name}")
            
            // Switch context temporarily
            withContext(Dispatchers.IO) {
                println("IO work in: ${Thread.currentThread().name}")
            }
            
            println("Back to: ${Thread.currentThread().name}")
        }
        
        singleThreadContext.close()
    }
    
    // Thread-local data
    val threadLocal = ThreadLocal<String>()
    
    fun threadLocalExample() = runBlocking {
        threadLocal.set("Main thread value")
        
        launch(Dispatchers.Default) {
            println("Default dispatcher: ${threadLocal.get()}")
            threadLocal.set("Background thread value")
            
            withContext(threadLocal.asContextElement()) {
                println("With thread local: ${threadLocal.get()}")
            }
        }
    }
}
```

### Q&A: Coroutine Context and Dispatchers

**Q1: Which dispatcher should you use for different types of work?**
A: Dispatchers.Default for CPU-intensive work, Dispatchers.IO for I/O operations, Dispatchers.Main for UI updates.

**Q2: What happens when you don't specify a dispatcher?**
A: The coroutine inherits the dispatcher from its parent coroutine or uses Dispatchers.Default if launched from runBlocking.

**Q3: What's the difference between withContext and launch?**
A: withContext switches context temporarily and returns a result. launch creates a new coroutine in the specified context.

**Q4: How do you handle thread-local data in coroutines?**
A: Use ThreadLocal.asContextElement() to propagate thread-local values across context switches.

**Q5: What's the purpose of CoroutineName?**
A: It's used for debugging and logging to identify specific coroutines in stack traces and logs.

## 3. Structured Concurrency

### Coroutine Scope
```kotlin
import kotlinx.coroutines.*

class StructuredConcurrencyExample {
    
    // Custom coroutine scope
    class MyService : CoroutineScope {
        private val job = SupervisorJob()
        override val coroutineContext = job + Dispatchers.Default
        
        fun startBackgroundWork() {
            launch {
                repeat(5) {
                    println("Background work $it")
                    delay(1000)
                }
            }
        }
        
        fun cleanup() {
            job.cancel()
        }
    }
    
    // Scope functions
    suspend fun scopeFunctions() {
        // coroutineScope - waits for all children
        coroutineScope {
            launch {
                delay(1000)
                println("Child 1 completed")
            }
            
            launch {
                delay(2000)
                println("Child 2 completed")
            }
            
            println("All children completed")
        }
        
        // supervisorScope - doesn't cancel siblings on failure
        supervisorScope {
            launch {
                delay(1000)
                throw RuntimeException("Child 1 failed")
            }
            
            launch {
                delay(2000)
                println("Child 2 completed successfully")
            }
        }
    }
}
```

### Job Hierarchy and Cancellation
```kotlin
import kotlinx.coroutines.*

class JobHierarchyExample {
    
    fun jobHierarchy() = runBlocking {
        val parentJob = launch {
            val child1 = launch {
                try {
                    delay(2000)
                    println("Child 1 completed")
                } catch (e: CancellationException) {
                    println("Child 1 cancelled")
                }
            }
            
            val child2 = launch {
                try {
                    delay(3000)
                    println("Child 2 completed")
                } catch (e: CancellationException) {
                    println("Child 2 cancelled")
                }
            }
            
            delay(1000)
            println("Parent work done")
        }
        
        delay(1500)
        parentJob.cancel() // Cancels parent and all children
        parentJob.join()
    }
    
    // Cooperative cancellation
    suspend fun cooperativeCancellation() = coroutineScope {
        val job = launch {
            repeat(1000) { i ->
                if (!isActive) {
                    println("Coroutine cancelled at iteration $i")
                    return@launch
                }
                
                // Or use ensureActive()
                ensureActive()
                
                // Simulate work
                Thread.sleep(10)
            }
        }
        
        delay(50)
        job.cancel()
    }
    
    // Non-cancellable block
    suspend fun nonCancellableExample() = coroutineScope {
        val job = launch {
            try {
                delay(1000)
            } catch (e: CancellationException) {
                withContext(NonCancellable) {
                    println("Cleanup work that cannot be cancelled")
                    delay(500) // This delay won't be cancelled
                }
                throw e
            }
        }
        
        delay(100)
        job.cancel()
    }
}
```

### Exception Handling
```kotlin
import kotlinx.coroutines.*

class ExceptionHandlingExample {
    
    fun exceptionPropagation() = runBlocking {
        // Exception in launch propagates to parent
        val handler = CoroutineExceptionHandler { _, exception ->
            println("Caught exception: $exception")
        }
        
        val scope = CoroutineScope(Job() + handler)
        
        scope.launch {
            throw RuntimeException("Exception in launch")
        }
        
        delay(100)
    }
    
    fun asyncExceptions() = runBlocking {
        // Exception in async is stored in Deferred
        val deferred = async {
            throw RuntimeException("Exception in async")
        }
        
        try {
            deferred.await()
        } catch (e: Exception) {
            println("Caught async exception: $e")
        }
    }
    
    fun supervisorJobExample() = runBlocking {
        supervisorScope {
            val child1 = launch {
                delay(1000)
                throw RuntimeException("Child 1 failed")
            }
            
            val child2 = launch {
                delay(2000)
                println("Child 2 completed")
            }
            
            // Child 1 failure doesn't affect child 2
        }
    }
}
```

### Q&A: Structured Concurrency

**Q1: What's the difference between Job and SupervisorJob?**
A: Job cancels all children when it fails. SupervisorJob only cancels the failing child, allowing siblings to continue.

**Q2: What happens when a child coroutine throws an exception?**
A: With regular Job, it cancels the parent and all siblings. With SupervisorJob, only the failing child is cancelled.

**Q3: How do you ensure proper cleanup in coroutines?**
A: Use try-finally blocks, withContext(NonCancellable) for critical cleanup, and structured concurrency principles.

**Q4: What's the difference between coroutineScope and supervisorScope?**
A: coroutineScope cancels all children if one fails. supervisorScope allows other children to continue.

**Q5: How do you handle exceptions in fire-and-forget coroutines?**
A: Use CoroutineExceptionHandler in the coroutine context or wrap the coroutine body in try-catch.

## 4. Channels and Flow

### Channels
```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

class ChannelExamples {
    
    // Basic channel usage
    fun basicChannel() = runBlocking {
        val channel = Channel<Int>()
        
        launch {
            for (x in 1..5) {
                channel.send(x * x)
            }
            channel.close()
        }
        
        for (y in channel) {
            println(y)
        }
    }
    
    // Producer-consumer pattern
    fun producerConsumer() = runBlocking {
        val channel = produce<Int> {
            for (x in 1..5) {
                send(x * x)
                delay(100)
            }
        }
        
        channel.consumeEach { value ->
            println("Received: $value")
        }
    }
    
    // Buffered channels
    fun bufferedChannels() = runBlocking {
        val channel = Channel<Int>(capacity = 4)
        
        val sender = launch {
            repeat(10) {
                println("Sending $it")
                channel.send(it)
            }
            channel.close()
        }
        
        delay(1000) // Let sender fill the buffer
        
        for (value in channel) {
            println("Received $value")
            delay(200)
        }
    }
    
    // Channel types
    fun channelTypes() = runBlocking {
        // Unlimited capacity
        val unlimited = Channel<Int>(Channel.UNLIMITED)
        
        // Conflated - keeps only latest value
        val conflated = Channel<Int>(Channel.CONFLATED)
        
        // Rendezvous - no buffer (default)
        val rendezvous = Channel<Int>(Channel.RENDEZVOUS)
        
        // Custom buffer size
        val buffered = Channel<Int>(10)
    }
}
```

### Flow
```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class FlowExamples {
    
    // Basic flow
    fun simpleFlow(): Flow<Int> = flow {
        for (i in 1..3) {
            delay(100)
            emit(i)
        }
    }
    
    fun basicFlowUsage() = runBlocking {
        simpleFlow().collect { value ->
            println(value)
        }
    }
    
    // Flow builders
    fun flowBuilders() = runBlocking {
        // flowOf
        flowOf(1, 2, 3, 4, 5).collect { println("flowOf: $it") }
        
        // asFlow
        (1..5).asFlow().collect { println("asFlow: $it") }
        
        // Flow from suspend function
        suspend fun fetchData(): String {
            delay(1000)
            return "Data"
        }
        
        flow { emit(fetchData()) }.collect { println("Suspend: $it") }
    }
    
    // Flow operators
    fun flowOperators() = runBlocking {
        (1..10).asFlow()
            .filter { it % 2 == 0 }
            .map { it * it }
            .take(3)
            .collect { println("Result: $it") }
        
        // Transform operator
        (1..3).asFlow()
            .transform { value ->
                emit("String $value")
                emit("Another $value")
            }
            .collect { println(it) }
    }
    
    // Flow context and dispatchers
    fun flowContext() = runBlocking {
        fun simple(): Flow<Int> = flow {
            println("Flow started on ${Thread.currentThread().name}")
            for (i in 1..3) {
                emit(i)
            }
        }.flowOn(Dispatchers.Default)
        
        simple()
            .collect { value ->
                println("Collected $value on ${Thread.currentThread().name}")
            }
    }
    
    // Exception handling in flows
    fun flowExceptions() = runBlocking {
        flow {
            for (i in 1..3) {
                println("Emitting $i")
                emit(i)
                if (i == 2) throw RuntimeException("Error at $i")
            }
        }
        .catch { e -> 
            println("Caught exception: $e")
            emit(-1) // Emit fallback value
        }
        .collect { println("Collected: $it") }
    }
}
```

### Advanced Flow Operations
```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class AdvancedFlowOperations {
    
    // Combining flows
    fun combiningFlows() = runBlocking {
        val flow1 = (1..5).asFlow().onEach { delay(100) }
        val flow2 = flowOf("A", "B", "C").onEach { delay(150) }
        
        // Zip - pairs elements
        flow1.zip(flow2) { a, b -> "$a$b" }
            .collect { println("Zip: $it") }
        
        // Combine - combines latest values
        flow1.combine(flow2) { a, b -> "$a$b" }
            .collect { println("Combine: $it") }
    }
    
    // Flattening flows
    fun flatteningFlows() = runBlocking {
        fun requestFlow(i: Int): Flow<String> = flow {
            emit("$i: First")
            delay(500)
            emit("$i: Second")
        }
        
        // flatMapConcat - sequential
        (1..3).asFlow()
            .onEach { delay(100) }
            .flatMapConcat { requestFlow(it) }
            .collect { println("flatMapConcat: $it") }
        
        // flatMapMerge - concurrent
        (1..3).asFlow()
            .onEach { delay(100) }
            .flatMapMerge { requestFlow(it) }
            .collect { println("flatMapMerge: $it") }
        
        // flatMapLatest - cancels previous
        (1..3).asFlow()
            .onEach { delay(100) }
            .flatMapLatest { requestFlow(it) }
            .collect { println("flatMapLatest: $it") }
    }
    
    // Flow completion
    fun flowCompletion() = runBlocking {
        (1..3).asFlow()
            .onEach { 
                if (it == 2) throw RuntimeException("Error")
            }
            .onCompletion { cause ->
                if (cause != null) {
                    println("Flow completed with exception: $cause")
                } else {
                    println("Flow completed successfully")
                }
            }
            .catch { /* Handle exception */ }
            .collect { println(it) }
    }
    
    // StateFlow and SharedFlow
    fun stateAndSharedFlow() = runBlocking {
        // StateFlow - holds state
        val stateFlow = MutableStateFlow(0)
        
        launch {
            repeat(5) {
                delay(100)
                stateFlow.value = it
            }
        }
        
        stateFlow.collect { println("State: $it") }
        
        // SharedFlow - hot stream
        val sharedFlow = MutableSharedFlow<Int>()
        
        launch {
            repeat(5) {
                delay(100)
                sharedFlow.emit(it)
            }
        }
        
        sharedFlow.collect { println("Shared: $it") }
    }
}
```

### Q&A: Channels and Flow

**Q1: What's the difference between Channel and Flow?**
A: Channel is hot (active regardless of consumers), Flow is cold (starts when collected). Channel is for communication, Flow is for data streams.

**Q2: When should you use StateFlow vs SharedFlow?**
A: StateFlow for state that has a current value (like UI state). SharedFlow for events that don't have a current value.

**Q3: What's the difference between flowOn and collect context?**
A: flowOn changes the context of upstream flow operations. collect runs in the context where it's called.

**Q4: How do you handle backpressure in flows?**
A: Use buffer(), conflate(), collectLatest(), or custom backpressure strategies with channels.

**Q5: What's the difference between flatMapConcat, flatMapMerge, and flatMapLatest?**
A: Concat processes sequentially, Merge processes concurrently, Latest cancels previous and processes only the latest.

## 5. Coroutines in Android and Spring

### Android Coroutines
```kotlin
// Android ViewModel with coroutines
class UserViewModel : ViewModel() {
    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> = _users
    
    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading
    
    fun loadUsers() {
        viewModelScope.launch {
            _loading.value = true
            try {
                val userList = userRepository.getUsers()
                _users.value = userList
            } catch (e: Exception) {
                // Handle error
            } finally {
                _loading.value = false
            }
        }
    }
}

// Repository with coroutines
class UserRepository {
    private val api = UserApi()
    
    suspend fun getUsers(): List<User> = withContext(Dispatchers.IO) {
        api.fetchUsers()
    }
    
    suspend fun getUserById(id: String): User = withContext(Dispatchers.IO) {
        api.fetchUser(id)
    }
}

// Retrofit with coroutines
interface UserApi {
    @GET("users")
    suspend fun fetchUsers(): List<User>
    
    @GET("users/{id}")
    suspend fun fetchUser(@Path("id") id: String): User
}
```

### Spring Boot with Coroutines
```kotlin
// Spring WebFlux with coroutines
@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {
    
    @GetMapping
    suspend fun getAllUsers(): List<User> {
        return userService.getAllUsers()
    }
    
    @GetMapping("/{id}")
    suspend fun getUserById(@PathVariable id: String): User {
        return userService.getUserById(id)
    }
    
    @PostMapping
    suspend fun createUser(@RequestBody user: User): User {
        return userService.createUser(user)
    }
}

// Service layer with coroutines
@Service
class UserService(private val userRepository: UserRepository) {
    
    suspend fun getAllUsers(): List<User> = withContext(Dispatchers.IO) {
        userRepository.findAll()
    }
    
    suspend fun getUserById(id: String): User = withContext(Dispatchers.IO) {
        userRepository.findById(id) ?: throw UserNotFoundException(id)
    }
    
    suspend fun createUser(user: User): User = withContext(Dispatchers.IO) {
        userRepository.save(user)
    }
}

// Repository interface
interface UserRepository {
    suspend fun findAll(): List<User>
    suspend fun findById(id: String): User?
    suspend fun save(user: User): User
}
```

### Testing Coroutines
```kotlin
import kotlinx.coroutines.test.*
import org.junit.Test

class CoroutineTest {
    
    @Test
    fun testCoroutineWithTestDispatcher() = runTest {
        val testDispatcher = StandardTestDispatcher()
        
        var result = ""
        
        launch(testDispatcher) {
            delay(1000)
            result = "completed"
        }
        
        // Advance time
        testScheduler.advanceTimeBy(1000)
        
        assertEquals("completed", result)
    }
    
    @Test
    fun testSuspendFunction() = runTest {
        val userService = UserService()
        
        val user = userService.getUserById("123")
        
        assertNotNull(user)
        assertEquals("123", user.id)
    }
    
    // Testing flows
    @Test
    fun testFlow() = runTest {
        val flow = flow {
            emit(1)
            delay(1000)
            emit(2)
        }
        
        val results = flow.toList()
        
        assertEquals(listOf(1, 2), results)
    }
}
```

### Q&A: Coroutines in Frameworks

**Q1: What's viewModelScope in Android?**
A: A coroutine scope tied to ViewModel lifecycle that automatically cancels coroutines when ViewModel is cleared.

**Q2: How do you handle configuration changes with coroutines in Android?**
A: Use ViewModel with viewModelScope, or SavedStateHandle for preserving state across configuration changes.

**Q3: What's the difference between runTest and runBlocking in tests?**
A: runTest provides a test scheduler for controlling virtual time, making tests faster and more deterministic.

**Q4: How do you use coroutines with Spring WebFlux?**
A: Spring WebFlux supports suspend functions natively, automatically handling the reactive streams conversion.

**Q5: How do you test flows in unit tests?**
A: Use runTest, toList() for collecting all values, or turbine library for more advanced flow testing.

## 6. Performance and Best Practices

### Performance Optimization
```kotlin
import kotlinx.coroutines.*

class PerformanceOptimization {
    
    // Avoid creating too many coroutines
    suspend fun efficientProcessing(items: List<String>) {
        // Bad: Creates coroutine for each item
        items.forEach { item ->
            launch {
                processItem(item)
            }
        }
        
        // Good: Process in batches
        items.chunked(100).forEach { batch ->
            launch {
                batch.forEach { processItem(it) }
            }
        }
    }
    
    // Use appropriate dispatchers
    suspend fun appropriateDispatchers() {
        // CPU-intensive work
        val result = withContext(Dispatchers.Default) {
            heavyComputation()
        }
        
        // I/O operations
        val data = withContext(Dispatchers.IO) {
            readFromDatabase()
        }
        
        // Don't switch context unnecessarily
        // Bad
        withContext(Dispatchers.IO) {
            withContext(Dispatchers.Default) {
                // Unnecessary context switch
            }
        }
    }
    
    // Efficient exception handling
    suspend fun efficientExceptionHandling() {
        try {
            coroutineScope {
                launch { riskyOperation1() }
                launch { riskyOperation2() }
            }
        } catch (e: Exception) {
            // Handle exceptions from any child
        }
    }
    
    private suspend fun processItem(item: String) {
        delay(10)
    }
    
    private suspend fun heavyComputation(): Int {
        return 42
    }
    
    private suspend fun readFromDatabase(): String {
        delay(100)
        return "data"
    }
    
    private suspend fun riskyOperation1() {
        delay(100)
    }
    
    private suspend fun riskyOperation2() {
        delay(100)
    }
}
```

### Best Practices
```kotlin
import kotlinx.coroutines.*

class BestPractices {
    
    // Always use structured concurrency
    class GoodService : CoroutineScope {
        private val job = SupervisorJob()
        override val coroutineContext = job + Dispatchers.Default
        
        fun startWork() {
            launch {
                // Work here
            }
        }
        
        fun cleanup() {
            job.cancel()
        }
    }
    
    // Proper cancellation handling
    suspend fun cancellationAware() {
        try {
            repeat(1000) { i ->
                ensureActive() // Check for cancellation
                // Do work
                yield() // Cooperative cancellation point
            }
        } catch (e: CancellationException) {
            // Cleanup if needed
            throw e // Re-throw cancellation
        }
    }
    
    // Use supervisorScope for independent operations
    suspend fun independentOperations() {
        supervisorScope {
            val job1 = launch { operation1() }
            val job2 = launch { operation2() }
            
            // If operation1 fails, operation2 continues
        }
    }
    
    // Proper resource management
    suspend fun resourceManagement() {
        val resource = acquireResource()
        try {
            withContext(NonCancellable) {
                // Critical cleanup that shouldn't be cancelled
                resource.use()
            }
        } finally {
            resource.close()
        }
    }
    
    private suspend fun operation1() {
        delay(1000)
    }
    
    private suspend fun operation2() {
        delay(1000)
    }
    
    private fun acquireResource(): AutoCloseable {
        return object : AutoCloseable {
            override fun close() {
                println("Resource closed")
            }
            
            fun use() {
                println("Using resource")
            }
        }
    }
}
```

### Common Pitfalls
```kotlin
import kotlinx.coroutines.*

class CommonPitfalls {
    
    // Pitfall 1: Blocking calls in coroutines
    suspend fun blockingCallPitfall() {
        // Bad: Blocks the thread
        Thread.sleep(1000)
        
        // Good: Suspends without blocking
        delay(1000)
    }
    
    // Pitfall 2: Not handling cancellation
    suspend fun cancellationPitfall() {
        // Bad: Ignores cancellation
        try {
            longRunningOperation()
        } catch (e: CancellationException) {
            // Don't catch and ignore cancellation
        }
        
        // Good: Propagate cancellation
        try {
            longRunningOperation()
        } catch (e: CancellationException) {
            cleanup()
            throw e // Re-throw
        }
    }
    
    // Pitfall 3: Creating coroutines in loops
    suspend fun coroutineInLoopPitfall() {
        val items = (1..1000).toList()
        
        // Bad: Creates too many coroutines
        items.forEach { item ->
            launch {
                processItem(item)
            }
        }
        
        // Good: Use async for concurrent processing
        items.map { item ->
            async {
                processItem(item)
            }
        }.awaitAll()
    }
    
    // Pitfall 4: Improper exception handling
    suspend fun exceptionHandlingPitfall() {
        // Bad: Exceptions are lost
        launch {
            throw RuntimeException("Lost exception")
        }
        
        // Good: Handle exceptions properly
        val handler = CoroutineExceptionHandler { _, exception ->
            println("Caught: $exception")
        }
        
        launch(handler) {
            throw RuntimeException("Handled exception")
        }
    }
    
    private suspend fun longRunningOperation() {
        delay(5000)
    }
    
    private suspend fun processItem(item: Int) {
        delay(10)
    }
    
    private fun cleanup() {
        println("Cleaning up")
    }
}
```

### Q&A: Performance and Best Practices

**Q1: How do you avoid creating too many coroutines?**
A: Process items in batches, use appropriate concurrency limits, and consider using Channels or Flow for streaming data.

**Q2: What are the signs of improper coroutine usage?**
A: Thread pool exhaustion, memory leaks from uncancelled coroutines, blocking calls in suspend functions, and ignored cancellation.

**Q3: How do you debug coroutine issues?**
A: Use coroutine debugging in IDE, enable coroutine debug mode, add logging with coroutine names, and use structured concurrency.

**Q4: What's the performance difference between coroutines and threads?**
A: Coroutines have much lower memory overhead (KB vs MB), faster creation/switching, and better scalability for I/O-bound tasks.

**Q5: How do you handle memory leaks in coroutines?**
A: Use structured concurrency, proper scope management, cancel coroutines when no longer needed, and avoid global scopes.

---

*This comprehensive Kotlin coroutines guide covers fundamental concepts to advanced patterns and best practices. Coroutines provide powerful tools for asynchronous programming while maintaining code readability and performance.*