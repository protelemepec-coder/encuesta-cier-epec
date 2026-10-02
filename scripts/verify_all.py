import os, sys, json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_SCRATCH = os.path.dirname(SCRIPT_DIR)
BASE_D = r"D:\Proyectos\encuesta_cier"

for base in [BASE_SCRATCH, BASE_D]:
    if not os.path.exists(base):
        continue
    print(f"\n--- Checking {base} ---")
    hpath = os.path.join(base, 'index.html')
    jspath = os.path.join(base, 'app.js')
    bpath = os.path.join(base, 'data_bundle.js')
    csspath = os.path.join(base, 'style.css')

    with open(hpath, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(jspath, 'r', encoding='utf-8') as f:
        js = f.read()
    with open(bpath, 'r', encoding='utf-8') as f:
        bundle = f.read()
    with open(csspath, 'r', encoding='utf-8') as f:
        css = f.read()

    print(f"index.html: {len(html)} chars | lines: {len(html.splitlines())}")
    print(f"app.js: {len(js)} chars | lines: {len(js.splitlines())}")
    print(f"style.css: {len(css)} chars | lines: {len(css.splitlines())}")
    print(f"data_bundle.js: {len(bundle)} chars | lines: {len(bundle.splitlines())}")

    # Check key IDs
    canvases = [
        'chart-ingreso-educacion-genero',
        'chart-ingreso-edad-genero',
        'chart-educacion-edad',
        'chart-genero-tramo-ingreso'
    ]
    for c in canvases:
        print(f"Canvas '{c}' in HTML:", c in html, "| in JS:", c in js)

    containers = [
        'generational-cards-container',
        'iscal-sliders-container',
        'sim-iscal-val',
        'sim-delta-badge',
        'meter-sim-val',
        'meter-sim-fill',
        'sim-status-banner'
    ]
    for c in containers:
        print(f"Element '{c}' in HTML:", c in html, "| in JS:", c in js)

    # Check CSS classes
    classes = ['.sim-score-card', '.scenario-buttons-group', '.gen-card', '.chart-card-inner']
    for cl in classes:
        print(f"CSS '{cl}' in style.css:", cl in css)
