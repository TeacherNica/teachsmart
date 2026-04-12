const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

h = h.replace(
  "≈₱${RATE?Math.round(s.rate/RATE):'—'}",
  "≈₱${RATE?Math.round(s.rate*RATE):'—'}"
);

fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('s.rate*RATE'));