const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
console.log('\n=== markAttendance function ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function markAttendance')) {
    for (let j = i; j < Math.min(i+50, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j]);
      if (j > i && lines[j].trim() === '}') break;
    }
  }
}
console.log('\n=== Lines 1050-1170 ===');
lines.slice(1049, 1170).forEach((l, idx) => {
  console.log((1050+idx) + ': ' + l);
});
