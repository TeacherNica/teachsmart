const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('\n=== Lines around renderScheduleGrid cell function ===');
lines.forEach((l, i) => {
  if (l.includes('onclick') && l.includes('cell') && l.includes('name')) {
    console.log((i+1) + ': ' + JSON.stringify(l));
  }
});

// Find the cell() function in renderScheduleGrid
console.log('\n=== cell() function in renderScheduleGrid ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function cell(') || (lines[i].includes('cell(name') && lines[i].includes('function'))) {
    for (let j = i; j < Math.min(i+10, lines.length); j++) {
      console.log((j+1) + ': ' + JSON.stringify(lines[j]));
    }
  }
}

// Find any nav('students') in schedule rendering
console.log('\n=== All nav students references in schedule ===');
lines.forEach((l, i) => {
  if (l.includes("nav('students'") || l.includes('nav("students"')) {
    console.log((i+1) + ': ' + JSON.stringify(l));
  }
});
