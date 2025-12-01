---
title: "Kotlin DataFrame & Lets-Plot: Complete Data Analytics Guide"
date: "2024-12-08"
category: "Data Science"
tags: ["Kotlin", "DataFrame", "Lets-Plot", "Data Analytics", "Visualization"]
---

# Kotlin DataFrame & Lets-Plot: Complete Data Analytics Guide

*From Beginner to Professional in Kotlin Data Analytics*

## Table of Contents
1. [Introduction](#introduction)
2. [Setup & Installation](#setup--installation)
3. [DataFrame Fundamentals](#dataframe-fundamentals)
4. [Data Operations](#data-operations)
5. [Data Transformation](#data-transformation)
6. [Lets-Plot Basics](#lets-plot-basics)
7. [Advanced Visualizations](#advanced-visualizations)
8. [Real-World Projects](#real-world-projects)
9. [Best Practices](#best-practices)

---

## Introduction

### Why Kotlin for Data Analytics?

**Advantages:**
- Type-safe data manipulation
- Null-safety built-in
- Seamless Java interop
- Modern language features
- Jupyter notebook support
- Excellent IDE support

**Kotlin DataFrame** - Pandas-like API for Kotlin
**Lets-Plot** - Grammar of Graphics visualization library (ggplot2 for Kotlin)

---

## Setup & Installation

### Gradle Setup

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "1.9.22"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:dataframe:0.13.1")
    implementation("org.jetbrains.lets-plot:lets-plot-kotlin:4.5.0")
    implementation("org.jetbrains.lets-plot:lets-plot-image-export:4.2.0")
}
```

### Jupyter Notebook Setup

```bash
# Install Kotlin kernel
pip install kotlin-jupyter-kernel

# Start Jupyter
jupyter notebook
```

```kotlin
// In Jupyter cell
%use dataframe
%use lets-plot
```

### First Program

```kotlin
import org.jetbrains.kotlinx.dataframe.*
import org.jetbrains.kotlinx.dataframe.api.*
import org.jetbrains.letsPlot.*
import org.jetbrains.letsPlot.geom.*

fun main() {
    val df = dataFrameOf(
        "name" to listOf("Alice", "Bob", "Charlie"),
        "age" to listOf(25, 30, 35),
        "salary" to listOf(50000, 60000, 70000)
    )
    println(df)
}
```

---

## DataFrame Fundamentals

### Creating DataFrames

#### From Collections
```kotlin
// Method 1: dataFrameOf
val df1 = dataFrameOf(
    "id" to listOf(1, 2, 3),
    "name" to listOf("Alice", "Bob", "Charlie"),
    "score" to listOf(95.5, 87.3, 92.1)
)

// Method 2: toDataFrame
data class Student(val id: Int, val name: String, val score: Double)
val students = listOf(
    Student(1, "Alice", 95.5),
    Student(2, "Bob", 87.3),
    Student(3, "Charlie", 92.1)
)
val df2 = students.toDataFrame()

// Method 3: Empty DataFrame
val df3 = dataFrameOf("col1", "col2", "col3").empty()
```

#### From Files
```kotlin
// CSV
val dfCsv = DataFrame.read("data.csv")
val dfCsvOptions = DataFrame.read("data.csv") {
    delimiter = ';'
    header = listOf("id", "name", "value")
}

// JSON
val dfJson = DataFrame.read("data.json")

// Excel (requires Apache POI)
val dfExcel = DataFrame.read("data.xlsx")
```

#### From URLs
```kotlin
val url = "https://raw.githubusercontent.com/datasets/covid-19/main/data/countries-aggregated.csv"
val df = DataFrame.read(url)
```

### DataFrame Structure

```kotlin
val df = dataFrameOf(
    "id" to listOf(1, 2, 3, 4, 5),
    "name" to listOf("Alice", "Bob", "Charlie", "David", "Eve"),
    "age" to listOf(25, 30, 35, 28, 32),
    "city" to listOf("NYC", "LA", "NYC", "Chicago", "LA"),
    "salary" to listOf(50000, 60000, 70000, 55000, 65000)
)

// Basic info
println(df.rowsCount())        // 5
println(df.columnsCount())     // 5
println(df.columnNames())      // [id, name, age, city, salary]
println(df.columnTypes())      // Column types

// Schema
df.schema().print()

// First/Last rows
df.head(3)                     // First 3 rows
df.tail(2)                     // Last 2 rows

// Describe statistics
df.describe()
```

### Accessing Data

```kotlin
// Column access
val names = df["name"]
val ages = df.age              // Type-safe accessor
val salaries = df["salary"].cast<Int>()

// Row access
val firstRow = df[0]
val lastRow = df[df.rowsCount() - 1]

// Cell access
val value = df["name"][0]      // "Alice"
val value2 = df[2]["salary"]   // 70000

// Multiple columns
val subset = df.select("name", "age")
```

---

## Data Operations

### Filtering

```kotlin
// Simple filter
val filtered = df.filter { age > 30 }

// Multiple conditions
val filtered2 = df.filter { 
    age > 25 && city == "NYC" 
}

// Complex conditions
val filtered3 = df.filter { 
    (age > 30 || salary > 60000) && city != "Chicago"
}

// Filter by column values
val filtered4 = df.filter { city in listOf("NYC", "LA") }

// Null filtering
val nonNull = df.filter { name != null }
```

### Sorting

```kotlin
// Sort ascending
val sorted1 = df.sortBy("age")

// Sort descending
val sorted2 = df.sortByDesc("salary")

// Multiple columns
val sorted3 = df.sortBy("city", "age")

// Custom comparator
val sorted4 = df.sortBy { age }.thenByDesc { salary }
```

### Selecting Columns

```kotlin
// Select specific columns
val selected1 = df.select("name", "age")

// Select by type
val numericCols = df.select { colsOf<Int>() }

// Exclude columns
val excluded = df.remove("id")

// Rename columns
val renamed = df.rename("name" to "full_name", "age" to "years")

// Reorder columns
val reordered = df.select("salary", "name", "age", "city", "id")
```

### Adding/Modifying Columns

```kotlin
// Add new column
val df2 = df.add("bonus") { salary * 0.1 }

// Add multiple columns
val df3 = df.add {
    "bonus" from { salary * 0.1 }
    "total" from { salary + salary * 0.1 }
    "age_group" from { if (age < 30) "Young" else "Senior" }
}

// Modify existing column
val df4 = df.update("salary") { it * 1.1 }

// Conditional update
val df5 = df.update("salary").where { city == "NYC" }.with { it * 1.2 }
```

### Grouping & Aggregation

```kotlin
// Group by single column
val grouped = df.groupBy("city").aggregate {
    count() into "count"
    mean("salary") into "avg_salary"
    max("age") into "max_age"
}

// Multiple aggregations
val agg = df.groupBy("city").aggregate {
    count() into "total"
    sum("salary") into "total_salary"
    mean("salary") into "avg_salary"
    median("age") into "median_age"
    std("salary") into "salary_std"
}

// Group by multiple columns
val grouped2 = df.groupBy("city", "age_group").aggregate {
    count() into "count"
    mean("salary") into "avg_salary"
}

// Custom aggregation
val custom = df.groupBy("city").aggregate {
    "salary_range" from { max("salary")!! - min("salary")!! }
}
```

### Joining DataFrames

```kotlin
val employees = dataFrameOf(
    "emp_id" to listOf(1, 2, 3),
    "name" to listOf("Alice", "Bob", "Charlie"),
    "dept_id" to listOf(10, 20, 10)
)

val departments = dataFrameOf(
    "dept_id" to listOf(10, 20, 30),
    "dept_name" to listOf("Engineering", "Sales", "HR")
)

// Inner join
val inner = employees.join(departments, "dept_id")

// Left join
val left = employees.leftJoin(departments, "dept_id")

// Right join
val right = employees.rightJoin(departments, "dept_id")

// Full outer join
val outer = employees.fullJoin(departments, "dept_id")

// Join on different column names
val joined = employees.join(departments) { 
    match(left.dept_id with right.dept_id) 
}
```

---

## Data Transformation

### Pivoting

```kotlin
val sales = dataFrameOf(
    "date" to listOf("2024-01", "2024-01", "2024-02", "2024-02"),
    "product" to listOf("A", "B", "A", "B"),
    "revenue" to listOf(1000, 1500, 1200, 1600)
)

// Pivot
val pivoted = sales.pivot("product").groupBy("date").values("revenue").sum()
// Result:
//   date    | A    | B
//   2024-01 | 1000 | 1500
//   2024-02 | 1200 | 1600
```

### Melting (Unpivot)

```kotlin
val wide = dataFrameOf(
    "id" to listOf(1, 2),
    "Q1" to listOf(100, 150),
    "Q2" to listOf(120, 160),
    "Q3" to listOf(130, 170)
)

// Melt
val long = wide.gather("Q1", "Q2", "Q3").into("quarter", "sales")
// Result:
//   id | quarter | sales
//   1  | Q1      | 100
//   1  | Q2      | 120
//   1  | Q3      | 130
//   2  | Q1      | 150
//   ...
```

### Window Functions

```kotlin
// Ranking
val ranked = df.add("rank") { 
    sortBy("salary").rowNumber() 
}

// Running totals
val cumulative = df.sortBy("date").add("cumulative_sales") {
    cumSum("sales")
}

// Moving average
val ma = df.sortBy("date").add("ma_7") {
    movingAverage("value", 7)
}

// Lag/Lead
val lagged = df.add {
    "prev_value" from { lag("value", 1) }
    "next_value" from { lead("value", 1) }
}
```

### String Operations

```kotlin
// String methods
val df = dataFrameOf(
    "name" to listOf("alice", "BOB", "Charlie")
)

val transformed = df.add {
    "upper" from { name.uppercase() }
    "lower" from { name.lowercase() }
    "capitalized" from { name.capitalize() }
    "length" from { name.length }
    "contains_a" from { name.contains("a", ignoreCase = true) }
}

// Split strings
val emails = dataFrameOf(
    "email" to listOf("alice@example.com", "bob@test.org")
)

val split = emails.add {
    "username" from { email.split("@")[0] }
    "domain" from { email.split("@")[1] }
}
```

### Date/Time Operations

```kotlin
import java.time.LocalDate
import java.time.format.DateTimeFormatter

val dates = dataFrameOf(
    "date_str" to listOf("2024-01-15", "2024-02-20", "2024-03-10")
)

val parsed = dates.add {
    "date" from { LocalDate.parse(date_str) }
    "year" from { LocalDate.parse(date_str).year }
    "month" from { LocalDate.parse(date_str).monthValue }
    "day" from { LocalDate.parse(date_str).dayOfMonth }
    "day_of_week" from { LocalDate.parse(date_str).dayOfWeek }
}
```

---

## Lets-Plot Basics

### First Plot

```kotlin
val data = mapOf(
    "x" to listOf(1, 2, 3, 4, 5),
    "y" to listOf(2, 4, 6, 8, 10)
)

val plot = letsPlot(data) + 
    geomLine { x = "x"; y = "y" } +
    ggtitle("My First Plot")

plot.show()
```

### Plot Types

#### Scatter Plot
```kotlin
val df = dataFrameOf(
    "x" to (1..100).map { it.toDouble() },
    "y" to (1..100).map { it + kotlin.random.Random.nextDouble(-10.0, 10.0) }
)

letsPlot(df.toMap()) { x = "x"; y = "y" } +
    geomPoint(size = 3, color = "blue", alpha = 0.6) +
    ggtitle("Scatter Plot") +
    xlab("X Values") + ylab("Y Values")
```

#### Line Plot
```kotlin
val timeSeries = dataFrameOf(
    "date" to (1..30).toList(),
    "value" to (1..30).map { 100 + kotlin.random.Random.nextInt(-20, 20) }
)

letsPlot(timeSeries.toMap()) { x = "date"; y = "value" } +
    geomLine(color = "darkblue", size = 1.5) +
    geomPoint(color = "red", size = 2) +
    ggtitle("Time Series")
```

#### Bar Chart
```kotlin
val categories = dataFrameOf(
    "category" to listOf("A", "B", "C", "D"),
    "value" to listOf(23, 45, 12, 34)
)

letsPlot(categories.toMap()) { x = "category"; y = "value" } +
    geomBar(stat = Stat.identity, fill = "steelblue") +
    ggtitle("Bar Chart")
```

#### Histogram
```kotlin
val values = dataFrameOf(
    "value" to List(1000) { kotlin.random.Random.nextGaussian() * 10 + 50 }
)

letsPlot(values.toMap()) { x = "value" } +
    geomHistogram(bins = 30, fill = "lightblue", color = "black") +
    ggtitle("Distribution")
```

#### Box Plot
```kotlin
val groups = dataFrameOf(
    "group" to List(300) { listOf("A", "B", "C").random() },
    "value" to List(300) { kotlin.random.Random.nextDouble(0.0, 100.0) }
)

letsPlot(groups.toMap()) { x = "group"; y = "value" } +
    geomBoxplot(fill = "lightgreen") +
    ggtitle("Box Plot by Group")
```

### Customization

```kotlin
// Colors and themes
letsPlot(data) { x = "x"; y = "y" } +
    geomPoint(color = "red", size = 4, alpha = 0.7) +
    theme(
        axisTitle = elementText(size = 14, face = "bold"),
        plotTitle = elementText(size = 16, face = "bold")
    ) +
    scaleColorGradient(low = "blue", high = "red")

// Multiple layers
letsPlot(df.toMap()) { x = "x"; y = "y" } +
    geomPoint(color = "blue", alpha = 0.5) +
    geomLine(color = "red", size = 1) +
    geomSmooth(method = "lm", color = "green")

// Faceting
letsPlot(df.toMap()) { x = "x"; y = "y" } +
    geomPoint() +
    facetGrid(x = "category")
```

---

## Advanced Visualizations

### Heatmap

```kotlin
val matrix = dataFrameOf(
    "x" to List(100) { (it % 10).toString() },
    "y" to List(100) { (it / 10).toString() },
    "value" to List(100) { kotlin.random.Random.nextDouble(0.0, 100.0) }
)

letsPlot(matrix.toMap()) { x = "x"; y = "y"; fill = "value" } +
    geomTile() +
    scaleFillGradient(low = "white", high = "darkblue") +
    ggtitle("Heatmap")
```

### Violin Plot

```kotlin
letsPlot(groups.toMap()) { x = "group"; y = "value" } +
    geomViolin(fill = "lightblue", alpha = 0.7) +
    geomBoxplot(width = 0.1, fill = "white") +
    ggtitle("Violin Plot")
```

### Density Plot

```kotlin
letsPlot(values.toMap()) { x = "value" } +
    geomDensity(fill = "lightblue", alpha = 0.5, color = "blue") +
    ggtitle("Density Plot")
```

### Multiple Plots

```kotlin
import org.jetbrains.letsPlot.gggrid

val plot1 = letsPlot(data1) + geomPoint()
val plot2 = letsPlot(data2) + geomLine()
val plot3 = letsPlot(data3) + geomBar(stat = Stat.identity)

val grid = gggrid(listOf(plot1, plot2, plot3), ncol = 2)
grid.show()
```

### Interactive Features

```kotlin
// Tooltips
letsPlot(df.toMap()) { x = "x"; y = "y" } +
    geomPoint(tooltips = layerTooltips()
        .line("X: @x")
        .line("Y: @y")
        .line("Category: @category")
    )

// Zoom and pan (automatic in browser)
```

---

## Real-World Projects

### Project 1: Sales Analysis

```kotlin
// Load data
val sales = DataFrame.read("sales_data.csv")

// Clean data
val cleaned = sales
    .filter { amount > 0 }
    .dropNulls()
    .add("month") { date.substring(0, 7) }

// Aggregate
val monthlySales = cleaned
    .groupBy("month", "product")
    .aggregate {
        sum("amount") into "total_sales"
        count() into "transactions"
    }

// Visualize
letsPlot(monthlySales.toMap()) { 
    x = "month"; y = "total_sales"; color = "product" 
} +
    geomLine(size = 1.5) +
    geomPoint(size = 3) +
    ggtitle("Monthly Sales by Product") +
    theme(axisTextX = elementText(angle = 45))
```

### Project 2: Customer Segmentation

```kotlin
// Load customer data
val customers = DataFrame.read("customers.csv")

// Feature engineering
val features = customers.add {
    "recency_score" from { 
        when {
            days_since_purchase < 30 -> 5
            days_since_purchase < 90 -> 4
            days_since_purchase < 180 -> 3
            days_since_purchase < 365 -> 2
            else -> 1
        }
    }
    "frequency_score" from {
        when {
            purchase_count > 20 -> 5
            purchase_count > 10 -> 4
            purchase_count > 5 -> 3
            purchase_count > 2 -> 2
            else -> 1
        }
    }
    "monetary_score" from {
        when {
            total_spent > 10000 -> 5
            total_spent > 5000 -> 4
            total_spent > 2000 -> 3
            total_spent > 500 -> 2
            else -> 1
        }
    }
}

// Segment
val segmented = features.add("segment") {
    when {
        recency_score >= 4 && frequency_score >= 4 -> "Champions"
        recency_score >= 3 && frequency_score >= 3 -> "Loyal"
        recency_score >= 4 && frequency_score < 3 -> "Promising"
        recency_score < 3 && frequency_score >= 4 -> "At Risk"
        else -> "Needs Attention"
    }
}

// Visualize
val segmentStats = segmented.groupBy("segment").aggregate {
    count() into "count"
    mean("total_spent") into "avg_spent"
}

letsPlot(segmentStats.toMap()) { x = "segment"; y = "count" } +
    geomBar(stat = Stat.identity, fill = "steelblue") +
    geomText(labelFormat = ".0f") { label = "count"; y = "count" } +
    ggtitle("Customer Segments")
```

### Project 3: Time Series Forecasting

```kotlin
// Load time series data
val ts = DataFrame.read("time_series.csv")
    .add("date") { LocalDate.parse(date_str) }
    .sortBy("date")

// Calculate moving averages
val withMA = ts.add {
    "ma_7" from { movingAverage("value", 7) }
    "ma_30" from { movingAverage("value", 30) }
}

// Plot
letsPlot(withMA.toMap()) { x = "date" } +
    geomLine { y = "value"; color = "Actual" } +
    geomLine { y = "ma_7"; color = "MA-7" } +
    geomLine { y = "ma_30"; color = "MA-30" } +
    ggtitle("Time Series with Moving Averages") +
    scaleColorManual(
        values = listOf("black", "blue", "red"),
        name = "Series"
    )
```

### Project 4: A/B Test Analysis

```kotlin
val abTest = DataFrame.read("ab_test.csv")

// Calculate metrics
val results = abTest.groupBy("variant").aggregate {
    count() into "users"
    sum("converted") into "conversions"
    mean("converted") into "conversion_rate"
    mean("revenue") into "avg_revenue"
}

// Statistical significance (simplified)
val controlRate = results.filter { variant == "A" }["conversion_rate"][0] as Double
val testRate = results.filter { variant == "B" }["conversion_rate"][0] as Double
val lift = (testRate - controlRate) / controlRate * 100

println("Lift: ${String.format("%.2f", lift)}%")

// Visualize
letsPlot(results.toMap()) { 
    x = "variant"; y = "conversion_rate" 
} +
    geomBar(stat = Stat.identity, fill = "lightblue") +
    geomText { label = "conversion_rate"; y = "conversion_rate" } +
    ggtitle("A/B Test Results") +
    ylab("Conversion Rate")
```

---

## Best Practices

### Performance Optimization

```kotlin
// 1. Use lazy operations
val lazy = df
    .filter { age > 25 }
    .select("name", "salary")
    .sortBy("salary")
    // Operations are chained efficiently

// 2. Avoid repeated conversions
val dataMap = df.toMap()  // Convert once
val plot1 = letsPlot(dataMap) + geomPoint()
val plot2 = letsPlot(dataMap) + geomLine()

// 3. Use appropriate data types
val optimized = df.convert("id").to<Int>()

// 4. Filter early
val efficient = df
    .filter { date > "2024-01-01" }  // Filter first
    .groupBy("category")
    .aggregate { sum("amount") }
```

### Code Organization

```kotlin
// Separate data processing and visualization
class DataProcessor {
    fun loadAndClean(path: String): DataFrame<*> {
        return DataFrame.read(path)
            .dropNulls()
            .filter { amount > 0 }
    }
    
    fun aggregate(df: DataFrame<*>): DataFrame<*> {
        return df.groupBy("category").aggregate {
            sum("amount") into "total"
        }
    }
}

class Visualizer {
    fun createBarChart(df: DataFrame<*>, title: String) =
        letsPlot(df.toMap()) { x = "category"; y = "total" } +
            geomBar(stat = Stat.identity) +
            ggtitle(title)
}
```

### Error Handling

```kotlin
fun safeRead(path: String): DataFrame<*>? {
    return try {
        DataFrame.read(path)
    } catch (e: Exception) {
        println("Error reading file: ${e.message}")
        null
    }
}

fun validateData(df: DataFrame<*>): Boolean {
    return df.rowsCount() > 0 && 
           df.columnsCount() > 0 &&
           df["amount"].all { it != null }
}
```

### Export Results

```kotlin
// Save DataFrame
df.writeCSV("output.csv")
df.writeJson("output.json")

// Save plots
import org.jetbrains.letsPlot.export.ggsave

val plot = letsPlot(data) + geomPoint()
ggsave(plot, "plot.png", dpi = 300)
ggsave(plot, "plot.svg")
```

---

## Summary

### Key Takeaways

**DataFrame:**
- ✅ Type-safe data manipulation
- ✅ Pandas-like API
- ✅ Powerful aggregation and grouping
- ✅ Seamless file I/O
- ✅ Null-safety

**Lets-Plot:**
- ✅ Grammar of Graphics
- ✅ Rich visualization types
- ✅ Customizable themes
- ✅ Interactive features
- ✅ Export capabilities

### Learning Path

1. **Beginner**: Basic DataFrame operations, simple plots
2. **Intermediate**: Grouping, joining, custom visualizations
3. **Advanced**: Window functions, complex transformations, dashboards
4. **Professional**: Production pipelines, optimization, best practices

### Resources

- **DataFrame Docs**: https://kotlin.github.io/dataframe/
- **Lets-Plot Docs**: https://lets-plot.org/kotlin/
- **Kotlin for Data Science**: https://kotlinlang.org/docs/data-science-overview.html
- **Jupyter Notebooks**: https://github.com/Kotlin/kotlin-jupyter

---

## Practice Exercises

### Exercise 1: Data Cleaning
Load a messy CSV, handle nulls, remove duplicates, standardize formats.

### Exercise 2: Sales Dashboard
Create a multi-panel dashboard with sales trends, top products, regional analysis.

### Exercise 3: Statistical Analysis
Calculate correlations, perform hypothesis tests, create distribution plots.

### Exercise 4: Real-time Data
Process streaming data, update visualizations, maintain rolling windows.

### Exercise 5: ML Pipeline
Prepare data, engineer features, split train/test, visualize results.

---

**You're now ready to perform professional data analytics in Kotlin!** 🚀
