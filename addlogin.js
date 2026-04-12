const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Add schedule modal HTML before </body>
const scheduleModal = `
<div id="schedule-modal" class="modal-overlay">
  <div class="modal" style="max-width:480px;width:95%">
    <div class="modal-header">
      <div class="modal-title">📅 Weekly Schedule</div>
      <button class="modal-close" onclick="closeModal('schedule-modal')">✕</button>
    </div>
    <div class="modal-body">
      <div id="sched-student-name" style="font-weight:700;font-size:1.1rem;margin-bottom:16px;color:var(--purple)"></div>
      <div style="display:grid;gap:10px;" id="sched-days">
        ${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day=>`
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:90px;font-weight:600;font-size:0.85rem;">${day}</div>
          <input type="time" id="sched-${day}-start" style="flex:1;padding:6px;border-radius:6px;border:1px solid #E5E7EB;font-size:0.85rem;" />
          <span style="font-size:0.8rem;color:#888;">to</span>
          <input type="time" id="sched-${day}-end" style="flex:1;padding:6px;border-radius:6px;border:1px solid #E5E7EB;font-size:0.85rem;" />
        </div>`).join('')}
      </div>
      <div style="margin-top:16px;">
        <label style="font-weight:600;font-size:0.85rem;">Notes</label>
        <textarea id="sched-notes" rows="2" style="width:100%;padding:8px;border-radius:6px;border:1px solid #E5E7EB;font-size:0.85rem;margin-top:4px;box-sizing:border-box;"></textarea>
      </div>
      <button onclick="saveSchedule()" class="btn btn-primary" style="width:100%;margin-top:16px;">💾 Save Schedule</button>
    </div>
  </div>
</div>`;

h = h.replace('</body>', scheduleModal + '\n</body>');

// Add openSchedule and saveSchedule functions
const schedFunctions = `
let currentSchedId = null;
function openSchedule(id){
  const s = students.find(x=>x.id===id);
  if(!s) return;
  currentSchedId = id;
  document.getElementById('sched-student-name').textContent = s.name;
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const sched = s.weekSchedule || {};
  days.forEach(day=>{
    document.getElementById('sched-'+day+'-start').value = sched[day]?.start || '';
    document.getElementById('sched-'+day+'-end').value = sched[day]?.end || '';
  });
  document.getElementById('sched-notes').value = s.schedNotes || '';
  openModal('schedule-modal');
}
function saveSchedule(){
  const s = students.find(x=>x.id===currentSchedId);
  if(!s) return;
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  s.weekSchedule = {};
  days.forEach(day=>{
    const start = document.getElementById('sched-'+day+'-start').value;
    const end = document.getElementById('sched-'+day+'-end').value;
    if(start||end) s.weekSchedule[day] = {start,end};
  });
  s.schedNotes = document.getElementById('sched-notes').value;
  saveData();
  closeModal('schedule-modal');
  renderStudents();
  alert('Schedule saved!');
}`;

h = h.replace('function isUpcoming', schedFunctions + '\nfunction isUpcoming');

// Add schedule button to each student card
const oldBtn = "Report</button>\r\n        <button class=\"s-btn\" style=\"background:#DCFCE7";
const newBtn = "Report</button>\r\n        <button class=\"s-btn\" style=\"background:#EDE9FE;color:#5B21B6;\" onclick=\"openSchedule(${s.id})\">📅 Schedule</button>\r\n        <button class=\"s-btn\" style=\"background:#DCFCE7";

h = h.replace(oldBtn, newBtn);

fs.writeFileSync('index.html', h, 'utf8');
console.log('modal:', h.includes('schedule-modal'));
console.log('functions:', h.includes('openSchedule'));
console.log('button:', h.includes('📅 Schedule'));