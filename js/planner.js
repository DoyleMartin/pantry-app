// ============================================================
// PLANNER.JS — Meal planner and shopping list logic
// ============================================================

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ── WEEK GRID ────────────────────────────────────────────────

function renderPlanner() {
  const dates   = getWeekDates(plannerWeekOffset);
  const weekKey = getWeekKey(plannerWeekOffset);
  if (!mealPlan[weekKey]) mealPlan[weekKey] = {};

  // Update the week label
  const label = `${dates[0].toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${dates[6].toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  document.getElementById('planner-week-label').textContent = label;

  // Render each day column
  document.getElementById('week-grid').innerHTML = DAYS.map((day, i) => {
    const dateKey = dates[i].toISOString().slice(0, 10);
    const meals   = mealPlan[weekKey][dateKey] || [];

    const mealHtml = meals.map((recipeId, mi) => {
      const r = RECIPES.find(r => r.id === recipeId);
      return r ? `<div class="day-meal" title="${r.name}">
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.name}</span>
        <button onclick="removePlanMeal('${dateKey}', ${mi})" style="background:none;border:none;cursor:pointer;font-size:0.9em;flex-shrink:0">✕</button>
      </div>` : '';
    }).join('');

    const isToday  = dates[i].toDateString() === new Date().toDateString();
    return `<div class="day-col" style="${isToday ? 'border:2px solid var(--green)' : ''}">
      <div class="day-name" style="${isToday ? 'color:var(--green)' : ''}">${day.slice(0, 3)} <span style="font-weight:400">${dates[i].getDate()}</span></div>
      ${mealHtml}
      <button class="day-add" onclick="openMealModal('${dateKey}')">+ Add meal</button>
    </div>`;
  }).join('');
}

// Navigate to a different week (dir: -1 = prev, 0 = today, 1 = next)
function changeWeek(dir) {
  plannerWeekOffset = dir === 0 ? 0 : plannerWeekOffset + dir;
  renderPlanner();
}

// Remove a meal from the plan
function removePlanMeal(dateKey, idx) {
  const weekKey = getWeekKey(plannerWeekOffset);
  if (mealPlan[weekKey] && mealPlan[weekKey][dateKey]) {
    mealPlan[weekKey][dateKey].splice(idx, 1);
    saveState();
    renderPlanner();
  }
}

// ── ADD MEAL MODAL ───────────────────────────────────────────

function openMealModal(dateKey) {
  addMealDay = dateKey;
  document.getElementById('add-meal-day-label').textContent =
    new Date(dateKey + 'T12:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });
  document.getElementById('meal-search').value = '';
  filterMealPicker();
  document.getElementById('add-meal-modal').classList.add('open');
}

function closeMealModal() {
  document.getElementById('add-meal-modal').classList.remove('open');
  addMealDay = null;
}

function filterMealPicker() {
  const search    = document.getElementById('meal-search').value.toLowerCase();
  const available = getAvailableRecipes().map(r => r.id);
  const filtered  = RECIPES.filter(r =>
    !search || r.name.toLowerCase().includes(search) || r.category.toLowerCase().includes(search)
  );

  document.getElementById('meal-picker-list').innerHTML = filtered.map(r => {
    const canMake = available.includes(r.id);
    return `<div
      style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-bottom:1px solid #f0f0f0;cursor:pointer"
      onclick="addMealToPlan('${r.id}')"
      onmouseover="this.style.background='#f8f8f8'"
      onmouseout="this.style.background=''">
      <div>
        <div style="font-weight:600;font-size:0.9em">${r.name}</div>
        <div style="font-size:0.78em;color:#888">${r.category} · ${r.cookTime} min</div>
      </div>
      ${canMake
        ? '<span style="color:var(--green);font-size:0.8em;font-weight:600">✓ Can make</span>'
        : '<span style="color:#aaa;font-size:0.75em">Need items</span>'}
    </div>`;
  }).join('');
}

function addMealToPlan(recipeId) {
  if (!addMealDay) return;
  const weekKey = getWeekKey(plannerWeekOffset);
  if (!mealPlan[weekKey]) mealPlan[weekKey] = {};
  if (!mealPlan[weekKey][addMealDay]) mealPlan[weekKey][addMealDay] = [];
  mealPlan[weekKey][addMealDay].push(recipeId);
  saveState();
  closeMealModal();
  renderPlanner();
  const r = RECIPES.find(r => r.id === recipeId);
  toast(`Added ${r?.name} to plan!`);
}

// ── SHOPPING LIST ────────────────────────────────────────────

// Build shopping list from all planned meals this week
function generateShoppingList() {
  const weekKey = getWeekKey(plannerWeekOffset);
  const week    = mealPlan[weekKey] || {};
  const needed  = {};

  Object.values(week).forEach(meals => {
    meals.forEach(recipeId => {
      const r = RECIPES.find(r => r.id === recipeId);
      if (!r) return;
      r.ingredients.forEach(ing => {
        if (!pantryHasIngredient(ing)) {
          const key = normalizeName(ing.n);
          if (!needed[key]) needed[key] = { name: ing.n, qty: 0, unit: ing.u, recipes: [] };
          needed[key].qty += ing.q;
          if (!needed[key].recipes.includes(r.name)) needed[key].recipes.push(r.name);
        }
      });
    });
  });

  shoppingList = Object.values(needed).map(item => ({
    id:         uid(),
    name:       item.name,
    qty:        `${item.qty} ${item.unit}`.trim(),
    checked:    false,
    fromRecipe: item.recipes.join(', ')
  }));

  saveState();
  renderShoppingList();
  toast(`Generated shopping list with ${shoppingList.length} items!`);
}

function renderShoppingList() {
  const container = document.getElementById('shopping-list-container');
  if (shoppingList.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:30px"><p>No items needed! Your pantry has everything for this week's meals.</p></div>`;
    return;
  }

  container.innerHTML = `<ul class="shopping-list">
    ${shoppingList.map((item, i) => `
      <li class="shopping-item ${item.checked ? 'checked' : ''}">
        <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem(${i})">
        <div style="flex:1">
          <span style="font-weight:600">${item.name}</span>
          <span style="color:#888;font-size:0.82em"> · ${item.qty}</span>
          ${item.fromRecipe ? `<div style="font-size:0.75em;color:#aaa">For: ${item.fromRecipe}</div>` : ''}
        </div>
        <button class="btn-icon" onclick="removeShoppingItem(${i})">✕</button>
      </li>`).join('')}
  </ul>
  <div style="padding:12px;display:flex;justify-content:space-between;color:#888;font-size:0.82em">
    <span>${shoppingList.filter(i => !i.checked).length} items remaining</span>
    <button class="btn btn-primary btn-sm" onclick="addShoppingToPantry()">✅ Mark All as Bought</button>
  </div>`;
}

function toggleShoppingItem(i) {
  shoppingList[i].checked = !shoppingList[i].checked;
  saveState();
  renderShoppingList();
}

function removeShoppingItem(i) {
  shoppingList.splice(i, 1);
  saveState();
  renderShoppingList();
}

function clearCheckedShopping() {
  shoppingList = shoppingList.filter(i => !i.checked);
  saveState();
  renderShoppingList();
}

// Add all checked shopping items to the pantry
function addShoppingToPantry() {
  const checked = shoppingList.filter(i => i.checked);
  checked.forEach(item => {
    pantry.push({
      id:         uid(),
      name:       item.name,
      quantity:   parseFloat(item.qty) || 1,
      unit:       item.qty.replace(/[\d.]+\s*/, '').trim() || 'pieces',
      category:   guessCategory(item.name),
      expiryDate: null,
      addedDate:  new Date().toISOString()
    });
  });
  shoppingList = shoppingList.filter(i => !i.checked);
  saveState();
  renderShoppingList();
  toast(`Added ${checked.length} items to pantry!`);
}

// Open a print-friendly shopping list
function printShoppingList() {
  const items = shoppingList.filter(i => !i.checked);
  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>Shopping List</title>
    <style>body{font-family:sans-serif;padding:20px}li{padding:6px 0;font-size:1.1em}h1{color:#27ae60}</style>
    </head><body>
    <h1>🛒 Shopping List</h1>
    <ul>${items.map(i => `<li>☐ ${i.name} — ${i.qty}</li>`).join('')}</ul>
    </body></html>`);
  w.print();
}
