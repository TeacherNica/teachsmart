const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');

const oldClick = `const onclick=s?"nav('students',document.querySelectorAll('.nav-item')[1])":'';`;
const newClick = `const onclick=s?"openStudentProfile("+s.id+")":'';`;

if (raw.includes(oldClick)) {
  const result = raw.replace(oldClick, newClick);
  fs.writeFileSync('index.html', result, 'utf8');
  console.log('✅ Fixed schedule name click — now opens student profile modal');
  console.log('done: true');
} else {
  console.log('❌ Could not find exact line. Searching for partial match...');
  const lines = raw.split(/\r?\n/);
  lines.forEach((l, i) => {
    if (l.includes("nav('students'") && l.includes('onclick')) {
      console.log('Line ' + (i+1) + ': ' + JSON.stringify(l));
    }
  });
}
