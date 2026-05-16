const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('ts-last-page');
let searchFrom = 0;
while(true) {
  const found = content.indexOf('ts-last-page', searchFrom);
  if(found === -1) break;
  console.log('=== ts-last-page at', found, '===');
  console.log(JSON.stringify(content.substring(found - 50, found + 200)));
  console.log('');
  searchFrom = found + 1;
}
