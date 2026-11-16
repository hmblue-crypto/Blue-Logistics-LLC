#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),errors=[],warnings=[],notes=[];
const publicPaths=['index.html','domestic-freight.html','import-export.html','warehousing.html','nationwide.html','industries.html','industry-manufacturing.html','industry-construction.html','industry-paper-packaging.html','industry-retail-distribution.html','industry-food-beverage.html','industry-importers.html','resources.html','freight-tools.html','freight-quote-checklist.html','bol-checklist.html','carriers.html','about.html','contact.html','full-truckload.html','less-than-truckload.html','partial-truckload.html','refrigerated-freight.html','flatbed-specialized.html','expedited-freight.html','drayage.html','north-carolina-freight-broker.html'];
const exists=p=>fs.existsSync(path.join(root,p))&&fs.statSync(path.join(root,p)).isFile();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bad=(message)=>errors.push(message),warn=(message)=>warnings.push(message);
for(const p of publicPaths){
 if(!exists(p)){bad('Missing public page '+p);continue}
 const h=read(p);
 if(!/<html\s+[^>]*lang=["']en(?:-\w+)?["']/i.test(h))warn('Missing HTML lang: '+p);
 if(!/<h1\b/i.test(h))warn('Missing h1: '+p);
 if(!/<meta\s+name=["']viewport/i.test(h))warn('Missing viewport: '+p);
 if(!/<meta\s+name=["']description/i.test(h))warn('Missing description: '+p);
 if(!/<link\s+rel=["']canonical["']/i.test(h))warn('Missing canonical: '+p);
 const refs=[...h.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
 for(const ref of refs){
  const short=ref.split('#')[0].split('?')[0];
  if(!short||/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(short))continue;
  const target=decodeURIComponent(short.replace(/^\//,''));
  if(target&&!exists(target))bad('Broken local reference in '+p+': '+ref);
 }
}
const xml=read('sitemap.xml');const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const unique=new Set(urls);if(unique.size!==urls.length)bad('Duplicate sitemap URLs');
for(const url of urls){
 let u;try{u=new URL(url)}catch{bad('Invalid sitemap URL '+url);continue}
 if(u.hostname!=='www.shipbluelogistics.com'||u.protocol!=='https:')bad('Unexpected sitemap host '+url);
 const p=u.pathname==='/'?'index.html':decodeURIComponent(u.pathname.slice(1));
 if(!exists(p))bad('Sitemap points to missing page: '+p);
 if(/(?:portal|owner-os|404)\.html/.test(p))bad('Private/error page in sitemap: '+p);
}
const js=read('site.js'),p=read('portal.html'),v=JSON.parse(read('vercel.json'));
if(!js.includes('/functions/v1/public-quote-intake'))bad('Public quote intake reference missing from site.js');
if(!/<meta\s+name=["']robots["']\s+content=["']noindex/i.test(p))bad('Portal missing noindex tag');
if(!Array.isArray(v.headers))bad('Missing Vercel header rules');
for(const p of ['portal.js','owner-os6.js','owner-os7.js','site.js','quote-enhance.js']){
 if(!exists(p))continue;
 const c=read(p);
 if(/(?:sb_secret_[\w-]{12,}|sk_live_[\w-]{12,}|SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"][^'"]{10,})/.test(c))bad('Possible private key in public JS: '+p);
}
for(const w of warnings)console.warn('WARN',w);
for(const e of errors)console.error('FAIL',e);
console.log('Public-site audit:',publicPaths.length,'baseline pages;',urls.length,'sitemap entries;',errors.length,'errors;',warnings.length,'warnings');
if(errors.length)process.exitCode=1;
