const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// ─── NEW PAYMENTS PAGE ───
const newPaymentsPage = `id="page-payments">
  <div class="page-header">
    <div><div class="page-title">💰 Payments</div><div class="page-sub">Track student payments</div></div>
    <button class="btn btn-primary" onclick="openAddPaymentModal()">+ Add Payment</button>
  </div>

  <!-- Filters -->
  <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;">
    <select id="pay-filter-status" onchange="renderPayments()" style="padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.85rem;background:#fff;cursor:pointer;">
      <option value="all">All</option>
      <option value="paid">Paid</option>
      <option value="unpaid">Not Paid</option>
    </select>
    <select id="pay-filter-month" onchange="renderPayments()" style="padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.85rem;background:#fff;cursor:pointer;">
      <option value="all">All Months</option>
      <option value="0">January</option>
      <option value="1">February</option>
      <option value="2">March</option>
      <option value="3">April</option>
      <option value="4">May</option>
      <option value="5">June</option>
      <option value="6">July</option>
      <option value="7">August</option>
      <option value="8">September</option>
      <option value="9">October</option>
      <option value="10">November</option>
      <option value="11">December</option>
    </select>
  </div>

  <!-- Payment List -->
  <div class="card">
    <div id="payment-list"></div>
  </div>

  <!-- PDF Upload -->
  <div style="background:#fff;border-radius:12px;padding:14px 18px;margin-top:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
    <div>
      <div style="font-weight:700;font-size:0.9rem;">📄 Monthly Payment Report</div>
      <div style="font-size:0.78rem;color:#9CA3AF;">Upload a PDF to keep on record</div>
    </div>
    <label style="padding:8px 16px;background:#F5F3FF;color:#A855F7;border:1.5px solid #A855F7;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.85rem;">
      📤 Upload PDF
      <input type="file" accept="application/pdf" onchange="handlePDFUpload(this)" style="display:none;">
    </label>
  </div>

  <!-- PDF Viewer -->
  <div id="pdf-viewer-section" style="display:none;background:#fff;border-radius:12px;padding:14px 18px;margin-top:12px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <div style="font-weight:700;font-size:0.9rem;">📄 Uploaded Report</div>
      <button onclick="clearPDF()" style="background:#FEE2E2;color:#EF4444;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:600;">Remove</button>
    </div>
    <iframe id="pdf-frame" style="width:100%;height:500px;border:none;border-radius:8px;"></iframe>
  </div>
</div>`;

// ─── NEW EARNINGS PAGE ───
const newEarningsPage = `id="page-earnings">
  <div class="page-header">
    <div><div class="page-title">📊 Earnings</div><div class="page-sub">Simple income summary</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:500px;">
    <div class="stat" style="padding:24px;">
      <div class="stat-icon" style="background:linear-gradient(135deg,#F3E8FF,#DDD6FE)">💰</div>
      <div class="stat-val" style="color:var(--purple)" id="earn-this-month">₱0</div>
      <div class="stat-label">Total Earned This Month</div>
    </div>
    <div class="stat" style="padding:24px;">
      <div class="stat-icon" style="background:linear-gradient(135deg,#FFF1F2,#FECDD3)">⚠️</div>
      <div class="stat-val" style="color:var(--red)" id="earn-unpaid">₱0</div>
      <div class="stat-label">Total Unpaid Amount</div>
    </div>
  </div>
</div>`;

// ─── ADD PAYMENT MODAL ───
const addPaymentModal = `
<!-- Add Payment Modal -->
<div id="addPaymentModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:420px;width:92%;box-shadow:0 8px 32px rgba(0,0,0,0.18);position:relative;max-height:90vh;overflow-y:auto;">
    <button onclick="closeAddPaymentModal()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#888;">&times;</button>
    <h2 style="margin:0 0 20px;font-size:1.1rem;color:#374151;">+ Add Payment Record</h2>

    <div style="margin-bottom:14px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Student</label>
      <select id="pay-student-select" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;"></select>
    </div>

    <div style="margin-bottom:14px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Amount Paid (₱)</label>
      <input id="pay-amount" type="number" placeholder="e.g. 3000" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">
    </div>

    <div style="margin-bottom:14px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Date Paid</label>
      <input id="pay-date" type="date" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">
    </div>

    <div style="margin-bottom:14px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Class Package</label>
      <select id="pay-package" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">
        <option value="10">10 classes</option>
        <option value="20">20 classes</option>
        <option value="25">25 classes</option>
        <option value="27">27 classes</option>
        <option value="30">30 classes</option>
        <option value="32">32 classes</option>
        <option value="50">50 classes</option>
        <option value="52">52 classes</option>
      </select>
    </div>

    <div style="margin-bottom:14px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Classes Used</label>
      <input id="pay-classes-used" type="number" placeholder="e.g. 4" min="0" style="width:100%;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.9rem;box-sizing:border-box;">
    </div>

    <div style="margin-bottom:20px;">
      <label style="font-size:0.82rem;font-weight:600;color:#6B7280;display:block;margin-bottom:6px;">Payment Status</label>
      <div style="display:flex;gap:10px;">
        <label style="flex:1;display:flex;align-items:center;gap:8px;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;cursor:pointer;">
          <input type="radio" name="pay-status" value="paid" checked> <span style="font-weight:600;color:#22C55E;">✅ Paid</span>
        </label>
        <label style="flex:1;display:flex;align-items:center;gap:8px;padding:10px 14px;border:1.5px solid #e5e7eb;border-radius:10px;cursor:pointer;">
          <input type="radio" name="pay-status" value="unpaid"> <span style="font-weight:600;color:#EF4444;">❌ Not Paid</span>
        </label>
      </div>
    </div>

    <button onclick="savePayment()" style="width:100%;padding:12px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;">💾 Save Payment</button>
  </div>
</div>

<!-- Payment Detail Modal -->
<div id="paymentDetailModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:16px;padding:0;max-width:440px;width:92%;max-height:85vh;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.2);display:flex;flex-direction:column;">
    <div style="padding:20px 24px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;position:relative;">
      <button onclick="closePaymentDetail()" style="position:absolute;top:12px;right:16px;background:rgba(255,255,255,0.2);border:none;font-size:18px;cursor:pointer;color:#fff;width:30px;height:30px;border-radius:50%;">&times;</button>
      <div id="pay-detail-name" style="font-size:1.2rem;font-weight:800;"></div>
      <div id="pay-detail-sub" style="font-size:0.85rem;opacity:0.85;margin-top:4px;"></div>
    </div>
    <div style="padding:20px 24px;overflow-y:auto;flex:1;">
      <div style="font-weight:700;font-size:0.95rem;color:#374151;margin-bottom:12px;">📋 Payment History</div>
      <div id="pay-detail-history"></div>
    </div>
  </div>
</div>
`;

// ─── PAYMENT JS ───
const paymentJS = `
<script>
function getPayments(){return JSON.parse(localStorage.getItem('ts-payments')||'[]');}
function savePayments(p){localStorage.setItem('ts-payments',JSON.stringify(p));}

function renderPayments(){
  var payments=getPayments();
  var students=JSON.parse(localStorage.getItem('ts-students')||'[]');
  var sf=document.getElementById('pay-filter-status');
  var mf=document.getElementById('pay-filter-month');
  var statusFilter=sf?sf.value:'all';
  var monthFilter=mf?mf.value:'all';

  var filtered=payments.slice();
  if(statusFilter!=='all') filtered=filtered.filter(function(p){return p.status===statusFilter;});
  if(monthFilter!=='all') filtered=filtered.filter(function(p){
    if(!p.date) return false;
    return new Date(p.date).getMonth()===parseInt(monthFilter);
  });

  var list=document.getElementById('payment-list');
  if(!list) return;

  if(filtered.length===0){
    list.innerHTML='<div style="text-align:center;color:#9CA3AF;padding:40px 0;font-size:0.9rem;">No payment records yet.<br>Click "+ Add Payment" to get started.</div>';
  } else {
    list.innerHTML=filtered.map(function(p){
      var s=students.find(function(x){return x.name===p.studentName;});
      var isPaid=p.status==='paid';
      var used=p.classesUsed||0;
      var pkg=p.package||0;
      return '<div onclick="openPaymentDetail('+p.id+')" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f3f4f6;cursor:pointer;border-left:4px solid '+(isPaid?'#22C55E':'#EF4444')+';gap:10px;flex-wrap:wrap;">'+
        '<div style="display:flex;align-items:center;gap:10px;flex:1;">'+
          '<div style="font-size:1.4rem;">'+(s?s.avatar:'👤')+'</div>'+
          '<div>'+
            '<div style="font-weight:700;font-size:0.9rem;">'+p.studentName+'</div>'+
            '<div style="font-size:0.75rem;color:#9CA3AF;">'+(p.date||'No date')+'</div>'+
          '</div>'+
        '</div>'+
        '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">'+
          '<div style="text-align:center;"><div style="font-weight:700;color:#A855F7;font-size:0.9rem;">₱'+parseFloat(p.amount||0).toLocaleString()+'</div><div style="font-size:0.7rem;color:#9CA3AF;">Amount</div></div>'+
          '<div style="text-align:center;"><div style="font-weight:700;font-size:0.9rem;">'+pkg+' cls</div><div style="font-size:0.7rem;color:#9CA3AF;">Package</div></div>'+
          '<div style="text-align:center;"><div style="font-weight:700;font-size:0.9rem;">'+used+'/'+pkg+'</div><div style="font-size:0.7rem;color:#9CA3AF;">Progress</div></div>'+
          '<span style="background:'+(isPaid?'#DCFCE7':'#FEE2E2')+';color:'+(isPaid?'#15803D':'#DC2626')+';padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">'+(isPaid?'✅ Paid':'❌ Not Paid')+'</span>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  // Update earnings tab
  renderEarnings();
}

function renderEarnings(){
  var payments=getPayments();
  var now=new Date();
  var thisMonth=payments.filter(function(p){
    if(!p.date||p.status!=='paid') return false;
    var d=new Date(p.date);
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  });
  var totalEarned=thisMonth.reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);
  var totalUnpaid=payments.filter(function(p){return p.status==='unpaid';})
    .reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);
  var em=document.getElementById('earn-this-month');
  var eu=document.getElementById('earn-unpaid');
  if(em) em.textContent='₱'+totalEarned.toLocaleString();
  if(eu) eu.textContent='₱'+totalUnpaid.toLocaleString();
}

function openAddPaymentModal(){
  var students=JSON.parse(localStorage.getItem('ts-students')||'[]');
  var sel=document.getElementById('pay-student-select');
  if(sel) sel.innerHTML=students.map(function(s){return '<option value="'+s.name+'">'+(s.avatar||'👤')+' '+s.name+'</option>';}).join('');
  var di=document.getElementById('pay-date');
  if(di) di.value=new Date().toISOString().split('T')[0];
  document.getElementById('addPaymentModal').style.display='flex';
}

function closeAddPaymentModal(){
  document.getElementById('addPaymentModal').style.display='none';
}

function savePayment(){
  var sn=document.getElementById('pay-student-select').value;
  var amt=document.getElementById('pay-amount').value;
  var dt=document.getElementById('pay-date').value;
  var pkg=document.getElementById('pay-package').value;
  var used=document.getElementById('pay-classes-used').value||0;
  var status=document.querySelector('input[name="pay-status"]:checked').value;
  if(!sn||!amt){alert('Please fill in student and amount.');return;}
  var payments=getPayments();
  payments.unshift({id:Date.now(),studentName:sn,amount:parseFloat(amt),date:dt,package:parseInt(pkg),classesUsed:parseInt(used),status:status});
  savePayments(payments);
  closeAddPaymentModal();
  renderPayments();
}

function openPaymentDetail(id){
  var payments=getPayments();
  var record=payments.find(function(p){return p.id===id;});
  if(!record) return;
  var all=payments.filter(function(p){return p.studentName===record.studentName;});
  var students=JSON.parse(localStorage.getItem('ts-students')||'[]');
  var s=students.find(function(x){return x.name===record.studentName;});
  document.getElementById('pay-detail-name').textContent=(s?s.avatar+' ':'')+record.studentName;
  document.getElementById('pay-detail-sub').textContent=s?(s.classes+' classes left of '+s.total):'';
  var hist=document.getElementById('pay-detail-history');
  hist.innerHTML=all.map(function(p){
    var isPaid=p.status==='paid';
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;margin-bottom:8px;background:'+(isPaid?'#F0FDF4':'#FEF2F2')+';border-radius:10px;border-left:4px solid '+(isPaid?'#22C55E':'#EF4444')+';">'+
      '<div><div style="font-weight:600;font-size:0.9rem;">'+(p.date||'No date')+'</div><div style="font-size:0.78rem;color:#6B7280;">'+p.package+' classes · '+p.classesUsed+' used</div></div>'+
      '<div style="text-align:right;"><div style="font-weight:700;color:#A855F7;">₱'+parseFloat(p.amount||0).toLocaleString()+'</div><span style="background:'+(isPaid?'#DCFCE7':'#FEE2E2')+';color:'+(isPaid?'#15803D':'#DC2626')+';padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;">'+(isPaid?'Paid':'Not Paid')+'</span></div>'+
    '</div>';
  }).join('');
  document.getElementById('paymentDetailModal').style.display='flex';
}

function closePaymentDetail(){document.getElementById('paymentDetailModal').style.display='none';}

function handlePDFUpload(input){
  var file=input.files[0];
  if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    localStorage.setItem('ts-pdf-report',e.target.result);
    showPDF(e.target.result);
  };
  reader.readAsDataURL(file);
}

function showPDF(data){
  var s=document.getElementById('pdf-viewer-section');
  var f=document.getElementById('pdf-frame');
  if(s&&f){f.src=data;s.style.display='block';}
}

function clearPDF(){
  localStorage.removeItem('ts-pdf-report');
  document.getElementById('pdf-viewer-section').style.display='none';
  document.getElementById('pdf-frame').src='';
}

document.getElementById('addPaymentModal').addEventListener('click',function(e){if(e.target===this)closeAddPaymentModal();});
document.getElementById('paymentDetailModal').addEventListener('click',function(e){if(e.target===this)closePaymentDetail();});
</script>
`;

// Replace payments page
const paymentsStart = html.indexOf('id="page-payments"');
const paymentsEnd = html.indexOf('<!-- ─── EARNINGS ─── -->');
if(paymentsStart === -1 || paymentsEnd === -1){
  console.log('ERROR: Could not find payments or earnings boundary');
  process.exit(1);
}
html = html.substring(0, paymentsStart) + newPaymentsPage + '\n\n<!-- ─── EARNINGS ─── -->\n<div class="page" ' + html.substring(paymentsEnd + '<!-- ─── EARNINGS ─── -->'.length);

// Replace earnings page content
const earningsStart = html.indexOf('id="page-earnings"');
const earningsEnd = html.indexOf('<!-- ─── MATERIALS ─── -->', earningsStart);
if(earningsStart === -1){
  console.log('ERROR: Could not find earnings page');
  process.exit(1);
}
html = html.substring(0, earningsStart) + newEarningsPage + '\n\n' + html.substring(earningsEnd);

// Remove old payment modal if exists
if(html.includes('id="addPaymentModal"')){
  console.log('⚠ Old payment modal found — removing...');
  const oldModalStart = html.indexOf('<!-- Add Payment Modal -->');
  const oldModalEnd = html.indexOf('</div>\n</div>\n\n<!-- Payment Detail Modal -->', oldModalStart);
  if(oldModalStart !== -1 && oldModalEnd !== -1){
    html = html.substring(0, oldModalStart) + html.substring(oldModalEnd + '</div>\n</div>\n\n<!-- Payment Detail Modal -->'.length);
  }
}

// Add modals and JS before </body>
html = html.replace('</body>', addPaymentModal + '\n' + paymentJS + '\n</body>');

// Fix nav handler
if(!html.includes("if(page==='earnings')renderEarnings();")){
  html = html.replace(
    "if(page==='profile')loadProfile();",
    "if(page==='profile')loadProfile();\n  if(page==='payments'){renderPayments();var pdf=localStorage.getItem('ts-pdf-report');if(pdf)showPDF(pdf);}\n  if(page==='earnings')renderEarnings();"
  );
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Payments page replaced');
console.log('✓ Earnings page replaced');
console.log('✓ Payment modals and JS added');
console.log('\ndone: true');
