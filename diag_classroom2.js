const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const pageStart = content.indexOf('page-classroom">');
const pageEnd = content.indexOf('<div class="page" id="page-', pageStart + 10);

console.log('Classroom page from', pageStart, 'to', pageEnd);
console.log('Length:', pageEnd - pageStart);
console.log('\nEnd context:');
console.log(content.substring(pageEnd - 50, pageEnd + 100));
