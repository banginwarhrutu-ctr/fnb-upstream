/* ============================================================
   JOIN THE NETWORK — join-network.js
   Renders the chip-checkbox groups, validates the form, and
   submits to /api/join-network-submit, which writes into the
   "Referral-Partner-Intake" table in the F&B Upstream Airtable
   base (see api/join-network-submit.js).
   ============================================================ */

const JN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

const JN_SERVICES = [
  'OEM / Contract Manufacturing', 'Private Label', 'White Label', 'Co-Packing / Co-Manufacturing',
  'Raw Material Supply', 'Packaging Solutions', 'R&D / Formulation Support',
  'Testing / Lab Services', 'Distribution / Logistics', 'Export Services'
];

const JN_CERTIFICATIONS = [
  'FSSAI', 'ISO 22000', 'FSSC 22000', 'HACCP', 'GMP', 'BRC', 'Halal', 'Kosher',
  'USFDA', 'APEDA', 'NABL', 'AGMARK', 'Organic (India Organic / USDA NOP)'
];

function jnRenderChipGroup(containerId, name, values) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = values.map(v => `
    <label class="chip-check">
      <input type="checkbox" name="${name}" value="${v}">
      <span>${v}</span>
    </label>`).join('');
}

function jnRenderStateOptions() {
  const sel = document.getElementById('jn-state');
  if (!sel) return;
  JN_STATES.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    sel.appendChild(opt);
  });
}

function jnShowFieldError(input, el, msg) { input.classList.add('has-error'); el.textContent = msg; el.classList.add('show'); }
function jnClearFieldError(input, el)    { input.classList.remove('has-error'); el.classList.remove('show'); }

function jnValidateForm(form) {
  let hasError = false;
  const err = name => form.querySelector(`[data-error="${name}"]`);

  const name = form.querySelector('[name="name"]');
  if (!name.value.trim() || name.value.trim().length < 2) {
    jnShowFieldError(name, err('name'), 'Please enter your name.'); hasError = true;
  } else jnClearFieldError(name, err('name'));

  const phone = form.querySelector('[name="phone"]');
  const digits = phone.value.replace(/\D/g, '');
  if (!(digits.length === 10 || (digits.length === 12 && digits.startsWith('91')))) {
    jnShowFieldError(phone, err('phone'), 'Enter a valid 10-digit phone number.'); hasError = true;
  } else jnClearFieldError(phone, err('phone'));

  const company = form.querySelector('[name="companyName"]');
  if (!company.value.trim() || company.value.trim().length < 2) {
    jnShowFieldError(company, err('companyName'), "Please enter your company name (or 'independent')."); hasError = true;
  } else jnClearFieldError(company, err('companyName'));

  const city = form.querySelector('[name="city"]');
  if (!city.value.trim()) {
    jnShowFieldError(city, err('city'), 'Please enter your city.'); hasError = true;
  } else jnClearFieldError(city, err('city'));

  const state = form.querySelector('[name="state"]');
  if (!state.value) {
    jnShowFieldError(state, err('state'), 'Please select a state.'); hasError = true;
  } else jnClearFieldError(state, err('state'));

  const moq = form.querySelector('[name="moq"]');
  if (!moq.value) {
    jnShowFieldError(moq, err('moq'), 'Please select an MOQ range.'); hasError = true;
  } else jnClearFieldError(moq, err('moq'));

  const anyService = [...form.querySelectorAll('[name="services"]')].some(c => c.checked) || form.querySelector('[name="servicesOther"]').value.trim();
  const servicesErr = err('services');
  if (!anyService) {
    servicesErr.textContent = 'Pick at least one service, or describe it below.';
    servicesErr.classList.add('show');
    hasError = true;
  } else {
    servicesErr.classList.remove('show');
  }

  return !hasError;
}

function jnGetChecked(form, name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(c => c.value);
}

function jnShowSuccess(formEl) {
  formEl.style.display = 'none';
  const div = document.createElement('div');
  div.className = 'success-state';
  div.innerHTML = `<div class="success-check">✓</div><h4>You're in.</h4><p>Thanks — we've got your details. We'll be in touch when a brief matches what you do.</p>`;
  formEl.parentElement.appendChild(div);
}

async function handleJoinNetwork(e, formEl) {
  e.preventDefault();

  const hp = formEl.querySelector('[name="website"]').value;
  if (hp) { jnShowSuccess(formEl); return; }

  if (!jnValidateForm(formEl)) return;

  const btn = document.getElementById('jn-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting…';
  const errEl = document.getElementById('jn-submit-error');
  if (errEl) errEl.classList.remove('show');

  const payload = {
    timestamp: new Date().toISOString(),
    name: formEl.querySelector('[name="name"]').value.trim(),
    designation: formEl.querySelector('[name="designation"]').value.trim(),
    phone: formEl.querySelector('[name="phone"]').value.replace(/\D/g, ''),
    companyName: formEl.querySelector('[name="companyName"]').value.trim(),
    city: formEl.querySelector('[name="city"]').value.trim(),
    state: formEl.querySelector('[name="state"]').value,
    services: jnGetChecked(formEl, 'services').join(', '),
    servicesOther: formEl.querySelector('[name="servicesOther"]').value.trim(),
    certifications: jnGetChecked(formEl, 'certifications').join(', '),
    certificationsOther: formEl.querySelector('[name="certificationsOther"]').value.trim(),
    categories: formEl.querySelector('[name="categories"]').value.trim(),
    moq: formEl.querySelector('[name="moq"]').value,
    pilotRun: formEl.querySelector('[name="pilotRun"]').checked ? 'Yes' : 'No',
    rndFeasibility: formEl.querySelector('[name="rndFeasibility"]').checked ? 'Yes' : 'No',
    notes: formEl.querySelector('[name="notes"]').value.trim(),
    website: hp
  };

  try {
    const backup = JSON.parse(localStorage.getItem('fnb_join_network_leads') || '[]');
    backup.push(payload);
    localStorage.setItem('fnb_join_network_leads', JSON.stringify(backup));
  } catch (err) {}

  try {
    const res = await fetch('/api/join-network-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Submit failed (${res.status})`);
    }
    jnShowSuccess(formEl);
  } catch (err) {
    console.error('[Join the Network] Submission failed:', err);
    btn.disabled = false;
    btn.textContent = 'Submit';
    const errorEl = document.getElementById('jn-submit-error');
    if (errorEl) {
      errorEl.textContent = "Something went wrong sending this — your details are saved on this device, but please try again or WhatsApp us directly so nothing gets missed.";
      errorEl.classList.add('show');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('join-network-form')) return;
  jnRenderChipGroup('jn-services-grid', 'services', JN_SERVICES);
  jnRenderChipGroup('jn-certs-grid', 'certifications', JN_CERTIFICATIONS);
  jnRenderStateOptions();

  const form = document.getElementById('join-network-form');
  form.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('input', () => {
      const errorEl = form.querySelector(`[data-error="${input.name}"]`);
      if (errorEl) jnClearFieldError(input, errorEl);
    });
  });
});
