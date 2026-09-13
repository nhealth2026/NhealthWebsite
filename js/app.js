/**
 * NHEALTH TECHNOLOGIES — Core Application & Interactive Engine
 * Controls Theme Switching (Dark/Light), Multi-Role Dashboards,
 * Telemedicine Call Simulator, WhatsApp Alerts, Modals, and Dynamic Charts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPortals();
  initTelemedicine();
  initBookingModal();
  initDesignSystemModal();
  initCharts();
  initToasts();
  initVitalsSimulation();
  initLandingIntro();
});

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
    setTimeout(renderCharts, 150);
  }
}

/* ==========================================================================
   2. Multi-Role Portal Switcher
   ========================================================================== */
function initPortals() {
  const tabs = document.querySelectorAll('.nh-portal-tab');
  const views = document.querySelectorAll('.portal-content-view');
  const rolePicker = document.getElementById('rolePickerSelect');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetRole = tab.dataset.role;
      switchPortal(targetRole);
      if (rolePicker) rolePicker.value = targetRole;
    });
  });

  if (rolePicker) {
    rolePicker.addEventListener('change', (e) => {
      const targetRole = e.target.value;
      if (targetRole) {
        window.location.href = targetRole + '.html';
      }
    });
  }

  function switchPortal(roleId) {
    tabs.forEach(t => {
      if (t.dataset.role === roleId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    views.forEach(v => {
      if (v.id === `view-${roleId}`) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });

    // Re-render charts if switching to admin or doctor view
    if (roleId === 'admin' || roleId === 'doctor') {
      setTimeout(renderCharts, 100);
    }
  }

  window.switchPortalDirect = switchPortal;
  window.navigateToPortal = function(role) {
    window.location.href = role + '.html';
  };
}

/* ==========================================================================
   3. Telemedicine Virtual Consultation Room Simulation
   ========================================================================== */
let isMicMuted = false;
let isVideoOff = false;
let isScreenSharing = false;

function initTelemedicine() {
  const btnMute = document.getElementById('btnCallMute');
  const btnVideo = document.getElementById('btnCallVideo');
  const btnShare = document.getElementById('btnCallShare');
  const btnEnd = document.getElementById('btnCallEnd');
  const chatForm = document.getElementById('telemedChatForm');
  const chatInput = document.getElementById('telemedChatInput');
  const chatMessages = document.getElementById('telemedChatMessages');
  const videoPlaceholder = document.getElementById('videoMainStream');

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      isMicMuted = !isMicMuted;
      btnMute.classList.toggle('btn-active-off', isMicMuted);
      btnMute.innerHTML = isMicMuted 
        ? `<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>`
        : `<svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>`;
      showToast(isMicMuted ? 'Microphone Muted' : 'Microphone Unmuted');
    });
  }

  if (btnVideo) {
    btnVideo.addEventListener('click', () => {
      isVideoOff = !isVideoOff;
      btnVideo.classList.toggle('btn-active-off', isVideoOff);
      if (videoPlaceholder) {
        if (isVideoOff) {
          videoPlaceholder.style.filter = 'grayscale(1) brightness(0.2)';
          showToast('Camera feed paused');
        } else {
          videoPlaceholder.style.filter = 'none';
          showToast('Camera feed resumed');
        }
      }
    });
  }

  if (btnShare) {
    btnShare.addEventListener('click', () => {
      isScreenSharing = !isScreenSharing;
      btnShare.classList.toggle('btn-active-off', isScreenSharing);
      showToast(isScreenSharing ? 'Screen sharing started with patient' : 'Screen sharing stopped');
    });
  }

  if (btnEnd) {
    btnEnd.addEventListener('click', () => {
      if (confirm('End consultation and finalize clinical prescription?')) {
        showToast('Consultation ended. Prescription generated & sent to WhatsApp.');
        const endSummary = document.createElement('div');
        endSummary.className = 'nh-toast';
        endSummary.style.borderLeftColor = 'var(--nh-teal-500)';
        endSummary.innerHTML = `<strong>Session Completed</strong>: 14 mins duration. E-Prescription #NPX-8920 dispatched.`;
        document.body.appendChild(endSummary);
        setTimeout(() => endSummary.remove(), 6000);
      }
    });
  }

  // Live Consultation Chat
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Append User message
      const myBubble = document.createElement('div');
      myBubble.className = 'msg-bubble msg-outgoing';
      myBubble.innerHTML = `<div>${escapeHtml(text)}</div><div class="msg-time">${timeStr} • Sent</div>`;
      chatMessages.appendChild(myBubble);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Doctor Automated Response Simulation
      setTimeout(() => {
        const docResponses = [
          "Noted. I am reviewing your blood pressure trend from earlier today.",
          "I have prescribed a 5-day course of Paracetamol and Azithromycin. Check the prescription tab.",
          "Please ensure plenty of fluids and monitor your temperature twice daily.",
          "I will schedule a quick video follow-up in 48 hours to check on your recovery."
        ];
        const randomReply = docResponses[Math.floor(Math.random() * docResponses.length)];
        const docBubble = document.createElement('div');
        docBubble.className = 'msg-bubble msg-incoming';
        docBubble.innerHTML = `<div>${randomReply}</div><div class="msg-time">${timeStr} • Dr. Sharma</div>`;
        chatMessages.appendChild(docBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 1200);
    });
  }
}

/* ==========================================================================
   4. Real-Time Vitals Simulation (Live Telemetry)
   ========================================================================== */
function initVitalsSimulation() {
  const bpmEl = document.getElementById('liveHeartRate');
  const spo2El = document.getElementById('liveSpO2');
  const bpEl = document.getElementById('liveBP');
  const hudBpmEl = document.getElementById('hudHeartRate');

  setInterval(() => {
    // Slight biological fluctuation
    const newBpm = 72 + Math.floor(Math.random() * 6);
    const newSpo2 = 98 + Math.floor(Math.random() * 2);
    
    if (bpmEl) bpmEl.textContent = `${newBpm} bpm`;
    if (hudBpmEl) hudBpmEl.textContent = `${newBpm} BPM`;
    if (spo2El) spo2El.textContent = `${newSpo2}%`;
  }, 3500);
}

/* ==========================================================================
   5. Interactive Appointment Booking Modal
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const openBtns = document.querySelectorAll('.open-booking-modal-btn');
  const closeBtns = document.querySelectorAll('.close-booking-modal-btn');
  const form = document.getElementById('appointmentBookingForm');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.dataset.service || 'Doctor Consultation';
      const serviceSelect = document.getElementById('bookServiceSelect');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      if (modal) modal.classList.add('open');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('bookPatientName').value || 'Patient';
      const doctorType = document.getElementById('bookSpecialtySelect').value;
      const date = document.getElementById('bookDate').value || 'Today';
      const time = document.getElementById('bookTime').value || 'Immediate 15-Min Slot';

      // Update WhatsApp Preview Card
      const waCard = document.getElementById('whatsappPreviewBody');
      if (waCard) {
        waCard.innerHTML = `
          <strong>NHealth Technologies Booking Confirmation</strong><br>
          Dear <strong>${escapeHtml(patientName)}</strong>, your telemedicine consultation is confirmed with <strong>${escapeHtml(doctorType)}</strong>.<br><br>
          📅 Date: <strong>${escapeHtml(date)}</strong><br>
          ⏰ Slot: <strong>${escapeHtml(time)}</strong><br>
          🔗 Meeting Link: <span style="color:var(--nh-blue-600)">nhealth.tech/v/${Math.random().toString(36).substring(7)}</span><br><br>
          <em>Doctor is verified and will join the secure waiting room 5 minutes prior.</em>
        `;
      }

      if (modal) modal.classList.remove('open');
      showToast(`Appointment scheduled for ${patientName}! WhatsApp notification sent.`);
      
      // Scroll to WhatsApp confirmation view
      const waSection = document.getElementById('whatsappShowcaseSection');
      if (waSection) {
        waSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   6. Design System Inspector Modal
   ========================================================================== */
function initDesignSystemModal() {
  const modal = document.getElementById('designSystemModal');
  const openBtn = document.getElementById('openDesignSystemBtn');
  const closeBtns = document.querySelectorAll('.close-ds-modal-btn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
    });
  }

  closeBtns.forEach(b => {
    b.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

/* ==========================================================================
   7. Enterprise Analytics Dynamic SVG Charts
   ========================================================================== */
function initCharts() {
  renderCharts();
  window.addEventListener('resize', debounce(renderCharts, 250));
}

function renderCharts() {
  renderRevenueChart();
  renderAppointmentsChart();
  renderSpecialtyChart();
  renderPharmacySalesChart();
}

function renderRevenueChart() {
  const container = document.getElementById('revenueChartSvg');
  if (!container) return;

  const data = [42, 58, 65, 82, 98, 124, 156, 182, 215, 260, 310, 385]; // In thousands ($)
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const max = 420;
  const width = container.clientWidth || 500;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  let points = data.map((val, idx) => {
    const x = padding.left + (idx / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (val / max) * plotH;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${padding.left + plotW},${padding.top + plotH} L ${padding.left},${padding.top + plotH} Z`;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? '#142C4F' : '#E6EDF5';
  const textColor = isDark ? '#7E95AA' : '#54718C';

  let svg = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
      <defs>
        <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#02BFB4" stop-opacity="0.38" />
          <stop offset="60%" stop-color="#0060D1" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#0060D1" stop-opacity="0.0" />
        </linearGradient>
        <linearGradient id="revLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#01CCB6" />
          <stop offset="50%" stop-color="#0060D1" />
          <stop offset="100%" stop-color="#00B4DB" />
        </linearGradient>
      </defs>
      
      <!-- Horizontal Grid Lines -->
      <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="${gridColor}" stroke-dasharray="4,4" />
      <text x="${padding.left - 8}" y="${padding.top + 4}" font-size="10" fill="${textColor}" text-anchor="end">$400k</text>

      <line x1="${padding.left}" y1="${padding.top + plotH/2}" x2="${width - padding.right}" y2="${padding.top + plotH/2}" stroke="${gridColor}" stroke-dasharray="4,4" />
      <text x="${padding.left - 8}" y="${padding.top + plotH/2 + 4}" font-size="10" fill="${textColor}" text-anchor="end">$200k</text>

      <line x1="${padding.left}" y1="${padding.top + plotH}" x2="${width - padding.right}" y2="${padding.top + plotH}" stroke="${gridColor}" />
      <text x="${padding.left - 8}" y="${padding.top + plotH + 4}" font-size="10" fill="${textColor}" text-anchor="end">$0</text>

      <!-- Fill Area -->
      <path d="${areaD}" fill="url(#revAreaGrad)" />

      <!-- Smooth Stroke Line -->
      <path d="${pathD}" fill="none" stroke="url(#revLineGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Data Points -->
      ${data.map((val, idx) => {
        const x = padding.left + (idx / (data.length - 1)) * plotW;
        const y = padding.top + plotH - (val / max) * plotH;
        return `
          <circle cx="${x}" cy="${y}" r="4.5" fill="#FFFFFF" stroke="#0060D1" stroke-width="2.5">
            <title>${labels[idx]}: $${val}k</title>
          </circle>
          <text x="${x}" y="${height - 8}" font-size="10" fill="${textColor}" text-anchor="middle">${labels[idx]}</text>
        `;
      }).join('')}
    </svg>
  `;

  container.innerHTML = svg;
}

function renderAppointmentsChart() {
  const container = document.getElementById('appointmentsChartSvg');
  if (!container) return;

  const data = [120, 185, 240, 290, 340, 410, 480];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = 550;
  const width = container.clientWidth || 500;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const barWidth = Math.min(32, (plotW / data.length) * 0.6);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#7E95AA' : '#54718C';
  const gridColor = isDark ? '#142C4F' : '#E6EDF5';

  let svg = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00B4DB" />
          <stop offset="100%" stop-color="#0060D1" />
        </linearGradient>
      </defs>
      
      <line x1="${padding.left}" y1="${padding.top + plotH}" x2="${width - padding.right}" y2="${padding.top + plotH}" stroke="${gridColor}" />
      
      ${data.map((val, idx) => {
        const barH = (val / max) * plotH;
        const x = padding.left + (idx + 0.5) * (plotW / data.length) - barWidth/2;
        const y = padding.top + plotH - barH;
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="url(#barGrad)">
            <title>${days[idx]}: ${val} Appointments</title>
          </rect>
          <text x="${x + barWidth/2}" y="${y - 6}" font-size="10" font-weight="600" fill="${textColor}" text-anchor="middle">${val}</text>
          <text x="${x + barWidth/2}" y="${height - 8}" font-size="10" fill="${textColor}" text-anchor="middle">${days[idx]}</text>
        `;
      }).join('')}
    </svg>
  `;

  container.innerHTML = svg;
}

function renderSpecialtyChart() {
  const container = document.getElementById('specialtyChartSvg');
  if (!container) return;

  const categories = [
    { label: 'Cardiology', pct: 32, color: '#0060D1' },
    { label: 'General Physician', pct: 28, color: '#02BFB4' },
    { label: 'Pediatrics', pct: 18, color: '#00B4DB' },
    { label: 'Dermatology', pct: 14, color: '#003169' },
    { label: 'Neurology', pct: 8, color: '#54718C' }
  ];

  let barsHtml = categories.map(cat => `
    <div style="margin-bottom: 0.9rem;">
      <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.3rem;">
        <span>${cat.label}</span>
        <span>${cat.pct}%</span>
      </div>
      <div style="height: 9px; border-radius: 999px; background: var(--border-light); overflow: hidden;">
        <div style="height: 100%; width: ${cat.pct}%; background: ${cat.color}; border-radius: 999px;"></div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `<div style="padding: 0.5rem 0;">${barsHtml}</div>`;
}

function renderPharmacySalesChart() {
  const container = document.getElementById('pharmacyChartSvg');
  if (!container) return;

  const hours = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];
  const orders = [45, 120, 210, 180, 260, 310, 195];
  const max = 350;
  const width = container.clientWidth || 500;
  const height = 200;
  const padding = { top: 15, right: 15, bottom: 25, left: 35 };

  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  let points = orders.map((val, idx) => {
    const x = padding.left + (idx / (orders.length - 1)) * plotW;
    const y = padding.top + plotH - (val / max) * plotH;
    return `${x},${y}`;
  });

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#7E95AA' : '#54718C';

  let svg = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
      <path d="M ${points.join(' L ')}" fill="none" stroke="#02BFB4" stroke-width="3" stroke-linecap="round" />
      ${orders.map((val, idx) => {
        const x = padding.left + (idx / (orders.length - 1)) * plotW;
        const y = padding.top + plotH - (val / max) * plotH;
        return `
          <circle cx="${x}" cy="${y}" r="4" fill="#02BFB4" />
          <text x="${x}" y="${height - 6}" font-size="9" fill="${textColor}" text-anchor="middle">${hours[idx]}</text>
        `;
      }).join('')}
    </svg>
  `;

  container.innerHTML = svg;
}

/* ==========================================================================
   8. Live Notification Toast System
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


/* ==========================================================================
   LANDING INTRO ANIMATION (landingvideo.mp4)
   Plays full-screen intro video upon arrival, then seamlessly reveals homepage.
   ========================================================================== */
function initLandingIntro() {
  const overlay = document.getElementById('nhLandingIntro');
  const video = document.getElementById('nhLandingVideo');
  const skipBtn = document.getElementById('nhSkipIntroBtn');
  const progressFill = document.getElementById('nhIntroProgressFill');

  if (!overlay || !video) return;

  let isDismissed = false;

  function dismissIntro() {
    if (isDismissed) return;
    isDismissed = true;

    // Smooth fade & scale transition
    overlay.classList.add('intro-hidden');

    // Trigger hero videos playback
    const heroBgVideo = document.querySelector('.nh-hero-video-bg');
    const heroMainVideo = document.querySelector('.nh-hero-main-video');
    if (heroBgVideo && heroBgVideo.paused) {
      heroBgVideo.play().catch(() => {});
    }
    if (heroMainVideo && heroMainVideo.paused) {
      heroMainVideo.play().catch(() => {});
    }

    setTimeout(() => {
      try {
        video.pause();
      } catch (e) {}
      overlay.style.display = 'none';
      document.body.classList.remove('intro-locked');
    }, 850);
  }

  // Lock scrolling while intro is visible
  document.body.classList.add('intro-locked');

  // Track progress bar
  video.addEventListener('timeupdate', () => {
    if (video.duration && progressFill) {
      const pct = (video.currentTime / video.duration) * 100;
      progressFill.style.width = pct + '%';
    }
  });

  // Dismiss when video finishes playing
  video.addEventListener('ended', () => {
    dismissIntro();
  });

  // Skip button handler
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissIntro();
    });
  }

  // Keyboard shortcut (Escape key to skip)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dismissIntro();
    }
  });

  // Click anywhere on overlay to skip
  overlay.addEventListener('click', () => {
    dismissIntro();
  });

  // Safe fallback timer (8.5 seconds) in case of any codec/event interruption
  setTimeout(() => {
    dismissIntro();
  }, 8500);

  // Attempt autoplay
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.log('Intro video autoplay waiting for user interaction or codec ready:', err);
    });
  }
}
