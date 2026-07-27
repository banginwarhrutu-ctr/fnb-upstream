/* ============================================================
   LAUNCH MAP - KB DATA
   Bakery goods / products (category 1 of 15). Sourced from
   official FSSAI/FoSCoS publications:

   - FSS (Food Product Standards and Food Additives) Regulations,
     2011, chapter-wise compendium (continuously updated),
     https://fssai.gov.in/cms/compendium-fss-fps-fa.php, plus the
     First Amendment Regulations, 2025 (meat sausage standard,
     edible oil refractive-index revisions), notified 10 Jul 2025,
     in force 1 Feb 2026
   - FSS (Advertising and Claims) Regulations, 2018, Compendium
     Version IV (14.12.2022), fssai.gov.in, plus the FSSAI
     advisory against unqualified "100%" claims, dated 28 May 2025
   - FSS (Labelling and Display) Regulations, 2020, Compendium
     Version VIII (09.09.2025), fssai.gov.in
   - FoSCoS "Kind of Business Eligibility" schedule, updated
     01.04.2026, foscos.fssai.gov.in
   - FSS (Licensing and Registration of Food Businesses)
     Amendment Regulations, 2026, gazetted 10 March 2026 (note: no
     consolidated compendium yet folds this in as of this check;
     the 2026 amendment gazette PDF itself is the primary source
     until FSSAI republishes the compendium)
   - FSSAI Recommended Dietary Allowance reference letter,
     F.No. Stds/Nutra(DCGI)/FSSAI-2017, dated 7 January 2020

   Original pass: 22-23 Jul 2026. Sources re-verified against live
   fssai.gov.in pages and current compendium/amendment version
   numbers on 24 Jul 2026; two version numbers and one content gap
   ("100%" claims) were found stale and corrected on that date.
   Full link list is in the README / on request. Remaining gaps
   are flagged in one line at the end of the relevant report
   section, not scattered through the content.
   ============================================================ */

const CLAIM_DEFINITIONS = {

  "sugar-free-no-added-sugar": {
    claim: "“Sugar-free” / “No added sugar” / “Unsweetened”",
    group: "permitted",
    short: "Sugar-free needs ≤0.5g sugars per 100g/100ml, no added sugar of any kind.",
    threshold: "Sugar-free: at most 0.5g sugars per 100g (solid) or 100ml (liquid). No added sugar requires all four to hold: no sugars of any type added (sucrose, glucose, honey, molasses, corn syrup, etc.), no ingredient added that itself contains sugar (jam, sweetened chocolate, sweetened fruit pieces), no ingredient added as a sugar substitute (e.g. concentrated fruit juice, dried fruit paste), and sugar content not increased by other means (e.g. enzymatic starch hydrolysis). If sugars are naturally present despite meeting all four, the label must carry the exact statement \"CONTAINS NATURALLY OCCURRING SUGARS.\"",
    whatCountsAsSugar: [
      "Sucrose (white, brown, refined, or raw sugar)",
      "Jaggery, cane (gur) or palm (karupatti)",
      "Molasses",
      "Coconut sugar",
      "Date sugar / date syrup",
      "Honey",
      "Maple syrup",
      "Glucose syrup / corn syrup / high-fructose corn syrup",
      "Malt extract",
      "Invert sugar",
      "Fruit juice concentrate, when added for its sweetening effect",
      "Dextrose, fructose, lactose, as added ingredients"
    ],
    doesNotCountAsSugar: [
      "Stevia (steviol glycosides)",
      "Monk fruit sweetener",
      "Sucralose, aspartame, saccharin, acesulfame-K",
      "Erythritol, xylitol, sorbitol (sugar alcohols); these still contribute calories, so sugar-free does not automatically justify low calorie too"
    ],
    citation: "FSS (Advertising and Claims) Regulations, 2018, Schedule I Sl. No. 10 and regulation 6(1)",
    verified: true
  },

  "low-sugar": {
    claim: "“Low sugar”",
    group: "permitted",
    short: "Low sugar needs ≤6g per 100g or ≤2.5g per 100ml.",
    threshold: "At most 6g total sugars per 100g (solid) or 2.5g per 100ml (liquid). Distinct from sugar-free above; a product can be low sugar without qualifying as sugar-free.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, Schedule I, Sl. No. 10, as amended",
    verified: true
  },

  "low-fat-fat-free": {
    claim: "“Low fat” / “Fat-free”",
    group: "permitted",
    short: "Low fat ≤3g/100g (or ≤1.5g/100ml); fat-free ≤0.5g/100g or 100ml.",
    threshold: "Low fat: at most 3g fat per 100g (solid) or 1.5g per 100ml (liquid). Fat-free: at most 0.5g per 100g or 100ml.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, Schedule I, Sl. No. 2",
    verified: true
  },

  "low-saturated-fat": {
    claim: "“Low saturated fat” / “Saturated-fat-free”",
    group: "permitted",
    short: "Low sat-fat ≤1.5g/100g; sat-fat-free ≤0.1g/100g or 100ml.",
    threshold: "Low: at most 1.5g saturated fat per 100g (solid) or 0.75g per 100ml (liquid), and saturated fat must provide no more than 10% of total energy. Free: saturated fatty acids at most 0.1g per 100g or 100ml.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, Schedule I, Sl. No. 4",
    verified: true
  },

  "gluten-free": {
    claim: "“Gluten-free”",
    group: "conditional",
    short: "Gluten-free needs an actual lab test showing ≤20ppm gluten, not a guess.",
    threshold: "At most 20 mg/kg (20ppm) gluten. Lab-substantiated, needs an actual test result rather than an ingredient-list inference. Cross-contamination counts, so a facility that also runs wheat-based products needs a batch-level test. If made in a plant that also processes gluten-containing products, the label must state \"Processed in a plant where gluten containing products are manufactured.\"",
    citation: "FSS (Labelling and Display) Regulations, 2020, regulation 2.5, and FSS (Advertising and Claims) Regulations, 2018, Schedule I Sl. No. 19",
    verified: true
  },

  "no-preservatives": {
    claim: "“No preservatives” / “Preservative-free”",
    group: "permitted",
    short: "Needs zero preservatives added, or hidden in, any ingredient you use.",
    threshold: "All four must hold for the specific preservative claimed absent: not added to the food and not removed at time of manufacture, not contained in any ingredient used except where naturally present, is a substance otherwise legally permitted in that product under the Food Additives Regulations 2011, and has not been substituted with a different additive giving the food equivalent characteristics.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, regulation 6(3), as amended",
    verified: true
  },

  "high-protein-source-of-protein": {
    claim: "“High/rich in protein” / “Source of protein”",
    group: "permitted",
    short: "Source of protein ≥6g/100g; high/rich in protein ≥12g/100g.",
    threshold: "Using the official adult RDA of 60g protein/day (men, sedentary): source of protein needs at least 6g protein per 100g (solid), 3g per 100ml (liquid), or 3g per 100kcal. High/rich in protein needs at least 12g per 100g, 6g per 100ml, or 6g per 100kcal. The female RDA (55g/day) gives slightly lower thresholds: 5.5g/11g per 100g.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, Schedule I, Sl. No. 11, applied to the RDA published in FSSAI letter F.No. Stds/Nutra(DCGI)/FSSAI-2017, dated 7 January 2020",
    verified: true
  },

  "high-fiber-source-of-fiber": {
    claim: "“High in fibre” / “Source of fibre”",
    group: "permitted",
    short: "Source of fibre ≥3g/100g; high/rich in fibre ≥6g/100g.",
    threshold: "Source: at least 3g per 100g, 1.5g per 100ml, or 1.5g per 100kcal. High/rich: at least 6g per 100g, 3g per 100ml, or 3g per 100kcal.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, Schedule I, Sl. No. 14",
    verified: true
  },

  "low-calorie-energy-free": {
    claim: "“Low calorie” / “Energy-free”",
    group: "permitted",
    short: "Low calorie ≤40kcal/100g (solid) or ≤20kcal/100ml (liquid).",
    threshold: "Low: at most 40 kcal per 100g (solid) or 20 kcal per 100ml (liquid). Energy-free is defined only for liquids, at most 4 kcal per 100ml; the Schedule gives no solid-food energy-free threshold, so this claim is not available for a solid bakery product.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, Schedule I, Sl. No. 1",
    verified: true
  },

  "unsubstantiated-health-claim": {
    claim: "General “healthy” / immunity / functional-benefit claims",
    group: "conditional",
    short: "\"Healthy\"/immunity claims need real substantiation, not one ingredient.",
    threshold: "Health claims must include both the physiological role of the nutrient or substance and the product's actual composition relevant to that role. Foods cannot be described as \"healthy\" outright; being part of a healthy diet has to be shown against ICMR's dietary guidelines, not asserted from one ingredient. No fixed numeric threshold; judged on substantiation.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, regulations 7 and 8",
    verified: true
  },

  "brand-name-descriptor-disclaimer": {
    claim: "Brand names using “natural,” “fresh,” “pure,” “original,” “traditional,” “authentic,” “genuine,” or “real”",
    group: "conditional",
    short: "Needs a 1.5mm disclaimer below the name if it could mislead about the product.",
    threshold: "If a brand or fancy name uses one of these words in a way that could mislead about the food's true nature, the label must carry the exact disclaimer \"*This is only a brand name or trade mark and does not represent its true nature,\" sized at least 1.5mm (pack under 100 sq cm) or 3mm (pack over 100 sq cm), directly below the name. If actually claimed rather than used as a brand flourish, each word carries its own bar: \"traditional\" requires the recipe to have existed materially unchanged for at least 30 years, \"original\" requires an unchanged traceable formulation, \"natural\" requires only minimal allowed processing with no chemical additions.",
    citation: "FSS (Advertising and Claims) Regulations, 2018, regulation 4(7), as amended, and Schedule V",
    verified: true
  },

  "hundred-percent-unqualified-claim": {
    claim: "Any bare “100%” claim (natural, pure, fruit juice, etc.)",
    group: "banned",
    short: "Banned outright by FSSAI advisory, regardless of formulation.",
    threshold: "FSSAI advisory dated 28 May 2025 directs FBOs to stop using the bare term \"100%\" on labels, packaging, and promotional content altogether, calling it inherently ambiguous and prone to misleading consumers, regardless of food category. This builds on an earlier June 2024 directive specifically against \"100% fruit juice\" on beverages containing added sugar or concentrate. Not a numeric threshold like the claims above; it is a do-not-use direction. Violations fall under the truthful/not-misleading/substantiated standard in the FSS (Advertising and Claims) Regulations, 2018, and can draw fines up to ₹10 lakh.",
    citation: "FSSAI advisory \"FBOs Advised Not to Use '100%' Claims\", dated 28 May 2025, issued under the FSS (Advertising and Claims) Regulations, 2018",
    verified: true
  }

};

/* ============================================================
   CLEAN LABEL RULES
   "Clean label" has no single legal definition under Indian food
   law (unlike the claim thresholds above, which trace to an
   actual regulation). This checks a founder's own ingredient
   selections against the ingredient categories most consumer
   brands, retailers, and export buyers commonly treat as
   disqualifying, plus a smaller set that could go either way
   depending on the exact compound a supplier uses. Matched
   against ingredientTag.id by pattern, so it works uniformly
   across all 15 categories without hand-tagging every ingredient.
   First matching rule wins; order matters, most specific first.
   ============================================================ */
const CLEAN_LABEL_RULES = [
  { pattern: /preservative/i, tier: "flag", reason: "Synthetic preservative (FSSAI Class II). Clean-label formulations typically lean on salt, sugar, acid, oil, refrigeration, or fermentation for shelf life instead." },
  { pattern: /artificial.?flavour|flavour.?artificial/i, tier: "flag", reason: "Artificial flavouring substance, not derived from the named food." },
  { pattern: /colour.?synthetic|synthetic.?colour/i, tier: "flag", reason: "Synthetic/permitted synthetic food colour." },
  { pattern: /^(aspartame|saccharin|sucralose|acesulfame-k|neotame|calcium-saccharin|saccharin-sodium-bev|aspartame-bev|acesulfame-k-bev|neotame-bev)$/i, tier: "flag", reason: "Artificial, non-nutritive synthetic sweetener." },
  { pattern: /^antioxidant$/i, tier: "flag", reason: "Synthetic antioxidant, commonly TBHQ or BHA (FSSAI Class II), used to slow rancidity in oils and fried snacks." },
  { pattern: /estergum/i, tier: "flag", reason: "Synthetic resin-derived stabilizer (glycerol ester of wood rosin)." },
  { pattern: /\bmsg\b|monosodium.?glutamate/i, tier: "flag", reason: "Synthetic flavour enhancer." },
  { pattern: /hydrogenated|vanaspati/i, tier: "flag", reason: "Hydrogenated fat." },
  { pattern: /trehalose/i, tier: "verify", reason: "An industrially processed sugar derivative rather than a recognizable kitchen-shelf sweetener; some clean-label programs allow it, others don't." },
  { pattern: /maltodextrin/i, tier: "verify", reason: "An industrially processed carbohydrate filler/carrier; treatment varies by clean-label program." },
  { pattern: /acidity-regulator/i, tier: "verify", reason: "Could be a natural acid (citric, lactic) or a synthetic one (phosphoric); depends on which specific compound your supplier uses." },
  { pattern: /^emulsifier$/i, tier: "verify", reason: "Could be a natural emulsifier (lecithin) or a synthetic one (mono/diglycerides, polysorbates); depends on the specific compound." },
  { pattern: /^stabilizer$/i, tier: "verify", reason: "Could be a natural gum or starch-based stabilizer, or a synthetic one; depends on the specific compound." },
  { pattern: /anti-caking/i, tier: "verify", reason: "Usually a synthetic mineral additive (e.g. silicon dioxide); a small dose but still worth naming explicitly if you're making a clean-label claim." },
  { pattern: /spice-oleoresin/i, tier: "verify", reason: "A concentrated solvent-extracted spice extract rather than the whole spice; some clean-label programs treat this as processed, others accept it as a natural flavour source." }
];

/* ============================================================
   CATEGORY FACTORY
   Everything that's genuinely shared across all 15 categories
   (core label declarations, source citations, license defaults,
   the generic step sequence, section disclaimers) lives here
   once, so the 14 category entries below only specify what's
   actually different about them: ingredients, FSS classification,
   mandatory tests, conditional declarations, and which claims
   are realistic for that category.
   ============================================================ */

const STANDARD_LABEL_MUSTHAVE = [
  "Name of the product on the front of the pack.",
  "List of ingredients in descending order by weight, with class titles used correctly (e.g. sugar for sucrose, milk solids for milk-derived ingredients)",
  "Nutritional information per 100 g/100 ml and per serving: Energy, protein, carbohydrates, total sugars, added sugars, total fat, saturated fat, trans fat, and sodium.",
  "Veg (green circle) or non-veg (brown triangle) symbol on the principal display panel, near the product name",
  "FSSAI logo and 14-digit license number",
  "Name and complete address of the brand owner, preceded by \"Manufactured by\" / \"Marketed by\" as applicable",
  "Net quantity, MRP, and consumer care details per the Legal Metrology Act",
  "Batch, lot, or code number",
  "Date of manufacture or packaging, and expiry or use-by date",
  "Allergen declaration as \"Contains: ...\" naming gluten-containing cereals by name, milk, egg, tree nuts/peanut, soy, or sulphites at 10mg/kg or more, whichever apply"
];

const STANDARD_SOURCES = [
  { rule: "License tier triggers and fees", citation: "FSS (Licensing and Registration of Food Businesses) Amendment Regulations, 2026, gazetted 10.03.2026, in force 01.04.2026", url: "https://fssai.gov.in/upload/notifications/2026/03/69b2a2c804123Notification%20dt%2010.03.2026.pdf", checkedOn: "2026-07-24" },
  { rule: "License tier triggers and fees (eligibility schedule)", citation: "FoSCoS Kind of Business Eligibility schedule, updated 01.04.2026", url: "https://www.foscosfssai.com/", checkedOn: "2026-07-24" },
  { rule: "Claim thresholds", citation: "FSS (Advertising and Claims) Regulations, 2018, Compendium Version IV (14.12.2022)", url: "https://fssai.gov.in/upload/uploadfiles/files/Compendium_Advertising_Claims_Regulations_14_12_2022.pdf", checkedOn: "2026-07-24" },
  { rule: "\"100%\" claims restriction", citation: "FSSAI advisory directing FBOs to stop unqualified \"100%\" claims, dated 28.05.2025", url: "https://fssai.gov.in/upload/uploadfiles/files/100PercentClaim_PressRelease_English.pdf", checkedOn: "2026-07-24" },
  { rule: "Label must-haves", citation: "FSS (Labelling and Display) Regulations, 2020, Compendium Version VIII (09.09.2025)", url: "https://fssai.gov.in/upload/uploadfiles/files/Comp_Labelling%20Display_Version%20VIII_09_09_2025.pdf", checkedOn: "2026-07-24" },
  { rule: "Compositional standards (general)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, chapter-wise compendium, plus First Amendment Regulations, 2025 (10.07.2025, in force 01.02.2026)", url: "https://fssai.gov.in/cms/compendium-fss-fps-fa.php", checkedOn: "2026-07-24" }
];

const STANDARD_STEP_SEQUENCE = [
  "Product Ideation & Market Research",
  "Formulation Planning & R&D",
  "Ingredient & Packaging Sourcing",
  "SOP Finalization",
  "FSSAI & Label Compliance",
  "Testing & Shelf-Life Validation",
  "Manufacturer Selection",
  "Pilot Run",
  "Production Planning & Procurement",
  "First Commercial Batch Production"
];

function makeCategory(cfg) {
  return {
    displayName: cfg.displayName,
    ingredientTags: cfg.ingredientTags,
    fssCategory: cfg.fssCategory,
    licenseLogic: Object.assign({
      alwaysCentralTrigger: false,
      ecommerceForcesCentral: true,
      registrationRequiresPettyOperatorCheck: true,
      // Fees verified identical across every manufacturing Kind of Business on
      // the FoSCoS eligibility schedule (01.04.2026): the dairy, vegetable oil,
      // meat, fish and slaughter rows carry the same ₹7,500/₹5,000/₹100 as
      // General Manufacturing, so there's no per-KOB fee variation to model.
      stateFee: "₹5,000/year",
      centralFee: "₹7,500/year",
      registrationFee: "₹100/year",
      annualFeeNote: "Since 1 April 2026, FSSAI licenses don't expire, so there's no renewal to file. You still pay the annual fee — miss it and the license is suspended automatically."
    }, cfg.licenseLogicExtra || {}),
    mandatoryTests: cfg.mandatoryTests,
    labelRequirements: {
      mustHave: STANDARD_LABEL_MUSTHAVE,
      conditionalDeclarations: cfg.conditionalDeclarations,
      prohibitedClaimIds: cfg.prohibitedClaimIds
    },
    stepSequence: cfg.stepSequence || STANDARD_STEP_SEQUENCE,
    fbcFooter: {
      relevantPillars: ["Formulation", "Sourcing", "Manufacturing", "Testing & compliance"],
      ctaCopy: cfg.ctaCopy
    },
    sources: STANDARD_SOURCES.concat(cfg.extraSources || []),
    lastReviewed: "2026-07-24, re-verified against live fssai.gov.in pages (compendium/amendment versions and one claims-advisory gap corrected)",
    sectionDisclaimers: {
      license: "License tiers, triggers, and fees are sourced directly from official FSSAI/FoSCoS documents; re-check foscos.fssai.gov.in before a real filing, since these figures can be amended." + (cfg.licenseDisclaimerExtra || ""),
      mandatoryTests: cfg.testsDisclaimer || "Test types reflect standard practice for this category.",
      labelRequirements: "Every declaration and claim threshold above is sourced directly from the official FSSAI compendiums, not a third-party summary.",
      overall: "This is informational, not a substitute for legal counsel or official FSSAI guidance."
    }
  };
}

const LAUNCH_MAP_KB = {

  "bakery-goods": {
    displayName: "Bakery goods / products",

    // Each tag carries metadata beyond just allergen/label, used to
    // personalize the label/claims section to what's actually selected
    // (see buildPersonalizedLabel() in launch-map.js) instead of printing
    // the same static text regardless of ingredients chosen:
    //   allergenType: which declared allergen this triggers, if any
    //   sugarEquivalent: counts as "sugar" for sugar-free/no-added-sugar/low-sugar claims
    //   animalDerived: blocks a vegan claim if selected
    //   isPreservative: blocks a "no preservatives" claim if selected
    ingredientTags: [
      // Flours & bases
      { id: "atta",         label: "Whole wheat flour (atta)",         group: "Flours & bases", allergen: true, allergenType: "gluten" },
      { id: "maida",        label: "Refined wheat flour (maida)",      group: "Flours & bases", allergen: true, allergenType: "gluten" },
      { id: "sooji",        label: "Semolina (sooji / rava)",          group: "Flours & bases", allergen: true, allergenType: "gluten" },
      { id: "barley-flour", label: "Barley flour",                     group: "Flours & bases", allergen: true, allergenType: "gluten" },
      { id: "rice-flour",   label: "Rice flour",                       group: "Flours & bases", allergen: false },
      { id: "besan",        label: "Besan (gram / chickpea flour)",    group: "Flours & bases", allergen: false },
      { id: "ragi-flour",   label: "Ragi flour (finger millet)",       group: "Flours & bases", allergen: false },
      { id: "bajra-flour",  label: "Bajra flour (pearl millet)",       group: "Flours & bases", allergen: false },
      { id: "jowar-flour",  label: "Jowar flour (sorghum)",            group: "Flours & bases", allergen: false },
      { id: "oat-flour",    label: "Oat flour",                        group: "Flours & bases", allergen: false },
      { id: "corn-flour",   label: "Corn / maize flour",               group: "Flours & bases", allergen: false },
      { id: "buckwheat",    label: "Buckwheat flour (kuttu)",          group: "Flours & bases", allergen: false },
      { id: "almond-flour", label: "Almond flour",                     group: "Flours & bases", allergen: true, allergenType: "tree nuts" },
      { id: "coconut-flour",label: "Coconut flour",                    group: "Flours & bases", allergen: false },
      { id: "quinoa-flour", label: "Quinoa flour",                     group: "Flours & bases", allergen: false },
      { id: "multigrain",   label: "Multigrain flour blend",           group: "Flours & bases", allergen: true, allergenType: "gluten (verify blend)" },

      // Sweeteners, real breadth, not just "sugar"
      { id: "sugar",        label: "White refined sugar",              group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "brown-sugar",  label: "Brown sugar / demerara",           group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "jaggery",      label: "Jaggery (gur, cane)",              group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "palm-jaggery", label: "Palm jaggery (karupatti)",         group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "coconut-sugar",label: "Coconut sugar",                    group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "date-sugar",   label: "Date sugar / date syrup",          group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "honey",        label: "Honey",                            group: "Sweeteners", allergen: false, sugarEquivalent: true, animalDerived: true },
      { id: "maple-syrup",  label: "Maple syrup",                      group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "glucose-syrup",label: "Glucose / corn syrup",             group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "stevia",       label: "Stevia (steviol glycosides)",      group: "Sweeteners", allergen: false, sugarEquivalent: false },
      { id: "monk-fruit",   label: "Monk fruit sweetener",             group: "Sweeteners", allergen: false, sugarEquivalent: false },
      { id: "erythritol",   label: "Erythritol / sugar alcohols",      group: "Sweeteners", allergen: false, sugarEquivalent: false },

      // Fats & oils
      { id: "sunflower-oil",label: "Sunflower oil",                    group: "Fats & oils", allergen: false },
      { id: "veg-oil",      label: "Refined vegetable oil",            group: "Fats & oils", allergen: false },
      { id: "coconut-oil",  label: "Coconut oil",                      group: "Fats & oils", allergen: false },
      { id: "olive-oil",    label: "Olive oil",                        group: "Fats & oils", allergen: false },
      { id: "avocado-oil",  label: "Avocado oil",                      group: "Fats & oils", allergen: false },
      { id: "butter",       label: "Butter",                           group: "Fats & oils", allergen: true, allergenType: "milk", animalDerived: true },
      { id: "ghee",         label: "Ghee",                             group: "Fats & oils", allergen: true, allergenType: "milk", animalDerived: true },
      { id: "vegan-butter", label: "Vegan butter / plant margarine",   group: "Fats & oils", allergen: false },
      { id: "milk-solids",  label: "Milk solids / milk powder",        group: "Fats & oils", allergen: true, allergenType: "milk", animalDerived: true },

      // Eggs & egg alternatives
      { id: "eggs",         label: "Eggs",                             group: "Eggs & egg alternatives", allergen: true, allergenType: "egg", animalDerived: true },
      { id: "flax-egg",     label: "Flax egg (ground flaxseed + water)", group: "Eggs & egg alternatives", allergen: false },
      { id: "chia-egg",     label: "Chia egg (chia seed + water)",     group: "Eggs & egg alternatives", allergen: false },
      { id: "aquafaba",     label: "Aquafaba (chickpea brine)",        group: "Eggs & egg alternatives", allergen: false },

      // Raising agents & additives
      { id: "baking-pwd",   label: "Baking powder",                    group: "Raising agents & additives", allergen: false },
      { id: "baking-soda",  label: "Baking soda",                      group: "Raising agents & additives", allergen: false },
      { id: "yeast",        label: "Yeast",                            group: "Raising agents & additives", allergen: false },
      { id: "preservative", label: "Preservative (Class II)",          group: "Raising agents & additives", allergen: false, isPreservative: true },
      { id: "emulsifier",   label: "Emulsifier",                       group: "Raising agents & additives", allergen: false },
      { id: "flavour-artificial", label: "Artificial flavouring substance", group: "Raising agents & additives", allergen: false },
      { id: "flavour-natural",    label: "Natural flavouring substance",   group: "Raising agents & additives", allergen: false },
      { id: "colour-synthetic",   label: "Permitted synthetic food colour",group: "Raising agents & additives", allergen: false },
      { id: "colour-natural",     label: "Natural food colour",            group: "Raising agents & additives", allergen: false },

      // Add-ins & inclusions
      { id: "tree-nuts",    label: "Tree nuts (almond, cashew, walnut, etc.)", group: "Add-ins & inclusions", allergen: true, allergenType: "tree nuts" },
      { id: "peanuts",      label: "Peanuts",                          group: "Add-ins & inclusions", allergen: true, allergenType: "peanut" },
      { id: "sesame",       label: "Sesame seeds",                     group: "Add-ins & inclusions", allergen: true, allergenType: "sesame" },
      { id: "chia-flax",    label: "Chia / flax seeds",                group: "Add-ins & inclusions", allergen: false },
      { id: "chocolate",    label: "Chocolate / cocoa chips",          group: "Add-ins & inclusions", allergen: false, note: "check for milk/soy in the specific chocolate used" },
      { id: "dried-fruit",  label: "Dried fruit (raisins, dates, etc.)", group: "Add-ins & inclusions", allergen: false },
      { id: "desiccated-coconut", label: "Desiccated / shredded coconut", group: "Add-ins & inclusions", allergen: false },

      // Protein additions (protein rusk/cookies are a real, common variant)
      { id: "whey-protein", label: "Whey protein",                     group: "Protein additions", allergen: true, allergenType: "milk", animalDerived: true },
      { id: "pea-protein",  label: "Pea protein isolate",              group: "Protein additions", allergen: false },
      { id: "soy-protein",  label: "Soy protein isolate",              group: "Protein additions", allergen: true, allergenType: "soy" }
    ],

    fssCategory: {
      code: "Category 07, Bakery wares. Confirmed under Manufacturer > General Manufacturing in the official FoSCoS Kind of Business Eligibility schedule.",
      standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011"
    },

    // Flat fees confirmed against the official FoSCoS "Kind of Business
    // Eligibility" schedule. General Manufacturing, which explicitly lists
    // "07, Bakery wares," has flat fees per tier, not a capacity-based slab.
    licenseLogic: {
      alwaysCentralTrigger: false,
      ecommerceForcesCentral: true,
      registrationRequiresPettyOperatorCheck: true,
      stateFee: "₹5,000/year",
      centralFee: "₹7,500/year",
      registrationFee: "₹100/year",
      annualFeeNote: "Since 1 April 2026, FSSAI licenses don't expire, so there's no renewal to file. You still pay the annual fee — miss it and the license is suspended automatically."
    },

    mandatoryTests: [
      { name: "Moisture content",                          lab: "NABL-accredited", cost: "₹1,500-2,500",   frequency: "Per batch / periodic" },
      { name: "Microbiological testing (TPC, yeast & mould)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Rancidity / peroxide value",                lab: "NABL-accredited", cost: "₹1,500-2,000",   frequency: "Periodic" },
      { name: "Heavy metals & contaminant screen",          lab: "NABL-accredited", cost: "₹4,000-6,000",   frequency: "Annual" },
      { name: "Shelf-life / stability study",               lab: "NABL-accredited", cost: "₹15,000-30,000", frequency: "Once per SKU, at launch" }
    ],

    labelRequirements: {
      // Core declarations required on every pre-packaged food label,
      // confirmed against FSS (Labelling and Display) Regulations, 2020,
      // regulation 5 and Schedule II.
      mustHave: [
        "Name of the product on the front of the pack.",
        "List of ingredients in descending order by weight, with class titles used correctly (e.g. sugar for sucrose, milk solids for milk-derived ingredients)",
        "Nutritional information per 100 g/100 ml and per serving: Energy, protein, carbohydrates, total sugars, added sugars, total fat, saturated fat, trans fat, and sodium.",
        "Veg (green circle) or non-veg (brown triangle) symbol on the principal display panel, near the product name",
        "FSSAI logo and 14-digit license number",
        "Name and complete address of the brand owner, preceded by \"Manufactured by\" / \"Marketed by\" as applicable",
        "Net quantity, MRP, and consumer care details per the Legal Metrology Act",
        "Batch, lot, or code number",
        "Date of manufacture or packaging, and expiry or use-by date",
        "Allergen declaration as \"Contains: ...\" naming gluten-containing cereals by name, milk, egg, tree nuts/peanut, soy, or sulphites at 10mg/kg or more, whichever apply"
      ],
      // Conditional declarations that apply only if the specific
      // ingredient or additive named is actually used, per Schedule II.
      conditionalDeclarations: [
        "Bleached/treated maida: label must state \"REFINED WHEAT FLOUR (MAIDA) TREATED WITH IMPROVER/BLEACHING AGENTS, TO BE USED BY BAKERIES ONLY\"",
        "Trehalose added (explicitly listed for biscuits, bread, and cakes): label must state \"Contains Trehalose\"",
        "Added soluble dietary fibre / dextrin (explicitly listed for biscuits, cookies, bread, cake mix, and pastries): label must state \"Contains Dietary Fibre (Dextrin), [source of soluble dietary fibre]\"",
        "10% or more polyols: \"Polyols may have laxative effect\"",
        "10% or more sorbitol/sorbitol syrup: laxative, bloating, diarrhoea in children, and reduced calcium absorption in post-menopausal women warning",
        "Artificial sweeteners (aspartame, acesulfame potassium, sucralose, saccharin, etc.): name the sweetener and add \"NOT RECOMMENDED FOR CHILDREN,\" plus \"NOT FOR PHENYLKETONURICS\" if aspartame is used",
        "Added monosodium glutamate: \"This package contains added MONOSODIUM GLUTAMATE. NOT RECOMMENDED FOR INFANTS BELOW 12 MONTHS AND PREGNANT WOMEN\""
      ],
      // IDs into the shared CLAIM_DEFINITIONS glossary above, not free
      // text. Pick whichever claims are realistic for this category.
      prohibitedClaimIds: [
        "sugar-free-no-added-sugar",
        "low-fat-fat-free",
        "no-preservatives",
        "low-calorie-energy-free",
        "unsubstantiated-health-claim",
        "hundred-percent-unqualified-claim"
      ]
    },

    stepSequence: [
      "Product Ideation & Market Research",
      "Formulation Planning & R&D",
      "Ingredient & Packaging Sourcing",
      "SOP Finalization",
      "FSSAI & Label Compliance",
      "Testing & Shelf-Life Validation",
      "Manufacturer Selection",
      "Pilot Run",
      "Production Planning & Procurement",
      "First Commercial Batch Production"
    ],

    fbcFooter: {
      relevantPillars: ["Formulation", "Sourcing", "Manufacturing", "Testing & compliance"],
      ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
    },

    sources: STANDARD_SOURCES.concat([
      { rule: "Protein RDA reference", citation: "FSSAI RDA letter, F.No. Stds/Nutra(DCGI)/FSSAI-2017, dated 7 January 2020", url: "https://fssai.gov.in/", checkedOn: "2026-07-24" }
    ]),
    lastReviewed: "2026-07-24, re-verified against live fssai.gov.in pages (compendium/amendment versions and one claims-advisory gap corrected)",

    // One disclaimer per report section, printed once at the end of that
    // section rather than repeated per line.
    sectionDisclaimers: {
      license: "License tiers, triggers, and fees are sourced directly from official FSSAI/FoSCoS documents; re-check foscos.fssai.gov.in before a real filing, since these figures can be amended.",
      mandatoryTests: "Test types reflect standard practice for this category.",
      labelRequirements: "Every declaration and claim threshold above is sourced directly from the official FSSAI compendiums, not a third-party summary.",
      overall: "This is informational, not a substitute for legal counsel or official FSSAI guidance."
    }
  },

  /* Category 2 of 15, see KB-CONTENT-TEMPLATE.md for the sourcing model */
  "snacks-extruded": makeCategory({
    displayName: "Snacks, extruded/fried (chips, namkeen, bhujia)",
    fssCategory: { code: "Category 15, Ready-to-eat savouries (cross-references Category 06 for cereal/legume-based extruded snacks). Confirmed under General Manufacturing in the FoSCoS schedule. Extruded-type products specifically fall within the official \"Breakfast Cereal\" standard at FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4.35, which explicitly covers extruded or co-extruded cereal/pulse/tuber-based products in sweet or savoury taste, alongside the dedicated Corn Flakes standard at Ch 2.4.8; namkeen/bhujia blends without a matching named standard fall back to general Category 15 treatment.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4.8 / 2.4.35" },
    testsDisclaimer: "Moisture and acid-insoluble ash only have fixed ceilings if your product actually matches the official extruded breakfast cereal or corn flakes standard — moisture ≤10% if it has dried fruit or nuts in it, ≤7.5% otherwise. A general namkeen or bhujia that doesn't match that identity falls back to standard industry practice instead of a named legal limit.",
    ingredientTags: [
      { id: "potato-flakes", label: "Potato flakes / potato starch", group: "Bases", allergen: false },
      { id: "corn-grits", label: "Corn / maize grits", group: "Bases", allergen: false, note: "Corn Flakes standard (Ch 2.4.8) applies if presented as crisp toasted flakes: moisture ≤7.5%, total ash excluding salt ≤1.0%" },
      { id: "rice-flour", label: "Rice flour", group: "Bases", allergen: false },
      { id: "besan", label: "Besan (gram flour)", group: "Bases", allergen: false },
      { id: "wheat-semolina", label: "Wheat flour / semolina", group: "Bases", allergen: true, allergenType: "gluten" },
      { id: "moong-dal", label: "Moong dal / urad dal (as flour or fried)", group: "Bases", allergen: false },
      { id: "chana-dal-snack", label: "Chana dal (roasted/fried)", group: "Bases", allergen: false },
      { id: "millet-base", label: "Millet base (ragi, jowar, bajra, foxtail, etc.)", group: "Bases", allergen: false, note: "Whole-grain extruded breakfast/snack products need a minimum 25% whole grain on dry weight basis, with cereals/grains listed as the first ingredient, per Ch 2.4.35" },
      { id: "oats-base", label: "Oats base (rolled/steel-cut/flaked)", group: "Bases", allergen: false },
      { id: "sago-pellets", label: "Sago/tapioca pellets (for fryums)", group: "Bases", allergen: false },
      { id: "peanuts", label: "Peanuts", group: "Bases", allergen: true, allergenType: "peanut" },
      { id: "cashews", label: "Cashews", group: "Bases", allergen: true, allergenType: "tree nuts" },
      { id: "makhana", label: "Fox nuts / makhana", group: "Bases", allergen: false },
      { id: "palm-oil", label: "Palm oil", group: "Frying oils", allergen: false },
      { id: "sunflower-oil", label: "Sunflower oil", group: "Frying oils", allergen: false },
      { id: "cottonseed-oil", label: "Cottonseed oil", group: "Frying oils", allergen: false },
      { id: "rice-bran-oil", label: "Rice bran oil", group: "Frying oils", allergen: false },
      { id: "groundnut-oil", label: "Groundnut oil", group: "Frying oils", allergen: false },
      { id: "mustard-oil", label: "Mustard oil", group: "Frying oils", allergen: false },
      { id: "salt", label: "Salt", group: "Seasoning", allergen: false },
      { id: "chili-powder", label: "Red chili powder", group: "Seasoning", allergen: false },
      { id: "turmeric", label: "Turmeric", group: "Seasoning", allergen: false },
      { id: "cumin", label: "Cumin", group: "Seasoning", allergen: false },
      { id: "chaat-masala", label: "Chaat masala", group: "Seasoning", allergen: false },
      { id: "black-salt", label: "Black salt", group: "Seasoning", allergen: false },
      { id: "amchur", label: "Amchur (dry mango powder)", group: "Seasoning", allergen: false },
      { id: "asafoetida", label: "Asafoetida (often wheat-carrier based)", group: "Seasoning", allergen: true, allergenType: "gluten (check carrier)" },
      { id: "citric-acid", label: "Citric acid", group: "Seasoning", allergen: false },
      { id: "cheese-seasoning", label: "Cheese / dairy-based seasoning powder", group: "Seasoning", allergen: true, allergenType: "milk" },
      { id: "cocoa-inclusion", label: "Cocoa / chocolate coating (sweet extruded variants)", group: "Sweet variants", allergen: false },
      { id: "dried-fruit-inclusion", label: "Dried/candied fruit pieces (sweet extruded variants)", group: "Sweet variants", allergen: false, note: "Ch 2.4.35 sets a higher moisture ceiling (10.0% vs 7.5%) specifically for breakfast/snack products containing dehydrated or candied fruit, seeds, or nuts" },
      { id: "sugar", label: "Sugar (sweet-savoury variants)", group: "Sweet variants", allergen: false, sugarEquivalent: true },
      { id: "jaggery", label: "Jaggery", group: "Sweet variants", allergen: false, sugarEquivalent: true },
      { id: "malt-flavouring", label: "Malt derivative flavouring", group: "Sweet variants", allergen: true, allergenType: "gluten (verify grain source)" },
      { id: "whey-protein-snack", label: "Whey protein (fortification)", group: "Protein fortification", allergen: true, allergenType: "milk", note: "Common in the protein-snack trend; no dedicated finished-snack standard, but the ingredient itself sits under Ch 2.5.2's recognized carbohydrate/protein binder list where used" },
      { id: "pea-protein-snack", label: "Pea protein isolate (fortification)", group: "Protein fortification", allergen: false, note: "Falls under the Vegetable Protein Products standard, Ch 2.3.59: protein ≥40% on dry weight basis" },
      { id: "soy-protein-snack", label: "Soy protein isolate (fortification)", group: "Protein fortification", allergen: true, allergenType: "soy", note: "Ch 2.4.20 standard: soy protein isolate specifically requires >90% crude protein on dry basis" },
      { id: "antioxidant", label: "Antioxidant (TBHQ / BHA, Class II)", group: "Additives", allergen: false },
      { id: "acidity-regulator", label: "Acidity regulator", group: "Additives", allergen: false },
      { id: "colour-synthetic", label: "Permitted synthetic colour", group: "Additives", allergen: false },
      { id: "preservative", label: "Preservative (Class II)", group: "Additives", allergen: false, isPreservative: true }
    ],
    mandatoryTests: [
      { name: "Moisture content (≤7.5% general, ≤10.0% if containing dehydrated/candied fruit or nuts per Ch 2.4.35)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch / periodic" },
      { name: "Acid-insoluble ash in dilute HCl (≤0.1% for extruded/breakfast-cereal-format products)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic" },
      { name: "Rancidity / peroxide value (oil quality)", lab: "NABL-accredited", cost: "₹1,500-2,000", frequency: "Periodic" },
      { name: "Acid value of frying oil", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Periodic" },
      { name: "Whole-grain content verification (for products claiming whole-grain status, ≥25% on dry weight basis)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per SKU claiming whole-grain" },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Heavy metals & contaminant screen", lab: "NABL-accredited", cost: "₹4,000-6,000", frequency: "Annual" }
    ],
    conditionalDeclarations: [
      "If made using a blend of edible oils: label must carry \"MULTI-SOURCE EDIBLE OIL\" in bold capitals immediately below the brand name, with each oil's name and percentage by weight declared, plus \"NOT TO BE SOLD LOOSE\"",
      "Whole-grain claim: the product must list cereals/pseudo-cereals/grains as the first ingredient by weight and contain at least 25% whole grain on a dry weight basis, per Ch 2.4.35"
    ],
    prohibitedClaimIds: ["sugar-free-no-added-sugar", "no-preservatives", "gluten-free", "unsubstantiated-health-claim", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Breakfast cereal and extruded/co-extruded product compositional standard, corn flakes standard", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4.35 and Chapter 2.4.8", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "beverages-non-alcoholic": makeCategory({
    displayName: "Beverages, non-alcoholic (juices, functional drinks, kombucha)",
    fssCategory: { code: "Category 14, Beverages excluding dairy products. Confirmed under General Manufacturing in the FoSCoS schedule. Standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.10.6, which sets separate standards for Carbonated Water, Caffeinated Beverages (carbonated and non-carbonated), and Non-carbonated Water Based Beverages, each with a distinct permitted-ingredient list and, for caffeinated drinks, exact caffeine bands and mandatory warning text.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.10.6" },
    testsDisclaimer: "If your drink has caffeine, the law sets a hard range for how much — 145-300mg per litre — plus caps on specific optional ingredients like taurine, D-glucurono-γ-lactone, inositol, and pantothenic acid. These are compositional limits, not just labelling rules, which is why they show up as tests below.",
    ingredientTags: [
      { id: "packaged-water-base", label: "Packaged drinking water / mineral water base", group: "Base", allergen: false, note: "Must independently conform to the Packaged Drinking Water or Mineral Water standard in Ch 2.10.7/2.10.8, not just be treated as a generic ingredient" },
      { id: "fruit-juice", label: "Fruit juice / pulp / concentrate", group: "Base", allergen: false },
      { id: "vegetable-extractive", label: "Vegetable extractive", group: "Base", allergen: false },
      { id: "flower-extractive", label: "Flower extractive (e.g. rose, hibiscus)", group: "Base", allergen: false },
      { id: "herb-spice-derivative", label: "Herb or spice derivative", group: "Base", allergen: false, note: "Ch 2.10.6 requires added herbs to meet safety requirements under the FSS Act and be declared on the label; non-scheduled herbs need toxicological data on file" },
      { id: "tea-extract", label: "Tea extract / green or black tea", group: "Base", allergen: false },
      { id: "coconut-neera", label: "Coconut neera (fresh or processed)", group: "Base", allergen: false, note: "Separately standardized in Ch 2.10.6: fresh neera min 14° Brix, processed min 12° Brix, alcohol capped at 0.5% v/v for both" },
      { id: "kombucha-culture", label: "Kombucha culture (SCOBY)", group: "Base", allergen: false },
      { id: "milk-whey", label: "Milk / whey (functional drinks)", group: "Base", allergen: true, allergenType: "milk" },
      { id: "sugar", label: "Sugar", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "liquid-glucose", label: "Liquid glucose", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "dextrose-monohydrate", label: "Dextrose monohydrate", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "invert-sugar-bev", label: "Invert sugar", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "fructose", label: "Fructose", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "honey", label: "Honey", group: "Sweeteners", allergen: false, sugarEquivalent: true, animalDerived: true },
      { id: "jaggery-syrup", label: "Jaggery syrup", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "stevia", label: "Stevia", group: "Sweeteners", allergen: false, sugarEquivalent: false },
      { id: "sucralose", label: "Sucralose", group: "Sweeteners", allergen: false, sugarEquivalent: false, note: "Capped at 300ppm in carbonated water per Ch 2.10.6" },
      { id: "aspartame-bev", label: "Aspartame", group: "Sweeteners", allergen: false, sugarEquivalent: false, note: "Capped at 700ppm in carbonated water per Ch 2.10.6" },
      { id: "acesulfame-k-bev", label: "Acesulfame-K", group: "Sweeteners", allergen: false, sugarEquivalent: false, note: "Capped at 300ppm in carbonated water per Ch 2.10.6" },
      { id: "saccharin-sodium-bev", label: "Saccharin sodium", group: "Sweeteners", allergen: false, sugarEquivalent: false, note: "Capped at 100ppm in carbonated water per Ch 2.10.6" },
      { id: "neotame-bev", label: "Neotame", group: "Sweeteners", allergen: false, sugarEquivalent: false, note: "Capped at 33ppm in carbonated water per Ch 2.10.6" },
      { id: "citric-acid", label: "Citric acid", group: "Acids & preservation", allergen: false },
      { id: "fumaric-acid", label: "Fumaric acid", group: "Acids & preservation", allergen: false },
      { id: "tartaric-acid", label: "Tartaric acid", group: "Acids & preservation", allergen: false },
      { id: "phosphoric-acid", label: "Phosphoric acid", group: "Acids & preservation", allergen: false },
      { id: "lactic-acid", label: "Lactic acid", group: "Acids & preservation", allergen: false },
      { id: "ascorbic-acid", label: "Ascorbic acid (vitamin C)", group: "Acids & preservation", allergen: false },
      { id: "malic-acid", label: "Malic acid", group: "Acids & preservation", allergen: false },
      { id: "sodium-benzoate", label: "Sodium benzoate (preservative, Class II)", group: "Acids & preservation", allergen: false, isPreservative: true },
      { id: "potassium-sorbate", label: "Potassium sorbate (preservative)", group: "Acids & preservation", allergen: false, isPreservative: true },
      { id: "edible-gum", label: "Edible gum (guar, karaya, arabic, tragacanth, gum ghatti, gellan)", group: "Stabilizers", allergen: false },
      { id: "edible-gelatin-bev", label: "Edible gelatin (as stabilizer)", group: "Stabilizers", allergen: false, animalDerived: true },
      { id: "estergum", label: "Ester gum (glycerol ester of wood resin)", group: "Stabilizers", allergen: false, note: "Capped at 100ppm in carbonated water; Ch 2.10.6 sets its own purity spec (sulphur test, softening point, arsenic/lead limits)" },
      { id: "co2", label: "Carbon dioxide (carbonation)", group: "Carbonation", allergen: false },
      { id: "natural-flavour", label: "Natural flavouring", group: "Flavour & colour", allergen: false },
      { id: "artificial-flavour", label: "Artificial flavouring", group: "Flavour & colour", allergen: false },
      { id: "colour-natural", label: "Natural colour (e.g. beta-carotene)", group: "Flavour & colour", allergen: false },
      { id: "colour-synthetic-bev", label: "Permitted synthetic food colour", group: "Flavour & colour", allergen: false },
      { id: "quinine-salt", label: "Quinine salt (tonic-style drinks)", group: "Functional", allergen: false, note: "Capped at 100ppm as quinine sulphate per Ch 2.10.6" },
      { id: "caffeine-added", label: "Added caffeine", group: "Functional", allergen: false, note: "For a beverage to be classed \"Caffeinated Beverage\" under Ch 2.10.6, total caffeine must sit between 145-300mg/litre; below 145mg/l it is not covered by this specific standard" },
      { id: "taurine", label: "Taurine", group: "Functional", allergen: false, note: "Capped at 2000mg/day per Ch 2.10.6's per-day-quantity table for caffeinated beverages" },
      { id: "glucurono-lactone", label: "D-glucurono-γ-lactone", group: "Functional", allergen: false, note: "Capped at 1200mg/day per Ch 2.10.6" },
      { id: "inositol", label: "Inositol", group: "Functional", allergen: false, note: "Capped at 100mg/day per Ch 2.10.6" },
      { id: "pantothenic-acid", label: "Pantothenic acid", group: "Functional", allergen: false, note: "Capped at 10mg/day per Ch 2.10.6" },
      { id: "b-vitamins-bev", label: "B-vitamins (thiamine, riboflavin, niacin, B6, B12)", group: "Functional", allergen: false, note: "May be added up to 100% RDA per Ch 2.10.6" },
      { id: "electrolytes", label: "Electrolytes / mineral salts (sodium, calcium, magnesium)", group: "Functional", allergen: false },
      { id: "probiotics", label: "Probiotic culture", group: "Functional", allergen: false },
      { id: "whey-protein-bev", label: "Whey protein (protein water/shake positioning)", group: "Functional", allergen: true, allergenType: "milk" },
      { id: "pea-protein-bev", label: "Pea protein isolate (plant-protein beverage)", group: "Functional", allergen: false, note: "Falls under the Vegetable Protein Products standard, Ch 2.3.59: protein ≥40% on dry weight basis" },
      { id: "collagen-peptides-bev", label: "Collagen peptides", group: "Functional", allergen: false, animalDerived: true }
    ],
    mandatoryTests: [
      { name: "Total caffeine content (mg/litre, verifying the 145-300mg/l band for any product marketed as a caffeinated beverage)", lab: "NABL-accredited", cost: "₹2,000-3,000", frequency: "Per batch, caffeinated SKUs", appliesTo: ["caffeine-added"] },
      { name: "Non-caloric sweetener content verification (against the exact ppm caps in Ch 2.10.6 per sweetener)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Per batch", appliesTo: ["stevia", "sucralose", "aspartame-bev", "acesulfame-k-bev", "saccharin-sodium-bev", "neotame-bev"] },
      { name: "Total plate count, coliform, yeast & mould (Ch 2.10.6's specific microbiological limits: TPC ≤50cfu/ml, coliform 0cfu/100ml, yeast & mould ≤2cfu/ml)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Brix / total soluble solids", lab: "NABL-accredited", cost: "₹1,000-1,800", frequency: "Per batch" },
      { name: "pH", lab: "NABL-accredited", cost: "₹500-1,000", frequency: "Per batch" },
      { name: "Base water conformance to Packaged Drinking Water / Mineral Water standard", lab: "NABL-accredited", cost: "₹4,000-7,000", frequency: "Per source, periodic", appliesTo: ["packaged-water-base"] },
      { name: "Preservative content verification", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Periodic", appliesTo: ["sodium-benzoate", "potassium-sorbate"] },
      { name: "Alcohol content (coconut neera and fermented beverages / kombucha, capped at 0.5% v/v for neera per Ch 2.10.6)", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Per batch", appliesTo: ["coconut-neera", "kombucha-culture"] }
    ],
    conditionalDeclarations: [
      "Caffeinated beverages specifically: label must declare caffeine as \"X mg/serving size\", carry the prominent caution \"Not recommended for children, pregnant or lactating women, persons sensitive to caffeine,\" and if taurine/glucuronolactone/inositol/pantothenic acid are used near their caps, must declare a \"consume not more than 500ml per day\" style per-day quantity statement",
      "If artificial or non-nutritive sweeteners are used: name the sweetener, add \"NOT RECOMMENDED FOR CHILDREN\", and add \"NOT FOR PHENYLKETONURICS\" specifically if aspartame is used; products with these sweeteners may only use returnable containers if this labelling is prominent on the bottle itself, not the crown",
      "Added herbs: must be declared by name on the label and, if not already listed in the FSS (Health Supplements...) Regulations, 2016 or these regulations, need toxicological data on file to support their safety",
      "Kombucha and other fermented drinks: confirm actual residual alcohol content stays within the non-alcoholic threshold; trace fermentation alcohol is common and Ch 2.10.6 caps coconut neera specifically at 0.5% v/v as the closest analogous figure, but kombucha itself is not separately named in this chapter, so treat this as a real gap needing direct confirmation before a non-alcoholic label claim"
    ],
    prohibitedClaimIds: ["sugar-free-no-added-sugar", "low-sugar", "low-calorie-energy-free", "no-preservatives", "unsubstantiated-health-claim", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Carbonated water, caffeinated beverage, and non-carbonated water-based beverage compositional standards (permitted ingredients, caffeine bands, sweetener ppm caps)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.10.6, Beverages Non-Alcoholic", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "dry-mixes-premixes": makeCategory({
    displayName: "Dry mixes / premixes (dosa/idli mix, instant mixes)",
    fssCategory: { code: "Category 06, Cereals and cereal products (excludes bakery wares, category 07). Confirmed under General Manufacturing in the FoSCoS schedule. Several specific formats in this category carry their own dedicated standard under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4: Pasta Products (2.4.10), Instant Noodles (2.4.10), Corn Flakes (2.4.8), Custard Powder (2.4.9), Malted/Malt-Based Foods (2.4.11), and Breakfast Cereal (2.4.35). Plain dosa/idli/curry-mix blends without one of these specific product identities fall back to general Cereals and Cereal Products treatment rather than a dedicated named standard.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4" },
    testsDisclaimer: "Instant noodles have different moisture and acid-value limits depending on whether they're fried or not. Malted or malt-based mixes need a full microbiological panel — coliform, Salmonella, Shigella, E. coli, Vibrio — that a plain flour blend doesn't. Which tests apply depends on exactly what you're calling the product.",
    ingredientTags: [
      { id: "rice-flour-rava", label: "Rice flour / idli rava", group: "Bases", allergen: false },
      { id: "urad-dal-flour", label: "Urad dal flour", group: "Bases", allergen: false },
      { id: "wheat-flour", label: "Wheat flour", group: "Bases", allergen: true, allergenType: "gluten" },
      { id: "semolina", label: "Semolina (rava)", group: "Bases", allergen: true, allergenType: "gluten" },
      { id: "besan", label: "Besan", group: "Bases", allergen: false },
      { id: "moong-dal", label: "Moong dal", group: "Bases", allergen: false },
      { id: "chana-dal", label: "Chana dal", group: "Bases", allergen: false },
      { id: "toor-dal", label: "Toor dal", group: "Bases", allergen: false },
      { id: "oats", label: "Oats", group: "Bases", allergen: false },
      { id: "corn-grits", label: "Dehulled, degermed corn grits (for corn flakes)", group: "Bases", allergen: false, note: "Ch 2.4.8 Corn Flakes standard: moisture ≤7.5%, total ash excluding salt ≤1.0%" },
      { id: "tapioca-flour-cp", label: "Sago/tapioca starch (for custard powder)", group: "Bases", allergen: false, note: "Ch 2.4.9 Custard Powder standard: moisture ≤12.5%" },
      { id: "instant-noodle-cake", label: "Pre-gelatinized noodle cake (fried or non-fried)", group: "Instant noodles/pasta", allergen: true, allergenType: "gluten", note: "Ch 2.4.10 standard: fried noodles moisture ≤10.0% and acid value ≤2.0; non-fried noodles moisture ≤13.0%" },
      { id: "pasta-shapes", label: "Pasta shapes (from suji/maida/rice/soy/tapioca flour)", group: "Instant noodles/pasta", allergen: true, allergenType: "gluten (verify base flour)", note: "Ch 2.4.10 Pasta Products standard: moisture ≤12.5%, ash insoluble in dilute HCl ≤0.1%" },
      { id: "malt-extract", label: "Malt extract (barley/wheat/millet)", group: "Malted foods", allergen: true, allergenType: "gluten (verify grain source)", note: "Ch 2.4.11 standard defines three types (diastatic, non-diastatic, brewery-grade) with distinct density and reducing-sugar specs" },
      { id: "malted-milk-base", label: "Malted milk food base (with or without cocoa)", group: "Malted foods", allergen: true, allergenType: "milk" },
      { id: "malt-based-food-base", label: "Malt-based food base (non-dairy, legume-inclusive)", group: "Malted foods", allergen: false, note: "Ch 2.4.11(2) standard: protein ≥7.0%, full microbiological panel (Salmonella, E. coli, Vibrio) mandated" },
      { id: "moong-dal-mix", label: "Moong dal (whole/split, mix base)", group: "Bases", allergen: false },
      { id: "chana-dal-mix", label: "Chana dal (mix base)", group: "Bases", allergen: false },
      { id: "papad-blend", label: "Papad blend (cereal/millet/pulse flour base)", group: "Bases", allergen: false, note: "Ch 2.4.40 standard: moisture ≤15.0%, alcoholic acidity ≤0.2%" },
      { id: "whey-protein-mix", label: "Whey protein (protein dosa/idli mix)", group: "Bases", allergen: true, allergenType: "milk" },
      { id: "soy-protein-mix", label: "Soy protein isolate (protein dosa/idli mix)", group: "Bases", allergen: true, allergenType: "soy", note: "Ch 2.4.20 standard: soy protein isolate specifically requires >90% crude protein on dry basis" },
      { id: "pea-protein-mix", label: "Pea protein isolate (protein dosa/idli mix)", group: "Bases", allergen: false, note: "Falls under the Vegetable Protein Products standard, Ch 2.3.59: protein ≥40% on dry weight basis" },
      { id: "baking-soda", label: "Baking soda", group: "Raising agents", allergen: false },
      { id: "eno", label: "Fruit salt / ENO-type raising agent", group: "Raising agents", allergen: false },
      { id: "yeast", label: "Yeast", group: "Raising agents", allergen: false },
      { id: "salt", label: "Salt", group: "Seasoning", allergen: false },
      { id: "iodised-salt", label: "Iodised salt (mandatory in instant noodle standard)", group: "Seasoning", allergen: false },
      { id: "turmeric", label: "Turmeric", group: "Seasoning", allergen: false },
      { id: "cumin", label: "Cumin", group: "Seasoning", allergen: false },
      { id: "mustard-seeds", label: "Mustard seeds", group: "Seasoning", allergen: false },
      { id: "curry-leaves", label: "Curry leaves (dehydrated)", group: "Seasoning", allergen: false },
      { id: "asafoetida", label: "Asafoetida", group: "Seasoning", allergen: true, allergenType: "gluten (check carrier)" },
      { id: "dehydrated-veg", label: "Dehydrated vegetables (onion, tomato powder)", group: "Seasoning", allergen: false, note: "Ch 2.3.36 Dehydrated Vegetables standard: moisture ≤8.0% whole, ≤5.0% powder; must test negative for peroxidase" },
      { id: "cocoa-powder-malt", label: "Cocoa powder (malted milk food with cocoa)", group: "Seasoning", allergen: false },
      { id: "acidity-regulator", label: "Acidity regulator", group: "Additives", allergen: false },
      { id: "anti-caking", label: "Anti-caking agent", group: "Additives", allergen: false },
      { id: "preservative", label: "Preservative (Class II)", group: "Additives", allergen: false, isPreservative: true },
      { id: "sugar", label: "Sugar (sweet mixes / malted food with cocoa)", group: "Sweet variants", allergen: false, sugarEquivalent: true },
      { id: "jaggery", label: "Jaggery (sweet mixes)", group: "Sweet variants", allergen: false, sugarEquivalent: true }
    ],
    mandatoryTests: [
      { name: "Moisture content (against the specific limit for the declared format: noodles fried/non-fried, pasta, corn flakes, custard powder)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch / periodic" },
      { name: "Acid value / acid-insoluble ash (instant noodles ≤2.0 fried; pasta ≤0.1%)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per SKU", appliesTo: ["instant-noodle-cake", "pasta-shapes"] },
      { name: "Total protein and total fat (malted milk food: protein ≥12.5% without cocoa / ≥11.25% with cocoa)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per SKU, malted-food formats", appliesTo: ["malted-milk-base", "malt-based-food-base"] },
      { name: "Solubility test (malted milk food ≥85% without cocoa / ≥80% with cocoa)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per SKU, malted-food formats", appliesTo: ["malted-milk-base", "malt-based-food-base"] },
      { name: "Full microbiological panel (bacterial count, coliform, yeast & mould, Salmonella, Shigella, E. coli, Vibrio cholerae)", lab: "NABL-accredited", cost: "₹5,000-8,000", frequency: "Quarterly, mandatory for malted/malt-based food formats", appliesTo: ["malted-milk-base", "malt-based-food-base", "malt-extract"] },
      { name: "Rancidity (if oil/ghee included)", lab: "NABL-accredited", cost: "₹1,500-2,000", frequency: "Periodic" },
      { name: "Pesticide residue", lab: "NABL-accredited", cost: "₹3,500-6,000", frequency: "Periodic" },
      { name: "Aflatoxin / mycotoxin screening", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Periodic" }
    ],
    conditionalDeclarations: [
      "Instant noodles specifically: the manufacturer must label any accompanying seasoning sachet distinctly on the package, and the product must be presented as \"Fried noodles\" or \"Non-fried noodles\" per Ch 2.4.10",
      "Malted milk food specifically: must not contain any added starch except starch natural to cocoa powder, and must not contain added non-milk fat or any preservative/added colour",
      "If polyols or polydextrose make up 10% or more of the product: \"Polyols may have laxative effect\" or \"Polydextrose may have laxative effect\" as applicable",
      "If added soluble dietary fibre (dextrin) is used: label must state \"Contains Dietary Fibre (Dextrin), [source of soluble dietary fibre]\""
    ],
    prohibitedClaimIds: ["gluten-free", "no-preservatives", "sugar-free-no-added-sugar", "unsubstantiated-health-claim", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Instant noodle, pasta, corn flakes, custard powder, and malted/malt-based food compositional standards", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4, regulations 2.4.8 through 2.4.11", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "staples-flour": makeCategory({
    displayName: "Staples, atta/flour & cereal-based",
    licenseLogicExtra: { millingAlwaysState: true },
    fssCategory: { code: "Category 06, Cereals and cereal products. Confirmed under General Manufacturing in the FoSCoS schedule, with a specific carve-out for Grains/Cereals/Pulses Milling units: they stay on State License across the full 1.5cr-50cr turnover band and are not pushed to Central License by turnover alone (only by export/e-commerce/multi-state triggers); non-milling units in this category follow the standard bands. Each flour type is individually standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4 (Cereals and Cereal Products), with its own moisture/gluten/protein/ash/particle-size table, not one blanket flour standard.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4" },
    licenseDisclaimerExtra: " Milling units specifically: the FoSCoS schedule carves out an exception where turnover alone never forces Central License, only the export/e-commerce/multi-state triggers do; confirm this applies to your specific operation before assuming State License at high turnover.",
    testsDisclaimer: "There's no single gluten floor for flour — atta needs ≥6.0%, maida ≥7.5%, and durum semolina is tested on protein minimum instead. Separately, almost every cereal standard shares one grain-quality marker: a uric acid ceiling of 100mg/kg.",
    ingredientTags: [
      { id: "atta", label: "Whole wheat flour (atta)", group: "Wheat flours", allergen: true, allergenType: "gluten", note: "Ch 2.4.1 standard: moisture ≤14%, gluten ≥6.0%, granularity ≥98% through 500-micron sieve, uric acid ≤100mg/kg" },
      { id: "resultant-atta", label: "Resultant wheat flour (resultant atta)", group: "Wheat flours", allergen: true, allergenType: "gluten" },
      { id: "protein-prachur-atta", label: "Protein-rich wheat flour (protein prachur atta)", group: "Wheat flours", allergen: true, allergenType: "gluten", note: "Ch 2.4.1 standard requires ≥15% total protein, blended with up to 15% groundnut/soya/whey protein flour" },
      { id: "maida", label: "Refined wheat flour (maida)", group: "Wheat flours", allergen: true, allergenType: "gluten", note: "Ch 2.4.2 standard: gluten ≥7.5% (higher than atta's 6.0%), granularity ≥98% through 212-micron sieve" },
      { id: "durum-maida", label: "Durum wheat maida", group: "Wheat flours", allergen: true, allergenType: "gluten" },
      { id: "sooji", label: "Semolina (suji/rawa)", group: "Wheat flours", allergen: true, allergenType: "gluten", note: "Ch 2.4.3 standard: same parameter shape as atta/maida (moisture, ash, gluten, alcoholic acidity, uric acid ≤100mg/kg), not a protein floor; the ~11% protein figure belongs to durum wheat semolina (Ch 2.4.23) specifically, a separate standard, not plain suji" },
      { id: "durum-semolina", label: "Durum wheat semolina", group: "Wheat flours", allergen: true, allergenType: "gluten", note: "Ch 2.4.23 standard: protein (N×5.7) ≥10.5% (durum) / ≥11.5% (whole durum) on dry basis, moisture ≤13.0%/2.1%, uric acid ≤100mg/kg" },
      { id: "whole-durum-semolina", label: "Whole durum wheat semolina", group: "Wheat flours", allergen: true, allergenType: "gluten" },
      { id: "multigrain-atta", label: "Multigrain flour (atta)", group: "Wheat flours", allergen: true, allergenType: "gluten", note: "Ch 2.4.37 standard: 50-90% must be whole wheat by composition, rest from permitted ingredients; the wheat percentage must be declared on label" },
      { id: "vital-gluten", label: "Vital wheat gluten (additive)", group: "Wheat flours", allergen: true, allergenType: "gluten", note: "Ch 2.4.22 Wheat Protein Products standard requires ≥80% crude protein for vital/devitalized gluten" },
      { id: "wheat-bran", label: "Wheat bran", group: "Wheat flours", allergen: true, allergenType: "gluten" },
      { id: "rice-flour", label: "Rice flour", group: "Non-wheat flours", allergen: false },
      { id: "fortified-rice-flour", label: "Rice flour for Fortified Rice Kernel (FRK)", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.24A separate standard: 90% must pass a 250-micron sieve, moisture ≤14%" },
      { id: "ragi-flour", label: "Ragi flour (finger millet)", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.34 standard: crude protein ≥7.0%, moisture ≤10.0%, must pass 1mm sieve" },
      { id: "bajra-flour", label: "Bajra flour (pearl millet)", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.17 standard: crude fat ≤7.0%, protein ≥8.0%" },
      { id: "jowar-flour", label: "Jowar flour (sorghum)", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.18 standard: crude fat ≤4.7% (not 7.0%, that figure belongs to bajra), protein ≥8.5%, moisture ≤12.0%" },
      { id: "mixed-millet-flour", label: "Mixed millet flour blend", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.38 standard covers blends of jowar/bajra/ragi/foxtail/proso/kodo/little/barnyard millets plus buckwheat/amaranth pseudo-millets; protein ≥8.0%, dietary fibre ≥12.0%" },
      { id: "corn-flour", label: "Corn / maize flour, whole", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.21 Whole Maize Flour standard: protein ≥8.0%, crude fat ≥3.1% minimum (unusual, most standards cap fat rather than floor it)" },
      { id: "maize-starch", label: "Maize starch / corn starch", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.7 standard: starch content ≥98.0% on dry basis, pH 4.5-7.0" },
      { id: "besan", label: "Besan (Bengal gram flour)", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.4 standard: protein ≥20.0%, the highest protein floor of any standardized flour in this chapter" },
      { id: "sattu", label: "Roasted Bengal gram flour (chana sattu)", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.33 standard: protein ≥20.0%, moisture ≤8.0%" },
      { id: "soya-flour", label: "Solvent-extracted soya flour", group: "Non-wheat flours", allergen: true, allergenType: "soy", note: "Ch 2.4.13 standard: protein ≥48%, residual food-grade hexane capped at 10ppm" },
      { id: "expeller-groundnut-flour", label: "Expeller-pressed groundnut flour", group: "Non-wheat flours", allergen: true, allergenType: "peanut" },
      { id: "buckwheat-flour", label: "Buckwheat flour (kuttu)", group: "Non-wheat flours", allergen: false },
      { id: "oats-flour", label: "Oat flour / rolled oats", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.12 standard: rolled oats need protein ≥10.0%; broader \"products containing oats\" category has looser requirements" },
      { id: "barley-flour", label: "Barley flour / wholemeal barley powder", group: "Non-wheat flours", allergen: true, allergenType: "gluten" },
      { id: "quinoa-flour", label: "Quinoa flour", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.6(18) standard includes a saponin content cap of ≤0.1%, unique to quinoa among standardized grains" },
      { id: "amaranth-flour", label: "Amaranth flour", group: "Non-wheat flours", allergen: false },
      { id: "sago-flour", label: "Sago / tapioca flour", group: "Non-wheat flours", allergen: false, note: "Ch 2.4.28 standard: starch content ≥96%" },
      { id: "chestnut-flour", label: "Water chestnut flour (singhare ka atta)", group: "Non-wheat flours", allergen: false, note: "Standardized separately at Ch 2.3.64: protein ≥9.0%, moisture ≤12.0%" },
      { id: "iron-fortificant", label: "Iron / folic acid / B12 fortificant premix", group: "Fortification", allergen: false, note: "Ch 2.4.24B Vitamin-Mineral Premix standard specifies exact micronized ferric pyrophosphate or NaFeEDTA dosing bands per blending ratio" },
      { id: "fortified-rice-kernel", label: "Fortified rice kernel (FRK), for blending", group: "Fortification", allergen: false, note: "Ch 2.4.24C: must be sold only for industrial blending at 1:50 or 1:100, never loose or direct-to-consumer" }
    ],
    mandatoryTests: [
      { name: "Moisture content (against the specific limit for the declared flour type)", lab: "NABL-accredited", cost: "₹1,500-2,000", frequency: "Per batch / periodic" },
      { name: "Gluten content (atta ≥6.0%, maida ≥7.5%, ragi/millet flours have separate protein floors instead)", lab: "NABL-accredited", cost: "₹2,000-3,000", frequency: "Per SKU", appliesTo: ["atta", "resultant-atta", "protein-prachur-atta", "maida", "durum-maida", "sooji", "durum-semolina", "whole-durum-semolina", "multigrain-atta", "vital-gluten", "wheat-bran", "barley-flour"] },
      { name: "Protein content, Kjeldahl (besan ≥20%, soya flour ≥48%, quinoa/millets per Ch 2.4.6/2.4.38 floors)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per SKU", appliesTo: ["besan", "sattu", "soya-flour", "expeller-groundnut-flour", "quinoa-flour", "ragi-flour", "bajra-flour", "jowar-flour", "mixed-millet-flour", "corn-flour"] },
      { name: "Total ash and acid-insoluble ash (purity/adulteration check, per flour-specific limit)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic" },
      { name: "Alcoholic acidity (rancidity marker, standardized per flour type)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Periodic" },
      { name: "Uric acid (grain-quality marker, capped at 100mg/kg across nearly all Ch 2.4 standards)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic" },
      { name: "Particle size / granularity (against the specific sieve-mesh spec for the flour type)", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per SKU, not applicable to non-retail intermediate flour" },
      { name: "Residual hexane (solvent-extracted flours specifically, capped at 10ppm)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Per batch, solvent-extracted flours only", appliesTo: ["soya-flour", "expeller-groundnut-flour"] },
      { name: "Pesticide residue", lab: "NABL-accredited", cost: "₹3,500-6,000", frequency: "Periodic" },
      { name: "Aflatoxin / mycotoxin screening", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Periodic" }
    ],
    conditionalDeclarations: [
      "If fortified with iron, folic acid, vitamin B12, etc: label must carry \"fortified with [name of fortificant]\" plus the +F logo at the specified dimensions, optionally with the tagline \"Sampoorna Poshan Swastha Jeevan\"",
      "If claiming \"gluten-free\": lab-substantiated at or below 20mg/kg, and cross-contamination risk from any wheat-milling lines on the same premises needs addressing",
      "Multigrain atta specifically: the actual percentage of whole wheat flour used (must fall within the Ch 2.4.37 mandated 50-90% band) must be declared on the label",
      "Fortified Rice Kernel specifically: every package must carry the blending ratio (1:50 or 1:100) plus the exact statements \"NOT TO BE CONSUMED AS AN INDEPENDENT PRODUCT\" and \"NOT TO BE CONSTRUED AS SUBSTITUTE FOR RICE OR RICE FLOUR\", and may only be sold for industrial blending, never loose or direct to consumer",
      "If soya flour is used at any stage: a urease activity test (≤0.02 pH unit rise) becomes a mandatory conformance check specific to soy-containing blends, per Ch 2.4.1/2.4.2/2.4.37"
    ],
    prohibitedClaimIds: ["gluten-free", "high-fiber-source-of-fiber", "high-protein-source-of-protein", "unsubstantiated-health-claim", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Individual cereal/flour compositional standards (moisture, gluten, protein, ash, particle-size limits per flour type)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4, Cereals and Cereal Products, Version 4 (07.05.2025)", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "staples-spices": makeCategory({
    displayName: "Staples, spices & spice blends",
    fssCategory: { code: "Category 12, Salts, spices, soups, sauces, salads and protein products. Confirmed under General Manufacturing in the FoSCoS schedule. Individually standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.9 (Salt, Spices, Condiments and Related Products), which sets a distinct compositional standard, with its own moisture, total ash, acid-insoluble ash, volatile oil, and extraneous-matter limits, for each of over 40 individual spices, not one blanket spice standard.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.9" },
    testsDisclaimer: "Spices get heavier scrutiny than most categories because adulteration is common and actively policed: lead chromate and metanil yellow dye in turmeric and chilli, Sudan dyes and brick powder in chilli powder, papaya seed in black pepper, and spent spice being resold. Turmeric's lead chromate test in particular isn't just enforcement habit — it's a written compositional requirement.",
    ingredientTags: [
      { id: "turmeric", label: "Turmeric (whole/powder)", group: "Whole/ground spices", allergen: false, note: "Ch 2.9 standard requires \"Test for lead chromate: Negative\" explicitly, plus curcumin content and volatile oil minimums" },
      { id: "red-chili", label: "Red chili / capsicum (whole/powder)", group: "Whole/ground spices", allergen: false },
      { id: "coriander", label: "Coriander (whole/powder)", group: "Whole/ground spices", allergen: false },
      { id: "cumin-white", label: "Cumin, white (jeera)", group: "Whole/ground spices", allergen: false },
      { id: "cumin-black", label: "Cumin, black (shahi jeera)", group: "Whole/ground spices", allergen: false },
      { id: "black-pepper", label: "Black pepper", group: "Whole/ground spices", allergen: false, note: "Ch 2.9 standard includes a minimum piperine content and bulk density spec, not just moisture/ash" },
      { id: "white-pepper", label: "White pepper", group: "Whole/ground spices", allergen: false },
      { id: "green-pepper", label: "Green pepper", group: "Whole/ground spices", allergen: false },
      { id: "cardamom-small", label: "Small (green) cardamom, whole/seeds/powder", group: "Whole/ground spices", allergen: false },
      { id: "cardamom-large", label: "Large (black) cardamom, whole/seeds/powder", group: "Whole/ground spices", allergen: false },
      { id: "cloves", label: "Cloves", group: "Whole/ground spices", allergen: false },
      { id: "cinnamon", label: "Cinnamon", group: "Whole/ground spices", allergen: false },
      { id: "cassia", label: "Cassia", group: "Whole/ground spices", allergen: false },
      { id: "fennel", label: "Fennel (saunf)", group: "Whole/ground spices", allergen: false },
      { id: "mustard-seeds", label: "Mustard seeds", group: "Whole/ground spices", allergen: false },
      { id: "fenugreek", label: "Fenugreek (methi)", group: "Whole/ground spices", allergen: false },
      { id: "star-anise", label: "Star anise", group: "Whole/ground spices", allergen: false },
      { id: "bay-leaf", label: "Bay leaf / tejpat", group: "Whole/ground spices", allergen: false },
      { id: "nutmeg", label: "Nutmeg", group: "Whole/ground spices", allergen: false },
      { id: "mace", label: "Mace", group: "Whole/ground spices", allergen: false },
      { id: "poppy-seeds", label: "Poppy seeds (khus khus)", group: "Whole/ground spices", allergen: false },
      { id: "saffron", label: "Saffron", group: "Whole/ground spices", allergen: false, note: "Ch 2.9 standard uses unique spectrophotometric bitterness, safranal, and colouring-strength parameters, unlike any other spice" },
      { id: "dried-ginger", label: "Dried ginger (sonth)", group: "Whole/ground spices", allergen: false },
      { id: "aniseed", label: "Aniseed", group: "Whole/ground spices", allergen: false },
      { id: "ajowan", label: "Ajowan (carom / ajwain)", group: "Whole/ground spices", allergen: false },
      { id: "caraway", label: "Caraway", group: "Whole/ground spices", allergen: false },
      { id: "dried-mango-powder", label: "Dried mango powder (amchur)", group: "Whole/ground spices", allergen: false },
      { id: "garlic-dehydrated", label: "Dehydrated garlic", group: "Whole/ground spices", allergen: false },
      { id: "onion-dehydrated", label: "Dehydrated onion", group: "Whole/ground spices", allergen: false },
      { id: "celery-seed", label: "Celery seed", group: "Whole/ground spices", allergen: false },
      { id: "asafoetida", label: "Asafoetida (hing / hingra / compounded)", group: "Whole/ground spices", allergen: true, allergenType: "gluten (check carrier, standard compounded asafoetida is wheat-flour based)" },
      { id: "curry-leaves", label: "Curry leaves (dried)", group: "Whole/ground spices", allergen: false },
      { id: "dried-oregano", label: "Dried oregano", group: "Whole/ground spices", allergen: false },
      { id: "dried-mint", label: "Dried mint", group: "Whole/ground spices", allergen: false },
      { id: "dried-basil", label: "Dried sweet basil", group: "Whole/ground spices", allergen: false },
      { id: "dried-rosemary", label: "Dried rosemary", group: "Whole/ground spices", allergen: false },
      { id: "dried-thyme", label: "Dried thyme", group: "Whole/ground spices", allergen: false },
      { id: "dried-sage", label: "Dried sage", group: "Whole/ground spices", allergen: false },
      { id: "pimento", label: "Pimento / allspice", group: "Whole/ground spices", allergen: false },
      { id: "spice-oleoresin", label: "Spice oleoresin (turmeric, chili, black pepper, etc.)", group: "Extracts", allergen: false, note: "Ch 2.9 separately standardizes 28 individual oleoresins, each with a minimum active-component or volatile-oil content, e.g. turmeric oleoresin requires ≥ 3.5% curcuminoid content on a dry basis" },
      { id: "garam-masala", label: "Garam masala blend", group: "Blends", allergen: false },
      { id: "chaat-masala", label: "Chaat masala blend", group: "Blends", allergen: false },
      { id: "sambar-powder", label: "Sambar powder", group: "Blends", allergen: false },
      { id: "biryani-masala", label: "Biryani masala blend", group: "Blends", allergen: false },
      { id: "curry-powder", label: "Curry powder", group: "Blends", allergen: false, note: "Ch 2.9 standard requires a minimum 85% total spice content by weight" },
      { id: "mixed-masala-whole", label: "Mixed masala, whole", group: "Blends", allergen: false, note: "Ch 2.9 tiers mixed masala into three spice-content grades, roughly 85% / 40% / 25% minimum spice content" },
      { id: "mixed-masala-powder", label: "Mixed masala, powder", group: "Blends", allergen: false },
      { id: "seasoning-blend", label: "Multi-ingredient seasoning blend", group: "Blends", allergen: false },
      { id: "salt-substitute", label: "Salt substitute (potassium-based blend)", group: "Additives", allergen: false, note: "Ch 2.9 sets detailed composition and cation limits for salt substitutes specifically, distinct from edible common salt" },
      { id: "common-salt", label: "Edible common salt", group: "Additives", allergen: false },
      { id: "iodized-salt", label: "Iodized / iron-fortified iodized (double fortified) salt", group: "Additives", allergen: false },
      { id: "anti-caking", label: "Anti-caking agent", group: "Additives", allergen: false },
      { id: "acidity-regulator", label: "Acidity regulator", group: "Additives", allergen: false },
      { id: "permitted-colour", label: "Permitted food colour", group: "Additives", allergen: false }
    ],
    mandatoryTests: [
      { name: "Lead chromate test (mandatory, turmeric specifically)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch, turmeric SKUs, must return Negative per Ch 2.9", appliesTo: ["turmeric"] },
      { name: "Adulterant/unauthorized colour screening (metanil yellow, Sudan dyes, brick powder, papaya seed)", lab: "NABL-accredited", cost: "₹3,500-6,000", frequency: "Per batch, high-risk category", appliesTo: ["turmeric", "red-chili"] },
      { name: "Moisture content", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch / periodic" },
      { name: "Total ash and acid-insoluble ash (purity, per Ch 2.9 individual spice limits)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic" },
      { name: "Volatile oil content (per Ch 2.9 individual spice limits, where applicable)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Periodic, oil-bearing spices", appliesTo: ["black-pepper", "cardamom", "cloves", "cinnamon", "spice-oleoresin"] },
      { name: "Extraneous matter / insect damage screen", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch" },
      { name: "Total spice content (curry powder / mixed masala blends, verifying the 85%/40%/25% tiers)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per SKU", appliesTo: ["curry-powder", "mixed-masala-whole", "mixed-masala-powder"] },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Aflatoxin screening", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Periodic" }
    ],
    conditionalDeclarations: [
      "Curry powder and mixed masala blends: the declared spice-content tier (curry powder minimum 85%; mixed masala grades roughly 85%/40%/25%) must actually match formulation, since Ch 2.9 ties the product name itself to the minimum spice percentage",
      "Compounded asafoetida: since the standard base is typically wheat flour or another starch carrier, an allergen declaration for gluten is usually required, verify the specific carrier used",
      "\"Natural\", \"pure\", \"traditional\" claims: subject to Schedule V conditions; don't use these words as a marketing flourish without meeting the specific bar each one carries"
    ],
    prohibitedClaimIds: ["no-preservatives", "unsubstantiated-health-claim", "brand-name-descriptor-disclaimer", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Individual spice compositional standards (moisture, ash, volatile oil, lead chromate test, oleoresin purity)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.9, Salt, Spices, Condiments and Related Products", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "spreads-nut-butters": makeCategory({
    displayName: "Spreads / nut butters",
    fssCategory: { code: "Not explicitly named as its own Kind of Business line in the FoSCoS Kind of Business Eligibility schedule; likely Category 12 (protein products) or Category 04 (nuts and seeds) depending on formulation. Confirm the exact classification against the Food Product Standards Regulations, 2011 directly before filing. The raw nut kernels themselves are individually standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.47, each with its own moisture/defect/rancidity limits, though the ground spread/butter format itself has no dedicated named standard, so the input-kernel quality bar is the enforceable compositional floor.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.47" },
    testsDisclaimer: "The two things that decide pass or fail are rancidity (acidity of the extracted fat) and oil content. Each nut has its own ceiling for rancidity — almond and walnut ≤1.25%, cashew ≤1.25% whole or ≤2.0% in pieces — plus its own oil-content floor, like almond's ≥45.0%. There's no separate standard for the finished spread or butter itself, so these raw-kernel figures are the actual bar you're tested against.",
    ingredientTags: [
      { id: "peanuts", label: "Peanuts / groundnut kernel", group: "Nuts & seeds", allergen: true, allergenType: "peanut", note: "Ch 2.3.47(1) standard: moisture ≤7.0%, damaged kernel (including slightly damaged) ≤5.0% by weight" },
      { id: "almonds", label: "Almonds", group: "Nuts & seeds", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(6) standard: moisture ≤6.0%, oil content ≥45.0%, acidity of extracted oil ≤1.25% as oleic acid, plus 12 separate defect-category limits (rancid/rotten, chipped, doubles/twins, etc.)" },
      { id: "cashews", label: "Cashews", group: "Nuts & seeds", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(7) standard: moisture ≤5.0%, free fatty acid ≤1.25% (whole kernels) / ≤2.0% (cut/pieces), peroxide value ≤10.0 meq/kg" },
      { id: "hazelnuts", label: "Hazelnuts", group: "Nuts & seeds", allergen: true, allergenType: "tree nuts" },
      { id: "sunflower-seeds", label: "Sunflower seeds", group: "Nuts & seeds", allergen: false },
      { id: "sesame-seeds", label: "Sesame seeds", group: "Nuts & seeds", allergen: true, allergenType: "sesame" },
      { id: "walnuts", label: "Walnuts", group: "Nuts & seeds", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(8) standard: moisture ≤5.0%, extraneous vegetable matter ≤1.0%, acidity of extracted fat ≤1.25% as oleic acid" },
      { id: "pistachio", label: "Pistachio", group: "Nuts & seeds", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(3) standard: moisture ≤7.0%, unopened shells ≤2.0%, empty shells ≤1.0%" },
      { id: "chia-seeds-spread", label: "Chia seeds (as inclusion)", group: "Nuts & seeds", allergen: false },
      { id: "flax-seeds-spread", label: "Flax seeds (as inclusion)", group: "Nuts & seeds", allergen: false },
      { id: "dates-spread", label: "Dates (date-nut spreads)", group: "Nuts & seeds", allergen: false, sugarEquivalent: true, note: "Ch 2.3.47(4) standard: moisture ≤30.0%, blemished/damaged units ≤5.0%" },
      { id: "raisins-spread", label: "Raisins (as inclusion)", group: "Nuts & seeds", allergen: false, sugarEquivalent: true, note: "Ch 2.3.47(2) standard: moisture ≤15.0%, damaged raisins ≤2.0%, sugared raisins ≤15.0%" },
      { id: "palm-oil", label: "Palm oil (stabilizer)", group: "Oils & stabilizers", allergen: false },
      { id: "sunflower-oil", label: "Sunflower oil", group: "Oils & stabilizers", allergen: false },
      { id: "emulsifier", label: "Emulsifier", group: "Oils & stabilizers", allergen: false },
      { id: "sugar", label: "Sugar", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "honey", label: "Honey", group: "Sweeteners", allergen: false, sugarEquivalent: true, animalDerived: true },
      { id: "jaggery", label: "Jaggery", group: "Sweeteners", allergen: false, sugarEquivalent: true },
      { id: "stevia", label: "Stevia", group: "Sweeteners", allergen: false, sugarEquivalent: false },
      { id: "cocoa-solids", label: "Cocoa solids / powder (chocolate spreads)", group: "Other", allergen: false, note: "Cocoa beans used to derive this are separately standardized at Ch 2.3.54: moisture ≤8%, moldy beans ≤4%, insect-damaged ≤2% by count" },
      { id: "milk-solids", label: "Milk solids (chocolate spreads)", group: "Other", allergen: true, allergenType: "milk" },
      { id: "salt", label: "Salt", group: "Other", allergen: false },
      { id: "vanilla", label: "Vanilla flavour / pods / powder", group: "Other", allergen: false, note: "Ch 2.3.50 standard sets a minimum vanillin content of 2.0% (wet basis) for genuine vanilla pods, cut vanilla, and vanilla powder alike" }
    ],
    mandatoryTests: [
      { name: "Aflatoxin screening (critical for peanut-based products)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Per batch, high-risk", appliesTo: ["peanuts"] },
      { name: "Acidity of extracted fat / free fatty acid (against the specific nut's Ch 2.3.47 ceiling: ~1.25% oleic acid for almond/walnut, cashew 1.25-2.0%)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per batch", appliesTo: ["almonds", "walnuts", "cashews"] },
      { name: "Peroxide value (cashew-specific ceiling of 10.0 meq/kg, applicable as general rancidity marker for all nut butters)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic", appliesTo: ["cashews"] },
      { name: "Oil content verification (almond ≥45.0% floor per Ch 2.3.47)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per SKU", appliesTo: ["almonds"] },
      { name: "Moisture content (per nut-specific ceiling: peanut ≤7.0%, almond ≤6.0%, cashew ≤5.0%, walnut ≤5.0%)", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch" },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Heavy metals", lab: "NABL-accredited", cost: "₹4,000-6,000", frequency: "Annual" }
    ],
    conditionalDeclarations: [
      "The finished spread/butter format has no dedicated FSSAI compositional standard, so the enforceable quality bar sits at the raw-kernel stage (Ch 2.3.47); document incoming nut-kernel test results against the specific nut's limits, since a finished-product test alone won't map cleanly to a named standard",
      "If vanilla flavouring is claimed as \"real vanilla\" rather than vanillin/artificial: the vanillin content must genuinely reach the Ch 2.3.50 floor of 2.0% on a wet basis for pods, cut vanilla, or powder"
    ],
    prohibitedClaimIds: ["sugar-free-no-added-sugar", "high-protein-source-of-protein", "no-preservatives", "gluten-free", "unsubstantiated-health-claim", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Individual nut kernel compositional standards (peanut, almond, cashew, walnut, pistachio, dates, raisins)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.47, Nuts and Raisins", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "sweeteners": makeCategory({
    displayName: "Sweeteners",
    fssCategory: { code: "Category 11, Sweeteners, including honey. Confirmed under General Manufacturing in the FoSCoS schedule. Individually standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.8 (Sweetening Agents, Including Honey), which sets a distinct compositional standard for each type of sugar, jaggery, and non-nutritive sweetener, not one blanket sweetener standard.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.8" },
    testsDisclaimer: "Each non-nutritive sweetener — saccharin, aspartame, acesulfame-K, sucralose — has its own exact purity spec: molecular formula, purity percentage, and contaminant limits in parts per million. Cane jaggery specifically also has to meet a minimum reducing-sugar requirement, added in 2023.",
    ingredientTags: [
      { id: "sugar", label: "Plantation white sugar", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "refined-sugar", label: "Refined sugar", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "khandsari-sugar", label: "Khandsari sugar", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true, note: "Ch 2.8 standardizes two distinct khandsari varieties separately" },
      { id: "bura-sugar", label: "Bura sugar", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "cube-sugar", label: "Cube sugar", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "icing-sugar", label: "Icing sugar", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "misri", label: "Misri (rock sugar candy)", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "brown-sugar", label: "Brown sugar / demerara", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "dextrose", label: "Dextrose", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "molasses", label: "Molasses", group: "Traditional/cane-based", allergen: false, sugarEquivalent: true },
      { id: "cane-jaggery", label: "Cane jaggery (gur)", group: "Jaggery / gur", allergen: false, sugarEquivalent: true, note: "Standardized separately from other jaggery types; a 2023 amendment added a minimum reducing-sugar requirement to this specific standard" },
      { id: "palm-jaggery", label: "Palm jaggery (karupatti)", group: "Jaggery / gur", allergen: false, sugarEquivalent: true },
      { id: "date-jaggery", label: "Date-palm jaggery", group: "Jaggery / gur", allergen: false, sugarEquivalent: true },
      { id: "coconut-jaggery", label: "Coconut jaggery", group: "Jaggery / gur", allergen: false, sugarEquivalent: true },
      { id: "coconut-sugar", label: "Coconut sugar", group: "Other natural", allergen: false, sugarEquivalent: true },
      { id: "date-sugar", label: "Date sugar", group: "Other natural", allergen: false, sugarEquivalent: true },
      { id: "date-syrup", label: "Date syrup", group: "Other natural", allergen: false, sugarEquivalent: true },
      { id: "honey", label: "Honey", group: "Other natural", allergen: false, sugarEquivalent: true, animalDerived: true, note: "Ch 2.8 sets a 12-parameter standard: specific gravity, moisture, reducing sugars, sucrose, F/G ratio, total ash, acidity, HMF, diastase activity, plus authenticity markers (C4 sugar, pollen count, electrical conductivity)" },
      { id: "maple-syrup", label: "Maple syrup", group: "Other natural", allergen: false, sugarEquivalent: true },
      { id: "glucose-syrup", label: "Liquid glucose / corn syrup", group: "Syrups", allergen: false, sugarEquivalent: true },
      { id: "dried-glucose-syrup", label: "Dried glucose syrup", group: "Syrups", allergen: false, sugarEquivalent: true },
      { id: "golden-syrup", label: "Golden syrup", group: "Syrups", allergen: false, sugarEquivalent: true },
      { id: "invert-sugar", label: "Invert sugar", group: "Syrups", allergen: false, sugarEquivalent: true },
      { id: "malt-extract", label: "Malt extract", group: "Syrups", allergen: true, allergenType: "gluten" },
      { id: "stevia", label: "Stevia (steviol glycosides)", group: "High-intensity/natural", allergen: false, sugarEquivalent: false },
      { id: "monk-fruit", label: "Monk fruit sweetener", group: "High-intensity/natural", allergen: false, sugarEquivalent: false },
      { id: "erythritol", label: "Erythritol", group: "Sugar alcohols", allergen: false, sugarEquivalent: false },
      { id: "xylitol", label: "Xylitol", group: "Sugar alcohols", allergen: false, sugarEquivalent: false },
      { id: "sorbitol", label: "Sorbitol", group: "Sugar alcohols", allergen: false, sugarEquivalent: false },
      { id: "sucralose", label: "Sucralose", group: "Artificial/synthetic", allergen: false, sugarEquivalent: false, note: "Ch 2.8 specifies exact molecular purity and contaminant ppm limits" },
      { id: "aspartame", label: "Aspartame", group: "Artificial/synthetic", allergen: false, sugarEquivalent: false },
      { id: "saccharin", label: "Sodium saccharin", group: "Artificial/synthetic", allergen: false, sugarEquivalent: false },
      { id: "calcium-saccharin", label: "Calcium saccharin", group: "Artificial/synthetic", allergen: false, sugarEquivalent: false },
      { id: "acesulfame-k", label: "Acesulfame potassium", group: "Artificial/synthetic", allergen: false, sugarEquivalent: false },
      { id: "neotame", label: "Neotame", group: "Artificial/synthetic", allergen: false, sugarEquivalent: false },
      { id: "beeswax", label: "Beeswax (confectionery glaze use)", group: "Bee-derived", allergen: false, animalDerived: true },
      { id: "royal-jelly", label: "Royal jelly", group: "Bee-derived", allergen: false, animalDerived: true }
    ],
    mandatoryTests: [
      { name: "HMF (hydroxymethylfurfural), honey specifically", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Per batch, Ch 2.8 caps this at ≤80mg/kg", appliesTo: ["honey"] },
      { name: "Diastase activity, honey specifically", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per batch", appliesTo: ["honey"] },
      { name: "C4 sugar / NMR adulteration screening, honey specifically", lab: "NABL-accredited", cost: "₹5,000-9,000", frequency: "Per batch, high-scrutiny, Ch 2.8 caps C4 sugar at ≤7%", appliesTo: ["honey"] },
      { name: "Pollen count, honey specifically", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Periodic", appliesTo: ["honey"] },
      { name: "Reducing sugar / sucrose ratio (jaggery and gur types)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch", appliesTo: ["jaggery"] },
      { name: "Total ash and acidity (jaggery, sugar, syrups)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic" },
      { name: "Chemical purity assay (non-nutritive sweeteners, against Ch 2.8's molecular-formula and contaminant-ppm specs)", lab: "NABL-accredited", cost: "₹4,000-6,500", frequency: "Per batch", appliesTo: ["stevia", "monk-fruit", "erythritol", "xylitol", "sorbitol", "sucralose", "aspartame", "saccharin", "acesulfame-k", "neotame"] },
      { name: "Moisture content", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch" },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" }
    ],
    conditionalDeclarations: [
      "Table-top sweeteners (aspartame, acesulfame potassium, sucralose, saccharin, neotame, steviol glycoside, polyols): name the sweetener with purity/weight percent of the marker compound, plus \"NOT RECOMMENDED FOR CHILDREN\" (wording varies by sweetener), and \"NOT FOR PHENYLKETONURICS\" specifically for aspartame or aspartame-acesulfame salt",
      "Mixtures of table-top sweeteners: declare each sweetener present plus its individual required warnings; packs up to 100 sq cm may use a font as small as 1.5mm for this declaration",
      "Honey specifically: purity is a known, actively enforced FSSAI/export scrutiny area (sugar-syrup adulteration, rice-syrup adulteration flagged via the 2-AFGP marker in Ch 2.8); confirm supplier NMR or equivalent purity testing before any \"pure honey\" claim",
      "Cane jaggery specifically: since the 2023 amendment, formulation must actually meet the added minimum reducing-sugar requirement, not just the pre-amendment standard"
    ],
    prohibitedClaimIds: ["sugar-free-no-added-sugar", "low-sugar", "unsubstantiated-health-claim", "brand-name-descriptor-disclaimer", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Sweetening agent and honey compositional standards (purity specs for sugars, jaggery/gur variants, honey, non-nutritive sweeteners)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.8, Sweetening Agents Including Honey", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "rte-rtc": makeCategory({
    displayName: "RTE/RTC (ready-to-eat/ready-to-cook meals)",
    fssCategory: { code: "Category 15/16.0, Ready-to-eat savouries and prepared foods. Confirmed under General Manufacturing in the FoSCoS schedule. Thermally processed curry-style RTE meals are individually named under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.4 (Thermally Processed Curried Vegetables / Ready to Eat Vegetables) for shelf-stable retort formats and Chapter 2.3.39 (Frozen Curried Vegetables / Ready-to-Eat Vegetables) for the frozen equivalent, each with its own container-fill and freezing-temperature requirement rather than a single generic RTE rule. Non-vegetarian RTE (chicken curry, egg curry, mutton, keema) falls under the separate Chapter 2.5 (Meat and Meat Products) and Chapter 2.5.3 (Egg and Egg Products), which set species-specific moisture/protein/fat bands for the meat or egg component itself, distinct from the curry-base standard.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.4 / 2.3.39 / 2.5" },
    testsDisclaimer: "A frozen RTC product actually has to reach -18°C at its thermal centre after stabilization — calling it \"frozen\" on the label isn't enough on its own. A shelf-stable, retort-processed RTE product needs commercial sterility testing instead. And if it's non-veg, the meat or egg component adds its own moisture/protein/fat limits on top.",
    ingredientTags: [
      { id: "chicken", label: "Chicken / poultry meat", group: "Proteins, meat & egg", allergen: false, animalDerived: true, note: "Ch 2.5.2(11) standard: boneless chicken must show moisture 60-74.86%, protein 19.50-23.20%, fat 3.50-18%; requires the brown non-veg triangle symbol on the label, not the green circle" },
      { id: "mutton", label: "Mutton / sheep meat", group: "Proteins, meat & egg", allergen: false, animalDerived: true, note: "Ch 2.5.2(10) standard: boneless mutton must show moisture 68-72%, protein 20-22%, fat 4-10%" },
      { id: "chevon-goat", label: "Chevon / goat meat", group: "Proteins, meat & egg", allergen: false, animalDerived: true, note: "Ch 2.5.2(9) standard: boneless chevon must show moisture 74-76%, protein 20-22%, fat 2-4%" },
      { id: "keema-mince", label: "Keema / minced meat (comminuted)", group: "Proteins, meat & egg", allergen: false, animalDerived: true, note: "Falls under Ch 2.5.2's Comminuted or Restructured Meat Products standard: minimum 50% meat with lean meat portion ≥25% of total formulation, max fat 25% for most food animals" },
      { id: "fish-seafood", label: "Fish / seafood", group: "Proteins, meat & egg", allergen: true, allergenType: "fish", animalDerived: true, note: "Fish is covered by the Ch 2.5.1 definition of \"animal\" but this KB has not yet sourced a dedicated fish/seafood compositional sub-standard; confirm the specific applicable clause directly before formulating" },
      { id: "egg-shell", label: "Egg (fresh, in shell)", group: "Proteins, meat & egg", allergen: true, allergenType: "egg", animalDerived: true, note: "Ch 2.5.3 standard: whole chicken egg content must show water 72.8-75.6%, protein 12.8-13.4%, fat 10.5-11.8%, ash 0.8-1.0%" },
      { id: "egg-powder", label: "Egg powder (whole/yolk/white)", group: "Proteins, meat & egg", allergen: true, allergenType: "egg", animalDerived: true, note: "Ch 2.5.3(3) standard: max moisture 2.0% for all three forms; whole egg powder needs min total solids 95.0%, protein ≥45%" },
      { id: "paneer-rte", label: "Paneer", group: "Proteins, meat & egg", allergen: true, allergenType: "milk" },
      { id: "soya-chunks-rte", label: "Soya chunks / textured soy protein", group: "Proteins, meat & egg", allergen: true, allergenType: "soy", note: "Standardized separately at Ch 2.4.27: protein ≥50% on dry matter basis, residual hexane ≤10ppm" },
      { id: "whey-protein-fortificant", label: "Whey protein (as fortificant)", group: "Proteins, meat & egg", allergen: true, allergenType: "milk", note: "Common in high-protein RTE positioning; falls under the Comminuted Meat Products standard's permitted carbohydrate/protein binder list at Ch 2.5.2(2)(7)(c)(i) when used in a meat-based product" },
      { id: "pea-protein-fortificant", label: "Pea protein isolate (as fortificant)", group: "Proteins, meat & egg", allergen: false, note: "Falls under the Vegetable Protein Products standard, Ch 2.3.59: protein ≥40% on dry weight basis" },
      { id: "rice", label: "Rice", group: "Bases", allergen: false },
      { id: "mixed-dal", label: "Mixed dal / pulses", group: "Bases", allergen: false },
      { id: "dehydrated-veg", label: "Dehydrated / frozen vegetables", group: "Bases", allergen: false, note: "Frozen format must reach -18°C at the thermal centre after thermal stabilization before the freezing operation is considered complete, per Ch 2.3.38/2.3.39" },
      { id: "frozen-peas", label: "Frozen green peas", group: "Bases", allergen: false, note: "Standardized separately at Ch 2.3.38.C: alcohol-insoluble solid content capped at 23%, defect tolerances for blond/blemished/fragmented peas" },
      { id: "frozen-beans", label: "Frozen beans (whole/cut/sliced)", group: "Bases", allergen: false, note: "Standardized separately at Ch 2.3.38.A with defined styles and defect-tolerance tables" },
      { id: "frozen-cauliflower", label: "Frozen cauliflower", group: "Bases", allergen: false, note: "Standardized separately at Ch 2.3.38.B with whole/split/floret styles" },
      { id: "frozen-spinach", label: "Frozen spinach / palak", group: "Bases", allergen: false, note: "Standardized separately at Ch 2.3.38.D: salt-free dry matter must be ≥5.5%, mineral impurities ≤0.1%" },
      { id: "quick-frozen-fried-potato", label: "Quick-frozen fried potato (fries/wedges)", group: "Bases", allergen: false, note: "Standardized separately at Ch 2.3.60: moisture ≤78%, free fatty acid in extracted oil ≤1.5% as oleic acid" },
      { id: "edible-fungi-rte", label: "Edible fungi / mushrooms (canned, pickled, or quick-frozen)", group: "Bases", allergen: false, note: "Ch 2.3.62 sets a dedicated standard per processing style (dried, pickled, fermented, quick-frozen, sterilized) with its own moisture/impurity/maggot-damage limits" },
      { id: "table-olives-rte", label: "Table olives (as inclusion)", group: "Bases", allergen: false, note: "Ch 2.3.44 standard: minimum brine salt content 5-8% by type, drained weight ≥40-50% depending on whole vs. stoned" },
      { id: "garam-masala", label: "Garam masala / curry masala", group: "Seasoning", allergen: false },
      { id: "edible-oil", label: "Edible oil", group: "Seasoning", allergen: false },
      { id: "milk-fat-curry", label: "Milk fat / cream (curry base)", group: "Seasoning", allergen: true, allergenType: "milk", note: "Ch 2.3.4 explicitly permits milk fat as an optional ingredient in the curried-vegetable standard" },
      { id: "salt", label: "Salt", group: "Seasoning", allergen: false },
      { id: "coconut-milk-powder", label: "Coconut milk powder", group: "Seasoning", allergen: false, note: "Standardized at Ch 2.3.63: fat on dry basis ≥60.0%, FFA as lauric acid ≤0.2%" },
      { id: "coconut-milk-liquid", label: "Coconut milk / cream (liquid, curry base)", group: "Seasoning", allergen: false, note: "Ch 2.3.51/2.3.52 sets separate fat-content bands: light coconut milk ≥5.0% fat, coconut milk ≥10.0%, coconut cream ≥20.0%, coconut cream concentrate ≥29.0%" },
      { id: "tamarind", label: "Tamarind pulp / concentrate", group: "Seasoning", allergen: false, note: "Ch 2.3.18 standard: pulp TSS ≥32%, concentrate TSS ≥65%" },
      { id: "tomato-puree", label: "Tomato puree / paste", group: "Seasoning", allergen: false, note: "Ch 2.3.14 standard: puree TSS ≥9.0%, paste TSS ≥25%" },
      { id: "ginger-garlic", label: "Ginger-garlic paste", group: "Seasoning", allergen: false },
      { id: "preservative", label: "Preservative (Class II)", group: "Additives", allergen: false, isPreservative: true },
      { id: "acidity-regulator", label: "Acidity regulator", group: "Additives", allergen: false }
    ],
    mandatoryTests: [
      { name: "Commercial sterility (retort/thermally processed shelf-stable RTE)", lab: "NABL-accredited", cost: "₹4,000-7,000", frequency: "Per batch, critical" },
      { name: "Core temperature verification at thermal centre (frozen RTC must confirm -18°C reached, per Ch 2.3.38/2.3.39)", lab: "NABL-accredited or in-house calibrated probe", cost: "₹1,500-2,500", frequency: "Per batch, frozen format" },
      { name: "Peroxidase test (frozen vegetables must test negative, confirming adequate blanching)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch, frozen vegetable components", appliesTo: ["dehydrated-veg", "frozen-peas", "frozen-beans", "frozen-cauliflower", "frozen-spinach"] },
      { name: "Fat content (coconut milk/cream components, against the specific style's minimum)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per batch, coconut-based curries", appliesTo: ["coconut-milk-powder", "coconut-milk-liquid"] },
      { name: "Moisture, protein, and fat band verification (meat/poultry component, against the specific species' Ch 2.5 band)", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Per batch, non-veg SKUs", appliesTo: ["chicken", "mutton", "chevon-goat", "keema-mince"] },
      { name: "Antibiotic/veterinary drug residue screening (mandatory compliance check for meat/poultry sourcing per Ch 2.5 note)", lab: "NABL-accredited", cost: "₹4,000-7,000", frequency: "Periodic, at the meat supplier level", appliesTo: ["chicken", "mutton", "chevon-goat", "keema-mince"] },
      { name: "Egg composition verification (protein/fat/water against the Ch 2.5.3 species table)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per batch, egg-based SKUs", appliesTo: ["egg-shell", "egg-powder"] },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Moisture content", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch" },
      { name: "pH", lab: "NABL-accredited", cost: "₹500-1,000", frequency: "Per batch" },
      { name: "Heavy metals", lab: "NABL-accredited", cost: "₹4,000-6,000", frequency: "Annual" }
    ],
    conditionalDeclarations: [
      "Frozen RTC format specifically: the product must actually reach -18°C at the thermal centre after thermal stabilization before the freezing process is legally considered complete, per Ch 2.3.38/2.3.39; a product frozen but not stabilized to this core temperature does not meet the standard",
      "If coconut milk/cream is used: the specific style (light coconut milk, coconut milk, coconut cream, coconut cream concentrate) determines the applicable minimum fat percentage, and mislabelling a lower-fat style as a higher one is a compositional violation, not just a labelling error",
      "Any meat, poultry, fish, or egg ingredient selected: the product needs the brown non-veg triangle symbol on the front of pack, not the green vegetarian circle, and this applies even to egg-only products with no meat",
      "Meat/poultry components specifically: Ch 2.5's note provisions prohibit genetically modified production techniques and require compliance with veterinary-drug (antibiotic/growth promoter) advisories under the Drugs and Cosmetics Rules, 1945, both real sourcing-level obligations, not just label text",
      "Comminuted/restructured meat products (like keema-based curries) using more than 3.5% binders/extenders or more than 2.0% isolated soy protein: must be labelled \"Imitation\" per Ch 2.5.2(2)"
    ],
    prohibitedClaimIds: ["no-preservatives", "gluten-free", "high-protein-source-of-protein", "unsubstantiated-health-claim", "sugar-free-no-added-sugar", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Thermally processed and frozen curried vegetable/RTE standards, frozen vegetable component standards, coconut milk/cream standards", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3, regulations 2.3.4, 2.3.38-2.3.39, 2.3.51-2.3.52, 2.3.63", url: "fssai.gov.in", checkedOn: "2026-07-24" },
      { rule: "Meat, poultry, and egg compositional standards (species-specific moisture/protein/fat bands)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.5, Meat and Meat Products, and Chapter 2.5.3, Egg and Egg Products, Version 4 (01.08.2025)", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "dairy-adjacent": makeCategory({
    displayName: "Dairy-adjacent (plant-based alternatives, paneer-adjacent)",
    fssCategory: { code: "Genuinely unsettled from the FoSCoS Kind of Business Eligibility schedule alone: plant-based dairy alternatives may fall under Category 14 (Beverages) in liquid form, or need a distinct dairy-analogue classification under the Food Product Standards Regulations, 2011. Confirm the exact Kind of Business and FSS Appendix code directly before filing; the schedule's Dairy Units fee row happens to match General Manufacturing's flat fees (Rs.100/5,000/7,500) regardless, so the amounts are the same either way, but the classification itself still needs checking. Coconut-based dairy analogues specifically are the one sub-segment with a real dedicated standard: FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.51 (Coconut Milk), 2.3.52 (Coconut Cream), and 2.3.63 (Coconut Milk Powder), each with hard fat-content floors by style. Soy, almond, oat, and cashew-based analogues have no equivalent named compositional standard yet and are treated as proprietary/novel food formulations, not standardized products, an important gap to flag rather than gloss over.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.51-2.3.52, 2.3.63" },
    testsDisclaimer: "Coconut milk and cream have their own fat-content floors by style — light coconut milk ≥5.0%, coconut milk ≥10.0%, coconut cream ≥20.0%, coconut cream concentrate ≥29.0% — and calling a lower-fat style by a richer name is a real compositional violation, not just marketing. Soy, almond, oat, and cashew analogues have no matching FSSAI standard, so their tests follow standard industry practice instead of a mandated panel.",
    ingredientTags: [
      { id: "soy-milk", label: "Soy milk base", group: "Plant bases (no dedicated FSSAI standard)", allergen: true, allergenType: "soy" },
      { id: "almond-milk", label: "Almond milk base", group: "Plant bases (no dedicated FSSAI standard)", allergen: true, allergenType: "tree nuts" },
      { id: "oat-milk", label: "Oat milk base", group: "Plant bases (no dedicated FSSAI standard)", allergen: false },
      { id: "cashew-milk", label: "Cashew milk base", group: "Plant bases (no dedicated FSSAI standard)", allergen: true, allergenType: "tree nuts" },
      { id: "coconut-milk-light", label: "Light coconut milk", group: "Coconut milk & cream (standardized)", allergen: false, note: "Ch 2.3.51 standard: fat ≥5.0%, solids-not-fat ≥1.6%, obtained from centrifuged coconut milk bottom fraction or by dilution" },
      { id: "coconut-milk-standard", label: "Coconut milk", group: "Coconut milk & cream (standardized)", allergen: false, note: "Ch 2.3.51 standard: fat ≥10.0%, solids-not-fat ≥2.7%, total solids 12.7-25.3%" },
      { id: "coconut-cream", label: "Coconut cream", group: "Coconut milk & cream (standardized)", allergen: false, note: "Ch 2.3.52 standard: fat ≥20.0%, solids-not-fat ≥5.4%, total solids 25.4-37.3%" },
      { id: "coconut-cream-concentrate", label: "Coconut cream concentrate", group: "Coconut milk & cream (standardized)", allergen: false, note: "Ch 2.3.52 standard: fat ≥29.0%, solids-not-fat ≥8.4%, total solids ≥37.4%" },
      { id: "coconut-milk-powder", label: "Coconut milk powder", group: "Coconut milk & cream (standardized)", allergen: false, note: "Ch 2.3.63 standard: fat on dry basis ≥60.0%, FFA as lauric acid ≤0.2%, moisture ≤2.5%" },
      { id: "coconut-water-additive", label: "Coconut water (as diluent/additive)", group: "Coconut milk & cream (standardized)", allergen: false },
      { id: "tofu", label: "Tofu", group: "Paneer-adjacent (standardized as non-fermented soy product)", allergen: true, allergenType: "soy", note: "Ch 2.4.30 non-fermented soybean products standard for Tofu specifically (note: this sits in the Cereals and Cereal Products chapter, not Fruit & Vegetable Products, despite being a soy product): moisture ≤76.0%, protein ≥8.0%, fat 2.0-5.0%, urease index 0.05-0.2 pH unit rise" },
      { id: "soybean-curd", label: "Soybean curd (non-tofu style)", group: "Paneer-adjacent (standardized as non-fermented soy product)", allergen: true, allergenType: "soy", note: "Distinct standard from tofu at Ch 2.4.30: moisture ≥92.0% (a floor, not a ceiling — soybean curd is defined as the higher-water-content product versus tofu), protein ≥2.5%" },
      { id: "compressed-soybean-curd", label: "Compressed soybean curd", group: "Paneer-adjacent (standardized as non-fermented soy product)", allergen: true, allergenType: "soy" },
      { id: "cashew-paneer", label: "Cashew-based paneer analogue (no dedicated FSSAI standard)", group: "Paneer-adjacent (standardized as non-fermented soy product)", allergen: true, allergenType: "tree nuts" },
      { id: "coagulant", label: "Coagulant (magnesium chloride/nigari, calcium sulfate, calcium chloride, citric acid, acetic acid, glucono-delta-lactone)", group: "Paneer-adjacent (standardized as non-fermented soy product)", allergen: false, note: "Ch 2.4.30 explicitly lists these six coagulants as the permitted set for tofu/soybean curd production" },
      { id: "fermented-soybean-curd", label: "Fermented soybean curd (dairy-free \"yogurt\" style)", group: "Fermented soy analogues (standardized)", allergen: true, allergenType: "soy", note: "Ch 2.4.39 standard: acidity as lactic acid <1.5%, protein ≥3.0%, pH 4.0-4.5, must be labelled \"Non-dairy product\" if made without dairy ingredients" },
      { id: "calcium-fortificant", label: "Calcium fortificant", group: "Fortification & stabilizers", allergen: false },
      { id: "stabilizer", label: "Stabilizer / emulsifier (gellan gum, locust bean gum, carrageenan)", group: "Fortification & stabilizers", allergen: false },
      { id: "maltodextrin-dairy", label: "Maltodextrin (coconut milk powder carrier)", group: "Fortification & stabilizers", allergen: false, note: "Explicitly permitted addition to coconut milk/cream/powder under Ch 2.3.51-2.3.52/2.3.63" },
      { id: "sodium-caseinate", label: "Sodium caseinate", group: "Fortification & stabilizers", allergen: true, allergenType: "milk", note: "Explicitly permitted in the coconut milk/cream standards, but itself a dairy-derived protein, undermining a \"dairy-free\" claim if used" },
      { id: "vegetable-oil", label: "Vegetable oil", group: "Fortification & stabilizers", allergen: false },
      { id: "sugar", label: "Sugar / sweetener", group: "Other", allergen: false, sugarEquivalent: true },
      { id: "salt", label: "Salt", group: "Other", allergen: false },
      { id: "natural-flavour", label: "Natural flavour", group: "Other", allergen: false }
    ],
    mandatoryTests: [
      { name: "Fat content (against the specific style's floor: light coconut milk ≥5%, coconut milk ≥10%, cream ≥20%, cream concentrate ≥29%)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per batch, coconut-based products", appliesTo: ["coconut-milk-light", "coconut-milk-standard", "coconut-cream", "coconut-cream-concentrate", "coconut-milk-powder"] },
      { name: "Solids-not-fat and total solids", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch, coconut-based products", appliesTo: ["coconut-milk-light", "coconut-milk-standard", "coconut-cream", "coconut-cream-concentrate"] },
      { name: "pH (must fall within Ch 2.3.51/2.3.52's ≥5.9 minimum for coconut milk/cream)", lab: "NABL-accredited", cost: "₹500-1,000", frequency: "Per batch", appliesTo: ["coconut-milk-light", "coconut-milk-standard", "coconut-cream", "coconut-cream-concentrate"] },
      { name: "Urease index (tofu/soybean curd, must show 0.05-0.2 pH unit rise, confirming adequate heat processing)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per batch, soy-based products", appliesTo: ["tofu", "soybean-curd", "compressed-soybean-curd", "fermented-soybean-curd"] },
      { name: "Protein content verification", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per SKU" },
      { name: "Free fatty acid as lauric acid (coconut milk powder, ≤0.2%)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per batch, coconut milk powder", appliesTo: ["coconut-milk-powder"] },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Moisture / solids content", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch" },
      { name: "Heavy metals", lab: "NABL-accredited", cost: "₹4,000-6,000", frequency: "Annual" },
      { name: "Shelf-life / stability study", lab: "NABL-accredited", cost: "₹15,000-30,000", frequency: "Once per SKU, at launch" }
    ],
    conditionalDeclarations: [
      "Coconut milk/cream products: the declared style (light coconut milk / coconut milk / coconut cream / coconut cream concentrate) must actually match the measured fat content band; a \"cream\" labelled product testing below 20% fat is a compositional violation, not just a labelling issue",
      "If sodium caseinate is used as a stabilizer in a coconut milk/cream product: this is a genuine dairy-derived allergen and directly conflicts with any \"dairy-free\" or \"vegan\" claim on the same label",
      "Fermented soybean curd (dairy-free yogurt style): must carry the exact label statement \"Non-dairy product\" if prepared without dairy ingredients, or \"With low-dairy ingredients\" if some milk/reconstituted milk was added (up to 25% of final product), per Ch 2.4.39",
      "Soy/almond/oat/cashew milk bases: since these have no dedicated FSSAI compositional standard, protein and fat content claims rest entirely on the actual nutrition panel, not a regulatory floor; be precise rather than implying dairy-equivalent nutrition by default"
    ],
    prohibitedClaimIds: ["sugar-free-no-added-sugar", "high-protein-source-of-protein", "gluten-free", "unsubstantiated-health-claim", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Coconut milk, coconut cream, and coconut milk powder compositional standards by style", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.51 (Coconut Milk), 2.3.52 (Coconut Cream), 2.3.63 (Coconut Milk Powder)", url: "fssai.gov.in", checkedOn: "2026-07-24" },
      { rule: "Tofu, soybean curd, and fermented soybean curd compositional standards", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.4.30 (Non-Fermented Soybean Products, in the Cereals chapter despite the product being soy-based) and 2.4.39 (Fermented Soybean Curd)", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "protein-bars": makeCategory({
    displayName: "Protein / energy bars",
    // No FSS standard exists for a finished protein/energy bar (checked
    // Ch 2.3, 2.4 and 2.9). In practice these are licensed as Proprietary
    // Food, which the FoSCoS schedule lists with no turnover threshold,
    // i.e. Central License regardless of revenue.
    licenseLogicExtra: { proprietaryFoodRisk: true },
    fssCategory: { code: "Category 12, Salts, spices, soups, sauces, salads and protein products. Confirmed under General Manufacturing in the FoSCoS schedule. Plant-derived protein ingredients used in bars are individually standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011: Vegetable Protein Products at Chapter 2.3.59 (protein ≥40% floor), Soy Protein Products at Chapter 2.4.20 (three sub-grades: flour/concentrate/isolate, each with its own protein band), and Textured Soy Protein at Chapter 2.4.27 (protein ≥50%). The finished bar format itself has no dedicated standard, so these input-ingredient floors are the enforceable compositional bar for the protein claim.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.59 / 2.4.20 / 2.4.27" },
    testsDisclaimer: "Soy protein comes in three legally distinct grades based on protein content — flour (50-65%), concentrate (65-90%), and isolate (>90%). Whichever one you name on the label has to actually match what's in the bar; clearing the finished-bar protein-claim threshold on its own isn't enough.",
    ingredientTags: [
      { id: "whey-protein", label: "Whey protein concentrate / isolate", group: "Protein sources", allergen: true, allergenType: "milk" },
      { id: "pea-protein", label: "Pea protein isolate", group: "Protein sources", allergen: false, note: "Falls under the Vegetable Protein Products standard (Ch 2.3.59): protein ≥40% on dry weight basis, total ash ≤10%" },
      { id: "soy-protein-flour", label: "Soy protein flour (SPF)", group: "Protein sources", allergen: true, allergenType: "soy", note: "Ch 2.4.20 standard: crude protein 50.0-65.0% on dry basis, moisture ≤10.0%" },
      { id: "soy-protein-concentrate", label: "Soy protein concentrate (SPC)", group: "Protein sources", allergen: true, allergenType: "soy", note: "Ch 2.4.20 standard: crude protein 65.0-90.0% on dry basis, distinct grade from SPF and SPI" },
      { id: "soy-protein-isolate", label: "Soy protein isolate (SPI)", group: "Protein sources", allergen: true, allergenType: "soy", note: "Ch 2.4.20 standard: crude protein >90.0% on dry basis, crude fibre ≤0.50%, the highest-purity soy protein grade" },
      { id: "textured-soy-protein", label: "Textured soy protein (soy bari / chunks / granules)", group: "Protein sources", allergen: true, allergenType: "soy", note: "Ch 2.4.27 standard: protein ≥50% on dry matter basis, residual hexane ≤10ppm, urease index 0.05-0.2 pH unit rise" },
      { id: "wheat-protein", label: "Wheat protein / vital wheat gluten", group: "Protein sources", allergen: true, allergenType: "gluten", note: "Ch 2.4.22 Wheat Protein Products standard: vital/devitalized gluten protein ≥80%, solubilized wheat protein ≥60%" },
      { id: "collagen-peptides", label: "Collagen peptides", group: "Protein sources", allergen: false, animalDerived: true },
      { id: "oats", label: "Oats", group: "Base & binders", allergen: false },
      { id: "dates", label: "Dates", group: "Base & binders", allergen: false, sugarEquivalent: true, note: "Ch 2.3.47(4) standard: moisture ≤30.0%, blemished/damaged units ≤5.0%" },
      { id: "date-paste", label: "Date paste (binder)", group: "Base & binders", allergen: false, sugarEquivalent: true, note: "Standardized separately at Ch 2.3.56: moisture ≤20.0%, total ash ≤1.2%, no additives permitted at all in this specific standard" },
      { id: "honey", label: "Honey", group: "Base & binders", allergen: false, sugarEquivalent: true, animalDerived: true },
      { id: "brown-rice-syrup", label: "Brown rice syrup", group: "Base & binders", allergen: false, sugarEquivalent: true },
      { id: "almonds", label: "Almonds", group: "Nuts & seeds", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(6) standard: oil content ≥45.0%, acidity of extracted oil ≤1.25% as oleic acid" },
      { id: "peanuts", label: "Peanuts", group: "Nuts & seeds", allergen: true, allergenType: "peanut" },
      { id: "cashews-bar", label: "Cashews", group: "Nuts & seeds", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(7) standard: free fatty acid ≤1.25% whole / ≤2.0% pieces" },
      { id: "chia-seeds", label: "Chia seeds", group: "Nuts & seeds", allergen: false, note: "Standardized at Ch 2.4.6(25): moisture ≤11.5%, acidity of extracted fat ≤2.0 mg KOH/g" },
      { id: "flax-seeds", label: "Flax seeds", group: "Nuts & seeds", allergen: false },
      { id: "dark-chocolate", label: "Dark chocolate coating", group: "Coating & flavour", allergen: false },
      { id: "cocoa-powder", label: "Cocoa powder", group: "Coating & flavour", allergen: false, note: "Sourced from Cocoa Beans, standardized at Ch 2.3.54: moisture ≤8%, moldy beans ≤4% by count" },
      { id: "stevia", label: "Stevia", group: "Low-sugar variants", allergen: false, sugarEquivalent: false },
      { id: "erythritol", label: "Erythritol / maltitol", group: "Low-sugar variants", allergen: false, sugarEquivalent: false }
    ],
    mandatoryTests: [
      { name: "Protein content (Kjeldahl method)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per SKU, critical for label claim" },
      { name: "Protein source grade verification (soy: confirm actual SPF/SPC/SPI band matches label per Ch 2.4.20)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per SKU using soy protein", appliesTo: ["soy-protein-flour", "soy-protein-concentrate", "soy-protein-isolate"] },
      { name: "Urease index (soy/textured-soy protein sources, 0.05-0.2 pH unit rise confirms adequate processing)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per batch, soy-protein SKUs", appliesTo: ["soy-protein-flour", "soy-protein-concentrate", "soy-protein-isolate", "textured-soy-protein"] },
      { name: "Residual hexane (solvent-extracted or textured soy protein, ≤10ppm)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Per batch, solvent-extracted protein sources", appliesTo: ["textured-soy-protein"] },
      { name: "Moisture content", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch" },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Aflatoxin screening (peanut-containing variants)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Per batch, high-risk", appliesTo: ["peanuts"] },
      { name: "Shelf-life / stability study", lab: "NABL-accredited", cost: "₹15,000-30,000", frequency: "Once per SKU, at launch" }
    ],
    conditionalDeclarations: [
      "If soy protein is named on the label as \"isolate\", \"concentrate\", or \"flour\": the ingredient used must actually clear that specific Ch 2.4.20 protein band (isolate >90%, concentrate 65-90%, flour 50-65%), since these are legally distinct grades, not marketing synonyms",
      "If date paste is used as a binder specifically (not just chopped dates): Ch 2.3.56 permits zero food additives in this exact ingredient, so any additive-containing \"date paste\" supply needs re-checking against that standard before use"
    ],
    prohibitedClaimIds: ["high-protein-source-of-protein", "sugar-free-no-added-sugar", "low-sugar", "gluten-free", "unsubstantiated-health-claim", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Vegetable protein product, soy protein product, and textured soy protein compositional standards", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.59, Chapter 2.4.20, and Chapter 2.4.27", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "pickles-chutneys": makeCategory({
    displayName: "Pickles / chutneys / relishes",
    fssCategory: { code: "Category 04, Fruits and vegetables (including mushrooms and fungi, roots and tubers, fresh pulses and legumes, aloe vera), seaweeds, nuts and seeds. Confirmed under General Manufacturing in the FoSCoS schedule. Pickles, chutneys, and mango chutney each carry their own dedicated compositional standard under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3 (Fruit & Vegetable Products), regulations 2.3.41 through 2.3.43, with distinct minimums for drained weight, total soluble solids, fruit/vegetable content, pH, and packing-medium-specific salt or acid floors.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.41-2.3.43" },
    testsDisclaimer: "Chutneys have a hard pH ceiling of 4.6 — the standard cutoff between high-acid and low-acid foods for microbial safety. The minimum salt or acid level you need depends on what you're packed in: brine needs ≥12% salt, citrus juice ≥1.2% citric acid, vinegar ≥2.0% acetic acid. Pickles specifically can't use copper, mineral acid, alum, or synthetic colours at all.",
    ingredientTags: [
      { id: "mango", label: "Mango", group: "Produce", allergen: false, note: "Mango Chutney has its own standard (Ch 2.3.42): total soluble solids ≥50%, fruit content ≥40%, pH ≤4.6" },
      { id: "lime-lemon", label: "Lime / lemon", group: "Produce", allergen: false },
      { id: "mixed-vegetables", label: "Mixed vegetables", group: "Produce", allergen: false },
      { id: "carrot", label: "Carrot", group: "Produce", allergen: false },
      { id: "cauliflower", label: "Cauliflower", group: "Produce", allergen: false },
      { id: "turnip", label: "Turnip", group: "Produce", allergen: false },
      { id: "garlic", label: "Garlic", group: "Produce", allergen: false },
      { id: "ginger", label: "Ginger", group: "Produce", allergen: false },
      { id: "green-chili", label: "Green chili", group: "Produce", allergen: false },
      { id: "tamarind", label: "Tamarind", group: "Produce", allergen: false, note: "Tamarind Pulp/Puree/Concentrate has its own standard (Ch 2.3.18): TSS ≥32% pulp / ≥65% concentrate, acidity ≥4.5% pulp / ≥9.0% concentrate" },
      { id: "gooseberry-amla", label: "Gooseberry (amla)", group: "Produce", allergen: false },
      { id: "bitter-gourd", label: "Bitter gourd (karela)", group: "Produce", allergen: false },
      { id: "drumstick", label: "Drumstick", group: "Produce", allergen: false },
      { id: "coriander-leaves", label: "Fresh coriander leaves (chutney)", group: "Produce", allergen: false },
      { id: "mint-leaves", label: "Fresh mint leaves (chutney)", group: "Produce", allergen: false },
      { id: "coconut-fresh", label: "Fresh coconut (chutney)", group: "Produce", allergen: false },
      { id: "onion", label: "Onion", group: "Produce", allergen: false },
      { id: "mustard-oil", label: "Mustard oil", group: "Oils & preservation", allergen: false, note: "Pickles-in-oil (Ch 2.3.43): drained weight ≥60%, pieces must remain practically submerged in oil" },
      { id: "sesame-oil", label: "Sesame oil", group: "Oils & preservation", allergen: true, allergenType: "sesame" },
      { id: "groundnut-oil-pickle", label: "Groundnut oil", group: "Oils & preservation", allergen: true, allergenType: "peanut" },
      { id: "salt", label: "Salt (brine pickles)", group: "Oils & preservation", allergen: false, note: "Pickles-in-brine (Ch 2.3.43): sodium chloride content must be ≥12.0% of the packed product, not just seasoning-level salt" },
      { id: "vinegar", label: "Vinegar (acetic acid pickles)", group: "Oils & preservation", allergen: false, note: "Pickles-in-vinegar (Ch 2.3.43): acidity of the vinegar itself must be ≥2.0% acetic acid" },
      { id: "citrus-juice-pickle", label: "Citrus juice (lime/lemon-brine pickles)", group: "Oils & preservation", allergen: false, note: "Pickles-in-citrus-juice (Ch 2.3.43): acidity ≥1.2% as citric acid" },
      { id: "preservative", label: "Preservative (sodium benzoate / potassium metabisulphite, Class II)", group: "Oils & preservation", allergen: false, isPreservative: true },
      { id: "sugar", label: "Sugar", group: "Sweet chutneys", allergen: false, sugarEquivalent: true },
      { id: "jaggery", label: "Jaggery", group: "Sweet chutneys", allergen: false, sugarEquivalent: true, note: "Ch 2.3.41 sets total soluble solids ≥50% across chutney overall, plus a separate fruit/vegetable-content-by-type floor (fruit chutney and vegetable chutney ≥25%, hot-and-sour/spicy chutney ≥40%) and pH ≤4.6; the source table's exact column alignment for the by-type figures could not be confirmed with full certainty from the extracted text, so verify against the primary PDF before citing a specific number to a regulator" },
      { id: "dried-fruits-pickle", label: "Dry fruits and nuts (pickle mix-ins)", group: "Seasoning", allergen: true, allergenType: "tree nuts (verify specific nut)" },
      { id: "fenugreek-seeds", label: "Fenugreek seeds", group: "Seasoning", allergen: false },
      { id: "mustard-seeds", label: "Mustard seeds", group: "Seasoning", allergen: false },
      { id: "fennel", label: "Fennel", group: "Seasoning", allergen: false },
      { id: "asafoetida", label: "Asafoetida", group: "Seasoning", allergen: true, allergenType: "gluten (check carrier)" },
      { id: "turmeric", label: "Turmeric", group: "Seasoning", allergen: false },
      { id: "red-chili-powder", label: "Red chili powder", group: "Seasoning", allergen: false }
    ],
    mandatoryTests: [
      { name: "pH (chutneys must not exceed 4.6, the high-acid/low-acid food safety cutoff)", lab: "NABL-accredited", cost: "₹500-1,000", frequency: "Per batch, mandatory per Ch 2.3.41/2.3.42" },
      { name: "Total soluble solids (chutney: fruit ≥50%, vegetable/hot-sour ≥25%; mango chutney ≥50%)", lab: "NABL-accredited", cost: "₹1,000-1,800", frequency: "Per batch" },
      { name: "Drained weight (pickles must be ≥60% of net weight regardless of packing medium)", lab: "NABL-accredited", cost: "₹800-1,500", frequency: "Per batch" },
      { name: "Salt content (brine pickles must show ≥12.0% NaCl specifically)", lab: "NABL-accredited", cost: "₹1,000-1,800", frequency: "Per batch, brine pickles", appliesTo: ["salt"] },
      { name: "Acidity as acetic/citric acid (vinegar pickles ≥2.0% acetic; citrus-juice pickles ≥1.2% citric)", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch, matching the declared packing medium", appliesTo: ["vinegar", "citrus-juice-pickle"] },
      { name: "Total ash and ash insoluble in hydrochloric acid (chutney purity check)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic" },
      { name: "Copper, mineral acid, alum screening (explicitly prohibited in pickles per Ch 2.3.43)", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Periodic" },
      { name: "Preservative content verification", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Periodic", appliesTo: ["preservative"] },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Rancidity (oil-based pickles)", lab: "NABL-accredited", cost: "₹1,500-2,000", frequency: "Periodic", appliesTo: ["mustard-oil", "sesame-oil", "groundnut-oil-pickle"] }
    ],
    conditionalDeclarations: [
      "Pickles must be labelled by packing medium type and must show \"no sign of fermentation\"; if the product doesn't match one of the three named media (citrus juice/brine, oil, vinegar), it must be labelled generically as \"(name of vegetable or fruit) Pickle\" per Ch 2.3.43",
      "\"Traditional\", \"homemade\", \"authentic\" claims: subject to Schedule V; \"traditional\" specifically requires the recipe to have existed materially unchanged for at least 30 years, and misleading \"home-made\"/\"home cooked\" style phrasing is restricted on commercially packaged labels"
    ],
    prohibitedClaimIds: ["no-preservatives", "brand-name-descriptor-disclaimer", "unsubstantiated-health-claim", "sugar-free-no-added-sugar", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Pickle, chutney, and mango chutney compositional standards (drained weight, TSS, pH, salt/acid floors by packing medium)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3, regulations 2.3.41 (Chutney), 2.3.42 (Mango Chutney), 2.3.43 (Pickles)", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "sauces-condiments": makeCategory({
    displayName: "Sauces, ketchups & dressings",
    fssCategory: { code: "Category 12, Salts, spices, soups, sauces, salads and protein products. Confirmed under General Manufacturing in the FoSCoS schedule. Individually standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011: tomato ketchup and tomato sauce at Ch 2.3.27, all other fruit/vegetable sauces and culinary pastes at Ch 2.3.28, soybean sauce separately at Ch 2.3.29, and vinegar at Ch 2.3.46, each with its own total-soluble-solids and acidity floor rather than one blanket sauce standard.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.27-2.3.29 and 2.3.46" },
    testsDisclaimer: "The binding parameters in this category are total soluble solids (on a salt-free basis) and acidity as acetic acid, and both are set per product type, not per category: tomato ketchup clears a much higher TSS bar (≥25%) than a chilli sauce (≥8%) or a ginger paste (≥3%). Product identity therefore decides the test target.",
    ingredientTags: [
      { id: "tomato-paste-sauce", label: "Tomato paste / puree (ketchup base)", group: "Tomato-based", allergen: false, note: "Ch 2.3.14 input standard: puree TSS ≥9.0%, paste TSS ≥25%; the finished ketchup then has to clear Ch 2.3.27 on its own" },
      { id: "tomato-ketchup", label: "Tomato ketchup / tomato sauce", group: "Tomato-based", allergen: false, sugarEquivalent: true, note: "Ch 2.3.27 standard: total soluble solids ≥25.0% on a salt-free basis, acidity as acetic acid ≥0.2%" },
      { id: "pizza-pasta-sauce", label: "Pizza / pasta sauce", group: "Tomato-based", allergen: false, note: "Falls under Ch 2.3.28 as a vegetable sauce rather than Ch 2.3.27, so the applicable TSS floor is ≥15.0%, not ketchup's ≥25%" },
      { id: "chilli-sauce", label: "Chilli / hot sauce", group: "Chilli & hot sauces", allergen: false, note: "Ch 2.3.28 standard: total soluble solids ≥8.0% on a salt-free basis, acidity as acetic acid ≥1.0%" },
      { id: "schezwan-sauce", label: "Schezwan / chilli-garlic sauce", group: "Chilli & hot sauces", allergen: false },
      { id: "peri-peri-sauce", label: "Peri peri / hot wing sauce", group: "Chilli & hot sauces", allergen: false },
      { id: "fruit-veg-sauce", label: "Fruit or vegetable sauce (non-tomato)", group: "Chilli & hot sauces", allergen: false, note: "Ch 2.3.28 standard: total soluble solids ≥15.0% on a salt-free basis" },
      { id: "soy-sauce", label: "Soy / soybean sauce", group: "Asian & fermented", allergen: true, allergenType: "soy", note: "Ch 2.3.29 standard: TSS ≥15.0% salt-free, acidity as acetic acid ≥0.6%, total nitrogen ≥1.0%; trypsin inhibitors must be completely inactivated" },
      { id: "vinegar-brewed", label: "Brewed vinegar (fruit, malt, cane, jaggery)", group: "Asian & fermented", allergen: false, note: "Ch 2.3.46 standard: acidity ≥3.75% m/v as acetic acid, total solids ≥1.5%, total ash ≥0.18%; may not be fortified with acetic acid" },
      { id: "vinegar-synthetic", label: "Synthetic vinegar (from acetic acid)", group: "Asian & fermented", allergen: false, note: "Ch 2.3.46: acidity ≥3.75% m/v, and the label must carry \"SYNTHETIC - PREPARED FROM ACETIC ACID\"" },
      { id: "vinaigrette", label: "Vinaigrette / oil-and-vinegar dressing", group: "Asian & fermented", allergen: false },
      { id: "ginger-paste", label: "Ginger paste", group: "Culinary pastes", allergen: false, note: "Ch 2.3.28 standard: total soluble solids ≥3.0%, the lowest TSS floor in the sauce/paste table" },
      { id: "garlic-paste", label: "Garlic paste", group: "Culinary pastes", allergen: false },
      { id: "ginger-garlic-paste", label: "Ginger-garlic paste", group: "Culinary pastes", allergen: false },
      { id: "curry-paste", label: "Curry / masala cooking paste", group: "Culinary pastes", allergen: false, note: "Ch 2.3.28 culinary paste standard: total soluble solids ≥8.0% on a salt-free basis" },
      { id: "tamarind-paste-sauce", label: "Tamarind paste / concentrate", group: "Culinary pastes", allergen: false, note: "Ch 2.3.18 standard: pulp TSS ≥32%, concentrate TSS ≥65%, acidity ≥4.5% pulp / ≥9.0% concentrate" },
      { id: "mayonnaise", noStandard: true, label: "Mayonnaise (egg-based)", group: "Emulsion-based", allergen: true, allergenType: "egg", note: "No dedicated FSSAI compositional standard exists for mayonnaise; it is governed by the general additive, hygiene and labelling rules instead. Treat any \"standard\" quoted to you by a supplier with care and confirm the actual clause" },
      { id: "eggless-mayonnaise", noStandard: true, label: "Eggless mayonnaise", group: "Emulsion-based", allergen: false, note: "Same gap as egg mayonnaise: no dedicated compositional standard, so identity rests on the ingredient list and label rather than a numeric bar" },
      { id: "salad-dressing", noStandard: true, label: "Salad dressing / aioli", group: "Emulsion-based", allergen: true, allergenType: "egg (verify base)" },
      { id: "mustard-sauce", label: "Prepared mustard sauce", group: "Emulsion-based", allergen: false },
      { id: "acidity-regulator-sauce", label: "Acidity regulator (citric, acetic, phosphoric)", group: "Additives", allergen: false },
      { id: "preservative-sauce", label: "Preservative (benzoate, sorbate)", group: "Additives", allergen: false, isPreservative: true },
      { id: "thickener-stabilizer-sauce", label: "Thickener / stabilizer (xanthan, guar, modified starch)", group: "Additives", allergen: false },
      { id: "caramel-colour-sauce", label: "Caramel colour", group: "Additives", allergen: false, note: "Ch 2.3.28 permits caramel specifically, and prohibits every other added colour in these sauces, natural ones included" },
      { id: "emulsifier-sauce", label: "Emulsifier", group: "Additives", allergen: false }
    ],
    mandatoryTests: [
      { name: "Total soluble solids, salt-free basis (against the product's own floor: ketchup ≥25%, fruit/veg sauce ≥15%, chilli sauce and culinary paste ≥8%, ginger paste ≥3%)", lab: "NABL-accredited", cost: "₹1,000-1,800", frequency: "Per batch" },
      { name: "Acidity as acetic acid (ketchup ≥0.2%, chilli and culinary sauces ≥1.0%, fruit/vegetable sauces ≥1.2%, soy sauce ≥0.6%)", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch" },
      { name: "Vinegar acidity, total solids and ash (≥3.75% m/v acetic acid, ≥1.5% solids, ≥0.18% ash per Ch 2.3.46)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch, vinegar SKUs", appliesTo: ["vinegar"] },
      { name: "Mineral acid screening (Ch 2.3.46 prohibits sulphuric or any other mineral acid in vinegar outright)", lab: "NABL-accredited", cost: "₹1,800-3,000", frequency: "Per batch, vinegar SKUs", appliesTo: ["vinegar"] },
      { name: "Total nitrogen (soy sauce, ≥1.0% per Ch 2.3.29)", lab: "NABL-accredited", cost: "₹2,000-3,000", frequency: "Per SKU, soy sauce", appliesTo: ["soy-sauce"] },
      { name: "Synthetic colour screening (Ch 2.3.28 permits caramel only, so any other colour found is a compositional violation)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Per batch, an active enforcement focus for red/orange sauces", appliesTo: ["chilli-sauce", "schezwan-sauce", "peri-peri-sauce", "tomato-ketchup", "fruit-veg-sauce"] },
      { name: "Preservative quantification (benzoate/sorbate against Appendix A caps)", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Per batch", appliesTo: ["preservative"] },
      { name: "pH and water activity (shelf-life and safety substantiation)", lab: "NABL-accredited", cost: "₹1,000-2,000", frequency: "Per SKU" },
      { name: "Microbiological panel (yeast & mould, coliform, per Appendix B)", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Per batch" },
      { name: "Net content / container fill verification (rigid containers must be ≥90% of water capacity)", lab: "In-house or NABL-accredited", cost: "₹800-1,500", frequency: "Per batch" }
    ],
    conditionalDeclarations: [
      "Any sauce under Ch 2.3.28 (i.e. anything other than tomato sauce and soya sauce): caramel is the only permitted added colour, and every other colour is prohibited whether natural or synthetic, so a beetroot- or paprika-coloured sauce is a compositional violation, not just a labelling question",
      "Synthetic vinegar specifically: the label must carry the exact declaration \"SYNTHETIC - PREPARED FROM ACETIC ACID\", distinctly displayed",
      "If mayonnaise or any egg-based dressing is used: egg is a declarable allergen, and the veg/non-veg symbol must be the brown triangle rather than the green circle",
      "If soy sauce or any soy-derived ingredient is used: soy is a declarable allergen under the Labelling & Display Regulations, 2020",
      "Rigid containers across ketchup, sauces, soya sauce and vinegar: the container must be filled to at least 90.0% of its water capacity, a fill requirement written into the standards themselves rather than only into Legal Metrology"
    ],
    prohibitedClaimIds: ["no-preservatives", "sugar-free-no-added-sugar", "unsubstantiated-health-claim", "brand-name-descriptor-disclaimer", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Tomato ketchup and tomato sauce compositional standard", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.27", url: "fssai.gov.in", checkedOn: "2026-07-25" },
      { rule: "Culinary pastes and fruit/vegetable sauces standard (chilli sauce, culinary paste, ginger paste TSS and acidity floors; caramel-only colour rule)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.28", url: "fssai.gov.in", checkedOn: "2026-07-25" },
      { rule: "Soybean sauce compositional standard", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.29", url: "fssai.gov.in", checkedOn: "2026-07-25" },
      { rule: "Brewed and synthetic vinegar standards, including the synthetic-vinegar label declaration", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.46", url: "fssai.gov.in", checkedOn: "2026-07-25" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "tea-coffee": makeCategory({
    displayName: "Tea & coffee",
    fssCategory: { code: "Category 14, Beverages excluding dairy products, for ready-to-drink formats. Confirmed under General Manufacturing in the FoSCoS schedule. Tea, coffee, chicory, and their blends are individually standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.10 (sub-sections 2.10.1 to 2.10.4), each format, leaf tea, green tea, instant tea, roasted coffee, soluble coffee, coffee-chicory blends, carrying its own moisture/ash/caffeine/extract limits, not one blanket tea-and-coffee standard.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.10.1-2.10.4" },
    ingredientTags: [
      { id: "black-tea", label: "Black tea", group: "Tea", allergen: false, note: "Ch 2.10.1 standard: total ash 4.0-8.0%, water extract ≥32.0%, crude fibre ≤16.5%, all on oven-dried basis" },
      { id: "kangra-tea", label: "Kangra tea", group: "Tea", allergen: false, note: "Standardized as its own distinct sub-type in Ch 2.10.1, with a different ash/extract/fibre table than ordinary tea" },
      { id: "green-tea", label: "Green tea", group: "Tea", allergen: false, note: "Ch 2.10.1 adds a total-catechins requirement of 9.0-19.0%, unique to green tea among the tea standards" },
      { id: "oolong-tea", label: "Oolong tea", group: "Tea", allergen: false },
      { id: "instant-tea-solid", label: "Instant tea, solid form", group: "Tea", allergen: false, note: "Separate standard: moisture ≤6.0%, total ash ≤20% (hot soluble) / ≤35% (cold soluble), acid-insoluble ash ≤1.0%" },
      { id: "herbal-infusion", label: "Herbal infusion base (non-Camellia sinensis)", group: "Tea", allergen: false },
      { id: "roasted-coffee-beans", label: "Roasted coffee beans", group: "Coffee", allergen: false, note: "Ch 2.10.2 standard: moisture ≤5.0%, total ash 3.0-6.0%, caffeine (anhydrous) ≥1.0% on dry basis" },
      { id: "ground-coffee", label: "Ground coffee", group: "Coffee", allergen: false },
      { id: "decaf-coffee", label: "Decaffeinated roasted/ground coffee", group: "Coffee", allergen: false, note: "Distinct standard, same ash/moisture bands but no minimum caffeine requirement" },
      { id: "soluble-coffee-powder", label: "Soluble / instant coffee powder", group: "Coffee", allergen: false, note: "Ch 2.10.2 standard: moisture ≤4.0%, total ash ≤12.0%, caffeine ≥2.8% on dry basis, plus defined solubility-in-water tests" },
      { id: "decaf-soluble-coffee", label: "Decaffeinated soluble coffee powder", group: "Coffee", allergen: false, note: "Caffeine capped at ≤0.3% instead of the ≥2.8% minimum for regular soluble coffee" },
      { id: "chicory", label: "Chicory (roasted, ground)", group: "Coffee", allergen: false, note: "Ch 2.10.3 standalone standard: total ash 3.5-8.0%, aqueous extract ≥55.0%" },
      { id: "coffee-chicory-blend", label: "Coffee-chicory blend", group: "Coffee", allergen: false, note: "Ch 2.10.4 requires coffee content ≥51% by mass; percentage of each must be declared on label per Labelling & Display Regulations, 2020" },
      { id: "instant-coffee-chicory", label: "Instant coffee-chicory mixture", group: "Coffee", allergen: false, note: "Separate standard from the roasted/ground blend: moisture ≤4.0%, caffeine ≥1.4% on dry basis, defined solubility test" },
      { id: "cardamom", label: "Cardamom (masala chai)", group: "Flavouring", allergen: false },
      { id: "ginger", label: "Ginger (masala chai)", group: "Flavouring", allergen: false },
      { id: "cinnamon", label: "Cinnamon (masala chai)", group: "Flavouring", allergen: false },
      { id: "cloves", label: "Cloves (masala chai)", group: "Flavouring", allergen: false },
      { id: "black-pepper-chai", label: "Black pepper (masala chai)", group: "Flavouring", allergen: false },
      { id: "star-anise-chai", label: "Star anise (masala chai)", group: "Flavouring", allergen: false },
      { id: "natural-flavour", label: "Natural flavouring (packaged tea, per Regulation 2.4.5(23))", group: "Flavouring", allergen: false, note: "Ch 2.10.1 allows added natural flavours only, and only in packaged tea; flavoured tea manufacturers must additionally register with the Tea Board" },
      { id: "pectinase-enzyme", label: "Pectinase enzyme (processing aid)", group: "Flavouring", allergen: false, note: "Permitted up to 0.2% during tea manufacture as a processing aid, per Ch 2.10.1" },
      { id: "sugar", label: "Sugar", group: "Mix-ins", allergen: false, sugarEquivalent: true },
      { id: "non-dairy-creamer", label: "Non-dairy creamer", group: "Mix-ins", allergen: false },
      { id: "milk-powder", label: "Milk powder (3-in-1 mixes)", group: "Mix-ins", allergen: true, allergenType: "milk" },
      { id: "artificial-flavour", label: "Artificial flavouring (permitted in mix-ins, not in tea itself)", group: "Mix-ins", allergen: false }
    ],
    mandatoryTests: [
      { name: "Total ash and water-soluble ash (tea, per Ch 2.10.1's exact band for the specific tea type declared)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch", appliesTo: ["black-tea", "kangra-tea", "green-tea", "instant-tea-solid"] },
      { name: "Water extract and crude fibre (tea)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch", appliesTo: ["black-tea", "kangra-tea", "green-tea", "instant-tea-solid"] },
      { name: "Total catechins (green tea specifically)", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Per batch, green tea SKUs only", appliesTo: ["green-tea"] },
      { name: "Caffeine content, against the specific minimum or cap for the declared format (roasted coffee ≥1.0%, soluble coffee ≥2.8%, decaf variants capped ≤0.1-0.3%)", lab: "NABL-accredited", cost: "₹2,000-3,000", frequency: "Per SKU", appliesTo: ["roasted-coffee-beans", "ground-coffee", "decaf-coffee", "soluble-coffee-powder", "decaf-soluble-coffee", "coffee-chicory-blend", "instant-coffee-chicory"] },
      { name: "Moisture and total ash (coffee, chicory, and blends, per the specific Ch 2.10.2-2.10.4 sub-standard)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch", appliesTo: ["roasted-coffee-beans", "ground-coffee", "decaf-coffee", "soluble-coffee-powder", "decaf-soluble-coffee", "chicory", "coffee-chicory-blend", "instant-coffee-chicory"] },
      { name: "Coffee content verification in coffee-chicory blends (must show ≥51% by mass)", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Per SKU, blended products", appliesTo: ["coffee-chicory-blend", "instant-coffee-chicory"] },
      { name: "Pesticide residue (tea leaves specifically)", lab: "NABL-accredited", cost: "₹3,500-6,000", frequency: "Periodic", appliesTo: ["black-tea", "kangra-tea", "green-tea", "oolong-tea", "instant-tea-solid"] },
      { name: "Iron filing content (tea, capped at 125mg/kg per Ch 2.10.1)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Periodic", appliesTo: ["black-tea", "kangra-tea", "green-tea", "instant-tea-solid"] },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Heavy metals", lab: "NABL-accredited", cost: "₹4,000-6,000", frequency: "Annual" }
    ],
    conditionalDeclarations: [
      "Coffee-chicory blends: label must state \"Coffee blended with Chicory\" with the exact percentage of coffee and chicory declared, plus \"NOT TO BE SOLD LOOSE\"; instant coffee-chicory mixtures use the equivalent \"Instant Coffee-Chicory mixture made from blends of coffee and chicory\" declaration with percentages, verbatim wording from the official Labelling Schedule",
      "Flavoured tea (any format): the manufacturer must register with the Tea Board before marketing, per Ch 2.10.1; this is a real prerequisite, not just a label declaration",
      "Added natural flavours in tea: only permitted in packaged tea, not loose tea, and only flavours/flavouring substances obtained by physical processes from plant-origin material qualify",
      "Coffee content in any coffee-chicory product must actually be ≥51% by mass to legally use the \"coffee-chicory\" name at all; below that threshold Ch 2.10.4 does not recognize the product under this standard"
    ],
    prohibitedClaimIds: ["sugar-free-no-added-sugar", "unsubstantiated-health-claim", "brand-name-descriptor-disclaimer", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Tea, coffee, chicory, and blend compositional standards (ash, extract, fibre, caffeine, catechin limits by exact format)", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.10, sub-sections 2.10.1 (Tea) through 2.10.4 (Coffee-Chicory Mixture)", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  }),

  "confectionery-chocolate": makeCategory({
    displayName: "Confectionery / chocolate",
    fssCategory: { code: "Category 05, Confectionery. Confirmed under General Manufacturing in the FoSCoS schedule. The raw cocoa bean input is standardized under FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.54, and adjacent confectionery formats (candied/crystallised/glazed fruit, fruit bar/toffee) have their own dedicated standards under Chapter 2.3.19 and 2.3.26. Finished chocolate itself (cocoa-solids percentage, tempering grade) is not separately compositionally standardized in this chapter, so cocoa-bean input quality and the general confectionery labelling/additive rules are the enforceable bar.", standard: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.19 / 2.3.26 / 2.3.54" },
    testsDisclaimer: "The quality bar for chocolate is actually set on the input, not the finished bar: cocoa beans are capped by defect count — moldy ≤4%, slaty ≤8%, insect-damaged ≤2%, germinated or flat ≤4%. There's no separate FSSAI standard for cocoa percentage in the finished chocolate itself.",
    ingredientTags: [
      { id: "cocoa-beans", label: "Cocoa beans (raw input)", group: "Chocolate base", allergen: false, note: "Ch 2.3.54 standard: moisture ≤8%, moldy beans ≤4% by count, slaty beans ≤8%, insect-damaged ≤2%, germinated/flat beans ≤4%" },
      { id: "cocoa-solids", label: "Cocoa solids / mass", group: "Chocolate base", allergen: false },
      { id: "cocoa-butter", label: "Cocoa butter", group: "Chocolate base", allergen: false },
      { id: "milk-solids", label: "Milk solids / milk powder", group: "Chocolate base", allergen: true, allergenType: "milk" },
      { id: "sugar", label: "Sugar", group: "Chocolate base", allergen: false, sugarEquivalent: true },
      { id: "glucose-syrup", label: "Glucose syrup", group: "Chocolate base", allergen: false, sugarEquivalent: true },
      { id: "lecithin", label: "Lecithin (soy-derived emulsifier)", group: "Additives", allergen: true, allergenType: "soy" },
      { id: "vanilla", label: "Vanilla flavour / pods / powder", group: "Additives", allergen: false, note: "Ch 2.3.50 standard: minimum vanillin content 2.0% wet basis for genuine vanilla pods/cut vanilla/powder, distinguishing real vanilla from vanillin-only flavouring" },
      { id: "gelatin", label: "Gelatin (animal-derived, gummies/jellies)", group: "Additives", allergen: false, animalDerived: true },
      { id: "pectin", label: "Pectin (vegetarian gelling alternative)", group: "Additives", allergen: false },
      { id: "citric-acid", label: "Citric acid", group: "Additives", allergen: false },
      { id: "colour-synthetic", label: "Permitted food colour", group: "Additives", allergen: false },
      { id: "palm-oil", label: "Palm oil", group: "Additives", allergen: false },
      { id: "trehalose", label: "Trehalose", group: "Additives", allergen: false, sugarEquivalent: true },
      { id: "almonds", label: "Almonds (inclusions)", group: "Inclusions", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(6) standard: oil content ≥45.0%, acidity of extracted oil ≤1.25% as oleic acid" },
      { id: "hazelnuts", label: "Hazelnuts (inclusions)", group: "Inclusions", allergen: true, allergenType: "tree nuts" },
      { id: "cashews-confectionery", label: "Cashews (inclusions)", group: "Inclusions", allergen: true, allergenType: "tree nuts", note: "Ch 2.3.47(7) standard: free fatty acid ≤1.25% whole / ≤2.0% pieces" },
      { id: "fruit-puree", label: "Fruit puree (inclusions)", group: "Inclusions", allergen: false },
      { id: "candied-fruit", label: "Candied / crystallised / glazed fruit", group: "Fruit confectionery (standardized)", allergen: false, sugarEquivalent: true, note: "Ch 2.3.26 standard: total sugar ≥70.0%, reducing sugar as a percentage of total sugar ≥25.0%" },
      { id: "fruit-bar-toffee", label: "Fruit bar / toffee (fruit pulp base)", group: "Fruit confectionery (standardized)", allergen: false, sugarEquivalent: true, note: "Ch 2.3.19 standard: moisture ≤20.0%, total soluble solids ≥75.0%, fruit content ≥25.0%" },
      { id: "fruit-cheese", label: "Fruit cheese (thick-set fruit confection)", group: "Fruit confectionery (standardized)", allergen: false, sugarEquivalent: true, note: "Ch 2.3.33 standard: total soluble solids ≥65.0%, prepared fruit content ≥45.0% (≥25% for strawberry/raspberry)" },
      { id: "murabba", label: "Murabba (whole-fruit preserve)", group: "Fruit confectionery (standardized)", allergen: false, sugarEquivalent: true, note: "Ch 2.3.25 standard: total soluble solids ≥65.0%, fruit content ≥55.0%" },
      { id: "date-paste-confectionery", label: "Date paste (as base/binder)", group: "Fruit confectionery (standardized)", allergen: false, sugarEquivalent: true, note: "Ch 2.3.56 standard: moisture ≤20.0%, total ash ≤1.2%, no food additives permitted at all" }
    ],
    mandatoryTests: [
      { name: "Cocoa bean defect count (moldy/slaty/insect-damaged/germinated, per Ch 2.3.54 input-quality limits)", lab: "NABL-accredited", cost: "₹2,000-3,500", frequency: "Per incoming batch of cocoa beans, at CM level", appliesTo: ["cocoa-beans", "cocoa-solids", "cocoa-butter"] },
      { name: "Moisture content", lab: "NABL-accredited", cost: "₹1,200-2,000", frequency: "Per batch" },
      { name: "Total sugar and reducing sugar ratio (candied/crystallised/glazed fruit specifically, per Ch 2.3.26)", lab: "NABL-accredited", cost: "₹1,800-2,800", frequency: "Per batch, fruit-confectionery SKUs", appliesTo: ["candied-fruit"] },
      { name: "Total soluble solids (fruit bar/toffee ≥75%, fruit cheese ≥65%, murabba ≥65%)", lab: "NABL-accredited", cost: "₹1,500-2,500", frequency: "Per batch, fruit-confectionery SKUs", appliesTo: ["fruit-bar-toffee", "fruit-cheese", "murabba"] },
      { name: "Microbiological testing", lab: "NABL-accredited", cost: "₹3,000-5,000", frequency: "Quarterly" },
      { name: "Heavy metals", lab: "NABL-accredited", cost: "₹4,000-6,000", frequency: "Annual" },
      { name: "Fat content / cocoa solids verification", lab: "NABL-accredited", cost: "₹2,500-4,000", frequency: "Per SKU", appliesTo: ["cocoa-beans", "cocoa-solids", "cocoa-butter"] },
      { name: "Shelf-life / stability study", lab: "NABL-accredited", cost: "₹15,000-30,000", frequency: "Once per SKU, at launch" }
    ],
    conditionalDeclarations: [
      "If trehalose is added: label must state \"Contains Trehalose\"",
      "If gelatin is used, common in gummies and jellies even without meat: this makes the product non-vegetarian, requiring the brown triangle symbol, not the green circle. A frequently missed rule since founders assume no meat automatically means vegetarian",
      "If vanilla is claimed as \"real\" or \"natural\" rather than vanillin: the vanillin content must genuinely reach the Ch 2.3.50 floor of 2.0% on a wet basis",
      "Date-paste-based confections specifically: Ch 2.3.56 permits zero food additives in this exact standardized ingredient, so any additive-containing supply needs re-checking before use in a product marketed against this standard"
    ],
    prohibitedClaimIds: ["sugar-free-no-added-sugar", "gluten-free", "unsubstantiated-health-claim", "brand-name-descriptor-disclaimer", "hundred-percent-unqualified-claim"],
    extraSources: [
      { rule: "Cocoa bean input-quality standard, candied/crystallised/glazed fruit, fruit bar/toffee, fruit cheese, and murabba compositional standards", citation: "FSS (Food Product Standards and Food Additives) Regulations, 2011, Chapter 2.3.19, 2.3.25, 2.3.26, 2.3.33, and 2.3.54", url: "fssai.gov.in", checkedOn: "2026-07-24" }
    ],
    ctaCopy: "The roadmap is free. Execution is where we help - connecting you with the right food technologists, manufacturers, labs, and everything else you need to take your product from idea to first batch."
  })
};

/* No categories left unbuilt; kept as an empty array so renderCategoryCards()
   and the waitlist branch still work unchanged if a 16th category is added
   here later without being filled in yet. */
const LAUNCH_MAP_COMING_SOON = [];

/* Real product photography for the category picker cards, added one at a
   time as photos come in. A category with no entry here falls back to its
   CATEGORY_ICONS line-art, so this can be filled in incrementally without
   breaking the grid. */
const CATEGORY_PHOTOS = {
  "bakery-goods": "img/categories/bakery-goods.jpg",
  "snacks-extruded": "img/categories/snacks-extruded.jpg",
  "beverages-non-alcoholic": "img/categories/beverages-non-alcoholic.jpg",
  "staples-flour": "img/categories/staples-flour.jpg",
  "spreads-nut-butters": "img/categories/spreads-nut-butters.jpg",
  "staples-spices": "img/categories/staples-spices.jpg",
  "protein-bars": "img/categories/protein-bars.jpg",
  "rte-rtc": "img/categories/rte-rtc.jpg",
  "pickles-chutneys": "img/categories/pickles-chutneys.jpg",
  "sweeteners": "img/categories/sweeteners.jpg",
  "dairy-adjacent": "img/categories/dairy-adjacent.jpg",
  "tea-coffee": "img/categories/tea-coffee.jpg",
  "confectionery-chocolate": "img/categories/confectionery-chocolate.jpg",
  "dry-mixes-premixes": "img/categories/dry-mixes-premixes.jpg",
  "sauces-condiments": "img/categories/sauces-condiments.jpg"
};

/* Short, human-readable example lists shown on hover, so a founder can
   self-select the right card without reading full ingredient taxonomies
   (esp. useful for the Sweeteners vs Honey/syrups overlap). Deliberately
   plain-language product names, not KB ingredient IDs. */
const CATEGORY_EXAMPLES = {
  "bakery-goods": "Bread, cookies, cakes, pastries, muffins, croissants, rusk, etc.",
  "snacks-extruded": "Chips, extruded puffs, roasted mixtures, pretzels, namkeen/bhujia, etc.",
  "beverages-non-alcoholic": "Juices, functional drinks, kombucha, flavoured water, jaljeera, etc.",
  "dry-mixes-premixes": "Pancake mix, soup mix, baking mixes, instant noodles, dosa/idli mix, etc.",
  "staples-flour": "Refined flour, cornflour, oat flour, multigrain blends, atta, etc.",
  "staples-spices": "Peppercorns, paprika, cinnamon, spice rubs, garam masala, etc.",
  "spreads-nut-butters": "Peanut butter, almond butter, chocolate spread, fruit jam, cashew butter, etc.",
  "sweeteners": "Table sugar, sugar substitutes, stevia, monk fruit sweetener, jaggery/gur, etc.",
  "rte-rtc": "Ready meals, soup cups, frozen entrees, meal kits, ready-to-eat dal/paratha, etc.",
  "dairy-adjacent": "Plant milk, vegan cheese, coconut yogurt, tofu, plant-based ghee, etc.",
  "protein-bars": "Protein bars, energy bars, granola bars, trail mix, protein laddoo, etc.",
  "pickles-chutneys": "Relishes, salsas, fruit preserves, chutneys, mango pickle/achaar, etc.",
  "sauces-condiments": "Ketchup, mayonnaise, hot sauce, salad dressing, ginger-garlic paste, etc.",
  "tea-coffee": "Loose leaf tea, ground coffee, instant coffee, cold brew, masala chai premix, etc.",
  "confectionery-chocolate": "Chocolate bars, candies, toffees, truffles, mithai, etc."
};

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi (NCT)","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry","Andaman & Nicobar Islands",
  "Dadra & Nagar Haveli and Daman & Diu","Lakshadweep"
];

/* ============================================================
   ICONS
   Hand-drawn line-art in the same style as the homepage pillar
   icons (black stroke, one accent-colour detail, rounded caps).
   Inline SVG markup only, no external image files, consistent
   with the rest of this site.
   ============================================================ */

const CATEGORY_ICONS = {
  "bakery-goods": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 22 Q8 12 20 12 Q32 12 32 22 L31 30 Q31 33 28 33 L12 33 Q9 33 9 30 Z"/>
    <path d="M14 18 Q15 15 15 12 M20 18 Q20 14 20 12 M26 18 Q25 15 25 12" stroke="var(--accent)"/>
  </svg>`,
  "snacks-extruded": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 10 L26 10 L29 32 Q29 34 27 34 L13 34 Q11 34 11 32 Z"/>
    <path d="M13 10 Q20 14 27 10" />
    <circle cx="18" cy="24" r="1.4" fill="var(--accent)" stroke="none"/>
    <circle cx="23" cy="20" r="1.4" fill="var(--accent)" stroke="none"/>
    <circle cx="21" cy="28" r="1.4" fill="var(--accent)" stroke="none"/>
  </svg>`,
  "beverages-non-alcoholic": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 6 h6 v5 l3 5 v14 q0 3 -3 3 h-6 q-3 0 -3 -3 v-14 l3 -5 Z"/>
    <path d="M15 25 h10" stroke="var(--accent)"/>
  </svg>`,
  "dry-mixes-premixes": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 13 h16 l2 18 q0 3 -3 3 h-14 q-3 0 -3 -3 Z"/>
    <path d="M12 13 Q20 17 28 13" stroke="var(--accent)"/>
  </svg>`,
  "staples-flour": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 15 h14 l-1.5 16 Q25 34 20 34 Q15 34 14.5 31 Z"/>
    <path d="M16 15 v-3 h8 v3" />
    <circle cx="20" cy="22" r="1.2" fill="var(--accent)" stroke="none"/>
  </svg>`,
  "staples-spices": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="15" width="12" height="18" rx="2"/>
    <rect x="16" y="10" width="8" height="5" rx="1"/>
    <circle cx="18" cy="22" r="1" fill="var(--accent)" stroke="none"/>
    <circle cx="22" cy="25" r="1" fill="var(--accent)" stroke="none"/>
    <circle cx="19" cy="28" r="1" fill="var(--accent)" stroke="none"/>
  </svg>`,
  "spreads-nut-butters": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 15 h16 v15 q0 4 -4 4 h-8 q-4 0 -4 -4 Z"/>
    <ellipse cx="20" cy="15" rx="8" ry="2.2"/>
    <path d="M25 8 l4 4 -3 3 -3 -3 Z" stroke="var(--accent)"/>
  </svg>`,
  "sweeteners": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 17 h14 v13 q0 4 -4 4 h-6 q-4 0 -4 -4 Z"/>
    <ellipse cx="20" cy="17" rx="7" ry="2"/>
    <path d="M20 8 q4 4 0 9 q-4 -5 0 -9" fill="var(--accent)" stroke="none"/>
  </svg>`,
  "rte-rtc": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 20 h22 q0 11 -11 11 Q9 31 9 20 Z"/>
    <path d="M16 12 q2 -3 0 -6 M20 12 q2 -3 0 -6 M24 12 q2 -3 0 -6" stroke="var(--accent)"/>
  </svg>`,
  "dairy-adjacent": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 8 h8 l1 5 h-10 Z"/>
    <path d="M15 13 h10 v17 q0 3 -3 3 h-4 q-3 0 -3 -3 Z"/>
    <path d="M15 24 h10" stroke="var(--accent)"/>
  </svg>`,
  "protein-bars": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="16" width="22" height="9" rx="2.5"/>
    <path d="M7 20.5 q-2.5 0 -2.5 -2.5 t2.5 -2.5" stroke="var(--accent)"/>
    <path d="M33 20.5 q2.5 0 2.5 -2.5 t-2.5 -2.5" stroke="var(--accent)"/>
  </svg>`,
  "pickles-chutneys": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="13" y="13" width="14" height="19" rx="4"/>
    <rect x="16" y="9" width="8" height="4" rx="1"/>
    <ellipse cx="18" cy="20" rx="2" ry="3.5" fill="var(--accent)" stroke="none" transform="rotate(-20 18 20)"/>
    <ellipse cx="23" cy="25" rx="2" ry="3.5" fill="var(--accent)" stroke="none" transform="rotate(15 23 25)"/>
  </svg>`,
  "sauces-condiments": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 6 h6 v4 h-6 Z"/>
    <path d="M17.5 10 q-4 2 -4 7 v12 q0 4 4 4 h5 q4 0 4 -4 v-12 q0 -5 -4 -7"/>
    <path d="M15 20 h10" stroke="var(--accent)"/>
    <path d="M15 24 h6" stroke="var(--accent)"/>
  </svg>`,
  "tea-coffee": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 16 h16 v11 q0 6 -8 6 t-8 -6 Z"/>
    <path d="M27 18 q6 0 6 4.5 t-6 4.5"/>
    <path d="M15 11 q2 -2 0 -4 M20 11 q2 -2 0 -4" stroke="var(--accent)"/>
  </svg>`,
  "confectionery-chocolate": `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="13" width="22" height="15" rx="2"/>
    <path d="M15.7 13 v15 M22.3 13 v15 M9 20.5 h22"/>
    <rect x="9.8" y="13.8" width="5.1" height="6" fill="var(--accent)" stroke="none"/>
  </svg>`
};

const GROUP_ICONS = {
  "Flours & bases": `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="M12 13c-4-1-5-4-5-7 3 0 6 1 5 7Z"/><path d="M12 10c4-1 5-4 5-7-3 0-6 1-5 7Z"/></svg>`,
  "Sweeteners": `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 0 6 0 10a3 3 0 1 1 0-10Z"/></svg>`,
  "Fats & oils": `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6v3l3 4v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8l3-4Z"/></svg>`,
  "Eggs & egg alternatives": `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c4 0 6-3 6-7 0-5-3-11-6-11S6 9 6 14c0 4 2 7 6 7Z"/></svg>`,
  "Raising agents & additives": `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="16" r="2.2"/><circle cx="15" cy="10" r="1.6"/><circle cx="16" cy="17" r="1.2"/></svg>`,
  "Add-ins & inclusions": `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c4 1 6 4 6 8 0 5-3 10-6 10s-6-5-6-10c0-4 2-7 6-8Z"/><path d="M12 3v18"/></svg>`,
  "Protein additions": `<svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4M20 10v4M7 8v8M17 8v8M7 12h10"/></svg>`
};

const REPORT_ICONS = {
  license: `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="6" width="22" height="28" rx="3"/>
    <path d="M14 14 h12 M14 19 h12 M14 24 h7" stroke="var(--accent-peach)"/>
    <circle cx="24" cy="27.5" r="3.2" stroke="var(--accent-peach)"/>
    <path d="M22.5 30 l-1.5 4 3-1.5 3 1.5 -1.5-4" stroke="var(--accent-peach)"/>
  </svg>`,
  tests: `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 6 h8 M17 6 v11 l-6.5 12 Q9 32 12 32 h16 q3 0 1.5 -3 L23 17 V6"/>
    <path d="M14.5 24 h11" stroke="var(--accent-mint)"/>
    <circle cx="18" cy="27.5" r="1" fill="var(--accent-mint)" stroke="none"/>
    <circle cx="22" cy="28.5" r="1" fill="var(--accent-mint)" stroke="none"/>
  </svg>`,
  labels: `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 12 L20 6 L33 19 L21 32 Z"/>
    <circle cx="14.5" cy="14.5" r="2" fill="var(--accent-lilac)" stroke="none"/>
  </svg>`,
  cleanlabel: `<svg viewBox="0 0 40 40" fill="none" stroke="var(--black)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 8 C12 8 9 14 9 20 C9 28 14 33 20 33 C26 33 31 28 31 20 C31 14 28 8 20 8 Z"/>
    <path d="M15 20 L18.5 24 L26 15" stroke="var(--accent-mint)"/>
  </svg>`
};
