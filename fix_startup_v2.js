// fix_startup_v2.js — node fix_startup_v2.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// Find the INIT comment line and closing })();
let initLine = -1, iifeEnd = -1;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].replace(/\r/, '').trim();
  if (l === '// \u2500\u2500\u2500 INIT \u2500\u2500\u2500' || l === '// ─── INIT ───') initLine = i;
  if (initLine !== -1 && i > initLine && l === '})();') { iifeEnd = i; break; }
}

console.log(`INIT at line ${initLine + 1}, IIFE ends at line ${iifeEnd + 1}`);
if (initLine === -1 || iifeEnd === -1) { console.log('ERROR: could not find block'); process.exit(1); }

// The nav items use:  onclick="nav('dashboard',this)"
// So we match by iterating nav-items and checking onclick attribute — 
// NO querySelector with dynamic strings (that's what kept breaking).
// Instead we use a loop approach that is bulletproof.

const newBlock = [
"// \u2500\u2500\u2500 INIT \u2500\u2500\u2500",
"(function(){",
"  var lastPage = localStorage.getItem('ts-last-page') || 'dashboard';",
"  // Find the matching nav button by looping (avoids querySelector quote issues)",
"  var navBtn = null;",
"  document.querySelectorAll('.nav-item').forEach(function(el){",
"    var oc = el.getAttribute('onclick') || '';",
"    if(oc.indexOf(\"nav('\" + lastPage + \"'\") !== -1) navBtn = el;",
"  });",
"  if(!navBtn) {",
"    lastPage = 'dashboard';",
"    document.querySelectorAll('.nav-item').forEach(function(el){",
"      var oc = el.getAttribute('onclick') || '';",
"      if(oc.indexOf(\"nav('dashboard'\") !== -1) navBtn = el;",
"    });",
"  }",
"  // Activate the right page and nav button",
"  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });",
"  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });",
"  var pageEl = document.getElementById('page-' + lastPage);",
"  if(pageEl) pageEl.classList.add('active');",
"  if(navBtn) navBtn.classList.add('active');",
"  // Call the right render function",
"  if(lastPage==='dashboard')  renderDashboard();",
"  if(lastPage==='students')   renderStudents();",
"  if(lastPage==='payments')   renderPayments();",
"  if(lastPage==='earnings')   renderEarnings();",
"  if(lastPage==='schedule')   { renderScheduleGrid(); renderClassNotes(); }",
"  if(lastPage==='reports')    renderReports();",
"  if(lastPage==='materials')  updateFolderCounts();",
"  if(lastPage==='classroom')  renderClassroom();",
"})();"
];

const newLines = newBlock.map(l => l + '\r');
lines.splice(initLine, iifeEnd - initLine + 1, ...newLines);

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('✅ index.html saved.');

// Verify
const verify = fs.readFileSync('index.html', 'utf8').split('\n');
console.log('\nAFTER — startup block:');
for (let i = initLine; i < initLine + newBlock.length; i++) {
  console.log(`  ${i + 1}: ${verify[i].replace(/\r/, '')}`);
}
console.log('\n=== done: true ===');
