# 数据结构 🗃️

数据结构是计算机存储和组织数据的方式，选择合适的数据结构能大幅提升程序效率。

## 📋 线性数据结构

### 数组 (Array)
数组是最基础的数据结构，元素在内存中连续存储。

```python
class Array:
    def __init__(self, capacity):
        self.data = [None] * capacity
        self.size = 0
        self.capacity = capacity
    
    def get(self, index):
        """获取指定位置的元素 - O(1)"""
        if 0 <= index < self.size:
            return self.data[index]
        raise IndexError("Index out of range")
    
    def set(self, index, value):
        """设置指定位置的元素 - O(1)"""
        if 0 <= index < self.size:
            self.data[index] = value
        else:
            raise IndexError("Index out of range")
    
    def insert(self, index, value):
        """在指定位置插入元素 - O(n)"""
        if self.size >= self.capacity:
            raise OverflowError("Array is full")
        
        if index < 0 or index > self.size:
            raise IndexError("Index out of range")
        
        # 后移元素
        for i in range(self.size, index, -1):
            self.data[i] = self.data[i-1]
        
        self.data[index] = value
        self.size += 1
    
    def delete(self, index):
        """删除指定位置的元素 - O(n)"""
        if index < 0 or index >= self.size:
            raise IndexError("Index out of range")
        
        # 前移元素
        for i in range(index, self.size - 1):
            self.data[i] = self.data[i + 1]
        
        self.size -= 1
        return self.data[index]

# 使用示例
arr = Array(5)
arr.insert(0, 10)
arr.insert(1, 20)
arr.insert(2, 30)
print(f"数组大小: {arr.size}")  # 3
print(f"第一个元素: {arr.get(0)}")  # 10
```

### 链表 (Linked List)
链表通过指针连接节点，支持动态大小。

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    
    def add_first(self, val):
        """在头部添加节点 - O(1)"""
        new_node = ListNode(val)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
    
    def add_last(self, val):
        """在尾部添加节点 - O(n)"""
        new_node = ListNode(val)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        self.size += 1
    
    def remove(self, val):
        """删除指定值的节点 - O(n)"""
        if not self.head:
            return False
        
        if self.head.val == val:
            self.head = self.head.next
            self.size -= 1
            return True
        
        current = self.head
        while current.next and current.next.val != val:
            current = current.next
        
        if current.next:
            current.next = current.next.next
            self.size -= 1
            return True
        
        return False
    
    def find(self, val):
        """查找指定值的节点 - O(n)"""
        current = self.head
        while current:
            if current.val == val:
                return True
            current = current.next
        return False
    
    def to_list(self):
        """转换为Python列表"""
        result = []
        current = self.head
        while current:
            result.append(current.val)
            current = current.next
        return result

# 使用示例
ll = LinkedList()
ll.add_first(1)
ll.add_last(2)
ll.add_last(3)
print(ll.to_list())  # [1, 2, 3]
print(ll.find(2))    # True
ll.remove(2)
print(ll.to_list())  # [1, 3]
```

### 栈 (Stack)
栈是后进先出(LIFO)的数据结构。

```python
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        """入栈 - O(1)"""
        self.items.append(item)
    
    def pop(self):
        """出栈 - O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items.pop()
    
    def peek(self):
        """查看栈顶元素 - O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]
    
    def is_empty(self):
        """判断栈是否为空 - O(1)"""
        return len(self.items) == 0
    
    def size(self):
        """获取栈的大小 - O(1)"""
        return len(self.items)

# 应用示例：括号匹配
def is_valid_parentheses(s):
    """检查括号是否匹配"""
    stack = Stack()
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if stack.is_empty() or stack.pop() != mapping[char]:
                return False
        else:
            stack.push(char)
    
    return stack.is_empty()

# 测试
print(is_valid_parentheses("()[]{}"))  # True
print(is_valid_parentheses("([)]"))    # False
```

### 队列 (Queue)
队列是先进先出(FIFO)的数据结构。

```python
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        """入队 - O(1)"""
        self.items.append(item)
    
    def dequeue(self):
        """出队 - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items.popleft()
    
    def front(self):
        """查看队首元素 - O(1)"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]
    
    def is_empty(self):
        """判断队列是否为空 - O(1)"""
        return len(self.items) == 0
    
    def size(self):
        """获取队列大小 - O(1)"""
        return len(self.items)

# 应用示例：广度优先搜索
def bfs_traversal(graph, start):
    """图的广度优先遍历"""
    visited = set()
    queue = Queue()
    result = []
    
    queue.enqueue(start)
    visited.add(start)
    
    while not queue.is_empty():
        node = queue.dequeue()
        result.append(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)
    
    return result
```

## 🌳 非线性数据结构

### 二叉树 (Binary Tree)
树是层次化的数据结构，二叉树是最常用的树结构。

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        """插入节点（以BST方式）"""
        self.root = self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if not node:
            return TreeNode(val)
        
        if val < node.val:
            node.left = self._insert_recursive(node.left, val)
        else:
            node.right = self._insert_recursive(node.right, val)
        
        return node
    
    def inorder_traversal(self):
        """中序遍历 - 递归版本"""
        result = []
        self._inorder_recursive(self.root, result)
        return result
    
    def _inorder_recursive(self, node, result):
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.val)
            self._inorder_recursive(node.right, result)
    
    def preorder_traversal(self):
        """前序遍历 - 迭代版本"""
        if not self.root:
            return []
        
        result = []
        stack = [self.root]
        
        while stack:
            node = stack.pop()
            result.append(node.val)
            
            # 注意：先添加右子树，再添加左子树
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        
        return result
    
    def level_order_traversal(self):
        """层序遍历"""
        if not self.root:
            return []
        
        result = []
        queue = Queue()
        queue.enqueue(self.root)
        
        while not queue.is_empty():
            node = queue.dequeue()
            result.append(node.val)
            
            if node.left:
                queue.enqueue(node.left)
            if node.right:
                queue.enqueue(node.right)
        
        return result

# 使用示例
bt = BinaryTree()
for val in [5, 3, 7, 2, 4, 6, 8]:
    bt.insert(val)

print("中序遍历:", bt.inorder_traversal())      # [2, 3, 4, 5, 6, 7, 8]
print("前序遍历:", bt.preorder_traversal())     # [5, 3, 2, 4, 7, 6, 8]
print("层序遍历:", bt.level_order_traversal())  # [5, 3, 7, 2, 4, 6, 8]
```

### 哈希表 (Hash Table)
哈希表通过哈希函数实现快速的插入、删除和查找操作。

```python
class HashTable:
    def __init__(self, capacity=16):
        self.capacity = capacity
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]
    
    def _hash(self, key):
        """哈希函数"""
        return hash(key) % self.capacity
    
    def put(self, key, value):
        """插入键值对 - 平均O(1)"""
        bucket_index = self._hash(key)
        bucket = self.buckets[bucket_index]
        
        # 检查是否已存在该key
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)  # 更新值
                return
        
        # 添加新的键值对
        bucket.append((key, value))
        self.size += 1
        
        # 如果负载因子过高，扩容
        if self.size > self.capacity * 0.75:
            self._resize()
    
    def get(self, key):
        """获取值 - 平均O(1)"""
        bucket_index = self._hash(key)
        bucket = self.buckets[bucket_index]
        
        for k, v in bucket:
            if k == key:
                return v
        
        raise KeyError(f"Key '{key}' not found")
    
    def remove(self, key):
        """删除键值对 - 平均O(1)"""
        bucket_index = self._hash(key)
        bucket = self.buckets[bucket_index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                self.size -= 1
                return v
        
        raise KeyError(f"Key '{key}' not found")
    
    def _resize(self):
        """扩容"""
        old_buckets = self.buckets
        self.capacity *= 2
        self.size = 0
        self.buckets = [[] for _ in range(self.capacity)]
        
        # 重新插入所有键值对
        for bucket in old_buckets:
            for key, value in bucket:
                self.put(key, value)

# 使用示例
ht = HashTable()
ht.put("name", "Samuel")
ht.put("age", 25)
ht.put("city", "Beijing")

print(ht.get("name"))  # Samuel
ht.put("age", 26)      # 更新
print(ht.get("age"))   # 26
```

## 📊 复杂度对比

| 数据结构 | 插入 | 删除 | 查找 | 空间复杂度 |
|----------|------|------|------|------------|
| 数组 | O(n) | O(n) | O(1) | O(n) |
| 链表 | O(1) | O(n) | O(n) | O(n) |
| 栈 | O(1) | O(1) | O(n) | O(n) |
| 队列 | O(1) | O(1) | O(n) | O(n) |
| 二叉搜索树 | O(log n) | O(log n) | O(log n) | O(n) |
| 哈希表 | O(1)* | O(1)* | O(1)* | O(n) |

*平均情况下的时间复杂度

## 💡 选择指南

### 使用场景对比

**数组适用于：**
- 需要随机访问元素
- 内存使用紧凑
- 数据大小相对固定

**链表适用于：**
- 频繁插入删除操作
- 数据大小变化大
- 不需要随机访问

**栈适用于：**
- 函数调用管理
- 表达式求值
- 撤销操作

**队列适用于：**
- 任务调度
- 广度优先搜索
- 缓冲处理

**树适用于：**
- 层次化数据
- 快速搜索
- 范围查询

**哈希表适用于：**
- 快速查找
- 缓存实现
- 去重操作

---

*理解数据结构的特性和适用场景，是写出高效程序的关键！*
