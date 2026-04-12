const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
h = h.replace(/^\uFEFF/, '');

// Remove every login-related injection
h = h.replace(/<div id="lo"[\s\S]*?<\/script>/g, '');
h = h.replace(/<div id="login-overlay"[\s\S]*?<\/script>/g, '');
h = h.replace(/teachnica2026/g, '');
h = h.replace(/<script>if\(sessionStorage[\s\S]*?<\/script>/g, '');

// Add single clean redirect
const redirect = '<script>if(sessionStorage.getItem("ts_auth")!=="yes"){window.location.href="/login.html";}<\/script>';
h = h.replace('<body>', '<body>' + redirect);

fs.writeFileSync('index.html', h, 'utf8');
console.log('teachnica remaining:', h.split('teachnica2026').length - 1);
console.log('redirect added:', h.includes('login.html'));