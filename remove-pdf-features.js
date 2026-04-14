const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// ─── 1. Remove PDF Records button from Earnings page header ───
html = html.replace(
  /\s*<button class="btn btn-primary" onclick="openUploadModal\(\)">📁 PDF Records<\/button>/g, ''
);
console.log('✓ Removed PDF Records button');

// ─── 2. Remove PDF Records list section from Earnings page ───
html = html.replace(
  /\r?\n\s*<!-- PDF Records List -->[\s\S]*?<\/div>\s*<\/div>/,
  ''
);
console.log('✓ Removed PDF Records list section');

// ─── 3. Remove Upload PDF Modal ───
html = html.replace(
  /\r?\n<!-- Upload Modal -->[\s\S]*?<!-- Payment Detail Modal -->/,
  '\n<!-- Payment Detail Modal -->'
);
console.log('✓ Removed Upload PDF Modal');

// ─── 4. Remove all PDF JS script blocks ───
html = html.replace(/<script>\s*\/\/ ─── PDF REPORTS ───[\s\S]*?<\/script>/g, '');
html = html.replace(/<script>\s*\/\/ ─── PDF RECORDS[\s\S]*?<\/script>/g, '');
html = html.replace(/<script>\s*\/\/ ─── PDF RECORDS \(CLEAN\)[\s\S]*?<\/script>/g, '');
console.log('✓ Removed PDF JS script blocks');

// ─── 5. Remove Reports nav item ───
html = html.replace(
  /\s*<div class="nav-item" onclick="nav\('reports',this\)">[\s\S]*?<\/div>/g, ''
);
console.log('✓ Removed Reports nav item');

// ─── 6. Remove Reports page HTML ───
html = html.replace(
  /\r?\n<!-- ─── REPORTS ─── -->[\s\S]*?(?=<!-- ─── MATERIALS ─── -->)/,
  '\n'
);
console.log('✓ Removed Reports page');

// ─── 7. Remove renderReports from nav handler ───
html = html.replace(/\s*if\(page===.reports.\)renderReports\(\);/g, '');
console.log('✓ Removed renderReports nav call');

// ─── 8. Remove renderPDFRecords from nav handler ───
html = html.replace(
  "if(page==='earnings'){renderEarnings();renderPDFRecords();}",
  "if(page==='earnings')renderEarnings();"
);
html = html.replace(/renderPDFRecords\(\);/g, '');
console.log('✓ Removed renderPDFRecords calls');

// ─── 9. Remove injected PDF functions script ───
html = html.replace(/<script>\s*\/\/ ─── PDF RECORDS ───[\s\S]*?<\/script>/g, '');
console.log('✓ Removed injected PDF functions');

// ─── 10. Verify Earnings page is clean ───
const earningsStart = html.indexOf('id="page-earnings"');
const earningsEnd = html.indexOf('<!-- ─── MATERIALS ─── -->', earningsStart);
const earningsContent = html.substring(earningsStart, earningsEnd);
console.log('\n=== EARNINGS TAB CONTENT ===');
console.log(earningsContent.substring(0, 500));

fs.writeFileSync(indexPath, html, 'utf8');
console.log('\ndone: true');
