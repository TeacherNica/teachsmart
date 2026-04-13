const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Just add a deferred renderDashboard call after page loads
const oldInit = '// ─── INIT ───\nrenderDashboard();\nrenderStudents();';
const newInit = '// ─── INIT ───\nrenderDashboard();\nrenderStudents();\nsetTimeout(()=>{renderDashboard();showDay&&showDay(new Date().getDay()===0?6:new Date().getDay()-1);},100);';

h = h.replace(oldInit, newInit);
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('setTimeout(()=>{renderDashboard'));