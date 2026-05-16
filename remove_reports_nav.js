const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Removing Reports nav item from Business section ===');

// Remove the first Reports nav item (under Business)
const oldNav = `  <div class="nav-item" onclick="nav('reports',this)"><span class="nav-icon">📁</span>Reports</div>`;

if(!content.includes(oldNav)) {
  console.error('❌ Could not find Reports nav item!');
  process.exit(1);
}

content = content.replace(oldNav, '');
console.log('✅ Reports nav item removed from Business section');

// Verify Progress Reports still exists
const progressReports = content.includes("nav('reports',this)\"><span class=\"nav-icon\">📝</span>Progress Reports");
console.log('✅ Progress Reports nav still exists:', progressReports);

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
console.log('✅ Reports tab removed from Business section!');
