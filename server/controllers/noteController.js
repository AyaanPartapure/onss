const { saveFile, cleanTempFiles, removeFilesBestEffort } = require('../services/fileStorage');
const Note = require('../models/Note');
const User = require('../models/User');

// Helper to count valid files in a note
const countFiles = (note) => {
  let count = 0;
  if (note.file1) count++;
  if (note.file2) count++;
  if (note.file3) count++;
  if (note.file4) count++;
  return count;
};

// @desc    Get all public notes (with search, category filter, pagination)
// @route   GET /api/notes
// @access  Public
const getPublicNotes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const search = req.query.search ? req.query.search.trim() : '';
    const subject = req.query.subject ? req.query.subject.trim() : '';

    const query = {};

    if (subject && subject.toLowerCase() !== 'all') {
      query.subject = { $regex: new RegExp(`^${subject}$`, 'i') };
    }

    if (search) {
      // Find matching authors first
      const matchedUsers = await User.find({
        fullName: { $regex: search, $options: 'i' },
      }).select('_id');

      const userIds = matchedUsers.map((u) => u._id);

      query.$or = [
        { notesTitle: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { notesDescription: { $regex: search, $options: 'i' } },
        { user: { $in: userIds } },
      ];
    }

    const totalNotes = await Note.countDocuments(query);
    const totalPages = Math.ceil(totalNotes / limit) || 1;
    const skip = (page - 1) * limit;

    const notes = await Note.find(query)
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: notes,
      pagination: {
        page,
        limit,
        totalNotes,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct subjects/categories with count
// @route   GET /api/notes/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const subjects = await Note.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formatted = subjects.map((s) => ({
      name: s._id,
      count: s.count,
    }));

    res.json({
      success: true,
      categories: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notes uploaded by logged-in user
// @route   GET /api/notes/my-notes
// @access  Private
const getMyNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      'user',
      'fullName email'
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Upload new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  const pending = req.files || {};
  const savedNames = [];
  try {
    const { subject, notestitle, notesTitle, notesdesc, notesDescription } = req.body;
    const title = notesTitle || notestitle;
    const description = notesDescription || notesdesc;

    if (!title?.trim() || !subject?.trim() || !description?.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide title, subject and description.' });
    }
    if (!pending.file1?.[0]) {
      return res.status(400).json({ success: false, message: 'Primary document (File 1) is required.' });
    }

    const stored = {};
    for (const field of ['file1', 'file2', 'file3', 'file4']) {
      const file = pending[field]?.[0];
      stored[field] = file ? await saveFile(file) : '';
      if (stored[field]) savedNames.push(stored[field]);
    }

    const note = await Note.create({
      user: req.user._id,
      subject: subject.trim(),
      notesTitle: title.trim(),
      notesDescription: description.trim(),
      ...stored,
    });

    res.status(201).json({ success: true, message: 'Note published successfully.', note });
  } catch (error) {
    await removeFilesBestEffort(savedNames);
    next(error);
  } finally {
    await cleanTempFiles(pending);
  }
};

// @desc    Update note metadata
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    // Verify ownership or admin
    if (
      note.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this note.',
      });
    }

    const { subject, notestitle, notesTitle, notesdesc, notesDescription } = req.body;

    if (subject) note.subject = subject.trim();
    if (notesTitle || notestitle) note.notesTitle = (notesTitle || notestitle).trim();
    if (notesDescription || notesdesc) note.notesDescription = (notesDescription || notesdesc).trim();

    await note.save();

    res.json({
      success: true,
      message: 'Notes have been updated successfully!',
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Replace a single file in note (replaces changefile1..4.php)
// @route   PUT /api/notes/:id/file/:fileNumber
// @access  Private
const replaceNoteFile = async (req, res, next) => {
  let savedName = '';
  try {
    const { id, fileNumber } = req.params;
    const field = `file${fileNumber}`;
    if (!['file1', 'file2', 'file3', 'file4'].includes(field)) {
      return res.status(400).json({ success: false, message: 'Invalid file slot.' });
    }
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });

    if (note.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to replace this file.' });
    }
    if (!req.file) return res.status(400).json({ success: false, message: 'Choose a replacement document.' });

    savedName = await saveFile(req.file);
    const oldName = note[field];
    note[field] = savedName;
    await note.save();
    savedName = ''; // The saved note now owns this document.
    if (oldName) await removeFilesBestEffort([oldName]);

    res.json({ success: true, message: `File ${fileNumber} updated successfully.`, note });
  } catch (error) {
    if (savedName) await removeFilesBestEffort([savedName]);
    next(error);
  } finally {
    if (req.file) await cleanTempFiles([req.file]);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found.',
      });
    }

    if (
      note.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this note.',
      });
    }

    const filesToDelete = [note.file1, note.file2, note.file3, note.file4].filter(Boolean);
    await note.deleteOne();
    await removeFilesBestEffort(filesToDelete);

    res.json({
      success: true,
      message: 'Note has been deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard stats (Total Notes, Total Files)
// @route   GET /api/notes/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userNotes = await Note.find({ user: userId });

    const totalNotes = userNotes.length;
    let totalFiles = 0;

    userNotes.forEach((n) => {
      totalFiles += countFiles(n);
    });

    const recentNotes = await Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalNotes,
        totalFiles,
        user: {
          fullName: req.user.fullName,
          email: req.user.email,
          mobileNumber: req.user.mobileNumber,
        },
        recentNotes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get global statistics (all notes, all users, for admin & public counters)
// @route   GET /api/notes/global/stats
// @access  Public
const getGlobalStats = async (req, res, next) => {
  try {
    const totalNotes = await Note.countDocuments();
    const totalUsers = await User.countDocuments();
    const subjects = await Note.distinct('subject');

    const allNotes = await Note.find({}, 'file1 file2 file3 file4');
    let totalFiles = 0;
    allNotes.forEach((n) => {
      totalFiles += countFiles(n);
    });

    res.json({
      success: true,
      stats: {
        totalNotes,
        totalUsers,
        totalSubjects: subjects.length,
        totalFiles,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
