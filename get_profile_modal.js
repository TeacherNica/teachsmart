const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
console.log('\n=== studentProfileModal HTML ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="studentProfileModal"')) {
    let depth = 0, started = false;
    for (let j = i; j < lines.length; j++) {
      console.log((j+1) + ': ' + lines[j].trim().substring(0, 130));
      const opens = (lines[j].match(/<div/g)||[]).length;
      const closes = (lines[j].match(/<\/div>/g)||[]).length;
      if (!started && opens > 0) started = true;
      depth += opens - closes;
      if (started && depth <= 0) break;
    }
    break;
  }
}
console.log('\n=== openStudentProfile function ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function openStudentProfile')) {
    for (let j = i; j < Math.min(i+70, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j]);
      if (j > i && lines[j].trim() === '}') break;
    }
    break;
  }
}
