import urllib.request
import urllib.parse
import json

base_url = "https://inventarioenergycpy.github.io/encuesta-cier-epec/"

with open('data_bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = "window.CIER_DATA = "
start = text.find(prefix)
json_str = text[start + len(prefix):].rstrip().rstrip(';')
data = json.loads(json_str)

catalog = data.get('filesCatalog', [])

print(f"Testing {len(catalog)} files on GitHub Pages ({base_url})...")
success = 0
failed = []

headers = {'User-Agent': 'Mozilla/5.0'}

for i, item in enumerate(catalog):
    archivo = item.get('archivo')
    anio = item.get('anio') or item.get('year')
    raw_rel = f"data/raw/{anio}/{archivo}"
    encoded_url = base_url + urllib.parse.quote(raw_rel, safe="/:")
    
    try:
        req = urllib.request.Request(encoded_url, headers=headers, method='HEAD')
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                success += 1
                # print(f"OK: {raw_rel}")
            else:
                failed.append((raw_rel, resp.status))
    except Exception as e:
        failed.append((raw_rel, str(e)))

print(f"\nGitHub Pages Success: {success} / {len(catalog)}")
if failed:
    print(f"Failed count: {len(failed)}")
    for r, err in failed:
        print(f"  FAILED: {r} -> {err}")
