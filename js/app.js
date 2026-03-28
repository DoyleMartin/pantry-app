// ============================================================
// APP.JS — App initialisation, keyboard shortcuts, modal close
// ============================================================

// Close any open modal when Escape is pressed.
// Save the add-item form when Enter is pressed inside it.
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
  if (e.key === 'Enter' && document.getElementById('add-item-modal').classList.contains('open')) {
    saveItem();
  }
});

// Close any modal when clicking its dark backdrop
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ── BOOT ─────────────────────────────────────────────────────
loadState();
renderPantry();
