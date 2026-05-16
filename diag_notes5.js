const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Check how many times renderClassNotes is called
const calls = [];
let searchFrom = 0;
while(true) {
  const found = content.indexOf('renderClassNotes', searchFrom);
  if(found === -1) break;
  calls.push(found);
  console.log('renderClassNotes at', found, ':', content.substring(found - 30, found + 40));
  searchFrom = found + 1;
}
console.log('Total calls:', calls.length);

// Check if it's called on schedule tab show
console.log('\nshowPage exists:', content.includes('function showPage'));
const showPageIdx = content.indexOf('function showPage');
console.log(content.substring(showPageIdx, showPageIdx + 300));
