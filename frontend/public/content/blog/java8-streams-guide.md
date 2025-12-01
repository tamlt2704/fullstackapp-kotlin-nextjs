---
title: "Java 8 Streams - Complete Guide"
date: "2024-12-13"
category: "Programming"
tags: ["Java", "Java8", "Streams", "Functional Programming", "Collections"]
---

# Java 8 Streams - Complete Guide

## What are Streams?

Streams represent a sequence of elements supporting sequential and parallel aggregate operations. They enable functional-style operations on collections.

**Key Characteristics**:
- No storage - streams don't store elements
- Functional - operations produce results without modifying source
- Lazy - computed on demand
- Possibly unbounded - infinite streams supported
- Consumable - elements visited once

---

## Stream Creation

```java
// From Collection
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream = list.stream();

// From Array
String[] array = {"a", "b", "c"};
Stream<String> streamFromArray = Arrays.stream(array);

// Using Stream.of()
Stream<String> streamOf = Stream.of("a", "b", "c");

// Empty Stream
Stream<String> empty = Stream.empty();

// Infinite Stream
Stream<Integer> infinite = Stream.iterate(0, n -> n + 2);

// Stream Builder
Stream<String> built = Stream.<String>builder()
    .add("a").add("b").add("c").build();
```

---

## Intermediate Operations

### filter()
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// Result: [2, 4, 6]
```

### map()
```java
List<String> names = Arrays.asList("alice", "bob", "charlie");
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// Result: [ALICE, BOB, CHARLIE]
```

### flatMap()
```java
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2), 
    Arrays.asList(3, 4)
);
List<Integer> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());
// Result: [1, 2, 3, 4]
```

### distinct()
```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 4);
List<Integer> unique = numbers.stream()
    .distinct()
    .collect(Collectors.toList());
// Result: [1, 2, 3, 4]
```

### sorted()
```java
List<String> names = Arrays.asList("charlie", "alice", "bob");
List<String> sorted = names.stream()
    .sorted()
    .collect(Collectors.toList());
// Result: [alice, bob, charlie]

// Custom comparator
List<String> reversed = names.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());
```

### limit() & skip()
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> limited = numbers.stream()
    .limit(3)
    .collect(Collectors.toList());
// Result: [1, 2, 3]

List<Integer> skipped = numbers.stream()
    .skip(2)
    .collect(Collectors.toList());
// Result: [3, 4, 5]
```

### peek()
```java
List<Integer> numbers = Arrays.asList(1, 2, 3);
List<Integer> result = numbers.stream()
    .peek(n -> System.out.println("Processing: " + n))
    .map(n -> n * 2)
    .collect(Collectors.toList());
```

---

## Terminal Operations

### collect()
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// To List
List<String> list = names.stream().collect(Collectors.toList());

// To Set
Set<String> set = names.stream().collect(Collectors.toSet());

// To Map
Map<String, Integer> map = names.stream()
    .collect(Collectors.toMap(s -> s, String::length));

// Joining
String joined = names.stream()
    .collect(Collectors.joining(", "));
// Result: "Alice, Bob, Charlie"
```

### forEach()
```java
List<String> names = Arrays.asList("Alice", "Bob");
names.stream().forEach(System.out::println);
```

### reduce()
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Sum
int sum = numbers.stream()
    .reduce(0, (a, b) -> a + b);
// Result: 15

// Product
int product = numbers.stream()
    .reduce(1, (a, b) -> a * b);
// Result: 120

// Max
Optional<Integer> max = numbers.stream()
    .reduce(Integer::max);
```

### count()
```java
long count = Stream.of("a", "b", "c").count();
// Result: 3
```

### anyMatch(), allMatch(), noneMatch()
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

boolean hasEven = numbers.stream().anyMatch(n -> n % 2 == 0);
// Result: true

boolean allPositive = numbers.stream().allMatch(n -> n > 0);
// Result: true

boolean noneNegative = numbers.stream().noneMatch(n -> n < 0);
// Result: true
```

### findFirst() & findAny()
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

Optional<String> first = names.stream()
    .filter(s -> s.startsWith("B"))
    .findFirst();
// Result: Optional[Bob]

Optional<String> any = names.stream()
    .filter(s -> s.length() > 3)
    .findAny();
```

### min() & max()
```java
List<Integer> numbers = Arrays.asList(3, 1, 4, 1, 5);

Optional<Integer> min = numbers.stream().min(Integer::compareTo);
// Result: Optional[1]

Optional<Integer> max = numbers.stream().max(Integer::compareTo);
// Result: Optional[5]
```

---

## Advanced Collectors

### groupingBy()
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));
// Result: {3=[Bob], 5=[Alice, David], 7=[Charlie]}

// With counting
Map<Integer, Long> lengthCount = names.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));
```

### partitioningBy()
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

Map<Boolean, List<Integer>> partitioned = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// Result: {false=[1, 3, 5], true=[2, 4, 6]}
```

### summarizingInt()
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

IntSummaryStatistics stats = names.stream()
    .collect(Collectors.summarizingInt(String::length));

System.out.println(stats.getAverage()); // 5.0
System.out.println(stats.getMax());     // 7
System.out.println(stats.getMin());     // 3
System.out.println(stats.getSum());     // 15
```

---

## Practical Use Cases

### 1. Filter and Transform Data
```java
class Employee {
    String name;
    int salary;
    String department;
}

List<Employee> employees = getEmployees();

List<String> highEarners = employees.stream()
    .filter(e -> e.salary > 50000)
    .map(Employee::getName)
    .collect(Collectors.toList());
```

### 2. Calculate Statistics
```java
double avgSalary = employees.stream()
    .mapToInt(Employee::getSalary)
    .average()
    .orElse(0.0);

int totalSalary = employees.stream()
    .mapToInt(Employee::getSalary)
    .sum();
```

### 3. Group and Aggregate
```java
Map<String, Double> avgSalaryByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.averagingInt(Employee::getSalary)
    ));
```

### 4. Find Top N Elements
```java
List<Employee> top5Earners = employees.stream()
    .sorted(Comparator.comparing(Employee::getSalary).reversed())
    .limit(5)
    .collect(Collectors.toList());
```

### 5. Remove Duplicates
```java
List<String> uniqueNames = employees.stream()
    .map(Employee::getName)
    .distinct()
    .collect(Collectors.toList());
```

### 6. Convert List to Map
```java
Map<String, Employee> employeeMap = employees.stream()
    .collect(Collectors.toMap(
        Employee::getName,
        e -> e,
        (e1, e2) -> e1 // Handle duplicates
    ));
```

### 7. Nested Collections
```java
class Department {
    List<Employee> employees;
}

List<Department> departments = getDepartments();

List<Employee> allEmployees = departments.stream()
    .flatMap(d -> d.getEmployees().stream())
    .collect(Collectors.toList());
```

### 8. String Operations
```java
List<String> words = Arrays.asList("hello", "world", "java", "streams");

String result = words.stream()
    .filter(w -> w.length() > 4)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.joining(", "));
// Result: "HELLO, STREAMS, WORLD"
```

### 9. Parallel Processing
```java
long count = employees.parallelStream()
    .filter(e -> e.getSalary() > 50000)
    .count();
```

### 10. Custom Collector
```java
String csv = employees.stream()
    .map(Employee::getName)
    .collect(Collectors.collectingAndThen(
        Collectors.toList(),
        list -> String.join(",", list)
    ));
```

---

## Performance Tips

1. **Use Primitive Streams**: IntStream, LongStream, DoubleStream avoid boxing
```java
int sum = IntStream.range(1, 100).sum();
```

2. **Parallel Streams**: Use for large datasets
```java
list.parallelStream().filter(...).collect(...);
```

3. **Short-circuit Operations**: Use findFirst(), anyMatch() when possible
```java
boolean found = list.stream().anyMatch(predicate);
```

4. **Avoid Stateful Operations**: Don't modify external state in lambdas

5. **Order Matters**: Place filter() before map() to reduce processing

---

## Common Patterns

### Pattern 1: Filter-Map-Collect
```java
List<String> result = list.stream()
    .filter(condition)
    .map(transformation)
    .collect(Collectors.toList());
```

### Pattern 2: FlatMap for Nested Structures
```java
List<Item> allItems = orders.stream()
    .flatMap(order -> order.getItems().stream())
    .collect(Collectors.toList());
```

### Pattern 3: Group and Summarize
```java
Map<Category, DoubleSummaryStatistics> stats = products.stream()
    .collect(Collectors.groupingBy(
        Product::getCategory,
        Collectors.summarizingDouble(Product::getPrice)
    ));
```

### Pattern 4: Optional Handling
```java
String result = list.stream()
    .filter(predicate)
    .findFirst()
    .orElse("default");
```

---

## Best Practices

✅ **Use method references** when possible: `String::toUpperCase`
✅ **Keep lambdas short** - extract complex logic to methods
✅ **Prefer streams for readability** over traditional loops
✅ **Use Optional properly** - avoid get() without checking
✅ **Consider parallel streams** for CPU-intensive operations on large datasets
✅ **Chain operations efficiently** - filter early, map late

❌ **Don't modify external state** in stream operations
❌ **Don't reuse streams** - they can only be consumed once
❌ **Don't overuse parallel streams** - overhead for small datasets
❌ **Don't ignore exceptions** - handle them properly in lambdas

---

## Conclusion

Java 8 Streams provide a powerful, expressive way to process collections. Master these operations to write cleaner, more maintainable code.

**Key Takeaways**:
- Streams enable functional programming in Java
- Intermediate operations are lazy, terminal operations trigger execution
- Use appropriate collectors for different aggregation needs
- Consider performance implications of parallel streams
- Practice with real-world scenarios to build proficiency
 
---

*Happy Streaming!*
