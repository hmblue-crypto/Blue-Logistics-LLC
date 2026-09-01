(()=>{
 const boot=()=>{
  const form=document.getElementById('quoteForm');
  if(!form||!form.dataset.wizardReady){setTimeout(boot,120);return}
  if(form.dataset.customerEnhanceReady)return;form.dataset.customerEnhanceReady='true';
  if(!document.querySelector('link[href*="quote-enhance.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='quote-enhance.css?v=20260901-1';document.head.appendChild(l)}
  const step2=form.querySelector('.quote-wizard-step[data-step="2"]'),step3=form.querySelector('.quote-wizard-step[data-step="3"]');
  if(!step2||!step3)return;

  const details=document.createElement('details');details.className='quote-more-details';details.innerHTML=`<summary><span>＋</span><div><strong>Add shipment details</strong><small>Optional — helps us quote faster</small></div></summary><div class="quote-more-body"><div class="hero-form-row"><label>Commodity<input name="commodity" placeholder="e.g. paper, machinery, food"></label><label>Pallets / Pieces<input type="number" min="0" max="9999" name="pallet_count" placeholder="e.g. 4"></label></div><label>Equipment, if known<select name="equipment_type"><option value="">Not sure / let Blue choose</option><option>Dry Van</option><option>Reefer</option><option>Flatbed</option><option>Box Truck</option><option>Sprinter / Cargo Van</option><option>Drayage</option><option>Other</option></select></label><label>Anything else we should know?<textarea name="shipment_details" rows="3" placeholder="Dimensions, appointments, special handling, urgency, access restrictions, etc."></textarea></label></div>`;
  step2.appendChild(details);

  const contactExtras=document.createElement('div');contactExtras.className='quote-contact-extras';contactExtras.innerHTML=`<div class="hero-form-row"><label>Company <small>Optional</small><input name="company" autocomplete="organization" placeholder="Company name"></label><label>Phone <small>Optional</small><input name="phone" autocomplete="tel" inputmode="tel" placeholder="Phone number"></label></div><label class="quote-sms-opt"><input type="checkbox" name="sms_opt_in" value="true"><span><strong>Text me a confirmation</strong><small>Optional. Standard message rates may apply.</small></span></label><label class="quote-upload"><span><strong>Attach a BOL, packing list or freight photo</strong><small>Optional • up to 3 files • 10 MB each</small></span><input id="quoteAttachments" type="file" name="attachments" multiple accept="application/pdf,image/jpeg,image/png,image/webp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></label>`;
  step3.appendChild(contactExtras);

  const review=document.createElement('div');review.className='quote-review-card';review.innerHTML='<div class="quote-review-title"><strong>Quick review</strong><small>Check the basics before you send it.</small></div><div class="quote-review-grid"><div><span>Lane</span><b data-review="lane">—</b></div><div><span>Freight</span><b data-review="freight">—</b></div><div><span>Pickup</span><b data-review="date">Flexible / not entered</b></div><div><span>Contact</span><b data-review="contact">—</b></div></div>';
  step3.appendChild(review);

  const savedNote=document.createElement('div');savedNote.className='quote-draft-note';savedNote.innerHTML='<span>✓</span> Your progress is protected while this tab stays open.';form.querySelector('.quote-wizard-intro')?.insertAdjacentElement('afterend',savedNote);

  const value=n=>String(form.elements.namedItem(n)?.value||'').trim();
  const updateReview=()=>{
   const lane=[value('pickup_location'),value('delivery_location')].filter(Boolean).join(' → ')||'—';
   const freight=[value('service'),value('weight')].filter(Boolean).join(' • ')||'—';
   const contact=[value('first_name'),value('last_name')].filter(Boolean).join(' ')||value('email')||'—';
   const map={lane,freight,date:value('pickup_date')||'Flexible / not entered',contact};Object.entries(map).forEach(([k,v])=>{const el=review.querySelector(`[data-review="${k}"]`);if(el)el.textContent=v});
  };

  const draftKey='blue_quote_draft_v2';
  const saveDraft=()=>{try{const data={};new FormData(form).forEach((v,k)=>{if(typeof v==='string'&&k!=='sms_opt_in')data[k]=v});data.sms_opt_in=!!form.elements.namedItem('sms_opt_in')?.checked;sessionStorage.setItem(draftKey,JSON.stringify(data))}catch{}updateReview()};
  try{const raw=sessionStorage.getItem(draftKey);if(raw){const data=JSON.parse(raw);Object.entries(data).forEach(([k,v])=>{const el=form.elements.namedItem(k);if(!el||el.type==='file')return;if(el.type==='checkbox')el.checked=!!v;else if(!el.value)el.value=String(v??'')});}}
  catch{}
  form.addEventListener('input',saveDraft);form.addEventListener('change',saveDraft);
  form.addEventListener('reset',()=>{try{sessionStorage.removeItem(draftKey)}catch{}setTimeout(updateReview,0)});
  updateReview();

  const fileInput=form.querySelector('#quoteAttachments');
  fileInput?.addEventListener('change',()=>{const holder=fileInput.closest('.quote-upload');const count=fileInput.files?.length||0;holder?.classList.toggle('has-files',count>0);const small=holder?.querySelector('small');if(small)small.textContent=count?`${count} file${count===1?'':'s'} selected`:'Optional • up to 3 files • 10 MB each';});
 };
 boot();
})();