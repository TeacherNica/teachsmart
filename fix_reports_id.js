const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing renderReports element ID ===');

// Fix the getElementById call
if(content.includes("getElementById('report-list')")) {
  content = content.replace(
    "getElementById('report-list')",
    "getElementById('reports-list')"
  );
  console.log('✅ Fixed: report-list → reports-list');
} else {
  console.log('❌ Could not find report-list reference!');
  process.exit(1);
}

// Also fix the hardcoded stats (8, 5, 2, 3) to be dynamic
// Find and replace stats with real counts
const oldStats = `<div class="stat-val" style="color:var(--purple)">8</div><div class="stat-label">Total Reports</div></div>
    <div class="stat"><div class="stat-icon" style="background:linear-gradient(135deg,#F0FDF4,#DCFCE7)">✅</div><div class="stat-val" style="color:var(--green)">5</div><div class="stat-label">Published</div></div>
    <div class="stat"><div class="stat-icon" style="background:linear-gradient(135deg,#FFFBEB,#FDE68A)">✏️</div><ddiv class="stat-val" style="color:var(--orange)">2</div><div class="stat-label">Drafts</div></div>
    <div class="stat"><div class="stat-icon" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE)">⏳</div><div class="stat-val" style="color:var(--blue)">3</div><div class="stat-label">Due Soon</div></div>`;

const newStats = `<div class="stat-val" style="color:var(--purple)" id="rep-total">—</div><div class="stat-label">Total Students</div></div>
    <div class="stat"><div class="stat-icon" style="background:linear-gradient(135deg,#F0FDF4,#DCFCE7)">✅</div><div class="stat-val" style="color:var(--green)" id="rep-present">—</div><div class="stat-label">Good Attendance</div></div>
    <div class="stat"><div class="stat-icon" style="background:linear-gradient(135deg,#FFFBEB,#FDE68A)">⭐</div><div class="stat-val" style="color:var(--orange)" id="rep-advanced">—</div><div class="stat-label">Advanced</div></div>
    <div class="stat"><div class="stat-icon" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE)">⚠️</div><div class="stat-val" style="color:var(--blue)" id="rep-low">—</div><div class="stat-label">Low Packages</div></div>`;

if(content.includes(oldStats.replace(/\n/g,'\r\n'))) {
  content = content.replace(oldStats.replace(/\n/g,'\r\n'), newStats);
  console.log('✅ Stats updated to be dynamic');
} else if(content.includes(oldStats)) {
  content = content.replace(oldStats, newStats);
  console.log('✅ Stats updated to be dynamic');
} else {
  console.log('⚠️ Could not update stats - will fix manually in renderReports');
}

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
console.log('✅ Progress Reports will now display correctly!');
