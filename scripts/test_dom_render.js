const fs = require('fs');
const path = require('path');

// 1. Mock minimal DOM
const elements = {};

function createElementMock(id, tagName = 'div') {
  return {
    id,
    tagName,
    value: '',
    innerHTML: '',
    textContent: '',
    children: [],
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false
    },
    addEventListener: () => {}
  };
}

const mockDoc = {
  getElementById: (id) => {
    if (!elements[id]) {
      elements[id] = createElementMock(id);
    }
    return elements[id];
  },
  querySelectorAll: () => [],
  addEventListener: () => {}
};

global.document = mockDoc;
global.window = { CIER_DATA: {} };

const vm = require('vm');

// 2. Load data_bundle.js
const dataBundleCode = fs.readFileSync('data_bundle.js', 'utf-8');
vm.runInThisContext(dataBundleCode);
global.cierData = global.window.CIER_DATA;

// 3. Load app.js functions
const appCode = fs.readFileSync('app.js', 'utf-8');
vm.runInThisContext(appCode);

console.log('=== TEST 1: renderFilesGrid Default (All) ===');
global.renderFilesGrid();
const container = mockDoc.getElementById('files-grid-container');
const cards = container.innerHTML.split('<div class="file-card">').slice(1);
console.log(`Rendered cards count: ${cards.length}`);
if (cards.length !== 30) {
  console.error(`ERROR: Expected 30 cards, got ${cards.length}`);
  process.exit(1);
} else {
  console.log('✔ OK: Exactly 30 unique files rendered.');
}

console.log('\n=== TEST 2: Check Links and Actions in each card ===');
let pdfCount = 0, xlsCount = 0, pptCount = 0;
cards.forEach((card, idx) => {
  const isPdf = card.includes('.pdf') || card.includes('PDF');
  const isXls = card.includes('.xls') || card.includes('.xlsx') || card.includes('XLS');
  const isPpt = card.includes('.pptx') || card.includes('PPTX');
  
  const hasHref = card.includes('href="data/raw/');
  if (!hasHref) {
    console.error(`ERROR in card #${idx + 1}: Missing data/raw href!`);
    process.exit(1);
  }
  
  if (isPdf) {
    pdfCount++;
    if (!card.includes('file-btn-view') || !card.includes('file-btn-download')) {
      console.error(`ERROR in PDF card #${idx + 1}: Missing view or download button`);
      process.exit(1);
    }
  } else if (isXls) {
    xlsCount++;
    if (!card.includes('file-btn-excel')) {
      console.error(`ERROR in XLS card #${idx + 1}: Missing excel button`);
      process.exit(1);
    }
  } else if (isPpt) {
    pptCount++;
    if (!card.includes('file-btn-pptx')) {
      console.error(`ERROR in PPT card #${idx + 1}: Missing pptx button`);
      process.exit(1);
    }
  }
});
console.log(`✔ OK: Analyzed ${cards.length} cards (PDF: ${pdfCount}, Excel: ${xlsCount}, PPTX: ${pptCount}). All have valid data/raw links!`);

console.log('\n=== TEST 3: Filter by Year 2026 ===');
mockDoc.getElementById('files-filter-year').value = '2026';
global.renderFilesGrid();
const cards2026 = container.innerHTML.split('<div class="file-card">').slice(1);
console.log(`2026 cards count: ${cards2026.length}`);
if (cards2026.length !== 14) {
  console.error(`ERROR: Expected 14 cards for 2026, got ${cards2026.length}`);
  process.exit(1);
}
console.log('✔ OK: Exactly 14 files for 2026.');

console.log('\n=== TEST 4: Filter by Year 2025 ===');
mockDoc.getElementById('files-filter-year').value = '2025';
global.renderFilesGrid();
const cards2025 = container.innerHTML.split('<div class="file-card">').slice(1);
console.log(`2025 cards count: ${cards2025.length}`);
if (cards2025.length !== 16) {
  console.error(`ERROR: Expected 16 cards for 2025, got ${cards2025.length}`);
  process.exit(1);
}
console.log('✔ OK: Exactly 16 files for 2025.');

console.log('\n=== TEST 5: Filter by Format PDF ===');
mockDoc.getElementById('files-filter-year').value = 'all';
mockDoc.getElementById('files-filter-type').value = 'PDF';
global.renderFilesGrid();
const cardsPdf = container.innerHTML.split('<div class="file-card">').slice(1);
console.log(`PDF cards count: ${cardsPdf.length}`);
if (cardsPdf.length !== 13) {
  console.error(`ERROR: Expected 13 PDF cards, got ${cardsPdf.length}`);
  process.exit(1);
}
console.log('✔ OK: Exactly 13 PDF files.');

console.log('\n=== TEST 6: Search Filter ("Planilla") ===');
mockDoc.getElementById('files-filter-type').value = 'all';
mockDoc.getElementById('files-search-input').value = 'Planilla';
global.renderFilesGrid();
const cardsSearch = container.innerHTML.split('<div class="file-card">').slice(1);
console.log(`Search cards count: ${cardsSearch.length}`);
if (cardsSearch.length < 1) {
  console.error(`ERROR: Expected at least 1 card for "Planilla", got ${cardsSearch.length}`);
  process.exit(1);
}
console.log('✔ OK: Search filter functioning correctly.');

console.log('\n=== TEST 7: SSOT Checklist Links ===');
global.renderSSOTChecklist();
const tbody = mockDoc.getElementById('ssot-checklist-tbody');
if (!tbody.innerHTML.includes('href="docs/') || !tbody.innerHTML.includes('href="data/raw/')) {
  console.error('ERROR: SSOT checklist missing docs/ or data/raw/ links!');
  process.exit(1);
}
console.log('✔ OK: SSOT Checklist contains active links to docs/ and data/raw/.');

console.log('\nALL 7 TESTS PASSED SUCCESSFULLY! 🚀');
