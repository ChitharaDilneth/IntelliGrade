const { parseTextMarks } = require('../utils/pdfParser');
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
 * Handles text content upload from client-side PDF parsing (pdf.js in browser).
 * Accepts { text, filename } JSON body instead of multipart PDF file.
 */
async function uploadTextContent(req, res, text, filename) {
  try {
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'PDF text content is empty.' });
    }

    const result = await parseTextMarks(text, filename || 'upload.pdf');

    return res.status(200).json({
      message: `PDF parsed successfully`,
      modules: result.modules,
      students: result.students
    });
  } catch (error) {
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

      const rawGpa = Math.round((weightedPointsSum / totalCredits) * 100) / 100;
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
  uploadTextContent,
  processMarks,
  downloadExcel,
  defaultGradingScale
};
