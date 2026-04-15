const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
const out = [];
let i = 0;
let fixes = { renderPayments: false, quickRename: false };

while (i < lines.length) {
  const l = lines[i];

  // FIX 1: Remove the FIRST (broken) renderPayments that references 'payments-list' and 'payF'
  if (l.trim() === 'function renderPayments(){' && !fixes.renderPayments) {
    let peek = '';
    for (let k = i; k < Math.min(i+5, lines.length); k++) peek += lines[k];
    if (peek.includes('payF') || peek.includes('payments-list')) {
      console.log('✅ Removing first (broken) renderPayments at line ' + (i+1));
      let depth = 0, started = false;
      while (i < lines.length) {
        const t = lines[i].trim();
        depth += (t.match(/\{/g)||[]).length - (t.match(/\}/g)||[]).length;
        if (!started && t.includes('{')) started = true;
        i++;
        if (started && depth <= 0) break;
      }
      fixes.renderPayments = true;
      continue;
    }
  }

  // FIX 2: Inject quickRenameModal before </body>
  if (l.trim() === '</body>' && !fixes.quickRename) {
    out.push('');
    out.push('<!-- Quick Rename Modal -->');
    out.push('<div id="quickRenameModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99999;align-items:center;justify-content:center;">');
    out.push('  <div style="background:#fff;border-radius:14px;padding:24px;max-width:340px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.18);">');
    out.push('    <div style="font-weight:800;font-size:1rem;color:#374151;margin-bottom:16px;">✏️ Quick Rename Student</div>');
    out.push('    <input type="hidden" id="quickRenameId">');
    out.push('    <input id="quickRenameInput" type="text" style="width:100%;padding:10px 14px;border:1.5px solid #A855F7;border-radius:10px;font-size:0.95rem;box-sizing:border-box;margin-bottom:16px;" placeholder="Enter new name">');
    out.push('    <div style="display:flex;gap:10px;">');
    out.push('      <button onclick="saveQuickRename()" style="flex:1;padding:10px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;">💾 Save</button>');
    out.push('      <button onclick="closeQuickRename()" style="flex:1;padding:10px;background:#F3F4F6;color:#374151;border:none;border-radius:10px;font-weight:700;cursor:pointer;">Cancel</button>');
    out.push('    </div>');
    out.push('  </div>');
    out.push('</div>');
    out.push('<script>');
    out.push('function openQuickRename(id,e){');
    out.push('  if(e) e.stopPropagation();');
    out.push('  var s=students.find(function(x){return x.id===id;});');
    out.push('  if(!s) return;');
    out.push('  document.getElementById("quickRenameId").value=id;');
    out.push('  document.getElementById("quickRenameInput").value=s.name;');
    out.push('  document.getElementById("quickRenameModal").style.display="flex";');
    out.push('  setTimeout(function(){document.getElementById("quickRenameInput").focus();},100);');
    out.push('}');
    out.push('function closeQuickRename(){');
    out.push('  document.getElementById("quickRenameModal").style.display="none";');
    out.push('}');
    out.push('function saveQuickRename(){');
    out.push('  var id=parseInt(document.getElementById("quickRenameId").value);');
    out.push('  var newName=document.getElementById("quickRenameInput").value.trim();');
    out.push('  if(!newName){alert("Name cannot be empty!");return;}');
    out.push('  var idx=students.findIndex(function(x){return x.id===id;});');
    out.push('  if(idx===-1) return;');
    out.push('  students[idx].name=newName;');
    out.push('  students[idx].avatar=newName.charAt(0).toUpperCase();');
    out.push('  saveData();renderStudents();renderDashboard();');
    out.push('  closeQuickRename();');
    out.push('}');
    out.push('document.getElementById("quickRenameModal").addEventListener("click",function(e){if(e.target===this)closeQuickRename();});');
    out.push('document.getElementById("quickRenameInput").addEventListener("keydown",function(e){if(e.key==="Enter")saveQuickRename();if(e.key==="Escape")closeQuickRename();});');
    out.push('</script>');
    out.push('');
    fixes.quickRename = true;
    console.log('✅ Injected quickRenameModal and functions');
  }

  out.push(l);
  i++;
}

const result = out.join('\r\n');
const rpCount = (result.match(/function renderPayments\b/g)||[]).length;
const hasQR = result.includes('id="quickRenameModal"');
const hasSQR = result.includes('function saveQuickRename');

console.log('\n📊 renderPayments functions: ' + rpCount + ' (should be 1)');
console.log('📊 quickRenameModal present: ' + hasQR);
console.log('📊 saveQuickRename present: ' + hasSQR);

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
