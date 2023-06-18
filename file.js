const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Create multer instance with the configured storage
const upload = multer({ storage });

// Define a POST endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({ message: 'File uploaded successfully' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});