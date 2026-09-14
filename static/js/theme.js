/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const logoImgs = document.querySelectorAll('.nh-brand-logo-img');
  
  // Check persisted theme or system preference
  const savedTheme = localStorage.getItem('nhealth-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nhealth-theme', theme);

    // Update Theme Toggle Button Icon
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }

    // Update Logo variant if available
    logoImgs.forEach(img => {
      if (theme === 'dark') {
        img.src = 'assets/images/logo-white-text.png';
      } else {
        img.src = 'assets/images/logo-transparent.png';
      }
    });

    // Redraw charts with adapted grid colors
    if (typeof renderCharts === 'function') {
      setTimeout(renderCharts, 150);
    }
  }
}
