---
title: "Kotlin Spring Senior Backend Developer - Interview Guide"
date: "2024-12-13"
category: "Interview Preparation"
tags: ["Kotlin", "Spring Boot", "Interview", "Backend", "Senior Developer", "Coroutines"]
---

# Kotlin Spring Senior Backend Developer - Interview Guide

## Kotlin Core Concepts

### 1. Null Safety

**Q: Explain Kotlin's null safety and how it prevents NPEs**

```kotlin
// Nullable vs Non-nullable
var name: String = "Kotlin"      // Cannot be null
var nullableName: String? = null // Can be null

// Safe call operator
val length = nullableName?.length  // Returns null if nullableName is null

// Elvis operator
val len = nullableName?.length ?: 0  // Returns 0 if null

// Not-null assertion (use carefully)
val forceLength = nullableName!!.length  // Throws NPE if null

// Safe casting
val result = value as? String  // Returns null if cast fails

// let function for null checks
nullableName?.let { name ->
    println("Name is $name")
}

// Real-world example
data class User(val id: String, val email: String?, val phone: String?)

fun sendNotification(user: User) {
    // Send to email if available, otherwise phone, otherwise skip
    user.email?.let { email ->
        sendEmail(email)
    } ?: user.phone?.let { phone ->
        sendSms(phone)
    } ?: run {
        logger.warn("No contact method for user ${user.id}")
    }
}
```

### 2. Data Classes and Sealed Classes

**Q: When to use data classes vs regular classes vs sealed classes**

```kotlin
// Data class - for DTOs and value objects
data class UserDTO(
    val id: String,
    val name: String,
    val email: String
) {
    // Automatically generates: equals(), hashCode(), toString(), copy()
}

// Usage
val user1 = UserDTO("1", "John", "john@example.com")
val user2 = user1.copy(name = "Jane")  // Immutable update
val (id, name, email) = user1          // Destructuring

// Sealed class - for restricted hierarchies
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String, val code: Int) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// Exhaustive when expression
fun <T> handleResult(result: Result<T>) {
    when (result) {
        is Result.Success -> println("Data: ${result.data}")
        is Result.Error -> println("Error: ${result.message}")
        Result.Loading -> println("Loading...")
    }  // Compiler ensures all cases covered
}

// Real-world API response
sealed class ApiResponse<out T> {
    data class Success<T>(val data: T, val timestamp: Long) : ApiResponse<T>()
    data class Error(val message: String, val statusCode: Int) : ApiResponse<Nothing>()
    object NetworkError : ApiResponse<Nothing>()
    object Unauthorized : ApiResponse<Nothing>()
}

@Service
class UserService {
    suspend fun getUser(id: String): ApiResponse<User> {
        return try {
            val user = userRepository.findById(id)
            if (user != null) {
                ApiResponse.Success(user, System.currentTimeMillis())
            } else {
                ApiResponse.Error("User not found", 404)
            }
        } catch (e: Exception) {
            ApiResponse.NetworkError
        }
    }
}
```

### 3. Extension Functions

**Q: Implement useful extension functions for Spring**

```kotlin
// String extensions
fun String.isValidEmail(): Boolean {
    return this.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"))
}

fun String.toSlug(): String {
    return this.lowercase()
        .replace(Regex("[^a-z0-9\\s-]"), "")
        .replace(Regex("\\s+"), "-")
}

// Collection extensions
fun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null

fun <T> List<T>.chunkedBy(predicate: (T) -> Boolean): List<List<T>> {
    val result = mutableListOf<List<T>>()
    var current = mutableListOf<T>()
    
    forEach { item ->
        if (predicate(item) && current.isNotEmpty()) {
            result.add(current)
            current = mutableListOf()
        }
        current.add(item)
    }
    
    if (current.isNotEmpty()) result.add(current)
    return result
}

// ResponseEntity extensions
fun <T> T.toOk(): ResponseEntity<T> = ResponseEntity.ok(this)
fun <T> T.toCreated(location: URI): ResponseEntity<T> = 
    ResponseEntity.created(location).body(this)

// Optional extensions
fun <T> Optional<T>.toNullable(): T? = orElse(null)

// Usage in controller
@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {
    
    @GetMapping("/{id}")
    suspend fun getUser(@PathVariable id: String): ResponseEntity<UserDTO> {
        return userService.findById(id)?.toOk()
            ?: ResponseEntity.notFound().build()
    }
}
```

### 4. Coroutines Deep Dive

**Q: Explain coroutine context, dispatchers, and structured concurrency**

```kotlin
// Coroutine context and dispatchers
@Service
class DataService {
    
    // CPU-intensive work
    suspend fun processData(data: List<Int>): Int = withContext(Dispatchers.Default) {
        data.map { it * it }.sum()
    }
    
    // I/O operations
    suspend fun fetchFromDatabase(): User = withContext(Dispatchers.IO) {
        userRepository.findById("123")
    }
    
    // Parallel execution
    suspend fun loadUserProfile(userId: String): UserProfile = coroutineScope {
        val userDeferred = async { fetchUser(userId) }
        val ordersDeferred = async { fetchOrders(userId) }
        val friendsDeferred = async { fetchFriends(userId) }
        
        UserProfile(
            user = userDeferred.await(),
            orders = ordersDeferred.await(),
            friends = friendsDeferred.await()
        )
    }
    
    // Error handling in coroutines
    suspend fun fetchWithErrorHandling(id: String): Result<User> {
        return try {
            val user = withTimeout(5000) {
                userRepository.findById(id)
            }
            Result.Success(user)
        } catch (e: TimeoutCancellationException) {
            Result.Error("Request timeout", 408)
        } catch (e: Exception) {
            Result.Error(e.message ?: "Unknown error", 500)
        }
    }
}

// Structured concurrency with supervisorScope
@Service
class NotificationService {
    
    suspend fun sendNotifications(users: List<User>) = supervisorScope {
        users.map { user ->
            launch {
                try {
                    sendEmail(user.email)
                } catch (e: Exception) {
                    logger.error("Failed to send email to ${user.email}", e)
                    // Other notifications continue even if one fails
                }
            }
        }.joinAll()
    }
}

// Flow for streaming data
@Service
class OrderService {
    
    fun getOrdersStream(userId: String): Flow<Order> = flow {
        val orders = orderRepository.findByUserId(userId)
        orders.forEach { order ->
            emit(order)
            delay(100) // Simulate streaming
        }
    }.flowOn(Dispatchers.IO)
    
    fun getOrdersWithTransformation(userId: String): Flow<OrderDTO> {
        return getOrdersStream(userId)
            .map { it.toDTO() }
            .filter { it.status == OrderStatus.COMPLETED }
            .take(10)
    }
}
```

### 5. Delegation and Lazy Initialization

**Q: Implement delegation patterns in Spring**

```kotlin
// Property delegation
class UserService {
    private val cache: MutableMap<String, User> = mutableMapOf()
    
    var currentUser: User? by Delegates.observable(null) { _, old, new ->
        logger.info("User changed from $old to $new")
    }
    
    val expensiveResource: ExpensiveResource by lazy {
        logger.info("Initializing expensive resource")
        ExpensiveResource()
    }
}

// Class delegation
interface Repository<T, ID> {
    suspend fun findById(id: ID): T?
    suspend fun save(entity: T): T
    suspend fun deleteById(id: ID)
}

class CachedRepository<T, ID>(
    private val delegate: Repository<T, ID>,
    private val cache: Cache<ID, T>
) : Repository<T, ID> by delegate {
    
    override suspend fun findById(id: ID): T? {
        return cache.get(id) ?: delegate.findById(id)?.also { 
            cache.put(id, it) 
        }
    }
    
    override suspend fun save(entity: T): T {
        return delegate.save(entity).also {
            // Invalidate cache
        }
    }
}

// Delegated properties for configuration
class AppConfig {
    val databaseUrl: String by lazy { 
        System.getenv("DATABASE_URL") ?: "jdbc:postgresql://localhost:5432/db" 
    }
    
    var maxConnections: Int by Delegates.vetoable(10) { _, _, newValue ->
        newValue in 1..100  // Only accept values between 1 and 100
    }
}
```

---

## Spring Boot with Kotlin

### 1. Idiomatic Controllers

**Q: Write idiomatic Kotlin REST controllers**

```kotlin
@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    
    // Suspend function for async operations
    @GetMapping
    suspend fun getUsers(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(required = false) search: String?
    ): Page<UserDTO> {
        return userService.findAll(search, PageRequest.of(page, size))
    }
    
    @GetMapping("/{id}")
    suspend fun getUser(@PathVariable id: String): ResponseEntity<UserDTO> {
        return userService.findById(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }
    
    @PostMapping
    suspend fun createUser(
        @Valid @RequestBody request: CreateUserRequest
    ): ResponseEntity<UserDTO> {
        val user = userService.create(request)
        val location = URI.create("/api/users/${user.id}")
        return ResponseEntity.created(location).body(user)
    }
    
    @PutMapping("/{id}")
    suspend fun updateUser(
        @PathVariable id: String,
        @Valid @RequestBody request: UpdateUserRequest
    ): ResponseEntity<UserDTO> {
        return userService.update(id, request)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    suspend fun deleteUser(@PathVariable id: String) {
        userService.delete(id)
    }
    
    // Flow for streaming responses
    @GetMapping("/stream")
    fun streamUsers(): Flow<UserDTO> {
        return userService.streamAllUsers()
    }
}

// Exception handler with Kotlin
@RestControllerAdvice
class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException::class)
    fun handleNotFound(ex: EntityNotFoundException) = 
        ErrorResponse(
            status = HttpStatus.NOT_FOUND.value(),
            message = ex.message ?: "Not found",
            timestamp = LocalDateTime.now()
        ).let { ResponseEntity.status(HttpStatus.NOT_FOUND).body(it) }
    
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException) =
        ValidationErrorResponse(
            status = HttpStatus.BAD_REQUEST.value(),
            message = "Validation failed",
            errors = ex.bindingResult.fieldErrors.associate { 
                it.field to (it.defaultMessage ?: "Invalid value")
            },
            timestamp = LocalDateTime.now()
        ).let { ResponseEntity.badRequest().body(it) }
}
```

### 2. Service Layer with Coroutines

**Q: Implement service layer with proper error handling**

```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val emailService: EmailService
) {
    
    suspend fun findAll(search: String?, pageable: Pageable): Page<UserDTO> = 
        withContext(Dispatchers.IO) {
            val users = if (search != null) {
                userRepository.findByNameContaining(search, pageable)
            } else {
                userRepository.findAll(pageable)
            }
            users.map { it.toDTO() }
        }
    
    suspend fun findById(id: String): UserDTO? = withContext(Dispatchers.IO) {
        userRepository.findById(id)?.toDTO()
    }
    
    suspend fun create(request: CreateUserRequest): UserDTO = coroutineScope {
        // Validate email uniqueness
        userRepository.findByEmail(request.email)?.let {
            throw DuplicateEmailException("Email already exists")
        }
        
        val user = User(
            id = UUID.randomUUID().toString(),
            name = request.name,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            role = Role.USER
        )
        
        val savedUser = withContext(Dispatchers.IO) {
            userRepository.save(user)
        }
        
        // Send welcome email asynchronously
        launch {
            try {
                emailService.sendWelcomeEmail(savedUser.email)
            } catch (e: Exception) {
                logger.error("Failed to send welcome email", e)
            }
        }
        
        savedUser.toDTO()
    }
    
    suspend fun update(id: String, request: UpdateUserRequest): UserDTO? = 
        withContext(Dispatchers.IO) {
            userRepository.findById(id)?.let { user ->
                val updated = user.copy(
                    name = request.name ?: user.name,
                    email = request.email ?: user.email
                )
                userRepository.save(updated).toDTO()
            }
        }
    
    suspend fun delete(id: String) = withContext(Dispatchers.IO) {
        userRepository.deleteById(id)
    }
    
    // Flow for streaming
    fun streamAllUsers(): Flow<UserDTO> = flow {
        userRepository.findAll().forEach { user ->
            emit(user.toDTO())
            delay(100)
        }
    }.flowOn(Dispatchers.IO)
}

// Extension function for mapping
private fun User.toDTO() = UserDTO(
    id = id,
    name = name,
    email = email,
    role = role,
    createdAt = createdAt
)
```

### 3. Repository with Coroutines

**Q: Implement reactive repository with Kotlin**

```kotlin
interface UserRepository : CoroutineCrudRepository<User, String> {
    
    suspend fun findByEmail(email: String): User?
    
    suspend fun findByNameContaining(name: String, pageable: Pageable): Page<User>
    
    fun findAllByActiveTrue(): Flow<User>
    
    @Query("SELECT u FROM User u WHERE u.role = :role")
    fun findByRole(@Param("role") role: Role): Flow<User>
    
    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    suspend fun deactivateInactiveUsers(@Param("date") LocalDateTime date): Int
}

// Custom repository implementation
@Repository
class CustomUserRepositoryImpl(
    private val entityManager: EntityManager
) : CustomUserRepository {
    
    override suspend fun findUsersWithComplexCriteria(
        criteria: UserSearchCriteria
    ): List<User> = withContext(Dispatchers.IO) {
        val cb = entityManager.criteriaBuilder
        val query = cb.createQuery(User::class.java)
        val root = query.from(User::class.java)
        
        val predicates = mutableListOf<Predicate>()
        
        criteria.email?.let {
            predicates.add(cb.equal(root.get<String>("email"), it))
        }
        
        criteria.minAge?.let {
            predicates.add(cb.greaterThanOrEqualTo(root.get("age"), it))
        }
        
        criteria.roles?.let {
            predicates.add(root.get<Role>("role").`in`(it))
        }
        
        query.where(*predicates.toTypedArray())
        
        entityManager.createQuery(query).resultList
    }
}
```

### 4. Configuration with Kotlin DSL

**Q: Write Spring configuration in Kotlin**

```kotlin
@Configuration
class AppConfig {
    
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
    
    @Bean
    fun objectMapper(): ObjectMapper = jacksonObjectMapper().apply {
        registerModule(JavaTimeModule())
        disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        setSerializationInclusion(JsonInclude.Include.NON_NULL)
    }
    
    @Bean
    fun restTemplate(builder: RestTemplateBuilder): RestTemplate = 
        builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(10))
            .build()
    
    @Bean
    fun coroutineScope(): CoroutineScope = 
        CoroutineScope(SupervisorJob() + Dispatchers.Default)
}

// Security configuration
@Configuration
@EnableWebSecurity
class SecurityConfig {
    
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            csrf { disable() }
            authorizeHttpRequests {
                authorize("/api/auth/**", permitAll)
                authorize("/api/admin/**", hasRole("ADMIN"))
                authorize(anyRequest, authenticated)
            }
            sessionManagement {
                sessionCreationPolicy = SessionCreationPolicy.STATELESS
            }
        }
        return http.build()
    }
}

// Cache configuration
@Configuration
@EnableCaching
class CacheConfig {
    
    @Bean
    fun cacheManager(): CacheManager = CaffeineCacheManager().apply {
        setCaffeine(
            Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .recordStats()
        )
    }
}
```

---

## Advanced Patterns

### 1. Result Monad Pattern

**Q: Implement functional error handling**

```kotlin
sealed class Result<out T> {
    data class Success<T>(val value: T) : Result<T>()
    data class Failure(val error: Throwable) : Result<Nothing>()
    
    inline fun <R> map(transform: (T) -> R): Result<R> = when (this) {
        is Success -> Success(transform(value))
        is Failure -> this
    }
    
    inline fun <R> flatMap(transform: (T) -> Result<R>): Result<R> = when (this) {
        is Success -> transform(value)
        is Failure -> this
    }
    
    inline fun onSuccess(action: (T) -> Unit): Result<T> {
        if (this is Success) action(value)
        return this
    }
    
    inline fun onFailure(action: (Throwable) -> Unit): Result<T> {
        if (this is Failure) action(error)
        return this
    }
    
    fun getOrNull(): T? = when (this) {
        is Success -> value
        is Failure -> null
    }
    
    fun getOrElse(default: T): T = when (this) {
        is Success -> value
        is Failure -> default
    }
    
    fun getOrThrow(): T = when (this) {
        is Success -> value
        is Failure -> throw error
    }
}

// Extension function for suspend functions
suspend fun <T> resultOf(block: suspend () -> T): Result<T> {
    return try {
        Result.Success(block())
    } catch (e: Exception) {
        Result.Failure(e)
    }
}

// Usage in service
@Service
class OrderService {
    
    suspend fun createOrder(request: OrderRequest): Result<Order> = resultOf {
        validateRequest(request)
        val order = orderRepository.save(Order(request))
        processPayment(order)
        order
    }
    
    suspend fun processOrderChain(request: OrderRequest): Result<OrderConfirmation> {
        return createOrder(request)
            .flatMap { order -> reserveInventory(order) }
            .flatMap { order -> scheduleShipping(order) }
            .map { order -> OrderConfirmation(order) }
            .onSuccess { confirmation ->
                logger.info("Order processed: ${confirmation.orderId}")
            }
            .onFailure { error ->
                logger.error("Order failed", error)
            }
    }
}
```

### 2. Repository Pattern with Caching

**Q: Implement multi-layer caching**

```kotlin
interface CachedRepository<T, ID> {
    suspend fun findById(id: ID): T?
    suspend fun save(entity: T): T
    suspend fun delete(id: ID)
    suspend fun invalidate(id: ID)
}

@Service
class CachedUserRepository(
    private val userRepository: UserRepository,
    private val localCache: CacheManager,
    private val redisTemplate: ReactiveRedisTemplate<String, User>
) : CachedRepository<User, String> {
    
    override suspend fun findById(id: String): User? {
        // Try local cache
        localCache.getCache("users")?.get(id, User::class.java)?.let {
            return it
        }
        
        // Try Redis
        redisTemplate.opsForValue().get("user:$id").awaitFirstOrNull()?.let { user ->
            localCache.getCache("users")?.put(id, user)
            return user
        }
        
        // Fetch from database
        return userRepository.findById(id)?.also { user ->
            // Populate caches
            localCache.getCache("users")?.put(id, user)
            redisTemplate.opsForValue()
                .set("user:$id", user, Duration.ofHours(1))
                .awaitFirstOrNull()
        }
    }
    
    override suspend fun save(entity: User): User {
        val saved = userRepository.save(entity)
        invalidate(saved.id)
        return saved
    }
    
    override suspend fun delete(id: String) {
        userRepository.deleteById(id)
        invalidate(id)
    }
    
    override suspend fun invalidate(id: String) {
        localCache.getCache("users")?.evict(id)
        redisTemplate.opsForValue().delete("user:$id").awaitFirstOrNull()
    }
}
```


### 3. Event-Driven Architecture

**Q: Implement event sourcing with Kotlin**

```kotlin
// Event base class
sealed class DomainEvent {
    abstract val aggregateId: String
    abstract val timestamp: LocalDateTime
}

// Order events
data class OrderCreatedEvent(
    override val aggregateId: String,
    override val timestamp: LocalDateTime,
    val customerId: String,
    val items: List<OrderItem>,
    val total: BigDecimal
) : DomainEvent()

data class OrderPaidEvent(
    override val aggregateId: String,
    override val timestamp: LocalDateTime,
    val paymentId: String
) : DomainEvent()

data class OrderShippedEvent(
    override val aggregateId: String,
    override val timestamp: LocalDateTime,
    val trackingNumber: String
) : DomainEvent()

// Event store
interface EventStore {
    suspend fun save(event: DomainEvent)
    suspend fun getEvents(aggregateId: String): List<DomainEvent>
}

@Repository
class EventStoreImpl(
    private val eventRepository: EventRepository
) : EventStore {
    
    override suspend fun save(event: DomainEvent) = withContext(Dispatchers.IO) {
        eventRepository.save(EventEntity.from(event))
    }
    
    override suspend fun getEvents(aggregateId: String): List<DomainEvent> = 
        withContext(Dispatchers.IO) {
            eventRepository.findByAggregateIdOrderByTimestamp(aggregateId)
                .map { it.toDomainEvent() }
        }
}

// Aggregate
data class Order(
    val id: String,
    val customerId: String,
    val items: List<OrderItem>,
    val status: OrderStatus,
    val total: BigDecimal,
    val paymentId: String? = null,
    val trackingNumber: String? = null
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
                        total = event.total
                    )
                    is OrderPaidEvent -> order?.copy(
                        status = OrderStatus.PAID,
                        paymentId = event.paymentId
                    )
                    is OrderShippedEvent -> order?.copy(
                        status = OrderStatus.SHIPPED,
                        trackingNumber = event.trackingNumber
                    )
                    else -> order
                }
            }
            
            return order ?: throw IllegalStateException("No events found")
        }
    }
}

// Service
@Service
class OrderService(
    private val eventStore: EventStore,
    private val eventPublisher: ApplicationEventPublisher
) {
    
    suspend fun createOrder(request: OrderRequest): Order {
        val event = OrderCreatedEvent(
            aggregateId = UUID.randomUUID().toString(),
            timestamp = LocalDateTime.now(),
            customerId = request.customerId,
            items = request.items,
            total = request.items.sumOf { it.price * it.quantity.toBigDecimal() }
        )
        
        eventStore.save(event)
        eventPublisher.publishEvent(event)
        
        return Order.fromEvents(listOf(event))
    }
    
    suspend fun getOrder(orderId: String): Order {
        val events = eventStore.getEvents(orderId)
        return Order.fromEvents(events)
    }
}
```

### 4. CQRS Pattern

**Q: Implement CQRS with separate read/write models**

```kotlin
// Command side
data class CreateOrderCommand(
    val customerId: String,
    val items: List<OrderItem>
)

data class UpdateOrderStatusCommand(
    val orderId: String,
    val status: OrderStatus
)

interface CommandHandler<C, R> {
    suspend fun handle(command: C): R
}

@Service
class CreateOrderCommandHandler(
    private val orderRepository: OrderRepository,
    private val eventPublisher: ApplicationEventPublisher
) : CommandHandler<CreateOrderCommand, String> {
    
    override suspend fun handle(command: CreateOrderCommand): String {
        val order = Order(
            id = UUID.randomUUID().toString(),
            customerId = command.customerId,
            items = command.items,
            status = OrderStatus.CREATED,
            total = command.items.sumOf { it.price * it.quantity.toBigDecimal() }
        )
        
        orderRepository.save(order)
        
        eventPublisher.publishEvent(
            OrderCreatedEvent(order.id, LocalDateTime.now(), order.customerId, order.items, order.total)
        )
        
        return order.id
    }
}

// Query side
data class OrderQuery(
    val orderId: String? = null,
    val customerId: String? = null,
    val status: OrderStatus? = null,
    val fromDate: LocalDateTime? = null,
    val toDate: LocalDateTime? = null
)

data class OrderReadModel(
    val id: String,
    val customerName: String,
    val itemCount: Int,
    val total: BigDecimal,
    val status: OrderStatus,
    val createdAt: LocalDateTime
)

interface QueryHandler<Q, R> {
    suspend fun handle(query: Q): R
}

@Service
class OrderQueryHandler(
    private val orderReadRepository: OrderReadRepository
) : QueryHandler<OrderQuery, List<OrderReadModel>> {
    
    override suspend fun handle(query: OrderQuery): List<OrderReadModel> = 
        withContext(Dispatchers.IO) {
            orderReadRepository.findByQuery(query)
        }
}

// Projection builder (updates read model from events)
@Component
class OrderProjection(
    private val orderReadRepository: OrderReadRepository
) {
    
    @EventListener
    @Async
    fun on(event: OrderCreatedEvent) {
        val readModel = OrderReadModel(
            id = event.aggregateId,
            customerName = "Customer ${event.customerId}",
            itemCount = event.items.size,
            total = event.total,
            status = OrderStatus.CREATED,
            createdAt = event.timestamp
        )
        
        orderReadRepository.save(readModel)
    }
    
    @EventListener
    @Async
    fun on(event: OrderPaidEvent) {
        orderReadRepository.updateStatus(event.aggregateId, OrderStatus.PAID)
    }
}
```

---

## Microservices with Kotlin

### 1. Service Communication with WebClient

**Q: Implement resilient HTTP client**

```kotlin
@Configuration
class WebClientConfig {
    
    @Bean
    fun webClient(): WebClient = WebClient.builder()
        .baseUrl("http://user-service")
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .filter(ExchangeFilterFunction.ofRequestProcessor { request ->
            logger.info("Request: ${request.method()} ${request.url()}")
            Mono.just(request)
        })
        .filter(ExchangeFilterFunction.ofResponseProcessor { response ->
            logger.info("Response: ${response.statusCode()}")
            Mono.just(response)
        })
        .build()
}

@Service
class UserServiceClient(
    private val webClient: WebClient
) {
    
    suspend fun getUser(userId: String): User? = 
        webClient.get()
            .uri("/api/users/{id}", userId)
            .retrieve()
            .awaitBodyOrNull<User>()
    
    suspend fun createUser(request: CreateUserRequest): User =
        webClient.post()
            .uri("/api/users")
            .bodyValue(request)
            .retrieve()
            .awaitBody<User>()
    
    // With error handling
    suspend fun getUserWithErrorHandling(userId: String): Result<User> {
        return try {
            val user = webClient.get()
                .uri("/api/users/{id}", userId)
                .retrieve()
                .onStatus({ it.is4xxClientError }) { response ->
                    Mono.error(ClientException("User not found"))
                }
                .onStatus({ it.is5xxServerError }) { response ->
                    Mono.error(ServerException("Server error"))
                }
                .awaitBody<User>()
            
            Result.Success(user)
        } catch (e: Exception) {
            Result.Failure(e)
        }
    }
    
    // With retry and timeout
    suspend fun getUserWithResilience(userId: String): User? {
        return webClient.get()
            .uri("/api/users/{id}", userId)
            .retrieve()
            .bodyToMono<User>()
            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))
            .timeout(Duration.ofSeconds(5))
            .awaitSingleOrNull()
    }
}
```

### 2. Kafka Integration

**Q: Implement Kafka producer and consumer**

```kotlin
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
            ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG to true
        )
        return DefaultKafkaProducerFactory(config)
    }
    
    @Bean
    fun kafkaTemplate(): KafkaTemplate<String, Any> = 
        KafkaTemplate(producerFactory())
    
    @Bean
    fun consumerFactory(): ConsumerFactory<String, OrderEvent> {
        val config = mapOf(
            ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to "localhost:9092",
            ConsumerConfig.GROUP_ID_CONFIG to "order-service",
            ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG to StringDeserializer::class.java,
            ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG to JsonDeserializer::class.java,
            ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG to false,
            JsonDeserializer.TRUSTED_PACKAGES to "*"
        )
        return DefaultKafkaConsumerFactory(config)
    }
}

// Producer
@Service
class OrderEventProducer(
    private val kafkaTemplate: KafkaTemplate<String, Any>
) {
    
    suspend fun publishOrderCreated(order: Order) {
        val event = OrderCreatedEvent(
            aggregateId = order.id,
            timestamp = LocalDateTime.now(),
            customerId = order.customerId,
            items = order.items,
            total = order.total
        )
        
        kafkaTemplate.send("order-events", order.id, event).await()
        logger.info("Published order created event: ${order.id}")
    }
    
    // With error handling
    suspend fun publishWithErrorHandling(topic: String, key: String, event: Any) {
        try {
            val result = kafkaTemplate.send(topic, key, event).await()
            logger.info("Published to $topic: offset=${result.recordMetadata.offset()}")
        } catch (e: Exception) {
            logger.error("Failed to publish event", e)
            // Handle error (retry, dead letter queue, etc.)
        }
    }
}

// Consumer
@Service
class OrderEventConsumer(
    private val orderService: OrderService
) {
    
    @KafkaListener(
        topics = ["order-events"],
        groupId = "notification-service"
    )
    fun handleOrderEvent(event: OrderCreatedEvent) {
        logger.info("Received order event: ${event.aggregateId}")
        // Process event
    }
    
    // With manual acknowledgment
    @KafkaListener(
        topics = ["order-events"],
        groupId = "notification-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    fun handleOrderEventWithAck(
        event: OrderCreatedEvent,
        acknowledgment: Acknowledgment
    ) {
        try {
            processEvent(event)
            acknowledgment.acknowledge()
        } catch (e: Exception) {
            logger.error("Failed to process event", e)
            // Don't acknowledge, will be redelivered
        }
    }
    
    // Batch processing
    @KafkaListener(
        topics = ["order-events"],
        groupId = "batch-processor",
        containerFactory = "batchFactory"
    )
    fun handleBatch(events: List<OrderCreatedEvent>) {
        logger.info("Processing batch of ${events.size} events")
        events.forEach { processEvent(it) }
    }
}
```

### 3. Circuit Breaker with Resilience4j

**Q: Implement circuit breaker pattern**

```kotlin
@Configuration
class Resilience4jConfig {
    
    @Bean
    fun circuitBreakerRegistry(): CircuitBreakerRegistry {
        val config = CircuitBreakerConfig.custom()
            .slidingWindowSize(10)
            .minimumNumberOfCalls(5)
            .failureRateThreshold(50.0f)
            .waitDurationInOpenState(Duration.ofSeconds(5))
            .permittedNumberOfCallsInHalfOpenState(3)
            .automaticTransitionFromOpenToHalfOpenEnabled(true)
            .build()
        
        return CircuitBreakerRegistry.of(config)
    }
    
    @Bean
    fun retryRegistry(): RetryRegistry {
        val config = RetryConfig.custom<Any>()
            .maxAttempts(3)
            .waitDuration(Duration.ofSeconds(1))
            .retryExceptions(IOException::class.java, TimeoutException::class.java)
            .build()
        
        return RetryRegistry.of(config)
    }
}

@Service
class ResilientUserService(
    private val userServiceClient: UserServiceClient,
    circuitBreakerRegistry: CircuitBreakerRegistry,
    retryRegistry: RetryRegistry
) {
    
    private val circuitBreaker = circuitBreakerRegistry.circuitBreaker("userService")
    private val retry = retryRegistry.retry("userService")
    
    suspend fun getUser(userId: String): User? {
        return executeWithResilience {
            userServiceClient.getUser(userId)
        }
    }
    
    private suspend fun <T> executeWithResilience(block: suspend () -> T): T {
        return try {
            // Apply circuit breaker
            circuitBreaker.executeSuspendFunction {
                // Apply retry
                retry.executeSuspendFunction {
                    block()
                }
            }
        } catch (e: CallNotPermittedException) {
            logger.error("Circuit breaker is open")
            throw ServiceUnavailableException("Service temporarily unavailable")
        }
    }
    
    // With fallback
    suspend fun getUserWithFallback(userId: String): User {
        return try {
            executeWithResilience {
                userServiceClient.getUser(userId)
            } ?: throw UserNotFoundException()
        } catch (e: Exception) {
            logger.error("Failed to fetch user, using fallback", e)
            User(id = userId, name = "Unknown User", email = "unknown@example.com")
        }
    }
}

// Extension functions for Resilience4j
suspend fun <T> CircuitBreaker.executeSuspendFunction(block: suspend () -> T): T {
    return decorateSuspendFunction(this, block).invoke()
}

suspend fun <T> Retry.executeSuspendFunction(block: suspend () -> T): T {
    return decorateSuspendFunction(this, block).invoke()
}
```

---

## Testing

### 1. Unit Testing with MockK

**Q: Write comprehensive unit tests**

```kotlin
@ExtendWith(MockKExtension::class)
class UserServiceTest {
    
    @MockK
    private lateinit var userRepository: UserRepository
    
    @MockK
    private lateinit var passwordEncoder: PasswordEncoder
    
    @InjectMockKs
    private lateinit var userService: UserService
    
    @Test
    fun `createUser should save user and return DTO`() = runTest {
        // Given
        val request = CreateUserRequest("john@example.com", "password")
        val user = User("1", "john@example.com", "encoded")
        
        coEvery { userRepository.findByEmail(any()) } returns null
        every { passwordEncoder.encode("password") } returns "encoded"
        coEvery { userRepository.save(any()) } returns user
        
        // When
        val result = userService.create(request)
        
        // Then
        assertEquals("john@example.com", result.email)
        coVerify { userRepository.save(any()) }
        verify { passwordEncoder.encode("password") }
    }
    
    @Test
    fun `createUser should throw exception when email exists`() = runTest {
        // Given
        val request = CreateUserRequest("john@example.com", "password")
        val existingUser = User("1", "john@example.com", "encoded")
        
        coEvery { userRepository.findByEmail("john@example.com") } returns existingUser
        
        // When & Then
        assertThrows<DuplicateEmailException> {
            userService.create(request)
        }
        
        coVerify(exactly = 0) { userRepository.save(any()) }
    }
    
    @Test
    fun `findById should return user when exists`() = runTest {
        // Given
        val user = User("1", "john@example.com", "encoded")
        coEvery { userRepository.findById("1") } returns user
        
        // When
        val result = userService.findById("1")
        
        // Then
        assertNotNull(result)
        assertEquals("john@example.com", result?.email)
    }
    
    @Test
    fun `findById should return null when not exists`() = runTest {
        // Given
        coEvery { userRepository.findById("1") } returns null
        
        // When
        val result = userService.findById("1")
        
        // Then
        assertNull(result)
    }
}
```

### 2. Integration Testing with Testcontainers

**Q: Write integration tests**

```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserControllerIntegrationTest {
    
    companion object {
        @Container
        val postgres = PostgreSQLContainer<Nothing>("postgres:15").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
        }
        
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
            registry.add("spring.redis.host", redis::getHost)
            registry.add("spring.redis.port") { redis.getMappedPort(6379) }
        }
    }
    
    @Autowired
    private lateinit var webTestClient: WebTestClient
    
    @Autowired
    private lateinit var userRepository: UserRepository
    
    @BeforeEach
    fun setUp() = runBlocking {
        userRepository.deleteAll()
    }
    
    @Test
    fun `should create user successfully`() = runBlocking {
        // Given
        val request = CreateUserRequest("john@example.com", "password")
        
        // When
        val response = webTestClient.post()
            .uri("/api/users")
            .bodyValue(request)
            .exchange()
        
        // Then
        response.expectStatus().isCreated
            .expectBody<UserDTO>()
            .consumeWith { result ->
                assertNotNull(result.responseBody)
                assertEquals("john@example.com", result.responseBody?.email)
            }
        
        // Verify in database
        val savedUser = userRepository.findByEmail("john@example.com")
        assertNotNull(savedUser)
    }
    
    @Test
    fun `should return 404 when user not found`() {
        webTestClient.get()
            .uri("/api/users/nonexistent")
            .exchange()
            .expectStatus().isNotFound
    }
}
```

### 3. Coroutine Testing

**Q: Test coroutines properly**

```kotlin
class CoroutineServiceTest {
    
    @Test
    fun `test parallel execution`() = runTest {
        val service = DataService()
        
        val start = currentTime
        val result = service.loadUserProfile("123")
        val duration = currentTime - start
        
        // Should complete in ~1 second (parallel), not 3 seconds (sequential)
        assertTrue(duration < 1500)
        assertNotNull(result.user)
        assertNotNull(result.orders)
        assertNotNull(result.friends)
    }
    
    @Test
    fun `test timeout handling`() = runTest {
        val service = DataService()
        
        assertThrows<TimeoutCancellationException> {
            withTimeout(100) {
                service.slowOperation()
            }
        }
    }
    
    @Test
    fun `test cancellation`() = runTest {
        val service = DataService()
        val job = launch {
            service.longRunningOperation()
        }
        
        delay(100)
        job.cancel()
        
        assertTrue(job.isCancelled)
    }
}
```

---

## Best Practices

1. **Use data classes** for DTOs and value objects
2. **Leverage null safety** - avoid !! operator
3. **Use coroutines** for async operations
4. **Prefer immutability** - use val over var
5. **Use extension functions** for utility methods
6. **Implement proper error handling** with Result or sealed classes
7. **Use Flow** for streaming data
8. **Write idiomatic Kotlin** - avoid Java patterns
9. **Use scope functions** (let, apply, run, also, with) appropriately
10. **Test coroutines** with runTest

---

## Resources

- [Kotlin Documentation](https://kotlinlang.org/docs/home.html)
- [Spring Boot with Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin/)
- [Kotlin Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html)
- [Effective Kotlin](https://kt.academy/book/effectivekotlin)

---

## Congratulations!

You're prepared for senior Kotlin Spring interviews with:
✅ Kotlin language mastery
✅ Coroutines expertise
✅ Spring Boot with Kotlin
✅ Microservices patterns
✅ Event-driven architecture
✅ Testing strategies
✅ Best practices

**Good luck! 🚀**
