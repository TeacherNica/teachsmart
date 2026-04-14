const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const oldText = `    </div>
  </div>
</div>
<!-- ─── REPORTS ─── -->`;

const newText = `    </div>
  </div>

  <!-- PDF Records List -->
  <div style="margin-top:24px;">
    <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:12px;">📁 Uploaded PDF Records</div>
    <div id="pdf-records-list"><p style="color:#9CA3AF;font-size:0.85rem;">No PDF records yet.</p></div>
  </div>
</div>
<!-- ─── REPORTS ─── -->`;

if (html.includes(oldText)) {
  html = html.replace(oldText, newText);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('done: true — PDF records list added to earnings page');
} else {
  console.log('ERROR: Could not find target text');
}
