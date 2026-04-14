const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

console.log('\n=== Raw JSON of lines 600-618 ===');
lines.slice(599, 618).forEach((l, idx) => {
  console.log((600+idx) + ': ' + JSON.stringify(l));
});
