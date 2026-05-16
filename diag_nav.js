const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('function nav(');
console.log('=== nav function ===');
console.log(content.substring(idx, idx + 600));
