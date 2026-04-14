// =======================================
//  IGNITE Club – main.js  v2.0
// =======================================

// ---- Top Info Bar Clock ----
function updateInfoBar() {
  const now = new Date();
  const dateEl = document.getElementById('info-date');
  const timeEl = document.getElementById('info-time');
  if (dateEl) {
    dateEl.textContent = '📅 ' + now.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }
  if (timeEl) {
    timeEl.textContent = '🕐 ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}

// ---- Hero Frame Slideshow ----
(function initFrameSlideshow() {
  const TOTAL_FRAMES = 192;
  const FRAME_DIR = 'VIDEO FRAMES/';
  const FPS = 25;
  const INTERVAL = Math.round(1000 / FPS);

  const frames = [];
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const num = String(i).padStart(3, '0');
    frames.push(`${FRAME_DIR}ezgif-frame-${num}.jpg`);
  }

  let current = 0;
  const bg = document.getElementById('hero-frame-bg');

  function preloadBatch(start, count) {
    for (let i = start; i < Math.min(start + count, TOTAL_FRAMES); i++) {
      const img = new Image();
      img.src = frames[i];
    }
  }

  function startSlideshow() {
    if (!bg) return;
    bg.style.backgroundImage = `url('${frames[0]}')`;
    preloadBatch(0, 30);
    setInterval(() => {
      current = (current + 1) % TOTAL_FRAMES;
      bg.style.backgroundImage = `url('${frames[current]}')`;
      if (current % 10 === 0) preloadBatch(current + 20, 30);
    }, INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSlideshow);
  } else {
    startSlideshow();
  }
})();

let currentLang = 'en';

// ---- Apply translations ----
function applyLang(lang) {
  const t = translations[lang] || translations.en;
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  renderMembers(t);
  renderSpeakers(t);
  renderMarquee(t);
}

function renderMembers(t) {
  const grid = document.getElementById('members-grid');
  if (!grid) return;
  const members = t.members || translations.en.members;
  grid.innerHTML = members.map(m => {
    const initials = m.name.split(' ').slice(0, 2).map(w => w[0]).join('');
    return `
    <div class="member-card reveal">
      <div class="member-avatar">${initials}</div>
      <div class="member-name">${m.name}</div>
      <div class="member-role">${m.role}</div>
    </div>`;
  }).join('');
  observeReveal();
}

function renderSpeakers(t) {
  const list = document.getElementById('speakers-list');
  if (!list) return;
  const speakers = t.tedx_speakers || translations.en.tedx_speakers;
  list.innerHTML = speakers.map(s => `<li>${s}</li>`).join('');
}

function renderMarquee(t) {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  const news1 = t.news1 || translations.en.news1;
  const news2 = t.news2 || translations.en.news2;
  const items = [news1, news2, news1, news2];
  track.innerHTML = items.map(n => `<span class="marquee-item">${n}</span>`).join('');
}

// ---- DOMContentLoaded ----
document.addEventListener('DOMContentLoaded', () => {
  updateInfoBar();
  setInterval(updateInfoBar, 1000);

  const sel = document.getElementById('lang-select');
  if (sel) {
    sel.value = 'en';
    sel.addEventListener('change', () => applyLang(sel.value));
  }

  applyLang('en');

  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (ham && navLinks) {
    ham.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  observeReveal();
  updateClock();
  setInterval(updateClock, 1000);
  renderCalendar(new Date());
});

// ---- Scroll reveal ----
function observeReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ---- Live Clock (footer) ----
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('live-time');
  const dateEl = document.getElementById('live-date');
  if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ---- Mini Calendar ----
let calDate = new Date();

function renderCalendar(d) {
  const year = d.getFullYear();
  const month = d.getMonth();
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const header = document.getElementById('cal-month');
  if (header) header.textContent = `${monthNames[month]} ${year}`;
  const grid = document.getElementById('cal-grid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    const span = document.createElement('span');
    span.textContent = daysInPrev - i;
    span.classList.add('other-month');
    grid.appendChild(span);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const span = document.createElement('span');
    span.textContent = day;
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      span.classList.add('today');
    }
    grid.appendChild(span);
  }
  const total = firstDay + daysInMonth;
  const remain = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let i = 1; i <= remain; i++) {
    const span = document.createElement('span');
    span.textContent = i;
    span.classList.add('other-month');
    grid.appendChild(span);
  }
}

function calPrev() {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1);
  renderCalendar(calDate);
}
function calNext() {
  calDate = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1);
  renderCalendar(calDate);
}

// Smooth scroll
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
