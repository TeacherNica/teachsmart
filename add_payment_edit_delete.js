const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
const out = [];
let i = 0;
let fixes = { pdfUpload: false, pdfViewer: false, renderPayments: false, editModal: false };

while (i < lines.length) {
  const trimmed = lines[i].trim();

  // FIX 1: Remove PDF Upload section from Payments tab (lines ~554-564)
  if (trimmed === '<!-- PDF Upload -->' && !fixes.pdfUpload) {
    console.log('✅ Removing PDF Upload section at line ' + (i+1));
    i++; // skip comment
    let depth = 0, started = false;
    while (i < lines.length) {
      const t = lines[i].trim();
      depth += (t.match(/<div/g)||[]).length - (t.match(/<\/div>/g)||[]).length;
      // label tag counts too
      if (t.includes('<label')) depth++;
      if (t.includes('</label>') || t.includes('</label')) depth--;
      if (!started && (t.includes('<div') || t.includes('<label'))) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    fixes.pdfUpload = true;
    continue;
  }

  // FIX 2: Remove PDF Viewer section from Payments tab (lines ~566-573)
  if (trimmed === '<!-- PDF Viewer -->' && !fixes.pdfViewer) {
    console.log('✅ Removing PDF Viewer section at line ' + (i+1));
    i++;
    let depth = 0, started = false;
    while (i < lines.length) {
      const t = lines[i].trim();
      depth += (t.match(/<div/g)||[]).length - (t.match(/<\/div>/g)||[]).length;
      if (!started && t.includes('<div')) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    fixes.pdfViewer = true;
    continue;
  }

  // FIX 3: Replace the second renderPayments function with edit/delete version
  if (trimmed === 'function renderPayments(){' && !fixes.renderPayments) {
    // Check it's the real one by peeking for 'getPayments'
    let peek = '';
    for (let k = i; k < Math.min(i+5, lines.length); k++) peek += lines[k];
    if (peek.includes('getPayments')) {
      console.log('✅ Replacing real renderPayments at line ' + (i+1));
      // Skip old function
      let depth = 0, started = false;
      while (i < lines.length) {
        const t = lines[i].trim();
        depth += (t.match(/\{/g)||[]).length - (t.match(/\}/g)||[]).length;
        if (!started && t.includes('{')) started = true;
        i++;
        if (started && depth <= 0) break;
      }
      // Inject new renderPayments with edit/delete buttons
      out.push('function renderPayments(){');
      out.push('  var payments=getPayments();');
      out.push('  var students=JSON.parse(localStorage.getItem(\'ts-students\')||\'[]\');');
      out.push('  var sf=document.getElementById(\'pay-filter-status\');');
      out.push('  var mf=document.getElementById(\'pay-filter-month\');');
      out.push('  var statusFilter=sf?sf.value:\'all\';');
      out.push('  var monthFilter=mf?mf.value:\'all\';');
      out.push('  var filtered=payments.slice();');
      out.push('  if(statusFilter!==\'all\') filtered=filtered.filter(function(p){return p.status===statusFilter;});');
      out.push('  if(monthFilter!==\'all\') filtered=filtered.filter(function(p){');
      out.push('    if(!p.date) return false;');
      out.push('    return new Date(p.date).getMonth()===parseInt(monthFilter);');
      out.push('  });');
      out.push('  var list=document.getElementById(\'payment-list\');');
      out.push('  if(!list) return;');
      out.push('  if(filtered.length===0){');
      out.push('    list.innerHTML=\'<div style="text-align:center;color:#9CA3AF;padding:40px 0;font-size:0.9rem;">No payment records yet.<br>Click "+ Add Payment" to get started.</div>\';');
      out.push('    return;');
      out.push('  }');
      out.push('  list.innerHTML=filtered.map(function(p){');
      out.push('    var s=students.find(function(x){return x.name===p.studentName;});');
      out.push('    var isPaid=p.status===\'paid\';');
      out.push('    var pkg=p.package||0;');
      out.push('    var used=p.classesUsed||0;');
      out.push('    return \'<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f3f4f6;border-left:4px solid \'+(isPaid?\'#22C55E\':\'#EF4444\')+\';gap:10px;flex-wrap:wrap;">\'');
      out.push('      +\'<div style="display:flex;align-items:center;gap:10px;flex:1;">\'');
      out.push('        +\'<div style="font-size:1.4rem;">\'+(s?s.avatar:\'👤\')+\'</div>\'');
      out.push('        +\'<div>\'');
      out.push('          +\'<div style="font-weight:700;font-size:0.9rem;">\'+p.studentName+\'</div>\'');
      out.push('          +\'<div style="font-size:0.75rem;color:#9CA3AF;">\'+(p.date||\'No date\')+(p.notes?\'  ·  \'+p.notes:\'\')+\'</div>\'');
      out.push('        +\'</div>\'');
      out.push('      +\'</div>\'');
      out.push('      +\'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">\'');
      out.push('        +\'<div style="text-align:center;"><div style="font-weight:700;color:#A855F7;font-size:0.9rem;">₱\'+parseFloat(p.amount||0).toLocaleString()+\'</div><div style="font-size:0.7rem;color:#9CA3AF;">Amount</div></div>\'');
      out.push('        +\'<div style="text-align:center;"><div style="font-weight:700;font-size:0.9rem;">\'+pkg+\' cls</div><div style="font-size:0.7rem;color:#9CA3AF;">Package</div></div>\'');
      out.push('        +\'<span style="background:\'+(isPaid?\'#DCFCE7\':\'#FEE2E2\')+\';color:\'+(isPaid?\'#15803D\':\'#DC2626\')+\';padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">\'+(isPaid?\'✅ Paid\':\'❌ Not Paid\')+\'</span>\'');
      out.push('        +\'<button onclick="editPayment(\'+p.id+\')" style="padding:5px 12px;border-radius:8px;border:none;background:#EFF6FF;color:#1D4ED8;font-weight:700;font-size:11px;cursor:pointer;">✏️ Edit</button>\'');
      out.push('        +\'<button onclick="deletePayment(\'+p.id+\')" style="padding:5px 12px;border-radius:8px;border:none;background:#FEE2E2;color:#EF4444;font-weight:700;font-size:11px;cursor:pointer;">🗑️ Delete</button>\'');
      out.push('      +\'</div>\'');
      out.push('    +\'</div>\';');
      out.push('  }).join(\'\');');
      out.push('}');
      fixes.renderPayments = true;
      continue;
    }
  }

  // FIX 4: Inject edit modal + edit/delete functions before </body>
  if (trimmed === '</body>' && !fixes.editModal) {
    // Inject edit payment modal
    out.push('');
    out.push('<!-- Edit Payment Modal -->');
    out.push('<div id="editPaymentModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">');
    out.push('  <div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:420px;width:92%;box-shadow:0 8px 32px rgba(0,0,0,0.18);position:relative;">');
    out.push('    <button onclick="closeEditPaymentModal()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#888;">&times;</button>');
    out.push('    <h2 style="margin:0 0 20px;font-size:1.1rem;color:#374151;">✏️ Edit Payment</h2>');
    out.push('    <input type="hidden" id="edit-pay-id">');
    out.push('    <div style="margin-bottom:14px;">');
    out.push('      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Student</label>');
    out.push('      <input id="edit-pay-student" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;background:#F9FAFB;" readonly>');
    out.push('    </div>');
    out.push('    <div style="margin-bottom:14px;">');
    out.push('      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Amount (₱)</label>');
    out.push('      <input id="edit-pay-amount" type="number" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('    </div>');
    out.push('    <div style="margin-bottom:14px;">');
    out.push('      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Date</label>');
    out.push('      <input id="edit-pay-date" type="date" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('    </div>');
    out.push('    <div style="margin-bottom:14px;">');
    out.push('      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Status</label>');
    out.push('      <select id="edit-pay-status" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('        <option value="paid">✅ Paid</option>');
    out.push('        <option value="unpaid">❌ Not Paid</option>');
    out.push('      </select>');
    out.push('    </div>');
    out.push('    <div style="margin-bottom:20px;">');
    out.push('      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Notes</label>');
    out.push('      <input id="edit-pay-notes" type="text" placeholder="e.g. Package 3, April renewal..." style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">');
    out.push('    </div>');
    out.push('    <button onclick="saveEditedPayment()" style="width:100%;padding:12px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;">💾 Save Changes</button>');
    out.push('  </div>');
    out.push('</div>');
    out.push('');
    out.push('<script>');
    out.push('function editPayment(id){');
    out.push('  var payments=getPayments();');
    out.push('  var p=payments.find(function(x){return String(x.id)===String(id);});');
    out.push('  if(!p) return;');
    out.push('  document.getElementById(\'edit-pay-id\').value=p.id;');
    out.push('  document.getElementById(\'edit-pay-student\').value=p.studentName;');
    out.push('  document.getElementById(\'edit-pay-amount\').value=p.amount||0;');
    out.push('  document.getElementById(\'edit-pay-date\').value=p.date||\'\'  ;');
    out.push('  document.getElementById(\'edit-pay-status\').value=p.status||\'unpaid\';');
    out.push('  document.getElementById(\'edit-pay-notes\').value=p.notes||\'\';');
    out.push('  document.getElementById(\'editPaymentModal\').style.display=\'flex\';');
    out.push('}');
    out.push('function closeEditPaymentModal(){');
    out.push('  document.getElementById(\'editPaymentModal\').style.display=\'none\';');
    out.push('}');
    out.push('function saveEditedPayment(){');
    out.push('  var id=document.getElementById(\'edit-pay-id\').value;');
    out.push('  var payments=getPayments();');
    out.push('  var idx=payments.findIndex(function(x){return String(x.id)===String(id);});');
    out.push('  if(idx===-1){alert(\'Payment not found.\');return;}');
    out.push('  payments[idx].amount=parseFloat(document.getElementById(\'edit-pay-amount\').value)||0;');
    out.push('  payments[idx].date=document.getElementById(\'edit-pay-date\').value;');
    out.push('  payments[idx].status=document.getElementById(\'edit-pay-status\').value;');
    out.push('  payments[idx].notes=document.getElementById(\'edit-pay-notes\').value;');
    out.push('  savePayments(payments);');
    out.push('  closeEditPaymentModal();');
    out.push('  renderPayments();');
    out.push('  renderEarnings();');
    out.push('  alert(\'✅ Payment updated!\');');
    out.push('}');
    out.push('function deletePayment(id){');
    out.push('  if(!confirm(\'Are you sure you want to delete this payment? This cannot be undone.\')) return;');
    out.push('  var payments=getPayments().filter(function(x){return String(x.id)!==String(id);});');
    out.push('  savePayments(payments);');
    out.push('  renderPayments();');
    out.push('  renderEarnings();');
    out.push('}');
    out.push('document.getElementById(\'editPaymentModal\').addEventListener(\'click\',function(e){if(e.target===this)closeEditPaymentModal();});');
    out.push('</script>');
    out.push('');
    fixes.editModal = true;
  }

  out.push(lines[i]);
  i++;
}

const result = out.join('\r\n');

console.log('\n📊 PDF Upload section removed: ' + fixes.pdfUpload);
console.log('📊 PDF Viewer section removed: ' + fixes.pdfViewer);
console.log('📊 renderPayments replaced: ' + fixes.renderPayments);
console.log('📊 Edit modal injected: ' + fixes.editModal);
console.log('📊 editPayment function present: ' + result.includes('function editPayment'));
console.log('📊 deletePayment function present: ' + result.includes('function deletePayment'));

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
