const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing syntax error in renderClassNotes ===');

const oldLine = `'background:'+(isDone?'#F0FDF4':'#FFF');+';border:1.5px solid '+(isDone?'#22C55E':'#DDD6FE')+';gap:8px;flex-wrap:wrap;opacity:'+(isDone?'0.7':'1')+'">'`;
const newLine = `'background:'+(isDone?'#F0FDF4':'#ffffff')+';border:1.5px solid '+(isDone?'#22C55E':'#DDD6FE')+';gap:8px;flex-wrap:wrap;opacity:'+(isDone?'0.7':'1')+'">'`;

if (!content.includes(oldLine)) {
  console.error('❌ Could not find exact line, trying with CRLF...');
  // Try finding just the broken part
  if (content.includes("'#FFF');+';border")) {
    content = content.replace("'#FFF');+';border:1.5px solid '", "'#ffffff')+';border:1.5px solid '");
    console.log('✅ Fixed using partial match');
  } else {
    console.error('❌ Cannot find the broken syntax!');
    process.exit(1);
  }
} else {
  content = content.replace(oldLine, newLine);
  console.log('✅ Syntax error fixed');
}

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments',
  'function saveClassNote','function renderClassNotes'
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
console.log('✅ renderClassNotes syntax fixed - notes will now display!');
