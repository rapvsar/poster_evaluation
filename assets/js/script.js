const CANDIDATES = [{"id": 1, "family": "ALI", "first": "Raza", "year": 1}, {"id": 2, "family": "BATEBI", "first": "Danial", "year": 1}, {"id": 3, "family": "GHARAJEHDAGHI AGHAJARI", "first": "Kosar", "year": 1}, {"id": 4, "family": "MONTALBANO", "first": "Sofia", "year": 1}, {"id": 5, "family": "SAEDI", "first": "Zohreh", "year": 1}, {"id": 6, "family": "SCHUMACHER", "first": "Markus", "year": 1}, {"id": 7, "family": "VIJAYA KUMAR", "first": "Ashwin", "year": 1}, {"id": 8, "family": "DABAGHIA", "first": "Abdelhaq", "year": 1}, {"id": 9, "family": "AHMAD", "first": "Hamza", "year": 2}, {"id": 10, "family": "AKTER", "first": "Salena", "year": 2}, {"id": 11, "family": "ANIKWENWA", "first": "Ebenezer Chukwuemeka", "year": 2}, {"id": 12, "family": "AWASTHI", "first": "Lawanya", "year": 2}, {"id": 13, "family": "AYALEW", "first": "Lekidelu Asrat", "year": 2}, {"id": 14, "family": "BERNA", "first": "Tom", "year": 2}, {"id": 15, "family": "ELLOUMI", "first": "Rania", "year": 2}, {"id": 16, "family": "FAGHIH NASIRI", "first": "Elaheh", "year": 2}, {"id": 17, "family": "JABBARZADEH GHANDILOU", "first": "Milad", "year": 2}, {"id": 18, "family": "LEI", "first": "Lei", "year": 2}, {"id": 19, "family": "MAAS", "first": "Anne Birgit", "year": 2}, {"id": 20, "family": "MAROCCO", "first": "Stefano", "year": 2}, {"id": 21, "family": "MOUSAVI AVINDIN", "first": "Zahra Alsadat", "year": 2}, {"id": 22, "family": "NASSOH", "first": "Adil", "year": 2}, {"id": 23, "family": "SANTOS DANTAS", "first": "Ana Karine", "year": 2}, {"id": 24, "family": "SCHMICKRATH", "first": "Romain", "year": 2}, {"id": 25, "family": "SCHULER", "first": "Nicolas Peter", "year": 2}, {"id": 26, "family": "SCHULTE", "first": "Jan Patrick", "year": 2}, {"id": 27, "family": "SYNDIKUS", "first": "Lisa Anne", "year": 2}, {"id": 28, "family": "USUBLU", "first": "Mahammadtagi", "year": 2}, {"id": 29, "family": "WITCHALLS", "first": "Joseph Luke", "year": 2}, {"id": 30, "family": "ABIDI", "first": "Hsen", "year": 3}, {"id": 31, "family": "AHMADZADE BEIRAKI", "first": "Esmaeel", "year": 3}, {"id": 32, "family": "BALDIG", "first": "Nick", "year": 3}, {"id": 33, "family": "BERQUEDICH", "first": "Amine", "year": 3}, {"id": 34, "family": "DANESHGARI", "first": "Sonia", "year": 3}, {"id": 35, "family": "DJORDJEVIC ÉP. BÜRGER", "first": "Andrija", "year": 3}, {"id": 36, "family": "FABBRICATORE", "first": "Francesco", "year": 3}, {"id": 37, "family": "FARAJI", "first": "Pedram", "year": 3}, {"id": 38, "family": "GAMMOUDI", "first": "Hajer", "year": 3}, {"id": 39, "family": "HELTEN", "first": "Kris", "year": 3}, {"id": 40, "family": "KHRAIMECH", "first": "Sarah", "year": 3}, {"id": 41, "family": "KIRILIN", "first": "Yury", "year": 3}, {"id": 42, "family": "LOUIE ÉP. COLLIN", "first": "Monica Laisun", "year": 3}, {"id": 43, "family": "MOLAHALLI", "first": "Pranav Rajah", "year": 3}, {"id": 44, "family": "PAPOT", "first": "Vianney, Claude, Guy", "year": 3}, {"id": 45, "family": "PAULUS", "first": "Pascal", "year": 3}, {"id": 46, "family": "SABOURI", "first": "Reza", "year": 3}, {"id": 47, "family": "SILVA DE CARVALHO", "first": "Adriano", "year": 3}, {"id": 48, "family": "TALLA SIMO", "first": "Alexis Blaise", "year": 3}, {"id": 49, "family": "ABDELKARIM", "first": "Anas Yousef Hasan", "year": 4}, {"id": 50, "family": "ADEL MOHAMED ALI IBRAHIM", "first": "Alaa", "year": 4}, {"id": 51, "family": "AMINIGARAKANI", "first": "Zahra", "year": 4}, {"id": 52, "family": "BELGACEM", "first": "Heni", "year": 4}, {"id": 53, "family": "BISWAS", "first": "Sabuj Chandra", "year": 4}, {"id": 54, "family": "BRAUN", "first": "Luisa", "year": 4}, {"id": 55, "family": "DYSON", "first": "Joseph Daniel", "year": 4}, {"id": 56, "family": "HAYDER", "first": "Rabie", "year": 4}, {"id": 57, "family": "MA", "first": "Aoxiang", "year": 4}, {"id": 58, "family": "MOCK", "first": "Maximilian", "year": 4}, {"id": 59, "family": "RASTEGARPANAH", "first": "Mohammad", "year": 4}, {"id": 60, "family": "SARETZKY", "first": "Felix", "year": 4}, {"id": 61, "family": "ZANON", "first": "Riccardo", "year": 4}, {"id": 62, "family": "ZHANG", "first": "Xiao Chen", "year": 4}];

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

const ORG_PASSCODE = 'PRD2026';
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
  const card = document.createElement('div');
  card.className='year-grid';
  for(let y=1; y<=4; y++){
    const count = CANDIDATES.filter(c=>c.year===y).length;
    const btn = document.createElement('div');
    btn.className='year-btn';
    btn.innerHTML = `Year ${y}<small>${count} posters</small>`;
    btn.onclick = () => { state.year = y; state.view='candidate'; render(); };
    card.appendChild(btn);
  }
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

function renderOrgGate(app){
  topbar(app, 'Organizer access', '', () => { state.view='home'; render(); });
  const card = document.createElement('div');
  card.className='card';
  card.innerHTML = `
    <label>Passcode</label>
    <input type="password" id="passInput" placeholder="Enter organizer passcode">
    <div style="height:14px"></div>
    <button class="btn btn-primary" id="goBtn">View dashboard</button>
    <div class="footnote">This is a soft gate to keep results hidden from jury members during the event, not a security measure.</div>
  `;
  app.appendChild(card);
  document.getElementById('goBtn').onclick = () => {
    const v = document.getElementById('passInput').value;
    if(v === ORG_PASSCODE){ state.view='dashboard'; render(); }
    else alert('Incorrect passcode.');
  };
  document.getElementById('passInput').onkeydown = (e) => { if(e.key==='Enter') document.getElementById('goBtn').click(); };
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

  const refreshBtn = document.createElement('button');
  refreshBtn.className='btn btn-ghost'; refreshBtn.textContent='↻ Refresh';
  refreshBtn.style.marginBottom='16px';
  refreshBtn.onclick = () => render();
  app.appendChild(refreshBtn);

  for(let y=1; y<=4; y++){
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

  // New-event reset: wipe every submission so the platform can be reused next year.
  const clearBtn = document.createElement('button');
  clearBtn.className='btn btn-ghost';
  clearBtn.textContent='Clear all results (start a new event)';
  clearBtn.style.marginTop='10px';
  clearBtn.style.color='#b23';
  clearBtn.onclick = async () => {
    if(!(window.storage && typeof window.storage.clearAll === 'function')){
      alert('Clearing is only available when connected to the online database.');
      return;
    }
    if(!confirm('Delete ALL submissions from every jury member? This cannot be undone.\n\nExport the CSV first if you want to keep this year’s results.')) return;
    if(!confirm('Are you absolutely sure? All rankings will be reset to zero.')) return;
    clearBtn.disabled = true; clearBtn.textContent = 'Clearing…';
    try{
      await window.storage.clearAll();
      alert('All results cleared. The platform is ready for a new event.');
      render();
    }catch(e){
      clearBtn.disabled = false; clearBtn.textContent = 'Clear all results (start a new event)';
      alert('Could not clear results — please check your connection and try again.');
    }
  };
  app.appendChild(clearBtn);

  const footnote = document.createElement('div');
  footnote.className='footnote';
  footnote.textContent = "Ranking uses each candidate's average weighted score (out of 9) across all jury submissions received. Winner = top-ranked candidate per year, shown once at least one evaluation exists.";
  app.appendChild(footnote);
}

function exportCSV(agg, records){
  const rows = [['Year','Poster#','Family','First','AvgWeightedScore(/9)','NumEvaluations','Rank']];
  for(let y=1;y<=4;y++){
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

render();
