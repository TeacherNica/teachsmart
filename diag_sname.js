const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('s-name');
console.log('=== s-name div ===');
console.log(JSON.stringify(content.substring(idx - 10, idx + 200)));
