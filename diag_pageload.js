const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find showPage function
const idx = content.indexOf('function showPage');
if(idx !== -1) {
  console.log('=== showPage ===');
  console.log(content.substring(idx, idx + 600));
}

// Find the initial page load code
const initIdx = content.indexOf('localStorage.getItem(\'ts-last-page\')');
console.log('\n=== Initial page load ===');
console.log(content.substring(initIdx - 100, initIdx + 300));

// Find navigateTo or similar
const navIdx = content.indexOf('function navigateTo');
if(navIdx !== -1) {
  console.log('\n=== navigateTo ===');
  console.log(content.substring(navIdx, navIdx + 400));
}
