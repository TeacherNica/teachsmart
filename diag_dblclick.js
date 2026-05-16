const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find ondblclick or dblclick references
const idx1 = content.indexOf('ondblclick');
console.log('=== ondblclick occurrences ===');
let searchFrom = 0;
while(true) {
  const found = content.indexOf('ondblclick', searchFrom);
  if (found === -1) break;
  console.log(content.substring(found - 20, found + 100));
  console.log('---');
  searchFrom = found + 1;
}

// Find openQuickRename
const idx2 = content.indexOf('openQuickRename');
console.log('\n=== openQuickRename ===');
console.log(content.substring(idx2, idx2 + 300));
