const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

const i = h.indexOf('function saveProfile');
console.log('saveProfile found:', i !== -1 ? 'YES' : 'NO');
if (i !== -1) console.log(h.substring(i, i+400));

const j = h.indexOf('function loadProfile');
console.log('\nloadProfile found:', j !== -1 ? 'YES' : 'NO');
