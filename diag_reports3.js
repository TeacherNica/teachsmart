const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('function renderReports');
const end = content.indexOf('\nfunction ', idx + 1);
console.log('=== Full renderReports ===');
console.log(content.substring(idx, end));
