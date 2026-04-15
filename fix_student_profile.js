const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
const out = [];
let i = 0;
let fixes = { modalHTML: false, openFunction: false };

while (i < lines.length) {
  const l = lines[i];

  // FIX 1: Replace the studentProfileModal HTML with expanded version including edit fields
  if (l.includes('id="studentProfileModal"') && !fixes.modalHTML) {
    console.log('✅ Replacing studentProfileModal HTML at line ' + (i+1));
    // Skip old modal HTML
    let depth = 0, started = false;
    while (i < lines.length) {
      const t = lines[i].trim();
      depth += (t.match(/<div/g)||[]).length - (t.match(/<\/div>/g)||[]).length;
      if (!started && t.includes('<div')) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    // Inject new modal
    out.push('<div id="studentProfileModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">');
    out.push('  <div style="background:#fff;border-radius:16px;padding:0;max-width:500px;width:92%;max-height:90vh;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.18);display:flex;flex-direction:column;">');
    out.push('    <!-- Header -->');
    out.push('    <div id="profileHeader" style="padding:24px 24px 16px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;position:relative;flex-shrink:0;">');
    out.push('      <button onclick="closeStudentProfile()" style="position:absolute;top:12px;right:16px;background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:20px;cursor:pointer;border-radius:50%;width:30px;height:30px;">&times;</button>');
    out.push('      <div style="display:flex;align-items:center;gap:14px;">');
    out.push('        <div id="profileAvatar" style="font-size:2.5rem;background:rgba(255,255,255,0.2);border-radius:50%;width:60px;height:60px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"></div>');
    out.push('        <div>');
    out.push('          <div id="profileName" style="font-size:1.3rem;font-weight:800;"></div>');
    out.push('          <div id="profileNat" style="font-size:0.85rem;opacity:0.85;"></div>');
    out.push('          <div id="profilePackage" style="font-size:0.85rem;margin-top:4px;background:rgba(255,255,255,0.2);padding:2px 10px;border-radius:20px;display:inline-block;"></div>');
    out.push('        </div>');
    out.push('      </div>');
    out.push('    </div>');
    out.push('    <!-- Stats Row -->');
    out.push('    <div id="profileStats" style="display:flex;gap:0;border-bottom:1px solid #f0f0f0;flex-shrink:0;"></div>');
    out.push('    <!-- Tabs -->');
    out.push('    <div style="display:flex;border-bottom:1px solid #f0f0f0;flex-shrink:0;">');
    out.push('      <button id="profileTab-history" onclick="switchProfileTab(\'history\')" style="flex:1;padding:10px;border:none;background:#F5F3FF;color:#7C3AED;font-weight:700;font-size:0.85rem;cursor:pointer;border-bottom:3px solid #A855F7;">📋 Attendance</button>');
    out.push('      <button id="profileTab-edit" onclick="switchProfileTab(\'edit\')" style="flex:1;padding:10px;border:none;background:#fff;color:#6B7280;font-weight:700;font-size:0.85rem;cursor:pointer;border-bottom:3px solid transparent;">✏️ Edit Info</button>');
    out.push('    </div>');
    out.push('    <!-- Attendance Tab -->');
    out.push('    <div id="profilePane-history" style="padding:16px 24px;overflow-y:auto;flex:1;">');
    out.push('      <div style="font-weight:700;font-size:0.95rem;color:#374151;margin-bottom:12px;">📋 Attendance History</div>');
    out.push('      <div id="profileAttendanceLog"></div>');
    out.push('    </div>');
    out.push('    <!-- Edit Info Tab -->');
    out.push('    <div id="profilePane-edit" style="padding:16px 24px;overflow-y:auto;flex:1;display:none;">');
    out.push('      <input type="hidden" id="profileEditId">');
    out.push('      <div style="margin-bottom:12px;">');
    out.push('        <label style="font-size:0.8rem;font-weight:600;color:#6B7280;display:block;margin-bottom:4px;">Full Name</label>');
    out.push('        <input id="profileEditName" style="width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('      </div>');
    out.push('      <div style="margin-bottom:12px;">');
    out.push('        <label style="font-size:0.8rem;font-weight:600;color:#6B7280;display:block;margin-bottom:4px;">Nickname</label>');
    out.push('        <input id="profileEditNick" style="width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('      </div>');
    out.push('      <div style="margin-bottom:12px;">');
    out.push('        <label style="font-size:0.8rem;font-weight:600;color:#6B7280;display:block;margin-bottom:4px;">Schedule</label>');
    out.push('        <input id="profileEditSchedule" placeholder="e.g. Mon/Wed 7:00 PM" style="width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('      </div>');
    out.push('      <div style="margin-bottom:12px;">');
    out.push('        <label style="font-size:0.8rem;font-weight:600;color:#6B7280;display:block;margin-bottom:4px;">Birthday</label>');
    out.push('        <input id="profileEditBirthday" type="date" style="width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('      </div>');
    out.push('      <div style="margin-bottom:12px;">');
    out.push('        <label style="font-size:0.8rem;font-weight:600;color:#6B7280;display:block;margin-bottom:4px;">WeChat ID</label>');
    out.push('        <input id="profileEditWechat" placeholder="Parent WeChat ID" style="width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('      </div>');
    out.push('      <div style="margin-bottom:20px;">');
    out.push('        <label style="font-size:0.8rem;font-weight:600;color:#6B7280;display:block;margin-bottom:4px;">Notes</label>');
    out.push('        <textarea id="profileEditNotes" rows="3" placeholder="e.g. shy student, loves stories..." style="width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;resize:vertical;"></textarea>');
    out.push('      </div>');
    out.push('      <button onclick="saveStudentProfileEdit()" style="width:100%;padding:12px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;">💾 Save Changes</button>');
    out.push('    </div>');
    out.push('  </div>');
    out.push('</div>');
    fixes.modalHTML = true;
    continue;
  }

  // FIX 2: Replace the broken openStudentProfile function
  if (l.trim() === 'function openStudentProfile(id) {' && !fixes.openFunction) {
    console.log('✅ Replacing openStudentProfile function at line ' + (i+1));
    // Skip old function
    let depth = 0, started = false;
    while (i < lines.length) {
      const t = lines[i].trim();
      depth += (t.match(/\{/g)||[]).length - (t.match(/\}/g)||[]).length;
      if (!started && t.includes('{')) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    // Inject fixed + expanded function
    out.push('function openStudentProfile(id) {');
    out.push('  var allStudents = JSON.parse(localStorage.getItem(\'ts-students\') || \'[]\');');
    out.push('  var s = allStudents.find(function(x){ return x.id === id; });');
    out.push('  if (!s) return;');
    out.push('');
    out.push('  // Header');
    out.push('  document.getElementById(\'profileAvatar\').textContent = s.avatar || \'👤\';');
    out.push('  document.getElementById(\'profileName\').textContent = s.name;');
    out.push('  document.getElementById(\'profileNat\').textContent = (s.nat || \'\') + (s.level ? \' · \' + s.level : \'\');');
    out.push('  document.getElementById(\'profilePackage\').textContent = (s.classes || 0) + \' classes left of \' + (s.total || 0);');
    out.push('');
    out.push('  // Stats');
    out.push('  var log = s.attendanceLog || [];');
    out.push('  var presentCount = log.filter(function(l){ return l.status === \'present\'; }).length;');
    out.push('  var absentCount = log.filter(function(l){ return l.status === \'absent\'; }).length;');
    out.push('  var noshowCount = log.filter(function(l){ return l.status === \'noshow\'; }).length;');
    out.push('  var attendancePct = log.length > 0 ? Math.round((presentCount / log.length) * 100) : (s.attendance || 100);');
    out.push('');
    out.push('  document.getElementById(\'profileStats\').innerHTML =');
    out.push('    \'<div style="flex:1;text-align:center;padding:12px 0;">\' +');
    out.push('      \'<div style="font-size:1.3rem;font-weight:800;color:#22C55E;">\' + presentCount + \'</div>\' +');
    out.push('      \'<div style="font-size:0.72rem;color:#6B7280;">✅ Present</div>\' +');
    out.push('    \'</div>\' +');
    out.push('    \'<div style="flex:1;text-align:center;padding:12px 0;border-left:1px solid #f0f0f0;">\' +');
    out.push('      \'<div style="font-size:1.3rem;font-weight:800;color:#F97316;">\' + absentCount + \'</div>\' +');
    out.push('      \'<div style="font-size:0.72rem;color:#6B7280;">🔔 Absent</div>\' +');
    out.push('    \'</div>\' +');
    out.push('    \'<div style="flex:1;text-align:center;padding:12px 0;border-left:1px solid #f0f0f0;">\' +');
    out.push('      \'<div style="font-size:1.3rem;font-weight:800;color:#EF4444;">\' + noshowCount + \'</div>\' +');
    out.push('      \'<div style="font-size:0.72rem;color:#6B7280;">🚫 No Show</div>\' +');
    out.push('    \'</div>\' +');
    out.push('    \'<div style="flex:1;text-align:center;padding:12px 0;border-left:1px solid #f0f0f0;">\' +');
    out.push('      \'<div style="font-size:1.3rem;font-weight:800;color:#A855F7;">\' + attendancePct + \'%</div>\' +');
    out.push('      \'<div style="font-size:0.72rem;color:#6B7280;">Attendance</div>\' +');
    out.push('    \'</div>\';');
    out.push('');
    out.push('  // Attendance Log');
    out.push('  var logDiv = document.getElementById(\'profileAttendanceLog\');');
    out.push('  if (log.length === 0) {');
    out.push('    logDiv.innerHTML = \'<p style="color:#9CA3AF;text-align:center;font-size:0.9rem;margin-top:20px;">No attendance records yet.<br>Use the ✅ Present, 🔔 Absent, or 🚫 No Show buttons on the dashboard.</p>\';');
    out.push('  } else {');
    out.push('    logDiv.innerHTML = log.map(function(entry) {');
    out.push('      var bgColor = entry.status===\'present\' ? \'#F0FDF4\' : entry.status===\'noshow\' ? \'#FEF2F2\' : \'#FFF7ED\';');
    out.push('      var borderColor = entry.status===\'present\' ? \'#22C55E\' : entry.status===\'noshow\' ? \'#EF4444\' : \'#F97316\';');
    out.push('      var badgeBg = entry.status===\'present\' ? \'#22C55E\' : entry.status===\'noshow\' ? \'#EF4444\' : \'#F97316\';');
    out.push('      var badgeLabel = entry.status===\'present\' ? \'✅ Present\' : entry.status===\'noshow\' ? \'🚫 No Show\' : \'🔔 Absent\';');
    out.push('      return \'<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin-bottom:8px;background:\' + bgColor + \';border-radius:10px;border-left:4px solid \' + borderColor + \';\">\' +');
    out.push('        \'<div>\' +');
    out.push('          \'<div style="font-weight:600;font-size:0.9rem;color:#374151;">\' + entry.date + \'</div>\' +');
    out.push('          \'<div style="font-size:0.78rem;color:#6B7280;">\' + entry.time + \'</div>\' +');
    out.push('        \'</div>\' +');
    out.push('        \'<span style="background:\' + badgeBg + \';color:#fff;padding:3px 12px;border-radius:20px;font-size:0.78rem;font-weight:700;">\' + badgeLabel + \'</span>\' +');
    out.push('      \'</div>\';');
    out.push('    }).join(\'\');');
    out.push('  }');
    out.push('');
    out.push('  // Populate edit fields');
    out.push('  document.getElementById(\'profileEditId\').value = s.id;');
    out.push('  document.getElementById(\'profileEditName\').value = s.name || \'\';');
    out.push('  document.getElementById(\'profileEditNick\').value = s.nick || \'\';');
    out.push('  document.getElementById(\'profileEditSchedule\').value = s.schedule || \'\';');
    out.push('  document.getElementById(\'profileEditBirthday\').value = s.birthday || \'\';');
    out.push('  document.getElementById(\'profileEditWechat\').value = s.wechat || \'\';');
    out.push('  document.getElementById(\'profileEditNotes\').value = s.notes || \'\';');
    out.push('');
    out.push('  // Show history tab by default');
    out.push('  switchProfileTab(\'history\');');
    out.push('  document.getElementById(\'studentProfileModal\').style.display = \'flex\';');
    out.push('}');
    out.push('');
    out.push('function switchProfileTab(tab) {');
    out.push('  document.getElementById(\'profilePane-history\').style.display = tab===\'history\' ? \'block\' : \'none\';');
    out.push('  document.getElementById(\'profilePane-edit\').style.display = tab===\'edit\' ? \'block\' : \'none\';');
    out.push('  document.getElementById(\'profileTab-history\').style.background = tab===\'history\' ? \'#F5F3FF\' : \'#fff\';');
    out.push('  document.getElementById(\'profileTab-history\').style.color = tab===\'history\' ? \'#7C3AED\' : \'#6B7280\';');
    out.push('  document.getElementById(\'profileTab-history\').style.borderBottom = tab===\'history\' ? \'3px solid #A855F7\' : \'3px solid transparent\';');
    out.push('  document.getElementById(\'profileTab-edit\').style.background = tab===\'edit\' ? \'#F5F3FF\' : \'#fff\';');
    out.push('  document.getElementById(\'profileTab-edit\').style.color = tab===\'edit\' ? \'#7C3AED\' : \'#6B7280\';');
    out.push('  document.getElementById(\'profileTab-edit\').style.borderBottom = tab===\'edit\' ? \'3px solid #A855F7\' : \'3px solid transparent\';');
    out.push('}');
    out.push('');
    out.push('function saveStudentProfileEdit() {');
    out.push('  var id = parseInt(document.getElementById(\'profileEditId\').value);');
    out.push('  var allStudents = JSON.parse(localStorage.getItem(\'ts-students\') || \'[]\');');
    out.push('  var idx = allStudents.findIndex(function(x){ return x.id === id; });');
    out.push('  if (idx === -1) { alert(\'Student not found.\'); return; }');
    out.push('  allStudents[idx].name = document.getElementById(\'profileEditName\').value.trim() || allStudents[idx].name;');
    out.push('  allStudents[idx].nick = document.getElementById(\'profileEditNick\').value.trim();');
    out.push('  allStudents[idx].schedule = document.getElementById(\'profileEditSchedule\').value.trim();');
    out.push('  allStudents[idx].birthday = document.getElementById(\'profileEditBirthday\').value;');
    out.push('  allStudents[idx].wechat = document.getElementById(\'profileEditWechat\').value.trim();');
    out.push('  allStudents[idx].notes = document.getElementById(\'profileEditNotes\').value.trim();');
    out.push('  allStudents[idx].avatar = allStudents[idx].name.charAt(0).toUpperCase();');
    out.push('  localStorage.setItem(\'ts-students\', JSON.stringify(allStudents));');
    out.push('  students = allStudents;');
    out.push('  renderStudents();');
    out.push('  renderDashboard();');
    out.push('  // Update header');
    out.push('  document.getElementById(\'profileName\').textContent = allStudents[idx].name;');
    out.push('  document.getElementById(\'profileAvatar\').textContent = allStudents[idx].avatar;');
    out.push('  alert(\'✅ Student info updated!\');');
    out.push('}');
    fixes.openFunction = true;
    continue;
  }

  out.push(l);
  i++;
}

const result = out.join('\r\n');
console.log('\n📊 Modal HTML replaced: ' + fixes.modalHTML);
console.log('📊 openStudentProfile replaced: ' + fixes.openFunction);
console.log('📊 switchProfileTab present: ' + result.includes('function switchProfileTab'));
console.log('📊 saveStudentProfileEdit present: ' + result.includes('function saveStudentProfileEdit'));

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
