const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find editPayment function
const start = content.indexOf('function editPayment');
console.log('=== editPayment function ===');
console.log(content.substring(start, start + 800));

// Also find the payment modal HTML
const modalStart = content.indexOf('Edit Payment');
console.log('\n=== Edit Payment modal HTML ===');
console.log(content.substring(modalStart - 200, modalStart + 600));
