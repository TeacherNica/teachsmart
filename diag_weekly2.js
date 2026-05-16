const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find the actual definition (not usage)
let searchFrom = 0;
while(true) {
  const found = content.indexOf('WEEKLY_SCHEDULE', searchFrom);
  if(found === -1) break;
  const snippet = content.substring(found - 5, found + 50);
  // Look for assignment
  if(snippet.includes('=') && (snippet.includes('[') || snippet.includes('{'))) {
    console.log('=== Found at index', found, '===');
    console.log(content.substring(found, found + 2000));
    break;
  }
  searchFrom = found + 1;
}
