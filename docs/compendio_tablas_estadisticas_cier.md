# 📚 Compendio Integral de Tablas Estadísticas y Metodológicas: Encuesta CIER EPEC (2025 - 2026)

**Distribuidora**: Empresa Provincial de Energía de Córdoba (EPEC)  
**Muestra Auditada**: $N = 1.250$ encuestas residenciales (625 en 2025 y 625 en 2026)  
**Error Muestral**: $\pm 3.92\%$ (Nivel de Confianza $95\%$)  
**Fuente Única de la Verdad (SSOT)**: `data/processed/microdata_epec_2025_2026.csv` & `data_bundle.js`  
**Fecha de Consolidación**: 2026-09-25  

---

## 📑 Índice Ordenado de Tablas Estadísticas

1. [**Tabla 1**: Taxonomía y Estructura Metodológica de los 6 Módulos del Cuestionario CIER (97 Preguntas / 151 Variables)](#tabla-1-taxonomía-y-estructura-metodológica-de-los-6-módulos-del-cuestionario-cier)
2. [**Tabla 2**: Tablas de Desempeño (IDAT / IDAR) e Importancia Relativa (IR) por Área Evaluada (2025 vs. 2026 con $\Delta$ y Cuadrante IPA)](#tabla-2-desempeño-idat--idar-e-importancia-relativa-ir-por-área-evaluada)
3. [**Tabla 3**: Diagnóstico Profundo de Microdatos del Módulo 3 (Comportamiento, Canales, FCR y Reclamos)](#tabla-3-diagnóstico-profundo-de-microdatos-del-módulo-3-canales-y-reclamos)
4. [**Tabla 4**: Diagnóstico Profundo de Microdatos del Módulo 6 (Frecuencias, Plazos, Preaviso y Orientación)](#tabla-4-diagnóstico-profundo-de-microdatos-del-módulo-6-frecuencias-y-plazos)
5. [**Tabla 5**: Auditoría y Distribución de las 6 Preguntas Directas de Síntesis y Cierre (2025 vs. 2026)](#tabla-5-auditoría-y-distribución-de-las-6-preguntas-directas-de-síntesis-y-cierre)
6. [**Tabla 6**: Arquitectura y Cuenta de Preguntas del Módulo 2 por Indicador / Área del ISCAL (151 Variables)](#tabla-6-cuenta-de-preguntas-del-módulo-2-por-indicador--área-del-iscal)
7. [**Tabla 7**: Matriz de Separación de Preguntas Directas de Indicadores vs. Preguntas Complementarias de Diagnóstico](#tabla-7-matriz-de-separación-preguntas-directas-vs-preguntas-complementarias)

---

## 🏛️ Tabla 1: Taxonomía y Estructura Metodológica de los 6 Módulos del Cuestionario CIER

| Módulo Temático | Cantidad Preguntas / Variables | Fuente de Captura Principal | Tipología de Datos / Escalas | Propósito Metodológico y Diagnóstico |
| :--- | :---: | :---: | :--- | :--- |
| **Módulo 1: Identificación, Filtros y Control Muestral** | **8 variables** | 📱 Encuestador CAPI / GPS | Coordenadas GPS, Datos de Factura, ID de Manzana/Lote, Filtros binarios (Sí/No) | Garantizar la representatividad estadística, aleatoriedad del punto muestral y validación de cliente residencial activo. |
| **Módulo 2: Preguntas Evaluativas para Indicadores del ISCAL** | **151 variables** | 👤 Cliente (Tarjeta Visual) | Escala Likert ordinal graduada (1 a 10) | Captura de notas atómicas de satisfacción e importancia para los 30 atributos troncales, áreas de servicio y cierre. |
| **Módulo 3: Comportamiento, Canales y Reclamos** | **121 variables** | 👤 Cliente (Declaración guiada) | Conteos de frecuencia, Canales categóricos, Dicotómicas (FCR Sí/No), 16 causales de reclamo | Diagnosticar la experiencia omnicanal, tasa de reiteración de llamadas/visitas y efectividad de resolución en primer contacto. |
| **Módulo 4: Cortes, Voltaje y Tiempos Técnicos** | **6 variables** | 👤 Cliente / Factura | Variables numéricas discretas (conteo de cortes), horas de duración, escalas de frecuencia | Auditar la continuidad técnica percibida frente a registros reales de SAIDI/SAIFI y evaluar impacto de sobretensiones. |
| **Módulo 5: Perfil Sociodemográfico del Hogar** | **10 variables** | 👤 Cliente / Encuestador | Rango etario, Nivel educativo, Tramo de ingreso ($ ARS), Cantidad de habitantes, Género | Segmentar la satisfacción por nivel socioeconómico (NSE) y caracterizar los perfiles de promotores vs. detractores. |
| **Módulo 6: Frecuencias de Orientación, Plazos y Pedagógicos** | **12 variables** | 👤 Cliente | Frecuencia de preaviso de cortes, días hábiles de margen de factura, comprensión de medidor | Evaluar la eficacia comunicacional preventiva, claridad de facturación y efectividad de guías de uso eficiente de energía. |

---

## ⚡ Tabla 2: Desempeño (IDAT / IDAR) e Importancia Relativa (IR) por Área Evaluada

*Escala de Desempeño: Base 0 a 100%. Importancia Relativa (IR): Ponderador econométrico derivado de regresión multivariable.*

| Área / Código Atributo | Enunciado Evaluado CIER | IDAT 2025 (%) | IDAT 2026 (%) | Variación $\Delta$ | Peso IR (%) | Cuadrante Matriz IPA |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **⚡ SUMINISTRO DE ENERGÍA (SE)** | **Índice de Desempeño del Área (IDAR)** | **75.79%** | **78.48%** | **+2.69** | **33.79%** | **Pilar Central ISCAL** |
| - `SE1` | Continuidad en el suministro (sin cortes imprevistos) | 82.35% | 85.92% | +3.57 | 13.78% | ⭐ Cuadrante II: Fortaleza Clave |
| - `SE2` | Calidad y estabilidad de tensión (sin fluctuaciones) | 73.65% | 77.40% | +3.75 | 11.23% | ⭐ Cuadrante II: Fortaleza Clave |
| - `SE3` | Rapidez en el restablecimiento del servicio tras cortes | 69.10% | 72.12% | +3.02 | 8.78% | ⭐ Cuadrante II: Fortaleza Clave |
| **👤 ATENCIÓN AL CLIENTE (AT)** | **Índice de Desempeño del Área (IDAR)** | **66.63%** | **68.10%** | **+1.47** | **21.45%** | **Dimensión Estratégica** |
| - `AT1` | Rapidez y facilidad de atención telefónica (0800) | 56.40% | 58.32% | +1.92 | 4.85% | 🚨 Cuadrante I: Foco Urgente |
| - `AT2` | Rapidez y agilidad en centros comerciales presenciales | 54.12% | 55.59% | +1.47 | 4.10% | 🚨 Cuadrante I: Foco Urgente |
| - `AT3` | Cortesía, respeto y predisposición del personal | 75.80% | 77.63% | +1.83 | 2.50% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `AT4` | Claridad y precisión en las respuestas brindadas | 71.30% | 72.85% | +1.55 | 2.25% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `AT5` | Capacidad de resolución efectiva del trámite | 66.90% | 68.45% | +1.55 | 2.15% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `AT6` | Facilidad de uso e interacción en canales digitales | 72.10% | 74.30% | +2.20 | 1.95% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `AT7` | Cumplimiento estricto de plazos comprometidos | 64.50% | 66.44% | +1.94 | 1.45% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `AT8` | Claridad y simplicidad de requisitos solicitados | 71.80% | 73.20% | +1.40 | 1.15% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `AT9` | Comodidad, señalización y estado de instalaciones | 72.60% | 74.15% | +1.55 | 1.05% | ⚡ Cuadrante III: Ventaja Secundaria |
| **📄 FACTURA DE ENERGÍA (FE)** | **Índice de Desempeño del Área (IDAR)** | **70.21%** | **70.38%** | **+0.17** | **18.20%** | **Dimensión Relevante** |
| - `FE1` | Claridad y transparencia en conceptos facturados | 62.40% | 63.12% | +0.72 | 5.20% | 🚨 Cuadrante I: Foco Urgente |
| - `FE2` | Tiempo adecuado entre entrega y vencimiento | 68.70% | 69.56% | +0.86 | 4.65% | ⭐ Cuadrante II: Fortaleza Clave |
| - `FE3` | Confiabilidad en la medición del consumo real | 61.50% | 62.19% | +0.69 | 3.85% | 🚨 Cuadrante I: Foco Urgente |
| - `FE4` | Diversidad y accesibilidad de opciones de pago | 84.10% | 85.97% | +1.87 | 2.40% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `FE5` | Entrega regular y puntual de la factura | 69.80% | 70.97% | +1.17 | 1.25% | ⚡ Cuadrante III: Ventaja Secundaria |
| - `FE6` | Claridad y detalle del gráfico de consumo histórico | 58.90% | 59.80% | +0.90 | 0.85% | 🔍 Cuadrante IV: Baja Prioridad |
| **🏛️ IMAGEN INSTITUCIONAL (IM)** | **Índice de Desempeño del Área (IDAR)** | **56.54%** | **60.53%** | **+3.99** | **14.12%** | **Dimensión de Soporte** |
| - `IM1` | Confianza y credibilidad institucional en EPEC | 54.30% | 58.20% | +3.90 | 3.10% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IM2` | Compromiso con el desarrollo social de la provincia | 58.20% | 62.40% | +4.20 | 2.80% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IM3` | Honestidad, ética y transparencia corporativa | 51.40% | 55.60% | +4.20 | 2.45% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IM4` | Cuidado y preservación del medio ambiente | 59.80% | 63.90% | +4.10 | 2.15% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IM5` | Preocupación por la seguridad en la vía pública | 64.10% | 68.43% | +4.33 | 1.65% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IM6` | Innovación y modernización técnica | 57.60% | 61.80% | +4.20 | 1.12% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IM7` | Aporte estratégico al progreso provincial | 62.10% | 66.25% | +4.15 | 0.85% | 🔍 Cuadrante IV: Baja Prioridad |
| **📢 INFORMACIÓN Y COMUNICACIÓN (IC)** | **Índice de Desempeño del Área (IDAR)** | **46.46%** | **52.03%** | **+5.57** | **4.59%** | **Dimensión Táctica** |
| - `IC1` | Aviso previo y oportuno de cortes programados | 52.80% | 58.86% | +6.06 | 1.55% | 🚨 Cuadrante I: Foco Urgente |
| - `IC2` | Información sobre uso eficiente y ahorro de energía | 52.10% | 57.81% | +5.71 | 1.10% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IC3` | Información sobre causas y tiempos de cortes imprevistos | 44.20% | 50.08% | +5.88 | 0.95% | 🚨 Cuadrante I: Foco Urgente |
| - `IC4` | Difusión de normas de seguridad eléctrica | 42.90% | 48.37% | +5.47 | 0.55% | 🔍 Cuadrante IV: Baja Prioridad |
| - `IC5` | Información sobre la composición de la tarifa | 38.60% | 44.52% | +5.92 | 0.44% | 🚨 Cuadrante I: Foco Urgente |
| **🌿 RESPONSABILIDAD SOCIOAMBIENTAL (RSA)** | **Índice de Desempeño del Área (IDAR)** | **55.34%** | **59.57%** | **+4.23** | **7.85%** | **Transversal** |
| **ISCAL GLOBAL REINA CIER** | **Ponderación Total $\sum (\text{IDAR}_i \times \text{IR}_i)$** | **63.69 pts** | **65.96 pts** | **+2.27 pts (+3.56%)** | **100.00%** | **Calidad Percibida Global** |

---

## 👥 Tabla 3: Diagnóstico Profundo de Microdatos del Módulo 3 (Canales y Reclamos)

*Muestra: Clientes con interacción operativa en el último año ($N=294$ declarantes de reclamo / $N=1.250$ total).*

| Métrica / Variable de Canales y Reclamos | Indicador / Cifra EPEC 2026 | Benchmark / Meta Operativa | Interpretación Diagnóstica y Fricción |
| :--- | :---: | :---: | :--- |
| **Tasa de Interacción Anual con EPEC** | **23.52%** ($N=294$) | $<20.00\%$ | 1 de cada 4 usuarios tuvo necesidad de contactar formalmente a la empresa. |
| **Resolución en Primer Contacto (FCR - First Contact Resolution)** | **55.43%** ($N=163$) | $>75.00\%$ | 🚨 **Punto Crítico**: El 44.57% no resolvió su necesidad en la primera interacción. |
| **Tasa de Reiteración Operativa ($\ge 2$ contactos)** | **41.20%** ($N=121$) | $<15.00\%$ | Causa directa de insatisfacción en tiempos de espera telefónicos y presenciales. |
| **Canal 1: Teléfono 0800 Tradicional** | **48.30%** de participación | Canal Líder | Canal prioritario para emergencias técnicas y contingencias climáticas. |
| **Canal 2: App Móvil EPEC / Web Institucional** | **24.60%** de participación | En Crecimiento | Canal con mayor satisfacción atribuida (`AT6: 74.30%`). |
| **Canal 3: Centros Comerciales Presenciales** | **17.20%** de participación | En Descenso | Canal concentrado en trámites de titularidad, deudas y tarifa social. |
| **Canal 4: WhatsApp / Redes Sociales** | **9.90%** de participación | Oportunidad | Espacio de crecimiento masivo para descongestionar el 0800. |
| **Top Causal 1: Falta de Suministro Prolongada** | **38.40%** de reclamos | Contingencia | Vinculado a tormentas y fallas en media/baja tensión. |
| **Top Causal 2: Fluctuaciones / Baja Tensión** | **22.10%** de reclamos | Calidad Técnica | Disperso en zonas periurbanas y finales de línea de distribución. |
| **Top Causal 3: Dudas o Errores de Facturación** | **18.60%** de reclamos | Comercial | Dudas por estacionalidad de invierno/verano y lectura de medidor. |

---

## ⏱️ Tabla 4: Diagnóstico Profundo de Microdatos del Módulo 6 (Frecuencias y Plazos)

| Variable de Plazos y Orientación | Valor Observado 2026 | Rango Óptimo / Meta | Diagnóstico de Percepción y Cumplimiento |
| :--- | :---: | :---: | :--- |
| **Preaviso de Cortes Programados: "Siempre / Casi Siempre"** | **34.20%** | $>70.00\%$ | 🚨 Solo 1 de cada 3 clientes percibe aviso previo efectivo antes de obras en red. |
| **Preaviso de Cortes Programados: "A veces"** | **28.40%** | - | Zona de incertidumbre que genera quejas en canales de atención. |
| **Preaviso de Cortes Programados: "Rara vez / Nunca"** | **37.40%** | $<10.00\%$ | Causa principal de la ubicación de `IC1` en el Cuadrante I (Foco Urgente). |
| **Margen Real entre Entrega de Factura y Vencimiento** | **11.4 días hábiles** | $\ge 10$ días | 🟢 Fortaleza operativa: cumple el estándar legal y técnico de margen de pago. |
| **Comprensión de la Lectura del Medidor** | **52.34%** | $>75.00\%$ | Brecha pedagógica: casi la mitad no sabe cotejar los kWh leídos en su equipo. |
| **Comprensión de la Estructura Tarifaria (`IC5`)** | **44.52%** | $>60.00\%$ | Atributo con la nota más baja de la encuesta; requiere desagregación pedagógica. |
| **Canal de Recepción de Factura: Digital (Email/App)** | **61.80%** | $>80.00\%$ | Avance sostenido en desmaterialización y reducción de huella de carbono. |
| **Canal de Recepción de Factura: Formato Papel Tradicional** | **38.20%** | $<20.00\%$ | Segmento de adultos mayores que aún exige entrega física puntual. |

---

## 🎯 Tabla 5: Auditoría y Distribución de las 6 Preguntas Directas de Síntesis y Cierre

| # | Dimensión de Síntesis | Variable | EPEC 2025 | EPEC 2026 | $\Delta$ Interanual | Distribución de Respuestas 2026 ($N=1.250$) |
| :-: | :--- | :---: | :---: | :---: | :---: | :--- |
| **1** | **Satisfacción General (ISG)** | `P162` | 61.12 pts | **65.60 pts** | **+4.48 pts (+7.33%)** | Notas 1-4: **8.88%** \| Notas 5-6: **24.72%** \| Notas 7-8: **46.00%** \| Notas 9-10: **20.40%** |
| **2** | **Aprobación Institucional (IAC)** | `P166` | 75.68% | **77.60%** | **+1.92 p.p.** | **Aprueba EPEC: 77.60%** ($N=970$) \| Desaprueba: **22.40%** ($N=280$) |
| **3** | **Distribuidora Ideal (Disconfirmación / IIS)** | `P165` | 76.50% | **77.56%** | **+1.06 p.p.** | Mucho Mejor/Mejor: **22.80%** \| Igual a la Ideal: **58.40%** \| Peor/Mucho Peor: **18.80%** |
| **4** | **Valor por Dinero / Tarifa Justa** | `P164` | 53.40 pts | **57.10 pts** | **+3.70 pts** | Cara/Excesiva: **44.32%** \| **Justa/Adecuada: 49.68%** \| Barata: **6.00%** |
| **5** | **Predisposición a Recomendar (NPS)** | `P163` | +3.95 pts | **+11.96 pts** | **+8.01 pts** | **Promotores (9-10): 27.15%** \| Pasivos (7-8): **57.66%** \| **Detractores (1-6): 15.19%** |
| **6** | **Evolución Percibida del Servicio** | `P167` | - | - | **Balance +12.80 p.p.** | **Mejoró: 24.80%** \| Se Mantiene Igual: **63.20%** \| Empeoró: **12.00%** |

---

## 🧮 Tabla 6: Cuenta de Preguntas del Módulo 2 por Indicador / Área del ISCAL

| Dimensión / Indicador del ISCAL | Peso IR Oficial (%) | IDAR 2026 (%) | Cant. Preguntas / Variables | Atributos Troncales CIER Asignados | Rango de Variables Microdatos | Propósito Metodológico en el ISCAL |
| :--- | :---: | :---: | :---: | :--- | :---: | :--- |
| **⚡ Suministro de Energía (SE)** | **33.79%** | **78.48%** | **19 preguntas** | `SE1`, `SE2`, `SE3`, `SE-G` | `P039`, `P053-P055`, `P121`, `P129-P136`, `P142-P143` | Pilar Central: Aporta **+26.52 pts** directos al ISCAL (40.2% del total). |
| **👤 Atención al Cliente (AT)** | **21.45%** | **68.10%** | **18 preguntas** | `AT1` a `AT9` (0800, Oficinas, Cortesía, Digital) | `P090`, `P093`, `P112`, `P124`, `P178-P189`, `P201` | Dimensión Estratégica: Aporta **+14.61 pts** directos al ISCAL (22.2% del total). |
| **📄 Factura de Energía (FE)** | **18.20%** | **70.38%** | **16 preguntas** | `FE1` a `FE6` (Claridad, Vencimiento, Medición, Pago) | `P015-P017`, `P065`, `P072-P077`, `P123`, `P155-P158` | Dimensión Relevante: Aporta **+12.81 pts** directos al ISCAL (19.4% del total). |
| **🏛️ Imagen Institucional (IM)** | **14.12%** | **60.53%** | **14 preguntas** | `IM1` a `IM7` (Confianza, Seguridad, Innovación) | `P109`, `P114`, `P125`, `P198`, `P203-P210` | Dimensión de Soporte: Aporta **+8.55 pts** directos al ISCAL (13.0% del total). |
| **📢 Información y Comunicación (IC)** | **4.59%** | **52.03%** | **12 preguntas** | `IC1` a `IC5` (Preaviso, Ahorro, Riesgos, Tarifas) | `P061-P064`, `P092`, `P094`, `P110`, `P122`, `P148-P150` | Dimensión Táctica: Aporta **+2.39 pts** directos al ISCAL (3.6% del total). |
| **🌿 Responsabilidad Socioambiental (RSA)** | **7.85%** | **59.57%** | **8 preguntas** | `RSA1` a `RSA4` (Medio Ambiente, Inclusión, Comunidad) | `P114`, `P117-P120`, `P203`, `P214-P215` | Dimensión Transversal: Aporte complementario al modelo. |
| **⚖️ Batería de Importancia Relativa Declarada** | *Control* | *Escala 1-10* | **58 preguntas** | Pares de contraste de los 30 atributos (`P053` a `P120`) | `P053` a `P120` | Calibración Econométrica declarada vs. regresión multivariable. |
| **🎯 Preguntas de Síntesis y Cierre** | *Control* | *Base 100* | **6 preguntas** | `ISG`, `IAC`, `IIS` (Ideal), `PR` (Tarifa), `NPS`, `Evolución` | `P162` a `P167` | Validación Holística y consistencia de agregación (`ISCAL: 65.96` vs `ISG: 65.60`). |
| **TOTAL MÓDULO 2 EVALUATIVO** | **100.00%** | **65.96 pts** | **151 preguntas** | **30 Atributos Troncales CIER** | `P015` a `P215` | **Ecosistema Completo de Calidad Percibida CIER** |

---

## 🔀 Tabla 7: Matriz de Separación: Preguntas Directas vs. Preguntas Complementarias

| Dimensión / Área Evaluada | 🎯 Preguntas Directas para Indicadores (ISCAL / IDAT / IDAR / Cierre) | 💡 Preguntas Complementarias de Diagnóstico y Causa Raíz | 🔬 Información Estratégica que Aporta el Cruce (Insight Operativo) |
| :--- | :--- | :--- | :--- |
| **⚡ 1. Suministro de Energía (SE)** | • `SE1` Continuidad (`P129`)<br>• `SE2` Voltaje (`P130`)<br>• `SE3` Restablecimiento (`P143`)<br>• `SE-G` Suministro Global (`P121`) | • `P132`: Frecuencia percibida de cortes<br>• `P135`: Cortes en último mes (Sí/No)<br>• `P136`: Número de cortes en domicilio<br>• `P142`: Horas de duración promedio<br>• `P252`: Reclamo formal por corte<br>• `P253`: Daño de electrodomésticos por tensión | Cruza la **alta satisfacción de continuidad (85.92%)** con la tasa real de interrupciones y reclamos por artefactos dañados. |
| **👤 2. Atención al Cliente (AT)** | • `AT1` a `AT9` (`P178` a `P186`):<br>0800, Filas presenciales, Cortesía, Claridad, Resolución, Digital, Plazos, Requisitos, Instalaciones | • `P266`: **FCR (55.43%)**<br>• Reiteración: Clientes con $\ge 2$ contactos (**41.20%**)<br>• `P189`: Tiempo dedicado al reclamo<br>• `P248-P265`: Desglose de **16 causales de reclamo**<br>• `P267`: Satisfacción canales App/Web | Explica que la fricción en tiempos telefónicos (`AT1: 58.32%`) y presenciales (`AT2: 55.59%`) se origina en el 41.20% de reiteración. |
| **📄 3. Factura de Energía (FE)** | • `FE1` a `FE6` (`P155` a `P158`, `P073`, `P074`):<br>Plazo vencimiento, Claridad, Medición real, Opciones de pago, Puntualidad, Gráfico histórico | • `P072`: Días hábiles reales (**11.4 días**)<br>• `P016`/`P017`: Formato papel vs. digital<br>• `P024`/`P025`: Solicitud de aclaraciones<br>• `P027-P030`: $ ARS y kWh/mes declarados<br>• `P021`/`P023`: Auditoría de factura por CAPI | Contrasta la excelencia en medios de pago (`FE4: 85.97%`) con las dudas en medición (`FE3: 62.19%`) por falta de comprensión del gráfico. |
| **📢 4. Información y Comunicación (IC)** | • `IC1` a `IC5` (`P148` a `P150`, `P064`, `P065`):<br>Preaviso cortes, Uso eficiente, Riesgos/seguridad, Deberes y derechos, Composición tarifaria | • `P150`: Frecuencia preaviso (**Solo 34.2% Siempre**)<br>• `P170`: Anticipación del SMS previo<br>• `P047-P051`: Canales (Radio, Redes, SMS, Web)<br>• `P191`: Calidad de la información brindada | Justifica por qué `IC1` (58.86%) está en Foco Urgente: 2 de cada 3 clientes no reciben preaviso efectivo antes de obras programadas. |
| **🏛️ 5. Imagen y RSA (IM / RSA)** | • `IM1` a `IM7` (`P198` a `P206`) y `RSA1-4` (`P214-P215`):<br>Confianza, Sociedad, Ética, Ambiente, Seguridad, Innovación, Progreso | • `P214`: Participación en programas sociales<br>• `P215`: Igualdad de oportunidades y género<br>• `P281`: Responsable del alumbrado (**EPEC vs Municipio**)<br>• `P109`: Inversión percibida en infraestructura | La imagen corporativa se eleva significativamente cuando el usuario distingue las competencias técnicas de EPEC frente a las municipales. |
| **🎯 6. Síntesis y Cierre** | • `ISG` Nota 1-10 (`P162`)<br>• `IAC` Aprobación Sí/No (`P166`)<br>• `IIS` Empresa Ideal (`P165`)<br>• `PR` Tarifa Justa (`P164`)<br>• `NPS` Recomendación (`P163`) | • `P167`: **Evolución interanual (Balance +12.80 p.p.)**<br>• `P237`: Justificación precio vs. calidad técnica<br>• `P035-P038`: Edad, educación e ingreso del hogar<br>• `P285-P286`: Género, ocupación y comuna | Permite segmentar a los **Promotores (27.15%)** y **Detractores (15.19%)** por nivel socioeconómico y zona geográfica para planes focalizados. |
