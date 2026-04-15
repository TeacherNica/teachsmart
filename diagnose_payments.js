const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

// Show page-payments HTML
console.log('\n=== page-payments HTML ===');
let inP = false, depth = 0, started = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="page-payments"')) inP = true;
  if (inP) {
    console.log((i+1) + ': ' + lines[i]);
    const opens = (lines[i].match(/<div/g)||[]).length;
    const closes = (lines[i].match(/<\/div>/g)||[]).length;
    if (!started && opens > 0) started = true;
    depth += opens - closes;
    if (started && depth <= 0) { inP = false; started = false; depth = 0; }
  }
}

// Show renderPayments function(s)
console.log('\n=== renderPayments function(s) ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function renderPayments')) {
    for (let j = i; j < Math.min(i+60, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j]);
      if (j > i && lines[j].trim() === '}') break;
    }
  }
}

// Show getPayments / savePayments
console.log('\n=== getPayments / savePayments ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function getPayments') || lines[i].includes('function savePayments')) {
    console.log((i+1) + ': ' + lines[i]);
  }
}

// Show addPaymentModal HTML
console.log('\n=== addPaymentModal HTML ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('addPaymentModal')) {
    console.log((i+1) + ': ' + lines[i].trim().substring(0, 120));
  }
}
