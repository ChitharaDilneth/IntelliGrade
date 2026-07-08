const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();

// Increase payload limits for large PDF data transfer
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Connect API routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'සේවාදායකයේ අභ්‍යන්තර දෝෂයක් සිදු විය (An internal server error occurred).'
  });
});

module.exports = app;
