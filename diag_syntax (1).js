// diag_syntax.js — node diag_syntax.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

console.log('--- LINES 3008-3020 ---');
for (let i = 3007; i < 3020 && i < lines.length; i++) {
  console.log(`  ${i + 1}: ${lines[i].replace(/\r/, '')}`);
}
