const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 1. Inject clock+timer bar into students page after page-students div opens
const target = 'id="page-students">';
const clockBar = `id="page-students">
  <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center;background:linear-gradient(135deg,#1E1B4B,#312E81);border-radius:14px;padding:14px 20px;">
    <div style="display:flex;gap:24px;flex:1;">
      <div style="text-align:center;">
        <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">&#127481;&#127469; THAILAND</div>
        <div id="stu-th-clock" style="font-size:1.4rem;font-weight:800;color:#fff;"></div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">&#127464;&#127475; CHINA</div>
        <div id="stu-cn-clock" style="font-size:1.4rem;font-weight:800;color:#fff;"></div>
      </div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <div style="color:#A5B4FC;font-size:0.8rem;font-weight:600;">Class timer:</div>
      <button onclick="startClassTimer(25)" style="padding:6px 14px;border-radius:8px;border:none;background:#6366F1;color:#fff;font-weight:700;cursor:pointer;font-size:0.85rem;">25 min</button>
      <button onclick="startClassTimer(50)" style="padding:6px 14px;border-radius:8px;border:none;background:#A855F7;color:#fff;font-weight:700;cursor:pointer;font-size:0.85rem;">50 min</button>
      <div id="stu-timer-display" style="font-size:1.2rem;font-weight:800;color:#FCD34D;min-width:60px;text-align:center;">--:--</div>
      <button onclick="stopClassTimer()" style="padding:6px 10px;border-radius:8px;border:none;background:#EF4444;color:#fff;font-weight:700;cursor:pointer;">&#9632;</button>
    </div>
  </div>`;

h = h.replace(target, clockBar);

// 2. Make duration clickable toggle on card
h = h.replace(
  '⏱️ ${s.duration}',
  '⏱️ <span onclick="toggleDuration(${s.id},event)" style="cursor:pointer;text-decoration:underline dotted;">${s.duration}</span>'
);

// 3. Show schedule on card if set
const oldNat = '${s.nat} · ${s.schedule||\'\'}`';
const newNat = `\${s.nat}\${s.schedule?' · '+s.schedule:''}\${s.weekSchedule&&Object.keys(s.weekSchedule).length>0?' · <span style="color:var(--purple);font-size:11px;">📅 '+Object.entries(s.weekSchedule).filter(([,v])=>v.start).map(([d,v])=>d.substring(0,3)+' '+v.start).join(', ')+'</span>':''}\``;

h = h.replace(oldNat, newNat);

// 4. Add toggleDuration function
const toggleFunc = `
function toggleDuration(id,e){
  e.stopPropagation();
  const s=students.find(x=>x.id===id);
  if(!s)return;
  s.duration=s.duration==='50 min'?'25 min':'50 min';
  saveData();renderStudents();
}`;

h = h.replace('function isUpcoming', toggleFunc + '\nfunction isUpcoming');

fs.writeFileSync('index.html', h, 'utf8');
console.log('clockbar:', h.includes('stu-th-clock') && h.includes('stu-cn-clock'));
console.log('toggle:', h.includes('toggleDuration'));
console.log('schedule on card:', h.includes('weekSchedule'));