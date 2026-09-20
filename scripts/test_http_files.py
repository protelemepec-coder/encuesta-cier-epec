import urllib.request
import urllib.parse
import json

base_url = "http://localhost:8080/"

with open('data_bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = "window.CIER_DATA = "
start = text.find(prefix)
json_str = text[start + len(prefix):].rstrip().rstrip(';')
data = json.loads(json_str)

catalog = data.get('filesCatalog', [])

print(f"Testing {len(catalog)} files on {base_url}...")
success = 0
failed = []

for i, item in enumerate(catalog):
    archivo = item.get('archivo')
    anio = item.get('anio') or item.get('year')
    raw_rel = f"data/raw/{anio}/{archivo}"
    encoded_url = base_url + urllib.parse.quote(raw_rel, safe="/:")
    
    try:
        req = urllib.request.Request(encoded_url, method='HEAD')
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                success += 1
            else:
                failed.append((raw_rel, resp.status))
    except Exception as e:
        failed.append((raw_rel, str(e)))

print(f"Success: {success} / {len(catalog)}")
if failed:
    print(f"Failed count: {len(failed)}")
    for r, err in failed:
        print(f"  FAILED: {r} -> {err}")
