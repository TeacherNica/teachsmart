const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// ── Patch 1: after assign, save to localStorage ───────────────────────────
const OLD1 = '    _slotTd.onclick=null;\n  } else if(action==="avail"){';
const NEW1 = '    _slotTd.onclick=null;\n    var _k=_slotTd.closest(\'tr\').cells[0].textContent.trim()+\'|\'+_slotTd.cellIndex;\n    var _ss=JSON.parse(localStorage.getItem(\'ts-slots\')||\'{}\');_ss[_k]={type:\'student\',name:name};localStorage.setItem(\'ts-slots\',JSON.stringify(_ss));\n  } else if(action==="avail"){';

// ── Patch 2: after avail, save to localStorage ────────────────────────────
const OLD2 = '    _slotTd.onclick=function(){openSlotEditor(this,"avail");};\n  } else if(action==="close"){';
const NEW2 = '    _slotTd.onclick=function(){openSlotEditor(this,"avail");};\n    var _k2=_slotTd.closest(\'tr\').cells[0].textContent.trim()+\'|\'+_slotTd.cellIndex;\n    var _ss2=JSON.parse(localStorage.getItem(\'ts-slots\')||\'{}\');_ss2[_k2]={type:\'avail\'};localStorage.setItem(\'ts-slots\',JSON.stringify(_ss2));\n  } else if(action==="close"){';

// ── Patch 3: after close, save to localStorage ────────────────────────────
const OLD3 = '    _slotTd.onclick=function(){openSlotEditor(this,"close");};\n  }\n  closeSlotEditor();';
const NEW3 = '    _slotTd.onclick=function(){openSlotEditor(this,"close");};\n    var _k3=_slotTd.closest(\'tr\').cells[0].textContent.trim()+\'|\'+_slotTd.cellIndex;\n    var _ss3=JSON.parse(localStorage.getItem(\'ts-slots\')||\'{}\');_ss3[_k3]={type:\'close\'};localStorage.setItem(\'ts-slots\',JSON.stringify(_ss3));\n  }\n  closeSlotEditor();';

// Check each
if(!html.includes(OLD1)){
  // try with \r\n
  const OLD1r = OLD1.replace(/\n/g,'\r\n');
  if(html.includes(OLD1r)){
    html = html.replace(OLD1r, NEW1.replace(/\n/g,'\r\n'));
    console.log('Patch 1 done (CRLF)');
  } else {
    console.error('ERROR: patch 1 not found'); process.exit(1);
  }
} else {
  html = html.replace(OLD1, NEW1);
  console.log('Patch 1 done');
}

if(!html.includes(OLD2)){
  const OLD2r = OLD2.replace(/\n/g,'\r\n');
  if(html.includes(OLD2r)){
    html = html.replace(OLD2r, NEW2.replace(/\n/g,'\r\n'));
    console.log('Patch 2 done (CRLF)');
  } else {
    console.error('ERROR: patch 2 not found'); process.exit(1);
  }
} else {
  html = html.replace(OLD2, NEW2);
  console.log('Patch 2 done');
}

if(!html.includes(OLD3)){
  const OLD3r = OLD3.replace(/\n/g,'\r\n');
  if(html.includes(OLD3r)){
    html = html.replace(OLD3r, NEW3.replace(/\n/g,'\r\n'));
    console.log('Patch 3 done (CRLF)');
  } else {
    console.error('ERROR: patch 3 not found'); process.exit(1);
  }
} else {
  html = html.replace(OLD3, NEW3);
  console.log('Patch 3 done');
}

// ── Patch 4: restore slots after renderScheduleGrid ──────────────────────
const OLD4 = '  body.innerHTML=html;\n}';
const OLD4r = '  body.innerHTML=html;\r\n}';
const RESTORE = `
  try{
    var _rss=JSON.parse(localStorage.getItem('ts-slots')||'{}');
    var _KRN=['K.Bella','Jackie','Lina','Aiden','Sophia','Peter','Seah'];
    var _PC={'K.Bella':{bg:'#FCE4EC',text:'#880E4F'},'Jackie':{bg:'#EDE7F6',text:'#4A148C'},'Lina':{bg:'#E8EAF6',text:'#1A237E'},'Aiden':{bg:'#E0F2F1',text:'#004D40'},'Sophia':{bg:'#E1F5FE',text:'#01579B'},'Peter':{bg:'#FFF8E1',text:'#E65100'},'Seah':{bg:'#F3E5F5',text:'#4A148C'},'Suri':{bg:'#FFF3E0',text:'#BF360C'},'Bella':{bg:'#FCE4EC',text:'#880E4F'},'COCO-1':{bg:'#FFFDE7',text:'#F57F17'},'Harry':{bg:'#E3F2FD',text:'#0D47A1'},'Kelly-Adult':{bg:'#E8F5E9',text:'#1B5E20'},'KAREN':{bg:'#E0F7FA',text:'#006064'},'Mollie-Adult & Steven':{bg:'#FFF9C4',text:'#827717'},'Coco-2':{bg:'#FFFDE7',text:'#F57F17'},'Koala':{bg:'#F3E5F5',text:'#4A148C'},'Owen':{bg:'#E8F5E9',text:'#1B5E20'},'Rainy':{bg:'#E3F2FD',text:'#0D47A1'},'Shily':{bg:'#FCE4EC',text:'#880E4F'},'Carl':{bg:'#FFF8E1',text:'#E65100'}};
    Object.keys(_rss).forEach(function(key){
      var parts=key.split('|');var time=parts[0];var colIdx=parseInt(parts[1]);var slot=_rss[key];
      document.querySelectorAll('#sched-body tr').forEach(function(row){
        if(row.cells[0]&&row.cells[0].textContent.trim()===time&&row.cells[colIdx]){
          var td=row.cells[colIdx];
          if(slot.type==='student'){
            var isKR=_KRN.indexOf(slot.name)>=0;
            var meta=_PC[slot.name]||{bg:'#E8EAF6',text:'#1E1B4B'};
            td.innerHTML='<img src="https://flagcdn.com/16x12/'+(isKR?'kr':'cn')+'.png" style="vertical-align:middle;margin-right:3px;">'+slot.name;
            td.style.background=meta.bg;td.style.color=meta.text;td.style.cursor='default';td.onclick=null;
          } else if(slot.type==='avail'){
            td.textContent='Available';td.style.background='#EAB308';td.style.color='#000';td.style.cursor='pointer';
            td.onclick=function(){openSlotEditor(this,'avail');};
          }
        }
      });
    });
  }catch(e){}
}`;

if(html.includes(OLD4)){
  html = html.replace(OLD4, '  body.innerHTML=html;\n'+RESTORE);
  console.log('Patch 4 done');
} else if(html.includes(OLD4r)){
  html = html.replace(OLD4r, '  body.innerHTML=html;\r\n'+RESTORE);
  console.log('Patch 4 done (CRLF)');
} else {
  console.error('ERROR: patch 4 not found'); process.exit(1);
}

if(html.length < original){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - grew by '+(html.length-original)+' bytes');
