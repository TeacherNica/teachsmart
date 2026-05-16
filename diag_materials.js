const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('page-materials');
console.log('=== Materials page ===');
console.log(content.substring(idx, idx + 500));
