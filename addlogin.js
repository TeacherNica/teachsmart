const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldSched = "  const sched=[\r\n    {time:'5:30 PM',s:students[0],status:'done'},\r\n    {time:'6:30 PM',s:students[1],status:'now'},\r\n    {time:'7:30 PM',s:students[2],status:'upcoming'},\r\n    {time:'8:30 PM',s:students[3],status:'upcoming'},\r\n  ];";

const count = h.split(oldSched).length - 1;
console.log('found:', count);

h = h.replaceAll(oldSched, '  const sched=getTodaySlots();');

fs.writeFileSync('index.html', h, 'utf8');
console.log('replaced:', !h.includes("students[0],status:'done'"));