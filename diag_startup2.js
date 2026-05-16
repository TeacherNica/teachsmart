// diag_startup2.js — node diag_startup2.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// Show lines 2840-2890
console.log('--- STARTUP BLOCK ---');
for (let i = 2839; i < 2890 && i < lines.length; i++) {
  console.log(`  ${i + 1}: ${lines[i].replace(/\r/, '')}`);
}

// Show what nav items look like in HTML (to check onclick format)
console.log('\n--- NAV ITEMS HTML (first 6) ---');
let count = 0;
lines.forEach((line, i) => {
  if (/nav-item.*onclick.*nav\(/.test(line) && count < 6) {
    console.log(`  ${i + 1}: ${line.replace(/\r/, '').trim()}`);
    count++;
  }
});

console.log('\n=== done ===');
