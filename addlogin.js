const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Add Carl to students array
const lastStudent = '{"id":119,"name":"Shily"';
const carlEntry = '{"id":120,"name":"Carl","nat":"🇨🇳 Chinese","level":"Beginner","rate":25,"classes":10,"total":10,"duration":"50 min","schedule":"","attendance":100,"avatar":"👦","c1":"#F97316","c2":"#FBBF24","badges":[],"paid":false,"birthday":""},{"id":119,"name":"Shily"';

h = h.replace(lastStudent, carlEntry);

fs.writeFileSync('index.html', h, 'utf8');
console.log('Carl added:', h.includes('"name":"Carl"'));