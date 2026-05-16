const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Replacing Today\'s Schedule card with Class Notes ===');

const schedPage = content.indexOf('id="page-schedule"');
const todayIdx = content.indexOf("Today's Schedule", schedPage);
const cardStart = content.lastIndexOf('<div class="card">', todayIdx);

// Find the full end of this card by counting divs
let depth = 0;
let cardEnd = -1;
let i = cardStart;
while (i < content.length) {
  if (content.substring(i, i+5) === '<div ') depth++;
  else if (content.substring(i, i+4) === '<div') depth++;
  else if (content.substring(i, i+6) === '</div>') {
    depth--;
    if (depth === 0) { cardEnd = i + 6; break; }
  }
  i++;
}

console.log('Replacing from', cardStart, 'to', cardEnd);
console.log('Old content:', content.substring(cardStart, cardEnd));

const newCard = `<div class="card">
        <div class="card-title">📝 Class Notes & Makeup Classes</div>
        <!-- Add Note Form -->
        <div style="background:#F5F3FF;border-radius:12px;padding:14px;margin-bottom:14px;">
          <div style="font-weight:700;font-size:0.82rem;color:#7C3AED;margin-bottom:10px;">➕ Add Makeup Class Note</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
            <div>
              <label style="font-size:0.72rem;font-weight:700;color:#6B7280;display:block;margin-bottom:3px;">Student</label>
              <input id="note-student" placeholder="Student name" style="width:100%;padding:7px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.82rem;box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size:0.72rem;font-weight:700;color:#6B7280;display:block;margin-bottom:3px;">Date</label>
              <input id="note-date" type="date" style="width:100%;padding:7px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.82rem;box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size:0.72rem;font-weight:700;color:#6B7280;display:block;margin-bottom:3px;">Time</label>
              <input id="note-time" type="time" style="width:100%;padding:7px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.82rem;box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size:0.72rem;font-weight:700;color:#6B7280;display:block;margin-bottom:3px;">Reason / Note</label>
              <input id="note-reason" placeholder="e.g. Makeup for Apr 10" style="width:100%;padding:7px 10px;border:1.5px solid #DDD6FE;border-radius:8px;font-size:0.82rem;box-sizing:border-box;">
            </div>
          </div>
          <button onclick="saveClassNote()" style="width:100%;padding:9px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:8px;font-weight:800;font-size:0.82rem;cursor:pointer;">💾 Save Note</button>
        </div>
        <!-- Notes List -->
        <div id="class-notes-list"></div>
      </div>`;

content = content.substring(0, cardStart) + newCard + content.substring(cardEnd);
console.log('✅ Card replaced');

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
console.log('✅ Class Notes now showing correctly in Schedule tab!');
