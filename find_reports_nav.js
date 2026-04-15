const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(/\r?\n/);

console.log('\n=== Finding Reports nav item in sidebar ===');
lines.forEach((line, i) => {
  if (line.includes("showPage('reports')") || line.includes('showPage("reports")')) {
    console.log('Line ' + (i+1) + ': ' + JSON.stringify(line));
  }
});
