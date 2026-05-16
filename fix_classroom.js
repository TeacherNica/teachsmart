const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Replacing Live Classroom page ===');

const pageStart = content.indexOf('page-classroom">');
const pageEnd = content.indexOf('<div class="page" id="page-', pageStart + 10);

const newPage = `page-classroom">
  <div class="page-header">
    <div><div class="page-title">🎥 Live Classroom</div><div class="page-sub">Start your Tencent Meeting classes</div></div>
    <div style="display:flex;gap:8px;align-items:center;">
      <button onclick="classroomDayOffset--;renderClassroom();" style="padding:6px 12px;border-radius:8px;border:1px solid #E5E7EB;background:white;cursor:pointer;font-weight:700;">◀</button>
      <button onclick="classroomDayOffset=0;renderClassroom();" style="padding:6px 14px;border-radius:8px;border:none;background:var(--purple);color:white;cursor:pointer;font-weight:700;font-size:0.82rem;">Today</button>
      <button onclick="classroomDayOffset++;renderClassroom();" style="padding:6px 12px;border-radius:8px;border:1px solid #E5E7EB;background:white;cursor:pointer;font-weight:700;">▶</button>
    </div>
  </div>

  <!-- Day label -->
  <div id="classroom-day-label" style="font-weight:800;font-size:1rem;color:#374151;margin-bottom:14px;"></div>

  <!-- Active Timer (hidden by default) -->
  <div id="classroom-timer-card" style="display:none;background:linear-gradient(135deg,#A855F7,#7C3AED);border-radius:16px;padding:18px 20px;margin-bottom:16px;color:white;">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
      <div>
        <div style="font-size:0.8rem;opacity:0.85;margin-bottom:4px;">🔴 CLASS IN PROGRESS</div>
        <div id="classroom-timer-name" style="font-weight:900;font-size:1.2rem;"></div>
        <div id="classroom-timer-duration" style="font-size:0.8rem;opacity:0.85;"></div>
      </div>
      <div style="text-align:center;">
        <div id="classroom-timer-display" style="font-family:'Nunito',sans-serif;font-weight:900;font-size:2.5rem;letter-spacing:2px;">00:00</div>
        <div style="font-size:0.75rem;opacity:0.8;">elapsed</div>
      </div>
      <button onclick="stopClassTimer()" style="padding:8px 16px;background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.4);color:white;border-radius:10px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;">⏹ End Class</button>
    </div>
  </div>

  <!-- Students list -->
  <div id="classroom-list"></div>

  <!-- Link Modal -->
  <div id="classroom-link-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
    <div style="background:white;border-radius:20px;padding:28px 24px;max-width:420px;width:92%;box-shadow:0 8px 32px rgba(0,0,0,0.2);">
      <div style="font-weight:900;font-size:1.1rem;color:#374151;margin-bottom:6px;">🎥 Start Class</div>
      <div id="classroom-link-student" style="font-size:0.85rem;color:#6B7280;margin-bottom:16px;"></div>
      <label style="font-size:0.8rem;font-weight:700;color:#6B7280;display:block;margin-bottom:6px;">Tencent Meeting Link</label>
      <input id="classroom-link-input" placeholder="Paste your Tencent Meeting link here..." style="width:100%;padding:10px 14px;border:1.5px solid #DDD6FE;border-radius:10px;font-size:0.9rem;font-family:'Nunito',sans-serif;box-sizing:border-box;margin-bottom:14px;">
      <div style="display:flex;gap:8px;">
        <button onclick="closeClassroomModal()" style="flex:1;padding:10px;border-radius:10px;border:1.5px solid #E5E7EB;background:white;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif;">Cancel</button>
        <button onclick="startClassNow()" style="flex:2;padding:10px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:10px;font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;">▶ Start & Open Meeting</button>
      </div>
    </div>
  </div>

`;

content = content.substring(0, pageStart) + newPage + content.substring(pageEnd);
console.log('✅ Classroom page replaced');

// Add JavaScript
const classroomJS = `
var classroomDayOffset = 0;
var _classroomStudent = null;
var _classroomTimer = null;
var _classroomSeconds = 0;

function renderClassroom(){
  var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var d = new Date().getDay();
  var baseIdx = d===0?6:d-1;
  var showIdx = (baseIdx+classroomDayOffset+7)%7;
  var isToday = classroomDayOffset===0;
  var dayLabel = document.getElementById('classroom-day-label');
  if(dayLabel) dayLabel.textContent = isToday ? '📅 Today (' + days[showIdx] + ')' : '📅 ' + days[showIdx];

  var sched = getTodaySlots(classroomDayOffset);
  var list = document.getElementById('classroom-list');
  if(!list) return;

  if(sched.length === 0){
    list.innerHTML = '<div style="text-align:center;color:#9CA3AF;padding:40px 0;font-size:0.9rem;">No classes scheduled for this day.</div>';
    return;
  }

  list.innerHTML = sched.map(function(slot){
    var s = slot.s;
    var status = slot.status;
    var statusColors = {done:'#22C55E', now:'#F97316', upcoming:'#3B82F6'};
    var statusLabels = {done:'✓ Done', now:'🔴 Now', upcoming:'Upcoming'};
    var color = statusColors[status] || '#3B82F6';
    var label = statusLabels[status] || 'Upcoming';
    return '<div style="background:white;border-radius:14px;padding:16px 18px;margin-bottom:10px;border:1.5px solid #F3F4F6;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">'
      +'<div style="display:flex;align-items:center;gap:12px;flex:1;">'
        +'<div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,'+s.c1+','+s.c2+');display:flex;align-items:center;justify-content:center;font-size:1.3rem;">'+s.avatar+'</div>'
        +'<div>'
          +'<div style="font-weight:800;font-size:0.95rem;color:#374151;">'+s.name+'</div>'
          +'<div style="font-size:0.78rem;color:#6B7280;">'+slot.time+' · '+s.duration+'</div>'
        +'</div>'
      +'</div>'
      +'<div style="display:flex;align-items:center;gap:8px;">'
        +'<span style="background:'+color+'1A;color:'+color+';padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">'+label+'</span>'
        +'<button onclick="openClassroomModal(\''+s.name+'\',\''+s.duration+'\')" style="padding:8px 16px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:10px;font-weight:800;font-size:0.82rem;cursor:pointer;font-family:\'Nunito\',sans-serif;">▶ Start</button>'
      +'</div>'
    +'</div>';
  }).join('');
}

function openClassroomModal(studentName, duration){
  _classroomStudent = {name: studentName, duration: duration};
  document.getElementById('classroom-link-student').textContent = '👤 ' + studentName + ' · ' + duration;
  document.getElementById('classroom-link-input').value = '';
  document.getElementById('classroom-link-modal').style.display = 'flex';
}

function closeClassroomModal(){
  document.getElementById('classroom-link-modal').style.display = 'none';
  _classroomStudent = null;
}

function startClassNow(){
  var link = document.getElementById('classroom-link-input').value.trim();
  if(!link){ alert('Please paste your Tencent Meeting link!'); return; }
  // Open meeting in new tab
  window.open(link, '_blank');
  closeClassroomModal();
  // Start timer
  startClassTimer(_classroomStudent || {name:'Student', duration:'25 min'});
}

function startClassTimer(student){
  // Stop any existing timer
  if(_classroomTimer) clearInterval(_classroomTimer);
  _classroomSeconds = 0;
  var card = document.getElementById('classroom-timer-card');
  var nameEl = document.getElementById('classroom-timer-name');
  var durEl = document.getElementById('classroom-timer-duration');
  if(card) card.style.display = 'block';
  if(nameEl) nameEl.textContent = student.name;
  if(durEl) durEl.textContent = student.duration;
  _classroomTimer = setInterval(function(){
    _classroomSeconds++;
    var mins = Math.floor(_classroomSeconds / 60);
    var secs = _classroomSeconds % 60;
    var display = document.getElementById('classroom-timer-display');
    if(display) display.textContent = String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
    // Alert when class duration is reached
    var durMins = parseInt(student.duration) || 25;
    if(_classroomSeconds === durMins * 60){
      alert('⏰ ' + student.duration + ' is up! Class time for ' + student.name + ' is complete.');
    }
  }, 1000);
}

function stopClassTimer(){
  if(_classroomTimer) clearInterval(_classroomTimer);
  _classroomTimer = null;
  _classroomSeconds = 0;
  var card = document.getElementById('classroom-timer-card');
  if(card) card.style.display = 'none';
  var display = document.getElementById('classroom-timer-display');
  if(display) display.textContent = '00:00';
}`;

const lastScript = content.lastIndexOf('</script>');
content = content.substring(0, lastScript) + classroomJS + '\n</script>' + content.substring(lastScript + 9);
console.log('✅ Classroom JavaScript added');

// Add renderClassroom to nav function
content = content.replace(
  "if(page==='classroom')initWB();",
  "if(page==='classroom'){renderClassroom();}"
);
console.log('✅ renderClassroom called when tab opens');

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments',
  'function renderClassroom'
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
console.log('✅ Live Classroom page is ready!');
