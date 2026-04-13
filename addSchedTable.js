const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const original = html.length;

// Find the end of the schedule page's tz-bar section to inject after
const INJECT_AFTER = '  <div class="grid-main">';
const idx = html.indexOf(INJECT_AFTER, html.indexOf('page-schedule'));
if(idx === -1){ console.error('ERROR: grid-main not found in schedule page'); process.exit(1); }

const TABLE_HTML = `  <div style="overflow-x:auto;margin-bottom:20px;">
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

html = html.slice(0, idx) + TABLE_HTML + html.slice(idx);

if(html.length < original){ console.error('ERROR: file shrank!'); process.exit(1); }
fs.writeFileSync('index.html', html, 'utf8');
console.log('done: true - grew by ' + (html.length - original) + ' bytes');
