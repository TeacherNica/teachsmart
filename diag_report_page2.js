const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Find page-reports full content
const pageStart = content.indexOf('id="page-reports"');
const pageEnd = content.indexOf('<div class="page" id="page-', pageStart + 10);
console.log('page-reports content:');
console.log(content.substring(pageStart, pageEnd));
