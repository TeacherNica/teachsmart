const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const scheduleData = `
const WEEKLY_SCHEDULE = {
  0: [
    {time:'5:30 PM', student:'Suri', duration:25},
    {time:'6:00 PM', student:'Bella', duration:25},
    {time:'6:30 PM', student:'COCO-1', duration:25},
    {time:'7:00 PM', student:'Harry', duration:25},
    {time:'7:30 PM', student:'K.Bella', duration:25},
    {time:'8:00 PM', student:'Kelly-Adult', duration:25},
  ],
  1: [
    {time:'5:30 PM', student:'Suri', duration:25},
    {time:'6:00 PM', student:'Jackie', duration:25},
    {time:'6:30 PM', student:'Lina', duration:25},
    {time:'7:00 PM', student:'KAREN', duration:25},
    {time:'7:30 PM', student:'Mollie-Adult & Steven', duration:25},
    {time:'8:00 PM', student:'Aiden', duration:25},
  ],
  2: [
    {time:'6:00 PM', student:'Bella', duration:25},
    {time:'6:30 PM', student:'Jackie', duration:25},
    {time:'7:00 PM', student:'COCO-1', duration:25},
    {time:'7:30 PM', student:'K.Bella', duration:25},
    {time:'8:00 PM', student:'Sophia', duration:50},
  ],
  3: [
    {time:'5:30 PM', student:'Suri', duration:25},
    {time:'6:00 PM', student:'Lina', duration:25},
    {time:'6:30 PM', student:'Jackie', duration:25},
    {time:'7:00 PM', student:'Coco-2', duration:25},
    {time:'7:30 PM', student:'Peter', duration:50},
  ],
  4: [
    {time:'6:00 PM', student:'Koala', duration:50},
    {time:'7:00 PM', student:'KAREN', duration:25},
    {time:'7:30 PM', student:'Rainy', duration:25},
    {time:'8:00 PM', student:'Owen', duration:25},
  ],
  5: [
    {time:'10:00 AM', student:'Seah', duration:50},
    {time:'11:00 AM', student:'Shily', duration:25},
    {time:'12:00 PM', student:'Owen', duration:50},
    {time:'7:00 PM', student:'Rainy', duration:25},
    {time:'7:30 PM', student:'Steven', duration:25},
    {time:'8:00 PM', student:'Carl', duration:25},
  ],
  6: [
    {time:'11:30 AM', student:'Peter', duration:50},
    {time:'6:00 PM', student:'Koala', duration:50},
    {time:'7:00 PM', student:'Rainy', duration:25},
    {time:'7:30 PM', student:'Harry', duration:25},
    {time:'8:00 PM', student:'Carl', duration:25},
  ],
};

function showDay(dayIdx){
  document.querySelectorAll('[id^="day-btn-"]').forEach((b,i)=>{
    b.style.background=i===dayIdx?'linear-gradient(135deg,var(--purple),var(--blue))':'white';
    b.style.color=i===dayIdx?'#fff':'#333';
  });
  const slots=WEEKLY_SCHEDULE[dayIdx]||[];
  const el=document.getElementById('day-schedule');
  if(!el)return;
  if(!slots.length){el.innerHTML='<div style="color:#aaa;padding:20px;text-align:center;">No classes scheduled</div>';return;}
  el.innerHTML=slots.map(slot=>{
    const s=students.find(x=>x.name===slot.student);
    const id=s?s.id:null;
    const color=s?s.c1:'#ccc';
    const left=s?s.classes:'-';
    const bar=s?(s.classes<=2?'#EF4444':s.classes<=4?'#F97316':'#22C55E'):'#ccc';
    return '<div style="display:flex;align-items:center;gap:12px;background:white;border-radius:12px;padding:12px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">'
      +'<div style="font-weight:800;color:var(--purple);min-width:75px;">'+slot.time+'</div>'
      +'<div style="width:10px;height:10px;border-radius:50%;background:'+color+';flex-shrink:0;"></div>'
      +'<div style="flex:1;font-weight:700;">'+slot.student+'</div>'
      +'<div style="font-size:0.8rem;background:#F3E8FF;color:#7C3AED;padding:2px 8px;border-radius:20px;font-weight:600;">'+slot.duration+' min</div>'
      +'<div style="font-size:0.8rem;font-weight:700;color:'+bar+';">'+left+' left</div>'
      +(id?'<button onclick="startClassTimer('+slot.duration+')" style="padding:4px 10px;border-radius:6px;border:none;background:#6366F1;color:#fff;font-size:0.75rem;cursor:pointer;">Start</button>':'')
      +'</div>';
  }).join('');
}`;

const scheduleBar = `
<div id="weekly-schedule-bar" style="margin-bottom:20px;">
  <div style="background:linear-gradient(135deg,#1E1B4B,#312E81);border-radius:14px;padding:16px 20px;margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;gap:24px;">
        <div style="text-align:center;">
          <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">&#127481;&#127469; THAILAND</div>
          <div id="stu-th-clock" style="font-size:1.3rem;font-weight:800;color:#fff;"></div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">&#127464;&#127475; CHINA</div>
          <div id="stu-cn-clock" style="font-size:1.3rem;font-weight:800;color:#fff;"></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span style="color:#A5B4FC;font-size:0.8rem;font-weight:600;">Timer:</span>
        <button onclick="startClassTimer(25)" style="padding:6px 12px;border-radius:8px;border:none;background:#6366F1;color:#fff;font-weight:700;cursor:pointer;font-size:0.82rem;">25 min</button>
        <button onclick="startClassTimer(50)" style="padding:6px 12px;border-radius:8px;border:none;background:#A855F7;color:#fff;font-weight:700;cursor:pointer;font-size:0.82rem;">50 min</button>
        <div id="stu-timer-display" style="font-size:1.2rem;font-weight:800;color:#FCD34D;min-width:55px;text-align:center;">--:--</div>
        <button onclick="stopClassTimer()" style="padding:6px 10px;border-radius:8px;border:none;background:#EF4444;color:#fff;font-weight:700;cursor:pointer;">&#9632;</button>
      </div>
    </div>
  </div>
  <div style="font-weight:800;font-size:1rem;margin-bottom:10px;color:var(--dark);">&#128197; Today's Schedule</div>
  <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
    ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>`<button id="day-btn-${i}" onclick="showDay(${i})" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">${d}</button>`).join('')}
  </div>
  <div id="day-schedule" style="display:grid;gap:8px;"></div>
</div>`;

// Remove old clock bar if present
h = h.replace(/<div style="display:flex;gap:12px;margin-bottom:16px[\s\S]*?<\/div>\n/,'');

// Inject schedule bar into students page
const insertPoint = 'id="page-students">\n  <div class="page-header">';
h = h.replace(insertPoint, 'id="page-students">\n' + scheduleBar + '\n  <div class="page-header">');

// Inject schedule data + showDay before INIT
h = h.replace('// ─── INIT ───', scheduleData + '\n// ─── INIT ───');

// Auto-show today on load
h = h.replace('renderDashboard();\n  renderStudents();', 
  'renderDashboard();\n  renderStudents();\n  const todayIdx=new Date().getDay();showDay(todayIdx===0?6:todayIdx-1);');

fs.writeFileSync('index.html', h, 'utf8');
console.log('schedule:', h.includes('WEEKLY_SCHEDULE'));
console.log('showDay:', h.includes('function showDay'));
console.log('bar:', h.includes('weekly-schedule-bar'));