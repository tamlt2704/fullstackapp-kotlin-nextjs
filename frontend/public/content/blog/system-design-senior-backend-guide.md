---
title: "System Design Interview - Senior Backend Engineer Guide"
date: "2024-12-13"
category: "System Design"
tags: ["System Design", "Microservices", "Kafka", "Redis", "Caching", "Scalability", "Kotlin"]
---

# System Design Interview - Senior Backend Engineer Guide

## Design: E-Commerce Order System

### Requirements
- Handle 10,000 orders/second
- Ensure data consistency
- Real-time inventory updates
- Order processing with payment
- Scalable and fault-tolerant

### Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  API Gateway │────▶│   Order     │
└─────────────┘     └──────────────┘     │   Service   │
                                          └──────┬──────┘
                                                 │
                    ┌────────────────────────────┼────────────────┐
                    │                            │                │
              ┌─────▼──────┐            ┌───────▼────┐    ┌──────▼──────┐
              │  Payment   │            │ Inventory  │    │  Notification│
              │  Service   │            │  Service   │    │   Service    │
              └─────┬──────┘            └─────┬──────┘    └──────┬───────┘
                    │                         │                   │
              ┌─────▼──────────────────────────▼───────────────────▼─────┐
              │                      Kafka Event Bus                      │
              └──────────────────────────────────────────────────────────┘
                    │                         │                   │
              ┌─────▼──────┐            ┌─────▼──────┐    ┌──────▼───────┐
              │ PostgreSQL │            │   Redis    │    │  Elasticsearch│
              └────────────┘            └────────────┘    └──────────────┘
```

---

## 1. Order Service - Core Implementation

### Order Entity and Repository

```kotlin
@Entity
@Table(name = "orders")
data class Order(
    @Id
    val id: String = UUID.randomUUID().toString(),
    
    @Column(nullable = false)
    val customerId: String,
    
    @Column(nullable = false)
    val status: OrderStatus,
    
    @Column(nullable = false)
    val totalAmount: BigDecimal,
    
    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL])
    val items: List<OrderItem> = emptyList(),
    
    @Version
    val version: Long = 0,  // Optimistic locking
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class OrderStatus {
    PENDING, PAYMENT_PROCESSING, PAID, INVENTORY_RESERVED, 
    CONFIRMED, SHIPPED, DELIVERED, CANCELLED, FAILED
}

@Entity
@Table(name = "order_items")
data class OrderItem(
    @Id
    val id: String = UUID.randomUUID().toString(),
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    val order: Order,
    
    val productId: String,
    val quantity: Int,
    val price: BigDecimal
)

interface OrderRepository : CoroutineCrudRepository<Order, String> {
    suspend fun findByCustomerId(customerId: String): List<Order>
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt < :before")
    suspend fun findStaleOrders(status: OrderStatus, before: LocalDateTime): List<Order>
}
```

### Order Service with Saga Pattern

```kotlin
@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val eventPublisher: EventPublisher,
    private val idempotencyService: IdempotencyService,
    private val distributedLock: DistributedLock
) {
    
    suspend fun createOrder(request: CreateOrderRequest): Result<Order> {
        // Idempotency check
        val idempotencyKey = request.idempotencyKey
        idempotencyService.checkAndStore(idempotencyKey)?.let {
            return Result.Success(it)
        }
        
        return try {
            // Create order with PENDING status
            val order = Order(
                customerId = request.customerId,
                status = OrderStatus.PENDING,
                totalAmount = request.items.sumOf { it.price * it.quantity.toBigDecimal() },
                items = request.items.map { OrderItem(order = Order(), it.productId, it.quantity, it.price) }
            )
            
            val savedOrder = orderRepository.save(order)
            
            // Publish OrderCreated event to start saga
            eventPublisher.publish(
                OrderCreatedEvent(
                    orderId = savedOrder.id,
                    customerId = savedOrder.customerId,
                    items = savedOrder.items.map { 
                        OrderItemDTO(it.productId, it.quantity, it.price) 
                    },
                    totalAmount = savedOrder.totalAmount,
                    timestamp = LocalDateTime.now()
                )
            )
            
            // Store for idempotency
            idempotencyService.store(idempotencyKey, savedOrder)
            
            Result.Success(savedOrder)
            
        } catch (e: Exception) {
            logger.error("Failed to create order", e)
            Result.Failure(e)
        }
    }
    
    suspend fun updateOrderStatus(
        orderId: String, 
        newStatus: OrderStatus,
        reason: String? = null
    ): Result<Order> {
        return distributedLock.withLock("order:$orderId") {
            try {
                val order = orderRepository.findById(orderId)
                    ?: return@withLock Result.Failure(OrderNotFoundException())
                
                // Validate state transition
                if (!isValidTransition(order.status, newStatus)) {
                    return@withLock Result.Failure(
                        InvalidStateTransitionException("Cannot transition from ${order.status} to $newStatus")
                    )
                }
                
                val updatedOrder = order.copy(
                    status = newStatus,
                    updatedAt = LocalDateTime.now()
                )
                
                val saved = orderRepository.save(updatedOrder)
                
                // Publish status change event
                eventPublisher.publish(
                    OrderStatusChangedEvent(
                        orderId = saved.id,
                        oldStatus = order.status,
                        newStatus = newStatus,
                        reason = reason,
                        timestamp = LocalDateTime.now()
                    )
                )
                
                Result.Success(saved)
                
            } catch (e: OptimisticLockException) {
                logger.warn("Optimistic lock exception for order $orderId")
                Result.Failure(ConcurrentModificationException())
            } catch (e: Exception) {
                logger.error("Failed to update order status", e)
                Result.Failure(e)
            }
        }
    }
    
    private fun isValidTransition(from: OrderStatus, to: OrderStatus): Boolean {
        val validTransitions = mapOf(
            OrderStatus.PENDING to setOf(OrderStatus.PAYMENT_PROCESSING, OrderStatus.CANCELLED),
            OrderStatus.PAYMENT_PROCESSING to setOf(OrderStatus.PAID, OrderStatus.FAILED),
            OrderStatus.PAID to setOf(OrderStatus.INVENTORY_RESERVED, OrderStatus.FAILED),
            OrderStatus.INVENTORY_RESERVED to setOf(OrderStatus.CONFIRMED, OrderStatus.FAILED),
            OrderStatus.CONFIRMED to setOf(OrderStatus.SHIPPED),
            OrderStatus.SHIPPED to setOf(OrderStatus.DELIVERED)
        )
        
        return validTransitions[from]?.contains(to) ?: false
    }
}
```

---

## 2. Distributed Caching with Redis

### Multi-Level Cache Implementation

```kotlin
@Configuration
class CacheConfig {
    
    @Bean
    fun redisTemplate(connectionFactory: RedisConnectionFactory): RedisTemplate<String, Any> {
        return RedisTemplate<String, Any>().apply {
            this.connectionFactory = connectionFactory
            keySerializer = StringRedisSerializer()
            valueSerializer = GenericJackson2JsonRedisSerializer()
            hashKeySerializer = StringRedisSerializer()
            hashValueSerializer = GenericJackson2JsonRedisSerializer()
        }
    }
    
    @Bean
    fun localCache(): Cache<String, Any> {
        return Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .recordStats()
            .build()
    }
}

@Service
class MultiLevelCacheService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val localCache: Cache<String, Any>,
    private val cacheEventPublisher: CacheEventPublisher
) {
    
    suspend fun <T> get(key: String, type: Class<T>): T? {
        // L1: Local cache
        localCache.getIfPresent(key)?.let {
            return type.cast(it)
        }
        
        // L2: Redis
        return withContext(Dispatchers.IO) {
            redisTemplate.opsForValue().get(key)?.let { value ->
                // Populate L1 cache
                localCache.put(key, value)
                type.cast(value)
            }
        }
    }
    
    suspend fun put(key: String, value: Any, ttl: Duration = Duration.ofHours(1)) {
        // Write to both caches
        localCache.put(key, value)
        
        withContext(Dispatchers.IO) {
            redisTemplate.opsForValue().set(key, value, ttl)
        }
        
        // Publish cache invalidation event to other instances
        cacheEventPublisher.publishInvalidation(key)
    }
    
    suspend fun invalidate(key: String) {
        localCache.invalidate(key)
        
        withContext(Dispatchers.IO) {
            redisTemplate.delete(key)
        }
        
        cacheEventPublisher.publishInvalidation(key)
    }
    
    suspend fun <T> getOrLoad(
        key: String,
        type: Class<T>,
        loader: suspend () -> T
    ): T {
        // Try cache first
        get(key, type)?.let { return it }
        
        // Load from source
        val value = loader()
        put(key, value as Any)
        
        return value
    }
}

// Cache-aside pattern for products
@Service
class ProductCacheService(
    private val cacheService: MultiLevelCacheService,
    private val productRepository: ProductRepository
) {
    
    suspend fun getProduct(productId: String): Product? {
        return cacheService.getOrLoad(
            key = "product:$productId",
            type = Product::class.java
        ) {
            productRepository.findById(productId)
                ?: throw ProductNotFoundException()
        }
    }
    
    suspend fun updateProduct(product: Product): Product {
        val saved = productRepository.save(product)
        
        // Invalidate cache
        cacheService.invalidate("product:${product.id}")
        
        return saved
    }
}

// Write-through cache for inventory
@Service
class InventoryCacheService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val inventoryRepository: InventoryRepository
) {
    
    suspend fun getStock(productId: String): Int {
        return withContext(Dispatchers.IO) {
            redisTemplate.opsForValue().get("inventory:$productId") as? Int
        } ?: loadAndCache(productId)
    }
    
    suspend fun reserveStock(productId: String, quantity: Int): Boolean {
        return withContext(Dispatchers.IO) {
            val script = """
                local current = redis.call('GET', KEYS[1])
                if current == false then
                    return -1
                end
                current = tonumber(current)
                if current >= tonumber(ARGV[1]) then
                    redis.call('DECRBY', KEYS[1], ARGV[1])
                    return 1
                else
                    return 0
                end
            """.trimIndent()
            
            val result = redisTemplate.execute(
                RedisScript.of(script, Long::class.java),
                listOf("inventory:$productId"),
                quantity
            )
            
            when (result) {
                1L -> {
                    // Update database asynchronously
                    inventoryRepository.decrementStock(productId, quantity)
                    true
                }
                0L -> false
                else -> {
                    loadAndCache(productId)
                    reserveStock(productId, quantity)
                }
            }
        }
    }
    
    private suspend fun loadAndCache(productId: String): Int {
        val stock = inventoryRepository.getStock(productId)
        redisTemplate.opsForValue().set("inventory:$productId", stock)
        return stock
    }
}
```

---

## 3. Event-Driven Architecture with Kafka

### Event Definitions

```kotlin
sealed class DomainEvent {
    abstract val eventId: String
    abstract val timestamp: LocalDateTime
    abstract val aggregateId: String
}

data class OrderCreatedEvent(
    override val eventId: String = UUID.randomUUID().toString(),
    override val timestamp: LocalDateTime = LocalDateTime.now(),
    override val aggregateId: String,
    val orderId: String,
    val customerId: String,
    val items: List<OrderItemDTO>,
    val totalAmount: BigDecimal
) : DomainEvent()

data class PaymentProcessedEvent(
    override val eventId: String = UUID.randomUUID().toString(),
    override val timestamp: LocalDateTime = LocalDateTime.now(),
    override val aggregateId: String,
    val orderId: String,
    val paymentId: String,
    val amount: BigDecimal,
    val success: Boolean
) : DomainEvent()

data class InventoryReservedEvent(
    override val eventId: String = UUID.randomUUID().toString(),
    override val timestamp: LocalDateTime = LocalDateTime.now(),
    override val aggregateId: String,
    val orderId: String,
    val reservationId: String,
    val items: List<OrderItemDTO>,
    val success: Boolean
) : DomainEvent()
```

### Kafka Configuration

```kotlin
@Configuration
class KafkaConfig {
    
    @Bean
    fun producerFactory(): ProducerFactory<String, DomainEvent> {
        val config = mapOf(
            ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to "localhost:9092",
            ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
            ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java,
            ProducerConfig.ACKS_CONFIG to "all",
            ProducerConfig.RETRIES_CONFIG to 3,
            ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION to 1,
            ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG to true,
            ProducerConfig.COMPRESSION_TYPE_CONFIG to "snappy"
        )
        return DefaultKafkaProducerFactory(config)
    }
    
    @Bean
    fun kafkaTemplate(): KafkaTemplate<String, DomainEvent> {
        return KafkaTemplate(producerFactory())
    }
    
    @Bean
    fun consumerFactory(): ConsumerFactory<String, DomainEvent> {
        val config = mapOf(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to "localhost:9092",
            ConsumerConfig.GROUP_ID_CONFIG to "order-service",
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG to StringDeserializer::class.java,
            ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG to JsonDeserializer::class.java,
            ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG to false,
            ConsumerConfig.MAX_POLL_RECORDS_CONFIG to 100,
            ConsumerConfig.ISOLATION_LEVEL_CONFIG to "read_committed",
            JsonDeserializer.TRUSTED_PACKAGES to "*"
        )
        return DefaultKafkaConsumerFactory(config)
    }
}
```

### Event Publisher with Transactional Outbox

```kotlin
@Entity
@Table(name = "outbox_events")
data class OutboxEvent(
    @Id
    val id: String = UUID.randomUUID().toString(),
    
    val aggregateId: String,
    val eventType: String,
    
    @Column(columnDefinition = "TEXT")
    val payload: String,
    
    val createdAt: LocalDateTime = LocalDateTime.now(),
    var processed: Boolean = false,
    var processedAt: LocalDateTime? = null
)

interface OutboxRepository : CoroutineCrudRepository<OutboxEvent, String> {
    suspend fun findByProcessedFalseOrderByCreatedAt(): List<OutboxEvent>
}

@Service
class EventPublisher(
    private val outboxRepository: OutboxRepository,
    private val objectMapper: ObjectMapper
) {
    
    @Transactional
    suspend fun publish(event: DomainEvent) {
        // Store event in outbox table (same transaction as business logic)
        val outboxEvent = OutboxEvent(
            aggregateId = event.aggregateId,
            eventType = event::class.simpleName ?: "Unknown",
            payload = objectMapper.writeValueAsString(event)
        )
        
        outboxRepository.save(outboxEvent)
    }
}

// Outbox processor (separate service/scheduled job)
@Service
class OutboxProcessor(
    private val outboxRepository: OutboxRepository,
    private val kafkaTemplate: KafkaTemplate<String, DomainEvent>,
    private val objectMapper: ObjectMapper
) {
    
    @Scheduled(fixedDelay = 1000)
    fun processOutbox() = runBlocking {
        val events = outboxRepository.findByProcessedFalseOrderByCreatedAt()
        
        events.forEach { outboxEvent ->
            try {
                val event = deserializeEvent(outboxEvent)
                
                // Publish to Kafka
                kafkaTemplate.send(
                    getTopic(event),
                    event.aggregateId,
                    event
                ).await()
                
                // Mark as processed
                outboxRepository.save(
                    outboxEvent.copy(
                        processed = true,
                        processedAt = LocalDateTime.now()
                    )
                )
                
            } catch (e: Exception) {
                logger.error("Failed to process outbox event ${outboxEvent.id}", e)
            }
        }
    }
    
    private fun deserializeEvent(outboxEvent: OutboxEvent): DomainEvent {
        return when (outboxEvent.eventType) {
            "OrderCreatedEvent" -> objectMapper.readValue(outboxEvent.payload, OrderCreatedEvent::class.java)
            "PaymentProcessedEvent" -> objectMapper.readValue(outboxEvent.payload, PaymentProcessedEvent::class.java)
            "InventoryReservedEvent" -> objectMapper.readValue(outboxEvent.payload, InventoryReservedEvent::class.java)
            else -> throw IllegalArgumentException("Unknown event type: ${outboxEvent.eventType}")
        }
    }
    
    private fun getTopic(event: DomainEvent): String {
        return when (event) {
            is OrderCreatedEvent -> "order-events"
            is PaymentProcessedEvent -> "payment-events"
            is InventoryReservedEvent -> "inventory-events"
            else -> "domain-events"
        }
    }
}
```


### Saga Orchestration

```kotlin
@Service
class OrderSagaOrchestrator(
    private val orderService: OrderService,
    private val paymentService: PaymentService,
    private val inventoryService: InventoryService,
    private val eventPublisher: EventPublisher
) {
    
    @KafkaListener(topics = ["order-events"], groupId = "saga-orchestrator")
    fun handleOrderCreated(event: OrderCreatedEvent, acknowledgment: Acknowledgment) {
        runBlocking {
            try {
                // Step 1: Process payment
                val paymentResult = paymentService.processPayment(
                    orderId = event.orderId,
                    amount = event.totalAmount
                )
                
                if (!paymentResult.success) {
                    compensateOrder(event.orderId, "Payment failed")
                    acknowledgment.acknowledge()
                    return@runBlocking
                }
                
                // Step 2: Reserve inventory
                val inventoryResult = inventoryService.reserveInventory(
                    orderId = event.orderId,
                    items = event.items
                )
                
                if (!inventoryResult.success) {
                    // Compensate: Refund payment
                    paymentService.refundPayment(paymentResult.paymentId)
                    compensateOrder(event.orderId, "Inventory reservation failed")
                    acknowledgment.acknowledge()
                    return@runBlocking
                }
                
                // Step 3: Confirm order
                orderService.updateOrderStatus(event.orderId, OrderStatus.CONFIRMED)
                
                acknowledgment.acknowledge()
                
            } catch (e: Exception) {
                logger.error("Saga failed for order ${event.orderId}", e)
                // Don't acknowledge - message will be redelivered
            }
        }
    }
    
    private suspend fun compensateOrder(orderId: String, reason: String) {
        orderService.updateOrderStatus(orderId, OrderStatus.FAILED, reason)
    }
}
```

---

## 4. Payment Service

### Payment Processing with Idempotency

```kotlin
@Service
class PaymentService(
    private val paymentRepository: PaymentRepository,
    private val paymentGateway: PaymentGateway,
    private val distributedLock: DistributedLock,
    private val eventPublisher: EventPublisher
) {
    
    suspend fun processPayment(orderId: String, amount: BigDecimal): PaymentResult {
        return distributedLock.withLock("payment:$orderId") {
            // Check if payment already processed (idempotency)
            paymentRepository.findByOrderId(orderId)?.let {
                return@withLock PaymentResult(
                    success = it.status == PaymentStatus.SUCCESS,
                    paymentId = it.id,
                    message = "Payment already processed"
                )
            }
            
            try {
                // Create payment record
                val payment = Payment(
                    orderId = orderId,
                    amount = amount,
                    status = PaymentStatus.PROCESSING
                )
                
                val saved = paymentRepository.save(payment)
                
                // Call external payment gateway
                val gatewayResult = withTimeout(10000) {
                    paymentGateway.charge(amount)
                }
                
                // Update payment status
                val updated = saved.copy(
                    status = if (gatewayResult.success) PaymentStatus.SUCCESS else PaymentStatus.FAILED,
                    transactionId = gatewayResult.transactionId,
                    updatedAt = LocalDateTime.now()
                )
                
                paymentRepository.save(updated)
                
                // Publish event
                eventPublisher.publish(
                    PaymentProcessedEvent(
                        aggregateId = orderId,
                        orderId = orderId,
                        paymentId = updated.id,
                        amount = amount,
                        success = gatewayResult.success
                    )
                )
                
                PaymentResult(
                    success = gatewayResult.success,
                    paymentId = updated.id,
                    message = gatewayResult.message
                )
                
            } catch (e: TimeoutCancellationException) {
                logger.error("Payment timeout for order $orderId")
                PaymentResult(success = false, paymentId = "", message = "Payment timeout")
            } catch (e: Exception) {
                logger.error("Payment failed for order $orderId", e)
                PaymentResult(success = false, paymentId = "", message = e.message ?: "Payment failed")
            }
        }
    }
    
    suspend fun refundPayment(paymentId: String): Boolean {
        return try {
            val payment = paymentRepository.findById(paymentId)
                ?: throw PaymentNotFoundException()
            
            if (payment.status != PaymentStatus.SUCCESS) {
                throw IllegalStateException("Cannot refund non-successful payment")
            }
            
            val refundResult = paymentGateway.refund(payment.transactionId!!)
            
            if (refundResult.success) {
                paymentRepository.save(
                    payment.copy(
                        status = PaymentStatus.REFUNDED,
                        updatedAt = LocalDateTime.now()
                    )
                )
            }
            
            refundResult.success
            
        } catch (e: Exception) {
            logger.error("Refund failed for payment $paymentId", e)
            false
        }
    }
}
```

---

## 5. Inventory Service

### Inventory Management with Redis

```kotlin
@Service
class InventoryService(
    private val inventoryRepository: InventoryRepository,
    private val redisTemplate: RedisTemplate<String, Any>,
    private val eventPublisher: EventPublisher
) {
    
    suspend fun reserveInventory(orderId: String, items: List<OrderItemDTO>): InventoryResult {
        val reservationId = UUID.randomUUID().toString()
        val reservedItems = mutableListOf<String>()
        
        try {
            // Reserve each item
            for (item in items) {
                val reserved = reserveStock(item.productId, item.quantity, reservationId)
                
                if (!reserved) {
                    // Rollback previous reservations
                    reservedItems.forEach { productId ->
                        releaseReservation(productId, reservationId)
                    }
                    
                    return InventoryResult(
                        success = false,
                        reservationId = "",
                        message = "Insufficient stock for product ${item.productId}"
                    )
                }
                
                reservedItems.add(item.productId)
            }
            
            // Store reservation
            storeReservation(orderId, reservationId, items)
            
            // Publish event
            eventPublisher.publish(
                InventoryReservedEvent(
                    aggregateId = orderId,
                    orderId = orderId,
                    reservationId = reservationId,
                    items = items,
                    success = true
                )
            )
            
            return InventoryResult(
                success = true,
                reservationId = reservationId,
                message = "Inventory reserved successfully"
            )
            
        } catch (e: Exception) {
            logger.error("Inventory reservation failed for order $orderId", e)
            
            // Rollback
            reservedItems.forEach { productId ->
                releaseReservation(productId, reservationId)
            }
            
            return InventoryResult(
                success = false,
                reservationId = "",
                message = e.message ?: "Reservation failed"
            )
        }
    }
    
    private suspend fun reserveStock(
        productId: String,
        quantity: Int,
        reservationId: String
    ): Boolean = withContext(Dispatchers.IO) {
        val script = """
            local stock_key = 'inventory:' .. KEYS[1]
            local reservation_key = 'reservation:' .. KEYS[1] .. ':' .. ARGV[2]
            
            local current = redis.call('GET', stock_key)
            if current == false then
                return 0
            end
            
            current = tonumber(current)
            local quantity = tonumber(ARGV[1])
            
            if current >= quantity then
                redis.call('DECRBY', stock_key, quantity)
                redis.call('SET', reservation_key, quantity, 'EX', 600)
                return 1
            else
                return 0
            end
        """.trimIndent()
        
        val result = redisTemplate.execute(
            RedisScript.of(script, Long::class.java),
            listOf(productId),
            quantity,
            reservationId
        )
        
        result == 1L
    }
    
    private suspend fun releaseReservation(productId: String, reservationId: String) {
        withContext(Dispatchers.IO) {
            val script = """
                local stock_key = 'inventory:' .. KEYS[1]
                local reservation_key = 'reservation:' .. KEYS[1] .. ':' .. ARGV[1]
                
                local quantity = redis.call('GET', reservation_key)
                if quantity ~= false then
                    redis.call('INCRBY', stock_key, quantity)
                    redis.call('DEL', reservation_key)
                    return 1
                end
                return 0
            """.trimIndent()
            
            redisTemplate.execute(
                RedisScript.of(script, Long::class.java),
                listOf(productId),
                reservationId
            )
        }
    }
    
    private suspend fun storeReservation(
        orderId: String,
        reservationId: String,
        items: List<OrderItemDTO>
    ) {
        val reservation = Reservation(
            id = reservationId,
            orderId = orderId,
            items = items,
            expiresAt = LocalDateTime.now().plusMinutes(10)
        )
        
        inventoryRepository.saveReservation(reservation)
    }
    
    // Scheduled job to clean up expired reservations
    @Scheduled(fixedDelay = 60000)
    fun cleanupExpiredReservations() = runBlocking {
        val expired = inventoryRepository.findExpiredReservations(LocalDateTime.now())
        
        expired.forEach { reservation ->
            reservation.items.forEach { item ->
                releaseReservation(item.productId, reservation.id)
            }
            inventoryRepository.deleteReservation(reservation.id)
        }
    }
}
```

---

## 6. Distributed Locking

### Redis-based Distributed Lock

```kotlin
interface DistributedLock {
    suspend fun <T> withLock(key: String, timeout: Duration = Duration.ofSeconds(10), block: suspend () -> T): T
}

@Service
class RedisDistributedLock(
    private val redisTemplate: RedisTemplate<String, Any>
) : DistributedLock {
    
    override suspend fun <T> withLock(
        key: String,
        timeout: Duration,
        block: suspend () -> T
    ): T {
        val lockKey = "lock:$key"
        val lockValue = UUID.randomUUID().toString()
        val acquired = acquireLock(lockKey, lockValue, timeout)
        
        if (!acquired) {
            throw LockAcquisitionException("Failed to acquire lock for $key")
        }
        
        return try {
            block()
        } finally {
            releaseLock(lockKey, lockValue)
        }
    }
    
    private suspend fun acquireLock(
        key: String,
        value: String,
        timeout: Duration
    ): Boolean = withContext(Dispatchers.IO) {
        val script = """
            return redis.call('SET', KEYS[1], ARGV[1], 'NX', 'PX', ARGV[2])
        """.trimIndent()
        
        val result = redisTemplate.execute(
            RedisScript.of(script, String::class.java),
            listOf(key),
            value,
            timeout.toMillis()
        )
        
        result == "OK"
    }
    
    private suspend fun releaseLock(key: String, value: String) {
        withContext(Dispatchers.IO) {
            val script = """
                if redis.call('GET', KEYS[1]) == ARGV[1] then
                    return redis.call('DEL', KEYS[1])
                else
                    return 0
                end
            """.trimIndent()
            
            redisTemplate.execute(
                RedisScript.of(script, Long::class.java),
                listOf(key),
                value
            )
        }
    }
}
```

---

## 7. Idempotency Service

### Ensuring Exactly-Once Processing

```kotlin
@Entity
@Table(name = "idempotency_keys")
data class IdempotencyRecord(
    @Id
    val key: String,
    
    @Column(columnDefinition = "TEXT")
    val response: String,
    
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "expires_at")
    val expiresAt: LocalDateTime = LocalDateTime.now().plusHours(24)
)

interface IdempotencyRepository : CoroutineCrudRepository<IdempotencyRecord, String> {
    suspend fun findByKeyAndExpiresAtAfter(key: String, now: LocalDateTime): IdempotencyRecord?
    suspend fun deleteByExpiresAtBefore(now: LocalDateTime)
}

@Service
class IdempotencyService(
    private val idempotencyRepository: IdempotencyRepository,
    private val objectMapper: ObjectMapper
) {
    
    suspend fun <T> checkAndStore(key: String): T? {
        val existing = idempotencyRepository.findByKeyAndExpiresAtAfter(
            key,
            LocalDateTime.now()
        )
        
        return existing?.let {
            objectMapper.readValue(it.response, Any::class.java) as? T
        }
    }
    
    suspend fun <T> store(key: String, response: T) {
        val record = IdempotencyRecord(
            key = key,
            response = objectMapper.writeValueAsString(response)
        )
        
        idempotencyRepository.save(record)
    }
    
    @Scheduled(fixedDelay = 3600000) // Every hour
    fun cleanupExpired() = runBlocking {
        idempotencyRepository.deleteByExpiresAtBefore(LocalDateTime.now())
    }
}
```

---

## 8. Rate Limiting

### Token Bucket Algorithm with Redis

```kotlin
@Service
class RateLimiter(
    private val redisTemplate: RedisTemplate<String, Any>
) {
    
    suspend fun allowRequest(
        key: String,
        maxRequests: Int,
        windowSeconds: Int
    ): Boolean = withContext(Dispatchers.IO) {
        val script = """
            local key = KEYS[1]
            local max_requests = tonumber(ARGV[1])
            local window = tonumber(ARGV[2])
            local current_time = tonumber(ARGV[3])
            
            local count = redis.call('GET', key)
            
            if count == false then
                redis.call('SET', key, 1, 'EX', window)
                return 1
            end
            
            count = tonumber(count)
            
            if count < max_requests then
                redis.call('INCR', key)
                return 1
            else
                return 0
            end
        """.trimIndent()
        
        val result = redisTemplate.execute(
            RedisScript.of(script, Long::class.java),
            listOf("rate_limit:$key"),
            maxRequests,
            windowSeconds,
            System.currentTimeMillis() / 1000
        )
        
        result == 1L
    }
    
    // Sliding window rate limiter
    suspend fun allowRequestSlidingWindow(
        key: String,
        maxRequests: Int,
        windowSeconds: Int
    ): Boolean = withContext(Dispatchers.IO) {
        val now = System.currentTimeMillis()
        val windowStart = now - (windowSeconds * 1000)
        
        val script = """
            local key = KEYS[1]
            local max_requests = tonumber(ARGV[1])
            local window_start = tonumber(ARGV[2])
            local now = tonumber(ARGV[3])
            
            redis.call('ZREMRANGEBYSCORE', key, 0, window_start)
            
            local count = redis.call('ZCARD', key)
            
            if count < max_requests then
                redis.call('ZADD', key, now, now)
                redis.call('EXPIRE', key, ARGV[4])
                return 1
            else
                return 0
            end
        """.trimIndent()
        
        val result = redisTemplate.execute(
            RedisScript.of(script, Long::class.java),
            listOf("rate_limit:sliding:$key"),
            maxRequests,
            windowStart,
            now,
            windowSeconds
        )
        
        result == 1L
    }
}

// Rate limiting filter
@Component
class RateLimitingFilter(
    private val rateLimiter: RateLimiter
) : OncePerRequestFilter() {
    
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val userId = request.getHeader("X-User-Id") ?: request.remoteAddr
        
        runBlocking {
            val allowed = rateLimiter.allowRequestSlidingWindow(
                key = userId,
                maxRequests = 100,
                windowSeconds = 60
            )
            
            if (allowed) {
                filterChain.doFilter(request, response)
            } else {
                response.status = HttpStatus.TOO_MANY_REQUESTS.value()
                response.writer.write("Rate limit exceeded")
            }
        }
    }
}
```

---

## 9. Circuit Breaker Pattern

### Resilient Service Communication

```kotlin
@Service
class ResilientPaymentGateway(
    private val httpClient: WebClient,
    circuitBreakerRegistry: CircuitBreakerRegistry,
    retryRegistry: RetryRegistry
) : PaymentGateway {
    
    private val circuitBreaker = circuitBreakerRegistry.circuitBreaker("payment-gateway")
    private val retry = retryRegistry.retry("payment-gateway")
    
    override suspend fun charge(amount: BigDecimal): GatewayResult {
        return executeWithResilience {
            httpClient.post()
                .uri("/charge")
                .bodyValue(mapOf("amount" to amount))
                .retrieve()
                .awaitBody<GatewayResult>()
        }
    }
    
    override suspend fun refund(transactionId: String): GatewayResult {
        return executeWithResilience {
            httpClient.post()
                .uri("/refund")
                .bodyValue(mapOf("transactionId" to transactionId))
                .retrieve()
                .awaitBody<GatewayResult>()
        }
    }
    
    private suspend fun <T> executeWithResilience(block: suspend () -> T): T {
        return try {
            circuitBreaker.executeSuspendFunction {
                retry.executeSuspendFunction {
                    withTimeout(5000) {
                        block()
                    }
                }
            }
        } catch (e: CallNotPermittedException) {
            logger.error("Circuit breaker is open")
            throw ServiceUnavailableException("Payment gateway unavailable")
        } catch (e: TimeoutCancellationException) {
            logger.error("Payment gateway timeout")
            throw GatewayTimeoutException()
        }
    }
}
```

---

## 10. Monitoring and Observability

### Metrics Collection

```kotlin
@Configuration
class MetricsConfig {
    
    @Bean
    fun meterRegistry(): MeterRegistry {
        return SimpleMeterRegistry()
    }
}

@Service
class MetricsService(
    private val meterRegistry: MeterRegistry
) {
    
    fun recordOrderCreated() {
        meterRegistry.counter("orders.created").increment()
    }
    
    fun recordOrderProcessingTime(duration: Long) {
        meterRegistry.timer("orders.processing.time")
            .record(duration, TimeUnit.MILLISECONDS)
    }
    
    fun recordCacheHit(cacheName: String) {
        meterRegistry.counter("cache.hits", "cache", cacheName).increment()
    }
    
    fun recordCacheMiss(cacheName: String) {
        meterRegistry.counter("cache.misses", "cache", cacheName).increment()
    }
    
    fun recordPaymentSuccess() {
        meterRegistry.counter("payments.success").increment()
    }
    
    fun recordPaymentFailure() {
        meterRegistry.counter("payments.failure").increment()
    }
}

// Aspect for automatic metrics
@Aspect
@Component
class MetricsAspect(
    private val metricsService: MetricsService
) {
    
    @Around("@annotation(Timed)")
    fun measureExecutionTime(joinPoint: ProceedingJoinPoint): Any? {
        val start = System.currentTimeMillis()
        
        return try {
            joinPoint.proceed()
        } finally {
            val duration = System.currentTimeMillis() - start
            val methodName = joinPoint.signature.name
            metricsService.recordOrderProcessingTime(duration)
        }
    }
}
```

---

## Key Design Decisions

### 1. Data Consistency
- **Optimistic Locking**: Version field in Order entity
- **Distributed Locks**: Redis-based locks for critical sections
- **Saga Pattern**: Orchestrated saga for order processing
- **Transactional Outbox**: Ensures event publishing consistency

### 2. Scalability
- **Horizontal Scaling**: Stateless services
- **Caching**: Multi-level cache (L1: Caffeine, L2: Redis)
- **Async Processing**: Kafka for event-driven communication
- **Database Sharding**: Partition by customer_id or order_id

### 3. Fault Tolerance
- **Circuit Breaker**: Prevents cascade failures
- **Retry Logic**: Exponential backoff
- **Timeouts**: All external calls have timeouts
- **Idempotency**: Prevents duplicate processing

### 4. Performance
- **Connection Pooling**: HikariCP configuration
- **Batch Processing**: Kafka batch consumption
- **Redis Lua Scripts**: Atomic operations
- **Database Indexes**: On frequently queried fields

---

## Trade-offs

| Decision | Pros | Cons |
|----------|------|------|
| Saga Pattern | Maintains consistency across services | Complex implementation, eventual consistency |
| Redis Caching | Fast reads, reduced DB load | Cache invalidation complexity, memory cost |
| Kafka Events | Decoupled services, scalable | Eventual consistency, debugging difficulty |
| Optimistic Locking | Better concurrency | Retry logic needed |
| Transactional Outbox | Guaranteed event delivery | Additional table, polling overhead |

---

## Scaling Strategy

### Current: 10K orders/second
- 5 Order Service instances
- 3 Payment Service instances
- 3 Inventory Service instances
- Redis Cluster (3 masters, 3 replicas)
- Kafka Cluster (3 brokers)
- PostgreSQL (Master-Replica setup)

### Future: 100K orders/second
- Auto-scaling (10-50 instances per service)
- Database sharding by customer_id
- Redis Cluster expansion
- Kafka partition increase
- CDN for static content
- Read replicas for analytics

---

## Congratulations!

You now understand:
✅ Scalable microservices architecture
✅ Data consistency patterns
✅ Distributed caching strategies
✅ Event-driven design with Kafka
✅ Fault tolerance patterns
✅ Performance optimization
✅ Real-world trade-offs

**Ready for senior backend interviews! 🚀**
