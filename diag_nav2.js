const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('function nav(');
console.log('=== Full nav function ===');
console.log(content.substring(idx, idx + 800));

// Also show the init code
const initIdx = content.indexOf('renderDashboard();\nrenderStudents();');
console.log('\n=== Init code ===');
console.log(content.substring(initIdx, initIdx + 400));
