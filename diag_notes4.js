const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

console.log('=== Replacing Today\'s Schedule card with Class Notes ===');

// Find the exact old section using what we know from diagnostic
const oldSection = `        <div class="card-title" style="justify-content:space-between;">\r\n          <span>📅 Today's Schedule</span>\r\n          <div style="display:flex;gap:4px;">\r\n            <div style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;background:#F3F4F6;cursor:pointer;">◀</div>\r\n            <div style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;background:linear-gradient(135deg,var(--purple),var(--blue));color:white;cursor:pointer;">Today</div>\r\n            <div style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;background:#F3F4F6;cursor:pointer;">▶</div>\r\n          </div>\r\n        </div>\r\n        <div id="schedule-list"></div>\r\n        <div style="margin-top:12px;padding:10px 12px;background:#FFF1F2;border-radius:12px;font-size:12px;font-weight:700;color:#BE123C;">⚠️ Noo-show = counted as completed &amp; deducted from p`;

// Use index-based approach instead
const schedPage = content.indexOf('id="page-schedule"');
const todayIdx = content.indexOf("Today's Schedule", schedPage);

// Find the start of this card div
const cardStart = content.lastIndexOf('<div class="card">', todayIdx);
// Find the end - look for closing </div> of the card
// The card ends before the next sibling card or section
const cardEnd = content.indexOf('</div>\n', todayIdx + 500);
const cardEndCRLF = content.indexOf('</div>\r\n', todayIdx + 500);
const actualEnd = Math.min(
  cardEnd === -1 ? Infinity : cardEnd,
  cardEndCRLF === -1 ? Infinity : cardEndCRLF
);

console.log('Card starts at:', cardStart);
console.log('Looking for end after:', todayIdx + 500);
console.log('Card ends at:', actualEnd);

// Show what we found
console.log('\nCard content:');
console.log(content.substring(cardStart, actualEnd + 10));

// Now find the exact end of the warning div
const warningEnd = content.indexOf('</div>', todayIdx + 400);
const fullEnd = content.indexOf('</div>', warningEnd + 1) + 6; // closing card div

console.log('\n=== Will replace from', cardStart, 'to', fullEnd, '===');
console.log(content.substring(cardStart, fullEnd));
