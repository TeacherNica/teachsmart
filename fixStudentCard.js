const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;
const htmlNorm = html.replace(/\r\n/g, '\n');

// ── 1. Make level tag clickable ───────────────────────────────────────────
const OLD_LEVEL = '<div class="level-tag" style="background:${lvs.bg};color:${lvs.color};">${s.level}</div>';
const NEW_LEVEL = '<div class="level-tag" style="background:${lvs.bg};color:${lvs.color};cursor:pointer;" onclick="cycleLevel(${s.id},event)" title="Click to change level">${s.level} ✏️</div>';

if(!htmlNorm.includes(OLD_LEVEL)){console.error('ERROR: level tag not found');process.exit(1);}

// ── 2. Add "Set Package" button to card footer ────────────────────────────
const OLD_RENEW = '${s.classes<=2?`<button class="s-btn" style="background:#FFF1F2;color:#BE123C;">🔄 Renew</button>`:\'\'}';
const NEW_RENEW = '<button class="s-btn" style="background:#E0F2FE;color:#0369A1;" onclick="openSetPackage(${s.id},event)">📦 Set Package</button>\n        ${s.classes<=2?`<button class="s-btn" style="background:#FFF1F2;color:#BE123C;">🔄 Renew</button>`:\'\'}';

if(!htmlNorm.includes(OLD_RENEW)){console.error('ERROR: renew button not found');process.exit(1);}

let result = htmlNorm
  .replace(OLD_LEVEL, NEW_LEVEL)
  .replace(OLD_RENEW, NEW_RENEW);

// ── 3. Add cycleLevel and openSetPackage functions + modal ────────────────
const INJECT_BEFORE = '</body>\n</html>';
const NEW_CODE = `
<!-- SET PACKAGE MODAL -->
<div id="pkg-modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);z-index:300;align-items:center;justify-content:center;" onclick="if(event.target===this)closePkgModal()">
  <div style="background:white;border-radius:22px;padding:26px;width:340px;box-shadow:0 20px 60px rgba(0,0,0,0.2);">
    <div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:18px;margin-bottom:6px;">📦 Set Package</div>
    <div id="pkg-modal-info" style="font-size:12px;color:#6B7280;margin-bottom:16px;"></div>
    <label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Classes Bought</label>
    <input id="pkg-classes-input" type="number" min="1" max="100" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:'Quicksand',sans-serif;font-weight:700;font-size:18px;outline:none;margin-bottom:6px;text-align:center;">
    <div id="pkg-current-info" style="font-size:11px;color:#6B7280;margin-bottom:16px;text-align:center;"></div>
    <div style="display:flex;gap:8px;">
      <button onclick="closePkgModal()" style="flex:1;padding:11px;border-radius:12px;border:2px solid #E5E7EB;background:white;font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#6B7280;">Cancel</button>
      <button onclick="savePkgModal()" style="flex:2;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">💾 Save</button>
    </div>
  </div>
</div>
<script>
var _pkgStudentId = null;
function openSetPackage(id, e){
  if(e) e.stopPropagation();
  var s = students.find(x=>x.id===id);
  if(!s) return;
  _pkgStudentId = id;
  document.getElementById('pkg-modal-info').textContent = s.name + ' · Currently: ' + s.classes + ' classes left of ' + s.total + ' bought';
  document.getElementById('pkg-current-info').textContent = 'Currently ' + s.classes + ' remaining / ' + s.total + ' total';
  document.getElementById('pkg-classes-input').value = s.total;
  document.getElementById('pkg-modal-overlay').style.display = 'flex';
  setTimeout(function(){document.getElementById('pkg-classes-input').focus();document.getElementById('pkg-classes-input').select();},100);
}
function closePkgModal(){
  document.getElementById('pkg-modal-overlay').style.display = 'none';
  _pkgStudentId = null;
}
function savePkgModal(){
  var s = students.find(x=>x.id===_pkgStudentId);
  if(!s) return;
  var newTotal = parseInt(document.getElementById('pkg-classes-input').value);
  if(!newTotal||newTotal<1){alert('Please enter a valid number!');return;}
  var diff = newTotal - s.total;
  s.total = newTotal;
  s.classes = Math.max(0, s.classes + diff);
  saveData();
  renderStudents();
  closePkgModal();
  alert('✅ Package updated! ' + s.name + ' now has ' + s.classes + ' classes left of ' + s.total + ' bought.');
}
function cycleLevel(id, e){
  if(e) e.stopPropagation();
  var s = students.find(x=>x.id===id);
  if(!s) return;
  var levels = ['Beginner','Intermediate','Advanced'];
  var idx = levels.indexOf(s.level);
  s.level = levels[(idx+1)%3];
  saveData();
  renderStudents();
}
</script>
`;

if(!result.includes(INJECT_BEFORE)){console.error('ERROR: </body> not found');process.exit(1);}
result = result.replace(INJECT_BEFORE, NEW_CODE + INJECT_BEFORE);

if(result.length < original){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync('index.html', result, 'utf8');
console.log('done: true - grew by '+(result.length-original)+' bytes');
