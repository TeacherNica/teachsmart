const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('Live Exchange Rate');
console.log('=== Live Exchange Rate widget ===');
console.log(content.substring(idx - 50, idx + 600));
