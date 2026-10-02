import os, sys, json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_SCRATCH = os.path.dirname(SCRIPT_DIR)
BASE_D = r"D:\Proyectos\encuesta_cier"

SIMULADOR_HTML = """        </div>

      </div>

      <!-- =========================================================================
           SIMULADOR INTERACTIVO DE METAS ISCAL & MATRIZ DE SINERGIAS
           ========================================================================= -->
      <div class="glass-card mb-4" id="simulador-iscal-card">
        <div class="card-header flex-wrap">
          <div>
            <div class="badge-tag-cyan mb-2">Simulador Dinámico de Metas Alcanzables · CIER 2026</div>
            <h3 class="card-title">Simulador Interactivo de Metas ISCAL y Posicionamiento Competitivo</h3>
            <p class="card-desc">Proyecte el impacto matemático directo en el índice ISCAL al calibrar las metas de desempeño en los atributos críticos del Cuadrante I y límites estratégicos.</p>
          </div>
          
          <!-- Preset Scenario Buttons -->
          <div class="scenario-buttons-group">
            <button class="btn-scenario active" data-scenario="base" id="btn-scen-base" onclick="applySimulatorScenario('base')">
              🔄 Línea Base 2026 (65.96%)
            </button>
            <button class="btn-scenario" data-scenario="escenario-1" id="btn-scen-1" onclick="applySimulatorScenario('escenario-1')">
              ⚡ 1. Quick Wins Factura (+0.29 pp)
            </button>
            <button class="btn-scenario" data-scenario="escenario-2" id="btn-scen-2" onclick="applySimulatorScenario('escenario-2')">
              🏆 2. Meta Q1 a 65 pts (+3.08 pp · #1 AR)
            </button>
            <button class="btn-scenario" data-scenario="escenario-3" id="btn-scen-3" onclick="applySimulatorScenario('escenario-3')">
              🌎 3. Liderazgo Sinergias (+4.84 pp · Top 5 LATAM)
            </button>
          </div>
        </div>

        <!-- Simulator Scoreboard & Comparative Gauges Row -->
        <div class="grid-2col mt-3 align-items-stretch">
          <!-- Live Projected Score Card -->
          <div class="sim-score-card">
            <div class="sim-score-header">
              <span class="sim-score-label">ÍNDICE ISCAL PROYECTADO</span>
              <span class="sim-delta-badge" id="sim-delta-badge">+0.00 pp vs Base</span>
            </div>
            <div class="sim-score-value-row">
              <div class="sim-big-val font-mono" id="sim-iscal-val">65.96%</div>
              <div class="sim-score-meta">
                <div>Base 2026: <strong class="text-sub">65.96 pts</strong></div>
                <div>Base 2025: <strong class="text-sub">63.69 pts</strong></div>
                <div>Muestra: <strong class="text-sub">N = 1.250</strong></div>
              </div>
            </div>
            <div class="sim-status-banner" id="sim-status-banner">
              📌 <strong>Estado Actual:</strong> Posición #3 en Argentina (Gran Porte >500k clientes).
            </div>
          </div>

          <!-- Benchmark Threshold Progress Bars -->
          <div class="sim-benchmarks-card">
            <div class="bench-card-title">Comparativa en Tiempo Real vs. Estándares CIER</div>
            
            <div class="bench-meter-group">
              <div class="bench-meter-row">
                <div class="meter-info">
                  <span class="meter-lbl">EPEC Base 2026</span>
                  <span class="meter-val font-mono">65.96%</span>
                </div>
                <div class="meter-track">
                  <div class="meter-fill fill-blue" style="width: 76.34%;"></div>
                </div>
              </div>

              <div class="bench-meter-row">
                <div class="meter-info">
                  <span class="meter-lbl">EPEC Proyectado</span>
                  <span class="meter-val font-mono text-cyan" id="meter-sim-val">65.96%</span>
                </div>
                <div class="meter-track">
                  <div class="meter-fill fill-cyan" id="meter-sim-fill" style="width: 76.34%;"></div>
                </div>
              </div>

              <div class="bench-meter-row">
                <div class="meter-info">
                  <span class="meter-lbl">🇦🇷 Promedio Top 2 Argentina (EDENOR y EDEA)</span>
                  <span class="meter-val font-mono" id="bench-top2-val">68.65%</span>
                </div>
                <div class="meter-track">
                  <div class="meter-fill fill-purple" style="width: 79.46%;"></div>
                  <div class="meter-target-indicator" id="ind-top2" style="left: 79.46%;"></div>
                </div>
              </div>

              <div class="bench-meter-row">
                <div class="meter-info">
                  <span class="meter-lbl">📊 Promedio CIER (>500k Gran Porte)</span>
                  <span class="meter-val font-mono" id="bench-cier-val">70.15%</span>
                </div>
                <div class="meter-track">
                  <div class="meter-fill fill-amber" style="width: 81.19%;"></div>
                  <div class="meter-target-indicator" id="ind-cier" style="left: 81.19%;"></div>
                </div>
              </div>

              <div class="bench-meter-row">
                <div class="meter-info">
                  <span class="meter-lbl">🏆 Frontera Máxima Regional (UTE Uruguay)</span>
                  <span class="meter-val font-mono">86.40%</span>
                </div>
                <div class="meter-track">
                  <div class="meter-fill fill-green" style="width: 100%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sliders Grid for Key Focus Attributes -->
        <div class="mt-4">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h4 class="section-heading-sm mb-0">Calibración de Desempeño por Atributo Clave (10 Atributos de Alto Impacto)</h4>
              <p class="text-muted" style="font-size: 0.78rem;">Ajuste los controles deslizantes para simular metas operativas específicas. Los pesos matemáticos corresponden a la matriz oficial CIER 2026.</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="resetSimulator()">🔄 Restablecer Valores Base</button>
          </div>

          <div class="sliders-grid" id="iscal-sliders-container">
            <!-- Dynamic Sliders Rendered by app.js -->
          </div>
        </div>

        <!-- Matriz de Sinergias y Oportunidades Observadas -->
        <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-color);">
          <h4 class="section-heading-sm">Matriz de Sinergias Operativas y Oportunidades Observadas</h4>
          <div class="grid-4col mt-3">
            
            <div class="synergy-card">
              <div class="synergy-header" style="border-left: 3px solid #38bdf8;">
                <span class="synergy-tag">GRUPO A · FACTURACIÓN FRONTERA</span>
                <h5 class="synergy-title">Plazo y Comprensión (FE01 + FE03)</h5>
              </div>
              <div class="synergy-impact font-mono">Peso Conjunto: 8.73% ISCAL</div>
              <p class="synergy-desc">Oportunidad de bajo costo: adelantar 72 hs el envío de la factura digital y simplificar el desglose gráfico. Al elevar de 62.5 a 66.0 pts, aporta <strong>+0.29 pp</strong> directos sin obras de red.</p>
            </div>

            <div class="synergy-card">
              <div class="synergy-header" style="border-left: 3px solid #f87171;">
                <span class="synergy-tag">GRUPO B · ATENCIÓN ESTRUCTURAL</span>
                <h5 class="synergy-title">Contacto y Tiempos de Espera (AT01 + AT02)</h5>
              </div>
              <div class="synergy-impact font-mono">Peso Conjunto: 9.79% ISCAL</div>
              <p class="synergy-desc">Sinergia con turnero web y omnicanalidad digital. Elevar de 56.9 a 65.0 pts aporta <strong>+0.77 pp</strong> al ISCAL y reduce drásticamente la tasa de detracción en Millennials.</p>
            </div>

            <div class="synergy-card">
              <div class="synergy-header" style="border-left: 3px solid #fbbf24;">
                <span class="synergy-tag">GRUPO C · COMUNICACIÓN PREVENTIVA</span>
                <h5 class="synergy-title">Aviso de Cortes, Riesgos y Medición (IC01 + IC03 + IC05)</h5>
              </div>
              <div class="synergy-impact font-mono">Peso Conjunto: 12.95% ISCAL</div>
              <p class="synergy-desc">Notificaciones push por WhatsApp para cortes programados y didáctica de lectura de medidor. Elevar a 65 pts aporta <strong>+2.02 pp</strong> al ISCAL.</p>
            </div>

            <div class="synergy-card">
              <div class="synergy-header" style="border-left: 3px solid #34d399;">
                <span class="synergy-tag">GRUPO D · VIRTUDES LÍMITE (Q4 → Q3)</span>
                <h5 class="synergy-title">Personal, Agilidad y Vencimiento (AT04 + AT03 + FE05)</h5>
              </div>
              <div class="synergy-impact font-mono">Peso Conjunto: 9.37% ISCAL</div>
              <p class="synergy-desc">Atributos en el límite del Cuadrante III (Importancia 2.86% a 3.31%). Consolidar su desempeño actual (>70 pts) garantiza estabilidad frente a variaciones de demanda.</p>
            </div>

          </div>
        </div>

      </div>

      <!-- Deep Dive into All 30 Attributes (Microdata Cross-Tabulation & 10-per-page Pagination) -->
      <div class="glass-card mb-4">"""

MULTIDIM_DETRACTORES_HTML = """          </ul>
        </div>
      </div>

      <!-- =========================================================================
           CRUCES SOCIODEMOGRÁFICOS MULTIDIMENSIONALES (N=1.250)
           ========================================================================= -->
      <div class="glass-card mt-4">
        <div class="card-header flex-wrap">
          <div>
            <div class="badge-tag-cyan mb-2">Microdatos Auditados N = 1.250 Casos · Análisis Bivariado y Trivariado</div>
            <h3 class="card-title">Cruces Sociodemográficos Multidimensionales (Ingreso × Educación × Edad × Género)</h3>
            <p class="card-desc">Interrelaciones estadísticas simultáneas que explican el comportamiento de pago, la adopción digital y la tolerancia ante interrupciones de suministro.</p>
          </div>
          <div class="dict-quick-stats" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="badge-pill-cyan">📈 r = +0.397 (Educación vs Ingreso)</span>
            <span class="badge-pill-purple">📉 r = -0.149 (Edad vs Ingreso)</span>
            <span class="badge-pill-amber">👥 Femenino 63.8% · Masculino 36.2%</span>
          </div>
        </div>

        <!-- Charts Grid Row 1 -->
        <div class="grid-2col mt-3 align-items-stretch">
          <div class="chart-card-inner">
            <div class="chart-inner-header">
              <h4 class="chart-inner-title">1. Ingreso Familiar Medio y Mediana según Nivel Educativo y Género</h4>
              <span class="badge-tag-blue">ARS / Mes</span>
            </div>
            <p class="text-muted" style="font-size: 0.76rem; margin-bottom: 0.5rem;">
              Fuerte gradiente salarial: desde $740k en Primaria hasta $1.71M en Nivel Superior/Universitario.
            </p>
            <div class="chart-wrapper" style="height: 320px;">
              <canvas id="chart-ingreso-educacion-genero"></canvas>
            </div>
          </div>

          <div class="chart-card-inner">
            <div class="chart-inner-header">
              <h4 class="chart-inner-title">2. Ingreso Familiar Medio según Franja de Edad y Género</h4>
              <span class="badge-tag-cyan">ARS / Mes</span>
            </div>
            <p class="text-muted" style="font-size: 0.76rem; margin-bottom: 0.5rem;">
              Pico de ingresos en etapa laboral madura (30 a 59 años) y reducción marcada en adultos mayores (>60 años: $1.06M).
            </p>
            <div class="chart-wrapper" style="height: 320px;">
              <canvas id="chart-ingreso-edad-genero"></canvas>
            </div>
          </div>
        </div>

        <!-- Charts Grid Row 2 -->
        <div class="grid-2col mt-4 align-items-stretch">
          <div class="chart-card-inner">
            <div class="chart-inner-header">
              <h4 class="chart-inner-title">3. Composición Educativa por Cohorte Generacional (% Superior Universitario)</h4>
              <span class="badge-tag-purple">Distribución %</span>
            </div>
            <p class="text-muted" style="font-size: 0.76rem; margin-bottom: 0.5rem;">
              El 58.14% de jóvenes (18-29 años) posee estudios superiores, frente al 36.60% en mayores de 60 años.
            </p>
            <div class="chart-wrapper" style="height: 300px;">
              <canvas id="chart-educacion-edad"></canvas>
            </div>
          </div>

          <div class="chart-card-inner">
            <div class="chart-inner-header">
              <h4 class="chart-inner-title">4. Distribución de Género por Tramo Salarial</h4>
              <span class="badge-tag-green">Participación %</span>
            </div>
            <p class="text-muted" style="font-size: 0.76rem; margin-bottom: 0.5rem;">
              Mayor proporción femenina en tramos de ingreso bajo y medio (70.1% a 64.1%), convergiendo en tramos altos (> $2M: 57.0%).
            </p>
            <div class="chart-wrapper" style="height: 300px;">
              <canvas id="chart-genero-tramo-ingreso"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- =========================================================================
           TARJETAS GENERACIONALES DE DETRACTORES (INNOVARE / CIER)
           ========================================================================= -->
      <div class="mt-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <div class="badge-tag-amber mb-1">Segmentación Generacional · Metodología INNOVARE / CIER</div>
            <h3 class="section-heading mb-0">Arquetipos Generacionales de Clientes y Focos de Detracción</h3>
            <p class="text-muted" style="font-size: 0.8rem;">Composición demográfica del padrón, alertas críticas, aspectos penalizados y expectativas específicas por cohorte.</p>
          </div>
          <span class="badge-tag-blue font-mono font-bold">100% Padrón Residencial EPEC</span>
        </div>

        <div class="generational-cards-grid" id="generational-cards-container">
          <!-- Rendered dynamically by app.js from DASHBOARD_DATA.tarjetas_detractores -->
        </div>
      </div>

      <!-- 4 Root Causes Grid -->
      <div class="mt-4">"""

NEW_CSS = """
/* ==========================================================================
   SIMULADOR INTERACTIVO DE METAS ISCAL (ESTILOS)
   ========================================================================== */
.scenario-buttons-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.btn-scenario {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-scenario:hover {
  background: rgba(51, 65, 85, 0.9);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.btn-scenario.active {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.3));
  border-color: var(--accent-cyan);
  color: #fff;
  box-shadow: 0 0 14px rgba(6, 182, 212, 0.35);
}

.sim-score-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sim-score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.sim-score-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.sim-delta-badge {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.sim-delta-badge.badge-up {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.sim-delta-badge.badge-down {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.sim-score-value-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0.75rem 0;
}

.sim-big-val {
  font-size: 2.75rem;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: -1px;
  line-height: 1;
  text-shadow: 0 0 25px rgba(56, 189, 248, 0.35);
}

.sim-score-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
  text-align: right;
}

.sim-status-banner {
  background: rgba(6, 182, 212, 0.08);
  border-left: 3px solid var(--accent-cyan);
  padding: 0.6rem 0.85rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #cbd5e1;
  line-height: 1.4;
}

.sim-status-banner.banner-cyan {
  background: rgba(6, 182, 212, 0.15);
  border-left-color: #06b6d4;
  color: #e0f2fe;
}

.sim-status-banner.banner-amber {
  background: rgba(245, 158, 11, 0.15);
  border-left-color: #f59e0b;
  color: #fef3c7;
}

.sim-status-banner.banner-green {
  background: rgba(16, 185, 129, 0.15);
  border-left-color: #10b981;
  color: #d1fae5;
}

.sim-status-banner.banner-blue {
  background: rgba(59, 130, 246, 0.15);
  border-left-color: #3b82f6;
  color: #dbeafe;
}

.sim-benchmarks-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bench-card-title {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.bench-meter-group {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.bench-meter-row {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.meter-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.meter-lbl {
  color: #cbd5e1;
  font-weight: 500;
}

.meter-val {
  font-weight: 700;
  color: #f8fafc;
}

.meter-track {
  height: 7px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.meter-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.meter-fill.fill-blue { background: #3b82f6; }
.meter-fill.fill-cyan { background: #06b6d4; }
.meter-fill.fill-purple { background: #a855f7; }
.meter-fill.fill-amber { background: #f59e0b; }
.meter-fill.fill-green { background: #10b981; }

.meter-target-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #fff;
  box-shadow: 0 0 6px #fff;
  z-index: 2;
}

/* Sliders Grid */
.sliders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.85rem;
}

.slider-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  transition: all 0.2s ease;
}

.slider-card:hover {
  background: rgba(30, 41, 59, 0.75);
  border-color: rgba(6, 182, 212, 0.3);
}

.slider-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-attr-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #f8fafc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slider-val-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-current-val {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--accent-cyan);
}

.slider-delta-pill {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
}

.slider-delta-pill.pos {
  background: rgba(16, 185, 129, 0.18);
  color: #34d399;
}

.slider-delta-pill.neg {
  background: rgba(239, 68, 68, 0.18);
  color: #f87171;
}

.custom-range-slider {
  width: 100%;
  accent-color: var(--accent-cyan);
  cursor: pointer;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
}

/* Synergies Grid */
.synergy-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.synergy-header {
  padding-left: 0.5rem;
}

.synergy-tag {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.4px;
}

.synergy-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f8fafc;
  margin-top: 0.15rem;
}

.synergy-impact {
  font-size: 0.74rem;
  font-weight: 600;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  align-self: flex-start;
}

.synergy-desc {
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.45;
}

/* ==========================================================================
   CRUCES MULTIDIMENSIONALES & TARJETAS GENERACIONALES (ESTILOS)
   ========================================================================== */
.chart-card-inner {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
}

.chart-inner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.chart-inner-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f8fafc;
}

.generational-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.gen-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gen-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}

.gen-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.gen-tag {
  font-size: 0.68rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.gen-title {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.gen-franja {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.gen-arquetipo-pill {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
}

.gen-alert-box {
  background: rgba(245, 158, 11, 0.08);
  border-left: 3px solid #f59e0b;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

.gen-penalties-box {
  background: rgba(239, 68, 68, 0.06);
  border-left: 3px solid #ef4444;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

.gen-expectation-box {
  background: rgba(16, 185, 129, 0.06);
  border-left: 3px solid #10b981;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}

.gen-section-lbl {
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
}

.gen-text {
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.4;
}

.gen-list {
  font-size: 0.76rem;
  color: #cbd5e1;
  margin-left: 1rem;
  line-height: 1.35;
}

.gen-list li {
  margin-bottom: 0.15rem;
}
"""

for base in [BASE_SCRATCH, BASE_D]:
    if not os.path.exists(base):
        continue
    
    # 1. Update index.html
    hpath = os.path.join(base, 'index.html')
    with open(hpath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    target_a = '''        </div>

      </div>

      <!-- Deep Dive into All 30 Attributes (Microdata Cross-Tabulation & 10-per-page Pagination) -->
      <div class="glass-card mb-4">'''
    if target_a in html:
        html = html.replace(target_a, SIMULADOR_HTML, 1)
        print(f'Applied Simulador HTML in {hpath}')

    target_b = '''          </ul>
        </div>
      </div>

      <!-- 4 Root Causes Grid -->
      <div class="mt-4">'''
    if target_b in html:
        html = html.replace(target_b, MULTIDIM_DETRACTORES_HTML, 1)
        print(f'Applied Detractores Multidim HTML in {hpath}')

    with open(hpath, 'w', encoding='utf-8') as f:
        f.write(html)

    # 2. Update style.css
    spath = os.path.join(base, 'style.css')
    with open(spath, 'r', encoding='utf-8') as f:
        css = f.read()
    if '.sim-score-card' not in css:
        css = css + NEW_CSS
        with open(spath, 'w', encoding='utf-8') as f:
            f.write(css)
        print(f'Appended CSS to {spath}')

print('HTML and CSS updates successfully executed!')
