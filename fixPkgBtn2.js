const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const OLD = 'onclick="event.stopPropagation();openSetPackage(this,event)"';
const NEW = 'onclick="event.stopPropagation();openSetPackage(${s.id})"';

if(!html.includes(OLD)){console.error('ERROR: not found');process.exit(1);}
html = html.replace(OLD, NEW);
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true');
