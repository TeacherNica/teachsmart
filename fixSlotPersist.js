const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// ── Patch applySlot to save to localStorage ───────────────────────────────
const OLD_ASSIGN_END = '    _slotTd.onclick=null;\n  } else if(action==="avail"){';
const NEW_ASSIGN_END = `    _slotTd.onclick=null;
    var slotKey=_slotTd.closest('tr').cells[0].textContent.trim()+'|'+_slotTd.cellIndex;
    var savedSlots=JSON.parse(localStorage.getItem('ts-slots')||'{}');
    savedSlots[slotKey]={type:'student',name:name};
    localStorage.setItem('ts-slots',JSON.stringify(savedSlots));
  } else if(action==="avail"){`;

const OLD_AVAIL_END = '    _slotTd.onclick=function(){openSlotEditor(this,"avail");};\n  } else if(action==="close"){';
const NEW_AVAIL_END = `    _slotTd.onclick=function(){openSlotEditor(this,"avail");};
    var slotKey2=_slotTd.closest('tr').cells[0].textContent.trim()+'|'+_slotTd.cellIndex;
    var savedSlots2=JSON.parse(localStorage.getItem('ts-slots')||'{}');
    savedSlots2[slotKey2]={type:'avail'};
    localStorage.setItem('ts-slots',JSON.stringify(savedSlots2));
  } else if(action==="close"){`;

const OLD_CLOSE_END = '    _slotTd.onclick=function(){openSlotEditor(this,"close");};\n  }\n  closeSlotEditor();';
const NEW_CLOSE_END = `    _slotTd.onclick=function(){openSlotEditor(this,"close");};
    var slotKey3=_slotTd.closest('tr').cells[0].textContent.trim()+'|'+_slotTd.cellIndex;
    var savedSlots3=JSON.parse(localStorage.getItem('ts-slots')||'{}');
    savedSlots3[slotKey3]={type:'close'};
    localStorage.setItem('ts-slots',JSON.stringify(savedSlots3));
  }
  closeSlotEditor();`;

if(!html.includes(OLD_ASSIGN_END)){console.error('ERROR: assign end not found');process.exit(1);}
if(!html.includes(OLD_AVAIL_END)){console.error('ERROR: avail end not found');process.exit(1);}
if(!html.includes(OLD_CLOSE_END)){console.error('ERROR: close end not found');process.exit(1);}

html = html.replace(OLD_ASSIGN_END, NEW_ASSIGN_END);
html = html.replace(OLD_AVAIL_END, NEW_AVAIL_END);
html = html.replace(OLD_CLOSE_END, NEW_CLOSE_END);
console.log('Step 1 done: slot saving added');

// ── Patch renderScheduleGrid to restore slots after rendering ─────────────
const OLD_RENDER_END = '  body.innerHTML=html;\n}';
const NEW_RENDER_END = `  body.innerHTML=html;
  // restore saved slots from localStorage
  try{
    var ss=JSON.parse(localStorage.getItem('ts-slots')||'{}');
    var KRN=['K.Bella','Jackie','Lina','Aiden','Sophia','Peter','Seah'];
    var PC={'K.Bella':{bg:'#FCE4EC',text:'#880E4F'},'Jackie':{bg:'#EDE7F6',text:'#4A148C'},'Lina':{bg:'#E8EAF6',text:'#1A237E'},'Aiden':{bg:'#E0F2F1',text:'#004D40'},'Sophia':{bg:'#E1F5FE',text:'#01579B'},'Peter':{bg:'#FFF8E1',text:'#E65100'},'Seah':{bg:'#F3E5F5',text:'#4A148C'},'Suri':{bg:'#FFF3E0',text:'#BF360C'},'Bella':{bg:'#FCE4EC',text:'#880E4F'},'COCO-1':{bg:'#FFFDE7',text:'#F57F17'},'Harry':{bg:'#E3F2FD',text:'#0D47A1'},'Kelly-Adult':{bg:'#E8F5E9',text:'#1B5E20'},'KAREN':{bg:'#E0F7FA',text:'#006064'},'Mollie-Adult & Steven':{bg:'#FFF9C4',text:'#827717'},'Coco-2':{bg:'#FFFDE7',text:'#F57F17'},'Koala':{bg:'#F3E5F5',text:'#4A148C'},'Owen':{bg:'#E8F5E9',text:'#1B5E20'},'Rainy':{bg:'#E3F2FD',text:'#0D47A1'},'Shily':{bg:'#FCE4EC',text:'#880E4F'},'Carl':{bg:'#FFF8E1',text:'#E65100'}};
    Object.keys(ss).forEach(function(key){
      var parts=key.split('|');
      var time=parts[0];
      var colIdx=parseInt(parts[1]);
      var slot=ss[key];
      var rows=document.querySelectorAll('#sched-body tr');
      rows.forEach(function(row){
        if(row.cells[0]&&row.cells[0].textContent.trim()===time&&row.cells[colIdx]){
          var td=row.cells[colIdx];
          if(slot.type==='student'){
            var isKR=KRN.indexOf(slot.name)>=0;
            var meta=PC[slot.name]||{bg:'#E8EAF6',text:'#1E1B4B'};
            td.innerHTML='<img src="https://flagcdn.com/16x12/'+(isKR?'kr':'cn')+'.png" style="vertical-align:middle;margin-right:3px;">'+slot.name;
            td.style.background=meta.bg;
            td.style.color=meta.text;
            td.style.cursor='default';
            td.onclick=null;
          } else if(slot.type==='avail'){
            td.textContent='Available';
            td.style.background='#EAB308';
            td.style.color='#000';
            td.style.cursor='pointer';
            td.onclick=function(){openSlotEditor(this,'avail');};
          }
        }
      });
    });
  }catch(e){}
}`;

if(!html.includes(OLD_RENDER_END)){console.error('ERROR: render end not found');process.exit(1);}
html = html.replace(OLD_RENDER_END, NEW_RENDER_END);
console.log('Step 2 done: slot restore on grid render added');

if(html.length < original){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - grew by '+(html.length-original)+' bytes');
