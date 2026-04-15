const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Find markAttendance
let fnStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function markAttendance')) { fnStart = i; break; }
}

// Print 40 lines from start
console.log('=== markAttendance (lines ' + (fnStart+1) + ' onward) ===');
for (let i = fnStart; i < fnStart + 40; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
