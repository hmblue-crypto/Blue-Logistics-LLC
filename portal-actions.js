(()=>{
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  let busy=false;
  async function submitRequest(type,shipment){
    if(busy||!shipment?.id||!currentCompany)return;
    busy=true;
    const buttons=[...document.querySelectorAll('[data-portal-request]')];
    buttons.forEach(b=>b.disabled=true);
    try{
      const session=await getSession();
      if(!session)throw new Error('Sign in required');
      const payload={
        company_id:currentCompany,
        shipment_id:shipment.id,
        request_type:type,
        status:'New',
        message:type==='Repeat Shipment'
          ?`Customer requested a repeat shipment based on ${shipment.reference_number}.`
          :`Customer requested a shipment update for ${shipment.reference_number}.`,
        details:{
          source:'customer_portal',
          reference_number:shipment.reference_number,
          origin:shipment.origin,
          destination:shipment.destination,
          equipment_type:shipment.equipment_type||null,
          customer_reference:shipment.customer_reference||null,
          requested_at:new Date().toISOString()
        }
      };
      const {error}=await client.from('customer_portal_requests').insert(payload);
      if(error)throw error;
      showNotice(type==='Repeat Shipment'
        ?'✓ Repeat shipment request sent to your Blue Logistics broker for review. Nothing has been booked automatically.'
        :'✓ Update request sent to your Blue Logistics broker.','success');
    }catch(err){
      showNotice(err?.message||'Unable to send your request.','error');
    }finally{
      busy=false;
      buttons.forEach(b=>b.disabled=false);
    }
  }

  function enhance(){
    const detail=document.getElementById('shipmentDetail');
    if(!detail||detail.querySelector('.portal-self-service'))return;
    const shipment=(portalData?.shipments||[]).find(x=>x.id===currentShipment);
    if(!shipment)return;
    const box=document.createElement('div');
    box.className='portal-self-service';
    box.innerHTML=`<div><span class="portal-kicker">SELF-SERVICE</span><h3>Need something from Blue Logistics?</h3><p>Send a request directly to your broker. Requests do not book, tender, or change freight automatically.</p></div><div class="portal-self-service-actions"><button class="btn primary" data-portal-request="Shipment Update">Request Shipment Update</button><button class="btn" data-portal-request="Repeat Shipment">Repeat This Shipment</button></div>`;
    detail.appendChild(box);
    box.querySelectorAll('[data-portal-request]').forEach(btn=>btn.addEventListener('click',()=>submitRequest(btn.dataset.portalRequest,shipment)));
  }

  const observer=new MutationObserver(()=>enhance());
  const target=document.getElementById('shipmentDetail');
  if(target)observer.observe(target,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest('.shipment-card'))setTimeout(enhance,0)});
  setTimeout(enhance,250);
})();
