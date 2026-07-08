# IntelliGrade — Vercel Deployment Fix Plan

## Problem
PDF upload fails on Vercel with "Registration Numbers and Marks could not be identified" error.

**Root Cause:** `pdf-parse` runs on Vercel's serverless Node.js runtime. Vercel:
1. Has a **10MB max request body** limit and **10-second timeout** for serverless functions
2. Has read-only filesystem — cannot write temp files
3. `pdf-parse` sometimes fails to extract text from certain PDF layouts in serverless environment

## Solution: Client-Side PDF Parsing (Best for Vercel)

Move PDF text extraction from the server to the **browser** using `pdfjs-dist` CDN.

### How it works:
1. User selects PDF → Browser extracts text using PDF.js (client-side, no server needed)
2. Browser sends the **extracted text** (not the PDF file) to `/api/upload`
3. Server processes the text → returns modules + students JSON
4. GPA calculation continues normally

### Benefits:
- No more server-side PDF parsing issues on Vercel
- No file size issues (text is tiny vs PDF binary)
- Much faster (no upload bandwidth for large PDFs)
- Works 100% on Vercel serverless

## Files to Change

### Frontend Changes
- `src/public/js/app.js` — Add client-side PDF text extraction using pdf.js CDN, modify uploadFiles() to send text instead of FormData
- `src/public/index.html` — Add pdf.js CDN script tag

### Backend Changes
- `src/routes/api.js` — Change `/api/upload` to accept JSON body (text) instead of multipart FormData
- `src/controllers/marksController.js` — Accept text string instead of file buffer  
- `src/utils/pdfParser.js` — Expose parseFromText() function that takes raw text string (keep existing parse logic)
