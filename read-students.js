// Step 1: Run this first to show your current student data structure
// node read-students.js

const fs = require('fs');
const html = fs.readFileSync('./index.html', 'utf8');

// Try to find the students array in the source
const patterns = [
  /const\s+students\s*=\s*(\[[\s\S]*?\]);/,
  /let\s+students\s*=\s*(\[[\s\S]*?\]);/,
  /var\s+students\s*=\s*(\[[\s\S]*?\]);/,
  /defaultStudents\s*=\s*(\[[\s\S]*?\]);/,
  /STUDENTS\s*=\s*(\[[\s\S]*?\]);/,
];

let found = false;
patterns.forEach(function(p, i) {
  const m = html.match(p);
  if (m) {
    console.log('Found students array with pattern #' + i);
    console.log('First 500 chars:');
    console.log(m[0].substring(0, 500));
    found = true;
  }
});

if (!found) {
  // Show lines containing "classes" and "total" and "name" near each other
  const lines = html.split('\n');
  const hits = [];
  lines.forEach(function(line, i) {
    if (line.includes('"classes"') || line.includes("'classes'") || line.includes('classes:')) {
      hits.push('Line ' + (i+1) + ': ' + line.trim().substring(0, 120));
    }
  });
  console.log('No students array found. Lines with "classes":');
  hits.slice(0, 20).forEach(function(h) { console.log(h); });
}

console.log('\ndone: true');
