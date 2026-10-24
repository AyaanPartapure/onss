// Optional: run ONCE from a computer that still has a server/uploads folder.
// Migrates existing readable documents to GridFS without changing note records.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const { getBucket, saveFile } = require('../services/fileStorage');
const connectDB = require('../config/db');

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI before migration.');
  await connectDB();
  const uploadDir = path.resolve(__dirname, '..', 'uploads');
  const notes = await Note.find({}, 'file1 file2 file3 file4').lean();
  const names = [...new Set(notes.flatMap(note => [note.file1, note.file2, note.file3, note.file4]).filter(Boolean))];
  let migrated = 0;
  let unavailable = 0;

  for (const name of names) {
    if (path.basename(name) !== name) continue;
    const inBucket = await getBucket().find({ filename: name }).limit(1).next();
    if (inBucket) continue;
    const filename = path.join(uploadDir, name);
    try {
      const stat = await fs.promises.stat(filename);
      if (!stat.isFile()) { unavailable++; continue; }
      await saveFile({ path: filename, originalname: name }, name);
      migrated++;
      console.log('[Migration] Stored:', name);
    } catch (error) {
      unavailable++;
      console.warn('[Migration] Cannot migrate:', name, error.message);
    }
  }
  console.log(`[Migration] Completed: ${migrated} migrated, ${unavailable} missing or invalid.`);
}

main()
  .catch(error => { console.error('[Migration]', error.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
