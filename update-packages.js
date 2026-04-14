const fs = require('fs');

const PACKAGES = {
  "K.Bella":       { total: 54, classes: 46 },
  "Jackie":        { total: 52, classes: 41 },
  "Lina":          { total: 30, classes: 6  },
  "Aiden":         { total: 25, classes: 5  },
  "Sophia":        { total: 27, classes: 6  },
  "Peter":         { total: 52, classes: 23 },
  "Seah":          { total: 52, classes: 10 },
  "Suri":          { total: 30, classes: 13 },
  "Bella":         { total: 32, classes: 10 },
  "COCO-1":        { total: 20, classes: 2  },
  "Harry":         { total: 27, classes: 2  },
  "Kelly-Adult":   { total: 11, classes: 11 },
  "KAREN":         { total: 20, classes: 18 },
  "Mollie-Adult":  { total: 52, classes: 32 },
  "Steven":        { total: 52, classes: 32 },
  "Coco-2":        { total: 27, classes: 22 },
  "Koala":         { total: 30, classes: 26 },
  "Owen":          { total: 27, classes: 22 },
  "Rainy":         { total: 27, classes: 20 },
  "Carl":          { total: 30, classes: 3  },
  "Shily":         { total: 27, classes: 25 }
};

const path = './index.html';
let html = fs.readFileSync(path, 'utf8');

// Try to find the defaultStudents / students array in the HTML
const arrayMatch = html.match(/((?:var|let|const)\s+(?:defaultStudents|students)\s*=\s*)(\[[\s\S]*?\n\];)/);

if (!arrayMatch) {
  console.error('ERROR: Could not find student array in index.html.');
  console.error('Please check that your student list is defined as var/let/const defaultStudents or students.');
  process.exit(1);
}

let students;
try {
  students = JSON.parse(arrayMatch[2]);
} catch(e) {
  // Try eval-safe parse via Function
  try {
    students = (new Function('return ' + arrayMatch[2]))();
  } catch(e2) {
    console.error('ERROR: Could not parse student array: ' + e2.message);
    process.exit(1);
  }
}

let updated = 0;
let notFound = [];

students.forEach(function(s) {
  const key = Object.keys(PACKAGES).find(function(k) {
    return k.toLowerCase().trim() === (s.name || '').toLowerCase().trim();
  });
  if (key) {
    s.total = PACKAGES[key].total;
    s.classes = PACKAGES[key].classes;
    // packages field (used by set package popup)
    s.packages = PACKAGES[key].classes;
    updated++;
  } else {
    notFound.push(s.name);
  }
});

const newArrayStr = JSON.stringify(students, null, 2);
html = html.replace(arrayMatch[0], arrayMatch[1] + newArrayStr + ';');

fs.writeFileSync(path, html, 'utf8');

console.log('\n=== TeachSmart Package Update ===');
students.forEach(function(s) {
  const key = Object.keys(PACKAGES).find(function(k) {
    return k.toLowerCase().trim() === (s.name || '').toLowerCase().trim();
  });
  if (key) {
    console.log('OK  ' + s.name + ' — ' + PACKAGES[key].classes + ' left of ' + PACKAGES[key].total);
  }
});

if (notFound.length > 0) {
  console.log('\nWARNING - These students were NOT matched (check spelling):');
  notFound.forEach(function(n) { console.log('  ? ' + n); });
}

console.log('\ndone: true');
