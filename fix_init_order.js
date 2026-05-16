const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Moving init code to end of last script tag ===');

// Find and extract the init code
const oldInit = "// ─── INIT ───\r\nrenderDashboard();\r\nrenderStudents();\r\nconst lastPage = localStorage.getItem('ts-last-page');\r\nif(lastPage && lastPage !== 'dashboard'){\r\n  const navBtn = document.querySelector('[onclick*=\"nav(\\''+lastPage+'\\'\"]');\r\n  if(navBtn) nav(lastPage, navBtn);\r\n  // Re-render after short delay to fix timing issue\r\n  setTimeout(function(){\r\n    if(lastPage==='earnings') renderEarnings();\r\n    if(lastPage==='payments') renderPayments();\r\n    if(lastPage==='schedule'){renderScheduleGrid();renderClassNotes();}\r\n    if(lastPage==='students') renderStudents();\r\n    if(lastPage==='reports') renderReports();\r\n  }, 1000);\r\n}";

if(!content.includes(oldInit)){
  console.error('❌ Could not find init code!');
  process.exit(1);
}

// Remove old init
content = content.replace(oldInit, '// ─── INIT MOVED TO END ───');
console.log('✅ Old init removed');

// New init to place before last </script>
const newInit = `\r\n// ─── INIT ───\r\nrenderDashboard();\r\nrenderStudents();\r\n(function(){\r\n  var lastPage = localStorage.getItem('ts-last-page');\r\n  if(lastPage && lastPage !== 'dashboard'){\r\n    var navBtn = document.querySelector('[onclick*=\"nav(\\''+lastPage+'\\'\"]');\r\n    if(navBtn) nav(lastPage, navBtn);\r\n    setTimeout(function(){\r\n      if(lastPage==='earnings') renderEarnings();\r\n      if(lastPage==='payments') renderPayments();\r\n      if(lastPage==='schedule'){renderScheduleGrid();renderClassNotes();}\r\n      if(lastPage==='students') renderStudents();\r\n      if(lastPage==='reports') renderReports();\r\n    }, 300);\r\n  }\r\n})();`;

// Insert before last </script>
const lastScriptClose = content.lastIndexOf('</script>');
if(lastScriptClose === -1){ console.error('❌ No closing script tag!'); process.exit(1); }

content = content.substring(0, lastScriptClose) + newInit + '\r\n</script>' + content.substring(lastScriptClose + 9);
console.log('✅ Init code moved to end of last script tag');

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
console.log('✅ Init moved to end - renderEarnings will be defined before init runs!');
