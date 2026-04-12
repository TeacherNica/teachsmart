const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const target = '<!-- MAIN CONTENT -->';
const logoutBtn = `<div style="padding:12px 16px;">
<button onclick="sessionStorage.removeItem('ts_auth');window.location.href='/login.html';" style="width:100%;padding:10px;border-radius:8px;border:none;background:#e94560;color:#fff;font-size:0.85rem;cursor:pointer;font-weight:bold;">&#128274; Logout</button>
</div>
<!-- MAIN CONTENT -->`;

h = h.replace(target, logoutBtn);
fs.writeFileSync('index.html', h, 'utf8');
console.log('logout added:', h.includes('Logout'));