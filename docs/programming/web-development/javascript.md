# JavaScript 编程 ⚡

JavaScript是Web开发的核心技术，为网页添加动态交互功能。

## 🚀 JavaScript基础

### 变量与数据类型
```javascript
// 变量声明
let name = "Samuel";
const age = 25;
var city = "Beijing"; // 不推荐使用var

// 数据类型
let number = 42;           // 数字
let string = "Hello";      // 字符串
let boolean = true;        // 布尔值
let array = [1, 2, 3];     // 数组
let object = {             // 对象
  name: "Samuel",
  age: 25
};
let nothing = null;        // 空值
let undefined_var;         // undefined
```

### 函数定义
```javascript
// 函数声明
function greet(name) {
  return `Hello, ${name}!`;
}

// 箭头函数
const add = (a, b) => a + b;

// 函数表达式
const multiply = function(a, b) {
  return a * b;
};

// 使用示例
console.log(greet("World"));  // Hello, World!
console.log(add(5, 3));       // 8
console.log(multiply(4, 7));  // 28
```

## 🎯 DOM操作

### 元素选择与修改
```javascript
// 选择元素
const title = document.getElementById('title');
const buttons = document.querySelectorAll('.button');
const firstParagraph = document.querySelector('p');

// 修改内容
title.textContent = '新标题';
title.innerHTML = '<strong>粗体标题</strong>';

// 修改样式
title.style.color = 'blue';
title.style.fontSize = '24px';

// 添加类名
title.classList.add('highlight');
title.classList.remove('old-style');
title.classList.toggle('active');
```

### 事件处理
```javascript
// 点击事件
const button = document.querySelector('#myButton');
button.addEventListener('click', function() {
  alert('按钮被点击了！');
});

// 表单提交
const form = document.querySelector('#myForm');
form.addEventListener('submit', function(e) {
  e.preventDefault(); // 阻止默认提交
  const formData = new FormData(form);
  console.log('表单数据:', Object.fromEntries(formData));
});

// 键盘事件
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    console.log('回车键被按下');
  }
});
```

## 📊 实用示例

### 动态列表管理
```javascript
class TodoList {
  constructor() {
    this.todos = [];
    this.container = document.querySelector('#todoContainer');
    this.input = document.querySelector('#todoInput');
    this.addButton = document.querySelector('#addButton');
    
    this.bindEvents();
  }
  
  bindEvents() {
    this.addButton.addEventListener('click', () => this.addTodo());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.addTodo();
    });
  }
  
  addTodo() {
    const text = this.input.value.trim();
    if (!text) return;
    
    const todo = {
      id: Date.now(),
      text: text,
      completed: false
    };
    
    this.todos.push(todo);
    this.render();
    this.input.value = '';
  }
  
  removeTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.render();
  }
  
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.render();
    }
  }
  
  render() {
    this.container.innerHTML = '';
    
    this.todos.forEach(todo => {
      const todoElement = document.createElement('div');
      todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      
      todoElement.innerHTML = `
        <span class="todo-text">${todo.text}</span>
        <button onclick="todoApp.toggleTodo(${todo.id})">
          ${todo.completed ? '✓' : '○'}
        </button>
        <button onclick="todoApp.removeTodo(${todo.id})">删除</button>
      `;
      
      this.container.appendChild(todoElement);
    });
  }
}

// 初始化应用
const todoApp = new TodoList();
```

### 异步数据获取
```javascript
// 使用 fetch API
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const userData = await response.json();
    displayUserData(userData);
    
  } catch (error) {
    console.error('获取用户数据失败:', error);
    showErrorMessage('无法加载用户数据');
  }
}

function displayUserData(user) {
  const userContainer = document.querySelector('#userInfo');
  userContainer.innerHTML = `
    <h3>${user.name}</h3>
    <p>邮箱: ${user.email}</p>
    <p>注册时间: ${new Date(user.createdAt).toLocaleDateString()}</p>
  `;
}
```

## 🎨 现代JavaScript特性

### ES6+语法糖
```javascript
// 解构赋值
const user = { name: 'Samuel', age: 25, city: 'Beijing' };
const { name, age } = user;

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

// 模板字符串
const message = `用户 ${name} 今年 ${age} 岁，来自 ${user.city}`;

// 扩展运算符
const newNumbers = [...numbers, 6, 7, 8];
const userCopy = { ...user, email: 'samuel@example.com' };

// 可选链操作符
const email = user?.contact?.email ?? '未提供邮箱';

// 数组方法
const evenNumbers = numbers.filter(n => n % 2 === 0);
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);
```

### 模块系统
```javascript
// math.js - 导出模块
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export default function calculate(operation, a, b) {
  switch(operation) {
    case 'add': return add(a, b);
    case 'multiply': return multiply(a, b);
    default: throw new Error('Unsupported operation');
  }
}

// app.js - 导入使用
import calculate, { PI, add } from './math.js';

console.log(PI);              // 3.14159
console.log(add(5, 3));       // 8
console.log(calculate('multiply', 4, 7)); // 28
```

## 🛠️ 调试技巧

### 控制台调试
```javascript
// 基本输出
console.log('普通消息');
console.warn('警告消息');
console.error('错误消息');

// 对象输出
console.table(users); // 表格形式显示数组/对象
console.group('用户信息');
console.log('姓名:', user.name);
console.log('年龄:', user.age);
console.groupEnd();

// 性能测试
console.time('计算时间');
// 执行一些操作
console.timeEnd('计算时间');

// 断点调试
debugger; // 代码执行到此处会暂停
```

### 错误处理
```javascript
function safeJSONParse(jsonString) {
  try {
    return {
      success: true,
      data: JSON.parse(jsonString)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// 使用示例
const result = safeJSONParse('{"name": "Samuel"}');
if (result.success) {
  console.log('解析成功:', result.data);
} else {
  console.log('解析失败:', result.error);
}
```

## 💡 最佳实践

### 代码组织
```javascript
// 使用命名空间避免全局污染
const MyApp = {
  config: {
    apiUrl: '/api',
    version: '1.0.0'
  },
  
  utils: {
    formatDate: (date) => new Date(date).toLocaleDateString(),
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  },
  
  init() {
    console.log('应用初始化完成');
  }
};

// 初始化应用
MyApp.init();
```

---

*JavaScript是Web开发的核心技术，掌握它将为你打开前端开发的大门！*
