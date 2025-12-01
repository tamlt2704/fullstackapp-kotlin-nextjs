# Koog Agentic Agent - Complete Guide

A comprehensive guide to building AI agents in Kotlin using the Koog framework with Ollama local LLM integration.

## Table of Contents
1. [Setup](#setup)
2. [Core Concepts](#core-concepts)
3. [5 Real-World Examples](#5-real-world-examples)
4. [Advanced Features](#advanced-features)

---

## Setup

### Prerequisites
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model (e.g., llama3.2)
ollama pull llama3.2
```

### Project Structure
```
koog-agent/
├── build.gradle.kts
├── settings.gradle.kts
└── src/main/kotlin/com/example/koog/
    ├── Main.kt
    ├── Example1_WeatherAgent.kt
    ├── Example2_FileAnalyzerAgent.kt
    ├── Example3_DatabaseAgent.kt
    ├── Example4_CodeReviewAgent.kt
    └── Example5_CustomerSupportAgent.kt
```

### build.gradle.kts
```kotlin
plugins {
    kotlin("jvm") version "2.0.0"
    application
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.xemantic.ai:koog:0.3.0")
    implementation("com.xemantic.ai:koog-ollama:0.3.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.google.code.gson:gson:2.10.1")
}

kotlin {
    jvmToolchain(17)
}
```

---

## Core Concepts

### 1. Agent Definition
```kotlin
val agent = agent {
    model = ollama("llama3.2")
    systemPrompt = "You are a helpful assistant"
}
```

### 2. Tools (Functions)
```kotlin
@Tool("Get current weather")
fun getWeather(city: String): String {
    return "Weather in $city: 22°C, Sunny"
}
```

### 3. User Input
```kotlin
val response = agent.chat("What's the weather in London?")
```

### 4. Streaming Responses
```kotlin
agent.streamChat("Tell me a story").collect { chunk ->
    print(chunk)
}
```

---

## 5 Real-World Examples

## Example 1: Weather Agent with API Tools

**Use Case**: Agent that fetches real-time weather data and provides recommendations.

### Code: Example1_WeatherAgent.kt
```kotlin
package com.example.koog

import com.xemantic.ai.koog.agent
import com.xemantic.ai.koog.ollama.ollama
import com.xemantic.ai.koog.tool.Tool
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import okhttp3.Request
import com.google.gson.Gson

data class WeatherData(
    val temperature: Double,
    val condition: String,
    val humidity: Int,
    val windSpeed: Double
)

class WeatherAgent {
    private val client = OkHttpClient()
    private val gson = Gson()

    @Tool("Get current weather for a city")
    fun getWeather(city: String): String {
        // Simulated API call (replace with real API like OpenWeatherMap)
        val weather = when (city.lowercase()) {
            "london" -> WeatherData(15.0, "Cloudy", 75, 12.5)
            "new york" -> WeatherData(22.0, "Sunny", 60, 8.0)
            "tokyo" -> WeatherData(18.0, "Rainy", 85, 15.0)
            else -> WeatherData(20.0, "Clear", 50, 10.0)
        }
        return "Temperature: ${weather.temperature}°C, Condition: ${weather.condition}, " +
               "Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} km/h"
    }

    @Tool("Get weather forecast for next 3 days")
    fun getForecast(city: String): String {
        return """
            $city 3-Day Forecast:
            Day 1: 20°C, Partly Cloudy
            Day 2: 18°C, Rainy
            Day 3: 22°C, Sunny
        """.trimIndent()
    }

    @Tool("Get clothing recommendation based on weather")
    fun getClothingAdvice(temperature: Double, condition: String): String {
        return when {
            temperature < 10 -> "Wear a heavy jacket, scarf, and gloves"
            temperature < 20 -> "Light jacket or sweater recommended"
            condition.contains("rain", ignoreCase = true) -> "Don't forget an umbrella!"
            else -> "Light clothing is fine"
        }
    }

    fun run() = runBlocking {
        val agent = agent {
            model = ollama("llama3.2")
            systemPrompt = """
                You are a weather assistant. Use the available tools to:
                1. Get current weather
                2. Provide forecasts
                3. Give clothing recommendations
                Always be helpful and conversational.
            """.trimIndent()
            tools(::getWeather, ::getForecast, ::getClothingAdvice)
        }

        println("=== Weather Agent ===\n")
        
        // Example interactions
        val queries = listOf(
            "What's the weather like in London?",
            "Should I bring an umbrella in Tokyo?",
            "Give me a 3-day forecast for New York"
        )

        queries.forEach { query ->
            println("User: $query")
            val response = agent.chat(query)
            println("Agent: $response\n")
        }
    }
}

fun main() {
    WeatherAgent().run()
}
```

**Features Demonstrated**:
- Multiple tools with different purposes
- Tool chaining (get weather → recommend clothing)
- Simulated external API integration
- Conversational responses

---

## Example 2: File Analyzer Agent

**Use Case**: Analyze files, count lines, detect programming languages, and provide insights.

### Code: Example2_FileAnalyzerAgent.kt
```kotlin
package com.example.koog

import com.xemantic.ai.koog.agent
import com.xemantic.ai.koog.ollama.ollama
import com.xemantic.ai.koog.tool.Tool
import kotlinx.coroutines.runBlocking
import java.io.File

class FileAnalyzerAgent {
    
    @Tool("Read file contents")
    fun readFile(filePath: String): String {
        return try {
            val file = File(filePath)
            if (!file.exists()) return "Error: File not found"
            if (file.length() > 10000) return "File too large. Size: ${file.length()} bytes"
            file.readText()
        } catch (e: Exception) {
            "Error reading file: ${e.message}"
        }
    }

    @Tool("Count lines in a file")
    fun countLines(filePath: String): String {
        return try {
            val lines = File(filePath).readLines().size
            "File has $lines lines"
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    @Tool("Detect programming language from file extension")
    fun detectLanguage(filePath: String): String {
        val extension = File(filePath).extension
        return when (extension.lowercase()) {
            "kt" -> "Kotlin"
            "java" -> "Java"
            "py" -> "Python"
            "js", "ts" -> "JavaScript/TypeScript"
            "go" -> "Go"
            "rs" -> "Rust"
            "cpp", "cc", "cxx" -> "C++"
            "c", "h" -> "C"
            else -> "Unknown language (.$extension)"
        }
    }

    @Tool("Get file statistics")
    fun getFileStats(filePath: String): String {
        return try {
            val file = File(filePath)
            val lines = file.readLines()
            val words = lines.sumOf { it.split("\\s+".toRegex()).size }
            val chars = file.length()
            """
                Lines: ${lines.size}
                Words: $words
                Characters: $chars
                Size: ${chars / 1024} KB
            """.trimIndent()
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    @Tool("Search for text in file")
    fun searchInFile(filePath: String, searchTerm: String): String {
        return try {
            val matches = File(filePath).readLines()
                .mapIndexed { index, line -> index + 1 to line }
                .filter { it.second.contains(searchTerm, ignoreCase = true) }
            
            if (matches.isEmpty()) {
                "No matches found for '$searchTerm'"
            } else {
                "Found ${matches.size} matches:\n" + 
                matches.take(5).joinToString("\n") { "Line ${it.first}: ${it.second.trim()}" }
            }
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    fun run() = runBlocking {
        val agent = agent {
            model = ollama("llama3.2")
            systemPrompt = """
                You are a file analysis assistant. Help users:
                - Read and analyze files
                - Count lines and get statistics
                - Detect programming languages
                - Search within files
                Be concise and informative.
            """.trimIndent()
            tools(::readFile, ::countLines, ::detectLanguage, ::getFileStats, ::searchInFile)
        }

        println("=== File Analyzer Agent ===\n")

        // Interactive mode
        println("Enter file path or question (or 'exit' to quit):")
        while (true) {
            print("> ")
            val input = readLine() ?: break
            if (input.lowercase() == "exit") break

            val response = agent.chat(input)
            println("Agent: $response\n")
        }
    }
}

fun main() {
    FileAnalyzerAgent().run()
}
```

**Features Demonstrated**:
- File system operations
- Error handling in tools
- Interactive user input loop
- Multiple analysis tools

---

## Example 3: Database Query Agent

**Use Case**: Natural language to SQL conversion and database operations.

### Code: Example3_DatabaseAgent.kt
```kotlin
package com.example.koog

import com.xemantic.ai.koog.agent
import com.xemantic.ai.koog.ollama.ollama
import com.xemantic.ai.koog.tool.Tool
import kotlinx.coroutines.runBlocking

data class User(val id: Int, val name: String, val email: String, val role: String)
data class Order(val id: Int, val userId: Int, val product: String, val amount: Double)

class DatabaseAgent {
    // Simulated in-memory database
    private val users = mutableListOf(
        User(1, "Alice", "alice@example.com", "admin"),
        User(2, "Bob", "bob@example.com", "user"),
        User(3, "Charlie", "charlie@example.com", "user")
    )

    private val orders = mutableListOf(
        Order(1, 1, "Laptop", 1200.0),
        Order(2, 1, "Mouse", 25.0),
        Order(3, 2, "Keyboard", 75.0),
        Order(4, 3, "Monitor", 300.0)
    )

    @Tool("Query users from database")
    fun queryUsers(filter: String = "all"): String {
        val filtered = when (filter.lowercase()) {
            "admin" -> users.filter { it.role == "admin" }
            "user" -> users.filter { it.role == "user" }
            else -> users
        }
        return filtered.joinToString("\n") { "ID: ${it.id}, Name: ${it.name}, Email: ${it.email}, Role: ${it.role}" }
    }

    @Tool("Query orders from database")
    fun queryOrders(userId: Int? = null): String {
        val filtered = if (userId != null) {
            orders.filter { it.userId == userId }
        } else {
            orders
        }
        return filtered.joinToString("\n") { 
            "Order ID: ${it.id}, User: ${it.userId}, Product: ${it.product}, Amount: $${it.amount}" 
        }
    }

    @Tool("Get user by ID")
    fun getUserById(userId: Int): String {
        val user = users.find { it.id == userId }
        return user?.let { "Found: ${it.name} (${it.email}), Role: ${it.role}" } 
            ?: "User not found"
    }

    @Tool("Calculate total order amount for user")
    fun getTotalOrderAmount(userId: Int): String {
        val total = orders.filter { it.userId == userId }.sumOf { it.amount }
        val user = users.find { it.id == userId }
        return "Total orders for ${user?.name ?: "User $userId"}: $$total"
    }

    @Tool("Add new user")
    fun addUser(name: String, email: String, role: String = "user"): String {
        val newId = (users.maxOfOrNull { it.id } ?: 0) + 1
        users.add(User(newId, name, email, role))
        return "User added successfully with ID: $newId"
    }

    @Tool("Get database statistics")
    fun getStats(): String {
        return """
            Total Users: ${users.size}
            Total Orders: ${orders.size}
            Total Revenue: $${orders.sumOf { it.amount }}
            Admin Users: ${users.count { it.role == "admin" }}
        """.trimIndent()
    }

    fun run() = runBlocking {
        val agent = agent {
            model = ollama("llama3.2")
            systemPrompt = """
                You are a database assistant. Convert natural language queries to database operations.
                Available operations:
                - Query users (all, admin, or regular users)
                - Query orders (all or by user)
                - Get user details
                - Calculate totals
                - Add new users
                - Get statistics
                Always provide clear, formatted results.
            """.trimIndent()
            tools(::queryUsers, ::queryOrders, ::getUserById, 
                  ::getTotalOrderAmount, ::addUser, ::getStats)
        }

        println("=== Database Query Agent ===\n")

        val queries = listOf(
            "Show me all users",
            "What orders did Alice make?",
            "How much has user 1 spent in total?",
            "Add a new user named David with email david@example.com",
            "Give me database statistics"
        )

        queries.forEach { query ->
            println("User: $query")
            val response = agent.chat(query)
            println("Agent: $response\n")
        }
    }
}

fun main() {
    DatabaseAgent().run()
}
```

**Features Demonstrated**:
- Natural language to database operations
- CRUD operations
- Data aggregation
- In-memory data structures

---

## Example 4: Code Review Agent

**Use Case**: Analyze code for bugs, security issues, and best practices.

### Code: Example4_CodeReviewAgent.kt
```kotlin
package com.example.koog

import com.xemantic.ai.koog.agent
import com.xemantic.ai.koog.ollama.ollama
import com.xemantic.ai.koog.tool.Tool
import kotlinx.coroutines.runBlocking
import java.io.File

class CodeReviewAgent {

    @Tool("Analyze code for potential bugs")
    fun analyzeBugs(code: String, language: String): String {
        val issues = mutableListOf<String>()
        
        when (language.lowercase()) {
            "kotlin", "java" -> {
                if (code.contains("!!")) issues.add("⚠️ Null assertion (!!) can cause NPE")
                if (code.contains("Thread.sleep")) issues.add("⚠️ Thread.sleep blocks thread")
                if (!code.contains("try") && code.contains("File(")) 
                    issues.add("⚠️ File operations without try-catch")
            }
            "python" -> {
                if (code.contains("except:")) issues.add("⚠️ Bare except catches all exceptions")
                if (code.contains("eval(")) issues.add("🔴 eval() is dangerous")
            }
        }
        
        return if (issues.isEmpty()) "✅ No obvious bugs detected" 
               else "Found ${issues.size} issues:\n" + issues.joinToString("\n")
    }

    @Tool("Check code security vulnerabilities")
    fun checkSecurity(code: String): String {
        val vulnerabilities = mutableListOf<String>()
        
        if (code.contains("password", ignoreCase = true) && code.contains("=")) {
            vulnerabilities.add("🔴 Hardcoded password detected")
        }
        if (code.contains("api_key", ignoreCase = true) || code.contains("apiKey")) {
            vulnerabilities.add("🔴 Potential API key exposure")
        }
        if (code.contains("exec(") || code.contains("eval(")) {
            vulnerabilities.add("🔴 Code injection risk")
        }
        if (code.contains("SELECT") && code.contains("+")) {
            vulnerabilities.add("🔴 Potential SQL injection")
        }
        
        return if (vulnerabilities.isEmpty()) "✅ No security issues found"
               else "Security Issues:\n" + vulnerabilities.joinToString("\n")
    }

    @Tool("Suggest code improvements")
    fun suggestImprovements(code: String, language: String): String {
        val suggestions = mutableListOf<String>()
        
        if (code.lines().any { it.length > 120 }) {
            suggestions.add("💡 Some lines exceed 120 characters")
        }
        if (!code.contains("/**") && code.contains("fun ")) {
            suggestions.add("💡 Add KDoc comments for public functions")
        }
        if (code.contains("var ") && language.lowercase() == "kotlin") {
            suggestions.add("💡 Consider using 'val' instead of 'var' for immutability")
        }
        if (code.split("\n").size > 50) {
            suggestions.add("💡 Function is long, consider breaking it down")
        }
        
        return if (suggestions.isEmpty()) "✅ Code looks good!"
               else "Suggestions:\n" + suggestions.joinToString("\n")
    }

    @Tool("Calculate code complexity")
    fun calculateComplexity(code: String): String {
        val lines = code.lines().filter { it.trim().isNotEmpty() }
        val cyclomaticComplexity = code.split(Regex("if|while|for|when|catch")).size - 1
        val nestingLevel = code.lines().maxOfOrNull { line ->
            line.takeWhile { it.isWhitespace() }.length / 4
        } ?: 0
        
        return """
            Lines of Code: ${lines.size}
            Cyclomatic Complexity: $cyclomaticComplexity
            Max Nesting Level: $nestingLevel
            Complexity Rating: ${when {
                cyclomaticComplexity < 5 -> "Low ✅"
                cyclomaticComplexity < 10 -> "Medium ⚠️"
                else -> "High 🔴"
            }}
        """.trimIndent()
    }

    @Tool("Review code from file")
    fun reviewFile(filePath: String): String {
        return try {
            val code = File(filePath).readText()
            val language = File(filePath).extension
            "File loaded: ${File(filePath).name} ($language, ${code.length} chars)"
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    fun run() = runBlocking {
        val agent = agent {
            model = ollama("llama3.2")
            systemPrompt = """
                You are a code review expert. Analyze code for:
                1. Bugs and potential errors
                2. Security vulnerabilities
                3. Code quality and best practices
                4. Complexity metrics
                Provide actionable feedback with severity indicators.
            """.trimIndent()
            tools(::analyzeBugs, ::checkSecurity, ::suggestImprovements, 
                  ::calculateComplexity, ::reviewFile)
        }

        println("=== Code Review Agent ===\n")

        val sampleCode = """
            fun processUser(userId: String?) {
                val user = findUser(userId!!)
                val password = "admin123"
                val query = "SELECT * FROM users WHERE id = " + userId
                Thread.sleep(1000)
            }
        """.trimIndent()

        println("Sample Code:\n$sampleCode\n")
        
        val response = agent.chat(
            "Review this Kotlin code for bugs, security issues, and improvements:\n$sampleCode"
        )
        println("Agent: $response")
    }
}

fun main() {
    CodeReviewAgent().run()
}
```

**Features Demonstrated**:
- Code analysis tools
- Pattern matching for issues
- Security scanning
- Complexity metrics
- Multi-language support

---

## Example 5: Customer Support Agent with Context

**Use Case**: Multi-turn conversation with memory and context awareness.

### Code: Example5_CustomerSupportAgent.kt
```kotlin
package com.example.koog

import com.xemantic.ai.koog.agent
import com.xemantic.ai.koog.ollama.ollama
import com.xemantic.ai.koog.tool.Tool
import kotlinx.coroutines.runBlocking
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

data class Ticket(
    val id: String,
    val userId: String,
    val issue: String,
    val status: String,
    val priority: String,
    val createdAt: String
)

data class CustomerInfo(
    val id: String,
    val name: String,
    val email: String,
    val plan: String,
    val joinDate: String
)

class CustomerSupportAgent {
    private val tickets = mutableListOf(
        Ticket("T001", "U123", "Login issues", "open", "high", "2024-01-15"),
        Ticket("T002", "U123", "Payment failed", "resolved", "medium", "2024-01-10"),
        Ticket("T003", "U456", "Feature request", "open", "low", "2024-01-14")
    )

    private val customers = mapOf(
        "U123" to CustomerInfo("U123", "John Doe", "john@example.com", "Premium", "2023-06-01"),
        "U456" to CustomerInfo("U456", "Jane Smith", "jane@example.com", "Basic", "2023-12-15")
    )

    @Tool("Get customer information")
    fun getCustomerInfo(userId: String): String {
        val customer = customers[userId]
        return customer?.let {
            """
                Customer: ${it.name}
                Email: ${it.email}
                Plan: ${it.plan}
                Member Since: ${it.joinDate}
            """.trimIndent()
        } ?: "Customer not found"
    }

    @Tool("Get customer tickets")
    fun getTickets(userId: String, status: String = "all"): String {
        val userTickets = tickets.filter { it.userId == userId }
        val filtered = if (status != "all") {
            userTickets.filter { it.status == status }
        } else userTickets

        return if (filtered.isEmpty()) {
            "No tickets found"
        } else {
            filtered.joinToString("\n\n") {
                "Ticket ${it.id}: ${it.issue}\nStatus: ${it.status}\nPriority: ${it.priority}\nCreated: ${it.createdAt}"
            }
        }
    }

    @Tool("Create new support ticket")
    fun createTicket(userId: String, issue: String, priority: String = "medium"): String {
        val ticketId = "T${(tickets.size + 1).toString().padStart(3, '0')}"
        val now = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE)
        tickets.add(Ticket(ticketId, userId, issue, "open", priority, now))
        return "✅ Ticket $ticketId created successfully. Priority: $priority"
    }

    @Tool("Update ticket status")
    fun updateTicketStatus(ticketId: String, newStatus: String): String {
        val ticket = tickets.find { it.id == ticketId }
        return if (ticket != null) {
            tickets.remove(ticket)
            tickets.add(ticket.copy(status = newStatus))
            "✅ Ticket $ticketId updated to: $newStatus"
        } else {
            "❌ Ticket not found"
        }
    }

    @Tool("Search knowledge base")
    fun searchKnowledgeBase(query: String): String {
        val kb = mapOf(
            "login" to "To reset password: Go to Settings > Security > Reset Password",
            "payment" to "Payment issues: Check card details, ensure sufficient funds, contact bank",
            "upgrade" to "To upgrade plan: Account > Subscription > Choose Plan > Confirm",
            "cancel" to "To cancel: Account > Subscription > Cancel (no refunds for partial months)"
        )

        val results = kb.filter { query.lowercase() in it.key }
        return if (results.isEmpty()) {
            "No knowledge base articles found. Creating ticket recommended."
        } else {
            results.values.joinToString("\n\n")
        }
    }

    @Tool("Get current time")
    fun getCurrentTime(): String {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
    }

    fun run() = runBlocking {
        val agent = agent {
            model = ollama("llama3.2")
            systemPrompt = """
                You are a friendly customer support agent. Your role:
                1. Greet customers warmly
                2. Look up their information and history
                3. Help resolve issues using knowledge base
                4. Create tickets when needed
                5. Follow up on existing tickets
                
                Be empathetic, professional, and solution-oriented.
                Always verify customer identity before sharing information.
            """.trimIndent()
            tools(::getCustomerInfo, ::getTickets, ::createTicket, 
                  ::updateTicketStatus, ::searchKnowledgeBase, ::getCurrentTime)
        }

        println("=== Customer Support Agent ===\n")
        println("Agent: Hello! I'm your support assistant. How can I help you today?\n")

        // Simulated conversation
        val conversation = listOf(
            "Hi, I'm having login issues. My user ID is U123",
            "Do I have any open tickets?",
            "Can you help me with the login problem?",
            "Great! Please mark ticket T001 as resolved"
        )

        conversation.forEach { message ->
            println("Customer: $message")
            val response = agent.chat(message)
            println("Agent: $response\n")
        }
    }
}

fun main() {
    CustomerSupportAgent().run()
}
```

**Features Demonstrated**:
- Multi-turn conversations
- Context retention across messages
- CRUD operations on tickets
- Knowledge base search
- Time-aware responses

---

## Advanced Features

### 1. Streaming Responses
```kotlin
agent.streamChat("Explain quantum computing").collect { chunk ->
    print(chunk)
}
```

### 2. Custom Tool Parameters
```kotlin
@Tool("Complex calculation")
fun calculate(
    operation: String,
    numbers: List<Double>,
    precision: Int = 2
): String {
    // Implementation
}
```

### 3. Error Handling
```kotlin
@Tool("Safe file operation")
fun safeRead(path: String): String {
    return try {
        File(path).readText()
    } catch (e: Exception) {
        "Error: ${e.message}"
    }
}
```

### 4. Async Operations
```kotlin
@Tool("Fetch data")
suspend fun fetchData(url: String): String = withContext(Dispatchers.IO) {
    // Async operation
}
```

### 5. Tool Composition
```kotlin
@Tool("Analyze and summarize")
fun analyzeAndSummarize(filePath: String): String {
    val content = readFile(filePath)
    val stats = getFileStats(filePath)
    return "$stats\n\nContent preview: ${content.take(100)}..."
}
```

---

## Running the Examples

### Run Individual Example
```bash
cd koog-agent
./gradlew run --args="example1"  # Weather Agent
./gradlew run --args="example2"  # File Analyzer
./gradlew run --args="example3"  # Database Agent
./gradlew run --args="example4"  # Code Review
./gradlew run --args="example5"  # Customer Support
```

### Run All Examples
```bash
./gradlew run
```

---

## Best Practices

### 1. Tool Design
- Keep tools focused and single-purpose
- Return structured, parseable data
- Handle errors gracefully
- Document parameters clearly

### 2. System Prompts
- Be specific about agent capabilities
- Define expected behavior
- Include output format guidelines
- Set tone and personality

### 3. Performance
- Use streaming for long responses
- Cache expensive operations
- Limit tool execution time
- Handle rate limits

### 4. Security
- Validate all inputs
- Sanitize file paths
- Limit file access scope
- Never expose credentials

---

## Troubleshooting

### Ollama Connection Issues
```bash
# Check Ollama is running
ollama list

# Restart Ollama
systemctl restart ollama
```

### Model Not Found
```bash
# Pull the model
ollama pull llama3.2
```

### Tool Not Called
- Check tool annotation `@Tool`
- Verify function is public
- Ensure parameters are serializable
- Check system prompt mentions tool usage

---

## Resources

- **Koog Documentation**: https://github.com/xemantic/koog
- **Ollama Models**: https://ollama.com/library
- **Kotlin Coroutines**: https://kotlinlang.org/docs/coroutines-overview.html

---

## Summary

This guide covered:
✅ 5 complete real-world examples
✅ All Koog features (tools, user input, streaming)
✅ Ollama local LLM integration
✅ Best practices and patterns
✅ Error handling and security

Each example is production-ready and demonstrates different use cases for building intelligent agents in Kotlin.
