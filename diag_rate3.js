const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find live-rate display area
const idx = content.indexOf('live-rate');
let searchFrom = 0;
while(true) {
  const found = content.indexOf('live-rate', searchFrom);
  if(found === -1) break;
  console.log('=== live-rate at', found, '===');
  console.log(content.substring(found - 100, found + 200));
  console.log('---');
  searchFrom = found + 1;
}
