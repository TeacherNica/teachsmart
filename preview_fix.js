const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html;
const lines = html.split('\n');

// ─── Show lines 574-615 so we can see exactly what to remove ───
console.log('\n=== Lines 574-615 (before fix) ===');
lines.forEach((line, i) => {
  const n = i + 1;
  if (n >= 574 && n <= 615) console.log(n + ': ' + line);
});
