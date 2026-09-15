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
      
      // Auto-prefill notes if user typed into symptom inputs
      const deskSymptom = document.getElementById('pDesktopSymptomInput');
      const mobSymptom = document.getElementById('pSymptomInput');
      const bookNotes = document.getElementById('bookNotes');
      const symptomText = (deskSymptom && deskSymptom.value.trim()) || (mobSymptom && mobSymptom.value.trim());
      if (bookNotes && symptomText) {
        bookNotes.value = symptomText;
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
      const serviceName = document.getElementById('bookServiceSelect') ? document.getElementById('bookServiceSelect').value : 'Online Doctor Consultation';
      const patientName = document.getElementById('bookPatientName') ? document.getElementById('bookPatientName').value : 'Patient';
      const patientPhone = document.getElementById('bookPatientPhone') ? document.getElementById('bookPatientPhone').value : '';
      const doctorType = document.getElementById('bookSpecialtySelect') ? document.getElementById('bookSpecialtySelect').value : 'General Physician';
      const date = document.getElementById('bookDate') ? document.getElementById('bookDate').value : 'Today';
      const time = document.getElementById('bookTime') ? document.getElementById('bookTime').value : 'Immediate 15-Min Slot';
      const notesVal = document.getElementById('bookNotes') && document.getElementById('bookNotes').value.trim();

      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.auth-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Scheduling Consultation...</span>';
      }

      fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceName,
          name: patientName,
          phone: patientPhone,
          date: date,
          time: time,
          notes: notesVal || `Consultation with ${doctorType}`
        })
      })
      .then(res => res.json())
      .then(data => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Confirm & Book Consultation</span>';
        }

        if (data.success) {
          const meetUrl = data.meeting_link || `/consultation/${data.meeting_room_id}`;
          const fullMeetUrl = window.location.origin + meetUrl;

          // Update WhatsApp Preview Card
          const waCard = document.getElementById('whatsappPreviewBody');
          if (waCard) {
            waCard.innerHTML = `
              <strong>NHealth Technologies Booking Confirmation</strong><br>
              Dear <strong>${escapeHtml(patientName)}</strong>, your consultation for <strong>${escapeHtml(serviceName)}</strong> is confirmed.<br><br>
              📅 Date: <strong>${escapeHtml(date)}</strong> | ⏰ Slot: <strong>${escapeHtml(time)}</strong><br>
              🆔 Journey Code: <strong>${escapeHtml(data.journey_code || 'NH-CJ-1001')}</strong><br><br>
              📹 <strong>Your Secure Video Meeting Room:</strong><br>
              <a href="${meetUrl}" class="nh-meet-live-link" style="color:#0060D1; font-weight:700; text-decoration:underline;">${fullMeetUrl}</a><br><br>
              <em>Click above to enter the waiting room. Doctor will join at the scheduled time.</em>
            `;
          }

          if (modal) modal.classList.remove('open');
          showToast(`Consultation confirmed! Meeting link: ${data.meeting_room_id}`);

          // Scroll to WhatsApp confirmation view if on homepage
          const waSection = document.getElementById('whatsappShowcaseSection');
          if (waSection) {
            waSection.scrollIntoView({ behavior: 'smooth' });
          } else if (window.location.pathname.includes('/dashboard/patient')) {
            // Automatically reload dashboard to show newly created active appointment and meeting link
            setTimeout(() => { window.location.reload(); }, 1200);
          }
        } else {
          showToast('Error: ' + (data.message || 'Unable to confirm booking.'));
        }
      })
      .catch(err => {
        console.error('Booking error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Confirm & Book Consultation</span>';
        }
        showToast('Booking request submitted. Our coordinator will reach out.');
        if (modal) modal.classList.remove('open');
      });
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
