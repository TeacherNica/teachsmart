const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldSat = `  5: [
    {time:'10:00 AM', student:'Seah', duration:50},
    {time:'11:00 AM', student:'Shily', duration:25},
    {time:'12:00 PM', student:'Owen', duration:50},`;

const newSat = `  5: [
    {time:'10:00 AM', student:'Seah', duration:50},
    {time:'11:00 AM', student:'Coco-2', duration:25},
    {time:'11:30 AM', student:'Shily', duration:25},
    {time:'12:00 PM', student:'Owen', duration:50},`;

h = h.replace(oldSat, newSat);
fs.writeFileSync('index.html', h, 'utf8');
console.log('fixed:', h.includes("'11:00 AM', student:'Coco-2'"));