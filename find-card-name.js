const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const i = h.indexOf('s-card');
const j = h.indexOf('s.name', i);
console.log(h.substring(j-100, j+300));
