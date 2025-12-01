---
title: "Spring Boot Microservices - Complete Interview Guide"
date: "2024-12-13"
category: "Interview Preparation"
tags: ["Spring Boot", "Microservices", "Spring Cloud", "Interview", "Architecture"]
---

# Spring Boot Microservices - Complete Interview Guide

## Core Microservices Concepts

### Q1: What are microservices and their advantages?

**Answer:**
Microservices are an architectural style where an application is composed of small, independent services that communicate over well-defined APIs.

**Advantages:**
- Independent deployment and scaling
- Technology diversity
- Fault isolation
- Easier to understand and maintain
- Team autonomy

**Disadvantages:**
- Distributed system complexity
- Network latency
- Data consistency challenges
- Testing complexity
- Operational overhead

---

## Spring Cloud Components

### Q2: Explain Service Discovery with Eureka

```kotlin
// Eureka Server
@SpringBootApplication
@EnableEurekaServer
class EurekaServerApplication

// application.yml
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false

// Eureka Client (Service)
@SpringBootApplication
@EnableDiscoveryClient
class UserServiceApplication

// application.yml
spring:
  application:
    name: user-service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 30
```

**Key Points:**
- Service registration and discovery
- Health checks
- Load balancing
- Self-preservation mode

---

### Q3: Implement API Gateway with Spring Cloud Gateway

```kotlin
@Configuration
class GatewayConfig {
    
    @Bean
    fun customRouteLocator(builder: RouteLocatorBuilder): RouteLocator {
        return builder.routes()
            // User Service routes
            .route("user-service") { r ->
                r.path("/api/users/**")
                    .filters { f ->
                        f.rewritePath("/api/users/(?<segment>.*)", "/\${segment}")
                        f.addRequestHeader("X-Gateway", "Spring-Cloud-Gateway")
                        f.circuitBreaker { config ->
                            config.setName("userServiceCircuitBreaker")
                            config.setFallbackUri("forward:/fallback/users")
                        }
                        f.retry { config ->
                            config.setRetries(3)
                            config.setStatuses(HttpStatus.INTERNAL_SERVER_ERROR)
                        }
                    }
                    .uri("lb://user-service")
            }
            // Order Service routes
            .route("order-service") { r ->
                r.path("/api/orders/**")
                    .filters { f ->
                        f.rewritePath("/api/orders/(?<segment>.*)", "/\${segment}")
                        f.requestRateLimiter { config ->
                            config.setRateLimiter(redisRateLimiter())
                            config.setKeyResolver(userKeyResolver())
                        }
                    }
                    .uri("lb://order-service")
            }
            .build()
    }
    
    @Bean
    fun redisRateLimiter(): RedisRateLimiter {
        return RedisRateLimiter(10, 20) // 10 requests per second, burst of 20
    }
    
    @Bean
    fun userKeyResolver(): KeyResolver {
        return KeyResolver { exchange ->
            Mono.just(exchange.request.headers.getFirst("X-User-Id") ?: "anonymous")
        }
    }
}

// Global filters
@Component
class AuthenticationFilter : GlobalFilter, Ordered {
    
    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        
        // Skip authentication for public endpoints
        if (request.path.value().startsWith("/api/auth")) {
            return chain.filter(exchange)
        }
        
        // Validate JWT token
        val token = request.headers.getFirst("Authorization")?.removePrefix("Bearer ")
        
        if (token == null || !isValidToken(token)) {
            exchange.response.statusCode = HttpStatus.UNAUTHORIZED
            return exchange.response.setComplete()
        }
        
        // Add user info to headers
        val userId = extractUserId(token)
        val mutatedRequest = exchange.request.mutate()
            .header("X-User-Id", userId)
            .build()
        
        return chain.filter(exchange.mutate().request(mutatedRequest).build())
    }
    
    override fun getOrder(): Int = -1
    
    private fun isValidToken(token: String): Boolean {
        // JWT validation logic
        return true
    }
    
    private fun extractUserId(token: String): String {
        // Extract user ID from JWT
        return "user123"
    }
}

// Fallback controller
@RestController
@RequestMapping("/fallback")
class FallbackController {
    
    @GetMapping("/users")
    fun userServiceFallback(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(mapOf(
            "message" to "User service is temporarily unavailable",
            "status" to "fallback"
        ))
    }
}
```

**Key Features:**
- Route configuration
- Load balancing
- Circuit breaker
- Rate limiting
- Request/response transformation
- Authentication

---

### Q4: Implement Circuit Breaker with Resilience4j

```kotlin
// Dependencies
dependencies {
    implementation("io.github.resilience4j:resilience4j-spring-boot3:2.1.0")
    implementation("org.springframework.boot:spring-boot-starter-aop")
}

// Configuration
resilience4j:
  circuitbreaker:
    instances:
      userService:
        register-health-indicator: true
        sliding-window-size: 10
        minimum-number-of-calls: 5
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
        wait-duration-in-open-state: 10s
        failure-rate-threshold: 50
        slow-call-rate-threshold: 100
        slow-call-duration-threshold: 2s
        
  retry:
    instances:
      userService:
        max-attempts: 3
        wait-duration: 1s
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2
        retry-exceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException
          
  bulkhead:
    instances:
      userService:
        max-concurrent-calls: 10
        max-wait-duration: 1s
        
  timelimiter:
    instances:
      userService:
        timeout-duration: 3s

// Service implementation
@Service
class OrderService(
    private val userServiceClient: UserServiceClient,
    private val circuitBreakerRegistry: CircuitBreakerRegistry
) {
    
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    @Retry(name = "userService")
    @Bulkhead(name = "userService")
    @TimeLimiter(name = "userService")
    suspend fun getUser(userId: String): User {
        return userServiceClient.getUser(userId)
    }
    
    private suspend fun getUserFallback(userId: String, ex: Exception): User {
        logger.error("Fallback triggered for user $userId", ex)
        return User(
            id = userId,
            name = "Unknown User",
            email = "unknown@example.com"
        )
    }
    
    // Programmatic circuit breaker
    suspend fun getUserWithProgrammaticCircuitBreaker(userId: String): User {
        val circuitBreaker = circuitBreakerRegistry.circuitBreaker("userService")
        
        return try {
            circuitBreaker.executeSuspendFunction {
                userServiceClient.getUser(userId)
            }
        } catch (e: CallNotPermittedException) {
            logger.error("Circuit breaker is open")
            User(userId, "Unknown", "unknown@example.com")
        }
    }
}

// Circuit breaker event listener
@Component
class CircuitBreakerEventListener(
    circuitBreakerRegistry: CircuitBreakerRegistry
) {
    
    init {
        circuitBreakerRegistry.allCircuitBreakers.forEach { circuitBreaker ->
            circuitBreaker.eventPublisher
                .onStateTransition { event ->
                    logger.info(
                        "Circuit breaker ${event.circuitBreakerName} " +
                        "transitioned from ${event.stateTransition.fromState} " +
                        "to ${event.stateTransition.toState}"
                    )
                }
                .onError { event ->
                    logger.error(
                        "Circuit breaker ${event.circuitBreakerName} " +
                        "recorded error: ${event.throwable.message}"
                    )
                }
        }
    }
}
```

**Key Concepts:**
- Circuit states: CLOSED, OPEN, HALF_OPEN
- Sliding window for failure tracking
- Automatic state transitions
- Fallback methods
- Event monitoring

---

### Q5: Implement Distributed Configuration with Spring Cloud Config

```kotlin
// Config Server
@SpringBootApplication
@EnableConfigServer
class ConfigServerApplication

// application.yml (Config Server)
server:
  port: 8888

spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/myorg/config-repo
          default-label: main
          search-paths: '{application}'
        # Or use native file system
        native:
          search-locations: classpath:/config

// Config Client (Microservice)
// bootstrap.yml
spring:
  application:
    name: user-service
  cloud:
    config:
      uri: http://localhost:8888
      fail-fast: true
      retry:
        max-attempts: 6
        initial-interval: 1000
        multiplier: 1.1

// Refresh configuration at runtime
@RestController
@RefreshScope
class UserController(
    @Value("\${user.max-connections}") private var maxConnections: Int,
    @Value("\${user.timeout}") private var timeout: Int
) {
    
    @GetMapping("/config")
    fun getConfig(): Map<String, Any> {
        return mapOf(
            "maxConnections" to maxConnections,
            "timeout" to timeout
        )
    }
}

// Trigger refresh
// POST http://localhost:8080/actuator/refresh

// Config properties with validation
@ConfigurationProperties(prefix = "user")
@Validated
data class UserProperties(
    @field:Min(1)
    @field:Max(1000)
    var maxConnections: Int = 100,
    
    @field:Min(1000)
    @field:Max(60000)
    var timeout: Int = 5000,
    
    @field:NotBlank
    var apiKey: String = ""
)

// Encrypted properties
// In config file:
# user.api-key={cipher}AQA...encrypted-value...

// Config server with encryption
@Configuration
class EncryptionConfig {
    
    @Bean
    fun textEncryptor(): TextEncryptor {
        return Encryptors.text("password", "salt")
    }
}
```

**Key Features:**
- Centralized configuration
- Environment-specific configs
- Dynamic refresh
- Encryption support
- Git/native backend

---

## Inter-Service Communication

### Q6: Implement Feign Client for REST Communication

```kotlin
// Enable Feign
@SpringBootApplication
@EnableFeignClients
class OrderServiceApplication

// Feign client interface
@FeignClient(
    name = "user-service",
    fallback = UserServiceFallback::class,
    configuration = [FeignConfig::class]
)
interface UserServiceClient {
    
    @GetMapping("/users/{id}")
    fun getUser(@PathVariable id: String): User
    
    @PostMapping("/users")
    fun createUser(@RequestBody request: CreateUserRequest): User
    
    @GetMapping("/users")
    fun getUsers(
        @RequestParam page: Int,
        @RequestParam size: Int
    ): Page<User>
}

// Fallback implementation
@Component
class UserServiceFallback : UserServiceClient {
    
    override fun getUser(id: String): User {
        return User(id, "Unknown", "unknown@example.com")
    }
    
    override fun createUser(request: CreateUserRequest): User {
        throw FeignException.ServiceUnavailable("User service unavailable", Request.create(
            Request.HttpMethod.POST, "/users", emptyMap(), null, Charset.defaultCharset()
        ), null, null)
    }
    
    override fun getUsers(page: Int, size: Int): Page<User> {
        return Page.empty()
    }
}

// Feign configuration
@Configuration
class FeignConfig {
    
    @Bean
    fun feignLoggerLevel(): Logger.Level {
        return Logger.Level.FULL
    }
    
    @Bean
    fun requestInterceptor(): RequestInterceptor {
        return RequestInterceptor { template ->
            // Add authentication header
            template.header("Authorization", "Bearer ${getToken()}")
            // Add correlation ID
            template.header("X-Correlation-Id", UUID.randomUUID().toString())
        }
    }
    
    @Bean
    fun errorDecoder(): ErrorDecoder {
        return ErrorDecoder { methodKey, response ->
            when (response.status()) {
                404 -> UserNotFoundException("User not found")
                503 -> ServiceUnavailableException("Service unavailable")
                else -> FeignException.errorStatus(methodKey, response)
            }
        }
    }
    
    @Bean
    fun retryer(): Retryer {
        return Retryer.Default(1000, 3000, 3)
    }
    
    private fun getToken(): String {
        // Get JWT token from security context
        return "token"
    }
}

// Usage in service
@Service
class OrderService(
    private val userServiceClient: UserServiceClient
) {
    
    fun createOrder(request: CreateOrderRequest): Order {
        // Fetch user details
        val user = userServiceClient.getUser(request.userId)
        
        // Create order
        return Order(
            id = UUID.randomUUID().toString(),
            userId = user.id,
            items = request.items,
            total = calculateTotal(request.items)
        )
    }
}
```

**Key Features:**
- Declarative REST client
- Load balancing
- Fallback support
- Request/response interceptors
- Error handling
- Retry mechanism

---

### Q7: Implement Async Communication with Kafka

```kotlin
// Kafka configuration
@Configuration
class KafkaConfig {
    
    @Bean
    fun producerFactory(): ProducerFactory<String, Any> {
        val config = mapOf(
            ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to "localhost:9092",
            ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
            ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java,
            ProducerConfig.ACKS_CONFIG to "all",
            ProducerConfig.RETRIES_CONFIG to 3,
            ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG to true,
            ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION to 1
        )
        return DefaultKafkaProducerFactory(config)
    }
    
    @Bean
    fun kafkaTemplate(): KafkaTemplate<String, Any> {
        return KafkaTemplate(producerFactory())
    }
    
    @Bean
    fun consumerFactory(): ConsumerFactory<String, OrderEvent> {
        val config = mapOf(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to "localhost:9092",
            ConsumerConfig.GROUP_ID_CONFIG to "order-service",
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG to StringDeserializer::class.java,
            ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG to JsonDeserializer::class.java,
            ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG to false,
            ConsumerConfig.AUTO_OFFSET_RESET_CONFIG to "earliest",
            JsonDeserializer.TRUSTED_PACKAGES to "*"
        )
        return DefaultKafkaConsumerFactory(config)
    }
    
    @Bean
    fun kafkaListenerContainerFactory(): ConcurrentKafkaListenerContainerFactory<String, OrderEvent> {
        val factory = ConcurrentKafkaListenerContainerFactory<String, OrderEvent>()
        factory.consumerFactory = consumerFactory()
        factory.containerProperties.ackMode = ContainerProperties.AckMode.MANUAL
        factory.setConcurrency(3)
        return factory
    }
}

// Event publisher
@Service
class EventPublisher(
    private val kafkaTemplate: KafkaTemplate<String, Any>
) {
    
    suspend fun publishOrderCreated(order: Order) {
        val event = OrderCreatedEvent(
            orderId = order.id,
            userId = order.userId,
            items = order.items,
            total = order.total,
            timestamp = LocalDateTime.now()
        )
        
        kafkaTemplate.send("order-events", order.id, event).await()
        logger.info("Published order created event: ${order.id}")
    }
    
    suspend fun publishWithCallback(topic: String, key: String, event: Any) {
        kafkaTemplate.send(topic, key, event)
            .addCallback(
                { result ->
                    logger.info("Published to $topic: offset=${result?.recordMetadata?.offset()}")
                },
                { ex ->
                    logger.error("Failed to publish event", ex)
                }
            )
    }
}

// Event consumer
@Service
class OrderEventConsumer(
    private val inventoryService: InventoryService,
    private val notificationService: NotificationService
) {
    
    @KafkaListener(
        topics = ["order-events"],
        groupId = "inventory-service"
    )
    fun handleOrderCreated(event: OrderCreatedEvent, acknowledgment: Acknowledgment) {
        try {
            logger.info("Received order event: ${event.orderId}")
            
            // Reserve inventory
            inventoryService.reserveItems(event.orderId, event.items)
            
            // Acknowledge message
            acknowledgment.acknowledge()
            
        } catch (e: Exception) {
            logger.error("Failed to process order event", e)
            // Don't acknowledge - message will be redelivered
        }
    }
    
    // Batch processing
    @KafkaListener(
        topics = ["order-events"],
        groupId = "notification-service",
        containerFactory = "batchFactory"
    )
    fun handleOrderBatch(events: List<OrderCreatedEvent>) {
        logger.info("Processing batch of ${events.size} events")
        
        events.forEach { event ->
            notificationService.sendOrderConfirmation(event)
        }
    }
    
    // Dead letter queue
    @KafkaListener(
        topics = ["order-events"],
        groupId = "order-processor"
    )
    fun processWithDLQ(event: OrderCreatedEvent, acknowledgment: Acknowledgment) {
        try {
            processOrder(event)
            acknowledgment.acknowledge()
        } catch (e: Exception) {
            logger.error("Failed to process order, sending to DLQ", e)
            kafkaTemplate.send("order-events-dlq", event.orderId, event)
            acknowledgment.acknowledge()
        }
    }
}
```

**Key Concepts:**
- Event-driven architecture
- Asynchronous communication
- Guaranteed delivery
- Idempotency
- Dead letter queues
- Batch processing

---

## Data Management

### Q8: Implement Saga Pattern for Distributed Transactions

```kotlin
// Saga orchestrator
@Service
class OrderSagaOrchestrator(
    private val orderService: OrderService,
    private val paymentService: PaymentService,
    private val inventoryService: InventoryService,
    private val shippingService: ShippingService,
    private val sagaRepository: SagaRepository
) {
    
    suspend fun executeOrderSaga(request: CreateOrderRequest): SagaResult {
        val sagaId = UUID.randomUUID().toString()
        val saga = Saga(
            id = sagaId,
            type = SagaType.ORDER_CREATION,
            status = SagaStatus.STARTED
        )
        
        sagaRepository.save(saga)
        
        try {
            // Step 1: Create order
            val order = orderService.createOrder(request)
            updateSagaStep(sagaId, "ORDER_CREATED", order.id)
            
            // Step 2: Process payment
            val payment = paymentService.processPayment(order.id, order.total)
            if (!payment.success) {
                compensate(sagaId, "PAYMENT_FAILED")
                return SagaResult.failure("Payment failed")
            }
            updateSagaStep(sagaId, "PAYMENT_PROCESSED", payment.id)
            
            // Step 3: Reserve inventory
            val reservation = inventoryService.reserveInventory(order.id, order.items)
            if (!reservation.success) {
                compensate(sagaId, "INVENTORY_RESERVATION_FAILED")
                return SagaResult.failure("Inventory reservation failed")
            }
            updateSagaStep(sagaId, "INVENTORY_RESERVED", reservation.id)
            
            // Step 4: Schedule shipping
            shippingService.scheduleShipping(order.id)
            updateSagaStep(sagaId, "SHIPPING_SCHEDULED", order.id)
            
            // Complete saga
            completeSaga(sagaId)
            return SagaResult.success(order.id)
            
        } catch (e: Exception) {
            logger.error("Saga failed: $sagaId", e)
            compensate(sagaId, e.message ?: "Unknown error")
            return SagaResult.failure(e.message ?: "Saga failed")
        }
    }
    
    private suspend fun compensate(sagaId: String, reason: String) {
        val saga = sagaRepository.findById(sagaId) ?: return
        
        logger.info("Compensating saga: $sagaId, reason: $reason")
        
        // Compensate in reverse order
        saga.steps.reversed().forEach { step ->
            when (step.name) {
                "SHIPPING_SCHEDULED" -> shippingService.cancelShipping(step.data)
                "INVENTORY_RESERVED" -> inventoryService.releaseReservation(step.data)
                "PAYMENT_PROCESSED" -> paymentService.refundPayment(step.data)
                "ORDER_CREATED" -> orderService.cancelOrder(step.data)
            }
        }
        
        sagaRepository.save(saga.copy(
            status = SagaStatus.COMPENSATED,
            failureReason = reason
        ))
    }
    
    private suspend fun updateSagaStep(sagaId: String, stepName: String, data: String) {
        val saga = sagaRepository.findById(sagaId) ?: return
        val updatedSteps = saga.steps + SagaStep(stepName, data, LocalDateTime.now())
        sagaRepository.save(saga.copy(steps = updatedSteps))
    }
    
    private suspend fun completeSaga(sagaId: String) {
        val saga = sagaRepository.findById(sagaId) ?: return
        sagaRepository.save(saga.copy(
            status = SagaStatus.COMPLETED,
            completedAt = LocalDateTime.now()
        ))
    }
}

data class Saga(
    val id: String,
    val type: SagaType,
    val status: SagaStatus,
    val steps: List<SagaStep> = emptyList(),
    val failureReason: String? = null,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val completedAt: LocalDateTime? = null
)

data class SagaStep(
    val name: String,
    val data: String,
    val timestamp: LocalDateTime
)

enum class SagaType {
    ORDER_CREATION, ORDER_CANCELLATION
}

enum class SagaStatus {
    STARTED, COMPLETED, COMPENSATED, FAILED
}
```

**Key Concepts:**
- Distributed transaction management
- Compensating transactions
- Saga state tracking
- Failure handling
- Idempotency


---

### Q9: Implement Event Sourcing

```kotlin
// Event store
@Entity
@Table(name = "domain_events")
data class DomainEventEntity(
    @Id
    val id: String = UUID.randomUUID().toString(),
    
    val aggregateId: String,
    val aggregateType: String,
    val eventType: String,
    
    @Column(columnDefinition = "TEXT")
    val payload: String,
    
    val version: Long,
    val timestamp: LocalDateTime = LocalDateTime.now()
)

interface EventStore {
    suspend fun save(event: DomainEvent)
    suspend fun getEvents(aggregateId: String): List<DomainEvent>
    suspend fun getEvents(aggregateId: String, fromVersion: Long): List<DomainEvent>
}

@Repository
class EventStoreImpl(
    private val eventRepository: EventRepository,
    private val objectMapper: ObjectMapper
) : EventStore {
    
    override suspend fun save(event: DomainEvent) = withContext(Dispatchers.IO) {
        val entity = DomainEventEntity(
            aggregateId = event.aggregateId,
            aggregateType = event::class.simpleName ?: "Unknown",
            eventType = event::class.simpleName ?: "Unknown",
            payload = objectMapper.writeValueAsString(event),
            version = event.version
        )
        
        eventRepository.save(entity)
    }
    
    override suspend fun getEvents(aggregateId: String): List<DomainEvent> {
        return getEvents(aggregateId, 0)
    }
    
    override suspend fun getEvents(aggregateId: String, fromVersion: Long): List<DomainEvent> {
        return withContext(Dispatchers.IO) {
            eventRepository.findByAggregateIdAndVersionGreaterThanOrderByVersion(aggregateId, fromVersion)
                .map { deserializeEvent(it) }
        }
    }
    
    private fun deserializeEvent(entity: DomainEventEntity): DomainEvent {
        return when (entity.eventType) {
            "OrderCreatedEvent" -> objectMapper.readValue(entity.payload, OrderCreatedEvent::class.java)
            "OrderPaidEvent" -> objectMapper.readValue(entity.payload, OrderPaidEvent::class.java)
            "OrderShippedEvent" -> objectMapper.readValue(entity.payload, OrderShippedEvent::class.java)
            else -> throw IllegalArgumentException("Unknown event type: ${entity.eventType}")
        }
    }
}

// Aggregate
data class Order(
    val id: String,
    val customerId: String,
    val items: List<OrderItem>,
    val status: OrderStatus,
    val version: Long = 0
) {
    companion object {
        fun fromEvents(events: List<DomainEvent>): Order {
            var order: Order? = null
            
            events.forEach { event ->
                order = when (event) {
                    is OrderCreatedEvent -> Order(
                        id = event.aggregateId,
                        customerId = event.customerId,
                        items = event.items,
                        status = OrderStatus.CREATED,
                        version = event.version
                    )
                    is OrderPaidEvent -> order?.copy(
                        status = OrderStatus.PAID,
                        version = event.version
                    )
                    is OrderShippedEvent -> order?.copy(
                        status = OrderStatus.SHIPPED,
                        version = event.version
                    )
                    else -> order
                }
            }
            
            return order ?: throw IllegalStateException("No events found")
        }
    }
}

// Command handler
@Service
class OrderCommandHandler(
    private val eventStore: EventStore,
    private val eventPublisher: EventPublisher
) {
    
    suspend fun handle(command: CreateOrderCommand): String {
        val orderId = UUID.randomUUID().toString()
        
        val event = OrderCreatedEvent(
            aggregateId = orderId,
            customerId = command.customerId,
            items = command.items,
            version = 1
        )
        
        eventStore.save(event)
        eventPublisher.publish(event)
        
        return orderId
    }
    
    suspend fun handle(command: PayOrderCommand) {
        val events = eventStore.getEvents(command.orderId)
        val order = Order.fromEvents(events)
        
        if (order.status != OrderStatus.CREATED) {
            throw IllegalStateException("Order cannot be paid in status: ${order.status}")
        }
        
        val event = OrderPaidEvent(
            aggregateId = command.orderId,
            paymentId = command.paymentId,
            version = order.version + 1
        )
        
        eventStore.save(event)
        eventPublisher.publish(event)
    }
}

// Query handler (CQRS read model)
@Service
class OrderQueryHandler(
    private val orderReadRepository: OrderReadRepository
) {
    
    suspend fun getOrder(orderId: String): OrderReadModel? {
        return orderReadRepository.findById(orderId)
    }
    
    suspend fun getOrdersByCustomer(customerId: String): List<OrderReadModel> {
        return orderReadRepository.findByCustomerId(customerId)
    }
}

// Projection (updates read model from events)
@Service
class OrderProjection(
    private val orderReadRepository: OrderReadRepository
) {
    
    @EventListener
    suspend fun on(event: OrderCreatedEvent) {
        val readModel = OrderReadModel(
            id = event.aggregateId,
            customerId = event.customerId,
            itemCount = event.items.size,
            total = event.items.sumOf { it.price * it.quantity.toBigDecimal() },
            status = OrderStatus.CREATED
        )
        
        orderReadRepository.save(readModel)
    }
    
    @EventListener
    suspend fun on(event: OrderPaidEvent) {
        orderReadRepository.updateStatus(event.aggregateId, OrderStatus.PAID)
    }
}
```

---

## Security

### Q10: Implement JWT Authentication

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig {
    
    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        jwtAuthFilter: JwtAuthenticationFilter
    ): SecurityFilterChain {
        http
            .csrf().disable()
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            }
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
        
        return http.build()
    }
    
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}

@Service
class JwtService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long
) {
    
    fun generateToken(userDetails: UserDetails): String {
        val claims = mapOf(
            "roles" to userDetails.authorities.map { it.authority }
        )
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.username)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact()
    }
    
    fun extractUsername(token: String): String {
        return extractClaim(token, Claims::getSubject)
    }
    
    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return username == userDetails.username && !isTokenExpired(token)
    }
    
    private fun isTokenExpired(token: String): Boolean {
        return extractExpiration(token).before(Date())
    }
    
    private fun extractExpiration(token: String): Date {
        return extractClaim(token, Claims::getExpiration)
    }
    
    private fun <T> extractClaim(token: String, claimsResolver: (Claims) -> T): T {
        val claims = extractAllClaims(token)
        return claimsResolver(claims)
    }
    
    private fun extractAllClaims(token: String): Claims {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .body
    }
    
    private fun getSigningKey(): Key {
        val keyBytes = Decoders.BASE64.decode(secret)
        return Keys.hmacShaKeyFor(keyBytes)
    }
}

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {
    
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }
        
        val jwt = authHeader.substring(7)
        val username = jwtService.extractUsername(jwt)
        
        if (SecurityContextHolder.getContext().authentication == null) {
            val userDetails = userDetailsService.loadUserByUsername(username)
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                val authToken = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                )
                
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authToken
            }
        }
        
        filterChain.doFilter(request, response)
    }
}
```

---

## Monitoring and Observability

### Q11: Implement Distributed Tracing with Sleuth and Zipkin

```kotlin
// Dependencies
dependencies {
    implementation("org.springframework.cloud:spring-cloud-starter-sleuth")
    implementation("org.springframework.cloud:spring-cloud-sleuth-zipkin")
}

// Configuration
spring:
  sleuth:
    sampler:
      probability: 1.0  # Sample 100% of requests
  zipkin:
    base-url: http://localhost:9411
    enabled: true

// Custom span
@Service
class OrderService(
    private val tracer: Tracer
) {
    
    fun createOrder(request: CreateOrderRequest): Order {
        val span = tracer.nextSpan().name("createOrder").start()
        
        try {
            span.tag("order.customerId", request.customerId)
            span.tag("order.itemCount", request.items.size.toString())
            
            // Business logic
            val order = processOrder(request)
            
            span.tag("order.id", order.id)
            span.tag("order.total", order.total.toString())
            
            return order
            
        } catch (e: Exception) {
            span.tag("error", e.message ?: "Unknown error")
            throw e
        } finally {
            span.end()
        }
    }
    
    private fun processOrder(request: CreateOrderRequest): Order {
        val childSpan = tracer.nextSpan().name("processOrder").start()
        
        try {
            // Processing logic
            return Order(/* ... */)
        } finally {
            childSpan.end()
        }
    }
}

// Baggage propagation
@Component
class BaggageConfig {
    
    @Bean
    fun baggageFields(): List<String> {
        return listOf("user-id", "tenant-id", "correlation-id")
    }
}

// Usage
@Service
class UserService(
    private val tracer: Tracer
) {
    
    fun getUser(userId: String): User {
        // Set baggage
        tracer.currentSpan()?.tag("user.id", userId)
        tracer.createBaggage("user-id", userId)
        
        // Baggage is automatically propagated to downstream services
        return fetchUser(userId)
    }
}
```

---

### Q12: Implement Health Checks and Metrics

```kotlin
// Dependencies
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.micrometer:micrometer-registry-prometheus")
}

// Configuration
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

// Custom health indicator
@Component
class DatabaseHealthIndicator(
    private val dataSource: DataSource
) : HealthIndicator {
    
    override fun health(): Health {
        return try {
            dataSource.connection.use { connection ->
                if (connection.isValid(1)) {
                    Health.up()
                        .withDetail("database", "PostgreSQL")
                        .withDetail("status", "Connected")
                        .build()
                } else {
                    Health.down()
                        .withDetail("error", "Connection invalid")
                        .build()
                }
            }
        } catch (e: Exception) {
            Health.down()
                .withDetail("error", e.message)
                .build()
        }
    }
}

@Component
class ExternalServiceHealthIndicator(
    private val restTemplate: RestTemplate
) : HealthIndicator {
    
    override fun health(): Health {
        return try {
            val response = restTemplate.getForEntity(
                "http://external-service/health",
                String::class.java
            )
            
            if (response.statusCode.is2xxSuccessful) {
                Health.up()
                    .withDetail("service", "external-service")
                    .withDetail("status", "Available")
                    .build()
            } else {
                Health.down()
                    .withDetail("status", response.statusCode)
                    .build()
            }
        } catch (e: Exception) {
            Health.down()
                .withDetail("error", e.message)
                .build()
        }
    }
}

// Custom metrics
@Service
class MetricsService(
    private val meterRegistry: MeterRegistry
) {
    
    private val orderCounter = meterRegistry.counter("orders.created")
    private val orderTimer = meterRegistry.timer("orders.processing.time")
    
    fun recordOrderCreated() {
        orderCounter.increment()
    }
    
    fun <T> recordOrderProcessingTime(block: () -> T): T {
        return orderTimer.recordCallable(block)!!
    }
    
    fun recordOrderValue(value: Double) {
        meterRegistry.gauge("orders.total.value", value)
    }
}

// Aspect for automatic metrics
@Aspect
@Component
class MetricsAspect(
    private val meterRegistry: MeterRegistry
) {
    
    @Around("@annotation(Timed)")
    fun measureExecutionTime(joinPoint: ProceedingJoinPoint): Any? {
        val timer = Timer.builder("method.execution.time")
            .tag("class", joinPoint.signature.declaringTypeName)
            .tag("method", joinPoint.signature.name)
            .register(meterRegistry)
        
        return timer.recordCallable {
            joinPoint.proceed()
        }
    }
}

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Timed
```

---

## Testing

### Q13: Write Integration Tests for Microservices

```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class OrderServiceIntegrationTest {
    
    companion object {
        @Container
        val postgres = PostgreSQLContainer<Nothing>("postgres:15").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
        }
        
        @Container
        val kafka = KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.4.0"))
        
        @Container
        val redis = GenericContainer<Nothing>("redis:7").apply {
            withExposedPorts(6379)
        }
        
        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers)
            registry.add("spring.redis.host", redis::getHost)
            registry.add("spring.redis.port") { redis.getMappedPort(6379) }
        }
    }
    
    @Autowired
    private lateinit var webTestClient: WebTestClient
    
    @Autowired
    private lateinit var orderRepository: OrderRepository
    
    @MockBean
    private lateinit var userServiceClient: UserServiceClient
    
    @BeforeEach
    fun setup() = runBlocking {
        orderRepository.deleteAll()
    }
    
    @Test
    fun `should create order successfully`() = runBlocking {
        // Given
        val user = User("user123", "John Doe", "john@example.com")
        `when`(userServiceClient.getUser("user123")).thenReturn(user)
        
        val request = CreateOrderRequest(
            customerId = "user123",
            items = listOf(
                OrderItem("product1", 2, BigDecimal("10.00")),
                OrderItem("product2", 1, BigDecimal("20.00"))
            )
        )
        
        // When
        val response = webTestClient.post()
            .uri("/api/orders")
            .bodyValue(request)
            .exchange()
        
        // Then
        response.expectStatus().isCreated
            .expectBody<Order>()
            .consumeWith { result ->
                assertNotNull(result.responseBody)
                assertEquals("user123", result.responseBody?.customerId)
                assertEquals(BigDecimal("40.00"), result.responseBody?.total)
            }
        
        // Verify in database
        val orders = orderRepository.findByCustomerId("user123")
        assertEquals(1, orders.size)
    }
    
    @Test
    fun `should handle user service failure`() {
        // Given
        `when`(userServiceClient.getUser("user123"))
            .thenThrow(FeignException.ServiceUnavailable("Service unavailable", null, null, null))
        
        val request = CreateOrderRequest(
            customerId = "user123",
            items = listOf(OrderItem("product1", 1, BigDecimal("10.00")))
        )
        
        // When/Then
        webTestClient.post()
            .uri("/api/orders")
            .bodyValue(request)
            .exchange()
            .expectStatus().is5xxServerError
    }
}

// Contract testing with Spring Cloud Contract
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureStubRunner(
    ids = ["com.example:user-service:+:stubs:8081"],
    stubsMode = StubRunnerProperties.StubsMode.LOCAL
)
class OrderServiceContractTest {
    
    @Autowired
    private lateinit var userServiceClient: UserServiceClient
    
    @Test
    fun `should get user from contract`() {
        val user = userServiceClient.getUser("user123")
        
        assertNotNull(user)
        assertEquals("user123", user.id)
        assertEquals("John Doe", user.name)
    }
}
```

---

## Best Practices

### 1. Service Design
- Single Responsibility Principle
- API versioning
- Backward compatibility
- Idempotency
- Graceful degradation

### 2. Data Management
- Database per service
- Event sourcing for audit trail
- CQRS for read/write separation
- Saga pattern for distributed transactions

### 3. Communication
- Async communication for non-critical operations
- Circuit breaker for resilience
- Retry with exponential backoff
- Timeout for all external calls

### 4. Security
- JWT for stateless authentication
- API Gateway for centralized security
- Service-to-service authentication
- Encrypt sensitive data

### 5. Monitoring
- Distributed tracing
- Centralized logging
- Health checks
- Metrics and alerting

---

## Common Interview Questions

**Q: How do you handle distributed transactions?**
A: Use Saga pattern (orchestration or choreography), event sourcing, or eventual consistency.

**Q: How do you ensure data consistency across services?**
A: Event-driven architecture, CQRS, eventual consistency, idempotency.

**Q: How do you handle service failures?**
A: Circuit breaker, retry logic, fallback methods, bulkhead pattern.

**Q: How do you scale microservices?**
A: Horizontal scaling, load balancing, caching, async processing, database sharding.

**Q: How do you test microservices?**
A: Unit tests, integration tests with Testcontainers, contract testing, end-to-end tests.

---

## Resources

- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Microservices Patterns](https://microservices.io/patterns/)
- [Building Microservices by Sam Newman](https://samnewman.io/books/building_microservices/)
- [Spring Boot Microservices Guide](https://spring.io/guides)

---

## Congratulations!

You're now prepared for Spring Boot Microservices interviews with:
✅ Service discovery and API Gateway
✅ Circuit breaker and resilience
✅ Distributed configuration
✅ Inter-service communication
✅ Saga pattern and event sourcing
✅ Security and monitoring
✅ Testing strategies

**Good luck with your interviews! 🚀**
