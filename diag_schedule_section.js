const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf("Today's Schedule");
console.log('=== Today\'s Schedule section ===');
console.log(JSON.stringify(content.substring(idx - 100, idx + 800)));
