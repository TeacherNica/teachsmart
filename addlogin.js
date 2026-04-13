const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldInit = "─── INIT ───\r\nrenderDashboard();\r\nrenderStudents();";
const newInit = "─── INIT ───\r\nrenderDashboard();\r\nrenderStudents();\r\nsetTimeout(function(){renderDashboard();},200);";

h = h.replace(oldInit, newInit);
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('setTimeout(function(){renderDashboard'));