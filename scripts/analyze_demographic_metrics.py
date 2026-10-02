import sys
sys.stdout.reconfigure(encoding='utf-8')
import pandas as pd
import numpy as np

# Load microdata
df = pd.read_csv('data/processed/microdata_epec_2025_2026.csv', low_memory=False)

# Focus on 2026 (or 2025 + 2026 comparison)
df26 = df[df['ANIO_ENCUESTA'] == 2026].copy()

# P036: Edad
df26['P036'] = pd.to_numeric(df26['P036'], errors='coerce')

# Age groups
def get_age_group(age):
    if pd.isna(age):
        return 'S/D'
    if age < 30:
        return '18-29 años (Jóvenes)'
    elif age <= 44:
        return '30-44 años (Adultos Jóvenes)'
    elif age <= 59:
        return '45-59 años (Adultos Maduros)'
    else:
        return '60+ años (Adultos Mayores)'

df26['RANGO_EDAD'] = df26['P036'].apply(get_age_group)

# P285: Género (1: Masculino, 2: Femenino)
df26['GENERO'] = df26['P285'].map({1: 'Masculino', 2: 'Femenino'}).fillna('S/D')

# P037: Nivel de Escolaridad / Educación
# 1: Primaria incompleta, 2: Primaria completa, 3: Secundaria incompleta, 4: Secundaria completa
# 5: Superior incompleto, 6: Superior completo, 7: Universitario incompleto, 8: Universitario completo, 9: Posgrado
educ_map = {
    1: '1. Primaria Incompleta',
    2: '2. Primaria Completa',
    3: '3. Secundaria Incompleta',
    4: '4. Secundaria Completa',
    5: '5. Superior No Univ. Inc.',
    6: '6. Superior No Univ. Comp.',
    7: '7. Universitario Incompleto',
    8: '8. Universitario Completo',
    9: '9. Posgrado'
}
educ_macro_map = {
    1: 'Básico (Primaria)',
    2: 'Básico (Primaria)',
    3: 'Medio (Secundaria Inc.)',
    4: 'Medio (Secundaria Comp.)',
    5: 'Superior/Univ Incompleto',
    6: 'Superior Terciario Comp.',
    7: 'Superior/Univ Incompleto',
    8: 'Universitario Completo',
    9: 'Posgrado / Especialización'
}
educ_3tier_map = {
    1: 'Primaria / Básico',
    2: 'Primaria / Básico',
    3: 'Secundaria Incompleta',
    4: 'Secundaria Completa',
    5: 'Superior / Universitario',
    6: 'Superior / Universitario',
    7: 'Superior / Universitario',
    8: 'Superior / Universitario',
    9: 'Superior / Universitario'
}

df26['NIVEL_EDUC'] = df26['P037'].map(educ_macro_map).fillna('S/D')
df26['EDUC_3TIER'] = df26['P037'].map(educ_3tier_map).fillna('S/D')

# P283: Ingreso Familiar Mensual ($ ARS)
df26['P283'] = pd.to_numeric(df26['P283'], errors='coerce')
df26['INGRESO_VALIDO'] = df26['P283'].apply(lambda x: x if (pd.notna(x) and x > 0) else np.nan)

def get_income_bracket(val):
    if pd.isna(val) or val <= 0:
        return 'No declara / S/D'
    if val < 600000:
        return '1. Bajo (< $600k)'
    elif val <= 1200000:
        return '2. Medio ($600k - $1.2M)'
    elif val <= 2000000:
        return '3. Medio-Alto ($1.2M - $2M)'
    else:
        return '4. Alto (> $2M)'

df26['TRAMO_INGRESO'] = df26['INGRESO_VALIDO'].apply(get_income_bracket)

# Also let's extract satisfaction score (e.g. P001 or ISG if available)
print('=== 1. INGRESO MEDIO POR NIVEL EDUCATIVO Y GÉNERO ===')
t1 = df26.groupby(['EDUC_3TIER', 'GENERO'])['INGRESO_VALIDO'].agg(['count', 'mean', 'median']).round(0)
print(t1.to_string())

print('\n=== 2. INGRESO MEDIO POR RANGO DE EDAD Y GÉNERO ===')
t2 = df26.groupby(['RANGO_EDAD', 'GENERO'])['INGRESO_VALIDO'].agg(['count', 'mean', 'median']).round(0)
print(t2.to_string())

print('\n=== 3. DISTRIBUCIÓN EDUCATIVA POR RANGO DE EDAD (CRUCE GENERACIONAL) ===')
t3 = pd.crosstab(df26['RANGO_EDAD'], df26['EDUC_3TIER'], normalize='index') * 100
print(t3.round(2).to_string())

print('\n=== 4. MATRIZ CRUZADA COMPLETA: EDAD x EDUCACION x INGRESO MEDIO ===')
t4 = df26.pivot_table(index='RANGO_EDAD', columns='EDUC_3TIER', values='INGRESO_VALIDO', aggfunc=['mean', 'count']).round(0)
print(t4.to_string())

print('\n=== 5. DISTRIBUCION DE GÉNERO POR TRAMO DE INGRESO ===')
t5 = pd.crosstab(df26['TRAMO_INGRESO'], df26['GENERO'], normalize='index') * 100
print(t5.round(2).to_string())

print('\n=== 6. RESUMEN GLOBAL CORRELACIONES / METRICAS ===')
valid_sub = df26[['P036', 'P037', 'INGRESO_VALIDO', 'P285']].dropna()
print('Correlacion Edad vs Ingreso:', valid_sub['P036'].corr(valid_sub['INGRESO_VALIDO']).round(3))
print('Correlacion Educacion vs Ingreso:', valid_sub['P037'].corr(valid_sub['INGRESO_VALIDO']).round(3))
print('Correlacion Edad vs Educacion:', valid_sub['P036'].corr(valid_sub['P037']).round(3))
