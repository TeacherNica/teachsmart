const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Removing readonly from edit-pay-student ===');

const oldField = '<input id="edit-pay-student" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;background:#F9FAFB;" readonly>';
const newField = '<input id="edit-pay-student" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;background:#fff;" placeholder="Enter student name">';

if (!content.includes(oldField)) {
  console.error('❌ Could not find the field! Trying partial match...');
  // Try finding just the id and readonly
  if (content.includes('edit-pay-student') && content.includes('readonly')) {
    console.log('Field exists but text is slightly different. Please check manually.');
  }
  process.exit(1);
}

content = content.replace(oldField, newField);
console.log('✅ readonly removed, field is now editable');

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
console.log('✅ Student name field is now editable in Edit Payment modal!');
