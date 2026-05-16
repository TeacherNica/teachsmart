const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing saveEditedPayment to save studentName ===');

const oldLine = '  payments[idx].amount=parseFloat(document.getElementById(\'edit-pay-amount\').value)||0;';
const newLine = '  payments[idx].studentName=document.getElementById(\'edit-pay-student\').value;\n  payments[idx].amount=parseFloat(document.getElementById(\'edit-pay-amount\').value)||0;';

if (!content.includes(oldLine)) {
  console.error('❌ Could not find target line!');
  process.exit(1);
}

content = content.replace(oldLine, newLine);
console.log('✅ studentName now saved on edit');

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
console.log('✅ Student name will now save correctly!');
