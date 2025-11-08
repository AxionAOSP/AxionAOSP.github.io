#!/usr/bin/env python3
# AxionOS 2025

import os
import json
import re
import sys
from pathlib import Path

POSTS_DIR = Path('./blog/posts')
OUTPUT_FILE = Path('./posts.js')

def parse_frontmatter(content):
    match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
    if not match:
        raise ValueError('Invalid post format. Must have frontmatter.')
    
    frontmatter_text, markdown = match.groups()
    meta = {}
    current_key = None
    current_dict = None
    
    for line in frontmatter_text.split('\n'):
        line = line.rstrip()
        if not line:
            continue
            
        if line.startswith('  ') and current_key:
            parts = line.strip().split(':', 1)
            if len(parts) == 2:
                sub_key, sub_val = parts
                if current_dict is None:
                    current_dict = {}
                    meta[current_key] = current_dict
                current_dict[sub_key.strip()] = sub_val.strip().strip('"\'')
        else:
            parts = line.split(':', 1)
            if len(parts) == 2:
                key, val = parts
                current_key = key.strip()
                current_dict = None
                meta[current_key] = val.strip().strip('"\'')
    
    return meta, markdown

def markdown_to_html(markdown):
    html = markdown
    
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    html = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', html)
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    html = re.sub(r'___(.+?)___', r'<strong><em>\1</em></strong>', html)
    html = re.sub(r'__(.+?)__', r'<strong>\1</strong>', html)
    
    html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', html)
    
    lines = html.split('\n')
    result = []
    in_list = False
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('* ') or stripped.startswith('- '):
            if not in_list:
                result.append('<ul>')
                in_list = True
            item = stripped[2:]
            result.append(f'<li>{item}</li>')
        else:
            if in_list:
                result.append('</ul>')
                in_list = False
            result.append(line)
    
    if in_list:
        result.append('</ul>')
    
    html = '\n'.join(result)
    
    paragraphs = html.split('\n\n')
    processed = []
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        if para.startswith('<'):
            processed.append(para)
        else:
            processed.append(f'<p>{para}</p>')
    
    return '\n\n'.join(processed)

def parse_post(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        meta, markdown = parse_frontmatter(content)
        html = markdown_to_html(markdown)
        
        post = {**meta, 'content': html}
        return post, None
    except Exception as e:
        return None, str(e)

def build_posts():
    posts = []
    
    if POSTS_DIR.exists():
        print(f'Reading from {POSTS_DIR}/')
        for file_path in sorted(POSTS_DIR.glob('*.md')):
            post, error = parse_post(file_path)
            if error:
                print(f'  [ERROR] {file_path.name}: {error}')
            else:
                posts.append(post)
                print(f'  [OK] {file_path.name}')
    else:
        print(f'[ERROR] {POSTS_DIR}/ not found')
        sys.exit(1)
    
    return posts

def generate_posts_file(posts):
    js_content = f'window.posts = {json.dumps(posts, indent=2, ensure_ascii=False)};'
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

def main():
    print('=' * 60)
    print('AxionOS Blog Builder')
    print('=' * 60)
    print('')
    
    posts = build_posts()
    
    print('')
    print('-' * 60)
    print(f'Successfully parsed {len(posts)} post(s)')
    
    generate_posts_file(posts)
    print(f'Generated: {OUTPUT_FILE}')
    print('-' * 60)
    print('')

if __name__ == '__main__':
    main()
