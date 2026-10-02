import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

def get_section_snippet(html, sec_id):
    pattern = rf'<section[^>]*id=["\']{sec_id}["\'][^>]*>(.*?)</section>'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        content = match.group(1)
        print(f"=== SECTION: {sec_id} (Length: {len(content)}) ===")
        print(content[:1500])
        print("...\n" + "="*50)
    else:
        print(f"Section {sec_id} NOT found")

get_section_snippet(html, 'tab-matriz')
get_section_snippet(html, 'tab-detractores')
