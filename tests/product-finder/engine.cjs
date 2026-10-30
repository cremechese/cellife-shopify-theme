const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname,'../..');
const modulePromise = import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path.join(root,'assets/cellife-finder-engine.js'),'utf8')).toString('base64'));
const catalog = Object.fromEntries(['products','evidence','sources','questions'].map(k=>[k,JSON.parse(fs.readFileSync(path.join(root,'product-finder',k+'.json'),'utf8'))]));
const base = (goal,detail,changes={}) => ({goal,lifeStage:'adult',health:['none'],requirements:['none'],detail,...changes});
const cases = [];
const add = (name,answers,status,id,changeCatalog,mode='draft')=>cases.push({name,answers,status,id,changeCatalog,mode});
const routes = [['T01','stress','everyday','stress'],['T02','energy','generalEnergy','coq10'],['T03','eyes','wellbeing','vision'],['T04','immune','botanical','bq'],['T05','immune','bee','propolis'],['T06','immune','noPreference','bq'],['T07','glucose','healthy','sugar'],['T08','libido','wellbeing','man'],['T09','skin','wellbeing','detox'],['T10','cellular','standard','rrr'],['T11','cellular','sustained','boost'],['T12','cellular','noPreference','rrr'],['T13','weight','healthyAdult','ampk'],['T14','general','wellbeing','antioxidant']];
for (const [n,g,d,id] of routes) add(n,base(g,d),'MATCH',id);
add('T15',{goal:'energy',lifeStage:'under18'},'REVIEW');
for(const stage of ['pregnancy','unknown']) add('T16 '+stage,{goal:'energy',lifeStage:stage},'REVIEW');
add('T17',base('energy','generalEnergy',{health:['medicine']}),'REVIEW');
for(const value of ['supplement','condition','symptoms','unknown']) add('T18 '+value,{goal:'eyes',lifeStage:'adult',health:[value]},'REVIEW');
add('T19',base('energy','generalEnergy',{requirements:['asthma']}),'NO_MATCH');
add('T20',base('immune','bee',{requirements:['asthma']}),'NO_MATCH');
add('T21',base('immune','noPreference',{requirements:['asthma']}),'MATCH','bq');
for(const value of ['allergy','unknown']) add('T22 '+value,{goal:'immune',lifeStage:'adult',health:['none'],requirements:[value]},'REVIEW');
for(const value of ['standard','sustained']) add('T23 '+value,base('cellular',value,{health:['dietActivity']}),'NO_MATCH');
add('T24',base('immune','bee',{health:['dietActivity']}),'NO_MATCH');
add('T25',base('immune','noPreference',{health:['dietActivity']}),'MATCH','bq');
add('T26',base('weight','healthyAdult',{health:['dietActivity']}),'REVIEW');
add('T27',base('general','wellbeing',{health:['dietActivity']}),'MATCH','antioxidant');
add('T28',base('energy','generalEnergy',{requirements:['vegan']}),'NO_MATCH');
add('T29',base('weight','healthyAdult',{requirements:['vegan']}),'NO_MATCH');
add('T30',base('eyes','wellbeing',{requirements:['vegan']}),'REVIEW');
for(const [goal,branch] of Object.entries(catalog.questions[4].branches)) for(const detail of branch.review) add('T31 '+goal+'/'+detail,base(goal,detail),'REVIEW');
add('T32',{goal:'other'},'NO_MATCH');
add('T33 health',base('eyes','wellbeing',{health:['none','medicine']}),'INVALID');
add('T33 requirements',base('eyes','wellbeing',{requirements:['none','vegan']}),'INVALID');
add('T34',{goal:'eyes',lifeStage:'adult',health:['none'],requirements:['none']},'INCOMPLETE');
add('T35',base('eyes','bee'),'INVALID');
add('T36 missing product',base('eyes','wellbeing'),'DATA_HOLD',null,c=>c.products.pop());
add('T36 missing source',base('eyes','wellbeing'),'DATA_HOLD',null,c=>c.sources.pop());
add('T36 duplicate id',base('eyes','wellbeing'),'DATA_HOLD',null,c=>c.products[1].id=c.products[0].id);
add('T36 changed warning',base('eyes','wellbeing'),'DATA_HOLD',null,c=>c.products[0].sheetWarnings=[]);
add('T36 unreviewed public',base('eyes','wellbeing'),'DATA_HOLD',null,null,'public');
add('T37',base('energy','generalEnergy',{health:['medicine','dietActivity'],requirements:['asthma']}),'REVIEW');
add('T38',base('energy','generalEnergy',{requirements:['asthma','vegan']}),'NO_MATCH');
for(const a of [base('not-a-goal','wellbeing'),base('eyes','a free text answer'),base('eyes','wellbeing',{health:['exercise']}),base('eyes','wellbeing',{requirements:['fish']}),{goal:'eyes',freeText:'private'},base('eyes','wellbeing',{health:['none','none']})]) add('T39 '+JSON.stringify(a),a,'INVALID');
for(const vector of cases) test(vector.name,async()=>{
 const {evaluate}=await modulePromise,c=structuredClone(catalog);vector.changeCatalog?.(c);
 const out=evaluate(vector.answers,c,vector.mode);
 assert.equal(out.status,vector.status);assert.deepEqual(out.productIds,vector.id?[vector.id]:[]);
 assert(out.productIds.length<=1);for(const id of out.productIds)assert(!out.exclusionReasons[id]);
 assert.equal(out.rulesVersion,'cellife-finder-draft-1');
 assert.deepEqual(out,evaluate(vector.answers,c,vector.mode),'T40 deterministic status, reason and evidence ordering');
});
test('T38 retains both independent reasons',async()=>{const {evaluate}=await modulePromise;assert.deepEqual(evaluate(base('energy','generalEnergy',{requirements:['asthma','vegan']}),catalog,'draft').exclusionReasons.coq10,['W_ASTHMA','F_FISH_OIL']);});
test('early other still yields to supplied review answers',async()=>{const {evaluate}=await modulePromise;assert.equal(evaluate({goal:'other',health:['medicine']},catalog,'draft').status,'REVIEW');});
test('all combinations: no excluded product selected and no stacks',async()=>{const {evaluate}=await modulePromise;for(const [,g,d]of routes)for(const health of [['none'],['dietActivity'],['medicine']])for(const requirements of [['none'],['asthma'],['vegan'],['allergy'],['asthma','vegan']]){const out=evaluate(base(g,d,{health,requirements}),catalog,'draft');assert.equal(out.productIds.length,out.status==='MATCH'?1:0);for(const id of out.productIds)assert(!out.exclusionReasons[id]);}});
test('R0 precedes early exits, missing answers never mean none',async()=>{const {evaluate}=await modulePromise;assert.equal(evaluate({goal:'energy',lifeStage:'under18',detail:'bee'},catalog,'draft').status,'INVALID');assert.equal(evaluate({goal:'energy',lifeStage:'adult',health:[],requirements:['none'],detail:'generalEnergy'},catalog,'draft').status,'INCOMPLETE');});
test('destination adapter holds missing, duplicate and external product connections',async()=>{
 const {evaluate,connectDestination}=await modulePromise;
 const out=evaluate(base('eyes','wellbeing'),catalog,'draft');
 for(const mappings of [{},{vision:{id:'1',url:'https://unrelated.example/products/vision'}},{vision:{id:'1',url:'/products/vision'},stress:{id:'1',url:'/products/vision'}}]){
  const linked=connectDestination(out,mappings,'https://example.test');assert.equal(linked.result.status,'DATA_HOLD');assert.deepEqual(linked.result.productIds,[]);assert.equal(linked.destination,null);
 }
 const linked=connectDestination(out,{vision:{id:'1',url:'/products/vision'}},'https://example.test');assert.equal(linked.destination,'/products/vision');assert.equal(linked.result.status,'MATCH');
});
test('Royal Jelly cannot inherit S02 propolis claims or warnings',async()=>{
 const {evaluate,connectDestination}=await modulePromise;
 for(const requirements of [['none'],['asthma']]){
  const out=evaluate(base('immune','bee',{requirements}),catalog,'draft');
  const linked=connectDestination(out,{propolis:{id:'royal-jelly',url:'/products/royal-jelly'}},'https://example.test');
  assert.equal(linked.result.status,'DATA_HOLD');assert.deepEqual(linked.result.productIds,[]);assert.deepEqual(linked.result.exclusionReasons,{});assert(linked.result.reasonIds.includes('R7_SOURCE_IDENTITY_HOLD'));
 }
 const botanical=evaluate(base('immune','noPreference',{requirements:['asthma']}),catalog,'draft');
 assert.equal(connectDestination(botanical,{bq:{id:'bq',url:'/products/bq'}},'https://example.test').result.status,'MATCH');
});
test('malformed source objects fail closed without throwing',async()=>{
 const {evaluate}=await modulePromise;
 for(const change of [c=>c.products[0]=null,c=>c.evidence[0]=null,c=>c.sources[0]=null,c=>c.questions=null,c=>c.sources[0].sections=[],c=>c.evidence[0].page=2]){
  const damaged=structuredClone(catalog);change(damaged);assert.equal(evaluate(base('eyes','wellbeing'),damaged,'draft').status,'DATA_HOLD');
 }
});
