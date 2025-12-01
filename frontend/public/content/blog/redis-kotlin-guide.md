---
title: "Redis with Kotlin: Complete Caching & Performance Guide"
date: "2024-12-08"
category: "Backend"
tags: ["Redis", "Kotlin", "Caching", "Performance", "System Design"]
---

# Redis with Kotlin: Complete Caching & Performance Guide

*From Beginner to Master in Redis, Caching, and System Design*

## Table of Contents
1. [Introduction](#introduction)
2. [Setup & Configuration](#setup--configuration)
3. [Core Data Structures](#core-data-structures)
4. [Caching Strategies](#caching-strategies)
5. [Advanced Features](#advanced-features)
6. [Performance Optimization](#performance-optimization)
7. [System Design Patterns](#system-design-patterns)
8. [Real-World Projects](#real-world-projects)
9. [Production Best Practices](#production-best-practices)

---

## Introduction

### What is Redis?

Redis (Remote Dictionary Server) is an in-memory data structure store used as database, cache, and message broker.

**Key Features:**
- In-memory storage (microsecond latency)
- Rich data structures
- Persistence options
- Pub/Sub messaging
- Atomic operations
- Clustering & replication

**Use Cases:**
- Caching (session, API responses)
- Rate limiting
- Real-time analytics
- Leaderboards
- Message queues
- Distributed locks

---

## Setup & Configuration

### Dependencies

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.lettuce:lettuce-core:6.3.0.RELEASE")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
}
```

### Basic Connection

```kotlin
import io.lettuce.core.RedisClient
import io.lettuce.core.api.StatefulRedisConnection
import io.lettuce.core.api.sync.RedisCommands

class RedisConfig {
    private val client = RedisClient.create("redis://localhost:6379")
    val connection: StatefulRedisConnection<String, String> = client.connect()
    val commands: RedisCommands<String, String> = connection.sync()
    
    fun close() {
        connection.close()
        client.shutdown()
    }
}
```

### Spring Boot Configuration

```kotlin
@Configuration
class RedisConfiguration {
    
    @Bean
    fun redisConnectionFactory(): LettuceConnectionFactory {
        return LettuceConnectionFactory().apply {
            hostName = "localhost"
            port = 6379
        }
    }
    
    @Bean
    fun redisTemplate(): RedisTemplate<String, Any> {
        return RedisTemplate<String, Any>().apply {
            connectionFactory = redisConnectionFactory()
            keySerializer = StringRedisSerializer()
            valueSerializer = GenericJackson2JsonRedisSerializer()
        }
    }
}
```

---

## Core Data Structures

### Strings

```kotlin
// Set/Get
commands.set("user:1:name", "Alice")
val name = commands.get("user:1:name") // "Alice"

// With expiration
commands.setex("session:abc", 3600, "user-data")

// Increment
commands.incr("page:views") // 1
commands.incrby("page:views", 10) // 11

// Multiple operations
commands.mset(mapOf(
    "user:1:email" to "alice@example.com",
    "user:1:age" to "25"
))
val values = commands.mget("user:1:email", "user:1:age")
```

### Hashes

```kotlin
// Set hash fields
commands.hset("user:1", mapOf(
    "name" to "Alice",
    "email" to "alice@example.com",
    "age" to "25"
))

// Get field
val email = commands.hget("user:1", "email")

// Get all fields
val user = commands.hgetall("user:1")

// Increment field
commands.hincrby("user:1", "login_count", 1)

// Check field exists
val exists = commands.hexists("user:1", "name")
```

### Lists

```kotlin
// Push elements
commands.lpush("queue:tasks", "task1", "task2", "task3")
commands.rpush("queue:tasks", "task4")

// Pop elements
val task = commands.lpop("queue:tasks") // "task3"
val lastTask = commands.rpop("queue:tasks") // "task4"

// Blocking pop (for queues)
val item = commands.blpop(10, "queue:tasks") // Wait 10 seconds

// Get range
val tasks = commands.lrange("queue:tasks", 0, -1)

// List length
val length = commands.llen("queue:tasks")
```

### Sets

```kotlin
// Add members
commands.sadd("tags:post:1", "kotlin", "redis", "caching")

// Check membership
val isMember = commands.sismember("tags:post:1", "kotlin") // true

// Get all members
val tags = commands.smembers("tags:post:1")

// Set operations
commands.sadd("tags:post:2", "kotlin", "spring", "web")
val common = commands.sinter("tags:post:1", "tags:post:2") // ["kotlin"]
val all = commands.sunion("tags:post:1", "tags:post:2")
val diff = commands.sdiff("tags:post:1", "tags:post:2")

// Random member
val randomTag = commands.srandmember("tags:post:1")
```

### Sorted Sets

```kotlin
// Add with scores
commands.zadd("leaderboard", 100.0, "player1")
commands.zadd("leaderboard", 250.0, "player2")
commands.zadd("leaderboard", 180.0, "player3")

// Get rank
val rank = commands.zrank("leaderboard", "player2") // 2 (0-indexed)

// Get score
val score = commands.zscore("leaderboard", "player2") // 250.0

// Range by rank
val top3 = commands.zrevrange("leaderboard", 0, 2) // Highest scores

// Range by score
val highScorers = commands.zrangebyscore("leaderboard", 200.0, 300.0)

// Increment score
commands.zincrby("leaderboard", 50.0, "player1")
```

---

## Caching Strategies

### Cache-Aside (Lazy Loading)

```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
    private val redisTemplate: RedisTemplate<String, User>
) {
    fun getUser(userId: Long): User? {
        val cacheKey = "user:$userId"
        
        // Try cache first
        val cached = redisTemplate.opsForValue().get(cacheKey)
        if (cached != null) {
            return cached
        }
        
        // Cache miss - load from DB
        val user = userRepository.findById(userId).orElse(null) ?: return null
        
        // Store in cache
        redisTemplate.opsForValue().set(cacheKey, user, Duration.ofHours(1))
        
        return user
    }
    
    fun updateUser(user: User) {
        userRepository.save(user)
        // Invalidate cache
        redisTemplate.delete("user:${user.id}")
    }
}
```

### Write-Through Cache

```kotlin
@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val redisTemplate: RedisTemplate<String, Product>
) {
    fun saveProduct(product: Product): Product {
        // Write to DB
        val saved = productRepository.save(product)
        
        // Write to cache
        val cacheKey = "product:${saved.id}"
        redisTemplate.opsForValue().set(cacheKey, saved, Duration.ofHours(24))
        
        return saved
    }
}
```

### Write-Behind (Write-Back) Cache

```kotlin
@Service
class EventService(
    private val redisTemplate: RedisTemplate<String, Event>,
    private val eventRepository: EventRepository
) {
    fun trackEvent(event: Event) {
        // Write to cache immediately
        redisTemplate.opsForList().rightPush("events:pending", event)
    }
    
    @Scheduled(fixedDelay = 5000)
    fun flushEvents() {
        val events = mutableListOf<Event>()
        
        // Batch read from cache
        repeat(100) {
            val event = redisTemplate.opsForList().leftPop("events:pending")
            if (event != null) events.add(event)
        }
        
        // Batch write to DB
        if (events.isNotEmpty()) {
            eventRepository.saveAll(events)
        }
    }
}
```

### Cache Warming

```kotlin
@Component
class CacheWarmer(
    private val productRepository: ProductRepository,
    private val redisTemplate: RedisTemplate<String, Product>
) {
    @EventListener(ApplicationReadyEvent::class)
    fun warmCache() {
        val popularProducts = productRepository.findTop100ByOrderByViewsDesc()
        
        popularProducts.forEach { product ->
            redisTemplate.opsForValue().set(
                "product:${product.id}",
                product,
                Duration.ofHours(24)
            )
        }
    }
}
```

### Multi-Level Caching

```kotlin
@Service
class MultiLevelCacheService(
    private val localCache: ConcurrentHashMap<String, CacheEntry>,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    data class CacheEntry(val value: Any, val expiry: Long)
    
    fun get(key: String): Any? {
        // L1: Local cache
        val local = localCache[key]
        if (local != null && local.expiry > System.currentTimeMillis()) {
            return local.value
        }
        
        // L2: Redis cache
        val redis = redisTemplate.opsForValue().get(key)
        if (redis != null) {
            // Populate L1
            localCache[key] = CacheEntry(redis, System.currentTimeMillis() + 60000)
            return redis
        }
        
        return null
    }
    
    fun set(key: String, value: Any, ttl: Duration) {
        // Write to both levels
        localCache[key] = CacheEntry(value, System.currentTimeMillis() + ttl.toMillis())
        redisTemplate.opsForValue().set(key, value, ttl)
    }
}
```

---

## Spring Boot Performance Optimization

### @Cacheable Annotation

```kotlin
@Service
class ProductService(
    private val productRepository: ProductRepository
) {
    @Cacheable(value = ["products"], key = "#id")
    fun getProduct(id: Long): Product? {
        println("Loading from database...")
        return productRepository.findById(id).orElse(null)
    }
    
    @Cacheable(value = ["products"], key = "#category + ':' + #page")
    fun getProductsByCategory(category: String, page: Int): List<Product> {
        return productRepository.findByCategory(category, PageRequest.of(page, 20))
    }
    
    @CacheEvict(value = ["products"], key = "#product.id")
    fun updateProduct(product: Product): Product {
        return productRepository.save(product)
    }
    
    @CacheEvict(value = ["products"], allEntries = true)
    fun clearAllCache() {
        println("All product cache cleared")
    }
}

@Configuration
@EnableCaching
class CacheConfig {
    @Bean
    fun cacheManager(connectionFactory: RedisConnectionFactory): CacheManager {
        val config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(StringRedisSerializer())
            )
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    GenericJackson2JsonRedisSerializer()
                )
            )
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .build()
    }
}
```

### API Response Caching

```kotlin
@RestController
@RequestMapping("/api/products")
class ProductController(
    private val productService: ProductService,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    @GetMapping("/{id}")
    fun getProduct(@PathVariable id: Long): ResponseEntity<Product> {
        val cacheKey = "api:product:$id"
        
        // Check cache
        val cached = redisTemplate.opsForValue().get(cacheKey) as? Product
        if (cached != null) {
            return ResponseEntity.ok()
                .header("X-Cache", "HIT")
                .body(cached)
        }
        
        // Load from service
        val product = productService.getProduct(id)
            ?: return ResponseEntity.notFound().build()
        
        // Cache response
        redisTemplate.opsForValue().set(cacheKey, product, Duration.ofMinutes(30))
        
        return ResponseEntity.ok()
            .header("X-Cache", "MISS")
            .body(product)
    }
    
    @GetMapping("/search")
    fun searchProducts(
        @RequestParam query: String,
        @RequestParam(defaultValue = "0") page: Int
    ): ResponseEntity<List<Product>> {
        val cacheKey = "api:search:$query:$page"
        
        val cached = redisTemplate.opsForValue().get(cacheKey)
        if (cached != null) {
            return ResponseEntity.ok(cached as List<Product>)
        }
        
        val results = productService.search(query, page)
        redisTemplate.opsForValue().set(cacheKey, results, Duration.ofMinutes(10))
        
        return ResponseEntity.ok(results)
    }
}
```

### Database Query Caching

```kotlin
@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    fun getOrdersByUser(userId: Long): List<Order> {
        val cacheKey = "orders:user:$userId"
        
        // Try cache
        val cached = redisTemplate.opsForValue().get(cacheKey)
        if (cached != null) {
            return cached as List<Order>
        }
        
        // Query database
        val orders = orderRepository.findByUserId(userId)
        
        // Cache for 5 minutes
        redisTemplate.opsForValue().set(cacheKey, orders, Duration.ofMinutes(5))
        
        return orders
    }
    
    fun getOrderStats(userId: Long): OrderStats {
        val cacheKey = "stats:user:$userId"
        
        return redisTemplate.opsForValue().get(cacheKey) as? OrderStats
            ?: calculateStats(userId).also {
                redisTemplate.opsForValue().set(cacheKey, it, Duration.ofHours(1))
            }
    }
    
    private fun calculateStats(userId: Long): OrderStats {
        val orders = orderRepository.findByUserId(userId)
        return OrderStats(
            totalOrders = orders.size,
            totalSpent = orders.sumOf { it.amount },
            avgOrderValue = orders.map { it.amount }.average()
        )
    }
}

data class OrderStats(
    val totalOrders: Int,
    val totalSpent: Double,
    val avgOrderValue: Double
)
```

### Reducing Database Load with Cache-Aside

```kotlin
@Service
class UserProfileService(
    private val userRepository: UserRepository,
    private val redisTemplate: RedisTemplate<String, UserProfile>
) {
    fun getUserProfile(userId: Long): UserProfile? {
        val cacheKey = "profile:$userId"
        
        // L1: Check Redis
        val cached = redisTemplate.opsForValue().get(cacheKey)
        if (cached != null) {
            return cached
        }
        
        // L2: Load from DB
        val user = userRepository.findById(userId).orElse(null) ?: return null
        val profile = UserProfile(
            id = user.id,
            name = user.name,
            email = user.email,
            avatar = user.avatar,
            lastLogin = user.lastLogin
        )
        
        // Store in Redis
        redisTemplate.opsForValue().set(cacheKey, profile, Duration.ofHours(2))
        
        return profile
    }
    
    fun updateProfile(userId: Long, updates: Map<String, Any>) {
        // Update DB
        userRepository.updateProfile(userId, updates)
        
        // Invalidate cache
        redisTemplate.delete("profile:$userId")
    }
}

data class UserProfile(
    val id: Long,
    val name: String,
    val email: String,
    val avatar: String?,
    val lastLogin: Instant?
)
```

### Batch Operations for Performance

```kotlin
@Service
class BatchCacheService(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    fun getMultipleProducts(ids: List<Long>): Map<Long, Product> {
        val keys = ids.map { "product:$it" }
        
        // Batch get from Redis
        val values = redisTemplate.opsForValue().multiGet(keys)
        
        return ids.zip(values ?: emptyList())
            .filter { it.second != null }
            .associate { it.first to it.second as Product }
    }
    
    fun cacheMultipleProducts(products: List<Product>) {
        val map = products.associate { 
            "product:${it.id}" to it as Any
        }
        
        // Batch set to Redis
        redisTemplate.opsForValue().multiSet(map)
        
        // Set TTL for each key
        products.forEach { product ->
            redisTemplate.expire("product:${product.id}", Duration.ofHours(24))
        }
    }
}
```

### Fragment Caching for Complex Pages

```kotlin
@Service
class DashboardService(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    fun getDashboard(userId: Long): Dashboard {
        val cacheKey = "dashboard:$userId"
        
        // Try full dashboard cache
        val cached = redisTemplate.opsForValue().get(cacheKey) as? Dashboard
        if (cached != null) return cached
        
        // Build dashboard from fragments
        val dashboard = Dashboard(
            stats = getStatsFragment(userId),
            recentOrders = getRecentOrdersFragment(userId),
            recommendations = getRecommendationsFragment(userId)
        )
        
        // Cache full dashboard
        redisTemplate.opsForValue().set(cacheKey, dashboard, Duration.ofMinutes(5))
        
        return dashboard
    }
    
    private fun getStatsFragment(userId: Long): UserStats {
        val key = "fragment:stats:$userId"
        return redisTemplate.opsForValue().get(key) as? UserStats
            ?: calculateStats(userId).also {
                redisTemplate.opsForValue().set(key, it, Duration.ofMinutes(15))
            }
    }
    
    private fun getRecentOrdersFragment(userId: Long): List<Order> {
        val key = "fragment:orders:$userId"
        return redisTemplate.opsForValue().get(key) as? List<Order>
            ?: loadRecentOrders(userId).also {
                redisTemplate.opsForValue().set(key, it, Duration.ofMinutes(5))
            }
    }
    
    private fun getRecommendationsFragment(userId: Long): List<Product> {
        val key = "fragment:recommendations:$userId"
        return redisTemplate.opsForValue().get(key) as? List<Product>
            ?: generateRecommendations(userId).also {
                redisTemplate.opsForValue().set(key, it, Duration.ofHours(1))
            }
    }
}

data class Dashboard(
    val stats: UserStats,
    val recentOrders: List<Order>,
    val recommendations: List<Product>
)
```

### Preventing Cache Stampede

```kotlin
@Service
class StampedePreventionService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val distributedLock: DistributedLock
) {
    fun getExpensiveData(key: String): Any? {
        // Try cache
        val cached = redisTemplate.opsForValue().get(key)
        if (cached != null) return cached
        
        // Acquire lock to prevent stampede
        val lockKey = "lock:$key"
        val lockValue = distributedLock.acquireLock(lockKey, Duration.ofSeconds(10))
        
        if (lockValue != null) {
            try {
                // Double-check cache
                val doubleCheck = redisTemplate.opsForValue().get(key)
                if (doubleCheck != null) return doubleCheck
                
                // Compute expensive operation
                val data = computeExpensiveData(key)
                
                // Cache result
                redisTemplate.opsForValue().set(key, data, Duration.ofMinutes(30))
                
                return data
            } finally {
                distributedLock.releaseLock(lockKey, lockValue)
            }
        } else {
            // Wait and retry
            Thread.sleep(100)
            return redisTemplate.opsForValue().get(key)
        }
    }
    
    private fun computeExpensiveData(key: String): Any {
        // Simulate expensive computation
        Thread.sleep(2000)
        return "Computed data for $key"
    }
}
```

### Performance Monitoring

```kotlin
@Aspect
@Component
class CacheMonitoringAspect(
    private val meterRegistry: MeterRegistry
) {
    @Around("@annotation(cacheable)")
    fun monitorCache(joinPoint: ProceedingJoinPoint, cacheable: Cacheable): Any? {
        val cacheName = cacheable.value.firstOrNull() ?: "unknown"
        val startTime = System.currentTimeMillis()
        
        return try {
            val result = joinPoint.proceed()
            val duration = System.currentTimeMillis() - startTime
            
            meterRegistry.counter("cache.access", "cache", cacheName, "result", "hit").increment()
            meterRegistry.timer("cache.access.time", "cache", cacheName).record(duration, TimeUnit.MILLISECONDS)
            
            result
        } catch (e: Exception) {
            meterRegistry.counter("cache.access", "cache", cacheName, "result", "error").increment()
            throw e
        }
    }
}

@RestController
@RequestMapping("/api/cache")
class CacheMetricsController(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    @GetMapping("/stats")
    fun getCacheStats(): CacheStats {
        val info = redisTemplate.execute { connection ->
            connection.info("stats")
        }
        
        return CacheStats(
            hits = info?.get("keyspace_hits")?.toLong() ?: 0,
            misses = info?.get("keyspace_misses")?.toLong() ?: 0,
            hitRate = calculateHitRate(info),
            memoryUsed = info?.get("used_memory_human") ?: "0"
        )
    }
    
    private fun calculateHitRate(info: Map<String, String>?): Double {
        val hits = info?.get("keyspace_hits")?.toDouble() ?: 0.0
        val misses = info?.get("keyspace_misses")?.toDouble() ?: 0.0
        val total = hits + misses
        return if (total > 0) (hits / total) * 100 else 0.0
    }
}

data class CacheStats(
    val hits: Long,
    val misses: Long,
    val hitRate: Double,
    val memoryUsed: String
)
```

### Complete Performance Example

```kotlin
@Service
class HighPerformanceService(
    private val repository: DataRepository,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    // 1. Cache frequently accessed data
    @Cacheable("hotData", key = "#id")
    fun getHotData(id: Long): Data {
        return repository.findById(id)
    }
    
    // 2. Batch operations
    fun getBulkData(ids: List<Long>): List<Data> {
        val keys = ids.map { "hotData::$it" }
        val cached = redisTemplate.opsForValue().multiGet(keys)
        
        val missing = ids.filterIndexed { index, _ -> cached?.get(index) == null }
        if (missing.isEmpty()) {
            return cached?.filterNotNull()?.map { it as Data } ?: emptyList()
        }
        
        val fromDb = repository.findAllById(missing)
        fromDb.forEach { data ->
            redisTemplate.opsForValue().set("hotData::${data.id}", data, Duration.ofHours(1))
        }
        
        return (cached?.filterNotNull()?.map { it as Data } ?: emptyList()) + fromDb
    }
    
    // 3. Async cache warming
    @Async
    fun warmCacheAsync(ids: List<Long>) {
        ids.chunked(100).forEach { chunk ->
            val data = repository.findAllById(chunk)
            data.forEach { item ->
                redisTemplate.opsForValue().set(
                    "hotData::${item.id}",
                    item,
                    Duration.ofHours(1)
                )
            }
        }
    }
    
    // 4. Smart invalidation
    @CacheEvict("hotData", key = "#data.id")
    fun updateData(data: Data): Data {
        return repository.save(data)
    }
}
```

---

## Advanced Features

### Pub/Sub

```kotlin
// Publisher
@Service
class EventPublisher(private val redisTemplate: RedisTemplate<String, String>) {
    fun publishEvent(channel: String, message: String) {
        redisTemplate.convertAndSend(channel, message)
    }
}

// Subscriber
@Component
class EventSubscriber : MessageListener {
    override fun onMessage(message: Message, pattern: ByteArray?) {
        val channel = String(message.channel)
        val body = String(message.body)
        println("Received on $channel: $body")
    }
}

@Configuration
class PubSubConfig {
    @Bean
    fun messageListenerAdapter(subscriber: EventSubscriber) =
        MessageListenerAdapter(subscriber)
    
    @Bean
    fun redisMessageListenerContainer(
        connectionFactory: RedisConnectionFactory,
        adapter: MessageListenerAdapter
    ): RedisMessageListenerContainer {
        return RedisMessageListenerContainer().apply {
            setConnectionFactory(connectionFactory)
            addMessageListener(adapter, ChannelTopic("events"))
        }
    }
}
```

### Transactions

```kotlin
fun transferPoints(fromUser: String, toUser: String, points: Int) {
    redisTemplate.execute { connection ->
        connection.multi()
        
        connection.decrBy("user:$fromUser:points".toByteArray(), points.toLong())
        connection.incrBy("user:$toUser:points".toByteArray(), points.toLong())
        
        connection.exec()
    }
}
```

### Lua Scripts

```kotlin
@Service
class RateLimiter(private val redisTemplate: RedisTemplate<String, String>) {
    
    private val script = """
        local key = KEYS[1]
        local limit = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])
        
        local current = redis.call('INCR', key)
        if current == 1 then
            redis.call('EXPIRE', key, window)
        end
        
        if current > limit then
            return 0
        else
            return 1
        end
    """.trimIndent()
    
    fun isAllowed(userId: String, limit: Int, windowSeconds: Int): Boolean {
        val key = "rate_limit:$userId"
        val result = redisTemplate.execute(
            RedisScript.of(script, Long::class.java),
            listOf(key),
            limit.toString(),
            windowSeconds.toString()
        )
        return result == 1L
    }
}
```

### Distributed Locks

```kotlin
@Service
class DistributedLock(private val redisTemplate: RedisTemplate<String, String>) {
    
    fun acquireLock(lockKey: String, ttl: Duration): String? {
        val lockValue = UUID.randomUUID().toString()
        val acquired = redisTemplate.opsForValue()
            .setIfAbsent(lockKey, lockValue, ttl)
        
        return if (acquired == true) lockValue else null
    }
    
    fun releaseLock(lockKey: String, lockValue: String): Boolean {
        val script = """
            if redis.call('GET', KEYS[1]) == ARGV[1] then
                return redis.call('DEL', KEYS[1])
            else
                return 0
            end
        """.trimIndent()
        
        val result = redisTemplate.execute(
            RedisScript.of(script, Long::class.java),
            listOf(lockKey),
            lockValue
        )
        return result == 1L
    }
    
    fun <T> withLock(lockKey: String, ttl: Duration, block: () -> T): T? {
        val lockValue = acquireLock(lockKey, ttl) ?: return null
        
        return try {
            block()
        } finally {
            releaseLock(lockKey, lockValue)
        }
    }
}
```

---

## Performance Optimization

### Pipeline

```kotlin
fun batchOperations() {
    redisTemplate.executePipelined { connection ->
        repeat(1000) { i ->
            connection.set("key:$i".toByteArray(), "value:$i".toByteArray())
        }
        null
    }
}
```

### Connection Pooling

```kotlin
@Configuration
class RedisPoolConfig {
    @Bean
    fun redisConnectionFactory(): LettuceConnectionFactory {
        val poolConfig = GenericObjectPoolConfig<Any>().apply {
            maxTotal = 50
            maxIdle = 20
            minIdle = 5
            maxWaitMillis = 3000
        }
        
        val clientConfig = LettucePoolingClientConfiguration.builder()
            .poolConfig(poolConfig)
            .commandTimeout(Duration.ofSeconds(2))
            .build()
        
        return LettuceConnectionFactory(
            RedisStandaloneConfiguration("localhost", 6379),
            clientConfig
        )
    }
}
```

### Compression

```kotlin
class CompressedRedisSerializer : RedisSerializer<Any> {
    private val jackson = GenericJackson2JsonRedisSerializer()
    
    override fun serialize(value: Any?): ByteArray? {
        val json = jackson.serialize(value) ?: return null
        return compress(json)
    }
    
    override fun deserialize(bytes: ByteArray?): Any? {
        if (bytes == null) return null
        val decompressed = decompress(bytes)
        return jackson.deserialize(decompressed)
    }
    
    private fun compress(data: ByteArray): ByteArray {
        val output = ByteArrayOutputStream()
        GZIPOutputStream(output).use { it.write(data) }
        return output.toByteArray()
    }
    
    private fun decompress(data: ByteArray): ByteArray {
        return GZIPInputStream(ByteArrayInputStream(data)).readBytes()
    }
}
```

---

## System Design Patterns

### Session Management

```kotlin
@Service
class SessionService(private val redisTemplate: RedisTemplate<String, Session>) {
    
    fun createSession(userId: Long): String {
        val sessionId = UUID.randomUUID().toString()
        val session = Session(
            id = sessionId,
            userId = userId,
            createdAt = Instant.now(),
            lastAccessed = Instant.now()
        )
        
        redisTemplate.opsForValue().set(
            "session:$sessionId",
            session,
            Duration.ofHours(24)
        )
        
        return sessionId
    }
    
    fun getSession(sessionId: String): Session? {
        val session = redisTemplate.opsForValue().get("session:$sessionId")
        
        if (session != null) {
            // Refresh TTL on access
            session.lastAccessed = Instant.now()
            redisTemplate.expire("session:$sessionId", Duration.ofHours(24))
        }
        
        return session
    }
}
```

### Rate Limiting (Sliding Window)

```kotlin
@Service
class SlidingWindowRateLimiter(private val redisTemplate: RedisTemplate<String, String>) {
    
    fun isAllowed(userId: String, maxRequests: Int, windowSeconds: Int): Boolean {
        val key = "rate:$userId"
        val now = System.currentTimeMillis()
        val windowStart = now - (windowSeconds * 1000)
        
        redisTemplate.execute { connection ->
            // Remove old entries
            connection.zRemRangeByScore(key.toByteArray(), 0.0, windowStart.toDouble())
            
            // Count current requests
            val count = connection.zCard(key.toByteArray())
            
            if (count < maxRequests) {
                // Add new request
                connection.zAdd(key.toByteArray(), now.toDouble(), now.toString().toByteArray())
                connection.expire(key.toByteArray(), windowSeconds.toLong())
                true
            } else {
                false
            }
        } ?: false
    }
}
```

### Leaderboard

```kotlin
@Service
class LeaderboardService(private val redisTemplate: RedisTemplate<String, String>) {
    
    fun updateScore(leaderboard: String, player: String, score: Double) {
        redisTemplate.opsForZSet().add(leaderboard, player, score)
    }
    
    fun getTopPlayers(leaderboard: String, count: Int): List<PlayerScore> {
        val results = redisTemplate.opsForZSet()
            .reverseRangeWithScores(leaderboard, 0, count.toLong() - 1)
        
        return results?.mapIndexed { index, entry ->
            PlayerScore(
                rank = index + 1,
                player = entry.value!!,
                score = entry.score!!
            )
        } ?: emptyList()
    }
    
    fun getPlayerRank(leaderboard: String, player: String): PlayerRank? {
        val rank = redisTemplate.opsForZSet().reverseRank(leaderboard, player)
        val score = redisTemplate.opsForZSet().score(leaderboard, player)
        
        return if (rank != null && score != null) {
            PlayerRank(player, rank + 1, score)
        } else null
    }
}

data class PlayerScore(val rank: Int, val player: String, val score: Double)
data class PlayerRank(val player: String, val rank: Long, val score: Double)
```

### Cache Invalidation

```kotlin
@Service
class CacheInvalidationService(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    // Pattern-based invalidation
    fun invalidatePattern(pattern: String) {
        val keys = redisTemplate.keys(pattern)
        if (keys.isNotEmpty()) {
            redisTemplate.delete(keys)
        }
    }
    
    // Tag-based invalidation
    fun tagCache(key: String, tags: Set<String>) {
        tags.forEach { tag ->
            redisTemplate.opsForSet().add("tag:$tag", key)
        }
    }
    
    fun invalidateByTag(tag: String) {
        val keys = redisTemplate.opsForSet().members("tag:$tag")
        if (!keys.isNullOrEmpty()) {
            redisTemplate.delete(keys)
            redisTemplate.delete("tag:$tag")
        }
    }
}
```

---

## Real-World Projects

### Project 1: E-Commerce Product Catalog

```kotlin
@Service
class ProductCatalogService(
    private val productRepository: ProductRepository,
    private val redisTemplate: RedisTemplate<String, Product>
) {
    fun getProduct(productId: Long): Product? {
        val cacheKey = "product:$productId"
        
        return redisTemplate.opsForValue().get(cacheKey)
            ?: productRepository.findById(productId).orElse(null)?.also {
                redisTemplate.opsForValue().set(cacheKey, it, Duration.ofHours(24))
            }
    }
    
    fun searchProducts(query: String, page: Int, size: Int): List<Product> {
        val cacheKey = "search:$query:$page:$size"
        
        val cached = redisTemplate.opsForValue().get(cacheKey)
        if (cached != null) return cached as List<Product>
        
        val results = productRepository.search(query, PageRequest.of(page, size))
        redisTemplate.opsForValue().set(cacheKey, results, Duration.ofMinutes(15))
        
        return results
    }
    
    fun incrementViews(productId: Long) {
        redisTemplate.opsForValue().increment("product:$productId:views")
        
        // Update trending products
        redisTemplate.opsForZSet().incrementScore("trending:products", productId.toString(), 1.0)
    }
    
    fun getTrendingProducts(limit: Int): List<Long> {
        return redisTemplate.opsForZSet()
            .reverseRange("trending:products", 0, limit.toLong() - 1)
            ?.mapNotNull { it.toLongOrNull() }
            ?: emptyList()
    }
}
```

### Project 2: Real-Time Analytics

```kotlin
@Service
class AnalyticsService(private val redisTemplate: RedisTemplate<String, String>) {
    
    fun trackPageView(page: String, userId: String) {
        val timestamp = System.currentTimeMillis()
        val date = LocalDate.now().toString()
        
        // Total views
        redisTemplate.opsForValue().increment("analytics:$date:views")
        
        // Unique visitors
        redisTemplate.opsForHyperLogLog().add("analytics:$date:unique", userId)
        
        // Page views
        redisTemplate.opsForHash<String, String>()
            .increment("analytics:$date:pages", page, 1)
        
        // Recent activity
        redisTemplate.opsForZSet().add(
            "analytics:recent",
            "$page:$userId",
            timestamp.toDouble()
        )
        
        // Keep only last hour
        val oneHourAgo = timestamp - 3600000
        redisTemplate.opsForZSet().removeRangeByScore(
            "analytics:recent",
            0.0,
            oneHourAgo.toDouble()
        )
    }
    
    fun getDailyStats(date: String): DailyStats {
        val totalViews = redisTemplate.opsForValue().get("analytics:$date:views")?.toLong() ?: 0
        val uniqueVisitors = redisTemplate.opsForHyperLogLog().size("analytics:$date:unique") ?: 0
        val topPages = redisTemplate.opsForHash<String, String>()
            .entries("analytics:$date:pages")
            .entries
            .sortedByDescending { it.value.toLong() }
            .take(10)
        
        return DailyStats(date, totalViews, uniqueVisitors, topPages)
    }
}

data class DailyStats(
    val date: String,
    val totalViews: Long,
    val uniqueVisitors: Long,
    val topPages: Set<Map.Entry<String, String>>
)
```

### Project 3: Job Queue System

```kotlin
@Service
class JobQueueService(private val redisTemplate: RedisTemplate<String, Job>) {
    
    fun enqueueJob(job: Job, priority: Int = 0) {
        val queueKey = "queue:${job.type}"
        redisTemplate.opsForZSet().add(queueKey, job, priority.toDouble())
    }
    
    fun dequeueJob(jobType: String): Job? {
        val queueKey = "queue:$jobType"
        val jobs = redisTemplate.opsForZSet().reverseRange(queueKey, 0, 0)
        
        return jobs?.firstOrNull()?.also {
            redisTemplate.opsForZSet().remove(queueKey, it)
        }
    }
    
    fun scheduleJob(job: Job, executeAt: Instant) {
        redisTemplate.opsForZSet().add(
            "queue:scheduled",
            job,
            executeAt.toEpochMilli().toDouble()
        )
    }
    
    @Scheduled(fixedDelay = 1000)
    fun processScheduledJobs() {
        val now = System.currentTimeMillis()
        val jobs = redisTemplate.opsForZSet().rangeByScore(
            "queue:scheduled",
            0.0,
            now.toDouble()
        )
        
        jobs?.forEach { job ->
            enqueueJob(job)
            redisTemplate.opsForZSet().remove("queue:scheduled", job)
        }
    }
}

data class Job(val id: String, val type: String, val payload: Map<String, Any>)
```

---

## Production Best Practices

### Monitoring

```kotlin
@Component
class RedisHealthIndicator(
    private val redisTemplate: RedisTemplate<String, String>
) : HealthIndicator {
    
    override fun health(): Health {
        return try {
            redisTemplate.execute { connection ->
                connection.ping()
            }
            
            val info = redisTemplate.execute { connection ->
                connection.info()
            }
            
            Health.up()
                .withDetail("version", info?.get("redis_version"))
                .withDetail("connected_clients", info?.get("connected_clients"))
                .build()
        } catch (e: Exception) {
            Health.down(e).build()
        }
    }
}
```

### Error Handling

```kotlin
@Service
class ResilientCacheService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val fallbackService: FallbackService
) {
    fun get(key: String): Any? {
        return try {
            redisTemplate.opsForValue().get(key)
        } catch (e: RedisConnectionFailureException) {
            logger.error("Redis connection failed", e)
            fallbackService.get(key)
        } catch (e: Exception) {
            logger.error("Redis error", e)
            null
        }
    }
}
```

### Key Naming Convention

```kotlin
object RedisKeys {
    fun userKey(userId: Long) = "user:$userId"
    fun sessionKey(sessionId: String) = "session:$sessionId"
    fun cacheKey(entity: String, id: Any) = "cache:$entity:$id"
    fun lockKey(resource: String) = "lock:$resource"
    fun queueKey(queueName: String) = "queue:$queueName"
}
```

### TTL Management

```kotlin
enum class CacheTTL(val duration: Duration) {
    SHORT(Duration.ofMinutes(5)),
    MEDIUM(Duration.ofHours(1)),
    LONG(Duration.ofHours(24)),
    PERMANENT(Duration.ZERO)
}

fun RedisTemplate<String, Any>.setWithTTL(
    key: String,
    value: Any,
    ttl: CacheTTL
) {
    if (ttl == CacheTTL.PERMANENT) {
        opsForValue().set(key, value)
    } else {
        opsForValue().set(key, value, ttl.duration)
    }
}
```

---

## Summary

### Key Concepts

**Data Structures:**
- ✅ Strings, Hashes, Lists, Sets, Sorted Sets
- ✅ HyperLogLog, Bitmaps, Streams

**Caching Strategies:**
- ✅ Cache-Aside, Write-Through, Write-Behind
- ✅ Multi-level caching
- ✅ Cache warming & invalidation

**Advanced Features:**
- ✅ Pub/Sub messaging
- ✅ Transactions & Lua scripts
- ✅ Distributed locks
- ✅ Rate limiting

**System Design:**
- ✅ Session management
- ✅ Leaderboards
- ✅ Real-time analytics
- ✅ Job queues

### Performance Tips

1. Use pipelining for batch operations
2. Configure connection pooling
3. Implement compression for large values
4. Use appropriate data structures
5. Set TTLs to prevent memory bloat
6. Monitor memory usage
7. Use Redis Cluster for scalability

### Learning Path

1. **Beginner**: Basic commands, simple caching
2. **Intermediate**: Advanced data structures, caching strategies
3. **Advanced**: Lua scripts, distributed locks, pub/sub
4. **Master**: System design, performance tuning, production deployment

### Resources

- **Redis Docs**: https://redis.io/documentation
- **Lettuce**: https://lettuce.io/
- **Spring Data Redis**: https://spring.io/projects/spring-data-redis

---

**You're now ready to build high-performance systems with Redis!** 🚀
