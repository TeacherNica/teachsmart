const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Adding A-Z sort to renderStudents ===');

// Find the exact line to insert after
const target = "  if(q)list=list.filter(s=>s.name.toLowerCase().includes(q)||s.nat.toLowerCase().includes(q));";

if (!content.includes(target)) {
  console.error('❌ Could not find target line!');
  process.exit(1);
}

// Check if sort already exists
if (content.includes('list.sort') && content.includes('renderStudents')) {
  console.log('⚠️ Sort may already exist!');
}

const replacement = target + '\n  list=list.slice().sort(function(a,b){return a.name.localeCompare(b.name);});';
content = content.replace(target, replacement);
console.log('✅ A-Z sort added');

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
console.log('✅ Students will now display A-Z!');
