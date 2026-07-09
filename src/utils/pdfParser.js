// Use the internal module directly to avoid pdf-parse's test-at-require-time bug in serverless (Vercel)
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const path = require('path');

// Robust registration number regex; avoid matching short module codes like IT3010
const REG_NO_REGEX = /\b(IT\d{7,8}|SE\d{7,8}|IE\d{7,8}|BM\d{7,8}|EN\d{7,8}|EG\d{7,8}|[A-Z]{2,4}\d{6,9}|[A-Z]{2,4}[/-]\d{2,4}(?:[/-]\d{2,4})?[/-]\d{3,4})\b/i;

// Broad universal index/registration number regex matching various Sri Lankan & global university patterns
const GENERAL_REG_NO_REGEX = /\b(?:IT|SE|IE|BM|EN|EG)\d{7,8}\b|\b(?:IT|SE|IE|BM|EN|EG)\s*\d{2}\s*\d{4}\s*\d{2}\b|\b[A-Z0-9]{2,4}(?:[/-][A-Z0-9]{1,4}){2,4}\b|\b[A-Z]{1,2}[/-]\d{2,4}[/-]\d{3,4}\b|\b\d{6}[A-Z]\b|\b[A-Z]{1,3}\d{5,8}\b|\b\d{5,8}[A-Z]{1,3}\b|\b\d{7,9}\b/i;

// Broad grade matching regex
const GRADE_REGEX = /^(?:[A-D][+-]?|E|F|F\+|I|I-?C|AB|PASS|FAIL)$/i;

function cleanText(text) {
  return text.split('\n').map(line => line.trim()).filter(Boolean);
}

/**
 * Extracts raw text from PDF buffer using pdf-parse.
 */
/**
 * Extracts raw text from PDF buffer using pdfjs-dist with dynamic column clustering.
 * Falls back to pdf-parse if pdfjs-dist fails.
 */
async function extractTextWithPdfParse(pdfBuffer) {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      disableFontFace: true
    });
    const pdfDoc = await loadingTask.promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
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
      
      const sortedYKeys = Object.keys(linesMap).sort((a, b) => parseFloat(b) - parseFloat(a));
      
      const xCoords = [];
      sortedYKeys.forEach(y => {
        const lineItems = linesMap[y];
        lineItems.sort((a, b) => a.x - b.x);
        const lineText = lineItems.map(item => item.str).join(' ');
        
        const hasMarks = lineItems.some(item => !isNaN(parseFloat(item.str)) && parseFloat(item.str) >= 0 && parseFloat(item.str) <= 100);
        const hasNameWords = lineItems.filter(item => /^[a-zA-Z]{3,}$/.test(item.str.trim())).length >= 2;
        const isStudentRow = GENERAL_REG_NO_REGEX.test(lineText) || (hasMarks && hasNameWords);
        
        if (isStudentRow) {
          lineItems.forEach(item => {
            xCoords.push(item.x);
          });
        }
      });
      
      let columns = [];
      if (xCoords.length > 0) {
        xCoords.sort((a, b) => a - b);
        let currentCluster = [xCoords[0]];
        const clusterTolerance = 15; // points
        
        for (let i = 1; i < xCoords.length; i++) {
          const x = xCoords[i];
          const lastX = currentCluster[currentCluster.length - 1];
          if (x - lastX < clusterTolerance) {
            currentCluster.push(x);
          } else {
            const avg = currentCluster.reduce((sum, v) => sum + v, 0) / currentCluster.length;
            columns.push(avg);
            currentCluster = [x];
          }
        }
        if (currentCluster.length > 0) {
          const avg = currentCluster.reduce((sum, v) => sum + v, 0) / currentCluster.length;
          columns.push(avg);
        }
      }
      columns.sort((a, b) => a - b);
      
      if (columns.length > 1) {
        sortedYKeys.forEach(y => {
          const lineItems = linesMap[y];
          const rowCells = Array.from({ length: columns.length }, () => []);
          
          lineItems.forEach(item => {
            let closestColIdx = 0;
            let minDistance = Math.abs(item.x - columns[0]);
            for (let c = 1; c < columns.length; c++) {
              const dist = Math.abs(item.x - columns[c]);
              if (dist < minDistance) {
                minDistance = dist;
                closestColIdx = c;
              }
            }
            rowCells[closestColIdx].push(item);
          });
          
          const delimitedLine = rowCells.map(cellItems => {
            cellItems.sort((a, b) => a.x - b.x);
            return cellItems.map(item => item.str).join(' ').trim();
          }).join(' | ');
          
          fullText += delimitedLine + '\n';
        });
      } else {
        sortedYKeys.forEach(y => {
          const lineItems = linesMap[y];
          lineItems.sort((a, b) => a.x - b.x);
          fullText += lineItems.map(item => item.str).join(' ') + '\n';
        });
      }
    }
    
    return fullText;
  } catch (err) {
    console.warn("Backend pdfjs-dist extraction failed, falling back to pdf-parse:", err);
    const data = await pdfParse(pdfBuffer);
    if (data && data.text && data.text.trim().length > 0) {
      return data.text;
    }
    throw new Error("Empty text extracted by pdf-parse fallback");
  }
}

/**
 * Universally parses pipe-delimited structured text.
 * Groups, clusters, and maps columns to Registration Numbers, Student Names, and Marks/Grades.
 */
function parseStructuredText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Filter only lines containing the pipe delimiter
  const structuredLines = lines.filter(l => l.includes('|'));
  if (structuredLines.length === 0) return null;
  
  // Convert lines to a grid of cells
  const grid = structuredLines.map(line => {
    return line.split('|').map(cell => cell.trim());
  });
  
  const numCols = Math.max(...grid.map(row => row.length));
  if (numCols < 2) return null; // Needs at least 1 identifier and 1 result column
  
  // Column statistics to determine column roles dynamically
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
      } else if (/^\d+(?:\.\d+)?$/.test(cell)) {
        colStats[c].numberCount++;
      } else if (/^[a-zA-Z\s\.]+$/.test(cell) && cell.length > 2) {
        colStats[c].wordCount++;
      }
    }
  });
  
  // Find all columns that contain registration numbers (regCount is significant)
  const regColIndices = [];
  for (let c = 0; c < numCols; c++) {
    const totalFilled = grid.length - colStats[c].emptyCount;
    if (totalFilled > 0 && colStats[c].regCount / totalFilled > 0.4) {
      regColIndices.push(c);
    }
  }
  
  // If no registration column found, let's look for name columns
  let nameColIndices = [];
  if (regColIndices.length === 0) {
    for (let c = 0; c < numCols; c++) {
      const totalFilled = grid.length - colStats[c].emptyCount;
      if (totalFilled > 0 && colStats[c].wordCount / totalFilled > 0.4) {
        nameColIndices.push(c);
      }
    }
  }
  
  const idColIndices = regColIndices.length > 0 ? regColIndices : nameColIndices;
  if (idColIndices.length === 0) return null;
  
  // Identify repeating side-by-side column layouts and split them into sub-grids
  const subGrids = [];
  for (let i = 0; i < idColIndices.length; i++) {
    const idColIdx = idColIndices[i];
    const nextIdColIdx = idColIndices[i + 1] || numCols;
    
    // Within this sub-grid's column range [idColIdx, nextIdColIdx), identify result and name columns
    const subResultColIndices = [];
    let subNameColIdx = -1;
    let maxSubWords = 0;
    
    for (let c = idColIdx + 1; c < nextIdColIdx; c++) {
      if (idColIndices.includes(c)) continue;
      
      const totalFilled = grid.length - colStats[c].emptyCount;
      if (totalFilled > 0) {
        const resultRatio = (colStats[c].numberCount + colStats[c].gradeCount) / totalFilled;
        
        // Skip sequential serial number column (index 0)
        const isSerial = c === 0 && colStats[c].numberCount > 0;
        
        if (resultRatio > 0.3 && !isSerial) {
          subResultColIndices.push(c);
        } else if (colStats[c].wordCount > maxSubWords) {
          maxSubWords = colStats[c].wordCount;
          subNameColIdx = c;
        }
      }
    }
    
    if (subResultColIndices.length > 0) {
      subGrids.push({
        idColIdx,
        nameColIdx: subNameColIdx !== -1 && maxSubWords > 2 ? subNameColIdx : -1,
        resultColIndices: subResultColIndices
      });
    }
  }
  
  if (subGrids.length === 0) return null;
  
  // Parse all sub-grids and combine their results
  const allStudents = [];
  const allModulesSet = new Set();
  
  subGrids.forEach(sub => {
    // 1. Identify student rows for this sub-grid
    const studentRows = [];
    grid.forEach((row, rowIdx) => {
      const idCell = row[sub.idColIdx] || "";
      if (!idCell) return;
      
      // Skip header rows (match keywords like Index, Reg No, Student ID, name)
      if (/(?:index|reg|student|id|name|no\.?|code|faculty)/i.test(idCell.replace(/\s+/g, ''))) return;
      
      // Ensure there is at least one valid mark (numeric) or grade in the row
      const hasResult = sub.resultColIndices.some(c => {
        const val = row[c];
        if (!val) return false;
        return !isNaN(parseFloat(val)) || GRADE_REGEX.test(val);
      });
      if (!hasResult) return;
      
      studentRows.push({ row, rowIdx });
    });
    
    if (studentRows.length === 0) return;
    
    // 2. Identify modules header row immediately above the first student row in this sub-grid
    const firstStudentRowIdx = studentRows[0].rowIdx;
    let modules = [];
    for (let r = firstStudentRowIdx - 1; r >= 0; r--) {
      const row = grid[r];
      const possibleModules = sub.resultColIndices.map(c => row[c] || "").map(m => m.trim());
      
      // Header labels should be text, non-numeric, and not grades
      const allValidLabels = possibleModules.every(m => m !== "" && isNaN(parseFloat(m)) && !GRADE_REGEX.test(m));
      if (allValidLabels) {
        modules = possibleModules.map(m => m.toUpperCase());
        break;
      }
    }
    
    // Fallback module naming
    if (modules.length === 0) {
      modules = sub.resultColIndices.map((c, idx) => `Module ${idx + 1}`);
    }
    
    modules.forEach(m => allModulesSet.add(m));
    
    // 3. Map student records for this sub-grid
    studentRows.forEach(({ row }) => {
      const rawId = row[sub.idColIdx];
      const registrationNumber = rawId.toUpperCase().replace(/\s+/g, '');
      
      const studentName = sub.nameColIdx !== -1 ? row[sub.nameColIdx] : null;
      const marks = {};
      const grades = {};
      
      sub.resultColIndices.forEach((colIdx, idx) => {
        const moduleName = modules[idx];
        const cellVal = row[colIdx] || "";
        
        if (cellVal) {
          if (GRADE_REGEX.test(cellVal)) {
            grades[moduleName] = cellVal.toUpperCase();
            marks[moduleName] = 0; // Default mark placeholder
          } else {
            const markVal = parseFloat(cellVal);
            if (!isNaN(markVal)) {
              marks[moduleName] = markVal;
            }
          }
        }
      });
      
      allStudents.push({
        registrationNumber,
        studentName: studentName || null,
        marks,
        grades
      });
    });
  });
  
  if (allStudents.length === 0) return null;
  
  let finalModules = Array.from(allModulesSet);
  let finalStudents = allStudents;
  
  // If the parsed file has multiple results columns, check if it's a single subject sheet with multiple component columns
  if (finalModules.length > 1) {
    const componentKeywords = ['ca', 'cw', 'ass', 'status', 'remark', 'grade', 'exam', 'total', 'final', 'internal', 'external', 'mark', 'results'];
    const isSingleSubjectComponentSheet = finalModules.some(m => {
      const lower = m.toLowerCase();
      return componentKeywords.some(kw => lower.includes(kw));
    });
    
    if (isSingleSubjectComponentSheet) {
      // Find the single best column index/module
      let bestIdx = 0;
      let bestScore = -999;
      
      finalModules.forEach((modName, idx) => {
        const lowerHeader = modName.toLowerCase();
        let score = 0;
        
        if (lowerHeader.includes('grade')) {
          score += 100;
        } else if (lowerHeader.includes('final') || lowerHeader.includes('total')) {
          score += 80;
        } else if (lowerHeader.includes('exam') || lowerHeader.includes('mark')) {
          score += 60;
        }
        
        if (lowerHeader.includes('ca') || lowerHeader.includes('cw') || lowerHeader.includes('status') || lowerHeader.includes('remark')) {
          score -= 150;
        }
        
        // Add score based on actual cell values in this column for all students
        let gradeMatches = 0;
        let numberMatches = 0;
        let filledCount = 0;
        
        finalStudents.forEach(student => {
          const val = student.grades[modName] || (student.marks[modName] !== undefined && student.marks[modName] !== 0 ? student.marks[modName].toString() : "");
          if (val) {
            filledCount++;
            if (GRADE_REGEX.test(val) && !/^(pass|fail|ab)$/i.test(val)) {
              gradeMatches++;
            } else if (!isNaN(parseFloat(val)) && parseFloat(val) > 0) {
              numberMatches++;
            }
          }
        });
        
        if (filledCount > 0) {
          score += (gradeMatches / filledCount) * 50;
          score += (numberMatches / filledCount) * 30;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestIdx = idx;
        }
      });
      
      const bestModuleName = finalModules[bestIdx];
      finalModules = [bestModuleName];
      
      finalStudents.forEach(student => {
        const studentMark = student.marks[bestModuleName] !== undefined ? student.marks[bestModuleName] : 0;
        const studentGrade = student.grades[bestModuleName] || null;
        
        student.marks = { [bestModuleName]: studentMark };
        student.grades = { [bestModuleName]: studentGrade };
      });
    }
  }
  
  return {
    modules: finalModules,
    students: finalStudents
  };
}

/**
 * Parses tabular layout from lines of text. (Fallback)
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
 * Parses block layout from lines of text. (Fallback)
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
 * Parses SLIIT space-separated student ID format with grade and CA mark. (Fallback)
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
      const regNo = (regNoMatch[1] + regNoMatch[2] + regNoMatch[3] + regNoMatch[4]).toUpperCase();
      const tokens = line.split(/[\s,|]+/).map(t => t.trim()).filter(Boolean);
      
      let grade = 'E';
      let mark = 0;
      
      let gradeIdx = -1;
      for (let j = tokens.length - 1; j >= 0; j--) {
        const upperT = tokens[j].toUpperCase();
        if (gradesList.includes(upperT)) {
          grade = upperT;
          gradeIdx = j;
          break;
        }
      }
      
      if (gradeIdx > 0) {
        const markToken = tokens[gradeIdx - 1];
        const parsedFloat = parseFloat(markToken);
        if (!isNaN(parsedFloat)) {
          mark = parsedFloat;
        }
      } else {
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
 * Parses marks from pre-extracted text string.
 */
async function parseTextMarks(text, filename) {
  if (!text || text.trim().length === 0) {
    throw new Error("Empty text provided for parsing.");
  }
  
  const lines = cleanText(text);
  let result = null;
  
  // Try structured columns parsing first if pipe characters are found
  if (text.includes('|')) {
    try {
      result = parseStructuredText(text);
    } catch (err) {
      console.error("Structured column parser error, falling back:", err);
    }
  }
  
  // Fallback 1: SLIIT format
  if (!result || !result.students || result.students.length === 0) {
    result = parseSliitFormat(text, lines);
  }
  
  // Fallback 2: Tabular format
  if (!result || !result.students || result.students.length === 0) {
    result = parseTabularFormat(lines);
  }
  
  // Fallback 3: Block format
  if (!result || !result.students || result.students.length === 0) {
    result = parseBlockFormat(lines);
  }
  
  if (!result || !result.students || result.students.length === 0) {
    throw new Error("නියමිත ආකෘතියෙන් සිසුන්ගේ ලියාපදිංචි අංක (Registration Numbers) සහ ලකුණු (Marks) PDF ගොනුවෙන් හඳුනාගත නොහැකි විය. කරුණාකර නිවැරදි PDF ගොනුවක් ලබා දෙන්න.");
  }
  
  // Optional: Rename single-module results using the original filename without .pdf extension
  if (result.modules && result.modules.length === 1 && filename) {
    const originalMod = result.modules[0];
    const newMod = path.basename(filename, path.extname(filename)).trim();
    
    result.modules[0] = newMod;
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

/**
 * Expose parsePdfMarks for backend scripts (reads buffer directly).
 */
async function parsePdfMarks(pdfBuffer, filename) {
  const text = await extractTextWithPdfParse(pdfBuffer);
  return parseTextMarks(text, filename);
}

module.exports = {
  parseTextMarks,
  parsePdfMarks,
  REG_NO_REGEX
};
