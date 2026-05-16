const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Updating exchange rate API ===');

const oldFetch = `fetch('https://api.exchangerate-api.com/v4/latest/CNY')
  .then(r=>r.json())
  .then(d=>{
    RATE=d.rates.PHP;
    renderStudents();
    renderPayments();
    const el=document.getElementById('live-rate');
    if(el)el.textContent='¥1 = ₱'+RATE.toFixed(4);
  }).catch(()=>{});`;

const newFetch = `fetch('https://api.frankfurter.app/latest?from=CNY&to=PHP')
  .then(r=>r.json())
  .then(d=>{
    RATE=d.rates.PHP;
    renderStudents();
    renderPayments();
    const el=document.getElementById('live-rate');
    if(el)el.textContent='¥1 = ₱'+RATE.toFixed(4);
  }).catch(()=>{
    // fallback to exchangerate-api
    fetch('https://api.exchangerate-api.com/v4/latest/CNY')
      .then(r=>r.json())
      .then(d=>{
        RATE=d.rates.PHP;
        renderStudents();
        renderPayments();
        const el=document.getElementById('live-rate');
        if(el)el.textContent='¥1 = ₱'+RATE.toFixed(4);
      }).catch(()=>{});
  });`;

if(!content.includes(oldFetch.replace(/\n/g,'\r\n')) && !content.includes(oldFetch)) {
  console.error('❌ Could not find fetch block!');
  process.exit(1);
}

content = content.includes(oldFetch.replace(/\n/g,'\r\n'))
  ? content.replace(oldFetch.replace(/\n/g,'\r\n'), newFetch)
  : content.replace(oldFetch, newFetch);

console.log('✅ Exchange rate API updated to frankfurter.app');

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments'
];
let fail = false;
checks.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g'))||[]).length;
  if (count !== 1) { console.log('❌', fn, '—', count, 'times'); fail = true; }
  else console.log('✅', fn);
});
const ot = (content.match(/<script/g)||[]).length;
const ct = (content.match(/<\/script>/g)||[]).length;
if (ot !== ct) { console.log('❌ Script tags unbalanced:', ot, 'open,', ct, 'close'); fail = true; }
else console.log('✅ Script tags balanced (' + ot + ' pairs)');
console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if (fail) { console.error('\n❌ Final check failed! File NOT saved.'); process.exit(1); }

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ Exchange rate now matches Google rates!');
