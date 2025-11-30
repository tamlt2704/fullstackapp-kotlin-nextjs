---
title: "Kotlin for Competitive Programming Complete Guide"
date: "2024-12-13"
category: "Backend"
tags: ["Kotlin", "Competitive Programming", "Algorithms", "Data Structures", "Practice"]
---

# Kotlin for Competitive Programming Complete Guide

*Published on December 13, 2024*

## 1. Kotlin Competitive Programming Setup

### Fast I/O Template
```kotlin
import java.io.*
import java.util.*

fun main() {
    val reader = BufferedReader(InputStreamReader(System.`in`))
    val writer = BufferedWriter(OutputStreamWriter(System.out))
    
    val (n, m) = reader.readLine().split(" ").map { it.toInt() }
    
    // Your solution here
    
    writer.flush()
}

// Alternative: Using Scanner (slower but simpler)
fun main() {
    val scanner = Scanner(System.`in`)
    val n = scanner.nextInt()
    val m = scanner.nextInt()
    
    // Your solution here
}
```

### Common Input Patterns
```kotlin
// Read single integer
val n = readLine()!!.toInt()

// Read multiple integers
val (a, b, c) = readLine()!!.split(" ").map { it.toInt() }

// Read array
val arr = readLine()!!.split(" ").map { it.toInt() }.toIntArray()

// Read multiple lines
val lines = (1..n).map { readLine()!! }

// Read until EOF
fun readAll(): List<String> {
    val lines = mutableListOf<String>()
    while (true) {
        lines.add(readLine() ?: break)
    }
    return lines
}
```

## 2. Essential Data Structures

### Arrays and Lists
```kotlin
// Array operations
val arr = IntArray(n) { it + 1 }  // [1, 2, 3, ..., n]
val arr2 = IntArray(n) { readLine()!!.toInt() }

// 2D arrays
val matrix = Array(n) { IntArray(m) }
val grid = Array(n) { readLine()!!.toCharArray() }

// List operations
val list = mutableListOf<Int>()
list.add(1)
list.removeAt(0)
list.sort()
list.reverse()

// Deque (double-ended queue)
val deque = ArrayDeque<Int>()
deque.addFirst(1)
deque.addLast(2)
deque.removeFirst()
deque.removeLast()
```

### Stack and Queue
```kotlin
// Stack
val stack = ArrayDeque<Int>()
stack.addLast(1)  // push
val top = stack.last()  // peek
stack.removeLast()  // pop

// Queue
val queue = ArrayDeque<Int>()
queue.addLast(1)  // enqueue
val front = queue.first()  // peek
queue.removeFirst()  // dequeue

// Priority Queue (Min Heap)
val pq = PriorityQueue<Int>()
pq.add(5)
pq.add(1)
pq.add(3)
println(pq.poll())  // 1

// Max Heap
val maxHeap = PriorityQueue<Int>(compareByDescending { it })
```

### Sets and Maps
```kotlin
// HashSet
val set = hashSetOf<Int>()
set.add(1)
set.remove(1)
println(1 in set)

// TreeSet (sorted)
val treeSet = TreeSet<Int>()
treeSet.add(5)
treeSet.add(1)
println(treeSet.first())  // 1
println(treeSet.last())   // 5

// HashMap
val map = hashMapOf<String, Int>()
map["key"] = 1
map.getOrDefault("key", 0)
map.getOrPut("key") { 0 }

// TreeMap (sorted by keys)
val treeMap = TreeMap<Int, String>()
```

## 3. Common Algorithms

### Binary Search
```kotlin
// Built-in binary search
val arr = intArrayOf(1, 2, 3, 4, 5)
val index = arr.binarySearch(3)  // Returns index or -(insertion point) - 1

// Custom binary search
fun binarySearch(arr: IntArray, target: Int): Int {
    var left = 0
    var right = arr.size - 1
    
    while (left <= right) {
        val mid = left + (right - left) / 2
        when {
            arr[mid] == target -> return mid
            arr[mid] < target -> left = mid + 1
            else -> right = mid - 1
        }
    }
    return -1
}

// Lower bound (first element >= target)
fun lowerBound(arr: IntArray, target: Int): Int {
    var left = 0
    var right = arr.size
    
    while (left < right) {
        val mid = left + (right - left) / 2
        if (arr[mid] < target) {
            left = mid + 1
        } else {
            right = mid
        }
    }
    return left
}

// Upper bound (first element > target)
fun upperBound(arr: IntArray, target: Int): Int {
    var left = 0
    var right = arr.size
    
    while (left < right) {
        val mid = left + (right - left) / 2
        if (arr[mid] <= target) {
            left = mid + 1
        } else {
            right = mid
        }
    }
    return left
}
```

### Sorting
```kotlin
// Built-in sort
val arr = intArrayOf(3, 1, 4, 1, 5)
arr.sort()
arr.sortDescending()

// Custom comparator
data class Point(val x: Int, val y: Int)
val points = arrayOf(Point(1, 2), Point(0, 1))
points.sortWith(compareBy({ it.x }, { it.y }))

// Counting sort (for small range)
fun countingSort(arr: IntArray, maxVal: Int): IntArray {
    val count = IntArray(maxVal + 1)
    arr.forEach { count[it]++ }
    
    val result = IntArray(arr.size)
    var index = 0
    for (i in count.indices) {
        repeat(count[i]) {
            result[index++] = i
        }
    }
    return result
}
```

### Two Pointers
```kotlin
// Two sum (sorted array)
fun twoSum(arr: IntArray, target: Int): Pair<Int, Int>? {
    var left = 0
    var right = arr.size - 1
    
    while (left < right) {
        val sum = arr[left] + arr[right]
        when {
            sum == target -> return Pair(left, right)
            sum < target -> left++
            else -> right--
        }
    }
    return null
}

// Remove duplicates
fun removeDuplicates(arr: IntArray): Int {
    if (arr.isEmpty()) return 0
    
    var i = 0
    for (j in 1 until arr.size) {
        if (arr[j] != arr[i]) {
            arr[++i] = arr[j]
        }
    }
    return i + 1
}
```

### Sliding Window
```kotlin
// Maximum sum subarray of size k
fun maxSumSubarray(arr: IntArray, k: Int): Int {
    var maxSum = arr.take(k).sum()
    var windowSum = maxSum
    
    for (i in k until arr.size) {
        windowSum += arr[i] - arr[i - k]
        maxSum = maxOf(maxSum, windowSum)
    }
    return maxSum
}

// Longest substring without repeating characters
fun lengthOfLongestSubstring(s: String): Int {
    val seen = mutableSetOf<Char>()
    var left = 0
    var maxLen = 0
    
    for (right in s.indices) {
        while (s[right] in seen) {
            seen.remove(s[left])
            left++
        }
        seen.add(s[right])
        maxLen = maxOf(maxLen, right - left + 1)
    }
    return maxLen
}
```

## 4. Graph Algorithms

### Graph Representation
```kotlin
// Adjacency list
val graph = Array(n) { mutableListOf<Int>() }
graph[u].add(v)  // Add edge u -> v

// Weighted graph
data class Edge(val to: Int, val weight: Int)
val weightedGraph = Array(n) { mutableListOf<Edge>() }
weightedGraph[u].add(Edge(v, w))
```

### DFS and BFS
```kotlin
// DFS (recursive)
fun dfs(node: Int, graph: Array<MutableList<Int>>, visited: BooleanArray) {
    visited[node] = true
    println(node)
    
    for (neighbor in graph[node]) {
        if (!visited[neighbor]) {
            dfs(neighbor, graph, visited)
        }
    }
}

// DFS (iterative)
fun dfsIterative(start: Int, graph: Array<MutableList<Int>>): List<Int> {
    val visited = BooleanArray(graph.size)
    val stack = ArrayDeque<Int>()
    val result = mutableListOf<Int>()
    
    stack.addLast(start)
    
    while (stack.isNotEmpty()) {
        val node = stack.removeLast()
        if (!visited[node]) {
            visited[node] = true
            result.add(node)
            
            for (neighbor in graph[node].reversed()) {
                if (!visited[neighbor]) {
                    stack.addLast(neighbor)
                }
            }
        }
    }
    return result
}

// BFS
fun bfs(start: Int, graph: Array<MutableList<Int>>): List<Int> {
    val visited = BooleanArray(graph.size)
    val queue = ArrayDeque<Int>()
    val result = mutableListOf<Int>()
    
    queue.addLast(start)
    visited[start] = true
    
    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        result.add(node)
        
        for (neighbor in graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true
                queue.addLast(neighbor)
            }
        }
    }
    return result
}
```

### Shortest Path
```kotlin
// Dijkstra's algorithm
fun dijkstra(start: Int, graph: Array<MutableList<Edge>>): IntArray {
    val dist = IntArray(graph.size) { Int.MAX_VALUE }
    dist[start] = 0
    
    val pq = PriorityQueue<Pair<Int, Int>>(compareBy { it.first })
    pq.add(Pair(0, start))
    
    while (pq.isNotEmpty()) {
        val (d, u) = pq.poll()
        
        if (d > dist[u]) continue
        
        for ((v, w) in graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w
                pq.add(Pair(dist[v], v))
            }
        }
    }
    return dist
}

// Bellman-Ford (handles negative weights)
fun bellmanFord(start: Int, edges: List<Triple<Int, Int, Int>>, n: Int): IntArray? {
    val dist = IntArray(n) { Int.MAX_VALUE }
    dist[start] = 0
    
    repeat(n - 1) {
        for ((u, v, w) in edges) {
            if (dist[u] != Int.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w
            }
        }
    }
    
    // Check for negative cycles
    for ((u, v, w) in edges) {
        if (dist[u] != Int.MAX_VALUE && dist[u] + w < dist[v]) {
            return null  // Negative cycle detected
        }
    }
    return dist
}
```

### Topological Sort
```kotlin
// Kahn's algorithm (BFS-based)
fun topologicalSort(graph: Array<MutableList<Int>>): List<Int>? {
    val n = graph.size
    val inDegree = IntArray(n)
    
    for (u in 0 until n) {
        for (v in graph[u]) {
            inDegree[v]++
        }
    }
    
    val queue = ArrayDeque<Int>()
    for (i in 0 until n) {
        if (inDegree[i] == 0) queue.addLast(i)
    }
    
    val result = mutableListOf<Int>()
    while (queue.isNotEmpty()) {
        val u = queue.removeFirst()
        result.add(u)
        
        for (v in graph[u]) {
            if (--inDegree[v] == 0) {
                queue.addLast(v)
            }
        }
    }
    
    return if (result.size == n) result else null
}
```

## 5. Dynamic Programming

### Classic DP Problems
```kotlin
// Fibonacci
fun fib(n: Int): Long {
    if (n <= 1) return n.toLong()
    val dp = LongArray(n + 1)
    dp[1] = 1
    for (i in 2..n) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
}

// Longest Common Subsequence
fun lcs(s1: String, s2: String): Int {
    val m = s1.length
    val n = s2.length
    val dp = Array(m + 1) { IntArray(n + 1) }
    
    for (i in 1..m) {
        for (j in 1..n) {
            dp[i][j] = if (s1[i - 1] == s2[j - 1]) {
                dp[i - 1][j - 1] + 1
            } else {
                maxOf(dp[i - 1][j], dp[i][j - 1])
            }
        }
    }
    return dp[m][n]
}

// 0/1 Knapsack
fun knapsack(weights: IntArray, values: IntArray, capacity: Int): Int {
    val n = weights.size
    val dp = Array(n + 1) { IntArray(capacity + 1) }
    
    for (i in 1..n) {
        for (w in 1..capacity) {
            dp[i][w] = if (weights[i - 1] <= w) {
                maxOf(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
            } else {
                dp[i - 1][w]
            }
        }
    }
    return dp[n][capacity]
}
```

## 6. Mathematical Algorithms

### Number Theory
```kotlin
// GCD and LCM
fun gcd(a: Int, b: Int): Int = if (b == 0) a else gcd(b, a % b)
fun lcm(a: Int, b: Int): Int = a / gcd(a, b) * b

// Prime check
fun isPrime(n: Int): Boolean {
    if (n < 2) return false
    if (n == 2) return true
    if (n % 2 == 0) return false
    
    var i = 3
    while (i * i <= n) {
        if (n % i == 0) return false
        i += 2
    }
    return true
}

// Sieve of Eratosthenes
fun sieve(n: Int): List<Int> {
    val isPrime = BooleanArray(n + 1) { true }
    isPrime[0] = false
    isPrime[1] = false
    
    for (i in 2..n) {
        if (isPrime[i]) {
            var j = i * i
            while (j <= n) {
                isPrime[j] = false
                j += i
            }
        }
    }
    return isPrime.indices.filter { isPrime[it] }
}

// Modular exponentiation
fun modPow(base: Long, exp: Long, mod: Long): Long {
    var result = 1L
    var b = base % mod
    var e = exp
    
    while (e > 0) {
        if (e % 2 == 1L) {
            result = (result * b) % mod
        }
        b = (b * b) % mod
        e /= 2
    }
    return result
}
```

## 7. LeetCode Problems for FAANG+ Interviews

### Arrays & Strings (Essential)

#### Easy
- **Two Sum** (LC 1) - Hash map basics
- **Best Time to Buy and Sell Stock** (LC 121) - Single pass
- **Valid Parentheses** (LC 20) - Stack
- **Merge Sorted Array** (LC 88) - Two pointers
- **Contains Duplicate** (LC 217) - Hash set

#### Medium
- **3Sum** (LC 15) - Two pointers, sorting ⭐ Amazon, Facebook
- **Longest Substring Without Repeating Characters** (LC 3) - Sliding window ⭐ Amazon, Facebook
- **Container With Most Water** (LC 11) - Two pointers ⭐ Amazon
- **Group Anagrams** (LC 49) - Hash map ⭐ Amazon, Facebook
- **Longest Palindromic Substring** (LC 5) - DP/Expand around center ⭐ Amazon, Facebook
- **Product of Array Except Self** (LC 238) - Prefix/suffix ⭐ Facebook, Amazon
- **Minimum Window Substring** (LC 76) - Sliding window ⭐⭐ Facebook, Amazon
- **Valid Sudoku** (LC 36) - Hash set ⭐ Amazon
- **Rotate Image** (LC 48) - Matrix manipulation ⭐ Amazon
- **Spiral Matrix** (LC 54) - Matrix traversal ⭐ Amazon, Facebook

#### Hard
- **Trapping Rain Water** (LC 42) - Two pointers/Stack ⭐⭐ Amazon, Facebook, HRT
- **First Missing Positive** (LC 41) - Array manipulation ⭐ Amazon
- **Median of Two Sorted Arrays** (LC 4) - Binary search ⭐⭐ Amazon, Facebook, HRT

### Linked Lists

#### Easy
- **Reverse Linked List** (LC 206) - Iterative/Recursive ⭐ Amazon, Facebook
- **Merge Two Sorted Lists** (LC 21) - Two pointers ⭐ Amazon
- **Linked List Cycle** (LC 141) - Fast/slow pointers ⭐ Amazon

#### Medium
- **Add Two Numbers** (LC 2) - Linked list traversal ⭐ Amazon, Facebook
- **Remove Nth Node From End** (LC 19) - Two pointers ⭐ Amazon
- **Reorder List** (LC 143) - Multiple techniques ⭐ Facebook
- **LRU Cache** (LC 146) - Hash map + doubly linked list ⭐⭐ Amazon, Facebook, HRT
- **Copy List with Random Pointer** (LC 138) - Hash map ⭐ Amazon, Facebook

#### Hard
- **Merge k Sorted Lists** (LC 23) - Priority queue ⭐⭐ Amazon, Facebook, HRT
- **Reverse Nodes in k-Group** (LC 25) - Linked list manipulation ⭐ Facebook

### Trees & Graphs

#### Easy
- **Maximum Depth of Binary Tree** (LC 104) - DFS/BFS
- **Invert Binary Tree** (LC 226) - DFS ⭐ Facebook
- **Symmetric Tree** (LC 101) - DFS/BFS
- **Same Tree** (LC 100) - DFS

#### Medium
- **Binary Tree Level Order Traversal** (LC 102) - BFS ⭐ Amazon, Facebook
- **Validate Binary Search Tree** (LC 98) - DFS ⭐ Amazon, Facebook
- **Lowest Common Ancestor of BST** (LC 235) - BST properties ⭐ Amazon, Facebook
- **Binary Tree Right Side View** (LC 199) - BFS ⭐ Amazon
- **Number of Islands** (LC 200) - DFS/BFS/Union-Find ⭐⭐ Amazon, Facebook
- **Clone Graph** (LC 133) - DFS/BFS ⭐ Facebook
- **Course Schedule** (LC 207) - Topological sort ⭐ Amazon, Facebook
- **Word Ladder** (LC 127) - BFS ⭐ Amazon, Facebook
- **Construct Binary Tree from Preorder and Inorder** (LC 105) - Recursion ⭐ Facebook
- **Kth Smallest Element in BST** (LC 230) - Inorder traversal ⭐ Amazon, Facebook

#### Hard
- **Binary Tree Maximum Path Sum** (LC 124) - DFS ⭐⭐ Amazon, Facebook
- **Serialize and Deserialize Binary Tree** (LC 297) - DFS/BFS ⭐⭐ Amazon, Facebook, HRT
- **Word Ladder II** (LC 126) - BFS + backtracking ⭐ Amazon
- **Alien Dictionary** (LC 269) - Topological sort ⭐⭐ Facebook (Premium)

### Dynamic Programming

#### Easy
- **Climbing Stairs** (LC 70) - Basic DP
- **House Robber** (LC 198) - 1D DP ⭐ Amazon

#### Medium
- **Coin Change** (LC 322) - Unbounded knapsack ⭐⭐ Amazon, Facebook
- **Longest Increasing Subsequence** (LC 300) - DP/Binary search ⭐ Amazon, Facebook
- **Word Break** (LC 139) - DP ⭐ Amazon, Facebook
- **Decode Ways** (LC 91) - 1D DP ⭐ Facebook
- **Unique Paths** (LC 62) - 2D DP ⭐ Amazon
- **Jump Game** (LC 55) - Greedy/DP ⭐ Amazon
- **Partition Equal Subset Sum** (LC 416) - 0/1 knapsack ⭐ Amazon
- **Longest Palindromic Subsequence** (LC 516) - 2D DP ⭐ Amazon

#### Hard
- **Edit Distance** (LC 72) - 2D DP ⭐⭐ Amazon, Facebook, HRT
- **Regular Expression Matching** (LC 10) - 2D DP ⭐⭐ Facebook, HRT
- **Wildcard Matching** (LC 44) - 2D DP ⭐ Facebook
- **Burst Balloons** (LC 312) - Interval DP ⭐ Amazon
- **Maximal Rectangle** (LC 85) - DP + stack ⭐ Amazon, Facebook

### Backtracking

#### Medium
- **Permutations** (LC 46) - Backtracking ⭐ Amazon, Facebook
- **Subsets** (LC 78) - Backtracking ⭐ Amazon, Facebook
- **Combination Sum** (LC 39) - Backtracking ⭐ Amazon, Facebook
- **Generate Parentheses** (LC 22) - Backtracking ⭐ Amazon, Facebook
- **Letter Combinations of Phone Number** (LC 17) - Backtracking ⭐ Amazon
- **Palindrome Partitioning** (LC 131) - Backtracking ⭐ Amazon
- **Word Search** (LC 79) - Backtracking + DFS ⭐ Amazon, Facebook

#### Hard
- **N-Queens** (LC 51) - Backtracking ⭐ Amazon
- **Word Search II** (LC 212) - Trie + backtracking ⭐⭐ Amazon, Facebook

### Binary Search

#### Easy
- **Binary Search** (LC 704) - Basic template
- **Search Insert Position** (LC 35) - Lower bound

#### Medium
- **Search in Rotated Sorted Array** (LC 33) - Modified binary search ⭐⭐ Amazon, Facebook
- **Find Minimum in Rotated Sorted Array** (LC 153) - Binary search ⭐ Amazon
- **Search a 2D Matrix II** (LC 240) - Binary search ⭐ Amazon, Facebook
- **Koko Eating Bananas** (LC 875) - Binary search on answer ⭐ Facebook
- **Capacity To Ship Packages Within D Days** (LC 1011) - Binary search ⭐ Amazon

#### Hard
- **Find Minimum in Rotated Sorted Array II** (LC 154) - Binary search with duplicates

### Heap / Priority Queue

#### Easy
- **Kth Largest Element in Array** (LC 215) - Quick select/Heap ⭐ Amazon, Facebook

#### Medium
- **Top K Frequent Elements** (LC 347) - Heap/Bucket sort ⭐ Amazon, Facebook
- **K Closest Points to Origin** (LC 973) - Heap ⭐ Amazon, Facebook
- **Meeting Rooms II** (LC 253) - Heap ⭐⭐ Amazon, Facebook (Premium)
- **Task Scheduler** (LC 621) - Heap/Greedy ⭐ Facebook

#### Hard
- **Find Median from Data Stream** (LC 295) - Two heaps ⭐⭐ Amazon, Facebook, HRT
- **Sliding Window Maximum** (LC 239) - Deque/Heap ⭐⭐ Amazon, Facebook

### Intervals

#### Medium
- **Merge Intervals** (LC 56) - Sorting ⭐⭐ Amazon, Facebook
- **Insert Interval** (LC 57) - Array manipulation ⭐ Amazon, Facebook
- **Non-overlapping Intervals** (LC 435) - Greedy ⭐ Amazon
- **Meeting Rooms** (LC 252) - Sorting ⭐ Amazon (Premium)

### Bit Manipulation

#### Easy
- **Single Number** (LC 136) - XOR ⭐ Amazon
- **Number of 1 Bits** (LC 191) - Bit manipulation

#### Medium
- **Single Number II** (LC 137) - Bit manipulation ⭐ HRT
- **Counting Bits** (LC 338) - DP + bits ⭐ Amazon

### Design Problems

#### Medium
- **LRU Cache** (LC 146) - Hash map + DLL ⭐⭐⭐ Amazon, Facebook, HRT
- **Min Stack** (LC 155) - Stack design ⭐ Amazon
- **Implement Trie** (LC 208) - Trie ⭐ Amazon, Facebook
- **Design Add and Search Words Data Structure** (LC 211) - Trie ⭐ Facebook

#### Hard
- **LFU Cache** (LC 460) - Complex design ⭐⭐ Amazon, HRT
- **Design In-Memory File System** (LC 588) - Trie/Hash map ⭐ Amazon (Premium)

### Math & Logic

#### Easy
- **Fizz Buzz** (LC 412) - Basic logic
- **Palindrome Number** (LC 9) - Math

#### Medium
- **Pow(x, n)** (LC 50) - Binary exponentiation ⭐ Facebook
- **Sqrt(x)** (LC 69) - Binary search ⭐ Amazon
- **Divide Two Integers** (LC 29) - Bit manipulation ⭐ Facebook

### Advanced Topics (HRT, Quant Trading)

#### Hard
- **Best Time to Buy and Sell Stock III** (LC 123) - DP ⭐⭐ HRT
- **Best Time to Buy and Sell Stock IV** (LC 188) - DP ⭐⭐ HRT
- **Largest Rectangle in Histogram** (LC 84) - Stack ⭐⭐ Amazon, HRT
- **Count of Smaller Numbers After Self** (LC 315) - Merge sort/BIT ⭐⭐ HRT
- **Russian Doll Envelopes** (LC 354) - DP + binary search ⭐ HRT
- **Shortest Path in Grid with Obstacles Elimination** (LC 1293) - BFS ⭐ HRT

## 8. Interview Preparation Strategy

### Study Plan (8-12 weeks)

**Week 1-2: Foundations**
- Arrays, strings, hash maps
- Two pointers, sliding window
- Practice 3-5 easy problems daily

**Week 3-4: Data Structures**
- Linked lists, stacks, queues
- Trees (DFS, BFS, BST)
- Practice 2-3 medium problems daily

**Week 5-6: Algorithms**
- Binary search, sorting
- Backtracking, recursion
- Mix of medium problems

**Week 7-8: Advanced Topics**
- Dynamic programming
- Graphs (DFS, BFS, topological sort)
- Focus on medium/hard problems

**Week 9-10: Company-Specific**
- Review tagged problems for target companies
- Practice system design basics
- Mock interviews

**Week 11-12: Polish**
- Revisit difficult problems
- Timed practice (45 min per problem)
- Review common patterns

### Problem-Solving Framework

1. **Understand** (5 min)
   - Clarify requirements
   - Ask about edge cases
   - Confirm input/output format

2. **Plan** (10 min)
   - Identify pattern (two pointers, DP, etc.)
   - Discuss brute force approach
   - Optimize time/space complexity

3. **Implement** (20 min)
   - Write clean, readable code
   - Use meaningful variable names
   - Handle edge cases

4. **Test** (10 min)
   - Walk through example
   - Test edge cases
   - Analyze complexity

### Company-Specific Tips

**Amazon**
- Focus on arrays, strings, trees, and graphs
- Practice leadership principles scenarios
- Expect 2-3 coding rounds
- Common: LC 200, 238, 42, 146, 56

**Facebook (Meta)**
- Heavy on medium problems
- Focus on trees, graphs, and DP
- Expect behavioral + coding
- Common: LC 1, 15, 23, 146, 297

**HRT (Hudson River Trading)**
- Very hard problems, math-heavy
- Focus on optimization, bit manipulation
- Expect probability/statistics questions
- Common: LC 295, 315, 42, 84, 123

### Resources

- **LeetCode Premium**: Company-tagged problems
- **NeetCode 150**: Curated problem list
- **Blind 75**: Essential interview problems
- **AlgoExpert**: Video explanations
- **Pramp/Interviewing.io**: Mock interviews

---

*Master these problems in Kotlin, and you'll be well-prepared for top tech interviews. Focus on understanding patterns rather than memorizing solutions.*VALUE && dist[u] + w < dist[v]) {
            return null  // Negative cycle detected
        }
    }
    return dist
}
```

## 5. Dynamic Programming

### Classic DP Problems
```kotlin
// Fibonacci
fun fibonacci(n: Int): Long {
    if (n <= 1) return n.toLong()
    
    val dp = LongArray(n + 1)
    dp[0] = 0
    dp[1] = 1
    
    for (i in 2..n) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }
    return dp[n]
}

// Longest Common Subsequence
fun lcs(s1: String, s2: String): Int {
    val m = s1.length
    val n = s2.length
    val dp = Array(m + 1) { IntArray(n + 1) }
    
    for (i in 1..m) {
        for (j in 1..n) {
            dp[i][j] = if (s1[i - 1] == s2[j - 1]) {
                dp[i - 1][j - 1] + 1
            } else {
                maxOf(dp[i - 1][j], dp[i][j - 1])
            }
        }
    }
    return dp[m][n]
}

// 0/1 Knapsack
fun knapsack(weights: IntArray, values: IntArray, capacity: Int): Int {
    val n = weights.size
    val dp = Array(n + 1) { IntArray(capacity + 1) }
    
    for (i in 1..n) {
        for (w in 1..capacity) {
            dp[i][w] = if (weights[i - 1] <= w) {
                maxOf(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                )
            } else {
                dp[i - 1][w]
            }
        }
    }
    return dp[n][capacity]
}

// Coin Change
fun coinChange(coins: IntArray, amount: Int): Int {
    val dp = IntArray(amount + 1) { amount + 1 }
    dp[0] = 0
    
    for (i in 1..amount) {
        for (coin in coins) {
            if (coin <= i) {
                dp[i] = minOf(dp[i], dp[i - coin] + 1)
            }
        }
    }
    return if (dp[amount] > amount) -1 else dp[amount]
}
```

## 6. Number Theory

### GCD and LCM
```kotlin
// Greatest Common Divisor
fun gcd(a: Int, b: Int): Int {
    return if (b == 0) a else gcd(b, a % b)
}

// Least Common Multiple
fun lcm(a: Int, b: Int): Int {
    return (a * b) / gcd(a, b)
}

// Extended GCD
fun extendedGcd(a: Int, b: Int): Triple<Int, Int, Int> {
    if (b == 0) return Triple(a, 1, 0)
    
    val (g, x1, y1) = extendedGcd(b, a % b)
    val x = y1
    val y = x1 - (a / b) * y1
    
    return Triple(g, x, y)
}
```

### Prime Numbers
```kotlin
// Check if prime
fun isPrime(n: Int): Boolean {
    if (n < 2) return false
    if (n == 2) return true
    if (n % 2 == 0) return false
    
    var i = 3
    while (i * i <= n) {
        if (n % i == 0) return false
        i += 2
    }
    return true
}

// Sieve of Eratosthenes
fun sieve(n: Int): BooleanArray {
    val isPrime = BooleanArray(n + 1) { true }
    isPrime[0] = false
    isPrime[1] = false
    
    for (i in 2..n) {
        if (isPrime[i]) {
            var j = i * i
            while (j <= n) {
                isPrime[j] = false
                j += i
            }
        }
    }
    return isPrime
}

// Prime factorization
fun primeFactors(n: Int): Map<Int, Int> {
    val factors = mutableMapOf<Int, Int>()
    var num = n
    
    var d = 2
    while (d * d <= num) {
        while (num % d == 0) {
            factors[d] = factors.getOrDefault(d, 0) + 1
            num /= d
        }
        d++
    }
    if (num > 1) {
        factors[num] = factors.getOrDefault(num, 0) + 1
    }
    return factors
}
```

### Modular Arithmetic
```kotlin
const val MOD = 1_000_000_007

// Modular exponentiation
fun modPow(base: Long, exp: Long, mod: Long = MOD.toLong()): Long {
    var result = 1L
    var b = base % mod
    var e = exp
    
    while (e > 0) {
        if (e % 2 == 1L) {
            result = (result * b) % mod
        }
        b = (b * b) % mod
        e /= 2
    }
    return result
}

// Modular inverse
fun modInverse(a: Long, mod: Long = MOD.toLong()): Long {
    return modPow(a, mod - 2, mod)
}

// Factorial with mod
fun factorial(n: Int): Long {
    var result = 1L
    for (i in 2..n) {
        result = (result * i) % MOD
    }
    return result
}

// nCr with mod
fun nCr(n: Int, r: Int): Long {
    if (r > n) return 0
    if (r == 0 || r == n) return 1
    
    val num = factorial(n)
    val den = (factorial(r) * factorial(n - r)) % MOD
    return (num * modInverse(den)) % MOD
}
```

## 7. String Algorithms

### Pattern Matching
```kotlin
// KMP Algorithm
fun kmp(text: String, pattern: String): List<Int> {
    val lps = computeLPS(pattern)
    val matches = mutableListOf<Int>()
    
    var i = 0  // text index
    var j = 0  // pattern index
    
    while (i < text.length) {
        if (text[i] == pattern[j]) {
            i++
            j++
        }
        
        if (j == pattern.length) {
            matches.add(i - j)
            j = lps[j - 1]
        } else if (i < text.length && text[i] != pattern[j]) {
            if (j != 0) {
                j = lps[j - 1]
            } else {
                i++
            }
        }
    }
    return matches
}

fun computeLPS(pattern: String): IntArray {
    val lps = IntArray(pattern.length)
    var len = 0
    var i = 1
    
    while (i < pattern.length) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len
        } else {
            if (len != 0) {
                len = lps[len - 1]
            } else {
                lps[i++] = 0
            }
        }
    }
    return lps
}
```

### String Hashing
```kotlin
class StringHash(val s: String) {
    private val p = 31L
    private val m = 1_000_000_009L
    private val hash: LongArray
    private val pow: LongArray
    
    init {
        hash = LongArray(s.length + 1)
        pow = LongArray(s.length + 1)
        pow[0] = 1
        
        for (i in s.indices) {
            hash[i + 1] = (hash[i] + (s[i] - 'a' + 1) * pow[i]) % m
            pow[i + 1] = (pow[i] * p) % m
        }
    }
    
    fun getHash(l: Int, r: Int): Long {
        var result = (hash[r + 1] - hash[l] + m) % m
        result = (result * modInverse(pow[l], m)) % m
        return result
    }
}
```

## 8. Practice Problem Categories

### Easy Problems (Beginner)
```
1. Two Sum
2. Reverse Integer
3. Palindrome Number
4. Roman to Integer
5. Valid Parentheses
6. Merge Two Sorted Lists
7. Remove Duplicates from Sorted Array
8. Search Insert Position
9. Maximum Subarray
10. Plus One
```

### Medium Problems (Intermediate)
```
1. Add Two Numbers
2. Longest Substring Without Repeating Characters
3. Container With Most Water
4. 3Sum
5. Letter Combinations of Phone Number
6. Generate Parentheses
7. Merge k Sorted Lists
8. Next Permutation
9. Search in Rotated Sorted Array
10. Combination Sum
```

### Hard Problems (Advanced)
```
1. Median of Two Sorted Arrays
2. Regular Expression Matching
3. Merge k Sorted Lists
4. Trapping Rain Water
5. Wildcard Matching
6. Jump Game II
7. N-Queens
8. Edit Distance
9. Largest Rectangle in Histogram
10. Word Ladder II
```

### Topic-Wise Practice
```
Arrays:
- Two Sum, 3Sum, 4Sum
- Maximum Subarray
- Product of Array Except Self
- Container With Most Water

Strings:
- Longest Palindromic Substring
- Valid Anagram
- Group Anagrams
- Longest Common Prefix

Linked Lists:
- Reverse Linked List
- Merge Two Sorted Lists
- Linked List Cycle
- Remove Nth Node From End

Trees:
- Binary Tree Inorder Traversal
- Maximum Depth of Binary Tree
- Validate Binary Search Tree
- Lowest Common Ancestor

Graphs:
- Number of Islands
- Clone Graph
- Course Schedule
- Word Ladder

Dynamic Programming:
- Climbing Stairs
- House Robber
- Coin Change
- Longest Increasing Subsequence

Backtracking:
- Permutations
- Subsets
- N-Queens
- Sudoku Solver
```

## 9. Contest Strategy

### Time Management
```
1. Read all problems first (5-10 minutes)
2. Solve easiest problems first
3. Implement carefully, test with examples
4. If stuck, move to next problem
5. Return to harder problems with remaining time
```

### Debugging Tips
```kotlin
// Print debugging
fun debug(vararg args: Any?) {
    System.err.println(args.joinToString(" "))
}

// Assert for testing
fun assert(condition: Boolean, message: String = "Assertion failed") {
    if (!condition) {
        throw AssertionError(message)
    }
}

// Test with sample inputs
fun test() {
    assert(solve(listOf(1, 2, 3)) == 6)
    assert(solve(listOf()) == 0)
    println("All tests passed!")
}
```

### Common Mistakes to Avoid
```
1. Integer overflow - use Long when needed
2. Array index out of bounds
3. Not handling edge cases (empty input, n=1)
4. Wrong loop bounds (off-by-one errors)
5. Not reading input correctly
6. Forgetting to flush output
7. Using wrong data structure
8. Not considering time/space complexity
```

## 10. Online Judge Platforms

### Recommended Platforms
```
Beginner:
- LeetCode (Easy problems)
- HackerRank
- CodeSignal

Intermediate:
- Codeforces (Div 2)
- AtCoder (ABC)
- LeetCode (Medium problems)

Advanced:
- Codeforces (Div 1)
- TopCoder
- Google Code Jam
- Facebook Hacker Cup

Practice:
- CSES Problem Set
- Project Euler
- SPOJ
- UVa Online Judge
```

### Contest Schedule
```
Weekly:
- LeetCode Weekly Contest (Sunday)
- Codeforces Rounds (Multiple per week)
- AtCoder Beginner Contest (Saturday)

Monthly:
- Google Kick Start
- Facebook Hacker Cup
- CodeChef Long Challenge

Annual:
- Google Code Jam
- Facebook Hacker Cup Finals
- ICPC Regional/World Finals
```

---

*This comprehensive Kotlin competitive programming guide covers essential algorithms, data structures, and problem-solving strategies. Practice regularly on online judges to improve your skills and speed.*