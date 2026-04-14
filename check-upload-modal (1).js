const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

const i = h.indexOf('function openUploadModal');
console.log('openUploadModal found:', i !== -1 ? 'YES at position ' + i : 'NO');

// Show what's around it
if (i !== -1) console.log(h.substring(i-200, i+100));

// Check file ending
console.log('\n--- File ending ---');
console.log(h.slice(-300));
