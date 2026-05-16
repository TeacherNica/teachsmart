const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('return `<div class="schedule-item"');
console.log('=== Full schedule item template ===');
console.log(content.substring(idx, idx + 800));
