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
