const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

const OLD = 'onclick="openSetPackage(${s.id},event)">📦 Set Package';
const NEW = 'onclick="event.stopPropagation();openSetPackage(${s.id})">📦 Set Package';

if(!html.includes(OLD)){console.error('ERROR: button not found');process.exit(1);}
html = html.replace(OLD, NEW);
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - changed '+(html.length-original)+' bytes');
