# LeetCode Collections - 500+ Problems for FAANG/HRT Interviews

Complete collection with hints and solutions in Python & Kotlin.

## 📚 Table of Contents
- [Easy Problems (140)](#easy-problems)
- [Medium Problems (60+)](#medium-problems)  
- [Hard Problems (Coming)](#hard-problems)
- [Study Guide](#study-guide)

---

## EASY PROBLEMS

Problems 1-80 cover fundamental concepts essential for interviews.

### Arrays & Strings (20 problems)
1. Two Sum - HashMap complement
2. Reverse Integer - Modulo/division with overflow check
3. Palindrome Number - Reverse half
4. Roman to Integer - Process right to left
5. Longest Common Prefix - Vertical comparison
6. Remove Duplicates from Sorted Array - Two pointers
7. Remove Element - Two pointers overwrite
8. Search Insert Position - Binary search
9. Length of Last Word - Strip and split
10. Plus One - Handle carry right to left
11. Add Binary - Process with carry
12. Sqrt(x) - Binary search
13. Maximum Subarray - Kadane's algorithm
14. Valid Palindrome - Two pointers skip non-alphanumeric
15. Contains Duplicate - Set size comparison
16. Contains Duplicate II - Map with index tracking
17. Missing Number - Sum formula or XOR
18. Move Zeroes - Two pointers move non-zeros
19. Intersection of Two Arrays - Set intersection
20. Intersection of Two Arrays II - Frequency map

### Linked Lists (15 problems)
21. Merge Two Sorted Lists - Dummy node + two pointers
22. Remove Duplicates from Sorted List - Skip duplicate nodes
23. Merge Sorted Array - Fill from end
24. Linked List Cycle - Floyd's slow/fast pointers
25. Intersection of Two Linked Lists - Switch heads at end
26. Reverse Linked List - Iteratively reverse pointers
27. Palindrome Linked List - Find middle, reverse, compare
28. Delete Node in a Linked List - Copy next value
29. Remove Linked List Elements - Dummy node
30. Middle of Linked List - Slow/fast pointers

### Trees (25 problems)
31. Same Tree - Recursive comparison
32. Symmetric Tree - Mirror check
33. Maximum Depth of Binary Tree - Recursive max depth
34. Convert Sorted Array to BST - Middle as root
35. Balanced Binary Tree - Height difference check
36. Minimum Depth of Binary Tree - BFS or recursive with leaf check
37. Path Sum - Recursive leaf sum check
38. Invert Binary Tree - Recursively swap children
39. Binary Tree Paths - DFS with path tracking
40. Sum of Left Leaves - DFS with parent info
41. Lowest Common Ancestor of BST - Use BST property

### Stacks & Queues (10 problems)
42. Valid Parentheses - Stack for matching pairs
43. Min Stack - Auxiliary stack for minimums
44. Implement Stack using Queues - Rotate on push
45. Implement Queue using Stacks - Transfer on pop/peek

### Math & Bit Manipulation (15 problems)
46. Single Number - XOR cancels duplicates
47. Happy Number - Set to detect cycles
48. Reverse Bits - Process bit by bit
49. Number of 1 Bits - n & (n-1) clears rightmost 1
50. Power of Three - Loop division
51. Add Digits - Digital root formula
52. Ugly Number - Divide by 2,3,5
53. Sum of Two Integers - XOR for sum, AND for carry
54. Nim Game - Lose if n % 4 == 0

### Miscellaneous Easy (20 problems)
55. Pascal's Triangle - Sum of two above
56. Pascal's Triangle II - Build in-place
57. Best Time to Buy and Sell Stock - Track min price
58. Majority Element - Boyer-Moore voting
59. Excel Sheet Column Title - Base-26 conversion
60. Excel Sheet Column Number - Base-26 to decimal
61. Isomorphic Strings - Bidirectional mapping
62. Valid Anagram - Sort or frequency map
63. Word Pattern - Bidirectional mapping check
64. Is Subsequence - Two pointers
65. Fizz Buzz - Divisibility check
66. Third Maximum Number - Track top 3
67. Add Strings - Digit by digit with carry
68. Number of Segments - Split and count
69. Arranging Coins - Binary search
70. Find All Numbers Disappeared - Mark indices negative
71. Range Sum Query - Prefix sum array
72. Reverse String - Two pointers swap
73. Reverse Vowels - Two pointers swap vowels only
74. Valid Perfect Square - Binary search
75. Longest Palindrome - Count pairs
76. Find the Difference - XOR all characters
77. Ransom Note - Character frequency
78. Convert Number to Hexadecimal - Process 4 bits
79. First Bad Version - Binary search for first true
80. Climbing Stairs - Fibonacci pattern

---

## MEDIUM PROBLEMS

### Dynamic Programming (20 problems)
1. Climbing Stairs - Fibonacci: dp[i] = dp[i-1] + dp[i-2]
2. House Robber - Rob or skip: max(curr, prev + n)
3. Unique Paths - Grid DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]
4. Minimum Path Sum - Grid DP with min
5. Coin Change - Min coins DP
6. Word Break - DP with dictionary
7. Maximum Product Subarray - Track max and min
8. Longest Increasing Subsequence - DP or binary search
9. Maximal Square - DP for largest square
10. Perfect Squares - Min squares DP

### Backtracking (15 problems)
11. Letter Combinations - Phone number mapping
12. Generate Parentheses - Open/close count
13. Permutations - Backtrack with used set
14. Subsets - Backtrack all combinations
15. Combination Sum - Reusable elements
16. Combination Sum III - Digit constraints
17. Word Search - DFS with visited tracking
18. Palindrome Partitioning - Backtrack valid splits

### Arrays & Strings Advanced (20 problems)
19. 3Sum - Sort + two pointers
20. Container With Most Water - Two pointers move smaller
21. Longest Substring Without Repeating - Sliding window
22. Longest Palindromic Substring - Expand around center
23. Zigzag Conversion - Array of strings per row
24. Next Permutation - Find pivot, swap, reverse
25. Search in Rotated Sorted Array - Binary search check sorted half
26. Find First and Last Position - Two binary searches
27. Rotate Image - Transpose then reverse rows
28. Group Anagrams - Sorted string as key
29. Spiral Matrix - Track boundaries
30. Merge Intervals - Sort and merge overlapping
31. Set Matrix Zeroes - Use first row/col as markers
32. Sort Colors - Dutch national flag three pointers
33. Product of Array Except Self - Left/right products

### Linked Lists Advanced (10 problems)
34. Add Two Numbers - Process with carry
35. Remove Nth Node From End - Two pointers with gap
36. Swap Nodes in Pairs - Iteratively swap adjacent
37. Sort List - Merge sort on linked list
38. Linked List Cycle II - Floyd's find cycle start
39. Reorder List - Find middle, reverse, merge

### Trees & Graphs (25 problems)
40. Binary Tree Level Order Traversal - BFS with queue
41. Binary Tree Zigzag Level Order - BFS alternating direction
42. Construct Binary Tree from Preorder/Inorder - Recursive build
43. Flatten Binary Tree to Linked List - Reverse postorder
44. Populating Next Right Pointers - Level order linking
45. Number of Islands - DFS mark connected components
46. Clone Graph - DFS/BFS with hashmap
47. Course Schedule - Topological sort cycle detection
48. Course Schedule II - Topological sort with result
49. Longest Consecutive Sequence - Set check sequence start

### Design & Implementation (10 problems)
50. LRU Cache - HashMap + doubly linked list
51. Implement Trie - Tree with children map
52. Min Stack - Auxiliary stack
53. Evaluate Reverse Polish Notation - Stack for operands
54. Basic Calculator II - Stack for operators

### Binary Search & Sorting (10 problems)
55. Pow(x, n) - Binary exponentiation
56. Find Peak Element - Binary search on slope
57. Find Minimum in Rotated Sorted Array - Binary search compare right
58. Kth Largest Element - Quickselect or heap
59. Minimum Size Subarray Sum - Sliding window
60. Search 2D Matrix - Binary search

---

## HARD PROBLEMS (Coming Soon)

### Advanced DP
- Edit Distance
- Regular Expression Matching
- Wildcard Matching
- Longest Valid Parentheses
- Distinct Subsequences
- Interleaving String
- Scramble String
- Best Time to Buy and Sell Stock III/IV
- Maximum Rectangle
- Dungeon Game

### Advanced Trees & Graphs
- Binary Tree Maximum Path Sum
- Serialize and Deserialize Binary Tree
- Word Ladder II
- Alien Dictionary
- Graph Valid Tree
- Number of Connected Components
- Minimum Height Trees

### Hard Arrays & Strings
- Median of Two Sorted Arrays
- Trapping Rain Water
- First Missing Positive
- Longest Consecutive Sequence
- Sliding Window Maximum
- Minimum Window Substring
- Substring with Concatenation

### Advanced Algorithms
- Merge K Sorted Lists
- Find Median from Data Stream
- Skyline Problem
- Count of Smaller Numbers After Self
- Reverse Pairs
- Russian Doll Envelopes

---

## STUDY GUIDE

### Week-by-Week Plan

**Weeks 1-2: Easy Problems Foundation**
- Complete 40 easy problems
- Focus on arrays, strings, linked lists
- Master two pointers and sliding window
- Practice: 3-5 problems daily

**Weeks 3-4: Easy Problems Advanced**
- Complete remaining 40 easy problems
- Focus on trees, stacks, bit manipulation
- Master recursion and basic DP
- Practice: 3-5 problems daily

**Weeks 5-8: Medium Problems Core**
- Complete 60 medium problems
- Focus on DP, backtracking, graphs
- Master advanced data structures
- Practice: 2-3 problems daily

**Weeks 9-12: Hard Problems & Mock Interviews**
- Complete 40+ hard problems
- Focus on complex algorithms
- Practice timed mock interviews
- Review weak areas

### Problem-Solving Framework

1. **Understand** (2-3 min)
   - Read problem carefully
   - Identify inputs/outputs
   - Ask clarifying questions
   - Consider edge cases

2. **Plan** (3-5 min)
   - Think of brute force
   - Identify patterns
   - Choose data structures
   - Estimate time/space complexity

3. **Implement** (15-25 min)
   - Write clean code
   - Use meaningful names
   - Handle edge cases
   - Test with examples

4. **Optimize** (5-10 min)
   - Analyze complexity
   - Identify bottlenecks
   - Refactor if needed
   - Verify correctness

### Common Patterns

**Sliding Window**
- Variable/fixed size window
- Two pointers (left, right)
- Track window state
- Examples: Longest substring, min subarray

**Two Pointers**
- Same direction or opposite
- Fast/slow pointers
- Examples: Two sum, palindrome, cycle detection

**Binary Search**
- Sorted array search
- Find boundaries
- Rotated arrays
- Examples: Search insert, find peak

**DFS/BFS**
- Tree/graph traversal
- Backtracking
- Level order
- Examples: Islands, word search, tree paths

**Dynamic Programming**
- Overlapping subproblems
- Optimal substructure
- Memoization or tabulation
- Examples: Climbing stairs, coin change

**Greedy**
- Local optimal choices
- Proof of correctness
- Examples: Jump game, intervals

### Time Complexity Goals

- **Easy**: O(n) or O(n log n)
- **Medium**: O(n log n) or O(n²) optimized
- **Hard**: O(n log n) or better with advanced techniques

### Space Complexity Goals

- Prefer O(1) when possible
- O(n) acceptable for most problems
- O(n²) only when necessary

### Company-Specific Tips

**FAANG (Google, Meta, Amazon, Apple, Netflix)**
- Focus: Clean code, scalability, edge cases
- Practice: 200-300 problems
- Emphasis: System design, behavioral

**HRT (Hudson River Trading)**
- Focus: Math, optimization, speed
- Practice: Hard problems, competitive programming
- Emphasis: Algorithms, data structures, performance

**Microsoft**
- Focus: OOP, design patterns, practical solutions
- Practice: Medium-hard problems
- Emphasis: Code quality, maintainability

**Bloomberg**
- Focus: Real-time systems, data structures
- Practice: Arrays, strings, design
- Emphasis: Production-ready code

### Interview Tips

1. **Communication**
   - Think out loud
   - Explain your approach
   - Ask questions
   - Discuss trade-offs

2. **Code Quality**
   - Clean, readable code
   - Meaningful variable names
   - Proper indentation
   - Handle edge cases

3. **Testing**
   - Test with examples
   - Consider edge cases
   - Walk through code
   - Fix bugs systematically

4. **Time Management**
   - Easy: 10-15 minutes
   - Medium: 20-30 minutes
   - Hard: 35-45 minutes
   - Leave time for questions

### Resources

**Online Platforms**
- LeetCode.com (primary)
- HackerRank
- CodeForces
- AtCoder

**Books**
- Cracking the Coding Interview
- Elements of Programming Interviews
- Algorithm Design Manual

**YouTube Channels**
- NeetCode
- Back To Back SWE
- Tech Dose
- Abdul Bari

**Practice Tools**
- LeetCode Premium
- Mock interview platforms
- Whiteboard practice
- Pair programming

---

## Progress Tracker

### Current Status
- ✅ Easy: 80/140 (57%)
- 🔄 Medium: 60/200 (30%)
- ⏳ Hard: 0/100 (0%)
- **Total: 140/440 (32%)**

### Next Milestones
1. Complete 140 easy problems
2. Reach 100 medium problems
3. Start hard problems
4. Complete 500+ total problems

---

## Quick Reference

### Data Structure Cheat Sheet

**Array**: O(1) access, O(n) search
**Linked List**: O(1) insert/delete, O(n) access
**Stack**: O(1) push/pop, LIFO
**Queue**: O(1) enqueue/dequeue, FIFO
**Hash Table**: O(1) average insert/search/delete
**Binary Search Tree**: O(log n) average operations
**Heap**: O(log n) insert/delete, O(1) peek
**Trie**: O(m) insert/search, m = word length

### Algorithm Complexity

**Sorting**: O(n log n) - merge/quick/heap sort
**Binary Search**: O(log n)
**DFS/BFS**: O(V + E)
**Dynamic Programming**: O(n²) typical
**Backtracking**: O(2ⁿ) or O(n!) worst case

---

**Last Updated**: 2024
**Languages**: Python 3, Kotlin
**Target**: FAANG + HRT Interviews
**Status**: Active Development

*For complete solutions with code, refer to the individual problem files.*
