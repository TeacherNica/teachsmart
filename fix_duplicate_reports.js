const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html;

// ─── FIX 1: Remove orphan broken div on line 577 ───
// It's just: <div class="page"\n  with a newline after it
html = html.replace('<div class="page"\n<div class="page" id="page-earnings">', '<div class="page" id="page-earnings">');
// Also try \r\n version
html = html.replace('<div class="page"\r\n<div class="page" id="page-earnings">', '<div class="page" id="page-earnings">');

// ─── FIX 2: Remove the fake page-reports div (lines 605-613) ───
// Remove the comment + fake div block
const fakeBlock = `\n\n<!-- ─── REPORTS ─── -->\n<div class="page" id="page-reports">\n  <div class="page-header">\n    <div><div class="page-title"> 📁 PDF Reports</div><div class="page-sub">Upload and organize monthly PDF records</div></div>\n    <button class="btn btn-primary" onclick="openUploadModal()">📤 Upload PDFs</button>\n  </div>\n\n  <div id="reports-list" style="display:flex;flex-direction:column;gap:16px;"></div>\n</div>`;

if (html.includes(fakeBlock)) {
  html = html.replace(fakeBlock, '');
  console.log('✅ Removed fake page-reports block');
} else {
  // Try line-by-line removal as fallback
  const lines = html.split('\n');
  const out = [];
  let skip = false;
  let skipCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Detect start of fake block
    if (!skip && line.trim() === '<!-- ─── REPORTS ─── -->') {
      // Check next line is the fake page-reports
      if (lines[i+1] && lines[i+1].includes('id="page-reports"') && lines[i+2] && lines[i+2].includes('PDF Reports')) {
        skip = true;
        skipCount = 0;
        console.log('✅ Found fake block at line ' + (i+1) + ', removing...');
        continue;
      }
    }
    if (skip) {
      skipCount++;
      // Stop skipping after we hit the closing </div> of the fake block
      if (line.trim() === '</div>' && skipCount >= 6) {
        skip = false;
        console.log('✅ Finished removing fake block (' + skipCount + ' lines removed)');
        continue;
      }
      continue;
    }
    out.push(line);
  }
  html = out.join('\n');
}

// ─── VERIFY ───
const reportsDivCount = (html.match(/id="page-reports"/g) || []).length;
const orphanDiv = html.includes('<div class="page"\n') || html.includes('<div class="page"\r\n');
console.log('\n📊 id="page-reports" occurrences: ' + reportsDivCount + ' (should be 1)');
console.log('📊 Orphan div present: ' + orphanDiv + ' (should be false)');

if (html === original) {
  console.log('\n❌ NO CHANGES MADE — check line endings or text mismatch');
  process.exit(1);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\n✅ index.html saved. done: true');
