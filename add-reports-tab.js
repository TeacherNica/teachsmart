const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// ─── NEW REPORTS PAGE HTML ───
const reportsPage = `
<!-- ─── REPORTS ─── -->
<div class="page" id="page-reports">
  <div class="page-header">
    <div><div class="page-title">📁 PDF Reports</div><div class="page-sub">Upload and organize monthly PDF records</div></div>
    <button class="btn btn-primary" onclick="openUploadModal()">📤 Upload PDFs</button>
  </div>

  <div id="reports-list" style="display:flex;flex-direction:column;gap:16px;"></div>
</div>

<!-- Upload Modal -->
<div id="uploadPDFModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:420px;width:92%;box-shadow:0 8px 32px rgba(0,0,0,0.18);position:relative;">
    <button onclick="closeUploadModal()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#888;">&times;</button>
    <h2 style="margin:0 0 20px;font-size:1.1rem;color:#374151;">📤 Upload PDF Files</h2>

    <div style="margin-bottom:16px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Select PDF Files</label>
      <input type="file" id="pdf-upload-input" accept="application/pdf" multiple style="width:100%;padding:10px;border:1.5px dashed #A855F7;border-radius:10px;font-size:0.85rem;box-sizing:border-box;cursor:pointer;background:#F5F3FF;">
      <div id="pdf-file-count" style="font-size:0.78rem;color:#9CA3AF;margin-top:6px;"></div>
    </div>

    <div style="margin-bottom:20px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Assign to Month</label>
      <select id="pdf-month-select" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">
        <option value="January 2026">January 2026</option>
        <option value="February 2026">February 2026</option>
        <option value="March 2026">March 2026</option>
        <option value="April 2026" selected>April 2026</option>
        <option value="May 2026">May 2026</option>
        <option value="June 2026">June 2026</option>
        <option value="July 2026">July 2026</option>
        <option value="August 2026">August 2026</option>
        <option value="September 2026">September 2026</option>
        <option value="October 2026">October 2026</option>
        <option value="November 2026">November 2026</option>
        <option value="December 2026">December 2026</option>
      </select>
    </div>

    <button onclick="uploadPDFs()" style="width:100%;padding:12px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;">💾 Save Files</button>
    <div id="upload-progress" style="display:none;margin-top:12px;text-align:center;color:#A855F7;font-size:0.85rem;font-weight:600;">Uploading...</div>
  </div>
</div>
`;

// Add reports page before materials page
html = html.replace('<!-- ─── MATERIALS ─── -->', reportsPage + '\n\n<!-- ─── MATERIALS ─── -->');
console.log('✓ Reports page HTML added');

// Add Reports nav item
html = html.replace(
  `<div class="nav-item" onclick="nav('earnings',this)"><span class="nav-icon">📊</span>Earnings</div>`,
  `<div class="nav-item" onclick="nav('earnings',this)"><span class="nav-icon">📊</span>Earnings</div>
  <div class="nav-item" onclick="nav('reports',this)"><span class="nav-icon">📁</span>Reports</div>`
);
console.log('✓ Reports nav item added');

// Add Reports JS
const reportsJS = `
<script>
// ─── PDF REPORTS ───
function getPDFReports(){
  return JSON.parse(localStorage.getItem('ts-pdf-reports')||'[]');
}

function savePDFReports(reports){
  localStorage.setItem('ts-pdf-reports', JSON.stringify(reports));
}

function renderReports(){
  var reports = getPDFReports();
  var container = document.getElementById('reports-list');
  if(!container) return;

  if(reports.length === 0){
    container.innerHTML = '<div style="text-align:center;color:#9CA3AF;padding:60px 0;font-size:0.9rem;">No PDF reports yet.<br>Click "Upload PDFs" to get started.</div>';
    return;
  }

  // Group by month
  var grouped = {};
  reports.forEach(function(r){
    if(!grouped[r.month]) grouped[r.month] = [];
    grouped[r.month].push(r);
  });

  // Sort months newest first
  var months = Object.keys(grouped).sort(function(a,b){
    return new Date('01 '+b) - new Date('01 '+a);
  });

  container.innerHTML = months.map(function(month){
    var files = grouped[month];
    return '<div style="background:#fff;border-radius:14px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.07);">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'+
        '<div style="display:flex;align-items:center;gap:10px;">'+
          '<span style="font-size:1.3rem;">📁</span>'+
          '<div>'+
            '<div style="font-weight:700;font-size:1rem;">'+month+'</div>'+
            '<div style="font-size:0.75rem;color:#9CA3AF;">'+files.length+' file'+(files.length===1?'':'s')+'</div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div style="display:flex;flex-direction:column;gap:8px;">'+
        files.map(function(f){
          return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#F5F3FF;border-radius:10px;">'+
            '<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">'+
              '<span style="font-size:1.1rem;">📄</span>'+
              '<span style="font-size:0.85rem;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+f.name+'</span>'+
            '</div>'+
            '<div style="display:flex;gap:8px;flex-shrink:0;">'+
              '<button onclick="viewPDF(\''+f.id+'\')" style="padding:5px 10px;background:#A855F7;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">View</button>'+
              '<button onclick="deletePDF(\''+f.id+'\')" style="padding:5px 10px;background:#FEE2E2;color:#EF4444;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">Delete</button>'+
            '</div>'+
          '</div>';
        }).join('')+
      '</div>'+
    '</div>';
  }).join('');
}

function openUploadModal(){
  document.getElementById('pdf-file-count').textContent = '';
  document.getElementById('pdf-upload-input').value = '';
  document.getElementById('upload-progress').style.display = 'none';
  document.getElementById('uploadPDFModal').style.display = 'flex';
}

function closeUploadModal(){
  document.getElementById('uploadPDFModal').style.display = 'none';
}

document.getElementById('pdf-upload-input').addEventListener('change', function(){
  var count = this.files.length;
  document.getElementById('pdf-file-count').textContent = count + ' file'+(count===1?'':' s')+' selected';
});

function uploadPDFs(){
  var input = document.getElementById('pdf-upload-input');
  var month = document.getElementById('pdf-month-select').value;
  var files = input.files;

  if(!files || files.length === 0){
    alert('Please select at least one PDF file.');
    return;
  }

  var progress = document.getElementById('upload-progress');
  progress.style.display = 'block';

  var reports = getPDFReports();
  var loaded = 0;

  Array.from(files).forEach(function(file){
    var reader = new FileReader();
    reader.onload = function(e){
      reports.unshift({
        id: Date.now() + Math.random(),
        name: file.name,
        month: month,
        data: e.target.result,
        uploadedAt: new Date().toISOString()
      });
      loaded++;
      if(loaded === files.length){
        savePDFReports(reports);
        closeUploadModal();
        renderReports();
      }
    };
    reader.readAsDataURL(file);
  });
}

function viewPDF(id){
  var reports = getPDFReports();
  var report = reports.find(function(r){ return String(r.id) === String(id); });
  if(!report) return;
  var win = window.open();
  win.document.write('<iframe src="'+report.data+'" style="width:100%;height:100%;border:none;"></iframe>');
}

function deletePDF(id){
  if(!confirm('Delete this file?')) return;
  var reports = getPDFReports().filter(function(r){ return String(r.id) !== String(id); });
  savePDFReports(reports);
  renderReports();
}

document.getElementById('uploadPDFModal').addEventListener('click', function(e){
  if(e.target === this) closeUploadModal();
});
</script>
`;

// Add nav handler for reports
html = html.replace(
  "if(page==='earnings')renderEarnings();",
  "if(page==='earnings')renderEarnings();\n  if(page==='reports')renderReports();"
);

html = html.replace('</body>', reportsJS + '\n</body>');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Reports JS added');
console.log('✓ Nav handler updated');
console.log('\ndone: true');
