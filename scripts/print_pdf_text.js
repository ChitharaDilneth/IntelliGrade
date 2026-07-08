const fs = require('fs');
const path = require('path');
const { parsePdfMarks } = require('../src/utils/pdfParser');

// Let's import the extractPdfText function to print raw text
const pdfParserFile = require('../src/utils/pdfParser');

const pdfPath = 'C:\\Users\\Chithu\\Music\\IT 1150 -Regular (1).pdf';

(async () => {
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    // Let's extract raw text using our line-reconstruction method
    // Note: extractPdfText is not exported, let's look at pdfParserFile or we can just require and run pdfjs-dist directly.
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      disableFontFace: true
    });
    const pdfDoc = await loadingTask.promise;
    console.log("Pages count:", pdfDoc.numPages);
    
    // Read page 1
    const page = await pdfDoc.getPage(1);
    const textContent = await page.getTextContent();
    
    // Print first 40 text items to see what they are
    console.log("--- First 40 items ---");
    textContent.items.slice(0, 40).forEach((item, idx) => {
      console.log(`${idx}: "${item.str}" [X: ${item.transform[4].toFixed(1)}, Y: ${item.transform[5].toFixed(1)}]`);
    });
    
    // Run grouping and print first 15 reconstructed lines
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
    console.log("\n--- Reconstructed Lines (First 20) ---");
    sortedYKeys.slice(0, 20).forEach(y => {
      const lineItems = linesMap[y];
      lineItems.sort((a, b) => a.x - b.x);
      console.log(`Y=${parseFloat(y).toFixed(1)}: "${lineItems.map(item => item.str).join(' ')}"`);
    });

  } catch (e) {
    console.error("Error reading PDF:", e);
  }
})();
