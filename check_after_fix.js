const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
console.log('\n=== Current page-earnings HTML ===');
let inEarnings = false, depth = 0, started = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="page-earnings"')) inEarnings = true;
  if (inEarnings) {
    console.log((i+1) + ': ' + JSON.stringify(lines[i]));
    const opens = (lines[i].match(/<div/g)||[]).length;
    const closes = (lines[i].match(/<\/div>/g)||[]).length;
    if (!started && opens > 0) started = true;
    depth += opens - closes;
    if (started && depth <= 0) { inEarnings = false; started = false; depth = 0; }
  }
}
console.log('\n=== Remaining pdf-records-list ===');
lines.forEach((l, i) => {
  if (l.includes('pdf-records-list')) console.log((i+1) + ': ' + JSON.stringify(l));
});
