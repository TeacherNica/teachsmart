const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find openSlotEditor and saveSlotAssignment
const idx = content.indexOf('function openSlotEditor');
console.log('=== openSlotEditor ===');
console.log(content.substring(idx, idx + 400));

// Find where slot changes are saved
const saveIdx = content.indexOf('function saveSlotAssign');
console.log('\n=== saveSlotAssign ===');
console.log(content.substring(saveIdx, saveIdx + 500));

// Find localStorage schedule saves
let searchFrom = 0;
let found = false;
while(true) {
  const f = content.indexOf('localStorage.setItem', searchFrom);
  if(f === -1) break;
  const snippet = content.substring(f, f + 100);
  if(snippet.includes('sched') || snippet.includes('slot') || snippet.includes('schedule')) {
    console.log('\n=== Schedule localStorage save ===');
    console.log(snippet);
    found = true;
  }
  searchFrom = f + 1;
}
if(!found) console.log('\nNo schedule localStorage saves found!');
