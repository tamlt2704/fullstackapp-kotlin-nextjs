---
title: "Kotlin Coroutines - Complete Guide from Beginner to Professional"
date: "2024-12-13"
category: "Programming"
tags: ["Kotlin", "Coroutines", "Async", "Concurrency", "Backend"]
---

# Kotlin Coroutines - Complete Guide

## Overview

**Kotlin Coroutines** provide a way to write asynchronous, non-blocking code in a sequential style. They're lightweight, efficient, and built into Kotlin.

### Key Features
- **Lightweight**: Millions of coroutines on a single thread
- **Sequential Code**: Write async code like sync code
- **Structured Concurrency**: Automatic cancellation and cleanup
- **Built-in**: Part of Kotlin standard library
- **Multiplatform**: Works on JVM, JS, Native

---

## Getting Started

### 1. Setup

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3") // For Android
}
```

### 2. First Coroutine

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    println("Start")
    
    launch {
        delay(1000)
        println("World!")
    }
    
    println("Hello")
}
// Output: Start, Hello, World!
```

### 3. Suspend Functions

```kotlin
// Suspend function - can only be called from coroutine or another suspend function
suspend fun fetchUser(): String {
    delay(1000) // Non-blocking delay
    return "User Data"
}

fun main() = runBlocking {
    val user = fetchUser()
    println(user)
}
```

---

## Core Concepts

### 1. Coroutine Builders

```kotlin
// runBlocking - blocks current thread
fun main() = runBlocking {
    println("Main thread: ${Thread.currentThread().name}")
}

// launch - fire and forget
fun main() = runBlocking {
    launch {
        delay(1000)
        println("Task 1")
    }
    
    launch {
        delay(500)
        println("Task 2")
    }
    
    println("Main")
}

// async - returns Deferred<T>
fun main() = runBlocking {
    val deferred1 = async {
        delay(1000)
        "Result 1"
    }
    
    val deferred2 = async {
        delay(500)
        "Result 2"
    }
    
    println("${deferred1.await()} and ${deferred2.await()}")
}

// coroutineScope - creates scope, suspends until all children complete
suspend fun doWork() = coroutineScope {
    launch {
        delay(1000)
        println("Task 1")
    }
    
    launch {
        delay(500)
        println("Task 2")
    }
    
    println("All tasks launched")
} // Suspends here until all children complete
```

### 2. Dispatchers

```kotlin
// Dispatchers.Default - CPU-intensive work
launch(Dispatchers.Default) {
    val result = heavyComputation()
}

// Dispatchers.IO - I/O operations
launch(Dispatchers.IO) {
    val data = readFromDatabase()
}

// Dispatchers.Main - UI updates (Android)
launch(Dispatchers.Main) {
    updateUI()
}

// Dispatchers.Unconfined - not recommended for general use
launch(Dispatchers.Unconfined) {
    println("Unconfined")
}

// Custom dispatcher
val customDispatcher = Executors.newFixedThreadPool(4).asCoroutineDispatcher()
launch(customDispatcher) {
    // Work on custom thread pool
}
```

### 3. Job and Cancellation

```kotlin
fun main() = runBlocking {
    val job = launch {
        repeat(1000) { i ->
            println("Job: $i")
            delay(500)
        }
    }
    
    delay(1300)
    println("Cancelling job")
    job.cancel() // Cancel the job
    job.join()   // Wait for cancellation to complete
    println("Job cancelled")
}

// Check if cancelled
suspend fun doWork() {
    repeat(1000) { i ->
        if (!isActive) return // Check cancellation
        println("Working: $i")
        delay(500)
    }
}

// Handle cancellation
suspend fun doWorkWithCleanup() {
    try {
        repeat(1000) { i ->
            println("Working: $i")
            delay(500)
        }
    } finally {
        println("Cleanup")
    }
}

// Non-cancellable block
suspend fun doWorkWithNonCancellable() {
    try {
        repeat(1000) { i ->
            println("Working: $i")
            delay(500)
        }
    } finally {
        withContext(NonCancellable) {
            println("Cleanup that cannot be cancelled")
            delay(1000)
            println("Cleanup done")
        }
    }
}
```

### 4. Timeouts

```kotlin
fun main() = runBlocking {
    // withTimeout - throws TimeoutCancellationException
    try {
        withTimeout(1300) {
            repeat(1000) { i ->
                println("Working: $i")
                delay(500)
            }
        }
    } catch (e: TimeoutCancellationException) {
        println("Timeout!")
    }
    
    // withTimeoutOrNull - returns null on timeout
    val result = withTimeoutOrNull(1300) {
        repeat(1000) { i ->
            println("Working: $i")
            delay(500)
        }
        "Completed"
    }
    println("Result: $result")
}
```

---

## Structured Concurrency

### 1. Parent-Child Relationship

```kotlin
fun main() = runBlocking {
    val parentJob = launch {
        val child1 = launch {
            delay(1000)
            println("Child 1")
        }
        
        val child2 = launch {
            delay(500)
            println("Child 2")
        }
        
        println("Parent launched children")
    }
    
    delay(100)
    parentJob.cancel() // Cancels parent and all children
}
```

### 2. SupervisorJob

```kotlin
fun main() = runBlocking {
    // Regular Job - one child failure cancels all
    launch {
        launch {
            delay(100)
            throw Exception("Child 1 failed")
        }
        
        launch {
            delay(500)
            println("Child 2") // Won't execute
        }
    }
    
    delay(1000)
    
    // SupervisorJob - children fail independently
    supervisorScope {
        launch {
            delay(100)
            throw Exception("Child 1 failed")
        }
        
        launch {
            delay(500)
            println("Child 2") // Will execute
        }
    }
}
```

### 3. Exception Handling

```kotlin
fun main() = runBlocking {
    // Try-catch in coroutine
    launch {
        try {
            throw Exception("Error")
        } catch (e: Exception) {
            println("Caught: ${e.message}")
        }
    }
    
    // CoroutineExceptionHandler
    val handler = CoroutineExceptionHandler { _, exception ->
        println("Caught: ${exception.message}")
    }
    
    launch(handler) {
        throw Exception("Error")
    }
    
    // async - exception thrown on await()
    val deferred = async {
        throw Exception("Error")
    }
    
    try {
        deferred.await()
    } catch (e: Exception) {
        println("Caught: ${e.message}")
    }
}
```

---

## Flow - Asynchronous Streams

### 1. Basic Flow

```kotlin
// Create flow
fun simpleFlow(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100)
        emit(i)
    }
}

fun main() = runBlocking {
    // Collect flow
    simpleFlow().collect { value ->
        println(value)
    }
}

// Flow builders
val flow1 = flowOf(1, 2, 3)
val flow2 = (1..3).asFlow()
val flow3 = flow {
    emit(1)
    emit(2)
    emit(3)
}
```

### 2. Flow Operators

```kotlin
fun main() = runBlocking {
    // map
    (1..5).asFlow()
        .map { it * it }
        .collect { println(it) }
    
    // filter
    (1..10).asFlow()
        .filter { it % 2 == 0 }
        .collect { println(it) }
    
    // transform
    (1..3).asFlow()
        .transform { value ->
            emit("Start $value")
            delay(100)
            emit("End $value")
        }
        .collect { println(it) }
    
    // take
    (1..10).asFlow()
        .take(3)
        .collect { println(it) }
    
    // reduce
    val sum = (1..5).asFlow()
        .reduce { acc, value -> acc + value }
    println("Sum: $sum")
    
    // fold
    val product = (1..5).asFlow()
        .fold(1) { acc, value -> acc * value }
    println("Product: $product")
}
```

### 3. Flow Context

```kotlin
fun simpleFlow(): Flow<Int> = flow {
    println("Flow on ${Thread.currentThread().name}")
    for (i in 1..3) {
        emit(i)
    }
}

fun main() = runBlocking {
    // flowOn - changes upstream context
    simpleFlow()
        .flowOn(Dispatchers.Default)
        .collect { value ->
            println("Collected $value on ${Thread.currentThread().name}")
        }
}
```

### 4. Flow Buffering

```kotlin
fun main() = runBlocking {
    val time = measureTimeMillis {
        simpleFlow()
            .buffer() // Buffer emissions
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    println("Time: $time ms")
    
    // conflate - keep only latest
    simpleFlow()
        .conflate()
        .collect { value ->
            delay(300)
            println(value)
        }
}
```

### 5. Flow Composition

```kotlin
fun main() = runBlocking {
    val nums = (1..3).asFlow()
    val strs = flowOf("one", "two", "three")
    
    // zip
    nums.zip(strs) { a, b -> "$a -> $b" }
        .collect { println(it) }
    
    // combine
    nums.combine(strs) { a, b -> "$a -> $b" }
        .collect { println(it) }
    
    // flatMapConcat
    (1..3).asFlow()
        .flatMapConcat { value ->
            flow {
                emit("$value: First")
                delay(100)
                emit("$value: Second")
            }
        }
        .collect { println(it) }
    
    // flatMapMerge
    (1..3).asFlow()
        .flatMapMerge { value ->
            flow {
                emit("$value: First")
                delay(100)
                emit("$value: Second")
            }
        }
        .collect { println(it) }
}
```

---

## StateFlow and SharedFlow

### 1. StateFlow

```kotlin
class CounterViewModel {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()
    
    fun increment() {
        _count.value++
    }
    
    fun decrement() {
        _count.value--
    }
}

fun main() = runBlocking {
    val viewModel = CounterViewModel()
    
    // Collect state
    launch {
        viewModel.count.collect { value ->
            println("Count: $value")
        }
    }
    
    delay(100)
    viewModel.increment()
    delay(100)
    viewModel.increment()
    delay(100)
    viewModel.decrement()
}
```

### 2. SharedFlow

```kotlin
class EventBus {
    private val _events = MutableSharedFlow<String>()
    val events: SharedFlow<String> = _events.asSharedFlow()
    
    suspend fun emit(event: String) {
        _events.emit(event)
    }
}

fun main() = runBlocking {
    val eventBus = EventBus()
    
    // Multiple collectors
    launch {
        eventBus.events.collect { event ->
            println("Collector 1: $event")
        }
    }
    
    launch {
        eventBus.events.collect { event ->
            println("Collector 2: $event")
        }
    }
    
    delay(100)
    eventBus.emit("Event 1")
    delay(100)
    eventBus.emit("Event 2")
}
```

---

## Real-World Examples

### 1. API Client with Retry

```kotlin
class ApiClient {
    suspend fun fetchUser(id: String): Result<User> = withContext(Dispatchers.IO) {
        retry(times = 3, initialDelay = 1000) {
            val response = httpClient.get("/users/$id")
            if (response.isSuccessful) {
                Result.success(response.body())
            } else {
                Result.failure(Exception("HTTP ${response.code}"))
            }
        }
    }
}

suspend fun <T> retry(
    times: Int,
    initialDelay: Long = 100,
    maxDelay: Long = 1000,
    factor: Double = 2.0,
    block: suspend () -> T
): T {
    var currentDelay = initialDelay
    repeat(times - 1) {
        try {
            return block()
        } catch (e: Exception) {
            delay(currentDelay)
            currentDelay = (currentDelay * factor).toLong().coerceAtMost(maxDelay)
        }
    }
    return block() // Last attempt
}
```

### 2. Parallel Data Loading

```kotlin
data class UserProfile(
    val user: User,
    val posts: List<Post>,
    val friends: List<User>
)

class UserRepository {
    suspend fun loadUserProfile(userId: String): UserProfile = coroutineScope {
        val userDeferred = async { fetchUser(userId) }
        val postsDeferred = async { fetchPosts(userId) }
        val friendsDeferred = async { fetchFriends(userId) }
        
        UserProfile(
            user = userDeferred.await(),
            posts = postsDeferred.await(),
            friends = friendsDeferred.await()
        )
    }
    
    private suspend fun fetchUser(id: String): User = withContext(Dispatchers.IO) {
        delay(1000)
        User(id, "John Doe")
    }
    
    private suspend fun fetchPosts(userId: String): List<Post> = withContext(Dispatchers.IO) {
        delay(800)
        listOf(Post("1", "Post 1"), Post("2", "Post 2"))
    }
    
    private suspend fun fetchFriends(userId: String): List<User> = withContext(Dispatchers.IO) {
        delay(600)
        listOf(User("2", "Jane"), User("3", "Bob"))
    }
}
```

### 3. Rate Limiter

```kotlin
class RateLimiter(
    private val maxRequests: Int,
    private val timeWindow: Long
) {
    private val requests = mutableListOf<Long>()
    private val mutex = Mutex()
    
    suspend fun <T> execute(block: suspend () -> T): T {
        mutex.withLock {
            val now = System.currentTimeMillis()
            requests.removeAll { it < now - timeWindow }
            
            if (requests.size >= maxRequests) {
                val oldestRequest = requests.first()
                val waitTime = timeWindow - (now - oldestRequest)
                delay(waitTime)
                requests.removeAt(0)
            }
            
            requests.add(System.currentTimeMillis())
        }
        
        return block()
    }
}

// Usage
val rateLimiter = RateLimiter(maxRequests = 10, timeWindow = 1000)

suspend fun makeApiCall() {
    rateLimiter.execute {
        // API call
    }
}
```

### 4. Cache with Expiration

```kotlin
class CachedRepository<K, V>(
    private val ttl: Long,
    private val loader: suspend (K) -> V
) {
    private data class CacheEntry<V>(val value: V, val timestamp: Long)
    
    private val cache = mutableMapOf<K, CacheEntry<V>>()
    private val mutex = Mutex()
    
    suspend fun get(key: K): V = mutex.withLock {
        val entry = cache[key]
        val now = System.currentTimeMillis()
        
        if (entry != null && now - entry.timestamp < ttl) {
            entry.value
        } else {
            val value = loader(key)
            cache[key] = CacheEntry(value, now)
            value
        }
    }
    
    suspend fun invalidate(key: K) = mutex.withLock {
        cache.remove(key)
    }
    
    suspend fun clear() = mutex.withLock {
        cache.clear()
    }
}

// Usage
val userCache = CachedRepository<String, User>(ttl = 60_000) { userId ->
    fetchUserFromApi(userId)
}

val user = userCache.get("123")
```

### 5. Background Task Processor

```kotlin
class TaskProcessor<T> {
    private val tasks = Channel<T>(Channel.UNLIMITED)
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    
    init {
        repeat(4) { workerId ->
            scope.launch {
                for (task in tasks) {
                    try {
                        processTask(task, workerId)
                    } catch (e: Exception) {
                        println("Worker $workerId error: ${e.message}")
                    }
                }
            }
        }
    }
    
    suspend fun submit(task: T) {
        tasks.send(task)
    }
    
    private suspend fun processTask(task: T, workerId: Int) {
        println("Worker $workerId processing: $task")
        delay(1000)
        println("Worker $workerId completed: $task")
    }
    
    fun shutdown() {
        tasks.close()
        scope.cancel()
    }
}

// Usage
val processor = TaskProcessor<String>()
repeat(10) { i ->
    processor.submit("Task $i")
}
```

---

## Spring Boot Integration

### 1. Controller with Coroutines

```kotlin
@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {
    
    @GetMapping
    suspend fun getAllUsers(): List<UserDTO> {
        return userService.findAll()
    }
    
    @GetMapping("/{id}")
    suspend fun getUser(@PathVariable id: String): UserDTO {
        return userService.findById(id) ?: throw NotFoundException()
    }
    
    @PostMapping
    suspend fun createUser(@RequestBody request: CreateUserRequest): UserDTO {
        return userService.create(request)
    }
}
```

### 2. Service Layer

```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
    private val emailService: EmailService
) {
    suspend fun findAll(): List<UserDTO> = withContext(Dispatchers.IO) {
        userRepository.findAll().map { it.toDTO() }
    }
    
    suspend fun findById(id: String): UserDTO? = withContext(Dispatchers.IO) {
        userRepository.findById(id)?.toDTO()
    }
    
    suspend fun create(request: CreateUserRequest): UserDTO = coroutineScope {
        val user = User(
            id = UUID.randomUUID().toString(),
            name = request.name,
            email = request.email
        )
        
        val savedUser = withContext(Dispatchers.IO) {
            userRepository.save(user)
        }
        
        // Send email asynchronously
        launch {
            emailService.sendWelcomeEmail(savedUser.email)
        }
        
        savedUser.toDTO()
    }
}
```

### 3. Repository with Flow

```kotlin
interface UserRepository : CoroutineCrudRepository<User, String> {
    fun findByEmail(email: String): Flow<User>
    fun findAllByActive(active: Boolean): Flow<User>
}

@Service
class UserSearchService(private val userRepository: UserRepository) {
    
    fun searchActiveUsers(): Flow<UserDTO> {
        return userRepository.findAllByActive(true)
            .map { it.toDTO() }
            .flowOn(Dispatchers.IO)
    }
    
    suspend fun countActiveUsers(): Int {
        return userRepository.findAllByActive(true)
            .count()
    }
}
```

---

## Testing Coroutines

### 1. Basic Tests

```kotlin
class CoroutineTest {
    
    @Test
    fun `test suspend function`() = runTest {
        val result = fetchData()
        assertEquals("Data", result)
    }
    
    @Test
    fun `test with delay`() = runTest {
        val start = currentTime
        delay(1000)
        val end = currentTime
        assertEquals(1000, end - start)
    }
    
    @Test
    fun `test parallel execution`() = runTest {
        val deferred1 = async { fetchData1() }
        val deferred2 = async { fetchData2() }
        
        val results = awaitAll(deferred1, deferred2)
        assertEquals(2, results.size)
    }
}
```

### 2. Flow Tests

```kotlin
class FlowTest {
    
    @Test
    fun `test flow emissions`() = runTest {
        val flow = flow {
            emit(1)
            emit(2)
            emit(3)
        }
        
        val results = flow.toList()
        assertEquals(listOf(1, 2, 3), results)
    }
    
    @Test
    fun `test flow with turbine`() = runTest {
        val flow = flowOf(1, 2, 3)
        
        flow.test {
            assertEquals(1, awaitItem())
            assertEquals(2, awaitItem())
            assertEquals(3, awaitItem())
            awaitComplete()
        }
    }
}
```

---

## Best Practices

### 1. Structured Concurrency
- Always use coroutineScope or supervisorScope
- Avoid GlobalScope
- Cancel coroutines when no longer needed

### 2. Dispatchers
- Use Dispatchers.IO for I/O operations
- Use Dispatchers.Default for CPU-intensive work
- Don't use Dispatchers.Main for blocking operations

### 3. Exception Handling
- Use try-catch in coroutines
- Use CoroutineExceptionHandler for uncaught exceptions
- Use SupervisorJob for independent child failures

### 4. Flow
- Use Flow for streams of data
- Use StateFlow for state management
- Use SharedFlow for events

### 5. Testing
- Use runTest for testing coroutines
- Use TestDispatcher for controlling time
- Test cancellation scenarios

---

## Resources

### Official
- [Kotlin Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html)
- [Coroutines API](https://kotlinlang.org/api/kotlinx.coroutines/)
- [Flow Documentation](https://kotlinlang.org/docs/flow.html)

### Books
- "Kotlin Coroutines" by Marcin Moskała
- "Kotlin in Action" by Dmitry Jemerov

---

## Congratulations!

You now master:
✅ Coroutine fundamentals
✅ Structured concurrency
✅ Flow and reactive streams
✅ StateFlow and SharedFlow
✅ Real-world patterns
✅ Spring Boot integration
✅ Testing strategies

**Build scalable async applications!**

---

*"Concurrency is not parallelism, but coroutines make both easier."*

*Happy Coding! 🚀*
