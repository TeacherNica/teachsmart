const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const start = content.indexOf('function renderClassNotes');
console.log('=== renderClassNotes ===');
console.log(content.substring(start, start + 1500));
