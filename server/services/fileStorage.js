const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { pipeline } = require('stream/promises');

const BUCKET_NAME = 'noteUploads';
const MIME = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getBucket() {
  if (!mongoose.connection.db) throw new Error('Database is not connected.');
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });
}

function contentType(name) {
  return MIME[path.extname(name).toLowerCase()] || 'application/octet-stream';
}

async function validateFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!MIME[ext]) throw Object.assign(new Error('Unsupported file format.'), { statusCode: 400 });
  const handle = await fs.promises.open(file.path, 'r');
  const header = Buffer.alloc(1024);
  try {
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    const first = header.subarray(0, bytesRead);
    const pdf = ext === '.pdf' && first.includes(Buffer.from('%PDF-')) && first.indexOf('%PDF-') < 1024;
    const doc = ext === '.doc' && first.subarray(0, 8).equals(Buffer.from('d0cf11e0a1b11ae1', 'hex'));
    const docx = ext === '.docx' && first.subarray(0, 4).equals(Buffer.from('504b0304', 'hex'));
    if (!pdf && !doc && !docx) throw Object.assign(new Error(`${file.originalname} is not a valid ${ext.toUpperCase()} document.`), { statusCode: 400 });
  } finally {
    await handle.close();
  }
}

function uniqueName(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const base = path.basename(file.originalname, ext)
    .replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 45) || 'document';
  return `${base}-${Date.now()}-${crypto.randomBytes(9).toString('hex')}${ext}`;
}

async function saveFile(file, explicitName) {
  await validateFile(file);
  const name = explicitName || uniqueName(file);
  const writable = getBucket().openUploadStream(name, {
    metadata: { contentType: contentType(name), originalName: file.originalname },
  });
  await pipeline(fs.createReadStream(file.path), writable);
  return name;
}

async function removeFile(name) {
  if (!name || typeof name !== 'string') return;
  const bucket = getBucket();
  const document = await bucket.find({ filename: name }).sort({ uploadDate: -1 }).limit(1).next();
  if (document) await bucket.delete(document._id);
}

async function cleanTempFiles(files) {
  const list = Array.isArray(files) ? files : Object.values(files || {}).flat();
  await Promise.allSettled(list.filter(Boolean).map((f) => fs.promises.unlink(f.path)));
}

async function removeFilesBestEffort(names) {
  const Note = require('../models/Note');
  for (const name of names) {
    try {
      // Historic sample notes can share filenames; never remove a referenced file.
      const referenced = await Note.exists({ $or: ['file1', 'file2', 'file3', 'file4'].map(field => ({ [field]: name })) });
      if (!referenced) await removeFile(name);
    } catch (err) {
      console.error('[File storage] Cleanup failed:', err.message);
    }
  }
}

module.exports = { getBucket, contentType, saveFile, removeFile, removeFilesBestEffort, cleanTempFiles };
