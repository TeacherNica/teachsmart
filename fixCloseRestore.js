const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

const htmlNorm = html.replace(/\r\n/g, '\n');

const OLD = "          } else if(slot.type==='avail'){\n            td.textContent='Available';td.style.background='#EAB308';td.style.color='#000';td.style.cursor='pointer';\n            td.onclick=function(){openSlotEditor(this,'avail');};\n          }";

const NEW = "          } else if(slot.type==='avail'){\n            td.textContent='Available';td.style.background='#EAB308';td.style.color='#000';td.style.cursor='pointer';\n            td.onclick=function(){openSlotEditor(this,'avail');};\n          } else if(slot.type==='close'){\n            td.textContent='Close';td.style.background='#EF4444';td.style.color='#fff';td.style.cursor='pointer';\n            td.onclick=function(){openSlotEditor(this,'close');};\n          }";

if(!htmlNorm.includes(OLD)){console.error('ERROR: target not found');process.exit(1);}
const result = htmlNorm.replace(OLD, NEW);
if(result.length < original - 100){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync('index.html', result, 'utf8');
console.log('done: true - grew by '+(result.length-original)+' bytes');
