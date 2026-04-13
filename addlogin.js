const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Fix 1: Remove Rainy from Friday (index 4)
h = h.replace(
  "    {time:'7:30 PM', student:'Rainy', duration:25},\n    {time:'8:00 PM', student:'Owen', duration:25},\n  ],\n  5:",
  "    {time:'8:00 PM', student:'Owen', duration:25},\n  ],\n  5:"
);

// Fix 2: Add Coco-2 at 11:00 AM Saturday and Shily at 11:30 AM Saturday
h = h.replace(
  "    {time:'10:00 AM', student:'Seah', duration:50},\n    {time:'11:00 AM', student:'Shily', duration:25},",
  "    {time:'10:00 AM', student:'Seah', duration:50},\n    {time:'11:00 AM', student:'Coco-2', duration:25},\n    {time:'11:30 AM', student:'Shily', duration:25},"
);

fs.writeFileSync('index.html', h, 'utf8');
console.log('friday fixed:', !h.includes("7:30 PM', student:'Rainy', duration:25},\n    {time:'8:00 PM', student:'Owen'"));
console.log('saturday fixed:', h.includes("11:00 AM', student:'Coco-2'") && h.includes("11:30 AM', student:'Shily'"));