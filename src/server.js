const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  Exam Marks Processing System Server Running      `);
  console.log(`  Local URL: http://localhost:${PORT}              `);
  console.log(`  Time: ${new Date().toLocaleString()}            `);
  console.log(`==================================================`);
});
