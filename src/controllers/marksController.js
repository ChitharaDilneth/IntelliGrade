const fs = require('fs');
const { parsePdfMarks } = require('../utils/pdfParser');
const { generateExcelReport } = require('../utils/excelGenerator');

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

/**
 * Maps a numerical mark to grade points based on grading scale
 */
function getGradePoint(mark, scale) {
  const activeScale = scale || defaultGradingScale;
  const sortedScale = [...activeScale].sort((a, b) => b.min - a.min);
  for (const range of sortedScale) {
    if (mark >= range.min) {
      return range.gpa;
    }
  }
  return 0.0;
}

/**
 * Maps a grade letter directly to grade points
 */
function getGpaByGradeName(gradeName, scale) {
  const activeScale = scale || defaultGradingScale;
  const match = activeScale.find(item => item.grade.toUpperCase() === gradeName.toUpperCase());
  return match ? match.gpa : 0.0;
}

/**
 * Handles PDF Upload and auto-identifies modules & students
 */
async function uploadPdf(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'කරුණාකර PDF ගොනු (එකක් හෝ කිහිපයක්) තෝරන්න.' });
    }

    const allModulesSet = new Set();
    const combinedStudentsMap = {};

    // Deduplicate files by original filename (prevent same PDF being submitted twice)
    const seenFilenames = new Set();
    const uniqueFiles = req.files.filter(file => {
      if (seenFilenames.has(file.originalname)) {
        console.warn(`Duplicate file skipped: ${file.originalname}`);
        return false;
      }
      seenFilenames.add(file.originalname);
      return true;
    });

    // Process all unique files — use file.buffer (memoryStorage, Vercel-compatible)
    for (const file of uniqueFiles) {
      const pdfBuffer = file.buffer;
      
      const result = await parsePdfMarks(pdfBuffer, file.originalname);
        
      // Add modules to set
      result.modules.forEach(mod => allModulesSet.add(mod));
        
      // Merge student records
      result.students.forEach(student => {
        const regNum = student.registrationNumber.toUpperCase();
        if (!combinedStudentsMap[regNum]) {
          combinedStudentsMap[regNum] = {
            registrationNumber: regNum,
            marks: {},
            grades: {}
          };
        }
        // Merge student marks
        Object.assign(combinedStudentsMap[regNum].marks, student.marks);
        // Merge student grades
        if (student.grades) {
          Object.assign(combinedStudentsMap[regNum].grades, student.grades);
        }
      });
    }

    const finalModules = Array.from(allModulesSet);
    
    // Ensure all students have all modules populated in their marks and grades (use E as default grade)
    const finalStudents = Object.values(combinedStudentsMap).map(student => {
      finalModules.forEach(mod => {
        if (student.marks[mod] === undefined) {
          student.marks[mod] = 0;
        }
        if (!student.grades) {
          student.grades = {};
        }
        if (student.grades[mod] === undefined) {
          student.grades[mod] = 'E';
        }
      });
      return student;
    });

    return res.status(200).json({
      message: `${req.files.length} PDF files processed successfully`,
      modules: finalModules,
      students: finalStudents
    });
  } catch (error) {
    // Cleanup any remaining uploaded files in case of error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          try { fs.unlinkSync(file.path); } catch (e) {}
        }
      });
    }
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handles processing and GPA calculations based on credits
 */
function processMarks(req, res) {
  try {
    const { students, modules, credits, gradingScale } = req.body;

    if (!students || !modules || !credits) {
      return res.status(400).json({ error: 'අසම්පූර්ණ දත්ත (Missing students, modules, or credits).' });
    }

    // Verify credits are numeric
    const parsedCredits = {};
    let totalCredits = 0;
    
    modules.forEach(mod => {
      const creditVal = parseFloat(credits[mod]);
      if (isNaN(creditVal) || creditVal <= 0) {
        throw new Error(`"${mod}" Module එක සඳහා ලබා දී ඇති Credit ප්‍රමාණය වලංගු නොවේ.`);
      }
      parsedCredits[mod] = creditVal;
      totalCredits += creditVal;
    });

    if (totalCredits === 0) {
      throw new Error('මුළු Credit ප්‍රමාණය 0 විය නොහැක.');
    }

    // Process students and calculate GPAs
    const processedStudents = students.map(student => {
      let weightedPointsSum = 0;
      const studentGrades = {};

      modules.forEach(mod => {
        const credit = parsedCredits[mod];
        let gp = 0.0;
        let gradeName = 'E';

        // Check if student has a pre-parsed grade string (e.g. from SLIIT PDF)
        const hasParsedGrade = student.grades && student.grades[mod];
        if (hasParsedGrade) {
          const parsedGradeStr = typeof student.grades[mod] === 'string' ? student.grades[mod] : student.grades[mod].grade;
          if (parsedGradeStr) {
            gradeName = parsedGradeStr;
            gp = getGpaByGradeName(gradeName, gradingScale);
          }
        } else {
          // Fallback to mapping from mark
          const mark = student.marks[mod] !== undefined ? student.marks[mod] : 0;
          gp = getGradePoint(mark, gradingScale);
          
          const activeScale = gradingScale || defaultGradingScale;
          const sortedScale = [...activeScale].sort((a, b) => b.min - a.min);
          for (const range of sortedScale) {
            if (mark >= range.min) {
              gradeName = range.grade;
              break;
            }
          }
        }

        weightedPointsSum += gp * credit;
        studentGrades[mod] = { 
          mark: student.marks[mod] !== undefined ? student.marks[mod] : 0, 
          grade: gradeName, 
          gpa: gp 
        };
      });

      const rawGpa = weightedPointsSum / totalCredits;
      // We will save precise GPA for sorting, and string version for formatted display
      return {
        registrationNumber: student.registrationNumber.toUpperCase(),
        grades: studentGrades,
        marks: student.marks, // original marks map
        gpa: rawGpa
      };
    });

    // 4. Sorting logic: Descending precise GPA, then Ascending Registration Number (localeCompare)
    processedStudents.sort((a, b) => {
      // Comparison using precise floats (decimal places)
      if (b.gpa !== a.gpa) {
        return b.gpa - a.gpa;
      }
      // Alphanumeric ascending sort for registration number
      return a.registrationNumber.localeCompare(b.registrationNumber);
    });

    return res.status(200).json({
      modules,
      credits: parsedCredits,
      students: processedStudents
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Generates and downloads Excel file
 */
async function downloadExcel(req, res) {
  try {
    const { students, modules, shortNames } = req.body;

    if (!students || !modules) {
      return res.status(400).json({ error: 'Excel ගොනුව සාදා ගැනීමට ප්‍රමාණවත් දත්ත ලැබී නැත.' });
    }

    const excelBuffer = await generateExcelReport(students, modules, shortNames);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=GPA_Report.xlsx');
    
    return res.send(excelBuffer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  uploadPdf,
  processMarks,
  downloadExcel,
  defaultGradingScale
};
