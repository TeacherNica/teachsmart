const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Updating exchange rate API ===');

const oldAPI = `fetch('https://api.exchangerate-api.com/v4/latest/CNY')
  .then(r=>r.json())
  .then(d=>{
    RATE=d.rates.PHP;
    renderStudents();
    renderP`;

// Find and show full fetch block
const idx = content.indexOf("fetch('https://api.exchangerate-api.com/v4/latest/CNY')");
console.log('Found at index:', idx);
console.log('Context:', content.substring(idx, idx + 300));
