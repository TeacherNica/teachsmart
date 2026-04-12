const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const loginBlock = <style id="login-overlay-style">
#login-overlay{position:fixed;inset:0;background:#1a1a2e;display:flex;align-items:center;justify-content:center;z-index:99999;flex-direction:column}
#login-box{background:#16213e;border-radius:16px;padding:40px;box-shadow:0 8px 32px rgba(0,0,0,0.5);text-align:center;width:320px}
#login-box h2{color:#fff;margin-bottom:8px;font-size:1.5rem}
#login-box p{color:#aaa;margin-bottom:24px;font-size:0.9rem}
#login-pass{width:100%;padding:12px 16px;border-radius:8px;border:1px solid #333;background:#0f3460;color:#fff;font-size:1rem;margin-bottom:16px;box-sizing:border-box}
#login-btn{width:100%;padding:12px;border-radius:8px;border:none;background:#e94560;color:#fff;font-size:1rem;cursor:pointer;font-weight:bold}
#login-btn:hover{background:#c73652}
#login-err{color:#e94560;font-size:0.85rem;margin-top:-8px}
</style>
<div id="login-overlay">
  <div id="login-box">
    <h2>🔐 TeachSmart</h2>
    <p>Teacher access only</p>
    <input id="login-pass" type="password" placeholder="Enter password" onkeydown="if(event.key==='Enter')doLogin()" autofocus />
    <button id="login-btn" onclick="doLogin()">LOGIN</button>
    <p id="login-err"></p>
  </div>
</div>
<script>
(function(){if(sessionStorage.getItem('ts_auth')==='yes'){document.getElementById('login-overlay').style.display='none';}})();
function doLogin(){var pw=document.getElementById('login-pass').value;if(pw==='teachnica2026'){sessionStorage.setItem('ts_auth','yes');document.getElementById('login-overlay').style.display='none';}else{document.getElementById('login-err').textContent='Wrong password. Try again.';document.getElementById('login-pass').value='';}}
<\/script>;

html = html.replace('<body>', '<body>' + loginBlock);
fs.writeFileSync('index.html', html);
console.log('Done! Login added.');
