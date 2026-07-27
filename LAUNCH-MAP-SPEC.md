# Launch Map, Compliance Wizard (V1 Spec)
> Working name: **Launch Map**. Ties to existing copy ("We map the path" / step 2 on homepage). Rename freely, used as a placeholder throughout.
> Repo: `fnb-upstream` (live: fnb-upstream.vercel.app, target domain firstbatch.in). This doc follows the actual conventions in this repo as of `git log` HEAD `5cfc6a8`, one dedicated Vercel function per form, each writing to its own Airtable table, each with its own rate-limit/honeypot boilerplate (see `api/founder-intake-submit.js`, `api/join-network-submit.js`). Not the older single-`/api/submit` pattern described in the separate handoff-folder doc, that folder is a stale snapshot, ignore it.

---

## 1. What this is

A free-to-use wizard on firstbatch.in that takes a founder's product idea and returns a deterministic FSSAI compliance map: license tier, applicable food safety standards, mandatory lab tests, label rules and cost estimate. (Timeline was in scope originally but removed from the report per H's call, see §6.)

**Correction to how this was originally framed**: this isn't just the productized "Testing & compliance" pillar. First Batch's actual offering spans all four pillars, formulation/R&D (food technologists, NPD consultants), sourcing (ingredients), manufacturing (CMs), and testing/compliance, the same "formula to first batch" scope as the homepage hero. Launch Map is the compliance entry point specifically because compliance is the most self-serve-able of the four (deterministic, lookup-able), but the tool's job is to funnel a founder into the *whole* relationship, not just a testing/compliance referral. The report's "Where First Batch can help" footer (§6 KB schema `fbcFooter`) should surface formulation and sourcing help too, not just manufacturing/testing, e.g. "still refining the recipe? we connect you with food technologists", since plenty of founders using this tool won't have a finalized formula yet. It's a lead-gen funnel, same job as `start.html`, but self-serve and give-value-first instead of "fill a brief and wait."

**Not** a legal/regulatory advice product. Every output screen needs a visible disclaimer ("informational, not a substitute for legal counsel / official FSSAI guidance"), this matters more than usual because the content is regulatory and wrong output has real consequences for a founder.

**Not** an LLM feature in v1. Input → deterministic lookup → output. No generation, no chat. This is a scope decision, not just a cost one: hallucinated compliance advice is a liability problem, and a lookup table is auditable in a way an LLM isn't. Chat-style copilot is explicitly v2+.

## 2. Where it lives

- New page, e.g. `launch-map.html` (or `compliance.html`, naming is H's call).
- Entry points: nav (new item, or nested under "The network"), the pillar-04 card on the homepage ("Testing & compliance" → currently just descriptive text, becomes a CTA), and possibly a callout on `start.html` ("not sure what you need yet? Map it first").
- Precedent in this repo for a non-nav-linked page: `founder-intake.html` was shipped "unlisted" (commit `5cfc6a8`, reached via a direct link, not in nav) as a deeper scoping brief. Launch Map could ship the same way for a soft v1 launch, live at a real URL, promoted manually/in outreach, added to nav once it's validated. Worth offering to H as the lower-risk rollout option.
- Site convention to preserve: no framework, no build step, plain HTML/CSS/JS, design tokens from `style.css` (`--coral`, `--accent`, `--accent-soft`, pastel card tints, Inter/Anonymous Pro). The wizard should look like a first-class extension of the existing pillar/step UI, not a bolted-on app.
- IA/copy changes go through H per existing convention, treat page naming and nav placement as open questions, not decisions.

## 3. Pipeline

```
┌─────────────┐   ┌──────────────────┐   ┌───────────────────┐   ┌──────────────┐
│   Wizard     │→ │  /api/launch-map/ │→ │   Knowledge base    │→ │  Free summary │
│ (6 inputs)   │   │    summarize       │   │ (category rules)   │   │  (on-screen)  │
└─────────────┘   └──────────────────┘   └───────────────────┘   └──────┬───────┘
                                                                          │
                                                                   email gate
                                                                          │
                                                                          ▼
┌──────────────┐   ┌──────────────────┐   ┌───────────────────┐   ┌──────────────┐
│  Lead stored  │← │  /api/launch-map/  │← │  Full report built │← │ Email submit  │
│  (Airtable)   │   │      report        │   │  from same KB      │   │  + answers    │
└──────┬───────┘   └──────────────────┘   └───────────────────┘   └──────────────┘
       │
       ├→ Resend: notify H (new lead)
       ├→ Resend: email report/PDF link to founder
       └→ On-screen full report view (shareable, printable)
```

Two server calls, same KB, two trust levels:

1. **`POST /api/launch-map/summarize`**, no email required. Body: the 6 wizard answers. Returns the free summary only (license tier name, FSS category, headline steps, not full cost breakdown or the step-by-step sequence). Runs server-side (not a client-side JS lookup) so the full KB and pricing logic aren't sitting in view-source for anyone to scrape or a competitor to copy.
2. **`POST /api/launch-map/report`**, email required. Body: same 6 answers + `{Name, Company, LinkedIn, Contact, Timestamp}` (reuse the exact `fields` shape from `HANDOFF.md` §4 so it lands in the same Airtable base). Writes the lead + answers to Airtable, triggers the H notification email (existing Resend pattern), returns the full report payload, and emails the founder a link to it.

Report needs a persistent, shareable URL (scope calls out "share report link" as a user action), so the full report isn't just client state, it's a stored record with an ID. `report.html?id=<token>` fetches `GET /api/launch-map/report/[token]` and renders. Token = the Airtable record ID or a short random ID stored alongside it.

## 4. Screens

| Screen | State | Notes |
|---|---|---|
| Wizard | empty | 6 fields, one screen or stepped, recommend stepped (progress bar, back/next) since this is a longer form than the existing 4-5 field forms |
| Wizard | incomplete | inline validation per field, same pattern as `validateName`/`validateLinkedIn` etc. in `app.js`, reuse `showFieldError`/`clearFieldError` |
| Wizard | category not recognized | product type free-text or "other" selected → **waitlist state**, not an error. Capture email + typed category, store as a lead with `Type: 'Waitlist'`, distinct from a full submission |
| Wizard | truly unparseable input | **error state**, gibberish/empty product description that can't even resolve to "other". Friendly fallback: "we couldn't work out what you're making, tell us directly" → links to `start.html` or a call booking link |
| Summary result | success | free, no email. Shows license tier + FSS category + headline steps only. CTA: "Get the full launch map" (email gate) |
| Email gate | (no state column) | same visual pattern as the `access-form` unlock modal on `network.html`, founder already knows this interaction from elsewhere on the site |
| Full report | success | on-screen, shareable URL, "Download PDF" action, "Book a call" CTA, "Where First Batch can help" footer linking back to the four pillars |
| Admin | leads list | reuse Airtable (already the lead store per `HANDOFF.md`) rather than standing up a separate Google Sheet, no new UI needed v1, Airtable's own view is the admin view |

## 5. Wizard inputs → KB mapping

Six inputs, deterministic mapping, no free-text-to-LLM step:

| # | Input | Type | Drives |
|---|---|---|---|
| 1 | Product category | dropdown, from the 10-15 candidate list + "Other / not sure" | primary KB key |
| 2 | Key ingredients | tag-select from a curated per-category list, DECIDED (not free text) | allergen declarations, major-additive flags, standard selection when a category has sub-variants |
| 3 | Process | dropdown (ambient/RTE, refrigerated, frozen, retort/thermally processed, fermented, dried) | which FSS standard + which mandatory tests apply |
| 4 | Expected turnover | ₹ range buckets | one input into license-tier logic, NOT the sole determinant, see below |
| 5 | Sales channels | multi-select (D2C/online, general trade, modern trade, export) | can force Central License regardless of turnover, see below |
| 6 | State | dropdown, all Indian states/UTs | registering authority, office, state-specific fee |

### License tier logic, CORRECTED, thresholds UPDATED (2026 amendment)

Originally modeled as a flat `turnover → tier` lookup. That's wrong, not just simplified, FSSAI has hard triggers that force **Central License regardless of turnover**, and this repo's actual target audience (early-stage D2C brands) hits one of them constantly:

```
determineLicenseTier(turnover, salesChannels, category, businessActivityType):
  if salesChannels includes 'export' or 'import'          → CENTRAL  (any size)
  if salesChannels includes 'D2C/online' (e-commerce FBO)  → CENTRAL  (any size) *
  if category in ALWAYS_CENTRAL_CATEGORIES                 → CENTRAL  (5-star hotel catering, large-capacity storage/manufacturing, etc., category-specific, verify per category)
  if operates in 2+ states (HO)                             → CENTRAL for HO; each unit still separately licensed by its own turnover
  if turnover > ₹50 crore                                   → CENTRAL, fee ₹7,500/year
  if turnover ≤ ₹1.5 crore AND meets petty-operator criteria → REGISTRATION, fee ₹100/year (turnover alone isn't sufficient, see note)
  else                                                       → STATE LICENSE, flat fee ₹5,000/year for General Manufacturing (not a capacity slab, see note below)
```

⚠ **Turnover bands and fees CONFIRMED against official FSSAI/FoSCoS sources 22-23 Jul 2026** (foscos.fssai.gov.in "Kind of Business Eligibility" schedule, updated 01.04.2026, and the FSS Licensing and Registration Amendment Regulations, 2026 gazette notification, read directly, not from a third-party summary). The original draft of this spec used stale pre-amendment thresholds (Registration ≤₹12L, State ₹12L–₹20cr, Central >₹20cr), corrected under the **FSS (Licensing and Registration of Food Businesses) Amendment Regulations, 2026** (gazetted 10 March 2026, in force since **1 April 2026**): Registration raised to ≤₹1.5 crore, State License is now ₹1.5cr–₹50cr, Central License now starts above ₹50cr, and each tier has a confirmed flat fee (₹100 / ₹5,000 / ₹7,500 per year). This is a live example of exactly the risk the whole "NEEDS CITATION" convention exists for, the regulation name (2011) didn't change, but a number inside it moved, and anything built against the old figures would already be wrong as of this writing.

\* **This is the load-bearing line for this tool, and it's unaffected by the turnover change above.** First Batch's users are early-stage D2C brands, selling direct online is close to the default, not an edge case. A founder doing ₹15L/year turnover who sells on their own site or Amazon may need a **Central License**, not State, purely because of the e-commerce trigger, confirmed to still apply "regardless of turnover" under the 2026 amendment too. A tool that only looks at turnover gets this exact, extremely common case wrong. The wizard's "Sales channels" input has to actually feed this branch, not just get logged and ignored.

**Registration tier isn't pure turnover either**, "petty food business operator" status depends on production/processing scale too (e.g. small manufacturing capacity thresholds), not just being under the turnover ceiling. Most founders using this tool will clear Registration into State/Central quickly regardless, so this edge is lower-stakes than the e-commerce trigger above, but the KB shouldn't assert "under ₹1.5cr = Registration, always" as a hard rule.

**CORRECTED, State License fee is flat, not a capacity slab.** An earlier draft of this spec (and the prototype KB) claimed the fee varied by production capacity (e.g. ₹2,000/₹3,000/₹5,000 tiered by tonnes/day), that was invented, not sourced. The actual official FoSCoS "Kind of Business Eligibility" schedule shows a flat ₹5,000/year State License fee for General Manufacturing (which covers most food categories including bakery wares, snacks, sweeteners, beverages, RTE, etc., confirmed per category, don't assume). A handful of Kind-of-Business types (dairy/meat/fish/vegetable-oil processing units, hotels by star rating, central government and railway catering) have their own separate fee rows in that schedule and should be checked individually during KB sourcing, but "capacity-based slab for manufacturers generally" doesn't exist as a concept in the current system at all.

`ALWAYS_CENTRAL_CATEGORIES` needs to be checked per category during KB sourcing, most of the 15 categories won't hit this, but it should be an explicit "no" per category, not silently assumed.

**Why tag-select over free text for ingredients**: free text is what turns this into an NLP/parsing problem and reintroduces the "unparseable input" failure mode everywhere instead of just at the category step. Constraining to curated per-category options keeps the whole pipeline deterministic.

**KB implication of this decision**: each of the 10-15 categories now needs its own curated ingredient tag list (not just the 6 KB fields already listed in §6), e.g. bakery's list looks nothing like beverages'. This is additional KB content-sourcing scope, not just a UI decision, add "ingredient tag list per category" to the KB work in §6 and to whatever gets scoped for content sourcing/review.

## 6. Knowledge base

This is the actual product, the wizard UI is a thin shell around it. Structure as versioned JSON/data files (not hardcoded in the API function), one record per category:

```
{
  category: "bakery-goods",
  displayName: "Bakery goods / products",

  // Real taxonomy, not a token sample, expect 15-25+ tags for ingredient-rich
  // categories (flours, sweeteners), fewer for narrow ones. group/subgroup let
  // the wizard render them as organized sections instead of one long list.
  ingredientTags: [
    { id: "wheat-flour-atta", label: "Whole wheat flour (atta)", group: "flour", allergen: true },
    { id: "wheat-flour-maida", label: "Refined wheat flour (maida)", group: "flour", allergen: true },
    { id: "besan", label: "Besan (gram/chickpea flour)", group: "flour", allergen: false },
    { id: "ragi-flour", label: "Ragi flour (finger millet)", group: "flour", allergen: false },
    { id: "sugar-white", label: "White refined sugar", group: "sweetener", allergen: false },
    { id: "jaggery-cane", label: "Jaggery (gur, cane)", group: "sweetener", allergen: false },
    { id: "jaggery-palm", label: "Palm jaggery (karupatti)", group: "sweetener", allergen: false },
    { id: "preservative-class-ii", label: "Preservative (Class II)", group: "additive", allergen: false }
    /* ... continue per-category; see KB-CONTENT-TEMPLATE.md worked examples for full flour/sweetener taxonomies */
  ],

  fssCategory: { code: "...", standard: "..." },

  // Decision logic, not a flat lookup, see "License tier logic" in §5.
  // Non-turnover triggers checked FIRST; only fall through to turnover bands
  // if none apply.
  licenseLogic: {
    alwaysCentralTrigger: false,               // true for the fixed FSSAI category list (5-star hotel catering, large storage, etc.), verify per category, don't assume false
    ecommerceForcesTiCentral: true,             // true for essentially every category here, since D2C/online selling is the default for this tool's users
    registrationRequiresPettyOperatorCheck: true,  // turnover under ₹1.5cr (2026 threshold) alone isn't sufficient, flag if this category has a production-capacity edge case
    // Flat fees, confirmed against the official FoSCoS "Kind of Business
    // Eligibility" schedule, NOT a capacity-based slab (an earlier draft
    // of this spec incorrectly modeled State fee as tiered by tonnes/day;
    // corrected). Confirm which Kind of Business a category falls under
    // before assuming these General-Manufacturing figures apply, a few
    // KOBs (dairy, meat/fish, vegetable oil, hotels, govt/railway catering)
    // have their own separate fee rows.
    stateFee: "₹5,000/year",
    centralFee: "₹7,500/year",
    registrationFee: "₹100/year"
  },

  mandatoryTests: [ { name: "...", lab: "NABL", indicativeCost: "...", frequency: "..." } ],
  labelRequirements: { mustHave: [...], prohibitedClaimIds: [...] },  // IDs into CLAIM_DEFINITIONS, not free text, see below
  // NO timeline field, removed from the KB schema and report (H's call).
  // stepSequence below still gives the ordered checklist, just without
  // duration estimates attached.
  stepSequence: [ "...", "...", "..." ],
  fbcFooter: { relevantPillars: ["Testing & compliance", "Manufacturing"], ctaCopy: "..." },
  sources: [ { rule: "mandatoryTests", citation: "FSS (Food Product Standards and Food Additives) Regulations, [schedule/section]", url: "...", checkedOn: "2026-07-22" } ],
  lastReviewed: "2026-07-22"
}
```

`sources`/`lastReviewed` exist because of the sourcing model decided in §11 Q5 (below), every rule in a category record should trace back to a specific regulation citation, not just an unattributed number. This is what makes "informational, not legal advice" a real disclaimer rather than a liability shield with nothing behind it, and it's what a later reviewer (per §11 Q5) actually reviews against instead of re-deriving from scratch.

State-specific fee/authority data is a second dimension (category × state), probably a separate lookup table joined at report-generation time rather than duplicated into every category record.

**Claims are a shared glossary, not per-category text.** Nutrient-content claim thresholds ("sugar-free" = ≤0.5g/100g, "high protein" = protein ≥20% of energy, etc.) come from FSSAI's Advertising & Claims Regulations, they're regulation-wide constants, identical whether the product is a biscuit or a beverage. Implemented as a single `CLAIM_DEFINITIONS` table (built in the prototype, `launch-map-data.js`), and each category's `labelRequirements.prohibitedClaimIds` is just a list of which claims are realistic for that category, referencing IDs into the shared table, not a rewritten description each time. This avoids 15 slightly-inconsistent versions of the same threshold, and means verifying the glossary once (against the actual current FSSAI Schedule) covers all 15 categories rather than 15 separate verification passes. See `KB-CONTENT-TEMPLATE.md`'s "Shared Claims Glossary" section for the current entries (`sugar-free-no-added-sugar`, `low-fat-fat-free`, `low-saturated-fat`, `gluten-free`, `no-preservatives`, `high-protein-source-of-protein`, `high-fiber-source-of-fiber`, `low-calorie-energy-free`, `unsubstantiated-health-claim`), every threshold is still marked NEEDS CITATION pending real verification.

**Category list, DECIDED (§11 Q7), 15:**

1. Bakery goods / products
2. Snacks, extruded/fried (chips, namkeen, bhujia)
3. Beverages, non-alcoholic (juices, functional drinks, kombucha)
4. Dry mixes/premixes (dosa/idli mix, instant mixes)
5. Staples, atta/flour & cereal-based
6. Staples, spices & spice blends
7. Spreads/nut butters
8. Sweeteners (jaggery, natural sweeteners, sugar substitutes)
9. RTE/RTC (ready-to-eat/ready-to-cook meals)
10. Dairy-adjacent (plant-based alternatives, paneer-adjacent)
11. Protein/energy bars
12. Pickles/chutneys/relishes
13. Honey/syrups
14. Tea & coffee
15. Confectionery/chocolate

Split from the original 12-item candidate list: "Staples (atta, spices)" became two separate categories (#5/#6) since atta/flour and spices sit under different FSS standards, not process variants of the same one. Added #14 (tea & coffee) and #15 (confectionery/chocolate), common early-stage D2C categories not on the original list. These two additions are a best guess, not informed by First Batch's actual inbound deal flow, worth a gut-check against real brief categories before KB sourcing starts on them specifically.

**Explicitly out:** nutraceuticals/health supplements (separate FSS regs, complex, v2), alcohol, meat/fish.

**This is a content project, not just an engineering one.** The KB needs sourcing from actual FSSAI regulations/schedules and a review pass before anything ships, a wrong mandatory-test list or a wrong license tier is the kind of error that costs a founder money or time, not just a bug report. Recommend: engineering builds the schema and pipeline: 
- pipeline can go live once the schema is built with 1-2 categories.
- **content sourcing/review is the actual critical path**, not the wizard UI.

**Sourcing/review model, ownership, cadence, DECIDED (§11 Q5).** H sources and brings the KB content herself, written directly from FSSAI's published Schedules/Regulations/gazette notifications (not from memory or a generalist's summary), with every rule citing its source in the `sources` field (§6 schema). Reviewed quarterly, a calendar backstop, not trigger-based off regulation-change alerts. Practical implications of quarterly-not-trigger-based:

- A regulation change that lands mid-quarter can sit unreflected in the KB for up to ~3 months. Acceptable given the "informational, not legal advice" framing (§1) and that FSSAI Schedule changes aren't frequent, but worth H knowing this is the tradeoff being made, not an oversight.
- `lastReviewed` (§6 schema) should be shown on the report itself, not just tracked internally, "content reviewed as of [date]" is what makes a 3-month-old answer honest rather than silently stale to the founder reading it.
- Since H is both sourcer and reviewer, there's no second set of eyes in this model, the earlier idea of a network partner or paid consultant as an independent check (see the options discussed when Q5 was scoped) isn't in play for now. Fine as a v1 starting point; worth revisiting if/when this tool has real traffic and the cost of a wrong answer goes up.

## 7. Report delivery (PDF), DECIDED: `@react-pdf/renderer`

Scope requires "receive report (on-screen + PDF)." Going with server-generated branded PDF via `@react-pdf/renderer`, not the print-stylesheet route.

**Why this over `window.print()`**: a real branded, consistent PDF (First Batch fonts/colors, controlled page breaks, works identically regardless of the founder's browser) that can be emailed as an actual attachment, not just something the founder has to remember to generate themselves.

**Why this over headless-Chrome PDF (Puppeteer)**: `@react-pdf/renderer` builds the PDF directly through its own PDF engine, no browser binary, no Chromium bundle-size fight, no cold-start-boots-a-browser latency. It stays inside normal Vercel serverless function limits (small bundle, fast, low memory), the whole reason it was picked over the browser-based options discussed earlier.

**The real cost, so it's explicit**: this is the first actual npm dependency this repo will carry (everything else is zero-dependency Node using only `fetch`). It also means **two templates to keep in sync**, the on-screen HTML report (`report.html?id=`) and the `@react-pdf/renderer` component tree that renders the PDF version. They read from the same KB/report-data payload, but the layout code itself is written twice, once in HTML/CSS, once in `@react-pdf/renderer`'s `<Document>/<Page>/<Text>` components. Any report-layout change has to be made in both places, worth a shared "what does the report contain" checklist so the two don't quietly drift.

**Implementation shape**:
- New dependency: `@react-pdf/renderer` (works in a plain Node serverless function, doesn't require the rest of the app to be React; it's just imported inside `api/launch-map-report.js` to build the PDF buffer).
- `POST /api/launch-map-report`, after the KB lookup and Airtable write, also renders the PDF (`renderToBuffer()`) and either attaches it directly to the Resend confirmation email, or uploads it somewhere (Airtable attachment field, or a blob store) and stores the URL, so `GET /api/launch-map-report?id=` can serve "view on-screen" and "download PDF" as two different responses from the same stored record.
- On-screen `report.html` stays a normal page (still needed for the shareable-link requirement), the PDF is a separate rendering path, not derived from that HTML.

## 8. API additions

Follow the established per-form pattern exactly (`api/founder-intake-submit.js` is the closest analog, copy its shape): own file under `api/`, own Airtable table name as a constant, same honeypot field (`body.website`), same in-memory per-instance rate limiter (`WINDOW_MS`/`MAX_PER_WINDOW`/`hits` Map), same `clip()` field-length guard, same fail-open-to-email-but-fail-closed-to-client behavior on Airtable errors (502 to client, still notify H by email so no lead is silently lost).

| Endpoint | Auth | Body | Behavior |
|---|---|---|---|
| `POST /api/launch-map-summarize` | none | 6 wizard answers | Server-side KB lookup, returns free summary only. No Airtable write, this is a preview, not a lead yet, so it skips the rate-limit-then-write path the other endpoints use |
| `POST /api/launch-map-report` | none | 6 answers + `{name, company, phone, ...}` matching this repo's `camelCase` body convention (see `founder-intake-submit.js`'s `validate()`), not the `PascalCase` `fields` object from the stale handoff doc | Full KB lookup, Airtable write to a new table, renders the PDF via `@react-pdf/renderer` (§7), Resend notify to H, Resend report email to founder **with the PDF attached**, returns report payload + token |
| `GET /api/launch-map-report?id=` | none (unlisted-URL security, same soft-gate philosophy as the network unlock) | (no body) | Fetch a previously generated report by token, on-screen HTML by default, `?format=pdf` re-renders/serves the PDF for the "share link" and "download again later" cases |
| `POST /api/launch-map-waitlist` | none | email + typed/selected category | Separate lightweight lead type, category-not-covered signups, useful for prioritizing which KB categories to build next |

Airtable: new table, e.g. `Launch Map Leads`, in the same base (`AIRTABLE_BASE_ID=appm5hPqDHPQcXrhX`, per the env-var comments already in `founder-intake-submit.js`/`join-network-submit.js`), matches the "one table per form" pattern this repo already uses (`Founder Project Intake`, `Referral-Partner-Intake`) rather than overloading an existing table.

No new env vars needed, reuse `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, all already set per the existing functions' header comments.

## 9. Non-functional requirements

- **Accuracy over completeness**, a category not in the KB should route to the waitlist, never guess. This is the whole reason v1 is scoped to 10-15 deep categories instead of broad shallow coverage.
- **Disclaimer visible on every output screen** (summary, full report, PDF), not buried in a footer link.
- **Mobile-first**, founders filling this out are the same audience as `start.html`, likely on phones; stepped wizard needs to work at the 640px breakpoint already defined in `style.css`.
- **Analytics**, GA4/Meta Pixel, if/when added to this repo (not present yet, check before assuming it's wired up), extended to track: wizard starts, wizard completions, summary views, email-gate submits, report views, PDF downloads, waitlist signups. This funnel has more steps than the existing three forms, so drop-off-by-step is the useful metric, not just submit count.
- **Spam/rate-limiting** on the two POST endpoints, this repo already has a working pattern (honeypot + per-instance IP rate limiter, see `rateLimited()` in `founder-intake-submit.js`), reuse it directly rather than designing something new. A compliance report generator is a more expensive endpoint to abuse than a lead form, so keep the limiter on the summarize endpoint too even though it doesn't write to Airtable.
- **KB versioning**, each report should record which KB version produced it, so a later regulation change doesn't silently make old shared report links wrong without a way to know.

## 10. Out of scope for v1

- Chat-style copilot / free-text Q&A.
- Nutraceuticals, alcohol, meat/fish categories.
- Real accounts, saved history across sessions, multi-report comparison.
- Auto-updating KB from live regulation feeds, updates are a manual content/review process for now.

## 11. Open questions for H

1. ~~Tool name and page URL + nav placement~~, DECIDED: `launch-map.html`, in nav.
2. ~~Free-text ingredients vs. curated tag-select~~, DECIDED: curated tag-select (§5). Adds a per-category ingredient tag list to the KB scope.
3. ~~PDF approach~~, DECIDED: server-generated PDF via `@react-pdf/renderer` (§7).
4. ~~New Airtable table vs. new columns~~, DECIDED: new Airtable table.
5. ~~Sourcing/review model, ownership, cadence~~, DECIDED: sources-first (§6), H sources/brings the KB content herself, reviewed quarterly. Calendar-backstop cadence, not trigger-based, see note in §6 on what quarterly means in practice.
6. Booking-a-call link, scope mentions "book a call (link to H)" but no booking link exists anywhere in the current site; needs a Calendly/cal.com link before this ships.
7. ~~Final category list~~, DECIDED: 15 categories, locked in §6. Flagged caveat: 2 of the 15 (tea & coffee, confectionery) are additions not validated against actual First Batch deal flow, worth a quick check before KB sourcing starts on those two specifically.
