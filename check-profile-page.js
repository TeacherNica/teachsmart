const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Check if profile page exists
const i = h.indexOf('page-profile');
console.log('page-profile found:', i !== -1 ? 'YES at position ' + i : 'NO');

// Check nav function handles profile
const j = h.indexOf("'profile'");
console.log("nav('profile') found:", j !== -1 ? 'YES' : 'NO');

// Check renderStudents handles profile page
const k = h.indexOf("page==='profile'");
console.log("profile render handler found:", k !== -1 ? 'YES' : 'NO');

// Show the nav function
const n = h.indexOf('function nav(page');
console.log('\n--- nav function ---');
console.log(h.substring(n, n+400));
