/* ============================================================
   FIRST BATCH — app.js (v2, multi-page)
   Handles: nav, modal, form validation, Google Sheets CSV fetch,
   CM table render, filters, localStorage unlock, intake form.
   ============================================================ */

/* ── CONFIG ─────────────────────────────────────────────────── */
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1VGj4tOvJQqqMLbx6GNNrAr4mB4jzSwlYAaAL7vrsIXo/export?format=csv';
const UNLOCK_KEY = 'fnb_upstream_unlocked'; // kept from v1 so existing unlocks carry over

// Sheet header names vary in case (NAME, Name, etc.) — map them case-insensitively
// onto the field names the rest of this file expects.
const HEADER_MAP = {
  name: 'Name', type: 'Type', location: 'Location', state: 'State',
  categories: 'Categories', certifications: 'Certifications',
  email: 'Email', phone: 'Phone', website: 'Website', notes: 'Notes'
};
// Sheets use these as literal placeholder text for "no data" — treat as blank.
function isBlankValue(v) {
  const t = (v || '').trim();
  return t === '' || t === '-' || /^n\/?a$/i.test(t);
}
function splitMulti(text) {
  return (text || '').split(/[,;]/).map(s => s.trim()).filter(Boolean);
}
// Categories is inconsistent across rows: some use "|" as the real separator
// (in which case commas are just punctuation inside a single category, e.g.
// "Fruit, Seeds, Nuts & Peanuts"), others only ever used commas. Prefer "|"
// when present so those phrases don't get shredded.
function splitCategories(text) {
  if (!text) return [];
  if (text.includes('|')) return text.split('|').map(s => s.trim()).filter(Boolean);
  return splitMulti(text);
}

// Location is freeform ("City, State", "State-110033", a bare locality, a
// foreign address, etc). Rather than trust whatever's in the last comma
// segment, match against the real list of Indian states/UTs so the State
// filter only ever shows ~36 clean options instead of hundreds of variants.
const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];
const STATE_ALIASES = {
  'jammu & kashmir': 'Jammu and Kashmir', 'j&k': 'Jammu and Kashmir',
  'new delhi': 'Delhi', 'nct of delhi': 'Delhi', 'ncr': 'Delhi',
  'pondicherry': 'Puducherry',
  'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'orissa': 'Odisha', 'uttaranchal': 'Uttarakhand'
};
const STATE_LOOKUP = {};
INDIA_STATES.forEach(s => { STATE_LOOKUP[s.toLowerCase()] = s; });
Object.entries(STATE_ALIASES).forEach(([k, v]) => { STATE_LOOKUP[k] = v; });

function deriveState(location) {
  if (!location) return '';
  const parts = location.split(',').map(s => s.trim()).filter(Boolean);
  const candidate = parts.length ? parts[parts.length - 1] : location.trim();
  const cleaned = candidate.replace(/[-\s]*\d{5,6}\s*$/, '').trim(); // drop trailing pincode
  return STATE_LOOKUP[cleaned.toLowerCase()] || '';
}

const activeFilters = { type: new Set(), state: new Set() };
let allRows = [];
let filteredRows = [];
let searchQuery = '';
let currentPage = 1;
const PAGE_SIZE = 50;


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
function validateEmail(v)   { if (!v || !v.trim()) return null; return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Enter a valid email address.'; }

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
  const validators = { name: validateName, company: validateCompany, linkedin: validateLinkedIn, contact: validateContact, email: validateEmail };
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
  const fields = {
    Name: v.name.trim(),
    Company: v.company.trim(),
    LinkedIn: v.linkedin.trim(),
    Contact: contact,
    Timestamp: new Date().toISOString()
  };
  if (v.email && v.email.trim()) fields.Email = v.email.trim();
  return fields;
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
  const v = collectAndValidate(formEl, ['name', 'company', 'linkedin', 'contact']);
  if (!v) return;

  // Partner type is required so we route + label the lead correctly.
  const typeEl = formEl.querySelector('[name="type"]');
  const typeErr = formEl.querySelector('[data-error="type"]');
  if (typeEl && !typeEl.value) {
    if (typeErr) showFieldError(typeEl, typeErr, 'Please pick what kind of partner you are');
    return;
  }
  if (typeEl && typeErr) clearFieldError(typeEl, typeErr);

  const fields = toPayloadFields(v);
  const g = n => ((formEl.querySelector(`[name="${n}"]`) || {}).value || '').trim();
  const brief = {
    Type: 'Partner application',   // routing signal for /api/submit
    PartnerType: g('type'),        // the actual partner subtype
    Email: g('email'),
    Categories: g('categories'),
    Makes: g('make'),
    Certifications: g('certs'),
    Minimums: g('moq'),
    Specialties: g('specialties'),
    Experience: g('experience'),
    Engagement: g('engagement'),
    Stages: g('stages'),
    Portfolio: g('portfolio')
  };

  const btn = formEl.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  saveLocally({ ...fields, ...brief });
  showSuccess(formEl, "We'll be in touch on WhatsApp.");
  submitLead({ fields, brief, hp: getHp(formEl) }).catch(err => console.warn('[First Batch] Backend submission failed. Application saved locally.', err));
}

/* Partners page — show the right fields for the selected partner type */
const PARTNER_TYPE_KEY = {
  'Contract manufacturer': 'cm',
  'Ingredient supplier': 'supplier',
  'Food technologist / R&D': 'tech',
  'Testing lab': 'lab',
  'Other': 'other'
};
const PARTNER_MAKE_LABEL = {
  cm: 'What do you make?',
  supplier: 'What do you supply?',
  lab: 'What tests do you offer?',
  other: 'What do you offer?'
};
function updatePartnerForm() {
  const form = document.getElementById('partner-form');
  if (!form) return;
  const sel = form.querySelector('[name="type"]');
  const key = PARTNER_TYPE_KEY[sel ? sel.value : ''] || '';
  form.querySelectorAll('[data-show]').forEach(el => {
    const types = el.getAttribute('data-show').split(/\s+/);
    el.style.display = (key && types.indexOf(key) !== -1) ? '' : 'none';
  });
  const makeLabel = form.querySelector('label[for="pf-make"]');
  if (makeLabel && PARTNER_MAKE_LABEL[key]) makeLabel.textContent = PARTNER_MAKE_LABEL[key];
}
function initPartnerForm() {
  const form = document.getElementById('partner-form');
  if (!form) return;
  const sel = form.querySelector('[name="type"]');
  const role = (new URLSearchParams(location.search).get('role') || '').toLowerCase();
  const ROLE_MAP = {
    technologist: 'Food technologist / R&D', tech: 'Food technologist / R&D',
    rnd: 'Food technologist / R&D', 'r&d': 'Food technologist / R&D', npd: 'Food technologist / R&D',
    manufacturer: 'Contract manufacturer', cm: 'Contract manufacturer',
    supplier: 'Ingredient supplier', ingredient: 'Ingredient supplier',
    lab: 'Testing lab', testing: 'Testing lab'
  };
  if (role && ROLE_MAP[role] && sel) sel.value = ROLE_MAP[role];
  updatePartnerForm();
}

/* Start page — intake form */
async function handleIntake(e, formEl) {
  e.preventDefault();
  const v = collectAndValidate(formEl, ['name', 'company', 'linkedin', 'contact', 'email']);
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
// Character-level parser (not line-split) so quoted commas, escaped ""
// quotes, and notes containing literal line breaks all survive intact.
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field); field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => {
    const key = h.trim().toLowerCase();
    return HEADER_MAP[key] || h.trim();
  });
  return rows.slice(1)
    .filter(cells => cells.some(v => v.trim() !== ''))
    .map(cells => {
      const obj = {};
      headers.forEach((h, i) => {
        const raw = (cells[i] !== undefined ? cells[i] : '').trim();
        obj[h] = isBlankValue(raw) ? '' : raw;
      });
      obj.State = deriveState(obj.Location);
      return obj;
    });
}


/* ── FILTERS ────────────────────────────────────────────────── */
function buildFilterPanels(rows) {
  const types  = [...new Set(rows.flatMap(r => splitMulti(r['Type'])))].sort();
  const states = [...new Set(rows.map(r => r['State']).filter(Boolean))].sort();

  buildPanel('type',  types,  'panel-type');
  buildPanel('state', states, 'panel-state');
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
  const panelMap = { type: 'btn-type', state: 'btn-state' };
  const labelMap = { type: 'Type', state: 'State' };
  const btn = document.getElementById(panelMap[dimension]);
  if (!btn) return;
  const count = activeFilters[dimension].size;
  const badge = count > 0 ? `<span class="filter-badge">${count}</span>` : '';
  btn.innerHTML = `${labelMap[dimension]} ${badge}<span class="fchev">▾</span>`;
  if (count > 0) btn.classList.add('active'); else btn.classList.remove('active');
}

function matchesSearch(row, q) {
  if (!q) return true;
  const haystack = [row['Name'], row['Type'], row['Location'], row['Categories'], row['Certifications']]
    .join(' ').toLowerCase();
  return haystack.includes(q);
}

function applyFilters() {
  const { type, state } = activeFilters;
  let rows = allRows;
  if (type.size)  rows = rows.filter(r => splitMulti(r['Type']).some(t => type.has(t)));
  if (state.size) rows = rows.filter(r => state.has(r['State']));
  if (searchQuery) rows = rows.filter(r => matchesSearch(r, searchQuery));
  filteredRows = rows;
  currentPage = 1;
  renderPage();

  const clearBtn = document.getElementById('clear-filters-btn');
  if (clearBtn) {
    const hasActive = type.size || state.size || searchQuery;
    clearBtn.classList.toggle('hidden', !hasActive);
  }
}

function clearFilters() {
  activeFilters.type.clear();
  activeFilters.state.clear();
  searchQuery = '';
  const searchInput = document.getElementById('cm-search');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-item.selected').forEach(el => el.classList.remove('selected'));
  updateFilterButton('type');
  updateFilterButton('state');
  applyFilters();
}

let searchDebounce;
function handleSearch(value) {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = value.trim().toLowerCase();
    applyFilters();
  }, 150);
}

function renderPage() {
  const start = (currentPage - 1) * PAGE_SIZE;
  renderTable(filteredRows.slice(start, start + PAGE_SIZE));
  renderPagination();
  const cntEl = document.getElementById('cm-count-label');
  if (cntEl) cntEl.textContent = `${filteredRows.length} of ${allRows.length}`;
}

function renderPagination() {
  const el = document.getElementById('cm-pagination');
  if (!el) return;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">← Prev</button>
    <span class="page-info">Page ${currentPage} of ${totalPages}</span>
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Next →</button>
  `;
}

function goToPage(p) {
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  currentPage = Math.min(Math.max(1, p), totalPages);
  renderPage();
  const wrap = document.getElementById('table-wrap');
  if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleFilter(dimension) {
  const panelMap = { type: 'panel-type', state: 'panel-state' };
  const all = ['panel-type', 'panel-state'];
  const target = panelMap[dimension];
  const panel = document.getElementById(target);
  const isOpen = panel && panel.classList.contains('open');
  all.forEach(id => { const p = document.getElementById(id); if (p) p.classList.remove('open'); });
  if (!isOpen && panel) panel.classList.add('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.filter-dropdown')) {
    ['panel-type','panel-state'].forEach(id => {
      const p = document.getElementById(id);
      if (p) p.classList.remove('open');
    });
  }
});


/* ── TABLE RENDER ───────────────────────────────────────────── */
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderBadges(text, isCert, maxVisible, splitter = splitMulti) {
  if (!text) return '—';
  const values = splitter(text);
  if (!values.length) return '—';
  const shown = maxVisible ? values.slice(0, maxVisible) : values;
  const rest = maxVisible ? values.slice(maxVisible) : [];
  let html = shown.map(s => `<span class="badge${isCert ? ' cert' : ''}">${s}</span>`).join('');
  if (rest.length) {
    html += `<span class="badge more" role="button" tabindex="0">+${rest.length} more</span>`;
  }
  return html;
}

// Click "+N more" to swap the truncated cell for the full category list.
document.addEventListener('click', e => {
  const moreBtn = e.target.closest('.badge.more');
  if (!moreBtn) return;
  const td = moreBtn.closest('.td-categories');
  if (!td) return;
  td.innerHTML = renderBadges(td.dataset.cats, false, null, splitCategories);
});

function renderWebsite(url) {
  if (!url || url === '—') return '—';
  const href = url.startsWith('http') ? url : `https://${url}`;
  return `<a href="${href}" target="_blank" rel="noopener">${url.replace(/^https?:\/\//,'')}</a>`;
}

function renderEmail(email) {
  if (!email) return '—';
  return `<a href="mailto:${email}">${email}</a>`;
}

function renderPhone(phone) {
  if (!phone) return '—';
  const digits = phone.replace(/[^\d+]/g, '');
  return `<a href="tel:${digits}">${phone}</a>`;
}

function renderTable(rows) {
  const tbody   = document.getElementById('cm-tbody');
  const table   = document.getElementById('cm-table');
  const loading = document.getElementById('table-loading');
  if (!tbody || !table) return;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--muted)">No matches — try adjusting your filters or search.</td></tr>`;
    if (loading) loading.style.display = 'none';
    table.style.display = '';
    return;
  }

  tbody.innerHTML = rows.map(row => {
    const types = splitMulti(row['Type']);
    const typeHtml = types.length
      ? types.map(t => `<span class="badge type">${t}</span>`).join('')
      : '—';
    return `<tr>
      <td class="td-name">${row['Name'] || '—'}</td>
      <td>${typeHtml}</td>
      <td class="td-location">${row['Location'] || '—'}</td>
      <td class="td-categories" data-cats="${escapeAttr(row['Categories'] || '')}">${renderBadges(row['Categories'], false, 3, splitCategories)}</td>
      <td>${renderBadges(row['Certifications'], true)}</td>
      <td>${renderEmail(row['Email'])}</td>
      <td>${renderPhone(row['Phone'])}</td>
      <td class="td-website">${renderWebsite(row['Website'])}</td>
      <td style="font-size:12px;color:var(--muted)">${row['Notes'] || '—'}</td>
    </tr>`;
  }).join('');

  if (loading) loading.style.display = 'none';
  table.style.display = '';
}

// Counts an element's number up from whatever it currently shows to `target`,
// preserving any non-numeric suffix (e.g. "2600+" counts up, keeping the "+").
function animateStatNum(el, target, duration = 1200) {
  if (!el) return;
  const targetMatch = String(target).match(/^(\d+)(\D*)$/);
  const endNum = targetMatch ? parseInt(targetMatch[1], 10) : (parseInt(target, 10) || 0);
  const suffix = targetMatch ? targetMatch[2] : '';
  const startNum = parseInt((el.textContent || '').match(/^(\d+)/)?.[1] || '0', 10);
  // rAF never fires on a hidden/background tab — jump straight to the final
  // value so a backgrounded tab can't get stuck showing 0.
  if (startNum === endNum || document.hidden) { el.textContent = endNum + suffix; return; }

  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startNum + (endNum - startNum) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = endNum + suffix;
  }
  requestAnimationFrame(tick);
}

// Counts every stat up from 0 the moment the hero renders, using whatever
// static number is already baked into the HTML as the target.
function animateStatsOnLoad() {
  document.querySelectorAll('.stats-band .stat-num').forEach(el => {
    const target = el.textContent.trim();
    el.textContent = '0';
    animateStatNum(el, target, 1400);
  });
}

function updateStats(rows) {
  const states = new Set(rows.map(r => r['State']).filter(Boolean));
  const categories = new Set();
  rows.forEach(r => splitCategories(r['Categories']).forEach(c => categories.add(c)));
  const labs = rows.filter(r => splitMulti(r['Type']).some(t => /lab/i.test(t))).length;
  const set = (id, val) => { const el = document.getElementById(id); if (el) animateStatNum(el, val, 700); };
  set('stat-cms',    rows.length);
  set('stat-states', states.size);
  set('stat-cats',   categories.size);
  set('stat-labs',   labs);
}


/* ── LOAD ───────────────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Transient network errors (dropped QUIC connections, brief DNS hiccups,
// etc.) are common when fetching an external host on every page load — a
// single failed attempt shouldn't surface as "the site is broken."
async function fetchCSVWithRetry(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await sleep(600 * (i + 1)); // back off: 600ms, 1200ms
    }
  }
  throw lastErr;
}

async function loadCMs() {
  const loading = document.getElementById('table-loading');
  if (!document.getElementById('cm-table')) return; // not on network page
  try {
    const text = await fetchCSVWithRetry(SHEETS_CSV_URL);
    allRows = parseCSV(text);
    filteredRows = allRows;
    buildFilterPanels(allRows);
    renderPage();
    updateStats(allRows);
  } catch(err) {
    console.error('[First Batch] Failed to load data:', err);
    if (loading) {
      loading.innerHTML = 'Could not load data. <button class="link-btn" onclick="loadCMs()">Try again</button>';
    }
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

  initPartnerForm();
  animateStatsOnLoad();
  loadCMs();
  if (isUnlocked()) unlockTable();
});
