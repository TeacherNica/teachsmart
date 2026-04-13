const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Helper: get today's slots from WEEKLY_SCHEDULE
const helperFn = `
function getTodaySlots(){
  const dayIdx=new Date().getDay()===0?6:new Date().getDay()-1;
  if(typeof WEEKLY_SCHEDULE==='undefined')return[];
  return (WEEKLY_SCHEDULE[dayIdx]||[]).map(slot=>{
    const s=students.find(x=>x.name===slot.student)||{name:slot.student,nat:'',level:'',duration:slot.duration+' min',c1:'#A855F7',c2:'#6366F1'};
    const nowMins=new Date().getHours()*60+new Date().getMinutes();
    const t=slot.time.split(' ');const hm=t[0].split(':');let hr=parseInt(hm[0]);const mn=parseInt(hm[1]);
    if(t[1]==='PM'&&hr!==12)hr+=12;if(t[1]==='AM'&&hr===12)hr=0;
    const slotMins=hr*60+mn;
    const status=nowMins>slotMins+slot.duration?'done':nowMins>=slotMins?'now':'upcoming';
    return {time:slot.time, s:{...s,duration:slot.duration+' min'}, status};
  });
}`;

h = h.replace('function isUpcoming', helperFn + '\nfunction isUpcoming');

// Replace hardcoded sched in renderDashboard
const oldDashSched = `  const sched=[
    {time:'5:30 PM',s:students[0],status:'done'},
    {time:'6:30 PM',s:students[1],status:'now'},
    {time:'7:30 PM',s:students[2],status:'upcoming'},
    {time:'8:30 PM',s:students[3],status:'upcoming'},
  ];`;

const newDashSched = `  const sched=getTodaySlots();`;

h = h.replace(oldDashSched, newDashSched);

// Replace hardcoded sched in renderSchedule
const oldSchedSched = `  const sched=[
    {time:'5:30 PM',s:students[0],status:'done'},
    {time:'6:30 PM',s:students[1],status:'now'},
    {time:'7:30 PM',s:students[2],status:'upcoming'},
    {time:'8:30 PM',s:students[3],status:'upcoming'},
  ];`;

const newSchedSched = `  const sched=getTodaySlots();`;

h = h.replace(oldSchedSched, newSchedSched);

fs.writeFileSync('index.html', h, 'utf8');
console.log('helper:', h.includes('getTodaySlots'));
console.log('dash fixed:', h.split('getTodaySlots').length >= 3);