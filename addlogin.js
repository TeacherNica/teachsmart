const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const inject = `
function addClass(id){
  const s=students.find(x=>x.id===id);
  if(!s)return;
  s.classes++;
  s.total=Math.max(s.total,s.classes);
  saveStudents();
  renderStudents();
}
function deductClass(id){
  const s=students.find(x=>x.id===id);
  if(!s)return;
  if(s.classes<=0){alert('No classes left!');return;}
  s.classes--;
  saveStudents();
  renderStudents();
}
function deleteStudent(id){
  if(!confirm('Delete this student?'))return;
  students=students.filter(x=>x.id!==id);
  saveStudents();
  renderStudents();
}`;

h = h.replace('function isUpcoming', inject + '\nfunction isUpcoming');
fs.writeFileSync('index.html', h, 'utf8');
console.log('addClass:', h.includes('function addClass'));
console.log('deleteStudent:', h.includes('function deleteStudent'));