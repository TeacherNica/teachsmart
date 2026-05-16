const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing init page load ===');

const oldInit = `const lastPage = localStorage.getItem('ts-last-page');
if(lastPage && lastPage !== 'dashboard'){
  const navBtn = document.querySelector('[onclick*="nav(\''+lastPage+'\'"]');
  if(navBtn) nav(lastPage, navBtn);
}`;

const newInit = `const lastPage = localStorage.getItem('ts-last-page');
if(lastPage && lastPage !== 'dashboard'){
  const navBtn = document.querySelector('[onclick*="nav(\''+lastPage+'\'"]');
  if(navBtn) nav(lastPage, navBtn);
  // Fallback: call render directly if navBtn not found
  if(!navBtn){
    if(lastPage==='earnings') renderEarnings();
    if(lastPage==='payments') renderPayments();
    if(lastPage==='schedule'){renderScheduleGrid();renderClassNotes();}
    if(lastPage==='students') renderStudents();
    if(lastPage==='reports') renderReports();
  }
}`;

// Try CRLF first
if(content.includes(oldInit.replace(/\n/g,'\r\n'))){
  content = content.replace(oldInit.replace(/\n/g,'\r\n'), newInit);
  console.log('✅ Init code fixed (CRLF)');
} else if(content.includes(oldInit)){
  content = content.replace(oldInit, newInit);
  console.log('✅ Init code fixed (LF)');
} else {
  console.error('❌ Could not find init code!');
  process.exit(1);
}

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments'
];
let fail = false;
checks.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g'))||[]).length;
  if (count !== 1) { console.log('❌', fn, '—', count, 'times'); fail = true; }
  else console.log('✅', fn);
});
const ot = (content.match(/<script/g)||[]).length;
const ct = (content.match(/<\/script>/g)||[]).length;
if (ot !== ct) { console.log('❌ Script tags unbalanced:', ot, 'open,', ct, 'close'); fail = true; }
else console.log('✅ Script tags balanced (' + ot + ' pairs)');
console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if (fail) { console.error('\n❌ Final check failed! File NOT saved.'); process.exit(1); }

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ Pages will now load correctly on refresh!');
