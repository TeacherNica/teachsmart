const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const pageIdx = content.indexOf('id="page-reports"');
console.log('=== Full page-reports ===');
console.log(content.substring(pageIdx, pageIdx + 2000));
