const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf("Today's Schedule");
// Show 2000 chars from that point
console.log('=== Full section ===');
console.log(content.substring(idx - 100, idx + 2000));
