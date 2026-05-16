const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

let fnStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function renderStudents')) { fnStart = i; break; }
}

console.log('=== renderStudents (first 40 lines) ===');
for (let i = fnStart; i < fnStart + 40; i++) {
  console.log((i+1) + ': ' + lines[i]);
}
