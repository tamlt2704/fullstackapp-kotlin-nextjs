---
title: "Kotlin/JS: Complete JavaScript Interoperability Guide"
date: "2024-12-08"
category: "Web Development"
tags: ["Kotlin", "JavaScript", "Kotlin/JS", "Web", "Interop"]
---

# Kotlin/JS: Complete JavaScript Interoperability Guide

*From Beginner to Professional in Kotlin/JS Development*

## Table of Contents
1. [Introduction](#introduction)
2. [Setup & Configuration](#setup--configuration)
3. [JavaScript Interop Basics](#javascript-interop-basics)
4. [Working with JS Libraries](#working-with-js-libraries)
5. [DOM Manipulation](#dom-manipulation)
6. [Async Operations](#async-operations)
7. [React Integration](#react-integration)
8. [Node.js Development](#nodejs-development)
9. [Real-World Projects](#real-world-projects)
10. [Best Practices](#best-practices)

---

## Introduction

### Why Kotlin/JS?

**Advantages:**
- Type-safe JavaScript development
- Null-safety in the browser
- Code sharing between JVM and JS
- Modern language features
- Excellent IDE support
- Seamless JS interop

**Use Cases:**
- Frontend web applications
- Node.js backend services
- Full-stack applications
- Browser extensions
- Hybrid mobile apps

---

## Setup & Configuration

### Gradle Configuration

```kotlin
// build.gradle.kts
plugins {
    kotlin("js") version "1.9.22"
}

kotlin {
    js {
        browser {
            commonWebpackConfig {
                cssSupport {
                    enabled.set(true)
                }
            }
        }
        binaries.executable()
    }
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.11.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-js:1.7.3")
}
```

### Project Structure

```
kotlin-js-project/
├── build.gradle.kts
├── settings.gradle.kts
└── src/
    └── main/
        ├── kotlin/
        │   └── Main.kt
        └── resources/
            └── index.html
```

### First Program

```kotlin
// src/main/kotlin/Main.kt
fun main() {
    console.log("Hello from Kotlin/JS!")
    document.getElementById("app")?.innerHTML = "<h1>Hello Kotlin/JS</h1>"
}
```

```html
<!-- src/main/resources/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Kotlin/JS App</title>
</head>
<body>
    <div id="app"></div>
    <script src="kotlin-js-project.js"></script>
</body>
</html>
```

### Build & Run

```bash
# Development build
./gradlew browserDevelopmentRun

# Production build
./gradlew browserProductionWebpack

# Continuous build
./gradlew browserDevelopmentRun --continuous
```

---

## JavaScript Interop Basics

### Calling JavaScript from Kotlin

#### Using external Declarations

```kotlin
// Declare JS function
external fun alert(message: String)

// Declare JS object
external object JSON {
    fun stringify(obj: Any): String
    fun parse(text: String): Any
}

// Usage
fun example() {
    alert("Hello!")
    val json = JSON.stringify(mapOf("name" to "Alice"))
    console.log(json)
}
```

#### Dynamic Types

```kotlin
// Dynamic type - no type checking
fun useDynamic() {
    val obj: dynamic = js("{}")
    obj.name = "Alice"
    obj.age = 25
    obj.greet = { console.log("Hello ${obj.name}") }
    
    console.log(obj.name)  // Alice
    obj.greet()            // Hello Alice
}
```

#### js() Function

```kotlin
// Inline JavaScript
val jsCode = js("""
    function add(a, b) {
        return a + b;
    }
    add(5, 3)
""")

// Create JS objects
val person = js("{name: 'Bob', age: 30}")
console.log(person.name)
```

### Calling Kotlin from JavaScript

```kotlin
// Kotlin code
@JsExport
class Calculator {
    fun add(a: Int, b: Int) = a + b
    fun multiply(a: Int, b: Int) = a * b
}

@JsExport
fun greet(name: String) = "Hello, $name!"
```

```javascript
// JavaScript code
const calc = new Calculator();
console.log(calc.add(5, 3));        // 8
console.log(calc.multiply(4, 7));   // 28
console.log(greet("World"));        // Hello, World!
```

### Type Mappings

```kotlin
// Kotlin -> JavaScript type mappings
val num: Int = 42              // number
val str: String = "text"       // string
val bool: Boolean = true       // boolean
val arr: Array<Int> = arrayOf(1, 2, 3)  // Array
val list: List<String> = listOf("a", "b")  // Array
val map: Map<String, Int> = mapOf("x" to 1)  // Object
```

---

## Working with JS Libraries

### External Declarations

```kotlin
// Lodash
@JsModule("lodash")
@JsNonModule
external object _ {
    fun <T> chunk(array: Array<T>, size: Int): Array<Array<T>>
    fun <T> uniq(array: Array<T>): Array<T>
    fun <T> shuffle(array: Array<T>): Array<T>
}

// Usage
fun useLodash() {
    val numbers = arrayOf(1, 2, 3, 4, 5, 6)
    val chunked = _.chunk(numbers, 2)
    console.log(chunked)  // [[1,2], [3,4], [5,6]]
}
```

### Axios HTTP Client

```kotlin
@JsModule("axios")
@JsNonModule
external object axios {
    fun get(url: String): Promise<AxiosResponse>
    fun post(url: String, data: Any): Promise<AxiosResponse>
}

external interface AxiosResponse {
    val data: dynamic
    val status: Int
    val statusText: String
}

// Usage
suspend fun fetchData() {
    val response = axios.get("https://api.example.com/data").await()
    console.log(response.data)
}
```

### Moment.js

```kotlin
@JsModule("moment")
@JsNonModule
external fun moment(date: String? = definedExternally): Moment

external interface Moment {
    fun format(pattern: String): String
    fun add(amount: Int, unit: String): Moment
    fun subtract(amount: Int, unit: String): Moment
    fun isBefore(other: Moment): Boolean
}

// Usage
fun dateExample() {
    val now = moment()
    console.log(now.format("YYYY-MM-DD"))
    
    val tomorrow = moment().add(1, "days")
    console.log(tomorrow.format("MMMM Do YYYY"))
}
```

### Chart.js

```kotlin
@JsModule("chart.js")
@JsNonModule
external class Chart(ctx: dynamic, config: ChartConfig)

external interface ChartConfig {
    var type: String
    var data: ChartData
    var options: dynamic
}

external interface ChartData {
    var labels: Array<String>
    var datasets: Array<Dataset>
}

external interface Dataset {
    var label: String
    var data: Array<Number>
    var backgroundColor: dynamic
}

// Usage
fun createChart() {
    val ctx = document.getElementById("myChart")
    val chart = Chart(ctx, object : ChartConfig {
        override var type = "bar"
        override var data = object : ChartData {
            override var labels = arrayOf("Jan", "Feb", "Mar")
            override var datasets = arrayOf(object : Dataset {
                override var label = "Sales"
                override var data = arrayOf(12, 19, 3)
                override var backgroundColor = "rgba(75, 192, 192, 0.2)"
            })
        }
        override var options = js("{}")
    })
}
```

---

## DOM Manipulation

### Basic DOM Operations

```kotlin
import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.*

// Get elements
fun getElements() {
    val element = document.getElementById("myId")
    val elements = document.getElementsByClassName("myClass")
    val query = document.querySelector(".container")
    val queryAll = document.querySelectorAll("div.item")
}

// Create elements
fun createElement() {
    val div = document.createElement("div") as HTMLDivElement
    div.id = "newDiv"
    div.className = "container"
    div.textContent = "Hello"
    
    document.body?.appendChild(div)
}

// Modify elements
fun modifyElement() {
    val element = document.getElementById("myDiv") as? HTMLElement
    element?.apply {
        innerHTML = "<p>New content</p>"
        style.color = "blue"
        style.fontSize = "20px"
        setAttribute("data-value", "123")
    }
}

// Remove elements
fun removeElement() {
    val element = document.getElementById("toRemove")
    element?.remove()
}
```

### Event Handling

```kotlin
// Click events
fun setupClickHandler() {
    val button = document.getElementById("myButton") as? HTMLButtonElement
    button?.addEventListener("click", {
        console.log("Button clicked!")
    })
}

// Input events
fun setupInputHandler() {
    val input = document.getElementById("myInput") as? HTMLInputElement
    input?.addEventListener("input", { event ->
        val target = event.target as HTMLInputElement
        console.log("Input value: ${target.value}")
    })
}

// Form submission
fun setupFormHandler() {
    val form = document.getElementById("myForm") as? HTMLFormElement
    form?.addEventListener("submit", { event ->
        event.preventDefault()
        val formData = FormData(form)
        console.log("Form submitted")
    })
}

// Keyboard events
fun setupKeyboardHandler() {
    document.addEventListener("keydown", { event ->
        val keyEvent = event as KeyboardEvent
        when (keyEvent.key) {
            "Enter" -> console.log("Enter pressed")
            "Escape" -> console.log("Escape pressed")
        }
    })
}
```

### kotlinx-html DSL

```kotlin
import kotlinx.html.*
import kotlinx.html.dom.append
import kotlinx.browser.document

fun buildUI() {
    document.body?.append {
        div("container") {
            h1 { +"Welcome to Kotlin/JS" }
            
            p {
                +"This is a paragraph with "
                strong { +"bold text" }
            }
            
            ul {
                li { +"Item 1" }
                li { +"Item 2" }
                li { +"Item 3" }
            }
            
            button {
                id = "myButton"
                +"Click Me"
                onClickFunction = {
                    window.alert("Button clicked!")
                }
            }
            
            form {
                input(type = InputType.text) {
                    name = "username"
                    placeholder = "Enter username"
                }
                input(type = InputType.password) {
                    name = "password"
                    placeholder = "Enter password"
                }
                button(type = ButtonType.submit) {
                    +"Login"
                }
            }
        }
    }
}
```

---

## Async Operations

### Promises

```kotlin
import kotlin.js.Promise

// Create promise
fun createPromise(): Promise<String> {
    return Promise { resolve, reject ->
        window.setTimeout({
            resolve("Success!")
        }, 1000)
    }
}

// Chain promises
fun chainPromises() {
    createPromise()
        .then { result ->
            console.log(result)
            Promise.resolve("Next step")
        }
        .then { result ->
            console.log(result)
        }
        .catch { error ->
            console.error("Error: $error")
        }
}
```

### Coroutines

```kotlin
import kotlinx.coroutines.*

// Suspend functions
suspend fun fetchUser(id: Int): User {
    delay(1000)
    return User(id, "User $id")
}

suspend fun fetchPosts(userId: Int): List<Post> {
    delay(500)
    return listOf(Post(1, "Post 1"), Post(2, "Post 2"))
}

// Launch coroutines
fun loadData() {
    MainScope().launch {
        try {
            val user = fetchUser(1)
            console.log("User: ${user.name}")
            
            val posts = fetchPosts(user.id)
            console.log("Posts: ${posts.size}")
        } catch (e: Exception) {
            console.error("Error: ${e.message}")
        }
    }
}

// Parallel execution
fun loadParallel() {
    MainScope().launch {
        val user = async { fetchUser(1) }
        val posts = async { fetchPosts(1) }
        
        console.log("User: ${user.await().name}")
        console.log("Posts: ${posts.await().size}")
    }
}
```

### Fetch API

```kotlin
import org.w3c.fetch.RequestInit
import kotlinx.browser.window

suspend fun fetchData(url: String): String {
    val response = window.fetch(url).await()
    return response.text().await()
}

suspend fun postData(url: String, data: Any): String {
    val response = window.fetch(url, RequestInit(
        method = "POST",
        headers = js("{\"Content-Type\": \"application/json\"}"),
        body = JSON.stringify(data)
    )).await()
    return response.text().await()
}

// Usage
fun example() {
    MainScope().launch {
        val data = fetchData("https://api.example.com/data")
        console.log(data)
        
        val result = postData("https://api.example.com/users", 
            mapOf("name" to "Alice", "email" to "alice@example.com"))
        console.log(result)
    }
}
```

---

## React Integration

### Setup

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.jetbrains.kotlin-wrappers:kotlin-react:18.2.0-pre.467")
    implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom:18.2.0-pre.467")
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion:11.10.6-pre.467")
}
```

### Functional Components

```kotlin
import react.*
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.h1
import react.dom.html.ReactHTML.button

val Welcome = FC<Props> {
    div {
        h1 { +"Welcome to React with Kotlin!" }
    }
}

// Component with props
external interface GreetingProps : Props {
    var name: String
}

val Greeting = FC<GreetingProps> { props ->
    h1 { +"Hello, ${props.name}!" }
}
```

### State Management

```kotlin
val Counter = FC<Props> {
    var count by useState(0)
    
    div {
        h2 { +"Count: $count" }
        button {
            onClick = { count++ }
            +"Increment"
        }
        button {
            onClick = { count-- }
            +"Decrement"
        }
    }
}
```

### Effects

```kotlin
val DataLoader = FC<Props> {
    var data by useState<String?>(null)
    var loading by useState(true)
    
    useEffect {
        MainScope().launch {
            loading = true
            data = fetchData("https://api.example.com/data")
            loading = false
        }
    }
    
    div {
        if (loading) {
            +"Loading..."
        } else {
            +"Data: $data"
        }
    }
}
```

### Complete App

```kotlin
import react.*
import react.dom.html.ReactHTML.*
import kotlinx.browser.document
import react.dom.client.createRoot

data class Todo(val id: Int, val text: String, val completed: Boolean)

val TodoApp = FC<Props> {
    var todos by useState(listOf<Todo>())
    var input by useState("")
    
    val addTodo = {
        if (input.isNotBlank()) {
            todos = todos + Todo(todos.size + 1, input, false)
            input = ""
        }
    }
    
    val toggleTodo = { id: Int ->
        todos = todos.map { 
            if (it.id == id) it.copy(completed = !it.completed) else it 
        }
    }
    
    div {
        h1 { +"Todo List" }
        
        div {
            input {
                value = input
                onChange = { event -> input = event.target.value }
                placeholder = "Enter todo"
            }
            button {
                onClick = { addTodo() }
                +"Add"
            }
        }
        
        ul {
            todos.forEach { todo ->
                li {
                    key = todo.id.toString()
                    style = jso {
                        textDecoration = if (todo.completed) "line-through" else "none"
                    }
                    onClick = { toggleTodo(todo.id) }
                    +todo.text
                }
            }
        }
    }
}

fun main() {
    val root = document.getElementById("root") ?: return
    createRoot(root).render(TodoApp.create())
}
```

---

## Node.js Development

### Setup for Node.js

```kotlin
// build.gradle.kts
kotlin {
    js {
        nodejs {
            // Node.js specific configuration
        }
        binaries.executable()
    }
}
```

### File System Operations

```kotlin
@JsModule("fs")
@JsNonModule
external object fs {
    fun readFileSync(path: String, encoding: String): String
    fun writeFileSync(path: String, data: String)
    fun existsSync(path: String): Boolean
    fun mkdirSync(path: String)
}

fun fileOperations() {
    // Read file
    val content = fs.readFileSync("data.txt", "utf8")
    console.log(content)
    
    // Write file
    fs.writeFileSync("output.txt", "Hello from Kotlin/JS")
    
    // Check existence
    if (fs.existsSync("config.json")) {
        console.log("Config file exists")
    }
}
```

### HTTP Server

```kotlin
@JsModule("http")
@JsNonModule
external object http {
    fun createServer(handler: (IncomingMessage, ServerResponse) -> Unit): Server
}

external interface Server {
    fun listen(port: Int, callback: () -> Unit)
}

external interface IncomingMessage {
    val url: String
    val method: String
}

external interface ServerResponse {
    fun writeHead(statusCode: Int, headers: dynamic)
    fun end(data: String)
}

fun createHttpServer() {
    val server = http.createServer { req, res ->
        res.writeHead(200, js("{\"Content-Type\": \"text/plain\"}"))
        res.end("Hello from Kotlin/JS Server!")
    }
    
    server.listen(3000) {
        console.log("Server running on port 3000")
    }
}
```

### Express.js

```kotlin
@JsModule("express")
@JsNonModule
external fun express(): Express

external interface Express {
    fun get(path: String, handler: (Request, Response) -> Unit)
    fun post(path: String, handler: (Request, Response) -> Unit)
    fun listen(port: Int, callback: () -> Unit)
    fun use(middleware: dynamic)
}

external interface Request {
    val params: dynamic
    val query: dynamic
    val body: dynamic
}

external interface Response {
    fun json(data: Any)
    fun send(data: String)
    fun status(code: Int): Response
}

fun createExpressApp() {
    val app = express()
    
    app.get("/") { req, res ->
        res.send("Hello from Express!")
    }
    
    app.get("/api/users/:id") { req, res ->
        val userId = req.params.id
        res.json(js("{id: userId, name: 'User'}"))
    }
    
    app.post("/api/users") { req, res ->
        val user = req.body
        console.log("Creating user:", user)
        res.status(201).json(user)
    }
    
    app.listen(3000) {
        console.log("Express server running on port 3000")
    }
}
```

---

## Real-World Projects

### Project 1: Weather Dashboard

```kotlin
data class Weather(
    val city: String,
    val temperature: Double,
    val condition: String,
    val humidity: Int
)

suspend fun fetchWeather(city: String): Weather {
    val url = "https://api.openweathermap.org/data/2.5/weather?q=$city&appid=YOUR_KEY"
    val response = window.fetch(url).await()
    val data = response.json().await()
    
    return Weather(
        city = data.name as String,
        temperature = (data.main.temp as Double) - 273.15,
        condition = data.weather[0].main as String,
        humidity = data.main.humidity as Int
    )
}

val WeatherDashboard = FC<Props> {
    var city by useState("London")
    var weather by useState<Weather?>(null)
    var loading by useState(false)
    
    val loadWeather = {
        MainScope().launch {
            loading = true
            weather = fetchWeather(city)
            loading = false
        }
    }
    
    div {
        className = ClassName("weather-dashboard")
        
        h1 { +"Weather Dashboard" }
        
        div {
            input {
                value = city
                onChange = { event -> city = event.target.value }
            }
            button {
                onClick = { loadWeather() }
                +"Get Weather"
            }
        }
        
        weather?.let { w ->
            div {
                className = ClassName("weather-info")
                h2 { +w.city }
                p { +"Temperature: ${w.temperature.toInt()}°C" }
                p { +"Condition: ${w.condition}" }
                p { +"Humidity: ${w.humidity}%" }
            }
        }
        
        if (loading) {
            div { +"Loading..." }
        }
    }
}
```

### Project 2: REST API Client

```kotlin
class ApiClient(private val baseUrl: String) {
    suspend fun get(endpoint: String): dynamic {
        val response = window.fetch("$baseUrl$endpoint").await()
        return response.json().await()
    }
    
    suspend fun post(endpoint: String, data: Any): dynamic {
        val response = window.fetch("$baseUrl$endpoint", RequestInit(
            method = "POST",
            headers = js("{\"Content-Type\": \"application/json\"}"),
            body = JSON.stringify(data)
        )).await()
        return response.json().await()
    }
    
    suspend fun put(endpoint: String, data: Any): dynamic {
        val response = window.fetch("$baseUrl$endpoint", RequestInit(
            method = "PUT",
            headers = js("{\"Content-Type\": \"application/json\"}"),
            body = JSON.stringify(data)
        )).await()
        return response.json().await()
    }
    
    suspend fun delete(endpoint: String): dynamic {
        val response = window.fetch("$baseUrl$endpoint", RequestInit(
            method = "DELETE"
        )).await()
        return response.json().await()
    }
}

// Usage
val api = ApiClient("https://api.example.com")

MainScope().launch {
    val users = api.get("/users")
    console.log(users)
    
    val newUser = api.post("/users", mapOf(
        "name" to "Alice",
        "email" to "alice@example.com"
    ))
    console.log(newUser)
}
```

### Project 3: Local Storage Manager

```kotlin
object StorageManager {
    fun save(key: String, value: Any) {
        val json = JSON.stringify(value)
        window.localStorage.setItem(key, json)
    }
    
    inline fun <reified T> load(key: String): T? {
        val json = window.localStorage.getItem(key) ?: return null
        return JSON.parse<T>(json)
    }
    
    fun remove(key: String) {
        window.localStorage.removeItem(key)
    }
    
    fun clear() {
        window.localStorage.clear()
    }
    
    fun keys(): List<String> {
        return (0 until window.localStorage.length).map {
            window.localStorage.key(it) ?: ""
        }
    }
}

// Usage
data class UserSettings(val theme: String, val language: String)

val settings = UserSettings("dark", "en")
StorageManager.save("settings", settings)

val loaded = StorageManager.load<UserSettings>("settings")
console.log(loaded?.theme)
```

---

## Best Practices

### Type Safety

```kotlin
// Use external interfaces instead of dynamic
external interface User {
    val id: Int
    val name: String
    val email: String
}

// Better than: val user: dynamic = ...
suspend fun getUser(id: Int): User {
    val response = window.fetch("/api/users/$id").await()
    return response.json().await().unsafeCast<User>()
}
```

### Null Safety

```kotlin
// Safe DOM access
fun safeAccess() {
    val element = document.getElementById("myId") as? HTMLElement
    element?.let {
        it.textContent = "Updated"
        it.style.color = "blue"
    }
}

// Elvis operator
val text = element?.textContent ?: "Default"
```

### Error Handling

```kotlin
suspend fun fetchWithErrorHandling(url: String): Result<String> {
    return try {
        val response = window.fetch(url).await()
        if (response.ok) {
            Result.success(response.text().await())
        } else {
            Result.failure(Exception("HTTP ${response.status}"))
        }
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// Usage
MainScope().launch {
    fetchWithErrorHandling("/api/data")
        .onSuccess { data -> console.log(data) }
        .onFailure { error -> console.error(error.message) }
}
```

### Code Organization

```kotlin
// Separate concerns
object ApiService {
    suspend fun fetchUsers() = /* ... */
}

object UIComponents {
    fun createButton(text: String, onClick: () -> Unit) = /* ... */
}

object Utils {
    fun formatDate(date: Date) = /* ... */
}
```

### Performance

```kotlin
// Debounce input
fun debounce(delay: Int, action: () -> Unit): () -> Unit {
    var timeoutId: Int? = null
    return {
        timeoutId?.let { window.clearTimeout(it) }
        timeoutId = window.setTimeout(action, delay)
    }
}

// Usage
val search = debounce(300) {
    performSearch(input.value)
}

input.addEventListener("input", { search() })
```

---

## Summary

### Key Takeaways

**Kotlin/JS Features:**
- ✅ Type-safe JavaScript
- ✅ Seamless JS interop
- ✅ Coroutines for async
- ✅ React integration
- ✅ Node.js support

**Best Practices:**
- Use external interfaces over dynamic
- Leverage null-safety
- Handle errors properly
- Organize code modularly
- Optimize performance

### Learning Path

1. **Beginner**: Basic interop, DOM manipulation
2. **Intermediate**: React components, async operations
3. **Advanced**: Full-stack apps, Node.js servers
4. **Professional**: Production apps, optimization

### Resources

- **Kotlin/JS Docs**: https://kotlinlang.org/docs/js-overview.html
- **Kotlin Wrappers**: https://github.com/JetBrains/kotlin-wrappers
- **Examples**: https://github.com/Kotlin/kotlin-examples

---

**You're now ready to build professional web applications with Kotlin/JS!** 🚀
