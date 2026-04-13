const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Add navigation state and updated getTodaySlots to accept a day param
const oldHelper = `function getTodaySlots(){
  const d=new Date().getDay();const dayIdx=d===0?6:d-1;`;

const newHelper = `let dashDayOffset=0;
function getTodaySlots(offset){
  const d=new Date().getDay();
  let dayIdx=(d===0?6:d-1);
  dayIdx=(dayIdx+(offset||0)+7)%7;`;

h = h.replace(oldHelper, newHelper);

// Update renderDashboard to pass offset and show nav
const oldDashCall = `  const sched=getTodaySlots();`;
const newDashCall = `  const sched=getTodaySlots(dashDayOffset);
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
    +'</div>';`;

h = h.replaceAll(oldDashCall, newDashCall);

// Add id to today-classes header
h = h.replace(
  '<div class="card-title">🗓️ Today\'s Classes</div>',
  '<div class="card-title" id="today-classes-header" style="display:flex;justify-content:space-between;align-items:center;">🗓️ Today\'s Classes</div>'
);

fs.writeFileSync('index.html', h, 'utf8');
console.log('nav added:', h.includes('dashDayOffset'));
console.log('header:', h.includes('today-classes-header'));