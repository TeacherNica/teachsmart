const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('page-classroom');
console.log('=== Live Classroom page ===');
console.log(content.substring(idx, idx + 1000));
