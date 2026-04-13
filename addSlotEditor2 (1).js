const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// Patch Close cell
const OLD_CLOSE = "if(!name)return '<td style=\"background:#EF4444;color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;\">Close</td>';";
const NEW_CLOSE = "if(!name)return '<td style=\"background:#EF4444;color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;cursor:pointer;\" onclick=\"openSlotEditor(this,\\'close\\')\">Close</td>';";

// Patch Available cell
const OLD_AVAIL = "if(name==='Avail')return '<td style=\"background:#EAB308;color:#000;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;\">Available</td>';";
const NEW_AVAIL = "if(name==='Avail')return '<td style=\"background:#EAB308;color:#000;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;cursor:pointer;\" onclick=\"openSlotEditor(this,\\'avail\\')\">Available</td>';";

if(!html.includes(OLD_CLOSE)){console.error('ERROR: Close cell not found');process.exit(1);}
if(!html.includes(OLD_AVAIL)){console.error('ERROR: Avail cell not found');process.exit(1);}

html = html.replace(OLD_CLOSE, NEW_CLOSE);
html = html.replace(OLD_AVAIL, NEW_AVAIL);
console.log('Patched cell() function');

const MODAL = [
'<!-- SLOT EDITOR MODAL -->',
'<div id="slot-editor-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(4px);z-index:300;align-items:center;justify-content:center;" onclick="if(event.target===this)closeSlotEditor()">',
'  <div style="background:white;border-radius:22px;padding:26px;width:360px;box-shadow:0 20px 60px rgba(0,0,0,0.2);">',
'    <div style="font-family:\'Nunito\',sans-serif;font-weight:900;font-size:18px;margin-bottom:6px;">Edit Slot</div>',
'    <div id="slot-info" style="font-size:12px;color:#6B7280;margin-bottom:18px;"></div>',
'    <label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Assign Student</label>',
'    <select id="slot-select" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:\'Quicksand\',sans-serif;font-weight:600;font-size:13px;outline:none;margin-bottom:14px;"><option value="">-- Select student --</option></select>',
'    <div style="display:flex;flex-direction:column;gap:8px;">',
'      <button onclick="applySlot(\'assign\')" style="padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Assign Student</button>',
'      <button id="slot-avail-btn" onclick="applySlot(\'avail\')" style="padding:11px;border-radius:12px;border:none;background:#EAB308;color:#000;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Mark as Available</button>',
'      <button id="slot-close-btn" onclick="applySlot(\'close\')" style="padding:11px;border-radius:12px;border:none;background:#EF4444;color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Close Slot</button>',
'      <button onclick="closeSlotEditor()" style="padding:11px;border-radius:12px;border:2px solid #E5E7EB;background:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#6B7280;">Cancel</button>',
'    </div>',
'  </div>',
'</div>',
'<script>',
'var _slotTd=null,_slotType=null;',
'var KR_NAMES=["K.Bella","Jackie","Lina","Aiden","Sophia","Peter","Seah"];',
'var PC={"K.Bella":{bg:"#FCE4EC",text:"#880E4F"},"Jackie":{bg:"#EDE7F6",text:"#4A148C"},"Lina":{bg:"#E8EAF6",text:"#1A237E"},"Aiden":{bg:"#E0F2F1",text:"#004D40"},"Sophia":{bg:"#E1F5FE",text:"#01579B"},"Peter":{bg:"#FFF8E1",text:"#E65100"},"Seah":{bg:"#F3E5F5",text:"#4A148C"},"Suri":{bg:"#FFF3E0",text:"#BF360C"},"Bella":{bg:"#FCE4EC",text:"#880E4F"},"COCO-1":{bg:"#FFFDE7",text:"#F57F17"},"Harry":{bg:"#E3F2FD",text:"#0D47A1"},"Kelly-Adult":{bg:"#E8F5E9",text:"#1B5E20"},"KAREN":{bg:"#E0F7FA",text:"#006064"},"Mollie-Adult & Steven":{bg:"#FFF9C4",text:"#827717"},"Coco-2":{bg:"#FFFDE7",text:"#F57F17"},"Koala":{bg:"#F3E5F5",text:"#4A148C"},"Owen":{bg:"#E8F5E9",text:"#1B5E20"},"Rainy":{bg:"#E3F2FD",text:"#0D47A1"},"Shily":{bg:"#FCE4EC",text:"#880E4F"},"Carl":{bg:"#FFF8E1",text:"#E65100"}};',
'function openSlotEditor(td,type){',
'  _slotTd=td;_slotType=type;',
'  var row=td.closest("tr");',
'  var time=row?row.cells[0].textContent.trim():"";',
'  var days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];',
'  var day=td.cellIndex>=2?days[td.cellIndex-2]:"";',
'  document.getElementById("slot-info").textContent=time+" Thailand - "+day+" - Currently: "+(type==="close"?"Closed":"Available");',
'  document.getElementById("slot-avail-btn").style.display=type==="close"?"block":"none";',
'  document.getElementById("slot-close-btn").style.display=type==="avail"?"block":"none";',
'  var sel=document.getElementById("slot-select");',
'  sel.innerHTML="<option value=\\"\\">-- Select student --</option>"+students.map(function(s){return "<option value=\\""+s.name+"\\">"+s.name+" "+s.nat.split(" ")[0]+"</option>";}).join("");',
'  document.getElementById("slot-editor-overlay").style.display="flex";',
'}',
'function closeSlotEditor(){',
'  document.getElementById("slot-editor-overlay").style.display="none";',
'  _slotTd=null;_slotType=null;',
'}',
'function applySlot(action){',
'  if(!_slotTd)return;',
'  if(action==="assign"){',
'    var name=document.getElementById("slot-select").value;',
'    if(!name){alert("Please select a student!");return;}',
'    var isKR=KR_NAMES.indexOf(name)>=0;',
'    var meta=PC[name]||{bg:"#E8EAF6",text:"#1E1B4B"};',
'    var flagImg="<img src=\\"https://flagcdn.com/16x12/"+(isKR?"kr":"cn")+".png\\" style=\\"vertical-align:middle;margin-right:3px;\\">";',
'    _slotTd.innerHTML=flagImg+name;',
'    _slotTd.style.background=meta.bg;',
'    _slotTd.style.color=meta.text;',
'    _slotTd.style.cursor="default";',
'    _slotTd.onclick=null;',
'  } else if(action==="avail"){',
'    _slotTd.textContent="Available";',
'    _slotTd.style.background="#EAB308";',
'    _slotTd.style.color="#000";',
'    _slotTd.style.cursor="pointer";',
'    _slotTd.onclick=function(){openSlotEditor(this,"avail");};',
'  } else if(action==="close"){',
'    _slotTd.textContent="Close";',
'    _slotTd.style.background="#EF4444";',
'    _slotTd.style.color="#fff";',
'    _slotTd.style.cursor="pointer";',
'    _slotTd.onclick=function(){openSlotEditor(this,"close");};',
'  }',
'  closeSlotEditor();',
'}',
'<\/script>'
].join('\n');

const bodyClose = html.lastIndexOf('</body>');
if(bodyClose===-1){console.error('ERROR: </body> not found');process.exit(1);}
html = html.slice(0,bodyClose) + MODAL + '\n' + html.slice(bodyClose);

if(html.length < original){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - grew by '+(html.length-original)+' bytes');
