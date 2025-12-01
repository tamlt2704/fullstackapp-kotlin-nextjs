---
title: "Spring Testing - Advanced Techniques Guide"
date: "2024-12-01"
category: "Testing"
tags: ["Spring", "Testing", "JUnit", "Mockito", "Integration Testing"]
---

# Spring Testing - Advanced Techniques Guide

## Table of Contents
- [Introduction](#introduction)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Testing with Real Database](#testing-with-real-database)
- [Slice Testing](#slice-testing)
- [Advanced JUnit Techniques](#advanced-junit-techniques)
- [Mocking Strategies](#mocking-strategies)
- [Performance Testing](#performance-testing)
- [Best Practices](#best-practices)

---

## Introduction

### Testing Pyramid in Spring

```
        /\
       /E2E\
      /------\
     /Integration\
    /------------\
   /  Unit Tests  \
  /----------------\
```

**Layers:**
- **Unit Tests**: 70% - Fast, isolated
- **Integration Tests**: 20% - Component interaction
- **E2E Tests**: 10% - Full application flow

### Spring Test Dependencies

**Maven:**
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

**Gradle (Kotlin):**
```kotlin
dependencies {
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.testcontainers:postgresql:1.19.3")
    testImplementation("io.rest-assured:rest-assured")
}
```

---

## Unit Testing

### Testing Service Layer Without Context

**Service Class:**
```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
    private val emailService: EmailService
) {
    fun createUser(request: CreateUserRequest): User {
        if (userRepository.existsByEmail(request.email)) {
            throw UserAlreadyExistsException()
        }
        
        val user = User(
            email = request.email,
            name = request.name,
            password = passwordEncoder.encode(request.password)
        )
        
        val saved = userRepository.save(user)
        emailService.sendWelcomeEmail(saved.email)
        return saved
    }
    
    fun getUserById(id: Long): User {
        return userRepository.findById(id)
            .orElseThrow { UserNotFoundException(id) }
    }
}
```

**Pure Unit Test (No Spring Context):**
```kotlin
class UserServiceTest {
    
    private lateinit var userRepository: UserRepository
    private lateinit var emailService: EmailService
    private lateinit var userService: UserService
    
    @BeforeEach
    fun setup() {
        userRepository = mock()
        emailService = mock()
        userService = UserService(userRepository, emailService)
    }
    
    @Test
    fun `should create user successfully`() {
        // Given
        val request = CreateUserRequest("test@example.com", "Test User", "password")
        val user = User(1L, "test@example.com", "Test User", "encoded")
        
        whenever(userRepository.existsByEmail(request.email)).thenReturn(false)
        whenever(userRepository.save(any())).thenReturn(user)
        
        // When
        val result = userService.createUser(request)
        
        // Then
        assertThat(result.email).isEqualTo("test@example.com")
        verify(emailService).sendWelcomeEmail("test@example.com")
    }
    
    @Test
    fun `should throw exception when user exists`() {
        // Given
        val request = CreateUserRequest("test@example.com", "Test", "pass")
        whenever(userRepository.existsByEmail(request.email)).thenReturn(true)
        
        // When & Then
        assertThrows<UserAlreadyExistsException> {
            userService.createUser(request)
        }
        verify(userRepository, never()).save(any())
    }
}
```

### Testing with MockK (Kotlin)

```kotlin
class UserServiceMockKTest {
    
    private val userRepository = mockk<UserRepository>()
    private val emailService = mockk<EmailService>()
    private val userService = UserService(userRepository, emailService)
    
    @Test
    fun `should create user with relaxed mocks`() {
        // Given
        val request = CreateUserRequest("test@example.com", "Test", "pass")
        val user = User(1L, "test@example.com", "Test", "encoded")
        
        every { userRepository.existsByEmail(any()) } returns false
        every { userRepository.save(any()) } returns user
        every { emailService.sendWelcomeEmail(any()) } just Runs
        
        // When
        val result = userService.createUser(request)
        
        // Then
        assertThat(result.email).isEqualTo("test@example.com")
        verify { emailService.sendWelcomeEmail("test@example.com") }
    }
    
    @Test
    fun `should verify call order`() {
        // Given
        val request = CreateUserRequest("test@example.com", "Test", "pass")
        val user = User(1L, "test@example.com", "Test", "encoded")
        
        every { userRepository.existsByEmail(any()) } returns false
        every { userRepository.save(any()) } returns user
        every { emailService.sendWelcomeEmail(any()) } just Runs
        
        // When
        userService.createUser(request)
        
        // Then
        verifyOrder {
            userRepository.existsByEmail(any())
            userRepository.save(any())
            emailService.sendWelcomeEmail(any())
        }
    }
}
```

### ArgumentCaptor Pattern

```kotlin
@Test
fun `should save user with correct data`() {
    // Given
    val request = CreateUserRequest("test@example.com", "Test User", "password")
    val captor = argumentCaptor<User>()
    
    whenever(userRepository.existsByEmail(any())).thenReturn(false)
    whenever(userRepository.save(captor.capture())).thenReturn(User())
    
    // When
    userService.createUser(request)
    
    // Then
    val savedUser = captor.firstValue
    assertThat(savedUser.email).isEqualTo("test@example.com")
    assertThat(savedUser.name).isEqualTo("Test User")
    assertThat(savedUser.password).isNotEqualTo("password") // Should be encoded
}
```

---

## Integration Testing

### Testing with Minimal Context

**@WebMvcTest - Controller Layer Only:**
```kotlin
@WebMvcTest(UserController::class)
class UserControllerTest {
    
    @Autowired
    private lateinit var mockMvc: MockMvc
    
    @MockBean
    private lateinit var userService: UserService
    
    @Test
    fun `should create user via REST API`() {
        // Given
        val request = CreateUserRequest("test@example.com", "Test", "pass")
        val user = User(1L, "test@example.com", "Test", "encoded")
        
        whenever(userService.createUser(any())).thenReturn(user)
        
        // When & Then
        mockMvc.perform(
            post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("test@example.com"))
    }
    
    @Test
    fun `should return 400 for invalid request`() {
        // Given
        val invalidRequest = CreateUserRequest("", "", "")
        
        // When & Then
        mockMvc.perform(
            post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
        )
            .andExpect(status().isBadRequest)
    }
}
```

### @DataJpaTest - Repository Layer Only

```kotlin
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {
    
    @Autowired
    private lateinit var userRepository: UserRepository
    
    @Autowired
    private lateinit var entityManager: TestEntityManager
    
    @Test
    fun `should find user by email`() {
        // Given
        val user = User(email = "test@example.com", name = "Test", password = "pass")
        entityManager.persist(user)
        entityManager.flush()
        
        // When
        val found = userRepository.findByEmail("test@example.com")
        
        // Then
        assertThat(found).isNotNull
        assertThat(found?.name).isEqualTo("Test")
    }
    
    @Test
    fun `should check if user exists by email`() {
        // Given
        val user = User(email = "test@example.com", name = "Test", password = "pass")
        entityManager.persist(user)
        entityManager.flush()
        
        // When
        val exists = userRepository.existsByEmail("test@example.com")
        
        // Then
        assertThat(exists).isTrue()
    }
}
```

---

## Testing with Real Database

### Testcontainers - PostgreSQL

```kotlin
@SpringBootTest
@Testcontainers
class UserIntegrationTest {
    
    companion object {
        @Container
        val postgres = PostgreSQLContainer<Nothing>("postgres:15-alpine").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
        }
        
        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
        }
    }
    
    @Autowired
    private lateinit var userRepository: UserRepository
    
    @Autowired
    private lateinit var userService: UserService
    
    @Test
    fun `should persist and retrieve user from real database`() {
        // Given
        val request = CreateUserRequest("test@example.com", "Test User", "password")
        
        // When
        val created = userService.createUser(request)
        val retrieved = userService.getUserById(created.id!!)
        
        // Then
        assertThat(retrieved.email).isEqualTo("test@example.com")
        assertThat(retrieved.name).isEqualTo("Test User")
    }
}
```

### Reusable Testcontainers Configuration

```kotlin
@TestConfiguration
class TestcontainersConfiguration {
    
    companion object {
        @Container
        val postgres = PostgreSQLContainer<Nothing>("postgres:15-alpine").apply {
            withDatabaseName("testdb")
            withUsername("test")
            withPassword("test")
            withReuse(true)
        }
        
        @Container
        val redis = GenericContainer<Nothing>("redis:7-alpine").apply {
            withExposedPorts(6379)
            withReuse(true)
        }
        
        init {
            postgres.start()
            redis.start()
        }
    }
    
    @Bean
    fun dataSource(): DataSource {
        return HikariDataSource().apply {
            jdbcUrl = postgres.jdbcUrl
            username = postgres.username
            password = postgres.password
        }
    }
}
```

### H2 In-Memory Database

```kotlin
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestPropertySource(properties = [
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
])
class UserRepositoryH2Test {
    
    @Autowired
    private lateinit var userRepository: UserRepository
    
    @Test
    fun `should work with H2 database`() {
        // Given
        val user = User(email = "test@example.com", name = "Test", password = "pass")
        
        // When
        val saved = userRepository.save(user)
        val found = userRepository.findById(saved.id!!)
        
        // Then
        assertThat(found).isPresent
        assertThat(found.get().email).isEqualTo("test@example.com")
    }
}
```

### Database Cleanup Strategies

```kotlin
@SpringBootTest
@Testcontainers
class DatabaseCleanupTest {
    
    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate
    
    @BeforeEach
    fun cleanup() {
        jdbcTemplate.execute("TRUNCATE TABLE users CASCADE")
        jdbcTemplate.execute("ALTER SEQUENCE users_id_seq RESTART WITH 1")
    }
    
    @Test
    fun `test with clean database`() {
        // Test runs with empty database
    }
}
```

**Using @Sql Annotation:**
```kotlin
@SpringBootTest
@Sql(scripts = ["/cleanup.sql"], executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(scripts = ["/test-data.sql"], executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class UserServiceIntegrationTest {
    
    @Test
    fun `test with predefined data`() {
        // Database has test data from test-data.sql
    }
}
```

---

## Slice Testing

### @WebMvcTest - Web Layer

```kotlin
@WebMvcTest(UserController::class)
@Import(SecurityConfig::class)
class UserControllerSliceTest {
    
    @Autowired
    private lateinit var mockMvc: MockMvc
    
    @MockBean
    private lateinit var userService: UserService
    
    @Test
    @WithMockUser(roles = ["ADMIN"])
    fun `should allow admin to delete user`() {
        // Given
        doNothing().whenever(userService).deleteUser(1L)
        
        // When & Then
        mockMvc.perform(delete("/api/users/1"))
            .andExpect(status().isNoContent)
    }
    
    @Test
    @WithMockUser(roles = ["USER"])
    fun `should forbid regular user from deleting`() {
        mockMvc.perform(delete("/api/users/1"))
            .andExpect(status().isForbidden)
    }
}
```

### @JsonTest - JSON Serialization

```kotlin
@JsonTest
class UserJsonTest {
    
    @Autowired
    private lateinit var json: JacksonTester<User>
    
    @Test
    fun `should serialize user to JSON`() {
        // Given
        val user = User(1L, "test@example.com", "Test User", "pass")
        
        // When
        val result = json.write(user)
        
        // Then
        assertThat(result).hasJsonPathNumberValue("$.id", 1)
        assertThat(result).hasJsonPathStringValue("$.email", "test@example.com")
        assertThat(result).doesNotHaveJsonPath("$.password") // Should be excluded
    }
    
    @Test
    fun `should deserialize JSON to user`() {
        // Given
        val content = """{"email":"test@example.com","name":"Test"}"""
        
        // When
        val user = json.parse(content).`object`
        
        // Then
        assertThat(user.email).isEqualTo("test@example.com")
        assertThat(user.name).isEqualTo("Test")
    }
}
```

### @RestClientTest - REST Client Testing

```kotlin
@RestClientTest(ExternalApiClient::class)
class ExternalApiClientTest {
    
    @Autowired
    private lateinit var client: ExternalApiClient
    
    @Autowired
    private lateinit var mockServer: MockRestServiceServer
    
    @Test
    fun `should call external API`() {
        // Given
        mockServer.expect(requestTo("/api/users/1"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(
                withSuccess(
                    """{"id":1,"name":"External User"}""",
                    MediaType.APPLICATION_JSON
                )
            )
        
        // When
        val user = client.getUser(1L)
        
        // Then
        assertThat(user.name).isEqualTo("External User")
        mockServer.verify()
    }
}
```

---

## Advanced JUnit Techniques

### Parameterized Tests

```kotlin
class ParameterizedTestExamples {
    
    @ParameterizedTest
    @ValueSource(strings = ["test@example.com", "user@domain.com", "admin@test.org"])
    fun `should validate email formats`(email: String) {
        assertThat(EmailValidator.isValid(email)).isTrue()
    }
    
    @ParameterizedTest
    @CsvSource(
        "test@example.com, Test User, true",
        "invalid-email, Test User, false",
        "test@example.com, '', false"
    )
    fun `should validate user creation request`(
        email: String,
        name: String,
        expected: Boolean
    ) {
        val request = CreateUserRequest(email, name, "password")
        assertThat(request.isValid()).isEqualTo(expected)
    }
    
    @ParameterizedTest
    @MethodSource("userProvider")
    fun `should process different user types`(user: User) {
        assertThat(userService.processUser(user)).isNotNull()
    }
    
    companion object {
        @JvmStatic
        fun userProvider() = listOf(
            User(1L, "admin@test.com", "Admin", "pass", Role.ADMIN),
            User(2L, "user@test.com", "User", "pass", Role.USER),
            User(3L, "guest@test.com", "Guest", "pass", Role.GUEST)
        )
    }
}
```

### Dynamic Tests

```kotlin
class DynamicTestExamples {
    
    @TestFactory
    fun `dynamic tests for user validation`(): Collection<DynamicTest> {
        val testCases = listOf(
            "valid@email.com" to true,
            "invalid-email" to false,
            "test@" to false,
            "@example.com" to false
        )
        
        return testCases.map { (email, expected) ->
            DynamicTest.dynamicTest("Validate $email") {
                assertThat(EmailValidator.isValid(email)).isEqualTo(expected)
            }
        }
    }
}
```

### Nested Tests

```kotlin
@DisplayName("User Service Tests")
class UserServiceNestedTest {
    
    private lateinit var userService: UserService
    private lateinit var userRepository: UserRepository
    
    @BeforeEach
    fun setup() {
        userRepository = mock()
        userService = UserService(userRepository)
    }
    
    @Nested
    @DisplayName("When creating user")
    inner class CreateUser {
        
        @Test
        fun `should create user with valid data`() {
            // Test implementation
        }
        
        @Test
        fun `should throw exception for duplicate email`() {
            // Test implementation
        }
        
        @Nested
        @DisplayName("With invalid data")
        inner class InvalidData {
            
            @Test
            fun `should reject empty email`() {
                // Test implementation
            }
            
            @Test
            fun `should reject short password`() {
                // Test implementation
            }
        }
    }
    
    @Nested
    @DisplayName("When retrieving user")
    inner class GetUser {
        
        @Test
        fun `should return user by id`() {
            // Test implementation
        }
        
        @Test
        fun `should throw exception for non-existent user`() {
            // Test implementation
        }
    }
}
```

### Custom Annotations

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
annotation class IntegrationTest

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@Test
@Sql(scripts = ["/cleanup.sql"], executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
annotation class CleanDatabase

// Usage
@IntegrationTest
class UserIntegrationTest {
    
    @CleanDatabase
    fun `test with clean database`() {
        // Test implementation
    }
}
```

### Test Execution Order

```kotlin
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class OrderedTestExamples {
    
    @Test
    @Order(1)
    fun `first test - setup data`() {
        // Runs first
    }
    
    @Test
    @Order(2)
    fun `second test - use data`() {
        // Runs second
    }
    
    @Test
    @Order(3)
    fun `third test - cleanup`() {
        // Runs third
    }
}
```

---

## Mocking Strategies

### Spy vs Mock

```kotlin
class SpyVsMockTest {
    
    @Test
    fun `mock - all methods stubbed`() {
        val userService = mock<UserService>()
        
        // Returns null by default
        assertThat(userService.getUserById(1L)).isNull()
        
        // Must stub explicitly
        whenever(userService.getUserById(1L)).thenReturn(User())
        assertThat(userService.getUserById(1L)).isNotNull()
    }
    
    @Test
    fun `spy - real methods called unless stubbed`() {
        val userService = spy(UserService(mock(), mock()))
        
        // Calls real method (may throw exception)
        // userService.getUserById(1L)
        
        // Stub specific method
        doReturn(User()).whenever(userService).getUserById(1L)
        assertThat(userService.getUserById(1L)).isNotNull()
    }
}
```

### @MockBean vs @SpyBean

```kotlin
@SpringBootTest
class MockBeanVsSpyBeanTest {
    
    @MockBean
    private lateinit var emailService: EmailService
    
    @SpyBean
    private lateinit var userService: UserService
    
    @Test
    fun `mockBean replaces bean in context`() {
        // emailService is completely mocked
        whenever(emailService.sendEmail(any())).thenReturn(true)
    }
    
    @Test
    fun `spyBean wraps real bean`() {
        // userService uses real implementation
        // but can be stubbed for specific methods
        doReturn(User()).whenever(userService).getUserById(1L)
    }
}
```

### Partial Mocking

```kotlin
@Test
fun `should partially mock service`() {
    val userService = mock<UserService> {
        on { getUserById(any()) } doReturn User()
        on { getAllUsers() } doCallRealMethod()
    }
    
    // Mocked method
    assertThat(userService.getUserById(1L)).isNotNull()
    
    // Real method called
    // userService.getAllUsers()
}
```

---

## Performance Testing

### @Timed Tests

```kotlin
class PerformanceTest {
    
    @Test
    @Timeout(value = 1, unit = TimeUnit.SECONDS)
    fun `should complete within 1 second`() {
        // Test must complete in 1 second
        userService.processLargeDataset()
    }
    
    @Test
    fun `should measure execution time`() {
        val start = System.currentTimeMillis()
        
        userService.complexOperation()
        
        val duration = System.currentTimeMillis() - start
        assertThat(duration).isLessThan(500)
    }
}
```

### Load Testing with JMeter

```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LoadTest {
    
    @LocalServerPort
    private var port: Int = 0
    
    @Test
    fun `should handle concurrent requests`() {
        val executor = Executors.newFixedThreadPool(10)
        val futures = (1..100).map {
            executor.submit {
                RestAssured.given()
                    .port(port)
                    .get("/api/users")
                    .then()
                    .statusCode(200)
            }
        }
        
        futures.forEach { it.get() }
        executor.shutdown()
    }
}
```

---

## Best Practices

### Test Naming Conventions

```kotlin
class TestNamingExamples {
    
    // Given-When-Then pattern
    @Test
    fun `given valid user when creating then should return saved user`() {}
    
    // Should pattern
    @Test
    fun `should create user with valid data`() {}
    
    // Behavior pattern
    @Test
    fun `createUser throws exception when email exists`() {}
}
```

### Test Data Builders

```kotlin
class UserBuilder {
    private var id: Long? = null
    private var email: String = "test@example.com"
    private var name: String = "Test User"
    private var password: String = "password"
    private var role: Role = Role.USER
    
    fun withId(id: Long) = apply { this.id = id }
    fun withEmail(email: String) = apply { this.email = email }
    fun withName(name: String) = apply { this.name = name }
    fun withRole(role: Role) = apply { this.role = role }
    
    fun build() = User(id, email, name, password, role)
}

// Usage
@Test
fun `test with builder`() {
    val user = UserBuilder()
        .withEmail("admin@test.com")
        .withRole(Role.ADMIN)
        .build()
    
    assertThat(user.role).isEqualTo(Role.ADMIN)
}
```

### Test Fixtures

```kotlin
@TestConfiguration
class TestFixtures {
    
    @Bean
    fun testUsers(): List<User> = listOf(
        User(1L, "user1@test.com", "User 1", "pass", Role.USER),
        User(2L, "user2@test.com", "User 2", "pass", Role.USER),
        User(3L, "admin@test.com", "Admin", "pass", Role.ADMIN)
    )
}
```

### Assertion Libraries

```kotlin
class AssertionExamples {
    
    @Test
    fun `assertJ assertions`() {
        val user = User(1L, "test@example.com", "Test", "pass")
        
        assertThat(user)
            .isNotNull
            .extracting("email", "name")
            .containsExactly("test@example.com", "Test")
        
        assertThat(user.email)
            .isNotBlank()
            .contains("@")
            .endsWith(".com")
    }
    
    @Test
    fun `kotest assertions`() {
        val user = User(1L, "test@example.com", "Test", "pass")
        
        user.email shouldNotBe null
        user.email shouldContain "@"
        user.role shouldBeIn listOf(Role.USER, Role.ADMIN)
    }
}
```

---

## Summary

### Key Concepts

**Unit Testing:**
- ✅ Test in isolation without Spring context
- ✅ Use mocks for dependencies
- ✅ Fast execution (< 100ms per test)

**Integration Testing:**
- ✅ Test component interactions
- ✅ Use real or test databases
- ✅ Slice tests for specific layers

**Advanced Techniques:**
- ✅ Testcontainers for real databases
- ✅ Parameterized and dynamic tests
- ✅ Custom test annotations
- ✅ Performance testing

### Testing Checklist

- [ ] Unit tests for business logic
- [ ] Integration tests for repositories
- [ ] Controller tests with MockMvc
- [ ] Security tests with @WithMockUser
- [ ] Database tests with Testcontainers
- [ ] Performance tests for critical paths
- [ ] Test coverage > 80%

### Resources

- Spring Testing Docs: https://docs.spring.io/spring-framework/reference/testing.html
- Testcontainers: https://www.testcontainers.org/
- AssertJ: https://assertj.github.io/doc/
- MockK: https://mockk.io/

**Master Spring Testing for production-ready applications!** 🚀
