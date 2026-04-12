const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const logoutBtn = `<button onclick="sessionStorage.removeItem('ts_auth');window.location.href='/login.html';" style="width:90%;margin:8px auto;display:block;padding:8px;border-radius:8px;border:none;background:#e94560;color:#fff;font-size:0.85rem;cursor:pointer;font-weight:bold">&#128274; Logout</button>`;

h = h.replace('</nav>', logoutBtn + '</nav>');
fs.writeFileSync('index.html', h, 'utf8');
console.log('logout added:', h.includes('Logout'));