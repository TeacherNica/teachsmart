const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find getTodaySlots or similar function
const idx = content.indexOf('function getTodaySlots');
console.log('=== getTodaySlots ===');
console.log(content.substring(idx, idx + 600));

// Find renderSchedule/renderDashboard schedule part
const idx2 = content.indexOf('function renderSchedule(');
console.log('\n=== renderSchedule ===');
console.log(content.substring(idx2, idx2 + 600));
