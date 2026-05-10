const slides    = document.querySelectorAll('.slide');
const total     = slides.length;
let current     = 0;
let started     = false;
let activeAudio = null;
let fallbackTimer = null;

// ── DOTS ──
const dotsEl = document.getElementById('dots');
slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => { if (started) goTo(i); };
  dotsEl.appendChild(d);
});

// ── NAVIGATE ──
function goTo(idx) {
  if (idx < 0 || idx >= total) return;

  // Limpa estado anterior
  clearTimeout(fallbackTimer);
  if (activeAudio) { activeAudio.pause(); activeAudio = null; }

  // Pausa vídeo de saída
  const outVid = slides[current].querySelector('.slide-video');
  if (outVid) { outVid.pause(); outVid.currentTime = 0; }

  slides[current].classList.remove('active');
  current = idx;
  slides[current].classList.add('active');

  // Atualiza chrome
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  document.getElementById('counter').textContent = (current + 1) + ' / ' + total;
  document.getElementById('progressFill').style.width = ((current + 1) / total * 100) + '%';
  document.getElementById('slideNum').textContent = 'SLIDE ' + (current + 1);

  triggerAnimations(current);
  scheduleAdvance(current);
}

function nextSlide() { if (current < total - 1) goTo(current + 1); }
function prevSlide() { goTo(current - 1); }

// ── ADVANCE LOGIC ──
function scheduleAdvance(idx) {
  const slide    = slides[idx];
  const audioSrc = slide.dataset.audio;
  const dur      = parseInt(slide.dataset.duration) || 0;

  if (slide.classList.contains('instagram-slide')) {
    // Slide 12 — vídeo Instagram COM SOM
    const vid = slide.querySelector('.slide-video');
    if (vid) {
      vid.muted = false;
      vid.currentTime = 0;
      vid.play().catch(() => {});
      vid.onended = () => { if (current === idx) goTo(idx + 1); };
    }
    if (dur > 0) fallbackTimer = setTimeout(() => { if (current === idx) goTo(idx + 1); }, dur * 1000);

  } else if (audioSrc) {
    // Slide com narração — avança quando áudio termina
    const a = new Audio('audio/' + audioSrc);
    activeAudio = a;
    a.play().catch(() => {});
    a.onended = () => { if (current === idx) goTo(idx + 1); };
    // Fallback: avança se áudio falhar/demorar mais que data-duration
    if (dur > 0) fallbackTimer = setTimeout(() => { if (current === idx) goTo(idx + 1); }, dur * 1000);

    // Inicia vídeo de fundo (mudo)
    const vid = slide.querySelector('.slide-video');
    if (vid) vid.play().catch(() => {});

  } else if (dur > 0) {
    // Slide apenas por timer
    const fill = document.getElementById('timerFill');
    fill.style.transition = 'none'; fill.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fill.style.transition = `width ${dur * 1000}ms linear`;
      fill.style.width = '100%';
    }));
    if (idx < total - 1) {
      fallbackTimer = setTimeout(() => { if (current === idx) goTo(idx + 1); }, dur * 1000);
    }

    // Inicia vídeo de fundo (mudo)
    const vid = slide.querySelector('.slide-video');
    if (vid) vid.play().catch(() => {});
  }
}

// ── SLIDE ANIMATIONS ──
function triggerAnimations(idx) {
  const s = slides[idx];
  s.querySelectorAll('.bar-fill').forEach(b => {
    b.style.width = '0';
    setTimeout(() => { b.style.width = b.dataset.pct + '%'; }, 350);
  });
  s.querySelectorAll('[data-target]').forEach(el => {
    el.textContent = '0'; animateCount(el);
  });
  if (s.querySelector('#liveNum')) updateLive();
}

function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const t0 = Date.now();
  (function tick() {
    const p = Math.min((Date.now() - t0) / 1800, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target).toLocaleString('pt-BR');
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.classList.add('num-pulsed');
      el.addEventListener('animationend', () => el.classList.remove('num-pulsed'), { once: true });
    }
  })();
}

function updateLive() {
  const el = document.getElementById('liveNum');
  if (!el) return;
  const days = (Date.now() - new Date('2026-01-01').getTime()) / 86400000;
  el.dataset.target = Math.floor(days * 4.3);
  animateCount(el);
}

// ── PETALS ──
function initPetals() {
  const wrap = document.getElementById('petalsWrap');
  if (!wrap) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const w = 7 + Math.random() * 11;
    p.style.cssText = `
      left:${Math.random() * 102}vw;
      width:${w}px; height:${w * 1.55}px;
      opacity:${0.45 + Math.random() * 0.55};
      animation-duration:${3.5 + Math.random() * 5}s;
      animation-delay:${-Math.random() * 9}s;
      border-radius:${40 + Math.random()*20}% ${20+Math.random()*20}% ${40+Math.random()*20}% ${20+Math.random()*20}%;
      transform:rotate(${Math.random()*360}deg);
    `;
    wrap.appendChild(p);
  }
}

// ── START ──
function startPresentation() {
  const overlay = document.getElementById('startOverlay');
  overlay.classList.add('hidden');
  setTimeout(() => overlay.remove(), 700);
  started = true;
  triggerAnimations(0);
  scheduleAdvance(0);
}

// ── KEYBOARD ──
document.addEventListener('keydown', e => {
  if (!started) {
    if (e.key === 'Enter') startPresentation();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); prevSlide(); }
});

// ── INIT ──
window.addEventListener('load', () => {
  initPetals();
  // Pré-carrega primeiro vídeo (mudo, não inicia)
  const v0 = slides[0].querySelector('.slide-video');
  if (v0) v0.load();
});
