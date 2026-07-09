const { parseTextMarks } = require('C:/Users/Chithu/Desktop/IntelliGrade/src/utils/pdfParser');

// Let's create a simulated pipe-delimited text layout matching the user's screenshot
let text = "Index No. | Grade | Index No. | Grade | Index No. | Grade | Index No. | Grade\n";
for (let r = 1; r <= 31; r++) {
  const rowNum = 225000 + r;
  text += `${rowNum}P | B+ | ${rowNum}U | A- | ${rowNum}D | A | ${rowNum}G | B+\n`;
}

// We want to debug parseStructuredText step by step:
const GENERAL_REG_NO_REGEX = /\b(?:IT|SE|IE|BM|EN|EG)\d{7,8}\b|\b(?:IT|SE|IE|BM|EN|EG)\s*\d{2}\s*\d{4}\s*\d{2}\b|\b[A-Z0-9]{2,4}(?:[/-][A-Z0-9]{1,4}){2,4}\b|\b[A-Z]{1,2}[/-]\d{2,4}[/-]\d{3,4}\b|\b\d{6}[A-Z]\b|\b[A-Z]{1,3}\d{5,8}\b|\b\d{5,8}[A-Z]{1,3}\b|\b\d{7,9}\b/i;
const GRADE_REGEX = /^(?:[A-D][+-]?|E|F|F\+|I|I-?C|AB|PASS|FAIL)$/i;

const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
const structuredLines = lines.filter(l => l.includes('|'));
const grid = structuredLines.map(line => line.split('|').map(cell => cell.trim()));
const numCols = Math.max(...grid.map(row => row.length));

console.log("numCols:", numCols);

const colStats = Array.from({ length: numCols }, () => ({
  regCount: 0,
  numberCount: 0,
  gradeCount: 0,
  wordCount: 0,
  emptyCount: 0
}));

grid.forEach(row => {
  for (let c = 0; c < numCols; c++) {
    const cell = row[c] || "";
    if (!cell) {
      colStats[c].emptyCount++;
      continue;
    }
    if (GENERAL_REG_NO_REGEX.test(cell)) {
      colStats[c].regCount++;
    } else if (GRADE_REGEX.test(cell)) {
      colStats[c].gradeCount++;
    }
  }
});

console.log("Col Stats:");
colStats.forEach((s, idx) => {
  console.log(`Col ${idx}: totalFilled=${grid.length - s.emptyCount}, regCount=${s.regCount}, gradeCount=${s.gradeCount}`);
});

const regColIndices = [];
for (let c = 0; c < numCols; c++) {
  const totalFilled = grid.length - colStats[c].emptyCount;
  if (totalFilled > 0 && colStats[c].regCount / totalFilled > 0.4) {
    regColIndices.push(c);
  }
}
console.log("regColIndices:", regColIndices);
