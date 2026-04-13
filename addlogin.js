const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find page-students and everything until page-header, replace with clean version
const pageStart = h.indexOf('page-students">');
const pageHeaderStart = h.indexOf('<div class="page-header">', pageStart);

// Get the junk between page-students and page-header
const junk = h.substring(pageStart + 'page-students">'.length, pageHeaderStart);
console.log('junk to remove:', JSON.stringify(junk.substring(0, 100)));

const scheduleBar = `
<div id="weekly-schedule-bar" style="margin-bottom:20px;">
  <div style="background:linear-gradient(135deg,#1E1B4B,#312E81);border-radius:14px;padding:16px 20px;margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;gap:24px;">
        <div style="text-align:center;">
          <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">&#127481;&#127469; THAILAND</div>
          <div id="stu-th-clock" style="font-size:1.3rem;font-weight:800;color:#fff;"></div>
        </div>
        <div style="text-align:center;">
          <div style="font-size:0.7rem;font-weight:700;color:#A5B4FC;letter-spacing:1px;">&#127464;&#127475; CHINA</div>
          <div id="stu-cn-clock" style="font-size:1.3rem;font-weight:800;color:#fff;"></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span style="color:#A5B4FC;font-size:0.8rem;font-weight:600;">Timer:</span>
        <button onclick="startClassTimer(25)" style="padding:6px 12px;border-radius:8px;border:none;background:#6366F1;color:#fff;font-weight:700;cursor:pointer;font-size:0.82rem;">25 min</button>
        <button onclick="startClassTimer(50)" style="padding:6px 12px;border-radius:8px;border:none;background:#A855F7;color:#fff;font-weight:700;cursor:pointer;font-size:0.82rem;">50 min</button>
        <div id="stu-timer-display" style="font-size:1.2rem;font-weight:800;color:#FCD34D;min-width:55px;text-align:center;">--:--</div>
        <button onclick="stopClassTimer()" style="padding:6px 10px;border-radius:8px;border:none;background:#EF4444;color:#fff;font-weight:700;cursor:pointer;">&#9632;</button>
      </div>
    </div>
  </div>
  <div style="font-weight:800;font-size:1rem;margin-bottom:10px;color:var(--dark);">&#128197; Today's Schedule</div>
  <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;">
    <button id="day-btn-0" onclick="showDay(0)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Mon</button>
    <button id="day-btn-1" onclick="showDay(1)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Tue</button>
    <button id="day-btn-2" onclick="showDay(2)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Wed</button>
    <button id="day-btn-3" onclick="showDay(3)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Thu</button>
    <button id="day-btn-4" onclick="showDay(4)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Fri</button>
    <button id="day-btn-5" onclick="showDay(5)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Sat</button>
    <button id="day-btn-6" onclick="showDay(6)" style="padding:6px 14px;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.82rem;border:1px solid #E5E7EB;background:white;color:#333;">Sun</button>
  </div>
  <div id="day-schedule" style="display:grid;gap:8px;"></div>
</div>
`;

h = h.substring(0, pageStart + 'page-students">'.length) + '\n' + scheduleBar + '\n' + h.substring(pageHeaderStart);

fs.writeFileSync('index.html', h, 'utf8');
console.log('bar:', h.includes('weekly-schedule-bar'));
console.log('day-btn:', h.includes('day-btn-0'));