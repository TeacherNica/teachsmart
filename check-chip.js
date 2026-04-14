const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const i = h.indexOf('teacher-chip');
console.log(h.substring(i-20, i+300));
