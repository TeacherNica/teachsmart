const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find page-schedule
const schedPage = content.indexOf('page-schedule');
console.log('page-schedule at index:', schedPage);
console.log(content.substring(schedPage, schedPage + 200));

// Find note-student
const noteIdx = content.indexOf('note-student');
console.log('\nnote-student at index:', noteIdx);

// Find what page contains note-student
// Look backwards from note-student for nearest page-id
let searchBack = noteIdx;
while(searchBack > 0) {
  const chunk = content.substring(searchBack - 1, searchBack + 20);
  if(chunk.includes('id="page-')) {
    console.log('Found page:', chunk);
    break;
  }
  searchBack--;
}

// Show 300 chars before note-student
console.log('\n=== Context around note-student ===');
console.log(content.substring(noteIdx - 300, noteIdx + 100));
