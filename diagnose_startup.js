// diagnose_startup.js — node diagnose_startup.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

function showLines(label, start, end) {
  console.log(`\n--- ${label} (lines ${start}-${end}) ---`);
  for (let i = start - 1; i < end && i < lines.length; i++) {
    console.log(`  ${i + 1}: ${lines[i].replace(/\r/, '')}`);
  }
}

// 1. Show lines 875-915 — the students init and early calls
showLines('STUDENTS INIT + EARLY CALLS', 875, 915);

// 2. Show the full startup block 2840-2870
showLines('STARTUP INIT BLOCK', 2840, 2870);

// 3. Find EVERY place renderDashboard is called
console.log('\n--- ALL renderDashboard() CALLS ---');
lines.forEach((line, i) => {
  if (/renderDashboard\s*\(/.test(line) && !/function\s+renderDashboard/.test(line)) {
    console.log(`  Line ${i+1}: ${line.replace(/\r/,'').trim()}`);
  }
});

// 4. Show the current renderDashboard first 5 lines
console.log('\n--- renderDashboard() CURRENT FIRST LINES ---');
lines.forEach((line, i) => {
  if (/function\s+renderDashboard\s*\(/.test(line)) {
    for(let j = i; j < i+8; j++) {
      console.log(`  ${j+1}: ${lines[j].replace(/\r/,'')}`);
    }
  }
});

// 5. Find the nav function call at startup (line 908 area)
showLines('NAV CALL AT STARTUP (905-915)', 905, 915);

// 6. Check if there's a second 'let students' or reassignment that blanks it
console.log('\n--- ALL students = assignments ---');
lines.forEach((line, i) => {
  const s = line.replace(/\r/,'').trim();
  if (/^(let|var|const)\s+students\s*=|students\s*=\s*\[/.test(s)) {
    console.log(`  Line ${i+1}: ${s.substring(0, 120)}`);
  }
});

console.log('\n=== done ===');
