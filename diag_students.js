const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Check openStudentProfile
const spStart = content.indexOf('function openStudentProfile');
const spEnd = content.indexOf('\n}', spStart) + 2;
console.log('=== openStudentProfile ===');
console.log(content.substring(spStart, spEnd));

// Check markAttendance
const maStart = content.indexOf('function markAttendance');
const maEnd = content.indexOf('\n}', maStart) + 2;
console.log('\n=== markAttendance ===');
console.log(content.substring(maStart, maEnd));

// Check studentProfileModal exists
const hasModal = content.includes('studentProfileModal');
console.log('\n=== studentProfileModal exists:', hasModal);

// Check attendance history render
const hasAttHistory = content.includes('attendance-history');
console.log('=== attendance-history element exists:', hasAttHistory);

// Check how attendance is stored
const hasAttStore = content.includes('ts-attendance');
console.log('=== ts-attendance storage key exists:', hasAttStore);

// Check click handler on student name/avatar
const hasClickHandler = content.includes('openStudentProfile');
const clickCount = (content.match(/openStudentProfile/g) || []).length;
console.log('=== openStudentProfile call count:', clickCount);
