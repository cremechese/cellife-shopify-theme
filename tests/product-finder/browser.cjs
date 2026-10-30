/* Actual Liquid section, native controls and fixture Shopify products. No store mutations. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {Liquid}=require('liquidjs'),{chromium}=require('playwright'),AxeBuilder=require('@axe-core/playwright').default;
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('sections/cellife-product-finder.liquid'),schema=JSON.parse(source.split('{% schema %}')[1].split('{% endschema %}')[0]);
const catalog=Object.fromEntries(['products','evidence','sources','questions','routes','rationales','warnings','guidance'].map(n=>[n,JSON.parse(read('product-finder/'+n+'.json'))]));
const engine=new Liquid({strictFilters:true});
engine.registerFilter('asset_url',x=>'/assets/'+x);engine.registerFilter('stylesheet_tag',x=>`<link rel="stylesheet" href="${x}">`);engine.registerFilter('json',x=>JSON.stringify(x===undefined?null:x));engine.registerFilter('image_url',()=>'/fixture.svg');engine.registerFilter('money_with_currency',()=>'$49.95 AUD');
async function build(role='unpublished',staff=false,missing=false){
 const settings=Object.fromEntries(schema.settings.filter(s=>s.id).map(s=>[s.id,s.default]));
 for(const [i,p]of catalog.products.entries())settings['product_'+p.id]={id:String(i+1),title:'Fixture '+p.id,url:'/products/fixture-'+p.id,price:4995,featured_image:{id:1}};
 if(missing)settings.product_vision=null;
 const section=await engine.parseAndRender(source.split('{% schema %}')[0],{section:{id:'fixture',settings},theme:{role},request:{design_mode:staff},template:{suffix:'product-finder'}});
 return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Discovery fixture</title><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/cellife-editorial.css"><body class="cellife-shell" style="margin:0">${section}</body></html>`;
}
async function accessible(page){const out=await new AxeBuilder({page}).include('cellife-product-finder').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(out.violations.map(v=>({id:v.id,nodes:v.nodes.length})),[]);}
(async()=>{
 const pages={'/':await build(),'/public':await build('main'),'/staff':await build('unpublished',true),'/missing':await build('unpublished',false,true)};
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname.startsWith('/assets/')){const file=url.pathname.slice(1);if(!/^assets\/[a-z0-9.-]+$/.test(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/javascript');return res.end(read(file));}if(url.pathname==='/fixture.svg'){res.setHeader('Content-Type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="400"><rect x="60" y="20" width="120" height="360" rx="20" fill="#3e2b62"/></svg>');}res.setHeader('Content-Type','text/html');res.end(pages[url.pathname]||pages['/']);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const base='http://127.0.0.1:'+server.address().port;
 const next=page=>page.getByRole('button',{name:/^(Continue|See product)$/}).click();
 const pick=async(page,value)=>{await page.locator(`input[value="${value}"]`).check();await next(page);};
 async function ready(page,url='/'){await page.goto(base+url);await page.locator('input[value="energy"]').waitFor();}
 try{
  for(const width of [320,390,1440]){
   const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base)||r.method()!=='GET'||r.postData()||/category=|interest=|preference=/.test(r.url()))requests.push(r.url());});
   await ready(page);assert.equal(await page.locator('[data-finder-evidence]').count(),0);assert.equal(await page.locator('input').count(),4);assert.equal(await page.locator('input:checked').count(),0);
   await next(page);await page.getByRole('alert').filter({hasText:'Choose one option'}).waitFor();
   if(width===390)await accessible(page);
   // Native keyboard radios: energy -> endurance, with no separate Start screen.
   await page.locator('input[value="energy"]').focus();await page.keyboard.press('Space');await next(page);await page.locator('input[value="daily_energy"]').focus();await page.keyboard.press('ArrowDown');await next(page);await page.getByRole('heading',{name:'A product to explore: Fixture man'}).waitFor();
   // All fifteen valid source routes render in two or three screens. The real
   // Royal Jelly connection is intentionally held rather than using S02 evidence.
   for(const [route,{productId}]of Object.entries(catalog.routes)){
    await page.getByRole('button',{name:'Restart',exact:true}).click();
    const values=route.split('/'),steps=[];
    for(const value of values){steps.push(await page.locator('.cellife-finder__progress').textContent());await pick(page,value);}
    assert.equal(steps.length,values.length);assert(values.length<=3);
    assert.equal(await page.locator('input[type="checkbox"], input[type="email"]').count(),0);
    if(productId==='propolis'){
     await page.getByRole('heading',{name:'Product information is awaiting review'}).waitFor();assert.equal(await page.locator('[data-finder-stage] a').count(),0);continue;
    }
    await page.getByRole('heading',{name:'A product to explore: Fixture '+productId}).waitFor();
    assert(await page.getByText('Matched to your interests. Suitability has not been assessed.',{exact:true}).isVisible());
    const panel=page.getByRole('region',{name:'Before you consider this product'}),link=page.getByRole('link',{name:'Read product information'});
    assert(await panel.isVisible());assert((await panel.textContent()).includes(catalog.warnings[productId].warnings[0]));
    assert(await panel.evaluate(p=>Boolean(p.compareDocumentPosition(p.parentElement.querySelector('.cellife-finder__product-link'))&Node.DOCUMENT_POSITION_FOLLOWING)));
    assert.equal(await page.locator('[data-finder-stage] a').count(),1);assert.equal(await link.getAttribute('href'),'/products/fixture-'+productId);
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));
    if(width===390&&productId==='bq')await accessible(page);
   }
   // Back preserves valid answers. Changing upstream selections clears dependent
   // choices, never a stale third answer on a direct two-screen route.
   await page.getByRole('button',{name:'Restart',exact:true}).click();await pick(page,'energy');await pick(page,'cellular');
   if(width===390)await accessible(page);
   await pick(page,'sustained');await page.getByRole('button',{name:'Back',exact:true}).click();assert(await page.locator('input[value="sustained"]').isChecked());await page.getByRole('button',{name:'Back',exact:true}).click();await pick(page,'daily_energy');await page.getByRole('heading',{name:'A product to explore: Fixture coq10'}).waitFor();
   await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByRole('button',{name:'Back',exact:true}).click();await pick(page,'care');assert.equal(await page.locator('input:checked').count(),0);await pick(page,'eyes');
   if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`result-${width}.png`),fullPage:true});}
   await page.goto(base+'/public');await page.getByRole('heading',{name:'This finder is awaiting review'}).waitFor();assert.equal(await page.locator('input').count(),0);await page.goBack();await page.locator('input[value="energy"]').waitFor();assert.equal(await page.locator('input:checked').count(),0);
   const state=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,search:location.search}));assert.deepEqual(state,{local:0,session:0,search:''});assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
   if(process.env.SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`intro-${width}.png`),fullPage:true});
   console.log(`PASS ${width}px: all 15 routes, 2/3 screens, visible warnings before CTA, keyboard, upstream clearing, Back/restart, privacy and no overflow`);await context.close();
  }
  const context=await browser.newContext(),page=await context.newPage();await ready(page,'/missing');await pick(page,'care');await pick(page,'eyes');await page.getByRole('heading',{name:'Product information is awaiting review'}).waitFor();assert.equal(await page.locator('[data-finder-stage] a').count(),0);
  await ready(page,'/staff');await pick(page,'care');await pick(page,'eyes');assert.equal(await page.locator('[data-finder-evidence]').count(),1);await page.getByText('Staff preview: evidence and rule references').click();assert((await page.locator('[data-finder-evidence-content]').textContent()).includes('S10-C'));await context.close();
  const noJs=await browser.newContext({javaScriptEnabled:false}),fallback=await noJs.newPage();await fallback.goto(base);await fallback.locator('noscript p').waitFor({state:'visible'});assert.equal(await fallback.locator('input').count(),0);await noJs.close();
  console.log('PASS mapping hold, staff-only panel, no-JS fallback and axe WCAG A/AA checks on category, formula and warning-result states');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
