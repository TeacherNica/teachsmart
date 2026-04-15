const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Extract renderPayments
const pmStart = content.indexOf('function renderPayments');
const pmEnd = content.indexOf('\n}', pmStart) + 2;
console.log('=== renderPayments ===');
console.log(content.substring(pmStart, pmEnd));

// Extract renderEarnings
const erStart = content.indexOf('function renderEarnings');
const erEnd = content.indexOf('\n}', erStart) + 2;
console.log('\n=== renderEarnings ===');
console.log(content.substring(erStart, erEnd));
