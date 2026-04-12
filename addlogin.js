const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Force clear localStorage on load and use the hardcoded students
const oldLoad = "let students = JSON.parse(localStorage.getItem('ts-students') || 'null') || ";
const newLoad = "localStorage.removeItem('ts-students'); let students = ";

h = h.replace(oldLoad, newLoad);

fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('localStorage.removeItem'));