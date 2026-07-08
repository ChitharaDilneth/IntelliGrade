try {
  const p1 = require('pdfjs-dist');
  console.log("SUCCESS: require('pdfjs-dist') works!");
} catch (e) {
  console.log("FAIL: require('pdfjs-dist') failed:", e.message);
}

try {
  const p2 = require('pdfjs-dist/build/pdf.js');
  console.log("SUCCESS: require('pdfjs-dist/build/pdf.js') works!");
} catch (e) {
  console.log("FAIL: require('pdfjs-dist/build/pdf.js') failed:", e.message);
}

try {
  const p3 = require('pdfjs-dist/legacy/build/pdf.js');
  console.log("SUCCESS: require('pdfjs-dist/legacy/build/pdf.js') works!");
} catch (e) {
  console.log("FAIL: require('pdfjs-dist/legacy/build/pdf.js') failed:", e.message);
}
