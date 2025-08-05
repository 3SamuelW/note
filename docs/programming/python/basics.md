# Python基础 📖

Python基础语法学习，从最简单的Hello World开始。

## 🚀 快速开始

### Hello World
```python
print("Hello, World!")
print("欢迎学习Python!")
```

## 📊 数据类型

### 基本数据类型
```python
# 数字
age = 25
pi = 3.14159

# 字符串
name = "Samuel"
message = '学习Python很有趣!'

# 布尔值
is_student = True
is_working = False
```

### 集合数据类型
```python
# 列表 - 可变序列
fruits = ["苹果", "香蕉", "橙子"]
numbers = [1, 2, 3, 4, 5]

# 字典 - 键值对
person = {
    "name": "Samuel",
    "age": 25,
    "city": "北京"
}

# 元组 - 不可变序列
coordinates = (10, 20)
```

## 🔄 控制流程

### 条件判断
```python
score = 85

if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

### 循环结构
```python
# for循环
for fruit in fruits:
    print(f"我喜欢{fruit}")

# while循环
count = 0
while count < 5:
    print(f"计数: {count}")
    count += 1
```

## 🔧 函数定义

### 基本函数
```python
def greet(name):
    """问候函数"""
    return f"你好, {name}!"

# 调用函数
message = greet("Samuel")
print(message)
```

### 带默认参数的函数
```python
def introduce(name, age=18, city="北京"):
    """自我介绍函数"""
    return f"我是{name}，今年{age}岁，来自{city}"

print(introduce("Alice"))
print(introduce("Bob", 25, "上海"))
```

## 📝 实用技巧

### 字符串格式化
```python
name = "Python"
version = 3.9

# f-string (推荐)
message = f"我正在学习 {name} {version}"

# format方法
message = "我正在学习 {} {}".format(name, version)
```

### 列表推导式
```python
# 生成平方数列表
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

# 过滤偶数
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]
```

## 🏃 练习题

### 练习1：计算器
```python
def calculator(a, b, operation):
    """简单计算器"""
    if operation == '+':
        return a + b
    elif operation == '-':
        return a - b
    elif operation == '*':
        return a * b
    elif operation == '/':
        return a / b if b != 0 else "除数不能为0"
    else:
        return "不支持的操作"

# 测试
print(calculator(10, 5, '+'))  # 15
print(calculator(10, 5, '/'))  # 2.0
```

### 练习2：成绩统计
```python
def grade_stats(scores):
    """成绩统计函数"""
    if not scores:
        return "无成绩数据"
    
    total = sum(scores)
    average = total / len(scores)
    highest = max(scores)
    lowest = min(scores)
    
    return {
        "总分": total,
        "平均分": round(average, 2),
        "最高分": highest,
        "最低分": lowest
    }

# 测试
scores = [85, 92, 78, 96, 88]
stats = grade_stats(scores)
print(stats)
```

## 💡 学习建议

1. **多练习** - 编程需要大量练习才能熟练
2. **写注释** - 养成写注释的好习惯
3. **阅读错误** - 学会读懂错误信息
4. **查文档** - 遇到问题查阅官方文档

---

*基础扎实，万丈高楼平地起！*
