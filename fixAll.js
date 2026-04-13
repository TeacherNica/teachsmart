const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// ── STEP 1: Remove duplicate HTML ─────────────────────────────────────────
const secondDoc = html.indexOf('<!DOCTYPE html>', 100);
if(secondDoc === -1){ console.error('ERROR: second DOCTYPE not found'); process.exit(1); }
html = html.substring(0, secondDoc);
console.log('Step 1 done: removed duplicate HTML at char ' + secondDoc);

// ── STEP 2: Fix slot saving to localStorage ────────────────────────────────
// Replace applySlot assign action to also save to ts-slots
const OLD_ASSIGN = "    _slotTd.onclick=null;\n  } else if(action===\"avail\"){";
const NEW_ASSIGN = "    _slotTd.onclick=null;\n    // save slot\n    var slots=JSON.parse(localStorage.getItem('ts-slots')||'{}');\n    var key=_slotTd.closest('tr').cells[0].textContent.trim()+'|'+_slotTd.cellIndex;\n    slots[key]={type:'student',name:name};\n    localStorage.setItem('ts-slots',JSON.stringify(slots));\n  } else if(action===\"avail\"){";

const OLD_AVAIL_SAVE = "    _slotTd.onclick=function(){openSlotEditor(this,\"avail\");};\n  } else if(action===\"close\"){";
const NEW_AVAIL_SAVE = "    _slotTd.onclick=function(){openSlotEditor(this,\"avail\");};\n    var slots2=JSON.parse(localStorage.getItem('ts-slots')||'{}');\n    var key2=_slotTd.closest('tr').cells[0].textContent.trim()+'|'+_slotTd.cellIndex;\n    slots2[key2]={type:'avail'};\n    localStorage.setItem('ts-slots',JSON.stringify(slots2));\n  } else if(action===\"close\"){";

const OLD_CLOSE_SAVE = "    _slotTd.onclick=function(){openSlotEditor(this,\"close\");};\n  }\n  closeSlotEditor();";
const NEW_CLOSE_SAVE = "    _slotTd.onclick=function(){openSlotEditor(this,\"close\");};\n    var slots3=JSON.parse(localStorage.getItem('ts-slots')||'{}');\n    var key3=_slotTd.closest('tr').cells[0].textContent.trim()+'|'+_slotTd.cellIndex;\n    slots3[key3]={type:'close'};\n    localStorage.setItem('ts-slots',JSON.stringify(slots3));\n  }\n  closeSlotEditor();";

if(html.includes(OLD_ASSIGN)){
  html = html.replace(OLD_ASSIGN, NEW_ASSIGN);
  html = html.replace(OLD_AVAIL_SAVE, NEW_AVAIL_SAVE);
  html = html.replace(OLD_CLOSE_SAVE, NEW_CLOSE_SAVE);
  console.log('Step 2 done: slot saving to localStorage added');
} else {
  console.log('Step 2 skipped: slot editor not found (may not be needed)');
}

// ── STEP 3: Load saved slots after renderScheduleGrid ─────────────────────
const OLD_RENDER_END = "  body.innerHTML=html;\n}";
const NEW_RENDER_END = "  body.innerHTML=html;\n  // restore saved slots\n  try{\n    var savedSlots=JSON.parse(localStorage.getItem('ts-slots')||'{}');\n    var KRN=['K.Bella','Jackie','Lina','Aiden','Sophia','Peter','Seah'];\n    var SPC={'K.Bella':{bg:'#FCE4EC',text:'#880E4F'},'Jackie':{bg:'#EDE7F6',text:'#4A148C'},'Lina':{bg:'#E8EAF6',text:'#1A237E'},'Aiden':{bg:'#E0F2F1',text:'#004D40'},'Sophia':{bg:'#E1F5FE',text:'#01579B'},'Peter':{bg:'#FFF8E1',text:'#E65100'},'Seah':{bg:'#F3E5F5',text:'#4A148C'},'Suri':{bg:'#FFF3E0',text:'#BF360C'},'Bella':{bg:'#FCE4EC',text:'#880E4F'},'COCO-1':{bg:'#FFFDE7',text:'#F57F17'},'Harry':{bg:'#E3F2FD',text:'#0D47A1'},'Kelly-Adult':{bg:'#E8F5E9',text:'#1B5E20'},'KAREN':{bg:'#E0F7FA',text:'#006064'},'Mollie-Adult & Steven':{bg:'#FFF9C4',text:'#827717'},'Coco-2':{bg:'#FFFDE7',text:'#F57F17'},'Koala':{bg:'#F3E5F5',text:'#4A148C'},'Owen':{bg:'#E8F5E9',text:'#1B5E20'},'Rainy':{bg:'#E3F2FD',text:'#0D47A1'},'Shily':{bg:'#FCE4EC',text:'#880E4F'},'Carl':{bg:'#FFF8E1',text:'#E65100'}};\n    Object.keys(savedSlots).forEach(function(key){\n      var parts=key.split('|');\n      var time=parts[0];\n      var colIdx=parseInt(parts[1]);\n      var slot=savedSlots[key];\n      var rows=document.querySelectorAll('#sched-body tr');\n      rows.forEach(function(row){\n        if(row.cells[0]&&row.cells[0].textContent.trim()===time&&row.cells[colIdx]){\n          var td=row.cells[colIdx];\n          if(slot.type==='student'){\n            var isKR=KRN.indexOf(slot.name)>=0;\n            var meta=SPC[slot.name]||{bg:'#E8EAF6',text:'#1E1B4B'};\n            td.innerHTML='<img src=\"https://flagcdn.com/16x12/'+(isKR?'kr':'cn')+'.png\" style=\"vertical-align:middle;margin-right:3px;\">'+slot.name;\n            td.style.background=meta.bg;\n            td.style.color=meta.text;\n            td.style.cursor='default';\n            td.onclick=null;\n          } else if(slot.type==='avail'){\n            td.textContent='Available';\n            td.style.background='#EAB308';\n            td.style.color='#000';\n            td.style.cursor='pointer';\n            td.onclick=function(){openSlotEditor(this,'avail');};\n          } else if(slot.type==='close'){\n            td.textContent='Close';\n            td.style.background='#EF4444';\n            td.style.color='#fff';\n            td.style.cursor='pointer';\n            td.onclick=function(){openSlotEditor(this,'close');};\n          }\n        }\n      });\n    });\n  }catch(e){}\n}";

if(html.includes(OLD_RENDER_END)){
  html = html.replace(OLD_RENDER_END, NEW_RENDER_END);
  console.log('Step 3 done: slot restore on grid render added');
} else {
  console.log('Step 3 skipped: render end marker not found');
}

// ── STEP 4: Auto-deduct when class status becomes "done" ──────────────────
// Find where status=done badge is rendered in Today's Classes
// and wire the Present button to call markDone instead
const OLD_PRESENT = "onclick=\"markAttendance('"+'"'+"+s.name+\"','present')\"";
// This is already wired — markAttendance already deducts. 
// The issue is the auto-status "done" doesn't deduct.
// We fix by making the "✅ Done" auto-status call markDone once per day.
// We add a check: if status=done and not yet deducted today, deduct once.
const OLD_STATUS_DONE = "const status=nowMins>slotMins+slot.duration?'done':nowMins>=slotMins?'now':'upcoming';";
const NEW_STATUS_DONE = "var status=nowMins>slotMins+slot.duration?'done':nowMins>=slotMins?'now':'upcoming';\n    // auto-deduct once when class transitions to done\n    if(status==='done'){\n      var deductKey='deducted_'+slot.student+'_'+new Date().toDateString();\n      if(!localStorage.getItem(deductKey)){\n        var ds=students.find(x=>x.name===slot.student);\n        if(ds&&ds.classes>0){ds.classes--;saveData();}\n        localStorage.setItem(deductKey,'1');\n      }\n    }";

if(html.includes(OLD_STATUS_DONE)){
  html = html.replace(OLD_STATUS_DONE, NEW_STATUS_DONE);
  console.log('Step 4 done: auto-deduct on class completion added');
} else {
  console.log('Step 4 skipped: status line not found');
}

// ── STEP 5: Close with </body></html> ─────────────────────────────────────
if(!html.trimEnd().endsWith('</html>')){
  html = html.trimEnd() + '\n</body>\n</html>\n';
  console.log('Step 5 done: added closing tags');
}

// ── Write ─────────────────────────────────────────────────────────────────
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - file is now ' + html.length + ' chars (was ' + original + ')');
