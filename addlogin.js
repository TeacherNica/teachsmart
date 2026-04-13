const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find the second script block start
const scripts = h.split('<script>');
// scripts[0] = before first script
// scripts[1] = first script block content
// scripts[2] = second script block content

const wsStart = scripts[2].indexOf('const WEEKLY_SCHEDULE');
const wsEnd = scripts[2].indexOf('\nfunction showDay') ;
const wsBlock = scripts[2].substring(wsStart, wsEnd).trim();

// Remove WEEKLY_SCHEDULE from second script block
scripts[2] = scripts[2].substring(0, wsStart) + scripts[2].substring(wsEnd);

// Add WEEKLY_SCHEDULE to end of first script block (before closing </script>)
scripts[1] = scripts[1].replace('// ─── INIT ───', wsBlock + '\n// ─── INIT ───');

h = scripts.join('<script>');

fs.writeFileSync('index.html', h, 'utf8');

const a = h.indexOf('const WEEKLY_SCHEDULE');
const b = h.indexOf('// ─── INIT ───');
console.log('WEEKLY before INIT:', a < b);
console.log('script blocks:', h.split('<script>').length - 1);