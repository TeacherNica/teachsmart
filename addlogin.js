const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find WEEKLY_SCHEDULE block
const wsStart = h.indexOf('const WEEKLY_SCHEDULE = {');
const wsEnd = h.indexOf('\nfunction showDay', wsStart);
const wsBlock = h.substring(wsStart, wsEnd).trim();

// Remove from current location
h = h.substring(0, wsStart) + h.substring(wsEnd);

// Insert before // ─── INIT ───
h = h.replace('// ─── INIT ───', wsBlock + '\n// ─── INIT ───');

const a = h.indexOf('const WEEKLY_SCHEDULE');
const b = h.indexOf('renderDashboard();\nrenderStudents()');
console.log('WEEKLY at:', a, 'INIT at:', b, 'before:', a < b);

fs.writeFileSync('index.html', h, 'utf8');