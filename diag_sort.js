const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('sortedKeys=Object.keys(groups).sort().reverse()');
console.log('Found at index:', idx);
console.log('Exact text around it:');
console.log(JSON.stringify(content.substring(idx - 50, idx + 100)));
