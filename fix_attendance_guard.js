const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let lines = content.split('\n');

console.log('=== Fixing markAttendance - adding duplicate guard ===');

// Find start and end of markAttendance
let fnStart = -1;
let fnEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function markAttendance')) { fnStart = i; break; }
}
// End is the blank line after the closing }
for (let i = fnStart + 1; i < lines.length; i++) {
  if (lines[i].trim() === '}') { fnEnd = i; break; }
}

console.log('markAttendance spans lines', fnStart+1, 'to', fnEnd+1);

const newFn = [
  'function markAttendance(name,type){',
  '  var s=students.find(function(x){return x.name===name;});',
  '  if(!s)return;',
  '  var now=new Date();',
  '  var dateStr=now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});',
  '  var timeStr=now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});',
  '  if(!s.attendanceLog) s.attendanceLog=[];',
  '  // Duplicate guard: prevent same student being marked twice on same date',
  '  var alreadyMarked=s.attendanceLog.some(function(e){return e.date===dateStr;});',
  '  if(alreadyMarked){',
  '    if(!confirm(s.name+" already has an attendance entry for today ("+dateStr+").\\nAdd another entry anyway?")) return;',
  '  }',
  '  if(type==="present"){',
  '    if(s.classes<=0){alert(s.name+" has no classes left!");return;}',
  '    s.classes--;',
  '    s.attendance_today="present";',
  '    s.attendanceLog.unshift({status:"present",date:dateStr,time:timeStr});',
  '    saveData();renderDashboard();renderStudents();',
  '    alert("✅ Present! "+s.classes+" classes left.");',
  '  } else if(type==="noshow"){',
  '    if(s.classes<=0){alert(s.name+" has no classes left!");return;}',
  '    s.classes--;',
  '    s.attendance_today="noshow";',
  '    s.attendanceLog.unshift({status:"noshow",date:dateStr,time:timeStr});',
  '    saveData();renderDashboard();renderStudents();',
  '    alert("🚫 No Show logged. 1 class deducted. "+s.classes+" classes left.");',
  '  } else {',
  '    s.attendance_today="absent";',
  '    s.attendanceLog.unshift({status:"absent",date:dateStr,time:timeStr});',
  '    saveData();renderDashboard();',
  '    alert("🔔 Absent noted. No class deducted.");',
  '  }',
  '}'
];

lines.splice(fnStart, fnEnd - fnStart + 1, ...newFn);
content = lines.join('\n');
console.log('✅ markAttendance updated with duplicate guard');

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
console.log('✅ Duplicate attendance guard added!');
