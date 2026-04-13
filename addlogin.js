const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Remove Rainy 7:30 PM from Friday using exact position
const target = "    {time:'7:30 PM', student:'Rainy', duration:25},\r\n    {time:'8:00 P";
const replacement = "    {time:'8:00 P";

h = h.replace(target, replacement);
fs.writeFileSync('index.html', h, 'utf8');

// Verify
const remaining = [];
let i = 0;
while((i = h.indexOf('Rainy', i)) !== -1){
  remaining.push(h.substring(i-30, i+40));
  i++;
}
console.log('Rainy entries:', remaining.length);
remaining.forEach(r => console.log(r));