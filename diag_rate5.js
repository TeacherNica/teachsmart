const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing exchange rate widget display ===');

// Find and show more of the widget
const idx = content.indexOf('Live Exchange Rate');
console.log('Full widget:');
console.log(content.substring(idx - 50, idx + 800));
