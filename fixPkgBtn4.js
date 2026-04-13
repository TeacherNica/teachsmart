const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const OLD = "onclick=\"event.stopPropagation();openSetPackage(\\'+s.id+\\')\"";
const NEW = 'onclick="openSetPackage(${s.id})"';

if(!html.includes(OLD)){
  // try alternate
  const OLD2 = "onclick=\"event.stopPropagation();openSetPackage('+s.id+')\"";
  if(!html.includes(OLD2)){
    console.error('ERROR: not found. Showing button context:');
    const idx = html.indexOf('Set Package');
    console.log(JSON.stringify(html.substring(idx-80, idx+20)));
    process.exit(1);
  }
  html = html.replace(OLD2, NEW);
} else {
  html = html.replace(OLD, NEW);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true');
