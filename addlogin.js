const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Add Present/Absent buttons to dashboard schedule card
const oldCard = '<div class="sched-badge" style="background:${st.bg};color:${st.color};">${st.label}</div>';
const newCard = '<div class="sched-badge" style="background:${st.bg};color:${st.color};">${st.label}</div>' +
  '${isToday&&status!=="done"?' +
  '"<button onclick=\\"markAttendance(\'"+s.name+"\',\'present\')\\" style=\\"padding:4px 8px;border-radius:6px;border:none;background:#22C55E;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;margin-left:4px;\\">✅ Present</button>' +
  '<button onclick=\\"markAttendance(\'"+s.name+"\',\'absent\')\\" style=\\"padding:4px 8px;border-radius:6px;border:none;background:#EF4444;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;margin-left:3px;\\">❌ Absent</button>"' +
  ':s.attendance_today==="present"?"<span style=\\"background:#DCFCE7;color:#15803D;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;margin-left:4px;\\">✅ Present</span>"' +
  ':s.attendance_today==="absent"?"<span style=\\"background:#FEE2E2;color:#B91C1C;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;margin-left:4px;\\">❌ Absent</span>":""}';

h = h.replace(oldCard, newCard);
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('markAttendance'));
console.log('buttons:', h.includes('Present</button>'));