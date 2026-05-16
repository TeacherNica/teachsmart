const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing getTodaySlots to sync with schedule grid ===');

const oldFn = `function getTodaySlots(offset){
  const d=new Date().getDay();
  let dayIdx=(d===0?6:d-1);
  dayIdx=(dayIdx+(offset||0)+7)%7;
  if(typeof WEEKLY_SCHEDULE==='undefined')return[];
  return (WEEKLY_SCHEDULE[dayIdx]||[]).map(slot=>{
    const s=students.find(x=>x.name===slot.student)||{name:slot.student,nat:'',level:'',duration:slot.duration+' min',c1:'#A855F7',c2:'#6366F1'};
    const nowMins=new Date().getHours()*60+new Date().getMinutes();
    const t=slot.time.split(' ');const hm=t[0].split(':');let hr=parseInt(hm[0]);const mn=parseInt(hm[1]);
    if(t[1]==='PM'&&hr!==12)hr+=12;if(t[1]==='AM'&&hr===12)hr=0;
    const slotMins=hr*60+mn;
    const status=nowMins>slotMins+slot.duration?'done':nowMins>=slotMins?'now':'upcoming';
    return {time:slot.time, s:{...s,duration:slot.dur`;

// Find and replace using line-based approach
const lines = content.split('\n');
let fnStart = -1;
let fnEnd = -1;

for(let i = 0; i < lines.length; i++) {
  if(lines[i].includes('function getTodaySlots')) { fnStart = i; break; }
}

// Find end by looking for next function
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
  '  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];',
  '  const dayName=days[dayIdx];',
  '  const TIMES=["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM"];',
  '  // Get hardcoded schedule as base',
  '  var baseSlots = (typeof WEEKLY_SCHEDULE!=="undefined" ? (WEEKLY_SCHEDULE[dayIdx]||[]) : []);',
  '  // Get localStorage overrides',
  '  var savedSlots = JSON.parse(localStorage.getItem("ts-slots")||"{}");',
  '  // Build merged slot map',
  '  var slotMap = {};',
  '  // Add hardcoded slots first',
  '  baseSlots.forEach(function(slot){',
  '    slotMap[slot.time] = {student: slot.student, duration: slot.duration};',
  '  });',
  '  // Apply localStorage overrides',
  '  Object.keys(savedSlots).forEach(function(key){',
  '    // Key format: "Mon-7:30 PM" or "Fri-6:00 PM"',
  '    var parts = key.split("-");',
  '    if(parts[0] !== dayName) return;',
  '    var time = parts.slice(1).join("-");',
  '    var slot = savedSlots[key];',
  '    if(slot.type === "student" && slot.name) {',
  '      // Find duration from student or default',
  '      var stu = students.find(function(x){return x.name===slot.name;});',
  '      var dur = stu ? (stu.duration==="50 min"?50:25) : 25;',
  '      slotMap[time] = {student: slot.name, duration: dur};',
  '    } else if(slot.type === "close" || slot.type === "avail") {',
  '      delete slotMap[time];',
  '    }',
  '  });',
  '  // Convert to array and sort by time',
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
  '    result.push({time:time, s:{...s,duration:slot.duration+" min"}, status:status, _mins:slotMins});',
  '  });',
  '  // Sort by time',
  '  result.sort(function(a,b){return a._mins-b._mins;});',
  '  return result;',
  '}'
];

lines.splice(fnStart, fnEnd - fnStart + 1, ...newFn);
content = lines.join('\n');
console.log('✅ getTodaySlots updated to sync with schedule grid');

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
console.log('✅ Dashboard now syncs with schedule grid automatically!');
