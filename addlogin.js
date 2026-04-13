const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldLine = "  today.innerHTML=sched.map(({time,s,status})=>{";
const newLine = "  today.innerHTML=sched.map(({time,s,status})=>{\r\n    if(!isToday) status='upcoming';";

h = h.replace(oldLine, newLine);
fs.writeFileSync('index.html', h, 'utf8');
console.log('fixed:', h.includes("if(!isToday) status='upcoming'"));