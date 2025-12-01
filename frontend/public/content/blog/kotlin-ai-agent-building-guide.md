---
title: "Building AI Agents with Kotlin - Complete Guide"
date: "2024-12-13"
category: "AI"
tags: ["Kotlin", "AI", "Agents", "LLM", "Machine Learning", "OpenAI"]
---

# Building AI Agents with Kotlin - Complete Guide

## Overview

AI agents are autonomous systems that perceive their environment, make decisions, and take actions to achieve goals. Kotlin's concise syntax, coroutines, and type safety make it ideal for building robust AI agents.

### What is an AI Agent?

An AI agent consists of:
- **Perception**: Gathering information from environment
- **Decision Making**: Processing information and planning
- **Action**: Executing tasks based on decisions
- **Learning**: Improving from experience

---

## Agent Architecture

### 1. Basic Agent Structure

```kotlin
interface Agent {
    suspend fun perceive(input: String): Perception
    suspend fun decide(perception: Perception): Decision
    suspend fun act(decision: Decision): ActionResult
    suspend fun learn(result: ActionResult)
}

data class Perception(
    val context: String,
    val intent: Intent,
    val entities: Map<String, String>
)

sealed class Intent {
    object Query : Intent()
    object Command : Intent()
    object Conversation : Intent()
}

data class Decision(
    val action: Action,
    val parameters: Map<String, Any>,
    val confidence: Double
)

sealed class Action {
    object Search : Action()
    object Execute : Action()
    object Respond : Action()
}

data class ActionResult(
    val success: Boolean,
    val output: String,
    val metadata: Map<String, Any>
)
```

### 2. LLM-Powered Agent

```kotlin
class LLMAgent(
    private val llmClient: LLMClient,
    private val tools: List<Tool>
) : Agent {
    
    override suspend fun perceive(input: String): Perception {
        val prompt = """
            Analyze the following user input and extract:
            1. Intent (query/command/conversation)
            2. Key entities
            
            Input: $input
        """.trimIndent()
        
        val response = llmClient.complete(prompt)
        return parsePerception(response)
    }
    
    override suspend fun decide(perception: Perception): Decision {
        val availableTools = tools.joinToString("\n") { 
            "- ${it.name}: ${it.description}" 
        }
        
        val prompt = """
            Given the user intent and available tools, decide the best action.
            
            Intent: ${perception.intent}
            Context: ${perception.context}
            Entities: ${perception.entities}
            
            Available Tools:
            $availableTools
            
            Respond with the tool name and parameters in JSON format.
        """.trimIndent()
        
        val response = llmClient.complete(prompt)
        return parseDecision(response)
    }
    
    override suspend fun act(decision: Decision): ActionResult {
        val tool = tools.find { it.name == decision.action.toString() }
            ?: return ActionResult(false, "Tool not found", emptyMap())
        
        return tool.execute(decision.parameters)
    }
    
    override suspend fun learn(result: ActionResult) {
        // Store interaction for future improvement
        if (!result.success) {
            logFailure(result)
        }
    }
}
```

### 3. Tool System

```kotlin
interface Tool {
    val name: String
    val description: String
    val parameters: List<Parameter>
    suspend fun execute(params: Map<String, Any>): ActionResult
}

data class Parameter(
    val name: String,
    val type: String,
    val required: Boolean,
    val description: String
)

class SearchTool(
    private val searchEngine: SearchEngine
) : Tool {
    override val name = "search"
    override val description = "Search the web for information"
    override val parameters = listOf(
        Parameter("query", "string", true, "Search query"),
        Parameter("limit", "int", false, "Max results")
    )
    
    override suspend fun execute(params: Map<String, Any>): ActionResult {
        val query = params["query"] as? String 
            ?: return ActionResult(false, "Missing query", emptyMap())
        val limit = params["limit"] as? Int ?: 5
        
        val results = searchEngine.search(query, limit)
        return ActionResult(
            success = true,
            output = results.joinToString("\n") { it.title },
            metadata = mapOf("count" to results.size)
        )
    }
}

class CodeExecutionTool : Tool {
    override val name = "execute_code"
    override val description = "Execute code safely in sandbox"
    override val parameters = listOf(
        Parameter("code", "string", true, "Code to execute"),
        Parameter("language", "string", true, "Programming language")
    )
    
    override suspend fun execute(params: Map<String, Any>): ActionResult {
        val code = params["code"] as? String 
            ?: return ActionResult(false, "Missing code", emptyMap())
        val language = params["language"] as? String ?: "kotlin"
        
        return try {
            val output = executeSafely(code, language)
            ActionResult(true, output, mapOf("language" to language))
        } catch (e: Exception) {
            ActionResult(false, "Execution failed: ${e.message}", emptyMap())
        }
    }
    
    private suspend fun executeSafely(code: String, language: String): String {
        // Implement sandboxed execution
        return "Execution result"
    }
}
```

---

## LLM Integration

### 1. OpenAI Client

```kotlin
class OpenAIClient(
    private val apiKey: String,
    private val httpClient: HttpClient
) : LLMClient {
    
    private val baseUrl = "https://api.openai.com/v1"
    
    override suspend fun complete(
        prompt: String,
        model: String,
        temperature: Double
    ): String = withContext(Dispatchers.IO) {
        val response = httpClient.post("$baseUrl/chat/completions") {
            header("Authorization", "Bearer $apiKey")
            contentType(ContentType.Application.Json)
            setBody(ChatCompletionRequest(
                model = model,
                messages = listOf(
                    Message("system", "You are a helpful AI assistant."),
                    Message("user", prompt)
                ),
                temperature = temperature
            ))
        }
        
        response.body<ChatCompletionResponse>()
            .choices.first().message.content
    }
    
    override suspend fun streamComplete(
        prompt: String,
        model: String,
        onChunk: (String) -> Unit
    ) = withContext(Dispatchers.IO) {
        httpClient.preparePost("$baseUrl/chat/completions") {
            header("Authorization", "Bearer $apiKey")
            contentType(ContentType.Application.Json)
            setBody(ChatCompletionRequest(
                model = model,
                messages = listOf(Message("user", prompt)),
                stream = true
            ))
        }.execute { response ->
            val channel = response.bodyAsChannel()
            while (!channel.isClosedForRead) {
                val line = channel.readUTF8Line() ?: break
                if (line.startsWith("data: ")) {
                    val data = line.substring(6)
                    if (data != "[DONE]") {
                        val chunk = Json.decodeFromString<StreamChunk>(data)
                        chunk.choices.firstOrNull()?.delta?.content?.let(onChunk)
                    }
                }
            }
        }
    }
}

data class ChatCompletionRequest(
    val model: String,
    val messages: List<Message>,
    val temperature: Double = 0.7,
    val stream: Boolean = false
)

data class Message(
    val role: String,
    val content: String
)

data class ChatCompletionResponse(
    val choices: List<Choice>
)

data class Choice(
    val message: Message,
    val finishReason: String?
)
```

### 2. Function Calling

```kotlin
class FunctionCallingAgent(
    private val llmClient: OpenAIClient
) {
    
    suspend fun executeWithFunctions(
        userMessage: String,
        functions: List<FunctionDefinition>
    ): String {
        var messages = mutableListOf(
            Message("system", "You are a helpful assistant with access to functions."),
            Message("user", userMessage)
        )
        
        while (true) {
            val response = llmClient.completionWithFunctions(messages, functions)
            
            when {
                response.functionCall != null -> {
                    // Execute function
                    val result = executeFunction(
                        response.functionCall.name,
                        response.functionCall.arguments
                    )
                    
                    // Add function result to conversation
                    messages.add(Message(
                        role = "function",
                        name = response.functionCall.name,
                        content = result
                    ))
                }
                else -> {
                    // Final response
                    return response.message.content
                }
            }
        }
    }
    
    private suspend fun executeFunction(name: String, args: String): String {
        return when (name) {
            "get_weather" -> {
                val params = Json.decodeFromString<WeatherParams>(args)
                getWeather(params.location)
            }
            "search_web" -> {
                val params = Json.decodeFromString<SearchParams>(args)
                searchWeb(params.query)
            }
            else -> "Function not found"
        }
    }
}

data class FunctionDefinition(
    val name: String,
    val description: String,
    val parameters: JsonObject
)

data class FunctionCall(
    val name: String,
    val arguments: String
)
```

---

## Memory Systems

### 1. Short-Term Memory

```kotlin
class ConversationMemory(
    private val maxMessages: Int = 10
) {
    private val messages = mutableListOf<Message>()
    
    fun add(message: Message) {
        messages.add(message)
        if (messages.size > maxMessages) {
            messages.removeAt(0)
        }
    }
    
    fun getContext(): String {
        return messages.joinToString("\n") { 
            "${it.role}: ${it.content}" 
        }
    }
    
    fun clear() {
        messages.clear()
    }
}
```

### 2. Long-Term Memory (Vector Store)

```kotlin
class VectorMemory(
    private val embeddingClient: EmbeddingClient,
    private val vectorStore: VectorStore
) {
    
    suspend fun store(text: String, metadata: Map<String, Any>) {
        val embedding = embeddingClient.embed(text)
        vectorStore.insert(
            id = UUID.randomUUID().toString(),
            vector = embedding,
            text = text,
            metadata = metadata
        )
    }
    
    suspend fun recall(query: String, limit: Int = 5): List<Memory> {
        val queryEmbedding = embeddingClient.embed(query)
        return vectorStore.search(queryEmbedding, limit)
            .map { Memory(it.text, it.metadata, it.similarity) }
    }
    
    suspend fun forget(id: String) {
        vectorStore.delete(id)
    }
}

data class Memory(
    val content: String,
    val metadata: Map<String, Any>,
    val relevance: Double
)

interface EmbeddingClient {
    suspend fun embed(text: String): FloatArray
}

class OpenAIEmbedding(
    private val apiKey: String,
    private val httpClient: HttpClient
) : EmbeddingClient {
    
    override suspend fun embed(text: String): FloatArray {
        val response = httpClient.post("https://api.openai.com/v1/embeddings") {
            header("Authorization", "Bearer $apiKey")
            contentType(ContentType.Application.Json)
            setBody(mapOf(
                "model" to "text-embedding-ada-002",
                "input" to text
            ))
        }
        
        return response.body<EmbeddingResponse>()
            .data.first().embedding.toFloatArray()
    }
}
```

### 3. Semantic Memory

```kotlin
class SemanticMemory(
    private val vectorMemory: VectorMemory
) {
    
    suspend fun learn(fact: String, category: String) {
        vectorMemory.store(
            text = fact,
            metadata = mapOf(
                "type" to "fact",
                "category" to category,
                "timestamp" to System.currentTimeMillis()
            )
        )
    }
    
    suspend fun retrieve(query: String, category: String? = null): List<String> {
        val memories = vectorMemory.recall(query, 10)
        
        return memories
            .filter { category == null || it.metadata["category"] == category }
            .map { it.content }
    }
    
    suspend fun summarize(topic: String): String {
        val facts = retrieve(topic)
        return facts.joinToString("\n- ", prefix = "Facts about $topic:\n- ")
    }
}
```

---

## Planning and Reasoning

### 1. Chain of Thought

```kotlin
class ChainOfThoughtAgent(
    private val llmClient: LLMClient
) {
    
    suspend fun solve(problem: String): Solution {
        val prompt = """
            Solve this problem step by step. Show your reasoning.
            
            Problem: $problem
            
            Think through this carefully:
            1. What information do we have?
            2. What do we need to find?
            3. What steps should we take?
            4. Execute each step
            5. Verify the answer
        """.trimIndent()
        
        val reasoning = llmClient.complete(prompt)
        val steps = parseSteps(reasoning)
        
        return Solution(
            answer = extractAnswer(reasoning),
            reasoning = reasoning,
            steps = steps
        )
    }
    
    private fun parseSteps(reasoning: String): List<Step> {
        return reasoning.lines()
            .filter { it.matches(Regex("^\\d+\\..*")) }
            .map { Step(it.substringAfter(". ")) }
    }
    
    private fun extractAnswer(reasoning: String): String {
        return reasoning.lines()
            .lastOrNull { it.contains("answer", ignoreCase = true) }
            ?: "No answer found"
    }
}

data class Solution(
    val answer: String,
    val reasoning: String,
    val steps: List<Step>
)

data class Step(val description: String)
```

### 2. ReAct Pattern (Reasoning + Acting)

```kotlin
class ReActAgent(
    private val llmClient: LLMClient,
    private val tools: Map<String, Tool>
) {
    
    suspend fun execute(task: String): String {
        val history = mutableListOf<String>()
        var iteration = 0
        val maxIterations = 10
        
        history.add("Task: $task")
        
        while (iteration < maxIterations) {
            val prompt = buildPrompt(history)
            val response = llmClient.complete(prompt)
            
            when {
                response.startsWith("Thought:") -> {
                    history.add(response)
                    val thought = response.substringAfter("Thought:").trim()
                    println("💭 $thought")
                }
                response.startsWith("Action:") -> {
                    history.add(response)
                    val action = parseAction(response)
                    val observation = executeAction(action)
                    history.add("Observation: $observation")
                    println("🔧 ${action.tool}(${action.input})")
                    println("👁️ $observation")
                }
                response.startsWith("Answer:") -> {
                    val answer = response.substringAfter("Answer:").trim()
                    println("✅ $answer")
                    return answer
                }
            }
            
            iteration++
        }
        
        return "Max iterations reached"
    }
    
    private fun buildPrompt(history: List<String>): String {
        val toolDescriptions = tools.entries.joinToString("\n") {
            "- ${it.key}: ${it.value.description}"
        }
        
        return """
            You are an AI agent that can use tools to solve tasks.
            
            Available tools:
            $toolDescriptions
            
            Use this format:
            Thought: [your reasoning]
            Action: [tool_name] [input]
            Observation: [result from tool]
            ... (repeat Thought/Action/Observation as needed)
            Answer: [final answer]
            
            ${history.joinToString("\n")}
            
            What's your next step?
        """.trimIndent()
    }
    
    private fun parseAction(response: String): Action {
        val actionLine = response.lines()
            .first { it.startsWith("Action:") }
            .substringAfter("Action:").trim()
        
        val parts = actionLine.split(" ", limit = 2)
        return Action(tool = parts[0], input = parts.getOrNull(1) ?: "")
    }
    
    private suspend fun executeAction(action: Action): String {
        val tool = tools[action.tool] 
            ?: return "Tool '${action.tool}' not found"
        
        val result = tool.execute(mapOf("input" to action.input))
        return result.output
    }
}

data class Action(val tool: String, val input: String)
```

### 3. Multi-Agent System

```kotlin
class MultiAgentSystem {
    private val agents = mutableMapOf<String, Agent>()
    
    fun registerAgent(name: String, agent: Agent) {
        agents[name] = agent
    }
    
    suspend fun collaborate(task: String): String {
        val coordinator = agents["coordinator"] 
            ?: error("Coordinator agent required")
        
        // Coordinator breaks down task
        val subtasks = breakDownTask(task)
        
        // Distribute to specialized agents
        val results = subtasks.map { subtask ->
            val agentName = selectAgent(subtask)
            val agent = agents[agentName] ?: error("Agent $agentName not found")
            
            async {
                val perception = agent.perceive(subtask.description)
                val decision = agent.decide(perception)
                agent.act(decision)
            }
        }.awaitAll()
        
        // Synthesize results
        return synthesizeResults(results)
    }
    
    private suspend fun breakDownTask(task: String): List<Subtask> {
        // Use LLM to break down complex task
        return listOf(
            Subtask("research", "Research the topic"),
            Subtask("analyze", "Analyze findings"),
            Subtask("synthesize", "Create final output")
        )
    }
    
    private fun selectAgent(subtask: Subtask): String {
        return when (subtask.type) {
            "research" -> "researcher"
            "analyze" -> "analyzer"
            "synthesize" -> "writer"
            else -> "generalist"
        }
    }
    
    private fun synthesizeResults(results: List<ActionResult>): String {
        return results.joinToString("\n\n") { it.output }
    }
}

data class Subtask(
    val type: String,
    val description: String
)
```

---

## Advanced Features

### 1. Self-Improvement

```kotlin
class SelfImprovingAgent(
    private val baseAgent: Agent,
    private val feedbackStore: FeedbackStore
) : Agent by baseAgent {
    
    override suspend fun act(decision: Decision): ActionResult {
        val result = baseAgent.act(decision)
        
        // Collect feedback
        val feedback = collectFeedback(decision, result)
        feedbackStore.store(feedback)
        
        // Adjust behavior based on feedback
        if (shouldImprove()) {
            improve()
        }
        
        return result
    }
    
    private suspend fun collectFeedback(
        decision: Decision,
        result: ActionResult
    ): Feedback {
        return Feedback(
            decision = decision,
            result = result,
            success = result.success,
            timestamp = System.currentTimeMillis()
        )
    }
    
    private suspend fun shouldImprove(): Boolean {
        val recentFeedback = feedbackStore.getRecent(100)
        val successRate = recentFeedback.count { it.success }.toDouble() / recentFeedback.size
        return successRate < 0.8
    }
    
    private suspend fun improve() {
        val failures = feedbackStore.getFailures(50)
        val patterns = analyzeFailurePatterns(failures)
        adjustStrategy(patterns)
    }
}

data class Feedback(
    val decision: Decision,
    val result: ActionResult,
    val success: Boolean,
    val timestamp: Long
)
```

### 2. Autonomous Task Execution

```kotlin
class AutonomousAgent(
    private val llmClient: LLMClient,
    private val tools: List<Tool>,
    private val memory: VectorMemory
) {
    
    suspend fun achieveGoal(goal: String) {
        var currentGoal = goal
        val completedTasks = mutableListOf<String>()
        
        while (!isGoalAchieved(currentGoal, completedTasks)) {
            // Generate next task
            val nextTask = generateNextTask(currentGoal, completedTasks)
            println("📋 Next task: $nextTask")
            
            // Execute task
            val result = executeTask(nextTask)
            completedTasks.add(nextTask)
            
            // Store in memory
            memory.store(
                text = "Task: $nextTask\nResult: ${result.output}",
                metadata = mapOf("goal" to goal, "success" to result.success)
            )
            
            // Reflect on progress
            val reflection = reflect(goal, completedTasks)
            println("🤔 $reflection")
            
            if (!result.success) {
                println("❌ Task failed, adjusting approach...")
                currentGoal = adjustGoal(goal, completedTasks, result)
            }
        }
        
        println("✅ Goal achieved: $goal")
    }
    
    private suspend fun generateNextTask(
        goal: String,
        completed: List<String>
    ): String {
        val prompt = """
            Goal: $goal
            Completed tasks: ${completed.joinToString(", ")}
            
            What is the next logical task to achieve this goal?
            Respond with a single, specific task.
        """.trimIndent()
        
        return llmClient.complete(prompt)
    }
    
    private suspend fun executeTask(task: String): ActionResult {
        // Use ReAct pattern to execute task
        val agent = ReActAgent(llmClient, tools.associateBy { it.name })
        val result = agent.execute(task)
        return ActionResult(true, result, emptyMap())
    }
    
    private suspend fun isGoalAchieved(
        goal: String,
        completed: List<String>
    ): Boolean {
        val prompt = """
            Goal: $goal
            Completed tasks: ${completed.joinToString("\n- ", prefix = "\n- ")}
            
            Has the goal been achieved? Answer yes or no.
        """.trimIndent()
        
        val response = llmClient.complete(prompt)
        return response.contains("yes", ignoreCase = true)
    }
    
    private suspend fun reflect(goal: String, completed: List<String>): String {
        val prompt = """
            Goal: $goal
            Progress: ${completed.size} tasks completed
            
            Reflect on the progress. What's working? What needs adjustment?
        """.trimIndent()
        
        return llmClient.complete(prompt)
    }
}
```

---

## Production Considerations

### 1. Rate Limiting

```kotlin
class RateLimitedLLMClient(
    private val client: LLMClient,
    private val maxRequestsPerMinute: Int = 60
) : LLMClient {
    
    private val requestTimes = mutableListOf<Long>()
    
    override suspend fun complete(
        prompt: String,
        model: String,
        temperature: Double
    ): String {
        waitIfNeeded()
        recordRequest()
        return client.complete(prompt, model, temperature)
    }
    
    private suspend fun waitIfNeeded() {
        val now = System.currentTimeMillis()
        val oneMinuteAgo = now - 60_000
        
        // Remove old requests
        requestTimes.removeAll { it < oneMinuteAgo }
        
        if (requestTimes.size >= maxRequestsPerMinute) {
            val oldestRequest = requestTimes.first()
            val waitTime = 60_000 - (now - oldestRequest)
            if (waitTime > 0) {
                delay(waitTime)
            }
        }
    }
    
    private fun recordRequest() {
        requestTimes.add(System.currentTimeMillis())
    }
}
```

### 2. Error Handling and Retry

```kotlin
class ResilientAgent(
    private val agent: Agent,
    private val maxRetries: Int = 3
) : Agent {
    
    override suspend fun act(decision: Decision): ActionResult = retry(maxRetries) {
        agent.act(decision)
    }
    
    private suspend fun <T> retry(
        times: Int,
        block: suspend () -> T
    ): T {
        var lastException: Exception? = null
        
        repeat(times) { attempt ->
            try {
                return block()
            } catch (e: Exception) {
                lastException = e
                if (attempt < times - 1) {
                    val delay = (2.0.pow(attempt) * 1000).toLong()
                    println("Retry attempt ${attempt + 1} after ${delay}ms")
                    delay(delay)
                }
            }
        }
        
        throw lastException ?: error("Retry failed")
    }
}
```

### 3. Monitoring and Logging

```kotlin
class MonitoredAgent(
    private val agent: Agent,
    private val metrics: MetricsCollector
) : Agent by agent {
    
    override suspend fun act(decision: Decision): ActionResult {
        val startTime = System.currentTimeMillis()
        
        return try {
            val result = agent.act(decision)
            val duration = System.currentTimeMillis() - startTime
            
            metrics.record(Metric(
                name = "agent.action",
                value = duration.toDouble(),
                tags = mapOf(
                    "action" to decision.action.toString(),
                    "success" to result.success.toString()
                )
            ))
            
            result
        } catch (e: Exception) {
            metrics.increment("agent.error", mapOf("type" to e::class.simpleName!!))
            throw e
        }
    }
}

interface MetricsCollector {
    fun record(metric: Metric)
    fun increment(name: String, tags: Map<String, String> = emptyMap())
}

data class Metric(
    val name: String,
    val value: Double,
    val tags: Map<String, String>
)
```

---

## Complete Example: Research Assistant

```kotlin
class ResearchAssistant(
    private val llmClient: LLMClient,
    private val searchTool: SearchTool,
    private val memory: VectorMemory
) {
    
    suspend fun research(topic: String): ResearchReport {
        println("🔍 Starting research on: $topic")
        
        // 1. Generate research questions
        val questions = generateQuestions(topic)
        println("❓ Questions: ${questions.joinToString(", ")}")
        
        // 2. Search for each question
        val findings = questions.map { question ->
            searchAndAnalyze(question)
        }
        
        // 3. Store in memory
        findings.forEach { finding ->
            memory.store(finding.content, mapOf("topic" to topic))
        }
        
        // 4. Synthesize report
        val report = synthesize(topic, findings)
        
        println("✅ Research complete!")
        return report
    }
    
    private suspend fun generateQuestions(topic: String): List<String> {
        val prompt = """
            Generate 5 specific research questions about: $topic
            Make them focused and answerable through web search.
        """.trimIndent()
        
        return llmClient.complete(prompt)
            .lines()
            .filter { it.isNotBlank() }
            .take(5)
    }
    
    private suspend fun searchAndAnalyze(question: String): Finding {
        val searchResult = searchTool.execute(mapOf("query" to question))
        
        val analysis = llmClient.complete("""
            Analyze these search results for the question: $question
            
            Results: ${searchResult.output}
            
            Provide a concise summary of key findings.
        """.trimIndent())
        
        return Finding(question, analysis)
    }
    
    private suspend fun synthesize(
        topic: String,
        findings: List<Finding>
    ): ResearchReport {
        val findingsText = findings.joinToString("\n\n") {
            "Q: ${it.question}\nA: ${it.answer}"
        }
        
        val summary = llmClient.complete("""
            Create a comprehensive research report on: $topic
            
            Based on these findings:
            $findingsText
            
            Include:
            1. Executive Summary
            2. Key Findings
            3. Detailed Analysis
            4. Conclusions
        """.trimIndent())
        
        return ResearchReport(
            topic = topic,
            summary = summary,
            findings = findings,
            timestamp = System.currentTimeMillis()
        )
    }
}

data class Finding(
    val question: String,
    val answer: String
)

data class ResearchReport(
    val topic: String,
    val summary: String,
    val findings: List<Finding>,
    val timestamp: Long
)
```

---

## Resources

### Libraries
- **Ktor**: HTTP client for API calls
- **kotlinx.coroutines**: Async programming
- **kotlinx.serialization**: JSON handling
- **LangChain4j**: LLM framework for JVM

### APIs
- OpenAI API
- Anthropic Claude API
- Google Gemini API
- Hugging Face Inference API

### Learning
- [LangChain Documentation](https://docs.langchain.com)
- [OpenAI Cookbook](https://cookbook.openai.com)
- [Prompt Engineering Guide](https://www.promptingguide.ai)

---

## Best Practices

1. **Start Simple**: Begin with basic agents, add complexity gradually
2. **Test Thoroughly**: LLMs are non-deterministic, test edge cases
3. **Monitor Costs**: Track API usage and implement rate limiting
4. **Handle Failures**: Always have fallback strategies
5. **Iterate**: Continuously improve prompts and agent behavior
6. **Security**: Validate all inputs, sandbox code execution
7. **Observability**: Log all agent actions for debugging

---

**Build intelligent, autonomous systems with Kotlin! 🤖**
