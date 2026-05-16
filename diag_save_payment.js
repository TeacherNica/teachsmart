const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const start = content.indexOf('function saveEditedPayment');
console.log('=== saveEditedPayment ===');
console.log(content.substring(start, start + 600));
