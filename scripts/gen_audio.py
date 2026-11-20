#!/usr/bin/env python3
"""批量生成词库音频:每个词条 en + example,用 macOS say 生成 m4a。"""
import re, subprocess, sys, pathlib

SRC = pathlib.Path('/Users/huangxinhui01/Downloads/PY/0黄昕慧/app/src/data/vocab.ts')
OUT = pathlib.Path('/Users/huangxinhui01/Downloads/PY/0黄昕慧/app/public/audio')
OUT.mkdir(parents=True, exist_ok=True)

text = SRC.read_text(encoding='utf-8')
# 词条均为单行 { id: 'xx01', en: '...' ... };引号可单可双,用反向引用配对
item_line_re = re.compile(r"^\s*\{ id: ['\"]([a-z]{2}\d{2})['\"],", re.M)
quoted = lambda field: re.compile(r"\b" + field + r":\s*(['\"])((?:\\.|(?!\1).)*?)\1")

def unescape(s: str) -> str:
    return s.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')

def speakable(s: str) -> str:
    # 让 say 读得自然:斜杠变 or,括号内容保留但去掉括号
    s = s.replace('/', ' or ')
    s = s.replace('(', ', ').replace(')', ', ')
    s = s.replace('CO₂', 'C O 2')
    return re.sub(r'\s+', ' ', s).strip()

items = []
for m in item_line_re.finditer(text):
    line_start = m.start()
    line_end = text.find('\n', line_start)
    line = text[line_start: line_end if line_end != -1 else len(text)]
    vid = m.group(1)
    en_m = quoted('en').search(line)
    ex_m = quoted('example').search(line)
    if not en_m:
        print('NO EN', vid, file=sys.stderr)
        continue
    items.append((vid, unescape(en_m.group(2)), unescape(ex_m.group(2)) if ex_m else None))

print(f'parsed {len(items)} items')
ok = fail = 0
for i, (vid, en, ex) in enumerate(items):
    for suffix, content in (('', en), ('_ex', ex)):
        if not content:
            continue
        dest = OUT / f'{vid}{suffix}.m4a'
        if dest.exists() and dest.stat().st_size > 1000:
            ok += 1
            continue
        r = subprocess.run(['say', '-v', 'Samantha', '-r', '170', '-o', str(dest), speakable(content)],
                           capture_output=True)
        if r.returncode == 0 and dest.exists() and dest.stat().st_size > 500:
            ok += 1
        else:
            fail += 1
            print('FAIL', vid, suffix, r.stderr.decode()[:100], file=sys.stderr)
    if (i + 1) % 25 == 0:
        print(f'progress {i+1}/{len(items)}', flush=True)
print(f'DONE ok={ok} fail={fail}')
