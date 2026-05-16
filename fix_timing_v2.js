const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Increasing timeout to 1000ms ===');

// Replace 300 with 1000
const old = '  }, 300);\r\n}';
const newt = '  }, 1000);\r\n}';

if(!content.includes(old)){
  console.error('❌ Could not find timeout!');
  process.exit(1);
}

content = content.replace(old, newt);
console.log('✅ Timeout increased to 1000ms');

fs.writeFileSync('index.html', content, 'utf8');
console.log('done: true');
