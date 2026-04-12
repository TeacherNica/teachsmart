const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');
h = h.replace(/^\uFEFF/, '');

// Remove all previous login code
h = h.replace(/<div id="login-overlay"[\s\S]*?<\/script>/, '');

// Simple inline login - no external script dependencies
const inj = `<div id="lo" style="position:fixed;inset:0;background:#1a1a2e;display:flex;align-items:center;justify-content:center;z-index:999999"><div style="background:#16213e;border-radius:16px;padding:40px;text-align:center;width:320px"><h2 style="color:#fff;margin-bottom:16px">&#128274; TeachSmart</h2><p style="color:#aaa;margin-bottom:20px">Teacher access only</p><input id="lp" type="password" placeholder="Enter password" style="width:100%;padding:12px;border-radius:8px;border:1px solid #333;background:#0f3460;color:#fff;font-size:1rem;margin-bottom:12px;box-sizing:border-box" onkeydown="if(event.key==='Enter'){var v=this.value;if(v==='teachnica2026'){sessionStorage.setItem('a','1');document.getElementById('lo').remove();}else{document.getElementById('le').textContent='Wrong password.';}}" /><br/><button onclick="var v=document.getElementById('lp').value;if(v==='teachnica2026'){sessionStorage.setItem('a','1');document.getElementById('lo').remove();}else{document.getElementById('le').textContent='Wrong password.';}" style="width:100%;padding:12px;border-radius:8px;border:none;background:#e94560;color:#fff;font-size:1rem;cursor:pointer;font-weight:bold">LOGIN</button><p id="le" style="color:#e94560;margin-top:8px"></p></div></div><script>if(sessionStorage.getItem('a')==='1'){document.getElementById('lo').remove();}<\/script>`;

h = h.replace('<body>', '<body>' + inj);
fs.writeFileSync('index.html', h, 'utf8');
console.log('Done:', h.includes('teachnica2026'));