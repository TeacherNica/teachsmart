const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('\n=== slot-editor-overlay full HTML ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="slot-editor-overlay"')) {
    let depth = 0, started = false;
    for (let j = i; j < lines.length; j++) {
      console.log((j+1) + ': ' + lines[j].trim().substring(0, 130));
      depth += (lines[j].match(/<div/g)||[]).length - (lines[j].match(/<\/div>/g)||[]).length;
      if (!started && lines[j].includes('<div')) started = true;
      if (started && depth <= 0) break;
    }
    break;
  }
}
