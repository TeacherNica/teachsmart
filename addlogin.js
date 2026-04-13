const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldDash = `function renderDashboard(){
  const low=students.filter(s=>s.classes<=2).length;
  document.getElementById('dash-total').textContent=students.length;
  document.getElementById('dash-low').textContent=low;
  // Today's classes
  const today=document.getElementById('today-classes');
  const sched=getTodaySlots(dashDayOffset);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const d=new Date().getDay();
  const baseIdx=d===0?6:d-1;
  const showIdx=(baseIdx+dashDayOffset+7)%7;
  const isToday=dashDayOffset===0;
  const dayLabel=isToday?'Today ('+days[showIdx]+')':days[showIdx];
  const todayHeader=document.getElementById('today-classes-header');
  if(todayHeader)todayHeader.innerHTML='<span>📅 '+dayLabel+'</span>'
    +'<div style="display:flex;gap:6px;">'
    +'<button onclick="dashDayOffset--;renderDashboard();" style="padding:4px 10px;border-radius:6px;border:1px solid #E5E7EB;background:white;cursor:pointer;font-weight:700;">◀</button>'
    +'<button onclick="dashDayOffset=0;renderDashboard();" style="padding:4px 10px;border-radius:6px;border:none;background:var(--purple);color:white;cursor:pointer;font-weight:700;font-size:0.78rem;">Today</button>'
    +'<button onclick="dashDayOffset++;renderDashboard();" style="padding:4px 10px;border-radius:6px;border:1px solid #E5E7EB;background:white;cursor:pointer;font-weight:700;">▶</button>'
    +'</div>';
  const statusMap={done:{bg:'#F0FDF4',color:'#15803D',label:'✓ Done'},now:{bg:'#FFF7ED',color:'#F97316',label:'🔴 Now'},upcoming:{bg:'#EFF6FF',color:'#3B82F6',label:'Upcoming'}};
  today.innerHTML=sched.map(({time,s,status})=>{
    const st=statusMap[status];
    return \`<div class="schedule-item">
      <div class="sched-time" style="color:var(--purple)">\${time}</div>
      <div class="sched-bar" style="background:\${s.c1}"></div>
      <div style="flex:1;"><div class="sched-name">\${s.name}</div><div class="sched-detail">\${s.nat} · \${s.level} · \${s.duration}</div></div>
      <div class="sched-badge" style="background:\${st.bg};color:\${st.color};">\${st.label}</div>       
    </div>\`;
  }).join('');
  // Alerts
  const alerts=document.getElementById('dashboard-alerts');
  const lowStudents=students.filter(s=>s.classes<=2);
  let html='';
  lowStudents.forEach(s=>{html+=\`<div class="alert-item" style="background:#FFFBEB;border:1px solid #FDE68A;"><div class="alert-icon">⚠️</div><div><div class="alert-title">\${s.name} — \${s.classes} class\${{s.classes!==1?'es':''} left</div><div class="alert-sub">Package renewal needed</div></div></div>\`;});  
  html+=\`<div class="alert-item" style="background:#FFF0F7;border:1px solid #FBCFE8;"><div class="alert-icon">🎂</div><div><div class="alert-title">Li Wei's Birthday in 3 days!</div><div class="alert-sub">April 15 — send a greeting!</div></div></div>\`;
  html+=\`<div class="alert-item" style="background:#F0F9FF;border:1px solid #BAE6FD;"><div class="alert-icon">🏮</div><div><div class="alert-title">Labour Day Coming</div><div class="alert-sub">May 1–5 · Expect cancellations</div></div></div>\`;
  alerts.innerHTML=html;
}`;

const newDash = `function renderDashboard(){
  const low=students.filter(s=>s.classes<=2).length;
  const todaySlots=getTodaySlots(0);
  document.getElementById('dash-total').textContent=students.length;
  document.getElementById('dash-low').textContent=low;
  document.getElementById('dash-classes-today') && (document.getElementById('dash-classes-today').textContent=todaySlots.length);
  const today=document.getElementById('today-classes');
  const sched=getTodaySlots(dashDayOffset);
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const d=new Date().getDay();
  const baseIdx=d===0?6:d-1;
  const showIdx=(baseIdx+dashDayOffset+7)%7;
  const isToday=dashDayOffset===0;
  const dayLabel=isToday?'Today ('+days[showIdx]+')':days[showIdx];
  const todayHeader=document.getElementById('today-classes-header');
  if(todayHeader)todayHeader.innerHTML='<span>📅 '+dayLabel+'</span>'
    +'<div style="display:flex;gap:6px;">'
    +'<button onclick="dashDayOffset--;renderDashboard();" style="padding:4px 10px;border-radius:6px;border:1px solid #E5E7EB;background:white;cursor:pointer;font-weight:700;">◀</button>'
    +'<button onclick="dashDayOffset=0;renderDashboard();" style="padding:4px 10px;border-radius:6px;border:none;background:var(--purple);color:white;cursor:pointer;font-weight:700;font-size:0.78rem;">Today</button>'
    +'<button onclick="dashDayOffset++;renderDashboard();" style="padding:4px 10px;border-radius:6px;border:1px solid #E5E7EB;background:white;cursor:pointer;font-weight:700;">▶</button>'
    +'</div>';
  const nowMins=new Date().getHours()*60+new Date().getMinutes();
  today.innerHTML=sched.length?sched.map(({time,s,status})=>{
    const done=status==='done';
    const ongoing=status==='now';
    const bg=done?'#F0FDF4':ongoing?'#FFF7ED':'white';
    const border=done?'2px solid #86EFAC':ongoing?'2px solid #FED7AA':'1px solid #F3F4F6';
    const badge=done?'<div style="background:#DCFCE7;color:#15803D;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">✅ Done</div>'
      :ongoing?'<div style="background:#FEF3C7;color:#D97706;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;animation:pulse 1s infinite;">🔴 Ongoing</div>'
      :'<div style="background:#EFF6FF;color:#3B82F6;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">🕐 Upcoming</div>';
    const markBtn=isToday&&!done?'<button onclick="quickMarkDone(\''+s.name+'\')" style="padding:4px 10px;border-radius:6px;border:none;background:#6366F1;color:#fff;font-size:0.75rem;cursor:pointer;font-weight:600;">✓ Mark</button>':'';
    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;margin-bottom:6px;background:'+bg+';border:'+border+';transition:all 0.2s;">'
      +'<div style="font-weight:800;color:var(--purple);min-width:70px;">'+time+'</div>'
      +'<div style="width:8px;height:8px;border-radius:50%;background:'+s.c1+';flex-shrink:0;"></div>'
      +'<div style="flex:1;"><div style="font-weight:700;font-size:0.9rem;">'+s.name+'</div>'
      +'<div style="font-size:0.75rem;color:#888;">'+s.nat+' · '+s.duration+'</div></div>'
      +badge+markBtn
      +'</div>';
  }).join(''):'<div style="color:#aaa;padding:20px;text-align:center;font-size:0.9rem;">No classes scheduled</div>';
  // Alerts - real students
  const alerts=document.getElementById('dashboard-alerts');
  const lowStudents=students.filter(s=>s.classes<=2);
  let html='';
  lowStudents.forEach(s=>{
    html+='<div class="alert-item" style="background:#FFFBEB;border:1px solid #FDE68A;">'
      +'<div class="alert-icon">⚠️</div>'
      +'<div><div class="alert-title">'+s.name+' — '+s.classes+' class'+(s.classes!==1?'es':'')+' left</div>'
      +'<div class="alert-sub">Package renewal needed</div></div></div>';
  });
  if(!lowStudents.length) html='<div style="color:#aaa;font-size:0.85rem;padding:8px;">No alerts — all good! ✅</div>';
  html+='<div class="alert-item" style="background:#F0F9FF;border:1px solid #BAE6FD;"><div class="alert-icon">🏮</div><div><div class="alert-title">Labour Day Coming</div><div class="alert-sub">May 1–5 · Expect cancellations</div></div></div>';
  alerts.innerHTML=html;
}
function quickMarkDone(name){
  const s=students.find(x=>x.name===name);
  if(!s)return;
  if(s.classes<=0){alert(s.name+' has no classes left!');return;}
  if(!confirm('Mark '+s.name+' class as done and deduct 1 class?'))return;
  s.classes--;
  saveData();
  renderDashboard();
  renderStudents();
}`;

h = h.replace(oldDash, newDash);
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('quickMarkDone'));