const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Remove the setTimeout that resets dashboard
h = h.replace('setTimeout(function(){renderDashboard();},200);', '');

fs.writeFileSync('index.html', h, 'utf8');
console.log('removed:', !h.includes('setTimeout(function(){renderDashboard'));