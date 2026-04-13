const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const SCRIPT = `<script>
function openLowPkgModal(){
  var low=students.filter(function(s){return s.classes<=2;});
  if(low.length===0){alert('No students have low packages right now!');return;}
  var content='<div style="font-family:Quicksand,sans-serif;padding:20px;max-width:580px;margin:0 auto;">';
  content+='<h2 style="font-family:Nunito,sans-serif;margin-bottom:4px;">Low Package Reminders</h2>';
  content+='<p style="color:#6B7280;font-size:13px;margin-bottom:20px;">Edit the message then copy to WeChat</p>';
  low.forEach(function(s){
    var msg="Dear Parent,\\n\\nI hope this message finds you well!\\n\\nJust a friendly reminder that "+s.name+" has only "+s.classes+" class"+(s.classes!==1?"es":"")+" remaining in their current package.\\n\\nTo ensure there is no interruption to their learning, I kindly ask if you would like to continue. If so, please let me know at your earliest convenience so I can prepare the payment QR code in advance.\\n\\nLooking forward to hearing from you!\\n\\nWith warm regards,\\nTeacher Nica\\nTeachSmart English";
    content+='<div style="background:#F9FAFB;border-radius:12px;padding:16px;margin-bottom:16px;">';
    content+='<div style="font-weight:700;font-size:15px;margin-bottom:8px;color:#1E1B4B;">'+s.name+' <span style="background:#FFF1F2;color:#BE123C;padding:2px 8px;border-radius:20px;font-size:11px;">'+s.classes+' left</span></div>';
    content+='<textarea id="lpMsg'+s.id+'" style="width:100%;padding:12px;border:2px solid #E5E7EB;border-radius:10px;font-family:Quicksand,sans-serif;font-size:12px;line-height:1.7;resize:vertical;min-height:180px;box-sizing:border-box;">'+msg+'</textarea>';
    content+='<button onclick="var t=document.getElementById(\'lpMsg'+s.id+'\');t.select();document.execCommand(\'copy\');this.textContent=\'Copied!\';" style="margin-top:8px;padding:7px 16px;border-radius:8px;border:none;background:linear-gradient(135deg,#A855F7,#3B82F6);color:white;font-family:Quicksand,sans-serif;font-weight:700;font-size:12px;cursor:pointer;">Copy for '+s.name+'</button>';
    content+='</div>';
  });
  content+='<button onclick="document.getElementById(\'lowPkgWin\').style.display=\'none\';" style="width:100%;padding:10px;border-radius:10px;border:2px solid #E5E7EB;background:white;font-family:Quicksand,sans-serif;font-weight:700;font-size:13px;cursor:pointer;color:#6B7280;">Close</button></div>';
  var win=document.getElementById('lowPkgWin');
  if(!win){win=document.createElement('div');win.id='lowPkgWin';win.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';win.innerHTML='<div style="background:white;border-radius:22px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.2);" id="lowPkgInner"></div>';document.body.appendChild(win);win.addEventListener('click',function(e){if(e.target===win)win.style.display='none';});}
  document.getElementById('lowPkgInner').innerHTML=content;
  win.style.display='flex';
}
</script>`;

html = html.replace('</body>', SCRIPT + '\n</body>');
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true');
