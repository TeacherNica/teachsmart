const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

console.log('savePDFFiles found:', h.includes('function savePDFFiles') ? 'YES' : 'NO');
console.log('handlePDFSelect found:', h.includes('function handlePDFSelect') ? 'YES' : 'NO');
console.log('renderPDFRecords found:', h.includes('function renderPDFRecords') ? 'YES' : 'NO');

// Show what's around savePDFFiles
const i = h.indexOf('function savePDFFiles');
if (i !== -1) {
  console.log('\n--- Around savePDFFiles ---');
  console.log(h.substring(i-200, i+100));
}

// Check file ending
console.log('\n--- File ending ---');
console.log(h.slice(-500));
