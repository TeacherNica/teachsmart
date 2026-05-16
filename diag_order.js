const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Finding init code location vs renderEarnings location ===');

const renderEarningsIdx = content.indexOf('function renderEarnings');
const initIdx = content.indexOf("const lastPage = localStorage.getItem('ts-last-page')");

console.log('renderEarnings defined at index:', renderEarningsIdx);
console.log('Init code at index:', initIdx);
console.log('Init is AFTER renderEarnings:', initIdx > renderEarningsIdx);

// Show 200 chars around init
console.log('\n=== Init context ===');
console.log(content.substring(initIdx - 100, initIdx + 400));
