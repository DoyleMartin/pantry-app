// ============================================================
// SCANNER.JS — Receipt scanning and OCR logic
// ============================================================

let scannedItems = [];

// Drag-and-drop handlers
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('drop-zone').classList.add('dragover');
}
function handleDragLeave() {
  document.getElementById('drop-zone').classList.remove('dragover');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('drop-zone').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}

// Triggered when user selects a file via the file input
function processReceipt(event) {
  const file = event.target.files[0];
  if (file) processFile(file);
}

// Run OCR on the uploaded file using Tesseract.js
async function processFile(file) {
  document.getElementById('scan-status').style.display  = 'block';
  document.getElementById('scan-results').style.display = 'none';
  document.getElementById('scan-status-text').textContent = 'Reading receipt...';
  document.getElementById('scan-progress').style.width  = '10%';

  try {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          document.getElementById('scan-progress').style.width    = (10 + m.progress * 85) + '%';
          document.getElementById('scan-status-text').textContent = 'Reading text... ' + Math.round(m.progress * 100) + '%';
        }
      }
    });

    document.getElementById('scan-progress').style.width    = '100%';
    document.getElementById('scan-status-text').textContent = '✅ Done! Parsing items...';

    const rawText = result.data.text;
    document.getElementById('scan-raw').style.display  = 'block';
    document.getElementById('scan-raw').textContent    = rawText;

    scannedItems = parseReceiptText(rawText);
    showScannedItems();
  } catch (err) {
    console.error(err);
    toast('Could not read receipt. Try a clearer image.', 'error');
    document.getElementById('scan-status').style.display = 'none';
  }
}

// Parse OCR text into a list of potential pantry items
function parseReceiptText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);

  const skipPatterns = [
    /^(total|subtotal|tax|change|cash|card|credit|debit|visa|mastercard|thank|welcome|receipt|store|phone|address|date|time|cashier|register|transaction|balance|savings|loyalty|points|member)/i,
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/,
    /^\*+/,
    /^={2,}/,
    /^-{2,}/,
    /\d{10,}/
  ];
  const pricePattern = /\$?\d+\.\d{2}/;

  const items = [];
  const seen  = new Set();

  for (const line of lines) {
    if (skipPatterns.some(p => p.test(line))) continue;

    let cleaned = line
      .replace(/\$?\d+\.\d{2}\s*[A-Z]?$/g, '')
      .replace(/^\d+\s*[xX@]\s*/g, '')
      .replace(/\s+[A-Z]$/, '')
      .replace(/[^\w\s\-&']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned.length < 3 || cleaned.length > 50) continue;
    if (/^\d+$/.test(cleaned)) continue;
    if (pricePattern.test(cleaned) && cleaned.replace(pricePattern, '').trim().length < 3) continue;

    cleaned = cleaned.replace(/\b\w/g, c => c.toUpperCase());

    const key = cleaned.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      items.push({ name: cleaned, selected: true });
    }
  }
  return items;
}

// Show the list of parsed items for review
function showScannedItems() {
  document.getElementById('scan-results').style.display = 'block';
  renderParsedItems();
}

// Render editable list of parsed items
function renderParsedItems() {
  const list = document.getElementById('parsed-items-list');
  if (scannedItems.length === 0) {
    list.innerHTML = '<p style="color:#999;text-align:center;padding:20px">No items could be extracted. Try adding manually below.</p>';
    return;
  }
  list.innerHTML = scannedItems.map((item, i) => `
    <div class="parsed-item">
      <input type="checkbox" ${item.selected ? 'checked' : ''} onchange="scannedItems[${i}].selected = this.checked">
      <input type="text" value="${item.name}" onchange="scannedItems[${i}].name = this.value">
      <button class="btn-icon" onclick="scannedItems.splice(${i},1); renderParsedItems()" title="Remove">✕</button>
    </div>`).join('');
}

// Add a manually typed item to the scanned list
function addManualScanItem() {
  const inp  = document.getElementById('manual-item-input');
  const name = inp.value.trim();
  if (!name) return;
  scannedItems.push({ name: name.replace(/\b\w/g, c => c.toUpperCase()), selected: true });
  inp.value = '';
  renderParsedItems();
}

// Add all selected scanned items to the pantry
function confirmScannedItems() {
  const selected = scannedItems.filter(i => i.selected && i.name.trim());
  if (selected.length === 0) { toast('No items selected!', 'error'); return; }

  selected.forEach(item => {
    pantry.push({
      id:         uid(),
      name:       item.name.trim(),
      quantity:   1,
      unit:       'pieces',
      category:   guessCategory(item.name),
      expiryDate: null,
      addedDate:  new Date().toISOString()
    });
  });

  saveState();
  toast(`Added ${selected.length} items to pantry!`);
  resetScanner();
  showPage('pantry');
}

// Reset the scanner UI to its initial state
function resetScanner() {
  document.getElementById('scan-status').style.display  = 'none';
  document.getElementById('scan-results').style.display = 'none';
  document.getElementById('scan-progress').style.width  = '0%';
  document.getElementById('receipt-file').value         = '';
  scannedItems = [];
}
