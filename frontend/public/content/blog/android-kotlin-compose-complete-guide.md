---
title: "Android Jetpack Compose - Complete Guide from Beginner to Professional"
date: "2024-12-13"
category: "Android Development"
tags: ["Android", "Kotlin", "Jetpack Compose", "UI", "Mobile Development"]
---

# Android Jetpack Compose - Complete Guide

## Overview

**Jetpack Compose** is Android's modern toolkit for building native UI. It simplifies and accelerates UI development with less code, powerful tools, and intuitive Kotlin APIs.

### Key Features
- **Declarative UI**: Describe what your UI should look like
- **Less Code**: 40% less code than XML layouts
- **Kotlin-First**: Built specifically for Kotlin
- **Reactive**: UI automatically updates when state changes
- **Material Design 3**: Built-in Material Design components
- **Preview**: See UI changes instantly without running the app

---

## Getting Started

### 1. Setup Android Studio

```kotlin
// build.gradle.kts (Project level)
plugins {
    id("com.android.application") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
}

// build.gradle.kts (App level)
android {
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.example.composeapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.01.00")
    implementation(composeBom)
    
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")
    implementation("androidx.navigation:navigation-compose:2.7.6")
    
    debugImplementation("androidx.compose.ui:ui-tooling")
}
```

### 2. First Compose App

```kotlin
package com.example.composeapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApp()
        }
    }
}

@Composable
fun MyApp() {
    MaterialTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            Greeting("Android")
        }
    }
}

@Composable
fun Greeting(name: String) {
    Text(
        text = "Hello $name!",
        modifier = Modifier.padding(16.dp),
        style = MaterialTheme.typography.headlineMedium
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MyApp()
}
```

---

## Core Concepts

### 1. Composable Functions

```kotlin
// Basic composable
@Composable
fun SimpleText() {
    Text("Hello World")
}

// Composable with parameters
@Composable
fun CustomText(text: String, color: Color = Color.Black) {
    Text(
        text = text,
        color = color,
        fontSize = 20.sp
    )
}

// Composable with content lambda
@Composable
fun Card(content: @Composable () -> Unit) {
    Surface(
        modifier = Modifier.padding(8.dp),
        shadowElevation = 4.dp,
        shape = RoundedCornerShape(8.dp)
    ) {
        Box(modifier = Modifier.padding(16.dp)) {
            content()
        }
    }
}

// Usage
Card {
    Text("Content inside card")
}
```

### 2. State Management

```kotlin
// Remember state
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Count: $count", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}

// State hoisting
@Composable
fun CounterWithHoisting() {
    var count by remember { mutableStateOf(0) }
    CounterDisplay(
        count = count,
        onIncrement = { count++ },
        onDecrement = { count-- }
    )
}

@Composable
fun CounterDisplay(
    count: Int,
    onIncrement: () -> Unit,
    onDecrement: () -> Unit
) {
    Row(
        modifier = Modifier.padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Button(onClick = onDecrement) { Text("-") }
        Text("$count", style = MaterialTheme.typography.headlineMedium)
        Button(onClick = onIncrement) { Text("+") }
    }
}

// ViewModel state
class CounterViewModel : ViewModel() {
    private val _count = MutableStateFlow(0)
    val count: StateFlow<Int> = _count.asStateFlow()
    
    fun increment() {
        _count.value++
    }
    
    fun decrement() {
        _count.value--
    }
}

@Composable
fun CounterScreen(viewModel: CounterViewModel = viewModel()) {
    val count by viewModel.count.collectAsState()
    
    CounterDisplay(
        count = count,
        onIncrement = { viewModel.increment() },
        onDecrement = { viewModel.decrement() }
    )
}
```

### 3. Layouts

```kotlin
// Column - Vertical layout
@Composable
fun VerticalLayout() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Item 1")
        Text("Item 2")
        Text("Item 3")
    }
}

// Row - Horizontal layout
@Composable
fun HorizontalLayout() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("Left")
        Text("Center")
        Text("Right")
    }
}

// Box - Stack layout
@Composable
fun StackLayout() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Image(
            painter = painterResource(R.drawable.background),
            contentDescription = null,
            modifier = Modifier.fillMaxSize()
        )
        Text(
            "Overlay Text",
            color = Color.White,
            fontSize = 24.sp
        )
    }
}

// LazyColumn - Scrollable list
@Composable
fun ScrollableList(items: List<String>) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(items) { item ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(4.dp)
            ) {
                Text(
                    text = item,
                    modifier = Modifier.padding(16.dp)
                )
            }
        }
    }
}

// LazyRow - Horizontal scrollable
@Composable
fun HorizontalScrollableList(items: List<String>) {
    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(horizontal = 16.dp)
    ) {
        items(items) { item ->
            Card {
                Text(
                    text = item,
                    modifier = Modifier.padding(16.dp)
                )
            }
        }
    }
}
```

### 4. Modifiers

```kotlin
@Composable
fun ModifierExamples() {
    Column {
        // Size modifiers
        Box(
            modifier = Modifier
                .size(100.dp)
                .background(Color.Blue)
        )
        
        // Padding and margin
        Text(
            "Padded Text",
            modifier = Modifier
                .padding(16.dp)
                .background(Color.LightGray)
                .padding(8.dp)
        )
        
        // Click handling
        Text(
            "Clickable",
            modifier = Modifier
                .clickable { /* Handle click */ }
                .padding(16.dp)
        )
        
        // Border and shape
        Box(
            modifier = Modifier
                .size(100.dp)
                .border(2.dp, Color.Red, RoundedCornerShape(8.dp))
                .background(Color.Yellow, RoundedCornerShape(8.dp))
        )
        
        // Weight in Row/Column
        Row(modifier = Modifier.fillMaxWidth()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(50.dp)
                    .background(Color.Red)
            )
            Box(
                modifier = Modifier
                    .weight(2f)
                    .height(50.dp)
                    .background(Color.Blue)
            )
        }
    }
}
```

---

## Material Design 3 Components

### 1. Buttons

```kotlin
@Composable
fun ButtonExamples() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Filled button
        Button(onClick = { /* Action */ }) {
            Text("Filled Button")
        }
        
        // Outlined button
        OutlinedButton(onClick = { /* Action */ }) {
            Text("Outlined Button")
        }
        
        // Text button
        TextButton(onClick = { /* Action */ }) {
            Text("Text Button")
        }
        
        // Icon button
        IconButton(onClick = { /* Action */ }) {
            Icon(Icons.Default.Favorite, contentDescription = "Favorite")
        }
        
        // Floating action button
        FloatingActionButton(onClick = { /* Action */ }) {
            Icon(Icons.Default.Add, contentDescription = "Add")
        }
        
        // Extended FAB
        ExtendedFloatingActionButton(
            onClick = { /* Action */ },
            icon = { Icon(Icons.Default.Edit, contentDescription = null) },
            text = { Text("Edit") }
        )
    }
}
```

### 2. Text Fields

```kotlin
@Composable
fun TextFieldExamples() {
    var text by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Basic text field
        TextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("Label") },
            placeholder = { Text("Placeholder") }
        )
        
        // Outlined text field
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            label = { Text("Email") },
            leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
            singleLine = true
        )
        
        // Password field
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = if (passwordVisible) 
                VisualTransformation.None 
            else 
                PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                    Icon(
                        if (passwordVisible) Icons.Default.Visibility 
                        else Icons.Default.VisibilityOff,
                        contentDescription = null
                    )
                }
            }
        )
    }
}
```

### 3. Cards and Surfaces

```kotlin
@Composable
fun CardExamples() {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Basic card
        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                "Basic Card",
                modifier = Modifier.padding(16.dp)
            )
        }
        
        // Elevated card
        ElevatedCard(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(8.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Elevated Card", style = MaterialTheme.typography.titleLarge)
                Text("With elevation", style = MaterialTheme.typography.bodyMedium)
            }
        }
        
        // Outlined card
        OutlinedCard(
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                "Outlined Card",
                modifier = Modifier.padding(16.dp)
            )
        }
        
        // Clickable card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { /* Handle click */ }
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Info, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Clickable Card")
            }
        }
    }
}
```


### 4. Dialogs and Sheets

```kotlin
@Composable
fun DialogExamples() {
    var showDialog by remember { mutableStateOf(false) }
    var showBottomSheet by remember { mutableStateOf(false) }
    
    Column {
        Button(onClick = { showDialog = true }) {
            Text("Show Dialog")
        }
        
        Button(onClick = { showBottomSheet = true }) {
            Text("Show Bottom Sheet")
        }
    }
    
    // Alert Dialog
    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Alert Dialog") },
            text = { Text("This is an alert dialog message") },
            confirmButton = {
                TextButton(onClick = { showDialog = false }) {
                    Text("OK")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
    
    // Bottom Sheet
    if (showBottomSheet) {
        ModalBottomSheet(
            onDismissRequest = { showBottomSheet = false }
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Bottom Sheet", style = MaterialTheme.typography.titleLarge)
                Spacer(modifier = Modifier.height(16.dp))
                Text("Content goes here")
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}
```

---

## Navigation

### 1. Setup Navigation

```kotlin
// build.gradle.kts
dependencies {
    implementation("androidx.navigation:navigation-compose:2.7.6")
}

// Navigation setup
sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Profile : Screen("profile/{userId}") {
        fun createRoute(userId: String) = "profile/$userId"
    }
    object Settings : Screen("settings")
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                onNavigateToProfile = { userId ->
                    navController.navigate(Screen.Profile.createRoute(userId))
                }
            )
        }
        
        composable(
            route = Screen.Profile.route,
            arguments = listOf(
                navArgument("userId") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId")
            ProfileScreen(
                userId = userId,
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        composable(Screen.Settings.route) {
            SettingsScreen()
        }
    }
}
```

### 2. Bottom Navigation

```kotlin
@Composable
fun MainScreen() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route
                
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = null) },
                    label = { Text("Home") },
                    selected = currentRoute == Screen.Home.route,
                    onClick = {
                        navController.navigate(Screen.Home.route) {
                            popUpTo(navController.graph.startDestinationId)
                            launchSingleTop = true
                        }
                    }
                )
                
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = null) },
                    label = { Text("Profile") },
                    selected = currentRoute?.startsWith("profile") == true,
                    onClick = {
                        navController.navigate(Screen.Profile.createRoute("me"))
                    }
                )
                
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Settings, contentDescription = null) },
                    label = { Text("Settings") },
                    selected = currentRoute == Screen.Settings.route,
                    onClick = {
                        navController.navigate(Screen.Settings.route)
                    }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            // Navigation graph
        }
    }
}
```

---

## Advanced State Management

### 1. ViewModel with StateFlow

```kotlin
data class UiState(
    val isLoading: Boolean = false,
    val data: List<String> = emptyList(),
    val error: String? = null
)

class MyViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    fun loadData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            try {
                val data = repository.fetchData()
                _uiState.update { it.copy(isLoading = false, data = data) }
            } catch (e: Exception) {
                _uiState.update { 
                    it.copy(isLoading = false, error = e.message) 
                }
            }
        }
    }
}

@Composable
fun MyScreen(viewModel: MyViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.loadData()
    }
    
    when {
        uiState.isLoading -> LoadingScreen()
        uiState.error != null -> ErrorScreen(uiState.error!!)
        else -> DataScreen(uiState.data)
    }
}
```

### 2. Side Effects

```kotlin
@Composable
fun SideEffectExamples() {
    // LaunchedEffect - Run coroutine when key changes
    LaunchedEffect(key1 = Unit) {
        // Runs once when composable enters composition
        println("Component mounted")
    }
    
    // DisposableEffect - Cleanup when leaving composition
    DisposableEffect(Unit) {
        val listener = createListener()
        registerListener(listener)
        
        onDispose {
            unregisterListener(listener)
        }
    }
    
    // SideEffect - Run on every recomposition
    SideEffect {
        // Runs after every successful recomposition
        analytics.trackScreenView()
    }
    
    // rememberCoroutineScope - Get scope for manual launches
    val scope = rememberCoroutineScope()
    Button(onClick = {
        scope.launch {
            // Launch coroutine from event handler
        }
    }) {
        Text("Click me")
    }
}
```

---

## Complete App Example: Task Manager

### 1. Data Layer

```kotlin
// Model
data class Task(
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val description: String,
    val isCompleted: Boolean = false,
    val priority: Priority = Priority.MEDIUM,
    val createdAt: Long = System.currentTimeMillis()
)

enum class Priority {
    LOW, MEDIUM, HIGH
}

// Repository
interface TaskRepository {
    suspend fun getTasks(): List<Task>
    suspend fun getTask(id: String): Task?
    suspend fun addTask(task: Task)
    suspend fun updateTask(task: Task)
    suspend fun deleteTask(id: String)
}

class TaskRepositoryImpl : TaskRepository {
    private val tasks = mutableListOf<Task>()
    
    override suspend fun getTasks(): List<Task> = tasks.toList()
    
    override suspend fun getTask(id: String): Task? = 
        tasks.find { it.id == id }
    
    override suspend fun addTask(task: Task) {
        tasks.add(task)
    }
    
    override suspend fun updateTask(task: Task) {
        val index = tasks.indexOfFirst { it.id == task.id }
        if (index != -1) {
            tasks[index] = task
        }
    }
    
    override suspend fun deleteTask(id: String) {
        tasks.removeIf { it.id == id }
    }
}
```

### 2. ViewModel

```kotlin
data class TaskListUiState(
    val tasks: List<Task> = emptyList(),
    val isLoading: Boolean = false,
    val filter: TaskFilter = TaskFilter.ALL
)

enum class TaskFilter {
    ALL, ACTIVE, COMPLETED
}

class TaskListViewModel(
    private val repository: TaskRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(TaskListUiState())
    val uiState: StateFlow<TaskListUiState> = _uiState.asStateFlow()
    
    init {
        loadTasks()
    }
    
    fun loadTasks() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            
            try {
                val tasks = repository.getTasks()
                _uiState.update { 
                    it.copy(
                        tasks = filterTasks(tasks, it.filter),
                        isLoading = false
                    ) 
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false) }
            }
        }
    }
    
    fun toggleTaskCompletion(taskId: String) {
        viewModelScope.launch {
            repository.getTask(taskId)?.let { task ->
                repository.updateTask(task.copy(isCompleted = !task.isCompleted))
                loadTasks()
            }
        }
    }
    
    fun deleteTask(taskId: String) {
        viewModelScope.launch {
            repository.deleteTask(taskId)
            loadTasks()
        }
    }
    
    fun setFilter(filter: TaskFilter) {
        _uiState.update { 
            it.copy(
                filter = filter,
                tasks = filterTasks(repository.getTasks(), filter)
            )
        }
    }
    
    private fun filterTasks(tasks: List<Task>, filter: TaskFilter): List<Task> {
        return when (filter) {
            TaskFilter.ALL -> tasks
            TaskFilter.ACTIVE -> tasks.filter { !it.isCompleted }
            TaskFilter.COMPLETED -> tasks.filter { it.isCompleted }
        }
    }
}
```

### 3. UI Components

```kotlin
@Composable
fun TaskListScreen(
    viewModel: TaskListViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val navController = rememberNavController()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Task Manager") },
                actions = {
                    FilterMenu(
                        currentFilter = uiState.filter,
                        onFilterSelected = { viewModel.setFilter(it) }
                    )
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navController.navigate("add_task") }
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Task")
            }
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            LoadingScreen()
        } else if (uiState.tasks.isEmpty()) {
            EmptyTasksScreen()
        } else {
            TaskList(
                tasks = uiState.tasks,
                onTaskClick = { task ->
                    navController.navigate("task_detail/${task.id}")
                },
                onTaskToggle = { taskId ->
                    viewModel.toggleTaskCompletion(taskId)
                },
                onTaskDelete = { taskId ->
                    viewModel.deleteTask(taskId)
                },
                modifier = Modifier.padding(paddingValues)
            )
        }
    }
}

@Composable
fun TaskList(
    tasks: List<Task>,
    onTaskClick: (Task) -> Unit,
    onTaskToggle: (String) -> Unit,
    onTaskDelete: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(
            items = tasks,
            key = { it.id }
        ) { task ->
            TaskItem(
                task = task,
                onClick = { onTaskClick(task) },
                onToggle = { onTaskToggle(task.id) },
                onDelete = { onTaskDelete(task.id) }
            )
        }
    }
}

@Composable
fun TaskItem(
    task: Task,
    onClick: () -> Unit,
    onToggle: () -> Unit,
    onDelete: () -> Unit
) {
    var showDeleteDialog by remember { mutableStateOf(false) }
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = task.isCompleted,
                onCheckedChange = { onToggle() }
            )
            
            Spacer(modifier = Modifier.width(8.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.titleMedium,
                    textDecoration = if (task.isCompleted) 
                        TextDecoration.LineThrough 
                    else 
                        null
                )
                
                if (task.description.isNotEmpty()) {
                    Text(
                        text = task.description,
                        style = MaterialTheme.typography.bodySmall,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                
                PriorityBadge(priority = task.priority)
            }
            
            IconButton(onClick = { showDeleteDialog = true }) {
                Icon(
                    Icons.Default.Delete,
                    contentDescription = "Delete",
                    tint = MaterialTheme.colorScheme.error
                )
            }
        }
    }
    
    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Task") },
            text = { Text("Are you sure you want to delete this task?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        onDelete()
                        showDeleteDialog = false
                    }
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun PriorityBadge(priority: Priority) {
    val color = when (priority) {
        Priority.LOW -> Color.Green
        Priority.MEDIUM -> Color.Yellow
        Priority.HIGH -> Color.Red
    }
    
    Surface(
        color = color.copy(alpha = 0.2f),
        shape = RoundedCornerShape(4.dp)
    ) {
        Text(
            text = priority.name,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = color
        )
    }
}
```

### 4. Add/Edit Task Screen

```kotlin
@Composable
fun AddEditTaskScreen(
    taskId: String? = null,
    viewModel: AddEditTaskViewModel = viewModel(),
    onNavigateBack: () -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var priority by remember { mutableStateOf(Priority.MEDIUM) }
    var showPriorityMenu by remember { mutableStateOf(false) }
    
    LaunchedEffect(taskId) {
        taskId?.let {
            viewModel.loadTask(it)?.let { task ->
                title = task.title
                description = task.description
                priority = task.priority
            }
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (taskId == null) "Add Task" else "Edit Task") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Title") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 3,
                maxLines = 5
            )
            
            ExposedDropdownMenuBox(
                expanded = showPriorityMenu,
                onExpandedChange = { showPriorityMenu = it }
            ) {
                OutlinedTextField(
                    value = priority.name,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Priority") },
                    trailingIcon = {
                        Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                
                ExposedDropdownMenu(
                    expanded = showPriorityMenu,
                    onDismissRequest = { showPriorityMenu = false }
                ) {
                    Priority.values().forEach { p ->
                        DropdownMenuItem(
                            text = { Text(p.name) },
                            onClick = {
                                priority = p
                                showPriorityMenu = false
                            }
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.weight(1f))
            
            Button(
                onClick = {
                    viewModel.saveTask(
                        id = taskId,
                        title = title,
                        description = description,
                        priority = priority
                    )
                    onNavigateBack()
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = title.isNotBlank()
            ) {
                Text(if (taskId == null) "Add Task" else "Save Changes")
            }
        }
    }
}
```


---

## Animations

### 1. Basic Animations

```kotlin
@Composable
fun AnimationExamples() {
    // Animate visibility
    var visible by remember { mutableStateOf(true) }
    
    Column {
        Button(onClick = { visible = !visible }) {
            Text("Toggle")
        }
        
        AnimatedVisibility(visible = visible) {
            Text("Hello World!")
        }
        
        // Animate content size
        var expanded by remember { mutableStateOf(false) }
        
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .animateContentSize()
                .clickable { expanded = !expanded }
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Click to expand")
                if (expanded) {
                    Text("Additional content that appears with animation")
                }
            }
        }
    }
}

@Composable
fun ValueAnimations() {
    var targetValue by remember { mutableStateOf(0f) }
    
    // Animate float value
    val animatedValue by animateFloatAsState(
        targetValue = targetValue,
        animationSpec = tween(durationMillis = 1000)
    )
    
    // Animate color
    val animatedColor by animateColorAsState(
        targetValue = if (targetValue > 0.5f) Color.Green else Color.Red
    )
    
    Column {
        Box(
            modifier = Modifier
                .size(100.dp)
                .scale(animatedValue)
                .background(animatedColor)
        )
        
        Slider(
            value = targetValue,
            onValueChange = { targetValue = it }
        )
    }
}

@Composable
fun TransitionAnimations() {
    var currentState by remember { mutableStateOf(BoxState.Small) }
    val transition = updateTransition(currentState, label = "box transition")
    
    val size by transition.animateDp(label = "size") { state ->
        when (state) {
            BoxState.Small -> 50.dp
            BoxState.Large -> 150.dp
        }
    }
    
    val color by transition.animateColor(label = "color") { state ->
        when (state) {
            BoxState.Small -> Color.Blue
            BoxState.Large -> Color.Red
        }
    }
    
    Column {
        Box(
            modifier = Modifier
                .size(size)
                .background(color)
                .clickable {
                    currentState = when (currentState) {
                        BoxState.Small -> BoxState.Large
                        BoxState.Large -> BoxState.Small
                    }
                }
        )
    }
}

enum class BoxState { Small, Large }
```

### 2. Advanced Animations

```kotlin
@Composable
fun InfiniteAnimation() {
    val infiniteTransition = rememberInfiniteTransition()
    
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )
    
    Icon(
        Icons.Default.Refresh,
        contentDescription = "Loading",
        modifier = Modifier.rotate(rotation)
    )
}

@Composable
fun SwipeToDeleteAnimation(
    onDelete: () -> Unit,
    content: @Composable () -> Unit
) {
    var offsetX by remember { mutableStateOf(0f) }
    val maxSwipe = -300f
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .offset { IntOffset(offsetX.roundToInt(), 0) }
            .pointerInput(Unit) {
                detectHorizontalDragGestures(
                    onDragEnd = {
                        if (offsetX < maxSwipe / 2) {
                            onDelete()
                        } else {
                            offsetX = 0f
                        }
                    },
                    onHorizontalDrag = { _, dragAmount ->
                        offsetX = (offsetX + dragAmount).coerceIn(maxSwipe, 0f)
                    }
                )
            }
    ) {
        // Delete background
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Red),
            contentAlignment = Alignment.CenterEnd
        ) {
            Icon(
                Icons.Default.Delete,
                contentDescription = "Delete",
                tint = Color.White,
                modifier = Modifier.padding(16.dp)
            )
        }
        
        // Content
        content()
    }
}
```

---

## Theming and Styling

### 1. Custom Theme

```kotlin
// Color.kt
val Purple80 = Color(0xFFD0BCFF)
val PurpleGrey80 = Color(0xFFCCC2DC)
val Pink80 = Color(0xFFEFB8C8)

val Purple40 = Color(0xFF6650a4)
val PurpleGrey40 = Color(0xFF625b71)
val Pink40 = Color(0xFF7D5260)

private val DarkColorScheme = darkColorScheme(
    primary = Purple80,
    secondary = PurpleGrey80,
    tertiary = Pink80
)

private val LightColorScheme = lightColorScheme(
    primary = Purple40,
    secondary = PurpleGrey40,
    tertiary = Pink40
)

// Theme.kt
@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) 
            else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

// Typography.kt
val Typography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 57.sp,
        lineHeight = 64.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp
    )
)
```

### 2. Custom Shapes and Dimensions

```kotlin
// Dimensions.kt
object Dimensions {
    val paddingSmall = 8.dp
    val paddingMedium = 16.dp
    val paddingLarge = 24.dp
    
    val iconSizeSmall = 16.dp
    val iconSizeMedium = 24.dp
    val iconSizeLarge = 32.dp
    
    val cornerRadiusSmall = 4.dp
    val cornerRadiusMedium = 8.dp
    val cornerRadiusLarge = 16.dp
}

// Shapes.kt
val Shapes = Shapes(
    small = RoundedCornerShape(4.dp),
    medium = RoundedCornerShape(8.dp),
    large = RoundedCornerShape(16.dp)
)

// Usage
@Composable
fun StyledComponents() {
    Column(
        modifier = Modifier.padding(Dimensions.paddingMedium),
        verticalArrangement = Arrangement.spacedBy(Dimensions.paddingSmall)
    ) {
        Card(
            shape = MaterialTheme.shapes.medium,
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer
            )
        ) {
            Text(
                "Styled Card",
                modifier = Modifier.padding(Dimensions.paddingMedium),
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
        }
    }
}
```

---

## Testing

### 1. UI Tests

```kotlin
class TaskListScreenTest {
    
    @get:Rule
    val composeTestRule = createComposeRule()
    
    @Test
    fun taskList_displaysCorrectly() {
        val tasks = listOf(
            Task(id = "1", title = "Task 1", description = "Description 1"),
            Task(id = "2", title = "Task 2", description = "Description 2")
        )
        
        composeTestRule.setContent {
            TaskList(
                tasks = tasks,
                onTaskClick = {},
                onTaskToggle = {},
                onTaskDelete = {}
            )
        }
        
        composeTestRule.onNodeWithText("Task 1").assertIsDisplayed()
        composeTestRule.onNodeWithText("Task 2").assertIsDisplayed()
    }
    
    @Test
    fun taskItem_clickTriggersCallback() {
        var clicked = false
        val task = Task(id = "1", title = "Test Task", description = "Test")
        
        composeTestRule.setContent {
            TaskItem(
                task = task,
                onClick = { clicked = true },
                onToggle = {},
                onDelete = {}
            )
        }
        
        composeTestRule.onNodeWithText("Test Task").performClick()
        assert(clicked)
    }
    
    @Test
    fun checkbox_togglesTaskCompletion() {
        var toggled = false
        val task = Task(id = "1", title = "Test", description = "")
        
        composeTestRule.setContent {
            TaskItem(
                task = task,
                onClick = {},
                onToggle = { toggled = true },
                onDelete = {}
            )
        }
        
        composeTestRule.onNode(hasClickAction() and hasContentDescription("Checkbox"))
            .performClick()
        
        assert(toggled)
    }
}
```

### 2. ViewModel Tests

```kotlin
class TaskListViewModelTest {
    
    private lateinit var repository: TaskRepository
    private lateinit var viewModel: TaskListViewModel
    
    @Before
    fun setup() {
        repository = FakeTaskRepository()
        viewModel = TaskListViewModel(repository)
    }
    
    @Test
    fun `loadTasks updates uiState with tasks`() = runTest {
        val tasks = listOf(
            Task(id = "1", title = "Task 1", description = ""),
            Task(id = "2", title = "Task 2", description = "")
        )
        repository.addTask(tasks[0])
        repository.addTask(tasks[1])
        
        viewModel.loadTasks()
        
        val uiState = viewModel.uiState.value
        assertEquals(2, uiState.tasks.size)
        assertFalse(uiState.isLoading)
    }
    
    @Test
    fun `toggleTaskCompletion updates task status`() = runTest {
        val task = Task(id = "1", title = "Test", description = "", isCompleted = false)
        repository.addTask(task)
        
        viewModel.toggleTaskCompletion("1")
        
        val updatedTask = repository.getTask("1")
        assertTrue(updatedTask?.isCompleted == true)
    }
    
    @Test
    fun `setFilter filters tasks correctly`() = runTest {
        repository.addTask(Task(id = "1", title = "Active", description = "", isCompleted = false))
        repository.addTask(Task(id = "2", title = "Completed", description = "", isCompleted = true))
        
        viewModel.setFilter(TaskFilter.ACTIVE)
        
        val uiState = viewModel.uiState.value
        assertEquals(1, uiState.tasks.size)
        assertEquals("Active", uiState.tasks[0].title)
    }
}

class FakeTaskRepository : TaskRepository {
    private val tasks = mutableListOf<Task>()
    
    override suspend fun getTasks() = tasks.toList()
    override suspend fun getTask(id: String) = tasks.find { it.id == id }
    override suspend fun addTask(task: Task) { tasks.add(task) }
    override suspend fun updateTask(task: Task) {
        val index = tasks.indexOfFirst { it.id == task.id }
        if (index != -1) tasks[index] = task
    }
    override suspend fun deleteTask(id: String) { tasks.removeIf { it.id == id } }
}
```

---

## Performance Optimization

### 1. Remember and Keys

```kotlin
@Composable
fun OptimizedList(items: List<Item>) {
    // Use keys to help Compose identify items
    LazyColumn {
        items(
            items = items,
            key = { item -> item.id }  // Stable key
        ) { item ->
            ItemRow(item)
        }
    }
}

@Composable
fun ExpensiveCalculation(input: Int) {
    // Cache expensive calculations
    val result = remember(input) {
        performExpensiveCalculation(input)
    }
    
    Text("Result: $result")
}

@Composable
fun DerivedState(items: List<Item>) {
    // Derive state efficiently
    val filteredItems = remember(items) {
        items.filter { it.isActive }
    }
    
    // Or use derivedStateOf for observable state
    val count by remember {
        derivedStateOf { items.size }
    }
}
```

### 2. Lazy Layouts

```kotlin
@Composable
fun EfficientGrid(items: List<Item>) {
    LazyVerticalGrid(
        columns = GridCells.Adaptive(minSize = 128.dp),
        contentPadding = PaddingValues(8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(
            items = items,
            key = { it.id }
        ) { item ->
            ItemCard(item)
        }
    }
}

@Composable
fun StickyHeaders(groupedItems: Map<String, List<Item>>) {
    LazyColumn {
        groupedItems.forEach { (category, items) ->
            stickyHeader {
                CategoryHeader(category)
            }
            
            items(items, key = { it.id }) { item ->
                ItemRow(item)
            }
        }
    }
}
```

### 3. Avoid Recomposition

```kotlin
// Use stable types
@Immutable
data class User(val id: String, val name: String)

// Use @Stable for classes with mutable properties
@Stable
class UserState {
    var name by mutableStateOf("")
    var email by mutableStateOf("")
}

// Hoist lambdas
@Composable
fun ParentComposable() {
    val onClick = remember { { /* Handle click */ } }
    
    ChildComposable(onClick = onClick)
}

// Use CompositionLocal for deep passing
val LocalUser = compositionLocalOf<User> { error("No user provided") }

@Composable
fun App() {
    val user = remember { User("1", "Alice") }
    
    CompositionLocalProvider(LocalUser provides user) {
        DeepNestedComponent()
    }
}

@Composable
fun DeepNestedComponent() {
    val user = LocalUser.current
    Text("Hello ${user.name}")
}
```

---

## Best Practices

### 1. State Management
- Hoist state to the lowest common ancestor
- Use ViewModels for business logic
- Keep composables stateless when possible
- Use remember for UI state, ViewModel for app state

### 2. Performance
- Use keys in LazyColumn/LazyRow
- Avoid creating new lambdas in composition
- Use derivedStateOf for computed values
- Profile with Layout Inspector

### 3. Code Organization
- Separate UI from business logic
- Create reusable components
- Use sealed classes for UI states
- Follow single responsibility principle

### 4. Testing
- Write UI tests for user flows
- Test ViewModels independently
- Use fake repositories for testing
- Test edge cases and error states

---

## Resources

### Official Documentation
- [Jetpack Compose Docs](https://developer.android.com/jetpack/compose)
- [Compose Samples](https://github.com/android/compose-samples)
- [Compose Pathway](https://developer.android.com/courses/pathways/compose)

### Learning Resources
- [Compose Camp](https://developer.android.com/courses/compose-camp)
- [Compose Codelabs](https://developer.android.com/codelabs)
- [Now in Android App](https://github.com/android/nowinandroid)

### Community
- [Kotlin Slack #compose](https://kotlinlang.slack.com)
- [r/androiddev](https://reddit.com/r/androiddev)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/android-jetpack-compose)

---

## Congratulations!

You've completed the Android Jetpack Compose guide! You now know:

✅ Declarative UI fundamentals
✅ State management with ViewModels
✅ Navigation and routing
✅ Material Design 3 components
✅ Animations and gestures
✅ Testing strategies
✅ Performance optimization
✅ Building complete apps

**You're ready to build professional Android apps with Jetpack Compose!**

---

*"The future of Android UI is declarative."*

*Happy Composing! 🚀*
