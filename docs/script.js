const state = {
  items: [],
  filtered: [],
  tags: new Set(),
};

const els = {
  grid: document.getElementById('grid'),
  empty: document.getElementById('emptyState'),
  q: document.getElementById('q'),
  tagFilter: document.getElementById('tagFilter'),
  themeToggle: document.getElementById('themeToggle'),
};

init();

async function init() {
  hydrateTheme();
  await loadItems();
  buildTagFilter();
  applyFilters();
  bindUI();
}

function hydrateTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.classList.add('light');
  if (saved === 'dark') document.documentElement.classList.add('dark');
}

function toggleTheme() {
  const root = document.documentElement;
  if (root.classList.contains('dark')) {
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else if (root.classList.contains('light')) {
    root.classList.remove('light');
    localStorage.setItem('theme', '');
  } else {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

async function loadItems() {
  try {
    const res = await fetch('./items.json', { cache: 'no-store' });
    state.items = await res.json();
    state.items.forEach(it => (it.tags || []).forEach(t => state.tags.add(t)));
  } catch (e) {
    console.error('Failed to load items.json', e);
    state.items = [];
  }
}

function buildTagFilter() {
  const frag = document.createDocumentFragment();
  [...state.tags].sort().forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    frag.appendChild(opt);
  });
  els.tagFilter.appendChild(frag);
}

function bindUI() {
  els.q.addEventListener('input', applyFilters);
  els.tagFilter.addEventListener('change', applyFilters);
  els.themeToggle.addEventListener('click', toggleTheme);
}

function applyFilters() {
  const q = els.q.value.trim().toLowerCase();
  const tag = els.tagFilter.value;

  state.filtered = state.items.filter(it => {
    const qmatch = !q || [it.name, it.brand, it.model, it.notes, ...(it.tags || [])]
      .filter(Boolean)
      .join(' ').toLowerCase().includes(q);
    const tmatch = !tag || (it.tags || []).includes(tag);
    return qmatch && tmatch;
  });

  render();
}

function render() {
  els.grid.innerHTML = '';
  const frag = document.createDocumentFragment();
  state.filtered.forEach(it => frag.appendChild(card(it)));
  els.grid.appendChild(frag);
  els.empty.classList.toggle('hidden', state.filtered.length !== 0);
}

function card(it) {
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="media">
      <img src="${escapeAttr(it.image || 'assets/placeholder.svg')}" alt="${escapeAttr(it.name)}" loading="lazy" />
    </div>
    <div class="body">
      <h2 class="title">${escapeHtml(it.name)}</h2>
      <div class="brand">${escapeHtml([it.brand, it.model].filter(Boolean).join(' · '))}</div>
      ${it.notes ? `<p class="notes">${escapeHtml(it.notes)}</p>` : ''}
      ${Array.isArray(it.tags) && it.tags.length ? `<div class="tags">${it.tags.map(t => `<span class=tag>${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      ${Array.isArray(it.links) && it.links.length ? `<div class="links">${it.links.map(l => link(l)).join('')}</div>` : ''}
    </div>
  `;
  return el;
}

function link(l) {
  const label = escapeHtml(l.label || 'Link');
  const url = escapeAttr(l.url || '#');
  return `<a class="link" href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
}

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(s = '') {
  return String(s).replace(/"/g, '&quot;');
}

