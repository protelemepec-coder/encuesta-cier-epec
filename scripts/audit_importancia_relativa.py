import sys
sys.stdout.reconfigure(encoding='utf-8')
import pandas as pd
import json
import openpyxl

wb = openpyxl.load_workbook('data/raw/2026/Planilla de Índices CIER 2026 - EPEC-AR.xlsx', data_only=True)
sheet_imp = wb['Importancia']

official_dict = {}
for row in list(sheet_imp.iter_rows(values_only=True))[7:]:
    sigla = row[1]
    tipo = row[2]
    nombre = row[3]
    desc = row[4]
    imp_2025 = row[5]
    imp_2026 = row[6]
    if nombre and imp_2026 is not None:
        official_dict[nombre.strip()] = {
            'sigla': sigla,
            'tipo': tipo,
            'desc': desc,
            'imp_2025': float(imp_2025) if imp_2025 is not None else None,
            'imp_2026': float(imp_2026) if imp_2026 is not None else None
        }

df_csv = pd.read_csv('data/processed/evolucion_importancia_relativa_2025_2026.csv')
attrs = df_csv[df_csv['nivel'] == 'ATRIBUTO'].copy()

# Image values mapping (Page 45 of individual report):
img_vals = {
    'Sin interrupción': 8.3,
    'Sin variación de voltaje': 5.4,
    'Rapidez en la reanudación de la energía cuando falta': 5.5,
    'Notificación de interrupción': 5.9,
    'Uso eficiente': 3.0,
    'Riesgos y peligros': 3.7,
    'Derechos y deberes': 3.0,
    'Medición del consumo de energía': 3.4,
    'Plazo entre la recepción y el vencimiento': 5.1,
    'Factura sin errores': 4.5,
    'Facilidad de comprensión': 3.6,
    'Locales para el pago': 2.3,
    'Fechas para el vencimiento': 2.9,
    'Facilidad para contactarse': 5.5,
    'Tiempo de espera hasta ser atendido': 4.3,
    'Duración de la atención': 3.2,
    'Conocimiento sobre el tema': 3.3,
    'Claridad en la información': 2.7,
    'Calidad de la atención': 2.7,
    'Plazo informado': 2.3,
    'Solución definitiva del problema': 3.1,
    'Cumplimiento del plazo': 1.9,
    'Respeta los derechos de los clientes': 2.5,
    'Correcta con los clientes': 2.2,
    'Invierte para proveer energía con calidad': 2.2,
    'Informa a sus clientes con respecto a su actuación': 1.5,
    'Se ocupa de evitar hurtos de energía': 1.5,
    'Ofrece atención sin discriminación': 1.6,
    'Dispuesta a negociar con sus clientes (flexible)': 1.6,
    'Se ocupa del medio ambiente': 1.3
}

print('=== SUM OF IMPORTANCE 2026 ===')
print('Sum of imp_2026_pct:', attrs['imp_2026_pct'].sum())
print('Sum of imp_2026_raw:', attrs['imp_2026_raw'].sum())
print('Mean of imp_2026_pct:', attrs['imp_2026_pct'].mean())

print('\n=== CHECKING RANKINGS 2025 and 2026 ===')
sorted_2025 = attrs.sort_values(by='imp_2025_raw', ascending=False).reset_index()
for rk, row in sorted_2025.iterrows():
    expected_rk = rk + 1
    current_rk = row['ranking_imp_2025']
    if expected_rk != current_rk:
        print(f"2025 Ranking mismatch for {row['atributo']}: expected {expected_rk}, got {current_rk}")

sorted_2026 = attrs.sort_values(by='imp_2026_raw', ascending=False).reset_index()
for rk, row in sorted_2026.iterrows():
    expected_rk = rk + 1
    current_rk = row['ranking_imp_2026']
    if expected_rk != current_rk:
        print(f"2026 Ranking mismatch for {row['atributo']}: expected {expected_rk}, got {current_rk}")

print('All rankings validated!')

# Check if data_bundle.js has identical data
with open('data_bundle.js', 'r', encoding='utf-8') as f:
    bundle_text = f.read()

print('\n=== DATA BUNDLE JS CHECK ===')
print('data_bundle.js length:', len(bundle_text))
if 'evolucion_importancia' in bundle_text or 'EVOLUCION_IMPORTANCIA' in bundle_text or 'importancia_relativa' in bundle_text:
    print('Found importance in data_bundle.js')

print('\n=== CHECKING IF ANY DIFFERENCES IN SCRIPTS OR DOCS ===')
