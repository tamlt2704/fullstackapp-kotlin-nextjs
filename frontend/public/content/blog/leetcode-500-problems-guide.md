# 500+ LeetCode Problems for FAANG/HRT Interviews

Complete guide with hints and solutions in Kotlin and Python.

## Table of Contents
- [Easy Problems (1-200)](#easy-problems)
- [Medium Problems (201-400)](#medium-problems)
- [Hard Problems (401-500+)](#hard-problems)

---

## EASY PROBLEMS (1-200)

### 1. Two Sum (LC #1)
**Hint**: Use HashMap to store complement values.

**Python**:
```python
def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
```

**Kotlin**:
```kotlin
fun twoSum(nums: IntArray, target: Int): IntArray {
    val map = mutableMapOf<Int, Int>()
    nums.forEachIndexed { i, n ->
        map[target - n]?.let { return intArrayOf(it, i) }
        map[n] = i
    }
    return intArrayOf()
}
```

### 2. Reverse Integer (LC #7)
**Hint**: Use modulo and division, check overflow.

**Python**:
```python
def reverse(x):
    sign = -1 if x < 0 else 1
    x = abs(x)
    res = 0
    while x:
        res = res * 10 + x % 10
        x //= 10
    return 0 if res > 2**31 - 1 else sign * res
```

**Kotlin**:
```kotlin
fun reverse(x: Int): Int {
    var num = x
    var res = 0L
    while (num != 0) {
        res = res * 10 + num % 10
        num /= 10
    }
    return if (res > Int.MAX_VALUE || res < Int.MIN_VALUE) 0 else res.toInt()
}
```

### 3. Palindrome Number (LC #9)
**Hint**: Reverse half of the number.

**Python**:
```python
def isPalindrome(x):
    if x < 0 or (x % 10 == 0 and x != 0):
        return False
    rev = 0
    while x > rev:
        rev = rev * 10 + x % 10
        x //= 10
    return x == rev or x == rev // 10
```

**Kotlin**:
```kotlin
fun isPalindrome(x: Int): Boolean {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false
    var num = x
    var rev = 0
    while (num > rev) {
        rev = rev * 10 + num % 10
        num /= 10
    }
    return num == rev || num == rev / 10
}
```

### 4. Roman to Integer (LC #13)
**Hint**: Process right to left, subtract if current < next.

**Python**:
```python
def romanToInt(s):
    m = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    res = 0
    for i in range(len(s)):
        if i + 1 < len(s) and m[s[i]] < m[s[i + 1]]:
            res -= m[s[i]]
        else:
            res += m[s[i]]
    return res
```

**Kotlin**:
```kotlin
fun romanToInt(s: String): Int {
    val m = mapOf('I' to 1, 'V' to 5, 'X' to 10, 'L' to 50, 'C' to 100, 'D' to 500, 'M' to 1000)
    var res = 0
    for (i in s.indices) {
        if (i + 1 < s.length && m[s[i]]!! < m[s[i + 1]]!!) res -= m[s[i]]!!
        else res += m[s[i]]!!
    }
    return res
}
```

### 5. Longest Common Prefix (LC #14)
**Hint**: Compare characters vertically.

**Python**:
```python
def longestCommonPrefix(strs):
    if not strs: return ""
    for i in range(len(strs[0])):
        for s in strs[1:]:
            if i >= len(s) or s[i] != strs[0][i]:
                return strs[0][:i]
    return strs[0]
```

**Kotlin**:
```kotlin
fun longestCommonPrefix(strs: Array<String>): String {
    if (strs.isEmpty()) return ""
    for (i in strs[0].indices) {
        for (s in strs.drop(1)) {
            if (i >= s.length || s[i] != strs[0][i]) return strs[0].substring(0, i)
        }
    }
    return strs[0]
}
```

### 6. Valid Parentheses (LC #20)
**Hint**: Use stack to match pairs.

**Python**:
```python
def isValid(s):
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    for c in s:
        if c in pairs:
            stack.append(c)
        elif not stack or pairs[stack.pop()] != c:
            return False
    return not stack
```

**Kotlin**:
```kotlin
fun isValid(s: String): Boolean {
    val stack = mutableListOf<Char>()
    val pairs = mapOf('(' to ')', '[' to ']', '{' to '}')
    for (c in s) {
        if (c in pairs) stack.add(c)
        else if (stack.isEmpty() || pairs[stack.removeLast()] != c) return false
    }
    return stack.isEmpty()
}
```

### 7. Merge Two Sorted Lists (LC #21)
**Hint**: Use dummy node and two pointers.

**Python**:
```python
def mergeTwoLists(l1, l2):
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
fun mergeTwoLists(l1: ListNode?, l2: ListNode?): ListNode? {
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

### 8. Remove Duplicates from Sorted Array (LC #26)
**Hint**: Two pointers, one for unique position.

**Python**:
```python
def removeDuplicates(nums):
    if not nums: return 0
    i = 0
    for j in range(1, len(nums)):
        if nums[j] != nums[i]:
            i += 1
            nums[i] = nums[j]
    return i + 1
```

**Kotlin**:
```kotlin
fun removeDuplicates(nums: IntArray): Int {
    if (nums.isEmpty()) return 0
    var i = 0
    for (j in 1 until nums.size) {
        if (nums[j] != nums[i]) {
            i++
            nums[i] = nums[j]
        }
    }
    return i + 1
}
```

### 9. Remove Element (LC #27)
**Hint**: Two pointers, overwrite matching elements.

**Python**:
```python
def removeElement(nums, val):
    i = 0
    for j in range(len(nums)):
        if nums[j] != val:
            nums[i] = nums[j]
            i += 1
    return i
```

**Kotlin**:
```kotlin
fun removeElement(nums: IntArray, `val`: Int): Int {
    var i = 0
    for (j in nums.indices) {
        if (nums[j] != `val`) {
            nums[i] = nums[j]
            i++
        }
    }
    return i
}
```

### 10. Search Insert Position (LC #35)
**Hint**: Binary search for target or insertion point.

**Python**:
```python
def searchInsert(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return l
```

**Kotlin**:
```kotlin
fun searchInsert(nums: IntArray, target: Int): Int {
    var l = 0
    var r = nums.size - 1
    while (l <= r) {
        val mid = l + (r - l) / 2
        when {
            nums[mid] == target -> return mid
            nums[mid] < target -> l = mid + 1
            else -> r = mid - 1
        }
    }
    return l
}
```

### 11. Maximum Subarray (LC #53)
**Hint**: Kadane's algorithm - track current and max sum.

**Python**:
```python
def maxSubArray(nums):
    curr = max_sum = nums[0]
    for n in nums[1:]:
        curr = max(n, curr + n)
        max_sum = max(max_sum, curr)
    return max_sum
```

**Kotlin**:
```kotlin
fun maxSubArray(nums: IntArray): Int {
    var curr = nums[0]
    var maxSum = nums[0]
    for (i in 1 until nums.size) {
        curr = maxOf(nums[i], curr + nums[i])
        maxSum = maxOf(maxSum, curr)
    }
    return maxSum
}
```

### 12. Length of Last Word (LC #58)
**Hint**: Strip and split, or iterate from end.

**Python**:
```python
def lengthOfLastWord(s):
    return len(s.strip().split()[-1]) if s.strip() else 0
```

**Kotlin**:
```kotlin
fun lengthOfLastWord(s: String): Int {
    return s.trim().split(" ").lastOrNull()?.length ?: 0
}
```

### 13. Plus One (LC #66)
**Hint**: Handle carry from right to left.

**Python**:
```python
def plusOne(digits):
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits
```

**Kotlin**:
```kotlin
fun plusOne(digits: IntArray): IntArray {
    for (i in digits.size - 1 downTo 0) {
        if (digits[i] < 9) {
            digits[i]++
            return digits
        }
        digits[i] = 0
    }
    return intArrayOf(1) + digits
}
```

### 14. Add Binary (LC #67)
**Hint**: Process from right to left with carry.

**Python**:
```python
def addBinary(a, b):
    res, carry = [], 0
    i, j = len(a) - 1, len(b) - 1
    while i >= 0 or j >= 0 or carry:
        total = carry
        if i >= 0: total += int(a[i]); i -= 1
        if j >= 0: total += int(b[j]); j -= 1
        res.append(str(total % 2))
        carry = total // 2
    return ''.join(reversed(res))
```

**Kotlin**:
```kotlin
fun addBinary(a: String, b: String): String {
    val res = StringBuilder()
    var i = a.length - 1
    var j = b.length - 1
    var carry = 0
    while (i >= 0 || j >= 0 || carry > 0) {
        var sum = carry
        if (i >= 0) sum += a[i--] - '0'
        if (j >= 0) sum += b[j--] - '0'
        res.append(sum % 2)
        carry = sum / 2
    }
    return res.reverse().toString()
}
```

### 15. Sqrt(x) (LC #69)
**Hint**: Binary search for square root.

**Python**:
```python
def mySqrt(x):
    if x < 2: return x
    l, r = 1, x // 2
    while l <= r:
        mid = (l + r) // 2
        if mid * mid == x:
            return mid
        elif mid * mid < x:
            l = mid + 1
        else:
            r = mid - 1
    return r
```

**Kotlin**:
```kotlin
fun mySqrt(x: Int): Int {
    if (x < 2) return x
    var l = 1
    var r = x / 2
    while (l <= r) {
        val mid = l + (r - l) / 2
        val sq = mid.toLong() * mid
        when {
            sq == x.toLong() -> return mid
            sq < x -> l = mid + 1
            else -> r = mid - 1
        }
    }
    return r
}
```

### 16. Climbing Stairs (LC #70)
**Hint**: Fibonacci pattern - dp[i] = dp[i-1] + dp[i-2].

**Python**:
```python
def climbStairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
```

**Kotlin**:
```kotlin
fun climbStairs(n: Int): Int {
    if (n <= 2) return n
    var a = 1
    var b = 2
    for (i in 3..n) {
        val temp = a + b
        a = b
        b = temp
    }
    return b
}
```

### 17. Remove Duplicates from Sorted List (LC #83)
**Hint**: Skip nodes with duplicate values.

**Python**:
```python
def deleteDuplicates(head):
    curr = head
    while curr and curr.next:
        if curr.val == curr.next.val:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return head
```

**Kotlin**:
```kotlin
fun deleteDuplicates(head: ListNode?): ListNode? {
    var curr = head
    while (curr?.next != null) {
        if (curr.`val` == curr.next!!.`val`) {
            curr.next = curr.next!!.next
        } else {
            curr = curr.next
        }
    }
    return head
}
```

### 18. Merge Sorted Array (LC #88)
**Hint**: Fill from end to avoid overwriting.

**Python**:
```python
def merge(nums1, m, nums2, n):
    i, j, k = m - 1, n - 1, m + n - 1
    while j >= 0:
        if i >= 0 and nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
```

**Kotlin**:
```kotlin
fun merge(nums1: IntArray, m: Int, nums2: IntArray, n: Int) {
    var i = m - 1
    var j = n - 1
    var k = m + n - 1
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--]
        } else {
            nums1[k--] = nums2[j--]
        }
    }
}
```

### 19. Same Tree (LC #100)
**Hint**: Recursive comparison of nodes.

**Python**:
```python
def isSameTree(p, q):
    if not p and not q: return True
    if not p or not q: return False
    return p.val == q.val and isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

**Kotlin**:
```kotlin
fun isSameTree(p: TreeNode?, q: TreeNode?): Boolean {
    if (p == null && q == null) return true
    if (p == null || q == null) return false
    return p.`val` == q.`val` && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}
```

### 20. Symmetric Tree (LC #101)
**Hint**: Check if left subtree mirrors right subtree.

**Python**:
```python
def isSymmetric(root):
    def mirror(l, r):
        if not l and not r: return True
        if not l or not r: return False
        return l.val == r.val and mirror(l.left, r.right) and mirror(l.right, r.left)
    return mirror(root, root) if root else True
```

**Kotlin**:
```kotlin
fun isSymmetric(root: TreeNode?): Boolean {
    fun mirror(l: TreeNode?, r: TreeNode?): Boolean {
        if (l == null && r == null) return true
        if (l == null || r == null) return false
        return l.`val` == r.`val` && mirror(l.left, r.right) && mirror(l.right, r.left)
    }
    return root?.let { mirror(it, it) } ?: true
}
```


### 21. Maximum Depth of Binary Tree (LC #104)
**Hint**: Recursively find max depth of left and right.

**Python**:
```python
def maxDepth(root):
    if not root: return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
```

**Kotlin**:
```kotlin
fun maxDepth(root: TreeNode?): Int {
    if (root == null) return 0
    return 1 + maxOf(maxDepth(root.left), maxDepth(root.right))
}
```

### 22. Convert Sorted Array to BST (LC #108)
**Hint**: Use middle element as root recursively.

**Python**:
```python
def sortedArrayToBST(nums):
    if not nums: return None
    mid = len(nums) // 2
    root = TreeNode(nums[mid])
    root.left = sortedArrayToBST(nums[:mid])
    root.right = sortedArrayToBST(nums[mid + 1:])
    return root
```

**Kotlin**:
```kotlin
fun sortedArrayToBST(nums: IntArray): TreeNode? {
    if (nums.isEmpty()) return null
    val mid = nums.size / 2
    return TreeNode(nums[mid]).apply {
        left = sortedArrayToBST(nums.sliceArray(0 until mid))
        right = sortedArrayToBST(nums.sliceArray(mid + 1 until nums.size))
    }
}
```

### 23. Balanced Binary Tree (LC #110)
**Hint**: Check height difference at each node.

**Python**:
```python
def isBalanced(root):
    def height(node):
        if not node: return 0
        l, r = height(node.left), height(node.right)
        if l == -1 or r == -1 or abs(l - r) > 1: return -1
        return 1 + max(l, r)
    return height(root) != -1
```

**Kotlin**:
```kotlin
fun isBalanced(root: TreeNode?): Boolean {
    fun height(node: TreeNode?): Int {
        if (node == null) return 0
        val l = height(node.left)
        val r = height(node.right)
        if (l == -1 || r == -1 || kotlin.math.abs(l - r) > 1) return -1
        return 1 + maxOf(l, r)
    }
    return height(root) != -1
}
```

### 24. Minimum Depth of Binary Tree (LC #111)
**Hint**: BFS or recursive with leaf check.

**Python**:
```python
def minDepth(root):
    if not root: return 0
    if not root.left: return 1 + minDepth(root.right)
    if not root.right: return 1 + minDepth(root.left)
    return 1 + min(minDepth(root.left), minDepth(root.right))
```

**Kotlin**:
```kotlin
fun minDepth(root: TreeNode?): Int {
    if (root == null) return 0
    if (root.left == null) return 1 + minDepth(root.right)
    if (root.right == null) return 1 + minDepth(root.left)
    return 1 + minOf(minDepth(root.left), minDepth(root.right))
}
```

### 25. Path Sum (LC #112)
**Hint**: Recursively check if leaf sum equals target.

**Python**:
```python
def hasPathSum(root, targetSum):
    if not root: return False
    if not root.left and not root.right: return root.val == targetSum
    return hasPathSum(root.left, targetSum - root.val) or hasPathSum(root.right, targetSum - root.val)
```

**Kotlin**:
```kotlin
fun hasPathSum(root: TreeNode?, targetSum: Int): Boolean {
    if (root == null) return false
    if (root.left == null && root.right == null) return root.`val` == targetSum
    return hasPathSum(root.left, targetSum - root.`val`) || hasPathSum(root.right, targetSum - root.`val`)
}
```

### 26. Pascal's Triangle (LC #118)
**Hint**: Each element is sum of two above it.

**Python**:
```python
def generate(numRows):
    res = [[1]]
    for i in range(1, numRows):
        row = [1]
        for j in range(1, i):
            row.append(res[i - 1][j - 1] + res[i - 1][j])
        row.append(1)
        res.append(row)
    return res
```

**Kotlin**:
```kotlin
fun generate(numRows: Int): List<List<Int>> {
    val res = mutableListOf(listOf(1))
    for (i in 1 until numRows) {
        val row = mutableListOf(1)
        for (j in 1 until i) {
            row.add(res[i - 1][j - 1] + res[i - 1][j])
        }
        row.add(1)
        res.add(row)
    }
    return res
}
```

### 27. Pascal's Triangle II (LC #119)
**Hint**: Build row in-place from right to left.

**Python**:
```python
def getRow(rowIndex):
    row = [1]
    for i in range(rowIndex):
        row = [1] + [row[j] + row[j + 1] for j in range(len(row) - 1)] + [1]
    return row
```

**Kotlin**:
```kotlin
fun getRow(rowIndex: Int): List<Int> {
    var row = listOf(1)
    for (i in 0 until rowIndex) {
        row = listOf(1) + (0 until row.size - 1).map { row[it] + row[it + 1] } + listOf(1)
    }
    return row
}
```

### 28. Best Time to Buy and Sell Stock (LC #121)
**Hint**: Track minimum price and maximum profit.

**Python**:
```python
def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for p in prices:
        min_price = min(min_price, p)
        max_profit = max(max_profit, p - min_price)
    return max_profit
```

**Kotlin**:
```kotlin
fun maxProfit(prices: IntArray): Int {
    var minPrice = Int.MAX_VALUE
    var maxProfit = 0
    for (p in prices) {
        minPrice = minOf(minPrice, p)
        maxProfit = maxOf(maxProfit, p - minPrice)
    }
    return maxProfit
}
```

### 29. Valid Palindrome (LC #125)
**Hint**: Two pointers from both ends, skip non-alphanumeric.

**Python**:
```python
def isPalindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower(): return False
        l += 1
        r -= 1
    return True
```

**Kotlin**:
```kotlin
fun isPalindrome(s: String): Boolean {
    var l = 0
    var r = s.length - 1
    while (l < r) {
        while (l < r && !s[l].isLetterOrDigit()) l++
        while (l < r && !s[r].isLetterOrDigit()) r--
        if (s[l].lowercaseChar() != s[r].lowercaseChar()) return false
        l++
        r--
    }
    return true
}
```

### 30. Single Number (LC #136)
**Hint**: XOR all numbers, duplicates cancel out.

**Python**:
```python
def singleNumber(nums):
    res = 0
    for n in nums:
        res ^= n
    return res
```

**Kotlin**:
```kotlin
fun singleNumber(nums: IntArray): Int {
    return nums.reduce { acc, n -> acc xor n }
}
```

### 31. Linked List Cycle (LC #141)
**Hint**: Floyd's cycle detection - slow and fast pointers.

**Python**:
```python
def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False
```

**Kotlin**:
```kotlin
fun hasCycle(head: ListNode?): Boolean {
    var slow = head
    var fast = head
    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next
        if (slow == fast) return true
    }
    return false
}
```

### 32. Min Stack (LC #155)
**Hint**: Use auxiliary stack to track minimums.

**Python**:
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self):
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def getMin(self):
        return self.min_stack[-1]
```

**Kotlin**:
```kotlin
class MinStack {
    private val stack = mutableListOf<Int>()
    private val minStack = mutableListOf<Int>()
    
    fun push(`val`: Int) {
        stack.add(`val`)
        if (minStack.isEmpty() || `val` <= minStack.last()) {
            minStack.add(`val`)
        }
    }
    
    fun pop() {
        if (stack.removeLast() == minStack.last()) {
            minStack.removeLast()
        }
    }
    
    fun top(): Int = stack.last()
    
    fun getMin(): Int = minStack.last()
}
```

### 33. Intersection of Two Linked Lists (LC #160)
**Hint**: Two pointers, switch heads when reaching end.

**Python**:
```python
def getIntersectionNode(headA, headB):
    a, b = headA, headB
    while a != b:
        a = a.next if a else headB
        b = b.next if b else headA
    return a
```

**Kotlin**:
```kotlin
fun getIntersectionNode(headA: ListNode?, headB: ListNode?): ListNode? {
    var a = headA
    var b = headB
    while (a != b) {
        a = if (a != null) a.next else headB
        b = if (b != null) b.next else headA
    }
    return a
}
```

### 34. Two Sum II - Input Array Is Sorted (LC #167)
**Hint**: Two pointers from both ends.

**Python**:
```python
def twoSum(numbers, target):
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]
        elif s < target:
            l += 1
        else:
            r -= 1
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

### 35. Excel Sheet Column Title (LC #168)
**Hint**: Base-26 conversion with offset.

**Python**:
```python
def convertToTitle(columnNumber):
    res = []
    while columnNumber:
        columnNumber -= 1
        res.append(chr(ord('A') + columnNumber % 26))
        columnNumber //= 26
    return ''.join(reversed(res))
```

**Kotlin**:
```kotlin
fun convertToTitle(columnNumber: Int): String {
    var n = columnNumber
    val res = StringBuilder()
    while (n > 0) {
        n--
        res.append('A' + n % 26)
        n /= 26
    }
    return res.reverse().toString()
}
```

### 36. Majority Element (LC #169)
**Hint**: Boyer-Moore voting algorithm.

**Python**:
```python
def majorityElement(nums):
    count = 0
    candidate = None
    for n in nums:
        if count == 0:
            candidate = n
        count += 1 if n == candidate else -1
    return candidate
```

**Kotlin**:
```kotlin
fun majorityElement(nums: IntArray): Int {
    var count = 0
    var candidate = 0
    for (n in nums) {
        if (count == 0) candidate = n
        count += if (n == candidate) 1 else -1
    }
    return candidate
}
```

### 37. Excel Sheet Column Number (LC #171)
**Hint**: Base-26 to decimal conversion.

**Python**:
```python
def titleToNumber(columnTitle):
    res = 0
    for c in columnTitle:
        res = res * 26 + ord(c) - ord('A') + 1
    return res
```

**Kotlin**:
```kotlin
fun titleToNumber(columnTitle: String): Int {
    var res = 0
    for (c in columnTitle) {
        res = res * 26 + (c - 'A' + 1)
    }
    return res
}
```

### 38. Reverse Bits (LC #190)
**Hint**: Process bit by bit from right to left.

**Python**:
```python
def reverseBits(n):
    res = 0
    for i in range(32):
        res = (res << 1) | (n & 1)
        n >>= 1
    return res
```

**Kotlin**:
```kotlin
fun reverseBits(n: Int): Int {
    var num = n
    var res = 0
    for (i in 0 until 32) {
        res = (res shl 1) or (num and 1)
        num = num ushr 1
    }
    return res
}
```

### 39. Number of 1 Bits (LC #191)
**Hint**: Use n & (n-1) to clear rightmost 1 bit.

**Python**:
```python
def hammingWeight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

**Kotlin**:
```kotlin
fun hammingWeight(n: Int): Int {
    var num = n
    var count = 0
    while (num != 0) {
        num = num and (num - 1)
        count++
    }
    return count
}
```

### 40. Happy Number (LC #202)
**Hint**: Use set to detect cycles.

**Python**:
```python
def isHappy(n):
    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = sum(int(d) ** 2 for d in str(n))
    return n == 1
```

**Kotlin**:
```kotlin
fun isHappy(n: Int): Boolean {
    val seen = mutableSetOf<Int>()
    var num = n
    while (num != 1 && num !in seen) {
        seen.add(num)
        num = num.toString().sumOf { (it - '0') * (it - '0') }
    }
    return num == 1
}
```

### 41. Remove Linked List Elements (LC #203)
**Hint**: Use dummy node to handle head removal.

**Python**:
```python
def removeElements(head, val):
    dummy = ListNode(0, head)
    curr = dummy
    while curr.next:
        if curr.next.val == val:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return dummy.next
```

**Kotlin**:
```kotlin
fun removeElements(head: ListNode?, `val`: Int): ListNode? {
    val dummy = ListNode(0).apply { next = head }
    var curr = dummy
    while (curr.next != null) {
        if (curr.next!!.`val` == `val`) {
            curr.next = curr.next!!.next
        } else {
            curr = curr.next!!
        }
    }
    return dummy.next
}
```

### 42. Isomorphic Strings (LC #205)
**Hint**: Use two maps for bidirectional mapping.

**Python**:
```python
def isIsomorphic(s, t):
    return len(set(s)) == len(set(t)) == len(set(zip(s, t)))
```

**Kotlin**:
```kotlin
fun isIsomorphic(s: String, t: String): Boolean {
    return s.toSet().size == t.toSet().size && s.zip(t).toSet().size == s.toSet().size
}
```

### 43. Reverse Linked List (LC #206)
**Hint**: Iteratively reverse pointers.

**Python**:
```python
def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
```

**Kotlin**:
```kotlin
fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var curr = head
    while (curr != null) {
        val next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    return prev
}
```

### 44. Contains Duplicate (LC #217)
**Hint**: Use set to track seen elements.

**Python**:
```python
def containsDuplicate(nums):
    return len(nums) != len(set(nums))
```

**Kotlin**:
```kotlin
fun containsDuplicate(nums: IntArray): Boolean {
    return nums.size != nums.toSet().size
}
```

### 45. Contains Duplicate II (LC #219)
**Hint**: Use map to store index of last occurrence.

**Python**:
```python
def containsNearbyDuplicate(nums, k):
    seen = {}
    for i, n in enumerate(nums):
        if n in seen and i - seen[n] <= k:
            return True
        seen[n] = i
    return False
```

**Kotlin**:
```kotlin
fun containsNearbyDuplicate(nums: IntArray, k: Int): Boolean {
    val seen = mutableMapOf<Int, Int>()
    for ((i, n) in nums.withIndex()) {
        if (n in seen && i - seen[n]!! <= k) return true
        seen[n] = i
    }
    return false
}
```

### 46. Implement Stack using Queues (LC #225)
**Hint**: Use one queue, rotate on push.

**Python**:
```python
from collections import deque

class MyStack:
    def __init__(self):
        self.q = deque()
    
    def push(self, x):
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())
    
    def pop(self):
        return self.q.popleft()
    
    def top(self):
        return self.q[0]
    
    def empty(self):
        return not self.q
```

**Kotlin**:
```kotlin
class MyStack {
    private val q = ArrayDeque<Int>()
    
    fun push(x: Int) {
        q.add(x)
        repeat(q.size - 1) {
            q.add(q.removeFirst())
        }
    }
    
    fun pop(): Int = q.removeFirst()
    
    fun top(): Int = q.first()
    
    fun empty(): Boolean = q.isEmpty()
}
```

### 47. Invert Binary Tree (LC #226)
**Hint**: Recursively swap left and right children.

**Python**:
```python
def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root
```

**Kotlin**:
```kotlin
fun invertTree(root: TreeNode?): TreeNode? {
    if (root == null) return null
    val temp = root.left
    root.left = invertTree(root.right)
    root.right = invertTree(temp)
    return root
}
```

### 48. Implement Queue using Stacks (LC #232)
**Hint**: Use two stacks, transfer on pop/peek.

**Python**:
```python
class MyQueue:
    def __init__(self):
        self.s1, self.s2 = [], []
    
    def push(self, x):
        self.s1.append(x)
    
    def pop(self):
        self._transfer()
        return self.s2.pop()
    
    def peek(self):
        self._transfer()
        return self.s2[-1]
    
    def empty(self):
        return not self.s1 and not self.s2
    
    def _transfer(self):
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
```

**Kotlin**:
```kotlin
class MyQueue {
    private val s1 = mutableListOf<Int>()
    private val s2 = mutableListOf<Int>()
    
    fun push(x: Int) {
        s1.add(x)
    }
    
    fun pop(): Int {
        transfer()
        return s2.removeLast()
    }
    
    fun peek(): Int {
        transfer()
        return s2.last()
    }
    
    fun empty(): Boolean = s1.isEmpty() && s2.isEmpty()
    
    private fun transfer() {
        if (s2.isEmpty()) {
            while (s1.isNotEmpty()) {
                s2.add(s1.removeLast())
            }
        }
    }
}
```

### 49. Palindrome Linked List (LC #234)
**Hint**: Find middle, reverse second half, compare.

**Python**:
```python
def isPalindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    prev = None
    while slow:
        next_node = slow.next
        slow.next = prev
        prev = slow
        slow = next_node
    
    while prev:
        if head.val != prev.val:
            return False
        head = head.next
        prev = prev.next
    return True
```

**Kotlin**:
```kotlin
fun isPalindrome(head: ListNode?): Boolean {
    var slow = head
    var fast = head
    while (fast?.next != null) {
        slow = slow?.next
        fast = fast.next?.next
    }
    
    var prev: ListNode? = null
    var curr = slow
    while (curr != null) {
        val next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    
    var p1 = head
    var p2 = prev
    while (p2 != null) {
        if (p1?.`val` != p2.`val`) return false
        p1 = p1.next
        p2 = p2.next
    }
    return true
}
```

### 50. Lowest Common Ancestor of BST (LC #235)
**Hint**: Use BST property to navigate.

**Python**:
```python
def lowestCommonAncestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
```

**Kotlin**:
```kotlin
fun lowestCommonAncestor(root: TreeNode?, p: TreeNode?, q: TreeNode?): TreeNode? {
    var curr = root
    while (curr != null) {
        when {
            p!!.`val` < curr.`val` && q!!.`val` < curr.`val` -> curr = curr.left
            p.`val` > curr.`val` && q!!.`val` > curr.`val` -> curr = curr.right
            else -> return curr
        }
    }
    return null
}
```


### 51. Delete Node in a Linked List (LC #237)
**Hint**: Copy next node's value and skip next.

**Python**:
```python
def deleteNode(node):
    node.val = node.next.val
    node.next = node.next.next
```

**Kotlin**:
```kotlin
fun deleteNode(node: ListNode?) {
    node?.`val` = node?.next?.`val` ?: 0
    node?.next = node?.next?.next
}
```

### 52. Valid Anagram (LC #242)
**Hint**: Sort or use frequency map.

**Python**:
```python
def isAnagram(s, t):
    return sorted(s) == sorted(t)
```

**Kotlin**:
```kotlin
fun isAnagram(s: String, t: String): Boolean {
    return s.toCharArray().sorted() == t.toCharArray().sorted()
}
```

### 53. Binary Tree Paths (LC #257)
**Hint**: DFS with path tracking.

**Python**:
```python
def binaryTreePaths(root):
    if not root: return []
    if not root.left and not root.right: return [str(root.val)]
    paths = []
    for path in binaryTreePaths(root.left) + binaryTreePaths(root.right):
        paths.append(str(root.val) + '->' + path)
    return paths
```

**Kotlin**:
```kotlin
fun binaryTreePaths(root: TreeNode?): List<String> {
    if (root == null) return emptyList()
    if (root.left == null && root.right == null) return listOf("${root.`val`}")
    return (binaryTreePaths(root.left) + binaryTreePaths(root.right))
        .map { "${root.`val`}->$it" }
}
```

### 54. Add Digits (LC #258)
**Hint**: Digital root formula or loop.

**Python**:
```python
def addDigits(num):
    return 1 + (num - 1) % 9 if num else 0
```

**Kotlin**:
```kotlin
fun addDigits(num: Int): Int {
    return if (num == 0) 0 else 1 + (num - 1) % 9
}
```

### 55. Ugly Number (LC #263)
**Hint**: Divide by 2, 3, 5 until can't.

**Python**:
```python
def isUgly(n):
    if n <= 0: return False
    for p in [2, 3, 5]:
        while n % p == 0:
            n //= p
    return n == 1
```

**Kotlin**:
```kotlin
fun isUgly(n: Int): Boolean {
    if (n <= 0) return false
    var num = n
    for (p in listOf(2, 3, 5)) {
        while (num % p == 0) num /= p
    }
    return num == 1
}
```

### 56. Missing Number (LC #268)
**Hint**: XOR or sum formula.

**Python**:
```python
def missingNumber(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)
```

**Kotlin**:
```kotlin
fun missingNumber(nums: IntArray): Int {
    val n = nums.size
    return n * (n + 1) / 2 - nums.sum()
}
```

### 57. First Bad Version (LC #278)
**Hint**: Binary search for first true.

**Python**:
```python
def firstBadVersion(n):
    l, r = 1, n
    while l < r:
        mid = l + (r - l) // 2
        if isBadVersion(mid):
            r = mid
        else:
            l = mid + 1
    return l
```

**Kotlin**:
```kotlin
fun firstBadVersion(n: Int): Int {
    var l = 1
    var r = n
    while (l < r) {
        val mid = l + (r - l) / 2
        if (isBadVersion(mid)) r = mid
        else l = mid + 1
    }
    return l
}
```

### 58. Move Zeroes (LC #283)
**Hint**: Two pointers, move non-zeros forward.

**Python**:
```python
def moveZeroes(nums):
    i = 0
    for j in range(len(nums)):
        if nums[j] != 0:
            nums[i], nums[j] = nums[j], nums[i]
            i += 1
```

**Kotlin**:
```kotlin
fun moveZeroes(nums: IntArray) {
    var i = 0
    for (j in nums.indices) {
        if (nums[j] != 0) {
            nums[i] = nums[j].also { nums[j] = nums[i] }
            i++
        }
    }
}
```

### 59. Word Pattern (LC #290)
**Hint**: Bidirectional mapping check.

**Python**:
```python
def wordPattern(pattern, s):
    words = s.split()
    return len(pattern) == len(words) and len(set(pattern)) == len(set(words)) == len(set(zip(pattern, words)))
```

**Kotlin**:
```kotlin
fun wordPattern(pattern: String, s: String): Boolean {
    val words = s.split(" ")
    return pattern.length == words.size && 
           pattern.toSet().size == words.toSet().size && 
           pattern.zip(words).toSet().size == pattern.toSet().size
}
```

### 60. Nim Game (LC #292)
**Hint**: Lose if n % 4 == 0.

**Python**:
```python
def canWinNim(n):
    return n % 4 != 0
```

**Kotlin**:
```kotlin
fun canWinNim(n: Int): Boolean {
    return n % 4 != 0
}
```

### 61. Range Sum Query - Immutable (LC #303)
**Hint**: Prefix sum array.

**Python**:
```python
class NumArray:
    def __init__(self, nums):
        self.prefix = [0]
        for n in nums:
            self.prefix.append(self.prefix[-1] + n)
    
    def sumRange(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]
```

**Kotlin**:
```kotlin
class NumArray(nums: IntArray) {
    private val prefix = IntArray(nums.size + 1)
    
    init {
        for (i in nums.indices) {
            prefix[i + 1] = prefix[i] + nums[i]
        }
    }
    
    fun sumRange(left: Int, right: Int): Int {
        return prefix[right + 1] - prefix[left]
    }
}
```

### 62. Power of Three (LC #326)
**Hint**: Loop division or log check.

**Python**:
```python
def isPowerOfThree(n):
    if n <= 0: return False
    while n % 3 == 0:
        n //= 3
    return n == 1
```

**Kotlin**:
```kotlin
fun isPowerOfThree(n: Int): Boolean {
    if (n <= 0) return false
    var num = n
    while (num % 3 == 0) num /= 3
    return num == 1
}
```

### 63. Reverse String (LC #344)
**Hint**: Two pointers swap.

**Python**:
```python
def reverseString(s):
    l, r = 0, len(s) - 1
    while l < r:
        s[l], s[r] = s[r], s[l]
        l += 1
        r -= 1
```

**Kotlin**:
```kotlin
fun reverseString(s: CharArray) {
    var l = 0
    var r = s.size - 1
    while (l < r) {
        s[l] = s[r].also { s[r] = s[l] }
        l++
        r--
    }
}
```

### 64. Reverse Vowels of a String (LC #345)
**Hint**: Two pointers, swap only vowels.

**Python**:
```python
def reverseVowels(s):
    vowels = set('aeiouAEIOU')
    s = list(s)
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] not in vowels:
            l += 1
        elif s[r] not in vowels:
            r -= 1
        else:
            s[l], s[r] = s[r], s[l]
            l += 1
            r -= 1
    return ''.join(s)
```

**Kotlin**:
```kotlin
fun reverseVowels(s: String): String {
    val vowels = setOf('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U')
    val arr = s.toCharArray()
    var l = 0
    var r = arr.size - 1
    while (l < r) {
        if (arr[l] !in vowels) l++
        else if (arr[r] !in vowels) r--
        else {
            arr[l] = arr[r].also { arr[r] = arr[l] }
            l++
            r--
        }
    }
    return String(arr)
}
```

### 65. Intersection of Two Arrays (LC #349)
**Hint**: Use sets for intersection.

**Python**:
```python
def intersection(nums1, nums2):
    return list(set(nums1) & set(nums2))
```

**Kotlin**:
```kotlin
fun intersection(nums1: IntArray, nums2: IntArray): IntArray {
    return nums1.toSet().intersect(nums2.toSet()).toIntArray()
}
```

### 66. Intersection of Two Arrays II (LC #350)
**Hint**: Use frequency map.

**Python**:
```python
def intersect(nums1, nums2):
    from collections import Counter
    c1 = Counter(nums1)
    res = []
    for n in nums2:
        if c1[n] > 0:
            res.append(n)
            c1[n] -= 1
    return res
```

**Kotlin**:
```kotlin
fun intersect(nums1: IntArray, nums2: IntArray): IntArray {
    val map = mutableMapOf<Int, Int>()
    nums1.forEach { map[it] = map.getOrDefault(it, 0) + 1 }
    val res = mutableListOf<Int>()
    for (n in nums2) {
        if (map.getOrDefault(n, 0) > 0) {
            res.add(n)
            map[n] = map[n]!! - 1
        }
    }
    return res.toIntArray()
}
```

### 67. Valid Perfect Square (LC #367)
**Hint**: Binary search.

**Python**:
```python
def isPerfectSquare(num):
    l, r = 1, num
    while l <= r:
        mid = (l + r) // 2
        sq = mid * mid
        if sq == num:
            return True
        elif sq < num:
            l = mid + 1
        else:
            r = mid - 1
    return False
```

**Kotlin**:
```kotlin
fun isPerfectSquare(num: Int): Boolean {
    var l = 1L
    var r = num.toLong()
    while (l <= r) {
        val mid = l + (r - l) / 2
        val sq = mid * mid
        when {
            sq == num.toLong() -> return true
            sq < num -> l = mid + 1
            else -> r = mid - 1
        }
    }
    return false
}
```

### 68. Sum of Two Integers (LC #371)
**Hint**: Use XOR for sum, AND for carry.

**Python**:
```python
def getSum(a, b):
    mask = 0xFFFFFFFF
    while b != 0:
        a, b = (a ^ b) & mask, ((a & b) << 1) & mask
    return a if a < 0x80000000 else ~(a ^ mask)
```

**Kotlin**:
```kotlin
fun getSum(a: Int, b: Int): Int {
    var x = a
    var y = b
    while (y != 0) {
        val temp = x xor y
        y = (x and y) shl 1
        x = temp
    }
    return x
}
```

### 69. Ransom Note (LC #383)
**Hint**: Count characters in magazine.

**Python**:
```python
def canConstruct(ransomNote, magazine):
    from collections import Counter
    c = Counter(magazine)
    for ch in ransomNote:
        if c[ch] <= 0:
            return False
        c[ch] -= 1
    return True
```

**Kotlin**:
```kotlin
fun canConstruct(ransomNote: String, magazine: String): Boolean {
    val map = mutableMapOf<Char, Int>()
    magazine.forEach { map[it] = map.getOrDefault(it, 0) + 1 }
    for (ch in ransomNote) {
        if (map.getOrDefault(ch, 0) <= 0) return false
        map[ch] = map[ch]!! - 1
    }
    return true
}
```

### 70. Find the Difference (LC #389)
**Hint**: XOR all characters.

**Python**:
```python
def findTheDifference(s, t):
    res = 0
    for c in s + t:
        res ^= ord(c)
    return chr(res)
```

**Kotlin**:
```kotlin
fun findTheDifference(s: String, t: String): Char {
    var res = 0
    for (c in s + t) res = res xor c.code
    return res.toChar()
}
```

### 71. Is Subsequence (LC #392)
**Hint**: Two pointers.

**Python**:
```python
def isSubsequence(s, t):
    i = 0
    for c in t:
        if i < len(s) and s[i] == c:
            i += 1
    return i == len(s)
```

**Kotlin**:
```kotlin
fun isSubsequence(s: String, t: String): Boolean {
    var i = 0
    for (c in t) {
        if (i < s.length && s[i] == c) i++
    }
    return i == s.length
}
```

### 72. Sum of Left Leaves (LC #404)
**Hint**: DFS with parent info.

**Python**:
```python
def sumOfLeftLeaves(root):
    if not root: return 0
    res = 0
    if root.left and not root.left.left and not root.left.right:
        res += root.left.val
    return res + sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right)
```

**Kotlin**:
```kotlin
fun sumOfLeftLeaves(root: TreeNode?): Int {
    if (root == null) return 0
    var res = 0
    if (root.left != null && root.left!!.left == null && root.left!!.right == null) {
        res += root.left!!.`val`
    }
    return res + sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right)
}
```

### 73. Convert a Number to Hexadecimal (LC #405)
**Hint**: Process 4 bits at a time.

**Python**:
```python
def toHex(num):
    if num == 0: return '0'
    if num < 0: num += 2**32
    hex_chars = '0123456789abcdef'
    res = []
    while num:
        res.append(hex_chars[num % 16])
        num //= 16
    return ''.join(reversed(res))
```

**Kotlin**:
```kotlin
fun toHex(num: Int): String {
    if (num == 0) return "0"
    val hexChars = "0123456789abcdef"
    var n = num.toLong()
    if (n < 0) n += (1L shl 32)
    val res = StringBuilder()
    while (n > 0) {
        res.append(hexChars[(n % 16).toInt()])
        n /= 16
    }
    return res.reverse().toString()
}
```

### 74. Longest Palindrome (LC #409)
**Hint**: Count pairs, add one odd if exists.

**Python**:
```python
def longestPalindrome(s):
    from collections import Counter
    counts = Counter(s).values()
    return sum(c // 2 * 2 for c in counts) + any(c % 2 for c in counts)
```

**Kotlin**:
```kotlin
fun longestPalindrome(s: String): Int {
    val map = mutableMapOf<Char, Int>()
    s.forEach { map[it] = map.getOrDefault(it, 0) + 1 }
    var res = map.values.sumOf { it / 2 * 2 }
    if (map.values.any { it % 2 == 1 }) res++
    return res
}
```

### 75. Fizz Buzz (LC #412)
**Hint**: Check divisibility by 3 and 5.

**Python**:
```python
def fizzBuzz(n):
    res = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            res.append("FizzBuzz")
        elif i % 3 == 0:
            res.append("Fizz")
        elif i % 5 == 0:
            res.append("Buzz")
        else:
            res.append(str(i))
    return res
```

**Kotlin**:
```kotlin
fun fizzBuzz(n: Int): List<String> {
    return (1..n).map {
        when {
            it % 15 == 0 -> "FizzBuzz"
            it % 3 == 0 -> "Fizz"
            it % 5 == 0 -> "Buzz"
            else -> it.toString()
        }
    }
}
```

### 76. Third Maximum Number (LC #414)
**Hint**: Track top 3 distinct values.

**Python**:
```python
def thirdMax(nums):
    top = []
    for n in nums:
        if n not in top:
            top.append(n)
            top.sort(reverse=True)
            if len(top) > 3:
                top.pop()
    return top[2] if len(top) == 3 else top[0]
```

**Kotlin**:
```kotlin
fun thirdMax(nums: IntArray): Int {
    val top = mutableSetOf<Int>()
    for (n in nums) {
        top.add(n)
        if (top.size > 3) {
            top.remove(top.minOrNull()!!)
        }
    }
    return if (top.size == 3) top.minOrNull()!! else top.maxOrNull()!!
}
```

### 77. Add Strings (LC #415)
**Hint**: Add digit by digit with carry.

**Python**:
```python
def addStrings(num1, num2):
    res = []
    carry = 0
    i, j = len(num1) - 1, len(num2) - 1
    while i >= 0 or j >= 0 or carry:
        n1 = int(num1[i]) if i >= 0 else 0
        n2 = int(num2[j]) if j >= 0 else 0
        total = n1 + n2 + carry
        res.append(str(total % 10))
        carry = total // 10
        i -= 1
        j -= 1
    return ''.join(reversed(res))
```

**Kotlin**:
```kotlin
fun addStrings(num1: String, num2: String): String {
    val res = StringBuilder()
    var carry = 0
    var i = num1.length - 1
    var j = num2.length - 1
    while (i >= 0 || j >= 0 || carry > 0) {
        val n1 = if (i >= 0) num1[i--] - '0' else 0
        val n2 = if (j >= 0) num2[j--] - '0' else 0
        val total = n1 + n2 + carry
        res.append(total % 10)
        carry = total / 10
    }
    return res.reverse().toString()
}
```

### 78. Number of Segments in a String (LC #434)
**Hint**: Split and count non-empty.

**Python**:
```python
def countSegments(s):
    return len(s.split())
```

**Kotlin**:
```kotlin
fun countSegments(s: String): Int {
    return s.split(" ").count { it.isNotEmpty() }
}
```

### 79. Arranging Coins (LC #441)
**Hint**: Binary search or math formula.

**Python**:
```python
def arrangeCoins(n):
    l, r = 0, n
    while l <= r:
        mid = (l + r) // 2
        total = mid * (mid + 1) // 2
        if total == n:
            return mid
        elif total < n:
            l = mid + 1
        else:
            r = mid - 1
    return r
```

**Kotlin**:
```kotlin
fun arrangeCoins(n: Int): Int {
    var l = 0L
    var r = n.toLong()
    while (l <= r) {
        val mid = l + (r - l) / 2
        val total = mid * (mid + 1) / 2
        when {
            total == n.toLong() -> return mid.toInt()
            total < n -> l = mid + 1
            else -> r = mid - 1
        }
    }
    return r.toInt()
}
```

### 80. Find All Numbers Disappeared in an Array (LC #448)
**Hint**: Mark indices as negative.

**Python**:
```python
def findDisappearedNumbers(nums):
    for n in nums:
        idx = abs(n) - 1
        nums[idx] = -abs(nums[idx])
    return [i + 1 for i in range(len(nums)) if nums[i] > 0]
```

**Kotlin**:
```kotlin
fun findDisappearedNumbers(nums: IntArray): List<Int> {
    for (n in nums) {
        val idx = kotlin.math.abs(n) - 1
        nums[idx] = -kotlin.math.abs(nums[idx])
    }
    return nums.indices.filter { nums[it] > 0 }.map { it + 1 }
}
```

