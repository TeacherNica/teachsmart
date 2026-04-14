const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Check payments page
const i1 = h.indexOf('page-payments');
console.log('--- Payments Page ---');
console.log(h.substring(i1-20, i1+500));

// Check earnings page
const i2 = h.indexOf('page-earnings');
console.log('\n--- Earnings Page ---');
console.log(i2 === -1 ? 'NOT FOUND' : h.substring(i2-20, i2+500));
