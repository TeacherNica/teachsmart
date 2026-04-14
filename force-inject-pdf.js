const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Verify functions don't exist
if (html.includes('function savePDFFiles')) {
  console.log('savePDFFiles already exists - removing old version first');
  html = html.replace(/<script>\s*\/\/ ─── PDF RECORDS ───[\s\S]*?<\/script>/g, '');
}

const pdfJS = `<script>
// ─── PDF RECORDS ───
function getPDFRecords(){return JSON.parse(localStorage.getItem('ts-pdf-records')||'[]');}
function savePDFRecordsToDB(r){localStorage.setItem('ts-pdf-records',JSON.stringify(r));}

function savePDFFiles(){
  var input=document.getElementById('pdf-upload-input');
  var monthEl=document.getElementById('pdf-month-select');
  if(!input||!input.files||input.files.length===0){alert('Please select a file first.');return;}
  var month=monthEl?monthEl.value:'Unknown';
  var files=Array.from(input.files);
  var records=getPDFRecords();
  var loaded=0;
  files.forEach(function(file){
    var reader=new FileReader();
    reader.onload=function(e){
      records.unshift({id:Date.now()+Math.random(),name:file.name,month:month,data:e.target.result,savedAt:new Date().toLocaleString()});
      loaded++;
      if(loaded===files.length){
        savePDFRecordsToDB(records);
        closeUploadModal();
        renderPDFRecords();
        alert('✅ '+loaded+' file(s) saved!');
      }
    };
    reader.readAsDataURL(file);
  });
}

function renderPDFRecords(){
  var records=getPDFRecords();
  var container=document.getElementById('pdf-records-list');
  if(!container)return;
  if(records.length===0){container.innerHTML='<p style="color:#9CA3AF;font-size:0.85rem;">No PDF records yet.</p>';return;}
  var grouped={};
  records.forEach(function(r){if(!grouped[r.month])grouped[r.month]=[];grouped[r.month].push(r);});
  container.innerHTML=Object.keys(grouped).map(function(month){
    var files=grouped[month];
    return '<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">'+
      '<div style="font-weight:700;font-size:0.9rem;margin-bottom:10px;">📁 '+month+' <span style="font-size:0.75rem;color:#9CA3AF;">('+files.length+' file'+(files.length===1?'':'s')+')</span></div>'+
      files.map(function(f){
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#F5F3FF;border-radius:8px;margin-bottom:6px;">'+
          '<a href="'+f.data+'" target="_blank" style="color:#A855F7;font-weight:600;font-size:0.85rem;text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📄 '+f.name+'</a>'+
          '<button onclick="deletePDFRecord(\''+f.id+'\')" style="background:#FEE2E2;color:#EF4444;border:none;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;margin-left:8px;flex-shrink:0;">Delete</button>'+
        '</div>';
      }).join('')+
    '</div>';
  }).join('');
}

function deletePDFRecord(id){
  if(!confirm('Delete this file?'))return;
  var records=getPDFRecords().filter(function(r){return String(r.id)!==String(id);});
  savePDFRecordsToDB(records);
  renderPDFRecords();
}
</script>`;

// Insert before </body>
html = html.replace('</body>', pdfJS + '\n</body>');
fs.writeFileSync(indexPath, html, 'utf8');

// Verify
const check = fs.readFileSync(indexPath, 'utf8');
console.log('savePDFFiles injected:', check.includes('function savePDFFiles') ? 'YES' : 'NO');
console.log('renderPDFRecords injected:', check.includes('function renderPDFRecords') ? 'YES' : 'NO');
console.log('deletePDFRecord injected:', check.includes('function deletePDFRecord') ? 'YES' : 'NO');
console.log('\ndone: true');
