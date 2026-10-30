/* No dependencies: build the runtime assets from reviewed-in-code source records. */
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'product-finder', name + '.json'), 'utf8'));
const catalog = { products: read('products'), evidence: read('evidence'), sources: read('sources'), questions: read('questions') };
// Validate source schema before a new integrity seal can be generated.
const assert = require('node:assert/strict');
assert.equal(catalog.products.length,12);
assert.equal(new Set(catalog.products.map(p=>p.id)).size,12);
assert.equal(catalog.sources.length,12);
assert.equal(new Set(catalog.sources.map(s=>s.sourceId)).size,12);
assert.equal(catalog.questions.length,5);
const required=['id','sourceId','austLReported','primaryGoals','secondaryClaims','ingredientFacts','sheetWarnings','policyRules','claimReviewStatus','labelReviewStatus','veganCompatibility','formulationGroup'];
for(const p of catalog.products){
  for(const key of required)assert(Object.hasOwn(p,key),`${p.id}: missing ${key}`);
  assert(['yes','no','unknown'].includes(p.veganCompatibility));
  for(const key of ['claimReviewStatus','labelReviewStatus'])assert(['unreviewed','approved','rejected'].includes(p[key]));
  assert.equal(p.primaryGoals.length,1);assert(p.sheetWarnings.length);assert(p.policyRules.length);
  for(const fact of p.ingredientFacts){
    assert(['actual','equivalentDry','equivalentNutrient'].includes(fact.quantityBasis));
    if(fact.quantity!==null){assert(Number.isFinite(fact.quantity));assert(['mg','mcg','g'].includes(fact.unit));}
  }
  const source=catalog.sources.find(s=>s.sourceId===p.sourceId);assert(source&&source.productId===p.id);assert.equal(source.page,1);assert(source.sections.length);
  for(const kind of ['F','C','W','P']){const e=catalog.evidence.find(e=>e.productId===p.id&&e.kind===kind);assert(e&&e.sourceId===p.sourceId);assert.equal(e.page,1);assert(e.section);assert.equal(e.verifiedAgainstCurrentLabel,false);assert.equal(e.reviewer,null);assert.equal(e.reviewedAt,null);}
}
assert.equal(new Set(catalog.evidence.map(e=>e.evidenceId)).size,catalog.evidence.length);
const stable = v => v === null || typeof v !== 'object' ? JSON.stringify(v) : Array.isArray(v) ? `[${v.map(stable).join(',')}]` : `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
let hash = 2166136261;
for (const c of stable(catalog)) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619) >>> 0;
const source = fs.readFileSync(path.join(root,'product-finder/recommend.ts'),'utf8').replace('__DATA_SEAL__',hash.toString(16).padStart(8,'0')).replace('__QUESTIONS__',JSON.stringify(catalog.questions));
const assets = { 'cellife-finder-engine.js': source, 'cellife-finder-data.js': '/* Draft source data. Supplier statements are not independent evidence. */\nexport const catalog = '+JSON.stringify(catalog)+';\nexport const questions = catalog.questions;\n' };
let dirty = false;
for (const [name, content] of Object.entries(assets)) {
  const target = path.join(root,'assets',name);
  if (process.argv.includes('--check')) { if (!fs.existsSync(target) || fs.readFileSync(target,'utf8') !== content) { console.error('Stale generated asset:',name); dirty = true; } }
  else fs.writeFileSync(target,content);
}
if (dirty) process.exitCode = 1;
else console.log('Product finder runtime assets '+(process.argv.includes('--check')?'are current.':'built.'));
