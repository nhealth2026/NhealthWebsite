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
