---
title: "Advanced Spring Boot: Senior Developer Guide"
date: "2024-11-29"
category: "Backend"
tags: ["Spring Boot", "Architecture", "Monitoring", "Best Practices", "Kotlin"]
---

# Advanced Spring Boot: Senior Developer Guide

*Published on November 29, 2024*

## Stereotype Annotations Deep Dive

### @Service vs @Repository vs @Component

```kotlin
// @Repository - Data access layer, exception translation
@Repository
class UserRepository(private val jdbcTemplate: JdbcTemplate) {
    // DataAccessException translation happens automatically
    fun findById(id: Long): User? = jdbcTemplate.queryForObject(...)
}

// @Service - Business logic layer, transaction boundaries
@Service
@Transactional
class UserService(private val userRepository: UserRepository) {
    fun processUser(id: Long) { /* business logic */ }
}

// @Component - Generic Spring-managed bean
@Component
class EmailValidator {
    fun validate(email: String): Boolean = email.contains("@")
}
```

**Key Differences:**
- **@Repository**: Enables automatic exception translation (SQLException → DataAccessException), ideal for persistence layer
- **@Service**: Semantic marker for business logic, commonly used with @Transactional
- **@Component**: Generic stereotype, use when bean doesn't fit other categories
- All are specializations of @Component and enable component scanning

## Spring Boot Actuator

### Setup
```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("io.micrometer:micrometer-registry-prometheus")
}
```

### Configuration
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,env,loggers
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true
  metrics:
    tags:
      application: ${spring.application.name}
    export:
      prometheus:
        enabled: true
```

### Custom Health Indicators
```kotlin
@Component
class DatabaseHealthIndicator(
    private val dataSource: DataSource
) : HealthIndicator {
    
    override fun health(): Health {
        return try {
            dataSource.connection.use { conn ->
                if (conn.isValid(1)) {
                    Health.up()
                        .withDetail("database", "PostgreSQL")
                        .withDetail("validationQuery", "SELECT 1")
                        .build()
                } else {
                    Health.down().withDetail("error", "Connection invalid").build()
                }
            }
        } catch (e: Exception) {
            Health.down(e).build()
        }
    }
}
```

### Custom Metrics
```kotlin
@Service
class OrderService(private val meterRegistry: MeterRegistry) {
    
    private val orderCounter = meterRegistry.counter("orders.created", "type", "online")
    private val orderTimer = meterRegistry.timer("orders.processing.time")
    
    fun createOrder(order: Order) {
        orderTimer.record {
            // Process order
            orderCounter.increment()
        }
    }
}
```

## Application Monitoring

### Distributed Tracing with Micrometer
```kotlin
dependencies {
    implementation("io.micrometer:micrometer-tracing-bridge-brave")
    implementation("io.zipkin.reporter2:zipkin-reporter-brave")
}
```

```yaml
management:
  tracing:
    sampling:
      probability: 1.0
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
```

### Logging Best Practices
```kotlin
@Service
class PaymentService {
    companion object {
        private val logger = LoggerFactory.getLogger(PaymentService::class.java)
    }
    
    fun processPayment(amount: BigDecimal, userId: Long) {
        logger.info("Processing payment: amount={}, userId={}", amount, userId)
        
        try {
            // Process payment
            logger.debug("Payment validation successful for user: {}", userId)
        } catch (e: PaymentException) {
            logger.error("Payment failed: userId={}, amount={}", userId, amount, e)
            throw e
        }
    }
}
```

## Transaction Management

### Propagation Levels
```kotlin
@Service
class OrderService(private val inventoryService: InventoryService) {
    
    @Transactional(propagation = Propagation.REQUIRED)
    fun createOrder(order: Order) {
        // Joins existing transaction or creates new one
        orderRepository.save(order)
        inventoryService.updateStock(order.items) // Same transaction
    }
}

@Service
class AuditService {
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun logAudit(event: AuditEvent) {
        // Always creates new transaction, commits independently
        auditRepository.save(event)
    }
}
```

### Isolation Levels
```kotlin
@Transactional(isolation = Isolation.REPEATABLE_READ)
fun getConsistentData(): Data {
    // Prevents non-repeatable reads
    val data1 = repository.findById(1)
    // Other transactions can't modify this row
    val data2 = repository.findById(1) // Same result
    return data1
}
```

## Bean Lifecycle & Scopes

### Bean Scopes
```kotlin
@Component
@Scope("singleton") // Default - one instance per container
class ConfigService

@Component
@Scope("prototype") // New instance per injection
class RequestProcessor

@Component
@Scope("request") // One instance per HTTP request
class RequestContext

@Component
@Scope("session") // One instance per HTTP session
class UserSession
```

### Lifecycle Callbacks
```kotlin
@Component
class ResourceManager : InitializingBean, DisposableBean {
    
    @PostConstruct
    fun init() {
        logger.info("Bean initialized via @PostConstruct")
    }
    
    override fun afterPropertiesSet() {
        logger.info("Bean initialized via InitializingBean")
    }
    
    @PreDestroy
    fun cleanup() {
        logger.info("Bean destroyed via @PreDestroy")
    }
    
    override fun destroy() {
        logger.info("Bean destroyed via DisposableBean")
    }
}
```

## Async Processing

### Configuration
```kotlin
@Configuration
@EnableAsync
class AsyncConfig : AsyncConfigurer {
    
    override fun getAsyncExecutor(): Executor {
        return ThreadPoolTaskExecutor().apply {
            corePoolSize = 5
            maxPoolSize = 10
            queueCapacity = 100
            setThreadNamePrefix("async-")
            initialize()
        }
    }
    
    override fun getAsyncUncaughtExceptionHandler(): AsyncUncaughtExceptionHandler {
        return AsyncUncaughtExceptionHandler { ex, method, params ->
            logger.error("Async error in ${method.name}: ${ex.message}")
        }
    }
}
```

### Usage
```kotlin
@Service
class NotificationService {
    
    @Async
    fun sendEmail(email: String, message: String): CompletableFuture<Boolean> {
        // Runs in separate thread
        Thread.sleep(1000)
        emailClient.send(email, message)
        return CompletableFuture.completedFuture(true)
    }
    
    @Async
    fun sendSms(phone: String, message: String) {
        // Fire and forget
        smsClient.send(phone, message)
    }
}
```

## Caching Strategies

### Configuration
```kotlin
@Configuration
@EnableCaching
class CacheConfig {
    
    @Bean
    fun cacheManager(): CacheManager {
        return CaffeineCacheManager().apply {
            setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .recordStats())
        }
    }
}
```

### Usage
```kotlin
@Service
class ProductService {
    
    @Cacheable(value = ["products"], key = "#id")
    fun getProduct(id: Long): Product {
        // Cached after first call
        return productRepository.findById(id)
    }
    
    @CachePut(value = ["products"], key = "#product.id")
    fun updateProduct(product: Product): Product {
        // Updates cache
        return productRepository.save(product)
    }
    
    @CacheEvict(value = ["products"], key = "#id")
    fun deleteProduct(id: Long) {
        // Removes from cache
        productRepository.deleteById(id)
    }
    
    @CacheEvict(value = ["products"], allEntries = true)
    fun clearCache() {
        // Clears entire cache
    }
}
```

## Event-Driven Architecture

### Application Events
```kotlin
// Event
data class OrderCreatedEvent(
    val orderId: Long,
    val userId: Long,
    val timestamp: Instant = Instant.now()
)

// Publisher
@Service
class OrderService(private val eventPublisher: ApplicationEventPublisher) {
    
    fun createOrder(order: Order): Order {
        val saved = orderRepository.save(order)
        eventPublisher.publishEvent(OrderCreatedEvent(saved.id, saved.userId))
        return saved
    }
}

// Listener
@Component
class OrderEventListener {
    
    @EventListener
    @Async
    fun handleOrderCreated(event: OrderCreatedEvent) {
        logger.info("Order created: ${event.orderId}")
        // Send notification, update analytics, etc.
    }
    
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun handleOrderCommitted(event: OrderCreatedEvent) {
        // Only executes after transaction commits
        emailService.sendConfirmation(event.userId)
    }
}
```

## Profiles & Configuration

### Profile-Specific Beans
```kotlin
@Configuration
class DataSourceConfig {
    
    @Bean
    @Profile("dev")
    fun devDataSource(): DataSource {
        return HikariDataSource().apply {
            jdbcUrl = "jdbc:h2:mem:testdb"
        }
    }
    
    @Bean
    @Profile("prod")
    fun prodDataSource(): DataSource {
        return HikariDataSource().apply {
            jdbcUrl = System.getenv("DATABASE_URL")
            maximumPoolSize = 20
        }
    }
}
```

### Configuration Properties
```kotlin
@ConfigurationProperties(prefix = "app")
@ConstructorBinding
data class AppProperties(
    val name: String,
    val version: String,
    val features: Features,
    val security: Security
) {
    data class Features(
        val enableCache: Boolean = true,
        val enableMetrics: Boolean = true
    )
    
    data class Security(
        val jwtSecret: String,
        val jwtExpiration: Long = 86400000
    )
}

@Configuration
@EnableConfigurationProperties(AppProperties::class)
class AppConfig
```

## Exception Handling

### Global Exception Handler
```kotlin
@RestControllerAdvice
class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException::class)
    fun handleNotFound(ex: EntityNotFoundException): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse(
                status = 404,
                message = ex.message ?: "Resource not found",
                timestamp = Instant.now()
            ))
    }
    
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ValidationErrorResponse> {
        val errors = ex.bindingResult.fieldErrors.associate { 
            it.field to (it.defaultMessage ?: "Invalid value")
        }
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ValidationErrorResponse(errors))
    }
    
    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception): ResponseEntity<ErrorResponse> {
        logger.error("Unexpected error", ex)
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse(
                status = 500,
                message = "Internal server error",
                timestamp = Instant.now()
            ))
    }
}
```

## Testing Strategies

### Integration Tests
```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
@Testcontainers
class OrderServiceIntegrationTest {
    
    @Container
    val postgres = PostgreSQLContainer<Nothing>("postgres:15-alpine")
    
    @Autowired
    lateinit var orderService: OrderService
    
    @Test
    fun `should create order with transaction`() {
        val order = Order(userId = 1L, items = listOf())
        val created = orderService.createOrder(order)
        
        assertThat(created.id).isNotNull()
    }
}
```

### Slice Tests
```kotlin
@WebMvcTest(UserController::class)
class UserControllerTest {
    
    @Autowired
    lateinit var mockMvc: MockMvc
    
    @MockBean
    lateinit var userService: UserService
    
    @Test
    fun `should return user by id`() {
        given(userService.findById(1L)).willReturn(User(1L, "John"))
        
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.name").value("John"))
    }
}
```

## Performance Optimization

### Database Connection Pooling
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      leak-detection-threshold: 60000
```

### JPA Optimization
```kotlin
@Entity
class Order {
    @OneToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    val items: List<OrderItem> = mutableListOf()
}

// Use EntityGraph to avoid N+1
interface OrderRepository : JpaRepository<Order, Long> {
    
    @EntityGraph(attributePaths = ["items"])
    fun findWithItemsById(id: Long): Order?
    
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
    fun findByIdWithItems(@Param("id") id: Long): Order?
}
```

## Security Considerations

### Rate Limiting
```kotlin
@Component
class RateLimitingFilter : OncePerRequestFilter() {
    
    private val rateLimiter = ConcurrentHashMap<String, RateLimiter>()
    
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val clientId = request.remoteAddr
        val limiter = rateLimiter.computeIfAbsent(clientId) {
            RateLimiter.create(10.0) // 10 requests per second
        }
        
        if (limiter.tryAcquire()) {
            filterChain.doFilter(request, response)
        } else {
            response.status = HttpStatus.TOO_MANY_REQUESTS.value()
        }
    }
}
```

### Input Validation
```kotlin
data class CreateUserRequest(
    @field:NotBlank(message = "Username required")
    @field:Size(min = 3, max = 50)
    val username: String,
    
    @field:Email(message = "Invalid email")
    val email: String,
    
    @field:Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")
    val password: String
)

@RestController
class UserController {
    
    @PostMapping("/users")
    fun createUser(@Valid @RequestBody request: CreateUserRequest): ResponseEntity<User> {
        return ResponseEntity.ok(userService.create(request))
    }
}
```

## Conclusion

Mastering these advanced Spring Boot concepts enables building production-grade, scalable applications with proper monitoring, security, and performance optimization.
