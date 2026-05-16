const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find full getTodaySlots
const idx = content.indexOf('function getTodaySlots');
console.log('=== Full getTodaySlots ===');
console.log(content.substring(idx, idx + 800));

// Find how ts-slots is read
let searchFrom = 0;
while(true) {
  const f = content.indexOf('ts-slots', searchFrom);
  if(f === -1) break;
  console.log('\n=== ts-slots at', f, '===');
  console.log(content.substring(f - 50, f + 200));
  searchFrom = f + 1;
}
