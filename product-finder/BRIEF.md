# Cellife product finder — design and implementation brief

Draft v1 · 30 October 2026 · UNPUBLISHED · 12 source sheets reviewed

## Purpose and evidence boundary

Help an adult choose a product to investigate for one wellbeing goal. This is a catalogue match, not a diagnosis, treatment plan, assessment of effectiveness, or assurance that a product is safe. Return one product at most, or a clear no-match / professional-review outcome. Do not recommend a supplement stack.

All product facts below come from the 12 supplied one-page PDFs. References such as [S03, p1, Warnings] point to the source register at the end. They establish what the supplier sheet says, not that the claim is clinically proven, currently authorised, or appropriate for an individual. No independent clinical, regulatory, interaction, or current-label verification was performed. The linked earlier chat exposes no readable detail of “option B”; this brief follows the current explicit request.

Use these evidence labels in the data:

- **F — sheet fact:** ingredient, formulation, dosage wording or identifier reported by the sheet. Still requires current-label verification.
- **C — unverified advertising claim:** benefits, mechanisms, traditional-use statements, superiority and duration claims reported by the sheet. No clinical evidence dossier was supplied.
- **W — explicit sheet warning:** reproduce faithfully in the internal record; absence of a warning is not evidence of safety.
- **P — proposed quiz safeguard:** conservative routing or exclusion designed here. It is not a contraindication established by the sheet and must never be presented as one.

All public copy is proposed copy requiring claims review. Do not display “TGA Approved,” imply an AUST L identifier proves efficacy, or convert ingredient mechanisms into proven product outcomes. Store the sheet's original wording internally with its source. Do not automatically publish even the milder benefit wording below.

## Product-to-goal matrix

Primary and secondary tags are design decisions based on the cited sheet claims. Only primary routes participate in v1 recommendations; secondary tags are editorial context, not fallback recommendations. Every benefit in this table is **C**, not independently verified evidence of efficacy.

| ID / source | Primary goal route | Secondary claims: not scored in v1 | Sheet-grounded basis and ingredient facts | Warnings / recommendation constraints |
|---|---|---|---|---|
| stress / S01, AUST L 399644 | Everyday stress support | Mood, sleep, energy mechanisms | Description says stress-response support; ingredient section discusses chamomile, ashwagandha and rhodiola. F: nicotinamide 8.4 mg, acetyl levocarnitine HCl 100 mg, tryptophan 130 mg/capsule; botanical amounts are dry-equivalent amounts. [p1, Description; Benefits of Ingredients; Active Ingredients] | W: follow dose guidelines; supplements do not replace balanced diet. Daily dose absent from this sheet. P: no anxiety/depression/insomnia treatment route; current label needed before dose information is shown. |
| propolis / S02, AUST L 316796 | Immune support, bee-derived preference | General wellbeing, oral health, antioxidant, glucose metabolism, cold/flu symptoms | Benefits explicitly lists immune support. F: propolis 500 mg/capsule, with 2500 mg equivalence wording. [p1, Benefits; Active Ingredients] | W: not for asthma/allergy sufferers; not for children; not recommended with reduced-calorie diet AND increased activity. Description's extract-equivalence wording needs reconciliation with label. P: no automatic glucose/cold/flu route. |
| man / S03, AUST L 520645 | Healthy libido / physical endurance | Energy, circulation | Benefits and Description name healthy libido and physical endurance; herbal formula described in traditional Chinese medicine terms. [p1, Description; Benefits] | W: adult use; persistent symptoms → stop and consult. P: no erectile dysfunction, testosterone, fertility, or cardiovascular treatment promise; do not infer suitability from gender. |
| sugar / S04, AUST L 400792 | Healthy blood-sugar support in otherwise healthy adults | Sugar cravings | Description names healthy blood-sugar support; ten-ingredient table includes alpha-lipoic acid 25 mg, chromium 0.0125 mg and zinc 5 mg/capsule; barley and multiple botanicals present. [p1, Description; Benefits of Ingredients; Active Ingredients] | W: general label/dose/diet warnings. Daily dose absent. P: diabetes, abnormal glucose, medicines or a request to treat disease → professional review; barley is an ingredient fact, not a verified gluten-free/allergen declaration. |
| bq / S05, AUST L 383218 | Immune support, botanical preference | Mild upper respiratory infection symptoms, digestion, antioxidant | Benefits names immune support; Active Ingredients table shows bromelains, quercetin, Nigella, andrographis and turmeric. [p1, Description; Benefits; Active Ingredients] | W: pineapple allergy exclusion; contraindications list antibiotics, sedatives, anticoagulants; andrographis allergy warning, including anaphylaxis and immediate medical attention. “Adults Only” dose conflicts with under-2 warning: v1 adult-only. P: no infection-treatment or automatic allergy remedy route. |
| rrr / S06, AUST L 521752 | Cellular metabolism support, standard preference | Antioxidant, tissue regeneration | Description names nicotinic acid and nicotinamide as NAD+ precursors. Benefits names metabolism and tissue regeneration. [p1, Description; Benefits] | W: not recommended pregnancy/lactation; not recommended with reduced calories AND increased activity; empty-stomach flushing/redness/itching described. P: do not repeat “harmless” as a blanket reassurance; no longevity / DNA-repair outcome promise. |
| coq10 / S07, AUST L 316798 | Energy support | Heart/blood health, antioxidant, immunity; blood-pressure, weight-loss and hair claims withheld | Benefits explicitly names energy support. F: CoQ10 150 mg, vitamin E amount 38.5 mg, natural fish oil 500 mg/capsule. [p1, Benefits; Active Ingredients] | W: not for asthma/allergy sufferers or children; not recommended with reduced calories AND increased activity. P: fish-derived ingredient blocks vegan preference; no hypertension, weight loss or heart-disease treatment route. Do not silently delete unusual warnings as presumed copy errors. |
| detox / S08, AUST L 322109 | Skin/hair/nail wellbeing | Antioxidant, natural detoxification, eye protection | Description names skin, hair and nails. F: glutathione 125 mg/tablet; grape-seed quantity is extract-equivalent dry seed in the ingredient table, not 45 g of actual extract. [p1, Description; Benefits; Active Ingredients] | W: adults only; not recommended pregnancy/lactation; persistent symptoms → stop and consult. P: withhold skin whitening, wrinkle removal, “toxin removal,” superiority and “leading market” promises. |
| boost / S09, AUST L 395833 | Cellular metabolism support, sustained-release preference | Antioxidant, tissue regeneration | Description calls formula sustained release; Benefits claims absorption over 8–10 hours. Contains nicotinic acid and nicotinamide. [p1, Description; Benefits] | W: pregnancy/planning/breastfeeding → doctor/pharmacist; not recommended with reduced calories AND increased activity; flushing warning includes stop/consult if severe or persistent. P: mutually exclusive with R.R.R.; no superiority or guaranteed all-day-energy claim. 8–10 hours remains unverified C. |
| vision / S10, AUST L 393078 | Eye wellbeing | Eye strain, dry eyes, light adaptation/night vision, antioxidant | Description names healthy eye function; table lists beta-carotene 1 mg, microalgal DHA 40 mg, Tagetes 10 mg and bilberry dry-fruit equivalent 3000 mg/capsule. [p1, Description; Active Ingredients] | W: general label/dose/diet warnings. Daily dose absent. P: sudden changes, pain or persistent symptoms → professional review; no disease-prevention route. Microalgal DHA does not establish vegan capsule/excipients. |
| ampk / S11, AUST L 322110 | Body-fat / weight-management interest | Metabolism, wellbeing, fibre | Benefits claims body-fat reduction in healthy individuals. F: table includes psyllium dry-herb equivalent 800 mg, oyster shell 10 mg, vitamin K2 60 mcg/tablet. [p1, Benefits; Active Ingredients] | W: adults only; take with food or within one hour, sufficient water; use caution with reduced calories AND increased activity. P: send that combination to professional review, rather than invent a ban; oyster shell blocks vegan preference; no guaranteed loss, timeline or AMPK-activation claim. |
| antioxidant / S12, AUST L 320772 | General antioxidant wellbeing | Healthy cell function | Benefits names free-radical damage and general wellbeing. F: ingredient table includes vitamin C 100 mg, acetyl levocarnitine HCl 125 mg, beta-carotene 1 mg, quercetin 8.4 mg/tablet plus botanicals. [p1, Benefits; Active Ingredients] | W: not recommended pregnancy/lactation, stated under Dosage; general label/diet warnings. P: do not turn the hourglass image into an anti-ageing or lifespan claim. |

**Shared W:** read label; observe dosage; keep away from children; do not use if seal is broken; storage instructions vary by product (25°C or 30°C). Do not replace these with one universal temperature. Vitamin/mineral diet caveat is present on many, not all, sheets. Keep product-specific warning records.

**Source-dose reference, not quiz instructions:** S02/S07: 1 capsule daily with meal; S03/S06/S08/S09: 1–3 tablets daily with food/meal; S05: 2 tablets twice daily; S11: 1 tablet with food or within an hour, 1–3 daily plus sufficient water; S12: 1 tablet once or twice daily with food. S01/S04/S10: daily dose not provided. Do not choose or optimise a dose in the quiz; use current label on the product detail page after verification.

## Five-question branching flow

Intro: “Find a Cellife product to explore for your wellbeing goal. Your answers match product-sheet information; they do not establish that a product is effective or safe for you. You can receive a no-match result.” No email gate; no default answers. Back navigation preserves valid answers and clears Q5 when Q1 changes.

### Q1 — What is your main goal?

Single-select codes and labels:
`stress` Everyday stress support; `energy` Energy support; `eyes` Eye wellbeing; `immune` Immune support; `glucose` Healthy blood-sugar support; `libido` Healthy libido or physical endurance; `skin` Skin, hair and nail wellbeing; `cellular` Cellular metabolism support; `weight` Body-fat / weight-management support; `general` General antioxidant wellbeing; `other` Something else / unsure.

One goal prevents arbitrary mixing of low-specificity antioxidant claims. `other` ends at NO_MATCH with “We do not have a clear product-sheet match for that goal.” No commercial fallback.

### Q2 — Which age and life-stage option applies?

Single-select: `adult` 18+ and none of the following; `under18` Under 18; `pregnancy` Pregnant, planning pregnancy or breastfeeding; `unknown` Unsure / prefer not to answer.

Anything except `adult` ends at REVIEW with no product. **P:** 18+ and the global life-stage rule are conservative design limits, not a claim that every sheet specifies age 18 or contraindicates pregnancy. S06/S08/S12 specifically discourage pregnancy/lactation; S09 directs consultation. Do not infer other formulas are safe because they omit it.

### Q3 — Does any of this apply to you?

Multi-select: `medicine` Any prescription or non-prescription medicine; `supplement` Other supplements; `condition` A diagnosed condition or ongoing investigation; `symptoms` New, severe, persistent or worsening symptoms, or seeking treatment for a condition; `dietActivity` BOTH a reduced-calorie diet and increased physical activity; `none`; `unknown` / prefer not to answer.

`none` and `unknown` are exclusive. Any of medicine/supplement/condition/symptoms/unknown ends at REVIEW, with no recommendation. **P:** broad professional-review gate; not an assertion that all medicines or supplements interact. Keep explicit S05 antibiotic/sedative/anticoagulant warnings in product data and detail copy. The quiz does not diagnose urgent symptoms; the REVIEW message should say to seek prompt medical attention for severe or sudden symptoms. This is proposed escalation wording, not medical triage.

`dietActivity` alone continues and is used in product-specific routing. A reduced-calorie diet alone or activity alone is not the same source condition. Do not reinterpret the sheets as advising against exercise.

### Q4 — Do you have asthma, any allergy, or a dietary requirement?

Multi-select: `asthma`; `allergy` Any known or suspected allergy, including bee products, pineapple, fish, shellfish, plants or ingredients; `vegan`; `none`; `unknown` / prefer not to answer. `none` and `unknown` exclusive. Any allergy or unknown ends at REVIEW (**P**, because complete excipient/allergen declarations are unavailable). No free-text allergy collection in v1. Asthma and vegan alone continue.

Underlying explicit rules still matter: S02/S07 asthma/allergy warnings; S05 pineapple and andrographis warnings. Asthma excludes S02/S07; allergy never bypasses the global REVIEW gate even if a different product seems to match. Vegan status is a verified-compatibility filter, not a nutrition judgement.

### Q5 — Goal-specific clarification

Render exactly one branch for a continuing user:

| Q1 branch | Question and enum answers | Candidate order / effect |
|---|---|---|
| stress | “Are you exploring everyday stress support, rather than care for symptoms?” `everyday`, `symptomCare`, `unsure` | everyday → stress; others → REVIEW |
| energy | “Are you exploring general energy support, rather than unexplained or persistent tiredness?” `generalEnergy`, `persistent`, `unsure` | generalEnergy → coq10; others → REVIEW |
| eyes | “Are you exploring general eye wellbeing?” `wellbeing`, `symptomCare`, `unsure` | wellbeing → vision; others → REVIEW |
| immune | “Do you have a formula preference?” `botanical`, `bee`, `noPreference` | botanical → bq only; bee → propolis only; noPreference → bq, then propolis |
| glucose | “Are you exploring support for healthy blood-sugar levels, rather than treating diabetes or abnormal readings?” `healthy`, `treatment`, `unsure` | healthy → sugar; others → REVIEW |
| libido | “Is your goal healthy libido or physical endurance, rather than care for a new or persistent problem?” `wellbeing`, `symptomCare`, `unsure` | wellbeing → man; others → REVIEW |
| skin | “Are you exploring general skin, hair and nail wellbeing?” `wellbeing`, `symptomCare`, `unsure` | wellbeing → detox; others → REVIEW |
| cellular | “Which formulation would you like to explore?” `standard`, `sustained`, `noPreference` | standard → rrr only; sustained → boost only; noPreference → rrr only |
| weight | “Are you exploring body-fat support as a generally healthy adult?” `healthyAdult`, `conditionOrSymptoms`, `unsure` | healthyAdult → ampk; others → REVIEW |
| general | “Are you looking for general antioxidant wellbeing support?” `wellbeing`, `treatment`, `unsure` | wellbeing → antioxidant; others → REVIEW |

Early-exit users answer fewer than five questions. Five is the maximum, with one question per screen. Preference is not efficacy evidence. BQ is the documented no-preference immune default because its sheet explicitly lists immune support; propolis is a secondary editorial option, not a weaker or stronger clinical choice. R.R.R. is the no-preference cellular default to avoid asserting sustained release is better. No ranking by margin, popularity or number of claimed benefits.

## Deterministic decision contract

Evaluate in this order. Keep the rule IDs stable for QA and explainability.

1. **R0 Validate:** reject unknown enums, contradictory exclusive selections and invalid branch answers. Missing required answers produce INCOMPLETE; do not interpret missing as “none.” No recommendation while validation errors exist.
2. **R1 Source integrity:** require all 12 records, unique product IDs and source IDs; each source must have page/section locators. Missing/changed/unapproved data returns DATA_HOLD in a public build. Draft preview can use this design dataset but must show DRAFT.
3. **R2 Eligibility:** apply Q2 life-stage and Q3/Q4 review gates above. Review gates take priority over commercial matching, including an `other` goal if those answers were already supplied. Under-18 ends without a product.
4. **R3 Intent:** `other` → NO_MATCH. Q5 clinical/unsure answers → REVIEW. Explicit “noPreference” remains valid for immune/cellular; it is not a health-uncertainty answer.
5. **R4 Build candidates:** use the exact Q1/Q5 ordered list. No secondary-tag scoring or AI inference. Immune fallback only for noPreference. No fallback for an explicitly chosen formula.
6. **R5 Filter candidates:** asthma removes propolis/coq10 (**W**). `dietActivity` removes propolis/coq10/rrr/boost (**W**) and ampk (**P review of W caution**). Vegan preference removes coq10 (fish oil) and ampk (oyster shell) (**F**); all other products are also held for vegan users until full capsule/excipient compatibility is verified (**P**). Do not infer vegan status from botanical active ingredients. Thus v1 cannot auto-recommend for a vegan requirement.
7. **R6 Select:** first remaining candidate wins; return exactly one MATCH. If all removed and any removal requires clarification (dietActivity+ampk or unverified vegan compatibility), return REVIEW. Otherwise return NO_MATCH. Store per-candidate reason IDs. Never relax an exclusion to produce a sale.
8. **R7 Present:** show match reason, limits and warnings. Any warning change requires rule review. An excluded candidate may appear only in an explanation, never as a suggested purchase or clickable alternative.

No-match copy: “We could not identify a product-sheet match that meets your answers. A pharmacist or healthcare professional can help review suitable options.” Review copy: “Your answers need individual review before we suggest a product. Please speak with a pharmacist or healthcare professional.” Add the relevant explicit source warning in plain language when one applies, while identifying broader routing as quiz policy.

### Example result card

“Product to explore: Vision+”

“Why it appeared: You selected eye wellbeing. The supplied Cellife sheet describes support for healthy eye function. This is a supplier claim, not independently verified evidence of effectiveness.”

“Before use: Read the current label and follow its directions. This quiz does not establish suitability. Ask a pharmacist about medicines, other supplements or ingredients. New, severe or persistent eye symptoms need individual assessment.”

CTA in preview: “View draft product information.” Production CTA may become “Read product information” only after label, claim and destination checks. No “safe for you,” “perfect match,” percentages, guaranteed results, urgency, subscription preselection or automatic basket additions. No dosage recommendation in the card.

## Test cases and acceptance criteria

Baseline B = Q2 adult; Q3 none; Q4 none; valid Q5 wellbeing/general option for the goal. Tests target the draft engine; public builds additionally require release approval. For test data, an omitted prior answer on an early exit is permissible; a missing required answer on a continuing route is not.

| Test | Inputs / change to baseline | Expected outcome |
|---|---|---|
| T01 | stress / everyday | MATCH stress |
| T02 | energy / generalEnergy | MATCH coq10 |
| T03 | eyes / wellbeing | MATCH vision |
| T04 | immune / botanical | MATCH bq |
| T05 | immune / bee | MATCH propolis |
| T06 | immune / noPreference | MATCH bq, one result only |
| T07 | glucose / healthy | MATCH sugar; no diabetes-treatment copy |
| T08 | libido / wellbeing | MATCH man |
| T09 | skin / wellbeing | MATCH detox; no whitening promise |
| T10 | cellular / standard | MATCH rrr |
| T11 | cellular / sustained | MATCH boost, never rrr+boost |
| T12 | cellular / noPreference | MATCH rrr |
| T13 | weight / healthyAdult | MATCH ampk |
| T14 | general / wellbeing | MATCH antioxidant |
| T15 | any goal, Q2 under18 | REVIEW, no product, Q3–5 not required |
| T16 | any goal, Q2 pregnancy or unknown | REVIEW, no product |
| T17 | any goal, Q3 medicine | REVIEW; no attempt to infer interaction safety |
| T18 | any goal, Q3 supplement, condition, symptoms or unknown (separate runs) | REVIEW |
| T19 | energy, Q4 asthma | NO_MATCH; coq10 excluded by W |
| T20 | immune / bee, Q4 asthma | NO_MATCH; no switch to bq |
| T21 | immune / noPreference, Q4 asthma | MATCH bq, propolis ineligible |
| T22 | any goal, Q4 allergy or unknown | REVIEW; do not substitute another formula |
| T23 | cellular / standard or sustained, Q3 dietActivity | NO_MATCH; relevant formula excluded |
| T24 | immune / bee, Q3 dietActivity | NO_MATCH; propolis excluded |
| T25 | immune / noPreference, Q3 dietActivity | MATCH bq |
| T26 | weight, Q3 dietActivity | REVIEW due to AMPK caution, no product |
| T27 | general, Q3 dietActivity | MATCH antioxidant; do not globalise diet/activity warning |
| T28 | energy, Q4 vegan | NO_MATCH: known fish oil; no alternative |
| T29 | weight, Q4 vegan | NO_MATCH: known oyster shell |
| T30 | eyes, Q4 vegan | REVIEW: capsule/excipients unverified |
| T31 | glucose / treatment; energy / persistent; any Q5 clinical/unsure branch | REVIEW |
| T32 | goal other, no review-triggering answers | NO_MATCH |
| T33 | Q3 none+medicine, or Q4 none+vegan | INVALID; zero products |
| T34 | missing Q5 on continuing route | INCOMPLETE; zero products |
| T35 | Q1 changes immune→eyes, old bee Q5 retained | clear Q5 in UI; stale payload INVALID |
| T36 | missing record/source, duplicate ID, unreviewed public configuration | DATA_HOLD; zero products |
| T37 | medicine+asthma+dietActivity | REVIEW wins; return no commercial fallback |
| T38 | asthma+vegan, energy | NO_MATCH; retain both exclusion reasons |
| T39 | unknown enum / unrecognised free text | INVALID; never guess a goal |
| T40 | identical validated input repeated | identical status, product and reason ordering |

Also verify keyboard-only completion, radio/checkbox semantics, labels and errors read by screen reader, mobile layout, back navigation, and that a result changes immediately after changing safety answers. All MATCH responses must contain exactly one eligible ID and source-backed rationale; every other status must contain zero IDs. A negative answer is not proof of safety. Tests are specification vectors; no website or clinical suitability engine has been deployed or validated.

## Codex-ready implementation brief

Build an unpublished, accessible, responsive product-finder prototype in the existing site repository after inspecting its local instructions and components. Do not deploy, merge, publish, modify live products or install trackers. Keep a preview flag on. Use a deterministic pure function; do not use an LLM, inferred medical classifications or fuzzy matching at runtime.

Deliver these pieces:

1. `products.json`: exactly 12 stable IDs from the matrix, `sourceId`, `austLReported`, `primaryGoals`, `secondaryClaims`, `ingredientFacts`, `sheetWarnings`, `policyRules`, `claimReviewStatus`, `labelReviewStatus`, `veganCompatibility` (`yes|no|unknown`), and `formulationGroup`. R.R.R./Boost share group `rrr`. Keep source facts, claims and policy separate. No claims review status may default to approved.
2. `evidence.json`: each item has `evidenceId`, `productId`, `sourceId`, `page:1`, `section`, faithful paraphrase, `kind:F|C|W|P`, `verifiedAgainstCurrentLabel:false`, `reviewer:null`, and `reviewedAt:null`. Ingredient equivalence quantities must carry a unit and explicit `quantityBasis` (`actual|equivalentDry|equivalentNutrient`); do not flatten all to mg of extract. Public copy references approved claim IDs only.
3. `questions.json`: typed Q1–Q5 enums, branch-specific labels, validation, stop conditions, and exclusive choices. The Q3 diet/activity option is conjunction, not OR. Keep answer labels separate from enum values.
4. `recommend.ts`: `evaluate(answers, catalog, mode)` returns `{status, productIds, reasonIds, exclusionReasons, evidenceIds, nextQuestion, rulesVersion}`. Status enum: `INCOMPLETE|INVALID|DATA_HOLD|REVIEW|NO_MATCH|MATCH`. `productIds` has length 1 only for MATCH, otherwise 0. Validate gate screens as reached; early exits do not demand later answers. Reject contradictory or stale supplied answers before selection. Stable reason order follows rule priority then catalog candidate order.
5. UI: intro, five-step maximum flow, early exit cards, match card, review/no-match/data-hold cards, restart, back and accessible progress. Medical questions use categorical answers only. No identifying health free text. Keep answers in memory; clear on restart and unload by default. Do not put answers in URLs, analytics, logs, CRM, local storage or email captures. Optional analytics may record aggregate completion/status without goals or health answers only after a separate privacy decision.
6. Unit tests: implement T01–T40 as parameterised tests, expanding grouped cases. Add invariants for one result maximum, excluded products never selected, unknown data fails closed, and branch changes clear stale data. Add one end-to-end normal path and one early review path plus accessibility checks suited to the existing project.
7. Preview evidence panel: staff-only list of evidence and rule IDs explaining the result; do not expose raw health answers through telemetry. UI preview must prominently state “Draft — product claims and labels awaiting review.”

Implementation order: create evidence/catalog data → validate schema → implement pure evaluator and tests → build UI → check accessibility and mobile → review preview with product owner. Provide changed-file summary and test results. Stop before any publishing action.

### Release gates (not requests to publish)

- Confirm all 12 current labels, identifiers, formulations and product destinations against owner-supplied approved material. The PDFs carry no version dates establishing currency.
- Obtain qualified review of medication, allergy, pregnancy and other safety wording; expand safeguards where needed. This draft is not a complete interaction database.
- Reconcile unusual S02/S07 asthma/allergy and diet/activity warnings without silently discarding them; reconcile S05 age wording.
- Verify missing daily doses for Stress Relief, Sugar Support and Vision+; never fabricate them.
- Review source claims and proposed public copy, particularly weight/fat loss, blood sugar, infection, libido, “detox,” eye symptoms, and regulatory wording. This design does not make a legal compliance determination.
- Verify complete ingredient/excipient and dietary declarations before allowing allergy-specific or vegan auto-matching. Current global allergy review gate remains until that work is done.
- Treat R.R.R. and Boost as distinct formulations, not an upgrade claim; verify release-duration wording before public use.
- Pass functional and accessibility acceptance checks; explicit user approval is still required before publishing.

## Source register

All 12 documents are one page. The source files were read only. Table locators refer to printed section headings; image-based ingredient tables were inspected visually. These are supplier documents, not independent clinical sources.

- **S01** — [Cellife Product Sheet - Stress Relief.pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-Hb3rAN/Cellife Product Sheet - Stress Relief.pdf>) · p1 · SHA-256 `dc6e8eacac6bd36490a9e638f377a27e1ca6ea623a1fe5d53fa8623a9c8a0784`

- **S02** — [Cellife Product Sheet - Propolis.pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-Uato2N/Cellife Product Sheet - Propolis.pdf>) · p1 · SHA-256 `09b3d6b791b3cfa3d86725ca34e9fcd81c7c9e2e5df7fa22848c4ec379cb9594`

- **S03** — [Cellife Product Sheet - Man Power (520645).pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-pieVK4/Cellife Product Sheet - Man Power (520645).pdf>) · p1 · SHA-256 `aef635d446fdc456b4ff9fc187fe15bc9c3279a67f3753cdea00e440241038eb`

- **S04** — [Cellife Product Sheet - Sugar Support.pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-Dg7B7C/Cellife Product Sheet - Sugar Support.pdf>) · p1 · SHA-256 `b1173ff3c8cd28fb34fe6fcabf04de6011cbe3ebfcb1d7192ce3a7987372529e`

- **S05** — [Cellife Product Sheet - Bromelains & Quercetin.pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-LMJ1N9/Cellife Product Sheet - Bromelains & Quercetin.pdf>) · p1 · SHA-256 `21e890581cb0609032957125c270e18b15d38029931100fca1a31fd44e02110e`

- **S06** — [Cellife Product Sheet - R.R.R. (521752).pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-5qkEJM/Cellife Product Sheet - R.R.R. (521752).pdf>) · p1 · SHA-256 `a1e02d8b0e8230a135779b5e9807215d53685efcc0dfc1c5f93b51c11fd849d2`

- **S07** — [Cellife Product Sheet - COQ10 (316798).pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-jmktj2/Cellife Product Sheet - COQ10 (316798).pdf>) · p1 · SHA-256 `94346ad41d76cef8e26e57b019b83351ec1ac2ffa58c3c20214c10fd9ed4ea71`

- **S08** — [Cellife Product Sheet - DETOX (322109).pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-iWMHKy/Cellife Product Sheet - DETOX (322109).pdf>) · p1 · SHA-256 `e2500231bf9033c2038d6753659edc96ca7fd05184e7763222c61de3ac82e568`

- **S09** — [Cellife Product Sheet - R.R.R. Boost (395833).pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-1VHOAa/Cellife Product Sheet - R.R.R. Boost (395833).pdf>) · p1 · SHA-256 `29ae99e23467f01eb4acc814fcc87eb4f1d9fbfe6ae3e8fee3e29036a6a221d3`

- **S10** — [Cellife Product Sheet - Vision+.pdf](</private/var/folders/vt/qlg0csh55yj5vscjrljnvyp80000gn/T/codex-file-preview-7FFZhg/Cellife Product Sheet - Vision+.pdf>) · p1 · SHA-256 `6acfa5292fc0c238708be174289024eae77112268a0e5be3be02d2def7b92195`

- **S11** — [Cellife Product Sheet - AMPK Fatburst.pdf](</Users/mills/Downloads/Cellife Supplement-2/Cellife Product Sheet - AMPK Fatburst.pdf>) · p1 · SHA-256 `9b0b401c944607f99d60f430ac66218df7a288e2b6bb93de6e62763717054c39`

- **S12** — [Cellife Product Sheet - Antioxidant.pdf](</Users/mills/Downloads/Cellife Supplement-2/Cellife Product Sheet - Antioxidant.pdf>) · p1 · SHA-256 `2be2647db05b2838428c88684a5c876de257cc1b8d3e34fac3869b692031c7bb`
