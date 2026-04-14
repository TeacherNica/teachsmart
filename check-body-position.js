const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

const bodyClose = h.lastIndexOf('</body>');
const htmlClose = h.lastIndexOf('</html>');
const funcPos = h.indexOf('function openUploadModal');

console.log('</body> position:', bodyClose);
console.log('</html> position:', htmlClose);
console.log('openUploadModal position:', funcPos);
console.log('File length:', h.length);

console.log('\nopenUploadModal is AFTER </body>:', funcPos > bodyClose ? 'YES - THIS IS THE PROBLEM' : 'NO');

// Show what's around </body>
console.log('\n--- Around </body> ---');
console.log(h.substring(bodyClose - 100, bodyClose + 200));
