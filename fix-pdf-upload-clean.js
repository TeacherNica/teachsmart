const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// ─── STEP 1: Remove all broken PDF upload code ───
// Remove uploadPDFModal HTML
html = html.replace(/<!-- Upload Modal -->[\s\S]*?<!-- Payment Detail Modal -->/,
  '<!-- Payment Detail Modal -->');

// Remove broken reports JS script block
html = html.replace(/<script>\s*\/\/ ─── PDF REPORTS ───[\s\S]*?<\/script>/g, '');

console.log('✓ Removed broken PDF code');

// ─── STEP 2: Add clean PDF Records section to Earnings page ───
const oldEarningsContent = `<div class="page-title">📊 Earnings</div><div class="page-sub">Simple income summary</div></div>
    <button class="btn btn-primary" onclick="openUploadModal()">📁 PDF Records</button>
  </div>`;

const newEarningsContent = `<div class="page-title">📊 Earnings</div><div class="page-sub">Simple income summary</div></div>
  </div>`;

html = html.replace(oldEarningsContent, newEarningsContent);

// Add PDF Records section after earnings stats
const oldEarningsStats = `<div id="earn-unpaid">₱0</div>
      <div class="stat-label">Total Unpaid Amount</div>
    </div>
  </div>
</div>`;

const newEarningsStats = `<div id="earn-unpaid">₱0</div>
      <div class="stat-label">Total Unpaid Amount</div>
    </div>
  </div>

  <!-- PDF Records Section -->
  <div style="margin-top:24px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div style="font-weight:700;font-size:1rem;color:#374151;">📁 PDF Records</div>
      <label style="padding:8px 16px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.85rem;">
        📤 Upload PDFs
        <input type="file" id="pdf-upload-input" accept="application/pdf" multiple onchange="handlePDFSelect(this)" style="display:none;">
      </label>
    </div>

    <!-- Month selector (shows after files selected) -->
    <div id="pdf-month-section" style="display:none;background:#F5F3FF;border-radius:12px;padding:16px;margin-bottom:14px;">
      <div style="font-size:0.85rem;font-weight:600;color:#374151;margin-bottom:8px;" id="pdf-selected-count"></div>
      <select id="pdf-month-select" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;margin-bottom:10px;">
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
      <button onclick="savePDFFiles()" style="width:100%;padding:10px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;">💾 Save Files</button>
    </div>

    <div id="pdf-records-list"></div>
  </div>
</div>`;

html = html.replace(oldEarningsStats, newEarningsStats);
console.log('✓ Added clean PDF Records section to Earnings page');

// ─── STEP 3: Add clean PDF JS ───
const pdfJS = `
<script>
// ─── PDF RECORDS (CLEAN) ───
var pendingPDFFiles = [];

function handlePDFSelect(input) {
  var files = input.files;
  if (!files || files.length === 0) return;
  pendingPDFFiles = Array.from(files);
  var countEl = document.getElementById('pdf-selected-count');
  var section = document.getElementById('pdf-month-section');
  if (countEl) countEl.textContent = pendingPDFFiles.length + ' file' + (pendingPDFFiles.length === 1 ? '' : 's') + ' selected';
  if (section) section.style.display = 'block';
}

function getPDFRecords() {
  return JSON.parse(localStorage.getItem('ts-pdf-records') || '[]');
}

function savePDFRecords(records) {
  localStorage.setItem('ts-pdf-records', JSON.stringify(records));
}

function savePDFFiles() {
  if (!pendingPDFFiles || pendingPDFFiles.length === 0) {
    alert('No files selected.');
    return;
  }
  var month = document.getElementById('pdf-month-select').value;
  var records = getPDFRecords();
  var loaded = 0;

  pendingPDFFiles.forEach(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      records.unshift({
        id: Date.now() + Math.random(),
        name: file.name,
        month: month,
        data: e.target.result,
        savedAt: new Date().toLocaleString()
      });
      loaded++;
      if (loaded === pendingPDFFiles.length) {
        savePDFRecords(records);
        pendingPDFFiles = [];
        document.getElementById('pdf-month-section').style.display = 'none';
        document.getElementById('pdf-upload-input').value = '';
        renderPDFRecords();
      }
    };
    reader.readAsDataURL(file);
  });
}

function renderPDFRecords() {
  var records = getPDFRecords();
  var container = document.getElementById('pdf-records-list');
  if (!container) return;

  if (records.length === 0) {
    container.innerHTML = '<p style="color:#9CA3AF;font-size:0.85rem;">No PDF records yet.</p>';
    return;
  }

  // Group by month
  var grouped = {};
  records.forEach(function(r) {
    if (!grouped[r.month]) grouped[r.month] = [];
    grouped[r.month].push(r);
  });

  container.innerHTML = Object.keys(grouped).map(function(month) {
    var files = grouped[month];
    return '<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">' +
      '<div style="font-weight:700;font-size:0.9rem;margin-bottom:10px;display:flex;align-items:center;gap:8px;">📁 ' + month + ' <span style="font-size:0.75rem;color:#9CA3AF;font-weight:400;">(' + files.length + ' file' + (files.length === 1 ? '' : 's') + ')</span></div>' +
      files.map(function(f) {
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#F5F3FF;border-radius:8px;margin-bottom:6px;">' +
          '<a href="' + f.data + '" target="_blank" style="color:#A855F7;font-weight:600;font-size:0.85rem;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">📄 ' + f.name + '</a>' +
          '<button onclick="deletePDFRecord(' + f.id + ')" style="background:#FEE2E2;color:#EF4444;border:none;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;margin-left:8px;flex-shrink:0;">Delete</button>' +
        '</div>';
      }).join('') +
    '</div>';
  }).join('');
}

function deletePDFRecord(id) {
  if (!confirm('Delete this file?')) return;
  var records = getPDFRecords().filter(function(r) { return r.id !== id; });
  savePDFRecords(records);
  renderPDFRecords();
}
</script>
`;

html = html.replace('</body>', pdfJS + '\n</body>');
console.log('✓ Clean PDF JS injected');

// Fix nav handler for earnings to also render PDF records
html = html.replace(
  "if(page==='earnings')renderEarnings();",
  "if(page==='earnings'){renderEarnings();renderPDFRecords();}"
);
console.log('✓ Nav handler updated');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('\ndone: true');
