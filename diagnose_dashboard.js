// diagnose_dashboard.js — node diagnose_dashboard.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

function showLines(label, start, end) {
  console.log(`\n--- ${label} (lines ${start}-${end}) ---`);
  for (let i = start - 1; i < end && i < lines.length; i++) {
    console.log(`  ${i + 1}: ${lines[i].replace(/\r/, '')}`);
  }
}

// 1. Full renderDashboard function
console.log('--- renderDashboard FULL BODY ---');
let inFn = false, depth = 0, started = false;
for(let i = 0; i < lines.length; i++) {
  const line = lines[i].replace(/\r/,'');
  if(/function\s+renderDashboard\s*\(/.test(line)) { inFn = true; started = false; }
  if(inFn) {
    console.log(`  ${i+1}: ${line}`);
    for(const ch of line) {
      if(ch==='{') { depth++; started = true; }
      if(ch==='}') depth--;
    }
    if(started && depth === 0) { console.log('  [END]'); break; }
  }
}

// 2. Where is the students array initialized/loaded?
console.log('\n--- students ARRAY INIT ---');
lines.forEach((line, i) => {
  const s = line.replace(/\r/,'').trim();
  if(/^var\s+students|^let\s+students|^const\s+students/.test(s)) {
    console.log(`  Line ${i+1}: ${s}`);
  }
});

// 3. Where is students loaded from localStorage?
console.log('\n--- students LOADED FROM localStorage ---');
lines.forEach((line, i) => {
  const s = line.replace(/\r/,'').trim();
  if(/students\s*=\s*JSON\.parse|students\s*=\s*localStorage/.test(s)) {
    console.log(`  Line ${i+1}: ${s}`);
  }
});

// 4. What happens on page load / DOMContentLoaded / window.onload?
console.log('\n--- PAGE LOAD / INIT CALLS ---');
lines.forEach((line, i) => {
  const s = line.replace(/\r/,'').trim();
  if(/DOMContentLoaded|window\.onload|window\.addEventListener.*load|\(\s*function\s*\(\s*\)\s*\{/.test(s) ||
     /^renderDashboard\(\)|^nav\(|initApp|loadApp/.test(s)) {
    console.log(`  Line ${i+1}: ${s}`);
  }
});

// 5. The startup IIFE / init block (around line 2850-2870)
showLines('STARTUP IIFE', 2840, 2870);

// 6. dash-total and dash-low element context
console.log('\n--- dash-total / dash-low usage ---');
lines.forEach((line, i) => {
  if(/dash-total|dash-low/.test(line)) {
    console.log(`  Line ${i+1}: ${line.replace(/\r/,'').trim()}`);
  }
});

console.log('\n=== done ===');
