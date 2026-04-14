const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('\n=== All page div openings and closings (lines 550-700) ===');
lines.forEach((line, i) => {
  const lineNum = i + 1;
  if (lineNum < 550 || lineNum > 750) return;
  const t = line.trim();
  if (t.includes('class="page"') || t.includes("class='page'") ||
      t === '</div>' || t.startsWith('<div') || t.includes('id="page-')) {
    console.log('Line ' + lineNum + ': ' + t.substring(0, 120));
  }
});

console.log('\n=== All page-* div IDs in file ===');
lines.forEach((line, i) => {
  if (line.includes('id="page-')) {
    console.log('Line ' + (i+1) + ': ' + line.trim().substring(0, 100));
  }
});
