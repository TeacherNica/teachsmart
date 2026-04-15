const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
const out = [];
let i = 0;
let fixes = {orphanEarnings: false, pdfRecords: false, pdfButton: false, firstRenderEarnings: false};

while (i < lines.length) {
  const trimmed = lines[i].trim();

  // FIX 1: Remove PDF Records button from earnings header
  if (trimmed === '<button class="btn btn-primary" onclick="openUploadModal()">📁 PDF Records</button>') {
    console.log('✅ Removed PDF Records button at line ' + (i+1));
    fixes.pdfButton = true;
    i++;
    continue;
  }

  // FIX 2: Remove PDF Records List section from earnings
  if (trimmed === '<!-- PDF Records List -->') {
    console.log('✅ Removing PDF Records List section at line ' + (i+1));
    i++; // skip comment
    let depth = 0, started = false;
    while (i < lines.length) {
      const l = lines[i].trim();
      depth += (l.match(/<div/g)||[]).length - (l.match(/<\/div>/g)||[]).length;
      if (!started && l.includes('<div')) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    fixes.pdfRecords = true;
    continue;
  }

  // FIX 3: Remove the FIRST (broken) renderEarnings function at line ~1353
  // It references earn-students and top-students which don't exist in the HTML
  if (trimmed.startsWith('function renderEarnings()') && !fixes.firstRenderEarnings) {
    console.log('✅ Removed first (broken) renderEarnings at line ' + (i+1));
    // Skip entire function
    let depth = 0, started = false;
    while (i < lines.length) {
      const l = lines[i].trim();
      depth += (l.match(/\{/g)||[]).length - (l.match(/\}/g)||[]).length;
      if (!started && l.includes('{')) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    fixes.firstRenderEarnings = true;
    continue;
  }

  out.push(lines[i]);
  i++;
}

let html = out.join('\r\n');

// FIX 4: Replace the earnings page HTML with full monthly breakdown version
const oldEarningsInner = `  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:500px;">
    <div class="stat" style="padding:24px;">
      <div class="stat-icon" style="background:linear-gradient(135deg,#F3E8FF,#DDD6FE)">💰</div>
      <div class="stat-val" style="color:var(--purple)" id="earn-this-month">₱0</div>
      <div class="stat-label">Total Earned This Month</div>
    </div>
    <div class="stat" style="padding:24px;">
      <div class="stat-icon" style="background:linear-gradient(135deg,#FFF1F2,#FECDD3)">⚠️</div>
      <div class="stat-val" style="color:var(--red)" id="earn-unpaid">₱0</div>
      <div class="stat-label">Total Unpaid Amount</div>
    </div>
  </div>`;

const newEarningsInner = `  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
    <div class="stat" style="padding:24px;">
      <div class="stat-icon" style="background:linear-gradient(135deg,#F3E8FF,#DDD6FE)">💰</div>
      <div class="stat-val" style="color:var(--purple)" id="earn-this-month">₱0</div>
      <div class="stat-label">Earned This Month</div>
    </div>
    <div class="stat" style="padding:24px;">
      <div class="stat-icon" style="background:linear-gradient(135deg,#FFF1F2,#FECDD3)">⚠️</div>
      <div class="stat-val" style="color:var(--red)" id="earn-unpaid">₱0</div>
      <div class="stat-label">Total Unpaid</div>
    </div>
    <div class="stat" style="padding:24px;">
      <div class="stat-icon" style="background:linear-gradient(135deg,#F0FDF4,#DCFCE7)">📅</div>
      <div class="stat-val" style="color:#16a34a" id="earn-total-all">₱0</div>
      <div class="stat-label">All Time Earned</div>
    </div>
  </div>
  <div class="card" style="margin-top:8px;">
    <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:16px;">📅 Monthly Breakdown</div>
    <div id="earn-monthly-breakdown">
      <p style="color:#9CA3AF;font-size:0.85rem;text-align:center;padding:20px 0;">No payment records yet.<br>Add payments in the Payments tab to see your monthly earnings here.</p>
    </div>
  </div>`;

if (html.includes(oldEarningsInner)) {
  html = html.replace(oldEarningsInner, newEarningsInner);
  console.log('✅ Replaced earnings HTML with monthly breakdown version');
} else {
  console.log('⚠️  Could not replace earnings inner HTML — manual check needed');
}

// FIX 5: Replace the second renderEarnings function with full version including monthly breakdown
const oldRenderEarnings = `function renderEarnings(){
  var payments=getPayments();
  var now=new Date();
  var thisMonth=payments.filter(function(p){
    if(!p.date||p.status!=='paid') return false;
    var d=new Date(p.date);
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  });
  var totalEarned=thisMonth.reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);
  var totalUnpaid=payments.filter(function(p){return p.status==='unpaid';})
    .reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);
  var em=document.getElementById('earn-this-month');
  var eu=document.getElementById('earn-unpaid');
  if(em) em.textContent='₱'+totalEarned.toLocaleString();
  if(eu) eu.textContent='₱'+totalUnpaid.toLocaleString();
}`;

const newRenderEarnings = `function renderEarnings(){
  var payments=getPayments();
  var now=new Date();

  // This month paid
  var thisMonth=payments.filter(function(p){
    if(!p.date||p.status!=='paid') return false;
    var d=new Date(p.date);
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  });
  var totalEarned=thisMonth.reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);

  // All unpaid
  var totalUnpaid=payments.filter(function(p){return p.status==='unpaid';})
    .reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);

  // All time earned
  var totalAll=payments.filter(function(p){return p.status==='paid';})
    .reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);

  var em=document.getElementById('earn-this-month');
  var eu=document.getElementById('earn-unpaid');
  var ea=document.getElementById('earn-total-all');
  if(em) em.textContent='₱'+totalEarned.toLocaleString();
  if(eu) eu.textContent='₱'+totalUnpaid.toLocaleString();
  if(ea) ea.textContent='₱'+totalAll.toLocaleString();

  // Monthly breakdown
  var container=document.getElementById('earn-monthly-breakdown');
  if(!container) return;

  if(payments.length===0){
    container.innerHTML='<p style="color:#9CA3AF;font-size:0.85rem;text-align:center;padding:20px 0;">No payment records yet.<br>Add payments in the Payments tab to see your monthly earnings here.</p>';
    return;
  }

  // Group by month
  var months={};
  payments.forEach(function(p){
    if(!p.date) return;
    var d=new Date(p.date);
    var key=d.getFullYear()+'-'+(d.getMonth()+1);
    var label=d.toLocaleString('default',{month:'long',year:'numeric'});
    if(!months[key]) months[key]={label:label,paid:0,unpaid:0,count:0};
    months[key].count++;
    if(p.status==='paid') months[key].paid+=parseFloat(p.amount)||0;
    else months[key].unpaid+=parseFloat(p.amount)||0;
  });

  // Sort newest first
  var keys=Object.keys(months).sort().reverse();

  container.innerHTML=keys.map(function(k){
    var m=months[k];
    var isCurrentMonth = k === (now.getFullYear()+'-'+(now.getMonth()+1));
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-radius:12px;margin-bottom:8px;background:'+(isCurrentMonth?'#F5F3FF':'#F9FAFB')+';">'
      +'<div>'
        +'<div style="font-weight:700;font-size:0.9rem;color:#374151;">'+m.label+(isCurrentMonth?' <span style="font-size:10px;background:#A855F7;color:white;padding:2px 7px;border-radius:10px;margin-left:6px;">Current</span>':'')+'</div>'
        +'<div style="font-size:0.78rem;color:#9CA3AF;margin-top:2px;">'+m.count+' payment'+(m.count!==1?'s':'')+(m.unpaid>0?' · <span style="color:#EF4444;">₱'+m.unpaid.toLocaleString()+' unpaid</span>':'')+'</div>'
      +'</div>'
      +'<div style="font-family:Nunito,sans-serif;font-weight:800;font-size:1.1rem;color:'+(isCurrentMonth?'var(--purple)':'#374151')+';">₱'+m.paid.toLocaleString()+'</div>'
    +'</div>';
  }).join('');
}`;

if (html.includes(oldRenderEarnings)) {
  html = html.replace(oldRenderEarnings, newRenderEarnings);
  console.log('✅ Replaced renderEarnings with monthly breakdown version');
} else {
  // Try matching just the function signature area since whitespace may differ
  console.log('⚠️  Exact renderEarnings match failed — trying to append updated version...');
  // Find and replace from function signature
  const sigIdx = html.indexOf('function renderEarnings(){');
  if (sigIdx !== -1) {
    // Find end of function
    let depth=0, started=false, j=sigIdx;
    while(j<html.length){
      if(html[j]==='{'){depth++;started=true;}
      if(html[j]==='}'){depth--;}
      j++;
      if(started&&depth===0) break;
    }
    html = html.slice(0,sigIdx) + newRenderEarnings + html.slice(j);
    console.log('✅ Replaced renderEarnings via fallback method');
  }
}

// FIX 6: Remove renderPDFRecords() call from showPage
html = html.replace('if(page===\'earnings\'){renderEarnings();renderPDFRecords();}',
                    'if(page===\'earnings\'){renderEarnings();}');
html = html.replace('if(page==="earnings"){renderEarnings();renderPDFRecords();}',
                    'if(page==="earnings"){renderEarnings();}');
console.log('✅ Removed renderPDFRecords() call from showPage');

// Verify
const renderCount = (html.match(/function renderEarnings/g)||[]).length;
const pdfListCount = (html.match(/pdf-records-list/g)||[]).length;
const monthlyDiv = html.includes('earn-monthly-breakdown');
console.log('\n📊 renderEarnings functions: ' + renderCount + ' (should be 1)');
console.log('📊 pdf-records-list remaining: ' + pdfListCount + ' (should be 0)');
console.log('📊 Monthly breakdown div present: ' + monthlyDiv + ' (should be true)');

fs.writeFileSync('index.html', html, 'utf8');
console.log('\n✅ index.html saved. done: true');
