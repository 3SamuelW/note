# Python项目 💼

通过实际项目来练习和巩固Python编程技能。

## 🎯 项目概览

### 🔰 初级项目
适合Python初学者，练习基础语法和编程思维。

### 🚀 中级项目
结合多个知识点，提升问题解决能力。

### 💫 高级项目
综合性强的实战项目，接近真实开发场景。

## 📋 项目列表

### 项目1：猜数字游戏
```python
import random

def guess_number_game():
    """猜数字游戏"""
    secret_number = random.randint(1, 100)
    attempts = 0
    max_attempts = 7
    
    print("=== 猜数字游戏 ===")
    print(f"我想了一个1-100之间的数字，你有{max_attempts}次机会猜中它！")
    
    while attempts < max_attempts:
        try:
            guess = int(input(f"第{attempts + 1}次猜测，请输入数字："))
            attempts += 1
            
            if guess == secret_number:
                print(f"🎉 恭喜你猜对了！数字是 {secret_number}")
                print(f"你用了 {attempts} 次猜中！")
                break
            elif guess < secret_number:
                print("📈 太小了，再试试更大的数字")
            else:
                print("📉 太大了，再试试更小的数字")
                
            if attempts == max_attempts:
                print(f"😅 很遗憾，机会用完了！答案是 {secret_number}")
                
        except ValueError:
            print("❌ 请输入有效的数字！")

# 运行游戏
if __name__ == "__main__":
    guess_number_game()
```

### 项目2：待办事项管理器
```python
class TodoManager:
    """待办事项管理器"""
    
    def __init__(self):
        self.todos = []
        self.next_id = 1
    
    def add_todo(self, task):
        """添加待办事项"""
        todo = {
            'id': self.next_id,
            'task': task,
            'completed': False
        }
        self.todos.append(todo)
        self.next_id += 1
        print(f"✅ 已添加：{task}")
    
    def list_todos(self):
        """显示所有待办事项"""
        if not self.todos:
            print("📝 待办列表为空")
            return
        
        print("\n=== 待办事项列表 ===")
        for todo in self.todos:
            status = "✅" if todo['completed'] else "⭕"
            print(f"{todo['id']}. {status} {todo['task']}")
    
    def complete_todo(self, todo_id):
        """完成待办事项"""
        for todo in self.todos:
            if todo['id'] == todo_id:
                todo['completed'] = True
                print(f"🎉 已完成：{todo['task']}")
                return
        print(f"❌ 未找到ID为{todo_id}的待办事项")
    
    def remove_todo(self, todo_id):
        """删除待办事项"""
        for i, todo in enumerate(self.todos):
            if todo['id'] == todo_id:
                removed_task = self.todos.pop(i)
                print(f"🗑️ 已删除：{removed_task['task']}")
                return
        print(f"❌ 未找到ID为{todo_id}的待办事项")

def main():
    """主程序"""
    manager = TodoManager()
    
    while True:
        print("\n=== 待办事项管理器 ===")
        print("1. 添加任务")
        print("2. 查看任务")
        print("3. 完成任务")
        print("4. 删除任务")
        print("5. 退出")
        
        choice = input("请选择操作 (1-5)：").strip()
        
        if choice == '1':
            task = input("请输入任务内容：").strip()
            if task:
                manager.add_todo(task)
        elif choice == '2':
            manager.list_todos()
        elif choice == '3':
            try:
                todo_id = int(input("请输入要完成的任务ID："))
                manager.complete_todo(todo_id)
            except ValueError:
                print("❌ 请输入有效的数字ID")
        elif choice == '4':
            try:
                todo_id = int(input("请输入要删除的任务ID："))
                manager.remove_todo(todo_id)
            except ValueError:
                print("❌ 请输入有效的数字ID")
        elif choice == '5':
            print("👋 再见！")
            break
        else:
            print("❌ 无效选择，请重新输入")

if __name__ == "__main__":
    main()
```

### 项目3：文件整理器
```python
import os
import shutil
from pathlib import Path

class FileOrganizer:
    """文件整理器"""
    
    def __init__(self, source_dir):
        self.source_dir = Path(source_dir)
        self.file_types = {
            'images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
            'documents': ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
            'videos': ['.mp4', '.avi', '.mkv', '.mov', '.wmv'],
            'audio': ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
            'archives': ['.zip', '.rar', '.7z', '.tar', '.gz'],
            'code': ['.py', '.js', '.html', '.css', '.java', '.cpp']
        }
    
    def organize_files(self):
        """整理文件"""
        if not self.source_dir.exists():
            print(f"❌ 目录不存在：{self.source_dir}")
            return
        
        files_moved = 0
        
        for file_path in self.source_dir.iterdir():
            if file_path.is_file():
                file_type = self.get_file_type(file_path.suffix.lower())
                
                if file_type:
                    target_dir = self.source_dir / file_type
                    target_dir.mkdir(exist_ok=True)
                    
                    target_path = target_dir / file_path.name
                    
                    try:
                        shutil.move(str(file_path), str(target_path))
                        print(f"📁 {file_path.name} -> {file_type}/")
                        files_moved += 1
                    except Exception as e:
                        print(f"❌ 移动文件失败：{file_path.name} - {e}")
        
        print(f"\n🎉 整理完成！共移动了 {files_moved} 个文件")
    
    def get_file_type(self, extension):
        """根据文件扩展名判断文件类型"""
        for file_type, extensions in self.file_types.items():
            if extension in extensions:
                return file_type
        return None
    
    def preview_organization(self):
        """预览整理结果"""
        if not self.source_dir.exists():
            print(f"❌ 目录不存在：{self.source_dir}")
            return
        
        type_counts = {}
        
        for file_path in self.source_dir.iterdir():
            if file_path.is_file():
                file_type = self.get_file_type(file_path.suffix.lower())
                file_type = file_type or 'others'
                
                if file_type not in type_counts:
                    type_counts[file_type] = []
                type_counts[file_type].append(file_path.name)
        
        print("📋 整理预览：")
        for file_type, files in type_counts.items():
            print(f"\n📁 {file_type} ({len(files)}个文件):")
            for file_name in files[:5]:  # 只显示前5个
                print(f"  • {file_name}")
            if len(files) > 5:
                print(f"  ... 还有 {len(files) - 5} 个文件")

def main():
    """主程序"""
    print("=== 文件整理器 ===")
    source_dir = input("请输入要整理的目录路径：").strip()
    
    if not source_dir:
        source_dir = "."  # 默认当前目录
    
    organizer = FileOrganizer(source_dir)
    
    while True:
        print(f"\n当前目录：{organizer.source_dir.absolute()}")
        print("1. 预览整理结果")
        print("2. 开始整理文件")
        print("3. 退出")
        
        choice = input("请选择操作 (1-3)：").strip()
        
        if choice == '1':
            organizer.preview_organization()
        elif choice == '2':
            confirm = input("确定要整理文件吗？(y/N)：").strip().lower()
            if confirm == 'y':
                organizer.organize_files()
        elif choice == '3':
            print("👋 再见！")
            break
        else:
            print("❌ 无效选择")

if __name__ == "__main__":
    main()
```

## 🏆 进阶项目建议

### 项目A：个人记账本
- 收入支出记录
- 分类统计
- 数据可视化
- 数据导出功能

### 项目B：天气查询工具
- API接口调用
- 数据解析处理
- 用户界面设计
- 错误处理机制

### 项目C：网站监控器
- 定时检查网站状态
- 发送通知提醒
- 日志记录
- 配置文件管理

## 💡 项目开发建议

1. **从简单开始** - 先实现核心功能，再逐步完善
2. **注重用户体验** - 友好的提示信息和错误处理
3. **代码规范** - 遵循PEP 8规范，写清晰的注释
4. **测试验证** - 多场景测试，确保程序稳定性
5. **版本管理** - 使用Git记录开发过程

---

*通过项目实践，将理论知识转化为实际能力！*
