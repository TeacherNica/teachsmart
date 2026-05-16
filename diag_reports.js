const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find Reports nav item
let searchFrom = 0;
while(true) {
  const found = content.indexOf("nav('reports'", searchFrom);
  if(found === -1) break;
  console.log('=== Reports nav at', found, '===');
  console.log(content.substring(found - 100, found + 100));
  console.log('---');
  searchFrom = found + 1;
}

// Find page-reports
const pageIdx = content.indexOf('id="page-reports"');
console.log('\n=== page-reports at', pageIdx, '===');
console.log(content.substring(pageIdx, pageIdx + 200));
