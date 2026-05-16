// diagnose_reports_conflict.js — node diagnose_reports_conflict.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// 1. Find ALL renderReports function definitions
console.log('--- ALL function renderReports definitions ---');
let defCount = 0;
lines.forEach((line, i) => {
  if (/function\s+renderReports\s*\(/.test(line)) {
    defCount++;
    console.log(`  [${defCount}] Line ${i + 1}: ${line.replace(/\r/,'').trim()}`);
    // show next 5 lines for context
    for(let j = i+1; j < i+6; j++) {
      console.log(`        ${j+1}: ${lines[j].replace(/\r/,'').trim()}`);
    }
  }
});

// 2. Show the FULL second renderReports (the PDF one near line 2584)
// Find it by looking for renderReports after line 1500
console.log('\n--- renderReports FULL BODY (line 1386 to end of function) ---');
let inFn = false;
let depth = 0;
let started = false;
for(let i = 1385; i < lines.length; i++) {
  const line = lines[i].replace(/\r/,'');
  if(i === 1385) { inFn = true; started = true; }
  if(inFn) {
    console.log(`  ${i+1}: ${line}`);
    for(const ch of line) {
      if(ch==='{') depth++;
      if(ch==='}') depth--;
    }
    if(started && depth === 0) { console.log('  [END OF FUNCTION]'); break; }
  }
}

// 3. Check what's around line 2560-2610 — is there another renderReports?
console.log('\n--- CONTEXT around PDF renderReports calls (2555-2615) ---');
for(let i = 2554; i < 2615 && i < lines.length; i++) {
  console.log(`  ${i+1}: ${lines[i].replace(/\r/,'')}`);
}

console.log('\n=== done ===');
