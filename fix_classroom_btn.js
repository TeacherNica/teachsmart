// fix_classroom_btn.js — node fix_classroom_btn.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// Line 2997 (index 2996) has corrupted smart quotes around the onclick
// We replace it with a clean version using data attributes to avoid all quote issues
const badLine = lines[2996].replace(/\r/, '');
console.log('BEFORE:');
console.log(' ' + badLine);

// Check we're on the right line
if (!badLine.includes('openClassroomModal') || !badLine.includes('button')) {
  console.log('\nERROR: Wrong line — searching for it...');
  lines.forEach((l, i) => {
    if (l.includes('openClassroomModal') && l.includes('button') && l.includes('Start')) {
      console.log(`Found at line ${i+1}`);
    }
  });
  process.exit(1);
}

// Fix: use data-name and data-dur attributes to avoid all quote nesting issues
lines[2996] = "        +'<button onclick=\"openClassroomModal(this.dataset.n,this.dataset.d)\" data-n=\"'+s.name+'\" data-d=\"'+s.duration+'\" style=\"padding:8px 16px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:10px;font-weight:800;font-size:0.82rem;cursor:pointer;\">▶ Start</button>'\r";

console.log('\nAFTER:');
console.log(' ' + lines[2996].replace(/\r/, ''));

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('\n✅ Saved.');
console.log('\n=== done: true ===');
