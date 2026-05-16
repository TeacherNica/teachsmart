// fix_syntax_3014.js — node fix_syntax_3014.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

console.log('BEFORE line 3014:');
console.log('  ' + lines[3013].replace(/\r/, ''));

// Replace the broken line with correct single quotes
lines[3013] = "        +'<button onclick=\"openClassroomModal(\\''+s.name+'\\',\\''+s.duration+'\\')\" style=\"padding:8px 16px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:10px;font-weight:800;font-size:0.82rem;cursor:pointer;font-family:\\'Nunito\\',sans-serif;\">▶ Start</button>'\r";

// Actually — simpler and safer: use a data attribute approach
// Replace with a version that avoids nested quotes entirely
lines[3013] = "        +'<button onclick=\"openClassroomModal(this.dataset.name,this.dataset.dur)\" data-name=\"'+s.name+'\" data-dur=\"'+s.duration+'\" style=\"padding:8px 16px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:10px;font-weight:800;font-size:0.82rem;cursor:pointer;\">▶ Start</button>'\r";

console.log('\nAFTER line 3014:');
console.log('  ' + lines[3013].replace(/\r/, ''));

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log('\n✅ Saved.');
console.log('\n=== done: true ===');
