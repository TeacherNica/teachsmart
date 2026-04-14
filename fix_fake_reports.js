const fs = require('fs');
let raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
const out = [];
let i = 0;
let removed = false;

while (i < lines.length) {
  const trimmed = lines[i].trim();

  // Detect the fake reports block by its comment line
  if (trimmed === '<!-- \u2500\u2500\u2500 REPORTS \u2500\u2500\u2500 -->' && !removed) {
    // Confirm next line is the fake page-reports (not the real one later)
    const next = (lines[i+1] || '').trim();
    if (next === '<div class="page" id="page-reports">') {
      console.log('\u2705 Found fake page-reports block at line ' + (i+1) + ', removing...');
      // Skip the comment line, then skip until the closing </div>
      i++; // skip comment
      let depth = 0;
      let started = false;
      while (i < lines.length) {
        const l = lines[i].trim();
        const opens = (l.match(/<div/g) || []).length;
        const closes = (l.match(/<\/div>/g) || []).length;
        if (!started && opens > 0) started = true;
        depth += opens - closes;
        i++;
        if (started && depth <= 0) break;
      }
      removed = true;
      continue;
    }
  }

  out.push(lines[i]);
  i++;
}

const eol = '\r\n';
const result = out.join(eol);
const count = (result.match(/id="page-reports"/g) || []).length;
console.log('\n\uD83D\uDCCA id="page-reports" occurrences: ' + count + ' (should be 1)');
console.log('\uD83D\uDCCA Fake block removed: ' + removed);

if (!removed) {
  console.log('\n\u274C Not removed. Dumping lines 602-608:');
  lines.slice(601, 608).forEach((l, idx) => console.log((602+idx) + ': ' + JSON.stringify(l)));
  process.exit(1);
}

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n\u2705 index.html saved. done: true');
