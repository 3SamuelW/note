# 前端框架学习 🚀

现代前端开发框架让复杂应用的构建变得更加高效和可维护。

## 🎯 框架选择指南

### 主流框架对比

| 框架 | 学习曲线 | 生态系统 | 适用场景 |
|------|----------|----------|----------|
| **React** | 中等 | 非常丰富 | 大型应用、组件库 |
| **Vue.js** | 较易 | 丰富 | 中小型应用、快速开发 |
| **Angular** | 较难 | 完整 | 企业级应用 |

### 选择建议
- **初学者**: 推荐从Vue.js开始
- **React生态**: 适合需要丰富第三方库的项目
- **企业开发**: Angular提供完整的开发体系

## 🌟 Vue.js 入门

### 基本概念
Vue.js是一个渐进式JavaScript框架，易学易用。

```html
<!-- 基本模板 -->
<div id="app">
  <h1>{{ title }}</h1>
  <p>{{ message }}</p>
  <button @click="changeMessage">点击改变消息</button>
</div>

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script>
  const { createApp } = Vue;
  
  createApp({
    data() {
      return {
        title: '我的Vue应用',
        message: '欢迎学习Vue.js!'
      }
    },
    methods: {
      changeMessage() {
        this.message = '消息已改变!';
      }
    }
  }).mount('#app');
</script>
```

### 组件化开发
```javascript
// 子组件
const TodoItem = {
  props: ['todo'],
  emits: ['toggle', 'delete'],
  template: `
    <div class="todo-item" :class="{ completed: todo.completed }">
      <span @click="$emit('toggle', todo.id)">{{ todo.text }}</span>
      <button @click="$emit('delete', todo.id)">删除</button>
    </div>
  `
};

// 父组件
const TodoApp = {
  components: {
    TodoItem
  },
  data() {
    return {
      todos: [
        { id: 1, text: '学习Vue基础', completed: false },
        { id: 2, text: '完成第一个组件', completed: true }
      ],
      newTodo: ''
    }
  },
  methods: {
    addTodo() {
      if (this.newTodo.trim()) {
        this.todos.push({
          id: Date.now(),
          text: this.newTodo,
          completed: false
        });
        this.newTodo = '';
      }
    },
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id);
    }
  },
  template: `
    <div class="todo-app">
      <h1>待办事项</h1>
      <div class="add-todo">
        <input v-model="newTodo" @keyup.enter="addTodo" placeholder="添加新任务">
        <button @click="addTodo">添加</button>
      </div>
      <div class="todo-list">
        <TodoItem 
          v-for="todo in todos" 
          :key="todo.id" 
          :todo="todo"
          @toggle="toggleTodo"
          @delete="deleteTodo"
        />
      </div>
    </div>
  `
};
```

## ⚛️ React 基础

### 函数组件与Hooks
```jsx
import React, { useState, useEffect } from 'react';

// 简单的计数器组件
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `计数: ${count}`;
  }, [count]);
  
  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
      <button onClick={() => setCount(count - 1)}>
        减少
      </button>
      <button onClick={() => setCount(0)}>
        重置
      </button>
    </div>
  );
}

// 用户列表组件
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('获取用户失败');
      const userData = await response.json();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <div>
      <h2>用户列表</h2>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// 用户卡片组件
function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>邮箱: {user.email}</p>
      <p>电话: {user.phone}</p>
    </div>
  );
}
```

### 状态管理（Context API）
```jsx
import React, { createContext, useContext, useReducer } from 'react';

// 创建Context
const AppContext = createContext();

// Reducer函数
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    default:
      return state;
  }
}

// Provider组件
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    notifications: []
  });
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook for using context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// 使用Context的组件
function Header() {
  const { state, dispatch } = useApp();
  
  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };
  
  return (
    <header className={`header ${state.theme}`}>
      <h1>我的应用</h1>
      {state.user && <span>欢迎, {state.user.name}!</span>}
      <button onClick={toggleTheme}>
        切换到 {state.theme === 'light' ? '深色' : '浅色'} 模式
      </button>
    </header>
  );
}
```

## 🛠️ 开发工具与生态

### Vue生态系统
```bash
# Vue CLI - 项目脚手架
npm install -g @vue/cli
vue create my-project

# Vite - 快速构建工具
npm create vue@latest my-vue-app

# 常用插件
npm install vue-router@4  # 路由管理
npm install pinia         # 状态管理
npm install @vueuse/core  # 组合式API工具库
```

### React生态系统
```bash
# Create React App
npx create-react-app my-app

# Vite React模板
npm create vite@latest my-react-app -- --template react

# 常用库
npm install react-router-dom    # 路由
npm install @reduxjs/toolkit react-redux  # 状态管理
npm install styled-components  # CSS-in-JS
npm install axios              # HTTP客户端
```

## 📱 构建现代应用

### 项目结构最佳实践

```
src/
├── components/          # 公共组件
│   ├── common/         # 通用组件
│   ├── forms/          # 表单组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── services/           # API服务
├── store/              # 状态管理
├── styles/             # 样式文件
└── types/              # TypeScript类型定义
```

### 性能优化技巧

```javascript
// React.memo - 避免不必要的重渲染
const UserCard = React.memo(({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>编辑</button>
    </div>
  );
});

// useCallback - 缓存函数
const UserList = () => {
  const [users, setUsers] = useState([]);
  
  // 缓存编辑函数
  const handleEdit = useCallback((userId) => {
    // 编辑逻辑
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onEdit={handleEdit} />
      ))}
    </div>
  );
};

// 懒加载组件
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## 🚀 部署与发布

### 构建优化
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
};
```

### 静态部署
```bash
# 构建项目
npm run build

# 部署到GitHub Pages
npm install --save-dev gh-pages
# package.json中添加脚本
# "deploy": "gh-pages -d dist"
npm run deploy

# 部署到Vercel
npx vercel --prod
```

## 💡 学习建议

### 循序渐进的学习路径

1. **基础准备** - 扎实的JavaScript基础
2. **选择框架** - 从Vue或React开始
3. **官方教程** - 完整跟随官方指导
4. **小项目练习** - 制作待办事项、博客等
5. **生态学习** - 路由、状态管理等
6. **实战项目** - 完整应用开发

### 常见陷阱避免

- **过早优化** - 先让功能正常工作
- **过度设计** - 保持组件简单明了
- **忽视性能** - 关注应用性能表现
- **缺少测试** - 编写必要的单元测试

---

*框架是工具，重要的是理解其解决的问题和设计思想！*
