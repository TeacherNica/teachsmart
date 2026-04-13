const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find both occurrences
const first = h.indexOf('function getTodaySlots');
const second = h.indexOf('function getTodaySlots', first + 10);

console.log('first at:', first, 'second at:', second);

// Remove the second one
const secondEnd = h.indexOf('\nfunction ', second + 10);
h = h.substring(0, second) + h.substring(secondEnd);

console.log('count after:', h.split('function getTodaySlots').length - 1);
fs.writeFileSync('index.html', h, 'utf8');