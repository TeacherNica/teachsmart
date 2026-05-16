const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find page-schedule first
const schedPage = content.indexOf('id="page-schedule"');
// Then find Today's Schedule within that page
const todayIdx = content.indexOf("Today's Schedule", schedPage);
console.log('page-schedule at:', schedPage);
console.log('Today\'s Schedule at:', todayIdx);

// Show exact bytes
console.log('\n=== Exact content (JSON) ===');
console.log(JSON.stringify(content.substring(todayIdx - 50, todayIdx + 100)));

// Show the full section
console.log('\n=== Full section (readable) ===');
console.log(content.substring(todayIdx - 100, todayIdx + 800));
