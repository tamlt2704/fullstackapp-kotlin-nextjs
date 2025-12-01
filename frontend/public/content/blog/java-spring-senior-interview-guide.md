---
title: "Java Spring Senior Backend Developer - Interview Guide"
date: "2024-12-13"
category: "Interview Preparation"
tags: ["Java", "Spring Boot", "Interview", "Backend", "Senior Developer"]
---

# Java Spring Senior Backend Developer - Interview Guide

## Core Java Concepts

### 1. Collections Framework

**Q: Explain HashMap internal working and collision handling.**

```java
// HashMap uses array of Node<K,V>[] buckets
// Hash function: (n - 1) & hash where n is array length
// Collision handling: Linked list (Java 7) or Red-Black Tree (Java 8+)

public class HashMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        
        // Put operation
        map.put("key1", 100);  // hash -> bucket index -> store
        
        // Get operation
        Integer value = map.get("key1");  // hash -> bucket -> find
        
        // Collision scenario
        map.put("Aa", 1);  // Same hashcode as "BB"
        map.put("BB", 2);  // Stored in same bucket, different nodes
    }
}

// Custom hashCode and equals
class Employee {
    private int id;
    private String name;
    
    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Employee)) return false;
        Employee other = (Employee) obj;
        return id == other.id && Objects.equals(name, other.name);
    }
}
```

**Q: ConcurrentHashMap vs HashMap vs Hashtable**

```java
// HashMap - not thread-safe, allows null key/value
Map<String, String> hashMap = new HashMap<>();

// Hashtable - thread-safe (synchronized), no null key/value
Map<String, String> hashtable = new Hashtable<>();

// ConcurrentHashMap - thread-safe (lock striping), no null key/value
Map<String, String> concurrentMap = new ConcurrentHashMap<>();

// ConcurrentHashMap advantages
public class ConcurrentMapDemo {
    private ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
    
    // Atomic operations
    public void increment(String key) {
        map.compute(key, (k, v) -> v == null ? 1 : v + 1);
        // Or
        map.merge(key, 1, Integer::sum);
    }
    
    // putIfAbsent
    public void addIfNew(String key, Integer value) {
        map.putIfAbsent(key, value);
    }
}
```

### 2. Multithreading

**Q: Implement thread-safe Singleton pattern**

```java
// Double-checked locking
public class Singleton {
    private static volatile Singleton instance;
    
    private Singleton() {}
    
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

// Enum singleton (best approach)
public enum SingletonEnum {
    INSTANCE;
    
    public void doSomething() {
        // Business logic
    }
}

// Bill Pugh Singleton
public class BillPughSingleton {
    private BillPughSingleton() {}
    
    private static class SingletonHelper {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
}
```

**Q: Producer-Consumer problem with BlockingQueue**

```java
public class ProducerConsumer {
    private BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(10);
    
    class Producer implements Runnable {
        @Override
        public void run() {
            try {
                for (int i = 0; i < 100; i++) {
                    queue.put(i);
                    System.out.println("Produced: " + i);
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    class Consumer implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    Integer item = queue.take();
                    System.out.println("Consumed: " + item);
                    Thread.sleep(200);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    public void start() {
        new Thread(new Producer()).start();
        new Thread(new Consumer()).start();
    }
}
```

**Q: Implement custom ThreadPool**

```java
public class CustomThreadPool {
    private final BlockingQueue<Runnable> taskQueue;
    private final List<WorkerThread> threads;
    private volatile boolean isShutdown = false;
    
    public CustomThreadPool(int poolSize, int queueSize) {
        taskQueue = new LinkedBlockingQueue<>(queueSize);
        threads = new ArrayList<>(poolSize);
        
        for (int i = 0; i < poolSize; i++) {
            WorkerThread worker = new WorkerThread();
            threads.add(worker);
            worker.start();
        }
    }
    
    public void submit(Runnable task) throws InterruptedException {
        if (isShutdown) {
            throw new IllegalStateException("ThreadPool is shutdown");
        }
        taskQueue.put(task);
    }
    
    public void shutdown() {
        isShutdown = true;
        threads.forEach(Thread::interrupt);
    }
    
    private class WorkerThread extends Thread {
        @Override
        public void run() {
            while (!isShutdown) {
                try {
                    Runnable task = taskQueue.take();
                    task.run();
                } catch (InterruptedException e) {
                    if (isShutdown) break;
                }
            }
        }
    }
}
```

### 3. Java 8+ Features

**Q: Stream API advanced operations**

```java
public class StreamExamples {
    
    // Complex filtering and mapping
    public List<String> processEmployees(List<Employee> employees) {
        return employees.stream()
            .filter(e -> e.getSalary() > 50000)
            .filter(e -> e.getDepartment().equals("IT"))
            .sorted(Comparator.comparing(Employee::getSalary).reversed())
            .map(Employee::getName)
            .limit(10)
            .collect(Collectors.toList());
    }
    
    // Grouping and aggregation
    public Map<String, Double> averageSalaryByDepartment(List<Employee> employees) {
        return employees.stream()
            .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.averagingDouble(Employee::getSalary)
            ));
    }
    
    // Partitioning
    public Map<Boolean, List<Employee>> partitionBySalary(List<Employee> employees) {
        return employees.stream()
            .collect(Collectors.partitioningBy(e -> e.getSalary() > 50000));
    }
    
    // Custom collector
    public String joinNames(List<Employee> employees) {
        return employees.stream()
            .map(Employee::getName)
            .collect(Collectors.joining(", ", "[", "]"));
    }
    
    // FlatMap
    public List<String> getAllSkills(List<Employee> employees) {
        return employees.stream()
            .flatMap(e -> e.getSkills().stream())
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }
}
```

**Q: CompletableFuture for async operations**

```java
public class AsyncService {
    
    // Simple async operation
    public CompletableFuture<String> fetchUserAsync(String userId) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulate API call
            sleep(1000);
            return "User-" + userId;
        });
    }
    
    // Chaining operations
    public CompletableFuture<UserProfile> getUserProfile(String userId) {
        return fetchUserAsync(userId)
            .thenApply(user -> fetchUserDetails(user))
            .thenApply(details -> new UserProfile(details))
            .exceptionally(ex -> {
                log.error("Error fetching profile", ex);
                return UserProfile.empty();
            });
    }
    
    // Combining multiple futures
    public CompletableFuture<Dashboard> getDashboard(String userId) {
        CompletableFuture<User> userFuture = fetchUserAsync(userId);
        CompletableFuture<List<Order>> ordersFuture = fetchOrdersAsync(userId);
        CompletableFuture<List<Notification>> notifsFuture = fetchNotificationsAsync(userId);
        
        return CompletableFuture.allOf(userFuture, ordersFuture, notifsFuture)
            .thenApply(v -> new Dashboard(
                userFuture.join(),
                ordersFuture.join(),
                notifsFuture.join()
            ));
    }
    
    // Timeout handling
    public CompletableFuture<String> fetchWithTimeout(String url) {
        return CompletableFuture.supplyAsync(() -> httpClient.get(url))
            .orTimeout(5, TimeUnit.SECONDS)
            .exceptionally(ex -> "Timeout or error: " + ex.getMessage());
    }
}
```

### 4. Memory Management

**Q: Explain memory leaks and how to prevent them**

```java
// Memory leak example 1: Static collections
public class MemoryLeakExample {
    private static List<Object> list = new ArrayList<>();
    
    public void addToCache(Object obj) {
        list.add(obj);  // Never removed, causes memory leak
    }
}

// Solution: Use WeakHashMap or implement eviction
public class CacheWithEviction {
    private Map<String, Object> cache = new LinkedHashMap<>(100, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(Map.Entry eldest) {
            return size() > 100;
        }
    };
}

// Memory leak example 2: Unclosed resources
public class ResourceLeak {
    public void readFile(String path) {
        FileInputStream fis = new FileInputStream(path);
        // If exception occurs, stream not closed
    }
}

// Solution: Try-with-resources
public class ProperResourceHandling {
    public void readFile(String path) {
        try (FileInputStream fis = new FileInputStream(path);
             BufferedReader reader = new BufferedReader(new InputStreamReader(fis))) {
            // Use resources
        } catch (IOException e) {
            log.error("Error reading file", e);
        }
    }
}

// Memory leak example 3: Thread local
public class ThreadLocalLeak {
    private static ThreadLocal<Connection> connectionHolder = new ThreadLocal<>();
    
    public void doWork() {
        connectionHolder.set(getConnection());
        // If not removed, causes leak in thread pools
    }
}

// Solution: Always remove
public class ProperThreadLocal {
    private static ThreadLocal<Connection> connectionHolder = new ThreadLocal<>();
    
    public void doWork() {
        try {
            connectionHolder.set(getConnection());
            // Use connection
        } finally {
            connectionHolder.remove();
        }
    }
}
```

---

## Spring Framework

### 1. Dependency Injection

**Q: Different types of DI and when to use each**

```java
// Constructor injection (recommended)
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
}

// Setter injection (optional dependencies)
@Service
public class NotificationService {
    private EmailService emailService;
    private SmsService smsService;
    
    @Autowired(required = false)
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @Autowired(required = false)
    public void setSmsService(SmsService smsService) {
        this.smsService = smsService;
    }
}

// Field injection (not recommended, but common)
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;  // Hard to test
}
```

**Q: Bean scopes and lifecycle**

```java
// Singleton (default)
@Service
@Scope("singleton")
public class SingletonService {
    // One instance per Spring container
}

// Prototype
@Service
@Scope("prototype")
public class PrototypeService {
    // New instance every time requested
}

// Request scope (web applications)
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedBean {
    // New instance per HTTP request
}

// Bean lifecycle
@Component
public class LifecycleBean {
    
    @PostConstruct
    public void init() {
        // Called after dependency injection
        System.out.println("Bean initialized");
    }
    
    @PreDestroy
    public void cleanup() {
        // Called before bean destruction
        System.out.println("Bean destroyed");
    }
}

// Custom initialization
@Configuration
public class BeanConfig {
    
    @Bean(initMethod = "init", destroyMethod = "cleanup")
    public MyService myService() {
        return new MyService();
    }
}
```

### 2. AOP (Aspect-Oriented Programming)

**Q: Implement logging and performance monitoring with AOP**

```java
@Aspect
@Component
public class LoggingAspect {
    
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);
    
    // Before advice
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Executing: {}", joinPoint.getSignature().getName());
    }
    
    // After returning
    @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        log.info("Method {} returned: {}", joinPoint.getSignature().getName(), result);
    }
    
    // After throwing
    @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "error")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable error) {
        log.error("Method {} threw exception: {}", joinPoint.getSignature().getName(), error.getMessage());
    }
    
    // Around advice (most powerful)
    @Around("@annotation(com.example.annotation.Timed)")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            log.info("Method {} took {} ms", joinPoint.getSignature().getName(), duration);
            return result;
        } catch (Throwable e) {
            long duration = System.currentTimeMillis() - start;
            log.error("Method {} failed after {} ms", joinPoint.getSignature().getName(), duration);
            throw e;
        }
    }
}

// Custom annotation
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Timed {
}

// Usage
@Service
public class UserService {
    
    @Timed
    public User findUser(String id) {
        // Method implementation
    }
}
```

### 3. Transaction Management

**Q: Explain @Transactional and propagation levels**

```java
@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private PaymentService paymentService;
    
    // REQUIRED (default): Use existing transaction or create new
    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = orderRepository.save(new Order(request));
        inventoryService.reserveItems(order.getItems());
        paymentService.processPayment(order.getTotal());
        return order;
    }
    
    // REQUIRES_NEW: Always create new transaction
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logOrderEvent(String orderId, String event) {
        // Logged even if parent transaction rolls back
        auditRepository.save(new AuditLog(orderId, event));
    }
    
    // MANDATORY: Must have existing transaction
    @Transactional(propagation = Propagation.MANDATORY)
    public void updateOrderStatus(String orderId, OrderStatus status) {
        // Throws exception if no transaction exists
        orderRepository.updateStatus(orderId, status);
    }
    
    // NOT_SUPPORTED: Execute without transaction
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public OrderStats getOrderStats() {
        // Read-only operation, no transaction needed
        return orderRepository.calculateStats();
    }
    
    // Rollback configuration
    @Transactional(rollbackFor = Exception.class, noRollbackFor = ValidationException.class)
    public void processOrder(Order order) {
        // Rolls back on any Exception except ValidationException
    }
    
    // Read-only optimization
    @Transactional(readOnly = true)
    public List<Order> findOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }
    
    // Isolation levels
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void criticalOperation() {
        // Highest isolation, prevents phantom reads
    }
}
```

**Q: Handle distributed transactions**

```java
// Saga pattern for distributed transactions
@Service
public class OrderSagaService {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private ShippingService shippingService;
    
    public OrderResult createOrderWithSaga(OrderRequest request) {
        String orderId = null;
        String paymentId = null;
        String reservationId = null;
        
        try {
            // Step 1: Create order
            orderId = orderService.createOrder(request);
            
            // Step 2: Process payment
            paymentId = paymentService.processPayment(orderId, request.getAmount());
            
            // Step 3: Reserve inventory
            reservationId = inventoryService.reserveItems(orderId, request.getItems());
            
            // Step 4: Schedule shipping
            shippingService.scheduleShipping(orderId);
            
            return OrderResult.success(orderId);
            
        } catch (Exception e) {
            // Compensating transactions (rollback)
            if (reservationId != null) {
                inventoryService.releaseReservation(reservationId);
            }
            if (paymentId != null) {
                paymentService.refundPayment(paymentId);
            }
            if (orderId != null) {
                orderService.cancelOrder(orderId);
            }
            
            return OrderResult.failure(e.getMessage());
        }
    }
}
```


### 4. REST API Design

**Q: Design RESTful API with proper error handling**

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<UserDTO> users = userService.findAll(search, pageable);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO user = userService.create(request);
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(user.getId())
            .toUri();
        return ResponseEntity.created(location).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        return userService.update(id, request)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

// Global exception handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage
            ));
        
        ValidationErrorResponse response = new ValidationErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            errors,
            LocalDateTime.now()
        );
        
        return ResponseEntity.badRequest().body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal server error",
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

---

## Spring Boot

### 1. Auto-configuration

**Q: Create custom Spring Boot starter**

```java
// Auto-configuration class
@Configuration
@ConditionalOnClass(MyService.class)
@EnableConfigurationProperties(MyServiceProperties.class)
public class MyServiceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyServiceProperties properties) {
        return new MyService(properties);
    }
}

// Configuration properties
@ConfigurationProperties(prefix = "myservice")
public class MyServiceProperties {
    private String apiKey;
    private int timeout = 5000;
    private boolean enabled = true;
    
    // Getters and setters
}

// spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.autoconfigure.MyServiceAutoConfiguration

// Usage in application.yml
myservice:
  api-key: your-api-key
  timeout: 10000
  enabled: true
```

### 2. Caching

**Q: Implement multi-level caching strategy**

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .recordStats());
        return cacheManager;
    }
    
    @Bean
    public CacheManager redisCacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .build();
    }
}

@Service
public class UserService {
    
    // Simple caching
    @Cacheable(value = "users", key = "#id")
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }
    
    // Conditional caching
    @Cacheable(value = "users", key = "#id", condition = "#id != null", unless = "#result == null")
    public User findByIdConditional(String id) {
        return userRepository.findById(id).orElse(null);
    }
    
    // Cache eviction
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
    
    // Clear all cache
    @CacheEvict(value = "users", allEntries = true)
    public void clearCache() {
        // Cache cleared
    }
    
    // Update cache
    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    // Multiple cache operations
    @Caching(
        cacheable = @Cacheable(value = "users", key = "#id"),
        evict = @CacheEvict(value = "userStats", allEntries = true)
    )
    public User findAndInvalidateStats(String id) {
        return userRepository.findById(id).orElse(null);
    }
}

// Custom cache implementation
@Service
public class MultiLevelCacheService {
    
    @Autowired
    private CacheManager localCacheManager;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public <T> T get(String key, Class<T> type) {
        // Try local cache first
        Cache localCache = localCacheManager.getCache("local");
        T value = localCache.get(key, type);
        
        if (value != null) {
            return value;
        }
        
        // Try Redis
        value = (T) redisTemplate.opsForValue().get(key);
        
        if (value != null) {
            // Populate local cache
            localCache.put(key, value);
            return value;
        }
        
        return null;
    }
    
    public void put(String key, Object value) {
        // Write to both caches
        localCacheManager.getCache("local").put(key, value);
        redisTemplate.opsForValue().set(key, value, 1, TimeUnit.HOURS);
    }
}
```

### 3. Security

**Q: Implement JWT authentication**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) 
            throws Exception {
        return config.getAuthenticationManager();
    }
}

// JWT Service
@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
    
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

// JWT Filter
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

---

## Database & JPA

### 1. Complex Queries

**Q: Write efficient JPA queries**

```java
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    // Method name query
    List<User> findByEmailAndActiveTrue(String email);
    
    // JPQL
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
    
    // Native query
    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<User> findByEmailNative(@Param("email") String email);
    
    // Projection
    @Query("SELECT new com.example.dto.UserSummary(u.id, u.name, u.email) FROM User u")
    List<UserSummary> findAllSummaries();
    
    // Join fetch
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")
    Optional<User> findByIdWithOrders(@Param("id") String id);
    
    // Pagination
    @Query("SELECT u FROM User u WHERE u.department = :dept")
    Page<User> findByDepartment(@Param("dept") String department, Pageable pageable);
    
    // Modifying query
    @Modifying
    @Query("UPDATE User u SET u.active = false WHERE u.lastLogin < :date")
    int deactivateInactiveUsers(@Param("date") LocalDateTime date);
}

// Specification for dynamic queries
public class UserSpecifications {
    
    public static Specification<User> hasEmail(String email) {
        return (root, query, cb) -> 
            email == null ? null : cb.equal(root.get("email"), email);
    }
    
    public static Specification<User> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("active"));
    }
    
    public static Specification<User> createdAfter(LocalDateTime date) {
        return (root, query, cb) -> 
            date == null ? null : cb.greaterThan(root.get("createdAt"), date);
    }
    
    public static Specification<User> inDepartment(String department) {
        return (root, query, cb) -> 
            department == null ? null : cb.equal(root.get("department"), department);
    }
}

// Usage
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> searchUsers(UserSearchCriteria criteria) {
        Specification<User> spec = Specification.where(null);
        
        if (criteria.getEmail() != null) {
            spec = spec.and(UserSpecifications.hasEmail(criteria.getEmail()));
        }
        
        if (criteria.isActiveOnly()) {
            spec = spec.and(UserSpecifications.isActive());
        }
        
        if (criteria.getCreatedAfter() != null) {
            spec = spec.and(UserSpecifications.createdAfter(criteria.getCreatedAfter()));
        }
        
        return userRepository.findAll(spec);
    }
}
```

### 2. N+1 Problem Solutions

```java
// Problem: N+1 queries
@Service
public class OrderService {
    
    // Bad: Causes N+1 queries
    public List<OrderDTO> getAllOrdersBad() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
            .map(order -> {
                // Each call triggers separate query
                List<OrderItem> items = order.getItems();
                return new OrderDTO(order, items);
            })
            .collect(Collectors.toList());
    }
    
    // Solution 1: JOIN FETCH
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items")
    List<Order> findAllWithItems();
    
    // Solution 2: Entity Graph
    @EntityGraph(attributePaths = {"items", "customer"})
    List<Order> findAll();
    
    // Solution 3: Batch fetching
    @Entity
    @BatchSize(size = 10)
    public class Order {
        @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
        @BatchSize(size = 10)
        private List<OrderItem> items;
    }
}
```

### 3. Optimistic vs Pessimistic Locking

```java
// Optimistic locking
@Entity
public class Product {
    @Id
    private String id;
    
    private String name;
    private int quantity;
    
    @Version
    private Long version;  // Automatically managed by JPA
}

@Service
public class ProductService {
    
    @Transactional
    public void updateQuantity(String productId, int newQuantity) {
        try {
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException());
            
            product.setQuantity(newQuantity);
            productRepository.save(product);
            
        } catch (OptimisticLockException e) {
            // Handle concurrent modification
            throw new ConcurrentModificationException("Product was modified by another user");
        }
    }
}

// Pessimistic locking
@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") String id);
    
    @Lock(LockModeType.PESSIMISTIC_READ)
    Optional<Product> findById(String id);
}

@Service
public class InventoryService {
    
    @Transactional
    public void reserveProduct(String productId, int quantity) {
        // Locks row until transaction completes
        Product product = productRepository.findByIdWithLock(productId)
            .orElseThrow(() -> new EntityNotFoundException());
        
        if (product.getQuantity() < quantity) {
            throw new InsufficientStockException();
        }
        
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }
}
```

---

## Performance & Scalability

### 1. Connection Pooling

**Q: Configure HikariCP for optimal performance**

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
      pool-name: HikariPool
      
      # Performance tuning
      auto-commit: false
      connection-test-query: SELECT 1
      
      # Monitoring
      register-mbeans: true
```

```java
@Configuration
public class DataSourceConfig {
    
    @Bean
    @ConfigurationProperties("spring.datasource.hikari")
    public HikariConfig hikariConfig() {
        HikariConfig config = new HikariConfig();
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        config.setLeakDetectionThreshold(60000);
        
        // Performance
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        
        return config;
    }
    
    @Bean
    public DataSource dataSource(HikariConfig hikariConfig) {
        return new HikariDataSource(hikariConfig);
    }
}
```

### 2. Async Processing

**Q: Implement async processing with Spring**

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}

@Service
public class EmailService {
    
    @Async("taskExecutor")
    public CompletableFuture<Void> sendEmailAsync(String to, String subject, String body) {
        try {
            // Send email
            Thread.sleep(1000);  // Simulate delay
            log.info("Email sent to: {}", to);
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }
    
    @Async
    public void sendBulkEmails(List<String> recipients) {
        recipients.forEach(recipient -> {
            sendEmail(recipient, "Subject", "Body");
        });
    }
}

@Service
public class OrderService {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private NotificationService notificationService;
    
    public Order createOrder(OrderRequest request) {
        Order order = orderRepository.save(new Order(request));
        
        // Async operations
        CompletableFuture<Void> emailFuture = emailService.sendEmailAsync(
            order.getCustomerEmail(),
            "Order Confirmation",
            "Your order has been placed"
        );
        
        CompletableFuture<Void> notificationFuture = notificationService.sendNotificationAsync(
            order.getCustomerId(),
            "Order placed successfully"
        );
        
        // Wait for both to complete
        CompletableFuture.allOf(emailFuture, notificationFuture).join();
        
        return order;
    }
}
```


### 3. Rate Limiting

**Q: Implement API rate limiting**

```java
@Component
public class RateLimitingFilter extends OncePerRequestFilter {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        String key = getClientKey(request);
        Bucket bucket = resolveBucket(key);
        
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Rate limit exceeded");
        }
    }
    
    private Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createNewBucket());
    }
    
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }
    
    private String getClientKey(HttpServletRequest request) {
        String userId = request.getHeader("X-User-Id");
        return userId != null ? userId : request.getRemoteAddr();
    }
}

// Redis-based rate limiting
@Service
public class RedisRateLimiter {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public boolean allowRequest(String key, int maxRequests, Duration window) {
        String redisKey = "rate_limit:" + key;
        Long currentCount = redisTemplate.opsForValue().increment(redisKey);
        
        if (currentCount == 1) {
            redisTemplate.expire(redisKey, window);
        }
        
        return currentCount <= maxRequests;
    }
}
```

---

## Microservices

### 1. Service Communication

**Q: Implement resilient service communication**

```java
// Feign client
@FeignClient(name = "user-service", url = "${user-service.url}")
public interface UserServiceClient {
    
    @GetMapping("/api/users/{id}")
    UserDTO getUser(@PathVariable String id);
    
    @PostMapping("/api/users")
    UserDTO createUser(@RequestBody CreateUserRequest request);
}

// Circuit breaker with Resilience4j
@Service
public class OrderService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private CircuitBreakerRegistry circuitBreakerRegistry;
    
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    @Retry(name = "userService")
    @RateLimiter(name = "userService")
    public UserDTO getUser(String userId) {
        return userServiceClient.getUser(userId);
    }
    
    private UserDTO getUserFallback(String userId, Exception e) {
        log.error("Failed to fetch user: {}", userId, e);
        return UserDTO.builder()
            .id(userId)
            .name("Unknown User")
            .build();
    }
}

// Configuration
resilience4j:
  circuitbreaker:
    instances:
      userService:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 5s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
        
  retry:
    instances:
      userService:
        maxAttempts: 3
        waitDuration: 1s
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2
        
  ratelimiter:
    instances:
      userService:
        limitForPeriod: 10
        limitRefreshPeriod: 1s
        timeoutDuration: 0s
```

### 2. Event-Driven Architecture

**Q: Implement event publishing and consuming**

```java
// Event
public class OrderCreatedEvent {
    private String orderId;
    private String customerId;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    
    // Constructor, getters, setters
}

// Event publisher
@Service
public class OrderService {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    @Autowired
    private KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = orderRepository.save(new Order(request));
        
        // Publish local event
        OrderCreatedEvent event = new OrderCreatedEvent(
            order.getId(),
            order.getCustomerId(),
            order.getAmount(),
            LocalDateTime.now()
        );
        
        eventPublisher.publishEvent(event);
        
        // Publish to Kafka
        kafkaTemplate.send("order-events", order.getId(), event);
        
        return order;
    }
}

// Event listener (same service)
@Component
public class OrderEventListener {
    
    @Autowired
    private EmailService emailService;
    
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Order created: {}", event.getOrderId());
        emailService.sendOrderConfirmation(event);
    }
}

// Kafka consumer (different service)
@Service
public class NotificationService {
    
    @KafkaListener(topics = "order-events", groupId = "notification-service")
    public void handleOrderEvent(OrderCreatedEvent event) {
        log.info("Received order event: {}", event.getOrderId());
        sendNotification(event);
    }
    
    @KafkaListener(
        topics = "order-events",
        groupId = "notification-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderEventWithAck(
            OrderCreatedEvent event,
            Acknowledgment acknowledgment) {
        
        try {
            sendNotification(event);
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process event", e);
            // Don't acknowledge, message will be redelivered
        }
    }
}

// Kafka configuration
@Configuration
public class KafkaConfig {
    
    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, 3);
        config.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        return new DefaultKafkaProducerFactory<>(config);
    }
    
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
    
    @Bean
    public ConsumerFactory<String, OrderCreatedEvent> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "notification-service");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        config.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(config);
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderCreatedEvent> 
            kafkaListenerContainerFactory() {
        
        ConcurrentKafkaListenerContainerFactory<String, OrderCreatedEvent> factory =
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        return factory;
    }
}
```

### 3. Distributed Tracing

**Q: Implement distributed tracing with Sleuth and Zipkin**

```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0
  zipkin:
    base-url: http://localhost:9411
    enabled: true
```

```java
@Service
public class OrderService {
    
    @Autowired
    private Tracer tracer;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    public Order createOrder(OrderRequest request) {
        Span span = tracer.nextSpan().name("createOrder").start();
        
        try (Tracer.SpanInScope ws = tracer.withSpan(span)) {
            span.tag("order.customerId", request.getCustomerId());
            span.tag("order.amount", request.getAmount().toString());
            
            // Validate user
            Span userSpan = tracer.nextSpan().name("validateUser").start();
            try (Tracer.SpanInScope userWs = tracer.withSpan(userSpan)) {
                UserDTO user = userServiceClient.getUser(request.getCustomerId());
                userSpan.tag("user.id", user.getId());
            } finally {
                userSpan.end();
            }
            
            // Create order
            Order order = orderRepository.save(new Order(request));
            span.tag("order.id", order.getId());
            
            return order;
            
        } finally {
            span.end();
        }
    }
}
```

---

## Testing

### 1. Unit Testing

**Q: Write comprehensive unit tests**

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void createUser_Success() {
        // Given
        CreateUserRequest request = new CreateUserRequest("john@example.com", "password");
        User user = new User("1", "john@example.com", "encoded");
        
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // When
        UserDTO result = userService.createUser(request);
        
        // Then
        assertNotNull(result);
        assertEquals("john@example.com", result.getEmail());
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password");
    }
    
    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        // Given
        CreateUserRequest request = new CreateUserRequest("john@example.com", "password");
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);
        
        // When & Then
        assertThrows(DuplicateEmailException.class, () -> {
            userService.createUser(request);
        });
        
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void findById_UserExists_ReturnsUser() {
        // Given
        User user = new User("1", "john@example.com", "encoded");
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        
        // When
        Optional<UserDTO> result = userService.findById("1");
        
        // Then
        assertTrue(result.isPresent());
        assertEquals("john@example.com", result.get().getEmail());
    }
    
    @Test
    void findById_UserNotExists_ReturnsEmpty() {
        // Given
        when(userRepository.findById("1")).thenReturn(Optional.empty());
        
        // When
        Optional<UserDTO> result = userService.findById("1");
        
        // Then
        assertFalse(result.isPresent());
    }
}
```

### 2. Integration Testing

**Q: Write integration tests with TestContainers**

```java
@SpringBootTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    
    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7")
        .withExposedPorts(6379);
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", redis::getFirstMappedPort);
    }
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }
    
    @Test
    void createUser_Success() {
        // Given
        CreateUserRequest request = new CreateUserRequest("john@example.com", "password");
        
        // When
        ResponseEntity<UserDTO> response = restTemplate.postForEntity(
            "/api/users",
            request,
            UserDTO.class
        );
        
        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("john@example.com", response.getBody().getEmail());
        
        // Verify in database
        Optional<User> savedUser = userRepository.findByEmail("john@example.com");
        assertTrue(savedUser.isPresent());
    }
    
    @Test
    void getUser_UserExists_ReturnsUser() {
        // Given
        User user = userRepository.save(new User("john@example.com", "encoded"));
        
        // When
        ResponseEntity<UserDTO> response = restTemplate.getForEntity(
            "/api/users/" + user.getId(),
            UserDTO.class
        );
        
        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(user.getId(), response.getBody().getId());
    }
    
    @Test
    void getUser_UserNotExists_Returns404() {
        // When
        ResponseEntity<UserDTO> response = restTemplate.getForEntity(
            "/api/users/nonexistent",
            UserDTO.class
        );
        
        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
```

### 3. Performance Testing

**Q: Write performance tests**

```java
@SpringBootTest
class PerformanceTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void testConcurrentUserCreation() throws InterruptedException {
        int threadCount = 100;
        int requestsPerThread = 10;
        
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < threadCount; i++) {
            final int threadId = i;
            executor.submit(() -> {
                try {
                    for (int j = 0; j < requestsPerThread; j++) {
                        try {
                            CreateUserRequest request = new CreateUserRequest(
                                String.format("user%d_%d@example.com", threadId, j),
                                "password"
                            );
                            userService.createUser(request);
                            successCount.incrementAndGet();
                        } catch (Exception e) {
                            failureCount.incrementAndGet();
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await();
        executor.shutdown();
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;
        
        System.out.println("Total requests: " + (threadCount * requestsPerThread));
        System.out.println("Successful: " + successCount.get());
        System.out.println("Failed: " + failureCount.get());
        System.out.println("Duration: " + duration + "ms");
        System.out.println("Throughput: " + (successCount.get() * 1000.0 / duration) + " req/s");
        
        assertTrue(successCount.get() > 0);
    }
}
```

---

## Design Patterns

### 1. Strategy Pattern

```java
public interface PaymentStrategy {
    PaymentResult process(Payment payment);
}

@Component("creditCard")
public class CreditCardPayment implements PaymentStrategy {
    @Override
    public PaymentResult process(Payment payment) {
        // Process credit card payment
        return PaymentResult.success();
    }
}

@Component("paypal")
public class PayPalPayment implements PaymentStrategy {
    @Override
    public PaymentResult process(Payment payment) {
        // Process PayPal payment
        return PaymentResult.success();
    }
}

@Service
public class PaymentService {
    
    private final Map<String, PaymentStrategy> strategies;
    
    public PaymentService(Map<String, PaymentStrategy> strategies) {
        this.strategies = strategies;
    }
    
    public PaymentResult processPayment(Payment payment) {
        PaymentStrategy strategy = strategies.get(payment.getMethod());
        if (strategy == null) {
            throw new UnsupportedPaymentMethodException();
        }
        return strategy.process(payment);
    }
}
```

### 2. Factory Pattern

```java
public interface NotificationSender {
    void send(String recipient, String message);
}

@Component
public class EmailNotificationSender implements NotificationSender {
    @Override
    public void send(String recipient, String message) {
        // Send email
    }
}

@Component
public class SmsNotificationSender implements NotificationSender {
    @Override
    public void send(String recipient, String message) {
        // Send SMS
    }
}

@Component
public class NotificationFactory {
    
    private final Map<NotificationType, NotificationSender> senders;
    
    public NotificationFactory(List<NotificationSender> senderList) {
        this.senders = new HashMap<>();
        senderList.forEach(sender -> {
            if (sender instanceof EmailNotificationSender) {
                senders.put(NotificationType.EMAIL, sender);
            } else if (sender instanceof SmsNotificationSender) {
                senders.put(NotificationType.SMS, sender);
            }
        });
    }
    
    public NotificationSender getSender(NotificationType type) {
        NotificationSender sender = senders.get(type);
        if (sender == null) {
            throw new UnsupportedNotificationTypeException();
        }
        return sender;
    }
}
```

### 3. Observer Pattern

```java
public interface OrderObserver {
    void onOrderCreated(Order order);
}

@Component
public class EmailNotificationObserver implements OrderObserver {
    @Override
    public void onOrderCreated(Order order) {
        // Send email notification
    }
}

@Component
public class InventoryObserver implements OrderObserver {
    @Override
    public void onOrderCreated(Order order) {
        // Update inventory
    }
}

@Service
public class OrderService {
    
    private final List<OrderObserver> observers;
    
    public OrderService(List<OrderObserver> observers) {
        this.observers = observers;
    }
    
    public Order createOrder(OrderRequest request) {
        Order order = orderRepository.save(new Order(request));
        
        // Notify all observers
        observers.forEach(observer -> observer.onOrderCreated(order));
        
        return order;
    }
}
```

---

## Best Practices

1. **Use constructor injection** for required dependencies
2. **Avoid field injection** - makes testing difficult
3. **Keep controllers thin** - business logic in services
4. **Use DTOs** for API requests/responses
5. **Implement proper exception handling**
6. **Use pagination** for large datasets
7. **Implement caching** strategically
8. **Use async processing** for long-running tasks
9. **Write comprehensive tests**
10. **Monitor and log** effectively

---

## Resources

- [Spring Framework Documentation](https://spring.io/projects/spring-framework)
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Baeldung Spring Tutorials](https://www.baeldung.com/spring-tutorial)
- [Effective Java by Joshua Bloch](https://www.oreilly.com/library/view/effective-java/9780134686097/)

---

## Congratulations!

You're now prepared for senior Java Spring backend interviews with:
✅ Core Java mastery
✅ Spring Framework expertise
✅ Microservices architecture
✅ Performance optimization
✅ Testing strategies
✅ Design patterns
✅ Best practices

**Good luck with your interviews! 🚀**
