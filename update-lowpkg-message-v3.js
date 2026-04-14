const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const oldMsg = `var msg = 'Hi! Just a friendly reminder that ' + s.name + ' only has ' + (s.classes || 0) + ' class(es) remaining in their package. Please renew soon so we can keep the learning going! Thank you \\uD83D\\uDE0A';`;

const newMsg = `var hour = new Date().getHours();
        var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        var msg = greeting + '! Just a friendly reminder that ' + s.name + ' only has ' + (s.classes || 0) + ' class(es) remaining in her package. Please let me know if you wish to continue the package, and I would be happy to prepare the QR code for you.';`;

if (!html.includes(oldMsg)) {
  console.log('ERROR: Could not find the old message text. It may have already been updated.');
  console.log('done: false');
  process.exit(1);
}

html = html.replace(oldMsg, newMsg);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('done: true — Message updated successfully!');
