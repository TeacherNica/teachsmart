const fs = require('fs');
const path = './index.html';

let html = fs.readFileSync(path, 'utf8');

// Check current ending
const tail = html.slice(-200);
console.log('Current file ending:');
console.log(JSON.stringify(tail));

// Only add if missing
if (!html.includes('</body>') && !html.includes('</html>')) {
  html = html + '\n</body>\n</html>';
  fs.writeFileSync(path, html, 'utf8');
  console.log('\ndone: true — Added </body></html> to end of file.');
} else if (!html.includes('</body>')) {
  html = html.replace('</html>', '\n</body>\n</html>');
  fs.writeFileSync(path, html, 'utf8');
  console.log('\ndone: true — Added missing </body> tag.');
} else {
  console.log('\nFile already has closing tags. No changes made.');
  console.log('done: true');
}
