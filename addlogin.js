const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Fix: only apply time-based status when viewing today
const oldStatus = "  today.innerHTML=sched.length?sched.map(({time,s,status})=>{";
const newStatus = "  today.innerHTML=sched.length?sched.map(({time,s,status})=>{\n    if(!isToday)status='upcoming';";

h = h.replace(oldStatus, newStatus);
fs.writeFileSync('index.html', h, 'utf8');
console.log('fixed:', h.includes("if(!isToday)status='upcoming'"));