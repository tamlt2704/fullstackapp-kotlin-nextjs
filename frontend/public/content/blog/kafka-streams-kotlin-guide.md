---
title: "Kafka Streams with Kotlin: Complete Guide"
date: "2024-12-08"
category: "Streaming"
tags: ["Kafka", "Kafka Streams", "Kotlin", "Stream Processing", "Real-time"]
---

# Kafka Streams with Kotlin: Complete Guide

*From Beginner to Professional in Stream Processing*

## Table of Contents
1. [Introduction](#introduction)
2. [Setup & Configuration](#setup--configuration)
3. [Core Concepts](#core-concepts)
4. [Stream Operations](#stream-operations)
5. [Stateful Processing](#stateful-processing)
6. [Windowing](#windowing)
7. [Joins](#joins)
8. [Testing](#testing)
9. [Real-World Projects](#real-world-projects)
10. [Best Practices](#best-practices)

---

## Introduction

### What is Kafka Streams?

Kafka Streams is a client library for building real-time streaming applications that process data stored in Kafka.

**Key Features:**
- Exactly-once processing semantics
- Stateful and stateless operations
- Windowing support
- Interactive queries
- Fault-tolerant and scalable

**Use Cases:**
- Real-time analytics
- Event-driven microservices
- Data transformation pipelines
- Fraud detection
- IoT data processing

---

## Setup & Configuration

### Gradle Dependencies

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.apache.kafka:kafka-streams:3.6.0")
    implementation("org.apache.kafka:kafka-clients:3.6.0")
    implementation("io.confluent:kafka-streams-avro-serde:7.5.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.15.3")
    implementation("org.slf4j:slf4j-simple:2.0.9")
}

repositories {
    mavenCentral()
    maven("https://packages.confluent.io/maven/")
}
```

### Basic Configuration

```kotlin
import org.apache.kafka.streams.KafkaStreams
import org.apache.kafka.streams.StreamsConfig
import org.apache.kafka.common.serialization.Serdes
import java.util.Properties

fun createStreamConfig(): Properties {
    return Properties().apply {
        put(StreamsConfig.APPLICATION_ID_CONFIG, "my-stream-app")
        put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092")
        put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().javaClass)
        put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().javaClass)
        put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2)
    }
}
```

### First Stream Application

```kotlin
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.KStream

fun main() {
    val builder = StreamsBuilder()
    
    val stream: KStream<String, String> = builder.stream("input-topic")
    
    stream
        .filter { _, value -> value.isNotBlank() }
        .mapValues { value -> value.uppercase() }
        .to("output-topic")
    
    val topology = builder.build()
    val streams = KafkaStreams(topology, createStreamConfig())
    
    streams.start()
    
    Runtime.getRuntime().addShutdownHook(Thread {
        streams.close()
    })
}
```

---

## Core Concepts

### Topology

```kotlin
// Stream topology visualization
val builder = StreamsBuilder()
val stream = builder.stream<String, String>("input")

stream
    .filter { _, v -> v.length > 5 }
    .mapValues { v -> v.uppercase() }
    .to("output")

val topology = builder.build()
println(topology.describe())
```

### Serdes (Serializers/Deserializers)

```kotlin
// String Serde
val stringSerde = Serdes.String()

// Long Serde
val longSerde = Serdes.Long()

// JSON Serde
data class User(val id: Int, val name: String, val email: String)

class JsonSerde<T>(private val type: Class<T>) : Serde<T> {
    private val objectMapper = ObjectMapper().registerKotlinModule()
    
    override fun serializer() = Serializer<T> { _, data ->
        objectMapper.writeValueAsBytes(data)
    }
    
    override fun deserializer() = Deserializer<T> { _, data ->
        objectMapper.readValue(data, type)
    }
}

val userSerde = JsonSerde(User::class.java)
```

### KStream vs KTable

```kotlin
// KStream - Event stream (append-only)
val stream: KStream<String, String> = builder.stream("events")
stream.foreach { key, value ->
    println("Event: $key -> $value")
}

// KTable - Changelog stream (latest value per key)
val table: KTable<String, String> = builder.table("users")
table.toStream().foreach { key, value ->
    println("User: $key -> $value")
}

// GlobalKTable - Replicated to all instances
val globalTable: GlobalKTable<String, String> = builder.globalTable("config")
```

---

## Stream Operations

### Stateless Operations

#### Filter

```kotlin
stream
    .filter { key, value -> value.toIntOrNull() != null }
    .filter { key, value -> value.toInt() > 100 }
    .to("filtered-output")
```

#### Map

```kotlin
// Map keys and values
stream
    .map { key, value -> KeyValue(key.uppercase(), value.toInt()) }
    .to("mapped-output")

// Map values only
stream
    .mapValues { value -> value.length }
    .to("lengths")

// FlatMap
stream
    .flatMap { key, value ->
        value.split(",").map { KeyValue(key, it.trim()) }
    }
    .to("split-output")
```

#### Branch

```kotlin
val branches = stream.branch(
    { _, value -> value.toInt() < 10 },
    { _, value -> value.toInt() < 100 },
    { _, value -> true }
)

branches[0].to("small-numbers")
branches[1].to("medium-numbers")
branches[2].to("large-numbers")
```

#### Merge

```kotlin
val stream1 = builder.stream<String, String>("topic1")
val stream2 = builder.stream<String, String>("topic2")

val merged = stream1.merge(stream2)
merged.to("merged-output")
```

### Peek (Debugging)

```kotlin
stream
    .peek { key, value -> println("Before: $key -> $value") }
    .mapValues { it.uppercase() }
    .peek { key, value -> println("After: $key -> $value") }
    .to("output")
```

---

## Stateful Processing

### Aggregations

#### Count

```kotlin
val wordCounts: KTable<String, Long> = stream
    .flatMapValues { value -> value.lowercase().split("\\s+".toRegex()) }
    .groupBy { _, word -> word }
    .count()

wordCounts.toStream().to("word-counts")
```

#### Aggregate

```kotlin
data class Stats(val count: Long, val sum: Double, val avg: Double)

val stats: KTable<String, Stats> = stream
    .groupByKey()
    .aggregate(
        { Stats(0, 0.0, 0.0) },
        { key, value, agg ->
            val newCount = agg.count + 1
            val newSum = agg.sum + value.toDouble()
            Stats(newCount, newSum, newSum / newCount)
        },
        Materialized.with(Serdes.String(), JsonSerde(Stats::class.java))
    )
```

#### Reduce

```kotlin
val maxValues: KTable<String, Int> = stream
    .mapValues { it.toInt() }
    .groupByKey()
    .reduce { oldValue, newValue -> maxOf(oldValue, newValue) }
```

### GroupBy

```kotlin
// Group by key
stream
    .groupByKey()
    .count()

// Group by custom key
stream
    .groupBy { key, value -> value.substring(0, 1) }
    .count()
```

---

## Windowing

### Tumbling Windows

```kotlin
import org.apache.kafka.streams.kstream.TimeWindows
import java.time.Duration

val windowedCounts = stream
    .groupByKey()
    .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))
    .count()

windowedCounts.toStream().foreach { windowedKey, count ->
    println("Window: ${windowedKey.window().start()} - ${windowedKey.window().end()}, Count: $count")
}
```

### Hopping Windows

```kotlin
val hoppingCounts = stream
    .groupByKey()
    .windowedBy(
        TimeWindows
            .ofSizeWithNoGrace(Duration.ofMinutes(10))
            .advanceBy(Duration.ofMinutes(5))
    )
    .count()
```

### Session Windows

```kotlin
import org.apache.kafka.streams.kstream.SessionWindows

val sessionCounts = stream
    .groupByKey()
    .windowedBy(SessionWindows.ofInactivityGapWithNoGrace(Duration.ofMinutes(30)))
    .count()
```

### Sliding Windows

```kotlin
import org.apache.kafka.streams.kstream.SlidingWindows

val slidingCounts = stream
    .groupByKey()
    .windowedBy(
        SlidingWindows
            .ofTimeDifferenceWithNoGrace(Duration.ofMinutes(10))
    )
    .count()
```

---

## Joins

### Stream-Stream Join

```kotlin
val orders: KStream<String, Order> = builder.stream("orders")
val payments: KStream<String, Payment> = builder.stream("payments")

val joined = orders.join(
    payments,
    { order, payment -> OrderPayment(order, payment) },
    JoinWindows.ofTimeDifferenceWithNoGrace(Duration.ofMinutes(5)),
    StreamJoined.with(Serdes.String(), orderSerde, paymentSerde)
)

joined.to("order-payments")
```

### Stream-Table Join

```kotlin
val orders: KStream<String, Order> = builder.stream("orders")
val customers: KTable<String, Customer> = builder.table("customers")

val enriched = orders.join(
    customers,
    { order, customer -> EnrichedOrder(order, customer) },
    Joined.with(Serdes.String(), orderSerde, customerSerde)
)
```

### Table-Table Join

```kotlin
val users: KTable<String, User> = builder.table("users")
val addresses: KTable<String, Address> = builder.table("addresses")

val joined = users.join(
    addresses,
    { user, address -> UserWithAddress(user, address) }
)
```

### Left/Outer Joins

```kotlin
// Left join
val leftJoined = orders.leftJoin(
    customers,
    { order, customer -> EnrichedOrder(order, customer) }
)

// Outer join
val outerJoined = orders.outerJoin(
    payments,
    { order, payment -> OrderPayment(order, payment) },
    JoinWindows.ofTimeDifferenceWithNoGrace(Duration.ofMinutes(5))
)
```

---

## Testing

### TopologyTestDriver

```kotlin
import org.apache.kafka.streams.TopologyTestDriver
import org.apache.kafka.streams.test.TestRecord
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class StreamProcessorTest {
    
    @Test
    fun `test word count`() {
        val builder = StreamsBuilder()
        
        val input = builder.stream<String, String>("input")
        input
            .flatMapValues { it.split(" ") }
            .groupBy { _, word -> word }
            .count()
            .toStream()
            .to("output")
        
        val topology = builder.build()
        val testDriver = TopologyTestDriver(topology, createStreamConfig())
        
        val inputTopic = testDriver.createInputTopic(
            "input",
            Serdes.String().serializer(),
            Serdes.String().serializer()
        )
        
        val outputTopic = testDriver.createOutputTopic(
            "output",
            Serdes.String().deserializer(),
            Serdes.Long().deserializer()
        )
        
        inputTopic.pipeInput("key", "hello world hello")
        
        val results = outputTopic.readKeyValuesToMap()
        assertEquals(2L, results["hello"])
        assertEquals(1L, results["world"])
        
        testDriver.close()
    }
}
```

---

## Real-World Projects

### Project 1: Real-Time Analytics Dashboard

```kotlin
data class PageView(
    val userId: String,
    val page: String,
    val timestamp: Long,
    val duration: Int
)

data class UserStats(
    val userId: String,
    val pageViews: Long,
    val totalDuration: Long,
    val avgDuration: Double,
    val uniquePages: Set<String>
)

class AnalyticsPipeline {
    fun build(): Topology {
        val builder = StreamsBuilder()
        
        val pageViews: KStream<String, PageView> = builder.stream(
            "page-views",
            Consumed.with(Serdes.String(), JsonSerde(PageView::class.java))
        )
        
        // Real-time user statistics
        val userStats = pageViews
            .groupBy { _, view -> view.userId }
            .aggregate(
                { UserStats("", 0, 0, 0.0, emptySet()) },
                { userId, view, stats ->
                    val newCount = stats.pageViews + 1
                    val newTotal = stats.totalDuration + view.duration
                    UserStats(
                        userId = userId,
                        pageViews = newCount,
                        totalDuration = newTotal,
                        avgDuration = newTotal.toDouble() / newCount,
                        uniquePages = stats.uniquePages + view.page
                    )
                },
                Materialized.with(Serdes.String(), JsonSerde(UserStats::class.java))
            )
        
        userStats.toStream().to(
            "user-stats",
            Produced.with(Serdes.String(), JsonSerde(UserStats::class.java))
        )
        
        // Page popularity (5-minute windows)
        val pagePopularity = pageViews
            .groupBy { _, view -> view.page }
            .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))
            .count()
        
        pagePopularity
            .toStream()
            .map { windowedKey, count ->
                KeyValue(
                    windowedKey.key(),
                    mapOf(
                        "page" to windowedKey.key(),
                        "count" to count,
                        "window_start" to windowedKey.window().start(),
                        "window_end" to windowedKey.window().end()
                    )
                )
            }
            .to("page-popularity")
        
        return builder.build()
    }
}
```

### Project 2: Fraud Detection System

```kotlin
data class Transaction(
    val id: String,
    val userId: String,
    val amount: Double,
    val merchant: String,
    val timestamp: Long,
    val location: String
)

data class FraudAlert(
    val transactionId: String,
    val userId: String,
    val reason: String,
    val riskScore: Double
)

class FraudDetectionPipeline {
    fun build(): Topology {
        val builder = StreamsBuilder()
        
        val transactions: KStream<String, Transaction> = builder.stream(
            "transactions",
            Consumed.with(Serdes.String(), JsonSerde(Transaction::class.java))
        )
        
        // Calculate transaction velocity (transactions per minute)
        val velocity = transactions
            .groupBy { _, txn -> txn.userId }
            .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
            .count()
        
        // Detect high-velocity transactions
        val highVelocity = velocity
            .filter { _, count -> count > 10 }
            .toStream()
            .map { windowedKey, count ->
                KeyValue(
                    windowedKey.key(),
                    FraudAlert(
                        transactionId = "",
                        userId = windowedKey.key(),
                        reason = "High transaction velocity: $count txns/min",
                        riskScore = minOf(count / 10.0, 1.0)
                    )
                )
            }
        
        // Detect large transactions
        val largeTransactions = transactions
            .filter { _, txn -> txn.amount > 10000 }
            .map { key, txn ->
                KeyValue(
                    txn.userId,
                    FraudAlert(
                        transactionId = txn.id,
                        userId = txn.userId,
                        reason = "Large transaction: $${txn.amount}",
                        riskScore = minOf(txn.amount / 50000, 1.0)
                    )
                )
            }
        
        // Detect location changes
        val userLocations: KTable<String, String> = transactions
            .groupBy { _, txn -> txn.userId }
            .aggregate(
                { "" },
                { _, txn, lastLocation ->
                    if (lastLocation.isNotEmpty() && lastLocation != txn.location) {
                        // Location changed
                    }
                    txn.location
                }
            )
        
        // Merge all fraud alerts
        val allAlerts = highVelocity.merge(largeTransactions)
        
        allAlerts.to(
            "fraud-alerts",
            Produced.with(Serdes.String(), JsonSerde(FraudAlert::class.java))
        )
        
        return builder.build()
    }
}
```

### Project 3: IoT Sensor Data Processing

```kotlin
data class SensorReading(
    val sensorId: String,
    val temperature: Double,
    val humidity: Double,
    val timestamp: Long
)

data class SensorStats(
    val sensorId: String,
    val avgTemp: Double,
    val minTemp: Double,
    val maxTemp: Double,
    val avgHumidity: Double,
    val readingCount: Long
)

data class Alert(
    val sensorId: String,
    val type: String,
    val message: String,
    val timestamp: Long
)

class IoTPipeline {
    fun build(): Topology {
        val builder = StreamsBuilder()
        
        val readings: KStream<String, SensorReading> = builder.stream(
            "sensor-readings",
            Consumed.with(Serdes.String(), JsonSerde(SensorReading::class.java))
        )
        
        // Calculate rolling statistics (10-minute windows)
        val stats = readings
            .groupBy { _, reading -> reading.sensorId }
            .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(10)))
            .aggregate(
                { SensorStats("", 0.0, Double.MAX_VALUE, Double.MIN_VALUE, 0.0, 0) },
                { sensorId, reading, agg ->
                    val newCount = agg.readingCount + 1
                    SensorStats(
                        sensorId = sensorId,
                        avgTemp = (agg.avgTemp * agg.readingCount + reading.temperature) / newCount,
                        minTemp = minOf(agg.minTemp, reading.temperature),
                        maxTemp = maxOf(agg.maxTemp, reading.temperature),
                        avgHumidity = (agg.avgHumidity * agg.readingCount + reading.humidity) / newCount,
                        readingCount = newCount
                    )
                }
            )
        
        stats.toStream()
            .map { windowedKey, stat -> KeyValue(windowedKey.key(), stat) }
            .to("sensor-stats")
        
        // Anomaly detection
        val anomalies = readings
            .filter { _, reading ->
                reading.temperature > 100 || reading.temperature < -50 ||
                reading.humidity > 100 || reading.humidity < 0
            }
            .map { _, reading ->
                KeyValue(
                    reading.sensorId,
                    Alert(
                        sensorId = reading.sensorId,
                        type = "ANOMALY",
                        message = "Abnormal reading: temp=${reading.temperature}, humidity=${reading.humidity}",
                        timestamp = reading.timestamp
                    )
                )
            }
        
        anomalies.to("sensor-alerts")
        
        return builder.build()
    }
}
```

### Project 4: E-Commerce Order Processing

```kotlin
data class Order(
    val orderId: String,
    val customerId: String,
    val items: List<OrderItem>,
    val totalAmount: Double,
    val status: String,
    val timestamp: Long
)

data class OrderItem(val productId: String, val quantity: Int, val price: Double)

data class Inventory(val productId: String, val quantity: Int)

data class OrderEnriched(
    val order: Order,
    val customer: Customer,
    val inventoryStatus: Map<String, Boolean>
)

class OrderProcessingPipeline {
    fun build(): Topology {
        val builder = StreamsBuilder()
        
        val orders: KStream<String, Order> = builder.stream("orders")
        val customers: KTable<String, Customer> = builder.table("customers")
        val inventory: KTable<String, Inventory> = builder.table("inventory")
        
        // Enrich orders with customer data
        val enrichedOrders = orders
            .selectKey { _, order -> order.customerId }
            .join(customers) { order, customer ->
                Pair(order, customer)
            }
        
        // Check inventory availability
        val withInventory = enrichedOrders
            .flatMap { customerId, (order, customer) ->
                order.items.map { item ->
                    KeyValue(item.productId, Triple(order, customer, item))
                }
            }
            .leftJoin(inventory) { (order, customer, item), inv ->
                val available = inv != null && inv.quantity >= item.quantity
                Quadruple(order, customer, item, available)
            }
            .groupBy { _, (order, _, _, _) -> order.orderId }
            .aggregate(
                { mutableMapOf<String, Any>() },
                { orderId, (order, customer, item, available), agg ->
                    if (!agg.containsKey("order")) {
                        agg["order"] = order
                        agg["customer"] = customer
                        agg["inventory"] = mutableMapOf<String, Boolean>()
                    }
                    (agg["inventory"] as MutableMap<String, Boolean>)[item.productId] = available
                    agg
                }
            )
        
        // Route based on inventory status
        val branches = withInventory.toStream().branch(
            { _, data ->
                val inventory = data["inventory"] as Map<String, Boolean>
                inventory.values.all { it }
            },
            { _, _ -> true }
        )
        
        branches[0].to("orders-approved")
        branches[1].to("orders-pending")
        
        return builder.build()
    }
}

data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
```

---

## Best Practices

### Configuration

```kotlin
fun productionConfig(): Properties {
    return Properties().apply {
        // Application
        put(StreamsConfig.APPLICATION_ID_CONFIG, "my-app")
        put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka1:9092,kafka2:9092")
        
        // Processing
        put(StreamsConfig.PROCESSING_GUARANTEE_CONFIG, StreamsConfig.EXACTLY_ONCE_V2)
        put(StreamsConfig.NUM_STREAM_THREADS_CONFIG, 4)
        
        // Performance
        put(StreamsConfig.CACHE_MAX_BYTES_BUFFERING_CONFIG, 10 * 1024 * 1024)
        put(StreamsConfig.COMMIT_INTERVAL_MS_CONFIG, 1000)
        
        // State stores
        put(StreamsConfig.STATE_DIR_CONFIG, "/var/kafka-streams")
        
        // Monitoring
        put(StreamsConfig.METRICS_RECORDING_LEVEL_CONFIG, "INFO")
    }
}
```

### Error Handling

```kotlin
val streams = KafkaStreams(topology, config)

streams.setUncaughtExceptionHandler { thread, throwable ->
    logger.error("Uncaught exception in thread $thread", throwable)
    StreamsUncaughtExceptionHandler.StreamThreadExceptionResponse.REPLACE_THREAD
}

streams.setStateListener { newState, oldState ->
    logger.info("State changed from $oldState to $newState")
    if (newState == KafkaStreams.State.ERROR) {
        // Alert or restart
    }
}
```

### State Store Queries

```kotlin
// Interactive queries
val store: ReadOnlyKeyValueStore<String, Long> = streams.store(
    StoreQueryParameters.fromNameAndType(
        "word-counts",
        QueryableStoreTypes.keyValueStore()
    )
)

val count = store.get("hello")
println("Count for 'hello': $count")

// Range queries
store.range("a", "z").use { iterator ->
    iterator.forEach { entry ->
        println("${entry.key}: ${entry.value}")
    }
}
```

### Monitoring

```kotlin
// Metrics
streams.metrics().forEach { (name, metric) ->
    println("${name.name()}: ${metric.metricValue()}")
}

// Lag monitoring
val lagInfo = streams.allLocalStorePartitionLags()
lagInfo.forEach { (storeName, lags) ->
    lags.forEach { lag ->
        println("Store: $storeName, Partition: ${lag.topicPartition()}, Lag: ${lag.currentOffsetPosition()}")
    }
}
```

### Graceful Shutdown

```kotlin
fun main() {
    val streams = KafkaStreams(topology, config)
    streams.start()
    
    Runtime.getRuntime().addShutdownHook(Thread {
        logger.info("Shutting down...")
        streams.close(Duration.ofSeconds(30))
        logger.info("Shutdown complete")
    })
    
    Thread.currentThread().join()
}
```

---

## Summary

### Key Concepts

**Core Components:**
- ✅ KStream (event stream)
- ✅ KTable (changelog stream)
- ✅ Serdes (serialization)
- ✅ Topology (processing graph)

**Operations:**
- ✅ Stateless (filter, map, branch)
- ✅ Stateful (aggregate, reduce, join)
- ✅ Windowing (tumbling, hopping, session)

**Patterns:**
- ✅ Real-time analytics
- ✅ Event enrichment
- ✅ Fraud detection
- ✅ IoT processing

### Learning Path

1. **Beginner**: Basic streams, filters, maps
2. **Intermediate**: Aggregations, windowing, joins
3. **Advanced**: State stores, interactive queries
4. **Professional**: Production deployment, monitoring

### Resources

- **Kafka Streams Docs**: https://kafka.apache.org/documentation/streams/
- **Confluent Tutorials**: https://kafka-tutorials.confluent.io/
- **Examples**: https://github.com/confluentinc/kafka-streams-examples

---

**You're now ready to build production-grade stream processing applications!** 🚀
