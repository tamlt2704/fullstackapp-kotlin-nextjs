# Spring Cloud with Kotlin - Complete Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Service Discovery with Eureka](#service-discovery)
3. [Load Balancing](#load-balancing)
4. [API Gateway](#api-gateway)
5. [Configuration Management](#configuration-management)
6. [Circuit Breaker with Resilience4j](#circuit-breaker)
7. [Security](#security)
8. [Testing](#testing)

---

## Introduction

Spring Cloud provides tools for building distributed systems and microservices. This guide covers implementation with Kotlin, focusing on practical examples and testing strategies.

### Dependencies

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.20"
    kotlin("plugin.spring") version "1.9.20"
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
}

dependencies {
    implementation("org.springframework.cloud:spring-cloud-starter-netflix-eureka-server")
    implementation("org.springframework.cloud:spring-cloud-starter-netflix-eureka-client")
    implementation("org.springframework.cloud:spring-cloud-starter-gateway")
    implementation("org.springframework.cloud:spring-cloud-starter-loadbalancer")
    implementation("org.springframework.cloud:spring-cloud-starter-config")
    implementation("org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.cloud:spring-cloud-contract-wiremock")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("io.mockk:mockk:1.13.8")
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.cloud:spring-cloud-dependencies:2023.0.0")
    }
}
```

---

## Service Discovery

### Eureka Server Setup

```kotlin
// EurekaServerApplication.kt
@SpringBootApplication
@EnableEurekaServer
class EurekaServerApplication

fun main(args: Array<String>) {
    runApplication<EurekaServerApplication>(*args)
}
```

```yaml
# application.yml (Eureka Server)
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false
```

### Eureka Client Configuration

```kotlin
// ServiceApplication.kt
@SpringBootApplication
@EnableDiscoveryClient
class ServiceApplication

fun main(args: Array<String>) {
    runApplication<ServiceApplication>(*args)
}
```

```yaml
# application.yml (Eureka Client)
spring:
  application:
    name: user-service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 30
```

### Service Discovery Client

```kotlin
@Service
class ServiceDiscoveryClient(
    private val discoveryClient: DiscoveryClient
) {
    fun getServiceInstances(serviceName: String): List<ServiceInstance> {
        return discoveryClient.getInstances(serviceName)
    }
    
    fun getAllServices(): List<String> {
        return discoveryClient.services
    }
}
```

---

## Load Balancing

### Spring Cloud LoadBalancer Configuration

```kotlin
@Configuration
class LoadBalancerConfiguration {
    
    @Bean
    @LoadBalanced
    fun restTemplate(): RestTemplate {
        return RestTemplate()
    }
    
    @Bean
    @LoadBalanced
    fun webClientBuilder(): WebClient.Builder {
        return WebClient.builder()
    }
}
```

### Using LoadBalanced RestTemplate

```kotlin
@Service
class UserServiceClient(
    @LoadBalanced private val restTemplate: RestTemplate
) {
    fun getUser(userId: Long): User? {
        return restTemplate.getForObject(
            "http://user-service/api/users/$userId",
            User::class.java
        )
    }
    
    fun createUser(user: User): User? {
        return restTemplate.postForObject(
            "http://user-service/api/users",
            user,
            User::class.java
        )
    }
}
```

### Using LoadBalanced WebClient

```kotlin
@Service
class OrderServiceClient(
    @LoadBalanced private val webClientBuilder: WebClient.Builder
) {
    private val webClient: WebClient = webClientBuilder.build()
    
    suspend fun getOrder(orderId: Long): Order? {
        return webClient.get()
            .uri("http://order-service/api/orders/$orderId")
            .retrieve()
            .awaitBodyOrNull()
    }
    
    suspend fun createOrder(order: Order): Order? {
        return webClient.post()
            .uri("http://order-service/api/orders")
            .bodyValue(order)
            .retrieve()
            .awaitBodyOrNull()
    }
}
```

### Custom Load Balancer Configuration

```kotlin
@Configuration
class CustomLoadBalancerConfiguration {
    
    @Bean
    fun reactorLoadBalancer(
        environment: Environment,
        loadBalancerClientFactory: LoadBalancerClientFactory
    ): ReactorLoadBalancer<ServiceInstance> {
        val name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME)
        return RoundRobinLoadBalancer(
            loadBalancerClientFactory.getLazyProvider(name, ServiceInstanceListSupplier::class.java),
            name
        )
    }
}
```

---

## API Gateway

### Spring Cloud Gateway Setup

```kotlin
@SpringBootApplication
class ApiGatewayApplication

fun main(args: Array<String>) {
    runApplication<ApiGatewayApplication>(*args)
}
```

### Gateway Routes Configuration

```yaml
# application.yml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: userServiceCircuitBreaker
                fallbackUri: forward:/fallback/users
        
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
            - AddRequestHeader=X-Request-Source, gateway
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

### Programmatic Route Configuration

```kotlin
@Configuration
class GatewayRoutesConfig {
    
    @Bean
    fun customRouteLocator(builder: RouteLocatorBuilder): RouteLocator {
        return builder.routes()
            .route("user-service") { r ->
                r.path("/api/users/**")
                    .filters { f ->
                        f.stripPrefix(1)
                            .addRequestHeader("X-Gateway", "true")
                            .circuitBreaker { config ->
                                config.setName("userServiceCB")
                                    .setFallbackUri("forward:/fallback/users")
                            }
                    }
                    .uri("lb://user-service")
            }
            .route("order-service") { r ->
                r.path("/api/orders/**")
                    .and()
                    .method(HttpMethod.GET, HttpMethod.POST)
                    .filters { f ->
                        f.stripPrefix(1)
                            .retry { config ->
                                config.setRetries(3)
                                    .setStatuses(HttpStatus.INTERNAL_SERVER_ERROR)
                            }
                    }
                    .uri("lb://order-service")
            }
            .build()
    }
}
```

### Custom Gateway Filters

```kotlin
@Component
class AuthenticationGatewayFilter : GlobalFilter, Ordered {
    
    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        val token = request.headers.getFirst("Authorization")
        
        if (token.isNullOrBlank()) {
            exchange.response.statusCode = HttpStatus.UNAUTHORIZED
            return exchange.response.setComplete()
        }
        
        return chain.filter(exchange)
    }
    
    override fun getOrder(): Int = -1
}

@Component
class LoggingGatewayFilter : GlobalFilter, Ordered {
    
    private val logger = LoggerFactory.getLogger(LoggingGatewayFilter::class.java)
    
    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val startTime = System.currentTimeMillis()
        
        return chain.filter(exchange).doFinally {
            val duration = System.currentTimeMillis() - startTime
            logger.info("Request: ${exchange.request.method} ${exchange.request.uri} - Duration: ${duration}ms")
        }
    }
    
    override fun getOrder(): Int = 0
}
```

---

## Configuration Management

### Config Server Setup

```kotlin
@SpringBootApplication
@EnableConfigServer
class ConfigServerApplication

fun main(args: Array<String>) {
    runApplication<ConfigServerApplication>(*args)
}
```

```yaml
# application.yml (Config Server)
server:
  port: 8888

spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-org/config-repo
          default-label: main
          search-paths: '{application}'
        native:
          search-locations: classpath:/config
```

### Config Client

```yaml
# bootstrap.yml (Config Client)
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
```

### Refreshable Configuration

```kotlin
@Configuration
@ConfigurationProperties(prefix = "app")
@RefreshScope
data class AppConfig(
    var maxRetries: Int = 3,
    var timeout: Long = 5000,
    var features: Map<String, Boolean> = emptyMap()
)

@RestController
@RefreshScope
class ConfigController(
    private val appConfig: AppConfig
) {
    @GetMapping("/config")
    fun getConfig(): AppConfig = appConfig
}
```

---

## Circuit Breaker

### Resilience4j Configuration

```yaml
# application.yml
resilience4j:
  circuitbreaker:
    instances:
      userService:
        register-health-indicator: true
        sliding-window-size: 10
        minimum-number-of-calls: 5
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
        wait-duration-in-open-state: 5s
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
  
  timelimiter:
    instances:
      userService:
        timeout-duration: 3s
```

### Circuit Breaker Implementation

```kotlin
@Service
class ResilientUserService(
    private val restTemplate: RestTemplate,
    private val circuitBreakerFactory: CircuitBreakerFactory<*, *>
) {
    private val logger = LoggerFactory.getLogger(ResilientUserService::class.java)
    
    fun getUser(userId: Long): User? {
        val circuitBreaker = circuitBreakerFactory.create("userService")
        
        return circuitBreaker.run(
            { fetchUser(userId) },
            { throwable -> handleFallback(userId, throwable) }
        )
    }
    
    private fun fetchUser(userId: Long): User? {
        return restTemplate.getForObject(
            "http://user-service/api/users/$userId",
            User::class.java
        )
    }
    
    private fun handleFallback(userId: Long, throwable: Throwable): User? {
        logger.error("Fallback triggered for user $userId", throwable)
        return User(id = userId, username = "fallback-user", email = "fallback@example.com")
    }
}
```

### Using Annotations

```kotlin
@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val userServiceClient: UserServiceClient
) {
    
    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    @Retry(name = "userService")
    @TimeLimiter(name = "userService")
    fun createOrderWithUser(order: Order): OrderResponse {
        val user = userServiceClient.getUser(order.userId)
            ?: throw UserNotFoundException("User not found")
        
        val savedOrder = orderRepository.save(order)
        return OrderResponse(savedOrder, user)
    }
    
    private fun getUserFallback(order: Order, ex: Exception): OrderResponse {
        val fallbackUser = User(id = order.userId, username = "unknown", email = "unknown@example.com")
        val savedOrder = orderRepository.save(order)
        return OrderResponse(savedOrder, fallbackUser)
    }
}
```

---

## Security

### OAuth2 Resource Server

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig {
    
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http {
            authorizeHttpRequests {
                authorize("/actuator/**", permitAll)
                authorize("/api/public/**", permitAll)
                authorize("/api/users/**", hasRole("USER"))
                authorize("/api/admin/**", hasRole("ADMIN"))
                authorize(anyRequest, authenticated)
            }
            oauth2ResourceServer {
                jwt { }
            }
            csrf { disable() }
        }
        return http.build()
    }
    
    @Bean
    fun jwtDecoder(): JwtDecoder {
        return JwtDecoders.fromIssuerLocation("https://your-auth-server.com")
    }
}
```

### JWT Authentication

```kotlin
@Configuration
class JwtConfig {
    
    @Bean
    fun jwtDecoder(@Value("\${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}") jwkSetUri: String): JwtDecoder {
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build()
    }
    
    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val grantedAuthoritiesConverter = JwtGrantedAuthoritiesConverter().apply {
            setAuthoritiesClaimName("roles")
            setAuthorityPrefix("ROLE_")
        }
        
        return JwtAuthenticationConverter().apply {
            setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter)
        }
    }
}
```

### Service-to-Service Authentication

```kotlin
@Configuration
class ServiceAuthConfig {
    
    @Bean
    fun oauth2RestTemplate(
        @Value("\${security.oauth2.client.client-id}") clientId: String,
        @Value("\${security.oauth2.client.client-secret}") clientSecret: String,
        @Value("\${security.oauth2.client.access-token-uri}") tokenUri: String
    ): RestTemplate {
        val restTemplate = RestTemplate()
        
        restTemplate.interceptors.add { request, body, execution ->
            val token = getClientCredentialsToken(clientId, clientSecret, tokenUri)
            request.headers.setBearerAuth(token)
            execution.execute(request, body)
        }
        
        return restTemplate
    }
    
    private fun getClientCredentialsToken(clientId: String, clientSecret: String, tokenUri: String): String {
        // Implementation to fetch token using client credentials
        return "access_token"
    }
}
```

### Method Security

```kotlin
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
class MethodSecurityConfig

@Service
class SecureUserService(
    private val userRepository: UserRepository
) {
    
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteUser(userId: Long) {
        userRepository.deleteById(userId)
    }
    
    @PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
    fun updateUser(userId: Long, user: User): User {
        return userRepository.save(user)
    }
    
    @PostAuthorize("returnObject.username == authentication.principal.username or hasRole('ADMIN')")
    fun getUserDetails(userId: Long): User {
        return userRepository.findById(userId).orElseThrow()
    }
}
```

---

## Testing

### WebMvcTest for Controllers

```kotlin
@WebMvcTest(UserController::class)
class UserControllerTest {
    
    @Autowired
    private lateinit var mockMvc: MockMvc
    
    @MockkBean
    private lateinit var userService: UserService
    
    @Test
    fun `should return user when user exists`() {
        val user = User(id = 1, username = "testuser", email = "test@example.com")
        every { userService.getUser(1) } returns user
        
        mockMvc.get("/api/users/1")
            .andExpect {
                status { isOk() }
                content { contentType(MediaType.APPLICATION_JSON) }
                jsonPath("$.id") { value(1) }
                jsonPath("$.username") { value("testuser") }
            }
        
        verify { userService.getUser(1) }
    }
    
    @Test
    fun `should return 404 when user not found`() {
        every { userService.getUser(999) } throws UserNotFoundException("User not found")
        
        mockMvc.get("/api/users/999")
            .andExpect {
                status { isNotFound() }
            }
    }
}
```

### WireMock for External Services

```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWireMock(port = 0)
class UserServiceClientTest {
    
    @Autowired
    private lateinit var userServiceClient: UserServiceClient
    
    @Test
    fun `should fetch user from external service`() {
        stubFor(
            get(urlEqualTo("/api/users/1"))
                .willReturn(
                    aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                            {
                                "id": 1,
                                "username": "testuser",
                                "email": "test@example.com"
                            }
                        """.trimIndent())
                )
        )
        
        val user = userServiceClient.getUser(1)
        
        assertThat(user).isNotNull
        assertThat(user?.username).isEqualTo("testuser")
        
        verify(getRequestedFor(urlEqualTo("/api/users/1")))
    }
    
    @Test
    fun `should handle service unavailable`() {
        stubFor(
            get(urlEqualTo("/api/users/1"))
                .willReturn(
                    aResponse()
                        .withStatus(503)
                )
        )
        
        assertThrows<ServiceUnavailableException> {
            userServiceClient.getUser(1)
        }
    }
}
```

### Testing Circuit Breaker

```kotlin
@SpringBootTest
class CircuitBreakerTest {
    
    @Autowired
    private lateinit var resilientUserService: ResilientUserService
    
    @Autowired
    private lateinit var circuitBreakerRegistry: CircuitBreakerRegistry
    
    @MockkBean
    private lateinit var restTemplate: RestTemplate
    
    @Test
    fun `circuit breaker should open after failures`() {
        val circuitBreaker = circuitBreakerRegistry.circuitBreaker("userService")
        
        every { restTemplate.getForObject(any<String>(), User::class.java) } throws RuntimeException("Service down")
        
        repeat(10) {
            resilientUserService.getUser(1)
        }
        
        assertThat(circuitBreaker.state).isEqualTo(CircuitBreaker.State.OPEN)
    }
    
    @Test
    fun `should use fallback when circuit is open`() {
        every { restTemplate.getForObject(any<String>(), User::class.java) } throws RuntimeException("Service down")
        
        val user = resilientUserService.getUser(1)
        
        assertThat(user?.username).isEqualTo("fallback-user")
    }
}
```

### Testing Load Balancer

```kotlin
@SpringBootTest
@AutoConfigureWireMock(port = 0)
class LoadBalancerTest {
    
    @Autowired
    private lateinit var loadBalancerClient: LoadBalancerClient
    
    @Test
    fun `should distribute requests across instances`() {
        val serviceName = "user-service"
        val instances = mutableSetOf<String>()
        
        repeat(10) {
            val instance = loadBalancerClient.choose(serviceName)
            instances.add(instance.uri.toString())
        }
        
        assertThat(instances.size).isGreaterThan(1)
    }
}
```

### Testing Gateway Routes

```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWireMock(port = 0)
class GatewayRoutesTest {
    
    @Autowired
    private lateinit var webTestClient: WebTestClient
    
    @Test
    fun `should route to user service`() {
        stubFor(
            get(urlEqualTo("/users/1"))
                .willReturn(
                    aResponse()
                        .withStatus(200)
                        .withBody("""{"id":1,"username":"test"}""")
                )
        )
        
        webTestClient.get()
            .uri("/api/users/1")
            .exchange()
            .expectStatus().isOk
            .expectBody()
            .jsonPath("$.username").isEqualTo("test")
    }
    
    @Test
    fun `should apply rate limiting`() {
        repeat(25) {
            webTestClient.get()
                .uri("/api/users/1")
                .exchange()
        }
        
        webTestClient.get()
            .uri("/api/users/1")
            .exchange()
            .expectStatus().isEqualTo(HttpStatus.TOO_MANY_REQUESTS)
    }
}
```

### Testing Security

```kotlin
@WebMvcTest(UserController::class)
@Import(SecurityConfig::class)
class SecurityTest {
    
    @Autowired
    private lateinit var mockMvc: MockMvc
    
    @MockkBean
    private lateinit var userService: UserService
    
    @Test
    @WithMockUser(roles = ["USER"])
    fun `should allow access with USER role`() {
        every { userService.getUser(1) } returns User(1, "test", "test@example.com")
        
        mockMvc.get("/api/users/1")
            .andExpect {
                status { isOk() }
            }
    }
    
    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `should allow delete with ADMIN role`() {
        every { userService.deleteUser(1) } just Runs
        
        mockMvc.delete("/api/users/1")
            .andExpect {
                status { isNoContent() }
            }
    }
    
    @Test
    fun `should deny access without authentication`() {
        mockMvc.get("/api/users/1")
            .andExpect {
                status { isUnauthorized() }
            }
    }
}
```

### Integration Testing with Testcontainers

```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class IntegrationTest {
    
    companion object {
        @Container
        val postgres = PostgreSQLContainer<Nothing>("postgres:15-alpine").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
        }
        
        @Container
        val redis = GenericContainer<Nothing>("redis:7-alpine").apply {
            withExposedPorts(6379)
        }
    }
    
    @DynamicPropertySource
    @JvmStatic
    fun properties(registry: DynamicPropertyRegistry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl)
        registry.add("spring.datasource.username", postgres::getUsername)
        registry.add("spring.datasource.password", postgres::getPassword)
        registry.add("spring.redis.host", redis::getHost)
        registry.add("spring.redis.port", redis::getFirstMappedPort)
    }
    
    @Autowired
    private lateinit var webTestClient: WebTestClient
    
    @Test
    fun `full integration test`() {
        webTestClient.post()
            .uri("/api/users")
            .bodyValue(User(username = "newuser", email = "new@example.com"))
            .exchange()
            .expectStatus().isCreated
            .expectBody()
            .jsonPath("$.id").exists()
    }
}
```

---

## Best Practices

### 1. Health Checks and Monitoring

```kotlin
@Component
class CustomHealthIndicator : HealthIndicator {
    override fun health(): Health {
        val isHealthy = checkExternalService()
        return if (isHealthy) {
            Health.up().withDetail("service", "available").build()
        } else {
            Health.down().withDetail("service", "unavailable").build()
        }
    }
    
    private fun checkExternalService(): Boolean = true
}
```

### 2. Distributed Tracing

```yaml
management:
  tracing:
    sampling:
      probability: 1.0
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
```

### 3. Graceful Shutdown

```yaml
server:
  shutdown: graceful

spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
```

### 4. Retry and Timeout Configuration

```kotlin
@Configuration
class RestTemplateConfig {
    
    @Bean
    fun restTemplate(): RestTemplate {
        val factory = HttpComponentsClientHttpRequestFactory().apply {
            setConnectTimeout(5000)
            setReadTimeout(5000)
        }
        return RestTemplate(factory)
    }
}
```

---

## Conclusion

This guide covers the essential aspects of building microservices with Spring Cloud and Kotlin, including service discovery, load balancing, API gateway, circuit breakers, security, and comprehensive testing strategies. Each component can be customized based on specific requirements.
