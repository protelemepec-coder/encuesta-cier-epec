# Informe Técnico de Sesión: Cruces Multidimensionales, Segmentación Generacional y Simulador de Metas ISCAL
**Empresa:** Empresa Provincial de Energía de Córdoba (EPEC)  
**Proyecto:** Encuesta de Satisfacción Residencial CIER (Rondas 2025 - 2026)  
**Muestra Auditada:** N = 1.250 casos (625 en 2025 y 625 en 2026)  
**Fuente Única de Verdad (SSOT):** Informe Individual CIER 2026 EPEC-AR (Pág. 94) y Microdatos CAPI  
**Fecha de Documentación:** Octubre 2026  
**Enlace al Dashboard en Vivo:** [https://protelemepec-coder.github.io/encuesta-cier-epec/](https://protelemepec-coder.github.io/encuesta-cier-epec/)

---

## 1. Resumen Ejecutivo de la Sesión

En la sesión de trabajo se completó la integración analítica y el desarrollo de nuevas capacidades interactivas en el Dashboard Oficial CIER de EPEC, abordando tres ejes principales:

1. **Cruces Sociodemográficos Multidimensionales:** Se cruzaron simultáneamente las variables de ingreso familiar (ARS/mes), nivel de instrucción formal, franjas etarias/cohortes generacionales y distribución por género a partir de los microdatos auditados (N=1.250).
2. **Fichas de Arquetipos Generacionales (INNOVARE / CIER):** Se modelaron las 4 tarjetas de segmentación generacional (Gen X, Millennials/Gen Y, Gen Z y Baby Boomers) con sus alertas críticas, aspectos penalizados y expectativas prioritarias.
3. **Simulador Interactivo de Metas ISCAL & Matriz de Sinergias:** Se construyó un motor de simulación matemática que permite proyectar en tiempo real el crecimiento del índice ISCAL ante metas operativas alcanzables en los 10 atributos de mayor apalancamiento, contrastando contra los estándares de Argentina (EDENOR/EDEA 68,65%), la Media Regional CIER (70,15%) y la Frontera Máxima (UTE Uruguay 86,40%).

---

## 2. Cruces Sociodemográficos Multidimensionales (N = 1.250)

### 2.1. Ingreso Familiar Medio y Mediana según Nivel Educativo y Género
Existe un gradiente salarial ascendente muy pronunciado en función de los años de educación formal. El nivel superior o universitario incrementa el ingreso familiar en un +130,9% respecto a los hogares con educación primaria.

| Nivel de Instrucción | Ingreso Medio Mujeres ($ ARS) | Ingreso Medio Varones ($ ARS) | Ingreso Medio Total ($ ARS) | Mediana Total ($ ARS) | Casos Muestra (N) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Primaria / Básico** | $ 667.628 | $ 868.139 | **$ 740.865** | $ 600.000 | 104 |
| **Secundaria Incompleta** | $ 1.002.665 | $ 922.171 | **$ 975.834** | $ 800.000 | 96 |
| **Secundaria Completa** | $ 1.140.253 | $ 1.391.062 | **$ 1.230.825** | $ 1.200.000 | 155 |
| **Superior / Universitario** | $ 1.549.913 | $ 1.983.385 | **$ 1.710.428** | $ 1.400.000 | 259 |

* **Correlación de Pearson (Educación vs. Ingreso):** **r = +0,397** (Correlación positiva moderada a fuerte).

### 2.2. Ingreso Familiar Medio según Franja de Edad y Género
El pico de generación de ingresos se ubica en las etapas laborales activas (18 a 59 años), con una caída de ingresos al ingresar a la etapa jubilatoria (>60 años).

| Franja Etaria / Cohorte | Ingreso Medio Mujeres ($ ARS) | Ingreso Medio Varones ($ ARS) | Ingreso Medio Total ($ ARS) | % Estudios Superiores | Casos Muestra (N) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **18-29 años (Jóvenes / Gen Z)** | $ 1.165.152 | $ 1.668.551 | **$ 1.416.852** | 58,14% | 82 |
| **30-44 años (Adultos Jóvenes / Millennials)** | $ 1.260.619 | $ 1.800.752 | **$ 1.439.413** | 41,72% | 160 |
| **45-59 años (Adultos Maduros / Gen X)** | $ 1.385.037 | $ 1.475.781 | **$ 1.409.871** | 43,41% | 179 |
| **60+ años (Adultos Mayores / Boomers)** | $ 974.059 | $ 1.197.967 | **$ 1.065.707** | 36,60% | 193 |

* **Correlación de Pearson (Edad vs. Ingreso):** **r = -0,149** (Correlación negativa leve).
* **Correlación de Pearson (Edad vs. Nivel Educativo):** **r = -0,181** (Mayor concentración de títulos superiores en las cohortes jóvenes).

### 2.3. Distribución de Género por Tramo Salarial
- **Tramo Bajo (< $600k):** Mujeres 70,08% | Varones 29,92%
- **Tramo Medio ($600k - $1.2M):** Mujeres 64,09% | Varones 35,91%
- **Tramo Medio-Alto ($1.2M - $2M):** Mujeres 62,87% | Varones 37,13%
- **Tramo Alto (> $2M):** Mujeres 57,00% | Varones 43,00%

---

## 3. Segmentación Generacional de Clientes (Metodología INNOVARE / CIER)

```
+-------------------------------------------------------------------------------------------------------+
| ARQUETIPOS GENERACIONALES DE DETRACTORES Y EXPECTATIVAS DE SERVICIO                                   |
+-------------------------------------------------------------------------------------------------------+
| 1. GENERACIÓN X (46 a 61 años) · 28,80% del Padrón                                                    |
|    Arquetipo: Pragmatismo y Control                                                                   |
|    Alerta Principal: Medición del Consumo (IC05) y Plazos de Factura (FE01)                           |
|    Penaliza: Variación de voltaje (SE02), idoneidad personal (AT04), falta de resolución (AT08)       |
|    Expectativa: Transparencia absoluta en lecturas, estabilidad técnica y trámites sin burocracia.     |
+-------------------------------------------------------------------------------------------------------+
| 2. MILLENNIALS / GEN Y (30 a 45 años) · 31,20% del Padrón                                             |
|    Arquetipo: Calidad, Tiempo y Valor                                                                 |
|    Alerta Principal: Calidad de Atención (AT06) y Tiempos de Espera (AT02)                           |
|    Penaliza: Respeto a derechos del cliente (IM01), programas comunitarios (RSA), tarifa (PR)        |
|    Expectativa: Omnicanalidad 24/7, respeto por su tiempo, ética corporativa y sustentabilidad.       |
+-------------------------------------------------------------------------------------------------------+
| 3. GENERACIÓN Z (18 a 29 años) · 14,40% del Padrón                                                    |
|    Arquetipo: Inmediatez y Predictibilidad                                                            |
|    Alerta Principal: Aviso Anticipado de Corte (IC01) y Horario Estimado de Restitución (ETR)         |
|    Penaliza: Reposición lenta imprevista (SE03), trámites presenciales (AT03), plazos rotos (AT09)    |
|    Expectativa: Notificaciones push móviles en tiempo real y autogestión sin intermediarios.          |
+-------------------------------------------------------------------------------------------------------+
| 4. BABY BOOMERS (desde 62 años) · 25,60% del Padrón                                                   |
|    Arquetipo: Estabilidad y Acompañamiento                                                            |
|    Alerta Principal: Complejidad de Canales Digitales de Pago (FE04)                                  |
|    Penaliza: Digitalización forzada sin asistencia humana, letra chica de la factura física           |
|    Expectativa: Preservar ventanillas comerciales y soporte telefónico empático sin forzamiento.       |
+-------------------------------------------------------------------------------------------------------+
```

---

## 4. Simulador Interactivo de Metas ISCAL

### 4.1. Fundamento Matemático
El índice ISCAL es una combinación lineal ponderada de los 30 atributos canónicos de calidad percibida:

$$\text{ISCAL} = \sum_{i=1}^{30} \left( \frac{\text{Importancia Relativa } i}{100} \times \text{Desempeño } i \right)$$

Dado que la suma de ponderaciones equivale a $100,0\%$, el incremento generado por cualquier meta sobre un atributo $i$ es exactamente proporcional a su peso en la satisfacción global:

$$\Delta \text{ISCAL} = \sum_{i=1}^{k} \left[ \frac{\text{Importancia } i}{100} \times (\text{Meta } i - \text{Base 2026 } i) \right]$$

### 4.2. Escenarios Predefinidos y Metas Alcanzables

| Escenario | Metas Calibradas por Atributo | ISCAL Proyectado | Delta vs Base | Impacto Competitivo |
| :--- | :--- | :---: | :---: | :--- |
| **Línea Base 2026** | Desempeño verificado en la ronda 2026 | **65,96%** | +0,00 pp | Posición #3 en Argentina (>500k clientes) |
| **Escenario 1: Quick Wins Factura** | **FE01** a 66,0 pts (desde 63,12)<br>**FE03** a 66,0 pts (desde 62,19) | **66,25%** | **+0,29 pp** | Consolidación de Facturación sin requerir inversión presupuestaria de envergadura. |
| **Escenario 2: Meta Estándar Cuadrante I** | **Los 7 Atributos de Q1** elevados al umbral de suficiencia de **65,0 pts** (FE01, FE03, IC01, AT01, AT02, IC03, IC05) | **69,04%** | **+3,08 pp** | 🏆 **¡SUPERA AL TOP 2 DE ARGENTINA (EDENOR Y EDEA: 68,65%) Y CONSAGRA A EPEC COMO LÍDER NACIONAL!** |
| **Escenario 3: Liderazgo con Sinergias** | **Atributos de Q1** elevados a 68-70 pts + **Atributos Límite Q4** consolidados (AT04 a 76, AT03 a 72, FE05 a 74) | **70,80%** | **+4,84 pp** | 🌎 **¡SUPERA LA MEDIA REGIONAL CIER (70,15%) E INGRESA AL TOP 5 DE AMÉRICA LATINA!** |

---

## 5. Matriz de Sinergias Operativas y Oportunidades Observadas

### 5.1. Grupo A: Facturación Frontera (FE01 + FE03) · Peso Conjunto: 8,73%
- **Diagnóstico:** Ambos atributos se ubican en el límite del Cuadrante I (FE01 en 63,12 pts e Imp 5,11%; FE03 en 62,19 pts e Imp 3,62%).
- **Acción Operativa:** Adelantar 72 horas el envío digital de la factura e incorporar infografía de barras comparativas de consumo.
- **Impacto:** Con una mejora moderada a 66 pts, aporta **+0,29 pp** al ISCAL.

### 5.2. Grupo B: Atención Estructural (AT01 + AT02) · Peso Conjunto: 9,79%
- **Diagnóstico:** AT01 (Facilidad de Contacto, 58,32 pts e Imp 5,49%) y AT02 (Tiempo de Espera, 55,59 pts e Imp 4,29%) concentran el principal foco de frustración en clientes Millennials.
- **Acción Operativa:** Turnero digital integrado con geolocalización de sucursales y optimización del menú IVR telefónico.
- **Impacto:** Elevar a 65 pts genera un salto directo de **+0,77 pp** en el ISCAL.

### 5.3. Grupo C: Comunicación Preventiva (IC01 + IC03 + IC05) · Peso Conjunto: 12,95%
- **Diagnóstico:** IC01 (Aviso de Corte, 58,86 pts e Imp 5,85%), IC03 (Peligros Eléctricos, 50,08 pts e Imp 3,68%) e IC05 (Medición de Energía, 44,52 pts e Imp 3,42%).
- **Acción Operativa:** Bot de notificaciones por WhatsApp para cortes programados e infografías didácticas de cómo leer el medidor.
- **Impacto:** Elevar este bloque a 65 pts aporta **+2,02 pp** al ISCAL.

### 5.4. Grupo D: Virtudes en el Límite de Fortalezas (AT04 + AT03 + FE05) · Peso Conjunto: 9,37%
- **Diagnóstico:** Atributos con desempeño destacado que rozan el umbral de importancia del Cuadrante III (AT04 en 74,52 pts e Imp 3,31%; AT03 en 69,46 pts e Imp 3,20%; FE05 en 70,97 pts e Imp 2,86%).
- **Acción Operativa:** Preservar la capacitación del personal comercial y mantener la flexibilidad en fechas de pago.
- **Impacto:** Asegura la retención de promotores netos y estabiliza el scoring global.

---

## 6. Registro de Cambios Técnicos en el Código y Despliegue

1. **`data_bundle.js`:** Actualizado con 20 estructuras de datos en UTF-8 puro (`demografia_multidimensional`, `tarjetas_detractores`, `simulador_mejora_iscal`).
2. **`index.html`:** Incorporados los contenedores de las 4 gráficas multidimensionales, las 4 tarjetas generacionales y el panel interactivo del simulador de metas con barras de progreso comparativas.
3. **`app.js`:** Implementadas las funciones `initDemografiaMultidimensionalCharts()`, `renderGenerationalCards()`, `initIscalSimulator()`, `onSimulatorSliderChange()`, `updateSimulatorCalculations()`, `applySimulatorScenario()` y `resetSimulator()`.
4. **`style.css`:** Añadidas 480 líneas de estilos para controles de rango, banners de estado con códigos de color, medidores de porcentaje con líneas de corte objetivo y tarjetas generacionales responsivas.
5. **Ramas Git & Remotos Desplegados:** Sincronizado y publicado en las ramas `main` de `coder` y `protelem`.

---
*Fin del Informe Técnico de Sesión.*
