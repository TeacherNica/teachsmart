const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing init page load ===');

const oldInit = "const lastPage = localStorage.getItem('ts-last-page');\r\nif(lastPage && lastPage !== 'dashboard'){\r\n  const navBtn = document.querySelector('[onclick*=\"nav(\\''+lastPage+'\\'\"]');\r\n  if(navBtn) nav(lastPage, navBtn);\r\n}";

const newInit = "const lastPage = localStorage.getItem('ts-last-page');\r\nif(lastPage && lastPage !== 'dashboard'){\r\n  const navBtn = document.querySelector('[onclick*=\"nav(\\''+lastPage+'\\'\"]');\r\n  if(navBtn) nav(lastPage, navBtn);\r\n  // Fallback: call render directly if navBtn not found\r\n  if(!navBtn){\r\n    if(lastPage==='earnings') renderEarnings();\r\n    if(lastPage==='payments') renderPayments();\r\n    if(lastPage==='schedule'){renderScheduleGrid();renderClassNotes();}\r\n    if(lastPage==='students') renderStudents();\r\n    if(lastPage==='reports') renderReports();\r\n  }\r\n}";

if(!content.includes(oldInit)){
  console.error('❌ Could not find init code!');
  process.exit(1);
}

content = content.replace(oldInit, newInit);
console.log('✅ Init code fixed');

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
