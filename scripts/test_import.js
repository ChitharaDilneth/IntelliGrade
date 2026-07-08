const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const pdfPath = path.join(__dirname, '../samples/sample_tabular.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      disableFontFace: true
    });
    
    const pdfDoc = await loadingTask.promise;
    
    let text = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      
      // Group items by Y coordinate (baseline)
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
      
      sortedYKeys.forEach(y => {
        const lineItems = linesMap[y];
        // Sort items left to right (X ascending)
        lineItems.sort((a, b) => a.x - b.x);
        
        const lineText = lineItems.map(item => item.str).join(' ');
        text += lineText + '\n';
      });
    }
    
    console.log("RECONSTRUCTED TEXT:\n", text);
  } catch (e) {
    console.error("FAIL:", e);
  }
})();
