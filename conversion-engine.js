(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fire=(event,detail={})=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...detail,page_path:location.pathname});try{const h=JSON.parse(localStorage.getItem('blue_conversion_events')||'[]');h.push({event,...detail,ts:new Date().toISOString(),page_path:location.pathname});localStorage.setItem('blue_conversion_events',JSON.stringify(h.slice(-120)))}catch{}};
if(!document.body.classList.contains('home-v2'))return;

const PHONE_DISPLAY='(919) 586-2286';
const PHONE_TEL='tel:+19195862286';

const trust=$('.trust-band-v2');
if(trust&&!$('.ce-action-rail')){const rail=document.createElement('section');rail.className='ce-action-rail';rail.innerHTML='<div class="container ce-action-grid"><a class="ce-primary" href="#quoteForm" data-ce="quote"><span class="ce-action-icon">$</span><div><strong>Get a Freight Quote</strong><small>Start with a few shipment details and we’ll help from there.</small></div></a><a href="portal.html" data-ce="track"><span class="ce-action-icon">⌖</span><div><strong>Track a Shipment</strong><small>Check your shipment status in the customer portal.</small></div></a><a href="'+PHONE_TEL+'" data-ce="call"><span class="ce-action-icon">☎</span><div><strong>Call Blue Logistics</strong><small>'+PHONE_DISPLAY+' · Talk to a real local team member.</small></div></a><a href="freight-tools.html" data-ce="tools"><span class="ce-action-icon">✓</span><div><strong>Smart Freight Tools</strong><small>Not sure what you need? We’ll help you figure it out.</small></div></a></div>';trust.insertAdjacentElement('afterend',rail)}

const rail=$('.ce-action-rail');
if(rail){
 const cards=$$('a',rail);
 if(cards[0]){const small=$('small',cards[0]);if(small)small.textContent='Start with a few shipment details and we’ll help from there.'}
 if(cards[1]){const small=$('small',cards[1]);if(small)small.textContent='Check your shipment status in the customer portal.'}
 if(cards[2]){cards[2].href=PHONE_TEL;const strong=$('strong',cards[2]),small=$('small',cards[2]);if(strong)strong.textContent='Call Blue Logistics';if(small)small.textContent=`${PHONE_DISPLAY} · Talk to a real local team member.`}
 if(cards[3]){const small=$('small',cards[3]);if(small)small.textContent='Not sure what you need? We’ll help you figure it out.'}
}

if(rail&&!$('.ce-urgent')){const urgent=document.createElement('section');urgent.className='ce-urgent';rail.insertAdjacentElement('afterend',urgent)}
const urgent=$('.ce-urgent');
if(urgent){urgent.innerHTML='<div class="container ce-urgent-grid"><div class="ce-urgent-copy"><span class="ce-urgent-mark">♥</span><div><h3>Need help with a shipment? We’re here.</h3><p>If your freight is time-sensitive, needs extra attention, or something has changed, give us a call. We’re a local North Carolina team and we’ll do our best to help quickly and clearly.</p><div class="ce-local-proof"><span>★ Veteran-Owned</span><span>📍 North Carolina Based</span><span>☎ Real People</span><span>🚚 Nationwide Support</span></div></div></div><div class="ce-urgent-actions"><a class="btn ce-call-btn" href="'+PHONE_TEL+'" data-ce="urgent_call">Call '+PHONE_DISPLAY+'</a><a class="btn ce-help-btn" href="contact.html?callback=1#quote" data-ce="callback">Request a Call Back →</a></div></div>'}

if(urgent&&!$('.ce-friendly-strip')){const friendly=document.createElement('section');friendly.className='ce-friendly-strip';friendly.innerHTML='<div class="container ce-friendly-inner"><div><strong>Local team. Real answers. No call-center runaround.</strong><span>Based in North Carolina and helping businesses move freight nationwide.</span></div><a href="'+PHONE_TEL+'" data-ce="local_call">Talk with us →</a></div>';urgent.insertAdjacentElement('afterend',friendly)}

if(!$('#ce-friendly-styles')){const style=document.createElement('style');style.id='ce-friendly-styles';style.textContent=`
.ce-urgent{background:linear-gradient(180deg,#f7fbff,#fff);padding:28px 0 10px}.ce-urgent-grid{border:1px solid #d9e8f4!important;background:#fff!important;box-shadow:0 14px 34px rgba(17,66,108,.08);border-radius:20px!important;padding:24px 26px!important}.ce-urgent-mark{background:#e8f4ff!important;color:#087ff5!important}.ce-urgent-copy h3{color:#0d2138!important}.ce-urgent-copy p{color:#536a80!important;max-width:720px}.ce-call-btn{background:#087ff5!important;color:#fff!important;border-color:#087ff5!important}.ce-help-btn{border-color:#b8d2e8!important;color:#123a5d!important;background:#fff!important}.ce-local-proof{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}.ce-local-proof span{font-size:11px;font-weight:800;color:#234e70;background:#eef7ff;border:1px solid #d4e9f8;border-radius:999px;padding:6px 9px}.ce-friendly-strip{padding:14px 0 28px;background:#fff}.ce-friendly-inner{display:flex;justify-content:space-between;gap:20px;align-items:center;background:#071c31;color:#fff;border-radius:16px;padding:17px 21px}.ce-friendly-inner strong,.ce-friendly-inner span{display:block}.ce-friendly-inner strong{font-size:15px}.ce-friendly-inner span{font-size:12px;color:#bcd0e2;margin-top:3px}.ce-friendly-inner a{white-space:nowrap;background:#fff;color:#0872df;font-weight:900;padding:10px 14px;border-radius:10px}
@media(max-width:760px){.ce-urgent-grid{padding:18px!important}.ce-urgent-actions{width:100%}.ce-urgent-actions .btn{width:100%}.ce-friendly-inner{align-items:flex-start;flex-direction:column}.ce-friendly-inner a{width:100%;text-align:center}.ce-action-grid a[data-ce="call"]{order:-1;border-color:#168cff!important;box-shadow:0 8px 20px rgba(8,127,245,.12)}}
`;document.head.appendChild(style)}

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
 tools.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('resume')){const d=getDraft();if(d){Object.entries(d).forEach(([n,v])=>{const el=form.elements.namedItem(n);if(el)el.value=v});update();resume.classList.remove('show');form.scrollIntoView({behavior:'smooth',block:'center'});fire('quote_draft_resumed')}else if(b.classList.contains('clear')){try{localStorage.removeItem(draftKey)}catch{}resume.classList.remove('show');fire('quote_draft_cleared')}});
 form.addEventListener('input',()=>{saveDraft();update()});form.addEventListener('change',()=>{saveDraft();update()});form.addEventListener('submit',()=>{setTimeout(()=>{const txt=($('#quoteStatus',form)?.textContent||'').toLowerCase();if(txt.includes('received')||txt.includes('sent')||txt.includes('success')){try{localStorage.removeItem(draftKey)}catch{}}},1400)});update();
}
$$('.google-review-card .google-stars').forEach(el=>{el.className='review-highlight-label';el.textContent='PUBLIC GOOGLE REVIEW'});
$$('.section-head>span').forEach(el=>{if(el.textContent.trim()==='PHASE 3 TOOLS')el.textContent='SHIPPER TOOLS'});$$('.section-head>p').forEach(el=>{if(el.textContent.includes('New customer, industry and carrier paths'))el.textContent='Practical resources, industry guidance and carrier access in one place.'});

let mobile=$('.ce-mobile-bar');
if(!mobile){mobile=document.createElement('nav');mobile.className='ce-mobile-bar';mobile.setAttribute('aria-label','Quick actions');document.body.appendChild(mobile)}
mobile.innerHTML='<a href="#quoteForm" data-ce="mobile_quote"><b>$</b>QUOTE</a><a href="'+PHONE_TEL+'" data-ce="mobile_call"><b>☎</b>CALL US</a><a href="portal.html" data-ce="mobile_track"><b>⌖</b>TRACK</a>';

$$('a[href="tel:+19196018019"]').forEach(a=>a.href=PHONE_TEL);
document.addEventListener('click',e=>{const a=e.target.closest('[data-ce]');if(a)fire('conversion_action_click',{action:a.dataset.ce||'',link_text:a.textContent.trim().slice(0,80)})});
})();
