
// Dashboard Controller Application for CIER Survey (EPEC 2025 - 2026)
// Fully synchronized with enriched SSOT and microdata N=1.250

const cierData = (typeof window.CIER_DATA !== 'undefined') ? window.CIER_DATA : {};

let chartsInstances = {};
let currentScope = 'total'; // 'total', 'capital', 'interior', 'gap'
let currentDimFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSubTabs();
  initCharts();
  renderImportanceWeights();
  renderAreasKPIGrid();
  renderIndicesTable();
  renderBenchmarkTable();
  renderPaisesTable();
  renderEstandaresTable();
  renderArgentinaBenchmarkTable();
  renderDetractorSection();
  renderDictTable();
  renderSSOTChecklist();
  renderFilesGrid();
  initFiltersAndSearch();
  initChartsGuide();
  initModalEvents();
  initMatrizScatterChart();
  renderFocusAttributes();
  initMicrodataPaginationEvents();
  renderPrioritiesTable();
  initIscalSimulator();
});

/* ==========================================================================
   TABS MANAGEMENT & SIDEBAR CONTROLLER
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.sidebar-nav .nav-tab-btn, .nav-tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  const breadcrumbEl = document.getElementById('current-section-breadcrumb');
  const titleEl = document.getElementById('current-section-title');
  const sidebar = document.getElementById('app-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (!targetId) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      if (targetId === 'tab-matriz') {
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
      }

      // Update Topbar Title & Breadcrumb
      const sectionTitle = btn.getAttribute('data-title') || btn.querySelector('.tab-text')?.textContent || 'Sección';
      const shortTitle = btn.querySelector('.tab-text')?.textContent || sectionTitle;
      
      if (breadcrumbEl) breadcrumbEl.textContent = shortTitle;
      if (titleEl) titleEl.textContent = sectionTitle;

      // Close sidebar drawer on mobile if open
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }

      // Smooth scroll to top of window
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger chart resize on active tab
      setTimeout(() => {
        Object.values(chartsInstances).forEach(chart => {
          if (chart && typeof chart.resize === 'function') {
            chart.resize();
          }
        });
      }, 80);
    });
  });

  // Handle URL hash on initial load (e.g. #tab-dictionary)
  const currentHash = (window.location.hash || '').replace('#', '');
  if (currentHash) {
    const matchingBtn = document.querySelector(`[data-tab="${currentHash}"]`);
    if (matchingBtn) {
      setTimeout(() => matchingBtn.click(), 50);
    }
  }
}

function initSubTabs() {
  const subTabBtns = document.querySelectorAll('.sub-tab-btn');
  const subTabContents = document.querySelectorAll('.subtab-content');

  subTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-subtab');
      if (!targetId) return;

      subTabBtns.forEach(b => b.classList.remove('active'));
      subTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
      // If switching to matriz interactive subtab, init/resize chart
      if (targetId === 'subtab-matriz-interactiva') {
        setTimeout(() => {
          initMatrizScatterChart();
        }, 50);
      }
      if (targetId === 'subtab-argentina') {
        renderEstandaresTable();
        renderArgentinaBenchmarkTable();
      }

      setTimeout(() => {
        if (chartsInstances.radar500k) chartsInstances.radar500k.resize();
        if (chartsInstances.gap500k) chartsInstances.gap500k.resize();
        if (chartsInstances.radarEstandares) chartsInstances.radarEstandares.resize();
        if (chartsInstances.gapEstandares) chartsInstances.gapEstandares.resize();
      }, 60);
    });
  });
}

/* ==========================================================================
   CHARTS INITIALIZATION (RADAR & BAR CHARTS)
   ========================================================================== */
function initCharts() {
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.15 },
      point: { radius: 3.5, hoverRadius: 6 }
    },
    scales: {
      r: {
        min: 40,
        max: 100,
        ticks: {
          stepSize: 10,
          color: '#94a3b8',
          backdropColor: 'transparent',
          font: { size: 10, family: 'Inter' }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          lineWidth: 1
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.12)'
        },
        pointLabels: {
          color: '#f8fafc',
          font: { size: 11, weight: '600', family: 'Inter' }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
          font: { size: 11, weight: '600', family: 'Inter' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.raw} pts`
        }
      }
    }
  };

  // 1. Radar 4 Series Global
  const ctxGlobal = document.getElementById('chart-global-radar');
  if (ctxGlobal) {
    chartsInstances.globalRadar = new Chart(ctxGlobal, {
      type: 'radar',
      data: {
        labels: [
          'Suministro (SE)',
          'Factura (FE)',
          'Atención (AT)',
          'Información (IC)',
          'Imagen (IM)',
          'Resp. Socioamb. (RSA)'
        ],
        datasets: [
          {
            label: 'EPEC 2025',
            data: [75.79, 70.21, 66.63, 46.46, 56.54, 55.34],
            borderColor: '#64748b',
            backgroundColor: 'transparent',
            borderDash: [4, 4],
            borderWidth: 1.8,
            pointBackgroundColor: '#64748b'
          },
          {
            label: 'EPEC 2026',
            data: [78.48, 70.38, 68.10, 52.03, 60.53, 59.57],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.25)',
            borderWidth: 2.8,
            pointBackgroundColor: '#06b6d4'
          },
          {
            label: 'Promedio >500k (2026)',
            data: [77.80, 72.40, 70.50, 57.40, 63.80, 60.90],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            borderWidth: 2,
            pointBackgroundColor: '#f59e0b'
          },
          {
            label: 'Mejor >500k (2026)',
            data: [88.50, 82.60, 83.40, 71.30, 79.40, 76.80],
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderDash: [2, 2],
            borderWidth: 1.8,
            pointBackgroundColor: '#10b981'
          }
        ]
      },
      options: radarOptions
    });
  }

  // 2. Radar 500k
  const ctx500k = document.getElementById('chart-radar-500k');
  if (ctx500k) {
    chartsInstances.radar500k = new Chart(ctx500k, {
      type: 'radar',
      data: {
        labels: [
          'ISCAL Global',
          'Aprobación (IAC)',
          'Suministro (SE)',
          'Continuidad (Sin corte)',
          'Tensión (Sin variación)',
          'Factura (FE)',
          'Atención (AT)',
          'Imagen (IM)',
          'Medio Ambiente',
          'Información (IC)'
        ],
        datasets: [
          {
            label: 'EPEC 2026',
            data: [65.96, 77.60, 78.48, 85.92, 77.40, 70.38, 68.10, 60.53, 63.46, 52.03],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.25)',
            borderWidth: 2.5,
            pointBackgroundColor: '#06b6d4'
          },
          {
            label: 'Promedio >500k (2026)',
            data: [70.15, 78.50, 77.80, 84.30, 76.20, 72.40, 70.50, 63.80, 63.20, 57.40],
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#f59e0b'
          },
          {
            label: 'Líder >500k (2026)',
            data: [83.10, 89.60, 88.50, 93.40, 87.20, 82.60, 83.40, 79.40, 80.50, 71.30],
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderDash: [3, 3],
            borderWidth: 1.8,
            pointBackgroundColor: '#10b981'
          }
        ]
      },
      options: radarOptions
    });
  }

  // 3. Gap 500k Bar Chart
  const ctxGap = document.getElementById('chart-gap-500k');
  if (ctxGap) {
    const gapLabels = [
      'Continuidad (+1.62)',
      'Tensión (+1.20)',
      'Canales Pago (+1.10)',
      'Suministro (+0.68)',
      'Medio Amb. (+0.26)',
      'Atención (-2.40)',
      'Factura (-2.02)',
      'Imagen (-3.27)',
      'Información (-5.37)',
      'ISCAL Global (-4.19)'
    ];
    const gapValues = [1.62, 1.20, 1.10, 0.68, 0.26, -2.40, -2.02, -3.27, -5.37, -4.19];

    chartsInstances.gap500k = new Chart(ctxGap, {
      type: 'bar',
      data: {
        labels: gapLabels,
        datasets: [{
          label: 'Brecha EPEC vs Promedio >500k (Puntos)',
          data: gapValues,
          backgroundColor: gapValues.map(v => v >= 0 ? 'rgba(16, 185, 129, 0.75)' : 'rgba(239, 68, 68, 0.75)'),
          borderColor: gapValues.map(v => v >= 0 ? '#10b981' : '#ef4444'),
          borderWidth: 1.5,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` Brecha: ${context.raw > 0 ? '+' : ''}${context.raw} puntos vs Promedio >500k`
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
  }

  // 4. Radar Spider Chart & Gap Analysis for 4 Standards vs EPEC 2026
  initRadarEstandaresCharts();
}

/* ==========================================================================
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

/* ==========================================================================
   RENDER IMPORTANCE WEIGHTS & AREAS KPI GRID (CIER 2026 OFFICIAL)
   ========================================================================== */
function renderImportanceWeights() {
  const container = document.getElementById('importance-weights-container');
  if (!container) return;

  const weights = [
    { area: 'Suministro de Energía', sigla: 'SE', peso: 33.79, idar2025: 75.79, idar2026: 78.48, evol: -0.49, aporte: 26.52, color: 'cyan', icon: '⚡' },
    { area: 'Información y Comunicación', sigla: 'IC', peso: 20.09, idar2025: 59.48, idar2026: 52.03, evol: -1.45, aporte: 2.39, color: 'slate', icon: '📢' },
    { area: 'Factura de Energía', sigla: 'FE', peso: 19.54, idar2025: 70.21, idar2026: 70.38, evol: 2.13, aporte: 12.81, color: 'amber', icon: '📄' },
    { area: 'Atención al Cliente', sigla: 'AT', peso: 17.06, idar2025: 66.63, idar2026: 68.10, evol: -0.68, aporte: 14.61, color: 'blue', icon: '👤' },
    { area: 'Imagen Institucional', sigla: 'IM', peso: 9.52, idar2025: 56.54, idar2026: 60.53, evol: 0.49, aporte: 8.55, color: 'purple', icon: '🏛️' }
  ];

  const barsHtml = `
    <div class="importance-bars-wrapper" style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${weights.map(w => {
        const evolSign = w.evol > 0 ? '+' : '';
        const evolColor = w.evol > 0 ? '#34d399' : (w.evol < 0 ? '#f87171' : '#94a3b8');
        return `
          <div class="importance-item accent-${w.color}">
            <div class="importance-header">
              <span class="importance-name">${w.icon} ${w.area} (${w.sigla})</span>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 0.75rem; color: ${evolColor}; font-weight: 600;">(${evolSign}${w.evol.toFixed(2)} pp)</span>
                <span class="importance-val font-mono">${w.peso.toFixed(2)}%</span>
              </div>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill fill-${w.color}" style="width: ${w.peso * 2.5}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const tableRows = weights.map(w => {
    const evolSign = w.evol > 0 ? '+' : '';
    const evolColor = w.evol > 0 ? '#34d399' : (w.evol < 0 ? '#f87171' : '#cbd5e1');
    return `
      <tr>
        <td class="font-semibold text-slate-100">${w.area}</td>
        <td class="text-center font-bold font-mono text-cyan-300">${w.sigla}</td>
        <td class="text-right text-slate-300 font-mono">${w.idar2025.toFixed(2)}%</td>
        <td class="text-right font-bold text-cyan-400 font-mono">${w.idar2026.toFixed(2)}%</td>
        <td class="text-right font-bold text-amber-400 font-mono">${w.peso.toFixed(2)}%</td>
        <td class="text-right font-mono" style="color: ${evolColor}; font-weight: 600;">${evolSign}${w.evol.toFixed(2)} pp</td>
        <td class="text-right font-bold text-green-400 font-mono">${w.aporte.toFixed(2)} pts</td>
      </tr>
    `;
  }).join('');

  const tableHtml = `
    <div class="table-responsive mt-3" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.75rem;">
      <table class="data-table" style="font-size: 0.8rem; width: 100%;">
        <thead>
          <tr>
            <th>Área Evaluada</th>
            <th style="text-align: center;">Sigla</th>
            <th style="text-align: right;">IDAR 2025</th>
            <th style="text-align: right;">IDAR 2026</th>
            <th style="text-align: right;">Importancia (IR)</th>
            <th style="text-align: right;">Evolución IR al 2026</th>
            <th style="text-align: right;">Aporte Ponderado al ISCAL</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
        <tfoot>
          <tr style="background: rgba(6, 182, 212, 0.12); font-weight: 800; border-top: 2px solid var(--accent-cyan);">
            <td class="text-cyan-300 font-bold">CALIDAD PERCIBIDA GLOBAL</td>
            <td class="text-center text-cyan-300 font-mono font-bold">ISCAL</td>
            <td class="text-right text-slate-300 font-mono">63.69%</td>
            <td class="text-right text-cyan-300 font-mono font-bold">65.96%</td>
            <td class="text-right text-amber-300 font-mono font-bold">100.00%</td>
            <td class="text-right text-slate-400 font-mono">-</td>
            <td class="text-right text-green-300 font-mono font-bold">65.96 pts</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  container.innerHTML = barsHtml + tableHtml;
}

function renderAreasKPIGrid() {
  const container = document.getElementById('areas-kpi-container');
  if (!container) return;

  const areas = (cierData.satisfaccionAreas) || [];
  container.innerHTML = areas.map(a => {
    const isPositive = a.difPuntos >= 0;
    const isCompl = a.complementaria || a.sigla === 'RSA';
    const pesoTag = isCompl 
      ? `<span class="badge-tag-slate" style="font-size: 0.7rem;">Complementaria CIER</span>` 
      : `<span>Peso CIER: <strong style="color: #fbbf24;">${a.pesoCIER ? a.pesoCIER.toFixed(2) : '0'}%</strong></span>`;

    return `
      <div class="area-kpi-card">
        <div class="area-kpi-header">
          <span class="area-sigla">${a.sigla}</span>
          <span class="area-badge ${isPositive ? 'badge-up' : 'badge-down'}">${isPositive ? '+' : ''}${a.varIaop.toFixed(2)}% IAOP</span>
        </div>
        <h4 class="area-name">${a.area}</h4>
        <div class="area-score-row">
          <span class="area-score-curr">${a.indice2026.toFixed(2)}</span>
          <span class="area-score-prev">vs. ${a.indice2025.toFixed(2)} (2025)</span>
        </div>
        <div class="area-footer">
          <span>Nota: <strong>${a.promedioNotas2026 ? a.promedioNotas2026.toFixed(2) : (a.indice2026/10).toFixed(2)}</strong> / 10</span>
          ${pesoTag}
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   RENDER DETAILED INDICES TABLE WITH SCOPE TOGGLE
   ========================================================================== */
function renderIndicesTable() {
  const tbody = document.getElementById('indices-table-body');
  const thead = document.getElementById('indices-table-header');
  if (!tbody || !thead) return;

  const rawIndices = cierData.indices || [];
  const rawRegional = cierData.regionalData || [];
  const searchVal = (document.getElementById('indices-search-input')?.value || '').toLowerCase().trim();

  // Determine which dataset and columns to show based on currentScope
  if (currentScope === 'total') {
    thead.innerHTML = `
      <th>Dimensión</th>
      <th>Sigla</th>
      <th>Tipo</th>
      <th>Atributo Canónico</th>
      <th>Índice 2025 (Base)</th>
      <th>Índice 2026 (Actual)</th>
      <th>Nota Prom. 2026</th>
      <th>Dif. Puntos (2026 vs 2025)</th>
      <th>Var. IAOP (%)</th>
    `;

    const filtered = rawIndices.filter(item => {
      if (item.sigla === 'Sigla' || item.atributo === 'Descripción resumida') return false;
      const matchDim = (currentDimFilter === 'all') || (item.area === currentDimFilter);
      const matchSearch = !searchVal || 
        item.atributo.toLowerCase().includes(searchVal) || 
        item.sigla.toLowerCase().includes(searchVal) ||
        item.area.toLowerCase().includes(searchVal);
      return matchDim && matchSearch;
    });

    tbody.innerHTML = filtered.map(item => {
      const dif = item.difPuntos || (item.indice2026 - item.indice2025);
      const difClass = dif > 0 ? 'text-green font-semibold' : (dif < 0 ? 'text-red font-semibold' : 'text-slate');
      const iaopClass = item.varIaop > 0 ? 'badge-pill-green' : (item.varIaop < 0 ? 'badge-pill-red' : 'badge-pill-slate');

      return `
        <tr>
          <td><span class="dim-tag">${item.area}</span></td>
          <td><code class="code-badge">${item.sigla || '-'}</code></td>
          <td><span class="type-tag">${item.tipo || '-'}</span></td>
          <td class="font-medium text-slate-100">${item.atributo}</td>
          <td class="text-right text-slate-400">${item.indice2025 ? item.indice2025.toFixed(2) : '-'}</td>
          <td class="text-right font-bold text-cyan-400">${item.indice2026 ? item.indice2026.toFixed(2) : '-'}</td>
          <td class="text-right font-semibold text-slate-200">${item.notaPromedio2026 ? item.notaPromedio2026.toFixed(2) : '-'}</td>
          <td class="text-right ${difClass}">${dif > 0 ? '+' : ''}${dif.toFixed(2)}</td>
          <td class="text-right"><span class="${iaopClass}">${item.varIaop > 0 ? '+' : ''}${item.varIaop.toFixed(2)}%</span></td>
        </tr>
      `;
    }).join('');

  } else {
    // Regional Scope Table
    thead.innerHTML = `
      <th>Atributo Canónico</th>
      <th>Sigla</th>
      <th>Tipo</th>
      <th>Capital 2025</th>
      <th>Capital 2026 (Actual)</th>
      <th>Interior 2025</th>
      <th>Interior 2026 (Actual)</th>
      <th>Brecha Territorial (Capital vs Interior 2026)</th>
    `;

    const filteredReg = rawRegional.filter(item => {
      if (item.sigla === 'Sigla' || item.atributo === 'Descripción resumida') return false;
      const matchSearch = !searchVal || 
        item.atributo.toLowerCase().includes(searchVal) || 
        item.sigla.toLowerCase().includes(searchVal);
      return matchSearch;
    });

    tbody.innerHTML = filteredReg.map(item => {
      const gap = item.brecha2026 || (item.capital2026 - item.interior2026);
      const gapClass = gap > 0 ? 'text-cyan-400 font-semibold' : (gap < 0 ? 'text-amber-400 font-semibold' : 'text-slate');
      const gapLabel = gap > 0 ? `+${gap.toFixed(2)} (Mayor en Capital)` : (gap < 0 ? `${gap.toFixed(2)} (Mayor en Interior)` : '0.00 (Igual)');

      return `
        <tr>
          <td class="font-medium text-slate-100">${item.atributo}</td>
          <td><code class="code-badge">${item.sigla || '-'}</code></td>
          <td><span class="type-tag">${item.tipo || '-'}</span></td>
          <td class="text-right text-slate-400">${item.capital2025 ? item.capital2025.toFixed(2) : '-'}</td>
          <td class="text-right font-bold text-cyan-400">${item.capital2026 ? item.capital2026.toFixed(2) : '-'}</td>
          <td class="text-right text-slate-400">${item.interior2025 ? item.interior2025.toFixed(2) : '-'}</td>
          <td class="text-right font-bold text-blue-400">${item.interior2026 ? item.interior2026.toFixed(2) : '-'}</td>
          <td class="text-right ${gapClass}">${gapLabel}</td>
        </tr>
      `;
    }).join('');
  }
}

/* ==========================================================================
   RENDER BENCHMARK AND INTERNATIONAL PAISES TABLES
   ========================================================================== */
function renderBenchmarkTable() {
  const tbody = document.getElementById('benchmark-table-body');
  if (!tbody) return;

  const bench = cierData.benchmark || [];
  tbody.innerHTML = bench.map(b => {
    const gap = (b.epec2026 - b.prom500k2026);
    const posTag = gap >= 0 
      ? `<span class="badge-pill-green">🟢 +${gap.toFixed(2)} pts Liderazgo</span>` 
      : `<span class="badge-pill-amber">🟡 ${gap.toFixed(2)} pts Brecha</span>`;

    return `
      <tr>
        <td class="font-semibold text-slate-100">${b.dim}</td>
        <td class="text-right text-slate-400">${b.epec2025.toFixed(2)}</td>
        <td class="text-right font-bold text-cyan-400">${b.epec2026.toFixed(2)}</td>
        <td class="text-right text-slate-400">${b.prom500k2025.toFixed(2)}</td>
        <td class="text-right font-semibold text-amber-400">${b.prom500k2026.toFixed(2)}</td>
        <td class="text-right text-slate-300">${b.cierTotal2026 ? b.cierTotal2026.toFixed(2) : '-'}</td>
        <td class="text-right font-bold text-green-400">${b.lider500k2026.toFixed(2)}</td>
        <td class="text-center">${posTag}</td>
      </tr>
    `;
  }).join('');
}

function renderPaisesTable() {
  const tbody = document.getElementById('paises-table-body');
  if (!tbody) return;

  const paises = cierData.internationalData || [];
  tbody.innerHTML = paises.map(p => {
    const isEpec = p.destacado && p.pais.includes('EPEC');
    const rowClass = isEpec ? 'highlight-row-cyan' : (p.destacado ? 'highlight-row-slate' : '');

    return `
      <tr class="${rowClass}">
        <td class="font-bold ${isEpec ? 'text-cyan-400' : 'text-slate-100'}">${p.pais}</td>
        <td><span class="type-tag">${p.tipo}</span></td>
        <td class="text-right font-bold">${p.iscal.toFixed(2)}</td>
        <td class="text-right font-semibold">${p.iac.toFixed(2)}</td>
        <td class="text-right">${p.se.toFixed(2)}</td>
        <td class="text-right">${p.at.toFixed(2)}</td>
        <td class="text-right">${p.fe.toFixed(2)}</td>
        <td class="text-right">${p.im.toFixed(2)}</td>
      </tr>
    `;
  }).join('');
}

function renderEstandaresTable() {
  const tbody = document.getElementById('estandares-comparison-tbody');
  if (!tbody) return;

  const estandares = cierData.benchmarkEstandares || [];
  const epecItem = estandares.find(e => e.id === 'epec_actual') || { iscal: 65.96 };

  tbody.innerHTML = estandares.map(e => {
    const isEpec = e.id === 'epec_actual';
    const rowClass = isEpec ? 'highlight-row-cyan' : '';
    const nameColor = isEpec ? 'color: #38bdf8; font-weight: 800;' : 'color: #f8fafc; font-weight: 700;';

    // Calculate gap vs EPEC
    const gap = e.iscal - epecItem.iscal;
    let gapBadge = '';
    if (isEpec) {
      gapBadge = `<span class="badge-tag-cyan" style="font-size: 0.72rem; font-weight: 700;">⭐ Base de Referencia</span>`;
    } else if (gap > 0) {
      gapBadge = `<span class="badge-pill-amber font-mono" style="font-size: 0.75rem;">+${gap.toFixed(2)} pp s/EPEC</span>`;
    } else {
      gapBadge = `<span class="badge-pill-green font-mono" style="font-size: 0.75rem;">${gap.toFixed(2)} pp</span>`;
    }

    return `
      <tr class="${rowClass}">
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.2rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span>${e.icono}</span>
              <span style="${nameColor}">${e.titulo}</span>
              ${isEpec ? '<span class="badge-tag-cyan" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">EPEC Actual</span>' : ''}
            </div>
            <span class="text-slate-400" style="font-size: 0.73rem;">${e.subtitulo}</span>
          </div>
        </td>
        <td class="text-right font-bold ${isEpec ? 'text-cyan-300' : 'text-slate-100'} font-mono">${e.iscal.toFixed(2)}%</td>
        <td class="text-right font-semibold ${isEpec ? 'text-cyan-400' : 'text-slate-200'} font-mono">${e.iac.toFixed(2)}</td>
        <td class="text-right ${isEpec ? 'text-green-400 font-bold' : 'text-slate-200'} font-mono">${e.se.toFixed(2)}</td>
        <td class="text-right ${isEpec ? 'text-green-300 font-bold' : 'text-slate-300'} font-mono">${e.continuidad ? e.continuidad.toFixed(2) : '-'}</td>
        <td class="text-right text-slate-300 font-mono">${e.fe.toFixed(2)}</td>
        <td class="text-right text-slate-300 font-mono">${e.at.toFixed(2)}</td>
        <td class="text-right text-slate-300 font-mono">${e.im.toFixed(2)}</td>
        <td class="text-right text-slate-300 font-mono">${e.ic ? e.ic.toFixed(2) : '-'}</td>
        <td class="text-center">${gapBadge}</td>
      </tr>
    `;
  }).join('');
}

function renderArgentinaBenchmarkTable() {
  const tbody = document.getElementById('argentina-benchmark-tbody');
  if (!tbody) return;

  const rawList = cierData.argentinaBenchmark || [];
  const grupoFilter = (document.getElementById('arg-filter-grupo')?.value) || 'all';
  const searchVal = (document.getElementById('arg-search-input')?.value || '').toLowerCase().trim();

  const filtered = rawList.filter(item => {
    // Grupo filter
    if (grupoFilter === 'argentina' && item.grupo !== 'argentina') return false;
    if (grupoFilter === 'top10_latam' && item.grupo !== 'top10_latam') return false;
    if (grupoFilter === 'top3_latam' && !['UTE', 'CNFL', 'ICE'].includes(item.nombre)) return false;
    if (grupoFilter === 'top2_arg' && !['EDENOR', 'EPEC'].includes(item.nombre)) return false;

    // Search filter
    if (searchVal) {
      const matchName = item.nombre && item.nombre.toLowerCase().includes(searchVal);
      const matchPais = item.pais && item.pais.toLowerCase().includes(searchVal);
      const matchRonda = item.ronda && item.ronda.toLowerCase().includes(searchVal);
      if (!matchName && !matchPais && !matchRonda) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" class="text-center py-4 text-slate-400">
          No se encontraron distribuidoras para el filtro seleccionado.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(d => {
    const isEpec = d.destacado && d.nombre === 'EPEC';
    const isArg = d.grupo === 'argentina';
    const rowClass = isEpec ? 'highlight-row-cyan' : (isArg ? 'highlight-row-slate' : '');

    // Badges
    const porteBadge = d.porte === '>500k' 
      ? `<span class="badge-tag-blue" style="font-size: 0.7rem; font-weight: 700;">🏢 Gran Porte (>500k)</span>` 
      : `<span class="badge-tag-slate" style="font-size: 0.7rem;">🏘️ Menor Porte (≤500k)</span>`;

    let rondaBadge = `<span class="badge-tag-slate" style="font-size: 0.7rem;">${d.ronda}</span>`;
    if (d.ronda.includes('Top 1')) {
      rondaBadge = `<span class="badge-tag-green" style="font-size: 0.7rem; font-weight: 700;">🏆 ${d.ronda}</span>`;
    } else if (d.ronda.includes('Top 2') || d.ronda.includes('Top 3')) {
      rondaBadge = `<span class="badge-tag-blue" style="font-size: 0.7rem;">⭐ ${d.ronda}</span>`;
    } else if (d.ronda.includes('2026') || isEpec) {
      rondaBadge = `<span class="badge-tag-cyan" style="font-size: 0.7rem; font-weight: 700;">🟢 ${d.ronda}</span>`;
    } else if (d.ronda.includes('2025')) {
      rondaBadge = `<span class="badge-tag-amber" style="font-size: 0.7rem;">🟡 ${d.ronda}</span>`;
    } else if (d.ronda.includes('CACIER')) {
      rondaBadge = `<span class="badge-tag-slate" style="font-size: 0.7rem;">⚪ ${d.ronda}</span>`;
    }

    const iscalVal = d.iscal ? d.iscal.toFixed(2) : '-';
    const iacVal = d.iac ? d.iac.toFixed(2) : '-';
    const seVal = d.se ? d.se.toFixed(2) : '-';
    const feVal = d.fe ? d.fe.toFixed(2) : '-';
    const atVal = d.at ? d.at.toFixed(2) : '-';
    const imVal = d.im ? d.im.toFixed(2) : '-';

    const epecStar = isEpec ? `<span style="color: #38bdf8; margin-right: 0.25rem;">⚡</span>` : '';
    const nameColor = isEpec ? 'color: #38bdf8; font-weight: 800;' : (isArg ? 'color: #f8fafc; font-weight: 700;' : 'color: #f1f5f9; font-weight: 600;');

    return `
      <tr class="${rowClass}">
        <td>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            ${epecStar}
            <span style="${nameColor}">${d.nombre}</span>
            ${isEpec ? '<span class="badge-tag-cyan" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">EPEC Actual</span>' : ''}
          </div>
        </td>
        <td class="text-slate-300" style="font-size: 0.82rem;">${d.pais}</td>
        <td>${porteBadge}</td>
        <td class="text-right text-slate-300 font-mono" style="font-size: 0.82rem;">${d.clientes}</td>
        <td class="text-right font-bold ${isEpec ? 'text-cyan-300 font-mono' : 'text-slate-100 font-mono'}">${iscalVal}%</td>
        <td class="text-right font-semibold ${isEpec ? 'text-cyan-400 font-mono' : 'text-slate-200 font-mono'}">${iacVal}</td>
        <td class="text-right ${isEpec ? 'text-green-400 font-bold font-mono' : 'text-slate-200 font-mono'}">${seVal}</td>
        <td class="text-right text-slate-300 font-mono">${feVal}</td>
        <td class="text-right text-slate-300 font-mono">${atVal}</td>
        <td class="text-right text-slate-300 font-mono">${imVal}</td>
        <td class="text-center">${rondaBadge}</td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
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
};

/* ==========================================================================
   RENDER DICTIONARY, SSOT CHECKLIST, AND RAW FILES GRID
   ========================================================================== */
let activeDictVarCode = null;
let currentDictFilteredList = [];

function switchDictSubTab(tabName) {
  const catalogPanel = document.getElementById('dict-subtab-catalog-content');
  const auditPanel = document.getElementById('dict-subtab-audit-content');
  const btnCatalog = document.getElementById('btn-dict-subtab-catalog');
  const btnAudit = document.getElementById('btn-dict-subtab-audit');

  if (tabName === 'audit') {
    if (catalogPanel) catalogPanel.style.display = 'none';
    if (auditPanel) auditPanel.style.display = 'block';
    if (btnCatalog) btnCatalog.classList.remove('active');
    if (btnAudit) btnAudit.classList.add('active');
  } else {
    if (catalogPanel) catalogPanel.style.display = 'block';
    if (auditPanel) auditPanel.style.display = 'none';
    if (btnCatalog) btnCatalog.classList.add('active');
    if (btnAudit) btnAudit.classList.remove('active');
  }
}

window.switchDictSubTab = switchDictSubTab;

function renderDictTable() {
  const tbody = document.getElementById('dict-table-body');
  if (!tbody) return;

  const dict = cierData.dictionary || [];
  const searchVal = (document.getElementById('dict-search-input')?.value || '').toLowerCase().trim();
  const dimFilter = document.getElementById('dict-dim-filter')?.value || 'all';
  const fuenteFilter = document.getElementById('dict-fuente-filter')?.value || 'all';
  const utilFilter = document.getElementById('dict-utilizacion-filter')?.value || 'all';
  const scaleFilter = document.getElementById('dict-scale-filter')?.value || 'all';
  const yearFilter = document.getElementById('dict-year-filter')?.value || 'all';

  const filtered = dict.filter(d => {
    // 1. Dimension filter
    if (dimFilter !== 'all') {
      const dDimId = (d.dimension_id || '').toLowerCase();
      const dDim = (d.dimension || d.Dimension_Tematica || '').toLowerCase();
      if (!dDimId.includes(dimFilter.toLowerCase()) && !dDim.includes(dimFilter.toLowerCase())) {
        return false;
      }
    }

    // 2. Fuente de Captura Filter
    if (fuenteFilter !== 'all') {
      const fuente = (d.fuente_captura || '').toLowerCase();
      if (fuenteFilter === 'cliente' && !fuente.includes('cliente')) return false;
      if (fuenteFilter === 'encuestador' && !fuente.includes('encuestador')) return false;
    }

    // 3. Tasa de Utilización Filter
    if (utilFilter !== 'all') {
      const pct = d.pct_muestra_2026 || '100.0%';
      if (utilFilter === '100' && pct !== '100.0%') return false;
      if (utilFilter === 'condicional' && pct === '100.0%') return false;
    }

    // 4. Scale Type Filter
    if (scaleFilter !== 'all') {
      const cat = d.categoria_escala || '';
      if (cat !== scaleFilter) return false;
    }

    // 5. Year / Comparative Status filter
    if (yearFilter !== 'all') {
      if (yearFilter === 'ambos' && (!d.en_2025 || !d.en_2026)) return false;
      if (yearFilter === '2026' && !d.en_2026) return false;
      if (yearFilter === '2025' && !d.en_2025) return false;
    }

    // 6. Text Search filter (Searches code, name/question, dimension, skip logic, and response options text!)
    if (searchVal) {
      const v = (d.variable || d.Variable || d.codigo || '').toLowerCase();
      const dim = (d.dimension || d.Dimension_Tematica || '').toLowerCase();
      const n = (d.nombre || d.Atributo || d.definicion || '').toLowerCase();
      const e = (d.tipo_escala || d.escala || '').toLowerCase();
      const skip = (d.skip_logic || '').toLowerCase();
      const fuente = (d.fuente_captura || '').toLowerCase();
      
      // Search inside options
      let optsText = '';
      if (d.opciones) {
        optsText = Object.entries(d.opciones).map(([k, val]) => `${k} ${val}`).join(' ').toLowerCase();
      }

      if (!v.includes(searchVal) && !dim.includes(searchVal) && !n.includes(searchVal) && !e.includes(searchVal) && !skip.includes(searchVal) && !fuente.includes(searchVal) && !optsText.includes(searchVal)) {
        return false;
      }
    }

    return true;
  });

  currentDictFilteredList = filtered;

  // Update counter badge
  const counterBadge = document.getElementById('dict-counter-badge');
  if (counterBadge) {
    counterBadge.textContent = `${filtered.length} de ${dict.length} Variables`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <p style="font-size: 1rem; margin-bottom: 0.5rem;">🔍 No se encontraron variables con los filtros aplicados.</p>
          <button onclick="resetDictFilters()" class="btn-primary mt-2" style="font-size: 0.8rem; padding: 0.35rem 0.9rem;">Restablecer Filtros</button>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(d => {
    const v = d.variable || d.Variable || d.codigo || '-';
    const dim = d.dimension || d.Dimension_Tematica || '-';
    const n = d.nombre || d.Atributo || d.definicion || '-';
    const t = d.tipo || d.Estado_Comparativo || 'Estándar CIER';
    const scaleType = d.tipo_escala || 'Escala CIER';
    const scaleCat = d.categoria_escala || 'likert';
    const totalOpts = d.total_opciones || (d.opciones ? Object.keys(d.opciones).length : 0);

    const fuente = d.fuente_captura || '👤 Cliente';
    const isCliente = fuente.includes('Cliente');
    const pct = d.pct_muestra_2026 || '100.0%';
    const nEnc = d.n_muestra_2026 || 625;
    const is100 = pct === '100.0%';
    const skipLogic = d.skip_logic || 'Sin saltos. Aplicada al 100% de la muestra.';
    const idatScore = d.idat_score;

    const safeVar = v.replace(/"/g, '&quot;');
    const isNew2026 = t.includes('2026 (Nueva)');
    const isOnly2025 = t.includes('Solo 2025');

    let statusPill = '';
    if (isNew2026) {
      statusPill = `<span class="badge-tag-blue" style="font-size: 0.68rem; margin-left: 0.35rem;">✨ Nueva 2026</span>`;
    } else if (isOnly2025) {
      statusPill = `<span class="badge-tag-slate" style="font-size: 0.68rem; margin-left: 0.35rem;">⏳ Solo 2025</span>`;
    }

    const fuenteBadgeClass = isCliente ? 'fuente-badge-cliente' : 'fuente-badge-encuestador';
    const pctPillClass = is100 ? 'pct-100' : (parseFloat(pct) < 10 ? 'pct-rare' : 'pct-cond');

    return `
      <tr id="dict-row-${v}">
        <td>
          <code class="code-badge font-bold" onclick="openDictOptionsModal('${safeVar}')" title="Clic para ver respuestas y detalles" style="cursor: pointer;">${v}</code>
        </td>
        <td><span class="dim-tag">${dim}</span></td>
        <td>
          <span class="font-semibold text-slate-100">${n}</span>
          ${statusPill}
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-start;">
            <span class="${fuenteBadgeClass}">${fuente}</span>
            <span class="sample-pct-pill ${pctPillClass}">📊 ${pct} (N=${nEnc})</span>
          </div>
        </td>
        <td>
          <span class="dict-scale-badge scale-${scaleCat}">${scaleType}</span>
        </td>
        <td style="text-align: center; white-space: nowrap;">
          <button class="dict-btn-options" onclick="openDictOptionsModal('${safeVar}')" title="Ver opciones de respuesta para el encuestado">
            <span>📋</span> Ver Respuestas <span class="options-count-badge">${totalOpts}</span>
          </button>
          <button class="dict-btn-quick-view" onclick="toggleDictRowDrawer('${safeVar}', this)" title="Vista rápida en tabla" id="btn-quick-${v}">
            ▼
          </button>
        </td>
      </tr>
      <tr class="dict-drawer-row" id="dict-drawer-${v}" style="display: none;">
        <td colspan="6">
          <div class="dict-inline-drawer">
            <div class="dict-drawer-header">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan);">
                📋 Opciones que el encuestado puede elegir (${totalOpts} alternativas codificadas):
              </span>
              <button onclick="openDictOptionsModal('${safeVar}')" class="btn-secondary" style="padding: 0.2rem 0.6rem; font-size: 0.72rem;">
                🔍 Abrir en Visor Completo
              </button>
            </div>
            <div class="dict-drawer-chips-grid">
              ${renderInlineOptionChips(d)}
            </div>
            <!-- Skip logic & IDAT summary bar in drawer -->
            <div style="margin-top: 0.75rem; padding: 0.45rem 0.75rem; background: rgba(15, 23, 42, 0.7); border-radius: 6px; font-size: 0.78rem; color: #cbd5e1; border-left: 3px solid #f59e0b; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem;">
              <div>
                <strong style="color: #fbbf24;">⚡ Lógica de Salto (Skip Logic):</strong> ${skipLogic}
              </div>
              ${idatScore ? `<span class="badge-tag-blue" style="font-size: 0.72rem;">🎯 IDAT Resultante: <strong>${idatScore}</strong></span>` : ''}
            </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderInlineOptionChips(d) {
  const opts = d.opciones || d.opciones_2026 || d.opciones_2025 || {};
  const entries = Object.entries(opts);
  if (entries.length === 0) {
    return `<span class="text-slate-400" style="font-size: 0.78rem;">Pregunta de valor numérico continuo o respuesta abierta (sin opciones prefijadas).</span>`;
  }

  // Show up to 16 chips in inline drawer
  const maxChips = 16;
  const visible = entries.slice(0, maxChips);
  const remaining = entries.length - maxChips;

  let html = visible.map(([code, label]) => {
    return `
      <div class="dict-option-chip">
        <span class="dict-chip-code">${code}</span>
        <span class="dict-chip-text">${label}</span>
      </div>
    `;
  }).join('');

  if (remaining > 0) {
    html += `
      <button onclick="openDictOptionsModal('${d.variable}')" class="dict-option-chip" style="background: rgba(6, 182, 212, 0.15); border-color: var(--accent-cyan); color: #38bdf8; cursor: pointer;">
        + ${remaining} opciones más... (Ver todas)
      </button>
    `;
  }

  return html;
}

function toggleDictRowDrawer(varCode, btnEl) {
  const drawerRow = document.getElementById(`dict-drawer-${varCode}`);
  if (!drawerRow) return;

  const isHidden = drawerRow.style.display === 'none';
  drawerRow.style.display = isHidden ? 'table-row' : 'none';

  if (btnEl) {
    btnEl.textContent = isHidden ? '▲' : '▼';
    btnEl.style.background = isHidden ? 'var(--accent-cyan)' : '';
    btnEl.style.color = isHidden ? '#04101e' : '';
  }
}

function resetDictFilters() {
  const searchInput = document.getElementById('dict-search-input');
  const dimFilter = document.getElementById('dict-dim-filter');
  const fuenteFilter = document.getElementById('dict-fuente-filter');
  const utilFilter = document.getElementById('dict-utilizacion-filter');
  const scaleFilter = document.getElementById('dict-scale-filter');
  const yearFilter = document.getElementById('dict-year-filter');

  if (searchInput) searchInput.value = '';
  if (dimFilter) dimFilter.value = 'all';
  if (fuenteFilter) fuenteFilter.value = 'all';
  if (utilFilter) utilFilter.value = 'all';
  if (scaleFilter) scaleFilter.value = 'all';
  if (yearFilter) yearFilter.value = 'all';

  renderDictTable();
}

/* ==========================================================================
   MODAL CONTROLLER FOR QUESTION & RESPONSE OPTIONS
   ========================================================================== */
function openDictOptionsModal(varCode) {
  const dict = cierData.dictionary || [];
  const item = dict.find(d => (d.variable || d.Variable || d.codigo) === varCode);
  if (!item) return;

  activeDictVarCode = varCode;

  const modal = document.getElementById('dict-options-modal');
  if (!modal) return;

  // Header Elements
  document.getElementById('dict-modal-var-code').textContent = item.variable || varCode;
  document.getElementById('dict-modal-dim-tag').textContent = item.dimension || 'General';
  document.getElementById('dict-modal-type-tag').textContent = item.tipo_escala || 'Escala CIER';
  document.getElementById('dict-modal-question-title').textContent = item.nombre || 'Pregunta del Cuestionario';

  // Audit Badges in Header
  const fuenteTag = document.getElementById('dict-modal-fuente-tag');
  if (fuenteTag) {
    fuenteTag.textContent = item.fuente_captura || '👤 Cliente';
    const isCliente = (item.fuente_captura || '').includes('Cliente');
    fuenteTag.className = isCliente ? 'fuente-badge-cliente' : 'fuente-badge-encuestador';
  }

  const sampleTag = document.getElementById('dict-modal-sample-tag');
  if (sampleTag) {
    const pct = item.pct_muestra_2026 || '100.0%';
    const n = item.n_muestra_2026 || 625;
    sampleTag.textContent = `${pct} (N=${n})`;
    if (pct === '100.0%') {
      sampleTag.style.background = 'rgba(16, 185, 129, 0.15)';
      sampleTag.style.color = '#34d399';
      sampleTag.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    } else {
      sampleTag.style.background = 'rgba(245, 158, 11, 0.15)';
      sampleTag.style.color = '#fbbf24';
      sampleTag.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    }
  }

  const idatTag = document.getElementById('dict-modal-idat-tag');
  if (idatTag) {
    if (item.idat_score) {
      idatTag.style.display = 'inline-block';
      idatTag.textContent = `🎯 IDAT: ${item.idat_score}`;
    } else {
      idatTag.style.display = 'none';
    }
  }

  // Audit Box inside Modal Body
  const auditGroup = document.getElementById('dict-modal-audit-group');
  if (auditGroup) auditGroup.textContent = item.grupo_metodologico || 'Cuestionario General CIER';

  const auditFuente = document.getElementById('dict-modal-audit-fuente');
  if (auditFuente) auditFuente.textContent = item.fuente_captura || '👤 Cliente (Declaración Asistida con Tarjeta Visual)';

  const auditPct = document.getElementById('dict-modal-audit-pct');
  if (auditPct) {
    const pct = item.pct_muestra_2026 || '100.0%';
    const n = item.n_muestra_2026 || 625;
    auditPct.textContent = `${pct} (${n} de 625 encuestados)`;
    auditPct.style.color = pct === '100.0%' ? '#10b981' : '#f59e0b';
  }

  const auditSkip = document.getElementById('dict-modal-audit-skip');
  if (auditSkip) {
    auditSkip.textContent = item.skip_logic || 'Sin saltos. Lo responde la totalidad de la muestra para calcular los índices oficiales de la CIER.';
  }

  // Scale Info Explanation
  const scaleHeading = document.getElementById('dict-scale-heading');
  const scaleExp = document.getElementById('dict-scale-explanation');
  const scaleIcon = document.getElementById('dict-scale-icon');

  if (item.categoria_escala === 'likert') {
    if (scaleIcon) scaleIcon.textContent = '⭐';
    if (scaleHeading) scaleHeading.textContent = 'Escala Likert de Satisfacción (1 a 10):';
    if (scaleExp) scaleExp.textContent = 'El encuestado evalúa del 1 (Totalmente Insatisfecho / Pésimo) al 10 (Totalmente Satisfecho / Excelente). Se complementa con códigos especiales (-77 No Sabe, -88 No Aplica, -99 Sin Respuesta).';
  } else if (item.categoria_escala === 'binaria') {
    if (scaleIcon) scaleIcon.textContent = '✔';
    if (scaleHeading) scaleHeading.textContent = 'Pregunta Binaria Dicotómica:';
    if (scaleExp) scaleExp.textContent = 'Opciones cerradas de afirmación o negación (1 = Sí, 2 = No).';
  } else if (item.categoria_escala === 'categorica') {
    if (scaleIcon) scaleIcon.textContent = '📋';
    if (scaleHeading) scaleHeading.textContent = 'Pregunta de Selección Categórica / Múltiple:';
    if (scaleExp) scaleExp.textContent = 'El encuestado elige entre una lista cerrada y estandarizada de opciones codificadas por la metodología CIER.';
  } else {
    if (scaleIcon) scaleIcon.textContent = '🔢';
    if (scaleHeading) scaleHeading.textContent = 'Dato Numérico / Relevamiento Directo:';
    if (scaleExp) scaleExp.textContent = 'Registro de valor continuo (ej. consumo en kWh, importe en pesos, antigüedad en años).';
  }

  // Year Tab Setup
  const tab2026 = document.getElementById('dict-tab-year-2026');
  const tab2025 = document.getElementById('dict-tab-year-2025');
  const tabAll = document.getElementById('dict-tab-year-all');

  const count2026 = item.opciones_2026 ? Object.keys(item.opciones_2026).length : 0;
  const count2025 = item.opciones_2025 ? Object.keys(item.opciones_2025).length : 0;

  if (tab2026) tab2026.textContent = `Ronda 2026 (${count2026} opts)`;
  if (tab2025) tab2025.textContent = `Ronda 2025 (${count2025} opts)`;

  // Default active tab
  document.querySelectorAll('.dict-year-tab').forEach(t => t.classList.remove('active'));
  let defaultYear = '2026';
  if (count2026 > 0 && tab2026) {
    tab2026.classList.add('active');
    defaultYear = '2026';
  } else if (tab2025) {
    tab2025.classList.add('active');
    defaultYear = '2025';
  }

  // Clear modal search
  const modalSearch = document.getElementById('dict-modal-search-input');
  if (modalSearch) modalSearch.value = '';

  // Render options inside modal
  renderModalOptions(item, defaultYear);

  // Show modal
  modal.classList.add('active');
}

function renderModalOptions(item, selectedYear) {
  const container = document.getElementById('dict-modal-options-grid');
  const countTag = document.getElementById('dict-modal-count-tag');
  if (!container) return;

  const searchVal = (document.getElementById('dict-modal-search-input')?.value || '').toLowerCase().trim();

  let optionsToRender = {};
  if (selectedYear === '2026') {
    optionsToRender = item.opciones_2026 || item.opciones || {};
  } else if (selectedYear === '2025') {
    optionsToRender = item.opciones_2025 || item.opciones || {};
  } else {
    // Merged/Comparative
    const merged = {};
    if (item.opciones_2026) {
      Object.entries(item.opciones_2026).forEach(([k, v]) => { merged[k] = `[2026] ${v}`; });
    }
    if (item.opciones_2025) {
      Object.entries(item.opciones_2025).forEach(([k, v]) => {
        if (merged[k]) {
          merged[k] = `${merged[k]} | [2025] ${v}`;
        } else {
          merged[k] = `[2025] ${v}`;
        }
      });
    }
    optionsToRender = merged;
  }

  let entries = Object.entries(optionsToRender);

  // Filter if modal search active
  if (searchVal) {
    entries = entries.filter(([code, label]) => {
      return code.toLowerCase().includes(searchVal) || label.toLowerCase().includes(searchVal);
    });
  }

  if (countTag) {
    countTag.textContent = `${entries.length} Opciones`;
  }

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <p class="text-slate-300">No se encontraron opciones para el criterio seleccionado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = entries.map(([code, label]) => {
    let categoryClass = 'opt-neutral';
    let categoryTag = 'Opción Categórica';

    const numCode = parseInt(code, 10);
    if (code === '-77' || code === '-88' || code === '-99' || code.startsWith('-')) {
      categoryClass = 'opt-special';
      categoryTag = 'Código Especial / No Aplica';
    } else if (item.categoria_escala === 'likert') {
      if (!isNaN(numCode)) {
        if (numCode >= 8) {
          categoryClass = 'opt-positive';
          categoryTag = '⭐ Calificación Positiva (Promotor / Excelencia)';
        } else if (numCode >= 5) {
          categoryClass = 'opt-neutral';
          categoryTag = '🟡 Calificación Neutra (Pasivo / Aceptable)';
        } else {
          categoryClass = 'opt-negative';
          categoryTag = '🔴 Calificación Negativa (Detractor / Oportunidad)';
        }
      }
    } else if (item.categoria_escala === 'binaria') {
      if (code === '1') {
        categoryClass = 'opt-positive';
        categoryTag = '✔ Afirmativo (Sí)';
      } else {
        categoryClass = 'opt-negative';
        categoryTag = '✖ Negativo (No)';
      }
    }

    return `
      <div class="dict-option-card ${categoryClass}">
        <div class="dict-code-bubble">${code}</div>
        <div class="dict-option-content">
          <div class="dict-option-text">${label}</div>
          <div class="dict-option-tag">${categoryTag}</div>
        </div>
      </div>
    `;
  }).join('');
}

function closeDictModal() {
  const modal = document.getElementById('dict-options-modal');
  if (modal) modal.classList.remove('active');
}

function navigateDictVar(delta) {
  if (!activeDictVarCode || currentDictFilteredList.length === 0) return;
  const currentIdx = currentDictFilteredList.findIndex(d => (d.variable || d.Variable || d.codigo) === activeDictVarCode);
  if (currentIdx === -1) return;

  let nextIdx = currentIdx + delta;
  if (nextIdx < 0) nextIdx = currentDictFilteredList.length - 1;
  if (nextIdx >= currentDictFilteredList.length) nextIdx = 0;

  const nextVar = currentDictFilteredList[nextIdx];
  if (nextVar) {
    openDictOptionsModal(nextVar.variable || nextVar.Variable || nextVar.codigo);
  }
}

function copyDictOptions() {
  const dict = cierData.dictionary || [];
  const item = dict.find(d => (d.variable || d.Variable || d.codigo) === activeDictVarCode);
  if (!item) return;

  const opts = item.opciones_2026 || item.opciones || {};
  let text = `Variable: ${item.variable} - ${item.nombre}\nDimensión: ${item.dimension}\nEscala: ${item.tipo_escala}\n\nOpciones de Respuesta que el encuestado puede elegir:\n`;
  Object.entries(opts).forEach(([code, label]) => {
    text += `[${code}] ${label}\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('dict-btn-copy-options');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = '✔ ¡Copiado!';
      btn.style.background = 'var(--accent-emerald)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
      }, 2000);
    }
  }).catch(() => {
    alert('No se pudo copiar automáticamente al portapapeles.');
  });
}

// Global window mappings
window.openDictOptionsModal = openDictOptionsModal;
window.closeDictModal = closeDictModal;
window.navigateDictVar = navigateDictVar;
window.copyDictOptions = copyDictOptions;
window.toggleDictRowDrawer = toggleDictRowDrawer;
window.resetDictFilters = resetDictFilters;

function renderSSOTChecklist() {
  const tbody = document.getElementById('ssot-checklist-tbody');
  if (!tbody) return;

  const list = cierData.ssotChecklist || [];
  
  // Mapping for known primary source files to their data/raw link
  const rawLinks = [
    { match: 'Planilla de Índices CIER 2026', url: 'data/raw/2026/Planilla%20de%20%C3%8Dndices%20CIER%202026%20-%20EPEC-AR.xlsx', label: 'Planilla 2026 (.xlsx)' },
    { match: 'Informe Regiones 2026', url: 'data/raw/2026/Informe%20Regiones%202026%20-%20EPEC-AR.pdf', label: 'Informe Regiones (.pdf)' },
    { match: 'Inf Comp Paises 2026', url: 'data/raw/2026/Inf%20Comp%20Paises%202026%20-%20EPEC-AR.pdf', label: 'Comp. Países (.pdf)' },
    { match: 'Análisis de Conglomerados 2026', url: 'data/raw/2026/An%C3%A1lisis%20de%20Conglomerados%202026%20-%20EPEC-AR.pdf', label: 'Conglomerados (.pdf)' },
    { match: 'Informe Com entre Rondas 2026', url: 'data/raw/2026/Informe%20Com%20entre%20Rondas%202026%20-%20EPEC-AR.pdf', label: 'Comp. Rondas (.pdf)' },
    { match: 'Informe Comp entre Distrib 2026', url: 'data/raw/2026/Informe%20Comp%20entre%20Distrib%202026%20-%20EPEC-AR.pdf', label: 'Comp. Distribuidoras (.pdf)' },
    { match: 'BD EPEC-AR.xlsx', url: 'data/raw/2026/%5Bxlsx%5D%20BD%20EPEC-AR.xlsx', label: 'Microdatos BD (.xlsx)' },
    { match: 'Diccionário de datos 2026', url: 'data/raw/2026/%5Bxlsx%5D%20Diccion%C3%A1rio%20de%20datos%202026.xlsx', label: 'Diccionario (.xlsx)' },
    { match: 'data/raw/', url: '#files-grid-container', label: 'Ver Catálogo data/raw/ (30 archivos)', isAnchor: true }
  ];

  tbody.innerHTML = list.map(item => {
    // Check if item.archivo points to a docs file
    const docLink = item.archivo ? `<a href="${item.archivo}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono text-xs"><code>${item.archivo}</code> <span style="font-size: 0.75rem;">↗</span></a>` : '-';
    
    // Find matching raw link
    let fuenteHtml = item.fuente || '';
    for (const r of rawLinks) {
      if (item.fuente && item.fuente.includes(r.match)) {
        const linkAttrs = r.isAnchor ? `href="${r.url}"` : `href="${r.url}" target="_blank" rel="noopener noreferrer" download`;
        fuenteHtml += ` <br><a ${linkAttrs} class="text-emerald-400 text-xs hover:underline inline-flex items-center gap-1 font-medium mt-1"><span>📥</span> ${r.label}</a>`;
        break;
      }
    }

    return `
      <tr>
        <td class="font-semibold text-slate-100">${item.area}</td>
        <td>${docLink}</td>
        <td class="text-slate-300 text-sm">${fuenteHtml}</td>
        <td><span class="badge-pill-green">✔ ${item.estado}</span></td>
        <td class="font-medium text-green-400">${item.coincidencia}</td>
      </tr>
    `;
  }).join('');
}

function renderFilesGrid() {
  const container = document.getElementById('files-grid-container');
  if (!container) return;

  const rawList = cierData.filesCatalog || [];
  
  // Deduplicate by year and filename
  const seen = new Set();
  const files = [];
  for (const f of rawList) {
    const anio = f.anio || f.year || 2026;
    const archivo = f.archivo || f.file_name || '';
    const key = `${anio}_${archivo}`;
    if (!seen.has(key)) {
      seen.add(key);
      files.push(f);
    }
  }

  // Sort files: 2026 first, then 2025; inside year sort alphabetically
  files.sort((a, b) => {
    const yA = a.anio || a.year || 2026;
    const yB = b.anio || b.year || 2026;
    if (yA !== yB) return yB - yA;
    return (a.archivo || '').localeCompare(b.archivo || '');
  });

  const searchVal = (document.getElementById('files-search-input')?.value || '').toLowerCase().trim();
  const yearFilter = document.getElementById('files-filter-year')?.value || 'all';
  const typeFilter = document.getElementById('files-filter-type')?.value || 'all';

  const filtered = files.filter(f => {
    const anio = String(f.anio || f.year || '2026');
    const ext = (f.extension || f.file_extension || '').toUpperCase().replace('.', '');
    
    // Year filter
    if (yearFilter !== 'all' && anio !== yearFilter) return false;

    // Type filter
    if (typeFilter !== 'all') {
      if (typeFilter === 'PDF' && ext !== 'PDF') return false;
      if (typeFilter === 'XLS' && !ext.includes('XLS')) return false;
      if (typeFilter === 'PPT' && !ext.includes('PPT')) return false;
    }

    // Search filter
    if (searchVal) {
      const matchName = (f.archivo && f.archivo.toLowerCase().includes(searchVal));
      const matchType = (f.tipo && f.tipo.toLowerCase().includes(searchVal));
      const matchDesc = (f.descripcion && f.descripcion.toLowerCase().includes(searchVal));
      const matchExt = ext.toLowerCase().includes(searchVal);
      if (!matchName && !matchType && !matchDesc && !matchExt) return false;
    }

    return true;
  });

  // Update badge counter
  const counterBadge = document.getElementById('files-counter-badge');
  if (counterBadge) {
    counterBadge.textContent = `${filtered.length} de ${files.length} Archivos`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 2.5rem;">
        <p class="text-slate-300 font-medium">No se encontraron archivos con los criterios seleccionados.</p>
        <button onclick="resetFilesFilters()" class="btn-primary mt-3" style="font-size: 0.8rem; padding: 0.4rem 1rem;">Restablecer Filtros</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(f => {
    const ext = (f.extension || f.file_extension || 'DOC').toUpperCase().replace('.', '');
    const icon = ext === 'PDF' ? '📄' : (ext.includes('XLS') ? '📊' : (ext.includes('PPT') ? '📽️' : '📁'));
    const anio = f.anio || f.year || '2026';
    const archivo = f.archivo || f.file_name;
    const rawUrl = encodeURI(`data/raw/${anio}/${archivo}`);
    const sizeStr = f.tamano_mb ? `${f.tamano_mb.toFixed(2)} MB` : (f.size_kb ? `${(f.size_kb / 1024).toFixed(2)} MB` : '-');

    // Build action buttons
    let actionButtons = '';
    if (ext === 'PDF') {
      actionButtons = `
        <div class="file-actions">
          <a href="${rawUrl}" target="_blank" rel="noopener noreferrer" class="file-btn file-btn-view" title="Abrir informe PDF en visor web">
            <span>👁️</span> Abrir PDF
          </a>
          <a href="${rawUrl}" download="${archivo}" class="file-btn file-btn-download" title="Descargar copia del informe original">
            <span>⬇️</span> Descargar
          </a>
        </div>
      `;
    } else if (ext.includes('XLS')) {
      actionButtons = `
        <div class="file-actions">
          <a href="${rawUrl}" download="${archivo}" class="file-btn file-btn-excel" title="Descargar planilla de cálculo oficial">
            <span>📊</span> Descargar Planilla
          </a>
        </div>
      `;
    } else if (ext.includes('PPT')) {
      actionButtons = `
        <div class="file-actions">
          <a href="${rawUrl}" download="${archivo}" class="file-btn file-btn-pptx" title="Descargar diapositivas de presentación oficial">
            <span>📽️</span> Descargar Presentación
          </a>
        </div>
      `;
    } else {
      actionButtons = `
        <div class="file-actions">
          <a href="${rawUrl}" download="${archivo}" class="file-btn file-btn-download" title="Descargar archivo">
            <span>⬇️</span> Descargar
          </a>
        </div>
      `;
    }

    return `
      <div class="file-card">
        <div class="file-card-top">
          <span class="file-icon">${icon}</span>
          <span class="file-ext">${ext}</span>
        </div>
        <h4 class="file-name" title="${archivo}">${archivo}</h4>
        <div class="file-meta-row">
          <span>Ronda: <strong>${anio}</strong></span>
          <span>Tamaño: <strong>${sizeStr}</strong></span>
        </div>
        <p class="file-desc">${f.descripcion || 'Documento fuente oficial del relevamiento CIER EPEC-AR.'}</p>
        ${actionButtons}
      </div>
    `;
  }).join('');
}

window.resetFilesFilters = function() {
  const searchInput = document.getElementById('files-search-input');
  const yearSelect = document.getElementById('files-filter-year');
  const typeSelect = document.getElementById('files-filter-type');
  if (searchInput) searchInput.value = '';
  if (yearSelect) yearSelect.value = 'all';
  if (typeSelect) typeSelect.value = 'all';
  renderFilesGrid();
};

/* ==========================================================================
   CHARTS GUIDE (ORIGINAL CROPS MODAL VIEWER)
   ========================================================================== */
function initChartsGuide() {
  const container = document.getElementById('charts-guide-grid-container');
  const select = document.getElementById('guide-thematic-select');
  if (!container) return;

  const charts = cierData.guideCharts || [];

  function filterAndRender() {
    const selectedAxis = select ? select.value : 'all';
    const filtered = charts.filter(c => {
      if (selectedAxis === 'all') return true;
      return (c.eje_id === selectedAxis) || (c.thematicAxis === selectedAxis);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
          <p class="text-slate-300">No se encontraron gráficos para este eje temático seleccionado.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(c => {
      const imgPath = c.imagen_recorte || c.imageCropPath || 'assets/crops/crop_iscal_global.png';
      const title = c.titulo || c.title || 'Gráfico CIER';
      const axisName = c.eje_nombre || c.axisTitle || 'Eje CIER';
      const ref = c.referencia || c.reportSource || 'Informe Oficial CIER';
      const infName = c.informe_nombre || 'Informe CIER';
      const desc = c.diagnostico_epec || c.como_leer || c.fullDescription || '';

      const safeTitle = (title || '').replace(/"/g, '&quot;');
      const safeDesc = (desc || '').replace(/"/g, '&quot;');

      return `
        <div class="chart-crop-card" data-img="${imgPath}" data-title="${safeTitle}" data-desc="${safeDesc}">
          <div class="crop-img-wrapper">
            <img src="${imgPath}" alt="${safeTitle}" loading="lazy" class="crop-thumb-img" onerror="this.src='assets/crops/crop_iscal_global.png'">
            <div class="crop-overlay">
              <span class="crop-zoom-btn">🔍 Ampliar Gráfico</span>
            </div>
          </div>
          <div class="crop-info">
            <span class="crop-axis-tag">${axisName}</span>
            <h4 class="crop-title">${title}</h4>
            <p class="crop-desc">${desc ? desc.slice(0, 140) + '...' : ''}</p>
            <div class="crop-meta-row">
              <span>Informe: <strong>${infName}</strong></span>
              <span>Ref: <strong>${ref}</strong></span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events for zoom modal
    container.querySelectorAll('.chart-crop-card').forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img');
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        openModal(imgSrc, title, desc);
      });
    });
  }

  if (select) {
    select.addEventListener('change', filterAndRender);
  }
  filterAndRender();
}

/* ==========================================================================
   MODAL EVENTS & FILTERS SEARCH
   ========================================================================== */
function openModal(imgSrc, title, desc) {
  const modal = document.getElementById('chart-image-modal');
  const modalImg = document.getElementById('modal-chart-img') || document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-chart-title') || document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-chart-desc') || document.getElementById('modal-desc');

  if (modal && modalImg) {
    modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title || 'Gráfico Oficial CIER';
    if (modalDesc) modalDesc.textContent = desc || 'Recorte original en alta definición del Informe CIER 2026';
    modal.classList.add('active');
  }
}

window.openModal = openModal;
window.openImageModal = openModal;

function initModalEvents() {
  const chartModal = document.getElementById('chart-image-modal');
  const chartCloseBtn = document.getElementById('modal-close-btn');

  if (chartCloseBtn) {
    chartCloseBtn.addEventListener('click', () => {
      if (chartModal) chartModal.classList.remove('active');
    });
  }

  if (chartModal) {
    chartModal.addEventListener('click', (e) => {
      if (e.target === chartModal) {
        chartModal.classList.remove('active');
      }
    });
  }

  // Dictionary Options Modal Events
  const dictModal = document.getElementById('dict-options-modal');
  const dictCloseBtn = document.getElementById('dict-modal-close-btn');

  if (dictCloseBtn) {
    dictCloseBtn.addEventListener('click', closeDictModal);
  }

  if (dictModal) {
    dictModal.addEventListener('click', (e) => {
      if (e.target === dictModal) {
        closeDictModal();
      }
    });
  }

  // Modal Year Tabs Event
  document.querySelectorAll('.dict-year-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dict-year-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const year = tab.getAttribute('data-year') || '2026';
      const dict = cierData.dictionary || [];
      const item = dict.find(d => (d.variable || d.Variable || d.codigo) === activeDictVarCode);
      if (item) {
        renderModalOptions(item, year);
      }
    });
  });

  // Modal Search Filter Event
  const modalSearch = document.getElementById('dict-modal-search-input');
  if (modalSearch) {
    modalSearch.addEventListener('input', () => {
      const activeTab = document.querySelector('.dict-year-tab.active');
      const year = activeTab ? activeTab.getAttribute('data-year') : '2026';
      const dict = cierData.dictionary || [];
      const item = dict.find(d => (d.variable || d.Variable || d.codigo) === activeDictVarCode);
      if (item) {
        renderModalOptions(item, year);
      }
    });
  }

  // Keyboard Navigation & Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (chartModal && chartModal.classList.contains('active')) {
        chartModal.classList.remove('active');
      }
      if (dictModal && dictModal.classList.contains('active')) {
        closeDictModal();
      }
    } else if (dictModal && dictModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        navigateDictVar(-1);
      } else if (e.key === 'ArrowRight') {
        navigateDictVar(1);
      }
    }
  });
}

function initFiltersAndSearch() {
  // Dimension Pills
  const pillsContainer = document.getElementById('dimension-filters-container');
  const dims = [
    { id: 'all', label: 'Todas las Dimensiones (66)' },
    { id: 'Suministro de energía', label: 'Suministro (SE)' },
    { id: 'Información y comunicación', label: 'Información (IC)' },
    { id: 'Factura de energía', label: 'Factura (FE)' },
    { id: 'Atención al cliente', label: 'Atención (AT)' },
    { id: 'Imagen institucional', label: 'Imagen (IM)' },
    { id: 'Responsabilidad socioambiental', label: 'Resp. Socioambiental (RSA)' },
    { id: 'Alumbrado público', label: 'Alumbrado Público (AP)' },
    { id: 'Tarifa y Precio', label: 'Tarifa / Precio (PR)' },
    { id: 'Índices Globales', label: 'Índices Globales (IAC/ISG/ISCAL)' }
  ];

  if (pillsContainer) {
    pillsContainer.innerHTML = dims.map(d => `
      <button class="dim-pill ${d.id === 'all' ? 'active' : ''}" data-dim="${d.id}">${d.label}</button>
    `).join('');

    pillsContainer.querySelectorAll('.dim-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pillsContainer.querySelectorAll('.dim-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentDimFilter = pill.getAttribute('data-dim');
        renderIndicesTable();
      });
    });
  }

  // Scope Toggle Buttons
  document.querySelectorAll('.scope-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scope-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScope = btn.getAttribute('data-scope');
      renderIndicesTable();
    });
  });

  // Search Inputs
  const idxSearch = document.getElementById('indices-search-input');
  if (idxSearch) {
    idxSearch.addEventListener('input', () => renderIndicesTable());
  }

  // Dictionary Search & Filters
  const dictSearch = document.getElementById('dict-search-input');
  if (dictSearch) {
    dictSearch.addEventListener('input', () => renderDictTable());
  }

  const dictDimFilter = document.getElementById('dict-dim-filter');
  if (dictDimFilter) {
    dictDimFilter.addEventListener('change', () => renderDictTable());
  }

  const dictFuenteFilter = document.getElementById('dict-fuente-filter');
  if (dictFuenteFilter) {
    dictFuenteFilter.addEventListener('change', () => renderDictTable());
  }

  const dictUtilFilter = document.getElementById('dict-utilizacion-filter');
  if (dictUtilFilter) {
    dictUtilFilter.addEventListener('change', () => renderDictTable());
  }

  const dictScaleFilter = document.getElementById('dict-scale-filter');
  if (dictScaleFilter) {
    dictScaleFilter.addEventListener('change', () => renderDictTable());
  }

  const dictYearFilter = document.getElementById('dict-year-filter');
  if (dictYearFilter) {
    dictYearFilter.addEventListener('change', () => renderDictTable());
  }

  // Files Catalog Filters
  const filesSearch = document.getElementById('files-search-input');
  if (filesSearch) {
    filesSearch.addEventListener('input', () => renderFilesGrid());
  }

  const filesYearFilter = document.getElementById('files-filter-year');
  if (filesYearFilter) {
    filesYearFilter.addEventListener('change', () => renderFilesGrid());
  }

  const filesTypeFilter = document.getElementById('files-filter-type');
  if (filesTypeFilter) {
    filesTypeFilter.addEventListener('change', () => renderFilesGrid());
  }

  const prioSearch = document.getElementById('priorities-search-input');
  if (prioSearch) {
    prioSearch.addEventListener('input', () => renderPrioritiesTable());
  }

  // Argentina vs Top 10 LATAM Benchmark Filters
  const argGrupoFilter = document.getElementById('arg-filter-grupo');
  if (argGrupoFilter) {
    argGrupoFilter.addEventListener('change', () => renderArgentinaBenchmarkTable());
  }

  const argSearchInput = document.getElementById('arg-search-input');
  if (argSearchInput) {
    argSearchInput.addEventListener('input', () => renderArgentinaBenchmarkTable());
  }

  // Radar Spider Chart View Switcher (Subtabs: Sintesis / Servicios / Paises)
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
}

/* ==========================================================================
   SECTION 16: MATRIZ CONJUNTA DE ACCIONES DE MEJORA Y PRIORIDADES
   ========================================================================== */

let currentMicrodataPage = 1;
let currentMicrodataQuadrant = 'all';
let currentMicrodataQuery = '';
let selectedAttributes = new Set(); // Stores selected siglas e.g. 'FE3', 'IC1'

function toggleSelectedAttribute(sigla, scrollIntoView = true) {
  if (selectedAttributes.has(sigla)) {
    selectedAttributes.delete(sigla);
  } else {
    selectedAttributes.add(sigla);
  }
  updateSelectionState(scrollIntoView);
}

window.toggleSelectedAttribute = toggleSelectedAttribute;

function clearSelectedAttributes() {
  selectedAttributes.clear();
  currentMicrodataPage = 1;
  updateSelectionState(false);
}

window.clearSelectedAttributes = clearSelectedAttributes;

function selectSingleAttribute(sigla, scrollIntoView = true) {
  selectedAttributes.clear();
  selectedAttributes.add(sigla);
  updateSelectionState(scrollIntoView);
}

window.selectSingleAttribute = selectSingleAttribute;

function updateSelectionState(scrollIntoView = true) {
  // 1. Update Chart without recreating
  if (chartsInstances.matriz) {
    chartsInstances.matriz.update();
  }

  // 2. Re-render Microdata Cards
  renderFocusAttributes();

  // 3. Re-render Priorities Table
  renderPrioritiesTable();

  // 4. Scroll smoothly if requested
  if (scrollIntoView && selectedAttributes.size > 0) {
    const container = document.getElementById('focus-attributes-container');
    if (container) {
      const yOffset = -100;
      const y = container.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}

function initMatrizScatterChart() {
  const ctx = document.getElementById('chart-matriz-prioridades');
  if (!ctx) return;

  const data = cierData.matrizAccionesMejora || [];
  if (!data.length) return;

  const focoData = data.filter(d => d.cuadrante_num_cier === 1 || (d.cuadrante && (d.cuadrante.includes('Cuadrante I ') || d.cuadrante.includes('Cuadrante I –') || d.cuadrante.includes('Cuadrante I -') || d.cuadrante.includes('Foco')) && !d.cuadrante.includes('II') && !d.cuadrante.includes('III') && !d.cuadrante.includes('IV'))).map(d => ({ x: d.imp, y: d.desemp, raw: d }));
  const bajaData = data.filter(d => d.cuadrante_num_cier === 2 || (d.cuadrante && (d.cuadrante.includes('Cuadrante II ') || d.cuadrante.includes('Cuadrante II –') || d.cuadrante.includes('Cuadrante II -') || d.cuadrante.includes('Baja')) && !d.cuadrante.includes('III'))).map(d => ({ x: d.imp, y: d.desemp, raw: d }));
  const fortalezaData = data.filter(d => d.cuadrante_num_cier === 3 || (d.cuadrante && (d.cuadrante.includes('Cuadrante III ') || d.cuadrante.includes('Cuadrante III –') || d.cuadrante.includes('Cuadrante III -') || d.cuadrante.includes('Fortaleza')))).map(d => ({ x: d.imp, y: d.desemp, raw: d }));
  const ventajaData = data.filter(d => d.cuadrante_num_cier === 4 || (d.cuadrante && (d.cuadrante.includes('Cuadrante IV ') || d.cuadrante.includes('Cuadrante IV –') || d.cuadrante.includes('Cuadrante IV -') || d.cuadrante.includes('Ventaja')))).map(d => ({ x: d.imp, y: d.desemp, raw: d }));

  if (chartsInstances.matriz) {
    chartsInstances.matriz.destroy();
  }

  // Helper to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  };

  // Helper point stylers (large enough to fit priority numbers legibly)
  const getPointRadius = (defaultSize) => (ctx) => {
    const raw = ctx.raw?.raw;
    if (!raw) return defaultSize;
    const isSel = selectedAttributes.has(raw.sigla);
    if (selectedAttributes.size > 0) {
      return isSel ? 14 : Math.max(defaultSize * 0.9, 8.5);
    }
    return defaultSize;
  };

  const getPointBorderColor = (defaultColor) => (ctx) => {
    const raw = ctx.raw?.raw;
    if (!raw) return defaultColor;
    if (selectedAttributes.has(raw.sigla)) return '#ffffff';
    if (selectedAttributes.size > 0) {
      return hexToRgba(defaultColor.startsWith('#') ? defaultColor : '#cbd5e1', 0.55);
    }
    return defaultColor;
  };

  const getPointBorderWidth = (defaultWidth) => (ctx) => {
    const raw = ctx.raw?.raw;
    if (!raw) return defaultWidth;
    if (selectedAttributes.has(raw.sigla)) return 3.5;
    if (selectedAttributes.size > 0) return 1.2;
    return defaultWidth;
  };

  const getPointBgColor = (defaultColor) => (ctx) => {
    const raw = ctx.raw?.raw;
    if (!raw) return defaultColor;
    if (selectedAttributes.has(raw.sigla)) return '#06b6d4'; // Glowing cyan on selection
    if (selectedAttributes.size > 0) {
      return hexToRgba(defaultColor, 0.50); // Exactly 50% opacity attenuation
    }
    return defaultColor;
  };

  // Custom Chart.js Plugin: Dibuja el número de ranking de prioridad en cada punto
  const priorityNumbersPlugin = {
    id: 'priorityNumbersPlugin',
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (!meta || meta.hidden) return;

        meta.data.forEach((element, index) => {
          const pt = dataset.data[index];
          const raw = pt?.raw;
          if (!raw || raw.prio == null) return;

          const { x, y } = element.getProps(['x', 'y'], true);
          if (x == null || y == null || isNaN(x) || isNaN(y)) return;

          const isSel = selectedAttributes.has(raw.sigla);
          const hasSelection = selectedAttributes.size > 0;
          const text = String(raw.sigla || raw.prio);

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Tipografía optimizada para códigos de preguntas (ej. AT1, SE1, IC1)
          const isLongCode = text.length > 3;
          const fontSize = isSel ? 11.5 : (isLongCode ? 8.5 : 9.5);
          ctx.font = `700 ${fontSize}px "JetBrains Mono", "Inter", -apple-system, sans-serif`;

          if (hasSelection && !isSel) {
            ctx.globalAlpha = 0.65;
          }

          if (isSel) {
            // Texto oscuro de alto contraste sobre cian brillante
            ctx.fillStyle = '#082f49';
            ctx.shadowColor = 'transparent';
          } else {
            // Blanco con sutil sombra de contraste para garantizar legibilidad total
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 1;
          }

          ctx.fillText(text, x, y + 0.5);
          ctx.restore();
        });
      });
    }
  };

  chartsInstances.matriz = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: '🚩 Cuadrante I · Foco / Alto Impacto (1º Orden - Prio 1ª a 7ª)',
          data: focoData,
          backgroundColor: getPointBgColor('#ef4444'),
          borderColor: getPointBorderColor('#fca5a5'),
          borderWidth: getPointBorderWidth(2),
          pointRadius: getPointRadius(13.5),
          pointHoverRadius: 14
        },
        {
          label: '⚪ Cuadrante II · Baja Prioridad (Último Orden - Prio 8ª a 16ª, 30ª)',
          data: bajaData,
          backgroundColor: getPointBgColor('#64748b'),
          borderColor: getPointBorderColor('#cbd5e1'),
          borderWidth: getPointBorderWidth(1),
          pointRadius: getPointRadius(12.5),
          pointHoverRadius: 13
        },
        {
          label: '🌟 Cuadrante III · Fortalezas Claves (2º Orden / Mantener - Prio 17ª a 20ª)',
          data: fortalezaData,
          backgroundColor: getPointBgColor('#3b82f6'),
          borderColor: getPointBorderColor('#93c5fd'),
          borderWidth: getPointBorderWidth(1.5),
          pointRadius: getPointRadius(13.0),
          pointHoverRadius: 13.5
        },
        {
          label: '⚡ Cuadrante IV · Ventajas Secundarias (3º Orden / Eficiencia - Prio 21ª a 29ª)',
          data: ventajaData,
          backgroundColor: getPointBgColor('#f59e0b'),
          borderColor: getPointBorderColor('#fde68a'),
          borderWidth: getPointBorderWidth(1.5),
          pointRadius: getPointRadius(12.5),
          pointHoverRadius: 13
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (evt, elements, chart) => {
        if (elements && elements.length > 0) {
          const el = elements[0];
          const datasetIndex = el.datasetIndex;
          const index = el.index;
          const pt = chart.data.datasets[datasetIndex].data[index];
          if (pt && pt.raw) {
            toggleSelectedAttribute(pt.raw.sigla, true);
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Importancia Relativa 2026 (%) ➔ [Corte Promedio: 3.33%]',
            color: '#94a3b8',
            font: { size: 11, weight: '600', family: 'Inter' }
          },
          min: 0,
          max: 9.5,
          grid: {
            color: 'rgba(255, 255, 255, 0.08)'
          },
          ticks: {
            color: '#cbd5e1',
            font: { size: 10, family: 'Inter' },
            callback: (v) => `${v}%`
          }
        },
        y: {
          title: {
            display: true,
            text: 'Desempeño EPEC 2026 IDAT (0-100) ➔ [Corte Promedio: 64.8 pts]',
            color: '#94a3b8',
            font: { size: 11, weight: '600', family: 'Inter' }
          },
          min: 35,
          max: 92,
          grid: {
            color: 'rgba(255, 255, 255, 0.08)'
          },
          ticks: {
            color: '#cbd5e1',
            font: { size: 10, family: 'Inter' },
            callback: (v) => `${v} pts`
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#cbd5e1',
            usePointStyle: true,
            padding: 10,
            font: { size: 10, weight: '600', family: 'Inter' }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          borderWidth: 1.5,
          padding: 12,
          callbacks: {
            title: (items) => {
              const raw = items[0]?.raw?.raw;
              return raw ? `[${raw.sigla}] ${raw.nombre} (Prio ${raw.prio}ª · N° ${raw.num}) ➔ Clic para ver microdatos` : '';
            },
            label: (context) => {
              const raw = context.raw?.raw;
              if (!raw) return '';
              const isSel = selectedAttributes.has(raw.sigla) ? ' ✅ SELECCIONADO' : ' (Clic para seleccionar)';
              const lines = [
                `Área: ${raw.area}`,
                `Importancia 2026: ${raw.imp}% | Desempeño 2026: ${raw.desemp} pts`,
                `Ranking Prioridad: ${raw.prio}ª Lugar`,
                `Cuadrante Oficial: ${raw.cuadrante}`,
                `Resp. Negativas (1-4): ${raw.neg_pct || 0}% | Nota: ${raw.nota || 0}/10`,
                `Estado:${isSel}`
              ];
              return lines;
            }
          }
        }
      }
    },
    plugins: [priorityNumbersPlugin]
  });
}

function renderFocusAttributes() {
  const container = document.getElementById('focus-attributes-container');
  if (!container) return;

  const rawList = (cierData.matrizAccionesMejora || []).slice();
  rawList.sort((a, b) => a.prio - b.prio);

  let filtered = rawList;
  let isSelectionMode = selectedAttributes.size > 0;

  if (isSelectionMode) {
    // Show only selected attributes
    filtered = rawList.filter(d => selectedAttributes.has(d.sigla));
  } else {
    // Filter by Quadrant
    if (currentMicrodataQuadrant !== 'all') {
      const qf = currentMicrodataQuadrant.toUpperCase();
      filtered = filtered.filter(d => {
        const cq = (d.cuadrante || '').toUpperCase();
        const cNum = d.cuadrante_num_cier;
        if (qf.includes('I') && !qf.includes('II') && !qf.includes('III') && !qf.includes('IV')) {
          return cNum === 1 || cq.includes('CUADRANTE I ') || cq.includes('CUADRANTE I –') || cq.includes('CUADRANTE I -') || cq.includes('FOCO');
        }
        if (qf.includes('II') && !qf.includes('III')) {
          return cNum === 2 || cq.includes('CUADRANTE II ') || cq.includes('CUADRANTE II –') || cq.includes('CUADRANTE II -') || cq.includes('BAJA');
        }
        if (qf.includes('III')) {
          return cNum === 3 || cq.includes('CUADRANTE III') || cq.includes('FORTALEZA');
        }
        if (qf.includes('IV')) {
          return cNum === 4 || cq.includes('CUADRANTE IV') || cq.includes('VENTAJA');
        }
        return cq.includes(qf);
      });
    }

    // Filter by Search Query
    if (currentMicrodataQuery) {
      const q = currentMicrodataQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.sigla.toLowerCase().includes(q) ||
        d.nombre.toLowerCase().includes(q) ||
        d.area.toLowerCase().includes(q) ||
        (d.pregunta && d.pregunta.toLowerCase().includes(q)) ||
        (d.causas && d.causas.toLowerCase().includes(q)) ||
        (d.cuadrante && d.cuadrante.toLowerCase().includes(q)) ||
        d.prio.toString().includes(q)
      );
    }
  }

  // Pagination (10 per page when not in selection mode)
  const pageSize = 10;
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  let pageItems = filtered;
  let startIdx = 0;
  let endIdx = totalItems;

  if (!isSelectionMode && currentMicrodataPage !== 'all') {
    const pageNum = parseInt(currentMicrodataPage, 10) || 1;
    startIdx = (pageNum - 1) * pageSize;
    endIdx = Math.min(startIdx + pageSize, totalItems);
    pageItems = filtered.slice(startIdx, endIdx);
  }

  // Update Status and Buttons
  const statusEl = document.getElementById('microdata-pagi-status');
  if (statusEl) {
    if (isSelectionMode) {
      statusEl.innerHTML = `🎯 <strong>${selectedAttributes.size} seleccionado(s)</strong> desde el gráfico interactivo`;
    } else if (totalItems === 0) {
      statusEl.innerHTML = `No se encontraron atributos con los filtros aplicados.`;
    } else if (currentMicrodataPage === 'all') {
      statusEl.innerHTML = `Mostrando los <strong>${totalItems} atributos</strong> completos`;
    } else {
      statusEl.innerHTML = `Mostrando <strong>${startIdx + 1} - ${endIdx}</strong> de <strong>${totalItems} atributos</strong> (Página ${currentMicrodataPage} de ${totalPages})`;
    }
  }

  const indicatorEl = document.getElementById('pagi-indicator-text');
  if (indicatorEl) {
    indicatorEl.textContent = isSelectionMode 
      ? `Filtro de Selección (${selectedAttributes.size} atributos)` 
      : ((currentMicrodataPage === 'all') ? `Vista Completa (${totalItems} atributos)` : `Página ${currentMicrodataPage} de ${totalPages}`);
  }

  const prevBtn = document.getElementById('btn-pagi-prev');
  const nextBtn = document.getElementById('btn-pagi-next');
  if (prevBtn) prevBtn.disabled = (isSelectionMode || currentMicrodataPage === 'all' || currentMicrodataPage <= 1);
  if (nextBtn) nextBtn.disabled = (isSelectionMode || currentMicrodataPage === 'all' || currentMicrodataPage >= totalPages);

  // Update active page button
  document.querySelectorAll('#microdata-pagi-buttons .pagi-btn').forEach(btn => {
    const p = btn.getAttribute('data-page');
    btn.classList.toggle('active', !isSelectionMode && p === currentMicrodataPage.toString());
  });

  // Render Selection Banner if points are selected
  let bannerHTML = '';
  if (isSelectionMode) {
    const selectedObjs = rawList.filter(d => selectedAttributes.has(d.sigla));
    const chipsHTML = selectedObjs.map(s => `
      <span class="selected-chip-tag" onclick="toggleSelectedAttribute('${s.sigla}', false)" title="Clic para quitar">${s.sigla} · ${s.nombre} ✕</span>
    `).join(' ');

    bannerHTML = `
      <div class="selection-banner" style="grid-column: 1/-1;">
        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <span class="badge-tag" style="background: var(--accent-cyan); color: #04101e; font-weight: 800;">🎯 PUNTOS SELECCIONADOS EN GRÁFICO (${selectedAttributes.size}):</span>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${chipsHTML}
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="clearSelectedAttributes()" style="font-size: 0.75rem; padding: 0.3rem 0.7rem;">✕ Quitar Selección / Ver Todos (30)</button>
      </div>
    `;
  }

  if (pageItems.length === 0) {
    container.innerHTML = bannerHTML + `
      <div class="glass-card" style="grid-column: 1/-1; text-align: center; padding: 2.5rem;">
        <p class="text-slate-300">No se encontraron atributos que coincidan con la búsqueda.</p>
        <button class="btn btn-secondary btn-sm mt-2" onclick="resetMicrodataFilters()">Restablecer Filtros</button>
      </div>
    `;
    return;
  }

  const cardsHTML = pageItems.map(item => {
    const isSelected = selectedAttributes.has(item.sigla);
    let quadClass = 'q-baja';
    let prioColorClass = 'badge-slate';
    const cUpper = (item.cuadrante || '').toUpperCase();

    if ((cUpper.includes('I') && !cUpper.includes('II') && !cUpper.includes('III') && !cUpper.includes('IV')) || cUpper.includes('FOCO') || cUpper.includes('1')) {
      quadClass = 'q-foco';
      prioColorClass = 'badge-red';
    } else if ((cUpper.includes('II') && !cUpper.includes('III')) || cUpper.includes('BAJA') || cUpper.includes('2')) {
      quadClass = 'q-baja';
      prioColorClass = 'badge-slate';
    } else if (cUpper.includes('III') || cUpper.includes('FORTALEZA') || cUpper.includes('3')) {
      quadClass = 'q-fortaleza';
      prioColorClass = 'badge-blue';
    } else if (cUpper.includes('IV') || cUpper.includes('VENTAJA') || cUpper.includes('4')) {
      quadClass = 'q-secundaria';
      prioColorClass = 'badge-amber';
    }

    const selCardClass = isSelected ? 'card-selected' : '';
    const selBadge = isSelected ? `<span class="selected-badge-indicator">🎯 Seleccionado</span>` : '';

    const negVal = item.neg_pct !== undefined ? item.neg_pct : 15.0;
    const neuVal = item.neu_pct !== undefined ? item.neu_pct : 35.0;
    const posVal = item.pos_pct !== undefined ? item.pos_pct : 50.0;
    const notaVal = item.nota !== undefined ? item.nota : (item.desemp / 10).toFixed(2);
    const preguntaTxt = item.pregunta || 'Evaluación del atributo en la encuesta residencial CIER';
    const causasTxt = item.causas || 'Factores operativos y de percepción reportados en la encuesta de satisfacción.';
    const accionTxt = item.accion || 'Monitoreo de desempeño y mantenimiento de estándares de calidad de servicio.';

    return `
      <div class="focus-card ${quadClass} ${selCardClass}" onclick="toggleSelectedAttribute('${item.sigla}', false)" style="cursor: pointer;" title="Clic para alternar selección en el gráfico interactivo">
        <div class="focus-card-header">
          <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
            <span class="focus-prio-badge ${prioColorClass}">Prioridad ${item.prio}ª · ${item.cuadrante}</span>
            ${selBadge}
          </div>
          <span class="focus-sigla">${item.sigla}</span>
        </div>
        <h4 class="focus-attr-name">[N° ${item.num}] ${item.nombre}</h4>
        
        <div class="focus-meta-row">
          <span><strong>Área:</strong> ${item.area}</span>
          <span><strong>Imp 2026:</strong> ${item.imp.toFixed(2)}% · <strong>Desemp 2026:</strong> ${item.desemp.toFixed(2)} pts</span>
        </div>

        <!-- Survey Question Text -->
        <div class="survey-question-box">
          <strong>Pregunta CIER:</strong> "${preguntaTxt}"
        </div>

        <!-- Ratings Breakdown Bar -->
        <div class="ratings-breakdown">
          <div class="breakdown-labels">
            <span class="text-neg">Negativo (1-4): <strong>${negVal}%</strong></span>
            <span class="text-neu">Neutro (5-7): <strong>${neuVal}%</strong></span>
            <span class="text-pos">Positivo (8-10): <strong>${posVal}%</strong></span>
          </div>
          <div class="stacked-bar-bg" title="Neg: ${negVal}%, Neu: ${neuVal}%, Pos: ${posVal}%">
            <div class="bar-segment seg-neg" style="width: ${negVal}%;"></div>
            <div class="bar-segment seg-neu" style="width: ${neuVal}%;"></div>
            <div class="bar-segment seg-pos" style="width: ${posVal}%;"></div>
          </div>
          <div class="text-muted mt-1" style="font-size: 0.72rem; text-align: right;">
            Nota media 2026: <strong style="color: #fff;">${notaVal} / 10</strong> (N=1.250)
          </div>
        </div>

        <!-- Root Cause from Survey Microdata -->
        <div class="focus-cause-box mt-2">
          <div class="cause-lbl">⚠️ Causa Raíz / Percepción del Cliente en Encuesta</div>
          <div class="cause-text">${causasTxt}</div>
        </div>

        <!-- Recommended Action -->
        <div class="focus-action-box mt-2">
          <div class="action-lbl">🎯 Acción Operativa / Táctica Recomendada</div>
          <div class="action-text">${accionTxt}</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = bannerHTML + cardsHTML;
}

window.resetMicrodataFilters = function() {
  selectedAttributes.clear();
  currentMicrodataPage = 1;
  currentMicrodataQuadrant = 'all';
  currentMicrodataQuery = '';
  const searchInput = document.getElementById('microdata-search-input');
  const select = document.getElementById('microdata-quadrant-filter');
  if (searchInput) searchInput.value = '';
  if (select) select.value = 'all';
  updateSelectionState(false);
};

function initMicrodataPaginationEvents() {
  // Pagination buttons
  document.querySelectorAll('#microdata-pagi-buttons .pagi-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedAttributes.clear(); // Clear single-point filter when user clicks a page button
      const page = btn.getAttribute('data-page');
      currentMicrodataPage = (page === 'all') ? 'all' : parseInt(page, 10);
      updateSelectionState(false);
    });
  });

  // Prev / Next buttons
  const prevBtn = document.getElementById('btn-pagi-prev');
  const nextBtn = document.getElementById('btn-pagi-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (typeof currentMicrodataPage === 'number' && currentMicrodataPage > 1) {
        selectedAttributes.clear();
        currentMicrodataPage--;
        updateSelectionState(false);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (typeof currentMicrodataPage === 'number' && currentMicrodataPage < 3) {
        selectedAttributes.clear();
        currentMicrodataPage++;
        updateSelectionState(false);
      }
    });
  }

  // Search input
  const searchInput = document.getElementById('microdata-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      selectedAttributes.clear();
      currentMicrodataQuery = searchInput.value.trim();
      currentMicrodataPage = 1;
      updateSelectionState(false);
    });
  }

  // Quadrant select
  const select = document.getElementById('microdata-quadrant-filter');
  if (select) {
    select.addEventListener('change', () => {
      selectedAttributes.clear();
      currentMicrodataQuadrant = select.value;
      currentMicrodataPage = 1;
      updateSelectionState(false);
    });
  }
}

function renderPrioritiesTable() {
  const tbody = document.getElementById('priorities-table-body') || document.querySelector('#priorities-table tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('priorities-search-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let list = (cierData.matrizAccionesMejora || []).slice();
  list.sort((a, b) => a.prio - b.prio);

  if (query) {
    list = list.filter(item => 
      item.sigla.toLowerCase().includes(query) ||
      item.nombre.toLowerCase().includes(query) ||
      item.area.toLowerCase().includes(query) ||
      item.cuadrante.toLowerCase().includes(query) ||
      item.prio.toString().includes(query) ||
      item.num.toString().includes(query)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding: 2rem;">No se encontraron atributos que coincidan con "${query}".</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(item => {
    const cUpper = (item.cuadrante || '').toUpperCase();
    const isFoco = (cUpper.includes('I') && !cUpper.includes('II') && !cUpper.includes('III') && !cUpper.includes('IV')) || cUpper.includes('FOCO') || cUpper.includes('1');
    const isSelected = selectedAttributes.has(item.sigla);
    let badgeClass = 'badge-slate';

    if (isFoco) badgeClass = 'badge-red';
    else if ((cUpper.includes('II') && !cUpper.includes('III')) || cUpper.includes('BAJA') || cUpper.includes('2')) badgeClass = 'badge-slate';
    else if (cUpper.includes('III') || cUpper.includes('FORTALEZA') || cUpper.includes('3')) badgeClass = 'badge-blue';
    else if (cUpper.includes('IV') || cUpper.includes('VENTAJA') || cUpper.includes('4')) badgeClass = 'badge-amber';

    const prioBadge = isFoco 
      ? `<span class="badge-red font-bold">${item.prio}ª FOCO</span>`
      : `<span class="badge-slate font-bold">${item.prio}ª</span>`;

    let rowClass = isFoco ? 'highlight-row-red' : '';
    if (isSelected) rowClass += ' highlight-row-selected';

    return `
      <tr class="${rowClass}" onclick="toggleSelectedAttribute('${item.sigla}', true)" style="cursor: pointer;" title="Clic para seleccionar en el gráfico y microdatos">
        <td class="text-center font-mono font-bold">${item.num}</td>
        <td><span class="badge-tag">${item.sigla}</span></td>
        <td class="font-semibold text-sub">${item.area}</td>
        <td class="font-bold text-main">${item.nombre}</td>
        <td class="text-right font-mono font-bold" style="color: ${item.imp > 3.3 ? '#f87171' : '#cbd5e1'};">${item.imp.toFixed(2)}%</td>
        <td class="text-right font-mono font-bold" style="color: ${item.desemp < 64.8 ? '#f87171' : '#60a5fa'};">${item.desemp.toFixed(2)}</td>
        <td class="text-center">${prioBadge}</td>
        <td><span class="q-badge ${badgeClass}">${item.cuadrante}</span></td>
      </tr>
    `;
  }).join('');
}
