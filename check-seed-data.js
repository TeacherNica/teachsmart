const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const i = h.indexOf('SEED DATA');
const j = h.indexOf('];', i);
const block = h.substring(i, j);

// Find all students
const nameMatches = block.match(/"id":\d+,"name":"[^"]+"/g);
const classMatches = block.match(/"classes":\d+,"total":\d+/g);

if (!nameMatches || !classMatches) {
  console.log('Could not find student data');
  process.exit(1);
}

console.log('Current seed data:');
nameMatches.forEach(function(n, idx) {
  const name = n.match(/"name":"([^"]+)"/)[1];
  const c = classMatches[idx];
  console.log(name + ' — ' + c);
});
console.log('\ndone: true');
