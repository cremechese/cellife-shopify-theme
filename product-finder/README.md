# Cellife Product Finder — unpublished draft

## Integration

`sections/cellife-product-finder.liquid` is a reusable Online Store 2.0 section,
with `templates/page.product-finder.json` as its dedicated page template. It uses
Cellife's existing blue/red, Dawn typography fallbacks and native product objects.
Its CSS and ES modules load only when the section is present. There are no new
storefront dependencies, apps, backend services, cart changes or checkout changes.
Existing homepage sections and quiz links have not been changed.

Create a Shopify page and assign `product-finder` when an unpublished preview is
authorized. In the Theme Editor choose **Cellife Product Finder** to edit the
heading, intro, button label, colours, width and twelve product selectors.
The page template prefills all twelve using inspected real handles, including
Bromelains & Quercetin after it was activated and Royal Jelly as instructed by the
owner. See `catalogue-mappings.json` for exact catalogue IDs and remaining identity
review. Section presets added elsewhere require their selectors to be assigned.
Native Shopify selectors, not inferred handles at runtime, supply destinations.

**Royal Jelly identity hold:** stable ID `propolis` and source S02 describe a
500mg propolis formula. The selected Royal Jelly 1000mg product is not assumed to
have the same formulation. `connectDestination` holds this route, including its
otherwise-excluded outcome, so neither S02 claims nor warnings are presented as
Royal Jelly information. A new current source sheet and rule review are required.
This does not block an eligible BQ result for the immune no-preference route.

## Source records and build

- `products.json`: twelve stable source IDs; F ingredient facts, C secondary
  claims, W warnings and P safeguards remain separate. No approvals default on.
- `evidence.json`: source/page/section IDs, faithful **brief-derived paraphrases**,
  evidence kind, quantities with units/basis and unreviewed metadata.
- `sources.json`: source-register hashes as reported by the supplied brief.
- `questions.json`: typed enums, exclusive choices, stop conditions and exact
  primary routes. Secondary claims never enter scoring.
- `recommend.ts`: dependency-free TypeScript-compatible JavaScript; pure evaluator
  and pure catalogue-destination adapter. No DOM or networking. No runtime LLM.
- `BRIEF.md`: supplied specification, retained as the source of this draft.

The original PDFs referenced by that brief were not attached or available at
those local paths. **Original wording and current labels have not been verified.**
`originalWording`, reviewers and dates remain null. Unresolved propolis
extract-equivalence wording is recorded without inventing an equivalence basis.
Reported vitamin E amounts are not converted into independently verified nutrient
equivalence. Missing dose/storage details are not invented or generalised.
Do not treat this dataset as an approved claims dossier or interaction database.

Run `node scripts/build-product-finder.cjs` after source changes. The generated
`assets/cellife-finder-engine.js` and `assets/cellife-finder-data.js` are committed
with the source; `--check` detects stale generated files. A deterministic checksum
and structural checks reject accidental record changes at runtime. The checksum
is an integrity check, not a cryptographic security mechanism.
Theme assets are public files: they contain supplier records and policy, never
private staff material, customer answers or secrets. The evidence **panel** is
rendered only in Shopify's authenticated Theme Editor (`request.design_mode`),
not in ordinary preview/storefront HTML. It shows IDs and evidence distinctions,
never telemetry or raw answer logs.

## Draft and release controls

The draft only runs for an unpublished theme or Theme Editor context. On a
published/unknown theme role Liquid renders the review hold before JavaScript;
no question controls or data-module URLs are emitted there. The pure evaluator
also returns DATA_HOLD in public mode. The public-release constant is false in
code and cannot be enabled in theme settings. These are draft presentation gates,
not checkout or medical eligibility enforcement.

All twelve source records must pass integrity checks even if a route needs only
one. A match returns one source ID at most; non-match outcomes return zero.
Missing/duplicate/invalid destinations return DATA_HOLD, never another product.
Ratings, source listing numbers, marketing claims and formulation preference are
not treated as efficacy evidence. Result copy is explicitly draft, attributes
supplier statements, and gives no dosing recommendation, stack, urgency,
subscription, automatically added cart item or guarantee of safety/effectiveness.

Before any public release: obtain all current labels/original sheets; review
claims, warnings, clinical routing and complete ingredient/excipient declarations;
reconcile unusual source warnings and dose omissions; resolve Royal Jelly's
identity; confirm every product destination; review privacy alongside existing
store apps; re-run the acceptance suite; obtain explicit publication approval.
A code review and new release process are required, not a Theme Editor checkbox.

## Privacy and interaction

Categorical answers live only on the section instance, with no default selections.
No email gate, health free text, answer URLs, analytics, CRM, cookies, browser
storage, network submission or console logging is added. Restart, pagehide and
section teardown clear answers, detached controls and evidence output. A browser
Back/bfcache return restarts the finder rather than restoring health answers.
Within the finder, Back preserves valid choices; changing Q1 clears Q5. Editing
answers removes the previous result, so a previous product link cannot remain
visible while safety answers change. Multiple-choice exclusivity is enforced by
both UI and evaluator.

The component uses fieldsets, legends, native controls, error alerts, focus
management, large targets and accessible progress. With JavaScript disabled it
shows a pharmacist-help message and never emits a suggestion.

## Validation

- `node tests/product-finder/engine.cjs`: T01–T40 expanded, deterministic ordering,
  exclusion/one-result invariants, malformed data, mapping holds and Royal Jelly
  identity protections. Current result: **77 passing tests** plus combination
  checks inside the suite.
- `node tests/product-finder/browser.cjs`: renders the actual section with LiquidJS
  and fixture Shopify product objects, then checks 320/390/1440px layouts, native
  keyboard completion, errors, early review, Back/restart, stale Q5 clearing,
  browser Back, no answer requests/storage, missing destinations, staff panel and
  axe WCAG 2 A/AA + 2.1 AA checks on intro/question/match/review states.
- `python3 scripts/check-theme-json.py`: JSON/embedded schemas.
- `node scripts/build-product-finder.cjs --check`: generated assets.
- Shopify CLI Theme Check: zero errors; eleven warnings in pre-existing files,
  none in the new finder section.

Browser checks need development-only `liquidjs`, `playwright` and
`@axe-core/playwright` plus Chromium; no packages are loaded into the storefront.
This environment uses NODE_PATH to the temporary test dependencies and installed
Playwright runtime, and `/usr/bin/chromium`. Set `SCREENSHOT_DIR` for fixture
screenshots. These checks are not a clinical review, manual screen-reader audit,
Shopify admin/page-creation test or validation against the absent original PDFs.

The owner subsequently authorised pushing this milestone to `cellife-rebuild`,
which is connected to an unpublished preview theme. That authorisation does not
publish the live theme or approve product claims. Draft and source-identity holds
remain in place. A Shopify page record must be assigned the new template before
the dedicated page can be visited.
