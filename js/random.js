// ============================================================
// RANDOM.JS — Random meal generator and meal history
// ============================================================

function renderRandom() {
  renderHistory();
}

// Pick a weighted random recipe based on user preferences
function rollRandom() {
  const dice = document.getElementById('random-dice');
  dice.classList.add('rolling');
  setTimeout(() => dice.classList.remove('rolling'), 600);

  const pantryOnly   = document.getElementById('pref-pantry-only')?.checked;
  const favoritesOn  = document.getElementById('pref-favorites')?.checked;
  const varietyOn    = document.getElementById('pref-variety')?.checked;

  let pool = [...RECIPES];

  // Optionally restrict to recipes the user can make right now
  if (pantryOnly) {
    const available = getAvailableRecipes().map(r => r.id);
    if (available.length > 0) pool = pool.filter(r => available.includes(r.id));
  }

  // Build weights for each recipe
  const weights = pool.map(r => {
    let w       = 1;
    const hist  = mealHistory.filter(h => h.recipeId === r.id);

    if (favoritesOn && hist.length > 0) {
      const avg = hist.reduce((s, h) => s + (h.rating || 3), 0) / hist.length;
      w *= avg / 3;
    }
    if (varietyOn && hist.length > 0) {
      const daysSince = (new Date() - new Date(hist[0].date)) / 86400000;
      if (daysSince < 3)      w *= 0.1;
      else if (daysSince < 7) w *= 0.5;
    }
    return Math.max(w, 0.05);
  });

  // Weighted random selection
  const totalW = weights.reduce((s, w) => s + w, 0);
  let rand     = Math.random() * totalW;
  let selected = pool[0];
  for (let i = 0; i < pool.length; i++) {
    rand -= weights[i];
    if (rand <= 0) { selected = pool[i]; break; }
  }

  randomRecipeId = selected.id;
  showRandomResult(selected);
}

// Display the selected random recipe
function showRandomResult(r) {
  document.getElementById('random-result').style.display = 'block';
  document.getElementById('random-name').textContent     = r.name;

  const missing = getMissingIngredients(r);
  document.getElementById('random-meta').innerHTML = `
    <span class="recipe-category">${r.category}</span> · ⏱ ${r.cookTime} min
    ${missing.length === 0
      ? ' · <span style="color:var(--green);font-weight:600">✓ Can make now!</span>'
      : ` · <span style="color:var(--orange)">Missing: ${missing.map(m => m.n).join(', ')}</span>`}
  `;

  document.getElementById('random-ingredients').innerHTML =
    '<strong>Ingredients:</strong><br>' + r.ingredients.map(i => `• ${i.q} ${i.u} ${i.n}`).join('<br>');

  // Render star rating
  document.getElementById('random-stars').innerHTML = [1, 2, 3, 4, 5]
    .map(s => `<span class="star" onclick="rateRandom(${s})" id="star-${s}">★</span>`)
    .join('');
  pendingRating = null;
}

// Set the pre-cook star rating
function rateRandom(rating) {
  pendingRating = rating;
  for (let i = 1; i <= 5; i++) {
    const s = document.getElementById('star-' + i);
    if (s) s.classList.toggle('active', i <= rating);
  }
}

// Open the cook modal for the currently displayed random recipe
function cookRandomMeal() {
  if (!randomRecipeId) return;
  openCookModal(randomRecipeId);
}

// ── MEAL HISTORY ─────────────────────────────────────────────

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!mealHistory.length) {
    list.innerHTML = '<div class="empty-state" style="padding:20px"><p style="color:#aaa">No meals cooked yet. Start cooking!</p></div>';
    return;
  }
  list.innerHTML = mealHistory.slice(0, 20).map((h, i) => {
    const stars = [1, 2, 3, 4, 5]
      .map(s => `<span class="star ${s <= (h.rating || 0) ? 'active' : ''}" onclick="rateHistory(${i}, ${s})">★</span>`)
      .join('');
    const date = new Date(h.date).toLocaleDateString('en', { month: 'short', day: 'numeric' });
    return `<div class="history-item">
      <div>
        <div style="font-weight:600;font-size:0.9em">${h.recipeName}</div>
        <div style="font-size:0.75em;color:#aaa">${date}</div>
      </div>
      <div class="star-rating">${stars}</div>
    </div>`;
  }).join('');
}

// Update the rating for a past meal
function rateHistory(idx, rating) {
  mealHistory[idx].rating = rating;
  saveState();
  renderHistory();
}
