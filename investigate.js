const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('==========================================');
console.log('   TEACHSMART FULL INVESTIGATION REPORT');
console.log('==========================================\n');
console.log('File size:', Math.round(content.length/1024), 'KB');
console.log('Total lines:', lines.length);

// ── 1. SCRIPT TAGS ────────────────────────────────
console.log('\n── 1. SCRIPT TAG AUDIT ──');
const openTags = (content.match(/<script/g)||[]).length;
const closeTags = (content.match(/<\/script>/g)||[]).length;
console.log('Opening <script> tags:', openTags);
console.log('Closing </script> tags:', closeTags);
console.log(openTags===closeTags ? '✅ Balanced' : '❌ UNBALANCED!');

// Find script tag positions
let scriptRanges = [];
let pos = 0;
while(true) {
  const open = content.indexOf('<script', pos);
  if(open===-1) break;
  const close = content.indexOf('</script>', open);
  scriptRanges.push({open, close: close+9});
  pos = close+9;
}
scriptRanges.forEach(function(r,i){
  const openLine = content.substring(0,r.open).split('\n').length;
  const closeLine = content.substring(0,r.close).split('\n').length;
  console.log('  Script', i+1, ': lines', openLine, '-', closeLine);
});

// ── 2. DUPLICATE FUNCTIONS ────────────────────────
console.log('\n── 2. DUPLICATE FUNCTION CHECK ──');
const fnMatches = content.match(/function\s+(\w+)\s*\(/g)||[];
const fnCounts = {};
fnMatches.forEach(function(m){
  const name = m.replace('function','').replace('(','').trim();
  fnCounts[name] = (fnCounts[name]||0)+1;
});
let dupFound = false;
Object.keys(fnCounts).forEach(function(name){
  if(fnCounts[name]>1){
    console.log('❌ DUPLICATE:', name, '(', fnCounts[name], 'times )');
    dupFound = true;
  }
});
if(!dupFound) console.log('✅ No duplicate functions found');

// ── 3. DUPLICATE IDs ─────────────────────────────
console.log('\n── 3. DUPLICATE ELEMENT ID CHECK ──');
const idMatches = content.match(/id="([^"]+)"/g)||[];
const idCounts = {};
idMatches.forEach(function(m){
  const id = m.replace('id="','').replace('"','');
  idCounts[id] = (idCounts[id]||0)+1;
});
let dupIdFound = false;
Object.keys(idCounts).forEach(function(id){
  if(idCounts[id]>1){
    console.log('❌ DUPLICATE ID:', id, '(', idCounts[id], 'times )');
    dupIdFound = true;
  }
});
if(!dupIdFound) console.log('✅ No duplicate IDs found');

// ── 4. PAGE AUDIT ─────────────────────────────────
console.log('\n── 4. PAGE TAB AUDIT ──');
const pages = ['dashboard','students','schedule','classroom','payments','earnings','reports','materials','hof','profile','absence','settings'];
pages.forEach(function(page){
  const hasPage = content.includes('id="page-'+page+'"');
  const hasRender = content.includes('function render'+page.charAt(0).toUpperCase()+page.slice(1)) ||
                    content.includes('function renderHOF') && page==='hof' ||
                    content.includes('function updateFolderCounts') && page==='materials' ||
                    content.includes('function renderClassroom') && page==='classroom';
  const inNav = content.includes("page==='"+page+"'");
  console.log((hasPage?'✅':'❌')+' page-'+page, 
              (hasRender?'✅':'⚠️')+' render fn',
              (inNav?'✅':'⚠️')+' in nav');
});

// ── 5. NAV FUNCTION ───────────────────────────────
console.log('\n── 5. NAV FUNCTION AUDIT ──');
const navIdx = content.indexOf('function nav(');
const navFn = content.substring(navIdx, navIdx+800);
console.log(navFn);

// ── 6. INIT ORDER ─────────────────────────────────
console.log('\n── 6. INIT ORDER CHECK ──');
const initIdx = content.indexOf('// ─── INIT ───');
const renderDashIdx = content.indexOf('function renderDashboard');
const renderEarnIdx = content.indexOf('function renderEarnings');
const renderPayIdx = content.indexOf('function renderPayments');
const renderClassIdx = content.indexOf('function renderClassroom');
const weeklySchedIdx = content.indexOf('const WEEKLY_SCHEDULE');
console.log('INIT code at index:', initIdx);
console.log('renderDashboard defined at:', renderDashIdx, renderDashIdx < initIdx ? '✅ before init' : '❌ AFTER init!');
console.log('renderEarnings defined at:', renderEarnIdx, renderEarnIdx < initIdx ? '✅ before init' : '❌ AFTER init!');
console.log('renderPayments defined at:', renderPayIdx, renderPayIdx < initIdx ? '✅ before init' : '❌ AFTER init!');
console.log('renderClassroom defined at:', renderClassIdx, renderClassIdx === -1 ? '❌ NOT FOUND' : renderClassIdx < initIdx ? '✅ before init' : '❌ AFTER init!');
console.log('WEEKLY_SCHEDULE defined at:', weeklySchedIdx, weeklySchedIdx < initIdx ? '✅ before init' : '❌ AFTER init!');

// ── 7. FUNCTIONS OUTSIDE SCRIPT TAGS ─────────────
console.log('\n── 7. FUNCTIONS OUTSIDE SCRIPT TAGS CHECK ──');
const allFnPositions = [];
let sp = 0;
while(true) {
  const f = content.indexOf('function ', sp);
  if(f===-1) break;
  // Check if inside a script tag
  let insideScript = false;
  scriptRanges.forEach(function(r){
    if(f > r.open && f < r.close) insideScript = true;
  });
  if(!insideScript) {
    const lineNum = content.substring(0,f).split('\n').length;
    const snippet = content.substring(f, f+50);
    console.log('❌ Function OUTSIDE script tag at line', lineNum, ':', snippet);
  }
  sp = f+1;
}
if(allFnPositions.length===0) console.log('✅ All functions are inside script tags');

// ── 8. KEY FUNCTIONS CHECK ────────────────────────
console.log('\n── 8. CRITICAL FUNCTIONS CHECK ──');
const critical = [
  'renderDashboard','renderStudents','renderScheduleGrid','renderClassNotes',
  'renderPayments','renderEarnings','renderReports','renderHOF',
  'getTodaySlots','openStudentProfile','markAttendance','saveData',
  'getPayments','openSlotEditor','saveQuickRename','editPayment',
  'deletePayment','updateFolderCounts','openMaterialsFolder','renderClassroom',
  'saveClassNote','startClassTimer','stopClassTimer'
];
critical.forEach(function(fn){
  const count = (content.match(new RegExp('function '+fn, 'g'))||[]).length;
  if(count===0) console.log('❌ MISSING:', fn);
  else if(count>1) console.log('❌ DUPLICATE:', fn, '('+count+'x)');
  else console.log('✅', fn);
});

// ── 9. LOCALSTORAGE KEYS ─────────────────────────
console.log('\n── 9. LOCALSTORAGE KEY AUDIT ──');
const getItems = (content.match(/getItem\(['"`]([^'"`]+)['"`]\)/g)||[]).map(m=>m.match(/['"`]([^'"`]+)['"`]/)[1]);
const setItems = (content.match(/setItem\(['"`]([^'"`]+)['"`]/g)||[]).map(m=>m.match(/['"`]([^'"`]+)['"`]/)[1]);
const uniqueGet = [...new Set(getItems)];
const uniqueSet = [...new Set(setItems)];
console.log('Keys READ:', uniqueGet.join(', '));
console.log('Keys WRITTEN:', uniqueSet.join(', '));
uniqueGet.forEach(function(k){
  if(!uniqueSet.includes(k)) console.log('⚠️ Key read but never written:', k);
});

// ── 10. SUMMARY ──────────────────────────────────
console.log('\n==========================================');
console.log('   INVESTIGATION COMPLETE');
console.log('==========================================');
