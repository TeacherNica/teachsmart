const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Remove previous logout button if any
h = h.replace(/<div style="padding:12px 16px;">[\s\S]*?<\/div>\n<!-- MAIN CONTENT -->/, '<!-- MAIN CONTENT -->');

// Inject logout right after Bangkok, Thailand line
const target = '🇹🇭 Bangkok, Thailand</div></div>';
const replacement = '🇹🇭 Bangkok, Thailand</div></div><button onclick="sessionStorage.removeItem(\'ts_auth\');window.location.href=\'/login.html\';" style="margin:8px 12px 0;padding:6px 12px;border-radius:6px;border:none;background:#e94560;color:#fff;font-size:0.78rem;cursor:pointer;font-weight:bold;display:block;width:calc(100% - 24px)">&#128274; Logout</button>';

h = h.replace(target, replacement);
fs.writeFileSync('index.html', h, 'utf8');
console.log('logout added:', h.includes('Logout'));