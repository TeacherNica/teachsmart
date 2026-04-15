const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
let inEarnings = false;
let depth = 0;
let started = false;
console.log('\n=== Full page-earnings HTML ===');
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes('id="page-earnings"')) { inEarnings = true; }
  if (inEarnings) {
    console.log((i+1) + ': ' + l);
    const opens = (l.match(/<div/g)||[]).length;
    const closes = (l.match(/<\/div>/g)||[]).length;
    if (!started && opens > 0) started = true;
    depth += opens - closes;
    if (started && depth <= 0) { inEarnings = false; started = false; depth = 0; }
  }
}
console.log('\n=== renderEarnings functions ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function renderEarnings')) {
    for (let j = i; j < Math.min(i+30, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j]);
    }
  }
}
console.log('\n=== Sidebar earnings link ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes('earnings') && lines[i].includes('onclick')) {
    console.log((i+1) + ': ' + lines[i].trim());
  }
}
