const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

h = h.replace(/saveStudents\(\)/g, 'saveData()');

fs.writeFileSync('index.html', h, 'utf8');
console.log('fixed:', !h.includes('saveStudents()'));