/* ==========================================================================
   LANDING INTRO ANIMATION (nhealth_animation.mp4)
   Plays full-screen intro video upon arrival, then seamlessly reveals homepage.
   ========================================================================== */
function initLandingIntro() {
  const overlay = document.getElementById('nhLandingIntro');
  const video = document.getElementById('nhLandingVideo');
  const skipBtn = document.getElementById('nhSkipIntroBtn');
  const progressFill = document.getElementById('nhIntroProgressFill');

  if (!overlay || !video) return;

  // Device-specific intro animation:
  // Laptop/Desktop (> 768px): desktop_animation.mp4
  // Mobile (<= 768px): nhealth_animation.mp4
  const isMobile = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
  const desktopSrc = overlay.getAttribute('data-desktop-src') || '/static/videos/desktop_animation.mp4';
  const mobileSrc = overlay.getAttribute('data-mobile-src') || '/static/videos/nhealth_animation.mp4';
  const targetSrc = isMobile ? mobileSrc : desktopSrc;

  if (!video.src || !video.src.includes(targetSrc)) {
    video.src = targetSrc;
    const sourceTag = document.getElementById('nhLandingVideoSource');
    if (sourceTag) sourceTag.src = targetSrc;
    video.load();
    video.play().catch(() => {});
  }

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

  // Safe fallback timer (11.5 seconds) in case of any codec/event interruption
  setTimeout(() => {
    dismissIntro();
  }, 11500);

  // Attempt autoplay
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.log('Intro video autoplay waiting for user interaction or codec ready:', err);
    });
  }
}
