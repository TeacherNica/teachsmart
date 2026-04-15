const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let lines = content.split('\n');

console.log('=== STEP 1: Remove duplicate saveData ===');
const saveDataLines = [];
lines.forEach(function(line, i) {
  if (line.includes('function saveData')) saveDataLines.push(i);
});
console.log('Found saveData at lines:', saveDataLines.map(function(l){ return l+1; }));

// Remove first saveData block (lines 811-814, index 810-813)
// Find end of first block
let firstStart = saveDataLines[0];
let firstEnd = firstStart;
for (let i = firstStart + 1; i < lines.length; i++) {
  if (lines[i].trim() === '}') { firstEnd = i; break; }
}
console.log('Removing lines', firstStart+1, 'to', firstEnd+1);
lines.splice(firstStart, firstEnd - firstStart + 1);
content = lines.join('\n');

const sdCount = (content.match(/function saveData/g)||[]).length;
console.log('saveData count after removal:', sdCount);
if (sdCount !== 1) { console.error('❌ saveData still wrong'); process.exit(1); }
console.log('✅ Duplicate saveData removed');

// ── STEP 2: Replace openStudentProfile ───────────────────────────────────
console.log('\n=== STEP 2: Fix openStudentProfile ===');
lines = content.split('\n');

let fnStart = -1;
let fnEnd = -1;

// Find start
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function openStudentProfile')) {
    fnStart = i;
    break;
  }
}
if (fnStart === -1) { console.error('❌ openStudentProfile not found'); process.exit(1); }

// Find end by counting braces properly
let depth = 0;
let counting = false;
for (let i = fnStart; i < lines.length; i++) {
  for (let c = 0; c < lines[i].length; c++) {
    if (lines[i][c] === '{') { depth++; counting = true; }
    if (lines[i][c] === '}') { depth--; }
  }
  if (counting && depth === 0) {
    fnEnd = i;
    break;
  }
}

console.log('openStudentProfile spans lines', fnStart+1, 'to', fnEnd+1);
if (fnEnd === -1 || fnEnd <= fnStart) { console.error('❌ Could not find end of function'); process.exit(1); }

const newFnLines = `function openStudentProfile(id) {
  var allStudents = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var s = allStudents.find(function(x){ return x.id === id; });
  if (!s) return;
  document.getElementById('profileAvatar').textContent = s.avatar || '👤';
  document.getElementById('profileName').textContent = s.name;
  document.getElementById('profileNat').textContent = s.nat || '';
  document.getElementById('profilePackage').textContent = (s.classes || 0) + ' classes left of ' + (s.total || 0);
  var log = s.attendanceLog || [];
  var presentCount = log.filter(function(l){ return l.status === 'present'; }).length;
  var noshowCount = log.filter(function(l){ return l.status === 'noshow'; }).length;
  var absentCount = log.filter(function(l){ return l.status === 'absent'; }).length;
  var attendancePct = log.length > 0 ? Math.round((presentCount / log.length) * 100) : (s.attendance || 100);
  document.getElementById('profileStats').innerHTML =
    '<div style="flex:1;text-align:center;padding:12px 0;">' +
      '<div style="font-size:1.4rem;font-weight:800;color:#22C55E;">' + presentCount + '</div>' +
      '<div style="font-size:0.75rem;color:#6B7280;">Present</div>' +
    '</div>' +
    '<div style="flex:1;text-align:center;padding:12px 0;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0;">' +
      '<div style="font-size:1.4rem;font-weight:800;color:#EF4444;">' + absentCount + '</div>' +
      '<div style="font-size:0.75rem;color:#6B7280;">Absent</div>' +
    '</div>' +
    '<div style="flex:1;text-align:center;padding:12px 0;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0;">' +
      '<div style="font-size:1.4rem;font-weight:800;color:#EF4444;">' + noshowCount + '</div>' +
      '<div style="font-size:0.75rem;color:#6B7280;">No Show</div>' +
    '</div>' +
    '<div style="flex:1;text-align:center;padding:12px 0;">' +
      '<div style="font-size:1.4rem;font-weight:800;color:#A855F7;">' + attendancePct + '%</div>' +
      '<div style="font-size:0.75rem;color:#6B7280;">Attendance %</div>' +
    '</div>';
  var logDiv = document.getElementById('profileAttendanceLog');
  if (!logDiv) { document.getElementById('studentProfileModal').style.display = 'flex'; return; }
  if (log.length === 0) {
    logDiv.innerHTML = '<p style="color:#9CA3AF;text-align:center;font-size:0.9rem;margin-top:20px;">No attendance records yet.<br>Mark Present or Absent from the dashboard to start tracking.</p>';
  } else {
    logDiv.innerHTML = log.map(function(entry) {
      var bgColor = entry.status==='present' ? '#F0FDF4' : entry.status==='noshow' ? '#FEF2F2' : '#FFF7ED';
      var borderColor = entry.status==='present' ? '#22C55E' : entry.status==='noshow' ? '#EF4444' : '#F97316';
      var badgeBg = entry.status==='present' ? '#22C55E' : entry.status==='noshow' ? '#EF4444' : '#F97316';
      var badgeLabel = entry.status==='present' ? '✅ Present' : entry.status==='noshow' ? '🚫 No Show' : '🔔 Absent';
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin-bottom:8px;background:' + bgColor + ';border-radius:10px;border-left:4px solid ' + borderColor + ';">' +
        '<div>' +
          '<div style="font-weight:600;font-size:0.9rem;color:#374151;">' + (entry.date || 'No date') + '</div>' +
          '<div style="font-size:0.78rem;color:#6B7280;">' + (entry.time || '') + '</div>' +
        '</div>' +
        '<span style="background:' + badgeBg + ';color:#fff;padding:3px 12px;border-radius:20px;font-size:0.78rem;font-weight:700;">' + badgeLabel + '</span>' +
      '</div>';
    }).join('');
  }
  document.getElementById('studentProfileModal').style.display = 'flex';
}`.split('\n');

// Replace lines fnStart to fnEnd with new function
lines.splice(fnStart, fnEnd - fnStart + 1, ...newFnLines);
content = lines.join('\n');
console.log('✅ openStudentProfile replaced');

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
console.log('✅ All fixes applied safely!');
