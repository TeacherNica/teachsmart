const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldBtn = "onclick=\"openModal('report-modal')\">📝 Report</button>\n        ${s.classes<=2?";
const newBtn = "onclick=\"openModal('report-modal')\">📝 Report</button>\n        <button class=\"s-btn\" style=\"background:#DCFCE7;color:#15803D;\" onclick=\"addClass(${s.id})\">➕ Add</button>\n        <button class=\"s-btn\" style=\"background:#FEE2E2;color:#B91C1C;\" onclick=\"deductClass(${s.id})\">➖ Deduct</button>\n        <button class=\"s-btn\" style=\"background:#FEF3C7;color:#B45309;\" onclick=\"deleteStudent(${s.id})\">🗑️ Delete</button>\n        ${s.classes<=2?";

h = h.replace(oldBtn, newBtn);
fs.writeFileSync('index.html', h, 'utf8');
console.log('done:', h.includes('deductClass'));