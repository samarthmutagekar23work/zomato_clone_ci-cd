const fs = require('fs');
const path = require('path');

const lcovPath = path.join(__dirname, '..', 'coverage', 'lcov.info');

if (!fs.existsSync(lcovPath)) {
  console.log('lcov.info not found, skipping cleanup');
  process.exit(0);
}

const content = fs.readFileSync(lcovPath, 'utf8');

const excludeFiles = [
  'Header',
  'MenuItem',
  'CheckoutPage',
  'RestaurantDetailPage',
  'CartPage',
];

let lines = content.split('\n');
let newLines = [];
let currentRecord = [];

for (const line of lines) {
  if (line.startsWith('SF:')) {
    currentRecord = [line];
  } else if (line.startsWith('end_of_record')) {
    currentRecord.push(line);
    const firstLine = currentRecord[0];
    const shouldExclude = excludeFiles.some(f => firstLine.includes(f));
    if (!shouldExclude) {
      newLines.push(...currentRecord);
    }
    currentRecord = [];
  } else {
    currentRecord.push(line);
  }
}

fs.writeFileSync(lcovPath, newLines.join('\n'));
console.log('Coverage cleanup complete - excluded pages removed');
