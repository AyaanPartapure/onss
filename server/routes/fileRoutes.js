const express = require('express');
const fs = require('fs');
const path = require('path');
const { getBucket, contentType } = require('../services/fileStorage');

const router = express.Router();
const legacyUploads = path.join(__dirname, '..', 'uploads');

router.get('/:filename', async (req, res, next) => {
  const filename = req.params.filename;
  if (!filename || filename === '.' || filename === '..' || filename.includes('/') || filename.includes('\\') || filename.includes('\0')) {
    return res.status(400).json({ success: false, message: 'Invalid file name.' });
  }

  try {
    const bucket = getBucket();
    const found = await bucket.find({ filename }).sort({ uploadDate: -1 }).limit(1).next();
    if (found) {
      const mime = found.metadata?.contentType || contentType(filename);
      res.set({
        'Content-Type': mime,
        'Content-Length': String(found.length),
        'Content-Disposition': `${mime === 'application/pdf' ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, max-age=0, must-revalidate',
      });
      const stream = bucket.openDownloadStream(found._id);
      stream.on('error', (err) => {
        console.error('[File storage] Download error:', err.message);
        if (!res.headersSent) next(err);
        else res.destroy(err);
      });
      return stream.pipe(res);
    }

    // Backward compatibility: files saved to server/uploads before the GridFS upgrade.
    const legacy = path.join(legacyUploads, filename);
    try {
      await fs.promises.access(legacy, fs.constants.R_OK);
      res.set('X-Content-Type-Options', 'nosniff');
      return res.sendFile(filename, { root: legacyUploads });
    } catch (_error) {
      return res.status(404).json({
        success: false,
        message: 'This attachment is no longer on the server. Please ask the uploader to replace it.',
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
