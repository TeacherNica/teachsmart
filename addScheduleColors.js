const fs = require('fs');

// ── Read file ──────────────────────────────────────────────────────────────
const filePath = 'index.html';
let html = fs.readFileSync(filePath, 'utf8');
const originalLength = html.length;

// ── Student nationality + pastel color map ────────────────────────────────
// These are inserted as data into the schedule cell renderer.
// We inject a JS object literal into the page's existing <script> block.

const INJECT_MARKER = '// __SCHEDULE_COLORS_INJECTED__';

// Don't double-inject
if (html.includes(INJECT_MARKER)) {
  console.log('⚠️  Schedule color data already injected. Nothing changed.');
  process.exit(0);
}

// ── The data block we want to inject ──────────────────────────────────────
// We place this right after the opening <script> tag that contains
// the student/schedule data (identifiable by the scheduleData or
// similar variable).  We'll inject just before the renderSchedule
// or equivalent function.
//
// Strategy: find the schedule grid render section by looking for
// the unique string that builds schedule cells, then wrap each
// student name span with flag + pastel background.

// ── Nationality lookup ────────────────────────────────────────────────────
const nationalityData = `
  // ${INJECT_MARKER}
  const studentNationality = {
    'Suri':          { flag: '🇨🇳', color: '#FFE4E1' },   // misty rose
    'Bella':         { flag: '🇨🇳', color: '#FFE4E1' },
    'COCO-1':        { flag: '🇨🇳', color: '#FFF0E0' },   // peach
    'Harry':         { flag: '🇨🇳', color: '#FFF0E0' },
    'Kelly':         { flag: '🇨🇳', color: '#E8F5E9' },   // mint
    'Kelly-Adult':   { flag: '🇨🇳', color: '#E8F5E9' },
    'KAREN':         { flag: '🇨🇳', color: '#E8F5E9' },
    'Mollie-Adult':  { flag: '🇨🇳', color: '#FFF9C4' },   // lemon
    'Steven':        { flag: '🇨🇳', color: '#FFF9C4' },
    'Coco-2':        { flag: '🇨🇳', color: '#FFF0E0' },
    'Koala':         { flag: '🇨🇳', color: '#E3F2FD' },   // sky blue
    'Owen':          { flag: '🇨🇳', color: '#E3F2FD' },
    'Rainy':         { flag: '🇨🇳', color: '#F3E5F5' },   // lavender
    'Shily':         { flag: '🇨🇳', color: '#F3E5F5' },
    'Carl':          { flag: '🇨🇳', color: '#FAFAFA' },
    'K.Bella':       { flag: '🇰🇷', color: '#FCE4EC' },   // rose pink
    'Jackie':        { flag: '🇰🇷', color: '#FCE4EC' },
    'Lina':          { flag: '🇰🇷', color: '#EDE7F6' },   // soft purple
    'Aiden':         { flag: '🇰🇷', color: '#EDE7F6' },
    'Sophia':        { flag: '🇰🇷', color: '#E0F7FA' },   // aqua
    'Peter':         { flag: '🇰🇷', color: '#E0F7FA' },
    'Seah':          { flag: '🇰🇷', color: '#FFF8E1' },   // butter
  };

  function getStudentMeta(name) {
    // Try exact match first, then partial
    if (studentNationality[name]) return studentNationality[name];
    const key = Object.keys(studentNationality).find(k =>
      name.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(name.toLowerCase())
    );
    return key ? studentNationality[key] : { flag: '', color: '#F5F5F5' };
  }
`;

// ── Find injection point ───────────────────────────────────────────────────
// Look for the schedule rendering function. Common patterns in the app:
// "function renderSchedule", "function renderWeeklySchedule",
// "function buildScheduleGrid", or the schedule tab section.
// We look for a reliable anchor near schedule cell creation.

// The schedule grid cells typically contain the student name in a span.
// We want to find where schedule cells are constructed and add styling.
// 
// The safest injection point: find the first <script> tag after </style>
// and inject our lookup table there.

const scriptTagIndex = html.indexOf('<script>');
if (scriptTagIndex === -1) {
  console.error('❌ Could not find <script> tag. Aborting.');
  process.exit(1);
}

// Inject the nationality data right after the opening <script> tag
html = html.slice(0, scriptTagIndex + 8) + nationalityData + html.slice(scriptTagIndex + 8);

// ── Now patch the schedule cell rendering ─────────────────────────────────
// We need to find where schedule grid cells are rendered.
// Typical pattern: a loop that outputs student name into a div/span.
// 
// Look for patterns like:
//   ${cls.student}  or  ${student.name}  or  class="schedule-cell"
// and enhance them.
//
// IMPORTANT: We only patch the schedule grid section. We look for
// a narrow, unique string to replace.

// Pattern A: look for where student names are put into schedule cells
// The app likely has something like:
//   `<div class="schedule-cell">${studentName}`
// or
//   `<span class="student-name">${s.name}`

// Let's search for likely cell-building patterns
const patterns = [
  // pattern: bare student name in a cell div
  /<div class="schedule-cell(?:[^"]*)">\s*\$\{([^}]+)\}/,
  // pattern: schedule item with student name
  /class="sched-item[^"]*">[^<]*\$\{([^.}]+)(?:\.name|\.student)?\}/,
];

// Rather than guessing the exact template string, we'll inject a
// post-processing function that patches the rendered HTML of the
// schedule grid after it's built.
//
// This is the safest approach: we hook into the existing render
// without touching its logic — we just colorize the output.

const POST_PROCESS_INJECT = `
  // __SCHEDULE_COLORS_POST_PROCESS__
  function applyScheduleColors() {
    // Find all schedule cells in the grid and apply pastel colors + flags
    const cells = document.querySelectorAll(
      '.schedule-cell, .sched-cell, .sched-item, .grid-cell, [data-student]'
    );
    cells.forEach(cell => {
      const nameEl = cell.querySelector('.student-name, .cell-name, strong, b') || cell;
      const rawText = nameEl.textContent.trim();
      if (!rawText) return;

      // Skip if already colored
      if (cell.dataset.colorized) return;
      cell.dataset.colorized = 'true';

      const meta = getStudentMeta(rawText);
      cell.style.backgroundColor = meta.color;
      cell.style.borderRadius = '6px';
      cell.style.cursor = 'pointer';

      // Add flag if not already there
      if (meta.flag && !nameEl.textContent.includes(meta.flag)) {
        nameEl.textContent = meta.flag + ' ' + nameEl.textContent.trim();
      }

      // Make name clickable → navigate to Students tab and highlight
      cell.addEventListener('click', function(e) {
        e.stopPropagation();
        // Switch to students tab
        const studentsTab = document.querySelector('[data-tab="students"], [onclick*="students"], #nav-students');
        if (studentsTab) studentsTab.click();
        // After tab switch, scroll to matching student card
        setTimeout(() => {
          const cards = document.querySelectorAll('.student-card, .student-item, [data-name]');
          for (const card of cards) {
            const cardText = card.textContent || card.dataset.name || '';
            if (cardText.toLowerCase().includes(rawText.toLowerCase().replace(/^[🇨🇳🇰🇷] /, ''))) {
              card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              card.style.outline = '3px solid #6366f1';
              card.style.transition = 'outline 0.3s';
              setTimeout(() => { card.style.outline = ''; }, 2000);
              break;
            }
          }
        }, 300);
      });
    });
  }

  // Re-apply colors whenever the schedule tab is shown or navigation changes
  const _origApplyScheduleColors = window.applyScheduleColors;
  window.applyScheduleColors = applyScheduleColors;
`;

// Find a good place to inject the post-processor — right after our data block
const markerPos = html.indexOf(INJECT_MARKER);
if (markerPos === -1) {
  console.error('❌ Injection marker not found after first inject. Something went wrong.');
  process.exit(1);
}
// Find end of the nationalityData block (closing semicolon of getStudentMeta)
const insertAfter = html.indexOf('  }\n', markerPos) + 4;
html = html.slice(0, insertAfter) + POST_PROCESS_INJECT + html.slice(insertAfter);

// ── Hook applyScheduleColors into the page lifecycle ──────────────────────
// Find where the app initialises or where tabs are switched.
// We look for DOMContentLoaded or the init function.
const HOOK_CODE = `
    // Hook schedule color application
    document.addEventListener('click', function(e) {
      const target = e.target;
      if (
        (target.dataset && target.dataset.tab === 'schedule') ||
        (target.id && target.id.includes('schedule')) ||
        (target.className && typeof target.className === 'string' && target.className.includes('schedule'))
      ) {
        setTimeout(applyScheduleColors, 100);
        setTimeout(applyScheduleColors, 600);
      }
    }, true);

    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(applyScheduleColors, 500);
      setTimeout(applyScheduleColors, 1500);
      // Observe DOM changes in schedule section
      const observer = new MutationObserver(function(mutations) {
        const inSchedule = mutations.some(m =>
          m.target.closest && (
            m.target.closest('#schedule') ||
            m.target.closest('[data-tab="schedule"]') ||
            m.target.closest('.schedule-grid') ||
            m.target.closest('.weekly-grid')
          )
        );
        if (inSchedule) applyScheduleColors();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
`;

// Inject hook before </script> closing tag (find last one to be safe)
// Actually inject before the first </body> tag
const bodyCloseIdx = html.lastIndexOf('</body>');
if (bodyCloseIdx === -1) {
  console.error('❌ Could not find </body> tag. Aborting.');
  process.exit(1);
}

const hookScript = `\n<script>\n${HOOK_CODE}\n</script>\n`;
html = html.slice(0, bodyCloseIdx) + hookScript + html.slice(bodyCloseIdx);

// ── Verify & write ─────────────────────────────────────────────────────────
if (html.length < originalLength) {
  console.error(`❌ File shrank! Original: ${originalLength}, New: ${html.length}. Aborting.`);
  process.exit(1);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log(`✅ Done! File grew by ${html.length - originalLength} bytes.`);
console.log('   • Nationality + color lookup table injected');
console.log('   • applyScheduleColors() post-processor injected');
console.log('   • DOM observer + click hook injected before </body>');
console.log('');
console.log('Next steps:');
console.log('  git add .');
console.log('  git commit -m "feat: pastel colors + flags + clickable names on schedule grid"');
console.log('  git push');
