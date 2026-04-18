/* ──────────────────────────────────────────────────────────────
   RW x GEMS OtoColor — script.js
   Single-screen interaction: Creepy Button + Integrated Demo
   ────────────────────────────────────────────────────────────── */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── EYE TRACKING (CREEPY BUTTON) ─── */
  
  function getPupilOffset(eye, cursorX, cursorY) {
    const rect = eye.getBoundingClientRect();
    const eyeCX = rect.left + rect.width / 2;
    const eyeCY = rect.top  + rect.height / 2;

    const dx = cursorX - eyeCX;
    const dy = cursorY - eyeCY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = 4; // px

    if (dist === 0) return { x: 0, y: 0 };
    const clampedDist = Math.min(dist, maxRadius);
    return { x: (dx / dist) * clampedDist, y: (dy / dist) * clampedDist };
  }

  window.updateEyes = (event, btn) => {
    const eyes = btn.querySelectorAll('.eye');
    const pupils = btn.querySelectorAll('.pupil');
    eyes.forEach((eye, i) => {
      const { x, y } = getPupilOffset(eye, event.clientX, event.clientY);
      pupils[i].style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  window.updateEyesTouch = (event, btn) => {
    const touch = event.touches[0];
    if (touch) window.updateEyes({ clientX: touch.clientX, clientY: touch.clientY }, btn);
  };

  window.resetEyes = (btn) => {
    const pupils = btn.querySelectorAll('.pupil');
    pupils.forEach(p => p.style.transform = 'translate(0px, 0px)');
  };





  /* ─── INTEGRATED DEMO ENGINE ─── */

  const DEMO_STEPS = [
    'Étape 1/7 — Analyse des keyframes locales...',
    'Étape 2/7 — Assignation des tags sémantiques (#Veste, #Peau)...',
    'Étape 3/7 — Entraînement Few-Shot Learning (GPU)...',
    'Étape 4/7 — Propagation sur les in-betweens...',
    'Étape 5/7 — Fermeture des gaps & contrôle anti-flickering...',
    'Étape 6/7 — Vérification de cohérence colorimétrique...',
    'Étape 7/7 — ✓ Séquence prête pour export!'
  ];

  const startDemoBtn = document.getElementById('start-demo');
  const statusText = document.getElementById('demo-status-text');
  const progressFill = document.getElementById('demo-progress-fill');
  const progressPct = document.getElementById('demo-pct');
  const scanLine = document.getElementById('scan-line');
  
  // Character Parts
  const parts = {
    body: document.getElementById('char-body'),
    vest: document.getElementById('char-vest'),
    head: document.getElementById('char-head'),
    legs: document.getElementById('char-legs')
  };

  let isDemoRunning = false;

  function resetDemo() {
    progressFill.style.width = '0%';
    progressPct.textContent = '0%';
    scanLine.style.display = 'block';
    statusText.textContent = 'Mode Local : En attente...';
    
    Object.values(parts).forEach(p => {
      if (p) {
        p.style.fill = 'transparent';
        p.style.stroke = 'white';
        p.style.filter = 'none';
      }
    });
  }

  function runColorDemo(isAuto = false) {
    if (isDemoRunning) return;
    isDemoRunning = true;
    
    if (startDemoBtn) {
      startDemoBtn.disabled = true;
      startDemoBtn.textContent = 'IA en cours...';
    }

    resetDemo();

    let step = 0;
    const totalSteps = DEMO_STEPS.length;
    
    const runStep = () => {
      if (step >= totalSteps) {
        statusText.textContent = '✓ Colorisation prête !';
        if (startDemoBtn) {
          startDemoBtn.textContent = 'Relancer la démo';
          startDemoBtn.disabled = false;
        }
        scanLine.style.display = 'none';
        isDemoRunning = false;

        // If auto, wait 5s and restart
        if (isAuto) {
          setTimeout(() => runColorDemo(true), 5000);
        }
        return;
      }

      statusText.textContent = DEMO_STEPS[step];
      const progressValue = Math.round(((step + 1) / totalSteps) * 100);
      progressFill.style.width = `${progressValue}%`;
      progressPct.textContent = `${progressValue}%`;

      // Trigger visual colorization at specific steps
      if (step === 1) { // Segmenter
        if (parts.body) parts.body.style.stroke = 'var(--color-primary)';
      }
      if (step === 2) { // Veste
        if (parts.vest) {
           parts.vest.style.fill = 'var(--color-primary)';
           parts.vest.style.stroke = 'var(--color-primary)';
        }
      }
      if (step === 3) { // Peau
        if (parts.head) {
           parts.head.style.fill = 'var(--color-emerald)';
           parts.head.style.stroke = 'var(--color-emerald)';
        }
      }
      if (step === 4) { // Pantalon
        if (parts.legs) {
           parts.legs.style.stroke = 'var(--color-amber)';
        }
      }
      if (step === 6) { // Final Glow
        Object.values(parts).forEach(p => {
          if (p) p.style.filter = 'drop-shadow(0 0 4px rgba(255,255,255,0.2))';
        });
      }

      step++;
      setTimeout(runStep, 800);
    };

    runStep();
  }

  if (startDemoBtn) {
    startDemoBtn.addEventListener('click', () => runColorDemo(false));
  }

  // Initial auto-start after a short delay
  setTimeout(() => runColorDemo(true), 2000);


  /* ─── BACKGROUND & TITLE COMPARISON TRACKING ─── */
  const bgComparison = document.getElementById('bgComparison');
  const logoWrapper = document.getElementById('logoWrapper');
  const logoBlack = logoWrapper ? logoWrapper.querySelector('.text-black') : null;
  const heroTextPanel = document.getElementById('heroTextPanel');
  const panelPaper = document.getElementById('panelPaper');

  function updateVisuals(clientX) {
    const screenWidth = window.innerWidth;
    const xPct = (clientX / screenWidth) * 100;
    
    // Update background slider
    if (bgComparison) {
      bgComparison.style.setProperty('--slider-pos', `${xPct}%`);
    }

    // Update Logo Reveal Sync (Black revealed from SLIDER to RIGHT)
    if (logoWrapper && logoBlack) {
        const rect = logoWrapper.getBoundingClientRect();
        const localX = ((clientX - rect.left) / rect.width) * 100;
        const clampedX = Math.max(0, Math.min(100, localX));
        logoBlack.style.clipPath = `polygon(${clampedX}% 0, 100% 0, 100% 100%, ${clampedX}% 100%)`;
    }

    // Update Global Panel Reveal Sync (Paper revealed from SLIDER to RIGHT)
    if (heroTextPanel && panelPaper) {
        const rect = heroTextPanel.getBoundingClientRect();
        const localX = ((clientX - rect.left) / rect.width) * 100;
        const clampedX = Math.max(0, Math.min(100, localX));
        panelPaper.style.clipPath = `polygon(${clampedX}% 0, 100% 0, 100% 100%, ${clampedX}% 100%)`;
    }
  }

  document.addEventListener('mousemove', (e) => updateVisuals(e.clientX));
  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) updateVisuals(touch.clientX);
  });

  /* ─── DOWNLOAD & PLATFORM SELECTION ─── */
  
  // No secondary logic needed for direct download links.
});
