(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fire=(event,detail={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...detail,page_path:location.pathname});try{const h=JSON.parse(localStorage.getItem('blue_conversion_events')||'[]');h.push({event,...detail,ts:new Date().toISOString(),page_path:location.pathname});localStorage.setItem('blue_conversion_events',JSON.stringify(h.slice(-120)))}catch{}};
if(!document.body.classList.contains('home-v2'))return;

const PHONE_DISPLAY='(919) 586-2286';
const PHONE_TEL='tel:+19195862286';

// Keep the homepage sections defined in index.html; avoid injecting duplicate CTA, urgent and banner sections.

const form=$('#quoteForm');
if(form){
 const draftKey='blue_quote_lane_draft_v1',names=['pickup_location','delivery_location','service','weight','pickup_date'];
 const tools=document.createElement('div');tools.className='ce-quote-tools';tools.innerHTML='<div class="ce-quote-tools-head"><strong>QUOTE READINESS</strong><span data-ce-progress-label>0 of 4 basics</span></div><div class="ce-progress"><i></i></div><div class="ce-resume"><strong>Continue your saved shipment?</strong><div>We saved the lane and freight basics on this device so you can finish the request.</div><div class="ce-resume-actions"><button type="button" class="resume">Continue Quote</button><button type="button" class="clear">Clear Saved Draft</button></div></div>';
 const status=$('#quoteStatus',form); if(status) status.insertAdjacentElement('beforebegin',tools); else form.appendChild(tools);
 const bar=$('.ce-progress>i',tools),label=$('[data-ce-progress-label]',tools),resume=$('.ce-resume',tools);
 const getDraft=()=>{try{return JSON.parse(localStorage.getItem(draftKey)||'null')}catch{return null}};
 const saveDraft=()=>{const d={};names.forEach(n=>{const el=form.elements.namedItem(n);if(el&&String(el.value||'').trim())d[n]=String(el.value).trim()});try{if(Object.keys(d).length)localStorage.setItem(draftKey,JSON.stringify(d));else localStorage.removeItem(draftKey)}catch{}};
 const update=()=>{const core=['pickup_location','delivery_location','service','pickup_date'];const count=core.filter(n=>String(form.elements.namedItem(n)?.value||'').trim()).length;bar.style.width=`${count/4*100}%`;label.textContent=`${count} of 4 basics`;if(count===4)label.textContent='Ready for contact details'};
 const draft=getDraft();if(draft&&Object.keys(draft).length)resume.classList.add('show');
 tools.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('resume')){const d=getDraft();if(d){Object.entries(d).forEach(([n,v])=>{const el=form.elements.namedItem(n);if(el)el.value=v});update();resume.classList.remove('show');form.scrollIntoView({behavior:'smooth',block:'center'});fire('quote_draft_resumed')}}else if(b.classList.contains('clear')){try{localStorage.removeItem(draftKey)}catch{}resume.classList.remove('show');fire('quote_draft_cleared')}});
 form.addEventListener('input',()=>{saveDraft();update()});form.addEventListener('change',()=>{saveDraft();update()});// Quote submission is asynchronous. Clear the saved draft only when the server confirms receipt.
 const clearConfirmedDraft=()=>{
  const message=(status?.textContent||'').trim();
  if(!message.startsWith('✓ Quote request received.'))return;
  try{localStorage.removeItem(draftKey)}catch{}
  resume.classList.remove('show');
 };
 if(status)new MutationObserver(clearConfirmedDraft).observe(status,{childList:true,subtree:true,characterData:true});
 form.addEventListener('reset',()=>setTimeout(update,0));
 update();
}
$$('.google-review-card .google-stars').forEach(el=>{el.className='review-highlight-label';el.textContent='PUBLIC GOOGLE REVIEW'});
$$('.section-head>span').forEach(el=>{if(el.textContent.trim()==='PHASE 3 TOOLS')el.textContent='SHIPPER TOOLS'});$$('.section-head>p').forEach(el=>{if(el.textContent.includes('New customer, industry and carrier paths'))el.textContent='Practical resources, industry guidance and carrier access in one place.'});

let mobile=$('.ce-mobile-bar');
if(!mobile){mobile=document.createElement('nav');mobile.className='ce-mobile-bar';mobile.setAttribute('aria-label','Quick actions');document.body.appendChild(mobile)}
mobile.innerHTML='<a href="#quoteForm" data-ce="mobile_quote"><b>$</b>QUOTE</a><a href="'+PHONE_TEL+'" data-ce="mobile_call"><b>☎</b>CALL US</a><a href="portal.html" data-ce="mobile_track"><b>⌖</b>TRACK</a>';

$$('a[href="tel:+19196018019"]').forEach(a=>a.href=PHONE_TEL);
document.addEventListener('click',e=>{const a=e.target.closest('[data-ce]');if(a)fire('conversion_action_click',{action:a.dataset.ce||'',link_text:a.textContent.trim().slice(0,80)})});
})();

