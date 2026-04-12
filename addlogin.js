const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldFooter = `<button class="s-btn" style="background:#EFF6FF;color:#1D4ED8;" onclick="markDone(${s.id})">✅ Mark Done</button>
        <button class="s-btn" style="background:#F3E8FF;color:#7C3AED;" onclick="openModal('report-modal')">📝 Report</button>
        ${s.classes<=2?`;

const newFooter = `<button class="s-btn" style="background:#EFF6FF;color:#1D4ED8;" onclick="markDone(\${s.id})">✅ Mark Done</button>
        <button class="s-btn" style="background:#F3E8FF;color:#7C3AED;" onclick="openModal('report-modal')">📝 Report</button>
        <button class="s-btn" style="background:#DCFCE7;color:#15803D;" onclick="addClass(\${s.id})">➕ Add</button>
        <button class="s-btn" style="background:#FEE2E2;color:#B91C1C;" onclick="deductClass(\${s.id})">➖ Deduct</button>
        <button class="s-btn" style="background:#FEF3C7;color:#B45309;" onclick="deleteStudent(\${s.id})">🗑️ Delete</button>
        \${s.classes<=2?`;

h = h.replace(oldFooter, newFooter);

// Add the functions if not present
if (!h.includes('function addClass')) {
  const inject = `
function addClass(id){
  const s=students.find(x=>x.id===id);
  if(!s)return;
  s.classes++;
  s.total=Math.max(s.total,s.classes);
  saveStudents();renderStudents();
}
function deductClass(id){
  const s=students.find(x=>x.id===id);
  if(!s)return;
  if(s.classes<=0){alert('No classes left!');return;}
  s.classes--;
  saveStudents();renderStudents();
}
function deleteStudent(id){
  if(!confirm('Delete this student?'))return;
  students=students.filter(x=>x.id!==id);
  saveStudents();renderStudents();
}`;
  h = h.replace('function isUpcoming', inject + '\nfunction isUpcoming');
}

fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('addClass'));