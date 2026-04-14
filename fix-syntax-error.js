const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Fix the broken viewPDF button
const oldView = `'<button onclick="viewPDF(''+f.id+'')" style="padding:5px 10px;background:#A855F7;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">View</button>'+`;
const newView = `'<button onclick="viewPDF("+f.id+")" style="padding:5px 10px;background:#A855F7;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">View</button>'+`;

// Fix the broken deletePDF button
const oldDelete = `'<button onclick="deletePDF(''+f.id+'')" style="padding:5px 10px;background:#FEE2E2;color:#EF4444;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">Delete</button>'+`;
const newDelete = `'<button onclick="deletePDF("+f.id+")" style="padding:5px 10px;background:#FEE2E2;color:#EF4444;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:600;">Delete</button>'+`;

if (html.includes(oldView)) {
  html = html.replace(oldView, newView);
  console.log('✓ Fixed viewPDF button');
} else {
  console.log('⚠ viewPDF button not found with expected text');
}

if (html.includes(oldDelete)) {
  html = html.replace(oldDelete, newDelete);
  console.log('✓ Fixed deletePDF button');
} else {
  console.log('⚠ deletePDF button not found with expected text');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('done: true');
