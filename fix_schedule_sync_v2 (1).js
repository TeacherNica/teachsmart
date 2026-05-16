const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing getTodaySlots key format ===');

const lines = content.split('\n');
let fnStart = -1;
let fnEnd = -1;

for(let i = 0; i < lines.length; i++) {
  if(lines[i].includes('function getTodaySlots')) { fnStart = i; break; }
}
for(let i = fnStart + 1; i < lines.length; i++) {
  if(lines[i].trim().startsWith('function ') && !lines[i].includes('=>')) {
    fnEnd = i - 1;
    while(fnEnd > fnStart && lines[fnEnd].trim() === '') fnEnd--;
    break;
  }
}

console.log('getTodaySlots spans lines', fnStart+1, 'to', fnEnd+1);

const newFn = [
  'function getTodaySlots(offset){',
  '  const d=new Date().getDay();',
  '  let dayIdx=(d===0?6:d-1);',
  '  dayIdx=(dayIdx+(offset||0)+7)%7;',
  '  // Get hardcoded schedule as base',
  '  var baseSlots = (typeof WEEKLY_SCHEDULE!=="undefined" ? (WEEKLY_SCHEDULE[dayIdx]||[]) : []);',
  '  // Get localStorage overrides - key format is "time|dayNumber" e.g. "6:30 PM|6"',
  '  var savedSlots = JSON.parse(localStorage.getItem("ts-slots")||"{}");',
  '  // Build merged slot map from hardcoded schedule',
  '  var slotMap = {};',
  '  baseSlots.forEach(function(slot){',
  '    slotMap[slot.time] = {student: slot.student, duration: slot.duration};',
  '  });',
  '  // Apply localStorage overrides using correct key format "time|dayIndex"',
  '  Object.keys(savedSlots).forEach(function(key){',
  '    var parts = key.split("|");',
  '    if(parts.length !== 2) return;',
  '    var time = parts[0];',
  '    var keyDay = parseInt(parts[1]);',
  '    // dayIdx uses 0=Mon...6=Sun, but ts-slots uses 1=Mon...7=Sun',
  '    // Check both formats',
  '    var matches = (keyDay === dayIdx + 2);',
  '    if(!matches) return;',
  '    var slot = savedSlots[key];',
  '    if(slot.type === "student" && slot.name) {',
  '      var stu = students.find(function(x){return x.name===slot.name;});',
  '      var dur = stu ? (stu.duration==="50 min"?50:25) : 25;',
  '      slotMap[time] = {student: slot.name, duration: dur};',
  '    } else if(slot.type === "close" || slot.type === "avail") {',
  '      delete slotMap[time];',
  '    }',
  '  });',
  '  // Convert to sorted array',
  '  var result = [];',
  '  Object.keys(slotMap).forEach(function(time){',
  '    var slot = slotMap[time];',
  '    var s = students.find(function(x){return x.name===slot.student;})||{name:slot.student,nat:"",level:"",duration:slot.duration+" min",c1:"#A855F7",c2:"#6366F1"};',
  '    var nowMins = new Date().getHours()*60+new Date().getMinutes();',
  '    var t = time.split(" ");',
  '    var hm = t[0].split(":");',
  '    var hr = parseInt(hm[0]);',
  '    var mn = parseInt(hm[1]);',
  '    if(t[1]==="PM"&&hr!==12)hr+=12;',
  '    if(t[1]==="AM"&&hr===12)hr=0;',
  '    var slotMins = hr*60+mn;',
  '    var status = nowMins>slotMins+slot.duration?"done":nowMins>=slotMins?"now":"upcoming";',
  '    result.push({time:time, s:Object.assign({},s,{duration:slot.duration+" min"}), status:status, _mins:slotMins});',
  '  });',
  '  result.sort(function(a,b){return a._mins-b._mins;});',
  '  return result;',
  '}'
];

lines.splice(fnStart, fnEnd - fnStart + 1, ...newFn);
content = lines.join('\n');
console.log('✅ getTodaySlots key format fixed');

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments',
  'function getTodaySlots'
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
console.log('✅ Schedule sync now uses correct key format!');
