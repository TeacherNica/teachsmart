// fix_surgical.js — node fix_surgical.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

let changes = 0;

// Show current startup IIFE lines 2853-2879
console.log('BEFORE — startup IIFE:');
for (let i = 2852; i < 2880 && i < lines.length; i++) {
  console.log(`  ${i+1}: ${lines[i].replace(/\r/,'')}`);
}

// ── FIX 1: Replace the entire startup IIFE content line by line ──
// We target specific line numbers based on what we've seen consistently.
// Line 2854 (index 2853): var lastPage = ...  ✅ keep
// Line 2855 (index 2854): var lastPage = ...  — actually line 2856 is the broken querySelector
// Line 2856 (index 2855): broken querySelector — REPLACE with loop
// Lines 2857-2876: rest of IIFE

// Find the broken querySelector line
for (let i = 2840; i < 2880; i++) {
  const l = lines[i] ? lines[i].replace(/\r/,'') : '';
  
  // Fix the broken navBtn querySelector — replace with a safe loop
  if (l.includes('var navBtn = document.querySelector') && l.includes('lastPage')) {
    lines[i] = "  var navBtn = null; document.querySelectorAll('.nav-item').forEach(function(el){ if((el.getAttribute('onclick')||'').indexOf(\"'\" + lastPage + \"'\") !== -1) navBtn = el; });\r";
    console.log(`\n✅ Fix 1 applied at line ${i+1}`);
    changes++;
  }
  
  // Fix the broken dashboard fallback querySelector
  if (l.includes("navBtn = document.querySelector") && l.includes("dashboard")) {
    lines[i] = "    document.querySelectorAll('.nav-item').forEach(function(el){ if((el.getAttribute('onclick')||'').indexOf(\"'dashboard'\") !== -1) navBtn = el; });\r";
    console.log(`✅ Fix 2 applied at line ${i+1}`);
    changes++;
  }

  // Fix 3: make dashboard render use setTimeout to guarantee students loaded
  if (l.trim() === "if(lastPage==='dashboard')  renderDashboard();") {
    lines[i] = "  if(lastPage==='dashboard')  { students=JSON.parse(localStorage.getItem('ts-students')||'null')||students; setTimeout(renderDashboard,0); }\r";
    console.log(`✅ Fix 3 applied at line ${i+1}`);
    changes++;
  }
}

if (changes === 0) {
  console.log('\n❌ No changes made — lines may have shifted. Check output above.');
  process.exit(1);
}

fs.writeFileSync('index.html', lines.join('\n'), 'utf8');
console.log(`\n✅ Saved with ${changes} changes.`);

// Verify
const verify = fs.readFileSync('index.html', 'utf8').split('\n');
console.log('\nAFTER — startup IIFE:');
for (let i = 2852; i < 2880 && i < verify.length; i++) {
  console.log(`  ${i+1}: ${verify[i].replace(/\r/,'')}`);
}
console.log('\n=== done: true ===');
