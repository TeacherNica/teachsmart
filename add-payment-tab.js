const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// ─── PAYMENT PAGE HTML ───
const paymentPage = `
  <!-- PAYMENT PAGE -->
  <div class="page" id="page-payments">
    <div style="max-width:800px;margin:0 auto;padding:24px 16px;">

      <!-- Top Summary -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div style="background:linear-gradient(135deg,#A855F7,#6366F1);border-radius:16px;padding:20px;color:#fff;">
          <div style="font-size:0.78rem;opacity:0.85;margin-bottom:4px;">💰 Total Earned This Month</div>
          <div id="pay-total-earned" style="font-size:1.8rem;font-weight:800;">₱0</div>
        </div>
        <div style="background:linear-gradient(135deg,#EF4444,#F97316);border-radius:16px;padding:20px;color:#fff;">
          <div style="font-size:0.78rem;opacity:0.85;margin-bottom:4px;">⚠️ Total Unpaid</div>
          <div id="pay-total-unpaid" style="font-size:1.8rem;font-weight:800;">₱0</div>
        </div>
      </div>

      <!-- Filters + Add Payment -->
      <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center;">
        <select id="pay-filter-status" onchange="renderPayments()" style="padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.85rem;background:#fff;cursor:pointer;">
          <option value="all">All Students</option>
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
        <button onclick="openAddPaymentModal()" style="padding:8px 16px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:0.85rem;margin-left:auto;">+ Add Payment</button>
      </div>

      <!-- Upload PDF -->
      <div style="background:#fff;border-radius:12px;padding:14px 18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
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
      <div id="pdf-viewer-section" style="display:none;background:#fff;border-radius:12px;padding:14px 18px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="font-weight:700;font-size:0.9rem;">📄 Uploaded Report</div>
          <button onclick="clearPDF()" style="background:#FEE2E2;color:#EF4444;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:0.78rem;font-weight:600;">Remove</button>
        </div>
        <iframe id="pdf-frame" style="width:100%;height:500px;border:none;border-radius:8px;"></iframe>
      </div>

      <!-- Payment List -->
      <div id="payment-list"></div>

    </div>
  </div>

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
      <div id="pay-detail-header" style="padding:20px 24px;background:linear-gradient(135deg,#A855F7,#6366F1);color:#fff;position:relative;">
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

// Insert payment page before schedule-modal
html = html.replace('<div id="schedule-modal"', paymentPage + '\n  <div id="schedule-modal"');
console.log('✓ Payment page HTML added');

// ─── PAYMENT JS ───
const paymentJS = `
<script>
// ─── PAYMENT FUNCTIONS ───
function getPayments() {
  return JSON.parse(localStorage.getItem('ts-payments') || '[]');
}

function savePayments(payments) {
  localStorage.setItem('ts-payments', JSON.stringify(payments));
}

function renderPayments() {
  var payments = getPayments();
  var students = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var statusFilter = document.getElementById('pay-filter-status') ? document.getElementById('pay-filter-status').value : 'all';
  var monthFilter = document.getElementById('pay-filter-month') ? document.getElementById('pay-filter-month').value : 'all';

  // Filter
  var filtered = payments.slice();
  if (statusFilter !== 'all') filtered = filtered.filter(function(p){ return p.status === statusFilter; });
  if (monthFilter !== 'all') filtered = filtered.filter(function(p){
    var d = new Date(p.date);
    return d.getMonth() === parseInt(monthFilter);
  });

  // Summary
  var now = new Date();
  var thisMonth = payments.filter(function(p){
    var d = new Date(p.date);
    return p.status === 'paid' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  var totalEarned = thisMonth.reduce(function(sum, p){ return sum + (parseFloat(p.amount) || 0); }, 0);
  var totalUnpaid = payments.filter(function(p){ return p.status === 'unpaid'; })
    .reduce(function(sum, p){ return sum + (parseFloat(p.amount) || 0); }, 0);

  var earnedEl = document.getElementById('pay-total-earned');
  var unpaidEl = document.getElementById('pay-total-unpaid');
  if (earnedEl) earnedEl.textContent = '₱' + totalEarned.toLocaleString();
  if (unpaidEl) unpaidEl.textContent = '₱' + totalUnpaid.toLocaleString();

  // Render list
  var list = document.getElementById('payment-list');
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:#9CA3AF;padding:40px 0;font-size:0.9rem;">No payment records found.<br>Click "+ Add Payment" to get started.</div>';
    return;
  }

  // Group by student
  var byStudent = {};
  filtered.forEach(function(p) {
    if (!byStudent[p.studentName]) byStudent[p.studentName] = [];
    byStudent[p.studentName].push(p);
  });

  list.innerHTML = Object.keys(byStudent).map(function(name) {
    var records = byStudent[name];
    var latest = records[0];
    var student = students.find(function(s){ return s.name === name; });
    var classesLeft = student ? student.classes : '?';
    var classesTotal = student ? student.total : latest.package;
    var classesUsed = classesTotal - classesLeft;
    var isPaid = latest.status === 'paid';

    return '<div onclick="openPaymentDetail(\'' + name + '\')" style="background:#fff;border-radius:14px;padding:18px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.07);cursor:pointer;border-left:4px solid ' + (isPaid ? '#22C55E' : '#EF4444') + ';">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<div style="font-size:1.6rem;">' + (student ? student.avatar : '👤') + '</div>' +
          '<div>' +
            '<div style="font-weight:700;font-size:0.95rem;">' + name + '</div>' +
            '<div style="font-size:0.78rem;color:#9CA3AF;">' + (latest.date || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<span style="background:' + (isPaid ? '#DCFCE7' : '#FEE2E2') + ';color:' + (isPaid ? '#15803D' : '#DC2626') + ';padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:700;">' + (isPaid ? '✅ Paid' : '❌ Not Paid') + '</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">' +
        '<div style="background:#F5F3FF;border-radius:8px;padding:8px;">' +
          '<div style="font-weight:700;color:#A855F7;">₱' + parseFloat(latest.amount).toLocaleString() + '</div>' +
          '<div style="font-size:0.72rem;color:#9CA3AF;">Amount</div>' +
        '</div>' +
        '<div style="background:#EFF6FF;border-radius:8px;padding:8px;">' +
          '<div style="font-weight:700;color:#3B82F6;">' + latest.package + ' classes</div>' +
          '<div style="font-size:0.72rem;color:#9CA3AF;">Package</div>' +
        '</div>' +
        '<div style="background:#F0FDF4;border-radius:8px;padding:8px;">' +
          '<div style="font-weight:700;color:#22C55E;">' + classesUsed + '/' + classesTotal + '</div>' +
          '<div style="font-size:0.72rem;color:#9CA3AF;">Used</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openAddPaymentModal() {
  var students = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var select = document.getElementById('pay-student-select');
  if (select) {
    select.innerHTML = students.map(function(s){
      return '<option value="' + s.name + '">' + s.avatar + ' ' + s.name + '</option>';
    }).join('');
  }
  // Set today's date
  var dateInput = document.getElementById('pay-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  document.getElementById('addPaymentModal').style.display = 'flex';
}

function closeAddPaymentModal() {
  document.getElementById('addPaymentModal').style.display = 'none';
}

function savePayment() {
  var studentName = document.getElementById('pay-student-select').value;
  var amount = document.getElementById('pay-amount').value;
  var date = document.getElementById('pay-date').value;
  var pkg = document.getElementById('pay-package').value;
  var status = document.querySelector('input[name="pay-status"]:checked').value;

  if (!studentName || !amount || !date) {
    alert('Please fill in all fields.');
    return;
  }

  var payments = getPayments();
  payments.unshift({
    id: Date.now(),
    studentName: studentName,
    amount: parseFloat(amount),
    date: date,
    package: parseInt(pkg),
    status: status
  });
  savePayments(payments);
  closeAddPaymentModal();
  renderPayments();
}

function openPaymentDetail(name) {
  var payments = getPayments().filter(function(p){ return p.studentName === name; });
  var students = JSON.parse(localStorage.getItem('ts-students') || '[]');
  var student = students.find(function(s){ return s.name === name; });

  document.getElementById('pay-detail-name').textContent = (student ? student.avatar + ' ' : '') + name;
  document.getElementById('pay-detail-sub').textContent = student ? (student.classes + ' classes left of ' + student.total) : '';

  var history = document.getElementById('pay-detail-history');
  if (payments.length === 0) {
    history.innerHTML = '<p style="color:#9CA3AF;text-align:center;">No payment records yet.</p>';
  } else {
    history.innerHTML = payments.map(function(p) {
      var isPaid = p.status === 'paid';
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;margin-bottom:8px;background:' + (isPaid ? '#F0FDF4' : '#FEF2F2') + ';border-radius:10px;border-left:4px solid ' + (isPaid ? '#22C55E' : '#EF4444') + ';">' +
        '<div>' +
          '<div style="font-weight:600;font-size:0.9rem;">' + p.date + '</div>' +
          '<div style="font-size:0.78rem;color:#6B7280;">' + p.package + ' classes package</div>' +
        '</div>' +
        '<div style="text-align:right;">' +
          '<div style="font-weight:700;color:#A855F7;">₱' + parseFloat(p.amount).toLocaleString() + '</div>' +
          '<span style="background:' + (isPaid ? '#DCFCE7' : '#FEE2E2') + ';color:' + (isPaid ? '#15803D' : '#DC2626') + ';padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;">' + (isPaid ? 'Paid' : 'Not Paid') + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  document.getElementById('paymentDetailModal').style.display = 'flex';
}

function closePaymentDetail() {
  document.getElementById('paymentDetailModal').style.display = 'none';
}

function handlePDFUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem('ts-pdf-report', e.target.result);
    showPDF(e.target.result);
  };
  reader.readAsDataURL(file);
}

function showPDF(data) {
  var section = document.getElementById('pdf-viewer-section');
  var frame = document.getElementById('pdf-frame');
  if (section && frame) {
    frame.src = data;
    section.style.display = 'block';
  }
}

function clearPDF() {
  localStorage.removeItem('ts-pdf-report');
  document.getElementById('pdf-viewer-section').style.display = 'none';
  document.getElementById('pdf-frame').src = '';
}

// Close modals on backdrop click
document.getElementById('addPaymentModal').addEventListener('click', function(e){
  if (e.target === this) closeAddPaymentModal();
});
document.getElementById('paymentDetailModal').addEventListener('click', function(e){
  if (e.target === this) closePaymentDetail();
});
</script>
`;

html = html.replace('</body>', paymentJS + '\n</body>');
console.log('✓ Payment JS added');

// Fix nav to render payments
html = html.replace(
  "if(page==='profile')loadProfile();",
  "if(page==='profile')loadProfile();\n  if(page==='payments'){renderPayments(); var pdf=localStorage.getItem('ts-pdf-report'); if(pdf){showPDF(pdf);}}"
);
console.log('✓ Nav handler updated for payments');

// Remove old empty payments page if exists
html = html.replace(
  /<div class="page" id="page-payments">[\s\S]*?<\/div>\s*(?=<!-- PAYMENT PAGE -->)/,
  ''
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('\ndone: true — Payment tab built successfully!');
