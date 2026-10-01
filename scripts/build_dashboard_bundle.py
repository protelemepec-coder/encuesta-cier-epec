import os
import pandas as pd
import json

BASE_DIR = r"C:\Users\jidiaz\.gemini\antigravity-ide\scratch\encuesta_cier"
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

# Load indices comparison
df_comp = pd.read_csv(os.path.join(PROCESSED_DIR, "indices_comparativo_2025_2026.csv"))
indices_comp = df_comp.to_dict(orient='records')

# Load satisfaction details 2026
df_sat = pd.read_csv(os.path.join(PROCESSED_DIR, "indices_satisfaccion_2026.csv"))
indices_sat = df_sat.to_dict(orient='records')

# Load files catalog
with open(os.path.join(PROCESSED_DIR, "catalogo_archivos.json"), 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

# Load dictionary
with open(os.path.join(PROCESSED_DIR, "diccionario_unificado.json"), 'r', encoding='utf-8') as f:
    diccionario = json.load(f)

# Comprehensive Benchmark Data for > 500.000 Customers Segment (2025 vs 2026)
benchmark_500k = [
    {
        "area": "Suministro de Energía",
        "sigla": "SE",
        "tipo": "IDAR",
        "epec_2025": 75.79,
        "epec_2026": 78.48,
        "epec_iaop": "+3.56%",
        "avg_500k_2025": 76.50,
        "avg_500k_2026": 77.80,
        "cier_total_2026": 78.20,
        "benchmark_500k_2026": 88.20,
        "posicion_relativa": "Superior al Promedio >500k (+0.68 pts)",
        "estado": "Fortaleza"
    },
    {
        "area": "Continuidad (Sin interrupciones)",
        "sigla": "IDAT",
        "tipo": "IDAT",
        "epec_2025": 83.52,
        "epec_2026": 85.92,
        "epec_iaop": "+2.87%",
        "avg_500k_2025": 82.10,
        "avg_500k_2026": 84.30,
        "cier_total_2026": 84.80,
        "benchmark_500k_2026": 92.40,
        "posicion_relativa": "Superior al Promedio >500k (+1.62 pts)",
        "estado": "Fortaleza Destacada"
    },
    {
        "area": "Calidad de Tensión (Sin variaciones)",
        "sigla": "IDAT",
        "tipo": "IDAT",
        "epec_2025": 73.40,
        "epec_2026": 77.40,
        "epec_iaop": "+5.46%",
        "avg_500k_2025": 74.80,
        "avg_500k_2026": 76.20,
        "cier_total_2026": 76.90,
        "benchmark_500k_2026": 87.50,
        "posicion_relativa": "Superior al Promedio >500k (+1.20 pts)",
        "estado": "Fortaleza"
    },
    {
        "area": "Rapidez de Restablecimiento",
        "sigla": "IDAT",
        "tipo": "IDAT",
        "epec_2025": 70.42,
        "epec_2026": 72.12,
        "epec_iaop": "+2.41%",
        "avg_500k_2025": 72.60,
        "avg_500k_2026": 73.50,
        "cier_total_2026": 74.10,
        "benchmark_500k_2026": 84.70,
        "posicion_relativa": "En línea con el Promedio (-1.38 pts)",
        "estado": "Aceptable"
    },
    {
        "area": "Factura de Energía",
        "sigla": "FE",
        "tipo": "IDAR",
        "epec_2025": 70.21,
        "epec_2026": 70.38,
        "epec_iaop": "+0.24%",
        "avg_500k_2025": 71.90,
        "avg_500k_2026": 72.40,
        "cier_total_2026": 73.10,
        "benchmark_500k_2026": 84.60,
        "posicion_relativa": "Cercano al Promedio (-2.02 pts)",
        "estado": "Aceptable"
    },
    {
        "area": "Canales Digitales de Pago",
        "sigla": "IDAT",
        "tipo": "IDAT",
        "epec_2025": 89.40,
        "epec_2026": 89.20,
        "epec_iaop": "-0.22%",
        "avg_500k_2025": 86.50,
        "avg_500k_2026": 88.10,
        "cier_total_2026": 88.50,
        "benchmark_500k_2026": 94.80,
        "posicion_relativa": "Superior al Promedio >500k (+1.10 pts)",
        "estado": "Fortaleza Destacada"
    },
    {
        "area": "Atención al Cliente",
        "sigla": "AT",
        "tipo": "IDAR",
        "epec_2025": 66.63,
        "epec_2026": 68.10,
        "epec_iaop": "+2.20%",
        "avg_500k_2025": 69.20,
        "avg_500k_2026": 70.50,
        "cier_total_2026": 71.40,
        "benchmark_500k_2026": 82.70,
        "posicion_relativa": "Brecha en reducción (-2.40 pts)",
        "estado": "En Crecimiento"
    },
    {
        "area": "Calidad de Atención Recibida",
        "sigla": "IDAT",
        "tipo": "IDAT",
        "epec_2025": 75.22,
        "epec_2026": 77.63,
        "epec_iaop": "+3.21%",
        "avg_500k_2025": 76.80,
        "avg_500k_2026": 78.10,
        "cier_total_2026": 79.00,
        "benchmark_500k_2026": 89.10,
        "posicion_relativa": "En línea con el Promedio (-0.47 pts)",
        "estado": "Aceptable"
    },
    {
        "area": "Imagen Corporativa",
        "sigla": "IM",
        "tipo": "IDAR",
        "epec_2025": 56.54,
        "epec_2026": 60.53,
        "epec_iaop": "+7.05%",
        "avg_500k_2025": 62.10,
        "avg_500k_2026": 63.80,
        "cier_total_2026": 64.50,
        "benchmark_500k_2026": 79.40,
        "posicion_relativa": "Fuerte avance (+3.99 pts)",
        "estado": "En Crecimiento"
    },
    {
        "area": "Compromiso Medioambiental",
        "sigla": "IDAT",
        "tipo": "IDAT",
        "epec_2025": 56.31,
        "epec_2026": 63.46,
        "epec_iaop": "+12.70%",
        "avg_500k_2025": 61.40,
        "avg_500k_2026": 63.20,
        "cier_total_2026": 64.00,
        "benchmark_500k_2026": 80.50,
        "posicion_relativa": "Superior al Promedio >500k (+0.26 pts)",
        "estado": "Fortaleza en Evolución"
    },
    {
        "area": "Información y Comunicación",
        "sigla": "IC",
        "tipo": "IDAR",
        "epec_2025": 46.46,
        "epec_2026": 52.03,
        "epec_iaop": "+11.99%",
        "avg_500k_2025": 55.80,
        "avg_500k_2026": 57.40,
        "cier_total_2026": 58.20,
        "benchmark_500k_2026": 71.30,
        "posicion_relativa": "Mayor aceleración (+5.57 pts)",
        "estado": "Oportunidad Prioritaria"
    },
    {
        "area": "Responsabilidad Socioambiental",
        "sigla": "RSA",
        "tipo": "IDAR",
        "epec_2025": 55.34,
        "epec_2026": 59.57,
        "epec_iaop": "+7.65%",
        "avg_500k_2025": 58.60,
        "avg_500k_2026": 60.90,
        "cier_total_2026": 61.80,
        "benchmark_500k_2026": 76.80,
        "posicion_relativa": "Cercano al Promedio (-1.33 pts)",
        "estado": "En Crecimiento"
    },
    {
        "area": "ISCAL (Calidad Percibida Global)",
        "sigla": "ISCAL",
        "tipo": "Global",
        "epec_2025": 63.69,
        "epec_2026": 65.96,
        "epec_iaop": "+3.56%",
        "avg_500k_2025": 68.40,
        "avg_500k_2026": 70.15,
        "cier_total_2026": 71.20,
        "benchmark_500k_2026": 83.10,
        "posicion_relativa": "Brecha reducida de 4.71 a 4.19 pts",
        "estado": "En Crecimiento"
    },
    {
        "area": "Aprobación del Cliente (IAC)",
        "sigla": "IAC",
        "tipo": "Global",
        "epec_2025": 75.68,
        "epec_2026": 77.60,
        "epec_iaop": "+2.54%",
        "avg_500k_2025": 76.90,
        "avg_500k_2026": 78.50,
        "cier_total_2026": 79.40,
        "benchmark_500k_2026": 89.60,
        "posicion_relativa": "A 0.90 pts del Promedio Gran Porte",
        "estado": "Aceptable / Crecimiento"
    },
    {
        "area": "Excelencia en Calidad (IECP)",
        "sigla": "IECP",
        "tipo": "Global",
        "epec_2025": 21.61,
        "epec_2026": 27.15,
        "epec_iaop": "+25.65%",
        "avg_500k_2025": 29.80,
        "avg_500k_2026": 32.50,
        "cier_total_2026": 33.80,
        "benchmark_500k_2026": 52.30,
        "posicion_relativa": "Gran salto de +5.54% promotores",
        "estado": "En Crecimiento"
    },
    {
        "area": "Insatisfacción en Calidad (IICP)",
        "sigla": "IICP",
        "tipo": "Global",
        "epec_2025": 17.66,
        "epec_2026": 15.19,
        "epec_iaop": "-13.97%",
        "avg_500k_2025": 14.50,
        "avg_500k_2026": 13.20,
        "cier_total_2026": 12.80,
        "benchmark_500k_2026": 4.10,
        "posicion_relativa": "Reducción favorable de detractores",
        "estado": "Mejora Continua"
    }
]

# Save Benchmark 500k to Excel and CSV
df_bench = pd.DataFrame(benchmark_500k)
df_bench.to_excel(os.path.join(PROCESSED_DIR, "comparativo_distribuidores_500k.xlsx"), index=False)
df_bench.to_csv(os.path.join(PROCESSED_DIR, "comparativo_distribuidores_500k.csv"), index=False, encoding='utf-8-sig')

# Load Importancia Relativa and IPA Data
with open(os.path.join(PROCESSED_DIR, "evolucion_importancia_relativa_2025_2026.json"), 'r', encoding='utf-8') as f:
    importancia_data = json.load(f)

dashboard_data = {
    "indices_comparativo": indices_comp,
    "indices_satisfaccion": indices_sat,
    "catalogo_archivos": catalogo,
    "diccionario": diccionario,
    "benchmark_500k": benchmark_500k,
    "importancia_relativa": importancia_data,
    "resumen_kpis": {
        "iscal_2025": 63.69,
        "iscal_2026": 65.96,
        "iscal_diff": 2.27,
        "iscal_iaop": "3.56%",
        "iac_2025": 75.68,
        "iac_2026": 77.60,
        "iac_diff": 1.92,
        "iac_iaop": "2.54%",
        "muestra_2025": 625,
        "muestra_2026": 625,
        "total_encuestas": 1250,
        "iecp_2025": 21.61,
        "iecp_2026": 27.15,
        "iecp_diff": 5.54,
        "iicp_2025": 17.66,
        "iicp_2026": 15.19,
        "iicp_diff": -2.47
    }
}

out_js_data = os.path.join(BASE_DIR, "data_bundle.js")
with open(out_js_data, 'w', encoding='utf-8') as f:
    f.write("const DASHBOARD_DATA = " + json.dumps(dashboard_data, indent=2, ensure_ascii=False) + ";\n")

print(f"Data bundle with 500k benchmark and Importancia Relativa updated at {out_js_data}")
