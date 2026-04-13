const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// ── 1. Make assigned student cells clickable ──────────────────────────────
const OLD_CURSOR = '    td.style.cursor=\'default\';td.onclick=null;';
const NEW_CURSOR = '    td.style.cursor=\'pointer\';td.onclick=function(){openSlotEditor(this,\'student\');};';

const OLD_CURSOR2 = '    _slotTd.style.cursor="default";\n    _slotTd.onclick=null;';
const NEW_CURSOR2 = '    _slotTd.style.cursor="pointer";\n    _slotTd.onclick=function(){openSlotEditor(this,"student");};';

if(html.includes(OLD_CURSOR)){
  html = html.replace(OLD_CURSOR, NEW_CURSOR);
  console.log('Patch 1a done: restore cells clickable');
}
if(html.includes(OLD_CURSOR2)){
  html = html.replace(OLD_CURSOR2, NEW_CURSOR2);
  console.log('Patch 1b done: assign cells clickable');
}

// ── 2. Update openSlotEditor to handle student type ───────────────────────
const OLD_INFO = 'document.getElementById("slot-info").textContent=time+" Thailand - "+day+" - Currently: "+(type==="close"?"Closed":"Available");';
const NEW_INFO = 'document.getElementById("slot-info").textContent=time+" Thailand - "+day+(type==="student"?" - Assigned: "+_slotTd.textContent.replace(/[^\\w\\s-&]/g,"").trim():" - Currently: "+(type==="close"?"Closed":"Available"));';

const OLD_BTNS = 'document.getElementById("slot-avail-btn").style.display=type==="close"?"block":"none";\n  document.getElementById("slot-close-btn").style.display=type==="avail"?"block":"none";';
const NEW_BTNS = 'document.getElementById("slot-avail-btn").style.display=type==="close"||type==="student"?"block":"none";\n  document.getElementById("slot-close-btn").style.display=type==="avail"||type==="student"?"block":"none";\n  document.getElementById("slot-assign-btn").style.display=type==="student"?"none":"block";\n  document.getElementById("slot-assign-select-wrap").style.display=type==="student"?"none":"block";\n  document.getElementById("slot-move-wrap").style.display=type==="student"?"block":"none";';

if(!html.includes(OLD_INFO)){console.error('ERROR: slot-info line not found');process.exit(1);}
if(!html.includes(OLD_BTNS)){console.error('ERROR: slot btns not found');process.exit(1);}
html = html.replace(OLD_INFO, NEW_INFO);
html = html.replace(OLD_BTNS, NEW_BTNS);
console.log('Patch 2 done: openSlotEditor handles student type');

// ── 3. Update modal HTML to add move/remove UI ────────────────────────────
const OLD_MODAL_INNER = '    <label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Assign Student</label>\n    <select id="slot-select" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:\'Quicksand\',sans-serif;font-weight:600;font-size:13px;outline:none;margin-bottom:14px;"><option value="">-- Select student --</option></select>\n    <div style="display:flex;flex-direction:column;gap:8px;">\n      <button onclick="applySlot(\'assign\')" style="padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Assign Student</button>\n      <button id="slot-avail-btn" onclick="applySlot(\'avail\')" style="padding:11px;border-radius:12px;border:none;background:#EAB308;color:#000;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Mark as Available</button>\n      <button id="slot-close-btn" onclick="applySlot(\'close\')" style="padding:11px;border-radius:12px;border:none;background:#EF4444;color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Close Slot</button>\n      <button onclick="closeSlotEditor()" style="padding:11px;border-radius:12px;border:2px solid #E5E7EB;background:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#6B7280;">Cancel</button>\n    </div>';

const NEW_MODAL_INNER = '    <div id="slot-assign-select-wrap"><label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Assign Student</label>\n    <select id="slot-select" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:\'Quicksand\',sans-serif;font-weight:600;font-size:13px;outline:none;margin-bottom:14px;"><option value="">-- Select student --</option></select></div>\n    <div id="slot-move-wrap" style="display:none;margin-bottom:14px;"><label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Move to Another Slot</label>\n    <select id="slot-move-select" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:\'Quicksand\',sans-serif;font-weight:600;font-size:13px;outline:none;margin-bottom:6px;"><option value="">-- Select time slot --</option></select>\n    <select id="slot-move-day" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:\'Quicksand\',sans-serif;font-weight:600;font-size:13px;outline:none;"><option value="">-- Select day --</option><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option></select></div>\n    <div style="display:flex;flex-direction:column;gap:8px;">\n      <button id="slot-assign-btn" onclick="applySlot(\'assign\')" style="padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Assign Student</button>\n      <button id="slot-move-btn" onclick="applySlot(\'move\')" style="display:none;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#10B981,#3B82F6);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Move to Selected Slot</button>\n      <button id="slot-avail-btn" onclick="applySlot(\'avail\')" style="padding:11px;border-radius:12px;border:none;background:#EAB308;color:#000;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Mark as Available</button>\n      <button id="slot-close-btn" onclick="applySlot(\'close\')" style="padding:11px;border-radius:12px;border:none;background:#EF4444;color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Close Slot</button>\n      <button onclick="closeSlotEditor()" style="padding:11px;border-radius:12px;border:2px solid #E5E7EB;background:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#6B7280;">Cancel</button>\n    </div>';

if(!html.includes(OLD_MODAL_INNER)){console.error('ERROR: modal inner not found');process.exit(1);}
html = html.replace(OLD_MODAL_INNER, NEW_MODAL_INNER);
console.log('Patch 3 done: modal updated with move/remove UI');

// ── 4. Update openSlotEditor to also show move btn and populate time slots ─
const OLD_SEL_POP = 'var sel=document.getElementById("slot-select");\n  sel.innerHTML="<option value=\\"\\">-- Select student --</option>"+students.map(function(s){return "<option value=\\""+s.name+"\\">"+s.name+" "+s.nat.split(" ")[0]+"</option>";}).join("");\n  document.getElementById("slot-editor-overlay").style.display="flex";';
const NEW_SEL_POP = 'var sel=document.getElementById("slot-select");\n  sel.innerHTML="<option value=\\"\\">-- Select student --</option>"+students.map(function(s){return "<option value=\\""+s.name+"\\">"+s.name+" "+s.nat.split(" ")[0]+"</option>";}).join("");\n  // populate time slots for move\n  var times=["5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM"];\n  var msel=document.getElementById("slot-move-select");\n  msel.innerHTML="<option value=\\"\\">-- Select time --</option>"+times.map(function(t){return "<option>"+t+"</option>";}).join("");\n  document.getElementById("slot-move-btn").style.display=type==="student"?"block":"none";\n  document.getElementById("slot-editor-overlay").style.display="flex";';

if(!html.includes(OLD_SEL_POP)){console.error('ERROR: sel pop not found');process.exit(1);}
html = html.replace(OLD_SEL_POP, NEW_SEL_POP);
console.log('Patch 4 done: time slot populate added');

// ── 5. Add move action to applySlot ──────────────────────────────────────
const OLD_APPLY_START = 'function applySlot(action){\n  if(!_slotTd)return;\n  if(action==="assign"){';
const NEW_APPLY_START = 'function applySlot(action){\n  if(!_slotTd)return;\n  if(action==="move"){\n    var moveTime=document.getElementById("slot-move-select").value;\n    var moveDay=document.getElementById("slot-move-day").value;\n    if(!moveTime||!moveDay){alert("Please select both a time and day!");return;}\n    var dayIdx=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].indexOf(moveDay);\n    var colIdx=dayIdx+2;\n    var rows=document.querySelectorAll("#sched-body tr");\n    var targetTd=null;\n    rows.forEach(function(row){if(row.cells[0]&&row.cells[0].textContent.trim()===moveTime&&row.cells[colIdx])targetTd=row.cells[colIdx];});\n    if(!targetTd){alert("Slot not found in grid!");return;}\n    if(targetTd.textContent.trim()!=="Close"&&targetTd.textContent.trim()!=="Available"){alert("That slot is already occupied!");return;}\n    // get current student name\n    var curName=_slotTd.textContent.replace(/[^\\w\\s-&]/g,"").trim();\n    // clear current slot\n    var oldKey=_slotTd.closest("tr").cells[0].textContent.trim()+"|"+_slotTd.cellIndex;\n    _slotTd.textContent="Close";_slotTd.style.background="#EF4444";_slotTd.style.color="#fff";_slotTd.style.cursor="pointer";\n    _slotTd.onclick=function(){openSlotEditor(this,"close");};\n    var ss=JSON.parse(localStorage.getItem("ts-slots")||"{}");ss[oldKey]={type:"close"};localStorage.setItem("ts-slots",JSON.stringify(ss));\n    // assign to new slot\n    var isKR=KR_NAMES.indexOf(curName)>=0;\n    var meta=PC[curName]||{bg:"#E8EAF6",text:"#1E1B4B"};\n    targetTd.innerHTML=\'<img src="https://flagcdn.com/16x12/\'+(isKR?"kr":"cn")+\'.png" style="vertical-align:middle;margin-right:3px;">\'+curName;\n    targetTd.style.background=meta.bg;targetTd.style.color=meta.text;targetTd.style.cursor="pointer";\n    targetTd.onclick=function(){openSlotEditor(this,"student");};\n    var newKey=targetTd.closest("tr").cells[0].textContent.trim()+"|"+targetTd.cellIndex;\n    ss[newKey]={type:"student",name:curName};localStorage.setItem("ts-slots",JSON.stringify(ss));\n    closeSlotEditor();alert("Moved "+curName+" to "+moveTime+" "+moveDay+"!");\n    return;\n  }\n  if(action==="assign"){';

if(!html.includes(OLD_APPLY_START)){console.error('ERROR: applySlot start not found');process.exit(1);}
html = html.replace(OLD_APPLY_START, NEW_APPLY_START);
console.log('Patch 5 done: move action added to applySlot');

if(html.length < original){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - grew by '+(html.length-original)+' bytes');
