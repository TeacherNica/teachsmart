const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find renderDashboard and look for isToday
const idx = content.indexOf('function renderDashboard');
console.log('=== renderDashboard isToday ===');
const fn = content.substring(idx, idx + 3000);
// Find isToday
const itIdx = fn.indexOf('isToday');
console.log(fn.substring(itIdx - 100, itIdx + 300));
