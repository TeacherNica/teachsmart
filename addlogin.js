const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// Find the schedule page content and replace it
const schedStart = h.indexOf('id="page-schedule">');
const schedEnd = h.indexOf('\n<div id="page-', schedStart + 10);

const newSchedPage = `id="page-schedule">
  <div class="page-header">
    <div><div class="page-title">📅 Schedule & Calendar</div><div class="page-sub">Weekly class schedule — Thailand time</div></div>
  </div>
  <div style="overflow-x:auto;margin-top:8px;">
    <table id="sched-table" style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:750px;">
      <thead>
        <tr>
          <th style="background:#1E1B4B;color:#A5B4FC;padding:10px 8px;border:1px solid #312E81;white-space:nowrap;">🇹🇭 Thai Time</th>
          <th style="background:#1E1B4B;color:#FCD34D;padding:10px 8px;border:1px solid #312E81;white-space:nowrap;">🇨🇳 China Time</th>
          <th style="background:#166534;color:#fff;padding:10px 8px;border:1px solid #312E81;">Monday</th>
          <th style="background:#1D4ED8;color:#fff;padding:10px 8px;border:1px solid #312E81;">Tuesday</th>
          <th style="background:#065F46;color:#fff;padding:10px 8px;border:1px solid #312E81;">Wednesday</th>
          <th style="background:#1E1B4B;color:#A5B4FC;padding:10px 8px;border:1px solid #312E81;">Thursday</th>
          <th style="background:#4C1D95;color:#fff;padding:10px 8px;border:1px solid #312E81;">Friday</th>
          <th style="background:#7C2D12;color:#fff;padding:10px 8px;border:1px solid #312E81;">Saturday</th>
          <th style="background:#14532D;color:#fff;padding:10px 8px;border:1px solid #312E81;">Sunday</th>
          <th style="background:#1E1B4B;color:#A5B4FC;padding:10px 8px;border:1px solid #312E81;">Section</th>
        </tr>
      </thead>
      <tbody id="sched-body"></tbody>
    </table>
  </div>
`;

h = h.substring(0, schedStart) + newSchedPage + h.substring(schedEnd);

// Replace renderScheduleGrid with correct version
const oldGrid = h.indexOf('function renderScheduleGrid');
const oldGridEnd = h.indexOf('\nfunction ', oldGrid + 10);
if(oldGrid > -1){
  h = h.substring(0, oldGrid) + h.substring(oldGridEnd);
}

const gridFn = `function renderScheduleGrid(){
  const body=document.getElementById('sched-body');
  if(!body)return;
  function cell(name,bg){
    if(!name)return '<td style="background:#EF4444;color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:600;font-size:0.78rem;">Close</td>';
    if(name==='Avail')return '<td style="background:#EAB308;color:#000;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;">Available</td>';
    const s=students.find(x=>x.name===name||x.name.startsWith(name));
    const c=s?s.c1:'#3B82F6';
    return '<td style="background:'+c+';color:#fff;text-align:center;padding:7px 4px;border:1px solid #ddd;font-weight:700;font-size:0.78rem;cursor:pointer;" onclick="'+(s?'nav(\\'students\\',document.querySelectorAll(\\'.nav-item\\')[1])':'')+'">'+name+'</td>';
  }
  function sectionCell(label,rows,bg){
    return '<td rowspan="'+rows+'" style="background:'+bg+';color:#fff;font-weight:800;text-align:center;padding:6px 4px;border:1px solid #ddd;writing-mode:vertical-lr;letter-spacing:3px;">'+label+'</td>';
  }
  const rows=[
    // MORNING
    {th:'10:00 AM',cn:'11:00 AM',d:[null,'Seah',null,null,null,null,null],section:'MORNING',srows:6,sbg:'#166534'},
    {th:'10:30 AM',cn:'11:30 AM',d:[null,null,null,null,null,'Seah',null]},
    {th:'11:00 AM',cn:'12:00 PM',d:[null,null,null,null,null,'Coco-2','Avail']},
    {th:'11:30 AM',cn:'12:30 PM',d:[null,null,null,null,null,'Shily','Peter']},
    {th:'12:00 PM',cn:'1:00 PM', d:[null,null,null,null,null,'Owen','Peter']},
    {th:'12:30 PM',cn:'1:30 PM', d:[null,null,null,null,null,'Owen',null]},
    // EVENING
    {th:'5:30 PM',cn:'6:30 PM',d:['Suri','Suri',null,'Suri',null,null,null],section:'EVENING',srows:7,sbg:'#7C2D12'},
    {th:'6:00 PM',cn:'7:00 PM',d:['Bella','Jackie','Bella','Lina','Koala',null,'Koala']},
    {th:'6:30 PM',cn:'7:30 PM',d:['COCO-1','Lina','Jackie','Jackie','Koala','Avail','Koala']},
    {th:'7:00 PM',cn:'8:00 PM',d:['Harry','KAREN','COCO-1','Coco-2','KAREN','Rainy','Rainy']},
    {th:'7:30 PM',cn:'8:30 PM',d:['K.Bella','Mollie','K.Bella','Peter',null,'Steven','Harry']},
    {th:'8:00 PM',cn:'9:00 PM',d:['Kelly','Aiden','Sophia','Peter','Owen','Carl','Carl']},
    {th:'8:30 PM',cn:'9:30 PM',d:[null,null,'Sophia',null,null,null,null]},
  ];
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let html='';
  rows.forEach(row=>{
    html+='<tr>';
    const timeBg=row.section==='MORNING'?'#FEF9C3':row.th>='5:00 PM'?'#FDE68A':'#FEF9C3';
    html+='<td style="background:'+timeBg+';color:#713F12;font-weight:700;text-align:center;padding:7px 8px;border:1px solid #ddd;white-space:nowrap;">'+row.th+'</td>';
    html+='<td style="background:'+timeBg+';color:#713F12;font-weight:700;text-align:center;padding:7px 8px;border:1px solid #ddd;white-space:nowrap;">'+row.cn+'</td>';
    row.d.forEach(name=>{ html+=cell(name); });
    if(row.section) html+=sectionCell(row.section,row.srows,row.sbg);
    html+='</tr>';
  });
  body.innerHTML=html;
}`;

h = h.replace('function isUpcoming', gridFn + '\nfunction isUpcoming');

// Update nav call for schedule
h = h.replace("if(page==='schedule')renderSchedule();", "if(page==='schedule'){renderScheduleGrid();}");
h = h.replace("if(page==='schedule'){renderSchedule();renderScheduleGrid();}", "if(page==='schedule'){renderScheduleGrid();}");

fs.writeFileSync('index.html', h, 'utf8');
console.log('grid:', h.includes('renderScheduleGrid'));
console.log('sched-body:', h.includes('sched-body'));