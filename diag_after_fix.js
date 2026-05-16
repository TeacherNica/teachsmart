// diag_after_fix.js — node diag_after_fix.js
const fs = require('fs');
const raw = fs.readFileSync('index.html', 'utf8');
const lines = raw.split('\n');

// 1. Count students in seed data
const match = raw.match(/let students = JSON\.parse[\s\S]*?\]\s*;/);
if (match) {
  const ids = match[0].match(/"id":\d+/g) || [];
  console.log(`Students in seed data: ${ids.length}`);
  console.log('IDs found:', ids.map(x => x.replace('"id":', '')).join(', '));
} else {
  console.log('Could not find students seed data');
}

// 2. Check Allen student
console.log('\n--- Allen in seed data? ---');
console.log(raw.includes('Allen') ? '✅ Allen found' : '❌ Allen NOT in seed data');

// 3. Check payments data
console.log('\n--- Payments/Earnings seed data ---');
lines.forEach((line, i) => {
  if (/ts-payments|ts-earnings|ts-vouchers|seedPayments|payments.*localStorage/i.test(line)) {
    console.log(`  Line ${i+1}: ${line.replace(/\r/,'').trim().substring(0,120)}`);
  }
});

// 4. Check localStorage.clear() impact — is there seed data for payments?
console.log('\n--- Any hardcoded payment data? ---');
const hasPaymentSeed = raw.includes('ts-payments') && raw.includes('setItem');
console.log(hasPaymentSeed ? '✅ Payment seed data exists' : '❌ No payment seed data — clearing localStorage wiped payments');

console.log('\n=== done ===');
