/* Recruit Studio concept demo. Original implementation; no backend, analytics, storage, real applicants, email, or payments. */
(() => {
  "use strict";
  const STAGES = ["Sourced", "Screened", "Submitted", "Interview", "Offer", "Placed"];
  const scenarioData = {
    general: {
      clients: [
        {id:"a1",name:"Copperfield Design Co.",sector:"Design services",city:"Charlotte, NC",status:"Active"},
        {id:"a2",name:"Pinecrest Wellness Group",sector:"Health services",city:"Raleigh, NC",status:"Active"},
        {id:"a3",name:"Meridian Commerce Lab",sector:"E-commerce",city:"Austin, TX",status:"Prospecting"}
      ],
      jobs: [
        {id:"j1",title:"Senior Operations Manager",clientId:"a1",location:"Charlotte, NC",salary:110000,fee:22,openings:1},
        {id:"j2",title:"Clinical Program Lead",clientId:"a2",location:"Raleigh, NC",salary:105000,fee:20,openings:1},
        {id:"j3",title:"Growth Marketing Director",clientId:"a3",location:"Remote · US",salary:145000,fee:20,openings:1},
        {id:"j4",title:"Account Executive",clientId:"a1",location:"Charlotte, NC",salary:82000,fee:18,openings:1}
      ],
      candidates: [
        {id:"c1",name:"Jordan Example",location:"Charlotte, NC",jobId:"j1",stage:"Sourced",source:"Referral"},
        {id:"c2",name:"Morgan Placeholder",location:"Raleigh, NC",jobId:"j2",stage:"Screened",source:"Career page"},
        {id:"c3",name:"Alex Sample",location:"Austin, TX",jobId:"j3",stage:"Submitted",source:"Search"},
        {id:"c4",name:"Taylor Fiction",location:"Durham, NC",jobId:"j2",stage:"Interview",source:"Referral"},
        {id:"c5",name:"Sam Demo",location:"Charlotte, NC",jobId:"j4",stage:"Offer",source:"Search"},
        {id:"c6",name:"Casey Example",location:"Charlotte, NC",jobId:"j1",stage:"Placed",source:"Referral"},
        {id:"c7",name:"Avery Fiction",location:"Remote, US",jobId:"j3",stage:"Sourced",source:"Career page"},
        {id:"c8",name:"Quinn Placeholder",location:"Charlotte, NC",jobId:"j4",stage:"Submitted",source:"Search"}
      ]
    },
    healthcare: {
      clients:[
        {id:"a1",name:"Willow Valley Clinics",sector:"Outpatient care",city:"Denver, CO",status:"Active"},
        {id:"a2",name:"Harbor Medical Partners",sector:"Health services",city:"Nashville, TN",status:"Active"},
        {id:"a3",name:"Elmbridge Health Group",sector:"Healthcare tech",city:"Atlanta, GA",status:"Prospecting"}
      ],
      jobs:[
        {id:"j1",title:"Nurse Manager",clientId:"a1",location:"Denver, CO",salary:115000,fee:20,openings:1},
        {id:"j2",title:"Revenue Cycle Lead",clientId:"a2",location:"Nashville, TN",salary:96000,fee:20,openings:1},
        {id:"j3",title:"Clinical Operations Director",clientId:"a3",location:"Atlanta, GA",salary:150000,fee:22,openings:1}
      ],
      candidates:[
        {id:"c1",name:"Morgan Demo",location:"Denver, CO",jobId:"j1",stage:"Sourced",source:"Referral"},
        {id:"c2",name:"Jordan Sample",location:"Nashville, TN",jobId:"j2",stage:"Screened",source:"Search"},
        {id:"c3",name:"Alex Placeholder",location:"Atlanta, GA",jobId:"j3",stage:"Submitted",source:"Career page"},
        {id:"c4",name:"Taylor Example",location:"Denver, CO",jobId:"j1",stage:"Interview",source:"Referral"},
        {id:"c5",name:"Sam Fiction",location:"Nashville, TN",jobId:"j2",stage:"Placed",source:"Search"}
      ]
    },
    technology: {
      clients:[
        {id:"a1",name:"Northline Cloud Labs",sector:"Software",city:"Seattle, WA",status:"Active"},
        {id:"a2",name:"Lantern Data Studio",sector:"Data products",city:"Boston, MA",status:"Active"},
        {id:"a3",name:"Redwood Product Co.",sector:"Digital products",city:"San Diego, CA",status:"Prospecting"}
      ],
      jobs:[
        {id:"j1",title:"Staff Backend Engineer",clientId:"a1",location:"Seattle, WA",salary:185000,fee:20,openings:1},
        {id:"j2",title:"Data Platform Manager",clientId:"a2",location:"Boston, MA",salary:165000,fee:22,openings:1},
        {id:"j3",title:"Product Design Lead",clientId:"a3",location:"Remote · US",salary:150000,fee:18,openings:1},
        {id:"j4",title:"Technical Recruiter",clientId:"a1",location:"Remote · US",salary:105000,fee:20,openings:1}
      ],
      candidates:[
        {id:"c1",name:"Alex Example",location:"Seattle, WA",jobId:"j1",stage:"Sourced",source:"Search"},
        {id:"c2",name:"Casey Fiction",location:"Boston, MA",jobId:"j2",stage:"Screened",source:"Referral"},
        {id:"c3",name:"Taylor Demo",location:"Remote, US",jobId:"j3",stage:"Submitted",source:"Career page"},
        {id:"c4",name:"Morgan Sample",location:"Boston, MA",jobId:"j2",stage:"Interview",source:"Referral"},
        {id:"c5",name:"Jordan Placeholder",location:"Seattle, WA",jobId:"j4",stage:"Placed",source:"Search"},
        {id:"c6",name:"Sam Fiction",location:"San Diego, CA",jobId:"j3",stage:"Offer",source:"Referral"}
      ]
    }
  };
  const $ = id => document.getElementById(id);
  const clean = x => String(x ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const cash = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
  const cap = n => Number.isFinite(n) ? Math.max(0,n) : 0;
  const clone = data => JSON.parse(JSON.stringify(data));
  const feeValue = j => Math.round(j.salary * j.fee / 100);
  const client = id => state.clients.find(x => x.id === id) || {name:"Unknown demo client"};
  const job = id => state.jobs.find(x => x.id === id) || {title:"Unknown demo job",salary:0,fee:0};
  const note = (title,detail) => state.activity.unshift({title,detail});
  let state = {};
  let currentView = "dashboard";
  let search = "";
  let jobFilter = "all";
  let serial = 100;

  function seed(scenario) {
    const data = clone(scenarioData[scenario] || scenarioData.general);
    state = {...data,activity:[
      {title:"Example placement recorded",detail:"Fictional candidate moved to Placed"},
      {title:"Interview scheduled (simulated)",detail:"Example team activity — not a real calendar event"},
      {title:"New requisition opened (simulated)",detail:"Sample client order added to pipeline"}
    ]};
    search = "";
    jobFilter = "all";
    $("candidateSearch").value = "";
    serial = 100;
    render();
  }

  function calculations() {
    const projected = state.jobs.reduce((n,j)=>n + feeValue(j) * (j.openings||1),0);
    const realized = state.candidates.filter(c=>c.stage==="Placed").reduce((n,c)=>n+feeValue(job(c.jobId)),0);
    return {projected,realized,remaining:Math.max(0,projected-realized),interviews:state.candidates.filter(c=>["Interview","Offer"].includes(c.stage)).length,placements:state.candidates.filter(c=>c.stage==="Placed").length};
  }

  function kpi(label,number,sub) {
    return '<article class="kpi"><span class="key">'+clean(label)+'</span><span class="metric">'+clean(number)+'</span><div class="sub">'+clean(sub)+'</div></article>';
  }

  function renderOverview() {
    const calc = calculations();
    $("kpiGrid").innerHTML =
      kpi("OPEN JOB ORDERS",state.jobs.length,"Fictional active requisitions")+
      kpi("CANDIDATES",state.candidates.length,"Sample talent profiles")+
      kpi("INTERVIEW / OFFER",calc.interviews,"Simulated next steps")+
      kpi("PLACEMENT FEES",cash(calc.realized),"Illustrative completed placements");
    const max = Math.max(1,...STAGES.map(s=>state.candidates.filter(c=>c.stage===s).length));
    $("funnelRows").innerHTML = STAGES.map(stage=>{
      const count = state.candidates.filter(c=>c.stage===stage).length;
      return '<div class="funnel-row"><span>'+clean(stage)+'</span><div class="funnel-bar"><i style="width:'+Math.round(count/max*100)+'%"></i></div><b>'+count+'</b></div>';
    }).join("");
    $("activityList").innerHTML = state.activity.slice(0,6).map(a =>
      '<div class="activity-item"><span class="activity-icon">◷</span><div><strong>'+clean(a.title)+'</strong><small>'+clean(a.detail)+'</small></div></div>'
    ).join("");
    $("overviewJobs").innerHTML = state.jobs.map(j=>
      '<div class="job-row"><div><strong>'+clean(j.title)+'</strong><small>'+clean(j.location)+'</small></div><span>'+clean(client(j.clientId).name)+'</span><b>'+cash(feeValue(j))+'</b><span class="pill open">Open · Demo</span></div>'
    ).join("");
  }

  function renderJobs() {
    $("jobsGrid").innerHTML = state.jobs.map(j=>{
      const count = state.candidates.filter(c=>c.jobId===j.id).length;
      return '<article class="job-card"><div class="job-card-header"><div><span class="mini-label">'+clean(client(j.clientId).name)+'</span><h2>'+clean(j.title)+'</h2></div><span class="pill open">Open · Demo</span></div><p>⌖ '+clean(j.location)+'</p><div class="job-metrics"><div><label>Salary</label><b>'+cash(j.salary)+'</b></div><div><label>Fee potential</label><b>'+cash(feeValue(j))+'</b></div><div><label>Sample candidates</label><b>'+count+'</b></div></div></article>';
    }).join("");
  }

  function renderClients() {
    $("clientsTable").innerHTML = '<table><thead><tr><th>Fictional client</th><th>Sector</th><th>Location</th><th>Open jobs</th><th>Potential fees</th><th>Status</th></tr></thead><tbody>'+
      state.clients.map(c=>{
        const jobs = state.jobs.filter(j=>j.clientId===c.id);
        return '<tr><td><strong>'+clean(c.name)+'</strong></td><td>'+clean(c.sector)+'</td><td>'+clean(c.city)+'</td><td>'+jobs.length+'</td><td class="money">'+cash(jobs.reduce((n,j)=>n+feeValue(j),0))+'</td><td><span class="pill '+(c.status==="Active"?"open":"")+'">'+clean(c.status)+'</span></td></tr>';
      }).join("")+'</tbody></table>';
  }

  function renderCandidates() {
    const matches = state.candidates.filter(c=>{
      const j=job(c.jobId);
      const haystack=[c.name,c.location,j.title,client(j.clientId).name].join(" ").toLowerCase();
      return haystack.includes(search.toLowerCase())&&(jobFilter==="all"||c.jobId===jobFilter);
    });
    $("candidateBoard").innerHTML = STAGES.map(stage=>{
      const list = matches.filter(c=>c.stage===stage);
      return '<div class="stage-column"><div class="stage-head">'+clean(stage)+' <b>'+list.length+'</b></div>'+
        (list.length?list.map(c=>{
          const j=job(c.jobId);
          return '<div class="candidate-tile"><strong>'+clean(c.name)+'</strong><small>'+clean(c.location)+'</small><p>'+clean(j.title)+'<br>'+clean(client(j.clientId).name)+'</p><label><small>Move to stage</small><select aria-label="Change stage for '+clean(c.name)+'" data-candidate="'+clean(c.id)+'">'+STAGES.map(s=>'<option value="'+clean(s)+'" '+(s===stage?'selected':'')+'>'+clean(s)+'</option>').join("")+'</select></label></div>';
        }).join(""):'<p class="empty">No sample candidates</p>')+'</div>';
    }).join("");
  }

  function renderRevenue() {
    const c=calculations();
    $("revenueCards").innerHTML=kpi("TOTAL OPPORTUNITY",cash(c.projected),"All sample job-order fees")+kpi("SIMULATED PLACED",cash(c.realized),"Not actual revenue")+kpi("REMAINING PIPELINE",cash(c.remaining),"Hypothetical maximum, not forecast")+kpi("SAMPLE PLACEMENTS",c.placements,"Not actual hires");
    $("revenueTable").innerHTML='<table><thead><tr><th>Job / client</th><th>Modeled salary</th><th>Fee %</th><th>Potential</th><th>Placed count</th><th>Simulated fees</th></tr></thead><tbody>'+state.jobs.map(j=>{
      const placed=state.candidates.filter(c=>c.jobId===j.id&&c.stage==="Placed").length;
      return '<tr><td><strong>'+clean(j.title)+'</strong><small>'+clean(client(j.clientId).name)+'</small></td><td>'+cash(j.salary)+'</td><td>'+j.fee+'%</td><td>'+cash(feeValue(j))+'</td><td>'+placed+'</td><td class="money positive">'+cash(placed*feeValue(j))+'</td></tr>';
    }).join("")+'</tbody></table>';
  }

  function renderOptions() {
    $("candidateJobSelect").innerHTML=state.jobs.map(j=>'<option value="'+clean(j.id)+'">'+clean(j.title)+' — '+clean(client(j.clientId).name)+'</option>').join("");
    $("newJobClient").innerHTML=state.clients.map(c=>'<option value="'+clean(c.id)+'">'+clean(c.name)+'</option>').join("");
    $("jobFilter").innerHTML='<option value="all">All job orders</option>'+state.jobs.map(j=>'<option value="'+clean(j.id)+'">'+clean(j.title)+'</option>').join("");
    $("jobFilter").value=jobFilter;
  }

  function render() {
    renderOptions();
    renderOverview();
    renderJobs();
    renderCandidates();
    renderClients();
    renderRevenue();
  }

  const viewNames={dashboard:"Overview",jobs:"Job orders",candidates:"Candidates",clients:"Clients",revenue:"Placement revenue",pricing:"Pricing concept"};
  function navigate(view) {
    if(!viewNames[view]) return;
    currentView=view;
    document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.id===view));
    document.querySelectorAll(".nav-item").forEach(el=>{
      const active=el.dataset.view===view;
      el.classList.toggle("active",active);
      if(active)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current");
    });
    $("breadcrumbLabel").textContent=viewNames[view];
    document.title=viewNames[view]+" | Recruit Studio Demo";
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function toast(message) {
    document.querySelectorAll(".notification").forEach(x=>x.remove());
    const el=document.createElement("div");el.className="notification";el.role="status";el.textContent=message;document.body.appendChild(el);
    window.setTimeout(()=>el.remove(),4500);
  }

  function csvCell(value) {
    let s=String(value??"");
    // Guard formula injection in exported demo values, including typed fictional fields.
    if(/^[=+\-@\t\r]/.test(s))s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  function exportDemo() {
    const rows=[["record_type","name","company","job_title","stage","location","salary_usd","placement_fee_percent"]];
    state.jobs.forEach(j=>rows.push(["job",j.title,client(j.clientId).name,j.title,"Open · Demo",j.location,j.salary,j.fee]));
    state.candidates.forEach(c=>{
      const j=job(c.jobId);
      rows.push(["candidate",c.name,client(j.clientId).name,j.title,c.stage,c.location,"",""]);
    });
    const csv=rows.map(row=>row.map(csvCell).join(",")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download="recruit-studio-fictional-demo.csv";document.body.appendChild(link);link.click();link.remove();
    URL.revokeObjectURL(url);
    toast("Fictional demo CSV exported. No server data used.");
  }

  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view]");if(nav){navigate(nav.dataset.view);return}
    const jump=e.target.closest("[data-goto]");if(jump){navigate(jump.dataset.goto);return}
    const open=e.target.closest("[data-open]");
    if(open){const d=open.dataset.open==="job"?$("jobDialog"):$("candidateDialog");d.showModal();return}
    const closer=e.target.closest("[data-close]");if(closer)closer.closest("dialog")?.close();
  });
  $("resetDemo").addEventListener("click",()=>{seed($("scenarioSelect").value);navigate("dashboard");toast("Demo reset. All sample inputs cleared.")});
  $("scenarioSelect").addEventListener("change",e=>{seed(e.target.value);navigate("dashboard");toast("Fictional scenario loaded.")});
  $("exportDemo").addEventListener("click",exportDemo);
  $("candidateSearch").addEventListener("input",e=>{search=e.target.value.trim().slice(0,80);renderCandidates()});
  $("jobFilter").addEventListener("change",e=>{jobFilter=e.target.value;renderCandidates()});
  $("candidateBoard").addEventListener("change",e=>{
    const id=e.target.dataset.candidate;if(!id)return;
    const cand=state.candidates.find(c=>c.id===id);
    if(!cand||!STAGES.includes(e.target.value))return;
    if(cand.stage!==e.target.value){
      cand.stage=e.target.value;
      note("Sample pipeline updated",cand.name+" → "+cand.stage+" (simulation)");
      render();toast("Fictional candidate moved to "+cand.stage+".");
    }
  });
  $("candidateForm").addEventListener("submit",e=>{
    e.preventDefault();
    const form=e.currentTarget,f=new FormData(form),name=String(f.get("name")||"").trim(),loc=String(f.get("location")||"").trim(),jobId=String(f.get("jobId")||""),stage=String(f.get("stage")||"");
    if(!name||!loc||!state.jobs.some(j=>j.id===jobId)||!STAGES.slice(0,5).includes(stage)){toast("Enter a fictional name, location, job and valid stage.");return}
    state.candidates.push({id:"sample-"+(++serial),name:name.slice(0,70),location:loc.slice(0,70),jobId,stage,source:"Manual demo"});
    note("Sample candidate added",name+" added to "+job(jobId).title);
    form.reset();$("candidateDialog").close();render();navigate("candidates");toast("Fictional candidate added only to this browser tab.");
  });
  $("jobForm").addEventListener("submit",e=>{
    e.preventDefault();
    const form=e.currentTarget,f=new FormData(form),title=String(f.get("title")||"").trim(),location=String(f.get("location")||"").trim(),clientId=String(f.get("clientId")||""),salary=Number(f.get("salary")),fee=Number(f.get("fee"));
    if(!title||!location||!state.clients.some(c=>c.id===clientId)||!Number.isFinite(salary)||salary<20000||salary>500000||!Number.isFinite(fee)||fee<1||fee>40){toast("Enter a valid fictional job and fee.");return}
    state.jobs.push({id:"sample-"+(++serial),title:title.slice(0,90),clientId,location:location.slice(0,70),salary:cap(salary),fee,openings:1});
    note("Sample job opened",title+" for "+client(clientId).name);
    form.reset();$("jobDialog").close();render();navigate("jobs");toast("New fictional job order added.");
  });
  seed("general");
  navigate("dashboard");
})();