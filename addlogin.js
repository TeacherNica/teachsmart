const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Fix rate display: show RMB rate + live PHP equivalent
const oldRate = '<div><div class="s-stat-val" style="color:var(--purple)">₱${s.rate}</div><div class="s-stat-lbl">Per Class</div></div>';
const newRate = '<div><div class="s-stat-val" style="color:var(--purple)">¥${s.rate}</div><div class="s-stat-lbl">≈₱${RATE?Math.round(s.rate/RATE):\'—\'}</div></div>';

h = h.replace(oldRate, newRate);
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('¥${s.rate}'));