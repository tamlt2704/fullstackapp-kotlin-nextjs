---
title: "Java Streams & Data Structures: Complete Guide with Algorithms"
date: "2024-01-22"
category: "Programming"
tags: ["Java", "Streams", "Data Structures", "Algorithms", "Collections"]
---

# Java Streams & Data Structures: Complete Guide

## Table of Contents
1. [Java Streams Basics](#streams-basics)
2. [Intermediate Streams](#intermediate-streams)
3. [Advanced Streams](#advanced-streams)
4. [Data Structures](#data-structures)
5. [Algorithm Implementations](#algorithms)
6. [Performance & Best Practices](#performance)

## Java Streams Basics

### Creating Streams

```java
// From collections
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> stream = list.stream();

// From arrays
int[] arr = {1, 2, 3, 4, 5};
IntStream intStream = Arrays.stream(arr);

// Stream.of()
Stream<String> names = Stream.of("Alice", "Bob", "Charlie");

// Stream.generate()
Stream<Double> randoms = Stream.generate(Math::random).limit(10);

// Stream.iterate()
Stream<Integer> evens = Stream.iterate(0, n -> n + 2).limit(10);

// IntStream range
IntStream range = IntStream.range(1, 10);  // 1 to 9
IntStream rangeClosed = IntStream.rangeClosed(1, 10);  // 1 to 10
```

### Basic Operations

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// filter
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());

// map
List<Integer> squares = numbers.stream()
    .map(n -> n * n)
    .collect(Collectors.toList());

// forEach
numbers.stream().forEach(System.out::println);

// count
long count = numbers.stream().filter(n -> n > 5).count();

// sum
int sum = numbers.stream().mapToInt(Integer::intValue).sum();

// average
double avg = numbers.stream().mapToInt(Integer::intValue).average().orElse(0);

// min/max
int min = numbers.stream().min(Integer::compare).orElse(0);
int max = numbers.stream().max(Integer::compare).orElse(0);
```

### Collectors

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// toList
List<String> list = names.stream().collect(Collectors.toList());

// toSet
Set<String> set = names.stream().collect(Collectors.toSet());

// toMap
Map<String, Integer> map = names.stream()
    .collect(Collectors.toMap(s -> s, String::length));

// joining
String joined = names.stream().collect(Collectors.joining(", "));

// groupingBy
Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));

// partitioningBy
Map<Boolean, List<Integer>> partition = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));

// counting
long count = names.stream().collect(Collectors.counting());

// summarizingInt
IntSummaryStatistics stats = numbers.stream()
    .collect(Collectors.summarizingInt(Integer::intValue));
```

## Intermediate Streams

### FlatMap

```java
// Flatten nested lists
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2, 3),
    Arrays.asList(4, 5, 6),
    Arrays.asList(7, 8, 9)
);

List<Integer> flat = nested.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());

// Split and flatten strings
List<String> sentences = Arrays.asList("Hello World", "Java Streams");
List<String> words = sentences.stream()
    .flatMap(s -> Arrays.stream(s.split(" ")))
    .collect(Collectors.toList());

// Optional flatMap
Optional<String> result = Optional.of("test")
    .flatMap(s -> Optional.of(s.toUpperCase()));
```

### Reduce

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Sum
int sum = numbers.stream().reduce(0, Integer::sum);

// Product
int product = numbers.stream().reduce(1, (a, b) -> a * b);

// Max
int max = numbers.stream().reduce(Integer.MIN_VALUE, Integer::max);

// String concatenation
List<String> words = Arrays.asList("Java", "Streams", "API");
String concat = words.stream().reduce("", (a, b) -> a + b);

// Complex reduction
int sumOfSquares = numbers.stream()
    .reduce(0, (acc, n) -> acc + n * n, Integer::sum);
```

### Sorting & Distinct

```java
List<Integer> numbers = Arrays.asList(5, 2, 8, 1, 9, 2, 5);

// Sort ascending
List<Integer> sorted = numbers.stream()
    .sorted()
    .collect(Collectors.toList());

// Sort descending
List<Integer> sortedDesc = numbers.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());

// Remove duplicates
List<Integer> distinct = numbers.stream()
    .distinct()
    .collect(Collectors.toList());

// Sort objects
class Person {
    String name;
    int age;
    Person(String name, int age) { this.name = name; this.age = age; }
}

List<Person> people = Arrays.asList(
    new Person("Alice", 30),
    new Person("Bob", 25),
    new Person("Charlie", 35)
);

List<Person> sortedByAge = people.stream()
    .sorted(Comparator.comparing(p -> p.age))
    .collect(Collectors.toList());

List<Person> sortedByName = people.stream()
    .sorted(Comparator.comparing(p -> p.name))
    .collect(Collectors.toList());
```

### Peek & Limit & Skip

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// peek (debugging)
List<Integer> result = numbers.stream()
    .peek(n -> System.out.println("Before: " + n))
    .map(n -> n * 2)
    .peek(n -> System.out.println("After: " + n))
    .collect(Collectors.toList());

// limit
List<Integer> first5 = numbers.stream()
    .limit(5)
    .collect(Collectors.toList());

// skip
List<Integer> skip5 = numbers.stream()
    .skip(5)
    .collect(Collectors.toList());

// Pagination
int page = 2, pageSize = 3;
List<Integer> pageData = numbers.stream()
    .skip((long) (page - 1) * pageSize)
    .limit(pageSize)
    .collect(Collectors.toList());
```

## Advanced Streams

### Parallel Streams

```java
List<Integer> numbers = IntStream.rangeClosed(1, 1000000)
    .boxed()
    .collect(Collectors.toList());

// Sequential
long start = System.currentTimeMillis();
long sum = numbers.stream()
    .mapToLong(Integer::longValue)
    .sum();
long sequential = System.currentTimeMillis() - start;

// Parallel
start = System.currentTimeMillis();
sum = numbers.parallelStream()
    .mapToLong(Integer::longValue)
    .sum();
long parallel = System.currentTimeMillis() - start;

// Custom parallel processing
List<Integer> result = numbers.parallelStream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .collect(Collectors.toList());
```

### Custom Collectors

```java
// Custom collector for immutable list
Collector<String, ?, List<String>> toImmutableList = Collector.of(
    ArrayList::new,
    List::add,
    (left, right) -> { left.addAll(right); return left; },
    Collections::unmodifiableList
);

// Custom collector for statistics
class Stats {
    int count, sum, min, max;
}

Collector<Integer, Stats, Stats> statsCollector = Collector.of(
    Stats::new,
    (stats, n) -> {
        stats.count++;
        stats.sum += n;
        stats.min = stats.count == 1 ? n : Math.min(stats.min, n);
        stats.max = stats.count == 1 ? n : Math.max(stats.max, n);
    },
    (s1, s2) -> {
        s1.count += s2.count;
        s1.sum += s2.sum;
        s1.min = Math.min(s1.min, s2.min);
        s1.max = Math.max(s1.max, s2.max);
        return s1;
    }
);
```

### Stream Matching

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// anyMatch
boolean hasEven = numbers.stream().anyMatch(n -> n % 2 == 0);

// allMatch
boolean allPositive = numbers.stream().allMatch(n -> n > 0);

// noneMatch
boolean noNegative = numbers.stream().noneMatch(n -> n < 0);

// findFirst
Optional<Integer> first = numbers.stream()
    .filter(n -> n > 3)
    .findFirst();

// findAny (useful in parallel)
Optional<Integer> any = numbers.parallelStream()
    .filter(n -> n > 3)
    .findAny();
```

### Complex Stream Pipelines

```java
class Transaction {
    String type;
    double amount;
    String currency;
    Transaction(String type, double amount, String currency) {
        this.type = type;
        this.amount = amount;
        this.currency = currency;
    }
}

List<Transaction> transactions = Arrays.asList(
    new Transaction("DEBIT", 100, "USD"),
    new Transaction("CREDIT", 200, "USD"),
    new Transaction("DEBIT", 150, "EUR"),
    new Transaction("CREDIT", 300, "EUR")
);

// Group by currency and sum amounts
Map<String, Double> sumByCurrency = transactions.stream()
    .collect(Collectors.groupingBy(
        t -> t.currency,
        Collectors.summingDouble(t -> t.amount)
    ));

// Group by type and currency
Map<String, Map<String, List<Transaction>>> grouped = transactions.stream()
    .collect(Collectors.groupingBy(
        t -> t.type,
        Collectors.groupingBy(t -> t.currency)
    ));

// Average amount by type
Map<String, Double> avgByType = transactions.stream()
    .collect(Collectors.groupingBy(
        t -> t.type,
        Collectors.averagingDouble(t -> t.amount)
    ));
```

## Data Structures

### ArrayList Implementation

```java
class MyArrayList<E> {
    private Object[] data;
    private int size;
    private static final int DEFAULT_CAPACITY = 10;
    
    public MyArrayList() {
        data = new Object[DEFAULT_CAPACITY];
    }
    
    public void add(E element) {
        if (size == data.length) resize();
        data[size++] = element;
    }
    
    @SuppressWarnings("unchecked")
    public E get(int index) {
        if (index >= size) throw new IndexOutOfBoundsException();
        return (E) data[index];
    }
    
    public void remove(int index) {
        if (index >= size) throw new IndexOutOfBoundsException();
        System.arraycopy(data, index + 1, data, index, size - index - 1);
        data[--size] = null;
    }
    
    private void resize() {
        data = Arrays.copyOf(data, data.length * 2);
    }
    
    public int size() { return size; }
}
```

### LinkedList Implementation

```java
class MyLinkedList<E> {
    private Node<E> head;
    private int size;
    
    private static class Node<E> {
        E data;
        Node<E> next;
        Node(E data) { this.data = data; }
    }
    
    public void add(E element) {
        if (head == null) {
            head = new Node<>(element);
        } else {
            Node<E> current = head;
            while (current.next != null) current = current.next;
            current.next = new Node<>(element);
        }
        size++;
    }
    
    public void addFirst(E element) {
        Node<E> newNode = new Node<>(element);
        newNode.next = head;
        head = newNode;
        size++;
    }
    
    public E get(int index) {
        if (index >= size) throw new IndexOutOfBoundsException();
        Node<E> current = head;
        for (int i = 0; i < index; i++) current = current.next;
        return current.data;
    }
    
    public void remove(int index) {
        if (index >= size) throw new IndexOutOfBoundsException();
        if (index == 0) {
            head = head.next;
        } else {
            Node<E> current = head;
            for (int i = 0; i < index - 1; i++) current = current.next;
            current.next = current.next.next;
        }
        size--;
    }
    
    public int size() { return size; }
}
```

### Stack Implementation

```java
class MyStack<E> {
    private Node<E> top;
    private int size;
    
    private static class Node<E> {
        E data;
        Node<E> next;
        Node(E data) { this.data = data; }
    }
    
    public void push(E element) {
        Node<E> newNode = new Node<>(element);
        newNode.next = top;
        top = newNode;
        size++;
    }
    
    public E pop() {
        if (isEmpty()) throw new EmptyStackException();
        E data = top.data;
        top = top.next;
        size--;
        return data;
    }
    
    public E peek() {
        if (isEmpty()) throw new EmptyStackException();
        return top.data;
    }
    
    public boolean isEmpty() { return top == null; }
    public int size() { return size; }
}
```

### Queue Implementation

```java
class MyQueue<E> {
    private Node<E> front, rear;
    private int size;
    
    private static class Node<E> {
        E data;
        Node<E> next;
        Node(E data) { this.data = data; }
    }
    
    public void enqueue(E element) {
        Node<E> newNode = new Node<>(element);
        if (isEmpty()) {
            front = rear = newNode;
        } else {
            rear.next = newNode;
            rear = newNode;
        }
        size++;
    }
    
    public E dequeue() {
        if (isEmpty()) throw new NoSuchElementException();
        E data = front.data;
        front = front.next;
        if (front == null) rear = null;
        size--;
        return data;
    }
    
    public E peek() {
        if (isEmpty()) throw new NoSuchElementException();
        return front.data;
    }
    
    public boolean isEmpty() { return front == null; }
    public int size() { return size; }
}
```

### Binary Search Tree

```java
class BST<E extends Comparable<E>> {
    private Node<E> root;
    
    private static class Node<E> {
        E data;
        Node<E> left, right;
        Node(E data) { this.data = data; }
    }
    
    public void insert(E element) {
        root = insertRec(root, element);
    }
    
    private Node<E> insertRec(Node<E> node, E element) {
        if (node == null) return new Node<>(element);
        
        int cmp = element.compareTo(node.data);
        if (cmp < 0) node.left = insertRec(node.left, element);
        else if (cmp > 0) node.right = insertRec(node.right, element);
        
        return node;
    }
    
    public boolean search(E element) {
        return searchRec(root, element);
    }
    
    private boolean searchRec(Node<E> node, E element) {
        if (node == null) return false;
        
        int cmp = element.compareTo(node.data);
        if (cmp == 0) return true;
        if (cmp < 0) return searchRec(node.left, element);
        return searchRec(node.right, element);
    }
    
    public void inorder(Consumer<E> action) {
        inorderRec(root, action);
    }
    
    private void inorderRec(Node<E> node, Consumer<E> action) {
        if (node != null) {
            inorderRec(node.left, action);
            action.accept(node.data);
            inorderRec(node.right, action);
        }
    }
}
```

### HashMap Implementation

```java
class MyHashMap<K, V> {
    private static class Entry<K, V> {
        K key;
        V value;
        Entry<K, V> next;
        Entry(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }
    
    private Entry<K, V>[] table;
    private int size;
    private static final int DEFAULT_CAPACITY = 16;
    
    @SuppressWarnings("unchecked")
    public MyHashMap() {
        table = new Entry[DEFAULT_CAPACITY];
    }
    
    public void put(K key, V value) {
        int index = hash(key);
        Entry<K, V> entry = table[index];
        
        while (entry != null) {
            if (entry.key.equals(key)) {
                entry.value = value;
                return;
            }
            entry = entry.next;
        }
        
        Entry<K, V> newEntry = new Entry<>(key, value);
        newEntry.next = table[index];
        table[index] = newEntry;
        size++;
    }
    
    public V get(K key) {
        int index = hash(key);
        Entry<K, V> entry = table[index];
        
        while (entry != null) {
            if (entry.key.equals(key)) return entry.value;
            entry = entry.next;
        }
        return null;
    }
    
    private int hash(K key) {
        return Math.abs(key.hashCode()) % table.length;
    }
    
    public int size() { return size; }
}
```

## Algorithm Implementations

### Sorting Algorithms

```java
// Bubble Sort - O(n²)
void bubbleSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        for (int j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

// Selection Sort - O(n²)
void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}

// Insertion Sort - O(n²)
void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Merge Sort - O(n log n)
void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void merge(int[] arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    int[] L = new int[n1];
    int[] R = new int[n2];
    
    System.arraycopy(arr, left, L, 0, n1);
    System.arraycopy(arr, mid + 1, R, 0, n2);
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

// Quick Sort - O(n log n) average
void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}

// Heap Sort - O(n log n)
void heapSort(int[] arr) {
    int n = arr.length;
    
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}

void heapify(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest != i) {
        int temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;
        heapify(arr, n, largest);
    }
}
```

### Searching Algorithms

```java
// Binary Search - O(log n)
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}

// Binary Search Recursive
int binarySearchRec(int[] arr, int target, int left, int right) {
    if (left > right) return -1;
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearchRec(arr, target, mid + 1, right);
    return binarySearchRec(arr, target, left, mid - 1);
}

// Linear Search - O(n)
int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

// Jump Search - O(√n)
int jumpSearch(int[] arr, int target) {
    int n = arr.length;
    int step = (int) Math.sqrt(n);
    int prev = 0;
    
    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += (int) Math.sqrt(n);
        if (prev >= n) return -1;
    }
    
    while (arr[prev] < target) {
        prev++;
        if (prev == Math.min(step, n)) return -1;
    }
    
    return arr[prev] == target ? prev : -1;
}
```

### Graph Algorithms

```java
class Graph {
    private int V;
    private List<List<Integer>> adj;
    
    Graph(int v) {
        V = v;
        adj = new ArrayList<>(v);
        for (int i = 0; i < v; i++) {
            adj.add(new ArrayList<>());
        }
    }
    
    void addEdge(int v, int w) {
        adj.get(v).add(w);
    }
    
    // BFS - O(V + E)
    void bfs(int start) {
        boolean[] visited = new boolean[V];
        Queue<Integer> queue = new LinkedList<>();
        
        visited[start] = true;
        queue.offer(start);
        
        while (!queue.isEmpty()) {
            int v = queue.poll();
            System.out.print(v + " ");
            
            for (int neighbor : adj.get(v)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
    }
    
    // DFS - O(V + E)
    void dfs(int start) {
        boolean[] visited = new boolean[V];
        dfsUtil(start, visited);
    }
    
    private void dfsUtil(int v, boolean[] visited) {
        visited[v] = true;
        System.out.print(v + " ");
        
        for (int neighbor : adj.get(v)) {
            if (!visited[neighbor]) {
                dfsUtil(neighbor, visited);
            }
        }
    }
    
    // Topological Sort - O(V + E)
    void topologicalSort() {
        Stack<Integer> stack = new Stack<>();
        boolean[] visited = new boolean[V];
        
        for (int i = 0; i < V; i++) {
            if (!visited[i]) {
                topologicalSortUtil(i, visited, stack);
            }
        }
        
        while (!stack.isEmpty()) {
            System.out.print(stack.pop() + " ");
        }
    }
    
    private void topologicalSortUtil(int v, boolean[] visited, Stack<Integer> stack) {
        visited[v] = true;
        
        for (int neighbor : adj.get(v)) {
            if (!visited[neighbor]) {
                topologicalSortUtil(neighbor, visited, stack);
            }
        }
        
        stack.push(v);
    }
    
    // Dijkstra's Algorithm - O((V + E) log V)
    int[] dijkstra(int src) {
        int[] dist = new int[V];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.offer(new int[]{src, 0});
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0];
            
            for (int v : adj.get(u)) {
                if (dist[u] + 1 < dist[v]) {
                    dist[v] = dist[u] + 1;
                    pq.offer(new int[]{v, dist[v]});
                }
            }
        }
        
        return dist;
    }
}
```

### Dynamic Programming

```java
// Fibonacci - O(n)
int fibonacci(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// Longest Common Subsequence - O(m*n)
int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

// 0/1 Knapsack - O(n*W)
int knapsack(int[] weights, int[] values, int W) {
    int n = weights.length;
    int[][] dp = new int[n + 1][W + 1];
    
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    values[i - 1] + dp[i - 1][w - weights[i - 1]],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][W];
}

// Coin Change - O(n*amount)
int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}

// Edit Distance - O(m*n)
int editDistance(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],      // delete
                    Math.min(
                        dp[i][j - 1],  // insert
                        dp[i - 1][j - 1] // replace
                    )
                );
            }
        }
    }
    
    return dp[m][n];
}
```

### String Algorithms

```java
// KMP Pattern Matching - O(n + m)
int kmpSearch(String text, String pattern) {
    int[] lps = computeLPS(pattern);
    int i = 0, j = 0;
    
    while (i < text.length()) {
        if (text.charAt(i) == pattern.charAt(j)) {
            i++;
            j++;
        }
        
        if (j == pattern.length()) {
            return i - j;
        } else if (i < text.length() && text.charAt(i) != pattern.charAt(j)) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    
    return -1;
}

int[] computeLPS(String pattern) {
    int[] lps = new int[pattern.length()];
    int len = 0, i = 1;
    
    while (i < pattern.length()) {
        if (pattern.charAt(i) == pattern.charAt(len)) {
            lps[i++] = ++len;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
    }
    
    return lps;
}

// Rabin-Karp - O(n + m)
int rabinKarp(String text, String pattern) {
    int d = 256;
    int q = 101;
    int m = pattern.length();
    int n = text.length();
    int p = 0, t = 0, h = 1;
    
    for (int i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }
    
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern.charAt(i)) % q;
        t = (d * t + text.charAt(i)) % q;
    }
    
    for (int i = 0; i <= n - m; i++) {
        if (p == t) {
            boolean match = true;
            for (int j = 0; j < m; j++) {
                if (text.charAt(i + j) != pattern.charAt(j)) {
                    match = false;
                    break;
                }
            }
            if (match) return i;
        }
        
        if (i < n - m) {
            t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;
            if (t < 0) t += q;
        }
    }
    
    return -1;
}
```

## Performance & Best Practices

### Stream Performance Tips

```java
// Use primitive streams for better performance
IntStream.range(0, 1000000)
    .filter(n -> n % 2 == 0)
    .sum();

// Avoid boxing/unboxing
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = numbers.stream()
    .mapToInt(Integer::intValue)  // Convert to IntStream
    .sum();

// Use parallel streams for CPU-intensive operations
List<Integer> result = largeList.parallelStream()
    .filter(n -> isPrime(n))
    .collect(Collectors.toList());

// Avoid parallel for small datasets
List<Integer> small = Arrays.asList(1, 2, 3, 4, 5);
small.stream().forEach(System.out::println);  // Better than parallel

// Short-circuit operations
boolean hasEven = numbers.stream()
    .anyMatch(n -> n % 2 == 0);  // Stops at first match

// Lazy evaluation
Stream<Integer> stream = numbers.stream()
    .filter(n -> n > 5)
    .map(n -> n * 2);  // Not executed yet
List<Integer> result = stream.collect(Collectors.toList());  // Now executed
```

### Data Structure Selection

```java
// ArrayList vs LinkedList
// ArrayList: Fast random access O(1), slow insertion/deletion O(n)
List<Integer> arrayList = new ArrayList<>();

// LinkedList: Slow random access O(n), fast insertion/deletion O(1)
List<Integer> linkedList = new LinkedList<>();

// HashMap vs TreeMap
// HashMap: O(1) average, unordered
Map<String, Integer> hashMap = new HashMap<>();

// TreeMap: O(log n), sorted by keys
Map<String, Integer> treeMap = new TreeMap<>();

// HashSet vs TreeSet
// HashSet: O(1) average, unordered
Set<Integer> hashSet = new HashSet<>();

// TreeSet: O(log n), sorted
Set<Integer> treeSet = new TreeSet<>();

// PriorityQueue for heap operations
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
```

### Common Patterns

```java
// Sliding Window
int maxSum(int[] arr, int k) {
    int maxSum = 0, windowSum = 0;
    
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Two Pointers
int[] twoSum(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++;
        else right--;
    }
    
    return new int[]{-1, -1};
}

// Fast & Slow Pointers (Cycle Detection)
boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    
    return false;
}

// Backtracking
List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(result, new ArrayList<>(), nums);
    return result;
}

void backtrack(List<List<Integer>> result, List<Integer> temp, int[] nums) {
    if (temp.size() == nums.length) {
        result.add(new ArrayList<>(temp));
        return;
    }
    
    for (int num : nums) {
        if (temp.contains(num)) continue;
        temp.add(num);
        backtrack(result, temp, nums);
        temp.remove(temp.size() - 1);
    }
}
```

## Summary

**Streams Mastery:**
- Basic: filter, map, collect, forEach
- Intermediate: flatMap, reduce, groupingBy, sorting
- Advanced: parallel streams, custom collectors, complex pipelines

**Data Structures:**
- Linear: ArrayList, LinkedList, Stack, Queue
- Non-linear: BST, HashMap, Graph
- Choose based on access patterns and operations

**Algorithms:**
- Sorting: Quick, Merge, Heap (O(n log n))
- Searching: Binary (O(log n)), Linear (O(n))
- Graph: BFS, DFS, Dijkstra, Topological Sort
- DP: Fibonacci, LCS, Knapsack, Coin Change

**Best Practices:**
- Use primitive streams for performance
- Choose appropriate data structures
- Leverage parallel streams for CPU-intensive tasks
- Apply common patterns (sliding window, two pointers)
- Understand time/space complexity
