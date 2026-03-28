// ============================================================
// STORAGE.JS — App state variables and localStorage helpers
// ============================================================

// State variables
let pantry       = [];
let mealHistory  = [];
let mealPlan     = {};
let shoppingList = [];

// Navigation state
let currentPage        = 'pantry';
let editItemId         = null;
let cookRecipeId       = null;
let plannerWeekOffset  = 0;
let addMealDay         = null;
let randomRecipeId     = null;
let pendingRating      = null;

// Load all state from localStorage
function loadState() {
  try { pantry       = JSON.parse(localStorage.getItem('pp_pantry')   || '[]'); } catch(e) { pantry = []; }
  try { mealHistory  = JSON.parse(localStorage.getItem('pp_history')  || '[]'); } catch(e) { mealHistory = []; }
  try { mealPlan     = JSON.parse(localStorage.getItem('pp_plan')     || '{}'); } catch(e) { mealPlan = {}; }
  try { shoppingList = JSON.parse(localStorage.getItem('pp_shopping') || '[]'); } catch(e) { shoppingList = []; }
}

// Save all state to localStorage
function saveState() {
  localStorage.setItem('pp_pantry',   JSON.stringify(pantry));
  localStorage.setItem('pp_history',  JSON.stringify(mealHistory));
  localStorage.setItem('pp_plan',     JSON.stringify(mealPlan));
  localStorage.setItem('pp_shopping', JSON.stringify(shoppingList));
}
