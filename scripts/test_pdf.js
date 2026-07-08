const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfPath = path.join(__dirname, '../samples/sample_tabular.pdf');
const pdfBuffer = fs.readFileSync(pdfPath);

pdf(pdfBuffer)
  .then(data => {
    console.log("PDF parsed successfully!");
    console.log("Text content length:", data.text.length);
    console.log("Text content excerpt:", data.text.substring(0, 300));
  })
  .catch(err => {
    console.error("PDF parsing failed:");
    console.error(err);
  });
