const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// ── 1. Make Low Packages card clickable ───────────────────────────────────
const OLD_STAT = '<div class="stat"><div class="stat-icon" style="background:linear-gradient(135deg,#CCFBF1,#99F6E4)">⚠️</div><div class="stat-val" style="color:var(--teal)" id="dash-low">0</div><div class="stat-label">Low Packages</div></div>';
const NEW_STAT = '<div class="stat" style="cursor:pointer;" onclick="openLowPkgModal()"><div class="stat-icon" style="background:linear-gradient(135deg,#CCFBF1,#99F6E4)">⚠️</div><div class="stat-val" style="color:var(--teal)" id="dash-low">0</div><div class="stat-label">Low Packages</div></div>';

if(!html.includes(OLD_STAT)){console.error('ERROR: Low Packages card not found');process.exit(1);}
html = html.replace(OLD_STAT, NEW_STAT);
console.log('Patch 1 done: Low Packages card clickable');

// ── 2. Add modal + JS before </body> ─────────────────────────────────────
const MODAL = `
<!-- LOW PACKAGE ALERT MODAL -->
<div id="low-pkg-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);z-index:300;align-items:center;justify-content:center;padding:20px;" onclick="if(event.target===this)closeLowPkgModal()">
  <div style="background:white;border-radius:22px;padding:26px;width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.2);">
    <div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:20px;margin-bottom:4px;">⚠️ Low Package Reminders</div>
    <div style="font-size:12px;color:#6B7280;margin-bottom:20px;">Click a student to generate their reminder message</div>
    <div id="low-pkg-students" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;"></div>
    <div id="low-pkg-msg-wrap" style="display:none;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;">Message for <span id="low-pkg-selected-name" style="color:#A855F7;"></span></label>
        <button onclick="copyLowPkgMsg()" style="padding:5px 12px;border-radius:8px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:'Quicksand',sans-serif;font-weight:700;font-size:11px;cursor:pointer;">📋 Copy to Clipboard</button>
      </div>
      <textarea id="low-pkg-textarea" style="width:100%;padding:14px;border:2px solid #E5E7EB;border-radius:12px;font-family:'Quicksand',sans-serif;font-weight:600;font-size:13px;outline:none;resize:vertical;min-height:220px;line-height:1.8;color:#1E1B4B;"></textarea>
      <div id="low-pkg-copy-confirm" style="display:none;text-align:center;padding:8px;background:#F0FDF4;border-radius:8px;color:#15803D;font-weight:700;font-size:12px;margin-top:8px;">✅ Copied! Paste it into WeChat</div>
    </div>
    <button onclick="closeLowPkgModal()" style="width:100%;margin-top:16px;padding:11px;border-radius:12px;border:2px solid #E5E7EB;background:white;font-family:'Quicksand',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#6B7280;">Close</button>
  </div>
</div>
<script>
function openLowPkgModal(){
  var lowStudents = students.filter(function(s){return s.classes<=2;});
  if(lowStudents.length===0){
    alert('🎉 No students have low packages right now!');
    return;
  }
  var btns = document.getElementById('low-pkg-students');
  btns.innerHTML = lowStudents.map(function(s){
    var bar = s.classes===0?'#EF4444':s.classes===1?'#F97316':'#FBBF24';
    return '<button onclick="selectLowPkgStudent('+s.id+')" style="padding:8px 14px;border-radius:10px;border:2px solid '+bar+';background:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:'+bar+';">'+s.name+' ('+s.classes+' left)</button>';
  }).join('');
  document.getElementById('low-pkg-msg-wrap').style.display='none';
  document.getElementById('low-pkg-overlay').style.display='flex';
}
function selectLowPkgStudent(id){
  var s = students.find(function(x){return x.id===id;});
  if(!s) return;
  document.getElementById('low-pkg-selected-name').textContent = s.name;
  var msg = "Dear Parent,\\n\\nI hope this message finds you well! 😊\\n\\nJust a friendly reminder that "+s.name+" has only "+s.classes+" class"+(s.classes!==1?"es":"")+" remaining in their current package.\\n\\nTo ensure there\\'s no interruption to their learning, I kindly ask if you\\'d like to continue. If so, please let me know at your earliest convenience so I can prepare the payment QR code in advance. 🙏\\n\\nLooking forward to hearing from you!\\n\\nWith warm regards,\\nTeacher Nica 👩\\u200d🏫\\nTeachSmart English";
  document.getElementById('low-pkg-textarea').value = msg;
  document.getElementById('low-pkg-msg-wrap').style.display='block';
  document.getElementById('low-pkg-copy-confirm').style.display='none';
  // highlight selected button
  document.querySelectorAll('#low-pkg-students button').forEach(function(b){b.style.background='white';});
  event.target.style.background='#F3E8FF';
}
function copyLowPkgMsg(){
  var ta = document.getElementById('low-pkg-textarea');
  ta.select();
  document.execCommand('copy');
  var confirm = document.getElementById('low-pkg-copy-confirm');
  confirm.style.display='block';
  setTimeout(function(){confirm.style.display='none';},3000);
}
function closeLowPkgModal(){
  document.getElementById('low-pkg-overlay').style.display='none';
}
</script>
`;

const bodyClose = html.lastIndexOf('</body>');
if(bodyClose===-1){console.error('ERROR: </body> not found');process.exit(1);}
html = html.slice(0, bodyClose) + MODAL + html.slice(bodyClose);

if(html.length < original){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - grew by '+(html.length-original)+' bytes');
