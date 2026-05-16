const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
let lines = content.split('\n');

console.log('==========================================');
console.log('   TEACHSMART - FIXING ALL CRITICAL ISSUES');
console.log('==========================================\n');

// ── FIX 1: Remove duplicate showDay ──────────────
console.log('── FIX 1: Remove duplicate showDay ──');
const showDayCount = (content.match(/function showDay/g)||[]).length;
console.log('showDay appears', showDayCount, 'times');

if(showDayCount > 1) {
  // Find second occurrence and remove it + its closing brace
  const first = content.indexOf('function showDay');
  const second = content.indexOf('function showDay', first + 1);
  
  // Find end of second showDay function
  let depth = 0;
  let started = false;
  let end = second;
  for(let i = second; i < content.length; i++) {
    if(content[i] === '{') { depth++; started = true; }
    if(content[i] === '}') { depth--; }
    if(started && depth === 0) { end = i + 1; break; }
  }
  
  content = content.substring(0, second) + content.substring(end);
  console.log('✅ Duplicate showDay removed');
} else {
  console.log('✅ No duplicate showDay found');
}

// ── FIX 2: Replace initWB with renderClassroom in nav ──
console.log('\n── FIX 2: Replace initWB() with renderClassroom() in nav ──');
if(content.includes("if(page==='classroom')initWB();")) {
  content = content.replace(
    "if(page==='classroom')initWB();",
    "if(page==='classroom')renderClassroom();"
  );
  console.log('✅ initWB() replaced with renderClassroom()');
} else {
  console.log('⚠️ initWB not found - checking alternatives...');
  if(content.includes('classroom')) {
    console.log('classroom exists in nav but format is different');
  }
}

// ── FIX 3: Add page-absence div ──────────────────
console.log('\n── FIX 3: Add page-absence div ──');
if(content.includes('id="page-absence"')) {
  console.log('✅ page-absence already exists');
} else {
  // Find page-settings to insert before it
  const settingsIdx = content.indexOf('id="page-settings"');
  if(settingsIdx === -1) {
    console.error('❌ Could not find page-settings to insert before!');
  } else {
    const insertPoint = content.lastIndexOf('<div class="page"', settingsIdx);
    const absencePage = `<div class="page" id="page-absence">
  <div class="page-header">
    <div><div class="page-title">📋 Absence Log</div><div class="page-sub">Track student and teacher absences</div></div>
  </div>
  <div style="text-align:center;color:#9CA3AF;padding:60px 0;font-size:0.9rem;">
    <div style="font-size:3rem;margin-bottom:12px;">📋</div>
    <div style="font-weight:700;margin-bottom:6px;">Absence Log Coming Soon</div>
    <div style="font-size:0.8rem;">This feature is being built.</div>
  </div>
</div>
`;
    content = content.substring(0, insertPoint) + absencePage + content.substring(insertPoint);
    console.log('✅ page-absence div added');
  }
}

// ── FIX 4: Add renderClassroom function ──────────
console.log('\n── FIX 4: Add renderClassroom function ──');
if(content.includes('function renderClassroom')) {
  console.log('✅ renderClassroom already exists');
} else {
  const classroomFn = `
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
        +'<div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,'+s.c1+','+s.c2+');display:flex;align-items:center;justify-content:center;font-size:1.3rem;">'+(s.avatar||s.name.charAt(0))+'</div>'
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
  var el = document.getElementById('classroom-link-student');
  if(el) el.textContent = '👤 ' + studentName + ' · ' + duration;
  var inp = document.getElementById('classroom-link-input');
  if(inp) inp.value = '';
  var modal = document.getElementById('classroom-link-modal');
  if(modal) modal.style.display = 'flex';
}

function closeClassroomModal(){
  var modal = document.getElementById('classroom-link-modal');
  if(modal) modal.style.display = 'none';
}

function startClassNow(){
  var inp = document.getElementById('classroom-link-input');
  var link = inp ? inp.value.trim() : '';
  if(!link){ alert('Please paste your Tencent Meeting link!'); return; }
  window.open(link, '_blank');
  closeClassroomModal();
  if(_classroomStudent) startClassTimer(_classroomStudent);
}

function startClassTimer(student){
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
    var mins = Math.floor(_classroomSeconds/60);
    var secs = _classroomSeconds%60;
    var display = document.getElementById('classroom-timer-display');
    if(display) display.textContent = String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
    var durMins = parseInt(student.duration)||25;
    if(_classroomSeconds === durMins*60){
      alert('⏰ '+student.duration+' is up! Class time for '+student.name+' is complete.');
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
  content = content.substring(0, lastScript) + classroomFn + '\n</script>' + content.substring(lastScript + 9);
  console.log('✅ renderClassroom function added');
}

// ── FIX 5: Fix double semicolon in nav ───────────
console.log('\n── FIX 5: Fix double semicolon in schedule nav ──');
if(content.includes('renderClassNotes();;')) {
  content = content.replace('renderClassNotes();;', 'renderClassNotes();');
  console.log('✅ Double semicolon fixed');
} else {
  console.log('✅ No double semicolon found');
}

// ── FINAL CHECKS ─────────────────────────────────
console.log('\n── FINAL CHECKS ──');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData',
  'function getPayments','function renderClassroom','function showDay',
  'function updateFolderCounts','function saveClassNote'
];
let fail = false;
checks.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g'))||[]).length;
  if(count === 0) { console.log('❌ MISSING:', fn); fail = true; }
  else if(count > 1) { console.log('❌ DUPLICATE:', fn, '('+count+'x)'); fail = true; }
  else console.log('✅', fn);
});

// Check page-absence exists
console.log(content.includes('id="page-absence"') ? '✅ page-absence exists' : '❌ page-absence MISSING');

const ot = (content.match(/<script/g)||[]).length;
const ct = (content.match(/<\/script>/g)||[]).length;
if(ot !== ct) { console.log('❌ Script tags unbalanced:', ot, 'open,', ct, 'close'); fail = true; }
else console.log('✅ Script tags balanced ('+ot+' pairs)');

console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if(fail) { console.error('\n❌ Checks failed! File NOT saved.'); process.exit(1); }

fs.writeFileSync('index.html', content, 'utf8');
console.log('\n==========================================');
console.log('done: true');
console.log('✅ All 4 critical issues fixed!');
console.log('==========================================');
