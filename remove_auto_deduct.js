const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

const autoDeductLine = `    if(status==='done'){const dk='auto_done_'+slot.student+'_'+new Date().toDateString();if(!localStorage.getItem(dk)){const ds=students.find(x=>x.name===slot.student);if(ds&&ds.classes>0){ds.classes--;saveData();}localStorage.setItem(dk,'1');}}`;

const idx = lines.findIndex(l => l === autoDeductLine);
if (idx === -1) {
  console.log('❌ Auto-deduct line not found — trying partial match...');
  const idx2 = lines.findIndex(l => l.includes('auto_done_') && l.includes('ds.classes--'));
  if (idx2 !== -1) {
    console.log('✅ Found via partial match at line ' + (idx2+1));
    lines.splice(idx2, 1);
  } else {
    console.log('❌ Could not find auto-deduct line. No changes made.');
    process.exit(1);
  }
} else {
  console.log('✅ Found auto-deduct line at line ' + (idx+1) + ', removing...');
  lines.splice(idx, 1);
}

const result = lines.join('\r\n');
const stillPresent = result.includes('auto_done_') && result.includes('ds.classes--');
console.log('📊 Auto-deduct removed: ' + !stillPresent + ' (should be true)');
console.log('📊 markAttendance still present: ' + result.includes('function markAttendance'));

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
