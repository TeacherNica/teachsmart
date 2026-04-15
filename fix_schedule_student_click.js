const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

const idx = lines.findIndex(l => l.includes('const onclick=s?"openStudentProfile("+s.id+")":\'\''));

if (idx === -1) {
  console.log('❌ Line not found. Searching...');
  lines.forEach((l, i) => {
    if (l.includes('openStudentProfile') && l.includes('onclick') && l.includes('cell')) {
      console.log((i+1) + ': ' + JSON.stringify(l));
    }
  });
  process.exit(1);
}

console.log('✅ Found at line ' + (idx+1));

// Replace: student cells now open slot editor with 'student' type
lines[idx] = lines[idx].replace(
  `const onclick=s?"openStudentProfile("+s.id+")":''`,
  `const onclick="openSlotEditor(this,'student')"`
);

console.log('After: ' + lines[idx].trim());

fs.writeFileSync('index.html', lines.join('\r\n'), 'utf8');
console.log('\ndone: true');
