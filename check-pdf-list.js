const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

console.log('pdf-records-list found:', h.includes('pdf-records-list') ? 'YES' : 'NO');
console.log('Uploaded PDF Records found:', h.includes('Uploaded PDF Records') ? 'YES' : 'NO');

const i = h.indexOf('pdf-records-list');
if (i !== -1) console.log(h.substring(i-200, i+100));
