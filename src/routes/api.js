const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const marksController = require('../controllers/marksController');

// Routes
// Accept extracted PDF text (JSON) from client-side pdf.js parsing
router.post('/upload', async (req, res) => {
  try {
    const { text, filename } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'PDF text content is missing or empty.' });
    }
    await marksController.uploadTextContent(req, res, text, filename);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/process', marksController.processMarks);
router.post('/download', marksController.downloadExcel);

router.get('/grading-scale', (req, res) => {
  return res.status(200).json(marksController.defaultGradingScale);
});

router.get('/sample/:type', (req, res) => {
  const type = req.params.type;
  let fileName = '';
  if (type === 'tabular') {
    fileName = 'sample_tabular.pdf';
  } else if (type === 'block') {
    fileName = 'sample_block.pdf';
  } else {
    return res.status(404).json({ error: 'Sample type not found' });
  }
  const filePath = path.join(__dirname, '../../samples', fileName);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.status(404).json({ error: 'Sample file not found on server' });
});

module.exports = router;
