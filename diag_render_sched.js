const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('function renderSchedule(');
console.log('=== renderSchedule ===');
console.log(content.substring(idx, idx + 2000));
