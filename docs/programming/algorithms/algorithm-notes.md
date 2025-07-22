# 算法笔记 ⚡

记录常用算法的思路、实现和应用场景，建立算法知识体系。

## 🔍 搜索算法

### 二分搜索 (Binary Search)
在有序数组中高效查找目标值。

```python
def binary_search(arr, target):
    """
    二分搜索 - O(log n)
    前提：数组必须有序
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # 避免溢出
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # 未找到

# 变形：查找插入位置
def search_insert_position(arr, target):
    """查找目标值应该插入的位置"""
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left

# 测试
nums = [1, 3, 5, 6]
print(binary_search(nums, 5))           # 2
print(search_insert_position(nums, 4))  # 2
```

## 📊 排序算法

### 快速排序 (Quick Sort)
分治思想的典型应用。

```python
def quick_sort(arr):
    """快速排序 - 平均O(n log n)，最坏O(n²)"""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# 测试
test_arr = [64, 34, 25, 12, 22, 11, 90]
print("原数组:", test_arr)
sorted_arr = quick_sort(test_arr.copy())
print("快排结果:", sorted_arr)
```

## 🎯 动态规划

### 斐波那契数列
经典的动态规划入门题目。

```python
def fibonacci_dp(n):
    """动态规划求斐波那契数 - O(n)时间，O(1)空间"""
    if n <= 1:
        return n
    
    prev, curr = 0, 1
    
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    
    return curr

# 测试
for i in range(10):
    print(f"F({i}) = {fibonacci_dp(i)}")
```

### 背包问题
0-1背包是动态规划的经典问题。

```python
def knapsack_01(weights, values, capacity):
    """
    0-1背包问题
    weights: 物品重量列表
    values: 物品价值列表
    capacity: 背包容量
    """
    n = len(weights)
    # dp[i][w] 表示前i个物品，背包容量为w时的最大价值
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # 不选择第i个物品
            dp[i][w] = dp[i-1][w]
            
            # 选择第i个物品（如果放得下）
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], 
                             dp[i-1][w - weights[i-1]] + values[i-1])
    
    return dp[n][capacity]

# 测试
weights = [2, 1, 3, 2]
values = [12, 10, 20, 15]
capacity = 5
print(f"最大价值: {knapsack_01(weights, values, capacity)}")
```

## 🎨 算法技巧

### 双指针技术
用于数组和字符串问题的高效技巧。

```python
def two_sum_sorted(arr, target):
    """有序数组中找两数之和 - O(n)"""
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]  # 未找到

def reverse_string(s):
    """双指针反转字符串"""
    chars = list(s)
    left, right = 0, len(chars) - 1
    
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    
    return ''.join(chars)

# 测试
print(two_sum_sorted([2, 7, 11, 15], 9))  # [0, 1]
print(reverse_string("hello"))             # "olleh"
```

### 滑动窗口
处理子数组/子字符串问题的有效方法。

```python
def max_sum_subarray(arr, k):
    """固定大小k的子数组最大和"""
    if len(arr) < k:
        return -1
    
    # 计算第一个窗口的和
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # 滑动窗口
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

def longest_substring_k_distinct(s, k):
    """最多包含k个不同字符的最长子串"""
    if not s or k == 0:
        return 0
    
    char_count = {}
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # 扩展窗口
        char_count[s[right]] = char_count.get(s[right], 0) + 1
        
        # 收缩窗口直到满足条件
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length

# 测试
print(max_sum_subarray([1, 4, 2, 1, 8, 3], 3))  # 11 (2+1+8)
print(longest_substring_k_distinct("eceba", 2))   # 3 ("ece")
```

## 💡 算法思维训练

### 分治法
将大问题分解为小问题求解。

```python
def merge_sort(arr):
    """归并排序 - O(n log n)"""
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    """合并两个有序数组"""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### 贪心算法
每一步都做局部最优选择。

```python
def activity_selection(starts, ends):
    """活动选择问题 - 贪心算法"""
    n = len(starts)
    activities = list(zip(starts, ends, range(n)))
    
    # 按结束时间排序
    activities.sort(key=lambda x: x[1])
    
    selected = [activities[0][2]]  # 选择第一个活动
    last_end_time = activities[0][1]
    
    for start, end, idx in activities[1:]:
        if start >= last_end_time:
            selected.append(idx)
            last_end_time = end
    
    return selected

# 测试
starts = [1, 3, 0, 5, 8, 5]
ends = [2, 4, 6, 7, 9, 9]
print("选择的活动:", activity_selection(starts, ends))
```

## 📈 复杂度分析技巧

### 常见复杂度类型
```python
# O(1) - 常数时间
def get_first_element(arr):
    return arr[0] if arr else None

# O(log n) - 对数时间
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = left + (right - left) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# O(n) - 线性时间
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# O(n log n) - 线性对数时间
# 如：归并排序、快速排序（平均情况）

# O(n²) - 平方时间
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr
```

## 🎯 面试高频题目

### 1. 两数之和
```python
def two_sum(nums, target):
    """两数之和 - 哈希表解法 O(n)"""
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    
    return []
```

### 2. 反转链表
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    """反转链表 - 迭代解法"""
    prev = None
    current = head
    
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    return prev
```

### 3. 最大子数组和
```python
def max_subarray(nums):
    """最大子数组和 - Kadane算法 O(n)"""
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum
```

## 💡 学习建议

### 刷题策略
1. **由易到难** - 从简单题目开始建立信心
2. **分类练习** - 按数据结构和算法类型分组练习
3. **重复练习** - 对经典题目要反复练习直到熟练
4. **总结模式** - 归纳同类问题的解题模式
5. **时间限制** - 模拟面试环境，限时完成

### 代码模板
```python
def solve_problem(input_data):
    """
    解题模板：
    1. 理解题意 - 明确输入输出要求
    2. 分析复杂度 - 时间和空间复杂度要求
    3. 选择算法 - 根据数据规模选择合适算法
    4. 编写代码 - 实现核心逻辑
    5. 测试验证 - 边界情况和极值测试
    """
    
    # 边界处理
    if not input_data:
        return None
    
    # 核心算法逻辑
    result = process_data(input_data)
    
    # 返回结果
    return result

def process_data(data):
    # 具体实现
    pass
```

---

*算法是编程的灵魂，通过不断练习和思考，你将掌握解决复杂问题的能力！*
