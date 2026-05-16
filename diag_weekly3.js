const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('const WEEKLY_SCHEDULE');
console.log('=== WEEKLY_SCHEDULE ===');
console.log(content.substring(idx, idx + 4000));
