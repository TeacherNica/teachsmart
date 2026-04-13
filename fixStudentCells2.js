const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// Normalize line endings for matching
const htmlNorm = html.replace(/\r\n/g, '\n');

// ── Patch 1: Make assigned student cells clickable (in restore function) ──
const OLD1 = "td.style.cursor='default';td.onclick=null;";
const NEW1 = "td.style.cursor='pointer';td.onclick=function(){openSlotEditor(this,'student');};";
if(!htmlNorm.includes(OLD1)){console.error('ERROR: patch 1 not found');process.exit(1);}

// ── Patch 2: Make assigned student cells clickable (in applySlot) ─────────
const OLD2 = '_slotTd.style.cursor="default";\n    _slotTd.onclick=null;';
const NEW2 = '_slotTd.style.cursor="pointer";\n    _slotTd.onclick=function(){openSlotEditor(this,"student");};';
if(!htmlNorm.includes(OLD2)){console.error('ERROR: patch 2 not found');process.exit(1);}

// ── Patch 3: Update button visibility logic ───────────────────────────────
const OLD3 = '  document.getElementById("slot-avail-btn").style.display=type==="close"?"block":"none";\n  document.getElementById("slot-close-btn").style.display=type==="avail"?"block":"none";';
const NEW3 = '  document.getElementById("slot-avail-btn").style.display=type==="close"||type==="student"?"block":"none";\n  document.getElementById("slot-close-btn").style.display=type==="avail"||type==="student"?"block":"none";\n  document.getElementById("slot-assign-btn").style.display=type==="student"?"none":"block";\n  document.getElementById("slot-assign-label").style.display=type==="student"?"none":"block";\n  document.getElementById("slot-select").style.display=type==="student"?"none":"block";\n  document.getElementById("slot-move-wrap").style.display=type==="student"?"block":"none";\n  document.getElementById("slot-move-btn").style.display=type==="student"?"block":"none";';
if(!htmlNorm.includes(OLD3)){console.error('ERROR: patch 3 not found');process.exit(1);}

// ── Patch 4: Add move action to applySlot ────────────────────────────────
const OLD4 = 'function applySlot(action){\n  if(!_slotTd)return;\n  if(action==="assign"){';
const NEW4 = 'function applySlot(action){\n  if(!_slotTd)return;\n  if(action==="move"){\n    var mTime=document.getElementById("slot-move-time").value;\n    var mDay=document.getElementById("slot-move-day").value;\n    if(!mTime||!mDay){alert("Please select a time and day!");return;}\n    var dIdx=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].indexOf(mDay)+2;\n    var rows=document.querySelectorAll("#sched-body tr");\n    var tTd=null;\n    rows.forEach(function(r){if(r.cells[0]&&r.cells[0].textContent.trim()===mTime&&r.cells[dIdx])tTd=r.cells[dIdx];});\n    if(!tTd){alert("Slot not found!");return;}\n    var tText=tTd.textContent.trim();\n    if(tText!=="Close"&&tText!=="Available"){alert("That slot is already occupied!");return;}\n    var curName=_slotTd.textContent.replace(/[^\\w\\s\\-&]/g,"").trim();\n    var oldKey=_slotTd.closest("tr").cells[0].textContent.trim()+"|"+_slotTd.cellIndex;\n    _slotTd.textContent="Close";_slotTd.style.background="#EF4444";_slotTd.style.color="#fff";_slotTd.style.cursor="pointer";\n    _slotTd.onclick=function(){openSlotEditor(this,"close");};\n    var ss=JSON.parse(localStorage.getItem("ts-slots")||"{}");ss[oldKey]={type:"close"};localStorage.setItem("ts-slots",JSON.stringify(ss));\n    var isKR=KR_NAMES.indexOf(curName)>=0;\n    var meta=PC[curName]||{bg:"#E8EAF6",text:"#1E1B4B"};\n    tTd.innerHTML=\'<img src="https://flagcdn.com/16x12/\'+(isKR?"kr":"cn")+\'.png" style="vertical-align:middle;margin-right:3px;">\'+curName;\n    tTd.style.background=meta.bg;tTd.style.color=meta.text;tTd.style.cursor="pointer";\n    tTd.onclick=function(){openSlotEditor(this,"student");};\n    var newKey=tTd.closest("tr").cells[0].textContent.trim()+"|"+tTd.cellIndex;\n    ss[newKey]={type:"student",name:curName};localStorage.setItem("ts-slots",JSON.stringify(ss));\n    closeSlotEditor();alert("Moved to "+mTime+" ("+mDay+")!");\n    return;\n  }\n  if(action==="assign"){';
if(!htmlNorm.includes(OLD4)){console.error('ERROR: patch 4 not found');process.exit(1);}

// Apply all patches
let result = htmlNorm
  .replace(OLD1, NEW1)
  .replace(OLD2, NEW2)
  .replace(OLD3, NEW3)
  .replace(OLD4, NEW4);

// ── Patch 5: Add move UI to modal ────────────────────────────────────────
const OLD5 = '<label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Assign Student</label>';
const NEW5 = '<div id="slot-move-wrap" style="display:none;margin-bottom:14px;"><label style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Move to Another Slot</label><select id="slot-move-time" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:\'Quicksand\',sans-serif;font-weight:600;font-size:13px;outline:none;margin-bottom:8px;"><option value="">-- Select time --</option><option>5:30 PM</option><option>6:00 PM</option><option>6:30 PM</option><option>7:00 PM</option><option>7:30 PM</option><option>8:00 PM</option><option>8:30 PM</option><option>10:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>11:30 AM</option><option>12:00 PM</option><option>12:30 PM</option></select><select id="slot-move-day" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:12px;font-family:\'Quicksand\',sans-serif;font-weight:600;font-size:13px;outline:none;"><option value="">-- Select day --</option><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option></select></div>\n    <label id="slot-assign-label" style="font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:6px;">Assign Student</label>';
if(!result.includes(OLD5)){console.error('ERROR: patch 5 not found');process.exit(1);}
result = result.replace(OLD5, NEW5);

// ── Patch 6: Add Move button to modal buttons ────────────────────────────
const OLD6 = '<button id="slot-avail-btn"';
const NEW6 = '<button id="slot-move-btn" onclick="applySlot(\'move\')" style="display:none;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#10B981,#3B82F6);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Move to Selected Slot</button>\n      <button id="slot-assign-btn" onclick="applySlot(\'assign\')" style="padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Assign Student</button>\n      <button id="slot-avail-btn"';

// Remove the old assign button first
const OLD_ASSIGN_BTN = '<button onclick="applySlot(\'assign\')" style="padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Assign Student</button>\n      <button id="slot-avail-btn"';
if(result.includes(OLD_ASSIGN_BTN)){
  result = result.replace(OLD_ASSIGN_BTN, NEW6);
  console.log('Patch 6 done: move button added to modal');
} else {
  console.log('Patch 6 skipped');
}

console.log('Patch 1-5 done');

if(result.length < original - 100){console.error('ERROR: file shrank too much!');process.exit(1);}
fs.writeFileSync('index.html', result, 'utf8');
console.log('done: true - size change: '+(result.length-original)+' bytes');
