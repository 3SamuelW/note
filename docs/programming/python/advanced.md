# Python进阶 🚀

深入学习Python的高级特性，提升编程能力。

## 🎯 面向对象编程

### 类和对象
```python
class Student:
    """学生类"""
    
    def __init__(self, name, age, student_id):
        self.name = name
        self.age = age
        self.student_id = student_id
        self.courses = []
    
    def add_course(self, course):
        """添加课程"""
        self.courses.append(course)
    
    def get_info(self):
        """获取学生信息"""
        return f"学生：{self.name}，年龄：{self.age}，学号：{self.student_id}"

# 创建对象
student1 = Student("Alice", 20, "S001")
student1.add_course("Python编程")
print(student1.get_info())
```

### 继承
```python
class Person:
    """人员基类"""
    
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"我是{self.name}，{self.age}岁"

class Teacher(Person):
    """教师类 - 继承自Person"""
    
    def __init__(self, name, age, subject):
        super().__init__(name, age)
        self.subject = subject
    
    def introduce(self):
        return f"我是{self.name}老师，教{self.subject}，{self.age}岁"

# 使用继承
teacher = Teacher("王老师", 35, "Python")
print(teacher.introduce())
```

## 📦 模块和包

### 自定义模块
```python
# math_utils.py
def add(a, b):
    """加法"""
    return a + b

def multiply(a, b):
    """乘法"""
    return a * b

PI = 3.14159

# 使用模块
import math_utils

result = math_utils.add(5, 3)
print(f"π的值：{math_utils.PI}")
```

### 常用内置模块
```python
import datetime
import random
import os

# 日期时间
now = datetime.datetime.now()
print(f"当前时间：{now}")

# 随机数
random_num = random.randint(1, 100)
print(f"随机数：{random_num}")

# 系统操作
current_dir = os.getcwd()
print(f"当前目录：{current_dir}")
```

## ⚠️ 异常处理

### 基本异常处理
```python
def divide(a, b):
    """安全除法"""
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("错误：除数不能为0")
        return None
    except TypeError:
        print("错误：参数类型不正确")
        return None
    finally:
        print("除法操作完成")

# 测试异常处理
print(divide(10, 2))   # 正常情况
print(divide(10, 0))   # 除零错误
print(divide("10", 2)) # 类型错误
```

### 自定义异常
```python
class InvalidScoreError(Exception):
    """自定义异常：无效成绩"""
    pass

def validate_score(score):
    """验证成绩有效性"""
    if not isinstance(score, (int, float)):
        raise InvalidScoreError("成绩必须是数字")
    if score < 0 or score > 100:
        raise InvalidScoreError("成绩必须在0-100之间")
    return True

# 使用自定义异常
try:
    validate_score(105)
except InvalidScoreError as e:
    print(f"成绩验证失败：{e}")
```

## 🔧 高级特性

### 装饰器
```python
def timer(func):
    """计时装饰器"""
    import time
    
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行时间：{end - start:.4f}秒")
        return result
    
    return wrapper

@timer
def slow_function():
    """模拟耗时操作"""
    import time
    time.sleep(1)
    return "完成"

# 使用装饰器
result = slow_function()
```

### 生成器
```python
def fibonacci_generator(n):
    """斐波那契数列生成器"""
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

# 使用生成器
for num in fibonacci_generator(10):
    print(num, end=' ')
print()
```

### 上下文管理器
```python
class FileManager:
    """文件管理器上下文管理器"""
    
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        print(f"打开文件：{self.filename}")
        self.file = open(self.filename, self.mode, encoding='utf-8')
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"关闭文件：{self.filename}")
        if self.file:
            self.file.close()

# 使用上下文管理器
with FileManager('test.txt', 'w') as f:
    f.write('Hello, Python!')
```

## 📚 常用第三方库

### requests - HTTP请求
```python
import requests

try:
    response = requests.get('https://api.github.com/users/octocat')
    if response.status_code == 200:
        data = response.json()
        print(f"用户名：{data['name']}")
    else:
        print(f"请求失败：{response.status_code}")
except requests.RequestException as e:
    print(f"请求异常：{e}")
```

### json - JSON处理
```python
import json

# Python对象转JSON
data = {
    "name": "Samuel",
    "age": 25,
    "courses": ["Python", "JavaScript"]
}

json_str = json.dumps(data, ensure_ascii=False, indent=2)
print("JSON字符串：")
print(json_str)

# JSON转Python对象
parsed_data = json.loads(json_str)
print(f"姓名：{parsed_data['name']}")
```

## 💡 最佳实践

### 代码风格 (PEP 8)
```python
# 好的代码风格
class StudentManager:
    """学生管理器"""
    
    def __init__(self):
        self.students = []
    
    def add_student(self, name, age):
        """添加学生"""
        student = {
            'name': name,
            'age': age,
            'id': len(self.students) + 1
        }
        self.students.append(student)
        return student['id']
    
    def get_student(self, student_id):
        """获取学生信息"""
        for student in self.students:
            if student['id'] == student_id:
                return student
        return None
```

---

*掌握这些进阶特性，你的Python技能将上升一个层次！*
