const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('\n=== Lines 915-930 (schedule attendance button) ===');
lines.slice(914, 930).forEach((l, i) => console.log((915+i) + ': ' + JSON.stringify(l)));

console.log('\n=== Lines 1918-1952 (profile modal buttons) ===');
lines.slice(1917, 1952).forEach((l, i) => console.log((1918+i) + ': ' + JSON.stringify(l)));
