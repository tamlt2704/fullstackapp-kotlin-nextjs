# LeetCode Medium & Hard Problems Guide

## MEDIUM PROBLEMS (100-300)

### 1. Add Two Numbers (LC #2)
**Hint**: Process linked lists digit by digit with carry.

**Python**:
```python
def addTwoNumbers(l1, l2):
    dummy = curr = ListNode()
    carry = 0
    while l1 or l2 or carry:
        val = carry
        if l1: val += l1.val; l1 = l1.next
        if l2: val += l2.val; l2 = l2.next
        carry, val = divmod(val, 10)
        curr.next = ListNode(val)
        curr = curr.next
    return dummy.next
```

**Kotlin**:
```kotlin
fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode? {
    val dummy = ListNode(0)
    var curr = dummy
    var p1 = l1
    var p2 = l2
    var carry = 0
    while (p1 != null || p2 != null || carry > 0) {
        val sum = (p1?.`val` ?: 0) + (p2?.`val` ?: 0) + carry
        carry = sum / 10
        curr.next = ListNode(sum % 10)
        curr = curr.next!!
        p1 = p1?.next
        p2 = p2?.next
    }
    return dummy.next
}
```

### 2. Longest Substring Without Repeating Characters (LC #3)
**Hint**: Sliding window with set/map.

**Python**:
```python
def lengthOfLongestSubstring(s):
    seen = {}
    l = max_len = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c] + 1
        seen[c] = r
        max_len = max(max_len, r - l + 1)
    return max_len
```

**Kotlin**:
```kotlin
fun lengthOfLongestSubstring(s: String): Int {
    val seen = mutableMapOf<Char, Int>()
    var l = 0
    var maxLen = 0
    for ((r, c) in s.withIndex()) {
        if (c in seen && seen[c]!! >= l) {
            l = seen[c]!! + 1
        }
        seen[c] = r
        maxLen = maxOf(maxLen, r - l + 1)
    }
    return maxLen
}
```

### 3. Longest Palindromic Substring (LC #5)
**Hint**: Expand around center for each position.

**Python**:
```python
def longestPalindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l + 1:r]
    
    res = ""
    for i in range(len(s)):
        res = max(res, expand(i, i), expand(i, i + 1), key=len)
    return res
```

**Kotlin**:
```kotlin
fun longestPalindrome(s: String): String {
    fun expand(l: Int, r: Int): String {
        var left = l
        var right = r
        while (left >= 0 && right < s.length && s[left] == s[right]) {
            left--
            right++
        }
        return s.substring(left + 1, right)
    }
    
    var res = ""
    for (i in s.indices) {
        val s1 = expand(i, i)
        val s2 = expand(i, i + 1)
        res = listOf(res, s1, s2).maxByOrNull { it.length } ?: ""
    }
    return res
}
```

### 4. Zigzag Conversion (LC #6)
**Hint**: Use array of strings for each row.

**Python**:
```python
def convert(s, numRows):
    if numRows == 1: return s
    rows = [''] * numRows
    idx, step = 0, 1
    for c in s:
        rows[idx] += c
        if idx == 0: step = 1
        elif idx == numRows - 1: step = -1
        idx += step
    return ''.join(rows)
```

**Kotlin**:
```kotlin
fun convert(s: String, numRows: Int): String {
    if (numRows == 1) return s
    val rows = Array(numRows) { StringBuilder() }
    var idx = 0
    var step = 1
    for (c in s) {
        rows[idx].append(c)
        if (idx == 0) step = 1
        else if (idx == numRows - 1) step = -1
        idx += step
    }
    return rows.joinToString("")
}
```

### 5. Container With Most Water (LC #11)
**Hint**: Two pointers from both ends, move smaller height.

**Python**:
```python
def maxArea(height):
    l, r = 0, len(height) - 1
    max_area = 0
    while l < r:
        max_area = max(max_area, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_area
```

**Kotlin**:
```kotlin
fun maxArea(height: IntArray): Int {
    var l = 0
    var r = height.size - 1
    var maxArea = 0
    while (l < r) {
        maxArea = maxOf(maxArea, minOf(height[l], height[r]) * (r - l))
        if (height[l] < height[r]) l++ else r--
    }
    return maxArea
}
```

### 6. 3Sum (LC #15)
**Hint**: Sort array, fix one element, use two pointers.

**Python**:
```python
def threeSum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]: continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1
                r -= 1
    return res
```

**Kotlin**:
```kotlin
fun threeSum(nums: IntArray): List<List<Int>> {
    nums.sort()
    val res = mutableListOf<List<Int>>()
    for (i in 0 until nums.size - 2) {
        if (i > 0 && nums[i] == nums[i - 1]) continue
        var l = i + 1
        var r = nums.size - 1
        while (l < r) {
            val sum = nums[i] + nums[l] + nums[r]
            when {
                sum < 0 -> l++
                sum > 0 -> r--
                else -> {
                    res.add(listOf(nums[i], nums[l], nums[r]))
                    while (l < r && nums[l] == nums[l + 1]) l++
                    while (l < r && nums[r] == nums[r - 1]) r--
                    l++
                    r--
                }
            }
        }
    }
    return res
}
```

### 7. Letter Combinations of a Phone Number (LC #17)
**Hint**: Backtracking with digit-to-letter mapping.

**Python**:
```python
def letterCombinations(digits):
    if not digits: return []
    phone = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', 
             '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
    res = []
    def backtrack(i, path):
        if i == len(digits):
            res.append(path)
            return
        for c in phone[digits[i]]:
            backtrack(i + 1, path + c)
    backtrack(0, "")
    return res
```

**Kotlin**:
```kotlin
fun letterCombinations(digits: String): List<String> {
    if (digits.isEmpty()) return emptyList()
    val phone = mapOf('2' to "abc", '3' to "def", '4' to "ghi", '5' to "jkl",
                      '6' to "mno", '7' to "pqrs", '8' to "tuv", '9' to "wxyz")
    val res = mutableListOf<String>()
    fun backtrack(i: Int, path: String) {
        if (i == digits.length) {
            res.add(path)
            return
        }
        for (c in phone[digits[i]]!!) {
            backtrack(i + 1, path + c)
        }
    }
    backtrack(0, "")
    return res
}
```

### 8. Remove Nth Node From End of List (LC #19)
**Hint**: Two pointers with n gap.

**Python**:
```python
def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next
```

**Kotlin**:
```kotlin
fun removeNthFromEnd(head: ListNode?, n: Int): ListNode? {
    val dummy = ListNode(0).apply { next = head }
    var fast: ListNode? = dummy
    var slow: ListNode? = dummy
    repeat(n) { fast = fast?.next }
    while (fast?.next != null) {
        fast = fast?.next
        slow = slow?.next
    }
    slow?.next = slow?.next?.next
    return dummy.next
}
```

### 9. Generate Parentheses (LC #22)
**Hint**: Backtracking with open/close count.

**Python**:
```python
def generateParenthesis(n):
    res = []
    def backtrack(s, open, close):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open < n:
            backtrack(s + '(', open + 1, close)
        if close < open:
            backtrack(s + ')', open, close + 1)
    backtrack('', 0, 0)
    return res
```

**Kotlin**:
```kotlin
fun generateParenthesis(n: Int): List<String> {
    val res = mutableListOf<String>()
    fun backtrack(s: String, open: Int, close: Int) {
        if (s.length == 2 * n) {
            res.add(s)
            return
        }
        if (open < n) backtrack(s + '(', open + 1, close)
        if (close < open) backtrack(s + ')', open, close + 1)
    }
    backtrack("", 0, 0)
    return res
}
```

### 10. Swap Nodes in Pairs (LC #24)
**Hint**: Recursively or iteratively swap adjacent nodes.

**Python**:
```python
def swapPairs(head):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next and prev.next.next:
        first = prev.next
        second = prev.next.next
        first.next = second.next
        second.next = first
        prev.next = second
        prev = first
    return dummy.next
```

**Kotlin**:
```kotlin
fun swapPairs(head: ListNode?): ListNode? {
    val dummy = ListNode(0).apply { next = head }
    var prev = dummy
    while (prev.next != null && prev.next?.next != null) {
        val first = prev.next!!
        val second = prev.next!!.next!!
        first.next = second.next
        second.next = first
        prev.next = second
        prev = first
    }
    return dummy.next
}
```

### 11. Next Permutation (LC #31)
**Hint**: Find pivot, swap, reverse suffix.

**Python**:
```python
def nextPermutation(nums):
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    nums[i + 1:] = reversed(nums[i + 1:])
```

**Kotlin**:
```kotlin
fun nextPermutation(nums: IntArray) {
    var i = nums.size - 2
    while (i >= 0 && nums[i] >= nums[i + 1]) i--
    if (i >= 0) {
        var j = nums.size - 1
        while (nums[j] <= nums[i]) j--
        nums[i] = nums[j].also { nums[j] = nums[i] }
    }
    nums.reverse(i + 1, nums.size)
}
```

### 12. Search in Rotated Sorted Array (LC #33)
**Hint**: Binary search, check which half is sorted.

**Python**:
```python
def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        if nums[l] <= nums[mid]:
            if nums[l] <= target < nums[mid]:
                r = mid - 1
            else:
                l = mid + 1
        else:
            if nums[mid] < target <= nums[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1
```

**Kotlin**:
```kotlin
fun search(nums: IntArray, target: Int): Int {
    var l = 0
    var r = nums.size - 1
    while (l <= r) {
        val mid = l + (r - l) / 2
        if (nums[mid] == target) return mid
        if (nums[l] <= nums[mid]) {
            if (target in nums[l] until nums[mid]) r = mid - 1
            else l = mid + 1
        } else {
            if (target in (nums[mid] + 1)..nums[r]) l = mid + 1
            else r = mid - 1
        }
    }
    return -1
}
```

### 13. Find First and Last Position (LC #34)
**Hint**: Two binary searches for left and right bounds.

**Python**:
```python
def searchRange(nums, target):
    def findBound(isLeft):
        l, r = 0, len(nums) - 1
        idx = -1
        while l <= r:
            mid = (l + r) // 2
            if nums[mid] == target:
                idx = mid
                if isLeft:
                    r = mid - 1
                else:
                    l = mid + 1
            elif nums[mid] < target:
                l = mid + 1
            else:
                r = mid - 1
        return idx
    return [findBound(True), findBound(False)]
```

**Kotlin**:
```kotlin
fun searchRange(nums: IntArray, target: Int): IntArray {
    fun findBound(isLeft: Boolean): Int {
        var l = 0
        var r = nums.size - 1
        var idx = -1
        while (l <= r) {
            val mid = l + (r - l) / 2
            when {
                nums[mid] == target -> {
                    idx = mid
                    if (isLeft) r = mid - 1 else l = mid + 1
                }
                nums[mid] < target -> l = mid + 1
                else -> r = mid - 1
            }
        }
        return idx
    }
    return intArrayOf(findBound(true), findBound(false))
}
```

### 14. Combination Sum (LC #39)
**Hint**: Backtracking with reusable elements.

**Python**:
```python
def combinationSum(candidates, target):
    res = []
    def backtrack(start, path, total):
        if total == target:
            res.append(path[:])
            return
        if total > target:
            return
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, path, total + candidates[i])
            path.pop()
    backtrack(0, [], 0)
    return res
```

**Kotlin**:
```kotlin
fun combinationSum(candidates: IntArray, target: Int): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    fun backtrack(start: Int, path: MutableList<Int>, total: Int) {
        if (total == target) {
            res.add(path.toList())
            return
        }
        if (total > target) return
        for (i in start until candidates.size) {
            path.add(candidates[i])
            backtrack(i, path, total + candidates[i])
            path.removeAt(path.size - 1)
        }
    }
    backtrack(0, mutableListOf(), 0)
    return res
}
```

### 15. Permutations (LC #46)
**Hint**: Backtracking with used set.

**Python**:
```python
def permute(nums):
    res = []
    def backtrack(path):
        if len(path) == len(nums):
            res.append(path[:])
            return
        for n in nums:
            if n not in path:
                path.append(n)
                backtrack(path)
                path.pop()
    backtrack([])
    return res
```

**Kotlin**:
```kotlin
fun permute(nums: IntArray): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    fun backtrack(path: MutableList<Int>) {
        if (path.size == nums.size) {
            res.add(path.toList())
            return
        }
        for (n in nums) {
            if (n !in path) {
                path.add(n)
                backtrack(path)
                path.removeAt(path.size - 1)
            }
        }
    }
    backtrack(mutableListOf())
    return res
}
```

### 16. Rotate Image (LC #48)
**Hint**: Transpose then reverse each row.

**Python**:
```python
def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()
```

**Kotlin**:
```kotlin
fun rotate(matrix: Array<IntArray>) {
    val n = matrix.size
    for (i in 0 until n) {
        for (j in i until n) {
            val temp = matrix[i][j]
            matrix[i][j] = matrix[j][i]
            matrix[j][i] = temp
        }
    }
    for (row in matrix) {
        row.reverse()
    }
}
```

### 17. Group Anagrams (LC #49)
**Hint**: Use sorted string as key in hashmap.

**Python**:
```python
def groupAnagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        groups[tuple(sorted(s))].append(s)
    return list(groups.values())
```

**Kotlin**:
```kotlin
fun groupAnagrams(strs: Array<String>): List<List<String>> {
    val groups = mutableMapOf<String, MutableList<String>>()
    for (s in strs) {
        val key = s.toCharArray().sorted().joinToString("")
        groups.getOrPut(key) { mutableListOf() }.add(s)
    }
    return groups.values.toList()
}
```

### 18. Pow(x, n) (LC #50)
**Hint**: Binary exponentiation (divide and conquer).

**Python**:
```python
def myPow(x, n):
    if n == 0: return 1
    if n < 0: return 1 / myPow(x, -n)
    if n % 2: return x * myPow(x, n - 1)
    return myPow(x * x, n // 2)
```

**Kotlin**:
```kotlin
fun myPow(x: Double, n: Int): Double {
    if (n == 0) return 1.0
    if (n < 0) return 1 / myPow(x, -n)
    if (n % 2 == 1) return x * myPow(x, n - 1)
    return myPow(x * x, n / 2)
}
```

### 19. Spiral Matrix (LC #54)
**Hint**: Track boundaries and direction.

**Python**:
```python
def spiralOrder(matrix):
    res = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for i in range(left, right + 1):
            res.append(matrix[top][i])
        top += 1
        for i in range(top, bottom + 1):
            res.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for i in range(right, left - 1, -1):
                res.append(matrix[bottom][i])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1):
                res.append(matrix[i][left])
            left += 1
    return res
```

**Kotlin**:
```kotlin
fun spiralOrder(matrix: Array<IntArray>): List<Int> {
    val res = mutableListOf<Int>()
    var top = 0
    var bottom = matrix.size - 1
    var left = 0
    var right = matrix[0].size - 1
    while (top <= bottom && left <= right) {
        for (i in left..right) res.add(matrix[top][i])
        top++
        for (i in top..bottom) res.add(matrix[i][right])
        right--
        if (top <= bottom) {
            for (i in right downTo left) res.add(matrix[bottom][i])
            bottom--
        }
        if (left <= right) {
            for (i in bottom downTo top) res.add(matrix[i][left])
            left++
        }
    }
    return res
}
```

### 20. Jump Game (LC #55)
**Hint**: Track maximum reachable index.

**Python**:
```python
def canJump(nums):
    max_reach = 0
    for i, n in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + n)
    return True
```

**Kotlin**:
```kotlin
fun canJump(nums: IntArray): Boolean {
    var maxReach = 0
    for ((i, n) in nums.withIndex()) {
        if (i > maxReach) return false
        maxReach = maxOf(maxReach, i + n)
    }
    return true
}
```


### 21. Merge Intervals (LC #56)
**Hint**: Sort by start, merge overlapping intervals.

**Python**:
```python
def merge(intervals):
    intervals.sort()
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
```

**Kotlin**:
```kotlin
fun merge(intervals: Array<IntArray>): Array<IntArray> {
    intervals.sortBy { it[0] }
    val merged = mutableListOf(intervals[0])
    for (i in 1 until intervals.size) {
        if (intervals[i][0] <= merged.last()[1]) {
            merged.last()[1] = maxOf(merged.last()[1], intervals[i][1])
        } else {
            merged.add(intervals[i])
        }
    }
    return merged.toTypedArray()
}
```

### 22. Unique Paths (LC #62)
**Hint**: DP - dp[i][j] = dp[i-1][j] + dp[i][j-1].

**Python**:
```python
def uniquePaths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]
```

**Kotlin**:
```kotlin
fun uniquePaths(m: Int, n: Int): Int {
    val dp = Array(m) { IntArray(n) { 1 } }
    for (i in 1 until m) {
        for (j in 1 until n) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
        }
    }
    return dp[m-1][n-1]
}
```

### 23. Minimum Path Sum (LC #64)
**Hint**: DP - dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).

**Python**:
```python
def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0: continue
            elif i == 0: grid[i][j] += grid[i][j-1]
            elif j == 0: grid[i][j] += grid[i-1][j]
            else: grid[i][j] += min(grid[i-1][j], grid[i][j-1])
    return grid[m-1][n-1]
```

**Kotlin**:
```kotlin
fun minPathSum(grid: Array<IntArray>): Int {
    val m = grid.size
    val n = grid[0].size
    for (i in 0 until m) {
        for (j in 0 until n) {
            when {
                i == 0 && j == 0 -> continue
                i == 0 -> grid[i][j] += grid[i][j-1]
                j == 0 -> grid[i][j] += grid[i-1][j]
                else -> grid[i][j] += minOf(grid[i-1][j], grid[i][j-1])
            }
        }
    }
    return grid[m-1][n-1]
}
```

### 24. Set Matrix Zeroes (LC #73)
**Hint**: Use first row/column as markers.

**Python**:
```python
def setZeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    first_row = any(matrix[0][j] == 0 for j in range(n))
    first_col = any(matrix[i][0] == 0 for i in range(m))
    
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = matrix[0][j] = 0
    
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    if first_row:
        for j in range(n): matrix[0][j] = 0
    if first_col:
        for i in range(m): matrix[i][0] = 0
```

**Kotlin**:
```kotlin
fun setZeroes(matrix: Array<IntArray>) {
    val m = matrix.size
    val n = matrix[0].size
    val firstRow = matrix[0].any { it == 0 }
    val firstCol = matrix.any { it[0] == 0 }
    
    for (i in 1 until m) {
        for (j in 1 until n) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0
                matrix[0][j] = 0
            }
        }
    }
    
    for (i in 1 until m) {
        for (j in 1 until n) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0
            }
        }
    }
    
    if (firstRow) for (j in 0 until n) matrix[0][j] = 0
    if (firstCol) for (i in 0 until m) matrix[i][0] = 0
}
```

### 25. Sort Colors (LC #75)
**Hint**: Dutch national flag - three pointers.

**Python**:
```python
def sortColors(nums):
    l, mid, r = 0, 0, len(nums) - 1
    while mid <= r:
        if nums[mid] == 0:
            nums[l], nums[mid] = nums[mid], nums[l]
            l += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[r] = nums[r], nums[mid]
            r -= 1
```

**Kotlin**:
```kotlin
fun sortColors(nums: IntArray) {
    var l = 0
    var mid = 0
    var r = nums.size - 1
    while (mid <= r) {
        when (nums[mid]) {
            0 -> {
                nums[l] = nums[mid].also { nums[mid] = nums[l] }
                l++
                mid++
            }
            1 -> mid++
            else -> {
                nums[mid] = nums[r].also { nums[r] = nums[mid] }
                r--
            }
        }
    }
}
```

### 26. Subsets (LC #78)
**Hint**: Backtracking or iterative bit manipulation.

**Python**:
```python
def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res
```

**Kotlin**:
```kotlin
fun subsets(nums: IntArray): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    fun backtrack(start: Int, path: MutableList<Int>) {
        res.add(path.toList())
        for (i in start until nums.size) {
            path.add(nums[i])
            backtrack(i + 1, path)
            path.removeAt(path.size - 1)
        }
    }
    backtrack(0, mutableListOf())
    return res
}
```

### 27. Word Search (LC #79)
**Hint**: DFS backtracking with visited tracking.

**Python**:
```python
def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(i, j, k):
        if k == len(word): return True
        if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:
            return False
        temp = board[i][j]
        board[i][j] = '#'
        found = dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1)
        board[i][j] = temp
        return found
    return any(dfs(i, j, 0) for i in range(m) for j in range(n))
```

**Kotlin**:
```kotlin
fun exist(board: Array<CharArray>, word: String): Boolean {
    val m = board.size
    val n = board[0].size
    fun dfs(i: Int, j: Int, k: Int): Boolean {
        if (k == word.length) return true
        if (i !in 0 until m || j !in 0 until n || board[i][j] != word[k]) return false
        val temp = board[i][j]
        board[i][j] = '#'
        val found = dfs(i+1,j,k+1) || dfs(i-1,j,k+1) || dfs(i,j+1,k+1) || dfs(i,j-1,k+1)
        board[i][j] = temp
        return found
    }
    for (i in 0 until m) {
        for (j in 0 until n) {
            if (dfs(i, j, 0)) return true
        }
    }
    return false
}
```

### 28. Binary Tree Level Order Traversal (LC #102)
**Hint**: BFS with queue.

**Python**:
```python
def levelOrder(root):
    if not root: return []
    res, queue = [], [root]
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res
```

**Kotlin**:
```kotlin
fun levelOrder(root: TreeNode?): List<List<Int>> {
    if (root == null) return emptyList()
    val res = mutableListOf<List<Int>>()
    val queue = ArrayDeque<TreeNode>()
    queue.add(root)
    while (queue.isNotEmpty()) {
        val level = mutableListOf<Int>()
        repeat(queue.size) {
            val node = queue.removeFirst()
            level.add(node.`val`)
            node.left?.let { queue.add(it) }
            node.right?.let { queue.add(it) }
        }
        res.add(level)
    }
    return res
}
```

### 29. Binary Tree Zigzag Level Order (LC #103)
**Hint**: BFS with alternating direction flag.

**Python**:
```python
def zigzagLevelOrder(root):
    if not root: return []
    res, queue, left_to_right = [], [root], True
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level if left_to_right else level[::-1])
        left_to_right = not left_to_right
    return res
```

**Kotlin**:
```kotlin
fun zigzagLevelOrder(root: TreeNode?): List<List<Int>> {
    if (root == null) return emptyList()
    val res = mutableListOf<List<Int>>()
    val queue = ArrayDeque<TreeNode>()
    queue.add(root)
    var leftToRight = true
    while (queue.isNotEmpty()) {
        val level = mutableListOf<Int>()
        repeat(queue.size) {
            val node = queue.removeFirst()
            level.add(node.`val`)
            node.left?.let { queue.add(it) }
            node.right?.let { queue.add(it) }
        }
        res.add(if (leftToRight) level else level.reversed())
        leftToRight = !leftToRight
    }
    return res
}
```

### 30. Construct Binary Tree from Preorder and Inorder (LC #105)
**Hint**: Recursively build using root from preorder.

**Python**:
```python
def buildTree(preorder, inorder):
    if not preorder: return None
    root = TreeNode(preorder[0])
    mid = inorder.index(preorder[0])
    root.left = buildTree(preorder[1:mid+1], inorder[:mid])
    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])
    return root
```

**Kotlin**:
```kotlin
fun buildTree(preorder: IntArray, inorder: IntArray): TreeNode? {
    if (preorder.isEmpty()) return null
    val root = TreeNode(preorder[0])
    val mid = inorder.indexOf(preorder[0])
    root.left = buildTree(preorder.sliceArray(1..mid), inorder.sliceArray(0 until mid))
    root.right = buildTree(preorder.sliceArray(mid+1 until preorder.size), inorder.sliceArray(mid+1 until inorder.size))
    return root
}
```

### 31. Flatten Binary Tree to Linked List (LC #114)
**Hint**: Reverse postorder traversal.

**Python**:
```python
def flatten(root):
    def dfs(node):
        if not node: return None
        right = dfs(node.right)
        left = dfs(node.left)
        node.left = None
        node.right = left
        curr = node
        while curr.right:
            curr = curr.right
        curr.right = right
        return node
    dfs(root)
```

**Kotlin**:
```kotlin
fun flatten(root: TreeNode?) {
    fun dfs(node: TreeNode?): TreeNode? {
        if (node == null) return null
        val right = dfs(node.right)
        val left = dfs(node.left)
        node.left = null
        node.right = left
        var curr = node
        while (curr?.right != null) {
            curr = curr.right
        }
        curr?.right = right
        return node
    }
    dfs(root)
}
```

### 32. Populating Next Right Pointers (LC #116)
**Hint**: Level order traversal linking nodes.

**Python**:
```python
def connect(root):
    if not root: return root
    queue = [root]
    while queue:
        size = len(queue)
        for i in range(size):
            node = queue.pop(0)
            if i < size - 1:
                node.next = queue[0]
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return root
```

**Kotlin**:
```kotlin
fun connect(root: Node?): Node? {
    if (root == null) return root
    val queue = ArrayDeque<Node>()
    queue.add(root)
    while (queue.isNotEmpty()) {
        val size = queue.size
        for (i in 0 until size) {
            val node = queue.removeFirst()
            if (i < size - 1) {
                node.next = queue.first()
            }
            node.left?.let { queue.add(it) }
            node.right?.let { queue.add(it) }
        }
    }
    return root
}
```

### 33. Longest Consecutive Sequence (LC #128)
**Hint**: Use set, check sequence start.

**Python**:
```python
def longestConsecutive(nums):
    num_set = set(nums)
    max_len = 0
    for n in num_set:
        if n - 1 not in num_set:
            curr = n
            curr_len = 1
            while curr + 1 in num_set:
                curr += 1
                curr_len += 1
            max_len = max(max_len, curr_len)
    return max_len
```

**Kotlin**:
```kotlin
fun longestConsecutive(nums: IntArray): Int {
    val numSet = nums.toSet()
    var maxLen = 0
    for (n in numSet) {
        if (n - 1 !in numSet) {
            var curr = n
            var currLen = 1
            while (curr + 1 in numSet) {
                curr++
                currLen++
            }
            maxLen = maxOf(maxLen, currLen)
        }
    }
    return maxLen
}
```

### 34. Clone Graph (LC #133)
**Hint**: DFS/BFS with hashmap for visited nodes.

**Python**:
```python
def cloneGraph(node):
    if not node: return None
    clones = {}
    def dfs(n):
        if n in clones: return clones[n]
        clone = Node(n.val)
        clones[n] = clone
        clone.neighbors = [dfs(neighbor) for neighbor in n.neighbors]
        return clone
    return dfs(node)
```

**Kotlin**:
```kotlin
fun cloneGraph(node: Node?): Node? {
    if (node == null) return null
    val clones = mutableMapOf<Node, Node>()
    fun dfs(n: Node): Node {
        if (n in clones) return clones[n]!!
        val clone = Node(n.`val`)
        clones[n] = clone
        clone.neighbors = ArrayList(n.neighbors.map { dfs(it) })
        return clone
    }
    return dfs(node)
}
```

### 35. Word Break (LC #139)
**Hint**: DP - dp[i] = any(dp[j] and s[j:i] in dict).

**Python**:
```python
def wordBreak(s, wordDict):
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[len(s)]
```

**Kotlin**:
```kotlin
fun wordBreak(s: String, wordDict: List<String>): Boolean {
    val wordSet = wordDict.toSet()
    val dp = BooleanArray(s.length + 1)
    dp[0] = true
    for (i in 1..s.length) {
        for (j in 0 until i) {
            if (dp[j] && s.substring(j, i) in wordSet) {
                dp[i] = true
                break
            }
        }
    }
    return dp[s.length]
}
```

### 36. Linked List Cycle II (LC #142)
**Hint**: Floyd's algorithm, find meeting point then cycle start.

**Python**:
```python
def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None
```

**Kotlin**:
```kotlin
fun detectCycle(head: ListNode?): ListNode? {
    var slow = head
    var fast = head
    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next
        if (slow == fast) {
            slow = head
            while (slow != fast) {
                slow = slow?.next
                fast = fast?.next
            }
            return slow
        }
    }
    return null
}
```

### 37. LRU Cache (LC #146)
**Hint**: HashMap + doubly linked list.

**Python**:
```python
class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = {}
        self.head = self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def get(self, key):
        if key in self.cache:
            self._remove(self.cache[key])
            self._add(self.cache[key])
            return self.cache[key].val
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._add(node)
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]
    
    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
    
    def _add(self, node):
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node
```

**Kotlin**:
```kotlin
class LRUCache(private val capacity: Int) {
    private val cache = mutableMapOf<Int, Node>()
    private val head = Node(0, 0)
    private val tail = Node(0, 0)
    
    init {
        head.next = tail
        tail.prev = head
    }
    
    fun get(key: Int): Int {
        return if (key in cache) {
            val node = cache[key]!!
            remove(node)
            add(node)
            node.value
        } else -1
    }
    
    fun put(key: Int, value: Int) {
        if (key in cache) {
            remove(cache[key]!!)
        }
        val node = Node(key, value)
        cache[key] = node
        add(node)
        if (cache.size > capacity) {
            val lru = head.next!!
            remove(lru)
            cache.remove(lru.key)
        }
    }
    
    private fun remove(node: Node) {
        node.prev!!.next = node.next
        node.next!!.prev = node.prev
    }
    
    private fun add(node: Node) {
        node.prev = tail.prev
        node.next = tail
        tail.prev!!.next = node
        tail.prev = node
    }
    
    class Node(val key: Int, val value: Int) {
        var prev: Node? = null
        var next: Node? = null
    }
}
```

### 38. Sort List (LC #148)
**Hint**: Merge sort on linked list.

**Python**:
```python
def sortList(head):
    if not head or not head.next: return head
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    left = sortList(head)
    right = sortList(mid)
    return merge(left, right)

def merge(l1, l2):
    dummy = curr = ListNode()
    while l1 and l2:
        if l1.val < l2.val:
            curr.next = l1
            l1 = l1.next
        else:
            curr.next = l2
            l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next
```

**Kotlin**:
```kotlin
fun sortList(head: ListNode?): ListNode? {
    if (head?.next == null) return head
    var slow = head
    var fast = head.next
    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next
    }
    val mid = slow?.next
    slow?.next = null
    val left = sortList(head)
    val right = sortList(mid)
    return merge(left, right)
}

fun merge(l1: ListNode?, l2: ListNode?): ListNode? {
    val dummy = ListNode(0)
    var curr = dummy
    var p1 = l1
    var p2 = l2
    while (p1 != null && p2 != null) {
        if (p1.`val` < p2.`val`) {
            curr.next = p1
            p1 = p1.next
        } else {
            curr.next = p2
            p2 = p2.next
        }
        curr = curr.next!!
    }
    curr.next = p1 ?: p2
    return dummy.next
}
```

### 39. Evaluate Reverse Polish Notation (LC #150)
**Hint**: Use stack for operands.

**Python**:
```python
def evalRPN(tokens):
    stack = []
    for t in tokens:
        if t in '+-*/':
            b, a = stack.pop(), stack.pop()
            if t == '+': stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            else: stack.append(int(a / b))
        else:
            stack.append(int(t))
    return stack[0]
```

**Kotlin**:
```kotlin
fun evalRPN(tokens: Array<String>): Int {
    val stack = mutableListOf<Int>()
    for (t in tokens) {
        when (t) {
            "+" -> stack.add(stack.removeLast() + stack.removeLast())
            "-" -> {
                val b = stack.removeLast()
                val a = stack.removeLast()
                stack.add(a - b)
            }
            "*" -> stack.add(stack.removeLast() * stack.removeLast())
            "/" -> {
                val b = stack.removeLast()
                val a = stack.removeLast()
                stack.add(a / b)
            }
            else -> stack.add(t.toInt())
        }
    }
    return stack[0]
}
```

### 40. Find Minimum in Rotated Sorted Array (LC #153)
**Hint**: Binary search comparing with right boundary.

**Python**:
```python
def findMin(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[r]:
            l = mid + 1
        else:
            r = mid
    return nums[l]
```

**Kotlin**:
```kotlin
fun findMin(nums: IntArray): Int {
    var l = 0
    var r = nums.size - 1
    while (l < r) {
        val mid = l + (r - l) / 2
        if (nums[mid] > nums[r]) {
            l = mid + 1
        } else {
            r = mid
        }
    }
    return nums[l]
}
```


### 41. Maximum Product Subarray (LC #152)
**Hint**: Track both max and min products.

**Python**:
```python
def maxProduct(nums):
    res = max_prod = min_prod = nums[0]
    for n in nums[1:]:
        temp = max(n, max_prod * n, min_prod * n)
        min_prod = min(n, max_prod * n, min_prod * n)
        max_prod = temp
        res = max(res, max_prod)
    return res
```

**Kotlin**:
```kotlin
fun maxProduct(nums: IntArray): Int {
    var res = nums[0]
    var maxProd = nums[0]
    var minProd = nums[0]
    for (i in 1 until nums.size) {
        val temp = maxOf(nums[i], maxProd * nums[i], minProd * nums[i])
        minProd = minOf(nums[i], maxProd * nums[i], minProd * nums[i])
        maxProd = temp
        res = maxOf(res, maxProd)
    }
    return res
}
```

### 42. Find Peak Element (LC #162)
**Hint**: Binary search on slope.

**Python**:
```python
def findPeakElement(nums):
    l, r = 0, len(nums) - 1
    while l < r:
        mid = (l + r) // 2
        if nums[mid] > nums[mid + 1]:
            r = mid
        else:
            l = mid + 1
    return l
```

**Kotlin**:
```kotlin
fun findPeakElement(nums: IntArray): Int {
    var l = 0
    var r = nums.size - 1
    while (l < r) {
        val mid = l + (r - l) / 2
        if (nums[mid] > nums[mid + 1]) r = mid
        else l = mid + 1
    }
    return l
}
```

### 43. Compare Version Numbers (LC #165)
**Hint**: Split and compare parts.

**Python**:
```python
def compareVersion(version1, version2):
    v1 = list(map(int, version1.split('.')))
    v2 = list(map(int, version2.split('.')))
    for i in range(max(len(v1), len(v2))):
        n1 = v1[i] if i < len(v1) else 0
        n2 = v2[i] if i < len(v2) else 0
        if n1 < n2: return -1
        if n1 > n2: return 1
    return 0
```

**Kotlin**:
```kotlin
fun compareVersion(version1: String, version2: String): Int {
    val v1 = version1.split(".").map { it.toInt() }
    val v2 = version2.split(".").map { it.toInt() }
    for (i in 0 until maxOf(v1.size, v2.size)) {
        val n1 = if (i < v1.size) v1[i] else 0
        val n2 = if (i < v2.size) v2[i] else 0
        if (n1 < n2) return -1
        if (n1 > n2) return 1
    }
    return 0
}
```

### 44. Fraction to Recurring Decimal (LC #166)
**Hint**: Use map to detect cycle in remainders.

**Python**:
```python
def fractionToDecimal(numerator, denominator):
    if numerator == 0: return "0"
    res = []
    if (numerator < 0) ^ (denominator < 0):
        res.append("-")
    num, den = abs(numerator), abs(denominator)
    res.append(str(num // den))
    remainder = num % den
    if remainder == 0: return "".join(res)
    res.append(".")
    seen = {}
    while remainder:
        if remainder in seen:
            res.insert(seen[remainder], "(")
            res.append(")")
            break
        seen[remainder] = len(res)
        remainder *= 10
        res.append(str(remainder // den))
        remainder %= den
    return "".join(res)
```

**Kotlin**:
```kotlin
fun fractionToDecimal(numerator: Int, denominator: Int): String {
    if (numerator == 0) return "0"
    val res = StringBuilder()
    if ((numerator < 0) xor (denominator < 0)) res.append("-")
    val num = kotlin.math.abs(numerator.toLong())
    val den = kotlin.math.abs(denominator.toLong())
    res.append(num / den)
    var remainder = num % den
    if (remainder == 0L) return res.toString()
    res.append(".")
    val seen = mutableMapOf<Long, Int>()
    while (remainder != 0L) {
        if (remainder in seen) {
            res.insert(seen[remainder]!!, "(")
            res.append(")")
            break
        }
        seen[remainder] = res.length
        remainder *= 10
        res.append(remainder / den)
        remainder %= den
    }
    return res.toString()
}
```

### 45. Two Sum II - Input Array Is Sorted (LC #167)
**Hint**: Two pointers from ends.

**Python**:
```python
def twoSum(numbers, target):
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target: return [l + 1, r + 1]
        elif s < target: l += 1
        else: r -= 1
```

**Kotlin**:
```kotlin
fun twoSum(numbers: IntArray, target: Int): IntArray {
    var l = 0
    var r = numbers.size - 1
    while (l < r) {
        val sum = numbers[l] + numbers[r]
        when {
            sum == target -> return intArrayOf(l + 1, r + 1)
            sum < target -> l++
            else -> r--
        }
    }
    return intArrayOf()
}
```

### 46. Largest Number (LC #179)
**Hint**: Custom comparator for string concatenation.

**Python**:
```python
def largestNumber(nums):
    from functools import cmp_to_key
    nums = list(map(str, nums))
    nums.sort(key=cmp_to_key(lambda x, y: -1 if x + y > y + x else 1))
    return '0' if nums[0] == '0' else ''.join(nums)
```

**Kotlin**:
```kotlin
fun largestNumber(nums: IntArray): String {
    val strs = nums.map { it.toString() }
    val sorted = strs.sortedWith { a, b -> (b + a).compareTo(a + b) }
    return if (sorted[0] == "0") "0" else sorted.joinToString("")
}
```

### 47. Repeated DNA Sequences (LC #187)
**Hint**: Use set to track seen 10-char substrings.

**Python**:
```python
def findRepeatedDnaSequences(s):
    seen, res = set(), set()
    for i in range(len(s) - 9):
        seq = s[i:i+10]
        if seq in seen:
            res.add(seq)
        seen.add(seq)
    return list(res)
```

**Kotlin**:
```kotlin
fun findRepeatedDnaSequences(s: String): List<String> {
    val seen = mutableSetOf<String>()
    val res = mutableSetOf<String>()
    for (i in 0..s.length - 10) {
        val seq = s.substring(i, i + 10)
        if (seq in seen) res.add(seq)
        seen.add(seq)
    }
    return res.toList()
}
```

### 48. Rotate Array (LC #189)
**Hint**: Reverse three times.

**Python**:
```python
def rotate(nums, k):
    k %= len(nums)
    nums.reverse()
    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])
```

**Kotlin**:
```kotlin
fun rotate(nums: IntArray, k: Int) {
    val n = nums.size
    val steps = k % n
    nums.reverse()
    nums.reverse(0, steps)
    nums.reverse(steps, n)
}
```

### 49. House Robber (LC #198)
**Hint**: DP - rob or skip each house.

**Python**:
```python
def rob(nums):
    prev, curr = 0, 0
    for n in nums:
        prev, curr = curr, max(curr, prev + n)
    return curr
```

**Kotlin**:
```kotlin
fun rob(nums: IntArray): Int {
    var prev = 0
    var curr = 0
    for (n in nums) {
        val temp = maxOf(curr, prev + n)
        prev = curr
        curr = temp
    }
    return curr
}
```

### 50. Number of Islands (LC #200)
**Hint**: DFS/BFS to mark connected components.

**Python**:
```python
def numIslands(grid):
    if not grid: return 0
    count = 0
    def dfs(i, j):
        if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != '1':
            return
        grid[i][j] = '0'
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)
    
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                dfs(i, j)
                count += 1
    return count
```

**Kotlin**:
```kotlin
fun numIslands(grid: Array<CharArray>): Int {
    if (grid.isEmpty()) return 0
    var count = 0
    fun dfs(i: Int, j: Int) {
        if (i !in grid.indices || j !in grid[0].indices || grid[i][j] != '1') return
        grid[i][j] = '0'
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)
    }
    for (i in grid.indices) {
        for (j in grid[0].indices) {
            if (grid[i][j] == '1') {
                dfs(i, j)
                count++
            }
        }
    }
    return count
}
```

### 51. Course Schedule (LC #207)
**Hint**: Topological sort with cycle detection.

**Python**:
```python
def canFinish(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[course].append(prereq)
    
    visited = [0] * numCourses
    def dfs(course):
        if visited[course] == 1: return False
        if visited[course] == 2: return True
        visited[course] = 1
        for prereq in graph[course]:
            if not dfs(prereq): return False
        visited[course] = 2
        return True
    
    return all(dfs(i) for i in range(numCourses))
```

**Kotlin**:
```kotlin
fun canFinish(numCourses: Int, prerequisites: Array<IntArray>): Boolean {
    val graph = Array(numCourses) { mutableListOf<Int>() }
    for ((course, prereq) in prerequisites) {
        graph[course].add(prereq)
    }
    val visited = IntArray(numCourses)
    fun dfs(course: Int): Boolean {
        if (visited[course] == 1) return false
        if (visited[course] == 2) return true
        visited[course] = 1
        for (prereq in graph[course]) {
            if (!dfs(prereq)) return false
        }
        visited[course] = 2
        return true
    }
    return (0 until numCourses).all { dfs(it) }
}
```

### 52. Implement Trie (LC #208)
**Hint**: Tree structure with children map.

**Python**:
```python
class Trie:
    def __init__(self):
        self.root = {}
    
    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node:
                node[c] = {}
            node = node[c]
        node['#'] = True
    
    def search(self, word):
        node = self.root
        for c in word:
            if c not in node:
                return False
            node = node[c]
        return '#' in node
    
    def startsWith(self, prefix):
        node = self.root
        for c in prefix:
            if c not in node:
                return False
            node = node[c]
        return True
```

**Kotlin**:
```kotlin
class Trie {
    private val root = TrieNode()
    
    fun insert(word: String) {
        var node = root
        for (c in word) {
            if (c !in node.children) {
                node.children[c] = TrieNode()
            }
            node = node.children[c]!!
        }
        node.isEnd = true
    }
    
    fun search(word: String): Boolean {
        var node = root
        for (c in word) {
            if (c !in node.children) return false
            node = node.children[c]!!
        }
        return node.isEnd
    }
    
    fun startsWith(prefix: String): Boolean {
        var node = root
        for (c in prefix) {
            if (c !in node.children) return false
            node = node.children[c]!!
        }
        return true
    }
    
    class TrieNode {
        val children = mutableMapOf<Char, TrieNode>()
        var isEnd = false
    }
}
```

### 53. Minimum Size Subarray Sum (LC #209)
**Hint**: Sliding window.

**Python**:
```python
def minSubArrayLen(target, nums):
    l = total = 0
    min_len = float('inf')
    for r in range(len(nums)):
        total += nums[r]
        while total >= target:
            min_len = min(min_len, r - l + 1)
            total -= nums[l]
            l += 1
    return min_len if min_len != float('inf') else 0
```

**Kotlin**:
```kotlin
fun minSubArrayLen(target: Int, nums: IntArray): Int {
    var l = 0
    var total = 0
    var minLen = Int.MAX_VALUE
    for (r in nums.indices) {
        total += nums[r]
        while (total >= target) {
            minLen = minOf(minLen, r - l + 1)
            total -= nums[l]
            l++
        }
    }
    return if (minLen == Int.MAX_VALUE) 0 else minLen
}
```

### 54. Course Schedule II (LC #210)
**Hint**: Topological sort with result tracking.

**Python**:
```python
def findOrder(numCourses, prerequisites):
    graph = [[] for _ in range(numCourses)]
    for course, prereq in prerequisites:
        graph[course].append(prereq)
    
    visited = [0] * numCourses
    res = []
    def dfs(course):
        if visited[course] == 1: return False
        if visited[course] == 2: return True
        visited[course] = 1
        for prereq in graph[course]:
            if not dfs(prereq): return False
        visited[course] = 2
        res.append(course)
        return True
    
    for i in range(numCourses):
        if not dfs(i): return []
    return res
```

**Kotlin**:
```kotlin
fun findOrder(numCourses: Int, prerequisites: Array<IntArray>): IntArray {
    val graph = Array(numCourses) { mutableListOf<Int>() }
    for ((course, prereq) in prerequisites) {
        graph[course].add(prereq)
    }
    val visited = IntArray(numCourses)
    val res = mutableListOf<Int>()
    fun dfs(course: Int): Boolean {
        if (visited[course] == 1) return false
        if (visited[course] == 2) return true
        visited[course] = 1
        for (prereq in graph[course]) {
            if (!dfs(prereq)) return false
        }
        visited[course] = 2
        res.add(course)
        return true
    }
    for (i in 0 until numCourses) {
        if (!dfs(i)) return intArrayOf()
    }
    return res.toIntArray()
}
```

### 55. Kth Largest Element in an Array (LC #215)
**Hint**: Quickselect or heap.

**Python**:
```python
def findKthLargest(nums, k):
    import heapq
    return heapq.nlargest(k, nums)[-1]
```

**Kotlin**:
```kotlin
fun findKthLargest(nums: IntArray, k: Int): Int {
    val heap = java.util.PriorityQueue<Int>()
    for (n in nums) {
        heap.offer(n)
        if (heap.size > k) heap.poll()
    }
    return heap.peek()
}
```

### 56. Combination Sum III (LC #216)
**Hint**: Backtracking with digit constraints.

**Python**:
```python
def combinationSum3(k, n):
    res = []
    def backtrack(start, path, total):
        if len(path) == k and total == n:
            res.append(path[:])
            return
        if len(path) >= k or total >= n:
            return
        for i in range(start, 10):
            path.append(i)
            backtrack(i + 1, path, total + i)
            path.pop()
    backtrack(1, [], 0)
    return res
```

**Kotlin**:
```kotlin
fun combinationSum3(k: Int, n: Int): List<List<Int>> {
    val res = mutableListOf<List<Int>>()
    fun backtrack(start: Int, path: MutableList<Int>, total: Int) {
        if (path.size == k && total == n) {
            res.add(path.toList())
            return
        }
        if (path.size >= k || total >= n) return
        for (i in start..9) {
            path.add(i)
            backtrack(i + 1, path, total + i)
            path.removeAt(path.size - 1)
        }
    }
    backtrack(1, mutableListOf(), 0)
    return res
}
```

### 57. Contains Duplicate III (LC #220)
**Hint**: Bucket sort or TreeSet.

**Python**:
```python
def containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff):
    if valueDiff < 0: return False
    buckets = {}
    w = valueDiff + 1
    for i, n in enumerate(nums):
        bucket = n // w
        if bucket in buckets: return True
        if bucket - 1 in buckets and abs(n - buckets[bucket - 1]) < w: return True
        if bucket + 1 in buckets and abs(n - buckets[bucket + 1]) < w: return True
        buckets[bucket] = n
        if i >= indexDiff:
            del buckets[nums[i - indexDiff] // w]
    return False
```

**Kotlin**:
```kotlin
fun containsNearbyAlmostDuplicate(nums: IntArray, indexDiff: Int, valueDiff: Int): Boolean {
    if (valueDiff < 0) return false
    val buckets = mutableMapOf<Long, Long>()
    val w = valueDiff.toLong() + 1
    for ((i, n) in nums.withIndex()) {
        val num = n.toLong()
        val bucket = if (num >= 0) num / w else (num + 1) / w - 1
        if (bucket in buckets) return true
        if (bucket - 1 in buckets && kotlin.math.abs(num - buckets[bucket - 1]!!) < w) return true
        if (bucket + 1 in buckets && kotlin.math.abs(num - buckets[bucket + 1]!!) < w) return true
        buckets[bucket] = num
        if (i >= indexDiff) {
            val oldNum = nums[i - indexDiff].toLong()
            val oldBucket = if (oldNum >= 0) oldNum / w else (oldNum + 1) / w - 1
            buckets.remove(oldBucket)
        }
    }
    return false
}
```

### 58. Maximal Square (LC #221)
**Hint**: DP - dp[i][j] = min of three neighbors + 1.

**Python**:
```python
def maximalSquare(matrix):
    if not matrix: return 0
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_side = 0
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if matrix[i-1][j-1] == '1':
                dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                max_side = max(max_side, dp[i][j])
    return max_side * max_side
```

**Kotlin**:
```kotlin
fun maximalSquare(matrix: Array<CharArray>): Int {
    if (matrix.isEmpty()) return 0
    val m = matrix.size
    val n = matrix[0].size
    val dp = Array(m + 1) { IntArray(n + 1) }
    var maxSide = 0
    for (i in 1..m) {
        for (j in 1..n) {
            if (matrix[i-1][j-1] == '1') {
                dp[i][j] = minOf(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                maxSide = maxOf(maxSide, dp[i][j])
            }
        }
    }
    return maxSide * maxSide
}
```

### 59. Rectangle Area (LC #223)
**Hint**: Calculate overlap and subtract.

**Python**:
```python
def computeArea(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2):
    area1 = (ax2 - ax1) * (ay2 - ay1)
    area2 = (bx2 - bx1) * (by2 - by1)
    overlap_x = max(0, min(ax2, bx2) - max(ax1, bx1))
    overlap_y = max(0, min(ay2, by2) - max(ay1, by1))
    return area1 + area2 - overlap_x * overlap_y
```

**Kotlin**:
```kotlin
fun computeArea(ax1: Int, ay1: Int, ax2: Int, ay2: Int, bx1: Int, by1: Int, bx2: Int, by2: Int): Int {
    val area1 = (ax2 - ax1) * (ay2 - ay1)
    val area2 = (bx2 - bx1) * (by2 - by1)
    val overlapX = maxOf(0, minOf(ax2, bx2) - maxOf(ax1, bx1))
    val overlapY = maxOf(0, minOf(ay2, by2) - maxOf(ay1, by1))
    return area1 + area2 - overlapX * overlapY
}
```

### 60. Basic Calculator II (LC #227)
**Hint**: Stack for handling operators.

**Python**:
```python
def calculate(s):
    stack, num, op = [], 0, '+'
    for i, c in enumerate(s):
        if c.isdigit():
            num = num * 10 + int(c)
        if c in '+-*/' or i == len(s) - 1:
            if op == '+': stack.append(num)
            elif op == '-': stack.append(-num)
            elif op == '*': stack.append(stack.pop() * num)
            elif op == '/': stack.append(int(stack.pop() / num))
            op = c
            num = 0
    return sum(stack)
```

**Kotlin**:
```kotlin
fun calculate(s: String): Int {
    val stack = mutableListOf<Int>()
    var num = 0
    var op = '+'
    for ((i, c) in s.withIndex()) {
        if (c.isDigit()) {
            num = num * 10 + (c - '0')
        }
        if (c in "+-*/" || i == s.length - 1) {
            when (op) {
                '+' -> stack.add(num)
                '-' -> stack.add(-num)
                '*' -> stack.add(stack.removeLast() * num)
                '/' -> stack.add(stack.removeLast() / num)
            }
            op = c
            num = 0
        }
    }
    return stack.sum()
}
```

