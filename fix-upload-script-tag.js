const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Find the orphaned function and check what's around it
const i = html.indexOf('function openUploadModal(){');
if (i === -1) {
  console.log('ERROR: openUploadModal not found');
  process.exit(1);
}

// Check 500 chars before the function
const before = html.substring(i - 500, i);
console.log('--- Before function ---');
console.log(before);

// Check if there's a <script> tag nearby
const lastScript = before.lastIndexOf('<script>');
const lastScriptClose = before.lastIndexOf('</script>');

console.log('\nlastScript position in before:', lastScript);
console.log('lastScriptClose position in before:', lastScriptClose);

if (lastScriptClose > lastScript) {
  console.log('\nFUNCTION IS OUTSIDE SCRIPT TAG - needs wrapping');
  // Add <script> before the function
  html = html.substring(0, i) + '<script>\n' + html.substring(i);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('done: true — Added script tag before openUploadModal');
} else {
  console.log('\nFunction appears to be inside a script tag already');
  console.log('done: false — No changes made');
}
