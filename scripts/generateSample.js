const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Ensure samples directory exists
const samplesDir = path.join(__dirname, '../samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

/**
 * Generates a tabular marks sheet PDF
 */
function createTabularSample() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, compress: false, pdfVersion: '1.3' });
    const filename = path.join(samplesDir, 'sample_tabular.pdf');
    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);

    // Title
    doc.fontSize(18).text('Faculty of Computing - SLIIT', { align: 'center' });
    doc.fontSize(14).text('Year 3 Semester 1 Exam Results - 2026', { align: 'center' });
    doc.moveDown(2);

    // Header line
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Student ID          IT3010    IT3020    IT3030', { lineGap: 10 });
    
    // Underline
    doc.moveTo(50, 145).lineTo(450, 145).stroke();
    doc.moveDown(0.5);

    // Data rows
    doc.font('Helvetica');
    const data = [
      'IT21002233          92        85        76',
      'IT21004455          88        72        60',
      'IT21005566          74        68        95',
      'IT21007788          45        50        58',
      'IT21009900          88        72        60' // Same marks as IT21004455 to test secondary sort!
    ];

    data.forEach(line => {
      doc.text(line, { lineGap: 8 });
    });

    doc.end();
    stream.on('finish', () => {
      console.log(`Generated tabular sample PDF: ${filename}`);
      resolve();
    });
    stream.on('error', reject);
  });
}

/**
 * Generates a block-based marks sheet PDF
 */
function createBlockSample() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, compress: false, pdfVersion: '1.3' });
    const filename = path.join(samplesDir, 'sample_block.pdf');
    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);

    // Title
    doc.fontSize(16).text('Department of Software Engineering', { align: 'center' });
    doc.fontSize(12).text('Semester Assessment Report', { align: 'center' });
    doc.moveDown(1.5);

    const students = [
      {
        id: 'IT21002233',
        marks: { IT3010: 92, IT3020: 85, IT3030: 76 }
      },
      {
        id: 'IT21004455',
        marks: { IT3010: 88, IT3020: 72, IT3030: 60 }
      },
      {
        id: 'IT21005566',
        marks: { IT3010: 74, IT3020: 68, IT3030: 95 }
      },
      {
        id: 'IT21007788',
        marks: { IT3010: 45, IT3020: 50, IT3030: 58 }
      },
      {
        id: 'IT21009900',
        marks: { IT3010: 88, IT3020: 72, IT3030: 60 }
      }
    ];

    students.forEach(s => {
      doc.fontSize(11).font('Helvetica-Bold').text(`Student Registration Number: ${s.id}`);
      doc.font('Helvetica').fontSize(10);
      Object.keys(s.marks).forEach(mod => {
        doc.text(`${mod}: ${s.marks[mod]}`);
      });
      doc.moveDown(1);
    });

    doc.end();
    stream.on('finish', () => {
      console.log(`Generated block sample PDF: ${filename}`);
      resolve();
    });
    stream.on('error', reject);
  });
}

async function run() {
  await createTabularSample();
  await createBlockSample();
}

run();
