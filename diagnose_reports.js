const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('\n=== activeTab reports references ===');
lines.forEach((line, i) => {
  if (line.includes("activeTab === 'reports'") || line.includes('activeTab === "reports"')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
  }
});

console.log('\n=== PDF-related lines ===');
lines.forEach((line, i) => {
  if (line.toLowerCase().includes('pdf') || line.includes('FileReader') || line.includes('uploadPDF') || line.includes('pdfUpload')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
  }
});

console.log('\n=== render function references ===');
lines.forEach((line, i) => {
  if (line.includes('renderReport') || line.includes('renderProgress') || line.includes('renderEarnings') || line.includes('function render')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
  }
});

console.log('\nTotal lines: ' + lines.length);
