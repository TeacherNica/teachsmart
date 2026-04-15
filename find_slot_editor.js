const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
console.log('\n=== openSlotEditor function ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function openSlotEditor')) {
    for (let j = i; j < Math.min(i+60, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j]);
      if (j > i && lines[j].trim() === '}') break;
    }
    break;
  }
}
console.log('\n=== slotEditor modal references ===');
lines.forEach((l, i) => {
  if (l.includes('slotEditor') || l.includes('slot-editor') || l.includes('slotModal')) {
    console.log((i+1) + ': ' + l.trim().substring(0, 120));
  }
});
console.log('\n=== cell() function ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === 'function cell(name,bg){') {
    for (let j = i; j < Math.min(i+12, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j]);
    }
    break;
  }
}
