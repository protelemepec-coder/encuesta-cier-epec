import json, os

with open('data_bundle.js', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = "window.CIER_DATA = "
start = text.find(prefix)
if start == -1:
    print("prefix not found")
    exit()

json_str = text[start + len(prefix):].rstrip().rstrip(';')
data = json.loads(json_str)

catalog = data.get('filesCatalog', [])
print(f"Total items in filesCatalog: {len(catalog)}")

missing_in_disk = 0
for i, item in enumerate(catalog):
    archivo = item.get('archivo')
    anio = item.get('anio') or item.get('year')
    ext = item.get('extension')
    local_path = item.get('local_path', '')
    
    # Path relative to project root:
    # 1) check local_path in data/classified
    # 2) check path in data/raw
    raw_path = f"data/raw/{anio}/{archivo}"
    
    exists_lp = os.path.exists(local_path)
    exists_raw = os.path.exists(raw_path)
    
    if not exists_lp and not exists_raw:
        missing_in_disk += 1
        status = "MISSING IN BOTH"
    elif exists_raw:
        status = f"OK RAW: {raw_path}"
    else:
        status = f"OK LP: {local_path}"
        
    print(f"{i+1:2d}. [{anio}] {archivo} ({ext}) -> {status}")

print(f"\nTotal missing in disk: {missing_in_disk}")
