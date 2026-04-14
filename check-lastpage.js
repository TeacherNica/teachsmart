const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const i = h.indexOf('ts-last-page');
let count = 0;
let pos = 0;
while ((pos = h.indexOf('ts-last-page', pos)) !== -1) {
  count++;
  console.log('--- Occurrence ' + count + ' ---');
  console.log(h.substring(pos-50, pos+200));
  console.log('');
  pos++;
}
