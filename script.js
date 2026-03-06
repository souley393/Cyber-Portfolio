/* ============================================================
   Souleymane Bamba — Portfolio Script
   - Canvas background: floating data particles
   - Checklist with localStorage persistence
   - Mobile menu
   - Copy bio
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---- CANVAS BACKGROUND ---- */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 55;
  const CHARS = ['0', '1', 'FF', 'ACK', 'SYN', '4624', '0x', 'RST', 'TCP', 'UDP', '443', '80', 'ARP'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vy: 0.18 + Math.random() * 0.32,
      vx: (Math.random() - 0.5) * 0.12,
      alpha: 0.08 + Math.random() * 0.18,
      size: 9 + Math.random() * 5,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      color: Math.random() > 0.6 ? '#00ff9d' : '#00d4ff',
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px 'Share Tech Mono', monospace`;
      ctx.fillText(p.char, p.x, p.y);

      p.y += p.vy;
      p.x += p.vx;
      if (p.y > H + 20) { Object.assign(p, makeParticle(), { y: -10 }); }
      if (p.x < -30 || p.x > W + 30) { Object.assign(p, makeParticle()); }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

/* ---- CHECKLIST / LOCALSTORAGE ---- */
function storageKey(group, key) {
  return `sb_portfolio_${group}_${key}`;
}

function loadChecklist() {
  $$('.checklist').forEach(groupEl => {
    const group = groupEl.dataset.group;
    groupEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      const saved = localStorage.getItem(storageKey(group, cb.dataset.key));
      if (saved === '1') cb.checked = true;

      cb.addEventListener('change', () => {
        localStorage.setItem(storageKey(group, cb.dataset.key), cb.checked ? '1' : '0');
        updateProgress();
      });
    });
  });
}

function calcProgress(groupName) {
  const groupEl = document.querySelector(`.checklist[data-group="${groupName}"]`);
  if (!groupEl) return { pct: 0, done: 0, total: 0 };
  const boxes = Array.from(groupEl.querySelectorAll("input[type='checkbox']"));
  const total = boxes.length;
  const done  = boxes.filter(b => b.checked).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
  return { pct, done, total };
}

function updateProgress() {
  const cert   = calcProgress('certs');
  const weekly = calcProgress('weekly');

  $('#certProgressText').textContent   = `${cert.pct}%`;
  $('#certProgressBar').style.width    = `${cert.pct}%`;

  $('#weeklyProgressText').textContent = `${weekly.pct}%`;
  $('#weeklyProgressBar').style.width  = `${weekly.pct}%`;
}

function resetAll() {
  $$('.checklist').forEach(groupEl => {
    const group = groupEl.dataset.group;
    groupEl.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.checked = false;
      localStorage.setItem(storageKey(group, cb.dataset.key), '0');
    });
  });
  updateProgress();
}

/* ---- MOBILE MENU ---- */
function setupMobileMenu() {
  const btn    = $('#menuBtn');
  const mobile = $('#mobileNav');
  if (!btn || !mobile) return;

  btn.addEventListener('click', () => {
    const hidden = mobile.hasAttribute('hidden');
    hidden ? mobile.removeAttribute('hidden') : mobile.setAttribute('hidden', '');
  });

  mobile.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobile.setAttribute('hidden', ''))
  );
}

/* ---- COPY BIO ---- */
async function setupCopyBio() {
  const btn = $('#copyBtn');
  const bio = $('#copyBio');
  const msg = $('#copyMsg');
  if (!btn || !bio || !msg) return;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(bio.textContent.trim());
      msg.textContent = 'Copied!';
      setTimeout(() => (msg.textContent = ''), 1400);
    } catch {
      msg.textContent = 'Select the text and copy manually.';
    }
  });
}

/* ---- SCROLL REVEAL ---- */
function setupScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const cards = $$('.card, .section-head');
  cards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(el => io.observe(el));
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  setupMobileMenu();
  loadChecklist();
  updateProgress();
  setupCopyBio();
  setupScrollReveal();

  const resetBtn = $('#resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetAll);
});
