// ============================================================
// UTILS.JS — Shared utility functions
// ============================================================

// Generate a unique ID
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Return expiry status info for a given date string
function getExpiryStatus(expiryDate) {
  if (!expiryDate) return { class: '', badgeClass: 'badge-none', label: 'No expiry' };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const exp   = new Date(expiryDate); exp.setHours(0, 0, 0, 0);
  const days  = Math.round((exp - today) / 86400000);
  if (days < 0)  return { class: 'expired',           badgeClass: 'badge-expired',  label: `Expired ${Math.abs(days)}d ago` };
  if (days <= 2) return { class: 'expiring-critical', badgeClass: 'badge-critical', label: `Expires in ${days}d!` };
  if (days <= 5) return { class: 'expiring-soon',     badgeClass: 'badge-soon',     label: `Expires in ${days}d` };
  if (days <= 14)return { class: 'expiring-week',     badgeClass: 'badge-soon',     label: `Expires in ${days}d` };
  return { class: '', badgeClass: 'badge-good', label: `Exp: ${exp.toLocaleDateString()}` };
}

// Sort pantry array by soonest expiry first (no expiry goes last)
function sortPantryByExpiry(items) {
  return [...items].sort((a, b) => {
    if (!a.expiryDate && !b.expiryDate) return 0;
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });
}

// Show a toast notification
function toast(msg, type = 'success') {
  const container = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(100%)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// Get ISO week key for a given week offset (e.g. "2025-W03")
function getWeekKey(offset = 0) {
  const d    = new Date();
  d.setDate(d.getDate() + offset * 7);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week.toString().padStart(2, '0')}`;
}

// Get array of 7 Date objects (Mon–Sun) for a given week offset
function getWeekDates(offset = 0) {
  const today  = new Date();
  const dow    = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Normalize an ingredient name for fuzzy matching
function normalizeName(n) {
  return n.toLowerCase()
    .replace(/s\b/g, '')  // remove trailing 's'
    .replace(/\b(fresh|dried|frozen|canned|ground|minced|sliced|diced|chopped)\b/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim();
}

// Check if the pantry contains a given ingredient (fuzzy match)
function pantryHasIngredient(ingredient) {
  const ingNorm = normalizeName(ingredient.n);
  return pantry.some(p => {
    const pNorm = normalizeName(p.name);
    return pNorm.includes(ingNorm) || ingNorm.includes(pNorm);
  });
}

// Return the list of missing ingredients for a recipe
function getMissingIngredients(recipe) {
  return recipe.ingredients.filter(ing => !pantryHasIngredient(ing));
}

// Return all recipes that can be made with current pantry
function getAvailableRecipes() {
  return RECIPES.filter(r => getMissingIngredients(r).length === 0);
}

// Return recipes missing 1–maxMissing ingredients, sorted by fewest missing first
function getAlmostRecipes(maxMissing = 3) {
  return RECIPES
    .map(r => ({ recipe: r, missing: getMissingIngredients(r) }))
    .filter(({ missing }) => missing.length > 0 && missing.length <= maxMissing)
    .sort((a, b) => a.missing.length - b.missing.length);
}

// Guess the category of an item based on its name
function guessCategory(name) {
  const n = name.toLowerCase();
  if (/\b(milk|cheese|yogurt|butter|cream|egg|dairy)\b/.test(n))                         return 'Dairy';
  if (/\b(chicken|beef|pork|lamb|turkey|steak|ground|ham|sausage|bacon|meat)\b/.test(n)) return 'Meat';
  if (/\b(apple|banana|orange|tomato|onion|garlic|pepper|carrot|lettuce|spinach|broccoli|potato|cucumber|avocado|lemon|lime|celery|mushroom|zucchini|corn|pea)\b/.test(n)) return 'Produce';
  if (/\b(pasta|rice|bread|flour|oat|noodle|cereal|cracker|grain|tortilla)\b/.test(n))   return 'Grains';
  if (/\b(can|canned|soup|bean|tuna)\b/.test(n))                                          return 'Canned';
  if (/\b(frozen|ice cream)\b/.test(n))                                                   return 'Frozen';
  if (/\b(ketchup|mustard|mayo|sauce|dressing|vinegar|oil|soy)\b/.test(n))               return 'Condiments';
  if (/\b(salt|pepper|spice|seasoning|herb|cumin|paprika|cinnamon|basil|oregano)\b/.test(n)) return 'Spices';
  if (/\b(chip|cookie|candy|snack|chocolate|nut|popcorn)\b/.test(n))                     return 'Snacks';
  if (/\b(juice|water|soda|coffee|tea|drink|beverage)\b/.test(n))                        return 'Beverages';
  if (/\b(shrimp|fish|salmon|tuna|seafood|crab|lobster)\b/.test(n))                      return 'Seafood';
  return 'Other';
}

// Score a recipe by how urgently its ingredients need to be used (higher = more urgent)
function recipeExpiryScore(recipe) {
  let score = 0;
  recipe.ingredients.forEach(ing => {
    const matched = pantry.find(p => {
      const pN = normalizeName(p.name);
      const iN = normalizeName(ing.n);
      return pN.includes(iN) || iN.includes(pN);
    });
    if (matched && matched.expiryDate) {
      const days = Math.round((new Date(matched.expiryDate) - new Date()) / 86400000);
      if (days <= 2)  score += 10;
      else if (days <= 5)  score += 5;
      else if (days <= 14) score += 2;
    }
  });
  return score;
}

// Populate the recipe category filter dropdown (only once)
function populateRecipeCategoryFilter() {
  const sel = document.getElementById('recipe-cat-filter');
  if (!sel || sel.options.length > 1) return;
  const cats = [...new Set(RECIPES.map(r => r.category))].sort();
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });
}
