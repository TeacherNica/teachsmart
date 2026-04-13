const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const oldSat = "5: [\r\n    {time:'10:00 AM', student:'Seah', duration:50},\r\n    {time:'11:00 AM', student:'Shily', duration:25},\r\n    {time:'12:00 PM', student:'Owen',";
const newSat = "5: [\r\n    {time:'10:00 AM', student:'Seah', duration:50},\r\n    {time:'11:00 AM', student:'Coco-2', duration:25},\r\n    {time:'11:30 AM', student:'Shily', duration:25},\r\n    {time:'12:00 PM', student:'Owen',";

h = h.replace(oldSat, newSat);
fs.writeFileSync('index.html', h, 'utf8');
console.log('fixed:', h.includes("'Coco-2', duration:25"));