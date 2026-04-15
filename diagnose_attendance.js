const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);

// Find attendance-related functions
console.log('\n=== Attendance functions ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('markAttendance') || lines[i].includes('markPresent') ||
      lines[i].includes('markAbsent') || lines[i].includes('attendance-modal') ||
      lines[i].includes('attendanceModal') || lines[i].includes('openAttendance')) {
    console.log((i+1) + ': ' + lines[i].trim().substring(0, 120));
  }
}

// Find the attendance modal HTML
console.log('\n=== Attendance modal HTML ===');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('attendance') && lines[i].includes('modal') && lines[i].includes('id=')) {
    for (let j = i; j < Math.min(i+40, lines.length); j++) {
      console.log((j+1) + ': ' + lines[j].trim().substring(0, 120));
    }
    break;
  }
}

// Find Present/Absent buttons
console.log('\n=== Present / Absent buttons ===');
for (let i = 0; i < lines.length; i++) {
  if ((lines[i].includes('Present') || lines[i].includes('Absent')) && lines[i].includes('onclick')) {
    console.log((i+1) + ': ' + lines[i].trim().substring(0, 120));
  }
}
