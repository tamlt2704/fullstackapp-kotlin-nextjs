---
title: "Kotlin - Complete Mastery Guide"
date: "2024-12-13"
category: "Programming"
tags: ["Kotlin", "JVM", "Android", "Spring Boot", "Backend", "Mastery"]
---

# Kotlin - Complete Mastery Guide

## Overview

**Kotlin** is a modern, statically-typed programming language that runs on the JVM, designed for conciseness, safety, and interoperability with Java.

### Key Features
- **Null Safety**: Built-in null safety prevents NPEs
- **Concise**: 40% less code than Java
- **Interoperable**: 100% compatible with Java
- **Coroutines**: First-class async programming support
- **Multiplatform**: JVM, Android, JS, Native

---

## Core Language Features

### 1. Null Safety

```kotlin
// Nullable vs Non-nullable
var name: String = "Kotlin"  // Cannot be null
var nullableName: String? = null  // Can be null

// Safe call operator
val length = nullableName?.length  // Returns null if nullableName is null

// Elvis operator
val len = nullableName?.length ?: 0  // Returns 0 if null

// Not-null assertion
val forceLength = nullableName!!.length  // Throws NPE if null

// Safe casting
val result = value as? String  // Returns null if cast fails
```

### 2. Data Classes

```kotlin
// Automatic equals(), hashCode(), toString(), copy()
data class User(
    val id: Long,
    val name: String,
    val email: String,
    val age: Int = 18  // Default parameter
)

// Usage
val user = User(1, "Alice", "alice@example.com")
val updatedUser = user.copy(age = 25)  // Immutable update
val (id, name, email, age) = user  // Destructuring
```

### 3. Extension Functions

```kotlin
// Add methods to existing classes without inheritance
fun String.isPalindrome(): Boolean {
    return this == this.reversed()
}

fun <T> List<T>.secondOrNull(): T? {
    return if (this.size >= 2) this[1] else null
}

// Usage
"racecar".isPalindrome()  // true
listOf(1, 2, 3).secondOrNull()  // 2
```

### 4. Higher-Order Functions

```kotlin
// Functions as parameters
fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {
    val result = mutableListOf<T>()
    for (item in this) {
        if (predicate(item)) result.add(item)
    }
    return result
}

// Lambda expressions
val numbers = listOf(1, 2, 3, 4, 5)
val evens = numbers.filter { it % 2 == 0 }  // [2, 4]
val doubled = numbers.map { it * 2 }  // [2, 4, 6, 8, 10]

// Function types
val operation: (Int, Int) -> Int = { a, b -> a + b }
val result = operation(5, 3)  // 8
```

### 5. Sealed Classes

```kotlin
// Restricted class hierarchies
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val message: String) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// Exhaustive when expressions
fun <T> handleResult(result: Result<T>) {
    when (result) {
        is Result.Success -> println("Data: ${result.data}")
        is Result.Error -> println("Error: ${result.message}")
        Result.Loading -> println("Loading...")
    }  // Compiler ensures all cases are covered
}
```

### 6. Coroutines

```kotlin
import kotlinx.coroutines.*

// Suspend functions
suspend fun fetchUser(id: Long): User {
    delay(1000)  // Non-blocking delay
    return User(id, "Alice", "alice@example.com")
}

// Launch coroutines
fun main() = runBlocking {
    // Sequential execution
    val user1 = fetchUser(1)
    val user2 = fetchUser(2)
    
    // Concurrent execution
    val deferred1 = async { fetchUser(1) }
    val deferred2 = async { fetchUser(2) }
    val users = listOf(deferred1.await(), deferred2.await())
    
    // Structured concurrency
    coroutineScope {
        launch { println("Task 1") }
        launch { println("Task 2") }
    }  // Waits for all children to complete
}
```

### 7. Delegation

```kotlin
// Property delegation
class User {
    var name: String by Delegates.observable("Initial") { prop, old, new ->
        println("$old -> $new")
    }
    
    val lazyValue: String by lazy {
        println("Computed once")
        "Hello"
    }
}

// Class delegation
interface Repository {
    fun save(data: String)
}

class DatabaseRepository : Repository {
    override fun save(data: String) = println("Saving to DB: $data")
}

class CachedRepository(
    private val repo: Repository
) : Repository by repo  // Delegates all methods to repo
```

### 8. Inline Functions

```kotlin
// Avoid lambda overhead
inline fun <T> measureTime(block: () -> T): T {
    val start = System.currentTimeMillis()
    val result = block()
    println("Time: ${System.currentTimeMillis() - start}ms")
    return result
}

// Reified type parameters
inline fun <reified T> isInstance(value: Any): Boolean {
    return value is T  // Type information preserved at runtime
}

// Usage
val result = measureTime {
    Thread.sleep(100)
    "Done"
}
```

---

## Advanced Patterns

### 1. Builder Pattern with DSL

```kotlin
// Type-safe builders
class HTML {
    private val elements = mutableListOf<String>()
    
    fun head(init: Head.() -> Unit) {
        val head = Head()
        head.init()
        elements.add(head.toString())
    }
    
    fun body(init: Body.() -> Unit) {
        val body = Body()
        body.init()
        elements.add(body.toString())
    }
    
    override fun toString() = "<html>${elements.joinToString("")}</html>"
}

class Head {
    var title: String = ""
    override fun toString() = "<head><title>$title</title></head>"
}

class Body {
    private val content = mutableListOf<String>()
    
    fun h1(text: String) {
        content.add("<h1>$text</h1>")
    }
    
    fun p(text: String) {
        content.add("<p>$text</p>")
    }
    
    override fun toString() = "<body>${content.joinToString("")}</body>"
}

// DSL usage
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}

val page = html {
    head {
        title = "My Page"
    }
    body {
        h1("Welcome")
        p("This is a paragraph")
    }
}
```

### 2. Repository Pattern

```kotlin
// Generic repository interface
interface Repository<T, ID> {
    suspend fun findById(id: ID): T?
    suspend fun findAll(): List<T>
    suspend fun save(entity: T): T
    suspend fun delete(id: ID)
}

// Implementation
class UserRepository(
    private val database: Database
) : Repository<User, Long> {
    
    override suspend fun findById(id: Long): User? = withContext(Dispatchers.IO) {
        database.query("SELECT * FROM users WHERE id = ?", id)
            .firstOrNull()
            ?.toUser()
    }
    
    override suspend fun findAll(): List<User> = withContext(Dispatchers.IO) {
        database.query("SELECT * FROM users")
            .map { it.toUser() }
    }
    
    override suspend fun save(entity: User): User = withContext(Dispatchers.IO) {
        if (entity.id == 0L) {
            database.insert("users", entity)
        } else {
            database.update("users", entity)
        }
        entity
    }
    
    override suspend fun delete(id: Long) = withContext(Dispatchers.IO) {
        database.delete("users", id)
    }
}
```

### 3. Result Monad

```kotlin
// Functional error handling
sealed class Result<out T> {
    data class Success<T>(val value: T) : Result<T>()
    data class Failure(val error: Throwable) : Result<Nothing>()
    
    fun <R> map(transform: (T) -> R): Result<R> = when (this) {
        is Success -> Success(transform(value))
        is Failure -> this
    }
    
    fun <R> flatMap(transform: (T) -> Result<R>): Result<R> = when (this) {
        is Success -> transform(value)
        is Failure -> this
    }
    
    fun getOrElse(default: T): T = when (this) {
        is Success -> value
        is Failure -> default
    }
    
    fun onSuccess(action: (T) -> Unit): Result<T> {
        if (this is Success) action(value)
        return this
    }
    
    fun onFailure(action: (Throwable) -> Unit): Result<T> {
        if (this is Failure) action(error)
        return this
    }
}

// Usage
fun divide(a: Int, b: Int): Result<Int> = try {
    Result.Success(a / b)
} catch (e: Exception) {
    Result.Failure(e)
}

val result = divide(10, 2)
    .map { it * 2 }
    .flatMap { divide(it, 4) }
    .onSuccess { println("Result: $it") }
    .onFailure { println("Error: ${it.message}") }
```

### 4. State Machine

```kotlin
// Type-safe state machine
sealed class State {
    object Idle : State()
    data class Loading(val progress: Int) : State()
    data class Success(val data: String) : State()
    data class Error(val message: String) : State()
}

sealed class Event {
    object Start : Event()
    data class Progress(val value: Int) : Event()
    data class Complete(val data: String) : Event()
    data class Fail(val error: String) : Event()
    object Reset : Event()
}

class StateMachine {
    private var state: State = State.Idle
    
    fun transition(event: Event) {
        state = when (state) {
            State.Idle -> when (event) {
                Event.Start -> State.Loading(0)
                else -> state
            }
            is State.Loading -> when (event) {
                is Event.Progress -> State.Loading(event.value)
                is Event.Complete -> State.Success(event.data)
                is Event.Fail -> State.Error(event.error)
                else -> state
            }
            is State.Success, is State.Error -> when (event) {
                Event.Reset -> State.Idle
                else -> state
            }
        }
    }
    
    fun currentState() = state
}
```

---

## Spring Boot Integration

### 1. REST Controller

```kotlin
@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    
    @GetMapping
    suspend fun getAllUsers(): List<UserDTO> {
        return userService.findAll()
    }
    
    @GetMapping("/{id}")
    suspend fun getUserById(@PathVariable id: Long): ResponseEntity<UserDTO> {
        return userService.findById(id)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }
    
    @PostMapping
    suspend fun createUser(@Valid @RequestBody request: CreateUserRequest): UserDTO {
        return userService.create(request)
    }
    
    @PutMapping("/{id}")
    suspend fun updateUser(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateUserRequest
    ): ResponseEntity<UserDTO> {
        return userService.update(id, request)
            ?.let { ResponseEntity.ok(it) }
            ?: ResponseEntity.notFound().build()
    }
    
    @DeleteMapping("/{id}")
    suspend fun deleteUser(@PathVariable id: Long): ResponseEntity<Unit> {
        return if (userService.delete(id)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
```

### 2. Service Layer

```kotlin
@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    
    suspend fun findAll(): List<UserDTO> = coroutineScope {
        userRepository.findAll()
            .map { it.toDTO() }
    }
    
    suspend fun findById(id: Long): UserDTO? = coroutineScope {
        userRepository.findById(id)?.toDTO()
    }
    
    suspend fun create(request: CreateUserRequest): UserDTO = coroutineScope {
        val user = User(
            id = 0,
            username = request.username,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            role = Role.USER
        )
        userRepository.save(user).toDTO()
    }
    
    suspend fun update(id: Long, request: UpdateUserRequest): UserDTO? = coroutineScope {
        userRepository.findById(id)?.let { user ->
            val updated = user.copy(
                email = request.email ?: user.email,
                password = request.password?.let { passwordEncoder.encode(it) } ?: user.password
            )
            userRepository.save(updated).toDTO()
        }
    }
    
    suspend fun delete(id: Long): Boolean = coroutineScope {
        userRepository.findById(id)?.let {
            userRepository.delete(id)
            true
        } ?: false
    }
}
```

### 3. Security Configuration

```kotlin
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
                authorize("/api/**", authenticated)
            }
            sessionManagement {
                sessionCreationPolicy = SessionCreationPolicy.STATELESS
            }
            httpBasic { }
        }
        return http.build()
    }
    
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}
```

### 4. Exception Handling

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
                timestamp = System.currentTimeMillis()
            ))
    }
    
    @ExceptionHandler(ValidationException::class)
    fun handleValidation(ex: ValidationException): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse(
                status = 400,
                message = ex.message ?: "Validation failed",
                timestamp = System.currentTimeMillis()
            ))
    }
    
    @ExceptionHandler(Exception::class)
    fun handleGeneral(ex: Exception): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse(
                status = 500,
                message = "Internal server error",
                timestamp = System.currentTimeMillis()
            ))
    }
}

data class ErrorResponse(
    val status: Int,
    val message: String,
    val timestamp: Long
)
```

---

## Testing

### 1. Unit Tests

```kotlin
class UserServiceTest {
    
    private lateinit var userRepository: UserRepository
    private lateinit var passwordEncoder: PasswordEncoder
    private lateinit var userService: UserService
    
    @BeforeEach
    fun setup() {
        userRepository = mockk()
        passwordEncoder = mockk()
        userService = UserService(userRepository, passwordEncoder)
    }
    
    @Test
    fun `findById should return user when exists`() = runTest {
        // Given
        val userId = 1L
        val user = User(userId, "alice", "alice@example.com", "pass", Role.USER)
        coEvery { userRepository.findById(userId) } returns user
        
        // When
        val result = userService.findById(userId)
        
        // Then
        assertNotNull(result)
        assertEquals("alice", result?.username)
        coVerify { userRepository.findById(userId) }
    }
    
    @Test
    fun `create should encode password and save user`() = runTest {
        // Given
        val request = CreateUserRequest("bob", "bob@example.com", "password123")
        val encodedPassword = "encoded_password"
        every { passwordEncoder.encode("password123") } returns encodedPassword
        coEvery { userRepository.save(any()) } answers { firstArg() }
        
        // When
        val result = userService.create(request)
        
        // Then
        assertEquals("bob", result.username)
        coVerify { userRepository.save(match { it.password == encodedPassword }) }
    }
}
```

### 2. Integration Tests

```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class UserControllerIntegrationTest {
    
    @Autowired
    private lateinit var restTemplate: TestRestTemplate
    
    @Autowired
    private lateinit var userRepository: UserRepository
    
    @BeforeEach
    fun setup() {
        userRepository.deleteAll()
    }
    
    @Test
    fun `should create and retrieve user`() {
        // Create user
        val request = CreateUserRequest("alice", "alice@example.com", "password")
        val createResponse = restTemplate.postForEntity(
            "/api/users",
            request,
            UserDTO::class.java
        )
        
        assertEquals(HttpStatus.OK, createResponse.statusCode)
        val userId = createResponse.body?.id
        assertNotNull(userId)
        
        // Retrieve user
        val getResponse = restTemplate.getForEntity(
            "/api/users/$userId",
            UserDTO::class.java
        )
        
        assertEquals(HttpStatus.OK, getResponse.statusCode)
        assertEquals("alice", getResponse.body?.username)
    }
}
```

---

## Best Practices

### 1. Immutability

```kotlin
// Prefer val over var
val immutableList = listOf(1, 2, 3)  // Read-only
val mutableList = mutableListOf(1, 2, 3)  // Mutable

// Use data classes for immutable data
data class Point(val x: Int, val y: Int)

// Use copy() for updates
val point1 = Point(1, 2)
val point2 = point1.copy(x = 3)
```

### 2. Scope Functions

```kotlin
// let: Execute lambda and return result
val length = nullableString?.let { it.length } ?: 0

// apply: Configure object and return it
val user = User().apply {
    name = "Alice"
    email = "alice@example.com"
}

// also: Perform side effects and return object
val numbers = mutableListOf(1, 2, 3).also {
    println("Initial: $it")
}

// run: Execute lambda in context
val result = user.run {
    println("User: $name")
    email
}

// with: Non-extension version of run
val message = with(user) {
    "Hello, $name!"
}
```

### 3. Collections

```kotlin
// Prefer functional operations
val numbers = listOf(1, 2, 3, 4, 5)

val evens = numbers.filter { it % 2 == 0 }
val doubled = numbers.map { it * 2 }
val sum = numbers.reduce { acc, n -> acc + n }
val product = numbers.fold(1) { acc, n -> acc * n }

// Sequences for lazy evaluation
val result = numbers.asSequence()
    .filter { it % 2 == 0 }
    .map { it * 2 }
    .take(2)
    .toList()  // Only evaluated here
```

### 4. Type Aliases

```kotlin
// Simplify complex types
typealias UserId = Long
typealias UserMap = Map<UserId, User>
typealias ValidationResult = Result<User>
typealias Callback = (Result<User>) -> Unit

fun processUser(id: UserId, callback: Callback) {
    // Implementation
}
```

---

## Performance Tips

### 1. Inline Classes

```kotlin
// Zero-overhead wrapper types
@JvmInline
value class Email(val value: String) {
    init {
        require(value.contains("@")) { "Invalid email" }
    }
}

// No runtime overhead
fun sendEmail(email: Email) {
    println("Sending to ${email.value}")
}
```

### 2. Lazy Initialization

```kotlin
class ExpensiveResource {
    val data: String by lazy {
        println("Computing expensive data")
        "Expensive Data"
    }
}

// Computed only on first access
val resource = ExpensiveResource()
println(resource.data)  // Prints "Computing..." then "Expensive Data"
println(resource.data)  // Just prints "Expensive Data"
```

### 3. Sequence vs List

```kotlin
// List: Eager evaluation (creates intermediate lists)
val result1 = (1..1_000_000)
    .map { it * 2 }
    .filter { it % 3 == 0 }
    .take(10)

// Sequence: Lazy evaluation (no intermediate collections)
val result2 = (1..1_000_000).asSequence()
    .map { it * 2 }
    .filter { it % 3 == 0 }
    .take(10)
    .toList()  // Much faster!
```

---

## Resources

### Official Documentation
- [Kotlin Docs](https://kotlinlang.org/docs/home.html)
- [Kotlin Koans](https://play.kotlinlang.org/koans)
- [Kotlin Style Guide](https://kotlinlang.org/docs/coding-conventions.html)

### Books
- "Kotlin in Action" by Dmitry Jemerov
- "Effective Kotlin" by Marcin Moskała
- "Kotlin Coroutines" by Marcin Moskała

### Practice
- [Exercism Kotlin Track](https://exercism.org/tracks/kotlin)
- [LeetCode with Kotlin](https://leetcode.com)
- [Advent of Code](https://adventofcode.com)

---

## Congratulations!

Mastering Kotlin means you have achieved:
✅ Modern JVM development skills
✅ Null-safe programming
✅ Functional programming expertise
✅ Coroutines and async mastery
✅ Spring Boot proficiency

**You are now a Kotlin expert!**

---

*"The best code is no code at all. The second best is Kotlin."*

*Happy Coding! 🚀*
