// The candidate list is NOT hardcoded. The organizer uploads it as a CSV/Excel
// file on the dashboard ("Start new event"); it is saved to the shared database
// and loaded on every device at startup. It stays empty until then.
let CANDIDATES = [];

const RUBRIC = [
  {key:'intro', label:'Introduction, objectives, hypothesis, methods & scientific rigour', weight:0.35,
   bands:[
     {range:'6–9', tone:'Strong', text:"Background clearly described and aligned with the poster's scientific content. Hypotheses/objectives clearly stated. Methods clearly explained; research is scientifically rigorous."},
     {range:'3–6', tone:'Partial', text:'Background partly described, not fully aligned with the content. Hypotheses/objectives stated but unclear. Method explanation present but rigour only partly conveyed.'},
     {range:'1–3', tone:'Weak', text:'Background missing or disjointed from the scientific content. Hypotheses/objectives unclear or omitted. Unclear how the research was/will be conducted.'}
   ]},
  {key:'results', label:'Results and significance', weight:0.15,
   bands:[
     {range:'6–9', tone:'Strong', text:'(Potential) results clearly stated and their significance is clear.'},
     {range:'3–6', tone:'Partial', text:'Results stated but significance remains unclear.'},
     {range:'1–3', tone:'Weak', text:'Results only somewhat stated; not clear why they matter.'}
   ]},
  {key:'appearance', label:'Appearance, legibility & correctness', weight:0.25,
   bands:[
     {range:'6–9', tone:'Strong', text:'Professional, aesthetically pleasing, few/no English mistakes, fully self-explanatory. Figures purposeful and captioned. Legible from 1.5–2m.'},
     {range:'3–6', tone:'Partial', text:'Somewhat professional but sloppy, with some English mistakes. Followable without explanation. Some figures/captions too small or uncaptioned.'},
     {range:'1–3', tone:'Weak', text:'Not professional, severe English mistakes, needs explanation. Figures unmotivated; text/figures illegible.'}
   ]},
  {key:'flow', label:'Organizational flow', weight:0.15,
   bands:[
     {range:'6–9', tone:'Strong', text:'Fundamental points clearly identified, little redundancy, all information in a logical order.'},
     {range:'3–6', tone:'Partial', text:'Fundamental points somewhat identified; information mostly in a logical order.'},
     {range:'1–3', tone:'Weak', text:'Fundamental points unclear; information appears unorganized.'}
   ]},
  {key:'qa', label:'Knowledge and answering questions', weight:0.10,
   bands:[
     {range:'6–9', tone:'Strong', text:'Thorough, critical understanding of the subject; answers technical questions confidently.'},
     {range:'3–6', tone:'Partial', text:'Understands the subject and can partly answer technical questions.'},
     {range:'1–3', tone:'Weak', text:'Lacks thorough/critical understanding; avoids answering technical questions.'}
   ]}
];

// The organizer password is NOT stored in this code. It is set by the organizer
// at runtime and kept in the shared database as a salted SHA-256 hash (see the
// helpers below and renderOrgGate). Change it any time from the dashboard.
const LOCAL_STORAGE_NAMESPACE = 'poster-evaluation:';

let state = { view:'home' };
let juryScoresDraft = {};

function slug(s){ return s.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'jury'; }
function fullName(c){ return `${c.family}, ${c.first}`; }
function weightedTotal(scores){
  let t = 0;
  RUBRIC.forEach(r => t += (scores[r.key]||1) * r.weight);
  return t;
}
function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

async function getJuryRecord(juryKey){
  try{
    if(window.storage && typeof window.storage.get === 'function'){
      const res = await window.storage.get(juryKey, true);
      return res ? JSON.parse(res.value) : null;
    }
    const value = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE + juryKey);
    return value ? JSON.parse(value) : null;
  }catch(e){ return null; }
}
async function saveJuryRecord(juryKey, record){
  try{
    if(window.storage && typeof window.storage.set === 'function'){
      const res = await window.storage.set(juryKey, JSON.stringify(record), true);
      return !!res;
    }
    window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE + juryKey, JSON.stringify(record));
    return true;
  }catch(e){ return false; }
}
async function listJuryKeys(){
  try{
    if(window.storage && typeof window.storage.list === 'function'){
      const res = await window.storage.list('jury:', true);
      return res ? res.keys : [];
    }
    const prefix = LOCAL_STORAGE_NAMESPACE + 'jury:';
    const keys = [];
    for(let i = 0; i < window.localStorage.length; i++){
      const key = window.localStorage.key(i);
      if(key && key.startsWith(prefix)){
        keys.push(key.slice(LOCAL_STORAGE_NAMESPACE.length));
      }
    }
    return keys;
  }catch(e){ return []; }
}

// ---- Candidate roster (organizer-uploaded CSV/Excel) ----
async function loadCandidateList(){
  try{
    if(window.storage && typeof window.storage.get === 'function'){
      const res = await window.storage.get('candidates', true);
      return res && res.value ? JSON.parse(res.value) : null;
    }
    const v = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE + 'candidates');
    return v ? JSON.parse(v) : null;
  }catch(e){ return null; }
}
async function saveCandidateList(list){
  const value = JSON.stringify(list);
  try{
    if(window.storage && typeof window.storage.set === 'function'){
      return !!(await window.storage.set('candidates', value, true));
    }
    window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE + 'candidates', value);
    return true;
  }catch(e){ return false; }
}

// Turn spreadsheet rows into {id, family, first, year}. Column names are matched
// flexibly (case/spacing/punctuation-insensitive) so the organizer doesn't have
// to format the header exactly.
function normalizeRoster(rows){
  const norm = s => String(s).trim().toLowerCase().replace(/[^a-z0-9]/g,'');
  const pick = (obj, names) => { for(const n of names){ if(obj[n]!==undefined && obj[n]!=='') return obj[n]; } return undefined; };
  const out = [];
  rows.forEach(r => {
    const o = {};
    Object.keys(r).forEach(k => { o[norm(k)] = r[k]; });
    const idRaw    = pick(o, ['id','posternumber','poster','number','no']);
    const family   = pick(o, ['familyname','family','lastname','surname','last']);
    const first    = pick(o, ['firstname','first','givenname','given','name']);
    const yearRaw  = pick(o, ['year','phdyear','yr']);
    const id = parseInt(idRaw, 10);
    const year = parseInt(yearRaw, 10);
    if(!Number.isFinite(id) || family === undefined) return; // skip rows without an ID or family name
    out.push({
      id,
      family: String(family).trim(),
      first: String(first || '').trim(),
      year: Number.isFinite(year) ? year : 1
    });
  });
  return out;
}

function parseCandidatesFile(file){
  return new Promise((resolve, reject) => {
    if(typeof XLSX === 'undefined'){
      reject(new Error('spreadsheet reader failed to load (check your internet connection)'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try{
        const wb = XLSX.read(new Uint8Array(e.target.result), {type:'array'});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, {defval:''});
        resolve(normalizeRoster(rows));
      }catch(err){ reject(err); }
    };
    reader.onerror = () => reject(new Error('could not read the file'));
    reader.readAsArrayBuffer(file);
  });
}

function downloadRosterTemplate(){
  const rows = [
    ['ID','Family name','First name','Year'],
    [1,'SMITH','Alex',1],
    [2,'GARCIA','Maria',1],
    [3,'CHEN','Wei',2]
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join(String.fromCharCode(10));
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'candidate_list_template.csv';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// ---- Organizer password (hashed, stored in the shared DB — never in this code) ----
function randHex(nBytes){
  const a = new Uint8Array(nBytes);
  crypto.getRandomValues(a);
  return [...a].map(b => b.toString(16).padStart(2,'0')).join('');
}
async function hashPass(pass, salt){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + '::' + pass));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,'0')).join('');
}
async function loadOrgConfig(){
  try{
    if(window.storage && typeof window.storage.get === 'function'){
      const res = await window.storage.get('config:orgpass', true);
      return res && res.value ? JSON.parse(res.value) : null;
    }
    const v = window.localStorage.getItem(LOCAL_STORAGE_NAMESPACE + 'config:orgpass');
    return v ? JSON.parse(v) : null;
  }catch(e){ return null; }
}
async function saveOrgConfig(cfg){
  const value = JSON.stringify(cfg);
  try{
    if(window.storage && typeof window.storage.set === 'function'){
      return !!(await window.storage.set('config:orgpass', value, true));
    }
    window.localStorage.setItem(LOCAL_STORAGE_NAMESPACE + 'config:orgpass', value);
    return true;
  }catch(e){ return false; }
}

function render(){
  const app = document.getElementById('app');
  app.innerHTML = '';
  if(state.view==='home') return renderHome(app);
  if(state.view==='juryName') return renderJuryName(app);
  if(state.view==='year') return renderYear(app);
  if(state.view==='candidate') return renderCandidateList(app);
  if(state.view==='score') return renderScore(app);
  if(state.view==='submitted') return renderSubmitted(app);
  if(state.view==='orgGate') return renderOrgGate(app);
  if(state.view==='dashboard') return renderDashboard(app);
}

function topbar(app, title, sub, onBack){
  const bar = document.createElement('div');
  bar.className='topbar';
  bar.innerHTML = `
    <div class="brand">
      <span class="eyebrow">PhD Research Day</span>
      <h1>${title}</h1>
      ${sub ? `<div style="font-size:13px;color:var(--ink-soft);margin-top:2px;">${sub}</div>` : ''}
    </div>
  `;
  if(onBack){
    const b = document.createElement('button');
    b.className='backbtn'; b.textContent='← Back';
    b.onclick = onBack;
    bar.appendChild(b);
  }
  app.appendChild(bar);
}

function renderHome(app){
  topbar(app, 'Poster Evaluation');
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="card role-card" id="juryCard">
      <div class="role-icon">★</div>
      <h2>I'm a jury member</h2>
      <p>Score the poster you're standing in front of, in a few taps.</p>
    </div>
    <div class="card role-card" id="orgCard">
      <div class="role-icon">Σ</div>
      <h2>Organizer dashboard</h2>
      <p>View live rankings and identify the 4 winners.</p>
    </div>
    <div class="footnote">Each jury member enters their name once and can evaluate as many posters as needed. Scores are saved to the shared online database.</div>
  `;
  app.appendChild(wrap);
  document.getElementById('juryCard').onclick = () => { state.view='juryName'; render(); };
  document.getElementById('orgCard').onclick = () => { state.view='orgGate'; render(); };
}

function renderJuryName(app){
  topbar(app, 'Your name', 'Enter your name once — you can rate multiple posters', () => { state.view='home'; render(); });
  const card = document.createElement('div');
  card.className='card';
  card.innerHTML = `
    <label>Jury member name</label>
    <input type="text" id="juryInput" placeholder="e.g. Prof. Anna Weber" value="${esc(state.juryName||'')}">
    <div style="height:14px"></div>
    <button class="btn btn-primary" id="continueBtn" disabled>Continue</button>
  `;
  app.appendChild(card);
  const input = document.getElementById('juryInput');
  const btn = document.getElementById('continueBtn');
  const check = () => { btn.disabled = input.value.trim().length < 2; };
  input.oninput = check; check();
  input.focus();
  btn.onclick = () => {
    state.juryName = input.value.trim();
    state.juryKey = 'jury:' + slug(state.juryName);
    state.view='year';
    render();
  };
}

function renderYear(app){
  topbar(app, 'Choose a year', `Jury: ${esc(state.juryName)}`, () => { state.view='home'; render(); });
  if(!CANDIDATES.length){
    const empty = document.createElement('div');
    empty.className='card';
    empty.style.textAlign='center';
    empty.innerHTML = `
      <div style="font-size:34px;margin-bottom:6px;">🗒️</div>
      <h2 style="font-size:18px;margin-bottom:6px;">No posters yet</h2>
      <p style="color:var(--ink-soft);font-size:14.5px;">The candidate list hasn't been uploaded yet. Please ask the organizer to start the event, then try again.</p>
    `;
    app.appendChild(empty);
    return;
  }
  const card = document.createElement('div');
  card.className='year-grid';
  const years = [...new Set(CANDIDATES.map(c=>c.year))].sort((a,b)=>a-b);
  years.forEach(y => {
    const count = CANDIDATES.filter(c=>c.year===y).length;
    const btn = document.createElement('div');
    btn.className='year-btn';
    btn.innerHTML = `Year ${y}<small>${count} posters</small>`;
    btn.onclick = () => { state.year = y; state.view='candidate'; render(); };
    card.appendChild(btn);
  });
  app.appendChild(card);
}

async function renderCandidateList(app){
  topbar(app, `Year ${state.year} posters`, `Jury: ${esc(state.juryName)}`, () => { state.view='year'; render(); });
  const record = await getJuryRecord(state.juryKey) || {evaluations:{}};
  state._myRecord = record;

  const search = document.createElement('div');
  search.className='search-box';
  search.innerHTML = `<input type="text" id="searchInput" placeholder="Search by name or poster number">`;
  app.appendChild(search);

  const listWrap = document.createElement('div');
  listWrap.className='candidate-list';
  app.appendChild(listWrap);

  function draw(filter){
    const f = (filter||'').toLowerCase();
    const items = CANDIDATES.filter(c => c.year===state.year && (
      !f || fullName(c).toLowerCase().includes(f) || String(c.id).includes(f)
    ));
    listWrap.innerHTML = '';
    if(items.length===0){
      listWrap.innerHTML = `<div class="empty-state">No posters match your search.</div>`;
      return;
    }
    items.forEach(c => {
      const row = document.createElement('div');
      row.className='candidate-row';
      const done = record.evaluations && record.evaluations[c.id];
      row.innerHTML = `
        <div class="poster-num">${c.id}</div>
        <div class="name"><b>${esc(c.family)}</b>, ${esc(c.first)}</div>
        ${done ? '<div class="scored-badge">Scored</div>' : ''}
      `;
      row.onclick = () => {
        state.candidate = c;
        const existing = record.evaluations && record.evaluations[c.id];
        juryScoresDraft = existing ? {...existing.scores} : {intro:5, results:5, appearance:5, flow:5, qa:5};
        state.view='score';
        render();
      };
      listWrap.appendChild(row);
    });
  }
  draw('');
  document.getElementById('searchInput').oninput = (e) => draw(e.target.value);
}

function renderScore(app){
  const c = state.candidate;
  topbar(app, 'Score this poster', `Jury: ${esc(state.juryName)}`, () => { state.view='candidate'; render(); });

  const header = document.createElement('div');
  header.className='card';
  header.innerHTML = `
    <div class="poster-header">
      <div class="poster-num">${c.id}</div>
      <div>
        <h2>${esc(c.family)}, ${esc(c.first)}</h2>
        <div class="sub">Year ${c.year} · Poster #${c.id}</div>
      </div>
    </div>
  `;
  app.appendChild(header);

  const critsCard = document.createElement('div');
  critsCard.className='card';
  RUBRIC.forEach(r => {
    const block = document.createElement('div');
    block.className='crit-block';
    block.innerHTML = `
      <div class="crit-top">
        <span class="crit-title">${r.label}</span>
        <span class="crit-weight">${Math.round(r.weight*100)}%</span>
      </div>
      <div class="score-readout">
        <span>1 = weak</span>
        <span class="score-val" id="val-${r.key}">${juryScoresDraft[r.key]}</span>
        <span>9 = strong</span>
      </div>
      <input type="range" min="1" max="9" step="1" value="${juryScoresDraft[r.key]}" id="slider-${r.key}">
      <div class="guide-toggle" id="toggle-${r.key}">Show scoring guide ▾</div>
      <div class="guide-body" id="guide-${r.key}">
        ${r.bands.map(b => `<div><b>${b.range} (${b.tone}):</b> ${b.text}</div>`).join('')}
      </div>
    `;
    critsCard.appendChild(block);
  });
  app.appendChild(critsCard);

  RUBRIC.forEach(r => {
    const slider = document.getElementById(`slider-${r.key}`);
    const val = document.getElementById(`val-${r.key}`);
    slider.oninput = () => {
      juryScoresDraft[r.key] = parseInt(slider.value,10);
      val.textContent = slider.value;
      updateTotal();
    };
    document.getElementById(`toggle-${r.key}`).onclick = (e) => {
      const g = document.getElementById(`guide-${r.key}`);
      g.classList.toggle('open');
      e.target.textContent = g.classList.contains('open') ? 'Hide scoring guide ▴' : 'Show scoring guide ▾';
    };
  });

  const sticky = document.createElement('div');
  sticky.className='sticky-bottom';
  sticky.innerHTML = `
    <div class="sticky-inner">
      <div class="total-preview">
        <span>Weighted score</span>
        <b id="totalPreview">${weightedTotal(juryScoresDraft).toFixed(2)} / 9</b>
      </div>
      <button class="btn btn-primary" id="submitBtn">Submit evaluation</button>
    </div>
  `;
  app.appendChild(sticky);

  function updateTotal(){
    document.getElementById('totalPreview').textContent = weightedTotal(juryScoresDraft).toFixed(2) + ' / 9';
  }

  document.getElementById('submitBtn').onclick = async () => {
    const btn = document.getElementById('submitBtn');
    btn.disabled = true; btn.textContent = 'Saving…';
    const record = await getJuryRecord(state.juryKey) || {juryName: state.juryName, evaluations:{}};
    record.juryName = state.juryName;
    record.evaluations = record.evaluations || {};
    record.evaluations[c.id] = {
      scores: {...juryScoresDraft},
      weightedTotal: weightedTotal(juryScoresDraft),
      candidateFamily: c.family,
      candidateFirst: c.first,
      year: c.year,
      timestamp: new Date().toISOString()
    };
    const ok = await saveJuryRecord(state.juryKey, record);
    if(ok){
      state.view='submitted';
      render();
    }else{
      btn.disabled = false; btn.textContent = 'Submit evaluation';
      alert('Could not save — please allow browser storage and try again.');
    }
  };
}

function renderSubmitted(app){
  const c = state.candidate;
  topbar(app, 'Saved');
  const card = document.createElement('div');
  card.className='card';
  card.style.textAlign='center';
  card.innerHTML = `
    <div style="font-size:38px;margin-bottom:6px;">✓</div>
    <h2 style="font-size:19px;margin-bottom:6px;">Evaluation recorded</h2>
    <p style="color:var(--ink-soft);font-size:14.5px;">Poster #${c.id} — ${esc(c.family)}, ${esc(c.first)}</p>
  `;
  app.appendChild(card);
  const btn1 = document.createElement('button');
  btn1.className='btn btn-primary'; btn1.textContent='Score another poster (same year)';
  btn1.style.marginBottom='10px';
  btn1.onclick = () => { state.view='candidate'; render(); };
  const btn2 = document.createElement('button');
  btn2.className='btn btn-ghost'; btn2.textContent='Choose a different year';
  btn2.onclick = () => { state.view='year'; render(); };
  app.appendChild(btn1);
  app.appendChild(btn2);
}

async function renderOrgGate(app){
  topbar(app, 'Organizer access', '', () => { state.view='home'; render(); });
  const card = document.createElement('div');
  card.className='card';
  card.innerHTML = `<div class="empty-state">Checking…</div>`;
  app.appendChild(card);

  const cfg = await loadOrgConfig();

  // First-time setup: no organizer password exists yet.
  if(!cfg){
    card.innerHTML = `
      <label>Create an organizer password</label>
      <p style="color:var(--ink-soft);font-size:13px;margin:4px 0 10px;">No organizer password is set yet. Create one now — it works on every device, and you can change it later from the dashboard.</p>
      <input type="password" id="passInput" placeholder="New password (min 4 characters)">
      <div style="height:10px"></div>
      <input type="password" id="passConfirm" placeholder="Confirm password">
      <div style="height:14px"></div>
      <button class="btn btn-primary" id="goBtn">Set password &amp; continue</button>
      <div class="footnote">Set this right after deploying, before sharing the link, so only you control dashboard access.</div>
    `;
    document.getElementById('goBtn').onclick = async () => {
      const p1 = document.getElementById('passInput').value;
      const p2 = document.getElementById('passConfirm').value;
      if(p1.length < 4){ alert('Please use at least 4 characters.'); return; }
      if(p1 !== p2){ alert('The two passwords do not match.'); return; }
      const btn = document.getElementById('goBtn'); btn.disabled = true; btn.textContent = 'Saving…';
      const salt = randHex(16);
      const hash = await hashPass(p1, salt);
      const ok = await saveOrgConfig({ salt, hash });
      if(ok){ state.view='dashboard'; render(); }
      else { btn.disabled = false; btn.textContent = 'Set password & continue'; alert('Could not save the password — check your connection and try again.'); }
    };
    document.getElementById('passInput').focus();
    return;
  }

  // Normal gate: verify the entered password against the stored hash.
  card.innerHTML = `
    <label>Organizer password</label>
    <input type="password" id="passInput" placeholder="Enter organizer password">
    <div style="height:14px"></div>
    <button class="btn btn-primary" id="goBtn">View dashboard</button>
    <div class="footnote">Keeps results hidden from jury members during the event.</div>
  `;
  const verify = async () => {
    const btn = document.getElementById('goBtn'); btn.disabled = true; btn.textContent = 'Checking…';
    const v = document.getElementById('passInput').value;
    const hash = await hashPass(v, cfg.salt);
    if(hash === cfg.hash){ state.view='dashboard'; render(); }
    else { btn.disabled = false; btn.textContent = 'View dashboard'; alert('Incorrect password.'); }
  };
  document.getElementById('goBtn').onclick = verify;
  document.getElementById('passInput').onkeydown = (e) => { if(e.key==='Enter') verify(); };
  document.getElementById('passInput').focus();
}

async function renderDashboard(app){
  topbar(app, 'Live rankings', 'Submissions stored in the shared online database', () => { state.view='home'; render(); });

  const loading = document.createElement('div');
  loading.className='empty-state';
  loading.textContent = 'Loading submissions…';
  app.appendChild(loading);

  const keys = await listJuryKeys();
  const records = [];
  for(const k of keys){
    const rec = await getJuryRecord(k);
    if(rec) records.push(rec);
  }
  loading.remove();

  // Aggregate: candidateId -> {sumWeighted, count, perCriterion sums}
  const agg = {};
  CANDIDATES.forEach(c => { agg[c.id] = {candidate:c, sum:0, count:0}; });
  let totalSubmissions = 0;
  records.forEach(rec => {
    Object.entries(rec.evaluations||{}).forEach(([cid, ev]) => {
      if(agg[cid]){
        agg[cid].sum += ev.weightedTotal;
        agg[cid].count += 1;
        totalSubmissions++;
      }
    });
  });

  const stat = document.createElement('div');
  stat.className='stat-row';
  stat.innerHTML = `
    <div class="stat-box"><div class="num">${keys.length}</div><div class="lbl">Jury members</div></div>
    <div class="stat-box"><div class="num">${totalSubmissions}</div><div class="lbl">Evaluations</div></div>
    <div class="stat-box"><div class="num">${CANDIDATES.length}</div><div class="lbl">Posters</div></div>
  `;
  app.appendChild(stat);

  // ---- Start new event (upload roster + clear previous scores, in one flow) ----
  const eventCard = document.createElement('div');
  eventCard.className='card';
  eventCard.innerHTML = `
    <h3 style="font-size:16px;margin-bottom:6px;">Candidate list &amp; new event</h3>
    <p style="color:var(--ink-soft);font-size:13.5px;margin-bottom:6px;">
      <b>${CANDIDATES.length}</b> students currently loaded.
    </p>
    <p style="color:var(--ink-soft);font-size:13.5px;margin-bottom:12px;">
      <b>Start new event</b> uploads this year's participant list (CSV or Excel with
      <b>ID, Family name, First name, Year</b>) and clears the previous event's scores — in one step.
    </p>
    <input type="file" id="rosterFile" accept=".csv,.xlsx,.xls" style="display:none">
    <button class="btn btn-gold" id="startEventBtn">Start new event</button>
    <button class="btn btn-ghost" id="templateBtn" style="margin-top:10px;">Download template CSV</button>
    <div id="rosterMsg" style="font-size:13px;margin-top:10px;color:var(--ink-soft);"></div>
  `;
  app.appendChild(eventCard);

  const rosterInput = eventCard.querySelector('#rosterFile');
  const rosterMsg = eventCard.querySelector('#rosterMsg');
  eventCard.querySelector('#templateBtn').onclick = downloadRosterTemplate;

  // Step 1 — kept synchronous so the browser keeps the user-gesture needed to
  // open the CSV download and the file picker.
  eventCard.querySelector('#startEventBtn').onclick = () => {
    if(totalSubmissions > 0){
      if(confirm(`There are ${totalSubmissions} evaluation(s) from the current event.\n\nDownload them as a CSV backup before starting the new event? (recommended)`)){
        exportCSV(agg, records);
      }
    }
    rosterMsg.style.color = 'var(--ink-soft)';
    rosterMsg.textContent = 'Choose the participant file…';
    rosterInput.value = '';
    rosterInput.click();
  };

  // Step 2 — file chosen: parse, confirm, then save roster + clear old scores.
  rosterInput.onchange = async (e) => {
    const file = e.target.files[0];
    if(!file){ rosterMsg.textContent = ''; return; }
    rosterMsg.style.color = 'var(--ink-soft)';
    rosterMsg.textContent = 'Reading file…';

    let list;
    try{ list = await parseCandidatesFile(file); }
    catch(err){
      rosterMsg.style.color = '#b23';
      rosterMsg.textContent = 'Could not read the file: ' + (err && err.message ? err.message : 'unknown error');
      return;
    }
    if(!list.length){
      rosterMsg.style.color = '#b23';
      rosterMsg.textContent = 'No valid rows found. Columns needed: ID, Family name, First name, Year.';
      return;
    }

    const ids = list.map(c=>c.id);
    const dupes = [...new Set(ids.filter((v,i)=>ids.indexOf(v)!==i))];
    const byYear = {};
    list.forEach(c => { byYear[c.year] = (byYear[c.year]||0)+1; });
    const summary = Object.keys(byYear).sort((a,b)=>a-b).map(y=>`Year ${y}: ${byYear[y]}`).join(', ');
    const dupeWarn = dupes.length ? `\n\n⚠ Duplicate poster IDs: ${dupes.join(', ')} — each poster should have a unique ID.` : '';
    const scoreWarn = totalSubmissions > 0 ? `\n\nThis will DELETE all ${totalSubmissions} current score(s).` : '';
    if(!confirm(`Start a new event with ${list.length} students?\n\n${summary}${dupeWarn}${scoreWarn}\n\nThis cannot be undone.`)){
      rosterMsg.textContent = 'Cancelled.';
      return;
    }

    rosterMsg.textContent = 'Setting up…';
    const saved = await saveCandidateList(list);
    if(!saved){
      rosterMsg.style.color = '#b23';
      rosterMsg.textContent = 'Could not save the new list — check your connection and try again.';
      return;
    }
    if(window.storage && typeof window.storage.clearAll === 'function'){
      try{ await window.storage.clearAll(); }
      catch(err){
        CANDIDATES = list;
        alert('The new list was saved, but the old scores could not be cleared automatically. Please try "Start new event" again.');
        render();
        return;
      }
    }
    CANDIDATES = list;
    alert(`New event ready — ${list.length} students loaded and previous scores cleared.`);
    render();
  };

  const refreshBtn = document.createElement('button');
  refreshBtn.className='btn btn-ghost'; refreshBtn.textContent='↻ Refresh';
  refreshBtn.style.marginBottom='16px';
  refreshBtn.onclick = () => render();
  app.appendChild(refreshBtn);

  const dashYears = [...new Set(CANDIDATES.map(c=>c.year))].sort((a,b)=>a-b);
  for(const y of dashYears){
    const rows = Object.values(agg).filter(a => a.candidate.year===y)
      .map(a => ({...a, avg: a.count ? a.sum/a.count : null}))
      .sort((a,b) => (b.avg??-1) - (a.avg??-1));

    const yearCard = document.createElement('div');
    yearCard.className='card';
    let tableRows = rows.map((r,i) => `
      <tr class="${i===0 && r.count>0 ? 'winner':''}">
        <td>${i===0 && r.count>0 ? '<span class="medal">🏅</span>' : ''}${i+1}</td>
        <td>#${r.candidate.id}</td>
        <td>${esc(r.candidate.family)}, ${esc(r.candidate.first)}</td>
        <td>${r.avg!==null ? r.avg.toFixed(2) : '—'}</td>
        <td>${r.count}</td>
      </tr>
    `).join('');
    yearCard.innerHTML = `
      <h3 style="font-size:16px;margin-bottom:10px;">Year ${y} ${rows[0] && rows[0].count>0 ? `— Winner: ${esc(rows[0].candidate.family)}, ${esc(rows[0].candidate.first)}` : ''}</h3>
      <table>
        <thead><tr><th>Rank</th><th>#</th><th>Candidate</th><th>Score /9</th><th>Evals</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
    app.appendChild(yearCard);
  }

  const logCard = document.createElement('details');
  logCard.className='log';
  const logRows = [];
  records.forEach(rec => {
    Object.entries(rec.evaluations||{}).forEach(([cid, ev]) => {
      logRows.push(`<tr><td>${esc(rec.juryName)}</td><td>#${cid}</td><td>${esc(ev.candidateFamily)}, ${esc(ev.candidateFirst)}</td><td>${ev.weightedTotal.toFixed(2)}</td><td>${new Date(ev.timestamp).toLocaleString()}</td></tr>`);
    });
  });
  logCard.innerHTML = `
    <summary>Submission log (${logRows.length}) — for audit</summary>
    <div class="card" style="margin-top:8px;overflow-x:auto;">
      <table>
        <thead><tr><th>Jury</th><th>#</th><th>Candidate</th><th>Score</th><th>When</th></tr></thead>
        <tbody>${logRows.join('') || '<tr><td colspan="5">No submissions yet.</td></tr>'}</tbody>
      </table>
    </div>
  `;
  app.appendChild(logCard);

  const exportBtn = document.createElement('button');
  exportBtn.className='btn btn-gold';
  exportBtn.textContent='Export results as CSV';
  exportBtn.style.marginTop='16px';
  exportBtn.onclick = () => exportCSV(agg, records);
  app.appendChild(exportBtn);

  // Change the organizer password (stored hashed in the shared DB).
  const pwBtn = document.createElement('button');
  pwBtn.className='btn btn-ghost';
  pwBtn.textContent='Change organizer password';
  pwBtn.style.marginTop='10px';
  pwBtn.onclick = async () => {
    const cfg = await loadOrgConfig();
    if(cfg){
      const cur = prompt('Enter the CURRENT organizer password:');
      if(cur === null) return;
      const curHash = await hashPass(cur, cfg.salt);
      if(curHash !== cfg.hash){ alert('Current password is incorrect.'); return; }
    }
    const p1 = prompt('Enter the NEW organizer password (min 4 characters):');
    if(p1 === null) return;
    if(p1.length < 4){ alert('Please use at least 4 characters.'); return; }
    const p2 = prompt('Confirm the new password:');
    if(p2 === null) return;
    if(p1 !== p2){ alert('The two passwords do not match.'); return; }
    const salt = randHex(16);
    const hash = await hashPass(p1, salt);
    const ok = await saveOrgConfig({ salt, hash });
    alert(ok ? 'Organizer password updated. Use it next time you open the dashboard.' : 'Could not update the password — check your connection and try again.');
  };
  app.appendChild(pwBtn);

  const footnote = document.createElement('div');
  footnote.className='footnote';
  footnote.textContent = "Ranking uses each candidate's average weighted score (out of 9) across all jury submissions received. Winner = top-ranked candidate per year, shown once at least one evaluation exists.";
  app.appendChild(footnote);
}

function exportCSV(agg, records){
  const rows = [['Year','Poster#','Family','First','AvgWeightedScore(/9)','NumEvaluations','Rank']];
  const years = [...new Set(CANDIDATES.map(c=>c.year))].sort((a,b)=>a-b);
  for(const y of years){
    const list = Object.values(agg).filter(a=>a.candidate.year===y)
      .map(a=>({...a, avg: a.count ? a.sum/a.count : null}))
      .sort((a,b)=>(b.avg??-1)-(a.avg??-1));
    list.forEach((r,i)=>{
      rows.push([y, r.candidate.id, r.candidate.family, r.candidate.first, r.avg!==null?r.avg.toFixed(2):'', r.count, i+1]);
    });
  }
  rows.push([]);
  rows.push(['--- Submission log ---']);
  rows.push(['Jury','Poster#','Family','First','Score','Timestamp']);
  records.forEach(rec=>{
    Object.entries(rec.evaluations||{}).forEach(([cid,ev])=>{
      rows.push([rec.juryName, cid, ev.candidateFamily, ev.candidateFirst, ev.weightedTotal.toFixed(2), ev.timestamp]);
    });
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join(String.fromCharCode(10));
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'poster_evaluation_results.csv';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

async function init(){
  const saved = await loadCandidateList();
  if(Array.isArray(saved) && saved.length) CANDIDATES = saved;
  render();
}
init();
