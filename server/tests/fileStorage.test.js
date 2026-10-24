const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Writable } = require('node:stream');
const Module = require('node:module');

// Isolated storage test without contacting or modifying the user's Atlas database.
const memory = new Map();
class GridFSBucketMock {
  openUploadStream(filename, options) {
    const chunks = [];
    const stream = new Writable({ write(chunk, _encoding, cb) { chunks.push(chunk); cb(); } });
    stream.on('finish', () => memory.set(filename, { filename, content: Buffer.concat(chunks), metadata: options.metadata, _id: filename }));
    return stream;
  }
  find({ filename }) {
    return { sort() { return this; }, limit() { return this; }, next: async () => memory.get(filename) || null };
  }
  async delete(key) { memory.delete(key); }
}
const fakeMongoose = { connection: { db: {} }, mongo: { GridFSBucket: GridFSBucketMock } };
const originalLoad = Module._load;
Module._load = function patched(id, parent, main) {
  if (id === 'mongoose') return fakeMongoose;
  if (id === '../models/Note') return { exists: async () => null };
  return originalLoad.call(this, id, parent, main);
};
const storage = require('../services/fileStorage');
Module._load = originalLoad;

async function test() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'onss-storage-test-'));
  try {
    const valid = path.join(dir, 'valid.pdf');
    fs.writeFileSync(valid, Buffer.from('%PDF-1.4\nhello test\n%%EOF'));
    const file = { path: valid, originalname: 'Lecture Notes.pdf' };
    const first = await storage.saveFile(file);
    const second = await storage.saveFile(file);
    assert.match(first, /^Lecture_Notes-\d+-[a-f0-9]{18}\.pdf$/);
    assert.notEqual(first, second, 'filenames must not collide');
    assert.equal(memory.get(first).metadata.contentType, 'application/pdf');
    assert.equal(memory.get(first).content.toString(), fs.readFileSync(valid).toString());

    const invalid = path.join(dir, 'bad.pdf');
    fs.writeFileSync(invalid, 'not a PDF');
    await assert.rejects(storage.saveFile({ path: invalid, originalname: 'bad.pdf' }), /not a valid/);

    await storage.removeFile(first);
    assert.equal(memory.has(first), false);
    await storage.removeFile('unknown.pdf');

    await storage.cleanTempFiles([file]);
    assert.equal(fs.existsSync(valid), false);
    console.log('PASS: GridFS storage mock (upload, collision, validation, removal, temp cleanup)');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
test().catch((error) => { console.error(error); process.exitCode = 1; });
