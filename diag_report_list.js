const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find report-list
const idx = content.indexOf('report-list');
console.log('report-list at index:', idx);
console.log(content.substring(idx - 200, idx + 200));

// Find page-reports
const pageIdx = content.indexOf('id="page-reports"');
console.log('\npage-reports at:', pageIdx);
console.log(content.substring(pageIdx, pageIdx + 500));
