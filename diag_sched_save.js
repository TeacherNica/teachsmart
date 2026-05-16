const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find saveSchedule or how slots are saved
let searchFrom = 0;
while(true) {
  const found = content.indexOf('ts-sched', searchFrom);
  if(found === -1) break;
  console.log('=== ts-sched at', found, '===');
  console.log(content.substring(found - 50, found + 200));
  console.log('---');
  searchFrom = found + 1;
}

// Also check how slot assignments are saved
const saveSlot = content.indexOf('saveSlot');
console.log('\n=== saveSlot ===');
console.log(content.substring(saveSlot, saveSlot + 300));

const assignSlot = content.indexOf('assignSlot');
console.log('\n=== assignSlot ===');
console.log(content.substring(assignSlot, assignSlot + 300));
