// fix_dashboard_v2.js — node fix_dashboard_v2.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

console.log('=== Dashboard Fix v2 ===\n');

// Show the current startup block before fix
console.log('BEFORE — lines 2853-2870:');
for(let i = 2852; i < 2870; i++) {
  console.log(`  ${i+1}: ${lines[i].replace(/\r/,'')}`);
}

// The problem: 
// Line 2854: renderDashboard() runs ✅
// Line 2860: nav(lastPage, navBtn) runs — hides dashboard, shows lastPage
// Result: dashboard is hidden even though it rendered correctly
//
// The fix:
// In the lastPage IIFE, if lastPage is 'dashboard' OR there's no lastPage,
// explicitly call nav('dashboard', dashboardNavBtn) to ensure it's active.
// Also add renderDashboard() to the setTimeout block for the dashboard case.

// Find line 2856 — the start of the lastPage IIFE
// We'll replace the entire lastPage IIFE (lines 2856-2869) with a fixed version

let startLine = -1;
let endLine = -1;

for(let i = 2855; i < 2875; i++) {
  if(lines[i] && /^\(function\(\)\{/.test(lines[i].replace(/\r/,'').trim())) {
    startLine = i;
  }
  if(startLine !== -1 && lines[i] && /^\}\)\(\);/.test(lines[i].replace(/\r/,'').trim())) {
    endLine = i;
    break;
  }
}

console.log(`\nFound lastPage IIFE: lines ${startLine+1} to ${endLine+1}`);

if(startLine === -1 || endLine === -1) {
  console.log('❌ Could not locate lastPage IIFE — check manually');
  process.exit(1);
}

// Build the replacement
const eol = '\r\n';
const replacement = 
`(function(){
  var lastPage = localStorage.getItem('ts-last-page');
  if(lastPage && lastPage !== 'dashboard'){
    var navBtn = document.querySelector('[onclick*="nav(\''+lastPage+'\'"]');
    if(navBtn) nav(lastPage, navBtn);
    setTimeout(function(){
      if(lastPage==='earnings') renderEarnings();
      if(lastPage==='payments') renderPayments();
      if(lastPage==='schedule'){renderScheduleGrid();renderClassNotes();}
      if(lastPage==='students') renderStudents();
      if(lastPage==='reports') renderReports();
    }, 300);
  } else {
    // Default to dashboard — make sure it's active and rendered
    var dashBtn = document.querySelector('[onclick*="nav(\'dashboard\'"]');
    if(dashBtn) {
      document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
      document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
      document.getElementById('page-dashboard').classList.add('active');
      dashBtn.classList.add('active');
    }
    renderDashboard();
  }
})();`;

// Replace the lines
const replacementLines = replacement.split('\n').map(l => l + '\r');
lines.splice(startLine, endLine - startLine + 1, ...replacementLines);

// Write file
fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('\n✅ index.html saved.');

// Verify
const verify = fs.readFileSync('index.html', 'utf8').split('\n');
console.log('\nAFTER — lines 2853-2885:');
for(let i = 2852; i < 2885 && i < verify.length; i++) {
  console.log(`  ${i+1}: ${verify[i].replace(/\r/,'')}`);
}

console.log('\n=== done: true ===');
