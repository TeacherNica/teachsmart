const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldLine = "  today.innerHTML=sched.length?sched.map(({time,s,status})=>{\r\n    if(!isToday) status='upcoming';";

const newLine = `  today.innerHTML=sched.length?sched.map(({time,s,status})=>{
    if(!isToday) status='upcoming';
    const attended = isToday && (s.attendance_today === 'present');
    const absent = isToday && (s.attendance_today === 'absent');
    const actionBtns = isToday && status !== 'done' 
      ? '<button onclick="markAttendance(\\''+s.name+'\\',\\'present\\')" style="padding:4px 10px;border-radius:6px;border:none;background:#22C55E;color:#fff;font-size:0.75rem;cursor:pointer;font-weight:600;margin-left:4px;">✅ Present</button>'
        +'<button onclick="markAttendance(\\''+s.name+'\\',\\'absent\\')" style="padding:4px 10px;border-radius:6px;border:none;background:#EF4444;color:#fff;font-size:0.75rem;cursor:pointer;font-weight:600;margin-left:4px;">❌ Absent</button>'
      : attended ? '<div style="background:#DCFCE7;color:#15803D;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">✅ Present</div>'
      : absent ? '<div style="background:#FEE2E2;color:#B91C1C;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">❌ Absent</div>'
      : '';`;

h = h.replace(oldLine, newLine);

// Add markAttendance function
const markFn = `
function markAttendance(name, status){
  const s = students.find(x=>x.name===name);
  if(!s) return;
  if(status==='present'){
    if(s.classes<=0){alert(s.name+' has no classes left!');return;}
    s.classes--;
    s.attendance_today='present';
    saveData();
    renderDashboard();
    renderStudents();
    alert('✅ '+s.name+' marked present — 1 class deducted. '+s.classes+' left.');
  } else {
    s.attendance_today='absent';
    saveData();
    renderDashboard();
    alert('❌ '+s.name+' marked absent — no class deducted.');
  }
}`;

h = h.replace('function quickMarkDone', markFn + '\nfunction quickMarkDone');

// Update card HTML to show action buttons
const oldCard = "    const st=statusMap[status];\r\n    return `<div class=\"schedule-item\">";
const newCard = `    const st=statusMap[status];
    const s_obj = sched.find ? s : s;
    return \`<div class="schedule-item" style="position:relative;">`;

h = h.replace(oldCard, newCard);

// Add action buttons to card
const oldBadge = '      <div class="sched-badge" style="background:${st.bg};color:${st.color};">${st.label}</div>       \r\n    </div>';
const newBadge = `      <div style="display:flex;gap:4px;align-items:center;">
        <div class="sched-badge" style="background:\${st.bg};color:\${st.color};">\${st.label}</div>
        \${actionBtns}
      </div>
    </div>`;

h = h.replace(oldBadge, newBadge);

fs.writeFileSync('index.html', h, 'utf8');
console.log('markAttendance:', h.includes('function markAttendance'));
console.log('buttons:', h.includes('Present</button>'));