const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const updates = {
  101: { classes: 46, total: 54 },  // K.Bella
  102: { classes: 41, total: 52 },  // Jackie
  103: { classes: 6,  total: 30 },  // Lina
  104: { classes: 5,  total: 25 },  // Aiden
  105: { classes: 6,  total: 27 },  // Sophia
  106: { classes: 23, total: 52 },  // Peter
  107: { classes: 10, total: 52 },  // Seah
  108: { classes: 13, total: 30 },  // Suri
  109: { classes: 10, total: 32 },  // Bella
  110: { classes: 2,  total: 20 },  // COCO-1
  111: { classes: 2,  total: 27 },  // Harry
  112: { classes: 11, total: 11 },  // Kelly-Adult
  113: { classes: 18, total: 20 },  // KAREN
  114: { classes: 32, total: 52 },  // Mollie-Adult & Steven
  115: { classes: 22, total: 27 },  // Coco-2
  116: { classes: 26, total: 30 },  // Koala
  117: { classes: 22, total: 27 },  // Owen
  118: { classes: 20, total: 27 },  // Rainy
  119: { classes: 25, total: 27 },  // Shily
  120: { classes: 3,  total: 30 },  // Carl
};

// Find the seed data block
const seedStart = html.indexOf('// ─── SEED DATA ───');
const seedEnd = html.indexOf('];', seedStart) + 2;

if (seedStart === -1) {
  console.log('ERROR: Could not find SEED DATA block');
  process.exit(1);
}

let seedBlock = html.substring(seedStart, seedEnd);

// Update each student by id
Object.keys(updates).forEach(function(id) {
  const u = updates[id];
  // Match "id":101, and update classes and total values nearby
  const idPattern = new RegExp('"id":' + id + ',([^}]+)"classes":\\d+,"total":\\d+');
  seedBlock = seedBlock.replace(idPattern, function(match) {
    return match
      .replace(/"classes":\d+/, '"classes":' + u.classes)
      .replace(/"total":\d+/, '"total":' + u.total);
  });
});

html = html.substring(0, seedStart) + seedBlock + html.substring(seedEnd);
fs.writeFileSync(indexPath, html, 'utf8');

console.log('Seed data updated with correct package numbers:');
Object.keys(updates).forEach(function(id) {
  console.log('  ID ' + id + ': ' + updates[id].classes + ' left of ' + updates[id].total);
});
console.log('\ndone: true');
