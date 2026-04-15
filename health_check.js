const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

let issues = [];
let ok = [];

// Check for duplicate functions
const funcNames = ['renderReports', 'renderEarnings', 'renderPayments', 'renderStudents', 'markAttendance', 'openStudentProfile'];
funcNames.forEach(fn => {
  const count = (raw.match(new RegExp('function ' + fn + '[\\(\\s]', 'g')) || []).length;
  if (count > 1) issues.push('❌ Duplicate function: ' + fn + ' (' + count + 'x)');
  else if (count === 0) issues.push('❌ Missing function: ' + fn);
  else ok.push('✅ ' + fn + ' (1x)');
});

// Check for auto-deduct bug
if (raw.includes('auto_done_') && raw.includes('ds.classes--')) {
  issues.push('❌ Auto-deduct bug still present!');
} else {
  ok.push('✅ Auto-deduct removed');
}

// Check for duplicate page IDs
const pageIds = ['page-earnings', 'page-reports', 'page-payments', 'page-students', 'page-dashboard'];
pageIds.forEach(id => {
  const count = (raw.match(new RegExp('id="' + id + '"', 'g')) || []).length;
  if (count > 1) issues.push('❌ Duplicate page id: ' + id + ' (' + count + 'x)');
  else ok.push('✅ ' + id + ' (1x)');
});

// Check key elements exist
const elements = ['earn-monthly-breakdown', 'earn-this-month', 'earn-unpaid', 'earn-total-all',
  'payment-list', 'studentProfileModal', 'slot-editor-overlay', 'quickRenameModal'];
elements.forEach(el => {
  if (!raw.includes('id="' + el + '"')) issues.push('❌ Missing element: #' + el);
  else ok.push('✅ #' + el + ' exists');
});

// Check key functions exist
const fns = ['openStudentProfile', 'saveQuickRename', 'openSlotEditor', 'openProfileFromSlot',
  'editPayment', 'deletePayment', 'markAttendance', 'renderEarnings'];
fns.forEach(fn => {
  if (!raw.includes('function ' + fn)) issues.push('❌ Missing function: ' + fn);
  else ok.push('✅ function ' + fn);
});

// Check no show attendance
if (raw.includes("type===\"noshow\"") || raw.includes("type==='noshow'")) {
  ok.push('✅ No Show attendance logic present');
} else {
  issues.push('❌ No Show attendance logic missing');
}

// Check script tags aren't broken
const openScripts = (raw.match(/<script/g) || []).length;
const closeScripts = (raw.match(/<\/script>/g) || []).length;
if (openScripts !== closeScripts) {
  issues.push('❌ Mismatched script tags: ' + openScripts + ' open, ' + closeScripts + ' close');
} else {
  ok.push('✅ Script tags balanced (' + openScripts + ' pairs)');
}

// File size check
const kb = Math.round(raw.length / 1024);
ok.push('✅ File size: ' + kb + ' KB');

console.log('\n========= TEACHSMART HEALTH CHECK =========\n');
ok.forEach(m => console.log(m));
if (issues.length > 0) {
  console.log('\n⚠️  ISSUES FOUND:');
  issues.forEach(m => console.log(m));
} else {
  console.log('\n🎉 All checks passed! App looks healthy.');
}
console.log('\nTotal lines: ' + lines.length);
console.log('===========================================');
