import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('id="tab-detractores"')
if pos != -1:
    end_pos = html.find('</section>', pos)
    print(html[pos:end_pos+10])
