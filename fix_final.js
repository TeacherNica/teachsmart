// fix_final.js — node fix_final.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// Find the INIT comment line and its closing })();
let initLine = -1, iifeEnd = -1;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].replace(/\r/, '').trim();
  if (l.includes('INIT')) initLine = i;
  if (initLine !== -1 && i > initLine && l === '})();') { iifeEnd = i; break; }
}

console.log(`Replacing lines ${initLine + 1} to ${iifeEnd + 1}`);
if (initLine === -1 || iifeEnd === -1) { console.log('ERROR'); process.exit(1); }

// New startup block — uses DOMContentLoaded to guarantee DOM is ready
// and loops nav items to avoid any querySelector quote issues
const newBlock = `// ─── INIT ───
window.addEventListener('DOMContentLoaded', function(){
  // Always refresh students from storage first
  students = JSON.parse(localStorage.getItem('ts-students') || 'null') || students;

  var lastPage = localStorage.getItem('ts-last-page') || 'dashboard';

  // Hide all pages, deactivate all nav
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n){ n.classList.remove('active'); });

  // Show the right page
  var pageEl = document.getElementById('page-' + lastPage);
  if (!pageEl) { lastPage = 'dashboard'; pageEl = document.getElementById('page-dashboard'); }
  pageEl.classList.add('active');

  // Activate the matching nav button
  document.querySelectorAll('.nav-item').forEach(function(el){
    var oc = el.getAttribute('onclick') || '';
    if (oc.indexOf("'" + lastPage + "'") !== -1) el.classList.add('active');
  });

  // Call the right render function
  if (lastPage === 'dashboard') renderDashboard();
  else if (lastPage === 'students')  renderStudents();
  else if (lastPage === 'payments')  renderPayments();
  else if (lastPage === 'earnings')  renderEarnings();
  else if (lastPage === 'schedule')  { renderScheduleGrid(); renderClassNotes(); }
  else if (lastPage === 'reports')   renderReports();
  else if (lastPage === 'materials') updateFolderCounts();
  else if (lastPage === 'classroom') renderClassroom();
  else renderDashboard();
});`;

const newLines = newBlock.split('\n').map(l => l + '\r');
lines.splice(initLine, iifeEnd - initLine + 1, ...newLines);

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('✅ Saved.');

// Verify
const verify = fs.readFileSync('index.html', 'utf8').split('\n');
console.log('\nResult:');
for (let i = initLine; i < initLine + newLines.length; i++) {
  console.log(`  ${i+1}: ${(verify[i]||'').replace(/\r/,'')}`);
}
console.log('\n=== done: true ===');
