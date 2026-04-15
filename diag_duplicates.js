const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

// Find all occurrences of renderSchedule and saveData with line numbers
console.log('=== function renderSchedule locations ===');
lines.forEach(function(line, i) {
  if (line.includes('function renderSchedule')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
  }
});

console.log('\n=== function saveData locations ===');
lines.forEach(function(line, i) {
  if (line.includes('function saveData')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
  }
});

// Show the content of each duplicate so we can see which one to remove
console.log('\n=== renderSchedule FIRST occurrence (20 lines) ===');
const rs1 = content.indexOf('function renderSchedule');
console.log(content.substring(rs1, rs1 + 800));

console.log('\n=== renderSchedule SECOND occurrence (20 lines) ===');
const rs2 = content.indexOf('function renderSchedule', rs1 + 1);
console.log(content.substring(rs2, rs2 + 800));

console.log('\n=== saveData FIRST occurrence (10 lines) ===');
const sd1 = content.indexOf('function saveData');
console.log(content.substring(sd1, sd1 + 300));

console.log('\n=== saveData SECOND occurrence (10 lines) ===');
const sd2 = content.indexOf('function saveData', sd1 + 1);
console.log(content.substring(sd2, sd2 + 300));
