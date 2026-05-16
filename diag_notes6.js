const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find renderClassNotes position
const fnIdx = content.indexOf('function renderClassNotes');
console.log('renderClassNotes at index:', fnIdx);

// Find nearest script tags before and after
let lastScriptOpen = -1;
let searchFrom = 0;
while(true) {
  const found = content.indexOf('<script', searchFrom);
  if(found === -1 || found > fnIdx) break;
  lastScriptOpen = found;
  searchFrom = found + 1;
}

let nextScriptClose = content.indexOf('</script>', fnIdx);

console.log('Nearest <script> before it:', lastScriptOpen);
console.log('Nearest </script> after it:', nextScriptClose);

if(lastScriptOpen < fnIdx && nextScriptClose > fnIdx) {
  console.log('✅ Function IS inside script tags');
} else {
  console.log('❌ Function is OUTSIDE script tags!');
}

// Show context around the function
console.log('\n=== 200 chars before function ===');
console.log(content.substring(fnIdx - 200, fnIdx));
