# HTML/CSS 🎨

学习网页开发的基石 - HTML结构和CSS样式设计。

## 📖 HTML基础

### 基本结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个网页</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>欢迎来到我的网站</h1>
    </header>
    
    <main>
        <section>
            <h2>关于我</h2>
            <p>我是一名正在学习Web开发的学生。</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2025 我的网站</p>
    </footer>
</body>
</html>
```

### 常用标签
```html
<!-- 文本内容 -->
<h1>主标题</h1>
<h2>副标题</h2>
<p>段落文本</p>
<strong>重要文本</strong>
<em>强调文本</em>

<!-- 链接和图片 -->
<a href="https://example.com">外部链接</a>
<a href="#section1">内部锚点</a>
<img src="image.jpg" alt="图片描述">

<!-- 列表 -->
<ul>
    <li>无序列表项1</li>
    <li>无序列表项2</li>
</ul>

<ol>
    <li>有序列表项1</li>
    <li>有序列表项2</li>
</ol>

<!-- 表格 -->
<table>
    <thead>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>张三</td>
            <td>25</td>
        </tr>
    </tbody>
</table>
```

### 语义化标签
```html
<header>头部内容</header>
<nav>导航菜单</nav>
<main>主要内容</main>
<article>文章</article>
<section>章节</section>
<aside>侧边栏</aside>
<footer>页脚</footer>
```

## 🎨 CSS基础

### 基本语法
```css
/* 选择器 { 属性: 值; } */
h1 {
    color: #333;
    font-size: 2em;
    text-align: center;
}

p {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 1em 0;
}
```

### 选择器类型
```css
/* 元素选择器 */
h1 { color: blue; }

/* 类选择器 */
.highlight { background-color: yellow; }

/* ID选择器 */
#main-title { font-size: 3em; }

/* 属性选择器 */
input[type="text"] { border: 1px solid #ccc; }

/* 伪类选择器 */
a:hover { color: red; }
li:first-child { font-weight: bold; }

/* 组合选择器 */
.container p { margin: 0.5em; }
h1, h2, h3 { color: #333; }
```

## 📱 响应式设计

### CSS Grid布局
```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.grid-item {
    background: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
}
```

### Flexbox布局
```css
.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.flex-item {
    flex: 1;
    min-width: 200px;
}

/* 导航栏示例 */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #333;
}

.navbar .logo {
    color: white;
    font-size: 1.5em;
    font-weight: bold;
}

.navbar ul {
    display: flex;
    list-style: none;
    gap: 1rem;
    margin: 0;
}

.navbar a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.navbar a:hover {
    background-color: #555;
}
```

### 媒体查询
```css
/* 移动端优先 */
.container {
    width: 100%;
    padding: 1rem;
}

/* 平板设备 */
@media (min-width: 768px) {
    .container {
        max-width: 750px;
        margin: 0 auto;
    }
}

/* 桌面设备 */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
    }
    
    .grid-container {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

## 🎯 实用CSS技巧

### 现代CSS特性
```css
/* CSS变量 */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --border-radius: 8px;
    --box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.button {
    background-color: var(--primary-color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
}

/* 动画过渡 */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

/* CSS Grid Areas */
.layout {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### 实用组件样式
```css
/* 卡片组件 */
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
}

.card-header {
    padding: 1rem;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}

.card-body {
    padding: 1rem;
}

/* 按钮样式 */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
}

.btn-secondary:hover {
    background-color: #545b62;
}
```

## 🎨 页面布局示例

### 完整页面结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>响应式网页示例</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        header {
            background: #333;
            color: white;
            padding: 1rem 0;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 4rem 0;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 3rem 0;
        }
        
        .feature {
            text-align: center;
            padding: 2rem;
        }
        
        footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>我的网站</h1>
        </div>
    </header>
    
    <section class="hero">
        <div class="container">
            <h2>欢迎来到我的学习网站</h2>
            <p>记录编程学习的点点滴滴</p>
        </div>
    </section>
    
    <section class="features">
        <div class="container">
            <div class="feature">
                <h3>🐍 Python</h3>
                <p>学习Python编程语言</p>
            </div>
            <div class="feature">
                <h3>🌐 Web开发</h3>
                <p>前端技术栈学习</p>
            </div>
            <div class="feature">
                <h3>📊 数据结构</h3>
                <p>算法与数据结构</p>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>&copy; 2025 学习笔记. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
```

---

*HTML提供结构，CSS赋予美感。掌握这两项技术，你就能创建出精美的网页！*
