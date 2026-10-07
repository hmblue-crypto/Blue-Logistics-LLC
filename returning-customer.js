(()=>{
 const form=document.getElementById('quoteForm');
 const safeParse=(v)=>{try{return JSON.parse(v)}catch{return null}};
 const lastKey='blue_last_successful_lane_v1',pendingKey='blue_pending_lane_v1';
 const laneFields=['pickup_location','delivery_location','service','weight','commodity','pallet_count','equipment_type','shipment_details','company','first_name','last_name','email','phone'];
 const readForm=()=>{if(!form)return{};const out={};for(const name of laneFields){const el=form.elements.namedItem(name);if(el&&'value'in el&&String(el.value||'').trim())out[name]=String(el.value).trim()}return out};
 const fillForm=(data)=>{if(!form||!data)return;Object.entries(data).forEach(([name,value])=>{const el=form.elements.namedItem(name);if(el&&'value'in el&&name!=='pickup_date')el.value=value});const date=form.elements.namedItem('pickup_date');if(date&&'value'in date)date.value='';form.dispatchEvent(new Event('input',{bubbles:true}));form.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>form.querySelector('[name="pickup_date"]')?.focus(),450)};
 if(form){
  form.addEventListener('submit',()=>{try{localStorage.setItem(pendingKey,JSON.stringify(readForm()))}catch{}},true);
  const status=document.getElementById('quoteStatus');if(status){new MutationObserver(()=>{if(/quote request received/i.test(status.textContent||'')){try{const p=localStorage.getItem(pendingKey);if(p)localStorage.setItem(lastKey,p);localStorage.removeItem(pendingKey)}catch{};refreshRepeat()}}).observe(status,{childList:true,subtree:true,characterData:true})}
 }
 let repeatCard=null;
 function refreshRepeat(){
  let saved=null;
  try{saved=safeParse(localStorage.getItem(lastKey)||'')}catch{}
  if(!form||!saved||typeof saved!=='object'||Array.isArray(saved)){repeatCard?.remove();repeatCard=null;return}
  const origin=typeof saved.pickup_location==='string'?saved.pickup_location.trim():'';
  const destination=typeof saved.delivery_location==='string'?saved.delivery_location.trim():'';
  const complete=origin.length>=3&&destination.length>=3;
  if(!complete){repeatCard?.remove();repeatCard=null;return}
  // Summary eligibility only: this never deletes or changes the browser's saved shipment.
  // City-only and other freeform entries can still be reviewed without advertising an unverified route.
  const locationSummary=value=>/^\d{5}(?:-\d{4})?$/.test(value)||/^[\p{L}\p{M} .'-]+,?\s+[A-Z]{2}(?:\s+\d{5}(?:-\d{4})?)?$/u.test(value)||/^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i.test(value);
  const summary=complete&&locationSummary(origin)&&locationSummary(destination);
  if(!repeatCard){repeatCard=document.createElement('div');repeatCard.className='repeat-lane-card';form.parentElement?.insertBefore(repeatCard,form)}
  const title=summary?'Ship this lane again?':complete?'Review your saved shipment':'Have a shipment to quote?';
  const detail=summary?`${escapeHtml(origin)} → ${escapeHtml(destination)}${typeof saved.service==='string'&&saved.service?` • ${escapeHtml(saved.service)}`:''}`:complete?'Check your saved details and add a new pickup date.':'Start with your pickup and delivery locations.';
  const action=summary?'Use Last Shipment →':complete?'Review Saved Details →':'Start a Quote →';
  repeatCard.innerHTML=`<div><span>${complete?'RETURNING CUSTOMER':'FREIGHT QUOTE'}</span><strong>${title}</strong><small>${detail}</small></div><button type="button">${action}</button>`;
  repeatCard.querySelector('button')?.addEventListener('click',()=>{if(complete)fillForm(saved);else{form.scrollIntoView({behavior:'smooth',block:'start'});form.querySelector('[name="pickup_location"]')?.focus({preventScroll:true})}});
 }
 function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
 refreshRepeat();

 if(document.body.classList.contains('home-v2')&&!document.querySelector('.callback-launcher')){
  const launcher=document.createElement('button');launcher.type='button';launcher.className='callback-launcher';launcher.innerHTML='<span>☎</span><div><strong>Want us to call you?</strong><small>Request a callback</small></div>';document.body.appendChild(launcher);
  const modal=document.createElement('div');modal.className='callback-modal';modal.hidden=true;modal.innerHTML=`<div class="callback-backdrop" data-close></div><section class="callback-panel" role="dialog" aria-modal="true" aria-labelledby="callbackTitle"><button type="button" class="callback-close" data-close aria-label="Close">×</button><span class="callback-kicker">BLUE LOGISTICS</span><h2 id="callbackTitle">Request a Callback</h2><p>Leave your number and a few details. Your request goes directly into the Blue Logistics callback queue.</p><form id="callbackForm"><label>Your Name<input required name="name" autocomplete="name"></label><label>Company <small>(optional)</small><input name="company" autocomplete="organization"></label><label>Phone<input required name="phone" type="tel" autocomplete="tel" placeholder="Best number to reach you"></label><label>Email <small>(optional)</small><input name="email" type="email" autocomplete="email"></label><label>Best Time<select name="preferred_time"><option value="">Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label><label>What can we help with? <small>(optional)</small><textarea name="notes" rows="3" placeholder="Quote, shipment question, warehousing, import freight, etc."></textarea></label><div id="callbackStatus" role="status" aria-live="polite"></div><button class="btn primary full" type="submit">Request My Callback →</button></form></section>`;document.body.appendChild(modal);
  const open=()=>{modal.hidden=false;document.body.classList.add('callback-open');setTimeout(()=>modal.querySelector('input')?.focus(),50)};const close=()=>{modal.hidden=true;document.body.classList.remove('callback-open')};launcher.addEventListener('click',open);modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',close));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
  const cb=modal.querySelector('#callbackForm'),status=modal.querySelector('#callbackStatus');cb?.addEventListener('submit',async e=>{e.preventDefault();if(!cb.checkValidity()){cb.reportValidity();return}const btn=cb.querySelector('button[type="submit"]');const data=Object.fromEntries(new FormData(cb).entries());btn.disabled=true;btn.textContent='Sending…';status.textContent='Sending securely to Blue Logistics…';try{const r=await fetch('https://scrbdfwpthsylmhtqjeu.supabase.co/functions/v1/public-callback-request',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...data,source_detail:new URLSearchParams(location.search).get('utm_source')||'website',landing_page:location.href,referrer:document.referrer})});const out=await r.json().catch(()=>({}));if(!r.ok||!out.ok)throw new Error(out.error||'Unable to submit callback request.');cb.reset();status.textContent=`✓ Callback requested. Reference ${String(out.request_id).slice(0,8).toUpperCase()}. Blue Logistics has your request.`;btn.textContent='Callback Requested ✓';setTimeout(()=>{btn.disabled=false;btn.textContent='Request My Callback →'},3500)}catch(err){status.textContent=err.message||'Unable to submit callback request.';btn.disabled=false;btn.textContent='Try Again →'}})
 }
})();
