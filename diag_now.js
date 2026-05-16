// diag_now.js — node diag_now.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

function show(label, start, end) {
  console.log(`\n--- ${label} ---`);
  for (let i = start - 1; i < end && i < lines.length; i++) {
    console.log(`  ${i + 1}: ${lines[i].replace(/\r/, '')}`);
  }
}

// 1. The full startup block at the bottom
show('FULL STARTUP BLOCK (2840-2900)', 2840, 2900);

// 2. The nav function
show('NAV FUNCTION (939-957)', 939, 957);

// 3. renderDashboard first 5 lines
show('renderDashboard START (959-966)', 959, 966);

console.log('\n=== done ===');
