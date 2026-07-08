const fs = require('fs');
const path = require('path');
const { parsePdfMarks } = require('../src/utils/pdfParser');

const musicDir = 'C:\\Users\\Chithu\\Music';
const pdfFiles = [
  'DM.pdf',
  'DSA.pdf',
  'IS.pdf',
  'OOP.pdf',
  'TW.pdf'
];

async function testNewMusicPdfs() {
  console.log("==================================================");
  console.log("      TESTING PARSING ON USER'S NEW PDFs          ");
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
      const result = await parsePdfMarks(pdfBuffer, filename);
      
      console.log(`> Found modules:`, result.modules);
      console.log(`> Found ${result.students.length} student records.`);
      
      result.modules.forEach(mod => allModulesSet.add(mod));
      
      result.students.forEach(student => {
        const regNum = student.registrationNumber.toUpperCase();
        if (!combinedStudentsMap[regNum]) {
          combinedStudentsMap[regNum] = {
            registrationNumber: regNum,
            marks: {},
            grades: {}
          };
        }
        Object.assign(combinedStudentsMap[regNum].marks, student.marks);
        if (student.grades) {
          Object.assign(combinedStudentsMap[regNum].grades, student.grades);
        }
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

testNewMusicPdfs();
