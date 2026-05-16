const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find exchange rate related code
const idx = content.indexOf('exchange');
let searchFrom = 0;
while(true) {
  const found = content.indexOf('RATE', searchFrom);
  if(found === -1) break;
  const snippet = content.substring(found - 20, found + 100);
  if(snippet.includes('fetch') || snippet.includes('api') || snippet.includes('http')) {
    console.log('=== Found at', found, '===');
    console.log(snippet);
  }
  searchFrom = found + 1;
}

// Find fetch calls
console.log('\n=== All fetch calls ===');
searchFrom = 0;
while(true) {
  const found = content.indexOf('fetch(', searchFrom);
  if(found === -1) break;
  console.log(content.substring(found, found + 150));
  console.log('---');
  searchFrom = found + 1;
}
