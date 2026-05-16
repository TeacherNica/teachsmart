// diagnose_session.js — Run from your TeachSmart folder
// node diagnose_session.js

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const raw = fs.readFileSync(filePath, 'utf8');
const lines = raw.split('\n');

console.log('=== TeachSmart Session Diagnostic ===\n');
console.log(`Total lines: ${lines.length}`);
console.log(`File size: ${(raw.length / 1024).toFixed(1)}KB\n`);

// 1. Find the nav function definition
console.log('--- NAV FUNCTION ---');
lines.forEach((line, i) => {
  const stripped = line.replace(/\r/, '');
  if (/function\s+nav\s*\(|function\s+showPage\s*\(|function\s+navigate\s*\(/.test(stripped)) {
    console.log(`  Line ${i + 1}: ${stripped.trim()}`);
  }
});

// 2. Find where renderReports is called
console.log('\n--- renderReports() CALLS ---');
let reportsCalls = 0;
lines.forEach((line, i) => {
  if (/renderReports\s*\(/.test(line)) {
    reportsCalls++;
    console.log(`  Line ${i + 1}: ${line.replace(/\r/, '').trim()}`);
  }
});
if (reportsCalls === 0) console.log('  ❌ renderReports() is NEVER called!');

// 3. Find renderReports function definition
console.log('\n--- renderReports() DEFINITION ---');
lines.forEach((line, i) => {
  if (/function\s+renderReports\s*\(/.test(line)) {
    console.log(`  Line ${i + 1}: ${line.replace(/\r/, '').trim()}`);
  }
});

// 4. Find renderClassroom calls
console.log('\n--- renderClassroom() CALLS ---');
let classroomCalls = 0;
lines.forEach((line, i) => {
  if (/renderClassroom\s*\(/.test(line)) {
    classroomCalls++;
    console.log(`  Line ${i + 1}: ${line.replace(/\r/, '').trim()}`);
  }
});
if (classroomCalls === 0) console.log('  ❌ renderClassroom() is NEVER called!');

// 5. Find the nav/showPage function body — look for 'reports' string near page checks
console.log('\n--- LINES CONTAINING "reports" (in nav context) ---');
lines.forEach((line, i) => {
  const stripped = line.replace(/\r/, '').trim();
  if (/['"`]reports['"`]/.test(stripped) || /page.*reports|reports.*page/.test(stripped)) {
    console.log(`  Line ${i + 1}: ${stripped}`);
  }
});

// 6. Find the nav function body range
console.log('\n--- NAV FUNCTION BODY (searching for page=== checks) ---');
lines.forEach((line, i) => {
  const stripped = line.replace(/\r/, '').trim();
  if (/if\s*\(\s*page\s*===?\s*['"`]/.test(stripped) || /page\s*==\s*['"`]/.test(stripped)) {
    console.log(`  Line ${i + 1}: ${stripped}`);
  }
});

// 7. Script tag count
const scriptOpens = (raw.match(/<script/gi) || []).length;
const scriptCloses = (raw.match(/<\/script>/gi) || []).length;
console.log(`\n--- SCRIPT TAGS ---`);
console.log(`  <script> opens: ${scriptOpens}`);
console.log(`  </script> closes: ${scriptCloses}`);
console.log(scriptOpens === scriptCloses ? '  ✅ Balanced' : '  ❌ UNBALANCED!');

console.log('\n=== Done. Share these results for the fix. ===');
