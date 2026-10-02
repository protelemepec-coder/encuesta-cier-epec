import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print('index.html length:', len(html))
sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\']', html)
print('Section IDs in index.html:', sections)

# Find nav links
nav_links = re.findall(r'<a[^>]*href=["\']#([^"\']+)["\'][^>]*>(.*?)</a>', html)
print('\nNav links in index.html:')
for link, text in nav_links:
    clean_text = re.sub(r'<[^>]+>', '', text).strip()
    print(f"  #{link:<25} -> {clean_text}")

with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()
print('\napp.js length:', len(app_js))
functions = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', app_js)
print('Functions in app.js:', functions[:30])
