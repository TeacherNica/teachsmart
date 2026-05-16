const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('edit-pay-student');
console.log(content.substring(idx - 50, idx + 200));
