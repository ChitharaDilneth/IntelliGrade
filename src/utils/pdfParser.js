const pdfParse = require('pdf-parse');
const path = require('path');

// Robust registration number regex; avoid matching short module codes like IT3010
const REG_NO_REGEX = /\b(IT\d{7,8}|SE\d{7,8}|IE\d{7,8}|BM\d{7,8}|EN\d{7,8}|EG\d{7,8}|[A-Z]{2,4}\d{6,9}|[A-Z]{2,4}[/-]\d{2,4}(?:[/-]\d{2,4})?[/-]\d{3,4})\b/i;

function cleanText(text) {
  return text.split('\n').map(line => line.trim()).filter(Boolean);
}

/**
 * Extracts raw text from PDF buffer using standard pdf-parse.
 */
async function extractTextWithPdfParse(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  if (data && data.text && data.text.trim().length > 0) {
    return data.text;
  }
  throw new Error("Empty text extracted by pdf-parse");
}

/**
 * Extracts raw text from PDF buffer using pdfjs-dist and reconstructs lines.
 * This is highly robust for tabular data where column chunks get scrambled.
 * Run page extraction in parallel using Promise.all for high performance.
 */
async function extractTextWithPdfjs(pdfBuffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBuffer),
    useSystemFonts: true,
    disableFontFace: true
  });
  const pdfDoc = await loadingTask.promise;
  
  const pagePromises = [];
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    pagePromises.push((async (pageNumber) => {
      const page = await pdfDoc.getPage(pageNumber);
      const textContent = await page.getTextContent();
      
      // Group items by Y coordinate (baseline alignment)
      const linesMap = {};
      const threshold = 5; // points
      
      textContent.items.forEach(item => {
        if (!item.str || item.str.trim() === '') return;
        
        const x = item.transform[4];
        const y = item.transform[5];
        
        let foundKey = null;
        for (const k of Object.keys(linesMap)) {
          if (Math.abs(parseFloat(k) - y) < threshold) {
            foundKey = k;
            break;
          }
        }
        
        if (foundKey === null) {
          foundKey = y.toString();
          linesMap[foundKey] = [];
        }
        
        linesMap[foundKey].push({ str: item.str, x });
      });
      
      // Sort lines top to bottom (Y descending)
      const sortedYKeys = Object.keys(linesMap).sort((a, b) => parseFloat(b) - parseFloat(a));
      
      let pageText = '';
      sortedYKeys.forEach(y => {
        const lineItems = linesMap[y];
        // Sort items left to right (X ascending)
        lineItems.sort((a, b) => a.x - b.x);
        
        const lineText = lineItems.map(item => item.str).join(' ');
        pageText += lineText + '\n';
      });
      return pageText;
    })(i));
  }
  
  const pagesText = await Promise.all(pagePromises);
  return pagesText.join('\n');
}

/**
 * Parses tabular layout from lines of text.
 */
function parseTabularFormat(lines) {
  const studentRows = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tokens = line.split(/[\s,|]+/).map(t => t.trim()).filter(Boolean);
    if (tokens.length < 2) continue;
    
    const regNoMatch = tokens[0].match(REG_NO_REGEX);
    if (regNoMatch) {
      const marks = [];
      let allMarksValid = true;
      for (let j = 1; j < tokens.length; j++) {
        const mark = parseFloat(tokens[j]);
        if (isNaN(mark) || mark < 0 || mark > 100) {
          allMarksValid = false;
          break;
        }
        marks.push(mark);
      }
      
      if (allMarksValid && marks.length > 0) {
        studentRows.push({
          lineIndex: i,
          regNo: tokens[0].toUpperCase(),
          marks: marks
        });
      }
    }
  }
  
  if (studentRows.length === 0) return null;
  
  const markCounts = {};
  studentRows.forEach(row => {
    const count = row.marks.length;
    markCounts[count] = (markCounts[count] || 0) + 1;
  });
  
  let numModules = 0;
  let maxFreq = 0;
  Object.keys(markCounts).forEach(count => {
    if (markCounts[count] > maxFreq) {
      maxFreq = markCounts[count];
      numModules = parseInt(count);
    }
  });
  
  const validStudents = studentRows.filter(row => row.marks.length === numModules);
  if (validStudents.length === 0) return null;
  
  let modules = [];
  const firstStudentLineIndex = validStudents[0].lineIndex;
  
  for (let idx = firstStudentLineIndex - 1; idx >= 0; idx--) {
    const line = lines[idx];
    const tokens = line.split(/[\s,|]+/).map(t => t.trim()).filter(Boolean);
    
    if (tokens.length >= numModules) {
      const possibleModules = tokens.slice(-numModules);
      const allNonNumeric = possibleModules.every(t => isNaN(parseFloat(t)));
      
      if (allNonNumeric) {
        // Verify prefix tokens are non-numeric labels too (e.g. Student ID)
        const prefixTokens = tokens.slice(0, tokens.length - numModules);
        const prefixHasNumbers = prefixTokens.some(t => !isNaN(parseFloat(t)));
        if (!prefixHasNumbers) {
          modules = possibleModules;
          break;
        }
      }
    }
  }
  
  if (modules.length === 0) {
    for (let m = 1; m <= numModules; m++) {
      modules.push(`Module ${m}`);
    }
  }
  
  const students = validStudents.map(s => {
    const studentMarks = {};
    modules.forEach((mod, idx) => {
      studentMarks[mod] = s.marks[idx];
    });
    return {
      registrationNumber: s.regNo,
      marks: studentMarks
    };
  });
  
  return {
    modules,
    students
  };
}

/**
 * Parses block layout from lines of text.
 */
function parseBlockFormat(lines) {
  const students = [];
  const allModulesSet = new Set();
  let currentStudent = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const regNoMatch = line.match(REG_NO_REGEX);
    
    if (regNoMatch && !line.match(/^[A-Z]{2,4}\d{4,6}[:]?$/i)) {
      if (currentStudent && Object.keys(currentStudent.marks).length > 0) {
        students.push(currentStudent);
      }
      currentStudent = {
        registrationNumber: regNoMatch[0].toUpperCase(),
        marks: {}
      };
    } else if (currentStudent) {
      const separatorMatch = line.match(/^([A-Z0-9\s_-]+?)[:=-]\s*(\d+(\.\d+)?)$/i) || 
                            line.match(/^([A-Z]{2,4}\d{4,9})\s+(\d+(\.\d+)?)$/i);
      
      if (separatorMatch) {
        const moduleName = separatorMatch[1].trim();
        const mark = parseFloat(separatorMatch[2]);
        if (!isNaN(mark) && mark >= 0 && mark <= 100) {
          currentStudent.marks[moduleName] = mark;
          allModulesSet.add(moduleName);
        }
      }
    }
  }
  
  if (currentStudent && Object.keys(currentStudent.marks).length > 0) {
    students.push(currentStudent);
  }
  
  if (students.length === 0) return null;
  
  const modules = Array.from(allModulesSet);
  
  students.forEach(s => {
    modules.forEach(mod => {
      if (s.marks[mod] === undefined) {
        s.marks[mod] = 0;
      }
    });
  });
  
  return {
    modules,
    students
  };
}

const SLIIT_REG_NO_REGEX = /\b(IT|SE|IE|BM|EN|EG)\s*(\d{2})\s+(\d{4})\s+(\d{2})\b/i;
const gradesList = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];

/**
 * Parses SLIIT space-separated student ID format with grade and CA mark.
 */
function parseSliitFormat(text, lines) {
  if (!text.match(SLIIT_REG_NO_REGEX)) return null;

  let moduleCode = 'UNKNOWN';
  const moduleMatch = text.match(/\b([A-Z]{2,4})\s*(\d{4})\b/i);
  if (moduleMatch) {
    moduleCode = (moduleMatch[1] + moduleMatch[2]).toUpperCase();
  }

  const students = [];
  
  lines.forEach(line => {
    const regNoMatch = line.match(SLIIT_REG_NO_REGEX);
    if (regNoMatch) {
      // Normalize regNo: e.g. IT23172432
      const regNo = (regNoMatch[1] + regNoMatch[2] + regNoMatch[3] + regNoMatch[4]).toUpperCase();
      const tokens = line.split(/[\s,|]+/).map(t => t.trim()).filter(Boolean);
      
      let grade = 'E';
      let mark = 0;
      
      // Find the grade token by scanning from right to left
      let gradeIdx = -1;
      for (let j = tokens.length - 1; j >= 0; j--) {
        const upperT = tokens[j].toUpperCase();
        if (gradesList.includes(upperT)) {
          grade = upperT;
          gradeIdx = j;
          break;
        }
      }
      
      // The mark token should be immediately to the left of the grade token
      if (gradeIdx > 0) {
        const markToken = tokens[gradeIdx - 1];
        const parsedFloat = parseFloat(markToken);
        if (!isNaN(parsedFloat)) {
          mark = parsedFloat;
        }
      } else {
        // Fallback to searching any float if grade token was not found
        for (let j = tokens.length - 1; j >= 0; j--) {
          const parsedFloat = parseFloat(tokens[j]);
          if (!isNaN(parsedFloat) && parsedFloat >= 0 && parsedFloat <= 100) {
            const isRegNoPart = regNoMatch[2] === tokens[j] || regNoMatch[3] === tokens[j] || regNoMatch[4] === tokens[j];
            const isIndex = tokens[0] === tokens[j];
            if (!isRegNoPart && !isIndex) {
              mark = parsedFloat;
              break;
            }
          }
        }
      }

      students.push({
        registrationNumber: regNo,
        marks: { [moduleCode]: mark },
        grades: { [moduleCode]: grade }
      });
    }
  });

  if (students.length === 0) return null;

  return {
    modules: [moduleCode],
    students
  };
}

/**
 * Parses marks PDF and automatically extracts module names/codes and student marks.
 * It first tries parsing the standard pdf-parse extraction.
 * If that yields zero students (due to column scrambling), it falls back to pdfjs-dist line reconstruction.
 * 
 * If the parsed PDF has exactly 1 module, we override the module name with the original filename (without extension).
 */
async function parsePdfMarks(pdfBuffer, filename) {
  let result = null;
  
  // Method 1: Try standard pdf-parse first
  try {
    const text = await extractTextWithPdfParse(pdfBuffer);
    const lines = cleanText(text);
    
    // Try formats
    result = parseSliitFormat(text, lines);
    if (!result || result.students.length === 0) {
      result = parseTabularFormat(lines);
    }
    if (!result || result.students.length === 0) {
      result = parseBlockFormat(lines);
    }
  } catch (err) {
    console.warn("pdf-parse extraction or parsing failed, trying pdfjs-dist...", err.message);
  }
  
  // Method 2: Fallback to pdfjs-dist line reconstruction
  if (!result || !result.students || result.students.length === 0) {
    try {
      const text = await extractTextWithPdfjs(pdfBuffer);
      const lines = cleanText(text);
      
      // Try formats
      result = parseSliitFormat(text, lines);
      if (!result || result.students.length === 0) {
        result = parseTabularFormat(lines);
      }
      if (!result || result.students.length === 0) {
        result = parseBlockFormat(lines);
      }
    } catch (err) {
      console.error("pdfjs-dist extraction or parsing failed too:", err);
    }
  }
  
  if (!result || !result.students || result.students.length === 0) {
    throw new Error("නියමිත ආකෘතියෙන් සිසුන්ගේ ලියාපදිංචි අංක (Registration Numbers) සහ ලකුණු (Marks) PDF ගොනුවෙන් හඳුනාගත නොහැකි විය. කරුණාකර නිවැරදි PDF ගොනුවක් ලබා දෙන්න.");
  }
  
  // Optional: Rename single-module results using the original filename without .pdf extension
  if (result.modules && result.modules.length === 1 && filename) {
    const originalMod = result.modules[0];
    const newMod = path.basename(filename, path.extname(filename)).trim();
    
    // Override modules list
    result.modules[0] = newMod;
    
    // Update mapping keys inside students array
    result.students.forEach(student => {
      if (student.marks && student.marks[originalMod] !== undefined) {
        student.marks[newMod] = student.marks[originalMod];
        delete student.marks[originalMod];
      }
      if (student.grades && student.grades[originalMod] !== undefined) {
        student.grades[newMod] = student.grades[originalMod];
        delete student.grades[originalMod];
      }
    });
  }
  
  return result;
}

module.exports = {
  parsePdfMarks,
  REG_NO_REGEX
};
