const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find the renderStudents function
const start = h.indexOf('function renderStudents');
const end = h.indexOf('function render', start + 1);
const block = h.substring(start, end);

// Find s.name in this block
let i = 0;
let count = 0;
while ((i = block.indexOf('s.name', i)) !== -1) {
  count++;
  console.log('--- Occurrence ' + count + ' ---');
  console.log(block.substring(i-100, i+150));
  console.log('');
  i++;
}
