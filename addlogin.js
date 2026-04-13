const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

const scheduleGrid = `
<div id="weekly-grid" style="overflow-x:auto;margin-top:16px;">
<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:700px;">
<thead>
<tr>
  <th style="background:#1E1B4B;color:#A5B4FC;padding:8px;text-align:center;border:1px solid #312E81;">Thai Time</th>
  <th style="background:#1E1B4B;color:#A5B4FC;padding:8px;text-align:center;border:1px solid #312E81;">China Time</th>
  <th style="background:#166534;color:#fff;padding:8px;text-align:center;border:1px solid #312E81;">Monday</th>
  <th style="background:#1E1B4B;color:#A5B4FC;padding:8px;text-align:center;border:1px solid #312E81;">Tuesday</th>
  <th style="background:#065F46;color:#fff;padding:8px;text-align:center;border:1px solid #312E81;">Wednesday</th>
  <th style="background:#1E1B4B;color:#A5B4FC;padding:8px;text-align:center;border:1px solid #312E81;">Thursday</th>
  <th style="background:#1E1B4B;color:#A5B4FC;padding:8px;text-align:center;border:1px solid #312E81;">Friday</th>
  <th style="background:#7C2D12;color:#fff;padding:8px;text-align:center;border:1px solid #312E81;">Saturday</th>
  <th style="background:#14532D;color:#fff;padding:8px;text-align:center;border:1px solid #312E81;">Sunday</th>
  <th style="background:#1E1B4B;color:#A5B4FC;padding:8px;text-align:center;border:1px solid #312E81;writing-mode:vertical-lr;">Section</th>
</tr>
</thead>
<tbody id="schedule-grid-body"></tbody>
</table>
</div>`;

// Find schedule page and inject grid after tz-bar
const oldSchedEnd = '  <div id="schedule-list"></div>\n</div>';
const newSchedEnd = '  <div id="schedule-list"></div>\n' + scheduleGrid + '\n</div>';
h = h.replace(oldSchedEnd, newSchedEnd);

// Add renderScheduleGrid function
const gridFn = `
function renderScheduleGrid(){
  const body = document.getElementById('schedule-grid-body');
  if(!body) return;

  const GRID = {
    morning: [
      {th:'10:00 AM', cn:'11:00 AM', slots:{5:'Seah', 6:''}},
      {th:'10:30 AM', cn:'11:30 AM', slots:{5:'Seah', 6:''}},
      {th:'11:00 AM', cn:'12:00 PM', slots:{5:'Coco-2', 6:'Available'}},
      {th:'11:30 AM', cn:'12:30 PM', slots:{5:'Shily', 6:'Peter'}},
      {th:'12:00 PM', cn:'1:00 PM',  slots:{5:'Owen',  6:'Peter'}},
      {th:'12:30 PM', cn:'1:30 PM',  slots:{5:'Owen',  6:''}},
    ],
    evening: [
      {th:'5:30 PM', cn:'6:30 PM', slots:{0:'Suri',    1:'Suri',   2:'',       3:'Suri',   4:'',      5:'',       6:''}},
      {th:'6:00 PM', cn:'7:00 PM', slots:{0:'Bella',   1:'Jackie', 2:'Bella',  3:'Lina',   4:'Koala', 5:'',       6:'Koala'}},
      {th:'6:30 PM', cn:'7:30 PM', slots:{0:'COCO-1',  1:'Lina',   2:'Jackie', 3:'Jackie', 4:'Koala', 5:'Available',6:'Koala'}},
      {th:'7:00 PM', cn:'8:00 PM', slots:{0:'Harry',   1:'KAREN',  2:'COCO-1', 3:'Coco-2', 4:'KAREN', 5:'Rainy',  6:'Rainy'}},
      {th:'7:30 PM', cn:'8:30 PM', slots:{0:'K.Bella', 1:'Mollie', 2:'K.Bella',3:'Peter',  4:'',      5:'Steven', 6:'Harry'}},
      {th:'8:00 PM', cn:'9:00 PM', slots:{0:'Kelly',   1:'Aiden',  2:'Sophia', 3:'Peter',  4:'Owen',  5:'Carl',   6:'Carl'}},
      {th:'8:30 PM', cn:'9:30 PM', slots:{0:'',        1:'',       2:'Sophia', 3:'',       4:'',      5:'',       6:''}},
    ]
  };

  function cellHTML(val){
    if(!val) return '<td style="background:#EF4444;color:#fff;text-align:center;padding:6px 4px;border:1px solid #ccc;font-weight:600;">Close</td>';
    if(val==='Available') return '<td style="background:#EAB308;color:#000;text-align:center;padding:6px 4px;border:1px solid #ccc;font-weight:700;">Available</td>';
    const s=students.find(x=>x.name===val||x.name.includes(val));
    const bg=s?s.c1:'#3B82F6';
    return '<td style="background:'+bg+';color:#fff;text-align:center;padding:6px 4px;border:1px solid #ccc;font-weight:700;cursor:pointer;" onclick="openSchedule('+(s?s.id:0)+')">'+val+'</td>';
  }

  let rows = '';
  // Morning section
  GRID.morning.forEach((row,i)=>{
    rows += '<tr>';
    rows += '<td style="background:#FEF9C3;color:#713F12;font-weight:700;text-align:center;padding:6px 8px;border:1px solid #ccc;">'+row.th+'</td>';
    rows += '<td style="background:#FEF9C3;color:#713F12;font-weight:700;text-align:center;padding:6px 8px;border:1px solid #ccc;">'+row.cn+'</td>';
    [0,1,2,3,4,5,6].forEach(d=>{
      rows += cellHTML(row.slots[d]||'');
    });
    rows += i===0?'<td rowspan="'+GRID.morning.length+'" style="background:#166534;color:#fff;font-weight:800;text-align:center;padding:6px;border:1px solid #ccc;writing-mode:vertical-lr;letter-spacing:2px;">MORNING</td>':'';
    rows += '</tr>';
  });
  // Evening section
  GRID.evening.forEach((row,i)=>{
    rows += '<tr>';
    rows += '<td style="background:#FDE68A;color:#713F12;font-weight:700;text-align:center;padding:6px 8px;border:1px solid #ccc;">'+row.th+'</td>';
    rows += '<td style="background:#FDE68A;color:#713F12;font-weight:700;text-align:center;padding:6px 8px;border:1px solid #ccc;">'+row.cn+'</td>';
    [0,1,2,3,4,5,6].forEach(d=>{
      rows += cellHTML(row.slots[d]!==undefined?row.slots[d]:'');
    });
    rows += i===0?'<td rowspan="'+GRID.evening.length+'" style="background:#7C2D12;color:#fff;font-weight:800;text-align:center;padding:6px;border:1px solid #ccc;writing-mode:vertical-lr;letter-spacing:2px;">EVENING</td>':'';
    rows += '</tr>';
  });

  body.innerHTML = rows;
}`;

h = h.replace('function isUpcoming', gridFn + '\nfunction isUpcoming');

// Call renderScheduleGrid when schedule page opens
h = h.replace("if(page==='schedule')renderSchedule();", "if(page==='schedule'){renderSchedule();renderScheduleGrid();}");

fs.writeFileSync('index.html', h, 'utf8');
console.log('grid:', h.includes('renderScheduleGrid'));
console.log('injected:', h.includes('schedule-grid-body'));