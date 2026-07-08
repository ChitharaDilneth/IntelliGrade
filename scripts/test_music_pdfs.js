const fs = require('fs');
const path = require('path');
const { parsePdfMarks } = require('../src/utils/pdfParser');

const musicDir = 'C:\\Users\\Chithu\\Music';
const pdfFiles = [
  'IE1011 - June - Regular - Grades Report - 2026 February June Semester.pdf',
  'IT 1150 -Regular (1).pdf',
  'IT1170 - REGULAR - ALL.pdf',
  'Regular_Provisional_IT1160.pdf',
  'SE1020 - Regular - All Centers.pdf'
];

async function testMusicPdfs() {
  console.log("==================================================");
  console.log("      TESTING PARSING ON USER'S MUSIC PDFs        ");
  console.log("==================================================");

  const allModulesSet = new Set();
  const combinedStudentsMap = {};

  for (const filename of pdfFiles) {
    const filePath = path.join(musicDir, filename);
    console.log(`\nParsing: ${filename}...`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File does not exist at ${filePath}`);
      continue;
    }

    try {
      const pdfBuffer = fs.readFileSync(filePath);
      const result = await parsePdfMarks(pdfBuffer);
      
      console.log(`> Found ${result.modules.length} modules:`, result.modules);
      console.log(`> Found ${result.students.length} student records.`);
      
      result.modules.forEach(mod => allModulesSet.add(mod));
      
      result.students.forEach(student => {
        const regNum = student.registrationNumber.toUpperCase();
        if (!combinedStudentsMap[regNum]) {
          combinedStudentsMap[regNum] = {
            registrationNumber: regNum,
            marks: {}
          };
        }
        Object.assign(combinedStudentsMap[regNum].marks, student.marks);
      });
    } catch (e) {
      console.error(`> Error parsing ${filename}:`);
      console.error(e.message);
    }
  }

  const finalModules = Array.from(allModulesSet);
  const finalStudentsCount = Object.keys(combinedStudentsMap).length;

  console.log("\n==================================================");
  console.log("              COMBINED RESULTS                    ");
  console.log("==================================================");
  console.log("Total unique modules identified:", finalModules);
  console.log("Total unique students identified:", finalStudentsCount);
  
  if (finalStudentsCount > 0) {
    const sampleKey = Object.keys(combinedStudentsMap)[0];
    console.log(`Sample Student Record (${sampleKey}):`, combinedStudentsMap[sampleKey]);
  }
}

testMusicPdfs();
