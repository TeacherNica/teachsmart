const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Replacing Today\'s Schedule with Class Notes ===');

const oldSection = `  <div style="font-weight:800;font-size:1rem;margin-bottom:10px;color:var(--dark);">&#128197; Today's Schedule</div>
  <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
    <button id="day-btn-0" onclick="showDay(0)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Mon</button>
    <button id="day-btn-1" onclick="showDay(1)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Tue</button>
    <button id="day-btn-2" onclick="showDay(2)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Wed</button>
    <button id="day-btn-3" onclick="showDay(3)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Thu</button>
    <button id="day-btn-4" onclick="showDay(4)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Fri</button>
    <button id="day-btn-5" onclick="showDay(5)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Sat</button>
    <button id="day-btn-6" onclick="showDay(6)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Sun</button>
  </div>
  <div id="day-schedule" style="display:grid;gap:8px;"></div>`;

const newSection = `  <div style="font-weight:800;font-size:1rem;margin-bottom:14px;color:var(--dark);">📝 Class Notes & Makeup Classes</div>

  <!-- Add Note Form -->
  <div style="background:#F5F3FF;border-radius:12px;padding:16px;margin-bottom:16px;">
    <div style="font-weight:700;font-size:0.85rem;color:#7C3AED;margin-bottom:10px;">➕ Add Makeup Class Note</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
      <div>
        <label style="font-size:0.75rem;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">Student</label>
        <input id="note-student" placeholder="Student name" style="width:100%;padding:8px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
      </div>
      <div>
        <label style="font-size:0.75rem;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">Date</label>
        <input id="note-date" type="date" style="width:100%;padding:8px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
      </div>
      <div>
        <label style="font-size:0.75rem;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">Time</label>
        <input id="note-time" type="time" style="width:100%;padding:8px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
      </div>
      <div>
        <label style="font-size:0.75rem;font-weight:700;color:#6B7280;display:block;margin-bottom:4px;">Reason / Note</label>
        <input id="note-reason" placeholder="e.g. Makeup for Apr 10" style="width:100%;padding:8px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.85rem;box-sizing:border-box;">
      </div>
    </div>
    <button onclick="saveClassNote()" style="width:100%;padding:10px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:8px;font-weight:800;font-size:0.85rem;cursor:pointer;">💾 Save Note</button>
  </div>

  <!-- Notes List -->
  <div id="class-notes-list"></div>`;

if (!content.includes(oldSection.replace(/\n/g, '\r\n'))) {
  // Try with \r\n
  const oldWithCRLF = oldSection.replace(/\n/g, '\r\n');
  if (!content.includes(oldWithCRLF)) {
    console.error('❌ Could not find section to replace!');
    process.exit(1);
  }
  content = content.replace(oldWithCRLF, newSection);
} else {
  content = content.replace(oldSection, newSection);
}

console.log('✅ Class Notes section added');

// Now add the JavaScript functions before </script> near the end
const scriptFns = `
function saveClassNote(){
  var student = document.getElementById('note-student').value.trim();
  var date = document.getElementById('note-date').value;
  var time = document.getElementById('note-time').value;
  var reason = document.getElementById('note-reason').value.trim();
  if(!student){alert('Please enter a student name!');return;}
  if(!date){alert('Please select a date!');return;}
  if(!time){alert('Please select a time!');return;}
  var notes = JSON.parse(localStorage.getItem('ts-class-notes')||'[]');
  var note = {
    id: Date.now(),
    student: student,
    date: date,
    time: time,
    reason: reason,
    done: false,
    createdAt: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})
  };
  notes.unshift(note);
  localStorage.setItem('ts-class-notes', JSON.stringify(notes));
  // Clear form
  document.getElementById('note-student').value='';
  document.getElementById('note-date').value='';
  document.getElementById('note-time').value='';
  document.getElementById('note-reason').value='';
  renderClassNotes();
  alert('✅ Note saved!');
}

function markNoteDone(id){
  var notes = JSON.parse(localStorage.getItem('ts-class-notes')||'[]');
  var idx = notes.findIndex(function(n){return n.id===id;});
  if(idx===-1) return;
  notes[idx].done = true;
  localStorage.setItem('ts-class-notes', JSON.stringify(notes));
  renderClassNotes();
}

function deleteClassNote(id){
  if(!confirm('Delete this note?')) return;
  var notes = JSON.parse(localStorage.getItem('ts-class-notes')||'[]');
  notes = notes.filter(function(n){return n.id!==id;});
  localStorage.setItem('ts-class-notes', JSON.stringify(notes));
  renderClassNotes();
}

function renderClassNotes(){
  var container = document.getElementById('class-notes-list');
  if(!container) return;
  var notes = JSON.parse(localStorage.getItem('ts-class-notes')||'[]');
  if(notes.length===0){
    container.innerHTML='<p style="color:#9CA3AF;font-size:0.85rem;text-align:center;padding:20px 0;">No makeup class notes yet.<br>Add one above! 📝</p>';
    return;
  }
  container.innerHTML = notes.map(function(n){
    var isDone = n.done;
    var d = new Date(n.date);
    var dateLabel = d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
    var timeLabel = n.time ? new Date('1970-01-01T'+n.time).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) : '';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;margin-bottom:8px;background:'+(isDone?'#F0FDF4':'#FFF');+';border:1.5px solid '+(isDone?'#22C55E':'#DDD6FE')+';gap:8px;flex-wrap:wrap;opacity:'+(isDone?'0.7':'1')+'">' +
      '<div style="flex:1;">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
          '<span style="font-weight:800;font-size:0.9rem;color:#374151;">'+(isDone?'✅ ':'')+n.student+'</span>' +
          (isDone?'<span style="background:#DCFCE7;color:#15803D;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700;">Done</span>':'<span style="background:#EDE9FE;color:#7C3AED;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700;">Pending</span>') +
        '</div>' +
        '<div style="font-size:0.78rem;color:#6B7280;">📅 '+dateLabel+' · ⏰ '+timeLabel+'</div>' +
        (n.reason?'<div style="font-size:0.78rem;color:#9CA3AF;margin-top:2px;">📝 '+n.reason+'</div>':'') +
      '</div>' +
      '<div style="display:flex;gap:6px;">' +
        (!isDone?'<button onclick="markNoteDone('+n.id+')" style="padding:6px 12px;border-radius:8px;border:none;background:#DCFCE7;color:#15803D;font-weight:700;font-size:11px;cursor:pointer;">✅ Done</button>':'') +
        '<button onclick="deleteClassNote('+n.id+')" style="padding:6px 12px;border-radius:8px;border:none;background:#FEE2E2;color:#EF4444;font-weight:700;font-size:11px;cursor:pointer;">🗑️</button>' +
      '</div>' +
    '</div>';
  }).join('');
}`;

// Insert functions before last </script>
const lastScript = content.lastIndexOf('</script>');
if (lastScript === -1) { console.error('❌ Could not find </script>'); process.exit(1); }
content = content.substring(0, lastScript) + scriptFns + '\n</script>' + content.substring(lastScript + 9);
console.log('✅ JavaScript functions added');

// Also call renderClassNotes on page load - add after renderScheduleGrid call
if (content.includes('renderScheduleGrid()')) {
  content = content.replace('renderScheduleGrid()', 'renderScheduleGrid();\n  renderClassNotes();');
  console.log('✅ renderClassNotes called on load');
}

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments',
  'function saveClassNote','function renderClassNotes'
];
let fail = false;
checks.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g'))||[]).length;
  if (count !== 1) { console.log('❌', fn, '—', count, 'times'); fail = true; }
  else console.log('✅', fn);
});
const ot = (content.match(/<script/g)||[]).length;
const ct = (content.match(/<\/script>/g)||[]).length;
if (ot !== ct) { console.log('❌ Script tags unbalanced:', ot, 'open,', ct, 'close'); fail = true; }
else console.log('✅ Script tags balanced (' + ot + ' pairs)');
console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if (fail) { console.error('\n❌ Final check failed! File NOT saved.'); process.exit(1); }

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ Class Notes section added to Schedule tab!');
