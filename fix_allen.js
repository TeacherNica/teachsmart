const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Adding Allen to Friday + syncing schedule ===');

// Fix 1: Add Allen to Friday (index 4)
const oldFriday = `  4: [
    {time:'6:00 PM', student:'Koala', duration:50},
    {time:'7:00 PM', student:'KAREN', duration:25},
    {time:'8:00 PM', student:'Owen', duration:25},
  ],`;

const newFriday = `  4: [
    {time:'6:00 PM', student:'Koala', duration:50},
    {time:'7:00 PM', student:'KAREN', duration:25},
    {time:'7:30 PM', student:'Allen', duration:25},
    {time:'8:00 PM', student:'Owen', duration:25},
  ],`;

if(!content.includes(oldFriday.replace(/\n/g,'\r\n')) && !content.includes(oldFriday)){
  console.error('❌ Could not find Friday schedule!');
  process.exit(1);
}

content = content.includes(oldFriday.replace(/\n/g,'\r\n'))
  ? content.replace(oldFriday.replace(/\n/g,'\r\n'), newFriday)
  : content.replace(oldFriday, newFriday);

console.log('✅ Allen added to Friday 7:30 PM');

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
console.log('✅ Allen now shows on Friday dashboard!');
