const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Move WEEKLY_SCHEDULE before the INIT section
const wsStart = h.indexOf('const WEEKLY_SCHEDULE');
const wsEnd = h.indexOf('};', wsStart) + 2;
const wsBlock = h.substring(wsStart, wsEnd);

// Remove it from current location
h = h.substring(0, wsStart) + h.substring(wsEnd);

// Insert it before renderDashboard()
h = h.replace('// ─── INIT ───', wsBlock + '\n// ─── INIT ───');

fs.writeFileSync('index.html', h, 'utf8');

// Verify
const a = h.indexOf('const WEEKLY_SCHEDULE');
const b = h.indexOf('renderDashboard()');
console.log('WEEKLY before render:', a < b);