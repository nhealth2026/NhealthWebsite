/**
 * NHEALTH TECHNOLOGIES — Main Application Bootstrap
 * Initializes all modules on DOMContentLoaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  initToasts();
  initTheme();
  initTelemedicine();
  initBookingModal();
  initVideoModal();
  initCharts();
  initVitalsSimulation();
  initLandingIntro();
});
