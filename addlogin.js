const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldDashboard = `function renderDashboard(){
  const low=students.filter(s=>s.classes<=2).length;
  document.getElementById('dash-total').textContent=students.length;
  document.getElementById('dash-low').textContent=low;
  // Today's classes
  const today=document.getElementById('today-classes');
  const sched=[
    {time:'5:30 PM',s:students[0],status:'done'},
    {time:'6:30 PM',s:students[1],status:'now'},
    {time:'7:30 PM',s:students[2],status:'upcoming'},
    {time:'8:30 PM',s:students[3],status:'upcoming'},
  ];
  const statusMap={done:{bg:'#F0FDF4',color:'#15803D',label:'✓ Done'},now:{bg:'#FFF7ED',color:'#F97316',label:'🔴 Now'},upcoming:{bg:'#EFF6FF',color:'#3B82F6',label:'Upcoming'}};
  today.innerHTML=sched.map(({time,s,status})=>{
    const st=statusMap[status];
    return \`<di`;

// Find full renderDashboard and replace
const dashStart = h.indexOf('function renderDashboard()');
const dashEnd = h.indexOf('\nfunction ', dashStart + 10);
const oldDash = h.substring(dashStart, dashEnd);

const newDash = `function renderDashboard(){
  const low=students.filter(s=>s.classes<=2).length;
  document.getElementById('dash-total').textContent=students.length;
  document.getElementById('dash-low').textContent=low;
  const today=document.getElementById('today-classes');
  const now=new Date();
  const dayIdx=now.getDay()===0?6:now.getDay()-1;
  const todaySlots=(typeof WEEKLY_SCHEDULE!=='undefined'?WEEKLY_SCHEDULE[dayIdx]:[]))||[];
  const currentHour=now.getHours();
  const currentMin=now.getMinutes();
  function timeToMins(t){const [hm,ampm]=t.split(' ');let [hr,mn]=hm.split(':').map(Number);if(ampm==='PM'&&hr!==12)hr+=12;if(ampm==='AM'&&hr===12)hr=0;return hr*60+mn;}
  const nowMins=currentHour*60+currentMin;
  const statusMap={done:{bg:'#F0FDF4',color:'#15803D',label:'✓ Done'},now:{bg:'#FFF7ED',color:'#F97316',label:'🔴 Now'},upcoming:{bg:'#EFF6FF',color:'#3B82F6',label:'Upcoming'}};
  today.innerHTML=todaySlots.length?todaySlots.map(slot=>{
    const s=students.find(x=>x.name===slot.student);
    const slotMins=timeToMins(slot.time);
    const status=nowMins>slotMins+slot.duration?'done':nowMins>=slotMins?'now':'upcoming';
    const st=statusMap[status];
    return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F3F4F6;">'
      +'<div style="font-weight:800;color:var(--purple);min-width:75px;">'+slot.time+'</div>'
      +'<div style="flex:1;"><div style="font-weight:700;">'+(s?s.name:slot.student)+'</div>'
      +'<div style="font-size:0.78rem;color:#888;">'+(s?s.nat:'')+' · '+slot.duration+' min</div></div>'
      +'<div style="font-size:0.78rem;font-weight:700;padding:3px 10px;border-radius:20px;background:'+st.bg+';color:'+st.color+';">'+st.label+'</div>'
      +'</div>';
  }).join(''):'<div style="color:#aaa;padding:20px;text-align:center;">No classes today</div>';
  const low2=students.filter(s=>s.classes<=2);
  const alerts=document.getElementById('dashboard-alerts');
  let html='';
  low2.forEach(s=>{html+='<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #F3F4F6;"><div style="font-size:1.2rem;">⚠️</div><div><div style="font-weight:700;">'+s.name+' — '+s.classes+' class'+(s.classes!==1?'es':'')+' left</div><div style="font-size:0.78rem;color:#888;">Package renewal needed</div></div></div>';});
  if(alerts)alerts.innerHTML=html||'<div style="color:#aaa;font-size:0.85rem;">No alerts</div>';
}`;

h = h.substring(0, dashStart) + newDash + h.substring(dashEnd);

// Fix renderSchedule
const schedStart = h.indexOf('function renderSchedule()');
const schedEnd = h.indexOf('\nfunction ', schedStart + 10);

const newSched = `function renderSchedule(){
  const list=document.getElementById('schedule-list');
  if(!list)return;
  const dayIdx=new Date().getDay()===0?6:new Date().getDay()-1;
  const todaySlots=(typeof WEEKLY_SCHEDULE!=='undefined'?WEEKLY_SCHEDULE[dayIdx]:[])||[];
  const now=new Date();
  const nowMins=now.getHours()*60+now.getMinutes();
  function timeToMins(t){const [hm,ampm]=t.split(' ');let [hr,mn]=hm.split(':').map(Number);if(ampm==='PM'&&hr!==12)hr+=12;if(ampm==='AM'&&hr===12)hr=0;return hr*60+mn;}
  const statusMap={done:{bg:'#F0FDF4',color:'#15803D',label:'✓ Done'},now:{bg:'#FFF7ED',color:'#F97316',label:'🔴 Now'},upcoming:{bg:'#EFF6FF',color:'#3B82F6',label:'Upcoming'}};
  list.innerHTML=todaySlots.length?todaySlots.map(slot=>{
    const s=students.find(x=>x.name===slot.student);
    const slotMins=timeToMins(slot.time);
    const status=nowMins>slotMins+slot.duration?'done':nowMins>=slotMins?'now':'upcoming';
    const st=statusMap[status];
    return '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:white;border-radius:12px;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">'
      +'<div style="font-weight:800;color:var(--purple);min-width:75px;">'+slot.time+'</div>'
      +'<div style="font-size:1.4rem;">'+(s?s.avatar:'👤')+'</div>'
      +'<div style="flex:1;"><div style="font-weight:700;">'+(s?s.name:slot.student)+'</div>'
      +'<div style="font-size:0.78rem;color:#888;">'+(s?s.nat:'')+' · '+slot.duration+' min</div></div>'
      +'<div style="font-size:0.78rem;font-weight:700;padding:3px 10px;border-radius:20px;background:'+st.bg+';color:'+st.color+';">'+st.label+'</div>'
      +'</div>';
  }).join(''):'<div style="color:#aaa;padding:20px;text-align:center;">No classes today</div>';
}`;

h = h.substring(0, schedStart) + newSched + h.substring(schedEnd);

fs.writeFileSync('index.html', h, 'utf8');
console.log('dashboard fixed:', h.includes('WEEKLY_SCHEDULE'));
console.log('schedule fixed:', h.includes('todaySlots'));