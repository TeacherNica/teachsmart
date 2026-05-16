const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

console.log('Class Notes section exists:', content.includes('class-notes-list'));
console.log('saveClassNote exists:', content.includes('function saveClassNote'));
console.log('renderClassNotes exists:', content.includes('function renderClassNotes'));
console.log('Today\'s Schedule still exists:', content.includes("Today's Schedule"));
console.log('note-student input exists:', content.includes('note-student'));

// Find where class-notes-list is
const idx = content.indexOf('class-notes-list');
if(idx !== -1) {
  console.log('\n=== class-notes-list context ===');
  console.log(content.substring(idx - 200, idx + 100));
}
