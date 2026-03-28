// ============================================================
// RECIPES.JS — Recipes page, Almost There page, and Cook modal
// ============================================================

// ── RECIPES PAGE (Can Make) ──────────────────────────────────

function renderRecipes() {
  populateRecipeCategoryFilter();

  const search = (document.getElementById('recipe-search')?.value || '').toLowerCase();
  const cat    = document.getElementById('recipe-cat-filter')?.value || '';

  let available = getAvailableRecipes().filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search) || r.tags.some(t => t.includes(search));
    const matchCat    = !cat || r.category === cat;
    return matchSearch && matchCat;
  });

  // Sort: prioritize recipes that use ingredients expiring soon
  available.sort((a, b) => recipeExpiryScore(b) - recipeExpiryScore(a));

  const grid  = document.getElementById('recipe-grid');
  const empty = document.getElementById('recipe-empty');

  if (available.length === 0) {
    grid.innerHTML       = '';
    empty.style.display  = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = available.map(r => recipeCard(r, true)).join('');
}

// ── ALMOST THERE PAGE ────────────────────────────────────────

function renderAlmost() {
  const maxMissing = parseInt(document.getElementById('almost-threshold')?.value) || 3;
  const items      = getAlmostRecipes(maxMissing);
  const grid       = document.getElementById('almost-grid');
  const empty      = document.getElementById('almost-empty');

  if (items.length === 0) {
    grid.innerHTML      = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = items.map(({ recipe, missing }) => almostCard(recipe, missing)).join('');
}

// ── CARD RENDERERS ───────────────────────────────────────────

function recipeCard(r, canCook = true) {
  const cookTime   = r.cookTime ? `⏱ ${r.cookTime} min` : '';
  const urgentBadge = recipeExpiryScore(r) >= 5
    ? '<span class="item-badge badge-critical" style="margin-left:6px">🔥 Use Soon!</span>'
    : '';
  const history   = mealHistory.filter(h => h.recipeId === r.id);
  const avgRating = history.length
    ? (history.reduce((s, h) => s + (h.rating || 0), 0) / history.length).toFixed(1)
    : null;

  return `<div class="recipe-card">
    <div class="recipe-header">
      <div>
        <div class="recipe-name">${r.name} ${urgentBadge}</div>
        <div class="recipe-meta" style="margin-top:4px">
          <span class="recipe-category">${r.category}</span>
          <span style="color:#aaa;font-size:0.78em">${cookTime}</span>
          ${avgRating ? `<span style="color:var(--yellow);font-size:0.82em">★ ${avgRating} (${history.length}x)</span>` : ''}
        </div>
      </div>
    </div>
    <div class="recipe-ingredients">
      <strong>Ingredients:</strong> ${r.ingredients.map(i => i.n).join(', ')}
    </div>
    <div class="recipe-instructions" id="inst-${r.id}">${r.instructions.replace(/\n/g, '<br>')}</div>
    <div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap">
      <button class="btn btn-gray btn-sm" onclick="toggleInstructions('${r.id}')">📋 Instructions</button>
      ${canCook ? `<button class="btn-cook" onclick="openCookModal('${r.id}')">🍳 Cook It!</button>` : ''}
    </div>
    ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
  </div>`;
}

function almostCard(r, missing) {
  const missingHtml = missing.map(m => `<span class="missing">• ${m.n} (${m.q} ${m.u})</span>`).join('<br>');
  return `<div class="recipe-card">
    <div class="recipe-header">
      <div>
        <div class="recipe-name">${r.name}</div>
        <div class="recipe-meta" style="margin-top:4px">
          <span class="recipe-category">${r.category}</span>
          ${r.cookTime ? `<span style="color:#aaa;font-size:0.78em">⏱ ${r.cookTime} min</span>` : ''}
        </div>
      </div>
      <div style="background:#fef0e7;padding:4px 10px;border-radius:20px;font-size:0.8em;font-weight:700;color:var(--orange)">${missing.length} missing</div>
    </div>
    <div class="recipe-ingredients" style="margin-bottom:8px">
      <strong>Need to grab:</strong><br>${missingHtml}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-gray btn-sm" onclick="toggleInstructions('${r.id}-almost')">📋 Instructions</button>
      <button class="btn btn-orange btn-sm" onclick="addMissingToShopping('${r.id}')">🛒 Add to Shopping List</button>
    </div>
    <div class="recipe-instructions" id="inst-${r.id}-almost" style="margin-top:8px">${r.instructions.replace(/\n/g, '<br>')}</div>
    ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
  </div>`;
}

// Toggle expanded/collapsed recipe instructions
function toggleInstructions(id) {
  const el = document.getElementById('inst-' + id);
  if (el) el.classList.toggle('expanded');
}

// Add missing ingredients for a recipe to the shopping list
function addMissingToShopping(recipeId) {
  const r = RECIPES.find(r => r.id === recipeId);
  if (!r) return;
  const missing = getMissingIngredients(r);
  missing.forEach(ing => {
    if (!shoppingList.find(s => s.name.toLowerCase() === ing.n.toLowerCase())) {
      shoppingList.push({ id: uid(), name: ing.n, qty: `${ing.q} ${ing.u}`, checked: false, fromRecipe: r.name });
    }
  });
  saveState();
  toast(`Added ${missing.length} items to shopping list!`);
}

// ── COOK MODAL ───────────────────────────────────────────────

function openCookModal(recipeId) {
  cookRecipeId = recipeId;
  const r = RECIPES.find(r => r.id === recipeId);
  if (!r) return;

  document.getElementById('cook-deductions').innerHTML = r.ingredients.map(ing => {
    const matched = pantry.find(p => {
      const pN = normalizeName(p.name);
      const iN = normalizeName(ing.n);
      return pN.includes(iN) || iN.includes(pN);
    });
    const currentQty = matched ? `${matched.quantity || '?'} ${matched.unit || ''}` : 'not found';
    return `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:0.9em">
      <span>${ing.n}</span>
      <span style="color:#888">Use ${ing.q} ${ing.u} (have ${currentQty})</span>
    </div>`;
  }).join('');

  document.getElementById('cook-modal').classList.add('open');
}

function closeCookModal() {
  document.getElementById('cook-modal').classList.remove('open');
  cookRecipeId = null;
}

// Deduct ingredients from pantry and log to history
function confirmCook() {
  if (!cookRecipeId) return;
  const r = RECIPES.find(r => r.id === cookRecipeId);
  if (!r) return;

  r.ingredients.forEach(ing => {
    const idx = pantry.findIndex(p => {
      const pN = normalizeName(p.name);
      const iN = normalizeName(ing.n);
      return pN.includes(iN) || iN.includes(pN);
    });
    if (idx >= 0) {
      const item   = pantry[idx];
      const newQty = (parseFloat(item.quantity) || 0) - ing.q;
      if (newQty <= 0) {
        pantry.splice(idx, 1);
      } else {
        pantry[idx] = { ...item, quantity: Math.round(newQty * 10) / 10 };
      }
    }
  });

  // Record in meal history (with pending rating from Random page if set)
  mealHistory.unshift({
    id:         uid(),
    recipeId:   r.id,
    recipeName: r.name,
    date:       new Date().toISOString(),
    rating:     pendingRating
  });
  pendingRating = null;

  saveState();
  closeCookModal();
  toast(`Cooked ${r.name}! Items removed from pantry.`);
  renderPantry();
}
