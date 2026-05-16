const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find WEEKLY_SCHEDULE
const idx = content.indexOf('WEEKLY_SCHEDULE');
console.log('=== WEEKLY_SCHEDULE definition ===');
console.log(content.substring(idx, idx + 3000));
