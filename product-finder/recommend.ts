/** Pure catalogue routing only. No DOM, storage, network, medical inference or dosing. */
export const RULES_VERSION = 'cellife-finder-draft-1';
const EXPECTED_SEAL = '__DATA_SEAL__';
const QUESTIONS = __QUESTIONS__;
const IDS = ['stress','propolis','man','sugar','bq','rrr','coq10','detox','boost','vision','ampk','antioxidant'];
// Deliberately not a Theme Editor setting. A future reviewed release requires code review.
const PUBLIC_RELEASE_APPROVED = false;
export function fingerprint(value) {
  const stable = (v) => v === null || typeof v !== 'object' ? JSON.stringify(v) : Array.isArray(v) ? `[${v.map(stable).join(',')}]` : `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`;
  let hash = 2166136261;
  for (const character of stable(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  return hash.toString(16).padStart(8, '0');
}
export function validateCatalog(catalog) {
  if (!catalog || !Array.isArray(catalog.products) || !Array.isArray(catalog.sources) || !Array.isArray(catalog.evidence)) return false;
  if (catalog.products.length !== 12 || catalog.sources.length !== 12) return false;
  if ([...catalog.products,...catalog.sources,...catalog.evidence].some(record => !record || typeof record !== 'object' || Array.isArray(record))) return false;
  if (new Set(catalog.products.map(p => p.id)).size !== 12 || new Set(catalog.sources.map(s => s.sourceId)).size !== 12) return false;
  if (new Set(catalog.evidence.map(e => e.evidenceId)).size !== catalog.evidence.length) return false;
  for (const [index, id] of IDS.entries()) {
    const p = catalog.products.find(item => item.id === id);
    const sourceId = `S${String(index + 1).padStart(2, '0')}`;
    if (!p || p.sourceId !== sourceId) return false;
    const s = catalog.sources.find(item => item.sourceId === sourceId);
    if (!s || s.productId !== id || s.page !== 1 || !s.sections?.length) return false;
    for (const kind of ['F','C','W','P']) {
      const evidence = catalog.evidence.find(item => item.evidenceId === `${sourceId}-${kind}`);
      if (!evidence || evidence.kind !== kind || evidence.productId !== id || evidence.sourceId !== sourceId || evidence.page !== 1 || !evidence.section) return false;
    }
  }
  try {
    return fingerprint({products:catalog.products, evidence:catalog.evidence, sources:catalog.sources, questions:catalog.questions}) === EXPECTED_SEAL;
  } catch { return false; }
}
/** @returns {{status:string, productIds:string[], reasonIds:string[], exclusionReasons:Record<string,string[]>, evidenceIds:string[], nextQuestion:string|null, rulesVersion:string}} */
export function evaluate(answers, catalog, mode = 'public') {
  const reasons = [], exclusions = {}, evidence = [];
  const addEvidence = id => { if (!evidence.includes(id)) evidence.push(id); };
  const result = (status, nextQuestion = null, productIds = []) => ({status, productIds, reasonIds:[...reasons], exclusionReasons:exclusions, evidenceIds:[...evidence], nextQuestion, rulesVersion:RULES_VERSION});
  const invalid = () => { reasons.push('R0_INVALID'); return result('INVALID'); };
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return invalid();
  if (Object.keys(answers).some(k => !['goal','lifeStage','health','requirements','detail'].includes(k))) return invalid();
  // Validate every supplied value, even beyond a possible early exit. Never accept stale Q5.
  for (const q of QUESTIONS.slice(0,4)) {
    const value = answers[q.key];
    if (value === undefined) continue;
    const allowed = q.options.map(option => option.value);
    if (q.type === 'single') { if (!allowed.includes(value)) return invalid(); }
    else {
      if (!Array.isArray(value) || new Set(value).size !== value.length || value.some(v => !allowed.includes(v))) return invalid();
      if (value.length > 1 && q.exclusive.some(v => value.includes(v))) return invalid();
    }
  }
  const branch = QUESTIONS[4].branches[answers.goal];
  if (answers.detail !== undefined && (!branch || !branch.options.some(o => o.value === answers.detail))) return invalid();
  reasons.push('R0');
  if (!validateCatalog(catalog) || !['draft','public'].includes(mode) || (mode === 'public' && !PUBLIC_RELEASE_APPROVED)) {
    reasons.push('R1_DATA_HOLD'); return result('DATA_HOLD');
  }
  reasons.push('R1_DRAFT');
  const health = answers.health || [], requirements = answers.requirements || [];
  // Review beats commercial intent, including supplied review answers with an 'other' goal.
  if ((answers.lifeStage !== undefined && answers.lifeStage !== 'adult') || health.some(v => ['medicine','supplement','condition','symptoms','unknown'].includes(v)) || requirements.some(v => ['allergy','unknown'].includes(v))) {
    reasons.push('R2_REVIEW','P_GLOBAL_REVIEW');
    if (answers.lifeStage && answers.lifeStage !== 'adult') reasons.push('P_LIFE_STAGE');
    if (health.includes('symptoms')) reasons.push('P_SYMPTOMS');
    if (requirements.includes('allergy')) reasons.push('P_ALLERGY');
    return result('REVIEW');
  }
  if (answers.goal === undefined) return result('INCOMPLETE','Q1');
  if (answers.goal === 'other') { reasons.push('R3_NO_ROUTE'); return result('NO_MATCH'); }
  for (const q of QUESTIONS.slice(1,4)) if (answers[q.key] === undefined || (q.type === 'multi' && answers[q.key].length === 0)) return result('INCOMPLETE',q.id);
  reasons.push('R2');
  if (answers.detail === undefined) return result('INCOMPLETE','Q5');
  if (branch.review.includes(answers.detail)) { reasons.push('R3_REVIEW','P_GOAL_INTENT'); return result('REVIEW'); }
  const candidates = branch.candidates[answers.detail];
  if (!candidates?.length) return invalid();
  reasons.push('R3','R4');
  const eligible = [];
  let clarification = false;
  for (const id of candidates) {
    const product = catalog.products.find(p => p.id === id), blocked = [];
    const exclude = (reason, kind, needsReview = false) => { blocked.push(reason); addEvidence(`${product.sourceId}-${kind}`); clarification ||= needsReview; };
    if (requirements.includes('asthma') && ['propolis','coq10'].includes(id)) exclude('W_ASTHMA','W');
    if (health.includes('dietActivity')) {
      if (['propolis','coq10','rrr','boost'].includes(id)) exclude('W_DIET_ACTIVITY','W');
      if (id === 'ampk') { exclude('P_AMPK_DIET_REVIEW','P',true); addEvidence(`${product.sourceId}-W`); }
    }
    if (requirements.includes('vegan')) {
      if (id === 'coq10') exclude('F_FISH_OIL','F');
      else if (id === 'ampk') exclude('F_OYSTER_SHELL','F');
      else exclude('P_VEGAN_UNVERIFIED','P',true);
    }
    if (blocked.length) exclusions[id] = blocked;
    else eligible.push(id);
  }
  reasons.push('R5');
  if (!eligible.length) { reasons.push(clarification ? 'R6_REVIEW' : 'R6_NO_MATCH'); return result(clarification ? 'REVIEW' : 'NO_MATCH'); }
  const chosen = eligible[0], product = catalog.products.find(p => p.id === chosen);
  addEvidence(`${product.sourceId}-C`); addEvidence(`${product.sourceId}-W`); addEvidence(`${product.sourceId}-P`);
  reasons.push('R6','R7_DRAFT');
  return result('MATCH',null,[chosen]);
}

// Catalogue identity is distinct from the source-sheet route. Renaming a product
// does not approve a new formulation. Royal Jelly is mapped to the requested ID,
// but S02 describes propolis; no S02 product claims/warnings may transfer to it.
export function connectDestination(engineResult, mappings, origin) {
  const hold = reason => ({result:{...engineResult,status:'DATA_HOLD',productIds:[],exclusionReasons:{},reasonIds:[...engineResult.reasonIds,reason]},destination:null});
  if ((engineResult.status === 'MATCH' && engineResult.productIds[0] === 'propolis') || (engineResult.status !== 'MATCH' && engineResult.exclusionReasons.propolis)) return hold('R7_SOURCE_IDENTITY_HOLD');
  if (engineResult.status !== 'MATCH') return {result:engineResult,destination:null};
  const values = Object.values(mappings || {}).filter(Boolean);
  const mapped = mappings?.[engineResult.productIds[0]];
  if (!mapped?.id || new Set(values.map(p=>p.id)).size !== values.length) return hold('R7_MAPPING_HOLD');
  let url;
  try { url = new URL(mapped.url,origin); } catch { return hold('R7_MAPPING_HOLD'); }
  if (url.origin !== origin || !url.pathname.includes('/products/')) return hold('R7_MAPPING_HOLD');
  return {result:engineResult,destination:url.pathname+url.search};
}
