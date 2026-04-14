const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Find earnings page ending
const i = html.indexOf('id="earn-unpaid"');
console.log('earn-unpaid found:', i !== -1 ? 'YES' : 'NO');
if (i !== -1) console.log(html.substring(i-50, i+300));
