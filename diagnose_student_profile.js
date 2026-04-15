const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

// Find studentProfileModal
console.log('\n=== studentProfileModal references ===');
lines.forEach((l, i) => {
  if (l.includes('studentProfileModal') || l.includes('openStudentProfile') || l.includes('openProfile')) {
    console.log((i+1) + ': ' + l.trim().substring(0, 120));
  }
});

// Find what happens when student card/avatar is clicked
console.log('\n=== Student card click handlers ===');
lines.forEach((l, i) => {
  if (l.includes('onclick') && (l.includes('student-card') || l.includes('stu-av') || l.includes('openStudent'))) {
    console.log((i+1) + ': ' + l.trim().substring(0, 120));
  }
});

// Find renderStudents function
console.log('\n=== renderStudents - first 40 lines ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function renderStudents(')) {
    for (let j = i; j < Math.min(i+40, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j].trim().substring(0, 120));
    }
    break;
  }
}
