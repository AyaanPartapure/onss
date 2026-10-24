const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Temporary files exist only during an active request. Permanent files live in GridFS.
const uploadDir = path.join(os.tmpdir(), 'onss-pending-uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${require('crypto').randomBytes(12).toString('hex')}`;
      cb(null, `${unique}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!allowedExtensions.has(path.extname(file.originalname).toLowerCase())) {
      return cb(new Error('Only PDF, DOC and DOCX documents are accepted.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 25 * 1024 * 1024, files: 4 },
});

module.exports = upload;
