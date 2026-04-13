const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const autoSave = `
// ─── AUTO SAVE ───
function saveData(){
  localStorage.setItem('ts-students', JSON.stringify(students));
  localStorage.setItem('ts-save-time', new Date().toISOString());
}
function showSaveIndicator(){
  let el = document.getElementById('save-indicator');
  if(!el){
    el = document.createElement('div');
    el.id = 'save-indicator';
    el.style = 'position:fixed;bottom:16px;right:16px;background:#22C55E;color:#fff;padding:8px 16px;border-radius:8px;font-size:0.8rem;font-weight:700;z-index:9999;opacity:0;transition:opacity 0.3s;';
    document.body.appendChild(el);
  }
  el.textContent = '✅ Saved ' + new Date().toLocaleTimeString();
  el.style.opacity = '1';
  setTimeout(()=>el.style.opacity='0', 2000);
}
function saveData(){
  localStorage.setItem('ts-students', JSON.stringify(students));
  localStorage.setItem('ts-save-time', new Date().toISOString());
  showSaveIndicator();
}
setInterval(()=>{ saveData(); }, 30000);
`;

// Replace old saveData with new auto-save version
h = h.replace('function saveData(){localStorage.setItem(\'ts-students\',JSON.stringify(students));}', autoSave);

fs.writeFileSync('index.html', h, 'utf8');
console.log('autosave:', h.includes('AUTO SAVE'));
console.log('indicator:', h.includes('save-indicator'));