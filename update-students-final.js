const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');

const updates = {
  'K.Bella':       { total: 54, classes: 46 },
  'Jackie':        { total: 52, classes: 41 },
  'Lina':          { total: 30, classes: 6  },
  'Aiden':         { total: 25, classes: 5  },
  'Sophia':        { total: 27, classes: 6  },
  'Peter':         { total: 52, classes: 23 },
  'Seah':          { total: 52, classes: 10 },
  'Suri':          { total: 30, classes: 13 },
  'Bella':         { total: 32, classes: 10 },
  'COCO-1':        { total: 20, classes: 2  },
  'Harry':         { total: 27, classes: 2  },
  'Kelly-Adult':   { total: 11, classes: 11 },
  'KAREN':         { total: 20, classes: 18 },
  'Coco-2':        { total: 27, classes: 22 },
  'Koala':         { total: 30, classes: 26 },
  'Owen':          { total: 27, classes: 22 },
  'Rainy':         { total: 27, classes: 20 },
  'Mollie-Adult':  { total: 52, classes: 32, sharedWith: 'Steven' },
  'Steven':        { total: 52, classes: 32, sharedWith: 'Mollie-Adult' },
  'Carl':          { total: 30, classes: 3  },
  'Shily':         { total: 27, classes: 25 },
};

let html = fs.readFileSync(indexPath, 'utf8');

// Find ts-students in localStorage
const tsMatch = html.match(/localStorage\.setItem\s*\(\s*['"]ts-students['"]\s*,\s*'(\[[\s\S]*?\])'\s*\)/);

if (!tsMatch) {
  console.log('ERROR: Could not find ts-students in index.html');
  console.log('done: false');
  process.exit(1);
}

let students;
try {
  students = JSON.parse(tsMatch[1]);
} catch (e) {
  console.log('ERROR: Could not parse student data: ' + e.message);
  console.log('done: false');
  process.exit(1);
}

let updatedCount = 0;
let notFound = [];

students.forEach(function(student) {
  var u = updates[student.name];
  if (u) {
    student.total = u.total;
    student.classes = u.classes;
    if (u.sharedWith) {
      student.sharedWith = u.sharedWith;
    }
    updatedCount++;
  } else {
    notFound.push(student.name);
  }
});

var newJson = JSON.stringify(students);
var newSetItem = "localStorage.setItem('ts-students', '" + newJson + "')";

html = html.replace(
  /localStorage\.setItem\s*\(\s*['"]ts-students['"]\s*,\s*'(\[[\s\S]*?\])'\s*\)/,
  newSetItem
);

fs.writeFileSync(indexPath, html, 'utf8');

console.log('\n=== Update Complete ===');
students.forEach(function(s) {
  if (updates[s.name]) {
    console.log('OK ' + s.name + ': ' + s.classes + ' of ' + s.total + ' classes left' + (s.sharedWith ? ' (shared with ' + s.sharedWith + ')' : ''));
  }
});
if (notFound.length > 0) {
  console.log('\nNot matched (check spelling): ' + notFound.join(', '));
}
console.log('\ndone: true');
