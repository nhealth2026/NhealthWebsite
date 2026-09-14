/* ==========================================================================
   Live Notification Toast System
   ========================================================================== */
function initToasts() {
  // Toasts only trigger on explicit user actions, no automatic intrusive popups
}

function showToast(messageHtml) {
  let toastContainer = document.querySelector('.nh-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'nh-toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'nh-toast';
  toast.innerHTML = `
    <span style="color: var(--nh-teal-500); font-size: 1.25rem;">●</span>
    <div>${messageHtml}</div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* Helper Utilities */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

window.copyToken = function(hex) {
  navigator.clipboard.writeText(hex).then(() => {
    showToast(`Copied <strong>${hex}</strong> to clipboard!`);
  });
};
