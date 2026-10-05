import sys

with open(r'D:\Proyectos\encuesta_cier\app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Locate section 
p_start = code.find('/* ==========================================================================\n   RADAR SPIDER CHARTS & GAP BREAKDOWN (4 ESTÁNDARES CIER >500K)')
p_end = code.find('/* ==========================================================================\n   RENDER IMPORTANCE WEIGHTS & AREAS KPI GRID (CIER 2026 OFFICIAL)')

if p_start == -1 or p_end == -1:
    print('ERROR: Section markers not found in app.js')
    sys.exit(1)

new_radar_code = '''/* ==========================================================================
   RADAR SPIDER CHARTS & GAP BREAKDOWN (6 ÍNDICES CAPTURA, 9 SERVICIOS & PAÍSES)
   ========================================================================== */

let currentRadarView = 'sintesis'; // 'sintesis' | 'servicios' | 'paises'
let currentRadarMode = 'all'; // 'all' | 'edenor' | 'estandar_1' | 'estandar_2' | 'estandar_3' | 'estandar_4'

/* 1. Vista Síntesis: 6 Índices Globales de la Captura CIER */
const radarSintesisAxesLabels = [
  'ISCAL (Calidad)',
  'ISG (Satisfacción)',
  'IAC (Aprobación)',
  'IECP (Promotores)',
  'Retención (100-IICP)',
  'IIS (Ideal)'
];

const radarSintesisDataMap = {
  epec: {
    label: 'EPEC 2026 (Actual)',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 2.8,
    data: [65.96, 65.60, 77.60, 27.15, 84.81, 77.56]
  },
  epec_2025: {
    id: 'epec_2025',
    label: 'EPEC 2025 (Base)',
    color: '#64748b',
    bgColor: 'rgba(100, 116, 139, 0.12)',
    borderDash: [2, 2],
    borderWidth: 1.8,
    data: [63.69, 61.12, 75.68, 21.61, 82.34, 70.24]
  },
  edenor: {
    id: 'edenor',
    label: 'EDENOR (Argentina Medida 2025)',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderDash: [3, 3],
    borderWidth: 2.2,
    data: [70.50, 71.20, 78.40, 31.80, 86.20, 77.10],
    insight: '<strong>🇦🇷 EDENOR (Medida Oficial 2025 · Captura CIER):</strong> Registra 70.50% en ISCAL y 78.40% en IAC. EPEC prácticamente empata en Aprobación Institucional (77.60 vs 78.40) y en el Índice Intermedio IIS (77.56 vs 77.10), liderando además en Continuidad y Suministro de Energía.'
  },
  estandar_1: {
    id: 'estandar_1',
    label: '1. TOTAL CIER (Líder UTE)',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.10)',
    borderDash: [3, 3],
    borderWidth: 2,
    data: [86.40, 87.50, 91.20, 58.20, 95.90, 89.40],
    insight: '<strong>🏆 Frontera Máxima (UTE Uruguay · ISCAL 86.40%):</strong> Techo de excelencia regional en gran porte. Destaca con un 58.20% de promotores (IECP) y una insatisfacción mínima del 4.10% (IICP).'
  },
  estandar_2: {
    id: 'estandar_2',
    label: '2. Promedio CIER (>500k)',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.10)',
    borderDash: [4, 4],
    borderWidth: 2,
    data: [70.15, 71.40, 78.50, 32.50, 86.80, 76.80],
    insight: '<strong>📊 Promedio CIER Gran Porte (>500k · ISCAL 70.15%):</strong> EPEC <strong>supera al promedio regional en el Índice Intermedio IIS (+0.76 pts: 77.56 vs 76.80)</strong> y se ubica a tiro de la media en Aprobación IAC (77.60 vs 78.50).'
  },
  estandar_3: {
    id: 'estandar_3',
    label: '3. Top 3 LATAM',
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.10)',
    borderDash: [2, 2],
    borderWidth: 2,
    data: [84.20, 85.10, 89.00, 52.40, 93.80, 86.50],
    insight: '<strong>🌎 Podio Latinoamericano (>500k · ISCAL 84.20%):</strong> Media de UTE, CNFL e ICE. Presenta un sólido 89.00% de Aprobación y alta fidelización.'
  },
  estandar_4: {
    id: 'estandar_4',
    label: '4. Promedio Top 2 Argentina',
    color: '#c084fc',
    bgColor: 'rgba(192, 132, 252, 0.12)',
    borderDash: [3, 3],
    borderWidth: 2.2,
    data: [68.65, 69.80, 77.65, 29.50, 85.60, 76.20],
    insight: '<strong>🇦🇷 Top 2 Argentina (EDENOR y EDEA):</strong> EPEC supera en el Índice Intermedio IIS (77.56 vs 76.20) y prácticamente empata en Aprobación IAC (77.60 vs 77.65).'
  }
};

/* 2. Vista Servicios: 9 Dimensiones Clave */
const radarServiciosAxesLabels = [
  'ISCAL Global',
  'Aprobación (IAC)',
  'Suministro (SE)',
  'Continuidad',
  'Tensión',
  'Factura (FE)',
  'Atención (AT)',
  'Imagen (IM)',
  'Información (IC)'
];

const radarServiciosDataMap = {
  epec: {
    label: 'EPEC 2026 (Actual)',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 2.8,
    data: [65.96, 77.60, 78.48, 85.92, 77.40, 70.38, 68.10, 60.53, 52.03]
  },
  edenor: {
    id: 'edenor',
    label: 'EDENOR (Argentina Medida 2025)',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderDash: [3, 3],
    borderWidth: 2.2,
    data: [70.50, 78.40, 77.80, 85.10, 76.80, 72.10, 69.20, 62.50, 55.40],
    insight: '<strong>🇦🇷 EDENOR (Medida Oficial 2025 · ISCAL 70.50%):</strong> <strong>EPEC es Líder Técnico Nacional</strong>, superando a EDENOR en Suministro (+0.68 pts), Continuidad (+0.82 pts) y Estabilidad de Tensión (+0.60 pts).'
  },
  estandar_1: {
    id: 'estandar_1',
    label: '1. TOTAL CIER (Líder UTE)',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.10)',
    borderDash: [3, 3],
    borderWidth: 2,
    data: [86.40, 91.20, 88.50, 93.40, 87.20, 82.60, 83.40, 79.40, 71.30],
    insight: '<strong>🏆 Frontera Máxima (UTE Uruguay · ISCAL 86.40%):</strong> Techo de excelencia en calidad de producto y atención. EPEC muestra una brecha técnica muy contenida (-10.02 pts en SE).'
  },
  estandar_2: {
    id: 'estandar_2',
    label: '2. Promedio CIER (>500k)',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.10)',
    borderDash: [4, 4],
    borderWidth: 2,
    data: [70.15, 78.50, 77.80, 84.30, 76.20, 72.40, 70.50, 63.80, 57.40],
    insight: '<strong>📊 Promedio CIER Gran Porte (>500k · ISCAL 70.15%):</strong> EPEC <strong>supera el promedio regional en Suministro de Energía (+0.68 pts)</strong>, en <strong>Continuidad (+1.62 pts)</strong> y en <strong>Tensión (+1.20 pts)</strong>.'
  },
  estandar_3: {
    id: 'estandar_3',
    label: '3. Top 3 LATAM',
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.10)',
    borderDash: [2, 2],
    borderWidth: 2,
    data: [84.20, 89.00, 86.60, 91.67, 85.57, 80.67, 81.40, 76.90, 68.83],
    insight: '<strong>🌎 Podio Latinoamericano (>500k · ISCAL 84.20%):</strong> Media de UTE, CNFL e ICE. Destaca solidez de red de EPEC frente a la vanguardia regional.'
  },
  estandar_4: {
    id: 'estandar_4',
    label: '4. Promedio Top 2 Argentina',
    color: '#c084fc',
    bgColor: 'rgba(192, 132, 252, 0.12)',
    borderDash: [3, 3],
    borderWidth: 2.2,
    data: [68.65, 77.65, 77.50, 85.10, 76.80, 70.85, 68.15, 60.60, 54.20],
    insight: '<strong>🇦🇷 Top 2 Argentina sobre EPEC (EDENOR y EDEA · ISCAL 68.65%):</strong> EPEC es <strong>Líder Técnico Nacional</strong> en Suministro (+0.98 pts), Continuidad (+0.82 pts) y Tensión (+0.60 pts).'
  }
};

/* 3. Vista Países: Benchmark por Países LATAM CIER 2026 */
const radarPaisesAxesLabels = [
  'Uruguay',
  'Costa Rica',
  'Rep. Dominicana',
  'El Salvador',
  'Guatemala',
  'Bolivia',
  'Brasil',
  'Ecuador',
  'Argentina (EDENOR)',
  'Argentina (EPEC)',
  'Paraguay',
  'Perú'
];

const radarPaisesValues = [86.4, 83.2, 82.5, 80.9, 78.1, 74.9, 71.7, 70.0, 70.5, 65.96, 61.4, 54.6];

function initRadarEstandaresCharts() {
  const ctxRadar = document.getElementById('chart-radar-estandares');
  const ctxGap = document.getElementById('chart-gap-estandares');
  if (!ctxRadar || !ctxGap) return;

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.15 },
      point: { radius: 3.5, hoverRadius: 6 }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.08)' },
        grid: { color: 'rgba(255,255,255,0.08)' },
        pointLabels: {
          color: '#cbd5e1',
          font: { family: 'Inter', size: 10, weight: '500' }
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#64748b',
          font: { size: 9 },
          stepSize: 15,
          min: 0,
          max: 100
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: { family: 'Inter', size: 10, weight: '500' },
          boxWidth: 10,
          padding: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.raw}% (pts)`
        }
      }
    }
  };

  chartsInstances.radarEstandares = new Chart(ctxRadar, {
    type: 'radar',
    data: {
      labels: radarSintesisAxesLabels,
      datasets: []
    },
    options: radarOptions
  });

  chartsInstances.gapEstandares = new Chart(ctxGap, {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` Diferencia: ${context.raw > 0 ? '+' : ''}${context.raw} pts vs Estándar`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.08)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#f8fafc', font: { family: 'Inter', size: 11, weight: '500' } }
        }
      }
    }
  });

  updateRadarEstandaresView(currentRadarMode, currentRadarView);
}

function updateRadarEstandaresView(mode, view) {
  if (mode !== undefined) currentRadarMode = mode;
  if (view !== undefined) currentRadarView = view;
  if (!chartsInstances.radarEstandares || !chartsInstances.gapEstandares) return;

  const titleEl = document.getElementById('radar-estandares-title');
  const badgeEl = document.getElementById('radar-estandares-badge');
  const gapTitleEl = document.getElementById('gap-estandares-title');
  const insightBox = document.getElementById('radar-insight-box');
  const entitiesRow = document.getElementById('radar-entities-row');

  // Handle View 3: Países LATAM
  if (currentRadarView === 'paises') {
    if (entitiesRow) entitiesRow.style.display = 'none';
    if (titleEl) titleEl.textContent = 'Gráfico de Araña: Benchmark por Países de América Latina (CIER 2026)';
    if (badgeEl) {
      badgeEl.textContent = 'Ranking Regional 2026';
      badgeEl.className = 'badge-tag-blue';
    }
    if (gapTitleEl) gapTitleEl.textContent = 'ISCAL Promedio por País en América Latina';

    chartsInstances.radarEstandares.data.labels = radarPaisesAxesLabels;
    chartsInstances.radarEstandares.data.datasets = [
      {
        label: 'Promedio País CIER 2026',
        data: radarPaisesValues,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.20)',
        borderWidth: 2.2,
        pointBackgroundColor: radarPaisesAxesLabels.map(p => p.includes('EPEC') ? '#06b6d4' : p.includes('EDENOR') ? '#ec4899' : '#38bdf8'),
        pointRadius: radarPaisesAxesLabels.map(p => p.includes('Argentina') ? 5.5 : 3.5)
      }
    ];

    const sortedPaises = radarPaisesAxesLabels.map((p, i) => ({ pais: p, val: radarPaisesValues[i] }))
      .sort((a, b) => b.val - a.val);

    chartsInstances.gapEstandares.data.labels = sortedPaises.map(p => `${p.pais} (${p.val}%)`);
    chartsInstances.gapEstandares.data.datasets = [{
      label: 'ISCAL (%)',
      data: sortedPaises.map(p => p.val),
      backgroundColor: sortedPaises.map(p => p.pais.includes('EPEC') ? 'rgba(6, 182, 212, 0.85)' : p.pais.includes('EDENOR') ? 'rgba(236, 72, 153, 0.85)' : 'rgba(56, 189, 248, 0.65)'),
      borderColor: sortedPaises.map(p => p.pais.includes('EPEC') ? '#06b6d4' : p.pais.includes('EDENOR') ? '#ec4899' : '#38bdf8'),
      borderWidth: 1.5,
      borderRadius: 4
    }];

    if (insightBox) {
      insightBox.innerHTML = `
        <strong>🌎 Comparativa Regional de Países CIER 2026:</strong> Uruguay lidera con UTE (86.4%), seguido por Costa Rica (83.2%) y Rep. Dominicana (82.5%). En Argentina, <strong>EPEC (65.96%)</strong> consolida su posición por encima de Paraguay (61.4%) y Perú (54.6%), con <strong>EDENOR (70.50% en 2025)</strong> como antecedente nacional previo.
      `;
    }

    chartsInstances.radarEstandares.update();
    chartsInstances.gapEstandares.update();
    return;
  }

  // Show entities row for sintesis and servicios
  if (entitiesRow) entitiesRow.style.display = 'flex';

  const isSintesis = (currentRadarView === 'sintesis');
  const dataMap = isSintesis ? radarSintesisDataMap : radarServiciosDataMap;
  const axesLabels = isSintesis ? radarSintesisAxesLabels : radarServiciosAxesLabels;
  const epec = dataMap.epec;

  chartsInstances.radarEstandares.data.labels = axesLabels;

  if (currentRadarMode === 'all') {
    if (titleEl) {
      titleEl.textContent = isSintesis
        ? 'Gráfico de Araña: EPEC vs. Estándares CIER (6 Índices de Síntesis y Cierre)'
        : 'Gráfico de Araña: EPEC vs. Estándares CIER (9 Dimensiones de Servicio)';
    }
    if (badgeEl) {
      badgeEl.textContent = isSintesis ? '6 Índices Globales' : '9 Dimensiones Clave';
      badgeEl.className = 'badge-tag-cyan';
    }
    if (gapTitleEl) gapTitleEl.textContent = 'Diferencial ISCAL: EPEC frente a los Estándares';

    const datasets = [
      {
        label: epec.label,
        data: epec.data,
        borderColor: epec.color,
        backgroundColor: epec.bgColor,
        borderWidth: epec.borderWidth,
        pointBackgroundColor: epec.color
      },
      {
        label: dataMap.edenor.label,
        data: dataMap.edenor.data,
        borderColor: dataMap.edenor.color,
        backgroundColor: 'transparent',
        borderDash: dataMap.edenor.borderDash,
        borderWidth: dataMap.edenor.borderWidth,
        pointBackgroundColor: dataMap.edenor.color
      },
      {
        label: dataMap.estandar_1.label,
        data: dataMap.estandar_1.data,
        borderColor: dataMap.estandar_1.color,
        backgroundColor: 'transparent',
        borderDash: dataMap.estandar_1.borderDash,
        borderWidth: dataMap.estandar_1.borderWidth,
        pointBackgroundColor: dataMap.estandar_1.color
      },
      {
        label: dataMap.estandar_2.label,
        data: dataMap.estandar_2.data,
        borderColor: dataMap.estandar_2.color,
        backgroundColor: 'transparent',
        borderDash: dataMap.estandar_2.borderDash,
        borderWidth: dataMap.estandar_2.borderWidth,
        pointBackgroundColor: dataMap.estandar_2.color
      },
      {
        label: dataMap.estandar_3.label,
        data: dataMap.estandar_3.data,
        borderColor: dataMap.estandar_3.color,
        backgroundColor: 'transparent',
        borderDash: dataMap.estandar_3.borderDash,
        borderWidth: dataMap.estandar_3.borderWidth,
        pointBackgroundColor: dataMap.estandar_3.color
      }
    ];

    if (isSintesis && dataMap.epec_2025) {
      datasets.splice(1, 0, {
        label: dataMap.epec_2025.label,
        data: dataMap.epec_2025.data,
        borderColor: dataMap.epec_2025.color,
        backgroundColor: 'transparent',
        borderDash: dataMap.epec_2025.borderDash,
        borderWidth: dataMap.epec_2025.borderWidth,
        pointBackgroundColor: dataMap.epec_2025.color
      });
    }

    chartsInstances.radarEstandares.data.datasets = datasets;

    chartsInstances.gapEstandares.data.labels = [
      '1. TOTAL CIER (UTE)',
      '2. Promedio CIER (>500k)',
      '3. Top 3 LATAM',
      '4. EDENOR (Argentina)',
      '5. Top 2 Argentina'
    ];
    const diffs = [-20.44, -4.19, -18.24, -4.54, -2.69];
    chartsInstances.gapEstandares.data.datasets = [{
      label: 'Diferencial ISCAL (EPEC vs Estándar)',
      data: diffs,
      backgroundColor: diffs.map(d => d >= 0 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(239, 68, 68, 0.75)'),
      borderColor: diffs.map(d => d >= 0 ? '#10b981' : '#ef4444'),
      borderWidth: 1.5,
      borderRadius: 4
    }];

    if (insightBox) {
      insightBox.innerHTML = isSintesis
        ? `<strong>📊 Síntesis de Índices Globales:</strong> EPEC (65.96% ISCAL y 77.60% IAC) muestra un crecimiento vigoroso frente a su base 2025 (+3.56% IAOP), <strong>supera el Promedio CIER >500k en el Índice Intermedio IIS (77.56 vs 76.80 pts)</strong> y empata en Aprobación con EDENOR (77.60 vs 78.40 pts).`
        : `<strong>⚡ Diagnóstico de Dimensiones Técnicas:</strong> EPEC es <strong>Líder Nacional en Suministro de Energía (78.48 pts)</strong>, en <strong>Continuidad (85.92 pts)</strong> y en <strong>Tensión (77.40 pts)</strong>, superando al Promedio CIER >500k y a EDENOR.`;
    }

  } else {
    const std = dataMap[currentRadarMode];
    if (!std) return;

    if (titleEl) titleEl.textContent = `Gráfico de Araña: EPEC 2026 vs. ${std.label}`;
    if (badgeEl) {
      badgeEl.textContent = `Comparativa Focalizada`;
      badgeEl.className = 'badge-tag-cyan';
    }
    if (gapTitleEl) gapTitleEl.textContent = `Diferencial por Indicador (EPEC vs. ${std.label})`;

    chartsInstances.radarEstandares.data.datasets = [
      {
        label: epec.label,
        data: epec.data,
        borderColor: epec.color,
        backgroundColor: epec.bgColor,
        borderWidth: epec.borderWidth,
        pointBackgroundColor: epec.color
      },
      {
        label: std.label,
        data: std.data,
        borderColor: std.color,
        backgroundColor: std.bgColor,
        borderDash: std.borderDash,
        borderWidth: std.borderWidth,
        pointBackgroundColor: std.color
      }
    ];

    const gaps = axesLabels.map((lbl, i) => {
      const diff = Number((epec.data[i] - std.data[i]).toFixed(2));
      return { label: `${lbl} (${diff > 0 ? '+' : ''}${diff})`, value: diff };
    });

    gaps.sort((a, b) => b.value - a.value);

    chartsInstances.gapEstandares.data.labels = gaps.map(g => g.label);
    chartsInstances.gapEstandares.data.datasets = [{
      label: `Diferencial (EPEC - ${std.label})`,
      data: gaps.map(g => g.value),
      backgroundColor: gaps.map(g => g.value >= 0 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(239, 68, 68, 0.75)'),
      borderColor: gaps.map(g => g.value >= 0 ? '#10b981' : '#ef4444'),
      borderWidth: 1.5,
      borderRadius: 4
    }];

    if (insightBox) {
      insightBox.innerHTML = std.insight;
    }
  }

  chartsInstances.radarEstandares.update();
  chartsInstances.gapEstandares.update();
}
'''

new_code = code[:p_start] + new_radar_code + '\n' + code[p_end:]

# Also update event listeners for subtabs
p_listeners_start = new_code.find('// Radar Spider Chart Standards Filter Buttons')
p_listeners_end = new_code.find('/* ==========================================================================\n   SECTION 16: MATRIZ CONJUNTA DE ACCIONES DE MEJORA')

if p_listeners_start != -1 and p_listeners_end != -1:
    new_listeners = '''// Radar Spider Chart View Switcher (Subtabs: Sintesis / Servicios / Paises)
  document.querySelectorAll('[data-radar-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-radar-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-radar-view') || 'sintesis';
      updateRadarEstandaresView(currentRadarMode, view);
    });
  });

  // Radar Spider Chart Standards Filter Buttons
  document.querySelectorAll('.btn-filter-radar').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-filter-radar').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-radar-mode') || 'all';
      updateRadarEstandaresView(mode, currentRadarView);
    });
  });
'''
    new_code = new_code[:p_listeners_start] + new_listeners + '\n' + new_code[p_listeners_end:]

with open(r'D:\Proyectos\encuesta_cier\app.js', 'w', encoding='utf-8') as f:
    f.write(new_code)

print('SUCCESS: app.js updated with 3 radar views and EDENOR.')
