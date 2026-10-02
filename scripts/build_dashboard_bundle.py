import os, sys, json
sys.stdout.reconfigure(encoding='utf-8')
import pandas as pd

BASE_DIR = r"C:\Users\jidiaz\.gemini\antigravity-ide\scratch\encuesta_cier"
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")

# 1. Load base data
df_comp = pd.read_csv(os.path.join(PROCESSED_DIR, "indices_comparativo_2025_2026.csv"))
indices_comp = df_comp.to_dict(orient='records')

df_sat = pd.read_csv(os.path.join(PROCESSED_DIR, "indices_satisfaccion_2026.csv"))
indices_sat = df_sat.to_dict(orient='records')

with open(os.path.join(PROCESSED_DIR, "catalogo_archivos.json"), 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open(os.path.join(PROCESSED_DIR, "diccionario_unificado.json"), 'r', encoding='utf-8') as f:
    diccionario = json.load(f)

with open(os.path.join(PROCESSED_DIR, "evolucion_importancia_relativa_2025_2026.json"), 'r', encoding='utf-8') as f:
    importancia_data = json.load(f)

# Benchmark 500k
df_bench = pd.read_excel(os.path.join(PROCESSED_DIR, "comparativo_distribuidores_500k.xlsx"))
benchmark_500k = df_bench.to_dict(orient='records')

# 2. Demographic Cross-Tabulation Data (Exact Computations from Microdata N=1250)
demografia_multidimensional = {
    "ingreso_por_educacion_y_genero": {
        "categorias": ["Primaria / Básico", "Secundaria Incompleta", "Secundaria Completa", "Superior / Universitario"],
        "femenino_media": [667628, 1002665, 1140253, 1549913],
        "masculino_media": [868139, 922171, 1391062, 1983385],
        "total_media": [740865, 975834, 1230825, 1710428],
        "femenino_mediana": [600000, 800000, 1200000, 1300000],
        "masculino_mediana": [600000, 850000, 1200000, 1500000],
        "muestra_n": {"femenino": [66, 64, 99, 163], "masculino": [38, 32, 56, 96]}
    },
    "ingreso_por_edad_y_genero": {
        "categorias": ["18-29 años (Jóvenes)", "30-44 años (Adultos Jóvenes)", "45-59 años (Adultos Maduros)", "60+ años (Adultos Mayores)"],
        "femenino_media": [1165152, 1260619, 1385037, 974059],
        "masculino_media": [1668551, 1800752, 1475781, 1197967],
        "total_media": [1416852, 1439413, 1409871, 1065707],
        "pct_estudios_superiores": [58.14, 41.72, 43.41, 36.60],
        "muestra_n": {"femenino": [41, 107, 130, 114], "masculino": [41, 53, 49, 79]}
    },
    "educacion_por_edad": {
        "cohortes": ["18-29 años (Gen Z)", "30-44 años (Millennials)", "45-59 años (Gen X)", "60+ años (Baby Boomers)"],
        "primaria": [0.00, 8.59, 14.84, 32.47],
        "secundaria_incompleta": [15.12, 21.47, 14.29, 11.34],
        "secundaria_completa": [26.74, 28.22, 27.47, 19.59],
        "superior_universitario": [58.14, 41.72, 43.41, 36.60]
    },
    "genero_por_tramo_ingreso": {
        "tramos": ["Bajo (< $600k)", "Medio ($600k - $1.2M)", "Medio-Alto ($1.2M - $2M)", "Alto (> $2M)"],
        "femenino_pct": [70.08, 64.09, 62.87, 57.00],
        "masculino_pct": [29.92, 35.91, 37.13, 43.00]
    },
    "correlaciones": {
        "educacion_vs_ingreso": 0.397,
        "edad_vs_ingreso": -0.149,
        "edad_vs_educacion": -0.181
    }
}

# 3. Generational Detractor Cards Data (INNOVARE / CIER)
tarjetas_detractores = [
    {
        "id": "gen-x",
        "generacion": "GENERACIÓN X",
        "franja_etaria": "46 a 61 años",
        "arquetipo": "Pragmatismo y Control",
        "color": "#f97316",
        "padron_pct": "28,80%",
        "alerta_principal": "Información sobre Medición del Consumo (IC05) y Plazos de Factura (FE01).",
        "penaliza": [
            "Variación de voltaje en electrodomésticos (SE02)",
            "Idoneidad y conocimiento del personal de atención (AT04)",
            "Falta de resolución definitiva en primer contacto (AT08)"
        ],
        "expectativa": "Transparencia absoluta en lecturas, estabilidad técnica y trámites sin burocracia."
    },
    {
        "id": "millennials",
        "generacion": "MILLENNIALS / GEN Y",
        "franja_etaria": "30 a 45 años",
        "arquetipo": "Calidad, Tiempo y Valor",
        "color": "#ef4444",
        "padron_pct": "31,20%",
        "alerta_principal": "Calidad de Atención al Cliente (AT06) y Tiempos de Espera (AT02).",
        "penaliza": [
            "Respeto a los derechos del cliente (IM01)",
            "Programas comunitarios y medioambientales (RSA)",
            "Relación costo/beneficio de la tarifa (PR)"
        ],
        "expectativa": "Omnicanalidad 24/7, respeto estricto por su tiempo, ética corporativa y sustentabilidad ambiental."
    },
    {
        "id": "gen-z",
        "generacion": "GENERACIÓN Z",
        "franja_etaria": "18 a 29 años",
        "arquetipo": "Inmediatez y Predictibilidad",
        "color": "#eab308",
        "padron_pct": "14,40%",
        "alerta_principal": "Aviso Anticipado de Interrupción (IC01) y Horario de Restitución (ETR).",
        "penaliza": [
            "Rapidez de reposición ante cortes imprevistos (SE03)",
            "Duración de la atención y trámites presenciales (AT03)",
            "Incumplimiento de plazos comprometidos (AT09)"
        ],
        "expectativa": "Notificaciones push móviles en tiempo real y servicios bajo demanda sin intermediarios."
    },
    {
        "id": "baby-boomers",
        "generacion": "BABY BOOMERS",
        "franja_etaria": "desde 62 años",
        "arquetipo": "Estabilidad y Acompañamiento",
        "color": "#10b981",
        "padron_pct": "25,60%",
        "alerta_principal": "Disponibilidad y Complejidad de Canales Digitales de Pago (FE04).",
        "penaliza": [
            "Digitalización forzada sin asistencia humana",
            "Falta de claridad en letra chica de la factura física"
        ],
        "expectativa": "Preservar ventanillas comerciales y soporte telefónico humano empático sin forzar la digitalización."
    }
]

# 4. Simulation Scenarios & Benchmark Targets
simulador_data = {
    "linea_base_epec": {
        "iscal": 65.96,
        "iac": 77.60,
        "iecp": 27.15,
        "iicp": 15.19
    },
    "benchmarks_referencia": {
        "total_cier_max": {"nombre": "Frontera Máxima Regional (UTE Uruguay)", "iscal": 86.40, "iac": 91.20},
        "top3_latam": {"nombre": "Promedio Top 3 LATAM (UTE, CNFL, ICE)", "iscal": 84.20, "iac": 89.00},
        "promedio_cier_500k": {"nombre": "Promedio CIER Gran Porte Regional", "iscal": 70.15, "iac": 78.50},
        "top2_argentina": {"nombre": "Promedio Top 2 Argentina (EDENOR y EDEA)", "iscal": 68.65, "iac": 77.65}
    },
    "escenarios_predefinidos": [
        {
            "id": "escenario-1",
            "titulo": "Escenario 1: Quick Wins Inmediatos",
            "subtitulo": "Resolver Casos Frontera de Facturación (FE01 y FE03 a 66 pts)",
            "descripcion": "Adelantar el envío de la factura digital 72 hs e incorporar infografía de consumo simplificada.",
            "impacto_iscal_pp": 0.29,
            "iscal_proyectado": 66.25,
            "posicion_competitiva": "Consolidación de Factura sin erogación presupuestaria relevante.",
            "valores_atributos": {"FE01": 66.0, "FE03": 66.0}
        },
        {
            "id": "escenario-2",
            "titulo": "Escenario 2: Meta Estándar Cuadrante I",
            "subtitulo": "Llevar los 7 atributos del Cuadrante I a 65 pts",
            "descripcion": "Mejora operativa equilibrada alcanzando la línea de suficiencia en todos los focos urgentes.",
            "impacto_iscal_pp": 3.08,
            "iscal_proyectado": 69.04,
            "posicion_competitiva": "¡SUPERA AL TOP 2 DE ARGENTINA (68.65%) Y SE CONSAGRA LÍDER NACIONAL!",
            "valores_atributos": {
                "FE01": 65.0, "FE03": 65.0, "IC01": 65.0, "AT01": 65.0, "AT02": 65.0, "IC03": 65.0, "IC05": 65.0
            }
        },
        {
            "id": "escenario-3",
            "titulo": "Escenario 3: Meta de Liderazgo con Sinergias",
            "subtitulo": "Elevar Cuadrante I a 68-70 pts y consolidar atributos frontera",
            "descripcion": "Implementar notificaciones automáticas por WhatsApp, turnero web, omnicanalidad y didáctica de medición.",
            "impacto_iscal_pp": 4.84,
            "iscal_proyectado": 70.80,
            "posicion_competitiva": "¡SUPERA LA MEDIA CIER REGIONAL (70.15%) E INGRESA AL TOP 5 DE AMÉRICA LATINA!",
            "valores_atributos": {
                "FE01": 70.0, "FE03": 68.0, "IC01": 70.0, "AT01": 70.0, "AT02": 68.0, "IC03": 68.0, "IC05": 68.0,
                "AT04": 76.0, "AT03": 72.0, "FE05": 74.0
            }
        }
    ],
    "atributos_simulables": [
        {"codigo": "FE01", "nombre": "Plazo entre recepción y vencimiento", "area": "FE", "imp_pct": 5.1057, "sat_base": 63.12, "cuadrante": "Q1 (Frontera)"},
        {"codigo": "FE03", "nombre": "Facilidad de comprensión de factura", "area": "FE", "imp_pct": 3.6202, "sat_base": 62.19, "cuadrante": "Q1 (Frontera)"},
        {"codigo": "IC01", "nombre": "Notificación previa de interrupción", "area": "IC", "imp_pct": 5.8543, "sat_base": 58.86, "cuadrante": "Q1 (Estructural)"},
        {"codigo": "AT01", "nombre": "Facilidad para contactarse", "area": "AT", "imp_pct": 5.4940, "sat_base": 58.32, "cuadrante": "Q1 (Estructural)"},
        {"codigo": "AT02", "nombre": "Tiempo de espera hasta ser atendido", "area": "AT", "imp_pct": 4.2913, "sat_base": 55.59, "cuadrante": "Q1 (Estructural)"},
        {"codigo": "IC03", "nombre": "Riesgos y peligros eléctricos", "area": "IC", "imp_pct": 3.6781, "sat_base": 50.08, "cuadrante": "Q1 (Estructural)"},
        {"codigo": "IC05", "nombre": "Medición del consumo de energía", "area": "IC", "imp_pct": 3.4161, "sat_base": 44.52, "cuadrante": "Q1 (Estructural)"},
        {"codigo": "AT04", "nombre": "Conocimiento del personal", "area": "AT", "imp_pct": 3.3108, "sat_base": 74.52, "cuadrante": "Q4 (Límite Q3)"},
        {"codigo": "AT03", "nombre": "Duración de la atención (Agilidad)", "area": "AT", "imp_pct": 3.1980, "sat_base": 69.46, "cuadrante": "Q4 (Límite Q3)"},
        {"codigo": "FE05", "nombre": "Fechas para el vencimiento", "area": "FE", "imp_pct": 2.8625, "sat_base": 70.97, "cuadrante": "Q4 (Límite Q3)"}
    ]
}

dashboard_data = {
    "indices_comparativo": indices_comp,
    "indices_satisfaccion": indices_sat,
    "catalogo_archivos": catalogo,
    "diccionario": diccionario,
    "benchmark_500k": benchmark_500k,
    "importancia_relativa": importancia_data,
    "demografia_multidimensional": demografia_multidimensional,
    "tarjetas_detractores": tarjetas_detractores,
    "simulador_mejora_iscal": simulador_data,
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

print(f"Data bundle successfully rebuilt with Multidimensional Demographics, Detractors & Simulation at {out_js_data}")
