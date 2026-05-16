const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('=== Fixing renderReports using line numbers ===');

// Find renderReports start line
let fnStart = -1;
for(let i = 0; i < lines.length; i++) {
  if(lines[i].includes('function renderReports')) { fnStart = i; break; }
}

// Find end - look for next // ─── comment or next function
let fnEnd = -1;
for(let i = fnStart + 1; i < lines.length; i++) {
  if(lines[i].includes('// ─── HALL OF FAME') || lines[i].includes('// ─── HOF')) {
    fnEnd = i;
    break;
  }
}

console.log('renderReports: lines', fnStart+1, 'to', fnEnd);

if(fnStart === -1 || fnEnd === -1) {
  console.error('❌ Could not find renderReports boundaries!');
  process.exit(1);
}

const newFnLines = `function renderReports(){
  var el=document.getElementById('report-list');
  if(!el)return;
  var allStudents=JSON.parse(localStorage.getItem('ts-students')||'[]');
  if(allStudents.length===0){
    el.innerHTML='<div style="text-align:center;color:#9CA3AF;padding:40px 0;">No students found.</div>';
    return;
  }
  function skillColor(v){return v>=80?'var(--green)':v>=60?'var(--orange)':'var(--red)';}
  el.innerHTML=allStudents.map(function(s){
    var skills=s.skills||[];
    var hasSkills=skills.length>0;
    var skillsHtml=hasSkills
      ?skills.map(function(sk){
        return '<div style="margin-bottom:8px;">'
          +'<div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:700;margin-bottom:3px;">'
            +'<span>'+sk.name+'</span>'
            +'<span style="color:'+skillColor(sk.value)+'">'+sk.value+'%</span>'
          +'</div>'
          +'<div class="skill-bar"><div class="skill-fill" style="width:'+sk.value+'%;background:'+skillColor(sk.value)+'"></div></div>'
        +'</div>';
      }).join('')
      :'<div style="color:#9CA3AF;font-size:0.82rem;text-align:center;padding:10px 0;">No skills added yet.</div>';
    var attendanceLog=s.attendanceLog||[];
    var presentCount=attendanceLog.filter(function(l){return l.status==='present';}).length;
    var totalCount=attendanceLog.length;
    var attPct=totalCount>0?Math.round((presentCount/totalCount)*100):(s.attendance||100);
    var level=s.level||'Beginner';
    var levelColor=level==='Advanced'?'#7C3AED':level==='Intermediate'?'#2563EB':'#15803D';
    var levelBg=level==='Advanced'?'#F5F3FF':level==='Intermediate'?'#EFF6FF':'#F0FDF4';
    return '<div class="report-card">'
      +'<div class="report-header">'
        +'<div style="display:flex;align-items:center;gap:10px;">'
          +'<div style="font-size:1.8rem;">'+s.avatar+'</div>'
          +'<div>'
            +'<div style="font-weight:800;font-size:0.95rem;">'+s.name+'</div>'
            +'<div style="font-size:0.75rem;color:#6B7280;">'+s.nat+' · '+s.classes+' classes left</div>'
          +'</div>'
        +'</div>'
        +'<span style="background:'+levelBg+';color:'+levelColor+';padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">'+level+'</span>'
      +'</div>'
      +'<div style="padding:12px 0;border-bottom:1px solid #F3F4F6;">'
        +'<div style="display:flex;justify-content:space-around;text-align:center;">'
          +'<div><div style="font-weight:800;color:#22C55E;font-size:1.1rem;">'+presentCount+'</div><div style="font-size:0.72rem;color:#6B7280;">Present</div></div>'
          +'<div><div style="font-weight:800;color:#A855F7;font-size:1.1rem;">'+attPct+'%</div><div style="font-size:0.72rem;color:#6B7280;">Attendance</div></div>'
          +'<div><div style="font-weight:800;color:#3B82F6;font-size:1.1rem;">'+s.duration+'</div><div style="font-size:0.72rem;color:#6B7280;">Duration</div></div>'
        +'</div>'
      +'</div>'
      +'<div style="padding:12px 0;">'+skillsHtml+'</div>'
      +'<div class="report-footer">'
        +'<button class="s-btn" style="background:#EFF6FF;color:#1D4ED8;" onclick="openStudentProfile('+s.id+')">👤 View Profile</button>'
      +'</div>'
    +'</div>';
  }).join('');
}
`.split('\n');

lines.splice(fnStart, fnEnd - fnStart, ...newFnLines);
content = lines.join('\n');
console.log('✅ renderReports replaced');

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments'
];
let fail = false;
checks.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g'))||[]).length;
  if(count !== 1) { console.log('❌', fn, '—', count, 'times'); fail = true; }
  else console.log('✅', fn);
});
const ot = (content.match(/<script/g)||[]).length;
const ct = (content.match(/<\/script>/g)||[]).length;
if(ot !== ct) { console.log('❌ Script tags unbalanced!'); fail = true; }
else console.log('✅ Script tags balanced ('+ot+' pairs)');
console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if(fail) { console.error('\n❌ Final check failed! File NOT saved.'); process.exit(1); }

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ Progress Reports now shows all real students!');
