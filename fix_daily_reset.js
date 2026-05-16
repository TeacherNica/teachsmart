const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Adding daily attendance_today reset ===');

// Find the INIT section to add the reset
const initIdx = content.indexOf('// ─── INIT ───');
if(initIdx === -1) {
  console.error('❌ Could not find INIT section!');
  process.exit(1);
}

const resetCode = `// ─── DAILY RESET ───
// Clear attendance_today if it's a new day
(function(){
  var today = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  var lastReset = localStorage.getItem('ts-last-reset');
  if(lastReset !== today) {
    students.forEach(function(s){ s.attendance_today = ''; });
    localStorage.setItem('ts-last-reset', today);
    localStorage.setItem('ts-students', JSON.stringify(students));
  }
})();

`;

// Insert before INIT
content = content.replace('// ─── INIT ───', resetCode + '// ─── INIT ───');
console.log('✅ Daily reset added');

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
console.log('✅ attendance_today will now reset every new day!');
