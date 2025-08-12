import re
import os

def convert_img_tags(content):
    """
    将HTML img标签转换为Markdown格式
    """
    # 匹配<img>标签的正则表达式
    img_pattern = r'<img\s+src="([^"]+)"\s+style="zoom:\s*(\d+)%;?"\s*/?>'
    
    def replace_img_tag(match):
        src = match.group(1)
        zoom = match.group(2)
        # 移除查询参数
        src_clean = src.split('?')[0]
        # 计算宽度百分比
        width_pct = zoom + '%'
        return f'![]({src_clean}){{ width="{width_pct}" }}'
    
    return re.sub(img_pattern, replace_img_tag, content)

# 示例用法（如果需要处理特定文件，取消注释并修改路径）
# file_path = "your_markdown_file.md"
# with open(file_path, 'r', encoding='utf-8') as f:
#     content = f.read()
# 
# converted_content = convert_img_tags(content)
# 
# with open(file_path, 'w', encoding='utf-8') as f:
#     f.write(converted_content)