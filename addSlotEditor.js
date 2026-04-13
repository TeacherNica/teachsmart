const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const originalLength = html.length;

// Find the renderScheduleGrid function and patch the cell() function
// We need to:
// 1. Make "Close" cells clickable to open a popup
// 2. Make "Available" cells clickable to open a popup
// 3. Add a modal popup for slot editing
// 4. Save changes to localStorage

// ── Find the exact close and avail returns inside cell() ──────────────────
const OLD_CLOSE = `if(!name)return '<td style="background:#EF4444;color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;">Close</td>';
    if(name==='Avail')return '<td style="background:#EAB308;color:#000;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;">Available</td>';`;

const NEW_CLOSE = `if(!name)return '<td style="background:#EF4444;color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;cursor:pointer;" onclick="openSlotModal(this,null)" title="Click to open slot">🔒 Close</td>';
    if(name==='Avail')return '<td style="background:#EAB308;color:#000;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;cursor:pointer;" onclick="openSlotModal(this,\'avail\')" title="Click to assign student">📢 Available</td>';`;

if (!html.includes(OLD_CLOSE)) {
  console.error('ERROR: Could not find Close/Avail returns in cell(). Aborting.');
  process.exit(1);
}
html = html.replace(OLD_CLOSE, NEW_CLOSE);
console.log('✅ Patched Close and Available cells');

// ── Add the slot modal HTML before </body> ────────────────────────────────
const SLOT_MODAL = `
<!-- SLOT EDITOR MODAL -->
<div class="modal-overlay" id="slot-modal">
  <div class="modal" style="max-width:380px;">
    <div class="modal-title" id="slot-modal-title">📅 Edit Slot</div>
    <div id="slot-modal-body" style="margin-bottom:16px;"></div>
    <div class="modal-footer">
      <button class="btn-cancel" onclick="closeModal('slot-modal')">Cancel</button>
    </div>
  </div>
</div>
`;

html = html.replace('</body>', SLOT_MODAL + '</body>');
console.log('✅ Added slot editor modal');

// ── Add the slot editor JavaScript before </script> at end ────────────────
// Find the last </script> before </body>
const SLOT_JS = `

// ── SLOT EDITOR ───────────────────────────────────────────────────────────
let currentSlotCell = null;

function openSlotModal(td, type) {
  currentSlotCell = td;
  const title = document.getElementById('slot-modal-title');
  const body = document.getElementById('slot-modal-body');

  // Get time info from the row
  const row = td.parentElement;
  const thTime = row.cells[0].textContent.trim();
  const dayHeaders = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const colIdx = td.cellIndex - 2; // subtract Thai time + China time cols
  const dayName = dayHeaders[colIdx] || '';

  title.textContent = '📅 ' + dayName + ' · ' + thTime;

  if (type === null) {
    // Currently CLOSED — offer to open or assign
    body.innerHTML = `
      <p style="font-size:13px;color:#6B7280;margin-bottom:16px;">This slot is currently <strong style="color:#EF4444;">closed</strong>. What would you like to do?</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button onclick="setSlotAvailable()" style="padding:12px;border-radius:12px;border:2px solid #EAB308;background:#FFFDE7;font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#713F12;">📢 Mark as Available</button>
        <div style="position:relative;">
          <input id="slot-student-input" list="slot-students-list" placeholder="👤 Assign a student name..." style="width:100%;padding:11px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:'Quicksand',sans-serif;font-weight:600;font-size:13px;outline:none;box-sizing:border-box;" oninput="document.getElementById('slot-assign-btn').style.opacity=this.value?'1':'0.5'">
          <datalist id="slot-students-list">${students.map(s=>`<option value="${s.name}">`).join('')}</datalist>
        </div>
        <button id="slot-assign-btn" onclick="assignSlotStudent()" style="padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;cursor:pointer;opacity:0.5;">✅ Assign Student</button>
      </div>
    `;
  } else {
    // Currently AVAILABLE — offer to assign or close
    body.innerHTML = `
      <p style="font-size:13px;color:#6B7280;margin-bottom:16px;">This slot is <strong style="color:#EAB308;">available</strong>. Assign a student or close it.</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="position:relative;">
          <input id="slot-student-input" list="slot-students-list2" placeholder="👤 Type student name..." style="width:100%;padding:11px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:'Quicksand',sans-serif;font-weight:600;font-size:13px;outline:none;box-sizing:border-box;" oninput="document.getElementById('slot-assign-btn2').style.opacity=this.value?'1':'0.5'">
          <datalist id="slot-students-list2">${students.map(s=>`<option value="${s.name}">`).join('')}</datalist>
        </div>
        <button id="slot-assign-btn2" onclick="assignSlotStudent()" style="padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;cursor:pointer;opacity:0.5;">✅ Assign Student</button>
        <button onclick="closeSlot()" style="padding:12px;border-radius:12px;border:2px solid #EF4444;background:white;font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#EF4444;">🔒 Close This Slot</button>
      </div>
    `;
  }
  openModal('slot-modal');
}

function setSlotAvailable() {
  if (!currentSlotCell) return;
  currentSlotCell.style.background = '#EAB308';
  currentSlotCell.style.color = '#000';
  currentSlotCell.textContent = '📢 Available';
  currentSlotCell.onclick = function() { openSlotModal(this, 'avail'); };
  currentSlotCell.title = 'Click to assign student';
  saveSlotChanges();
  closeModal('slot-modal');
}

function closeSlot() {
  if (!currentSlotCell) return;
  currentSlotCell.style.background = '#EF4444';
  currentSlotCell.style.color = '#fff';
  currentSlotCell.textContent = '🔒 Close';
  currentSlotCell.onclick = function() { openSlotModal(this, null); };
  currentSlotCell.title = 'Click to open slot';
  saveSlotChanges();
  closeModal('slot-modal');
}

function assignSlotStudent() {
  const inp = document.getElementById('slot-student-input');
  const name = inp ? inp.value.trim() : '';
  if (!name) { alert('Please enter a student name!'); return; }
  if (!currentSlotCell) return;

  // Find student for color
  const s = students.find(x => x.name === name);
  const KR = '\uD83C\uDDF0\uD83C\uDDF7';
  const CN = '\uD83C\uDDE8\uD83C\uDDF3';
  const isKR = s && s.nat.includes('Korean');
  const flag = s ? (isKR ? KR : CN) : '';
  const bg = s ? (isKR ? '#FCE4EC' : '#FFF3E0') : '#E8EAF6';
  const text = s ? (isKR ? '#880E4F' : '#BF360C') : '#1E1B4B';

  currentSlotCell.style.background = bg;
  currentSlotCell.style.color = text;
  currentSlotCell.innerHTML = (flag ? '<img src="https://flagcdn.com/16x12/'+(isKR?'kr':'cn')+'.png" style="vertical-align:middle;margin-right:3px;"> ' : '') + name;
  currentSlotCell.onclick = null; // lock — don't allow editing existing students
  currentSlotCell.style.cursor = 'default';
  currentSlotCell.title = '';
  saveSlotChanges();
  closeModal('slot-modal');
  alert('✅ ' + name + ' assigned to this slot!');
}

function saveSlotChanges() {
  // Save the current grid state so it persists on reload
  const body = document.getElementById('sched-body');
  if (body) localStorage.setItem('ts-slot-overrides', body.innerHTML);
}

function loadSlotChanges() {
  const saved = localStorage.getItem('ts-slot-overrides');
  if (saved) {
    const body = document.getElementById('sched-body');
    if (body) {
      body.innerHTML = saved;
      // Re-attach onclick handlers for Close and Available cells
      body.querySelectorAll('td').forEach(td => {
        const t = td.textContent.trim();
        if (t === '🔒 Close') td.onclick = function() { openSlotModal(this, null); };
        if (t === '📢 Available') td.onclick = function() { openSlotModal(this, 'avail'); };
      });
    }
  }
}

// Hook into nav to load saved slots when schedule tab opens
const _origNav = window.nav;
window.nav = function(page, btn) {
  _origNav(page, btn);
  if (page === 'schedule') {
    setTimeout(loadSlotChanges, 100);
  }
};
`;

// Insert before the last </script>
const lastScript = html.lastIndexOf('</script>');
if (lastScript === -1) {
  console.error('ERROR: Could not find </script>. Aborting.');
  process.exit(1);
}
html = html.slice(0, lastScript) + SLOT_JS + '\n' + html.slice(lastScript);
console.log('✅ Added slot editor JavaScript');

// ── Safety check ──────────────────────────────────────────────────────────
if (html.length < originalLength) {
  console.error('ERROR: file shrank! Aborting.');
  process.exit(1);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true — grew by ' + (html.length - originalLength) + ' bytes');
