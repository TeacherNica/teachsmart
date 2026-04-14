const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

console.log('page-reports found:', h.includes('page-reports') ? 'YES' : 'NO');
console.log('Reports nav found:', h.includes("nav('reports'") ? 'YES' : 'NO');
console.log('renderReports found:', h.includes('renderReports') ? 'YES' : 'NO');
console.log('uploadPDFModal found:', h.includes('uploadPDFModal') ? 'YES' : 'NO');

// Show nav earnings area
const i = h.indexOf("nav('earnings'");
console.log('\n--- Nav around earnings ---');
console.log(h.substring(i-50, i+200));
