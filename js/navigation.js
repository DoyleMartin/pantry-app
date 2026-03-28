// ============================================================
// NAVIGATION.JS — Page switching and routing
// ============================================================

// Switch to a named page and re-render its content
function showPage(page) {
  currentPage = page;

  // Hide all pages, deactivate all tabs
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  // Show the requested page
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  // Highlight the matching nav tab
  const pageOrder = ['pantry', 'scanner', 'recipes', 'almost', 'planner', 'random'];
  const idx = pageOrder.indexOf(page);
  const tabs = document.querySelectorAll('.nav-tab');
  if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');

  // Render dynamic content for the page
  renderCurrentPage();
}

// Call the appropriate render function for the current page
function renderCurrentPage() {
  switch (currentPage) {
    case 'pantry':  renderPantry();  break;
    case 'recipes': renderRecipes(); break;
    case 'almost':  renderAlmost();  break;
    case 'planner': renderPlanner(); break;
    case 'random':  renderRandom();  break;
    // 'scanner' has static HTML — no render function needed
  }
}
