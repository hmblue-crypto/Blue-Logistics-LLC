(()=>{
  const WRONG='hmblue@shipbluelogistics.com';
  const RIGHT='hmblue@bluelogisticsllc.us';
  const email=document.getElementById('email');
  const form=document.getElementById('loginForm');
  const resend=document.getElementById('resendLink');
  const msg=document.getElementById('loginMsg');
  if(!email||!form) return;

  const normalize=()=>{
    const v=(email.value||'').trim().toLowerCase();
    if(v===WRONG){
      email.value=RIGHT;
      try{localStorage.setItem('blue_os7_email',RIGHT)}catch(e){}
      if(msg) msg.innerHTML=`Using your authorized owner login: <b>${RIGHT}</b>.`;
      return RIGHT;
    }
    return email.value.trim();
  };

  // Repair a previously saved wrong address from iPhone autofill/localStorage.
  if((email.value||'').trim().toLowerCase()===WRONG) normalize();

  const send=async()=>{
    const addr=normalize();
    if(!addr){ if(msg) msg.textContent='Enter your authorized Blue Logistics email first.'; return; }
    if(msg) msg.textContent='Sending secure sign-in link…';
    try{
      const {error}=await client.auth.signInWithOtp({email:addr,options:{emailRedirectTo:`${location.origin}/owner-os7.html`,shouldCreateUser:false}});
      if(error) throw error;
      try{localStorage.setItem('blue_os7_email',addr)}catch(e){}
      if(msg) msg.innerHTML=`Secure sign-in link sent to <b>${addr}</b>. Open the newest email on this iPhone and tap the link.`;
    }catch(err){
      const text=String(err?.message||err||'Sign-in failed');
      if(msg) msg.innerHTML=/signups not allowed|otp/i.test(text)
        ? `That email is not an authorized OS 7 login. Use <b>${RIGHT}</b>.`
        : text;
    }
  };

  form.onsubmit=e=>{e.preventDefault();send()};
  if(resend) resend.onclick=()=>send();
})();