const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('\n=== showPage / switchTab / navigation calls ===');
lines.forEach((line, i) => {
  if (line.includes("page==='earnings'") || line.includes('page==="earnings"') ||
      line.includes("showPage('earnings')") || line.includes('showPage("earnings")')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
  }
});

console.log('\n=== earnings HTML section (id=earnings or data-page=earnings) ===');
lines.forEach((line, i) => {
  if (line.includes('id="earnings"') || line.includes("id='earnings'") ||
      line.includes('data-page="earnings"') || line.includes("page-earnings")) {
    console.log('Line ' + (i+1) + ': ' + line.trim().substring(0, 120));
  }
});

console.log('\n=== renderEarnings function start ===');
let inFunc = false;
let braceCount = 0;
let printed = 0;
lines.forEach((line, i) => {
  if (line.includes('function renderEarnings()') && !inFunc) {
    inFunc = true;
    console.log('Line ' + (i+1) + ': ' + line.trim());
    printed++;
  } else if (inFunc && printed < 20) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
    printed++;
  }
});

console.log('\n=== All renderReports() calls ===');
lines.forEach((line, i) => {
  if (line.includes('renderReports()') || line.includes('renderReports(')) {
    console.log('Line ' + (i+1) + ': ' + line.trim());
  }
});
