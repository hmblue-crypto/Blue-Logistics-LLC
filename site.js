const m=document.querySelector('.menu'),n=document.querySelector('.navlinks');m?.addEventListener('click',()=>n.classList.toggle('open'));document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();

const quoteForm=document.getElementById('quoteForm');
if(quoteForm){
 const quoteSubmit=document.getElementById('quoteSubmit'),quoteStatus=document.getElementById('quoteStatus');
 quoteForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!quoteForm.checkValidity()){quoteForm.reportValidity();return;}
  const formData=new FormData(quoteForm),payload=Object.fromEntries(formData.entries());
  quoteSubmit.disabled=true;quoteSubmit.textContent='Sending quote request…';quoteStatus.textContent='Sending securely to Blue Logistics…';quoteStatus.style.color='#8ecbff';
  try{
   const r=await fetch('https://scrbdfwpthsylmhtqjeu.supabase.co/functions/v1/public-quote-intake',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const data=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(data.error||'Unable to submit quote request.');
   quoteForm.reset();quoteStatus.textContent=`✓ Quote request received. Reference ${String(data.request_id||'').slice(0,8).toUpperCase()}. Our team will review the shipment details and follow up.`;quoteStatus.style.color='#54d89b';quoteSubmit.textContent='Quote Request Sent ✓';
   setTimeout(()=>{quoteSubmit.disabled=false;quoteSubmit.textContent='Request My Freight Quote →'},3500);
  }catch(err){quoteStatus.textContent=`We couldn't submit the request automatically. ${err.message||''} You can also email hmblue@bluelogisticsllc.us.`;quoteStatus.style.color='#ff9b9b';quoteSubmit.disabled=false;quoteSubmit.textContent='Try Again →';}
 });
}