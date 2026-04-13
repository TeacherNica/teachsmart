const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldHeader = '<div class="page-header">\n    <div><div class="page-title">👨‍🎓 Students</div><div class="page-sub">Taap any card to view full profile</div></div>\n    <button class="btn btn-primary" onclick="openModal(\'add-student-modal\')">＋ Add Student</button>\n  </div>';

const newHeader = `<div class="page-header">
    <div><div class="page-title">👨‍🎓 Students</div><div class="page-sub">Tap any card to view full profile</div></div>
    <button class="btn btn-primary" onclick="openModal('add-student-modal')">＋ Add Student</button>
  </div>
  <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center;background:linear-gradient(135deg,#1E1B4B,#312E81);border-radius:14px;padding:14px 20px;">
    <div style="display:flex;gap:24px;flex:1;">
      <div style="text-align:center;">
        <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">🇹🇭 THAILAND</div>
        <div id="stu-th-clock" style="font-size:1.4rem;font-weight:800;color:#fff;"></div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">🇨🇳 CHINA</div>
        <div id="stu-cn-clock" style="font-size:1.4rem;font-weight:800;color:#fff;"></div>
      </div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;">
      <div style="color:#A5B4FC;font-size:0.8rem;font-weight:600;">Class timer:</div>
      <button onclick="startClassTimer(25)" style="padding:6px 14px;border-radius:8px;border:none;background:#6366F1;color:#fff;font-weight:700;cursor:pointer;font-size:0.85rem;">⏱ 25 min</button>
      <button onclick="startClassTimer(50)" style="padding:6px 14px;border-radius:8px;border:none;background:#A855F7;color:#fff;font-weight:700;cursor:pointer;font-size:0.85rem;">⏱ 50 min</button>
      <div id="stu-timer-display" style="font-size:1.2rem;font-weight:800;color:#FCD34D;min-width:60px;text-align:center;">--:--</div>
      <button onclick="stopClassTimer()" style="padding:6px 10px;border-radius:8px;border:none;background:#EF4444;color:#fff;font-weight:700;cursor:pointer;font-size:0.85rem;">■</button>
    </div>
  </div>`;

h = h.replace(oldHeader, newHeader);

// Add clock + timer functions
const timerFuncs = `
function updateStudentClocks(){
  const fmt=tz=>new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true,timeZone:tz}).format(new Date());
  const th=document.getElementById('stu-th-clock');
  const cn=document.getElementById('stu-cn-clock');
  if(th)th.textContent=fmt('Asia/Bangkok');
  if(cn)cn.textContent=fmt('Asia/Shanghai');
}
setInterval(updateStudentClocks,1000);
updateStudentClocks();

let classTimerInterval=null;
let classTimerEnd=null;
function startClassTimer(mins){
  if(classTimerInterval)clearInterval(classTimerInterval);
  classTimerEnd=new Date(Date.now()+mins*60*1000);
  classTimerInterval=setInterval(()=>{
    const left=classTimerEnd-Date.now();
    if(left<=0){
      clearInterval(classTimerInterval);
      document.getElementById('stu-timer-display').textContent='Done!';
      alert('⏰ Class time is up!');
      return;
    }
    const m=String(Math.floor(left/60000)).padStart(2,'0');
    const s=String(Math.floor((left%60000)/1000)).padStart(2,'0');
    document.getElementById('stu-timer-display').textContent=m+':'+s;
  },1000);
}
function stopClassTimer(){
  if(classTimerInterval)clearInterval(classTimerInterval);
  const el=document.getElementById('stu-timer-display');
  if(el)el.textContent='--:--';
}`;

h = h.replace('function isUpcoming', timerFuncs + '\nfunction isUpcoming');

fs.writeFileSync('index.html', h, 'utf8');
console.log('clocks:', h.includes('stu-th-clock'));
console.log('timer:', h.includes('startClassTimer'));