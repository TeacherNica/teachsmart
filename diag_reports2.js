const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('function renderReports');
console.log('=== renderReports ===');
console.log(content.substring(idx, idx + 1000));
