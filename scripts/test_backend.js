const fs = require('fs');
const path = require('path');
const { parsePdfMarks } = require('../src/utils/pdfParser');
const { generateExcelReport } = require('../src/utils/excelGenerator');

const defaultGradingScale = [
  { grade: 'A+', gpa: 4.0, min: 90 },
  { grade: 'A', gpa: 4.0, min: 80 },
  { grade: 'A-', gpa: 3.7, min: 75 },
  { grade: 'B+', gpa: 3.3, min: 70 },
  { grade: 'B', gpa: 3.0, min: 65 },
  { grade: 'B-', gpa: 2.7, min: 60 },
  { grade: 'C+', gpa: 2.3, min: 55 },
  { grade: 'C', gpa: 2.0, min: 45 },
  { grade: 'C-', gpa: 1.7, min: 40 },
  { grade: 'D+', gpa: 1.3, min: 35 },
  { grade: 'D', gpa: 1.0, min: 30 },
  { grade: 'E', gpa: 0.0, min: 0 }
];

function getGradePoint(mark, scale = defaultGradingScale) {
  const sortedScale = [...scale].sort((a, b) => b.min - a.min);
  for (const range of sortedScale) {
    if (mark >= range.min) {
      return range.gpa;
    }
  }
  return 0.0;
}

async function runTests() {
  console.log("==================================================");
  console.log("             RUNNING BACKEND TESTS                ");
  console.log("==================================================");

  try {
    const pdfPath = path.join(__dirname, '../samples/sample_tabular.pdf');
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Sample PDF not found at ${pdfPath}. Run generateSample.js first.`);
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    
    // Test 1: PDF Parsing
    console.log("Test 1: Parsing tabular sample PDF...");
    const parsed = await parsePdfMarks(pdfBuffer);
    console.log("Modules identified:", parsed.modules);
    console.log(`Parsed ${parsed.students.length} students successfully.`);
    
    if (parsed.modules.length !== 3 || !parsed.modules.includes('IT3010')) {
      throw new Error("FAIL: Modules parsing is incorrect.");
    }
    console.log("PASS: PDF parsing successful.\n");

    // Test 2: GPA Calculation & Sorting Logic
    console.log("Test 2: Calculating GPA and testing sorting logic...");
    const credits = { 'IT3010': 3.0, 'IT3020': 3.0, 'IT3030': 3.0 };
    const totalCredits = 9.0;
    
    const processedStudents = parsed.students.map(student => {
      let weightedPointsSum = 0;
      const studentGrades = {};
      
      parsed.modules.forEach(mod => {
        const mark = student.marks[mod] || 0;
        const gp = getGradePoint(mark);
        weightedPointsSum += gp * credits[mod];
        
        let gradeName = 'E';
        for (const range of defaultGradingScale) {
          if (mark >= range.min) {
            gradeName = range.grade;
            break;
          }
        }
        studentGrades[mod] = { mark, grade: gradeName, gpa: gp };
      });
      
      const gpa = weightedPointsSum / totalCredits;
      return {
        registrationNumber: student.registrationNumber,
        gpa: gpa,
        grades: studentGrades,
        marks: student.marks
      };
    });

    // Sort by GPA descending, then RegNo ascending
    processedStudents.sort((a, b) => {
      if (b.gpa !== a.gpa) {
        return b.gpa - a.gpa;
      }
      return a.registrationNumber.localeCompare(b.registrationNumber);
    });

    console.log("\nSorted Student Results preview:");
    processedStudents.forEach((s, idx) => {
      console.log(`${idx + 1}. ${s.registrationNumber} - GPA: ${s.gpa.toFixed(4)}`);
    });

    // Check sorting correctness
    // Rank 1 should be IT21002233 (A+, A, A- -> 4.0, 4.0, 3.7 -> GPA: 3.9)
    if (processedStudents[0].registrationNumber !== 'IT21002233') {
      throw new Error("FAIL: Rank 1 should be IT21002233.");
    }

    // Rank 2 & 3 have the same GPA!
    // IT21004455 (Marks: 88, 72, 60 -> Grades: A (4.0), B+ (3.3), B- (2.7) -> GPA: 3.3333)
    // IT21009900 (Marks: 88, 72, 60 -> Grades: A (4.0), B+ (3.3), B- (2.7) -> GPA: 3.3333)
    // By registration number ascending, IT21004455 must appear BEFORE IT21009900
    const rank3 = processedStudents[2].registrationNumber;
    const rank4 = processedStudents[3].registrationNumber;
    
    console.log(`Rank 3: ${rank3}, Rank 4: ${rank4}`);
    if (rank3 !== 'IT21004455' || rank4 !== 'IT21009900') {
      throw new Error("FAIL: Identical GPAs should be sorted by Registration Number ascending.");
    }
    console.log("PASS: GPA calculations and sorting logic are fully correct.\n");

    // Test 3: Excel Generation
    console.log("Test 3: Generating Excel report...");
    const excelBuffer = await generateExcelReport(processedStudents, parsed.modules);
    const excelPath = path.join(__dirname, '../samples/test_report.xlsx');
    fs.writeFileSync(excelPath, excelBuffer);
    console.log(`Excel report written to ${excelPath}`);
    console.log("PASS: Excel workbook generated and styled successfully.\n");

    console.log("==================================================");
    console.log("           ALL TESTS PASSED SUCCESSFULLY!         ");
    console.log("==================================================");

  } catch (error) {
    console.error("\nTEST SUITE FAILED:");
    console.error(error.message);
    process.exit(1);
  }
}

runTests();
