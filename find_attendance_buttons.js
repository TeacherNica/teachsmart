const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
console.log('\n=== Present/Absent/markAttendance references ===');
lines.forEach((l, i) => {
  if ((l.includes('Present') || l.includes('Absent') || l.includes('markAttendance')) && i > 800) {
    console.log((i+1) + ': ' + l.trim().substring(0, 150));
  }
});
