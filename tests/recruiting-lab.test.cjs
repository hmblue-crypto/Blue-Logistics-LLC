const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root,name),"utf8");
test("recruiting demo files exist and JavaScript parses",()=>{
  assert.doesNotThrow(()=>new vm.Script(read("recruiting-lab.js")));
  assert.match(read("recruiting-lab.css"),/\.pipeline\{/);
});
test("isolated route loads only original same-origin script and stylesheet",()=>{
  const html=read("recruiting-lab.html");
  assert.match(html,/<script defer src="recruiting-lab\.js"><\/script>/);
  assert.match(html,/href="recruiting-lab\.css"/);
  assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
  assert.doesNotMatch(html,/<(?:iframe|form)\b[^>]*\baction=/i);
});
test("demo-only functionality and six-stage candidate pipeline",()=>{
  const js=read("recruiting-lab.js");
  for(const stage of ["Sourced","Screened","Submitted","Interview","Offer","Placed"]){
    assert.ok(js.includes(stage),"Missing stage "+stage);
  }
  for(const feature of ["renderCandidates","renderRevenue","exportDemo","resetDemo","scenarioSelect","candidateForm","jobForm"]){
    assert.ok(js.includes(feature),"Missing feature "+feature);
  }
});
test("no production data, network APIs or fake payment integration",()=>{
  const js=read("recruiting-lab.js");
  assert.doesNotMatch(js,/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|\blocalStorage\b|\bsessionStorage\b|\bsupabase\b|\bstripe\b/i);
  assert.match(read("recruiting-lab.html"),/Every person, company, opening, fee and activity shown here is invented/);
});
