const fs = require('fs');
let raw = fs.readFileSync('index.html', 'utf8');
const hasCRLF = raw.includes('\r\n');
console.log('Line endings: ' + (hasCRLF ? 'CRLF (Windows)' : 'LF (Unix)'));

const lines = raw.split(/\r?\n/);
const out = [];
let i = 0;
let removedOrphan = false;
let removedFakeReports = false;

while (i < lines.length) {
  const line = lines[i];
  const trimmed = line.trim();

  // FIX 1: Remove orphan broken div (just: <div class="page"  with nothing after)
  if (trimmed === '<div class="page"' && !removedOrphan) {
    console.log('✅ Removed orphan div at line ' + (i+1));
    removedOrphan = true;
    i++;
    continue;
  }

  // FIX 2: Remove the fake page-reports block (PDF Reports title giveaway)
  if (trimmed === '<!-- ─── REPORTS ─── -->' && !removedFakeReports) {
    // Peek ahead to confirm it's the fake one
    const next = lines[i+1] ? lines[i+1] : '';
    const next2 = lines[i+2] ? lines[i+2] : '';
    if (next.includes('id="page-reports"') && next2.includes('PDF Reports')) {
      console.log('✅ Found fake page-reports block at line ' + (i+1) + ', removing...');
      // Skip lines until we hit the closing </div> of this block
      // The block is: comment + <div> + page-header div + button + empty + reports-list div + </div>
      let depth = 0;
      let started = false;
      i++; // skip the comment line
      while (i < lines.length) {
        const l = lines[i].trim();
        const opens = (l.match(/<div/g) || []).length;
        const closes = (l.match(/<\/div>/g) || []).length;
        if (!started && opens > 0) started = true;
        depth += opens - closes;
        i++;
        if (started && depth <= 0) break;
      }
      removedFakeReports = true;
      // Skip any blank lines immediately after
      while (i < lines.length && lines[i].trim() === '') {
        i++;
      }
      continue;
    }
  }

  out.push(line);
  i++;
}

const eol = hasCRLF ? '\r\n' : '\n';
const result = out.join(eol);

const count = (result.match(/id="page-reports"/g) || []).length;
console.log('\n📊 id="page-reports" occurrences: ' + count + ' (should be 1)');
console.log('📊 Orphan removed: ' + removedOrphan);
console.log('📊 Fake reports removed: ' + removedFakeReports);

if (!removedOrphan && !removedFakeReports) {
  console.log('\n❌ Nothing was removed — dumping lines 574-615 for debug:');
  lines.slice(573, 615).forEach((l, idx) => {
    console.log((574+idx) + ': ' + JSON.stringify(l));
  });
  process.exit(1);
}

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
