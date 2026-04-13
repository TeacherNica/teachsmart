const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Replace the cell function inside renderScheduleGrid
const oldCell = `  function cell(name,bg){
    if(!name)return '<td style="background:#EF4444;color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;">Close</td>';
    if(name==='Avail')return '<td style="background:#EAB308;color:#000;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;">Available</td>';
    const s=students.find(x=>x.name===name||x.name.startsWith(name));
    const c=s?s.c1:'#3B82F6';
    return '<td style="background:'+c+';color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;cursor:pointer;" onclick="'+(s?'nav(\\'students\\',document.querySelectorAll(\\'.nav-item\\')[1])':'')+'">'+name+'</td>';
  }`;

const newCell = `  function cell(name){
    if(!name)return '<td style="background:#FECACA;color:#991B1B;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;">Close</td>';
    if(name==='Avail')return '<td style="background:#FEF08A;color:#713F12;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;">Available</td>';
    const s=students.find(x=>x.name===name||x.name.startsWith(name));
    const flag=s?(s.nat.includes('Korean')?'🇰🇷':'🇨🇳'):'';
    const bg=s?(s.nat.includes('Korean')?'#E0E7FF':'#DCFCE7'):'#DBEAFE';
    const color=s?(s.nat.includes('Korean')?'#3730A3':'#166534'):'#1D4ED8';
    const onclick=s?'openStudentProfile('+s.id+')':'';
    return '<td style="background:'+bg+';color:'+color+';text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;cursor:pointer;" onclick="'+onclick+'">'+flag+' '+name+'</td>';
  }`;

h = h.replace(oldCell, newCell);

// Add openStudentProfile function
const profileFn = `function openStudentProfile(id){
  const s=students.find(x=>x.id===id);
  if(!s)return;
  nav('students',document.querySelectorAll('.nav-item')[1]);
  setTimeout(()=>{openSchedule(id);},300);
}\n`;

h = h.replace('function isUpcoming', profileFn + 'function isUpcoming');

fs.writeFileSync('index.html', h, 'utf8');
console.log('cell fixed:', h.includes('FECACA'));
console.log('profile:', h.includes('openStudentProfile'));