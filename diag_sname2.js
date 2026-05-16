const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find all occurrences of s-name with onclick
let searchFrom = 0;
let count = 0;
while(true) {
  const found = content.indexOf('s-name', searchFrom);
  if (found === -1) break;
  const snippet = content.substring(found - 5, found + 200);
  if (snippet.includes('onclick') || snippet.includes('dblclick') || snippet.includes('s.name')) {
    console.log('=== occurrence', ++count, 'at index', found, '===');
    console.log(JSON.stringify(snippet));
    console.log('');
  }
  searchFrom = found + 1;
}
