const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const marksController = require('../controllers/marksController');

// Use memory storage so it works in serverless environments (Vercel)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('PDF ගොනු පමණක් upload කිරීමට අවසර ඇත (Only PDF files are allowed).'));
    }
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB per file
});

// Routes
router.post('/upload', (req, res, next) => {
  upload.array('pdf', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, marksController.uploadPdf);

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
