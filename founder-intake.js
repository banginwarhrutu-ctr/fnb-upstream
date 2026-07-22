/* ============================================================
   FOUNDER INTAKE — founder-intake.js
   Renders the chip radio/checkbox groups, validates the form,
   and submits to /api/founder-intake-submit, which writes into
   a dedicated "Founder Project Intake" Airtable table.
   ============================================================ */

const FI_STAGES = [
  'Just an idea',
  'Concept, with benchmarks in mind',
  'Done home-kitchen trials / have rough samples',
  'Have a lab-developed formula',
  'Formula ready, need a manufacturer',
  'Already selling, want to reformulate'
];

const FI_FORMATS = [
  'Bar (protein / nutrition / snack)',
  'Beverage / RTD drink',
  'Powder / premix / instant mix',
  'Chocolate / confectionery',
  'Gummies / jellies',
  'Snack (baked, extruded, roasted, fried)',
  'Bakery (cookies, crackers, etc.)',
  'Breakfast (cereal, muesli, granola)',
  'Dairy / frozen (yogurt, ice cream, etc.)',
  'Sauce / spread / condiment',
  'Supplement (capsule, effervescent, etc.)',
  'Other'
];

const FI_SCOPE = [
  'Brief market scan',
  'Regulatory classification',
  'Prototype / lab development',
  'Nutrition profiling and claims',
  'Packaging and pack label',
  'Contract manufacturer identification',
  'Pilot / commercial trial support',
  'Shelf life study',
  'Costing / unit economics',
  'End-to-end, all of it',
  'Not sure, help me figure it out'
];

function fiRenderChipGroup(containerId, name, values, type) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = values.map(v => `
    <label class="chip-check">
      <input type="${type}" name="${name}" value="${v}">
      <span>${v}</span>
    </label>`).join('');
}

function fiShowFieldError(input, el, msg) { input.classList.add('has-error'); el.textContent = msg; el.classList.add('show'); }
function fiClearFieldError(input, el)    { input.classList.remove('has-error'); el.classList.remove('show'); }

function fiValidateForm(form) {
  let hasError = false;
  const err = name => form.querySelector(`[data-error="${name}"]`);

  const name = form.querySelector('[name="name"]');
  if (!name.value.trim() || name.value.trim().length < 2) {
    fiShowFieldError(name, err('name'), 'Please enter your name.'); hasError = true;
  } else fiClearFieldError(name, err('name'));

  const email = form.querySelector('[name="email"]');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    fiShowFieldError(email, err('email'), 'Enter a valid email address.'); hasError = true;
  } else fiClearFieldError(email, err('email'));

  const phone = form.querySelector('[name="phone"]');
  const digits = phone.value.replace(/\D/g, '');
  if (!(digits.length === 10 || (digits.length === 12 && digits.startsWith('91')))) {
    fiShowFieldError(phone, err('phone'), 'Enter a valid 10-digit phone number.'); hasError = true;
  } else fiClearFieldError(phone, err('phone'));

  const idea = form.querySelector('[name="productIdea"]');
  if (!idea.value.trim() || idea.value.trim().length < 10) {
    fiShowFieldError(idea, err('productIdea'), 'Tell us a little about the product (a sentence or two).'); hasError = true;
  } else fiClearFieldError(idea, err('productIdea'));

  const stageErr = err('stage');
  if (!form.querySelector('[name="stage"]:checked')) {
    stageErr.textContent = 'Please pick a stage.'; stageErr.classList.add('show'); hasError = true;
  } else stageErr.classList.remove('show');

  const formatErr = err('format');
  if (!form.querySelector('[name="format"]:checked')) {
    formatErr.textContent = 'Please pick a product format.'; formatErr.classList.add('show'); hasError = true;
  } else formatErr.classList.remove('show');

  const scopeErr = err('scope');
  if (![...form.querySelectorAll('[name="scope"]')].some(c => c.checked)) {
    scopeErr.textContent = 'Pick at least one — even "Not sure, help me figure it out."'; scopeErr.classList.add('show'); hasError = true;
  } else scopeErr.classList.remove('show');

  return !hasError;
}

function fiGetChecked(form, name) {
  return [...form.querySelectorAll(`[name="${name}"]:checked`)].map(c => c.value);
}

function fiShowSuccess(formEl) {
  formEl.style.display = 'none';
  const div = document.createElement('div');
  div.className = 'success-state';
  div.innerHTML = `<div class="success-check">✓</div><h4>You're in.</h4><p>We read every brief. If there's a fit, you'll hear from us on WhatsApp within a couple of days.</p>`;
  formEl.parentElement.appendChild(div);
}

async function handleFounderIntake(e, formEl) {
  e.preventDefault();

  const hp = formEl.querySelector('[name="website"]').value;
  if (hp) { fiShowSuccess(formEl); return; }

  if (!fiValidateForm(formEl)) return;

  const btn = document.getElementById('fi-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  const errEl = document.getElementById('fi-submit-error');
  if (errEl) errEl.classList.remove('show');

  const payload = {
    timestamp: new Date().toISOString(),
    name: formEl.querySelector('[name="name"]').value.trim(),
    company: formEl.querySelector('[name="company"]').value.trim(),
    email: formEl.querySelector('[name="email"]').value.trim(),
    phone: formEl.querySelector('[name="phone"]').value.replace(/\D/g, ''),
    stage: fiGetChecked(formEl, 'stage').join(', '),
    productIdea: formEl.querySelector('[name="productIdea"]').value.trim(),
    format: fiGetChecked(formEl, 'format').join(', '),
    formatOther: formEl.querySelector('[name="formatOther"]').value.trim(),
    productsSkus: formEl.querySelector('[name="productsSkus"]').value.trim(),
    benchmarks: formEl.querySelector('[name="benchmarks"]').value.trim(),
    positioningClaims: formEl.querySelector('[name="positioningClaims"]').value.trim(),
    ingredients: formEl.querySelector('[name="ingredients"]').value.trim(),
    targetCost: formEl.querySelector('[name="targetCost"]').value.trim(),
    shelfLife: formEl.querySelector('[name="shelfLife"]').value.trim(),
    distribution: formEl.querySelector('[name="distribution"]').value.trim(),
    scope: fiGetChecked(formEl, 'scope').join(', '),
    budget: formEl.querySelector('[name="budget"]').value.trim(),
    website: hp
  };

  try {
    const backup = JSON.parse(localStorage.getItem('fnb_founder_intake_leads') || '[]');
    backup.push(payload);
    localStorage.setItem('fnb_founder_intake_leads', JSON.stringify(backup));
  } catch (err) {}

  try {
    const res = await fetch('/api/founder-intake-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `Submit failed (${res.status})`);
    }
    fiShowSuccess(formEl);
  } catch (err) {
    console.error('[Founder Intake] Submission failed:', err);
    btn.disabled = false;
    btn.textContent = 'Send';
    const errorEl = document.getElementById('fi-submit-error');
    if (errorEl) {
      errorEl.textContent = "Something went wrong sending this — your details are saved on this device, but please try again or WhatsApp us directly so nothing gets missed.";
      errorEl.classList.add('show');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('founder-intake-form')) return;
  fiRenderChipGroup('fi-stage-grid', 'stage', FI_STAGES, 'radio');
  fiRenderChipGroup('fi-format-grid', 'format', FI_FORMATS, 'radio');
  fiRenderChipGroup('fi-scope-grid', 'scope', FI_SCOPE, 'checkbox');

  const form = document.getElementById('founder-intake-form');
  form.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('input', () => {
      const errorEl = form.querySelector(`[data-error="${input.name}"]`);
      if (errorEl) fiClearFieldError(input, errorEl);
    });
  });
  form.querySelectorAll('[name="stage"], [name="format"]').forEach(input => {
    input.addEventListener('change', () => {
      const errEl = form.querySelector(`[data-error="${input.name}"]`);
      if (errEl) errEl.classList.remove('show');
    });
  });
  form.querySelectorAll('[name="scope"]').forEach(input => {
    input.addEventListener('change', () => {
      const errEl = form.querySelector('[data-error="scope"]');
      if (errEl) errEl.classList.remove('show');
    });
  });
});
