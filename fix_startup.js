// fix_startup.js — node fix_startup.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// Find the INIT comment line and the end of the lastPage IIFE
let initLine = -1;   // "// ─── INIT ───"
let iifeEnd  = -1;   // the })(); that closes the lastPage IIFE

for (let i = 0; i < lines.length; i++) {
  const l = lines[i].replace(/\r/, '').trim();
  if (l === '// ─── INIT ───') initLine = i;
  if (initLine !== -1 && i > initLine && l === '})();') {
    iifeEnd = i;
    break;
  }
}

console.log(`INIT comment at line ${initLine + 1}`);
console.log(`IIFE end at line ${iifeEnd + 1}`);

if (initLine === -1 || iifeEnd === -1) {
  console.log('❌ Could not locate block — stopping');
  process.exit(1);
}

// Replace everything from "// ─── INIT ───" through the closing })();
// with a clean single block that:
//   1. reads lastPage
//   2. activates the right page + nav button
//   3. calls the right render function
//   4. never calls renderDashboard twice

const newBlock =
`// ─── INIT ───
(function(){
  var lastPage = localStorage.getItem('ts-last-page') || 'dashboard';
  var navBtn = document.querySelector('.nav-item[onclick*="nav(\''+lastPage+'\'"]');
  if(!navBtn) {
    lastPage = 'dashboard';
    navBtn = document.querySelector('.nav-item[onclick*="nav(\'dashboard\'"]');
  }
  // activate page + nav
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });
  var pageEl = document.getElementById('page-' + lastPage);
  if(pageEl) pageEl.classList.add('active');
  if(navBtn) navBtn.classList.add('active');
  // render the right content
  if(lastPage==='dashboard')  renderDashboard();
  if(lastPage==='students')   renderStudents();
  if(lastPage==='payments')   renderPayments();
  if(lastPage==='earnings')   renderEarnings();
  if(lastPage==='schedule')   { renderScheduleGrid(); renderClassNotes(); }
  if(lastPage==='reports')    renderReports();
  if(lastPage==='materials')  updateFolderCounts();
  if(lastPage==='classroom')  renderClassroom();
})();`;

const newLines = newBlock.split('\n').map(l => l + '\r');
lines.splice(initLine, iifeEnd - initLine + 1, ...newLines);

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('\n✅ index.html saved.');

// Verify
const verify = fs.readFileSync('index.html', 'utf8').split('\n');
const start = initLine - 1;
console.log('\nAFTER — startup block:');
for (let i = start; i < start + newLines.length + 2 && i < verify.length; i++) {
  console.log(`  ${i + 1}: ${verify[i].replace(/\r/, '')}`);
}

console.log('\n=== done: true ===');
