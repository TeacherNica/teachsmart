const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let lines = content.split('\n');

console.log('=== Adding duplicate guard (minimal change) ===');

// Find the exact line: if(!s.attendanceLog) s.attendanceLog=[];
let targetLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('if(!s.attendanceLog) s.attendanceLog=[];')) {
    targetLine = i;
    break;
  }
}

if (targetLine === -1) {
  console.error('❌ Could not find target line!');
  process.exit(1);
}

console.log('Found target at line', targetLine + 1, ':', lines[targetLine].trim());

// Check if guard already exists
if (content.includes('already has an attendance entry')) {
  console.log('⚠️ Guard already exists! No changes needed.');
  process.exit(0);
}

// Insert just 3 lines AFTER the attendanceLog init line
const guardLines = [
  '  var alreadyMarked=s.attendanceLog.some(function(e){return e.date===dateStr;});',
  '  if(alreadyMarked){if(!confirm(s.name+" already has an entry for today. Add anyway?")) return;}',
];

lines.splice(targetLine + 1, 0, ...guardLines);
content = lines.join('\n');
console.log('✅ Guard inserted after line', targetLine + 1);

// ── FINAL CHECKS ─────────────────────────────────────────────────────────
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
console.log('✅ Attendance guard added safely!');
