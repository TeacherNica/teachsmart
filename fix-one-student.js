// Fix one student's package numbers
// Usage: node fix-one-student.js "StudentName" totalClasses classesLeft
// Example: node fix-one-student.js "Lina" 30 8

const fs = require('fs');

const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log('Usage: node fix-one-student.js "StudentName" totalClasses classesLeft');
  console.log('Example: node fix-one-student.js "Lina" 30 8');
  process.exit(1);
}

const targetName = args[0].trim();
const newTotal = parseInt(args[1]);
const newClasses = parseInt(args[2]);

if (isNaN(newTotal) || isNaN(newClasses)) {
  console.error('ERROR: totalClasses and classesLeft must be numbers.');
  process.exit(1);
}

if (newClasses > newTotal) {
  console.error('ERROR: Classes left (' + newClasses + ') cannot be more than total (' + newTotal + ').');
  process.exit(1);
}

const path = './index.html';
let html = fs.readFileSync(path, 'utf8');

const arrayMatch = html.match(/((?:var|let|const)\s+(?:defaultStudents|students)\s*=\s*)(\[[\s\S]*?\n\];)/);

if (!arrayMatch) {
  console.error('ERROR: Could not find student array in index.html.');
  process.exit(1);
}

let students;
try {
  students = JSON.parse(arrayMatch[2]);
} catch(e) {
  try {
    students = (new Function('return ' + arrayMatch[2]))();
  } catch(e2) {
    console.error('ERROR: Could not parse student array: ' + e2.message);
    process.exit(1);
  }
}

const student = students.find(function(s) {
  return (s.name || '').toLowerCase().trim() === targetName.toLowerCase();
});

if (!student) {
  console.error('ERROR: Student "' + targetName + '" not found.');
  console.log('\nAvailable students:');
  students.forEach(function(s) { console.log('  - ' + s.name); });
  process.exit(1);
}

const oldTotal = student.total;
const oldClasses = student.classes;

student.total = newTotal;
student.classes = newClasses;
student.packages = newClasses;

const newArrayStr = JSON.stringify(students, null, 2);
html = html.replace(arrayMatch[0], arrayMatch[1] + newArrayStr + ';');
fs.writeFileSync(path, html, 'utf8');

console.log('\n=== Student Updated ===');
console.log('Name:        ' + student.name);
console.log('Before:      ' + oldClasses + ' left of ' + oldTotal);
console.log('After:       ' + newClasses + ' left of ' + newTotal);
console.log('\ndone: true');
