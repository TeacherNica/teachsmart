const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const start = content.indexOf('function saveQuickRename');
console.log('=== saveQuickRename ===');
console.log(content.substring(start, start + 500));

const start2 = content.indexOf('quickRenameModal');
console.log('\n=== quickRenameModal HTML ===');
console.log(content.substring(start2, start2 + 400));
