// fix_dashboard.js — node fix_dashboard.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

console.log('=== Dashboard Fix ===\n');

// Show lines 903-912 to confirm what's there
console.log('BEFORE — lines 903-912:');
for(let i = 902; i < 912; i++) {
  console.log(`  ${i+1}: ${lines[i].replace(/\r/,'')}`);
}

// Show lines 2850-2856 to confirm init block
console.log('\nBEFORE — lines 2850-2856:');
for(let i = 2849; i < 2856; i++) {
  console.log(`  ${i+1}: ${lines[i].replace(/\r/,'')}`);
}

// THE FIX:
// renderDashboard() at line 906 fires too early.
// We replace it with a comment so the real call at line 2853 is the only one.
// Also ensure renderDashboard at line 2853 reads fresh from localStorage.

// Fix 1: Remove early renderDashboard() at line 906
// (line index 905)
const line906 = lines[905].replace(/\r/,'');
if(line906.trim() === 'renderDashboard();') {
  lines[905] = lines[905].replace('renderDashboard();', '// renderDashboard() called in init block below');
  console.log('\n✅ Fix 1 applied: Removed early renderDashboard() at line 906');
} else {
  console.log(`\n⚠️  Line 906 is not what expected: "${line906}" — check manually`);
}

// Fix 2: Update renderDashboard() to always read fresh from localStorage
// Find the function start (line 959, index 958)
const line960 = lines[959].replace(/\r/,'');
if(line960.trim() === 'const low=students.filter(s=>s.classes<=3).length;') {
  // Insert a fresh read at the top of renderDashboard
  // Replace line 960 with a fresh localStorage read + the original line
  const eol = lines[959].includes('\r') ? '\r\n' : '\n';
  lines[959] = '  students=JSON.parse(localStorage.getItem(\'ts-students\')||\'[]\');\r\n  const low=students.filter(s=>s.classes<=3).length;';
  console.log('✅ Fix 2 applied: renderDashboard now refreshes students from localStorage first');
} else {
  console.log(`\n⚠️  Line 960 is not what expected: "${line960}" — check manually`);
}

// Write the fixed file
fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('\n✅ index.html saved.');

// Verify
const verify = fs.readFileSync('index.html', 'utf8').split('\n');
console.log('\nAFTER — lines 903-912:');
for(let i = 902; i < 913; i++) {
  console.log(`  ${i+1}: ${verify[i] ? verify[i].replace(/\r/,'') : ''}`);
}
console.log('\nAFTER — lines 958-963:');
for(let i = 957; i < 964; i++) {
  console.log(`  ${i+1}: ${verify[i] ? verify[i].replace(/\r/,'') : ''}`);
}

console.log('\n=== done: true ===');
