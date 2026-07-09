const { parseTextMarks } = require('C:/Users/Chithu/Desktop/IntelliGrade/src/utils/pdfParser');

// Let's create a simulated pipe-delimited text layout matching the user's screenshot
let text = "Index No. | Grade | Index No. | Grade | Index No. | Grade | Index No. | Grade\n";
for (let r = 1; r <= 31; r++) {
  const rowNum = 225000 + r;
  text += `${rowNum}A | B+ | ${rowNum}B | A- | ${rowNum}C | A | ${rowNum}D | B+\n`;
}

console.log("Simulating 31 rows of 4 side-by-side columns (total 124 students)...");
try {
  const result = parseTextMarks(text, "SimulatedExam.pdf");
  console.log("Modules identified:", result.modules);
  console.log("Total students parsed:", result.students.length);
  
  // Print first 5 and last 5 students
  console.log("\nFirst 5 students:");
  console.log(result.students.slice(0, 5));
  console.log("\nLast 5 students:");
  console.log(result.students.slice(-5));
} catch (err) {
  console.error("Error parsing:", err);
}
