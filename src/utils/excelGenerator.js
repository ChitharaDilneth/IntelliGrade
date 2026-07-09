const ExcelJS = require('exceljs');

/**
 * Converts a 1-based column index to an Excel column letter (e.g. 1 -> A, 27 -> AA).
 */
function getColumnLetter(colIndex) {
  let temp = colIndex;
  let letter = '';
  while (temp > 0) {
    let modulo = (temp - 1) % 26;
    letter = String.fromCharCode(65 + modulo) + letter;
    temp = Math.floor((temp - modulo) / 26);
  }
  return letter;
}

/**
 * Generates a formatted Excel workbook based on processed GPA data.
 * @param {Array} students - Sorted student array with GPAs and marks.
 * @param {Array} modules - List of modules.
 * @param {Object} shortNames - Map of module full name to short names.
 * @returns {Promise<Buffer>} - Excel file buffer.
 */
async function generateExcelReport(students, modules, shortNames = {}) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('GPA Report');

  const hasNames = students.some(s => s.studentName);
  const totalCols = (hasNames ? 4 : 3) + modules.length; // No, RegNo, [Name], Modules..., GPA
  const lastColLetter = getColumnLetter(totalCols);

  // 1. Add Title Row (Merged)
  worksheet.mergeCells(`A1:${lastColLetter}1`);
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Exam Results - GPA Report';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '1F4E78' } // Dark blue
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 40;

  // 2. Add Headers (Use Subject Short Name + " Grade")
  const headers = ['No.', 'Registration Number'];
  if (hasNames) {
    headers.push('Student Name');
  }
  headers.push(...modules.map(mod => `${shortNames[mod] || mod} Grade`), 'GPA');
  
  worksheet.getRow(2).values = headers;
  worksheet.getRow(2).height = 28;

  // Style Headers
  const headerFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2F5597' } // Secondary Slate Blue
  };
  const centerAlign = { horizontal: 'center', vertical: 'middle' };
  const leftAlign = { horizontal: 'left', vertical: 'middle' };
  const borderStyle = {
    top: { style: 'thin', color: { argb: 'D3D3D3' } },
    left: { style: 'thin', color: { argb: 'D3D3D3' } },
    bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
    right: { style: 'thin', color: { argb: 'D3D3D3' } }
  };

  for (let col = 1; col <= totalCols; col++) {
    const cell = worksheet.getCell(2, col);
    cell.font = headerFont;
    cell.fill = headerFill;
    cell.alignment = centerAlign;
    cell.border = borderStyle;
  }

  // 3. Add Data Rows
  students.forEach((student, idx) => {
    const rowNum = idx + 3; // Starting after Title (1) and Header (2)
    const rowData = [
      idx + 1, // Sequential No
      student.registrationNumber
    ];
    if (hasNames) {
      rowData.push(student.studentName || '');
    }
    rowData.push(
      // Map modules to the student's Grade instead of Marks
      ...modules.map(mod => (student.grades[mod] && student.grades[mod].grade) ? student.grades[mod].grade : ''),
      // Insert numeric GPA to let Excel format it
      parseFloat(student.gpa)
    );

    worksheet.getRow(rowNum).values = rowData;
    worksheet.getRow(rowNum).height = 20;

    // Apply styles to each cell in the row
    const isEven = idx % 2 === 1;
    const rowFill = isEven
      ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } } // Light Gray (Banding)
      : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White

    for (let col = 1; col <= totalCols; col++) {
      const cell = worksheet.getCell(rowNum, col);
      cell.border = borderStyle;
      cell.fill = rowFill;
      cell.font = { name: 'Calibri', size: 11 };

      // Formatting and Alignment
      if (col === 1) {
        // Sequential No
        cell.alignment = centerAlign;
      } else if (col === 2) {
        // Registration Number
        cell.alignment = leftAlign;
      } else if (hasNames && col === 3) {
        // Student Name
        cell.alignment = leftAlign;
      } else if (col === totalCols) {
        // GPA
        cell.alignment = centerAlign;
        cell.numFormat = '0.00'; // Decimal format 2.00
        cell.font = { name: 'Calibri', size: 11, bold: true };
      } else {
        // Module marks
        cell.alignment = centerAlign;
      }
    }
  });

  // 4. Freeze Pane (Header remains fixed when scrolling)
  worksheet.views = [
    {
      state: 'frozen',
      xSplit: 0,
      ySplit: 2,
      topLeftCell: 'A3',
      activePane: 'bottomLeft'
    }
  ];

  // 5. Auto-fit column widths
  for (let col = 1; col <= totalCols; col++) {
    let maxLength = 0;
    
    // Check header values
    const headerVal = worksheet.getCell(2, col).value;
    if (headerVal) maxLength = Math.max(maxLength, headerVal.toString().length);

    // Check data values
    for (let row = 3; row <= students.length + 2; row++) {
      const cellVal = worksheet.getCell(row, col).value;
      if (cellVal !== null && cellVal !== undefined) {
        if (col === totalCols) {
          maxLength = Math.max(maxLength, Number(cellVal).toFixed(2).length);
        } else {
          maxLength = Math.max(maxLength, cellVal.toString().length);
        }
      }
    }

    // Set width with padding
    worksheet.getColumn(col).width = Math.max(maxLength + 4, 12);
  }

  // Generate buffer
  return await workbook.xlsx.writeBuffer();
}

module.exports = {
  generateExcelReport
};
