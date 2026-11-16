/* Isolated public freight service-page browser QA; no production endpoints called. */
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const pages=['full-truckload','less-than-truckload','partial-truckload','refrigerated-freight','flatbed-specialized','expedited-freight','drayage','north-carolina-freight-broker'];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
 let url;try{url=new URL(req.url,'http://local.test')}catch{res.writeHead(400);return res.end('Bad request')}
 const file=path.resolve(root,decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html');
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const out=path.join(root,'.service-qa');fs.mkdirSync(out,{recursive:true});
 try{
  for(const slug of pages){
   for(const width of [320,390,768,1440]){
    const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',err=>errors.push(err.message));
    await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
    const response=await page.goto(base+'/'+slug+'.html',{waitUntil:'domcontentloaded'});
    assert.equal(response.status(),200,slug+' page response');
    assert.equal(await page.locator('h1').count(),1,slug+' must have one h1');
    assert.ok((await page.title()).includes('Blue Logistics'),slug+' title');
    assert.ok(await page.locator('link[rel=canonical]').count()===1,slug+' canonical');
    assert.ok(await page.locator('.skip-to-content').count()===1,slug+' skip-to-content');
    assert.ok(await page.locator('a[href="contact.html#quote"]').count()>=1,slug+' quote CTA');
    const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
    assert.ok(overflow.scroll<=overflow.width+1,slug+' horizontal overflow '+width+': '+JSON.stringify(overflow));
    const button=page.locator('.detail-faq details summary').first();await button.click();
    assert.equal(await page.locator('.detail-faq details').first().getAttribute('open'),'');
    assert.deepEqual(errors,[],slug+' JS errors at '+width);
    if(width===390||width===1440)await page.screenshot({path:path.join(out,slug+'-'+width+'.png'),fullPage:true});
    await page.close();console.log('PASS',slug,width,'no overflow; CTA/metadata/FAQ accessible');
   }
  }
  console.log('PASS all 8 freight service landing pages at four widths');
 }finally{await browser.close();await new Promise(done=>server.close(done))}
})().catch(err=>{console.error('FAIL',err.stack||err);process.exitCode=1});
