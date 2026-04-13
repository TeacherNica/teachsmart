const fs = require('fs');
const filePath = 'index.html';
let html = fs.readFileSync(filePath, 'utf8');
const originalLength = html.length;

const START = `  function cell(name,bg){`;
const END_MARKER = `+'">'+name+'</td>';\n  }`;

const si = html.indexOf(START);
if(si===-1){console.error('ERROR: cell() start not found');process.exit(1);}

// Find end by looking for the closing of the return statement
const returnStart = html.indexOf(`return '<td style="background:'+c+`, si);
if(returnStart===-1){console.error('ERROR: return line not found');process.exit(1);}
const closeTag = html.indexOf(`+'">'+name+'</td>';`, returnStart);
if(closeTag===-1){console.error('ERROR: close tag not found');process.exit(1);}
// Find the closing brace of the function after that
const closeBrace = html.indexOf(`\n  }`, closeTag);
if(closeBrace===-1){console.error('ERROR: close brace not found');process.exit(1);}
const endFull = closeBrace + 4;
console.log('Found cell() at line, length '+(endFull-si)+' chars');

const KR = '\uD83C\uDDF0\uD83C\uDDF7';
const CN = '\uD83C\uDDE8\uD83C\uDDF3';

const NEW_CELL = `  const PASTEL={
    'K.Bella':   {flag:'${KR}',bg:'#FCE4EC',text:'#880E4F'},
    'Jackie':    {flag:'${KR}',bg:'#EDE7F6',text:'#4A148C'},
    'Lina':      {flag:'${KR}',bg:'#E8EAF6',text:'#1A237E'},
    'Aiden':     {flag:'${KR}',bg:'#E0F2F1',text:'#004D40'},
    'Sophia':    {flag:'${KR}',bg:'#E1F5FE',text:'#01579B'},
    'Peter':     {flag:'${KR}',bg:'#FFF8E1',text:'#E65100'},
    'Seah':      {flag:'${KR}',bg:'#F3E5F5',text:'#4A148C'},
    'Suri':      {flag:'${CN}',bg:'#FFF3E0',text:'#BF360C'},
    'Bella':     {flag:'${CN}',bg:'#FCE4EC',text:'#880E4F'},
    'COCO-1':    {flag:'${CN}',bg:'#FFFDE7',text:'#F57F17'},
    'Harry':     {flag:'${CN}',bg:'#E3F2FD',text:'#0D47A1'},
    'Kelly-Adult':{flag:'${CN}',bg:'#E8F5E9',text:'#1B5E20'},
    'KAREN':     {flag:'${CN}',bg:'#E0F7FA',text:'#006064'},
    'Mollie-Adult & Steven':{flag:'${CN}',bg:'#FFF9C4',text:'#827717'},
    'Coco-2':    {flag:'${CN}',bg:'#FFFDE7',text:'#F57F17'},
    'Koala':     {flag:'${CN}',bg:'#F3E5F5',text:'#4A148C'},
    'Owen':      {flag:'${CN}',bg:'#E8F5E9',text:'#1B5E20'},
    'Rainy':     {flag:'${CN}',bg:'#E3F2FD',text:'#0D47A1'},
    'Shily':     {flag:'${CN}',bg:'#FCE4EC',text:'#880E4F'},
    'Carl':      {flag:'${CN}',bg:'#FFF8E1',text:'#E65100'},
  };
  function cell(name,bg){
    if(!name)return '<td style="background:#EF4444;color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;">Close</td>';
    if(name==='Avail')return '<td style="background:#EAB308;color:#000;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;">Available</td>';
    const s=students.find(x=>x.name===name||x.name.startsWith(name));
    const meta=PASTEL[name]||{flag:'',bg:'#E8EAF6',text:'#1E1B4B'};
    const onclick=s?"nav(\\'students\\',document.querySelectorAll(\\'.nav-item\\')[1])":'';
    return '<td style="background:'+meta.bg+';color:'+meta.text+';text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;cursor:pointer;" onclick="'+onclick+'">'+(meta.flag?meta.flag+' ':'')+name+'</td>';
  }`;

html = html.slice(0, si) + NEW_CELL + html.slice(endFull);
if(html.length < originalLength){console.error('ERROR: file shrank!');process.exit(1);}
fs.writeFileSync(filePath, html, 'utf8');
console.log('done: true - grew by '+(html.length-originalLength)+' bytes');
