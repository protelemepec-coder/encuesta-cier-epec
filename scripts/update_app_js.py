import os, sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_SCRATCH = os.path.dirname(SCRIPT_DIR)
BASE_D = r"D:\Proyectos\encuesta_cier"

for base in [BASE_SCRATCH, BASE_D]:
    if not os.path.exists(base):
        continue
    jspath = os.path.join(base, 'app.js')
    with open(jspath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update DOMContentLoaded if needed
    if 'initIscalSimulator();' not in content:
        content = content.replace(
            'renderPrioritiesTable();\n});',
            'renderPrioritiesTable();\n  initIscalSimulator();\n});'
        )
        print(f'Added initIscalSimulator to DOMContentLoaded in {jspath}')

    # 2. Update tab switching handlers if needed
    if 'initIscalSimulator();' not in content.split('targetId === \'tab-matriz\'')[1]:
        content = content.replace(
            """      if (targetId === 'tab-matriz') {
        setTimeout(() => {
          initMatrizScatterChart();
          renderFocusAttributes();
          renderPrioritiesTable();
        }, 50);
      }""",
            """      if (targetId === 'tab-matriz') {
        setTimeout(() => {
          initMatrizScatterChart();
          renderFocusAttributes();
          renderPrioritiesTable();
          initIscalSimulator();
        }, 50);
      }
      if (targetId === 'tab-detractores') {
        setTimeout(() => {
          initDemografiaMultidimensionalCharts();
        }, 50);
      }"""
        )
        print(f'Updated tab switching in {jspath}')

    # 3. Replace renderDetractorSection with enhanced functions if not already present
    if 'function initDemografiaMultidimensionalCharts()' not in content:
        target_render = """/* ==========================================================================
   RENDER DETRACTOR SECTION (N=1.250 MICRODATA PROFILE)
   ========================================================================== */
function renderDetractorSection() {
  const prof = cierData.detractorProfile;
  if (!prof) return;

  // 1. Age Bars
  const ageContainer = document.getElementById('age-bars-container');
  if (ageContainer && prof.ageDistribution) {
    ageContainer.innerHTML = prof.ageDistribution.map(a => `
      <div class="demographic-item">
        <div class="demographic-lbl-row">
          <span>${a.range}</span>
          <span class="font-bold text-cyan-400">${a.detractors.toFixed(1)}%</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill fill-cyan" style="width: ${a.detractors * 2.5}%"></div>
        </div>
      </div>
    `).join('');
  }

  // 2. Causal Factors
  const causalContainer = document.getElementById('causal-factors-container');
  if (causalContainer && prof.causalFactors) {
    causalContainer.innerHTML = prof.causalFactors.map(c => `
      <div class="glass-card accent-card">
        <div class="causal-icon-header">
          <span class="causal-icon">${c.icono}</span>
          <h4 class="causal-title">${c.factor}</h4>
        </div>
        <p class="causal-desc">${c.descripcion}</p>
      </div>
    `).join('');
  }
}"""

        enhanced_render = """/* ==========================================================================
   RENDER DETRACTOR SECTION (N=1.250 MICRODATA PROFILE & GENERACIONES)
   ========================================================================== */
function renderDetractorSection() {
  const prof = cierData.detractorProfile;
  
  // 1. Age Bars
  if (prof) {
    const ageContainer = document.getElementById('age-bars-container');
    if (ageContainer && prof.ageDistribution) {
      ageContainer.innerHTML = prof.ageDistribution.map(a => `
        <div class="demographic-item">
          <div class="demographic-lbl-row">
            <span>${a.range}</span>
            <span class="font-bold text-cyan-400">${a.detractors.toFixed(1)}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill fill-cyan" style="width: ${a.detractors * 2.5}%"></div>
          </div>
        </div>
      `).join('');
    }

    // 2. Causal Factors
    const causalContainer = document.getElementById('causal-factors-container');
    if (causalContainer && prof.causalFactors) {
      causalContainer.innerHTML = prof.causalFactors.map(c => `
        <div class="glass-card accent-card">
          <div class="causal-icon-header">
            <span class="causal-icon">${c.icono}</span>
            <h4 class="causal-title">${c.factor}</h4>
          </div>
          <p class="causal-desc">${c.descripcion}</p>
        </div>
      `).join('');
    }
  }

  // 3. Generational Detractor Cards
  renderGenerationalCards();

  // 4. Multidimensional Demographics Charts
  initDemografiaMultidimensionalCharts();
}

function renderGenerationalCards() {
  const container = document.getElementById('generational-cards-container');
  if (!container) return;
  const cards = (window.CIER_DATA && window.CIER_DATA.tarjetas_detractores)
    ? window.CIER_DATA.tarjetas_detractores
    : (window.DASHBOARD_DATA ? window.DASHBOARD_DATA.tarjetas_detractores : []);
  if (!cards || cards.length === 0) return;

  container.innerHTML = cards.map(c => `
    <div class="gen-card" style="border-top: 4px solid ${c.color};">
      <div class="gen-card-header">
        <div>
          <span class="gen-tag" style="background: ${c.color}22; color: ${c.color}; border: 1px solid ${c.color}55;">
            ${c.padron_pct} PADRÓN
          </span>
          <h4 class="gen-title mt-1" style="color: #fff;">${c.generacion}</h4>
          <span class="gen-franja font-mono">${c.franja_etaria}</span>
        </div>
        <div class="gen-arquetipo-pill" style="border-color: ${c.color}55; color: #f8fafc;">
          🎯 ${c.arquetipo}
        </div>
      </div>

      <div class="gen-alert-box mt-3">
        <div class="gen-section-lbl" style="color: #fbbf24;">⚠️ ALERTA PRINCIPAL</div>
        <p class="gen-text">${c.alerta_principal}</p>
      </div>

      <div class="gen-penalties-box mt-2">
        <div class="gen-section-lbl" style="color: #f87171;">⛔ PENALIZA FUERTEMENTE</div>
        <ul class="gen-list">
          ${c.penaliza.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>

      <div class="gen-expectation-box mt-2">
        <div class="gen-section-lbl" style="color: #34d399;">🎯 EXPECTATIVA PRIORITARIA</div>
        <p class="gen-text">${c.expectativa}</p>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   CHARTS MULTIDIMENSIONALES DEMOGRÁFICOS (N=1.250 MICRODATOS)
   ========================================================================== */
function initDemografiaMultidimensionalCharts() {
  const data = (window.CIER_DATA && window.CIER_DATA.demografia_multidimensional) 
    ? window.CIER_DATA.demografia_multidimensional 
    : (window.DASHBOARD_DATA ? window.DASHBOARD_DATA.demografia_multidimensional : null);
  if (!data) return;

  const chartOptionsBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 11, weight: '500' },
          boxWidth: 12,
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.06)' },
        ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 10 } }
      }
    }
  };

  // 1. Chart Ingreso por Educación y Género
  const ctxIngEdu = document.getElementById('chart-ingreso-educacion-genero');
  if (ctxIngEdu) {
    if (chartsInstances.ingresoEducacion) chartsInstances.ingresoEducacion.destroy();
    const edData = data.ingreso_por_educacion_y_genero;
    chartsInstances.ingresoEducacion = new Chart(ctxIngEdu, {
      type: 'bar',
      data: {
        labels: edData.categorias,
        datasets: [
          {
            label: 'Mujeres (Media)',
            data: edData.femenino_media,
            backgroundColor: 'rgba(236, 72, 153, 0.75)',
            borderColor: '#ec4899',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: 'Varones (Media)',
            data: edData.masculino_media,
            backgroundColor: 'rgba(59, 130, 246, 0.75)',
            borderColor: '#3b82f6',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: 'Total General (Mediana)',
            data: edData.total_media,
            type: 'line',
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderWidth: 2.5,
            pointBackgroundColor: '#10b981',
            pointRadius: 4,
            tension: 0.2
          }
        ]
      },
      options: {
        ...chartOptionsBase,
        plugins: {
          ...chartOptionsBase.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: $ ${ctx.raw.toLocaleString('es-AR')} ARS`
            }
          }
        },
        scales: {
          ...chartOptionsBase.scales,
          y: {
            ...chartOptionsBase.scales.y,
            ticks: {
              color: '#cbd5e1',
              font: { family: 'Inter', size: 10 },
              callback: (v) => `$ ${(v / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  // 2. Chart Ingreso por Edad y Género
  const ctxIngEdad = document.getElementById('chart-ingreso-edad-genero');
  if (ctxIngEdad) {
    if (chartsInstances.ingresoEdad) chartsInstances.ingresoEdad.destroy();
    const edadData = data.ingreso_por_edad_y_genero;
    chartsInstances.ingresoEdad = new Chart(ctxIngEdad, {
      type: 'bar',
      data: {
        labels: edadData.categorias,
        datasets: [
          {
            label: 'Mujeres (Media)',
            data: edadData.femenino_media,
            backgroundColor: 'rgba(236, 72, 153, 0.75)',
            borderColor: '#ec4899',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: 'Varones (Media)',
            data: edadData.masculino_media,
            backgroundColor: 'rgba(6, 182, 212, 0.75)',
            borderColor: '#06b6d4',
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: 'Promedio Cohorte',
            data: edadData.total_media,
            type: 'line',
            borderColor: '#fbbf24',
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            borderWidth: 2.5,
            pointBackgroundColor: '#fbbf24',
            pointRadius: 4,
            tension: 0.2
          }
        ]
      },
      options: {
        ...chartOptionsBase,
        plugins: {
          ...chartOptionsBase.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: $ ${ctx.raw.toLocaleString('es-AR')} ARS`
            }
          }
        },
        scales: {
          ...chartOptionsBase.scales,
          y: {
            ...chartOptionsBase.scales.y,
            ticks: {
              color: '#cbd5e1',
              font: { family: 'Inter', size: 10 },
              callback: (v) => `$ ${(v / 1000).toFixed(0)}k`
            }
          }
        }
      }
    });
  }

  // 3. Chart Educación por Edad
  const ctxEduEdad = document.getElementById('chart-educacion-edad');
  if (ctxEduEdad) {
    if (chartsInstances.educacionEdad) chartsInstances.educacionEdad.destroy();
    const eeData = data.educacion_por_edad;
    chartsInstances.educacionEdad = new Chart(ctxEduEdad, {
      type: 'bar',
      data: {
        labels: eeData.cohortes,
        datasets: [
          {
            label: 'Primaria / Básico',
            data: eeData.primaria,
            backgroundColor: '#64748b',
            borderRadius: 3
          },
          {
            label: 'Secundaria Incompleta',
            data: eeData.secundaria_incompleta,
            backgroundColor: '#f59e0b',
            borderRadius: 3
          },
          {
            label: 'Secundaria Completa',
            data: eeData.secundaria_completa,
            backgroundColor: '#3b82f6',
            borderRadius: 3
          },
          {
            label: 'Superior / Universitario',
            data: eeData.superior_universitario,
            backgroundColor: '#a855f7',
            borderRadius: 3
          }
        ]
      },
      options: {
        ...chartOptionsBase,
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#cbd5e1', font: { size: 10 } } },
          y: {
            stacked: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#cbd5e1', callback: (v) => `${v}%` }
          }
        },
        plugins: {
          ...chartOptionsBase.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
            }
          }
        }
      }
    });
  }

  // 4. Chart Género por Tramo de Ingreso
  const ctxGenTramo = document.getElementById('chart-genero-tramo-ingreso');
  if (ctxGenTramo) {
    if (chartsInstances.generoTramo) chartsInstances.generoTramo.destroy();
    const gtData = data.genero_por_tramo_ingreso;
    chartsInstances.generoTramo = new Chart(ctxGenTramo, {
      type: 'bar',
      data: {
        labels: gtData.tramos,
        datasets: [
          {
            label: 'Mujeres (%)',
            data: gtData.femenino_pct,
            backgroundColor: 'rgba(236, 72, 153, 0.8)',
            borderRadius: 3
          },
          {
            label: 'Varones (%)',
            data: gtData.masculino_pct,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 3
          }
        ]
      },
      options: {
        ...chartOptionsBase,
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#cbd5e1', callback: (v) => `${v}%` }
          },
          y: { stacked: true, grid: { display: false }, ticks: { color: '#f8fafc', font: { size: 11, weight: '500' } } }
        },
        plugins: {
          ...chartOptionsBase.plugins,
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
            }
          }
        }
      }
    });
  }
}

/* ==========================================================================
   SIMULADOR INTERACTIVO DE METAS ISCAL & ESCENARIOS (CIER 2026)
   ========================================================================== */
let simulatorState = {
  baseIscal: 65.96,
  attributes: []
};

function initIscalSimulator() {
  const simData = (window.CIER_DATA && window.CIER_DATA.simulador_mejora_iscal)
    ? window.CIER_DATA.simulador_mejora_iscal
    : (window.DASHBOARD_DATA ? window.DASHBOARD_DATA.simulador_mejora_iscal : null);
  if (!simData) return;

  simulatorState.baseIscal = simData.linea_base_epec.iscal || 65.96;
  simulatorState.attributes = simData.atributos_simulables.map(a => ({
    ...a,
    sim_val: a.sat_base
  }));

  renderSimulatorSliders();
  updateSimulatorCalculations();
}

function renderSimulatorSliders() {
  const container = document.getElementById('iscal-sliders-container');
  if (!container) return;

  container.innerHTML = simulatorState.attributes.map(attr => {
    const isQ1 = attr.cuadrante.includes('Q1');
    const badgeClass = isQ1 ? 'badge-red' : 'badge-amber';
    return `
      <div class="slider-card" id="slider-card-${attr.codigo}">
        <div class="slider-card-header">
          <div class="d-flex align-items-center gap-2">
            <span class="badge-tag font-mono font-bold">${attr.codigo}</span>
            <span class="q-badge ${badgeClass}" style="font-size: 0.65rem;">${attr.cuadrante}</span>
          </div>
          <span class="text-muted font-mono" style="font-size: 0.72rem;">Peso: <strong>${attr.imp_pct.toFixed(2)}%</strong></span>
        </div>
        
        <div class="slider-attr-name mt-1" title="${attr.nombre}">${attr.nombre}</div>

        <div class="slider-val-row mt-2">
          <span class="text-muted" style="font-size: 0.75rem;">Base: <strong>${attr.sat_base.toFixed(1)}</strong></span>
          <span class="slider-current-val font-mono" id="slider-val-${attr.codigo}">${attr.sim_val.toFixed(1)} pts</span>
          <span class="slider-delta-pill" id="slider-delta-${attr.codigo}">+0.0</span>
        </div>

        <div class="slider-control-wrapper mt-2">
          <input type="range" min="30" max="95" step="0.5" 
            value="${attr.sim_val}" 
            class="custom-range-slider" 
            id="input-range-${attr.codigo}" 
            oninput="onSimulatorSliderChange('${attr.codigo}', this.value)"
          >
        </div>
      </div>
    `;
  }).join('');
}

window.onSimulatorSliderChange = function(code, val) {
  const numVal = parseFloat(val);
  const attr = simulatorState.attributes.find(a => a.codigo === code);
  if (attr) {
    attr.sim_val = numVal;
    const valEl = document.getElementById(`slider-val-${code}`);
    const deltaEl = document.getElementById(`slider-delta-${code}`);
    if (valEl) valEl.textContent = `${numVal.toFixed(1)} pts`;
    if (deltaEl) {
      const diff = numVal - attr.sat_base;
      deltaEl.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`;
      deltaEl.className = `slider-delta-pill ${diff > 0 ? 'pos' : diff < 0 ? 'neg' : ''}`;
    }
  }

  // Clear active state from preset scenario buttons if modified manually
  document.querySelectorAll('.btn-scenario').forEach(b => b.classList.remove('active'));
  updateSimulatorCalculations();
};

function updateSimulatorCalculations() {
  let deltaTotal = 0;
  simulatorState.attributes.forEach(attr => {
    const diff = attr.sim_val - attr.sat_base;
    const contrib = (attr.imp_pct / 100.0) * diff;
    deltaTotal += contrib;
  });

  const projectedIscal = simulatorState.baseIscal + deltaTotal;

  // Update UI Elements
  const iscalValEl = document.getElementById('sim-iscal-val');
  const deltaBadgeEl = document.getElementById('sim-delta-badge');
  const meterSimVal = document.getElementById('meter-sim-val');
  const meterSimFill = document.getElementById('meter-sim-fill');
  const statusBanner = document.getElementById('sim-status-banner');

  if (iscalValEl) iscalValEl.textContent = `${projectedIscal.toFixed(2)}%`;
  if (deltaBadgeEl) {
    deltaBadgeEl.textContent = `${deltaTotal >= 0 ? '+' : ''}${deltaTotal.toFixed(2)} pp vs Base`;
    deltaBadgeEl.className = `sim-delta-badge ${deltaTotal > 0 ? 'badge-up' : deltaTotal < 0 ? 'badge-down' : ''}`;
  }

  if (meterSimVal) meterSimVal.textContent = `${projectedIscal.toFixed(2)}%`;
  if (meterSimFill) {
    // Relative to UTE Uruguay max 86.40%
    const pctFill = Math.min(100, Math.max(10, (projectedIscal / 86.40) * 100));
    meterSimFill.style.width = `${pctFill.toFixed(2)}%`;
    if (projectedIscal >= 70.15) meterSimFill.className = 'meter-fill fill-green';
    else if (projectedIscal >= 68.65) meterSimFill.className = 'meter-fill fill-cyan';
    else meterSimFill.className = 'meter-fill fill-blue';
  }

  if (statusBanner) {
    if (projectedIscal >= 86.40) {
      statusBanner.innerHTML = `🏆 <strong>¡HITO MÁXIMO REGIONAL!</strong> Alcanza la frontera regional de UTE Uruguay (86.40%) consolidando la excelencia sudamericana.`;
      statusBanner.className = 'sim-status-banner banner-green';
    } else if (projectedIscal >= 70.15) {
      statusBanner.innerHTML = `🌎 <strong>¡LIDERAZGO REGIONAL!</strong> Supera la Media CIER Gran Porte (70.15%) e ingresa al <strong>TOP 5 de América Latina</strong>.`;
      statusBanner.className = 'sim-status-banner banner-amber';
    } else if (projectedIscal >= 68.65) {
      statusBanner.innerHTML = `🇦🇷 <strong>¡LÍDER NACIONAL!</strong> Supera a EDENOR y EDEA (68.65%) consagrándose como la <strong>DISTRIBUIDORA #1 DE ARGENTINA</strong>.`;
      statusBanner.className = 'sim-status-banner banner-cyan';
    } else if (deltaTotal > 0.05) {
      statusBanner.innerHTML = `⚡ <strong>Mejora Progresiva:</strong> Crecimiento acumulado de <strong>+${deltaTotal.toFixed(2)} pp</strong> sobre la base 2026.`;
      statusBanner.className = 'sim-status-banner banner-blue';
    } else {
      statusBanner.innerHTML = `📌 <strong>Línea Base 2026:</strong> ISCAL 65.96% · Posición #3 en Argentina (>500k clientes).`;
      statusBanner.className = 'sim-status-banner';
    }
  }
}

window.applySimulatorScenario = function(scenId) {
  document.querySelectorAll('.btn-scenario').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-scenario') === scenId);
  });

  const simData = (window.CIER_DATA && window.CIER_DATA.simulador_mejora_iscal)
    ? window.CIER_DATA.simulador_mejora_iscal
    : (window.DASHBOARD_DATA ? window.DASHBOARD_DATA.simulador_mejora_iscal : null);
  if (!simData) return;

  if (scenId === 'base') {
    simulatorState.attributes.forEach(a => a.sim_val = a.sat_base);
  } else {
    const scen = simData.escenarios_predefinidos.find(s => s.id === scenId);
    if (scen && scen.valores_atributos) {
      simulatorState.attributes.forEach(a => {
        if (scen.valores_atributos[a.codigo] !== undefined) {
          a.sim_val = scen.valores_atributos[a.codigo];
        } else {
          a.sim_val = a.sat_base;
        }
      });
    }
  }

  // Update slider controls and labels
  simulatorState.attributes.forEach(a => {
    const slider = document.getElementById(`input-range-${a.codigo}`);
    const valEl = document.getElementById(`slider-val-${a.codigo}`);
    const deltaEl = document.getElementById(`slider-delta-${a.codigo}`);
    if (slider) slider.value = a.sim_val;
    if (valEl) valEl.textContent = `${a.sim_val.toFixed(1)} pts`;
    if (deltaEl) {
      const diff = a.sim_val - a.sat_base;
      deltaEl.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`;
      deltaEl.className = `slider-delta-pill ${diff > 0 ? 'pos' : diff < 0 ? 'neg' : ''}`;
    }
  });

  updateSimulatorCalculations();
};

window.resetSimulator = function() {
  window.applySimulatorScenario('base');
};"""

        if target_render in content:
            content = content.replace(target_render, enhanced_render, 1)
            print(f'Replaced renderDetractorSection in {jspath}')
        else:
            print(f'target_render not matched in {jspath}')

    with open(jspath, 'w', encoding='utf-8') as f:
        f.write(content)

print('app.js successfully updated across project paths!')
