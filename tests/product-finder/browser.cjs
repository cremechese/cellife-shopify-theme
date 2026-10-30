/* Actual Liquid section + native browser controls; Shopify product objects are fixture data. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {Liquid}=require('liquidjs'),{chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
async function accessible(page,label){const out=await new AxeBuilder({page}).include('cellife-product-finder').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(out.violations.map(v=>({id:v.id,nodes:v.nodes.length})),[],label);}
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('sections/cellife-product-finder.liquid'),schema=JSON.parse(source.split('{% schema %}')[1].split('{% endschema %}')[0]);
const engine=new Liquid({strictFilters:true});
engine.registerFilter('asset_url',x=>'/assets/'+x);
engine.registerFilter('stylesheet_tag',x=>`<link rel="stylesheet" href="${x}">`);
engine.registerFilter('json',x=>JSON.stringify(x===undefined?null:x));
engine.registerFilter('money_with_currency',()=>'$49.95 AUD');
engine.registerFilter('image_url',()=>'/fixture.svg');
const ids=JSON.parse(read('product-finder/products.json')).map(p=>p.id);
async function build(mode='unpublished',staff=false,missing=false){
 const settings=Object.fromEntries(schema.settings.filter(x=>x.id).map(x=>[x.id,x.default]));
 for(const [i,id]of ids.entries())settings['product_'+id]={id:i+1,title:'Fixture '+id,url:'/products/fixture-'+id,price:4995,featured_image:{id:1}};
 if(missing)settings.product_vision=null;
 const section=await engine.parseAndRender(source.split('{% schema %}')[0],{section:{id:'fixture',settings},theme:{role:mode},request:{design_mode:staff},template:{suffix:'product-finder'}});
 return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Finder fixture</title><link rel="stylesheet" href="/assets/base.css"><link rel="stylesheet" href="/assets/cellife-editorial.css"><body class="cellife-shell" style="margin:0">${section}</body></html>`;
}
(async()=>{
 const pages={'/':await build(),'/public':await build('main'),'/staff':await build('unpublished',true),'/missing':await build('unpublished',false,true)};
 const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname.startsWith('/assets/')){const file=url.pathname.slice(1);if(!/^assets\/[a-z0-9.-]+$/.test(file)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/javascript');return res.end(read(file));}if(url.pathname==='/fixture.svg'){res.setHeader('Content-Type','image/svg+xml');return res.end('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="400"><rect x="60" y="20" width="120" height="360" rx="20" fill="#3e2b62"/></svg>');}res.setHeader('Content-Type','text/html');res.end(pages[url.pathname]||pages['/']);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const base='http://127.0.0.1:'+server.address().port;
 const next=page=>page.getByRole('button',{name:/^(Continue|See result)$/}).click();
 const choose=async(page,label)=>{await page.getByLabel(label,{exact:true}).check();await next(page);};
 async function normal(page){await page.getByRole('button',{name:'Start the product finder'}).click();await choose(page,'Eye wellbeing');await choose(page,'18+ and none of the following');await choose(page,'None of these');await choose(page,'None of these');await choose(page,'General wellbeing');}
 try{
  for(const width of [320,390,1440]){
   const context=await browser.newContext({viewport:{width,height:1000}});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const unexpected=[];page.on('request',r=>{if(!r.url().startsWith(base)||r.method()!=='GET'||r.postData()||/goal=|health=|requirements=|finder-choice/.test(r.url()))unexpected.push(r.url());});
   await page.goto(base);await page.getByRole('button',{name:'Start the product finder'}).waitFor();
   assert.equal(await page.locator('[data-finder-evidence]').count(),0);
   if(width===390)await accessible(page,'intro WCAG checks');
   await page.getByRole('button',{name:'Start the product finder'}).focus();await page.keyboard.press('Enter');
   if(width===390)await accessible(page,'question WCAG checks');
   await next(page);await page.getByRole('alert').filter({hasText:'Choose an answer'}).waitFor();
   assert.equal(await page.locator('input:checked').count(),0);
   // Native keyboard radio selection and submit; labels remain the accessible names.
   await page.getByLabel('Everyday stress support',{exact:true}).focus();
   await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');await next(page);
   await choose(page,'18+ and none of the following');await choose(page,'None of these');await choose(page,'None of these');await choose(page,'General wellbeing');
   await page.getByRole('heading',{name:'One product to explore'}).waitFor();
   if(width===390)await accessible(page,'match WCAG checks');
   assert.equal(await page.locator('[data-finder-stage] a').count(),1);
   assert((await page.getByRole('link',{name:'View draft product information'}).getAttribute('href')).endsWith('/products/fixture-vision'));
   // Back to Q3 from the result, change safety answer, and remove the old recommendation.
   await page.getByRole('button',{name:'Back to answers'}).click();await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByRole('button',{name:'Back',exact:true}).click();
   await page.getByLabel('Any prescription or non-prescription medicine',{exact:true}).check();
   assert.equal(await page.locator('[data-finder-stage] a').count(),0);
   assert.equal(await page.getByLabel('None of these',{exact:true}).isChecked(),false);
   await next(page);await page.getByRole('heading',{name:'Individual review comes first'}).waitFor();
   if(width===390)await accessible(page,'review WCAG checks');
   assert.equal(await page.locator('[data-finder-stage] a').count(),0);
   await page.getByRole('button',{name:'Restart',exact:true}).click();await page.getByRole('button',{name:'Start the product finder'}).click();
   assert.equal(await page.locator('input:checked').count(),0);
   // Stale goal-specific answer is cleared when Q1 changes.
   await choose(page,'Immune support');await choose(page,'18+ and none of the following');await choose(page,'None of these');await choose(page,'None of these');
   await page.getByLabel('Bee-derived',{exact:true}).check();
   for(let i=0;i<4;i++)await page.getByRole('button',{name:'Back',exact:true}).click();
   await choose(page,'Eye wellbeing');await next(page);await next(page);await next(page);
   assert.equal(await page.locator('input:checked').count(),0);
   // Leaving the page clears answers; returning through bfcache also resets.
   await page.goto(base+'/public');await page.getByRole('heading',{name:'This finder is awaiting review'}).waitFor();assert.equal(await page.locator('input').count(),0);await page.goBack();await page.getByRole('button',{name:'Start the product finder'}).waitFor();
   const storage=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length,search:location.search}));assert.deepEqual(storage,{local:0,session:0,search:''});
   assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));
   assert.deepEqual(errors,[]);assert.deepEqual(unexpected,[]);
   if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`finder-${width}.png`),fullPage:true});}
   console.log(`PASS ${width}px: keyboard match, error semantics, early review, Back, branch clearing, browser Back, no storage or answer requests`);
   await context.close();
  }
  const context=await browser.newContext();const page=await context.newPage();await page.goto(base+'/missing');await normal(page);await page.getByRole('heading',{name:'This finder is awaiting review'}).waitFor();assert.equal(await page.locator('[data-finder-stage] a').count(),0);
  await page.goto(base+'/staff');await normal(page);assert.equal(await page.locator('[data-finder-evidence]').count(),1);await page.getByText('Staff preview: evidence and rule references').click();assert((await page.locator('[data-finder-evidence-content]').textContent()).includes('S10-C'));
  console.log('PASS missing mapping holds; evidence panel exists only in server-rendered staff context');
  const noJs=await browser.newContext({javaScriptEnabled:false});const fallback=await noJs.newPage();await fallback.goto(base);await fallback.locator('noscript p').waitFor({state:'visible'});assert.equal(await fallback.locator('input').count(),0);await noJs.close();console.log('PASS no-JavaScript help without a recommendation');
  await context.close();
 } finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
