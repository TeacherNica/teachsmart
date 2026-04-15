const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
const out = [];
let i = 0;
let fixes = { grid: false, pdfFunc: false };

while (i < lines.length) {
  const l = lines[i];

  // FIX 1: Replace the old 2-stat grid inside page-earnings
  // Detect by the unique max-width:500px style
  if (l.includes('display:grid') && l.includes('1fr 1fr') && l.includes('max-width:500px') && !fixes.grid) {
    console.log('✅ Found old 2-stat grid at line ' + (i+1) + ', replacing...');
    // Skip until the closing </div> of this grid (depth tracking)
    let depth = 0, started = false;
    while (i < lines.length) {
      const t = lines[i].trim();
      depth += (t.match(/<div/g)||[]).length - (t.match(/<\/div>/g)||[]).length;
      if (!started && t.includes('<div')) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    // Inject new 3-stat grid + monthly breakdown
    out.push('  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">');
    out.push('    <div class="stat" style="padding:24px;">');
    out.push('      <div class="stat-icon" style="background:linear-gradient(135deg,#F3E8FF,#DDD6FE)">💰</div>');
    out.push('      <div class="stat-val" style="color:var(--purple)" id="earn-this-month">₱0</div>');
    out.push('      <div class="stat-label">Earned This Month</div>');
    out.push('    </div>');
    out.push('    <div class="stat" style="padding:24px;">');
    out.push('      <div class="stat-icon" style="background:linear-gradient(135deg,#FFF1F2,#FECDD3)">⚠️</div>');
    out.push('      <div class="stat-val" style="color:var(--red)" id="earn-unpaid">₱0</div>');
    out.push('      <div class="stat-label">Total Unpaid</div>');
    out.push('    </div>');
    out.push('    <div class="stat" style="padding:24px;">');
    out.push('      <div class="stat-icon" style="background:linear-gradient(135deg,#F0FDF4,#DCFCE7)">📅</div>');
    out.push('      <div class="stat-val" style="color:#16a34a" id="earn-total-all">₱0</div>');
    out.push('      <div class="stat-label">All Time Earned</div>');
    out.push('    </div>');
    out.push('  </div>');
    out.push('  <div class="card" style="margin-top:8px;">');
    out.push('    <div style="font-weight:700;font-size:1rem;color:#374151;margin-bottom:16px;">📅 Monthly Breakdown</div>');
    out.push('    <div id="earn-monthly-breakdown">');
    out.push('      <p style="color:#9CA3AF;font-size:0.85rem;text-align:center;padding:20px 0;">No payment records yet.<br>Add payments in the Payments tab to see your monthly earnings here.</p>');
    out.push('    </div>');
    out.push('  </div>');
    fixes.grid = true;
    continue;
  }

  // FIX 2: Remove the leftover renderPDFRecords function that references pdf-records-list
  if (l.trim() === 'function renderPDFRecords(){' && !fixes.pdfFunc) {
    console.log('✅ Removing leftover renderPDFRecords function at line ' + (i+1));
    let depth = 0, started = false;
    while (i < lines.length) {
      const t = lines[i].trim();
      depth += (t.match(/\{/g)||[]).length - (t.match(/\}/g)||[]).length;
      if (!started && t.includes('{')) started = true;
      i++;
      if (started && depth <= 0) break;
    }
    fixes.pdfFunc = true;
    continue;
  }

  out.push(l);
  i++;
}

const result = out.join('\r\n');

// Verify
const gridCheck = result.includes('earn-monthly-breakdown');
const pdfCheck = (result.match(/pdf-records-list/g)||[]).length;
const statCount = (result.match(/earn-this-month|earn-unpaid|earn-total-all/g)||[]).length;
console.log('\n📊 Monthly breakdown div: ' + gridCheck + ' (should be true)');
console.log('📊 pdf-records-list remaining: ' + pdfCheck + ' (should be 0)');
console.log('📊 Stat IDs present: ' + statCount + ' (should be 3)');
console.log('📊 Grid replaced: ' + fixes.grid);
console.log('📊 PDF function removed: ' + fixes.pdfFunc);

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
