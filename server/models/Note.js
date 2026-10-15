const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    notesTitle: {
      type: String,
      required: [true, 'Notes title is required'],
      trim: true,
    },
    notesDescription: {
      type: String,
      required: [true, 'Notes description is required'],
      trim: true,
    },
    file1: {
      type: String,
      required: [true, 'Primary file (File 1) is required'],
    },
    file2: {
      type: String,
      default: '',
    },
    file3: {
      type: String,
      default: '',
    },
    file4: {
      type: String,
      default: '',
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for backward-compatibility with PHP query property names if needed
noteSchema.virtual('NotesDecription').get(function () {
  return this.notesDescription;
});

// Full-text search index on subject, title, and description
noteSchema.index({ subject: 'text', notesTitle: 'text', notesDescription: 'text' });

module.exports = mongoose.model('Note', noteSchema);
