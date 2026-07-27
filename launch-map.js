/* ============================================================
   LAUNCH MAP - WIZARD LOGIC
   Deterministic lookup only, no LLM, no free text parsing.
   Client-side for now, for speed of iteration; a later pass moves
   determineLicenseTier()/buildReport() into
   /api/launch-map-summarize + /api/launch-map-report per the spec,
   so the KB and pricing logic aren't sitting in view-source.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);

let selectedCategoryId = null;

/* ── REPORT SECTION CHOICE (new step 1) ──────────────────────────
   What the founder actually wants generated. "labels-clean" bundles
   label must-haves + claims + clean label into one choice since on
   screen they already live under one "Label & claims" + "Clean
   label" pairing, not three separate asks. Reuses REPORT_ICONS
   (already drawn for the report picker cards further down) so this
   doesn't need its own icon set, and the same .lm-category-card /
   .lm-category-check chip styling and tick animation as the category
   grid, just multi-select instead of single-select. */
const REPORT_SECTION_OPTIONS = [
  { id: 'license', label: 'License tier', desc: 'Find the FSSAI licence that\'s right for your business.', icon: 'license', hue: 'lm-cat-peach', photo: 'img/report-choices/license.jpg' },
  { id: 'tests', label: 'Lab tests', desc: 'Understand the testing requirements for your product.', icon: 'tests', hue: 'lm-cat-mint' },
  { id: 'labels-clean', label: 'Labelling & Claims', desc: "Build compliant labels and make confident product claims.", icon: 'labels', hue: 'lm-cat-lilac', photo: 'img/report-choices/labels-clean.jpg' }
];
let selectedReportSections = [];

function renderReportChoiceChips() {
  const grid = $('#lm-report-choice-grid');
  grid.innerHTML = '';
  REPORT_SECTION_OPTIONS.forEach(opt => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `lm-category-card lm-report-choice-card ${opt.hue}`;
    card.dataset.section = opt.id;
    const checkBadge = `
      <div class="lm-category-check" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6"/></svg>
      </div>`;
    card.innerHTML = `
      <div class="lm-category-icon">${REPORT_ICONS[opt.icon] || ''}</div>
      <div class="lm-category-label">${opt.label}</div>
      <div class="lm-category-desc">${opt.desc}</div>
      ${checkBadge}
    `;
    card.addEventListener('click', () => toggleReportSection(opt.id, card));
    grid.appendChild(card);
  });
}

function toggleReportSection(id, card) {
  const idx = selectedReportSections.indexOf(id);
  if (idx === -1) selectedReportSections.push(id);
  else selectedReportSections.splice(idx, 1);
  card.classList.toggle('selected', selectedReportSections.includes(id));
  $('#lm-report-choice-error').classList.remove('show');
  updateProgress(); // keeps the step count live as skippable steps change
}

/* ── CATEGORY CARDS (imagery instead of a dropdown) ──────────── */
function renderCategoryCards() {
  const grid = $('#lm-category-grid');
  grid.innerHTML = '';

  const all = [
    ...Object.keys(LAUNCH_MAP_KB).map(id => ({ id, label: LAUNCH_MAP_KB[id].displayName, built: true })),
    ...LAUNCH_MAP_COMING_SOON.map(c => ({ id: c.id, label: c.label, built: false }))
  ];

  const hues = ['lm-cat-butter', 'lm-cat-peach', 'lm-cat-mint', 'lm-cat-lilac'];
  all.forEach((cat, i) => {
    const photo = CATEGORY_PHOTOS[cat.id];
    const examples = CATEGORY_EXAMPLES[cat.id];
    // Card label drops any "(...)" example suffix (e.g. "Snacks, extruded/fried
    // (chips, namkeen, bhujia)" -> "Snacks, extruded/fried") since hover now
    // covers examples directly; the full name (with parenthetical) is still
    // used everywhere else via displayName, this only shortens the chip.
    const shortLabel = cat.label.replace(/\s*\([^)]*\)\s*$/, '');
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `lm-category-card ${hues[i % hues.length]}`
      + (cat.built ? '' : ' lm-category-card-soon')
      + (photo ? ' has-photo' : '');
    card.dataset.categoryId = cat.id;
    if (photo) card.style.backgroundImage = `url("${photo}")`;
    const checkBadge = `
      <div class="lm-category-check" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6"/></svg>
      </div>`;
    card.innerHTML = photo ? `
      <div class="lm-category-scrim"></div>
      <div class="lm-category-label-wrap"><div class="lm-category-label">${shortLabel}</div></div>
      ${examples ? `<div class="lm-category-examples"><span>Includes</span>${examples}</div>` : ''}
      ${cat.built ? '' : '<div class="lm-category-badge">Not built yet</div>'}
      ${checkBadge}
    ` : `
      <div class="lm-category-icon">${CATEGORY_ICONS[cat.id] || ''}</div>
      <div class="lm-category-label">${shortLabel}</div>
      ${cat.built ? '' : '<div class="lm-category-badge">Not built yet</div>'}
      ${checkBadge}
    `;
    card.addEventListener('click', () => selectCategory(cat.id));
    grid.appendChild(card);
  });
}

function selectCategory(id) {
  selectedCategoryId = id;
  document.querySelectorAll('#lm-category-grid .lm-category-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.categoryId === id);
  });
  onCategoryChange();
}

/* ── BUSINESS ACTIVITY / KIND OF BUSINESS ────────────────────────
   Verified against the official FoSCoS "Kind of Business Eligibility"
   schedule (updated 01.04.2026, read directly). The four options below
   map to real KOB rows in that document:
     - own facility        -> Manufacturing/Processing Unit
     - contract manufacturer -> Relabeller ("gets his product manufactured
       or packed from a third party manufacturer or processor")
     - importing           -> Importer, explicitly "no restriction on
       turnover threshold", i.e. Central License regardless of revenue
     - repacking           -> Repacker (repacks into different sizes
       without changing composition or formulation)
   Production capacity is deliberately not asked: the KOB schedule sets
   eligibility on turnover alone, and an early-stage founder can't
   estimate daily output reliably anyway. */
const BUSINESS_ACTIVITY_OPTIONS = [
  { id: 'own-facility', label: 'In my own facility', desc: 'You own or operate the unit where it gets made.', icon: 'tests', hue: 'lm-cat-mint' },
  { id: 'contract-manufacturer', label: 'Through a contract manufacturer', desc: "Someone else makes it, you own the brand. FoSCoS calls this a Relabeller.", icon: 'license', hue: 'lm-cat-peach' },
  { id: 'repacking', label: 'Repacking bulk into retail packs', desc: 'You buy in bulk and repack without changing the recipe.', icon: 'labels', hue: 'lm-cat-lilac' },
  { id: 'importing', label: 'Importing finished product', desc: 'Brought in from abroad and sold here.', icon: 'cleanlabel', hue: 'lm-cat-butter' }
];
let selectedBusinessActivity = null;

function renderActivityChips() {
  const grid = $('#lm-activity-grid');
  grid.innerHTML = '';
  BUSINESS_ACTIVITY_OPTIONS.forEach(opt => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `lm-category-card lm-report-choice-card ${opt.hue}`;
    card.dataset.activity = opt.id;
    card.innerHTML = `
      <div class="lm-category-icon">${REPORT_ICONS[opt.icon] || ''}</div>
      <div class="lm-category-label">${opt.label}</div>
      <div class="lm-category-desc">${opt.desc}</div>
      <div class="lm-category-check" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12.5 9.5 18 20 6"/></svg>
      </div>
    `;
    card.addEventListener('click', () => {
      selectedBusinessActivity = opt.id;
      grid.querySelectorAll('.lm-category-card').forEach(c => c.classList.toggle('selected', c.dataset.activity === opt.id));
      $('#lm-activity-error').classList.remove('show');
    });
    grid.appendChild(card);
  });
}

function initStateOptions() {
  const select = $('#lm-state');
  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = 'Select your state';
  select.appendChild(blank);
  INDIAN_STATES.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
}

/* ============================================================
   WIZARD STEP NAVIGATION
   One question per screen, flashcard-style. STEP_ORDER is the
   normal path; step 1 branches to 'waitlist' (terminal) instead
   of '2' when the chosen category isn't built yet.
   ============================================================ */
const STEP_ORDER = ['0', '1', '2', '3', 'activity', '4', '5', '6'];
let currentStep = '0';

// Turnover (4), sales channels (5) and business activity only feed the
// license-tier calc; ingredients (2) only feeds tests/labels/clean-label.
// Skip whichever of these don't matter given what was picked on step 0,
// so nobody's asked their turnover just to have the license section
// never show up.
function stepApplies(key) {
  if (key === '2') return selectedReportSections.includes('tests') || selectedReportSections.includes('labels-clean');
  if (key === '4' || key === '5' || key === 'activity') return selectedReportSections.includes('license');
  return true;
}

function applicableSteps() {
  return STEP_ORDER.filter(stepApplies);
}

function stepNumber(key) { return applicableSteps().indexOf(key) + 1; }

function nextStepKey(key) {
  if (key === '1' && !isCategoryBuilt()) return 'waitlist';
  let i = STEP_ORDER.indexOf(key) + 1;
  while (i < STEP_ORDER.length && !stepApplies(STEP_ORDER[i])) i++;
  return i < STEP_ORDER.length ? STEP_ORDER[i] : null;
}

function prevStepKey(key) {
  if (key === 'waitlist') return '1';
  let i = STEP_ORDER.indexOf(key) - 1;
  while (i >= 0 && !stepApplies(STEP_ORDER[i])) i--;
  return i >= 0 ? STEP_ORDER[i] : null;
}

function isCategoryBuilt() {
  return !!LAUNCH_MAP_KB[selectedCategoryId];
}

function validateStep(key) {
  if (key === '0') {
    const err = $('#lm-report-choice-error');
    if (selectedReportSections.length === 0) {
      err.textContent = 'Pick at least one thing to generate.';
      err.classList.add('show');
      return false;
    }
    err.classList.remove('show');
  }
  if (key === '1') {
    if (!selectedCategoryId) {
      alert('Pick a category to continue.');
      return false;
    }
  }
  if (key === 'activity') {
    const err = $('#lm-activity-error');
    if (!selectedBusinessActivity) {
      err.textContent = 'Pick how it gets made to continue.';
      err.classList.add('show');
      return false;
    }
    err.classList.remove('show');
  }
  if (key === '5') {
    const checked = document.querySelectorAll('input[name="channels"]:checked').length;
    const err = $('#lm-channels-error');
    if (checked === 0) {
      err.textContent = 'Pick at least one sales channel.';
      err.classList.add('show');
      return false;
    }
    err.classList.remove('show');
  }
  if (key === '6') {
    if (!$('#lm-state').value) {
      alert('Select your state to continue.');
      return false;
    }
  }
  return true;
}

// Which steps are "applicable" can change the moment step 0 is answered
// (skipping turnover/sales-channels/ingredients per stepApplies()), so
// both the dot count and the fraction filled are recomputed from the
// current applicable list every call, not the static STEP_ORDER length.
function updateProgress() {
  const applicable = applicableSteps();
  const total = applicable.length;
  const num = currentStep === 'waitlist' ? 1 : (applicable.indexOf(currentStep) + 1);
  initProgressDots(total);
  $('#lm-progress-fill').style.width = (num / total * 100) + '%';
  $('#lm-progress-label').textContent = currentStep === 'waitlist'
    ? 'Category not available yet'
    : `Step ${num} of ${total}`;
  [...$('#lm-progress-dots').children].forEach((dot, i) => {
    dot.classList.toggle('done', i < num - 1);
    dot.classList.toggle('current', i === num - 1);
  });
}

function initProgressDots(count) {
  const wrap = $('#lm-progress-dots');
  wrap.innerHTML = '';
  for (let i = 0; i < (count || STEP_ORDER.length); i++) {
    wrap.appendChild(document.createElement('span'));
  }
}

function goToStep(key, direction) {
  document.querySelectorAll('.lm-step').forEach(el => {
    el.classList.remove('active', 'lm-anim-fwd', 'lm-anim-back');
  });
  const target = document.querySelector(`.lm-step[data-step="${key}"]`);
  if (!target) return;
  target.classList.add('active', direction === 'back' ? 'lm-anim-back' : 'lm-anim-fwd');
  currentStep = key;
  updateProgress();

  $('#lm-back-btn').classList.toggle('lm-hidden', key === '0');
  $('#lm-next-btn').style.display = (key === '6') ? 'none' : (key === 'waitlist' ? 'none' : 'inline-block');
  $('#lm-submit-btn').style.display = (key === '6') ? 'inline-block' : 'none';

  // 'start' rather than 'nearest': nearest can decide the step is already
  // "close enough" from the previous scroll position and do nothing, which
  // leaves the new step's heading sitting behind the fixed nav.
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleNextClick() {
  if (!validateStep(currentStep)) return;
  if (currentStep === '1') onCategoryChange();
  const next = nextStepKey(currentStep);
  if (next) goToStep(next, 'forward');
}

function handleBackClick() {
  const prev = prevStepKey(currentStep);
  if (prev) goToStep(prev, 'back');
}

/* ── INGREDIENT CHECKLIST (rebuilt when category changes) ──────── */
function renderIngredients(categoryId) {
  const wrap = $('#lm-ingredients-wrap');
  wrap.innerHTML = '';
  const kb = LAUNCH_MAP_KB[categoryId];
  if (!kb) return;

  const groups = {};
  kb.ingredientTags.forEach(tag => {
    if (!groups[tag.group]) groups[tag.group] = [];
    groups[tag.group].push(tag);
  });

  Object.keys(groups).forEach(groupName => {
    const groupEl = document.createElement('div');
    groupEl.className = 'lm-ingredient-group';
    const heading = document.createElement('div');
    heading.className = 'lm-ingredient-group-title';
    heading.innerHTML = `<span class="lm-group-icon">${GROUP_ICONS[groupName] || ''}</span>${groupName}`;
    groupEl.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'chip-grid';
    groups[groupName].forEach(tag => {
      const label = document.createElement('label');
      label.className = 'chip-check';
      label.innerHTML = `<input type="checkbox" name="ingredients" value="${tag.id}"><span>${tag.label}${tag.allergen ? ' ⚠' : ''}</span>`;
      grid.appendChild(label);
    });
    groupEl.appendChild(grid);
    wrap.appendChild(groupEl);
  });
}

/* Called after a category card is clicked: refreshes the ingredient
   checklist for step 2. Whether step 2 or the waitlist screen shows
   next is decided by nextStepKey() when Next is clicked, not here. */
function onCategoryChange() {
  if (LAUNCH_MAP_KB[selectedCategoryId]) renderIngredients(selectedCategoryId);
}

/* ── LICENSE TIER DECISION LOGIC ─────────────────────────────── */
function determineLicenseTier(kb, answers) {
  const triggers = [];

  // Each trigger below is a Kind of Business that the official FoSCoS
  // eligibility schedule (01.04.2026) marks "No restriction on turnover
  // threshold", i.e. Central License applies no matter how small you are.
  if (answers.businessActivity === 'importing') {
    triggers.push('Importing finished food products. The Importer Kind of Business carries no turnover threshold on the FoSCoS eligibility schedule, so Central applies from the first consignment');
  }
  if (answers.salesChannels.includes('export')) {
    triggers.push('Exporting. Trader/Merchant-Exporter carries no turnover threshold on the FoSCoS schedule');
  }
  if (answers.salesChannels.includes('d2c-online') || answers.salesChannels.includes('marketplaces')) {
    triggers.push('Selling via e-commerce (own website/app, or marketplaces like Amazon/Blinkit). E-Commerce is listed with no turnover threshold, so it applies regardless of revenue');
  }
  if (kb.licenseLogic.alwaysCentralTrigger) {
    triggers.push('This product category is on FSSAI’s fixed always-Central list');
  }
  // Proprietary Food is also a no-turnover-threshold Central row. We can't
  // assert it outright (it depends on the exact recipe), so it's flagged
  // from ingredients the KB knows have no standardised identity.
  const noStandardTags = kb.ingredientTags.filter(t =>
    t.noStandard && (answers.ingredients || []).includes(t.id)
  );

  // Caveats don't change the tier, they ride along with whatever it is.
  const caveats = [];
  if (kb.licenseLogic.proprietaryFoodRisk) {
    caveats.push('Watch this one: there is no FSS standard for a finished product in this category, so it is normally licensed as Proprietary Food. Proprietary Food sits on the FoSCoS schedule with no turnover threshold, which means Central License regardless of revenue, and the tier below may understate what you actually need. If you also market it as a health supplement, that is a separate always-Central Kind of Business again.');
  } else if (noStandardTags.length) {
    caveats.push(`Watch this one: ${noStandardTags.map(t => t.label).join(', ')} ${noStandardTags.length > 1 ? 'have' : 'has'} no standardised identity under the FSS regulations. Products without a standard are treated as Proprietary Food, and Proprietary Food sits on the FoSCoS schedule with no turnover threshold, meaning Central License regardless of revenue. Confirm your exact formulation against the standards before assuming the tier below.`);
  }
  if (answers.businessActivity === 'contract-manufacturer') {
    caveats.push('Using a contract manufacturer makes you a Relabeller on FoSCoS, "a food business operator who gets his product manufactured or packed from a third party manufacturer or processor". You still need your own licence, and separately your CM\'s licence has to already cover this product category, since their Kind of Business is what authorises the actual making.');
  }
  if (answers.businessActivity === 'repacking') {
    caveats.push('Repacking bulk into retail packs is its own Kind of Business (Repacker) and is applied for under the Manufacturer group on FoSCoS, not as a trader.');
  }

  if (triggers.length > 0) {
    return { tier: 'Central License', reasons: triggers, fee: kb.licenseLogic.centralFee, viaTrigger: true, caveats };
  }

  // Milling units are their own row: the FoSCoS schedule grants them a
  // State License "without any limit on turnover threshold", and pointedly
  // excludes them from the Central row ("No Grains, Cereals or Pulses
  // Milling Units"). So a tiny mill still can't sit on Registration.
  if (kb.licenseLogic.millingAlwaysState && answers.businessActivity !== 'importing') {
    return {
      tier: 'State License',
      reasons: ['Grains, cereals and pulses milling units are listed on the FoSCoS eligibility schedule as State License with no turnover limit, and are explicitly excluded from the Central row, so turnover doesn’t move this one'],
      fee: kb.licenseLogic.stateFee,
      caveats
    };
  }

  // Thresholds per the FSS (Licensing and Registration of Food Businesses)
  // Amendment Regulations, 2026, in force since 1 April 2026, confirmed
  // against the official FoSCoS Kind of Business Eligibility schedule.
  if (answers.turnover === 'under-1.5cr') {
    return {
      tier: 'Registration',
      reasons: ['Turnover under ₹1.5 crore, and no Central-License trigger applies'],
      fee: kb.licenseLogic.registrationFee,
      note: kb.licenseLogic.registrationRequiresPettyOperatorCheck
        ? 'Registration also requires meeting "petty food business operator" criteria in the Licensing Regulations, which turnover alone doesn\'t settle. The FoSCoS eligibility schedule itself sets tiers on turnover only, so confirm the petty-operator test separately before relying on Registration.'
        : null,
      caveats
    };
  }

  if (answers.turnover === 'above-50cr') {
    return { tier: 'Central License', reasons: ['Turnover above ₹50 crore'], fee: kb.licenseLogic.centralFee, viaTrigger: false, caveats };
  }

  return {
    tier: 'State License',
    reasons: ['Turnover between ₹1.5 crore and ₹50 crore, and no Central-License trigger applies'],
    fee: kb.licenseLogic.stateFee,
    caveats
  };
}

/* ── EMAIL GATE ───────────────────────────────────────────────
   One box, not two: the "report generated" confirmation and the email
   field live together. Deliberately doesn't leak any actual report
   content, license tier, fee, tests, label rules, whatever was picked
   in step 0 stays behind the gate. This only confirms scope. */
function renderSummary(kb, tierResult, answers) {
  const chosen = (answers.reportSections || [])
    .map(id => (REPORT_SECTION_OPTIONS.find(o => o.id === id) || {}).label)
    .filter(Boolean);
  $('#lm-gate-summary').innerHTML =
    `Your launch map for <strong>${kb.displayName}</strong> is ready, covering ${chosen.join(', ') || 'your selections'}.`;
  $('#lm-gate-disclaimer').textContent =
    `This is informational, not a substitute for legal counsel or official FSSAI guidance. Content last reviewed: ${kb.lastReviewed}.`;
  const gate = $('#lm-email-gate');
  gate.style.display = 'block';
  gate.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Claim detail renderer. Pulls from the shared glossary, not
   per-category text, so every category shows the same real
   thresholds instead of a re-written vague version each time. */
function renderClaimDetail(def, colorIndex) {
  if (!def) return '';
  let extra = '';
  if (def.whatCountsAsSugar) {
    extra += `
      <div class="lm-claim-sublist">
        <div class="lm-mini-label">Counts as sugar for this claim</div>
        <ul class="lm-nice-list lm-list-flag">${def.whatCountsAsSugar.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
      <div class="lm-claim-sublist">
        <div class="lm-mini-label">Does NOT count as sugar for this claim</div>
        <ul class="lm-nice-list lm-list-check">${def.doesNotCountAsSugar.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>`;
  }
  const noteBlock = def.verifiedNote ? `<p class="lm-note">${def.verifiedNote}</p>` : '';
  const hues = ['lm-claim-butter', 'lm-claim-peach', 'lm-claim-mint', 'lm-claim-lilac'];
  const hue = hues[(colorIndex || 0) % hues.length];
  return `
    <div class="lm-claim ${hue}">
      <div class="lm-claim-name">${def.claim}</div>
      <p class="lm-claim-threshold">${def.threshold}</p>
      ${extra}
      ${noteBlock}
    </div>`;
}

/* Personalized label/claims, built from the ingredients actually
   selected, not a static list. Produces two things a fixed template
   can't: a real allergen declaration naming only what's actually
   present, and per-claim eligibility against the founder's own
   selections (e.g. flagging that sugar-free isn't available because
   they checked jaggery, instead of leaving them to work it out). */
function buildPersonalizedLabel(kb, selectedIngredientIds) {
  const selectedTags = kb.ingredientTags.filter(t => selectedIngredientIds.includes(t.id));

  const allergenTypes = [...new Set(selectedTags.filter(t => t.allergen).map(t => t.allergenType))];
  const allergenBlock = allergenTypes.length
    ? `<p class="lm-personalized"><strong>Based on what you selected, your allergen declaration needs:</strong> ${allergenTypes.map(a => `Contains ${a}`).join('; ')}, from ${selectedTags.filter(t => t.allergen).map(t => t.label).join(', ')}.</p>`
    : `<p class="lm-personalized">No major allergens flagged from your selected ingredients. Still confirm cross-contamination risk if your facility also runs allergen-containing lines.</p>`;

  const hasAnimalDerived = selectedTags.some(t => t.animalDerived);
  const veganBlock = !hasAnimalDerived && selectedTags.length
    ? `<p class="lm-personalized">Nothing you selected is animal-derived, so a vegan claim may be attainable. Confirm vegan-claim labeling requirements separately before using it.</p>`
    : '';

  const sugarBlockers = selectedTags.filter(t => t.sugarEquivalent);
  const preservativeBlockers = selectedTags.filter(t => t.isPreservative);

  const claimBlocks = kb.labelRequirements.prohibitedClaimIds.map((id, i) => {
    const def = CLAIM_DEFINITIONS[id];
    let eligibility = '';
    if ((id === 'sugar-free-no-added-sugar' || id === 'low-sugar') && sugarBlockers.length) {
      eligibility = `<p class="lm-personalized lm-blocked">Not available with your current selections: ${sugarBlockers.map(t => t.label).join(', ')} count${sugarBlockers.length > 1 ? '' : 's'} as sugar for this claim.</p>`;
    } else if (id === 'no-preservatives' && preservativeBlockers.length) {
      eligibility = `<p class="lm-personalized lm-blocked">Not available: you selected ${preservativeBlockers.map(t => t.label).join(', ')}.</p>`;
    } else if (id === 'sugar-free-no-added-sugar' || id === 'low-sugar' || id === 'no-preservatives') {
      eligibility = `<p class="lm-personalized lm-open">Nothing in your current selections blocks this claim; still needs the actual lab/formulation check before you use it.</p>`;
    }
    return renderClaimDetail(def, i) + eligibility;
  }).join('');

  return { allergenBlock, veganBlock, claimBlocks };
}

/* Clean Label check, built from the same selected ingredients as the
   personalized label above. Matches each selected tag's id against
   CLEAN_LABEL_RULES (shared across all 15 categories, defined once in
   launch-map-data.js) instead of a per-category clean-label list. */
function checkCleanLabel(kb, selectedIngredientIds) {
  const selectedTags = kb.ingredientTags.filter(t => selectedIngredientIds.includes(t.id));
  const flagged = [];
  const verify = [];
  selectedTags.forEach(tag => {
    const rule = CLEAN_LABEL_RULES.find(r => r.pattern.test(tag.id));
    if (!rule) return;
    (rule.tier === 'flag' ? flagged : verify).push({ tag, reason: rule.reason });
  });
  return { flagged, verify, selectedCount: selectedTags.length };
}

function renderCleanLabelContent(kb, selectedIngredientIds) {
  const { flagged, verify, selectedCount } = checkCleanLabel(kb, selectedIngredientIds);

  if (!selectedCount) {
    return `<p class="lm-note">Go back and select your ingredients on step 2 to see a clean label check here.</p>`;
  }

  let verdictBadgeClass = 'lm-badge-good';
  let verdictLabel = 'Clean label: looks achievable';
  let verdictText = 'Nothing in your current ingredient selections falls into the categories most clean-label programs treat as disqualifying: synthetic preservatives, artificial colours or flavours, artificial sweeteners, synthetic antioxidants.';

  if (flagged.length) {
    verdictBadgeClass = 'lm-badge-bad';
    verdictLabel = 'Not currently clean label';
    verdictText = `${flagged.length} of your selected ingredient${flagged.length > 1 ? 's' : ''} would typically disqualify a clean-label claim. Swap or remove ${flagged.length > 1 ? 'them' : 'it'} below if you want to make this claim.`;
  } else if (verify.length) {
    verdictBadgeClass = 'lm-badge-warn';
    verdictLabel = 'Clean label: possible, verify a few ingredients';
    verdictText = `Nothing you selected is an outright disqualifier, but ${verify.length} ingredient${verify.length > 1 ? 's' : ''} could go either way depending on the exact compound your supplier uses.`;
  }

  const flaggedList = flagged.length ? `
    <h3>Ingredients to avoid or swap</h3>
    <ul class="lm-nice-list lm-list-flag">${flagged.map(f => `<li><strong>${f.tag.label}:</strong> ${f.reason}</li>`).join('')}</ul>` : '';

  const verifyList = verify.length ? `
    <h3>Verify these before claiming clean label</h3>
    <ul class="lm-nice-list lm-list-dot">${verify.map(f => `<li><strong>${f.tag.label}:</strong> ${f.reason}</li>`).join('')}</ul>` : '';

  return `
    <div class="lm-tier-badge ${verdictBadgeClass}">${verdictLabel}</div>
    <p class="lm-reason">${verdictText}</p>
    ${flaggedList}
    ${verifyList}
    <p class="lm-disclaimer">"Clean label" has no single legal definition under Indian food law, unlike the license, test, and claim rules elsewhere in this report. This checks your selections against the ingredient categories most consumer brands, retailers, and export buyers commonly treat as disqualifying, not an FSSAI certification, and doesn't replace one if a retailer or certifier requires it.</p>
  `;
}

/* Full report, rendered after the email gate. Renders only the sections
   chosen back in step 1, stacked in order, plus a short always-visible
   tail (step sequence, the First Batch CTA, sources) that applies
   regardless of which sections were picked. */
function renderFullReport(kb, tierResult, answers) {
  const el = $('#lm-report');
  const personalized = buildPersonalizedLabel(kb, answers.ingredients || []);

  let feeBlock = `<p class="lm-fee">Fee: ${tierResult.fee}</p>`;
  if (tierResult.note) feeBlock += `<p class="lm-note">${tierResult.note}</p>`;
  if (kb.licenseLogic.annualFeeNote) feeBlock += `<p class="lm-note">${kb.licenseLogic.annualFeeNote}</p>`;

  const sd = kb.sectionDisclaimers || {};

  const caveatBlock = (tierResult.caveats && tierResult.caveats.length)
    ? `<ul class="lm-nice-list lm-list-flag">${tierResult.caveats.map(c => `<li>${c}</li>`).join('')}</ul>`
    : '';

  const licenseContent = `
    <div class="lm-tier-badge">${tierResult.tier}</div>
    <p class="lm-reason">${tierResult.reasons.join('; ')}.</p>
    ${feeBlock}
    ${caveatBlock}
    ${sd.license ? `<p class="lm-disclaimer">${sd.license}</p>` : ''}
  `;

  // Tests tagged with appliesTo only show up if the founder actually
  // selected a matching ingredient (e.g. honey-adulteration tests stay
  // hidden if they picked monk fruit, not honey). Untagged tests are
  // "core": they apply to the category regardless of which specific
  // ingredients were checked, so they always show.
  const selectedIds = answers.ingredients || [];
  const relevantTests = kb.mandatoryTests.filter(t =>
    !t.appliesTo || t.appliesTo.some(frag => selectedIds.some(id => id.includes(frag)))
  );
  const skippedTests = kb.mandatoryTests.filter(t => !relevantTests.includes(t));

  const testsContent = `
    <div class="lm-table-wrap"><table class="lm-table">
      <thead><tr><th>Test</th><th>Lab</th><th>Frequency</th></tr></thead>
      <tbody>
        ${relevantTests.map(t => `<tr><td>${t.name}</td><td>${t.lab}</td><td>${t.frequency}</td></tr>`).join('')}
      </tbody>
    </table></div>
    <p class="lm-note">Filtered to the ingredients you actually selected. ${skippedTests.length ? `${skippedTests.length} more test${skippedTests.length > 1 ? 's' : ''} would apply if you'd picked different ingredients (e.g. honey-specific adulteration tests, if you'd chosen honey instead of monk fruit).` : ''}</p>
    ${sd.mandatoryTests ? `<p class="lm-disclaimer">${sd.mandatoryTests}</p>` : ''}
  `;

  const labelsContent = `
    <h3>Label must-haves</h3>
    <ul class="lm-nice-list lm-list-check">${kb.labelRequirements.mustHave.map(m => `<li>${m}</li>`).join('')}</ul>
    ${kb.labelRequirements.conditionalDeclarations ? `
    <h3>Only if you use these</h3>
    <p class="lm-note">Conditional declarations, only apply if you use the specific ingredient or additive named.</p>
    <ul class="lm-nice-list lm-list-flag">${kb.labelRequirements.conditionalDeclarations.map(m => `<li>${m}</li>`).join('')}</ul>` : ''}
    ${personalized.allergenBlock}
    ${personalized.veganBlock}
    <h3>Claims: thresholds, not vibes</h3>
    <p class="lm-note">If you want to make any of these claims, here's the actual bar to clear, and whether your own ingredient selections already rule it out.</p>
    ${personalized.claimBlocks}
    ${sd.labelRequirements ? `<p class="lm-disclaimer">${sd.labelRequirements}</p>` : ''}
  `;

  const cleanLabelContent = renderCleanLabelContent(kb, answers.ingredients || []);

  // The founder already chose their sections in step 1, so this renders
  // them directly, stacked, rather than making them pick a second time
  // from a menu of what they just asked for. Clean label is folded into
  // the label section since "labels-clean" was one choice on that step.
  const wanted = (answers.reportSections && answers.reportSections.length) ? answers.reportSections : ['license', 'tests', 'labels-clean'];
  const ALL_REPORT_PARTS = [
    { key: 'license', when: 'license', accent: 'lm-accent-peach', title: 'License tier', content: licenseContent },
    { key: 'tests', when: 'tests', accent: 'lm-accent-mint', title: 'Lab tests', content: testsContent },
    {
      key: 'labels', when: 'labels-clean', accent: 'lm-accent-lilac', title: 'Label, claims & clean label',
      content: labelsContent + `<div class="lm-subsection"><h3>Clean label check</h3>${cleanLabelContent}</div>`
    }
  ].filter(part => wanted.includes(part.when));

  const sectionsHtml = ALL_REPORT_PARTS.map(part => `
    <div class="lm-report-section ${part.accent}" data-report="${part.key}">
      <h3 class="lm-report-section-title">${part.title}</h3>
      ${part.content}
    </div>`).join('');

  el.innerHTML = `
    <h2>Your launch map</h2>
    <p class="lm-disclaimer">${sd.overall || 'This is informational, not a substitute for legal counsel or official FSSAI guidance.'}</p>

    ${sectionsHtml}

    <div class="lm-section">
      <h3>Step-by-step sequence</h3>
      <ol class="lm-steps-list">${kb.stepSequence.map(s => `<li>${s}</li>`).join('')}</ol>
    </div>

    <div class="lm-section lm-footer-cta">
      <h3>Where First Batch can help</h3>
      <p>${kb.fbcFooter.ctaCopy}</p>
      <a href="start.html" class="btn btn-primary">Tell us what you're building</a>
    </div>

    <div class="lm-section lm-sources">
      <h3>Sources</h3>
      <ul class="lm-nice-list lm-list-dot">${kb.sources.map(s => `<li>${s.rule}: ${s.citation}</li>`).join('')}</ul>
    </div>

    <button class="btn btn-ghost" id="lm-download-pdf" type="button">Download PDF</button>
    <p class="lm-note">Generated in your browser. The v1 build may move this server-side per the spec, but the content and branding stay the same.</p>
  `;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  $('#lm-download-pdf').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const original = btn.textContent;
    try {
      btn.disabled = true;
      btn.textContent = 'Generating…';
      generateReportPdf(kb, tierResult, answers);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation hit an error. Check the console for details.');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
}

/* ── PDF EXPORT ───────────────────────────────────────────────
   Client-side, via jsPDF + autotable (loaded from CDN in
   launch-map.html), matching the site's no-build-step convention.
   Branded to First Batch Co.: black header bar, wordmark, accent-
   coloured section rules, and a closing promo page reusing the
   same fbcFooter.ctaCopy shown on-screen. Real build may still
   move this server-side per the spec, but this gives founders an
   actual downloadable file today instead of an alert().

   pdfSafe() matters more than it looks: jsPDF's built-in fonts
   only support WinAnsi/Latin-1, not ₹ ≤ ≥ δ γ. Feeding those
   straight to doc.text()/autoTable silently corrupts the *entire*
   string's character spacing (not just the bad glyph), which is
   why every text-producing helper below routes through it. */
const LM_PDF_BRAND = {
  black: [0x22, 0x27, 0x1F],
  white: [0xFF, 0xFF, 0xFF],
  muted: [0x6E, 0x75, 0x66],
  mutedOnDark: [0xB4, 0xB9, 0xAC],
  cream: [0xFC, 0xF8, 0xED],
  peach: [0xE0, 0x60, 0x3A],
  mint: [0x2F, 0x8F, 0x5B],
  lilac: [0x7C, 0x6B, 0xC4],
  butter: [0xC9, 0x97, 0x1A],
  // pastel tints, same values as the site's --butter/--peach/--mint/--lilac card backgrounds
  butterTint: [0xFF, 0xF3, 0xC4],
  peachTint: [0xFF, 0xE1, 0xD1],
  mintTint: [0xDF, 0xF0, 0xE2],
  lilacTint: [0xE8, 0xE3, 0xF5]
};

function pdfSafe(value) {
  if (value == null) return '';
  return String(value)
    .replace(/₹/g, 'Rs. ')
    .replace(/≤/g, '<= ')
    .replace(/≥/g, '>= ')
    .replace(/δ/g, 'd')
    .replace(/γ/g, 'g')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function generateReportPdf(kb, tierResult, answers) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentW = pageW - margin * 2;
  const bodyLine = 12.5;
  let y = 0;

  // Mirrors the on-screen filtering in renderFullReport(): only the
  // report(s) picked in step 1 get built into the PDF. Falls back to
  // "everything" if reportSections is somehow empty (e.g. an old stashed
  // result from before this step existed).
  const wanted = (answers.reportSections && answers.reportSections.length) ? answers.reportSections : ['license', 'tests', 'labels-clean'];

  const setColor = (fn, rgb) => doc[fn](rgb[0], rgb[1], rgb[2]);

  function drawContinuationHeader() {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    setColor('setTextColor', LM_PDF_BRAND.muted);
    doc.text('FIRST BATCH CO  /  LAUNCH MAP', margin, margin - 18);
    setColor('setDrawColor', LM_PDF_BRAND.muted);
    doc.setLineWidth(0.5);
    doc.line(margin, margin - 10, pageW - margin, margin - 10);
  }

  function ensureSpace(needed) {
    if (y + needed > pageH - 60) {
      doc.addPage();
      y = margin + 16;
      drawContinuationHeader();
    }
  }

  function drawCoverHeader() {
    setColor('setFillColor', LM_PDF_BRAND.black);
    doc.rect(0, 0, pageW, 70, 'F');
    setColor('setFillColor', LM_PDF_BRAND.peach);
    doc.rect(0, 70, pageW, 3, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(16);
    setColor('setTextColor', LM_PDF_BRAND.white);
    doc.text('First Batch Co.', margin, 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor('setTextColor', LM_PDF_BRAND.mutedOnDark);
    doc.text('Launch Map, FSSAI compliance report', margin, 55);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    doc.text(dateStr, pageW - margin, 40, { align: 'right' });
    y = 70 + 38;
  }

  function drawFooter(pageNum, pageCount) {
    setColor('setDrawColor', LM_PDF_BRAND.muted);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - 42, pageW - margin, pageH - 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setColor('setTextColor', LM_PDF_BRAND.muted);
    doc.text('firstbatch.in  /  Launch Map is informational, not a substitute for legal counsel', margin, pageH - 27);
    doc.text(`${pageNum} / ${pageCount}`, pageW - margin, pageH - 27, { align: 'right' });
  }

  function sectionTitle(text, accent) {
    ensureSpace(34);
    setColor('setFillColor', accent);
    doc.rect(margin, y, 26, 4, 'F');
    y += 20;
    doc.setFont('courier', 'bold');
    doc.setFontSize(13);
    setColor('setTextColor', LM_PDF_BRAND.black);
    doc.text(pdfSafe(text).toUpperCase(), margin, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  }

  function bodyText(text, opts) {
    opts = opts || {};
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(opts.size || 10);
    setColor('setTextColor', opts.color || LM_PDF_BRAND.black);
    const lines = doc.splitTextToSize(pdfSafe(text), contentW);
    const lh = opts.lineHeight || bodyLine;
    ensureSpace(lines.length * lh + 4);
    doc.text(lines, margin, y);
    y += lines.length * lh + (opts.gap != null ? opts.gap : 8);
  }

  function bulletList(items, opts) {
    opts = opts || {};
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    setColor('setTextColor', LM_PDF_BRAND.black);
    items.forEach(item => {
      const safe = pdfSafe(item);
      const lines = doc.splitTextToSize(safe, contentW - 16);
      ensureSpace(lines.length * 13 + 3);
      setColor('setFillColor', LM_PDF_BRAND.muted);
      doc.circle(margin + 3, y - 3, 1.4, 'F');
      doc.text(lines, margin + 14, y);
      y += lines.length * 13 + 4;
    });
    y += (opts.gap != null ? opts.gap : 8);
  }

  function disclaimerText(text) {
    if (!text) return;
    bodyText(text, { size: 8, color: LM_PDF_BRAND.muted, gap: 12 });
  }

  // Circle-glyph list: mint checkmark or amber "!" per item, mirroring
  // .lm-nice-list.lm-list-check / .lm-list-flag on the site. The checkmark
  // is drawn as two vector strokes rather than a unicode glyph since ✓
  // isn't in jsPDF's standard-font WinAnsi charset (same class of bug as
  // the ₹/≤/≥ corruption pdfSafe() fixes elsewhere).
  function glyphList(items, opts) {
    opts = opts || {};
    const bg = opts.bg || LM_PDF_BRAND.mint;
    const kind = opts.kind || 'check';
    items.forEach(item => {
      const lines = doc.splitTextToSize(pdfSafe(item), contentW - 34);
      ensureSpace(Math.max(lines.length * 13, 18) + 7);
      const cy = y - 6.5;
      setColor('setFillColor', bg);
      doc.circle(margin + 9, cy, 8, 'F');
      if (kind === 'check') {
        setColor('setDrawColor', LM_PDF_BRAND.white);
        doc.setLineWidth(1.3);
        doc.line(margin + 6, cy + 0.3, margin + 8.2, cy + 2.6);
        doc.line(margin + 8.2, cy + 2.6, margin + 12.4, cy - 3);
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        setColor('setTextColor', LM_PDF_BRAND.white);
        doc.text('!', margin + 9, cy + 2.6, { align: 'center' });
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      setColor('setTextColor', LM_PDF_BRAND.black);
      doc.text(lines, margin + 26, y);
      y += lines.length * 13 + 8;
    });
    y += (opts.gap != null ? opts.gap : 6);
  }

  // Numbered circle list rotating the four brand accents, mirroring
  // .lm-steps-list on the site.
  function numberedList(items, opts) {
    const colors = [LM_PDF_BRAND.butter, LM_PDF_BRAND.peach, LM_PDF_BRAND.mint, LM_PDF_BRAND.lilac];
    items.forEach((item, idx) => {
      const lines = doc.splitTextToSize(pdfSafe(item), contentW - 36);
      ensureSpace(Math.max(lines.length * 14, 22) + 7);
      const cy = y - 7;
      setColor('setFillColor', colors[idx % colors.length]);
      doc.circle(margin + 10, cy, 9.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      setColor('setTextColor', LM_PDF_BRAND.white);
      doc.text(String(idx + 1), margin + 10, cy + 3, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      setColor('setTextColor', LM_PDF_BRAND.black);
      doc.text(lines, margin + 28, y);
      y += lines.length * 14 + 8;
    });
    y += (opts && opts.gap != null ? opts.gap : 8);
  }

  // Tinted rounded card, mirroring .lm-personalized / .lm-headline-steps.
  function tintedBox(text, bg, opts) {
    opts = opts || {};
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(opts.size || 9.5);
    const lines = doc.splitTextToSize(pdfSafe(text), contentW - 28);
    const h = lines.length * (opts.lineHeight || 13) + 22;
    ensureSpace(h + 12);
    setColor('setFillColor', bg);
    doc.roundedRect(margin, y, contentW, h, 8, 8, 'F');
    setColor('setTextColor', opts.textColor || LM_PDF_BRAND.black);
    doc.text(lines, margin + 14, y + 18);
    y += h + 12;
  }

  // Claim card: cream box with a coloured left bar, mirroring .lm-claim.
  function claimCard(name, threshold, eligibility, accent) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    const nameLines = doc.splitTextToSize(pdfSafe(name).replace(/[“”]/g, '"'), contentW - 26);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const threshLines = doc.splitTextToSize(pdfSafe(threshold), contentW - 26);
    doc.setFontSize(8.5);
    const eligLines = eligibility ? doc.splitTextToSize(pdfSafe(eligibility), contentW - 26) : [];
    const h = 16 + nameLines.length * 13 + 4 + threshLines.length * 11.5 +
      (eligLines.length ? 7 + eligLines.length * 11 : 0) + 14;
    ensureSpace(h + 12);
    const boxY = y;
    setColor('setFillColor', LM_PDF_BRAND.cream);
    doc.roundedRect(margin, boxY, contentW, h, 6, 6, 'F');
    setColor('setFillColor', accent);
    doc.roundedRect(margin, boxY, 5, h, 2.5, 2.5, 'F');
    let ty = boxY + 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    setColor('setTextColor', LM_PDF_BRAND.black);
    doc.text(nameLines, margin + 18, ty);
    ty += nameLines.length * 13 + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor('setTextColor', LM_PDF_BRAND.black);
    doc.text(threshLines, margin + 18, ty);
    ty += threshLines.length * 11.5;
    if (eligLines.length) {
      ty += 7;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      setColor('setTextColor', eligibility.startsWith('Not available') ? LM_PDF_BRAND.peach : LM_PDF_BRAND.mint);
      doc.text(eligLines, margin + 18, ty);
    }
    y = boxY + h + 12;
  }

  // ── Page 1: cover ────────────────────────────────────────
  drawCoverHeader();
  doc.setFont('courier', 'bold');
  doc.setFontSize(20);
  setColor('setTextColor', LM_PDF_BRAND.black);
  const titleLines = doc.splitTextToSize(pdfSafe(kb.displayName), contentW);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 24 + 10;

  const selectedIds = answers.ingredients || [];
  const selectedTags = kb.ingredientTags.filter(t => selectedIds.includes(t.id));

  if (wanted.includes('license')) {
    const tierLabel = pdfSafe(tierResult.tier).toUpperCase();
    setColor('setFillColor', LM_PDF_BRAND.peach);
    doc.roundedRect(margin, y, doc.getTextWidth(tierLabel) + 30, 24, 3, 3, 'F');
    doc.setFont('courier', 'bold');
    doc.setFontSize(10.5);
    setColor('setTextColor', LM_PDF_BRAND.white);
    doc.text(tierLabel, margin + 15, y + 16);
    y += 42;

    bodyText(tierResult.reasons.join('; ') + '.', { gap: 6 });
    bodyText(`Fee: ${tierResult.fee}`, { bold: true, gap: 4 });
    if (tierResult.note) bodyText(tierResult.note, { size: 9, color: LM_PDF_BRAND.muted });
    if (kb.licenseLogic.annualFeeNote) bodyText(kb.licenseLogic.annualFeeNote, { size: 9, color: LM_PDF_BRAND.muted });
    disclaimerText((kb.sectionDisclaimers || {}).license);

    bodyText(`FSS category: ${kb.fssCategory.code}`, { size: 9, color: LM_PDF_BRAND.muted, gap: 14 });
  }

  // ── Lab tests ────────────────────────────────────────────
  if (wanted.includes('tests')) {
    const relevantTests = kb.mandatoryTests.filter(t =>
      !t.appliesTo || t.appliesTo.some(frag => selectedIds.some(id => id.includes(frag)))
    );
    sectionTitle('Mandatory lab tests', LM_PDF_BRAND.mint);
    bodyText('Filtered to the ingredients you actually selected in the wizard.', { size: 8.5, color: LM_PDF_BRAND.muted, gap: 10 });
    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Test', 'Lab', 'Frequency']],
      body: relevantTests.map(t => [pdfSafe(t.name), pdfSafe(t.lab), pdfSafe(t.frequency)]),
      styles: { font: 'helvetica', fontSize: 8, cellPadding: 6, textColor: LM_PDF_BRAND.black, lineColor: [232, 230, 220], lineWidth: 0.5 },
      headStyles: { fillColor: LM_PDF_BRAND.black, textColor: LM_PDF_BRAND.white, fontStyle: 'bold', fontSize: 7.5 },
      alternateRowStyles: { fillColor: LM_PDF_BRAND.cream },
      columnStyles: { 0: { cellWidth: 240 }, 1: { cellWidth: 90 }, 2: { cellWidth: 'auto' } }
    });
    y = doc.lastAutoTable.finalY + 16;
    disclaimerText((kb.sectionDisclaimers || {}).mandatoryTests);
  }

  if (wanted.includes('labels-clean')) {
    // ── Label must-haves + conditional declarations ─────────
    sectionTitle('Label must-haves', LM_PDF_BRAND.lilac);
    glyphList(kb.labelRequirements.mustHave, { bg: LM_PDF_BRAND.mint, kind: 'check' });
    if (kb.labelRequirements.conditionalDeclarations && kb.labelRequirements.conditionalDeclarations.length) {
      bodyText('Only if you use these ingredients or additives:', { bold: true, size: 9.5, gap: 6 });
      glyphList(kb.labelRequirements.conditionalDeclarations, { bg: LM_PDF_BRAND.butter, kind: 'flag' });
    }

    const allergenTags = selectedTags.filter(t => t.allergen);
    if (allergenTags.length) {
      tintedBox(`Your allergen declaration needs: Contains ${[...new Set(allergenTags.map(t => t.allergenType))].join(', ')} (from ${allergenTags.map(t => t.label).join(', ')}).`, LM_PDF_BRAND.lilacTint, { bold: true });
    } else if (selectedTags.length) {
      tintedBox('No major allergens flagged from your selected ingredients. Still confirm cross-contamination risk if your facility also runs allergen-containing lines.', LM_PDF_BRAND.mintTint);
    }
    disclaimerText((kb.sectionDisclaimers || {}).labelRequirements);

    // ── Claims ────────────────────────────────────────────────
    sectionTitle('Claims: thresholds, not vibes', LM_PDF_BRAND.lilac);
    const claimAccents = [LM_PDF_BRAND.butter, LM_PDF_BRAND.peach, LM_PDF_BRAND.mint, LM_PDF_BRAND.lilac];
    const sugarBlockers = selectedTags.filter(t => t.sugarEquivalent);
    const preservativeBlockers = selectedTags.filter(t => t.isPreservative);
    let claimIdx = 0;
    kb.labelRequirements.prohibitedClaimIds.forEach(id => {
      const def = CLAIM_DEFINITIONS[id];
      if (!def) return;
      let eligibility = null;
      if ((id === 'sugar-free-no-added-sugar' || id === 'low-sugar') && sugarBlockers.length) {
        eligibility = `Not available with your current selections: ${sugarBlockers.map(t => t.label).join(', ')}.`;
      } else if (id === 'no-preservatives' && preservativeBlockers.length) {
        eligibility = `Not available: you selected ${preservativeBlockers.map(t => t.label).join(', ')}.`;
      } else if (id === 'sugar-free-no-added-sugar' || id === 'low-sugar' || id === 'no-preservatives') {
        eligibility = 'Nothing in your current selections blocks this claim; still needs the actual lab/formulation check.';
      }
      claimCard(def.claim, def.threshold, eligibility, claimAccents[claimIdx % claimAccents.length]);
      claimIdx++;
    });

    // ── Clean label check ────────────────────────────────────
    sectionTitle('Clean label check', LM_PDF_BRAND.butter);
    const flagged = [];
    const verify = [];
    selectedTags.forEach(tag => {
      const rule = CLEAN_LABEL_RULES.find(r => r.pattern.test(tag.id));
      if (!rule) return;
      (rule.tier === 'flag' ? flagged : verify).push({ tag, reason: rule.reason });
    });
    if (!selectedTags.length) {
      tintedBox('No ingredients were selected.', LM_PDF_BRAND.cream, { textColor: LM_PDF_BRAND.muted });
    } else if (flagged.length) {
      tintedBox(`Not currently clean label: ${flagged.length} selected ingredient${flagged.length > 1 ? 's' : ''} would typically disqualify a clean-label claim.`, LM_PDF_BRAND.peachTint, { bold: true, textColor: LM_PDF_BRAND.peach });
      glyphList(flagged.map(f => `${f.tag.label}: ${f.reason}`), { bg: LM_PDF_BRAND.peach, kind: 'flag' });
    } else if (verify.length) {
      tintedBox(`Clean label: possible, verify ${verify.length} ingredient${verify.length > 1 ? 's' : ''} with your supplier.`, LM_PDF_BRAND.butterTint, { bold: true, textColor: LM_PDF_BRAND.butter });
      glyphList(verify.map(f => `${f.tag.label}: ${f.reason}`), { bg: LM_PDF_BRAND.butter, kind: 'flag' });
    } else {
      tintedBox('Clean label: looks achievable. Nothing in your selections falls into the commonly flagged categories.', LM_PDF_BRAND.mintTint, { bold: true, textColor: LM_PDF_BRAND.mint });
    }
    disclaimerText('"Clean label" has no single legal definition under Indian food law; this is not an FSSAI certification.');
  }

  // ── Step sequence ────────────────────────────────────────
  sectionTitle('Step-by-step sequence', LM_PDF_BRAND.peach);
  numberedList(kb.stepSequence);

  // ── Sources ──────────────────────────────────────────────
  sectionTitle('Sources', LM_PDF_BRAND.mint);
  bulletList(kb.sources.map(s => `${s.rule}: ${s.citation}`), { gap: 2 });
  bodyText(`Content last reviewed: ${kb.lastReviewed}`, { size: 8, color: LM_PDF_BRAND.muted });

  // ── Closing promo page ───────────────────────────────────
  doc.addPage();
  setColor('setFillColor', LM_PDF_BRAND.black);
  doc.rect(0, 0, pageW, pageH, 'F');
  setColor('setFillColor', LM_PDF_BRAND.peach);
  doc.rect(0, 0, pageW, 4, 'F');

  y = 130;
  doc.setFont('courier', 'bold');
  doc.setFontSize(24);
  setColor('setTextColor', LM_PDF_BRAND.white);
  doc.text('First Batch Co.', margin, y);
  y += 22;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  setColor('setTextColor', LM_PDF_BRAND.mutedOnDark);
  doc.text('The compliance side is done. Here’s the rest of the brief.', margin, y);
  y += 40;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11.5);
  setColor('setTextColor', LM_PDF_BRAND.white);
  // ctaCopy is authored per-category and already ends on "Tell us what
  // you're building", the same line the site nav uses as its CTA, so the
  // button below echoes it verbatim rather than a generic "learn more".
  const promoLines = doc.splitTextToSize(pdfSafe(kb.fbcFooter.ctaCopy), contentW - 20);
  doc.text(promoLines, margin, y, { lineHeightFactor: 1.5 });
  y += promoLines.length * 17 + 34;

  const ctaLabel = 'Tell us what you’re building';
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  const ctaW = doc.getTextWidth(ctaLabel) + 44;
  setColor('setFillColor', LM_PDF_BRAND.peach);
  doc.roundedRect(margin, y, ctaW, 36, 5, 5, 'F');
  setColor('setTextColor', LM_PDF_BRAND.white);
  doc.text(ctaLabel, margin + 18, y + 23);
  doc.link(margin, y, ctaW, 36, { url: 'https://firstbatch.in/start' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  setColor('setTextColor', LM_PDF_BRAND.mutedOnDark);
  doc.textWithLink('firstbatch.in/start', margin, y + 52, { url: 'https://firstbatch.in/start' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setColor('setTextColor', LM_PDF_BRAND.mutedOnDark);
  doc.text('This report is informational and does not replace legal counsel or official FSSAI guidance.', margin, pageH - 40);

  // ── Header/footer on every page (skip the promo page) ────
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p < pageCount; p++) {
    doc.setPage(p);
    drawFooter(p, pageCount - 1);
  }

  const fileSlug = (kb.displayName || 'launch-map').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  doc.save(`firstbatch-launchmap-${fileSlug}.pdf`);
}

/* ── FORM SUBMIT (free summary) ──────────────────────────────── */
function handleWizardSubmit(e) {
  e.preventDefault();
  const kb = LAUNCH_MAP_KB[selectedCategoryId];
  if (!kb) return;

  const answers = {
    reportSections: selectedReportSections.slice(),
    businessActivity: selectedBusinessActivity,
    ingredients: Array.from(document.querySelectorAll('input[name="ingredients"]:checked')).map(i => i.value),
    process: $('#lm-process').value,
    turnover: $('#lm-turnover').value,
    salesChannels: Array.from(document.querySelectorAll('input[name="channels"]:checked')).map(i => i.value),
    state: $('#lm-state').value
  };

  const tierResult = determineLicenseTier(kb, answers);
  window._lmLastResult = { kb, tierResult, answers }; // stashed for the email-gate step

  $('.lm-wizard-card').style.display = 'none'; // done with the wizard, don't leave it stacked above the gate
  renderSummary(kb, tierResult, answers);
}

/* Email gate. Client-side only for now, no real submission yet. */
function handleEmailGateSubmit(e) {
  e.preventDefault();
  const email = $('#lm-email').value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $('#lm-email-error').textContent = 'Enter a valid email.';
    $('#lm-email-error').classList.add('show');
    return;
  }
  $('#lm-email-error').classList.remove('show');

  // Real build: POST to /api/launch-map-report here (Airtable write + PDF + Resend).
  // For now this just renders the KB data directly as the full report.
  const { kb, tierResult, answers } = window._lmLastResult;
  renderFullReport(kb, tierResult, answers);
  $('#lm-email-gate').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  renderReportChoiceChips();
  renderActivityChips();
  renderCategoryCards();
  initStateOptions();
  initProgressDots();
  $('#lm-wizard-form').addEventListener('submit', handleWizardSubmit);
  $('#lm-email-gate-form').addEventListener('submit', handleEmailGateSubmit);
  $('#lm-next-btn').addEventListener('click', handleNextClick);
  $('#lm-back-btn').addEventListener('click', handleBackClick);

  // Enter advances to the next step instead of submitting early,
  // except on the last step where Enter should submit as normal.
  $('#lm-wizard-form').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentStep !== '6') {
      e.preventDefault();
      handleNextClick();
    }
  });

  $('#lm-back-btn').classList.add('lm-hidden');
  $('#lm-next-btn').style.display = 'inline-block';
  $('#lm-submit-btn').style.display = 'none';
  updateProgress();
});
