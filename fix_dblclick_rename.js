const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Adding double-click rename to student name ===');

// Find the s-name div with onclick
const oldLine = '        <div class="s-name" style="cursor:pointer;" onclick="openStudentProfile(${s.id})">${s.name}</div>';
const newLine = '        <div class="s-name" style="cursor:pointer;" onclick="openStudentProfile(${s.id})" ondblclick="openQuickRename(${s.id},event)" title="Double-click to rename">${s.name}</div>';

if (!content.includes(oldLine)) {
  console.error('❌ Could not find target line! Trying with escaped chars...');
  // Try finding just the class
  const idx = content.indexOf('class="s-name"');
  if (idx !== -1) {
    console.log('Found s-name at:', content.substring(idx, idx + 150));
  }
  process.exit(1);
}

content = content.replace(oldLine, newLine);
console.log('✅ Double-click rename added to student name');

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
console.log('✅ Double-click on student name now opens rename popup!');
