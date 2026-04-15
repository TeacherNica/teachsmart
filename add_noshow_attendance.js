const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split(/\r?\n/);
const out = [];
let fixes = { scheduleButtons: false, markAttendance: false, statsDisplay: false, logDisplay: false };

for (let i = 0; i < lines.length; i++) {
  let l = lines[i];

  // FIX 1: Add No Show button in schedule dashboard (line 919)
  if (l.includes('markAttendance') && l.includes('sched-badge') && !fixes.scheduleButtons) {
    l = l.replace(
      `<button onclick=\\\"markAttendance('\"+s.name+\"','absent')\\\" style=\\\"padding:4px 8px;border-radius:6px;border:none;background:#EF4444;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;margin-left:3px;\\\">❌ Absent</button>\":s.attendance_today===\"present\"?\"<span style=\\\"background:#DCFCE7;color:#15803D;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;margin-left:4px;\\\">✅ Present</span>\":s.attendance_today===\"absent\"?\"<span style=\\\"background:#FEE2E2;color:#B91C1C;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;margin-left:4px;\\\">❌ Absent</span>\":\"\"`,
      `<button onclick=\\\"markAttendance('\"+s.name+\"','absent')\\\" style=\\\"padding:4px 8px;border-radius:6px;border:none;background:#F97316;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;margin-left:3px;\\\">🔔 Absent</button><button onclick=\\\"markAttendance('\"+s.name+\"','noshow')\\\" style=\\\"padding:4px 8px;border-radius:6px;border:none;background:#EF4444;color:#fff;font-size:0.72rem;cursor:pointer;font-weight:700;margin-left:3px;\\\">🚫 No Show</button>\":s.attendance_today===\"present\"?\"<span style=\\\"background:#DCFCE7;color:#15803D;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;margin-left:4px;\\\">✅ Present</span>\":s.attendance_today===\"absent\"?\"<span style=\\\"background:#FFF7ED;color:#C2410C;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;margin-left:4px;\\\">🔔 Absent</span>\":s.attendance_today===\"noshow\"?\"<span style=\\\"background:#FEE2E2;color:#B91C1C;padding:3px 8px;border-radius:20px;font-size:0.72rem;font-weight:700;margin-left:4px;\\\">🚫 No Show</span>\":\"\"`
    );
    if (l !== lines[i]) { console.log('✅ Updated schedule attendance buttons at line ' + (i+1)); fixes.scheduleButtons = true; }
    else console.log('⚠️  Schedule button replacement failed at line ' + (i+1));
  }

  // FIX 2: Replace markAttendance function
  if (l.trim() === 'function markAttendance(name,type){' && !fixes.markAttendance) {
    console.log('✅ Replacing markAttendance function at line ' + (i+1));
    // Skip old function
    let depth = 0, started = false, j = i;
    while (j < lines.length) {
      const t = lines[j].trim();
      depth += (t.match(/\{/g)||[]).length - (t.match(/\}/g)||[]).length;
      if (!started && t.includes('{')) started = true;
      j++;
      if (started && depth <= 0) break;
    }
    i = j - 1;
    // Inject new function
    out.push('function markAttendance(name,type){');
    out.push('  var s=students.find(function(x){return x.name===name;});');
    out.push('  if(!s)return;');
    out.push('  var now=new Date();');
    out.push('  var dateStr=now.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});');
    out.push('  var timeStr=now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});');
    out.push('  if(!s.attendanceLog) s.attendanceLog=[];');
    out.push('  if(type==="present"){');
    out.push('    if(s.classes<=0){alert(s.name+" has no classes left!");return;}');
    out.push('    s.classes--;');
    out.push('    s.attendance_today="present";');
    out.push('    s.attendanceLog.unshift({status:"present",date:dateStr,time:timeStr});');
    out.push('    saveData();renderDashboard();renderStudents();');
    out.push('    alert("✅ Present! "+s.classes+" classes left.");');
    out.push('  } else if(type==="noshow"){');
    out.push('    if(s.classes<=0){alert(s.name+" has no classes left!");return;}');
    out.push('    s.classes--;');
    out.push('    s.attendance_today="noshow";');
    out.push('    s.attendanceLog.unshift({status:"noshow",date:dateStr,time:timeStr});');
    out.push('    saveData();renderDashboard();renderStudents();');
    out.push('    alert("🚫 No Show logged. 1 class deducted. "+s.classes+" classes left.");');
    out.push('  } else {');
    out.push('    s.attendance_today="absent";');
    out.push('    s.attendanceLog.unshift({status:"absent",date:dateStr,time:timeStr});');
    out.push('    saveData();renderDashboard();');
    out.push('    alert("🔔 Absent noted. No class deducted.");');
    out.push('  }');
    out.push('}');
    fixes.markAttendance = true;
    continue;
  }

  // FIX 3: Update stats display to show noshow count separately
  if (l.includes("'<div style=\"font-size:0.75rem;color:#6B7280;\">Absent</div>' +") && !fixes.statsDisplay) {
    // Replace the 3-stat bar: Present | Absent | Attendance%
    // Find the full stats block and replace it
    // The block spans lines 1921-1933, we replace the Absent stat label and add noshow
    out.push(lines[i].replace(
      "'<div style=\"font-size:0.75rem;color:#6B7280;\">Absent</div>' +",
      "'<div style=\"font-size:0.75rem;color:#6B7280;\">Absent (notified)</div>' +"
    ));
    console.log('✅ Updated Absent label in stats display at line ' + (i+1));
    fixes.statsDisplay = true;
    continue;
  }

  // FIX 4: Update attendance log to show noshow with orange styling
  if (l.includes("var isPresent = entry.status === 'present';") && !fixes.logDisplay) {
    out.push(l);
    i++;
    // Next line is the return statement - replace it
    while (i < lines.length && !lines[i].includes("return '<div")) i++;
    // Replace the log entry rendering to handle 3 states
    out.push("      var bgColor = entry.status==='present' ? '#F0FDF4' : entry.status==='noshow' ? '#FEF2F2' : '#FFF7ED';");
    out.push("      var borderColor = entry.status==='present' ? '#22C55E' : entry.status==='noshow' ? '#EF4444' : '#F97316';");
    out.push("      var badgeBg = entry.status==='present' ? '#22C55E' : entry.status==='noshow' ? '#EF4444' : '#F97316';");
    out.push("      var badgeLabel = entry.status==='present' ? '✅ Present' : entry.status==='noshow' ? '🚫 No Show' : '🔔 Absent';");
    out.push("      return '<div style=\"display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin-bottom:8px;background:' + bgColor + ';border-radius:10px;border-left:4px solid ' + borderColor + ';\">' +");
    out.push("        '<div>' +");
    out.push("          '<div style=\"font-weight:600;font-size:0.9rem;color:#374151;\">' + entry.date + '</div>' +");
    out.push("          '<div style=\"font-size:0.78rem;color:#6B7280;\">' + entry.time + '</div>' +");
    out.push("        '</div>' +");
    out.push("        '<span style=\"background:' + badgeBg + ';color:#fff;padding:3px 12px;border-radius:20px;font-size:0.78rem;font-weight:700;\">' + badgeLabel + '</span>' +");
    out.push("      '</div>';");
    // Skip the old return block
    while (i < lines.length && !lines[i].includes("}).join('')")) i++;
    out.push("    }).join('');");
    console.log('✅ Updated attendance log display with 3-status support');
    fixes.logDisplay = true;
    i++;
    continue;
  }

  out.push(l);
}

const result = out.join('\r\n');
console.log('\n📊 Schedule buttons updated: ' + fixes.scheduleButtons);
console.log('📊 markAttendance updated: ' + fixes.markAttendance);
console.log('📊 Stats display updated: ' + fixes.statsDisplay);
console.log('📊 Log display updated: ' + fixes.logDisplay);
console.log('📊 noshow in file: ' + result.includes('noshow'));

fs.writeFileSync('index.html', result, 'utf8');
console.log('\n✅ index.html saved. done: true');
