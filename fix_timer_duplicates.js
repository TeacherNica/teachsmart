const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('=== Fixing duplicate startClassTimer and stopClassTimer ===');

// Find all occurrences of startClassTimer
const startTimerLines = [];
lines.forEach(function(line, i) {
  if(line.includes('function startClassTimer')) startTimerLines.push(i);
});
console.log('startClassTimer at lines:', startTimerLines.map(function(l){return l+1;}));

const stopTimerLines = [];
lines.forEach(function(line, i) {
  if(line.includes('function stopClassTimer')) stopTimerLines.push(i);
});
console.log('stopClassTimer at lines:', stopTimerLines.map(function(l){return l+1;}));

// Remove the SECOND occurrence of startClassTimer
if(startTimerLines.length === 2) {
  const secondStart = startTimerLines[1];
  // Find end of function
  let depth = 0;
  let started = false;
  let end = secondStart;
  for(let i = secondStart; i < lines.length; i++) {
    for(let c of lines[i]) {
      if(c==='{'){depth++;started=true;}
      if(c==='}'){depth--;}
    }
    if(started && depth===0){end=i;break;}
  }
  console.log('Removing duplicate startClassTimer: lines', secondStart+1, 'to', end+1);
  lines.splice(secondStart, end - secondStart + 1);
  console.log('✅ Duplicate startClassTimer removed');
}

// Rebuild content and find stopClassTimer again
content = lines.join('\n');
const lines2 = content.split('\n');

const stopTimerLines2 = [];
lines2.forEach(function(line, i) {
  if(line.includes('function stopClassTimer')) stopTimerLines2.push(i);
});
console.log('stopClassTimer now at lines:', stopTimerLines2.map(function(l){return l+1;}));

// Remove the SECOND occurrence of stopClassTimer
if(stopTimerLines2.length === 2) {
  const secondStop = stopTimerLines2[1];
  let depth = 0;
  let started = false;
  let end = secondStop;
  for(let i = secondStop; i < lines2.length; i++) {
    for(let c of lines2[i]) {
      if(c==='{'){depth++;started=true;}
      if(c==='}'){depth--;}
    }
    if(started && depth===0){end=i;break;}
  }
  console.log('Removing duplicate stopClassTimer: lines', secondStop+1, 'to', end+1);
  lines2.splice(secondStop, end - secondStop + 1);
  console.log('✅ Duplicate stopClassTimer removed');
}

content = lines2.join('\n');

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments',
  'function renderClassroom','function startClassTimer','function stopClassTimer'
];
let fail = false;
checks.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g'))||[]).length;
  if(count !== 1) { console.log('❌', fn, '—', count, 'times'); fail = true; }
  else console.log('✅', fn);
});
const ot = (content.match(/<script/g)||[]).length;
const ct = (content.match(/<\/script>/g)||[]).length;
if(ot !== ct) { console.log('❌ Script tags unbalanced!'); fail = true; }
else console.log('✅ Script tags balanced ('+ot+' pairs)');
console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if(fail) { console.error('\n❌ Final check failed! File NOT saved.'); process.exit(1); }

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ Duplicates removed - renderReports should now work!');
