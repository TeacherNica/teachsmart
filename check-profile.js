const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find profile card
const i1 = h.indexOf('Teacher');
console.log('--- Profile Card ---');
console.log(h.substring(i1-200, i1+300));

// Find login/user data
const i2 = h.indexOf('ts-user');
console.log('\n--- User Storage ---');
console.log(i2 === -1 ? 'NOT FOUND' : h.substring(i2-100, i2+300));
