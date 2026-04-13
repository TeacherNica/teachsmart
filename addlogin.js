const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Fix getTodaySlots day index
// getDay(): 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
// WEEKLY_SCHEDULE: 0=Mon,1=Tue,2=Wed,3=Thu,4=Fri,5=Sat,6=Sun
const oldHelper = 'function getTodaySlots(){\n  const dayIdx=new Date().getDay()===0?6:new Date().getDay()-1;';
const newHelper = 'function getTodaySlots(){\n  const d=new Date().getDay();const dayIdx=d===0?6:d-1;';

h = h.replace(oldHelper, newHelper);

fs.writeFileSync('index.html', h, 'utf8');
console.log('fixed:', h.includes('const d=new Date().getDay()'));