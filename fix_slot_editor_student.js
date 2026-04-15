const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
let fixes = { profileBtn: false, openSlotEditor: false };

const out = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];

  // FIX 1: Add View Profile button after slot-close-btn, before Cancel
  if (l.includes('id="slot-close-btn"') && !fixes.profileBtn) {
    out.push(l);
    out.push('        <button id="slot-profile-btn" onclick="openProfileFromSlot()" style="display:none;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#A855F7,#6366F1);color:white;font-family:\'Quicksand\',sans-serif;font-weight:700;font-size:14px;cursor:pointer;">👤 View Profile</button>');
    console.log('✅ Added View Profile button at line ' + (i+1));
    fixes.profileBtn = true;
    continue;
  }

  // FIX 2: Update openSlotEditor to show profile button and student name for student slots
  if (l.trim() === 'function openSlotEditor(td,type){' && !fixes.openSlotEditor) {
    // Skip old function
    let depth = 0, started = false, j = i;
    while (j < lines.length) {
      const t = lines[j].trim();
      depth += (t.match(/\{/g)||[]).length - (t.match(/\}/g)||[]).length;
      if (!started && t.includes('{')) started = true;
      j++;
      if (started && depth <= 0) break;
    }
    i = j - 1;
    // Inject updated function
    out.push('function openSlotEditor(td,type){');
    out.push('  _slotTd=td;_slotType=type;');
    out.push('  var row=td.closest("tr");');
    out.push('  var time=row?row.cells[0].textContent.trim():"";');
    out.push('  var days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];');
    out.push('  var day=td.cellIndex>=2?days[td.cellIndex-2]:"";');
    out.push('  // Get student name from cell for student type');
    out.push('  var cellText = td.textContent.trim();');
    out.push('  var studentName = type==="student" ? cellText : "";');
    out.push('  var studentObj = studentName ? students.find(function(s){ return s.name===studentName || studentName.startsWith(s.name) || s.name.startsWith(studentName); }) : null;');
    out.push('  if(type==="student"){');
    out.push('    document.getElementById("slot-info").innerHTML = "<strong>" + studentName + "</strong><br><span style=\'color:#9CA3AF;\'>" + time + " Thailand · " + day + "</span>";');
    out.push('  } else {');
    out.push('    document.getElementById("slot-info").textContent = time+" Thailand - "+day+" - Currently: "+(type==="close"?"Closed":"Available");');
    out.push('  }');
    out.push('  document.getElementById("slot-avail-btn").style.display=type==="close"||type==="student"?"block":"none";');
    out.push('  document.getElementById("slot-close-btn").style.display=type==="avail"||type==="student"?"block":"none";');
    out.push('  document.getElementById("slot-assign-btn").style.display=type==="student"?"none":"block";');
    out.push('  document.getElementById("slot-assign-label").style.display=type==="student"?"none":"block";');
    out.push('  document.getElementById("slot-select").style.display=type==="student"?"none":"block";');
    out.push('  document.getElementById("slot-move-wrap").style.display=type==="student"?"block":"none";');
    out.push('  document.getElementById("slot-move-btn").style.display=type==="student"?"block":"none";');
    out.push('  // Show/hide profile button');
    out.push('  var profileBtn = document.getElementById("slot-profile-btn");');
    out.push('  if(profileBtn) profileBtn.style.display = studentObj ? "block" : "none";');
    out.push('  if(profileBtn && studentObj) profileBtn.setAttribute("data-student-id", studentObj.id);');
    out.push('  var sel=document.getElementById("slot-select");');
    out.push('  sel.innerHTML="<option value=\\"\\">-- Select student --</option>"+students.map(function(s){return "<option value=\\""+s.name+"\\">"+s.name+" "+s.nat.split(" ")[0]+"</option>";}).join("");');
    out.push('  // Pre-select current student in move dropdown');
    out.push('  if(type==="student" && studentName){');
    out.push('    var moveSelect = document.getElementById("slot-move-select");');
    out.push('    if(moveSelect){ Array.from(moveSelect.options).forEach(function(o){ if(o.value===studentName) o.selected=true; }); }');
    out.push('  }');
    out.push('  document.getElementById("slot-editor-overlay").style.display="flex";');
    out.push('}');
    out.push('');
    out.push('function openProfileFromSlot(){');
    out.push('  var btn = document.getElementById("slot-profile-btn");');
    out.push('  var id = btn ? parseInt(btn.getAttribute("data-student-id")) : null;');
    out.push('  if(!id) return;');
    out.push('  closeSlotEditor();');
    out.push('  openStudentProfile(id);');
    out.push('}');
    fixes.openSlotEditor = true;
    console.log('✅ Updated openSlotEditor function');
    continue;
  }

  out.push(l);
}

const result = out.join('\r\n');
console.log('\n📊 Profile button added: ' + fixes.profileBtn);
console.log('📊 openSlotEditor updated: ' + fixes.openSlotEditor);
console.log('📊 openProfileFromSlot present: ' + result.includes('openProfileFromSlot'));

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
