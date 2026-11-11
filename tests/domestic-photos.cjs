/* Blue Logistics Domestic Freight photo-card browser QA.
   Read-only page test: never submits a quote or writes to CRM. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 let url;try{url=new URL(req.url,'http://local.test')}catch{return res.writeHead(400).end()}
 const raw=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
 const file=path.resolve(root,raw);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
});
const sizes=[390,768,1024,1120,1440];
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const output=path.join(root,'.domestic-qa');fs.mkdirSync(output,{recursive:true});
 try{
   for(const width of sizes){
     const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
     const errors=[];page.on('pageerror',err=>errors.push(err.message));
     await page.goto(base+'/domestic-freight.html',{waitUntil:'domcontentloaded'});
     await page.waitForSelector('.mode-grid .mode-photo img');
     const cards=page.locator('.mode-grid .mode');
     assert.equal(await cards.count(),6,'Expected 6 freight mode cards');
     const imgs=await page.locator('.mode-grid .mode-photo img').evaluateAll(arr=>arr.map(img=>({src:img.getAttribute('src'),alt:img.alt,srcset:img.getAttribute('srcset'),loading:img.loading})));
     assert.equal(imgs.length,6);
     assert.equal(new Set(imgs.map(x=>x.src)).size,6,'Images must be unique');
     assert.ok(imgs.every(x=>x.alt&&x.srcset&&x.loading==='lazy'),'Every image needs alt, responsive sources and lazy loading');
     const columns=await page.locator('.mode-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
     assert.equal(columns,width<=700?1:width<=1050?2:3,'Grid columns wrong at '+width);
     const overflow=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:window.innerWidth}));
     if(overflow.document>overflow.viewport+1){
       const offenders=await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(el=>el.getBoundingClientRect().right>innerWidth+2).slice(0,10).map(el=>({tag:el.tagName,className:String(el.className).slice(0,90),right:Math.round(el.getBoundingClientRect().right)})));
       console.error('OVERFLOW ELEMENTS',width,JSON.stringify(offenders));
     }
     assert.ok(overflow.document<=overflow.viewport+1,'Horizontal overflow at '+width+': '+JSON.stringify(overflow));
     if(width>=1120)assert.equal(await page.locator('header .navlinks').isVisible(),true,'Desktop navigation hidden at '+width);
     if(width===390){const menu=page.locator('header .menu');assert.equal(await menu.isVisible(),true,'Mobile menu absent');await menu.click();assert.equal(await page.locator('header .navlinks').isVisible(),true,'Mobile menu did not open');await menu.click();}
     assert.ok(fs.existsSync(path.join(root,'contact.html')),'Quote destination missing');
     assert.ok(await page.locator('a[href="contact.html#quote"]').count()>=1,'Quote CTA missing');
     if(width===1440){
       for(let i=0;i<6;i++){
         const img=page.locator('.mode-photo img').nth(i);await img.scrollIntoViewIfNeeded();
         await page.waitForFunction(index=>{const e=document.querySelectorAll('.mode-photo img')[index];return e&&e.complete&&e.naturalWidth>0},i,{timeout:22000}).catch(async()=>{throw new Error('Photo '+(i+1)+' did not load: '+await img.getAttribute('src'))});
       }
     }
     await page.evaluate(()=>scrollTo(0,0));
     await page.waitForTimeout(100);
     await page.screenshot({path:path.join(output,'domestic-'+width+'.png'),fullPage:true});
     assert.deepEqual(errors,[],'Browser JS error at '+width);
     console.log('PASS domestic',width,columns+'col',imgs.length+' unique photos','no overflow; navigation and quote links OK');
     await page.close();
   }
   console.log('PASS Domestic Freight all five responsive browser checks');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(err=>{console.error('FAIL',err.stack||err);process.exitCode=1});
