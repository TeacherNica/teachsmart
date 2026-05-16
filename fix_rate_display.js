const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing exchange rate widget ===');

// Fix the HTML widget display
const oldWidget = `<div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:3px;">PHP → RMB</div><div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:24px;color:var(--text);">¥0.1247</div><div style="font-size:10px;color:var(--green);font-weight:700;">per ₱1.00 · live</div></div>
          <div style="text-align:right;"><div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:3px;">₱2,500 =</div><div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:20px;color:var(--purple);">¥311.75</div></div>
        </div>`;

const newWidget = `<div style="display:flex;align-items:center;justify-content:space-between;">
          <div><div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:3px;">CNY → PHP</div><div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:24px;color:var(--text);" id="live-rate-display">₱8.80</div><div style="font-size:10px;color:var(--green);font-weight:700;">per ¥1.00 · live</div></div>
          <div style="text-align:right;"><div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:3px;">¥1 =</div><div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:20px;color:var(--purple);" id="live-rate">₱8.80</div></div>
        </div>`;

// Try with CRLF
const oldWidgetCRLF = oldWidget.replace(/\n/g, '\r\n');
if(content.includes(oldWidgetCRLF)) {
  content = content.replace(oldWidgetCRLF, newWidget);
  console.log('✅ Widget HTML updated (CRLF)');
} else if(content.includes(oldWidget)) {
  content = content.replace(oldWidget, newWidget);
  console.log('✅ Widget HTML updated (LF)');
} else {
  console.error('❌ Could not find widget HTML!');
  process.exit(1);
}

// Fix the JS to show RATE (which is PHP per CNY) directly
const oldDisplay1 = `if(el)el.textContent='¥1 = ₱'+RATE.toFixed(4);
  }).catch(()=>{`;
const newDisplay1 = `if(el)el.textContent='₱'+RATE.toFixed(2);
    var el2=document.getElementById('live-rate-display');
    if(el2)el2.textContent='₱'+RATE.toFixed(2);
  }).catch(()=>{`;

const oldDisplay2 = `if(el)el.textContent='¥1 = ₱'+RATE.toFixed(4);
      }).catch(()=>{});`;
const newDisplay2 = `if(el)el.textContent='₱'+RATE.toFixed(2);
        var el2=document.getElementById('live-rate-display');
        if(el2)el2.textContent='₱'+RATE.toFixed(2);
      }).catch(()=>{});`;

if(content.includes(oldDisplay1.replace(/\n/g,'\r\n'))) {
  content = content.replace(oldDisplay1.replace(/\n/g,'\r\n'), newDisplay1);
  console.log('✅ JS display 1 updated');
} else if(content.includes(oldDisplay1)) {
  content = content.replace(oldDisplay1, newDisplay1);
  console.log('✅ JS display 1 updated');
}

if(content.includes(oldDisplay2.replace(/\n/g,'\r\n'))) {
  content = content.replace(oldDisplay2.replace(/\n/g,'\r\n'), newDisplay2);
  console.log('✅ JS display 2 updated');
} else if(content.includes(oldDisplay2)) {
  content = content.replace(oldDisplay2, newDisplay2);
  console.log('✅ JS display 2 updated');
}

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
console.log('✅ Exchange rate now shows 1 CNY = ₱X.XX like Google!');
