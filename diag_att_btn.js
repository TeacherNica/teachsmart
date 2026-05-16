const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find markDone or Present button in dashboard
const idx = content.indexOf('markAttendance');
let searchFrom = 0;
let count = 0;
while(true) {
  const found = content.indexOf('markAttendance', searchFrom);
  if(found === -1) break;
  const snippet = content.substring(found - 100, found + 150);
  if(snippet.includes('button') || snippet.includes('onclick')) {
    console.log('=== markAttendance button at', found, '===');
    console.log(snippet);
    console.log('---');
  }
  searchFrom = found + 1;
}
