const m=document.querySelector('.menu'),n=document.querySelector('.navlinks');m?.addEventListener('click',()=>n.classList.toggle('open'));document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

if(!document.querySelector('.mobile-quote')){
 const mobileQuote=document.createElement('a');
 mobileQuote.className='mobile-quote';mobileQuote.href='contact.html#quote';mobileQuote.textContent='Request a Freight Quote →';mobileQuote.setAttribute('aria-label','Request a freight quote');
 document.body.appendChild(mobileQuote);
}

const quoteForm=document.getElementById('quoteForm');
if(quoteForm){
 const quoteSubmit=document.getElementById('quoteSubmit'),quoteStatus=document.getElementById('quoteStatus');
 quoteForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!quoteForm.checkValidity()){quoteForm.reportValidity();return;}
  const formData=new FormData(quoteForm),payload=Object.fromEntries(formData.entries());
  quoteSubmit.disabled=true;quoteSubmit.textContent='Sending quote request…';quoteStatus.textContent='Sending securely to Blue Logistics…';quoteStatus.style.color='#8ecbff';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
   const r=await fetch(`https://scrbdfwpthsylmhtqjeu.supabase.co/functions/v1/public-quote-intake?t=${Date.now()}`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),cache:'no-store',signal:controller.signal});
   const data=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(data.error||'Unable to submit quote request.');
   if(!data.ok||!data.request_id)throw new Error('The server did not confirm a quote reference. Please retry.');
   quoteForm.reset();quoteStatus.textContent=`✓ Quote request received. Reference ${String(data.request_id).slice(0,8).toUpperCase()}. Blue Logistics has the request${Number(data.push_sent)>0?' and the phone alert was sent':''}.`;quoteStatus.style.color='#54d89b';quoteSubmit.textContent='Quote Request Sent ✓';
   setTimeout(()=>{quoteSubmit.disabled=false;quoteSubmit.textContent='Request My Freight Quote →'},3500);
  }catch(err){quoteStatus.textContent=`We couldn't confirm the quote request. ${err?.name==='AbortError'?'The request timed out.':(err.message||'')} Please try again or email hmblue@bluelogisticsllc.us.`;quoteStatus.style.color='#ff9b9b';quoteSubmit.disabled=false;quoteSubmit.textContent='Try Again →';}
  finally{clearTimeout(timer)}
 });
}
