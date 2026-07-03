/* ============================================================
   FIRST BATCH — app.js (v2, multi-page)
   Handles: nav, modal, form validation, Google Sheets CSV fetch,
   CM table render, filters, localStorage unlock, intake form.
   ============================================================ */

/* ── CONFIG ─────────────────────────────────────────────────── */
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQjWC69O9Cdw3P5aFKhPaYgn0ln07MwChClXEha4ny_FbwX1iCpT4RE_GY6rAEWfaBAsijDdeh_ePlU/pub?gid=686969694&single=true&output=csv';
const UNLOCK_KEY = 'fnb_upstream_unlocked'; // kept from v1 so existing unlocks carry over

const activeFilters = { type: new Set(), state: new Set(), category: new Set() };
let allRows = [];


/* ── NAV (mobile) ───────────────────────────────────────────── */
function toggleNav() {
  const links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}


/* ── MODAL ──────────────────────────────────────────────────── */
function openModal() {
  const m = document.getElementById('modal');
  if (!m) return;
  m.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  const m = document.getElementById('modal');
  if (!m) return;
  m.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});


/* ── VALIDATION ─────────────────────────────────────────────── */
function validateName(v)    { return (!v || v.trim().length < 2) ? 'Please enter your name.' : null; }
function validateCompany(v) { return (!v || v.trim().length < 2) ? 'Please enter your brand or company name.' : null; }
function validateLinkedIn(v){ if (!v || !v.trim()) return 'Please enter your LinkedIn URL.'; if (!/linkedin\.com\/(in|company)\//i.test(v)) return 'Enter a valid LinkedIn profile URL.'; return null; }
function validateContact(v) { const d = (v || '').replace(/\D/g,''); if (!d) return 'Please enter your WhatsApp number.'; if (d.length === 12 && d.startsWith('91')) return null; if (d.length === 10) return null; return 'Enter a valid 10-digit number.'; }

function showFieldError(input, el, msg) { input.classList.add('has-error'); el.textContent = msg; el.classList.add('show'); }
function clearFieldError(input, el)    { input.classList.remove('has-error'); el.classList.remove('show'); }


/* ── UNLOCK ─────────────────────────────────────────────────── */
function unlockTable() {
  try { localStorage.setItem(UNLOCK_KEY, '1'); } catch(e) {}
  const wrap = document.getElementById('table-wrap');
  const overlay = document.getElementById('lock-overlay');
  if (wrap) wrap.classList.remove('table-locked');
  if (overlay) overlay.classList.add('hidden');
}
function isUnlocked() { try { return localStorage.getItem(UNLOCK_KEY) === '1'; } catch(e) { return false; } }


/* ── SUBMIT ─────────────────────────────────────────────────── */
function saveLocally(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('fnb_upstream_leads') || '[]');
    existing.push({ ...data, savedAt: Date.now() });
    localStorage.setItem('fnb_upstream_leads', JSON.stringify(existing));
  } catch(e) {}
}

async function submitLead(payload) {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Submit error ${res.status}`);
  return true;
}

function showSuccess(formEl, msg) {
  formEl.style.display = 'none';
  const div = document.createElement('div');
  div.className = 'success-state';
  div.innerHTML = `<div class="success-check">✓</div><h4>You're in.</h4><p>${msg}</p>`;
  formEl.parentElement.appendChild(div);
}

function collectAndValidate(formEl, names) {
  const f = n => formEl.querySelector(`[name="${n}"]`);
  const er = n => formEl.querySelector(`[data-error="${n}"]`);
  const validators = { name: validateName, company: validateCompany, linkedin: validateLinkedIn, contact: validateContact };
  let hasError = false;
  const values = {};
  names.forEach(n => {
    const input = f(n), errEl = er(n);
    const err = validators[n] ? validators[n](input.value) : null;
    if (err) { showFieldError(input, errEl, err); hasError = true; }
    else if (errEl) clearFieldError(input, errEl);
    values[n] = input.value;
  });
  return hasError ? null : values;
}

function getHp(formEl) {
  const el = formEl.querySelector('[name="website"]');
  return el ? el.value : '';
}

function toPayloadFields(v) {
  const digits  = v.contact.replace(/\D/g,'');
  const contact = digits.length === 12 ? digits.slice(2) : digits;
  return {
    Name: v.name.trim(),
    Company: v.company.trim(),
    LinkedIn: v.linkedin.trim(),
    Contact: contact,
    Timestamp: new Date().toISOString()
  };
}

/* Network page — unlock form */
async function handleSubmit(e, formEl) {
  e.preventDefault();
  const v = collectAndValidate(formEl, ['name', 'company', 'linkedin', 'contact']);
  if (!v) return;

  const fields = toPayloadFields(v);
  const notes = ((formEl.querySelector('[name="notes"]') || {}).value || '').trim();
  const brief = notes ? { Notes: notes } : undefined;

  const btn = formEl.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Unlocking…';

  saveLocally(notes ? { ...fields, Notes: notes } : fields);
  unlockTable();
  showSuccess(formEl, 'The list is now unlocked below.');
  setTimeout(closeModal, 2200);
  submitLead({ fields, brief, hp: getHp(formEl) }).catch(err => console.warn('[First Batch] Backend submission failed. Lead saved locally.', err));
}

/* Partners page — join form */
async function handlePartner(e, formEl) {
  e.preventDefault();
  const v = collectAndValidate(formEl, ['name', 'company', 'contact']);
  if (!v) return;

  const fields = toPayloadFields({ ...v, linkedin: '' });
  delete fields.LinkedIn;
  const g = n => ((formEl.querySelector(`[name="${n}"]`) || {}).value || '').trim();
  const brief = {
    Type: 'Partner application',
    Makes: g('make'),
    Certifications: g('certs'),
    Minimums: g('moq')
  };

  const btn = formEl.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  saveLocally({ ...fields, ...brief });
  showSuccess(formEl, "We'll be in touch on WhatsApp.");
  submitLead({ fields, brief, hp: getHp(formEl) }).catch(err => console.warn('[First Batch] Backend submission failed. Application saved locally.', err));
}

/* Start page — intake form */
async function handleIntake(e, formEl) {
  e.preventDefault();
  const v = collectAndValidate(formEl, ['name', 'company', 'linkedin', 'contact']);
  if (!v) return;

  const fields = toPayloadFields(v);
  const brief = {
    Category: (formEl.querySelector('[name="category"]') || {}).value || '',
    Stage:    (formEl.querySelector('[name="stage"]') || {}).value || '',
    Stuck:    (formEl.querySelector('[name="stuck"]') || {}).value || ''
  };

  const btn = formEl.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  saveLocally({ ...fields, ...brief });
  unlockTable(); // filling the brief also unlocks the network
  showSuccess(formEl, "We read every brief. If there's a fit, you'll hear from us on WhatsApp within a couple of days.");
  submitLead({ fields, brief, hp: getHp(formEl) }).catch(err => console.warn('[First Batch] Backend submission failed. Brief saved locally.', err));
}


/* ── CSV PARSE ──────────────────────────────────────────────── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = [];
    let inQuote = false, current = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { values.push(current.trim()); current = ''; continue; }
      current += ch;
    }
    values.push(current.trim());
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] !== undefined ? values[i] : ''; });
    return row;
  });
}


/* ── FILTERS ────────────────────────────────────────────────── */
function buildFilterPanels(rows) {
  const types      = [...new Set(rows.map(r => r['Type']).filter(Boolean))].sort();
  const states     = [...new Set(rows.map(r => r['State']).filter(Boolean))].sort();
  const categories = [...new Set(rows.flatMap(r => (r['Categories'] || '').split(';').map(s => s.trim()).filter(Boolean)))].sort();

  buildPanel('type',     types,      'panel-type');
  buildPanel('state',    states,     'panel-state');
  buildPanel('category', categories, 'panel-category');
}

function buildPanel(dimension, values, panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.innerHTML = values.map(v => `
    <div class="filter-item" data-dim="${dimension}" data-val="${v}" onclick="toggleFilterItem(this, '${dimension}', '${v}')">
      <div class="filter-checkbox"></div>${v}
    </div>`).join('');
}

function toggleFilterItem(el, dimension, value) {
  const set = activeFilters[dimension];
  if (set.has(value)) { set.delete(value); el.classList.remove('selected'); }
  else                { set.add(value);    el.classList.add('selected'); }
  updateFilterButton(dimension);
  applyFilters();
}

function updateFilterButton(dimension) {
  const panelMap = { type: 'btn-type', state: 'btn-state', category: 'btn-category' };
  const labelMap = { type: 'Type', state: 'State', category: 'Categories' };
  const btn = document.getElementById(panelMap[dimension]);
  if (!btn) return;
  const count = activeFilters[dimension].size;
  const badge = count > 0 ? `<span class="filter-badge">${count}</span>` : '';
  btn.innerHTML = `${labelMap[dimension]} ${badge}<span class="fchev">▾</span>`;
  if (count > 0) btn.classList.add('active'); else btn.classList.remove('active');
}

function applyFilters() {
  const { type, state, category } = activeFilters;
  let rows = allRows;
  if (type.size)     rows = rows.filter(r => type.has(r['Type']));
  if (state.size)    rows = rows.filter(r => state.has(r['State']));
  if (category.size) rows = rows.filter(r => {
    const cats = (r['Categories'] || '').split(';').map(s => s.trim());
    return cats.some(c => category.has(c));
  });
  renderTable(rows);
  const cntEl = document.getElementById('cm-count-label');
  if (cntEl) cntEl.textContent = `${rows.length} of ${allRows.length}`;
}

function toggleFilter(dimension) {
  const panelMap = { type: 'panel-type', state: 'panel-state', category: 'panel-category' };
  const all = ['panel-type', 'panel-state', 'panel-category'];
  const target = panelMap[dimension];
  const panel = document.getElementById(target);
  const isOpen = panel && panel.classList.contains('open');
  all.forEach(id => { const p = document.getElementById(id); if (p) p.classList.remove('open'); });
  if (!isOpen && panel) panel.classList.add('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.filter-dropdown')) {
    ['panel-type','panel-state','panel-category'].forEach(id => {
      const p = document.getElementById(id);
      if (p) p.classList.remove('open');
    });
  }
});


/* ── TABLE RENDER ───────────────────────────────────────────── */
function renderBadges(text, isCert) {
  if (!text || text === '—') return '—';
  return text.split(';').map(s => s.trim()).filter(Boolean)
    .map(s => `<span class="badge${isCert ? ' cert' : ''}">${s}</span>`).join('');
}

function renderWebsite(url) {
  if (!url || url === '—') return '—';
  const href = url.startsWith('http') ? url : `https://${url}`;
  return `<a href="${href}" target="_blank" rel="noopener">${url.replace(/^https?:\/\//,'')}</a>`;
}

function renderTable(rows) {
  const tbody   = document.getElementById('cm-tbody');
  const table   = document.getElementById('cm-table');
  const loading = document.getElementById('table-loading');
  if (!tbody || !table) return;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--muted)">No matches — try adjusting your filters.</td></tr>`;
    if (loading) loading.style.display = 'none';
    table.style.display = '';
    return;
  }

  tbody.innerHTML = rows.map(row => {
    const location = [row['City'], row['State']].filter(Boolean).join(', ') || '—';
    const typeText = row['Type'] || '—';
    return `<tr>
      <td class="td-name">${row['Name'] || '—'}</td>
      <td><span class="badge type">${typeText}</span></td>
      <td class="td-location">${location}</td>
      <td>${renderBadges(row['Categories'], false)}</td>
      <td>${renderBadges(row['Formats'], false)}</td>
      <td>${renderBadges(row['Certifications'], true)}</td>
      <td class="td-website">${renderWebsite(row['Website'])}</td>
      <td style="font-size:12px;color:var(--muted)">${row['Notes'] || '—'}</td>
    </tr>`;
  }).join('');

  if (loading) loading.style.display = 'none';
  table.style.display = '';
}

function updateStats(rows) {
  const states = new Set(rows.map(r => r['State']).filter(Boolean));
  const categories = new Set();
  rows.forEach(r => (r['Categories'] || '').split(';').map(s => s.trim()).filter(Boolean).forEach(c => categories.add(c)));
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-cms',    rows.length);
  set('stat-states', states.size);
  set('stat-cats',   categories.size);
  set('cm-count-label', `${rows.length} entries`);
}


/* ── LOAD ───────────────────────────────────────────────────── */
async function loadCMs() {
  const loading = document.getElementById('table-loading');
  if (!document.getElementById('cm-table')) return; // not on network page
  try {
    const res = await fetch(SHEETS_CSV_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    allRows = parseCSV(text);
    buildFilterPanels(allRows);
    renderTable(allRows);
    updateStats(allRows);
  } catch(err) {
    console.error('[First Batch] Failed to load data:', err);
    if (loading) loading.textContent = 'Could not load data. Please try refreshing.';
  }
}


/* ── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ['access-form', 'intake-form', 'partner-form'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('input', () => {
        const errorEl = form.querySelector(`[data-error="${input.name}"]`);
        if (errorEl) clearFieldError(input, errorEl);
      });
    });
  });

  loadCMs();
  if (isUnlocked()) unlockTable();
});
