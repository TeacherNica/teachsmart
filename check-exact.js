const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const i = h.indexOf('id="earn-unpaid"');
const j = h.indexOf('<!-- ─── REPORTS ─── -->', i);
console.log(JSON.stringify(h.substring(i, j + 30)));
