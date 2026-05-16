// fix_save_students.js — node fix_save_students.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// Find line 878 — the students initialization line
let targetLine = -1;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i].replace(/\r/, '');
  if (l.startsWith('let students = JSON.parse(localStorage.getItem(\'ts-students\')')) {
    targetLine = i;
    break;
  }
}

console.log(`Found students init at line ${targetLine + 1}`);
if (targetLine === -1) { console.log('ERROR: not found'); process.exit(1); }

console.log('BEFORE:');
console.log(`  ${targetLine + 1}: ${lines[targetLine].replace(/\r/, '')}`);
console.log(`  ${targetLine + 2}: ${lines[targetLine + 1].replace(/\r/, '')}`);
console.log(`  ${targetLine + 3}: ${lines[targetLine + 2].replace(/\r/, '')}`);

// Insert one line after the students declaration:
// if ts-students was null, save the default data now so it persists
const newLine = "if(!localStorage.getItem('ts-students')) localStorage.setItem('ts-students', JSON.stringify(students));\r";
lines.splice(targetLine + 1, 0, newLine);

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('\nAFTER:');
const verify = fs.readFileSync('index.html', 'utf8').split('\n');
for (let i = targetLine; i < targetLine + 4; i++) {
  console.log(`  ${i + 1}: ${verify[i].replace(/\r/, '')}`);
}
console.log('\n=== done: true ===');
