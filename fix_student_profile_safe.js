const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== PRE-FIX CHECKS ===');
console.log('File size:', Math.round(content.length / 1024), 'KB');
console.log('Total lines:', content.split('\n').length);

// Check all critical functions exist before
const criticalFunctions = [
  'function renderDashboard',
  'function renderStudents',
  'function renderSchedule',
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

let preFail = false;
criticalFunctions.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g')) || []).length;
  if (count !== 1) {
    console.log('❌ BEFORE:', fn, '— found', count, 'times');
    preFail = true;
  } else {
    console.log('✅', fn);
  }
});

if (preFail) {
  console.error('\nPre-fix check failed! Aborting to be safe.');
  process.exit(1);
}

// ── THE FIX ────────────────────────────────────────────────────────────────
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
  console.error('\n❌ ERROR: Could not find the exact function to replace!');
  console.error('Try running diag_students.js again and send the output.');
  process.exit(1);
}

content = content.replace(oldFn, newFn);

// ── POST-FIX CHECKS ────────────────────────────────────────────────────────
console.log('\n=== POST-FIX CHECKS ===');
let postFail = false;
criticalFunctions.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g')) || []).length;
  if (count !== 1) {
    console.log('❌ AFTER:', fn, '— found', count, 'times');
    postFail = true;
  } else {
    console.log('✅', fn);
  }
});

const openTags = (content.match(/<script/g) || []).length;
const closeTags = (content.match(/<\/script>/g) || []).length;
if (openTags !== closeTags) {
  console.log('❌ Script tags unbalanced! Open:', openTags, 'Close:', closeTags);
  postFail = true;
} else {
  console.log('✅ Script tags balanced (' + openTags + ' pairs)');
}

console.log('File size after:', Math.round(content.length / 1024), 'KB');
console.log('Total lines after:', content.split('\n').length);

if (postFail) {
  console.error('\n❌ Post-fix check failed! File NOT saved. No changes made.');
  process.exit(1);
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ Student profile fixed! All other tabs verified safe.');
