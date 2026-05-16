const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find ts-schedule
let searchFrom = 0;
while(true) {
  const found = content.indexOf('ts-schedule', searchFrom);
  if(found === -1) break;
  console.log('=== ts-schedule at', found, '===');
  console.log(content.substring(found - 50, found + 150));
  console.log('---');
  searchFrom = found + 1;
}

// Also find where WEEKLY_SCHEDULE is set
const varIdx = content.indexOf('var WEEKLY_SCHEDULE');
const letIdx = content.indexOf('let WEEKLY_SCHEDULE');
const constIdx = content.indexOf('const WEEKLY_SCHEDULE');
console.log('\nvar WEEKLY_SCHEDULE at:', varIdx);
console.log('let WEEKLY_SCHEDULE at:', letIdx);
console.log('const WEEKLY_SCHEDULE at:', constIdx);
