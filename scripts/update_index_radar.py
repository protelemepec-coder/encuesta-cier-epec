import sys

# 1. Update index.html
with open(r'D:\Proyectos\encuesta_cier\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target_html = '''            <!-- Standard Selector Buttons -->
            <div class="filters-row flex-wrap gap-2">
              <button class="btn-filter-radar active" data-radar-mode="all" id="btn-radar-all">
                📊 Todos los Estándares
              </button>
              <button class="btn-filter-radar" data-radar-mode="estandar_1" id="btn-radar-e1">
                🏆 vs. 1. TOTAL CIER (UTE)
              </button>
              <button class="btn-filter-radar" data-radar-mode="estandar_2" id="btn-radar-e2">
                📊 vs. 2. Promedio CIER (>500k)
              </button>
              <button class="btn-filter-radar" data-radar-mode="estandar_3" id="btn-radar-e3">
                🌎 vs. 3. Top 3 LATAM
              </button>
              <button class="btn-filter-radar" data-radar-mode="estandar_4" id="btn-radar-e4">
                🇦🇷 vs. 4. Top 2 Argentina
              </button>
            </div>
          </div>'''

replacement_html = '''            <!-- Spider Radar Sub-Views & Entity Filters -->
            <div class="d-flex flex-column gap-2">
              <!-- View Type Selector (Subtabs) -->
              <div class="subtabs-bar" style="border-bottom: none; margin-bottom: 0.25rem;">
                <button class="sub-tab-btn active" data-radar-view="sintesis" id="btn-view-radar-sintesis">
                  <span>📊 6 Índices Globales (Captura CIER)</span>
                </button>
                <button class="sub-tab-btn" data-radar-view="servicios" id="btn-view-radar-servicios">
                  <span>⚡ 9 Dimensiones de Servicio</span>
                </button>
                <button class="sub-tab-btn" data-radar-view="paises" id="btn-view-radar-paises">
                  <span>🌎 Benchmark por Países LATAM</span>
                </button>
              </div>

              <!-- Standard / Entity Selector Buttons -->
              <div class="filters-row flex-wrap gap-2" id="radar-entities-row">
                <button class="btn-filter-radar active" data-radar-mode="all" id="btn-radar-all">
                  📊 Todos los Estándares
                </button>
                <button class="btn-filter-radar" data-radar-mode="edenor" id="btn-radar-edenor">
                  🇦🇷 vs. EDENOR (Argentina)
                </button>
                <button class="btn-filter-radar" data-radar-mode="estandar_1" id="btn-radar-e1">
                  🏆 vs. 1. TOTAL CIER (UTE)
                </button>
                <button class="btn-filter-radar" data-radar-mode="estandar_2" id="btn-radar-e2">
                  📊 vs. 2. Promedio CIER (>500k)
                </button>
                <button class="btn-filter-radar" data-radar-mode="estandar_3" id="btn-radar-e3">
                  🌎 vs. 3. Top 3 LATAM
                </button>
                <button class="btn-filter-radar" data-radar-mode="estandar_4" id="btn-radar-e4">
                  🇦🇷 vs. 4. Top 2 Argentina
                </button>
              </div>
            </div>
          </div>'''

if target_html in html:
    html = html.replace(target_html, replacement_html, 1)
    with open(r'D:\Proyectos\encuesta_cier\index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('SUCCESS: index.html updated.')
else:
    print('WARNING: target_html not found in index.html')
