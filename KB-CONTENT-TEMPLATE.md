# Launch Map, KB Content Template
> Fill this in directly, one block per category (15 total, listed at the bottom). Write in plain language, you don't need to match any code format, just fill in every field. When a batch is ready, tell me and I'll convert it into the actual data files.
> **Official sources only.** Cite fssai.gov.in / foscos.fssai.gov.in directly, the actual gazette notification, compendium PDF, or FoSCoS schedule, not consultancy blogs, law-firm summaries, or "FSSAI fee guide" style sites. Those third-party sites are where the errors in this template originally came from (see below); the official compendium PDFs are long and sometimes badly OCR'd, but they're the actual source of truth. If you're not sure of the exact citation, write what you know and flag it "NEED CITATION", better to flag a gap than guess at one, and better a real official page than a confident-sounding blog.
> **License tier is not a turnover table.** FSSAI forces Central License regardless of turnover for exporters/importers, e-commerce sellers, multi-state operators, and a fixed list of always-central categories (confirmed against the official FoSCoS "Kind of Business Eligibility" schedule). Since this tool's users are D2C brands selling online, the e-commerce trigger applies to almost everyone, get this section right, it's the part most likely to give a founder a wrong, consequential answer if rushed.
> **Turnover bands and fees, CONFIRMED against the official FoSCoS schedule** (foscos.fssai.gov.in, "Kind of Business Eligibility," updated 01.04.2026), read directly, not from a summary: Registration ≤₹1.5 crore = ₹100/year, State License ₹1.5cr–₹50cr = **flat ₹5,000/year**, Central License above ₹50cr = ₹7,500/year. **Correction from an earlier draft of this template**: it previously showed State License fee as a capacity-based slab (₹2,000/₹3,000/₹5,000 by tonnes/day), that table was invented, not sourced, and the actual official schedule has no such capacity tiering for General Manufacturing. Use the flat ₹5,000 figure for any category that falls under "General manufacturing" per the FoSCoS schedule (this covers most food categories, including bakery wares, snacks, sweeteners, beverages, RTE, check the schedule's category list rather than assuming). A few Kind-of-Business types (hotels by star rating, dairy/meat/fish/vegetable-oil processing, central government catering, railway catering) have their own separate fee rows, check the schedule per category rather than assuming General Manufacturing always applies.
> **Ingredient lists need real depth.** "Flour" or "sweetener" isn't one ingredient, see the worked examples below for the level of breadth expected (15-25+ items for ingredient-rich categories, grouped, with allergen/vegan/sugar-equivalent metadata where relevant, see `launch-map-data.js` for the exact fields used). A handful of generic items isn't enough for a founder to actually find what they use.
> **Claims aren't per-category.** "Don't say low-fat / sugar-free / healthy" is not useful, a founder needs the actual threshold (e.g. sugar-free = ≤0.5g sugars per 100g) and, for sugar specifically, the full list of what counts as sugar (jaggery and honey count, stevia and erythritol don't). These thresholds come from FSSAI's Advertising & Claims Regulations, confirmed directly against the official Schedule I compendium, and are the same across all 15 categories, see the **Shared Claims Glossary** near the bottom. For each category, just pick which claims are realistic for founders in that category to attempt (e.g. "high protein" matters for protein bars, barely matters for pickles), don't re-derive the thresholds each time.

---

## WORKED EXAMPLE 1, Bakery goods / products

**Category ID:** bakery-goods
**Display name:** Bakery goods / products

**Ingredient tags** (grouped, expand any group that's thin; this is a starting list, not exhaustive):

*Flours/bases:*
- Whole wheat flour (atta), allergen: yes (gluten)
- Refined wheat flour (maida), allergen: yes (gluten)
- Semolina (sooji/rava), allergen: yes (gluten)
- Rice flour, allergen: no
- Besan (gram/chickpea flour), allergen: no
- Multigrain flour blend, allergen: check blend components

*Sweeteners:*
- White refined sugar, allergen: no
- Jaggery (gur), allergen: no
- Brown sugar, allergen: no

*Fats/dairy:*
- Edible vegetable oil, allergen: no
- Butter/ghee, allergen: yes (milk)
- Milk solids / milk powder, allergen: yes (milk)

*Raising agents/additives:*
- Baking powder, allergen: no
- Yeast, allergen: no
- Preservative (Class II), allergen: no
- Emulsifier, allergen: no
- Artificial flavouring substance, allergen: no
- Permitted food colour, allergen: no

*Other:*
- Nuts/dry fruits (specify), allergen: yes (tree nuts, if used)
- Eggs (if used in recipe), allergen: yes

**FSS category code + standard:** [e.g. "Appendix B, Category 07.1, Bread and ordinary bakery wares", NEED CITATION if unsure of exact code]

**License tier, answer each trigger question, don't skip to a turnover guess:**
- Does this category commonly involve export/import? [yes/no]
- Does this category commonly involve e-commerce/D2C online selling? [yes/no, almost certainly YES for this tool's audience]
- Is this category on FSSAI's fixed always-Central list (5-star hotel catering, large-capacity storage, etc.)? [yes/no, check, don't assume no]
- Does the founder's business commonly span 2+ states at this stage? [usually no for early-stage, note if this category is an exception]
- **If none of the above apply**, turnover bands still matter as the fallback (thresholds and fees confirmed against the official FoSCoS "Kind of Business Eligibility" schedule, effective 1 April 2026):
  - Registration: turnover ≤ ₹1.5 crore AND meets petty-operator/production-scale criteria, fee **₹100/year**, [note any production-capacity edge case for this category, or "no known edge case"]
  - State License: ₹1.5 crore – ₹50 crore, fee **flat ₹5,000/year** for General Manufacturing (no capacity-based slab, confirm this category actually falls under General Manufacturing in the FoSCoS schedule, a few Kinds of Business have their own separate fee rows)
  - Central License: turnover > ₹50 crore, or any trigger above, fee **₹7,500/year**

**Mandatory tests:**
| Test name | Lab type | Indicative cost | Frequency |
|---|---|---|---|
| [e.g. Moisture content] | NABL | [e.g. ₹1,500–2,500] | [e.g. per batch / per production run] |
| [add more rows as needed] | | | |

**Label requirements:**
- Must-have declarations: [e.g. FSSAI logo + license number, veg/non-veg mark, net quantity, batch number, mfg/expiry date, allergen declaration if milk/gluten/nuts used, nutritional info panel]
- Realistic claims for this category (pick IDs from the Shared Claims Glossary near the bottom, don't rewrite thresholds here): sugar-free-no-added-sugar, low-fat-fat-free, no-preservatives, low-calorie-energy-free, unsubstantiated-health-claim

**Step sequence** (ordered checklist, plain language, no duration column, timeline was removed from the report):
1. [e.g. Confirm license tier, check e-commerce/export triggers first, not just turnover]
2. [e.g. Apply for FSSAI license]
3. [e.g. Finalize label with all mandatory declarations]

**Where First Batch can help:**
- Relevant pillars: [e.g. Manufacturing, Testing & compliance]
- CTA copy: [e.g. "Need a CM who already works with bakery brands? Tell us what you're building."]

**Sources:**
| What it backs | Citation | URL | Checked on |
|---|---|---|---|
| [e.g. E-commerce FBO → Central License trigger] | [e.g. FSS Licensing and Registration Regulations, 2011, relevant clause] | [official FSSAI URL] | [date] |
| [one row per major fact above, minimum] | | | |

---

## WORKED EXAMPLE 2, Staples: atta/flour & cereal-based

**Category ID:** staples-atta-flour-cereal
**Display name:** Staples, atta/flour & cereal-based

**Ingredient tags** (this is the level of breadth expected for a flour-heavy category, extend further if you know of more real market variants):

- Whole wheat flour (atta), allergen: yes (gluten)
- Refined wheat flour (maida), allergen: yes (gluten)
- Semolina (sooji/rava), allergen: yes (gluten)
- Rice flour, allergen: no
- Besan (gram/chickpea flour), allergen: no
- Ragi flour (finger millet), allergen: no
- Bajra flour (pearl millet), allergen: no
- Jowar flour (sorghum), allergen: no
- Corn flour / maize flour, allergen: no
- Soya flour, allergen: yes (soy)
- Buckwheat flour (kuttu), allergen: no (gluten-free, note: not a true wheat despite name)
- Amaranth flour (rajgira), allergen: no
- Barley flour, allergen: yes (gluten)
- Oats flour, allergen: check cross-contamination labeling if not certified gluten-free
- Multi-millet flour blend, allergen: check blend components
- Quinoa flour, allergen: no
- Gluten-free flour blend (proprietary mix), allergen: verify per formulation
- Chickpea flour variants (kabuli/desi), allergen: no
- Fortified atta (iron/folic acid added), allergen: same as base flour, note fortification claim rules

**FSS category code + standard:** [NEED CITATION, likely under cereal/cereal products standard, verify exact Appendix/code]

**License tier, trigger questions:**
- Export/import common in this category? [flour/atta export does happen, check]
- E-commerce/D2C common? [yes, typical for this tool's users]
- Always-Central category? [no, unless fortification/specialty claims trigger something, verify]
- Multi-state at early stage? [usually no]
- Turnover fallback: [same 3-tier structure and flat fees as Example 1, confirm this category is "General Manufacturing" in the FoSCoS schedule before assuming the flat ₹5,000 State fee applies]

**Mandatory tests:** [fill in, likely includes moisture content, gluten content (for gluten-free claims specifically), pesticide residue, aflatoxin/mycotoxin testing for cereal-based products]

**Label requirements:**
- Must-have: [standard declarations + specific note: any "gluten-free" claim requires supporting test data and is a regulated claim, not just marketing language]
- Realistic claims for this category (glossary IDs): gluten-free, sugar-free-no-added-sugar, unsubstantiated-health-claim

**Step sequence / Where First Batch can help:** [same structure as Example 1]

**Sources:** [same structure, cite everything]

---

## WORKED EXAMPLE 3, Sweeteners

**Category ID:** sweeteners
**Display name:** Sweeteners (jaggery, natural sweeteners, sugar substitutes)

**Ingredient tags** (natural, less-processed, and artificial sweeteners have meaningfully different label-claim rules, group accordingly):

*Traditional/cane-based:*
- White refined sugar, allergen: no
- Brown sugar / demerara sugar, allergen: no
- Jaggery (gur, cane), allergen: no
- Palm jaggery (karupatti), allergen: no
- Molasses, allergen: no

*Other natural sweeteners:*
- Coconut sugar, allergen: no
- Date sugar, allergen: no
- Date syrup, allergen: no
- Honey, allergen: no (note: honey has its own FSSAI adulteration/purity testing requirements, treat as higher scrutiny)
- Maple syrup, allergen: no

*Sugar syrups/processed:*
- Glucose syrup, allergen: no
- Corn syrup / high-fructose corn syrup, allergen: no
- Maltodextrin, allergen: check source grain

*High-intensity/natural non-nutritive:*
- Stevia (steviol glycosides), allergen: no, regulated claim category
- Monk fruit sweetener, allergen: no, regulated claim category

*Sugar alcohols:*
- Erythritol, allergen: no, note digestive-tolerance labeling considerations
- Xylitol, allergen: no
- Sorbitol, allergen: no

*Artificial/synthetic:*
- Sucralose, allergen: no, regulated claim category
- Aspartame, allergen: no, mandatory warning label for phenylketonurics
- Saccharin, allergen: no
- Acesulfame-K, allergen: no

**FSS category code + standard:** [NEED CITATION, sweeteners span multiple standards depending on natural vs. artificial classification, verify]

**License tier, trigger questions:** [same structure as Example 1, flag if honey specifically has different scrutiny/testing requirements that affect tier or just testing burden]

**Mandatory tests:** [fill in, likely includes purity/adulteration testing (critical for honey specifically), sweetener-content verification for "sugar-free"/"no added sugar" claims]

**Label requirements:**
- Must-have: [standard declarations + specific note: "sugar-free," "no added sugar," "natural sweetener" are all regulated claims requiring substantiation, not marketing language, this category has more claim-related scrutiny than most]
- Realistic claims for this category (glossary IDs): sugar-free-no-added-sugar, low-calorie-energy-free, unsubstantiated-health-claim

**Step sequence / Where First Batch can help:** [same structure as Example 1]

**Sources:** [same structure]

---

## BLANK TEMPLATE, copy this block for each remaining category

**Category ID:**
**Display name:**

**Ingredient tags** (grouped, real breadth, see worked examples above for expected depth):
-

**FSS category code + standard:**

**License tier, trigger questions (answer these, don't jump to a turnover guess):**
- Export/import common in this category? [yes/no]
- E-commerce/D2C common? [yes/no]
- Always-Central category? [yes/no, verify, don't assume no]
- Multi-state at early stage? [yes/no]
- Turnover fallback (only if no trigger above applies), thresholds/fees per the official FoSCoS "Kind of Business Eligibility" schedule:
  - Registration (≤₹1.5cr): ₹100/year, [note any production-capacity petty-operator exception for this category]
  - State License (₹1.5cr–₹50cr): confirm which Kind of Business this category falls under in the FoSCoS schedule, flat ₹5,000/year for General Manufacturing, but a few KOBs (dairy, meat/fish, vegetable oil processing, hotels, government/railway catering) have their own separate fee rows
  - Central License (>₹50cr, or any trigger above): ₹7,500/year

**Mandatory tests:**
| Test name | Lab type | Indicative cost | Frequency |
|---|---|---|---|
| | | | |

**Label requirements:**
- Must-have declarations:
- Realistic claims for this category (glossary IDs from the Shared Claims Glossary below, add a new glossary entry only if a claim genuinely isn't covered yet):

**Step sequence:**
1.

**Where First Batch can help:**
- Relevant pillars:
- CTA copy:

**Sources:**
| What it backs | Citation | URL | Checked on |
|---|---|---|---|
| | | | |

---

## Shared Claims Glossary, defined once, referenced by ID from every category

These come from FSSAI's Advertising & Claims Regulations, not from any individual product category, same threshold whether it's on a biscuit or a beverage. Already implemented in `launch-map-data.js` as `CLAIM_DEFINITIONS`. **Every value marked NEEDS CITATION here still needs to be checked against the actual current FSSAI Schedule**, what's below is the right *structure* (based on how Codex Alimentarius-style claim regulations are typically written, which Indian rules largely follow), not verified figures yet. Verifying this glossary once covers all 15 categories, don't re-verify per category.

| ID | Claim | Threshold (NEEDS CITATION) |
|---|---|---|
| `sugar-free-no-added-sugar` | "Sugar-free" / "No added sugar" / "Unsweetened" | Sugar-free: ≤0.5g sugars/100g or 100ml. "No added sugar": no sugar-equivalent ingredient added, see full sugar/not-sugar list in the code, it's long enough that it isn't repeated here. |
| `low-fat-fat-free` | "Low fat" / "Fat-free" | Low fat: ≤3g/100g (solid) or ≤1.5g/100ml (liquid). Fat-free: ≤0.5g/100g or 100ml. |
| `low-saturated-fat` | "Low saturated fat" | ≤1.5g/100g (solid) or ≤0.75g/100ml (liquid), AND ≤10% of total energy from saturated fat. |
| `gluten-free` | "Gluten-free" | ≤20ppm gluten, lab-substantiated, cross-contamination counts. |
| `no-preservatives` | "No preservatives" / "Preservative-free" | No FSS-classified preservative (incl. Class II) in the ingredient list, an ingredient-list check, not a lab threshold. |
| `high-protein-source-of-protein` | "High/rich in protein" / "Source of protein" | Source: protein ≥10% of total energy. High: protein ≥20% of total energy. |
| `high-fiber-source-of-fiber` | "High in fibre" / "Source of fibre" | Source: ≥3g/100g or ≥1.5g/100kcal. High: ≥6g/100g or ≥3g/100kcal. |
| `low-calorie-energy-free` | "Low calorie" / "Energy-free" | Low calorie: ≤40kcal/100g (solid) or ≤20kcal/100ml (liquid). Energy-free: ≤4kcal/100ml. |
| `unsubstantiated-health-claim` | General "healthy" / immunity / functional-benefit claims | No fixed threshold, needs a specific FSSAI-recognized basis, judged case-by-case, not by a number. Default to flagging for legal review. |

**If a category needs a claim not listed here** (e.g. "high in calcium" for a dairy-adjacent product, "low sodium" for pickles/spice blends), add it to this table with the same rigor, real threshold, real citation, rather than writing vague category-specific text. Tell me and I'll add it to `CLAIM_DEFINITIONS` in the code.

---

## The 15 categories, for reference

1. Bakery goods / products *(worked example 1 above)*
2. Snacks, extruded/fried (chips, namkeen, bhujia)
3. Beverages, non-alcoholic (juices, functional drinks, kombucha)
4. Dry mixes/premixes (dosa/idli mix, instant mixes)
5. Staples, atta/flour & cereal-based *(worked example 2 above)*
6. Staples, spices & spice blends
7. Spreads/nut butters
8. Sweeteners *(worked example 3 above)*
9. RTE/RTC (ready-to-eat/ready-to-cook meals)
10. Dairy-adjacent (plant-based alternatives, paneer-adjacent)
11. Protein/energy bars
12. Pickles/chutneys/relishes
13. Honey/syrups
14. Tea & coffee
15. Confectionery/chocolate

## A lighter starting option

You don't have to do all 15 before anything ships, the pipeline can go live with 1-2 categories while the rest get built out. If it's easier to get momentum, pick the categories closest to what you already know cold and send those first, I'll build the pipeline against those, and the rest can come in behind it without blocking engineering work.
