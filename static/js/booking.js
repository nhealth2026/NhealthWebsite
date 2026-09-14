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
   Video Player Modal
   ========================================================================== */
function initVideoModal() {
  const modal = document.getElementById('videoPlayerModal');
  const openBtn = document.getElementById('openVideoModalBtn');
  
  if (openBtn && modal) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      const videoPlayer = modal.querySelector('video');
      if (videoPlayer) videoPlayer.play();
    });
  }

  function closeModal() {
    if (modal) modal.classList.remove('open');
    const videoPlayer = modal ? modal.querySelector('video') : null;
    if (videoPlayer) videoPlayer.pause();
  }

  if (modal) {
    const closeBtn = modal.querySelector('.close-video-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}
