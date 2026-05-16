const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Fixing click/dblclick conflict on student name ===');

const oldLine = 'class=\\"s-name\\" style=\\"cursor:pointer;\\" onclick=\\"openStudentProfile(${s.id})\\" ondblclick=\\"openQuickRename(${s.id},event)\\" title=\\"Double-click to rename\\">${s.name}</div>';

// Use direct string search instead
const searchStr = 'ondblclick=\\"openQuickRename(${s.id},event)\\" title=\\"Double-click to rename\\">';

if (!content.includes('ondblclick')) {
  console.error('❌ ondblclick not found!');
  process.exit(1);
}

// Replace the entire s-name div - use a timer on single click to allow dblclick to cancel it
const oldDiv = `class="s-name" style="cursor:pointer;" onclick="openStudentProfile(\${s.id})" ondblclick="openQuickRename(\${s.id},event)" title="Double-click to rename">\${s.name}</div>`;
const newDiv = `class="s-name" style="cursor:pointer;" onclick="(function(el,id){el._t=setTimeout(function(){openStudentProfile(id);},250);})(this,\${s.id})" ondblclick="(function(el,id){clearTimeout(el._t);openQuickRename(id,event);})(this,\${s.id})" title="Double-click to rename">\${s.name}</div>`;

if (!content.includes(oldDiv)) {
  console.error('❌ Could not find exact div!');
  // Show what we have
  const idx = content.indexOf('s-name');
  let found = idx;
  while(true) {
    found = content.indexOf('s-name', found + 1);
    if (found === -1) break;
    const snippet = content.substring(found, found + 200);
    if (snippet.includes('onclick')) {
      console.log('Found:', snippet);
      break;
    }
  }
  process.exit(1);
}

content = content.replace(oldDiv, newDiv);
console.log('✅ Click/dblclick conflict fixed');

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
console.log('✅ Single click = open profile, Double click = rename!');
