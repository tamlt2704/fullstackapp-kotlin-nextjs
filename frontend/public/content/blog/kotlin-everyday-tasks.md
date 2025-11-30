---
title: "Kotlin for Everyday Tasks - Practical Guide"
date: "2024-12-12"
category: "Backend"
tags: ["Kotlin", "Practical", "Productivity", "Tips", "Everyday"]
---

# Kotlin for Everyday Tasks - Practical Guide

*Published on December 12, 2024*

## 1. File Operations

### Reading and Writing Files
```kotlin
import java.io.File

// Read entire file
val content = File("data.txt").readText()
val lines = File("data.txt").readLines()

// Write to file
File("output.txt").writeText("Hello, World!")
File("output.txt").appendText("\nNew line")

// Read large files efficiently
File("large.txt").useLines { lines ->
    lines.forEach { println(it) }
}

// Copy files
File("source.txt").copyTo(File("destination.txt"), overwrite = true)

// Working with paths
val file = File("data.txt")
println("Name: ${file.name}")
println("Path: ${file.absolutePath}")
println("Exists: ${file.exists()}")
println("Size: ${file.length()} bytes")
```

### JSON Processing
```kotlin
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class User(val name: String, val age: Int, val email: String)

// Serialize to JSON
val user = User("John", 30, "john@example.com")
val json = Json.encodeToString(user)

// Deserialize from JSON
val userFromJson = Json.decodeFromString<User>(json)

// Pretty print
val prettyJson = Json { prettyPrint = true }
println(prettyJson.encodeToString(user))

// Handle nullable fields
@Serializable
data class OptionalUser(
    val name: String,
    val age: Int? = null,
    val email: String? = null
)
```

### CSV Processing
```kotlin
import java.io.File

// Read CSV
fun readCSV(filename: String): List<Map<String, String>> {
    val lines = File(filename).readLines()
    val headers = lines.first().split(",")
    
    return lines.drop(1).map { line ->
        val values = line.split(",")
        headers.zip(values).toMap()
    }
}

// Write CSV
fun writeCSV(filename: String, data: List<Map<String, String>>) {
    val headers = data.first().keys.joinToString(",")
    val rows = data.joinToString("\n") { row ->
        row.values.joinToString(",")
    }
    File(filename).writeText("$headers\n$rows")
}
```

## 2. String Manipulation

### Common String Operations
```kotlin
// String templates
val name = "John"
val greeting = "Hello, $name!"
val calculation = "2 + 2 = ${2 + 2}"

// Multi-line strings
val text = """
    Line 1
    Line 2
    Line 3
""".trimIndent()

// String operations
val str = "Hello, World!"
println(str.uppercase())
println(str.lowercase())
println(str.replace("World", "Kotlin"))
println(str.substring(0, 5))
println(str.split(", "))

// Regular expressions
val pattern = Regex("""\d+""")
val numbers = pattern.findAll("abc123def456").map { it.value }.toList()

// String validation
fun isValidEmail(email: String): Boolean {
    return Regex("""^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$""").matches(email)
}
```

### Text Processing
```kotlin
// Word count
fun wordCount(text: String): Map<String, Int> {
    return text.lowercase()
        .split(Regex("""\W+"""))
        .filter { it.isNotEmpty() }
        .groupingBy { it }
        .eachCount()
}

// Remove duplicates
fun removeDuplicateWords(text: String): String {
    return text.split(" ")
        .distinct()
        .joinToString(" ")
}

// Capitalize words
fun titleCase(text: String): String {
    return text.split(" ")
        .joinToString(" ") { it.capitalize() }
}
```

## 3. Collections and Data Processing

### List Operations
```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

// Transformations
val doubled = numbers.map { it * 2 }
val evens = numbers.filter { it % 2 == 0 }
val sum = numbers.reduce { acc, n -> acc + n }
val product = numbers.fold(1) { acc, n -> acc * n }

// Grouping
data class Person(val name: String, val age: Int, val city: String)
val people = listOf(
    Person("John", 30, "NYC"),
    Person("Jane", 25, "LA"),
    Person("Bob", 30, "NYC")
)

val byAge = people.groupBy { it.age }
val byCity = people.groupBy { it.city }

// Sorting
val sortedByAge = people.sortedBy { it.age }
val sortedByName = people.sortedBy { it.name }

// Chunking
val chunks = numbers.chunked(2)  // [[1,2], [3,4], [5]]

// Windowing
val windows = numbers.windowed(3)  // [[1,2,3], [2,3,4], [3,4,5]]
```

### Map Operations
```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)

// Transformations
val doubled = map.mapValues { it.value * 2 }
val filtered = map.filterValues { it > 1 }

// Merging maps
val map1 = mapOf("a" to 1, "b" to 2)
val map2 = mapOf("b" to 3, "c" to 4)
val merged = map1 + map2  // b=3, c=4 (map2 wins)

// Frequency map
fun <T> List<T>.frequencies(): Map<T, Int> {
    return groupingBy { it }.eachCount()
}
```

## 4. Date and Time

### Working with Dates
```kotlin
import java.time.*
import java.time.format.DateTimeFormatter

// Current date/time
val now = LocalDateTime.now()
val today = LocalDate.now()
val currentTime = LocalTime.now()

// Parsing dates
val date = LocalDate.parse("2024-12-12")
val dateTime = LocalDateTime.parse("2024-12-12T10:30:00")

// Formatting dates
val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
val formatted = today.format(formatter)

// Date arithmetic
val tomorrow = today.plusDays(1)
val nextWeek = today.plusWeeks(1)
val lastMonth = today.minusMonths(1)

// Date comparison
val isBefore = date1.isBefore(date2)
val isAfter = date1.isAfter(date2)

// Duration and Period
val duration = Duration.between(time1, time2)
val period = Period.between(date1, date2)

println("Days: ${period.days}")
println("Hours: ${duration.toHours()}")
```

## 5. HTTP Requests

### Using Ktor Client
```kotlin
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*

suspend fun fetchData() {
    val client = HttpClient()
    
    // GET request
    val response: String = client.get("https://api.example.com/data")
    
    // POST request
    val postResponse = client.post("https://api.example.com/users") {
        setBody("""{"name": "John", "age": 30}""")
        header("Content-Type", "application/json")
    }
    
    client.close()
}

// With JSON serialization
@Serializable
data class User(val name: String, val age: Int)

suspend fun createUser(user: User) {
    val client = HttpClient {
        install(ContentNegotiation) {
            json()
        }
    }
    
    val response = client.post("https://api.example.com/users") {
        contentType(ContentType.Application.Json)
        setBody(user)
    }
    
    client.close()
}
```

## 6. Command Line Tools

### Argument Parsing
```kotlin
fun main(args: Array<String>) {
    val options = parseArgs(args)
    
    when {
        options.containsKey("help") -> printHelp()
        options.containsKey("version") -> printVersion()
        else -> runCommand(options)
    }
}

fun parseArgs(args: Array<String>): Map<String, String> {
    val options = mutableMapOf<String, String>()
    var i = 0
    
    while (i < args.size) {
        when {
            args[i].startsWith("--") -> {
                val key = args[i].substring(2)
                val value = if (i + 1 < args.size && !args[i + 1].startsWith("-")) {
                    args[++i]
                } else {
                    "true"
                }
                options[key] = value
            }
            args[i].startsWith("-") -> {
                options[args[i].substring(1)] = "true"
            }
        }
        i++
    }
    
    return options
}
```

### Progress Indicators
```kotlin
fun processWithProgress(items: List<String>) {
    val total = items.size
    items.forEachIndexed { index, item ->
        // Process item
        processItem(item)
        
        // Show progress
        val progress = ((index + 1) * 100) / total
        print("\rProgress: $progress% [${index + 1}/$total]")
    }
    println("\nDone!")
}
```

## 7. Database Operations

### JDBC with Kotlin
```kotlin
import java.sql.*

class Database(private val url: String) {
    
    fun <T> query(sql: String, mapper: (ResultSet) -> T): List<T> {
        val results = mutableListOf<T>()
        
        DriverManager.getConnection(url).use { conn ->
            conn.createStatement().use { stmt ->
                stmt.executeQuery(sql).use { rs ->
                    while (rs.next()) {
                        results.add(mapper(rs))
                    }
                }
            }
        }
        
        return results
    }
    
    fun execute(sql: String): Int {
        DriverManager.getConnection(url).use { conn ->
            conn.createStatement().use { stmt ->
                return stmt.executeUpdate(sql)
            }
        }
    }
}

// Usage
data class User(val id: Int, val name: String, val email: String)

val db = Database("jdbc:postgresql://localhost/mydb")
val users = db.query("SELECT * FROM users") { rs ->
    User(
        id = rs.getInt("id"),
        name = rs.getString("name"),
        email = rs.getString("email")
    )
}
```

## 8. Utility Functions

### Common Utilities
```kotlin
// Retry logic
suspend fun <T> retry(
    times: Int = 3,
    delay: Long = 1000,
    block: suspend () -> T
): T {
    repeat(times - 1) {
        try {
            return block()
        } catch (e: Exception) {
            delay(delay)
        }
    }
    return block()
}

// Memoization
fun <A, R> ((A) -> R).memoize(): (A) -> R {
    val cache = mutableMapOf<A, R>()
    return { a ->
        cache.getOrPut(a) { this(a) }
    }
}

// Measure execution time
inline fun <T> measureTime(block: () -> T): Pair<T, Long> {
    val start = System.currentTimeMillis()
    val result = block()
    val time = System.currentTimeMillis() - start
    return result to time
}

// Safe division
fun safeDivide(a: Int, b: Int): Int? {
    return if (b != 0) a / b else null
}

// Clamp value
fun Int.clamp(min: Int, max: Int): Int {
    return when {
        this < min -> min
        this > max -> max
        else -> this
    }
}
```

## 9. Testing Utilities

### Test Helpers
```kotlin
import kotlin.test.*

// Assert extensions
fun <T> assertContains(collection: Collection<T>, element: T) {
    assertTrue(collection.contains(element), "Collection should contain $element")
}

fun assertBetween(value: Int, min: Int, max: Int) {
    assertTrue(value in min..max, "$value should be between $min and $max")
}

// Test data builders
class UserBuilder {
    var name = "Test User"
    var age = 25
    var email = "test@example.com"
    
    fun build() = User(name, age, email)
}

fun user(block: UserBuilder.() -> Unit = {}): User {
    return UserBuilder().apply(block).build()
}

// Usage in tests
@Test
fun testUser() {
    val user = user {
        name = "John"
        age = 30
    }
    assertEquals("John", user.name)
}
```

## 10. Configuration Management

### Loading Configuration
```kotlin
import java.util.Properties

class Config(filename: String) {
    private val props = Properties()
    
    init {
        javaClass.classLoader.getResourceAsStream(filename)?.use {
            props.load(it)
        }
    }
    
    fun getString(key: String, default: String = ""): String {
        return props.getProperty(key, default)
    }
    
    fun getInt(key: String, default: Int = 0): Int {
        return props.getProperty(key)?.toIntOrNull() ?: default
    }
    
    fun getBoolean(key: String, default: Boolean = false): Boolean {
        return props.getProperty(key)?.toBoolean() ?: default
    }
}

// Usage
val config = Config("application.properties")
val dbUrl = config.getString("database.url")
val port = config.getInt("server.port", 8080)
```

### Environment Variables
```kotlin
object Env {
    val DATABASE_URL = System.getenv("DATABASE_URL") ?: "jdbc:postgresql://localhost/mydb"
    val PORT = System.getenv("PORT")?.toIntOrNull() ?: 8080
    val DEBUG = System.getenv("DEBUG")?.toBoolean() ?: false
    
    fun get(key: String, default: String = ""): String {
        return System.getenv(key) ?: default
    }
}
```

---

*This practical Kotlin guide covers everyday tasks from file operations to configuration management. Use these patterns to write clean, efficient Kotlin code for common programming tasks.*