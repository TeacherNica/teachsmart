const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
// Find all occurrences of teacher-chip
let i = 0;
let count = 0;
while ((i = h.indexOf('teacher-chip', i)) !== -1) {
  count++;
  console.log('--- Occurrence ' + count + ' at position ' + i + ' ---');
  console.log(h.substring(i-10, i+300));
  console.log('');
  i++;
}
