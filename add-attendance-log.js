const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// STEP 1: Update markAttendance to save log entries
const oldMarkAttendance = `function markAttendance(name,type){
  const s=students.find(x=>x.name===name);       
  if(!s)return;
  if(type==="present"){
    if(s.classes<=0){alert(s.name+" has no classes left!");return;}
    s.classes--;
    s.attendance_today="present";
    saveData();renderDashboard();renderStudents();
    alert("Present! "+s.classes+" left.");       
  }else{
    s.attendance_today="absent";
    saveData();renderDashboard();
    alert("Absent noted.");
  }
}`;

const newMarkAttendance = `function markAttendance(name,type){
  const s=students.find(x=>x.name===name);
  if(!s)return;
  if(!s.attendanceLog) s.attendanceLog=[];
  const now=new Date();
  const dateStr=now.toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'});
  const timeStr=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  if(type==="present"){
    if(s.classes<=0){alert(s.name+" has no classes left!");return;}
    s.classes--;
    s.attendance_today="present";
    s.attendanceLog.unshift({date:dateStr,time:timeStr,status:"present"});
    saveData();renderDashboard();renderStudents();
    alert("Present! "+s.classes+" left.");
  }else{
    s.attendance_today="absent";
    s.attendanceLog.unshift({date:dateStr,time:timeStr,status:"absent"});
    saveData();renderDashboard();
    alert("Absent noted.");
  }
}`;

if (!html.includes('function markAttendance(name,type){')) {
  console.log('ERROR: Could not find markAttendance function. Check spacing in file.');
  process.exit(1);
}

html = html.replace(oldMarkAttendance, newMarkAttendance);

// STEP 2: Add student profile modal before </body>
const profileModal = `
<!-- Student Profile Modal -->
<div id="studentProfileModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:16px;padding:0;max-width:480px;width:92%;max-height:85vh;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.2);position:relative;display:flex;flex-direction:column;">
    <!-- Header -->
    <div id="profileHeader" style="padding:24px 24px 16px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;position:relative;">
      <button onclick="closeStudentProfile()" style="position:absolute;top:12px;right:16px;background:rgba(255,255,255,0.2);border:none;font-size:18px;cursor:pointer;color:#fff;width:30px;height:30px;border-radius:50%;">&times;</button>
      <div style="display:flex;align-items:center;gap:14px;">
        <div id="profileAvatar" style="font-size:2.5rem;background:rgba(255,255,255,0.2);border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;"></div>
        <div>
          <div id="profileName" style="font-size:1.3rem;font-weight:800;"></div>
          <div id="profileNat" style="font-size:0.85rem;opacity:0.85;"></div>
          <div id="profilePackage" style="font-size:0.85rem;margin-top:4px;background:rgba(255,255,255,0.2);padding:2px 10px;border-radius:20px;display:inline-block;"></div>
        </div>
      </div>
    </div>
    <!-- Stats Row -->
    <div id="profileStats" style="display:flex;gap:0;border-bottom:1px solid #f0f0f0;"></div>
    <!-- Attendance Log -->
    <div style="padding:16px 24px;overflow-y:auto;flex:1;">
      <div style="font-weight:700;font-size:0.95rem;color:#374151;margin-bottom:12px;">📋 Attendance History</div>
      <div id="profileAttendanceLog"></div>
    </div>
  </div>
</div>

<script>
function openStudentProfile(id) {
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
      '<div style="font-size:0.75rem;color:#6B7280;">Absent</div>' +
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
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin-bottom:8px;background:' + (isPresent ? '#F0FDF4' : '#FEF2F2') + ';border-radius:10px;border-left:4px solid ' + (isPresent ? '#22C55E' : '#EF4444') + ';">' +
        '<div>' +
          '<div style="font-weight:600;font-size:0.9rem;color:#374151;">' + entry.date + '</div>' +
          '<div style="font-size:0.78rem;color:#6B7280;">' + entry.time + '</div>' +
        '</div>' +
        '<span style="background:' + (isPresent ? '#22C55E' : '#EF4444') + ';color:#fff;padding:3px 12px;border-radius:20px;font-size:0.78rem;font-weight:700;">' + (isPresent ? '✅ Present' : '❌ Absent') + '</span>' +
      '</div>';
    }).join('');
  }

  document.getElementById('studentProfileModal').style.display = 'flex';
}

function closeStudentProfile() {
  document.getElementById('studentProfileModal').style.display = 'none';
}

document.getElementById('studentProfileModal').addEventListener('click', function(e) {
  if (e.target === this) closeStudentProfile();
});
</script>
`;

html = html.replace('</body>', profileModal + '\n</body>');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Step 1 done: markAttendance updated to save log entries.');
console.log('Step 2 done: Student profile modal injected.');
console.log('\ndone: true');
