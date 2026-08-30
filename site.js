const m=document.querySelector('.menu'),n=document.querySelector('.navlinks');m?.addEventListener('click',()=>n.classList.toggle('open'));document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

if(!document.querySelector('.mobile-quote')){
 const mobileQuote=document.createElement('a');
 mobileQuote.className='mobile-quote';mobileQuote.href='contact.html#quote';mobileQuote.textContent='Request a Freight Quote →';mobileQuote.setAttribute('aria-label','Request a freight quote');
 document.body.appendChild(mobileQuote);
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
