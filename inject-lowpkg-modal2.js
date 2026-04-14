const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Guard: don't inject twice
if (html.indexOf('openLowPkgModal') !== html.lastIndexOf('openLowPkgModal')) {
  console.log('Modal function already injected. No changes made.');
  console.log('done: true');
  process.exit(0);
}

const modalCode = `
<!-- Low Package Modal -->
<div id="lowPkgModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:420px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.18);position:relative;">
    <button onclick="closeLowPkgModal()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#888;">&times;</button>
    <h2 style="margin:0 0 6px;font-size:1.2rem;color:#e74c3c;">&#9888; Low Package Students</h2>
    <p style="margin:0 0 16px;font-size:0.85rem;color:#666;">Students with 3 or fewer classes remaining. Tap a name to copy a WeChat reminder.</p>
    <div id="lowPkgList" style="max-height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;"></div>
    <div id="lowPkgCopyMsg" style="display:none;margin-top:14px;padding:10px 14px;background:#f0fff4;border:1px solid #a8e6b8;border-radius:8px;font-size:0.85rem;color:#2d6a4f;word-break:break-word;"></div>
  </div>
</div>

<script>
function openLowPkgModal() {
  var allStudents = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var low = allStudents.filter(function(s) { return (s.classes || 0) <= 3; });
  var list = document.getElementById('lowPkgList');
  var copyMsg = document.getElementById('lowPkgCopyMsg');
  copyMsg.style.display = 'none';
  list.innerHTML = '';

  if (low.length === 0) {
    list.innerHTML = '<p style="color:#888;text-align:center;margin:0;">No students are low on packages right now!</p>';
  } else {
    low.forEach(function(s) {
      var card = document.createElement('div');
      card.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:#fff8f0;border:1px solid #f5cba7;border-radius:10px;cursor:pointer;';
      card.title = 'Tap to copy WeChat reminder';
      card.innerHTML = '<span style="font-weight:600;font-size:0.95rem;">' + s.name + '</span><span style="font-size:0.85rem;color:#e67e22;">' + (s.classes || 0) + ' class' + ((s.classes || 0) === 1 ? '' : 'es') + ' left</span>';
      card.addEventListener('click', function() {
        var msg = 'Hi! Just a friendly reminder that ' + s.name + ' only has ' + (s.classes || 0) + ' class(es) remaining in their package. Please renew soon so we can keep the learning going! Thank you \uD83D\uDE0A';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(msg).then(function() {
            copyMsg.textContent = '\u2705 Copied! "' + msg + '"';
            copyMsg.style.display = 'block';
          });
        } else {
          copyMsg.textContent = msg;
          copyMsg.style.display = 'block';
        }
      });
      list.appendChild(card);
    });
  }

  var modal = document.getElementById('lowPkgModal');
  modal.style.display = 'flex';
}

function closeLowPkgModal() {
  document.getElementById('lowPkgModal').style.display = 'none';
}

document.getElementById('lowPkgModal').addEventListener('click', function(e) {
  if (e.target === this) closeLowPkgModal();
});
</script>
`;

// Inject before </body>
html = html.replace('</body>', modalCode + '\n</body>');
fs.writeFileSync(indexPath, html, 'utf8');
console.log('done: true — Low Package modal function injected successfully.');
