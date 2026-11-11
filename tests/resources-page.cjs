/* Standalone browser smoke test for Blue Logistics Resources.
   Runs against local static files; it never submits a quote or contacts the CRM. */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  let url;try{url=new URL(req.url,'http://localhost')}catch{return res.writeHead(400).end()}
  const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('Not found')}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});
  res.end(fs.readFileSync(file));
});
const sizes=[390,768,1040,1120,1440];
const requiredLinks=['freight-tools.html','freight-quote-checklist.html','bol-checklist.html','#guide-equipment','#guide-ltl','#guide-accessorial','#guide-import'];
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const output=path.join(root,'.resources-qa');
  fs.mkdirSync(output,{recursive:true});
  try{
    for(const width of sizes){
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/resources.html',{waitUntil:'domcontentloaded'});
      await page.waitForSelector('.resources-card img');
      await page.waitForTimeout(400);
      const cards=page.locator('.resources-card');
      assert.equal(await cards.count(),7,'Expected seven resource cards');
      const actual=await cards.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
      assert.deepEqual(actual,requiredLinks,'Card destinations must remain functional');
      const images=await page.locator('.resources-card img').evaluateAll(nodes=>nodes.map(img=>({src:img.getAttribute('src'),alt:img.getAttribute('alt'),loading:img.getAttribute('loading')})));
      assert.equal(new Set(images.map(x=>x.src)).size,7,'Photographs must not be repeated');
      assert.ok(images.every(x=>x.alt&&x.loading==='lazy'),'Each photo must have alt text and lazy loading');
      const computedColumns=await page.locator('.resource-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').filter(Boolean).length);
      assert.equal(computedColumns,width<=700?1:width<=1020?2:3,'Unexpected card grid columns at '+width);
      const overflow=await page.evaluate(()=>({document:document.documentElement.scrollWidth,window:innerWidth}));
      if(overflow.document>overflow.window+1){
        const offenders=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).map(el=>({tag:el.tagName,classes:el.className?.baseVal||el.className||'',text:(el.textContent||'').trim().slice(0,45),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)})).filter(x=>x.right>innerWidth+2).slice(0,14));
        console.log('OVERFLOW ELEMENTS',width,JSON.stringify(offenders));
      }
      assert.ok(overflow.document<=overflow.window+1,'Horizontal overflow at '+width+': '+JSON.stringify(overflow));
      if(width>=1120)assert.equal(await page.locator('header .navlinks').isVisible(),true,'Desktop tabs hidden');
      if(width===390){const menu=page.locator('header .menu');assert.equal(await menu.isVisible(),true);await menu.click();assert.equal(await page.locator('header .navlinks').isVisible(),true);await menu.click();}
      for(const href of requiredLinks){
        if(href.startsWith('#'))assert.equal(await page.locator(href).count(),1,'Guide target missing '+href);
        else assert.ok(fs.existsSync(path.join(root,href)),'Local resource destination missing '+href);
      }
      if(width===1440){
        // Scroll each lazy-loaded image into view, then wait for an actual decoded image.
        // A CDN failure must fail the test rather than silently passing layout-only QA.
        for(let i=0;i<7;i++){
          const img=page.locator('.resources-card img').nth(i);
          await img.scrollIntoViewIfNeeded();
          try{await page.waitForFunction(index=>{const el=document.querySelectorAll('.resources-card img')[index];return el&&el.complete&&el.naturalWidth>0},i,{timeout:20000})}
          catch{throw new Error('Resource photo '+(i+1)+' could not load: '+await img.getAttribute('src'))}
        }
      }
      await page.screenshot({path:path.join(output,'resources-'+width+'.png'),fullPage:true});
      assert.deepEqual(errors,[],'Page JavaScript errors at '+width);
      console.log('PASS resources',width,'columns',computedColumns,'cards',images.length,'navigation/links OK');
      await page.close();
    }
    console.log('PASS all Resources responsive/browser checks');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error('FAIL',e.stack||String(e));process.exitCode=1});
