const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldRate = 'const RATE = 0.1247;';
const newRate = `let RATE = 0.1247;
fetch('https://api.exchangerate-api.com/v4/latest/CNY')
  .then(r=>r.json())
  .then(d=>{
    RATE=d.rates.PHP;
    renderStudents();
    renderPayments();
    const el=document.getElementById('live-rate');
    if(el)el.textContent='¥1 = ₱'+RATE.toFixed(4);
  }).catch(()=>{});`;

h = h.replace(oldRate, newRate);
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('exchangerate-api'));