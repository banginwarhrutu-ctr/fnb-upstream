/* ============================================================
   F&B UPSTREAM — app.js
   Handles: modal, form validation, Google Sheets CSV fetch,
   CM table render, localStorage unlock memory, submission
   ============================================================
   SETUP: Replace the SHEETS_CSV_URL below with the published
   CSV URL from your Google Sheet once it's ready.
   File → Share → Publish to web → choose "CSV" → copy URL
   ============================================================ */

/* ── CONFIG ────────────────────────────────────────────────── */
// Placeholder — replace with your published Google Sheet CSV URL
const SHEETS_CSV_URL = 'YOUR_GOOGLE_SHEETS_CSV_URL_HERE';

// localStorage key — once a user unlocks, we remember it
const UNLOCK_KEY = 'fnb_upstream_unlocked';

// Columns from CSV to display on the table (in order)
// These must match the CSV headers exactly (case-sensitive)
const DISPLAY_COLS = [
  'Name',
  'City',
  'State',
  'Categories',
  'Formats',
  'MOQ',
  'Certifications',
  'Special Equipment',
  'Website'
];

// Columns to render as pill badges
const BADGE_COLS = new Set(['Categories', 'Formats', 'Certifications', 'Special Equipment']);

// Certifications get a green badge; others get grey
const CERT_COL = 'Certifications';


/* ── MODAL ─────────────────────────────────────────────────── */
function openModal() {
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

// Close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});


/* ── FORM VALIDATION ───────────────────────────────────────── */
function validateName(v) {
  if (!v || v.trim().length < 2) return 'Please enter your name.';
  return null;
}

function validateCompany(v) {
  if (!v || v.trim().length < 2) return 'Please enter your brand or company name.';
  return null;
}

function validateLinkedIn(v) {
  if (!v || !v.trim()) return 'Please enter your LinkedIn URL.';
  // Accept with or without https:// and www.
  if (!/linkedin\.com\/(in|company)\//i.test(v)) return 'Enter a valid LinkedIn profile URL.';
  return null;
}

function validateContact(v) {
  const digits = v.replace(/\D/g, '');
  if (!digits) return 'Please enter your WhatsApp number.';
  if (digits.length === 12 && digits.startsWith('91')) return null;
  if (digits.length === 10) return null;
  return 'Enter a valid 10-digit number.';
}

function showFieldError(input, errorEl, msg) {
  input.classList.add('has-error');
  errorEl.textContent = msg;
  errorEl.classList.add('show');
}

function clearFieldError(input, errorEl) {
  input.classList.remove('has-error');
  errorEl.classList.remove('show');
}


/* ── LOCAL STORAGE FAILSAFE ────────────────────────────────── */
function saveLocally(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('fnb_upstream_leads') || '[]');
    existing.push({ ...data, savedAt: Date.now() });
    localStorage.setItem('fnb_upstream_leads', JSON.stringify(existing));
  } catch (e) {}
}


/* ── SUBMIT TO BACKEND ─────────────────────────────────────── */
async function submitLead(data) {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: data })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Submit error ${res.status}: ${err}`);
  }
  return true;
}


/* ── SHOW SUCCESS ──────────────────────────────────────────── */
function showSuccess(formEl) {
  const parent = formEl.parentElement;
  formEl.style.display = 'none';
  const div = document.createElement('div');
  div.className = 'success-state';
  div.innerHTML = `
    <div class="success-check">✓</div>
    <h4>You're in.</h4>
    <p>The database is now unlocked below.</p>
  `;
  parent.appendChild(div);
}


/* ── UNLOCK TABLE ──────────────────────────────────────────── */
function unlockTable() {
  try { localStorage.setItem(UNLOCK_KEY, '1'); } catch (e) {}
  const wrap = document.getElementById('table-wrap');
  const overlay = document.getElementById('lock-overlay');
  if (wrap) wrap.classList.remove('table-locked');
  if (overlay) overlay.classList.add('hidden');
}

function isUnlocked() {
  try { return localStorage.getItem(UNLOCK_KEY) === '1'; } catch (e) { return false; }
}


/* ── MAIN SUBMIT HANDLER ───────────────────────────────────── */
async function handleSubmit(e, formEl) {
  e.preventDefault();

  const nameInput    = formEl.querySelector('[name="name"]');
  const companyInput = formEl.querySelector('[name="company"]');
  const linkedinInput= formEl.querySelector('[name="linkedin"]');
  const contactInput = formEl.querySelector('[name="contact"]');
  const nameError    = formEl.querySelector('[data-error="name"]');
  const companyError = formEl.querySelector('[data-error="company"]');
  const linkedinError= formEl.querySelector('[data-error="linkedin"]');
  const contactError = formEl.querySelector('[data-error="contact"]');
  const submitBtn    = formEl.querySelector('.btn-submit');

  const nameErr    = validateName(nameInput.value);
  const companyErr = validateCompany(companyInput.value);
  const linkedinErr= validateLinkedIn(linkedinInput.value);
  const contactErr = validateContact(contactInput.value);

  if (nameErr)    showFieldError(nameInput, nameError, nameErr);
  else            clearFieldError(nameInput, nameError);
  if (companyErr) showFieldError(companyInput, companyError, companyErr);
  else            clearFieldError(companyInput, companyError);
  if (linkedinErr)showFieldError(linkedinInput, linkedinError, linkedinErr);
  else            clearFieldError(linkedinInput, linkedinError);
  if (contactErr) showFieldError(contactInput, contactError, contactErr);
  else            clearFieldError(contactInput, contactError);

  if (nameErr || companyErr || linkedinErr || contactErr) return;

  // Normalise phone — strip +91 prefix, store as 10 digits
  const digits  = contactInput.value.replace(/\D/g, '');
  const contact = digits.length === 12 ? digits.slice(2) : digits;

  const payload = {
    Name:      nameInput.value.trim(),
    Company:   companyInput.value.trim(),
    LinkedIn:  linkedinInput.value.trim(),
    Contact:   contact,
    Timestamp: new Date().toISOString()
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Unlocking…';

  // 1. Save locally (never fails)
  saveLocally(payload);

  // 2. Unlock the table immediately
  unlockTable();

  // 3. Show success in modal, then close
  showSuccess(formEl);
  setTimeout(closeModal, 2200);

  // 4. Push to backend in background (silent fail — data is in localStorage)
  submitLead(payload).catch((err) => {
    console.warn('[F&B Upstream] Backend submission failed. Lead saved locally.', err);
  });
}


/* ── GOOGLE SHEETS CSV FETCH & TABLE RENDER ────────────────── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    // Handle quoted fields (e.g. "a, b, c")
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

function renderBadges(text, isCert) {
  if (!text) return '—';
  return text.split(';').map(s => s.trim()).filter(Boolean)
    .map(s => `<span class="badge${isCert ? ' cert' : ''}">${s}</span>`)
    .join('');
}

function renderWebsite(url) {
  if (!url || url === '—') return '—';
  const href = url.startsWith('http') ? url : `https://${url}`;
  return `<a href="${href}" target="_blank" rel="noopener">${url.replace(/^https?:\/\//,'')}</a>`;
}

function updateStats(rows) {
  const states = new Set(rows.map(r => r['State']).filter(Boolean));
  const categories = new Set();
  rows.forEach(r => {
    (r['Categories'] || '').split(';').map(s => s.trim()).filter(Boolean).forEach(c => categories.add(c));
  });
  const cmEl   = document.getElementById('stat-cms');
  const stEl   = document.getElementById('stat-states');
  const catEl  = document.getElementById('stat-cats');
  const cntEl  = document.getElementById('cm-count-label');
  if (cmEl)  cmEl.textContent  = rows.length;
  if (stEl)  stEl.textContent  = states.size;
  if (catEl) catEl.textContent = categories.size;
  if (cntEl) cntEl.textContent = `${rows.length} CMs`;
}

function renderTable(rows) {
  const tbody  = document.getElementById('cm-tbody');
  const table  = document.getElementById('cm-table');
  const loading= document.getElementById('table-loading');
  if (!tbody || !table) return;

  if (!rows.length) {
    if (loading) loading.textContent = 'No CMs found.';
    return;
  }

  tbody.innerHTML = rows.map(row => {
    const location = [row['City'], row['State']].filter(Boolean).join(', ') || '—';
    return `<tr>
      <td class="td-name">${row['Name'] || '—'}</td>
      <td class="td-location">${location}</td>
      <td>${renderBadges(row['Categories'], false)}</td>
      <td>${renderBadges(row['Formats'], false)}</td>
      <td class="td-moq">${row['MOQ'] || '—'}</td>
      <td>${renderBadges(row['Certifications'], true)}</td>
      <td>${renderBadges(row['Special Equipment'], false)}</td>
      <td class="td-website">${renderWebsite(row['Website'])}</td>
    </tr>`;
  }).join('');

  if (loading) loading.style.display = 'none';
  table.style.display = '';
}

async function loadCMs() {
  const loading = document.getElementById('table-loading');
  try {
    if (SHEETS_CSV_URL === 'YOUR_GOOGLE_SHEETS_CSV_URL_HERE') {
      // Dev mode: show placeholder rows so layout is visible
      if (loading) loading.textContent = 'Add your Google Sheets CSV URL in app.js to load CM data.';
      return;
    }
    const res = await fetch(SHEETS_CSV_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    const rows = parseCSV(text);
    renderTable(rows);
    updateStats(rows);
  } catch (err) {
    console.error('[F&B Upstream] Failed to load CMs:', err);
    if (loading) loading.textContent = 'Could not load CM data. Please try refreshing.';
  }
}


/* ── LIVE FIELD VALIDATION (clear on type) ─────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('access-form');
  if (form) {
    form.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('input', () => {
        const errorEl = form.querySelector(`[data-error="${input.name}"]`);
        if (errorEl) clearFieldError(input, errorEl);
      });
    });
  }

  // Load CM data from Sheets
  loadCMs();

  // If previously unlocked, skip the gate immediately
  if (isUnlocked()) {
    unlockTable();
  }
});
