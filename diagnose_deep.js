// diagnose_deep.js — node diagnose_deep.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

function showLines(label, start, end) {
  console.log(`\n--- ${label} (lines ${start}-${end}) ---`);
  for (let i = start - 1; i < end && i < lines.length; i++) {
    console.log(`  ${i + 1}: ${lines[i].replace(/\r/, '')}`);
  }
}

// 1. Full nav function (line 939 to ~970)
showLines('FULL NAV FUNCTION', 939, 975);

// 2. renderReports function definition area (line 1386 to ~1430)
showLines('renderReports FUNCTION START', 1386, 1430);

// 3. The page-reports HTML element (line 688 area)
showLines('page-reports HTML', 685, 700);

// 4. Check line 2865 context (lastPage reports call)
showLines('lastPage reports context', 2858, 2875);

// 5. Check line 2584 and 2603 context
showLines('renderReports call at 2584', 2578, 2590);
showLines('renderReports call at 2603', 2597, 2610);

// 6. Check if there's a try/catch swallowing errors around nav
console.log('\n--- TRY/CATCH NEAR NAV (lines 935-960) ---');
for (let i = 934; i < 960; i++) {
  console.log(`  ${i + 1}: ${lines[i].replace(/\r/, '')}`);
}

// 7. Check reports-list element exists in HTML
console.log('\n--- reports-list ELEMENT ---');
lines.forEach((line, i) => {
  if (/reports-list|id="reports/.test(line)) {
    console.log(`  Line ${i + 1}: ${line.replace(/\r/, '').trim()}`);
  }
});

// 8. Look for anything that might CLEAR or hide the reports page
console.log('\n--- ANYTHING HIDING/CLEARING reports ---');
lines.forEach((line, i) => {
  if (/reports/.test(line) && /innerHTML|display|hidden|classList|style/.test(line)) {
    console.log(`  Line ${i + 1}: ${line.replace(/\r/, '').trim()}`);
  }
});

console.log('\n=== diagnose_deep done ===');
