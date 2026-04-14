const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const oldText = "id=\"earn-unpaid\">₱0</div>\r\n      <div class=\"stat-label\">Total Unpaid Amount</div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n<!-- ─── REPORTS ─── -->";

const newText = "id=\"earn-unpaid\">₱0</div>\r\n      <div class=\"stat-label\">Total Unpaid Amount</div>\r\n    </div>\r\n  </div>\r\n\r\n  <!-- PDF Records List -->\r\n  <div style=\"margin-top:24px;\">\r\n    <div style=\"font-weight:700;font-size:1rem;color:#374151;margin-bottom:12px;\">📁 Uploaded PDF Records</div>\r\n    <div id=\"pdf-records-list\"><p style=\"color:#9CA3AF;font-size:0.85rem;\">No PDF records yet.</p></div>\r\n  </div>\r\n</div>\r\n\r\n\r\n<!-- ─── REPORTS ─── -->";

if (html.includes(oldText)) {
  html = html.replace(oldText, newText);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('done: true — PDF records list added!');
} else {
  console.log('ERROR: Could not find target text');
}
