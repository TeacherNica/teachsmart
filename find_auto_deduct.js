const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
console.log('\n=== Lines 1095-1110 ===');
lines.slice(1094, 1110).forEach((l, i) => console.log((1095+i) + ': ' + JSON.stringify(l)));
