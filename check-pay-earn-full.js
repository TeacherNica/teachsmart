const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Get full payments page
const i1 = h.indexOf('id="page-payments"');
const i2 = h.indexOf('id="page-earnings"');
const i3 = h.indexOf('id="page-', i2 + 1);

console.log('--- FULL PAYMENTS PAGE ---');
console.log(h.substring(i1, i2));
console.log('\n--- FULL EARNINGS PAGE ---');
console.log(h.substring(i2, i3));
