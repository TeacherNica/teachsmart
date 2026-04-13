const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
h = h.replace('function isUpcoming', markFn + '\nfunction isUpcoming');
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('markAttendance'));
