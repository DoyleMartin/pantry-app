// ============================================================
// PANTRY.JS — Pantry page logic
// ============================================================

function renderPantry() {
  const search    = (document.getElementById('pantry-search')?.value || '').toLowerCase();
  const catFilter = document.getElementById('pantry-cat-filter')?.value || '';
  const sortBy    = document.getElementById('pantry-sort')?.value || 'expiry';
  const grid      = document.getElementById('pantry-grid');
  const empty     = document.getElementById('pantry-empty');

  // Filter items
  let items = pantry.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search);
    const matchCat    = !catFilter || item.category === catFilter;
    return matchSearch && matchCat;
  });

  // Sort items
  if (sortBy === 'expiry')    items = sortPantryByExpiry(items);
  else if (sortBy === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'category') items.sort((a, b) => a.category.localeCompare(b.category));
  else if (sortBy === 'added') items.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));

  // Update stats bar
  const total       = pantry.length;
  const critical    = pantry.filter(i => { const s = getExpiryStatus(i.expiryDate); return s.class === 'expiring-critical' || s.class === 'expired'; }).length;
  const expiringSoon = pantry.filter(i => { const s = getExpiryStatus(i.expiryDate); return s.class !== '' && s.class !== 'expired'; }).length;

  document.getElementById('pantry-stats').innerHTML = `
    <div class="stat-card"><div class="stat-num" style="color:var(--green)">${total}</div><div class="stat-label">Total Items</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--orange)">${expiringSoon}</div><div class="stat-label">Expiring Soon</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--red)">${critical}</div><div class="stat-label">Critical</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--blue)">${getAvailableRecipes().length}</div><div class="stat-label">Recipes Available</div></div>
  `;

  // Expiry warning notice
  const notice = document.getElementById('expiry-notice');
  notice.style.display = critical > 0 ? 'flex' : 'none';

  // Handle empty states
  if (items.length === 0) {
    grid.style.display = 'none';
    if (pantry.length === 0) {
      empty.style.display = 'block';
    } else {
      empty.style.display = 'none';
      grid.style.display  = 'grid';
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#aaa">No items match your search.</div>`;
    }
    return;
  }

  empty.style.display = 'none';
  grid.style.display  = 'grid';
  grid.innerHTML = items.map(item => {
    const status = getExpiryStatus(item.expiryDate);
    return `<div class="pantry-item ${status.class}">
      <div class="item-actions">
        <button class="btn-icon" onclick="editItem('${item.id}')" title="Edit">✏️</button>
        <button class="btn-icon" onclick="removeItem('${item.id}')" title="Remove">🗑️</button>
      </div>
      <div class="item-name">${item.name}</div>
      ${item.quantity ? `<div class="item-qty">${item.quantity} ${item.unit || ''}</div>` : ''}
      <div class="qty-controls">
        <button class="qty-btn" onclick="adjustQty('${item.id}', -1)">−</button>
        <span class="qty-display">${item.quantity || 0} ${item.unit || ''}</span>
        <button class="qty-btn" onclick="adjustQty('${item.id}', 1)">+</button>
      </div>
      <span class="item-badge ${status.badgeClass}">${status.label}</span>
      <div class="item-category">📁 ${item.category}</div>
    </div>`;
  }).join('');
}

// Increment or decrement an item's quantity
function adjustQty(id, delta) {
  const item = pantry.find(i => i.id === id);
  if (!item) return;
  const newQty = Math.max(0, (parseFloat(item.quantity) || 0) + delta);
  if (newQty === 0) {
    if (confirm(`Remove "${item.name}" from pantry?`)) {
      pantry = pantry.filter(i => i.id !== id);
      toast(`Removed ${item.name}`, 'warning');
    }
  } else {
    item.quantity = newQty;
    toast(`Updated ${item.name}: ${newQty} ${item.unit || ''}`, 'success');
  }
  saveState();
  renderPantry();
}

// Delete a pantry item
function removeItem(id) {
  const item = pantry.find(i => i.id === id);
  if (!item) return;
  if (confirm(`Remove "${item.name}" from pantry?`)) {
    pantry = pantry.filter(i => i.id !== id);
    saveState();
    renderPantry();
    toast(`Removed ${item.name}`, 'warning');
  }
}

// Load an item into the edit modal
function editItem(id) {
  const item = pantry.find(i => i.id === id);
  if (!item) return;
  editItemId = id;
  document.getElementById('add-modal-title').textContent    = '✏️ Edit Pantry Item';
  document.getElementById('item-name').value                = item.name;
  document.getElementById('item-qty').value                 = item.quantity || '';
  document.getElementById('item-unit').value                = item.unit || '';
  document.getElementById('item-category').value            = item.category || 'Other';
  document.getElementById('item-expiry').value              = item.expiryDate || '';
  document.getElementById('add-item-modal').classList.add('open');
}

// Open the add item modal (blank form)
function openAddModal() {
  editItemId = null;
  document.getElementById('add-modal-title').textContent = '➕ Add Pantry Item';
  document.getElementById('item-name').value             = '';
  document.getElementById('item-qty').value              = '';
  document.getElementById('item-unit').value             = '';
  document.getElementById('item-category').value         = 'Produce';
  document.getElementById('item-expiry').value           = '';
  document.getElementById('add-item-modal').classList.add('open');
  setTimeout(() => document.getElementById('item-name').focus(), 100);
}

// Close the add/edit modal
function closeAddModal() {
  document.getElementById('add-item-modal').classList.remove('open');
}

// Save a new or edited pantry item
function saveItem() {
  const name = document.getElementById('item-name').value.trim();
  if (!name) { toast('Item name is required!', 'error'); return; }

  const item = {
    id:         editItemId || uid(),
    name,
    quantity:   parseFloat(document.getElementById('item-qty').value) || 0,
    unit:       document.getElementById('item-unit').value,
    category:   document.getElementById('item-category').value,
    expiryDate: document.getElementById('item-expiry').value || null,
    addedDate:  editItemId
      ? (pantry.find(i => i.id === editItemId)?.addedDate || new Date().toISOString())
      : new Date().toISOString()
  };

  if (editItemId) {
    const idx = pantry.findIndex(i => i.id === editItemId);
    if (idx >= 0) pantry[idx] = item;
    toast(`Updated ${name}!`);
  } else {
    pantry.push(item);
    toast(`Added ${name} to pantry!`);
  }

  saveState();
  closeAddModal();
  renderPantry();
}
