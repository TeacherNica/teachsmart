const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('page-materials');
const endIdx = content.indexOf('</div>\n  <!-- ', idx);
console.log('=== Full Materials page ===');
console.log(content.substring(idx, idx + 2000));
