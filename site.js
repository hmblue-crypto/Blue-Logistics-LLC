const m=document.querySelector('.menu'),n=document.querySelector('.navlinks');m?.addEventListener('click',()=>n.classList.toggle('open'));document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

if(n&&!n.querySelector('a[href="portal.html"]')){const portal=document.createElement('a');portal.href='portal.html';portal.textContent='Customer Portal';const quote=n.querySelector('.cta-nav');n.insertBefore(portal,quote||null);portal.addEventListener('click',()=>n.classList.remove('open'))}
const connect=document.querySelector('footer .footer-grid>div:last-child');if(connect&&!connect.querySelector('a[href="portal.html"]')){const portalFoot=document.createElement('a');portalFoot.href='portal.html';portalFoot.textContent='Customer Portal';connect.prepend(portalFoot)}

if(!document.querySelector('.mobile-quote')){
 const mobileQuote=document.createElement('a');
 mobileQuote.className='mobile-quote';mobileQuote.href='contact.html#quote';mobileQuote.textContent='Request a Freight Quote →';mobileQuote.setAttribute('aria-label','Request a freight quote');
 document.body.appendChild(mobileQuote);
}

// Phase 2 public-site conversion upgrades.
if(document.body.classList.contains('home-v2')){
 const heroCopy=document.querySelector('.hero-copy');
 if(heroCopy&&!heroCopy.querySelector('.hero-proof-row')){
  const proof=document.createElement('div');proof.className='hero-proof-row';
  proof.innerHTML='<a class="hero-rating-badge" target="_blank" rel="noopener" href="https://g.page/r/CbO6Az7x38l3EBM"><span class="hero-rating-stars">★★★★★</span><strong>4.9 Google Rating</strong><small>49 public reviews</small></a><a class="hero-track-btn" href="portal.html"><span>⌖</span><div><strong>Track Shipment</strong><small>Open Customer Portal</small></div></a>';
  const benefits=heroCopy.querySelector('.hero-benefits');(benefits||heroCopy).insertAdjacentElement('afterend',proof);
 }
 const capability=document.querySelector('.capability-showcase');
 if(capability&&!document.querySelector('.case-study-showcase')){
  const cases=document.createElement('section');cases.className='section case-study-showcase';
  cases.innerHTML='<div class="container"><div class="section-head center"><span>SHIPMENT EXAMPLES</span><h2>How we approach real freight problems.</h2><p>Illustrative examples of the type of transportation challenges Blue Logistics is built to support. Customer names and private shipment details are not published without approval.</p></div><div class="case-study-grid"><article class="case-study-card"><div class="case-route">NC → TX</div><span>FTL DRY VAN • TIME-SENSITIVE</span><h3>Urgent capacity without losing communication.</h3><p><b>Challenge:</b> A shipment needs dependable truckload coverage on a compressed pickup window.</p><p><b>Blue approach:</b> Match the lane to the right equipment, communicate changes quickly, and stay engaged through delivery.</p><small>Representative capability example</small></article><article class="case-study-card"><div class="case-route">PORT → WAREHOUSE</div><span>IMPORT • INLAND TRANSPORT</span><h3>Connecting inbound cargo to the next destination.</h3><p><b>Challenge:</b> Imported freight needs coordinated pickup, inland transport and a warehouse handoff.</p><p><b>Blue approach:</b> Coordinate the transportation pieces through one responsive point of contact.</p><small>Representative capability example</small></article><article class="case-study-card"><div class="case-route">MULTI-LANE</div><span>LTL + FTL • RECURRING SUPPORT</span><h3>One contact for multiple freight needs.</h3><p><b>Challenge:</b> A shipper has recurring lanes using different modes and timing requirements.</p><p><b>Blue approach:</b> Centralize quoting, shipment coordination and follow-through across the account.</p><small>Representative capability example</small></article></div><div class="case-study-actions"><a class="btn primary" href="contact.html#quote">Talk Through Your Shipment →</a><a class="btn outline dark-outline" href="portal.html">Track an Existing Shipment →</a></div></div>';
  capability.insertAdjacentElement('afterend',cases);
 }
}

// Give service pages a consistent proof strip and portal path without changing their core content.
if(document.body.classList.contains('service-page')){
 const ph=document.querySelector('.pagehero');
 if(ph&&!document.querySelector('.service-proof-bar')){
  const bar=document.createElement('section');bar.className='service-proof-bar';bar.innerHTML='<div class="container service-proof-grid"><div><strong>Authorized Freight Broker</strong><small>MC 1689495</small></div><div><strong>4.9 Google Rating</strong><small>49 public reviews</small></div><div><strong>Nationwide Support</strong><small>LTL • FTL • Imports • Storage</small></div><div><strong>Customer Portal</strong><small>Tracking + documents</small></div></div>';ph.insertAdjacentElement('afterend',bar);
 }
 const firstHead=document.querySelector('.service-page main .section-head');
 if(firstHead&&!firstHead.querySelector('.service-mini-actions')){
  const acts=document.createElement('div');acts.className='service-mini-actions';acts.innerHTML='<a class="btn primary" href="contact.html#quote">Request a Quote →</a><a class="btn portal-link" href="portal.html">Track Shipment / Portal →</a>';firstHead.appendChild(acts);
 }
}

const quoteForm=document.getElementById('quoteForm');
if(quoteForm){
 const quoteSubmit=document.getElementById('quoteSubmit'),quoteStatus=document.getElementById('quoteStatus'),repeatQuote=document.getElementById('repeatQuote'),attachments=document.getElementById('quoteAttachments');
 let lastQuoteData=null,isRepeat=false;
 const params=new URLSearchParams(location.search),trackingKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];
 const detectedSource=()=>params.get('utm_source')||(document.referrer.includes('google')?'google':document.referrer.includes('instagram')?'instagram':document.referrer.includes('linkedin')?'linkedin':document.referrer.includes('facebook')?'facebook':document.referrer?'referral':'direct');
 let attribution={source_detail:detectedSource(),landing_page:location.href,referrer:document.referrer};trackingKeys.forEach(k=>{if(params.get(k))attribution[k]=params.get(k)});
 try{const saved=sessionStorage.getItem('blue_quote_attribution');if(saved)attribution={...JSON.parse(saved),...attribution};else sessionStorage.setItem('blue_quote_attribution',JSON.stringify(attribution))}catch{}
 repeatQuote?.addEventListener('click',()=>{if(!lastQuoteData)return;Object.entries(lastQuoteData).forEach(([name,value])=>{const field=quoteForm.elements.namedItem(name);if(field&&field.type!=='file'&&field.type!=='checkbox')field.value=value});isRepeat=true;repeatQuote.hidden=true;quoteStatus.textContent='Similar shipment details restored. Update the lane, date, or freight details before submitting.';quoteStatus.style.color='#0872df';quoteForm.scrollIntoView({behavior:'smooth',block:'start'})});
 quoteForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!quoteForm.checkValidity()){quoteForm.reportValidity();return;}
  const files=Array.from(attachments?.files||[]);if(files.length>3||files.some(file=>file.size>10*1024*1024)){quoteStatus.textContent='Attach no more than 3 files, 10 MB or less each.';quoteStatus.style.color='#c53535';return;}
  const smsOpt=quoteForm.elements.namedItem('sms_opt_in');if(smsOpt?.checked&&!quoteForm.elements.namedItem('phone')?.value.trim()){quoteStatus.textContent='Enter a phone number to receive text confirmation.';quoteStatus.style.color='#c53535';return;}
  const formData=new FormData(quoteForm);Object.entries(attribution).forEach(([key,value])=>formData.set(key,String(value||'')));formData.set('repeat_request',String(isRepeat));
  lastQuoteData=Object.fromEntries(Array.from(formData.entries()).filter(([,value])=>typeof value==='string'&&value));
  quoteSubmit.disabled=true;quoteSubmit.textContent='Sending quote request…';quoteStatus.textContent='Sending securely to Blue Logistics…';quoteStatus.style.color='#8ecbff';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
   const r=await fetch(`https://scrbdfwpthsylmhtqjeu.supabase.co/functions/v1/public-quote-intake?t=${Date.now()}`,{method:'POST',headers:{'Accept':'application/json'},body:formData,cache:'no-store',signal:controller.signal});
   const data=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(data.error||'Unable to submit quote request.');
   if(!data.ok||!data.request_id)throw new Error('The server did not confirm a quote reference. Please retry.');
   quoteForm.reset();isRepeat=false;repeatQuote.hidden=false;const smsNote=data.sms_status==='sent'?' Text confirmation sent.':data.sms_status==='not_configured'?' Text confirmation is not active yet; your quote was still received.':'';const fileNote=Number(data.attachment_count)>0?` ${data.attachment_count} document${Number(data.attachment_count)>1?'s':''} secured.`:'';quoteStatus.textContent=`✓ Quote request received. Reference ${String(data.request_id).slice(0,8).toUpperCase()}.${fileNote}${smsNote} Blue Logistics has the request${Number(data.push_sent)>0?' and the owner alert was sent':''}.`;quoteStatus.style.color='#18794e';quoteSubmit.textContent='Quote Request Sent ✓';
   setTimeout(()=>{quoteSubmit.disabled=false;quoteSubmit.textContent='Request My Freight Quote →'},3500);
  }catch(err){quoteStatus.textContent=`We couldn't confirm the quote request. ${err?.name==='AbortError'?'The request timed out.':(err.message||'')} Please try again or email hmblue@bluelogisticsllc.us.`;quoteStatus.style.color='#ff9b9b';quoteSubmit.disabled=false;quoteSubmit.textContent='Try Again →';}
  finally{clearTimeout(timer)}
 });
}
