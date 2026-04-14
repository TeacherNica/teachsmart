const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const original = html;

// ─── FIX 1: Remove duplicate renderReports() call on line 910 area ───
// There are two consecutive: if(page==='reports')renderReports();
// We only need one. Remove the second occurrence in the showPage block.
html = html.replace(
  "if(page==='earnings'){renderEarnings();renderPDFRecords();}\n  if(page==='reports')renderReports();",
  "if(page==='earnings'){renderEarnings();renderPDFRecords();}"
);

// Also try with \r\n
html = html.replace(
  "if(page==='earnings'){renderEarnings();renderPDFRecords();}\r\n  if(page==='reports')renderReports();",
  "if(page==='earnings'){renderEarnings();renderPDFRecords();}"
);

// ─── FIX 2: Remove the second renderReports function (the PDF one at line ~2353) ───
// This function starts with: function renderReports(){
// and is the SECOND occurrence — we need to find and remove it along with its body

// Strategy: find the second renderReports function and replace it with a comment
const marker = '// ─── PDF REPORTS ───';
const idx = html.indexOf(marker);
if (idx !== -1) {
  // Find the renderReports function that comes after this marker
  const afterMarker = html.indexOf('function renderReports(){', idx);
  if (afterMarker !== -1) {
    // Find the end of this function by counting braces
    let braceCount = 0;
    let i = afterMarker;
    let started = false;
    while (i < html.length) {
      if (html[i] === '{') { braceCount++; started = true; }
      if (html[i] === '}') { braceCount--; }
      if (started && braceCount === 0) {
        i++; // include closing brace
        break;
      }
      i++;
    }
    const funcText = html.slice(afterMarker, i);
    html = html.slice(0, afterMarker) + '// [PDF renderReports removed - duplicate]' + html.slice(i);
    console.log('✅ Removed second renderReports function (' + funcText.length + ' chars)');
  } else {
    console.log('⚠️  Could not find renderReports after PDF REPORTS marker');
  }
} else {
  console.log('⚠️  Could not find PDF REPORTS marker — trying fallback...');
  // Fallback: find ALL occurrences of function renderReports and remove the second one
  const first = html.indexOf('function renderReports(){');
  const second = html.indexOf('function renderReports(){', first + 1);
  if (second !== -1) {
    let braceCount = 0;
    let i = second;
    let started = false;
    while (i < html.length) {
      if (html[i] === '{') { braceCount++; started = true; }
      if (html[i] === '}') { braceCount--; }
      if (started && braceCount === 0) { i++; break; }
      i++;
    }
    html = html.slice(0, second) + '// [duplicate renderReports removed]' + html.slice(i);
    console.log('✅ Fallback: Removed second renderReports function');
  } else {
    console.log('❌ Only one renderReports found — no duplicate to remove');
  }
}

// ─── FIX 3: Remove renderPDFRecords() call from showPage since Earnings tab is fine ───
// Actually keep renderPDFRecords on earnings — that's intentional for the Earnings tab
// Just make sure it doesn't crash if the element doesn't exist
const safeRender = 'function renderPDFRecords(){var container=document.getElementById(\'pdf-records-list\');if(!container)return;';
const unsafeRender = 'function renderPDFRecords(){var container=document.getElementById(\'pdf-records-list\');';
if (html.includes(unsafeRender) && !html.includes(safeRender)) {
  html = html.replace(unsafeRender, safeRender);
  console.log('✅ Made renderPDFRecords null-safe');
} else if (html.includes(safeRender)) {
  console.log('✅ renderPDFRecords already null-safe');
} else {
  console.log('⚠️  Could not patch renderPDFRecords — check manually');
}

// ─── VERIFY ───
const count = (html.match(/function renderReports\(\)/g) || []).length;
console.log('\n📊 renderReports functions remaining: ' + count + ' (should be 1)');

const callCount = (html.match(/renderReports\(\)/g) || []).length;
console.log('📊 renderReports() calls: ' + callCount);

if (html === original) {
  console.log('\n❌ NO CHANGES MADE — text matches may have failed. Check line endings.');
  process.exit(1);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('\n✅ index.html saved. done: true');
