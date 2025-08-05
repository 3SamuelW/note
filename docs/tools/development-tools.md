# 开发工具 💻

这里推荐我在编程学习中使用的各种开发工具，包括编辑器、环境管理、调试工具等。

## 📝 代码编辑器

### Visual Studio Code ⭐⭐⭐⭐⭐
- **简介**: 微软开发的免费代码编辑器
- **优点**: 插件丰富、界面美观、性能优秀
- **推荐插件**:
  - Python Extension Pack
  - Prettier - Code formatter
  - GitLens
  - Live Server

### PyCharm ⭐⭐⭐⭐
- **简介**: JetBrains出品的Python专业IDE
- **优点**: 调试功能强大、代码提示智能
- **适用**: Python开发专用

## 🐍 Python环境管理

### Anaconda ⭐⭐⭐⭐⭐
```bash
# 创建新环境
conda create -n myenv python=3.9
# 激活环境
conda activate myenv
# 安装包
conda install pandas numpy matplotlib
```

### pip + venv ⭐⭐⭐⭐
```bash
# 创建虚拟环境
python -m venv myenv
# 激活环境 (Windows)
myenv\Scripts\activate
# 安装依赖
pip install -r requirements.txt
```

## 🌐 Web开发工具

### 浏览器开发工具 ⭐⭐⭐⭐⭐
- **Chrome DevTools**: 调试JavaScript、CSS，性能分析
- **Firefox Developer Tools**: 网格布局调试

### Live Server ⭐⭐⭐⭐
- **功能**: 本地HTTP服务器，实时重载
- **安装**: VS Code插件或npm全局安装

## 🔧 版本控制

### Git ⭐⭐⭐⭐⭐
```bash
# 基础命令
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### GitHub Desktop ⭐⭐⭐
- **优点**: 图形界面，新手友好
- **适用**: 不熟悉命令行的初学者

## 📱 设计与原型

### Figma ⭐⭐⭐⭐
- **用途**: UI设计、原型制作
- **优点**: 免费、协作友好

### draw.io ⭐⭐⭐⭐
- **用途**: 流程图、架构图绘制
- **优点**: 完全免费、功能强大

## 🛡️ 代码质量

### Black (Python) ⭐⭐⭐⭐
```bash
# 安装
pip install black
# 格式化代码
black your_script.py
```

### Prettier (Web) ⭐⭐⭐⭐
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

## 📊 性能测试

### Lighthouse ⭐⭐⭐⭐⭐
- **功能**: 网站性能、可访问性评估
- **使用**: Chrome DevTools内置

## 💡 推荐配置

### VS Code 设置
```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "python.defaultInterpreterPath": "./venv/bin/python",
  "editor.formatOnSave": true
}
```

### Git 全局配置
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

---

*好工具事半功倍，选择适合自己的开发环境很重要！*
