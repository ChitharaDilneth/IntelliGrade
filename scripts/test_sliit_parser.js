const fs = require('fs');
const path = require('path');

const SLIIT_REG_NO_REGEX = /\b(IT|SE|IE|BM|EN|EG)\s*(\d{2})\s*(\d{4})\s*(\d{2})\b/i;
const gradesList = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];

async function testSliitParser() {
  try {
    const pdfPath = 'C:\\Users\\Chithu\\Music\\IT 1150 -Regular (1).pdf';
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      disableFontFace: true
    });
    const pdfDoc = await loadingTask.promise;
    
    // Group items by Y coordinate to reconstruct lines
    let text = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      const linesMap = {};
      const threshold = 5;
      
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
      sortedYKeys.forEach(y => {
        const lineItems = linesMap[y];
        lineItems.sort((a, b) => a.x - b.x);
        text += lineItems.map(item => item.str).join(' ') + '\n';
      });
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // 1. Identify module code
    let moduleCode = 'UNKNOWN';
    // Look for patterns like IT1150 or SE1020 or IE1011
    const moduleMatch = text.match(/\b([A-Z]{2,4})\s*(\d{4})\b/i);
    if (moduleMatch) {
      moduleCode = (moduleMatch[1] + moduleMatch[2]).toUpperCase();
    }

    console.log("Identified Module Code:", moduleCode);

    // 2. Identify student records
    const students = [];
    
    lines.forEach(line => {
      const regNoMatch = line.match(SLIIT_REG_NO_REGEX);
      if (regNoMatch) {
        // Normalize regNo: IT23172432
        const regNo = (regNoMatch[1] + regNoMatch[2] + regNoMatch[3] + regNoMatch[4]).toUpperCase();
        
        // Find Grade from tokens
        const tokens = line.split(/[\s,|]+/).map(t => t.trim()).filter(Boolean);
        
        let grade = 'E';
        // Search tokens for grades
        for (const t of tokens) {
          const upperT = t.toUpperCase();
          if (gradesList.includes(upperT)) {
            grade = upperT;
            break;
          }
        }

        // Find mark
        let mark = 0;
        for (const t of tokens) {
          const parsedFloat = parseFloat(t);
          // Check if it's a number and not the index (which is usually the first token, or part of regNo)
          if (!isNaN(parsedFloat) && parsedFloat >= 0 && parsedFloat <= 100) {
            // RegNo components are integers: 23, 1724, 32. Index is 1, 2, 3.
            // CA Mark is usually a float or a number like 46.8.
            // Let's filter out numbers that are equal to index or regNo components.
            const valStr = t;
            const isRegNoPart = regNoMatch[2] === valStr || regNoMatch[3] === valStr || regNoMatch[4] === valStr;
            const isIndex = tokens[0] === valStr;
            if (!isRegNoPart && !isIndex) {
              mark = parsedFloat;
              break;
            }
          }
        }

        students.push({
          registrationNumber: regNo,
          marks: {
            [moduleCode]: mark
          },
          // We can also attach the grade directly to the parser results if we want to bypass grade mapping!
          // But wait: if we map the mark to Grade Point, we can do it using the Grade we parsed directly!
          // E.g., if we extract the grade, we can map it to GPA: A+ -> 4.0, C -> 2.0.
          // That is 100% accurate!
          grade: grade
        });
      }
    });

    console.log(`Parsed ${students.length} students.`);
    console.log("First 5 students:");
    console.log(students.slice(0, 5));

  } catch (error) {
    console.error("FAIL:", error);
  }
}

testSliitParser();
