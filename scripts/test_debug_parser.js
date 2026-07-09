const { parseTextMarks } = require('C:/Users/Chithu/Desktop/IntelliGrade/src/utils/pdfParser');

let text = "Index No. | Grade | Index No. | Grade | Index No. | Grade | Index No. | Grade\n";
for (let r = 1; r <= 31; r++) {
  const rowNum = 225000 + r;
  text += `${rowNum}P | B+ | ${rowNum}U | A- | ${rowNum}D | A | ${rowNum}G | B+\n`;
}

(async () => {
  try {
    const result = await parseTextMarks(text, "SimulatedExam.pdf");
    console.log("Result keys:", Object.keys(result));
    console.log("Modules:", result.modules);
    console.log("Students count:", result.students.length);
  } catch (err) {
    console.error("Error:", err);
  }
})();
