const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Add markAttendance function before isUpcoming
const markFn = `function markAttendance(name, type){
  const s=students.find(x=>x.name===name);
  if(!s)return;
  if(type==='present'){
    if(s.classes<=0){alert(s.name+' has no classes left!');return;}
    s.classes--;
    s.attendance_today='present';
    saveData();renderDashboard();renderStudents();
    alert('✅ '+s.name+' present — 1 class deducted. '+s.classes+' left.');
  } else {
    s.attendance_today='absent';
    saveData();renderDashboard();
    alert('❌ '+s.name+' absent — no class deducted.');
  }
}\n`;

h = h.replace('function isUpcoming', markFn + 'function isUpcoming');

// Add Present/Absent buttons to dashboard schedule items
const oldEnd = "    if(!isToday) status='upcoming';\r\n    const st=statusMap[status];";
const newEnd = "    if(!isToday) status='upcoming';\r\n    const st=statusMap[status];\r\n    const attended=s.attendance_today==='present';\r\n    const wasAbsent=s.attendance_today==='absent';\r\n    const showBtns=isToday&&status!=='done'&&!attended&&!wasAbsent;\r\n    const presBtn=showBtns?'<button onclick=\"markAttendance(\\''+s.name+'\\',\\'present\\')\\" style=\"padding:4px 8px;border-radius:6px;border:none;background:#22C55E;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;\">✅ Present</button>':attended?'<span style=\"background:#DCFCE7;color:#15803D;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;\">✅ Present</span>':'';\r\n    const absBtn=showBtns?'<button onclick=\"markAttendance(\\''+s.name+'\\',\\'absent\\')\\" style=\"padding:4px 8px;border-radius:6px;border:none;background:#EF4444;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;margin-left:3px;\">❌ Absent</button>':wasAbsent?'<span style=\"background:#FEE2E2;color:#B91C1C;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;\">❌ Absent</span>':'';";

h = h.replace(oldEnd, newEnd);

// Add buttons to the card HTML
const oldBadge = "<div class=\"sched-badge\" style=\"background:\${st.bg};color:\${st.color};\">\${st.label}</div>       \r\n    </div>";
const newBadge = "<div style='display:flex;gap:4px;align-items:center;'><div class=\"sched-badge\" style=\"background:\${st.bg};color:\${st.color};\">\${st.label}</div>\${presBtn}\${absBtn}</div>\r\n    </div>";

h = h.replace(oldBadge, newBadge);

fs.writeFileSync('index.html', h, 'utf8');
console.log('markAttendance:', h.includes('function markAttendance'));
console.log('presBtn:', h.includes('presBtn'));