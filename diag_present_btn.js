const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find the schedule-item rendering with Present button
const idx = content.indexOf('schedule-item');
let searchFrom = 0;
while(true) {
  const found = content.indexOf('schedule-item', searchFrom);
  if(found === -1) break;
  const snippet = content.substring(found - 20, found + 500);
  if(snippet.includes('Present') || snippet.includes('markAttendance')) {
    console.log('=== Found at', found, '===');
    console.log(snippet);
    console.log('---');
  }
  searchFrom = found + 1;
}
