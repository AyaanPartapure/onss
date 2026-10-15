const express = require('express');
const router = express.Router();
const {
  getPublicNotes,
  getCategories,
  getMyNotes,
  getNoteById,
  createNote,
  updateNote,
  replaceNoteFile,
  deleteNote,
  getDashboardStats,
  getGlobalStats,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getPublicNotes);
router.get('/categories', getCategories);
router.get('/global/stats', getGlobalStats);

// Protected routes (Dashboard & User Notes)
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/my-notes', protect, getMyNotes);

// Single note details (Public)
router.get('/:id', getNoteById);

// Note creation (Protected, with up to 4 file uploads)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
    { name: 'file3', maxCount: 1 },
    { name: 'file4', maxCount: 1 },
  ]),
  createNote
);

// Note update (Protected)
router.put('/:id', protect, updateNote);

// Note single file replace (Protected)
router.put('/:id/file/:fileNumber', protect, upload.single('file'), replaceNoteFile);

// Note deletion (Protected)
router.delete('/:id', protect, deleteNote);

module.exports = router;
