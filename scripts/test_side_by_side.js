const { parseTextMarks } = require('../src/utils/pdfParser');
const assert = require('assert');

const testText = `
Index No. | Grade | Index No. | Grade | Index No. | Grade | Index No. | Grade
225001P   | B+    | 225002U   | A-    | 225004D   | A     | 225005G   | B+
225006K   | A     | 225007N   | A-    | 225008T   | A-    | 225009X   | A-
225010R   | A-    | 225011V   | B+    | 225013E   | A-    | 225014H   | A+
225015L   | B+    | 225016P   | B+    | 225017U   | B-    | 225018A   | A
225087G   | I     | 215113C   | I     | 215118V   | C     | 215133L   | I
`;

(async () => {
  try {
    console.log("Testing repeating columns side-by-side parser...");
    const result = await parseTextMarks(testText, "MIS_Results.pdf");
    
    console.log("Modules found:", result.modules);
    console.log("Total students found:", result.students.length);
    
    // Check that all 20 students are correctly parsed
    assert.strictEqual(result.students.length, 20);
    assert.strictEqual(result.modules.length, 1);
    assert.strictEqual(result.modules[0], "MIS_Results");
    
    // Check specific students in different columns
    const s1 = result.students.find(s => s.registrationNumber === "225001P");
    assert.ok(s1);
    assert.strictEqual(s1.grades["MIS_Results"], "B+");
    
    const s2 = result.students.find(s => s.registrationNumber === "225002U");
    assert.ok(s2);
    assert.strictEqual(s2.grades["MIS_Results"], "A-");
    
    const s20 = result.students.find(s => s.registrationNumber === "215133L");
    assert.ok(s20);
    assert.strictEqual(s20.grades["MIS_Results"], "I"); // Tests the new 'I' grade support
    
    console.log("PASS: Side-by-side parsing tested and validated successfully!");
  } catch (err) {
    console.error("FAIL:", err);
    process.exit(1);
  }
})();
