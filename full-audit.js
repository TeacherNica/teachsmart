const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Count all PDF-related functions
const fns = ['savePDFFiles','renderPDFRecords','getPDFRecords','handlePDFSelect','deletePDFRecord','uploadPDFs','renderReports','closeUploadModal','openUploadModal'];
console.log('=== FUNCTION AUDIT ===');
fns.forEach(fn => {
  const count = (h.match(new RegExp(fn, 'g')) || []).length;
  console.log(fn + ': ' + count + ' occurrences');
});

// Show all script tag positions
console.log('\n=== SCRIPT TAGS ===');
let i = 0;
let count = 0;
while ((i = h.indexOf('<script>', i)) !== -1) {
  count++;
  console.log('Script tag ' + count + ' at position ' + i);
  i++;
}

// Show closing body position
console.log('\n</body> at position:', h.lastIndexOf('</body>'));
console.log('File length:', h.length);

// Show what script tags contain savePDFFiles
const j = h.indexOf('function savePDFFiles');
console.log('\nsavePDFFiles at position:', j);
if (j !== -1) {
  // Find the script tag before it
  const scriptBefore = h.lastIndexOf('<script>', j);
  const scriptCloseBefore = h.lastIndexOf('</script>', j);
  console.log('Last <script> before it:', scriptBefore);
  console.log('Last </script> before it:', scriptCloseBefore);
  console.log('Is inside script tag:', scriptBefore > scriptCloseBefore ? 'YES' : 'NO');
}
