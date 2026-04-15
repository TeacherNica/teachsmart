const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== STEP 1: Remove duplicate saveData ===');

// Remove the FIRST saveData (the one WITHOUT showSaveIndicator)
const oldSaveData = `function saveData(){
  localStorage.setItem('ts-students', JSON.stringify(students));        
  localStorage.setItem('ts-save-time', new Date().toISOString());       
}`;

if (!content.includes(oldSaveData)) {
  console.error('❌ Could not find first saveData to remove!');
  process.exit(1);
}

content = content.replace(oldSaveData, '');
console.log('✅ Duplicate saveData removed');

// Verify only one saveData remains
const saveDataCount = (content.match(/function saveData/g) || []).length;
if (saveDataCount !== 1) {
  console.error('❌ saveData count is now', saveDataCount, '— aborting!');
  process.exit(1);
}
console.log('✅ saveData now appears exactly once');

console.log('\n=== STEP 2: Fix renderSchedule check (not a real duplicate) ===');
const rsGrid = (content.match(/function renderScheduleGrid/g) || []).length;
const rsSched = (content.match(/function renderSchedule\b/g) || []).length;
console.log('✅ renderScheduleGrid:', rsGrid, 'time(s)');
console.log('✅ renderSchedule:', rsSched, 'time(s)');

console.log('\n=== STEP 3: Fix student profile modal ===');

const oldFn = `function openStudentProfile(id) {
  var allStudents = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var s = allStudents.find(function(x){ return x.id === id; });
  if (!s) return;

  // Header
  document.getElementById('profileAvatar').textContent = s.avatar || '👤';
  document.getElementById('profileName').textContent = s.name;
  document.getElementById('profileNat').textContent = s.nat || '';      
  document.getElementById('profilePackage').textContent = (s.classes || 0) + ' classes left of ' + (s.total || 0);

  // Stats
  var log = s.attendanceLog || [];
  var presentCount = log.filter(function(l){ return l.status === 'present'; }).length;
  var absentCount = log.filter(function(l){ return l.status === 'absent'; }).length;
  var attendancePct = log.length > 0 ? Math.round((presentCount / log.length) * 100) : (s.attendance || 100);

  document.getElementById('profileStats').innerHTML =
    '<div style="flex:1;text-align:center;padding:12px 0;">' +
      '<div style="font-size:1.4rem;font-weight:800;color:#22C55E;">' + presentCount + '</div>' +
      '<div style="font-size:0.75rem;color:#6B7280;">Present</div>' +   
    '</div>' +
    '<div style="flex:1;text-align:center;padding:12px 0;border-left:1px solid #f0f0f0;border-right:1px solid #f0f0f0;">' +
      '<div style="font-size:1.4rem;font-weight:800;color:#EF4444;">' + absentCount + '</div>' +
      '<div style="font-size:0.75rem;color:#6B7280;">Absent (notified)</div>' +
    '</div>' +
    '<div style="flex:1;text-align:center;padding:12px 0;">' +
      '<div style="font-size:1.4rem;font-weight:800;color:#A855F7;">' + attendancePct + '%</div>' +
      '<div style="font-size:0.75rem;color:#6B7280;">Attendance</div>' +
    '</div>';

  // Attendance Log
  var logDiv = document.getElementById('profileAttendanceLog');
  if (log.length === 0) {
    logDiv.innerHTML = '<p style="color:#9CA3AF;text-align:center;font-size:0.9rem;margin-top:20px;">No attendance records yet.<br>Mark Present or Absent from the dashboard to start tracking.</p>';
  } else {
    logDiv.innerHTML = log.map(function(entry) {
      var isPresent = entry.status === 'present';
      var bgColor = entry.status==='present' ? '#F0FDF4' : entry.status==='noshow' ? '#FEF2F2' : '#FFF7ED';
      var borderColor = entry.status==='present' ? '#22C55E' : entry.status==='noshow' ? '#EF4444' : '#F97316';
      var badgeBg = entry.status==='present' ? '#22C55E' : entry.status==='noshow' ? '#EF4444' : '#F97316';
      var badgeLabel = entry.status==='present' ? '✅ Present' : entry.status==='noshow' ? '🚫 No Show' : '🔔 Absent';
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin-bottom:8px;background:' + bgColor + ';border-radius:10px;border-left:4px solid ' + borderColor + ';">' +
        '<div>' +
          '<div style="font-weight:600;font-size:0.9rem;color:#374151;">' + entry.date + '</div>' +
          '<div style="font-size:0.78rem;color:#6B7280;">' + entry.time + '</div>' +
        '</div>' +
        '<span style="background:' + badgeBg + ';color:#fff;padding:3px 12px;border-radius:20px;font-size:0.78rem;font-weight:700;">' + badgeLabel + '</span>' +
      '</div>';
    }).join('');

  document.getElementById('studentProfileModal').style.display = 'flex';
}`;

const newFn = `function openStudentProfile(id) {
  var allStudents = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var s = allStudents.find(function(x){ return x.id === id; });
  if (!s) return;

  // Header
  document.getElementById('profileAvatar').textContent = s.avatar || '👤';
  document.getElementById('profileName').textContent = s.name;
  document.getElementById('profileNat').textContent = s.nat || '';
  document.getElementById('profilePackage').textContent = (s.classes || 0) + ' classes left of ' + (s.total || 0);

  // Stats
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
      '<div style="font-size:0.75rem;color:#6B7280;">Attendance</div>' +
    '</div>';

  // Attendance Log
  var logDiv = document.getElementById('profileAttendanceLog');
  if (!logDiv) {
    document.getElementById('studentProfileModal').style.display = 'flex';
    return;
  }

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
}`;

if (!content.includes(oldFn)) {
  console.error('❌ Could not find openStudentProfile to replace!');
  process.exit(1);
}

content = content.replace(oldFn, newFn);
console.log('✅ openStudentProfile fixed');

// ── FINAL CHECKS ────────────────────────────────────────────────────────────
console.log('\n=== FINAL CHECKS ===');
const criticalFunctions = [
  'function renderDashboard',
  'function renderStudents',
  'function renderPayments',
  'function renderEarnings',
  'function renderReports',
  'function openStudentProfile',
  'function markAttendance',
  'function editPayment',
  'function deletePayment',
  'function openSlotEditor',
  'function saveQuickRename',
  'function saveData',
  'function getPayments',
];

let fail = false;
criticalFunctions.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g')) || []).length;
  if (count !== 1) {
    console.log('❌', fn, '— found', count, 'times');
    fail = true;
  } else {
    console.log('✅', fn);
  }
});

const openTags = (content.match(/<script/g) || []).length;
const closeTags = (content.match(/<\/script>/g) || []).length;
if (openTags !== closeTags) {
  console.log('❌ Script tags unbalanced! Open:', openTags, 'Close:', closeTags);
  fail = true;
} else {
  console.log('✅ Script tags balanced (' + openTags + ' pairs)');
}

console.log('File size:', Math.round(content.length / 1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if (fail) {
  console.error('\n❌ Final check failed! File NOT saved.');
  process.exit(1);
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ All fixes applied! Duplicate saveData removed + student profile fixed.');
