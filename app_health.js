// app_health.js — node app_health.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

let pass = 0, fail = 0;

function check(label, condition, detail) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    pass++;
  } else {
    console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`);
    fail++;
  }
}

console.log('=== TeachSmart App Health Check ===\n');

// 1. File basics
console.log('📄 FILE');
check('File exists', fs.existsSync('index.html'));
check('File size OK (>150KB)', raw.length > 150000, `actual: ${(raw.length/1024).toFixed(1)}KB`);
check('Line count OK (>2000)', lines.length > 2000, `actual: ${lines.length}`);

// 2. Script tags balanced
const opens = (raw.match(/<script/gi)||[]).length;
const closes = (raw.match(/<\/script>/gi)||[]).length;
console.log('\n📜 SCRIPT TAGS');
check(`Script tags balanced (${opens} open, ${closes} close)`, opens === closes);

// 3. Key functions exist
console.log('\n⚙️  KEY FUNCTIONS');
const fns = [
  'function nav(',
  'function renderDashboard(',
  'function renderStudents(',
  'function renderScheduleGrid(',
  'function renderPayments(',
  'function renderEarnings(',
  'function renderReports(',
  'function renderClassroom(',
  'function saveData(',
  'function openStudentProfile(',
];
fns.forEach(fn => check(fn, raw.includes(fn)));

// 4. Key HTML elements
console.log('\n🏗️  KEY HTML ELEMENTS');
const els = [
  'id="page-dashboard"',
  'id="page-students"',
  'id="page-schedule"',
  'id="page-payments"',
  'id="page-earnings"',
  'id="page-reports"',
  'id="page-classroom"',
  'id="page-materials"',
  'id="dash-total"',
  'id="dash-low"',
  'id="reports-list"',
  'id="page-absence"',
];
els.forEach(el => check(el, raw.includes(el)));

// 5. Startup block
console.log('\n🚀 STARTUP BLOCK');
check('Daily reset IIFE exists', raw.includes('DAILY RESET'));
check('INIT block exists', raw.includes('// ─── INIT ───'));
check('Startup reads lastPage', raw.includes("localStorage.getItem('ts-last-page')"));
check('renderDashboard in startup', /INIT[\s\S]{0,500}renderDashboard/.test(raw));
check('No double renderDashboard at startup', (raw.match(/^renderDashboard\(\);/m)||[]).length === 0);

// 6. students array
console.log('\n👥 STUDENTS');
check('students initialized from localStorage', raw.includes("localStorage.getItem('ts-students')||'null'"));
check('renderDashboard refreshes students', raw.includes("students=JSON.parse(localStorage.getItem('ts-students')||'[]')"));
check('saveData saves ts-students', raw.includes("localStorage.setItem('ts-students'"));

// 7. Nav function
console.log('\n🧭 NAV FUNCTION');
check('nav saves last-page', raw.includes("localStorage.setItem('ts-last-page'"));
check('nav calls renderDashboard', raw.includes("if(page==='dashboard')renderDashboard()"));
check('nav calls renderStudents', raw.includes("if(page==='students')renderStudents()"));
check('nav calls renderPayments', raw.includes("if(page==='payments')renderPayments()"));

// 8. Login
console.log('\n🔐 LOGIN');
check('login.html exists', fs.existsSync('login.html'));
check('Auth check in index.html', raw.includes('ts-auth') || raw.includes('teachnica'));

// Summary
console.log(`\n${'='.repeat(40)}`);
console.log(`RESULT: ${pass} passed, ${fail} failed`);
if (fail === 0) {
  console.log('🎉 App looks healthy!');
} else {
  console.log('⚠️  Some checks failed — review above');
}
console.log('='.repeat(40));
