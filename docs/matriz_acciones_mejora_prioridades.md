# 🎯 Matriz Conjunta de Definición de Acciones de Mejora (CIER 2026 - EPEC)

Este documento analiza en profundidad la **Matriz de Importancia vs. Desempeño (Sección 16 del Informe Individual CIER 2026 - EPEC-AR)**, cruzando los coeficientes de regresión matemática con los microdatos auditados de la encuesta ($N = 1.250$ casos) para determinar las causas operativas de las respuestas negativas y orientar el plan táctico de inversiones y gestión.

---

## 1. Metodología de Interpretación de la Gráfica CIER

La matriz cruza dos dimensiones analíticas fundamentales para clasificar los **30 atributos troncales** de la evaluación:

```
                  Desempeño (IDAT: 0 a 100)
                              ▲
                              │
     CUADRANTE IV             │       CUADRANTE III
  VENTAJAS SECUNDARIAS        │    FORTALEZAS CLAVE
  (Baja Imp. / Alto Desemp.)  │ (Alta Imp. / Alto Desemp.)
  (3º Orden de Intervención)  │ (2º Orden · Prioridad MANTENER)
  • FE4 Locales de pago (85.9)│ • SE1 Continuidad (85.92)
  • AT6 Calidad atención (77.6│ • SE2 Tensión (77.40)
  • AT4 Conocimiento (74.5)   │ • SE3 Rapidez reanudación (72.12)
  • AT3 Claridad atención (73)│ • FE2 Factura sin error (69.56)
  • FE5 Fechas vencimiento(71)│
 ─────────────────────────────┼──────────────────────────────► Importancia
  Umbral Desempeño (~64.8)    │ Umbral Importancia (~3.3%)     Relativa (%)
                              │
     CUADRANTE II             │       CUADRANTE I
    BAJA PRIORIDAD            │    🚩 CUADRANTE FOCO / ALTO IMPACTO
  (Baja Imp. / Bajo Desemp.)  │ (ALTA IMP. / BAJO DESEMP.)
  (Último Orden Intervención) │ (1º Orden de Intervención Máxima)
  • IM1 a IM8 Imagen (55-63)  │ 1º IC1 Notif. interrupción (58.86)
  • IC2 Uso eficiente (57.81) │ 2º AT1 Facilidad contacto (58.32)
  • IC4 Derechos/deberes(48.3)│ 3º FE1 Plazo recepción (63.12)
                              │ 4º AT2 Tiempo espera (55.59)
                              │ 5º IC3 Riesgos y peligros (50.08)
                              │ 6º FE3 Comprensión factura (62.19)
                              │ 7º IC5 Medición consumo (44.52)
```

### Reglas de Lectura de los 4 Cuadrantes:

1. **Eje Horizontal X (Importancia Relativa %):** Calculado mediante regresión múltiple y análisis de covarianza. Representa el peso que tiene el atributo en la conformación de la percepción global del usuario (va de $0\%$ a $>8\%$). La línea de corte vertical se ubica en el promedio del sistema ($\approx 3.33\%$).
2. **Eje Vertical Y (Desempeño del Atributo IDAT):** Nota media del atributo convertida a escala $0$ a $100$. La línea de corte horizontal se ubica en el desempeño medio ponderado ($\approx 64.80\text{ pts}$).
3. **Cuadrante I (Foco Prioritario · 1º Orden de Intervención):** Atributos de **alta importancia pero bajo rendimiento**. Concentran el $31,46\%$ del peso global.
4. **Cuadrante III (Fortalezas Clave · 2º Orden de Intervención):** Atributos de **alta importancia y alto rendimiento**. Pilares rectores a mantener (Continuidad $85,92$, Tensión $77,40$, Reanudación $72,12$).
5. **Cuadrante IV (Ventajas Secundarias · 3º Orden de Intervención):** Atributos de **baja importancia y alto rendimiento**. Rendimiento muy alto que permite optimizar recursos.
6. **Cuadrante II (Baja Prioridad · Último Orden de Intervención):** Atributos de **baja importancia y bajo rendimiento**.

---

## 2. Ranking Oficial de Prioridades de Mejora de EPEC

| N° Gráfico | Sigla | Atributo Evaluado | Dimensión | Importancia Relativa (%) | Desempeño EPEC (IDAT) | Ranking de Prioridad CIER | Cuadrante Estratégico |
| :---: | :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **4** | `IC1` | **Notificación de interrupción** | Información | **5.85%** | **58.86 pts** | **1º Lugar (Máxima)** | 🚩 **Cuadrante I (Foco)** |
| **14** | `AT1` | **Facilidad para contactarse** | Atención | **5.49%** | **58.32 pts** | **2º Lugar** | 🚩 **Cuadrante I (Foco)** |
| **9** | `FE1` | **Plazo entre recepción y vencimiento** | Factura | **5.11%** | **63.12 pts** | **3º Lugar** | 🚩 **Cuadrante I (Foco)** |
| **15** | `AT2` | **Tiempo de espera hasta ser atendido** | Atención | **4.29%** | **55.59 pts** | **4º Lugar** | 🚩 **Cuadrante I (Foco)** |
| **6** | `IC3` | **Riesgos y peligros** | Información | **3.68%** | **50.08 pts** | **5º Lugar** | 🚩 **Cuadrante I (Foco)** |
| **11** | `FE3` | **Facilidad de comprensión de factura** | Factura | **3.62%** | **62.19 pts** | **6º Lugar** | 🚩 **Cuadrante I (Foco)** |
| **8** | `IC5` | **Medición del consumo de energía** | Información | **3.42%** | **44.52 pts** | **7º Lugar** | 🚩 **Cuadrante I (Foco)** |
| 1 | `SE1` | Sin interrupción (Continuidad) | Suministro | 8.26% | 85.92 pts | 17º Lugar | 🛡️ **Cuadrante III (Fortaleza Clave)** |
| 3 | `SE3` | Rapidez reanudación energía | Suministro | 5.50% | 72.12 pts | 18º Lugar | 🛡️ **Cuadrante III (Fortaleza Clave)** |
| 2 | `SE2` | Sin variación de voltaje | Suministro | 5.40% | 77.40 pts | 19º Lugar | 🛡️ **Cuadrante III (Fortaleza Clave)** |
| 10 | `FE2` | Factura sin error | Factura | 4.54% | 69.56 pts | 20º Lugar | 🛡️ **Cuadrante III (Fortaleza Clave)** |
| 12 | `FE4` | Locales para el pago | Factura | 2.33% | 85.97 pts | 21º Lugar | ⭐ **Cuadrante IV (Ventaja Sec.)** |
| 19 | `AT6` | Calidad de la atención | Atención | 2.71% | 77.63 pts | 22º Lugar | ⭐ **Cuadrante IV (Ventaja Sec.)** |
| 17 | `AT4` | Conocimiento sobre el tema | Atención | 3.31% | 74.52 pts | 23º Lugar | ⭐ **Cuadrante IV (Ventaja Sec.)** |

---

## 3. Cruce con Microdatos: Distribución de Respuestas y Causas Raíz

A partir de la auditoría de microdatos de la encuesta ($N = 1.250$), se analiza la distribución exacta de respuestas (Negativas: notas 1-4, Neutras: notas 5-8, Positivas: notas 9-10) y los factores causales de los 7 atributos críticos del **Cuadrante Foco**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ DISTRIBUCIÓN DE RESPUESTAS EN LOS ATRIBUTOS DEL CUADRANTE FOCO                        │
├───────┬─────────────────────────────┬───────────┬─────────────┬────────────┬───────────┤
│ Sigla │ Atributo Canónico           │ Negativas │ Neutras     │ Positivas  │ Nota Med. │
│       │                             │ (Notas 1-4│ (Notas 5-8) │ (Notas 9-10│ (1 a 10)  │
├───────┼─────────────────────────────┼───────────┼─────────────┼────────────┼───────────┤
│ IC1   │ 1º Notificación de corte    │ 21.5%     │ 55.8%       │ 22.8%      │ 6.55      │
│ AT1   │ 2º Facilidad de contacto    │ 19.0%     │ 57.6%       │ 23.4%      │ 6.64      │
│ FE1   │ 3º Plazo recepción-venc.    │ 18.8%     │ 52.8%       │ 28.4%      │ 6.85      │
│ AT2   │ 4º Tiempo de espera         │ 22.7%     │ 58.5%       │ 18.8%      │ 6.35      │
│ IC3   │ 5º Riesgos y peligros       │ 27.2%     │ 52.4%       │ 20.4%      │ 6.16      │
│ FE3   │ 6º Comprensión de factura   │ 17.5%     │ 56.0%       │ 26.5%      │ 6.84      │
│ IC5   │ 7º Medición del consumo     │ 33.0%     │ 53.4%       │ 13.5%      │ 5.71      │
└───────┴─────────────────────────────┴───────────┴─────────────┴────────────┴───────────┘
```

---

### Diagnóstico Profundo por Atributo Crítico:

#### 1. 🥇 `IC1` · Notificación de Interrupción (Prioridad 1ª · Imp: 5.85% · Desemp: 58.86 pts)
* **Datos de Encuesta:** **21.5% de respuestas negativas directas** (132 clientes califican con 1 a 4).
* **Causas Raíz Detectadas en Cuestionario:**
  1. **Falta de Aviso Previo en Mantenimientos:** La mayoría de los usuarios no recibe notificación previa ante cortes programados de mejora de red.
  2. **Ausencia de Predictibilidad en Contingencias:** En cortes imprevistos por tormentas, el usuario no dispone de un tiempo estimado de restitución (*ETR*), lo que dispara la incertidumbre y el malestar.
  3. **Canal Poco Eficaz:** Poca penetración de notificaciones push proactivas georreferenciadas (WhatsApp / SMS / App EPEC Móvil).

#### 2. 🥈 `AT1` · Facilidad para Contactarse (Prioridad 2ª · Imp: 5.48% · Desemp: 58.32 pts)
* **Datos de Encuesta:** **19.0% de respuestas negativas** (113 clientes con 1 a 4) y **41.2% de usuarios requiere más de un contacto** para resolver su trámite (`P263`).
* **Causas Raíz Detectadas en Cuestionario:**
  1. **Saturación en Días Críticos:** En tormentas o picos térmicos, el canal telefónico colapsa con tono de ocupado o cortes de llamada.
  2. **Laberinto de IVR:** Menús de conmutador automático complejos que dificultan hablar con un operador humano calificado.

#### 3. 🥉 `FE1` · Plazo entre Recepción y Vencimiento (Prioridad 3ª · Imp: 5.10% · Desemp: 63.12 pts)
* **Datos de Encuesta:** **18.8% de respuestas negativas** (113 clientes con 1 a 4).
* **Causas Raíz Detectadas en Cuestionario:**
  1. **Margen Escaso de Días:** Clientes manifiestan recibir la factura (física o digital) con menos de 5 días hábiles antes de la fecha de vencimiento.
  2. **Desfasaje con Fechas de Cobro Salarial:** Vencimientos fijados antes del día 10 del mes, previo al cobro de sueldos y jubilaciones.

#### 4. 🏅 `AT2` · Tiempo de Espera hasta ser Atendido (Prioridad 4ª · Imp: 4.30% · Desemp: 55.59 pts)
* **Datos de Encuesta:** **22.7% de respuestas negativas** (134 clientes con 1 a 4).
* **Causas Raíz Detectadas en Cuestionario:**
  1. **Demoras en Guardias y Contact Center:** Esperas en línea telefónica superiores a 8-15 minutos en horarios pico.
  2. **Tiempos de Espera en Sucursales Comerciales:** Congestión en centros de atención presencial para trámites presenciales.

#### 5. 🏅 `IC3` · Orientación sobre Riesgos y Peligros (Prioridad 5ª · Imp: 3.67% · Desemp: 50.08 pts)
* **Datos de Encuesta:** **27.2% de respuestas negativas** (161 clientes con 1 a 4).
* **Causas Raíz Detectadas en Cuestionario:**
  1. **Invisibilidad de Campañas de Seguridad:** El usuario percibe nula comunicación sobre prevención de accidentes eléctricos domésticos, poda cercana a líneas y manipulación de artefactos mojados.

#### 6. 🏅 `FE3` · Facilidad de Comprensión de la Factura (Prioridad 6ª · Imp: 3.60% · Desemp: 62.19 pts)
* **Datos de Encuesta:** **17.5% de respuestas negativas** (107 clientes con 1 a 4).
* **Causas Raíz Detectadas en Cuestionario:**
  1. **Complejidad del Desglose Impositivo:** Confusión entre el consumo de kWh, los cargos fijos, el Fondo Provincial, las Tasas Municipales de Alumbrado y el IVA.
  2. **Dificultad para Detectar Variaciones de Consumo:** Falta de gráficos intuitivos que comparen el consumo del mes con el mismo periodo del año anterior.

#### 7. 🏅 `IC5` · Medición del Consumo de Energía (Prioridad 7ª · Imp: 3.40% · Desemp: 44.52 pts)
* **Datos de Encuesta:** **33.0% de respuestas negativas** (193 clientes con 1 a 4; ¡el desempeño más bajo de toda la evaluación!).
* **Causas Raíz Detectadas en Cuestionario:**
  1. **Desconocimiento Técnico:** El usuario no sabe cómo leer los dígitos del medidor ni cómo verificar si la lectura coincide con su factura.
  2. **Desconfianza en Estimaciones:** Sospecha recurrente de lecturas estimadas o errores de toma de estado en el medidor.

---

## 4. Plan de Acción Táctico Inmediato para EPEC

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ PLAN DE ACCIÓN TÁCTICO PARA LOS ATRIBUTOS DEL CUADRANTE FOCO                 │
├───────────────────────┬───────────────────────────────────────────────────────┤
│ ATRIBUTO CRÍTICO      │ INICIATIVA TÁCTICA DE IMPACTO RÁPIDO                  │
├───────────────────────┼───────────────────────────────────────────────────────┤
│ 1. IC1 Notificación   │ Sistema de alertas push georreferenciadas WhatsApp/App│
│    de Cortes          │ con horario estimado de restitución (ETR) en tiempo   │
│                       │ real ante contingencias.                              │
├───────────────────────┼───────────────────────────────────────────────────────┤
│ 2. AT1 / AT2 Contacto │ Derivación inteligente de tráfico a Chatbot IA en     │
│    y Esperas          │ WhatsApp + Desborde de contact center en tormentas.   │
├───────────────────────┼───────────────────────────────────────────────────────┤
│ 3. FE1 Plazo Factura  │ Garantizar envío digital 15 días antes de vencimiento │
│                       │ y opción de elección de fecha de vencimiento.         │
├───────────────────────┼───────────────────────────────────────────────────────┤
│ 4. FE3 Comprensión    │ Rediseño pedagógico de la factura digital con gráfico │
│    de Factura         │ de barras comparativo y desglose claro de tasas.      │
├───────────────────────┼───────────────────────────────────────────────────────┤
│ 5. IC5 Medición       │ Tutorial interactivo en App EPEC: "Cómo leer tu       │
│    del Consumo        │ medidor y calcular tu consumo diario".                │
└───────────────────────┴───────────────────────────────────────────────────────┘
```
