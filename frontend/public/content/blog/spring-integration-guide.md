---
title: "Spring Integration: Complete Data Workflow Guide"
date: "2024-12-08"
category: "Backend"
tags: ["Spring", "Spring Integration", "Messaging", "Enterprise Integration", "Kotlin"]
---

# Spring Integration: Complete Data Workflow Guide

*From Beginner to Professional in Enterprise Integration Patterns*

## Table of Contents
1. [Introduction](#introduction)
2. [Setup & Configuration](#setup--configuration)
3. [Core Concepts](#core-concepts)
4. [Channels](#channels)
5. [Messages](#messages)
6. [Endpoints](#endpoints)
7. [Filters & Routers](#filters--routers)
8. [Transformers](#transformers)
9. [Service Activators](#service-activators)
10. [Advanced Patterns](#advanced-patterns)
11. [Real-World Projects](#real-world-projects)
12. [Best Practices](#best-practices)

---

## Introduction

### What is Spring Integration?

Spring Integration extends Spring to support **Enterprise Integration Patterns (EIP)** for building message-driven architectures.

**Key Benefits:**
- Decoupled components
- Asynchronous processing
- Scalable workflows
- Error handling & retry
- Integration with external systems

**Use Cases:**
- File processing pipelines
- Event-driven architectures
- API orchestration
- Data transformation workflows
- System integration

---

## Setup & Configuration

### Gradle Dependencies

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-integration")
    implementation("org.springframework.integration:spring-integration-file")
    implementation("org.springframework.integration:spring-integration-http")
    implementation("org.springframework.integration:spring-integration-jdbc")
    implementation("org.springframework.integration:spring-integration-mail")
    implementation("org.springframework.integration:spring-integration-kafka")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
}
```

### Enable Integration

```kotlin
@SpringBootApplication
@EnableIntegration
class IntegrationApplication

fun main(args: Array<String>) {
    runApplication<IntegrationApplication>(*args)
}
```

---

## Core Concepts

### Enterprise Integration Patterns

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Source  │─────>│ Channel │─────>│ Handler │─────>│  Sink   │
└─────────┘      └─────────┘      └─────────┘      └─────────┘
```

**Components:**
- **Message**: Data + Headers
- **Channel**: Message transport
- **Endpoint**: Message processor
- **Adapter**: External system connector

### Message Flow

```kotlin
// Simple flow
@Configuration
class SimpleFlow {
    @Bean
    fun inputChannel() = DirectChannel()
    
    @Bean
    @ServiceActivator(inputChannel = "inputChannel")
    fun handler() = MessageHandler { message ->
        println("Received: ${message.payload}")
    }
}
```

---

## Channels

### Channel Types

#### Direct Channel (Synchronous)

```kotlin
@Configuration
class DirectChannelConfig {
    @Bean
    fun directChannel() = DirectChannel()
    
    @Bean
    @Transformer(inputChannel = "directChannel", outputChannel = "outputChannel")
    fun transform(payload: String) = payload.uppercase()
}
```

#### Queue Channel (Asynchronous)

```kotlin
@Bean
fun queueChannel() = QueueChannel(100) // capacity 100

@Bean
@ServiceActivator(inputChannel = "queueChannel")
@Poller(fixedDelay = "1000")
fun processQueue(message: Message<*>) {
    println("Processing: ${message.payload}")
}
```

#### Publish-Subscribe Channel

```kotlin
@Bean
fun pubSubChannel() = PublishSubscribeChannel()

@Bean
@ServiceActivator(inputChannel = "pubSubChannel")
fun subscriber1(payload: String) {
    println("Subscriber 1: $payload")
}

@Bean
@ServiceActivator(inputChannel = "pubSubChannel")
fun subscriber2(payload: String) {
    println("Subscriber 2: $payload")
}
```

#### Priority Channel

```kotlin
@Bean
fun priorityChannel() = PriorityChannel(100) { msg1, msg2 ->
    val p1 = msg1.headers["priority"] as? Int ?: 0
    val p2 = msg2.headers["priority"] as? Int ?: 0
    p2.compareTo(p1) // Higher priority first
}
```

#### Executor Channel

```kotlin
@Bean
fun executorChannel() = ExecutorChannel(
    ThreadPoolTaskExecutor().apply {
        corePoolSize = 5
        maxPoolSize = 10
        queueCapacity = 100
        initialize()
    }
)
```

### Channel Interceptors

```kotlin
@Configuration
class ChannelInterceptorConfig {
    @Bean
    @GlobalChannelInterceptor(patterns = ["*"])
    fun loggingInterceptor() = object : ChannelInterceptor {
        override fun preSend(message: Message<*>, channel: MessageChannel): Message<*> {
            println("Sending to ${channel}: ${message.payload}")
            return message
        }
        
        override fun postSend(message: Message<*>, channel: MessageChannel, sent: Boolean) {
            println("Sent: $sent")
        }
    }
}
```

---

## Messages

### Creating Messages

```kotlin
// Simple message
val message = MessageBuilder
    .withPayload("Hello")
    .build()

// With headers
val messageWithHeaders = MessageBuilder
    .withPayload(User(1, "Alice"))
    .setHeader("userId", 1)
    .setHeader("timestamp", System.currentTimeMillis())
    .setHeader("priority", 5)
    .build()

// From existing message
val newMessage = MessageBuilder
    .fromMessage(message)
    .setHeader("processed", true)
    .build()
```

### Message Headers

```kotlin
@ServiceActivator(inputChannel = "inputChannel")
fun processWithHeaders(
    @Payload payload: String,
    @Header("userId") userId: Int,
    @Header(value = "optional", required = false) optional: String?,
    @Headers headers: Map<String, Any>
) {
    println("Payload: $payload")
    println("User ID: $userId")
    println("All headers: $headers")
}
```

### Generic Message

```kotlin
data class Order(val id: Int, val amount: Double, val status: String)

@ServiceActivator(inputChannel = "orderChannel")
fun processOrder(message: Message<Order>) {
    val order = message.payload
    val timestamp = message.headers["timestamp"]
    println("Processing order ${order.id} at $timestamp")
}
```

---

## Endpoints

### Gateway (Entry Point)

```kotlin
@MessagingGateway
interface OrderGateway {
    @Gateway(requestChannel = "orderChannel")
    fun submitOrder(order: Order): Order
    
    @Gateway(requestChannel = "orderChannel", replyTimeout = 5000)
    fun submitOrderAsync(order: Order): Future<Order>
    
    @Gateway(requestChannel = "queryChannel")
    fun queryOrder(orderId: Int): Order?
}

// Usage
@Service
class OrderService(private val gateway: OrderGateway) {
    fun placeOrder(order: Order) {
        val result = gateway.submitOrder(order)
        println("Order placed: $result")
    }
}
```

### Inbound Adapter

```kotlin
// Poll directory for files
@Bean
@InboundChannelAdapter(
    channel = "fileInputChannel",
    poller = [Poller(fixedDelay = "5000")]
)
fun fileReader() = FileReadingMessageSource().apply {
    setDirectory(File("/input"))
    setFilter(SimplePatternFileListFilter("*.txt"))
}
```

### Outbound Adapter

```kotlin
@Bean
@ServiceActivator(inputChannel = "fileOutputChannel")
fun fileWriter() = FileWritingMessageHandler(File("/output")).apply {
    setAutoCreateDirectory(true)
    setExpectReply(false)
}
```

---

## Filters & Routers

### Message Filter

```kotlin
// Annotation-based
@Filter(inputChannel = "inputChannel", outputChannel = "filteredChannel")
fun filterPositive(payload: Int) = payload > 0

// Bean-based
@Bean
@Filter(inputChannel = "orderChannel", outputChannel = "validOrderChannel")
fun orderFilter() = MessageSelector { message ->
    val order = message.payload as Order
    order.amount > 0 && order.status == "PENDING"
}

// Discard channel for rejected messages
@Bean
@Filter(
    inputChannel = "inputChannel",
    outputChannel = "validChannel",
    discardChannel = "invalidChannel"
)
fun validateMessage(payload: String) = payload.isNotBlank()
```

### Content-Based Router

```kotlin
@Router(inputChannel = "orderChannel")
fun routeByAmount(order: Order): String {
    return when {
        order.amount > 10000 -> "highValueChannel"
        order.amount > 1000 -> "mediumValueChannel"
        else -> "lowValueChannel"
    }
}

// Multiple destinations
@Router(inputChannel = "notificationChannel")
fun routeNotification(notification: Notification): List<String> {
    val channels = mutableListOf<String>()
    if (notification.email) channels.add("emailChannel")
    if (notification.sms) channels.add("smsChannel")
    if (notification.push) channels.add("pushChannel")
    return channels
}
```

### Header Value Router

```kotlin
@Bean
@Router(inputChannel = "inputChannel")
fun headerRouter() = HeaderValueRouter("messageType").apply {
    setChannelMapping("ORDER", "orderChannel")
    setChannelMapping("PAYMENT", "paymentChannel")
    setChannelMapping("NOTIFICATION", "notificationChannel")
    setDefaultOutputChannel(errorChannel())
}
```

### Recipient List Router

```kotlin
@Bean
fun recipientListRouter() = IntegrationFlows
    .from("inputChannel")
    .route<String> { payload ->
        RecipientListRouter().apply {
            addRecipient("auditChannel")
            if (payload.contains("urgent")) {
                addRecipient("urgentChannel")
            }
            addRecipient("normalChannel")
        }
    }
    .get()
```

---

## Transformers

### Simple Transformer

```kotlin
@Transformer(inputChannel = "inputChannel", outputChannel = "outputChannel")
fun toUpperCase(payload: String) = payload.uppercase()

@Transformer(inputChannel = "orderChannel", outputChannel = "dtoChannel")
fun toOrderDto(order: Order) = OrderDto(
    id = order.id,
    total = order.amount * 1.1, // Add tax
    status = order.status
)
```

### JSON Transformer

```kotlin
@Bean
@Transformer(inputChannel = "jsonInputChannel", outputChannel = "objectChannel")
fun jsonToObject() = JsonToObjectTransformer(Order::class.java)

@Bean
@Transformer(inputChannel = "objectChannel", outputChannel = "jsonOutputChannel")
fun objectToJson() = ObjectToJsonTransformer()
```

### Header Enricher

```kotlin
@Bean
fun enrichHeaders() = IntegrationFlows
    .from("inputChannel")
    .enrichHeaders { spec ->
        spec.header("timestamp", System.currentTimeMillis())
        spec.header("source", "api")
        spec.headerExpression("processedBy", "T(java.net.InetAddress).localHost.hostName")
    }
    .channel("enrichedChannel")
    .get()
```

### Content Enricher

```kotlin
@Transformer(inputChannel = "orderChannel", outputChannel = "enrichedOrderChannel")
fun enrichOrder(order: Order, @Header("userId") userId: Int): EnrichedOrder {
    val user = userRepository.findById(userId)
    val discount = discountService.calculateDiscount(user, order)
    return EnrichedOrder(
        order = order,
        user = user,
        discount = discount,
        finalAmount = order.amount - discount
    )
}
```

### Splitter

```kotlin
// Split collection
@Splitter(inputChannel = "batchChannel", outputChannel = "itemChannel")
fun splitBatch(orders: List<Order>) = orders

// Split with custom logic
@Splitter(inputChannel = "fileChannel", outputChannel = "lineChannel")
fun splitFile(file: File): List<String> {
    return file.readLines().filter { it.isNotBlank() }
}
```

### Aggregator

```kotlin
@Aggregator(
    inputChannel = "itemChannel",
    outputChannel = "batchChannel",
    releaseStrategy = "releaseStrategy",
    correlationStrategy = "correlationStrategy"
)
fun aggregateOrders(orders: List<Order>) = OrderBatch(orders)

@Bean
fun releaseStrategy() = MessageGroupProcessor { group ->
    group.size() >= 10 || group.timestamp < System.currentTimeMillis() - 5000
}

@Bean
fun correlationStrategy() = HeaderAttributeCorrelationStrategy("batchId")
```

---

## Service Activators

### Basic Service Activator

```kotlin
@ServiceActivator(inputChannel = "orderChannel")
fun processOrder(order: Order) {
    println("Processing order: ${order.id}")
    orderService.process(order)
}

// With reply
@ServiceActivator(inputChannel = "requestChannel", outputChannel = "replyChannel")
fun handleRequest(request: Request): Response {
    return Response(request.id, "Processed")
}
```

### Async Service Activator

```kotlin
@ServiceActivator(inputChannel = "asyncChannel")
@Async
fun processAsync(order: Order): CompletableFuture<Order> {
    return CompletableFuture.supplyAsync {
        Thread.sleep(1000)
        order.copy(status = "PROCESSED")
    }
}
```

### Error Handling

```kotlin
@ServiceActivator(inputChannel = "orderChannel")
fun processWithErrorHandling(order: Order) {
    try {
        orderService.process(order)
    } catch (e: Exception) {
        errorChannel().send(
            MessageBuilder
                .withPayload(order)
                .setHeader("error", e.message)
                .build()
        )
    }
}

@ServiceActivator(inputChannel = "errorChannel")
fun handleError(message: Message<*>) {
    val error = message.headers["error"]
    println("Error processing ${message.payload}: $error")
    // Log, retry, or send to DLQ
}
```

---

## Advanced Patterns

### Chain of Handlers

```kotlin
@Bean
fun processingChain() = IntegrationFlows
    .from("inputChannel")
    .filter<String> { it.isNotBlank() }
    .transform<String, String> { it.trim() }
    .transform<String, String> { it.uppercase() }
    .handle { payload, _ -> 
        println("Final: $payload")
        null
    }
    .get()
```

### Bridge Pattern

```kotlin
@Bean
@BridgeFrom("sourceChannel")
@BridgeTo("targetChannel")
fun bridge() = BridgeHandler()
```

### Wire Tap

```kotlin
@Bean
fun wireTapFlow() = IntegrationFlows
    .from("mainChannel")
    .wireTap("auditChannel") // Copy to audit
    .handle("orderService", "process")
    .get()
```

### Claim Check

```kotlin
// Store payload, send reference
@Transformer(inputChannel = "largePayloadChannel", outputChannel = "referenceChannel")
fun claimCheckIn(payload: LargeObject): String {
    val id = UUID.randomUUID().toString()
    claimCheckStore[id] = payload
    return id
}

// Retrieve payload from reference
@Transformer(inputChannel = "referenceChannel", outputChannel = "payloadChannel")
fun claimCheckOut(reference: String): LargeObject {
    return claimCheckStore[reference] ?: throw IllegalStateException("Not found")
}
```

### Scatter-Gather

```kotlin
@Bean
fun scatterGather() = IntegrationFlows
    .from("requestChannel")
    .scatterGather(
        { scatter -> 
            scatter
                .recipientFlow("service1Channel")
                .recipientFlow("service2Channel")
                .recipientFlow("service3Channel")
        },
        { gather ->
            gather.releaseStrategy { group -> group.size() == 3 }
        }
    )
    .aggregate { aggregator ->
        aggregator.outputProcessor { group ->
            group.messages.map { it.payload }
        }
    }
    .get()
```

### Retry & Circuit Breaker

```kotlin
@Bean
fun retryAdvice() = RequestHandlerRetryAdvice().apply {
    setRetryTemplate(RetryTemplate().apply {
        setRetryPolicy(SimpleRetryPolicy(3))
        setBackOffPolicy(ExponentialBackOffPolicy().apply {
            initialInterval = 1000
            multiplier = 2.0
        })
    })
}

@ServiceActivator(inputChannel = "unreliableChannel", adviceChain = ["retryAdvice"])
fun unreliableOperation(payload: String) {
    externalService.call(payload)
}
```

---

## Real-World Projects

### Project 1: File Processing Pipeline

```kotlin
@Configuration
class FileProcessingFlow {
    
    @Bean
    @InboundChannelAdapter(
        channel = "fileInputChannel",
        poller = [Poller(fixedDelay = "5000")]
    )
    fun fileReader() = FileReadingMessageSource().apply {
        setDirectory(File("/input"))
        setFilter(SimplePatternFileListFilter("*.csv"))
    }
    
    @Bean
    fun fileProcessingFlow() = IntegrationFlows
        .from("fileInputChannel")
        .transform<File, List<String>> { it.readLines() }
        .split()
        .filter<String> { it.isNotBlank() }
        .transform<String, CsvRecord> { parseCsv(it) }
        .filter<CsvRecord> { it.isValid() }
        .transform<CsvRecord, Entity> { it.toEntity() }
        .handle("entityRepository", "save")
        .get()
    
    private fun parseCsv(line: String): CsvRecord {
        val parts = line.split(",")
        return CsvRecord(parts[0], parts[1], parts[2])
    }
}

data class CsvRecord(val id: String, val name: String, val value: String) {
    fun isValid() = id.isNotBlank() && name.isNotBlank()
    fun toEntity() = Entity(id.toInt(), name, value.toDouble())
}
```

### Project 2: Order Processing System

```kotlin
@Configuration
class OrderProcessingFlow {
    
    @Bean
    fun orderFlow() = IntegrationFlows
        .from("orderInputChannel")
        .filter<Order> { it.amount > 0 }
        .enrichHeaders { spec ->
            spec.header("timestamp", System.currentTimeMillis())
            spec.header("source", "api")
        }
        .route<Order> { order ->
            when {
                order.amount > 10000 -> "highValueOrderChannel"
                order.amount > 1000 -> "standardOrderChannel"
                else -> "lowValueOrderChannel"
            }
        }
        .get()
    
    @Bean
    fun highValueFlow() = IntegrationFlows
        .from("highValueOrderChannel")
        .handle("fraudDetectionService", "check")
        .filter<Order> { !it.fraudulent }
        .handle("approvalService", "requestApproval")
        .handle("orderService", "process")
        .wireTap("auditChannel")
        .channel("orderCompletedChannel")
        .get()
    
    @Bean
    fun standardFlow() = IntegrationFlows
        .from("standardOrderChannel")
        .handle("orderService", "process")
        .channel("orderCompletedChannel")
        .get()
    
    @Bean
    fun notificationFlow() = IntegrationFlows
        .from("orderCompletedChannel")
        .publishSubscribeChannel { pubsub ->
            pubsub
                .subscribe { flow ->
                    flow.handle("emailService", "sendConfirmation")
                }
                .subscribe { flow ->
                    flow.handle("smsService", "sendNotification")
                }
                .subscribe { flow ->
                    flow.handle("analyticsService", "track")
                }
        }
        .get()
}
```

### Project 3: API Orchestration

```kotlin
@Configuration
class ApiOrchestrationFlow {
    
    @MessagingGateway
    interface ApiGateway {
        @Gateway(requestChannel = "apiRequestChannel", replyTimeout = 10000)
        fun processRequest(request: ApiRequest): ApiResponse
    }
    
    @Bean
    fun apiFlow() = IntegrationFlows
        .from("apiRequestChannel")
        .enrichHeaders { spec ->
            spec.header("requestId", UUID.randomUUID().toString())
            spec.header("startTime", System.currentTimeMillis())
        }
        .scatterGather(
            { scatter ->
                scatter
                    .recipientFlow(userServiceFlow())
                    .recipientFlow(productServiceFlow())
                    .recipientFlow(inventoryServiceFlow())
            },
            { gather ->
                gather
                    .releaseStrategy { group -> group.size() == 3 }
                    .expireGroupsUponCompletion(true)
            }
        )
        .transform<List<Any>, ApiResponse> { results ->
            ApiResponse(
                user = results[0] as User,
                products = results[1] as List<Product>,
                inventory = results[2] as Inventory
            )
        }
        .get()
    
    private fun userServiceFlow() = IntegrationFlows
        .from(DirectChannel())
        .handle(Http.outboundGateway("http://user-service/api/users/{id}")
            .uriVariable("id", "payload.userId")
            .expectedResponseType(User::class.java))
        .get()
    
    private fun productServiceFlow() = IntegrationFlows
        .from(DirectChannel())
        .handle(Http.outboundGateway("http://product-service/api/products")
            .expectedResponseType(Array<Product>::class.java))
        .transform<Array<Product>, List<Product>> { it.toList() }
        .get()
    
    private fun inventoryServiceFlow() = IntegrationFlows
        .from(DirectChannel())
        .handle(Http.outboundGateway("http://inventory-service/api/inventory")
            .expectedResponseType(Inventory::class.java))
        .get()
}
```

### Project 4: Event-Driven Workflow

```kotlin
@Configuration
class EventDrivenFlow {
    
    @Bean
    fun eventFlow() = IntegrationFlows
        .from("eventChannel")
        .route<Event> { it.type }
        .channelMapping("USER_CREATED", "userCreatedChannel")
        .channelMapping("ORDER_PLACED", "orderPlacedChannel")
        .channelMapping("PAYMENT_RECEIVED", "paymentReceivedChannel")
        .get()
    
    @Bean
    fun userCreatedFlow() = IntegrationFlows
        .from("userCreatedChannel")
        .transform<Event, UserCreatedEvent> { it as UserCreatedEvent }
        .publishSubscribeChannel { pubsub ->
            pubsub
                .subscribe { flow ->
                    flow.handle("emailService", "sendWelcomeEmail")
                }
                .subscribe { flow ->
                    flow.handle("analyticsService", "trackSignup")
                }
                .subscribe { flow ->
                    flow.handle("crmService", "createContact")
                }
        }
        .get()
    
    @Bean
    fun orderPlacedFlow() = IntegrationFlows
        .from("orderPlacedChannel")
        .transform<Event, OrderPlacedEvent> { it as OrderPlacedEvent }
        .handle { payload, _ ->
            val order = (payload as OrderPlacedEvent).order
            inventoryService.reserve(order.items)
            paymentService.charge(order.amount)
            shippingService.schedule(order)
        }
        .get()
    
    @Bean
    fun sagaFlow() = IntegrationFlows
        .from("sagaChannel")
        .handle { payload, headers ->
            try {
                step1Service.execute(payload)
                step2Service.execute(payload)
                step3Service.execute(payload)
            } catch (e: Exception) {
                // Compensating transactions
                step2Service.rollback(payload)
                step1Service.rollback(payload)
                throw e
            }
        }
        .get()
}
```

---

## Best Practices

### Configuration

```kotlin
// Use DSL for complex flows
@Bean
fun complexFlow() = IntegrationFlows
    .from("input")
    .filter<String> { it.isNotBlank() }
    .transform<String, String> { it.uppercase() }
    .route<String> { 
        if (it.startsWith("A")) "channelA" else "channelB"
    }
    .get()

// Separate concerns
@Configuration
class ChannelConfig {
    @Bean fun inputChannel() = DirectChannel()
    @Bean fun outputChannel() = QueueChannel()
}

@Configuration
class HandlerConfig {
    @ServiceActivator(inputChannel = "inputChannel")
    fun handler(payload: String) { /* ... */ }
}
```

### Error Handling

```kotlin
@Bean
fun errorChannel() = DirectChannel()

@ServiceActivator(inputChannel = "errorChannel")
fun globalErrorHandler(error: ErrorMessage) {
    val cause = error.payload.cause
    val failedMessage = error.payload.failedMessage
    logger.error("Error processing ${failedMessage.payload}", cause)
    
    // Send to DLQ, alert, or retry
    deadLetterQueue.send(failedMessage)
}

// Per-channel error handling
@Bean
fun flowWithErrorHandling() = IntegrationFlows
    .from("inputChannel")
    .handle { payload, _ ->
        try {
            process(payload)
        } catch (e: Exception) {
            ErrorMessage(MessageHandlingException(message, e))
        }
    }
    .get()
```

### Performance

```kotlin
// Use executor channels for parallel processing
@Bean
fun parallelChannel() = ExecutorChannel(
    ThreadPoolTaskExecutor().apply {
        corePoolSize = 10
        maxPoolSize = 20
        queueCapacity = 100
        setThreadNamePrefix("integration-")
        initialize()
    }
)

// Batch processing
@Bean
fun batchFlow() = IntegrationFlows
    .from("inputChannel")
    .aggregate { spec ->
        spec
            .correlationStrategy { "batch" }
            .releaseStrategy { group -> group.size() >= 100 }
            .sendPartialResultOnExpiry(true)
            .groupTimeout(5000)
    }
    .handle("batchProcessor", "process")
    .get()
```

### Testing

```kotlin
@SpringBootTest
@AutoConfigureMessageVerifier
class IntegrationFlowTest {
    
    @Autowired
    lateinit var inputChannel: MessageChannel
    
    @Autowired
    lateinit var outputChannel: PollableChannel
    
    @Test
    fun `test message flow`() {
        val message = MessageBuilder.withPayload("test").build()
        inputChannel.send(message)
        
        val result = outputChannel.receive(1000)
        assertNotNull(result)
        assertEquals("TEST", result.payload)
    }
}
```

### Monitoring

```kotlin
@Configuration
class MonitoringConfig {
    
    @Bean
    fun metricsInterceptor() = object : ChannelInterceptor {
        override fun preSend(message: Message<*>, channel: MessageChannel): Message<*> {
            meterRegistry.counter("messages.sent", "channel", channel.toString()).increment()
            return message
        }
    }
    
    @Bean
    fun performanceInterceptor() = object : ChannelInterceptor {
        override fun preSend(message: Message<*>, channel: MessageChannel): Message<*> {
            return MessageBuilder
                .fromMessage(message)
                .setHeader("startTime", System.currentTimeMillis())
                .build()
        }
        
        override fun postSend(message: Message<*>, channel: MessageChannel, sent: Boolean) {
            val startTime = message.headers["startTime"] as Long
            val duration = System.currentTimeMillis() - startTime
            meterRegistry.timer("message.processing.time").record(duration, TimeUnit.MILLISECONDS)
        }
    }
}
```

---

## Summary

### Key Concepts

**Core Components:**
- ✅ Channels (Direct, Queue, PubSub, Priority)
- ✅ Messages (Payload + Headers)
- ✅ Endpoints (Gateway, Adapters, Activators)
- ✅ Filters & Routers
- ✅ Transformers & Enrichers

**Patterns:**
- ✅ Chain of Responsibility
- ✅ Scatter-Gather
- ✅ Claim Check
- ✅ Wire Tap
- ✅ Saga Pattern

### Learning Path

1. **Beginner**: Channels, Messages, Simple flows
2. **Intermediate**: Filters, Routers, Transformers
3. **Advanced**: Aggregators, Scatter-Gather, Error handling
4. **Professional**: Complex workflows, Performance tuning, Monitoring

### Resources

- **Spring Integration Docs**: https://spring.io/projects/spring-integration
- **EIP Book**: https://www.enterpriseintegrationpatterns.com/
- **Spring Integration Samples**: https://github.com/spring-projects/spring-integration-samples

---

**You're now ready to build enterprise-grade integration workflows!** 🚀
