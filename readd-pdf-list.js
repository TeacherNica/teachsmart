const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Find earnings page end
const earningsEnd = html.indexOf('<!-- ─── REPORTS ─── -->');
if (earningsEnd === -1) {
  console.log('ERROR: Could not find REPORTS marker');
  process.exit(1);
}

// Find the </div> just before <!-- ─── REPORTS ─── -->
const insertPoint = html.lastIndexOf('</div>', earningsEnd);
if (insertPoint === -1) {
  console.log('ERROR: Could not find insertion point');
  process.exit(1);
}

const pdfSection = `\r\n\r\n  <!-- PDF Records List -->\r\n  <div style="margin-top:24px;">\r\n    <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:12px;">📁 Uploaded PDF Records</div>\r\n    <div id="pdf-records-list"><p style="color:#9CA3AF;font-size:0.85rem;">No PDF records yet.</p></div>\r\n  </div>\r\n</div>`;

// Replace the last </div> before REPORTS with the section + </div>
html = html.substring(0, insertPoint) + pdfSection + html.substring(insertPoint + 6);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('done: true — PDF records list added back');
