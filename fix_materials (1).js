const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Replacing Materials page with 2-folder system ===');

// Find the materials page start and end
const pageStart = content.indexOf('page-materials">');
const pageEnd = content.indexOf('<div class="page" id="page-', pageStart + 10);

console.log('Materials page from', pageStart, 'to', pageEnd);

const newMaterialsPage = `page-materials">
  <div class="page-header">
    <div><div class="page-title">📁 Materials Library</div><div class="page-sub">Kids & Adult teaching materials</div></div>
  </div>

  <!-- Folder View -->
  <div id="materials-home" style="display:block;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px;">
      <!-- Kids Folder -->
      <div onclick="openMaterialsFolder('kids')" style="background:linear-gradient(135deg,#FFF7ED,#FEF3C7);border:2px solid #FDE68A;border-radius:20px;padding:24px;text-align:center;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(251,191,36,0.3)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">
        <div style="font-size:3rem;margin-bottom:12px;">👧</div>
        <div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:1.2rem;color:#92400E;">Kids Materials</div>
        <div style="font-size:0.8rem;color:#B45309;margin-top:6px;" id="kids-count">Loading...</div>
      </div>
      <!-- Adults Folder -->
      <div onclick="openMaterialsFolder('adults')" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:2px solid #BFDBFE;border-radius:20px;padding:24px;text-align:center;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(59,130,246,0.3)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">
        <div style="font-size:3rem;margin-bottom:12px;">👨‍💼</div>
        <div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:1.2rem;color:#1E40AF;">Adult Materials</div>
        <div style="font-size:0.8rem;color:#2563EB;margin-top:6px;" id="adults-count">Loading...</div>
      </div>
    </div>
  </div>

  <!-- Folder Contents View -->
  <div id="materials-folder" style="display:none;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
      <button onclick="closeMaterialsFolder()" style="padding:6px 14px;border-radius:8px;border:1px solid #E5E7EB;background:white;cursor:pointer;font-weight:700;font-size:0.85rem;">← Back</button>
      <div id="folder-title" style="font-family:'Nunito',sans-serif;font-weight:900;font-size:1.1rem;"></div>
    </div>
    <!-- Add Material Form -->
    <div style="background:#F9FAFB;border-radius:14px;padding:16px;margin-bottom:16px;border:1.5px solid #E5E7EB;">
      <div style="font-weight:700;font-size:0.85rem;color:#6B7280;margin-bottom:10px;">➕ Add Material</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
        <input id="mat-name" placeholder="Material name" style="padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:0.85rem;font-family:'Nunito',sans-serif;">
        <input id="mat-type" placeholder="Type (e.g. PDF, Link, Video)" style="padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:0.85rem;font-family:'Nunito',sans-serif;">
      </div>
      <input id="mat-link" placeholder="Link or URL (optional)" style="width:100%;padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:0.85rem;font-family:'Nunito',sans-serif;box-sizing:border-box;margin-bottom:8px;">
      <input id="mat-notes" placeholder="Notes (optional)" style="width:100%;padding:8px 12px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:0.85rem;font-family:'Nunito',sans-serif;box-sizing:border-box;margin-bottom:8px;">
      <button onclick="addMaterial()" style="width:100%;padding:9px;background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;border:none;border-radius:8px;font-weight:800;font-size:0.85rem;cursor:pointer;font-family:'Nunito',sans-serif;">💾 Save Material</button>
    </div>
    <!-- Materials List -->
    <div id="materials-list"></div>
  </div>

`;

content = content.substring(0, pageStart) + newMaterialsPage + content.substring(pageEnd);
console.log('✅ Materials page replaced');

// Add JavaScript functions before last </script>
const materialsFns = `
var _currentFolder = '';

function openMaterialsFolder(folder){
  _currentFolder = folder;
  document.getElementById('materials-home').style.display = 'none';
  document.getElementById('materials-folder').style.display = 'block';
  document.getElementById('folder-title').innerHTML = folder === 'kids'
    ? '👧 Kids Materials'
    : '👨‍💼 Adult Materials';
  renderMaterialsList();
}

function closeMaterialsFolder(){
  _currentFolder = '';
  document.getElementById('materials-home').style.display = 'block';
  document.getElementById('materials-folder').style.display = 'none';
  updateFolderCounts();
}

function getMaterials(){
  return JSON.parse(localStorage.getItem('ts-materials')||'{"kids":[],"adults":[]}');
}

function saveMaterials(data){
  localStorage.setItem('ts-materials', JSON.stringify(data));
}

function updateFolderCounts(){
  var data = getMaterials();
  var kc = document.getElementById('kids-count');
  var ac = document.getElementById('adults-count');
  if(kc) kc.textContent = data.kids.length + ' item' + (data.kids.length!==1?'s':'');
  if(ac) ac.textContent = data.adults.length + ' item' + (data.adults.length!==1?'s':'');
}

function addMaterial(){
  var name = document.getElementById('mat-name').value.trim();
  var type = document.getElementById('mat-type').value.trim();
  var link = document.getElementById('mat-link').value.trim();
  var notes = document.getElementById('mat-notes').value.trim();
  if(!name){ alert('Please enter a material name!'); return; }
  var data = getMaterials();
  var item = { id: Date.now(), name: name, type: type||'File', link: link, notes: notes, addedAt: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) };
  data[_currentFolder].push(item);
  saveMaterials(data);
  document.getElementById('mat-name').value = '';
  document.getElementById('mat-type').value = '';
  document.getElementById('mat-link').value = '';
  document.getElementById('mat-notes').value = '';
  renderMaterialsList();
  updateFolderCounts();
}

function deleteMaterial(id){
  if(!confirm('Delete this material?')) return;
  var data = getMaterials();
  data[_currentFolder] = data[_currentFolder].filter(function(m){ return m.id !== id; });
  saveMaterials(data);
  renderMaterialsList();
  updateFolderCounts();
}

function renderMaterialsList(){
  var container = document.getElementById('materials-list');
  if(!container) return;
  var data = getMaterials();
  var items = data[_currentFolder] || [];
  if(items.length === 0){
    container.innerHTML = '<div style="text-align:center;color:#9CA3AF;padding:30px 0;font-size:0.9rem;">No materials yet.<br>Add your first material above! 📚</div>';
    return;
  }
  var icons = {'PDF':'📄','Link':'🔗','Video':'🎥','Worksheet':'📝','Audio':'🎵','Image':'🖼️','File':'📁'};
  container.innerHTML = items.map(function(m){
    var icon = icons[m.type] || '📁';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;margin-bottom:8px;background:white;border:1.5px solid #E5E7EB;gap:10px;flex-wrap:wrap;">'
      +'<div style="display:flex;align-items:center;gap:12px;flex:1;">'
        +'<div style="font-size:1.8rem;">'+icon+'</div>'
        +'<div>'
          +'<div style="font-weight:800;font-size:0.9rem;color:#374151;">'+m.name+'</div>'
          +'<div style="font-size:0.75rem;color:#9CA3AF;">'+m.type+(m.notes?' · '+m.notes:'')+' · Added '+m.addedAt+'</div>'
        +'</div>'
      +'</div>'
      +'<div style="display:flex;gap:6px;">'
        +(m.link?'<a href="'+m.link+'" target="_blank" style="padding:5px 12px;border-radius:8px;background:#EFF6FF;color:#1D4ED8;font-weight:700;font-size:11px;text-decoration:none;">🔗 Open</a>':'')
        +'<button onclick="deleteMaterial('+m.id+')" style="padding:5px 12px;border-radius:8px;border:none;background:#FEE2E2;color:#EF4444;font-weight:700;font-size:11px;cursor:pointer;">🗑️</button>'
      +'</div>'
    +'</div>';
  }).join('');
}`;

const lastScript = content.lastIndexOf('</script>');
content = content.substring(0, lastScript) + materialsFns + '\n</script>' + content.substring(lastScript + 9);
console.log('✅ Materials JavaScript functions added');

// Call updateFolderCounts when materials page is opened
content = content.replace(
  "if(page==='payments')renderPayments();",
  "if(page==='payments')renderPayments();\n  if(page==='materials')updateFolderCounts();"
);
console.log('✅ updateFolderCounts called when materials tab opens');

// FINAL CHECKS
console.log('\n=== FINAL CHECKS ===');
const checks = [
  'function renderDashboard','function renderStudents','function renderPayments',
  'function renderEarnings','function renderReports','function openStudentProfile',
  'function markAttendance','function editPayment','function deletePayment',
  'function openSlotEditor','function saveQuickRename','function saveData','function getPayments'
];
let fail = false;
checks.forEach(function(fn) {
  const count = (content.match(new RegExp(fn, 'g'))||[]).length;
  if (count !== 1) { console.log('❌', fn, '—', count, 'times'); fail = true; }
  else console.log('✅', fn);
});
const ot = (content.match(/<script/g)||[]).length;
const ct = (content.match(/<\/script>/g)||[]).length;
if (ot !== ct) { console.log('❌ Script tags unbalanced:', ot, 'open,', ct, 'close'); fail = true; }
else console.log('✅ Script tags balanced (' + ot + ' pairs)');
console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', content.split('\n').length);

if (fail) { console.error('\n❌ Final check failed! File NOT saved.'); process.exit(1); }

fs.writeFileSync('index.html', content, 'utf8');
console.log('\ndone: true');
console.log('✅ Materials tab now has Kids & Adults folders!');
