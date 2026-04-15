const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

const idx = lines.findIndex(l => l.includes("nav(\\'students\\',document.querySelectorAll") && l.includes('onclick'));

if (idx === -1) {
  console.log('❌ Line not found');
  process.exit(1);
}

console.log('✅ Found at line ' + (idx+1));
console.log('Before: ' + lines[idx].trim());

lines[idx] = lines[idx].replace(
  `const onclick=s?"nav(\\'students\\',document.querySelectorAll(\\'.nav-item\\')[1])":''`,
  `const onclick=s?"openStudentProfile("+s.id+")":''`
);

console.log('After:  ' + lines[idx].trim());

fs.writeFileSync('index.html', lines.join('\r\n'), 'utf8');
console.log('\ndone: true');
