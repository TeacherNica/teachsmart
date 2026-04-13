const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. Add markAttendance function
const markFn = [
  'function markAttendance(name,type){',
  '  const s=students.find(x=>x.name===name);',
  '  if(!s)return;',
  '  if(type==="present"){',
  '    if(s.classes<=0){alert(s.name+" has no classes left!");return;}',
  '    s.classes--;',
  '    s.attendance_today="present";',
  '    saveData();renderDashboard();renderStudents();',
  '    alert("✅ "+s.name+" present — 1 class deducted. "+s.classes+" left.");',
  '  } else {',
  '    s.attendance_today="absent";',
  '    saveData();renderDashboard();',
  '    alert("❌ "+s.name+" absent — no class deducted.");',
  '  }',
  '}'
].join('\n');

h = h.replace('function isUpcoming', markFn + '\nfunction isUpcoming');

// 2. Add attendance vars after status line
const oldStatus = "    if(!isToday) status='upcoming';";
const newStatus = [
  "    if(!isToday) status='upcoming';",
  "    const attended=s.attendance_today==='present';",
  "    const wasAbsent=s.attendance_today==='absent';",
  "    const showBtns=isToday&&!attended&&!wasAbsent;"
].join('\r\n');

h = h.replace(oldStatus, newStatus);

// 3. Add buttons to card - find the sched-badge div and add after it
const oldBadge = '<div class="sched-badge" style="background:${st.bg};color:${st.color};">${st.label}</div>       \r\n    </div>';
const newBadge = [
  '<div style="display:flex;gap:4px;align-items:center;">',
  '<div class="sched-badge" style="background:${st.bg};color:${st.color};">${st.label}</div>',
  '${showBtns?\'<button onclick="markAttendance(\\\'"+s.name+"\\\',' + "'" + 'present' + "'" + ')" style="padding:4px 8px;border-radius:6px;border:none;background:#22C55E;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;">✅ Present</button>\':attended?\'<span style="background:#DCFCE7;color:#15803D;padding:3px 8px;border-radius:20px;font-size:0.72rem;">✅ Present</span>\':wasAbsent?\'<span style="background:#FEE2E2;color:#B91C1C;padding:3px 8px;border-radius:20px;font-size:0.72rem;">❌ Absent</span>\':\'\'} ',
  '${showBtns?\'<button onclick="markAttendance(\\\'"+s.name+"\\\',' + "'" + 'absent' + "'" + ')" style="padding:4px 8px;border-radius:6px;border:none;background:#EF4444;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;">❌ Absent</button>\':\'\'} ',
  '</div>',
  '    </div>'
].join('\r\n');

h = h.replace(oldBadge, newBadge);

fs.writeFileSync('index.html', h, 'utf8');
console.log('markAttendance:', h.includes('function markAttendance'));
console.log('showBtns:', h.includes('showBtns'));