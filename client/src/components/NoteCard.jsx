import React from 'react';
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Download,
  FileText,
  UserRound,
} from 'lucide-react';
import { toggleSaved, useSavedNotes } from '../utils/savedNotes';
import { resolveNoteFile } from '../utils/fileLinks';

const NoteCard = ({ note, onOpenModal, compact = false }) => {
  const ids = useSavedNotes();
  const isSaved = ids.includes(String(note._id));
  const fileCount = [note.file1, note.file2, note.file3, note.file4].filter(Boolean).length;
  const link = resolveNoteFile(note.file1);

  return (
    <article className={`onss-card onss-card-lift group relative flex flex-col overflow-hidden ${compact ? 'sm:flex-row sm:items-center' : ''}`}>
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-indigo-100/50 blur-2xl" />
      <div className={`relative flex-1 ${compact ? 'p-5' : 'p-6'}`}>
        <div className="mb-5 flex items-start justify-between gap-2">
          <span className="onss-tag max-w-[75%] truncate">{note.subject || 'General'}</span>
          <button
            type="button"
            onClick={() => toggleSaved(note._id)}
            aria-label={isSaved ? 'Remove saved note' : 'Save note'}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
            className={`rounded-2xl p-2.5 transition-colors ${
              isSaved
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <button type="button" onClick={() => onOpenModal(note)} className="block w-full text-left">
          <h3 className="onss-line-clamp-2 text-lg font-black leading-snug text-slate-950 transition-colors group-hover:text-indigo-600">
            {note.notesTitle || 'Untitled note'}
          </h3>
        </button>

        <p className="mt-3 min-h-[48px] line-clamp-2 text-sm leading-6 text-slate-500">
          {note.notesDescription || 'Shared study material.'}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5" />
            {note.user?.fullName || 'Community member'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {note.createdAt
              ? new Date(note.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recently shared'}
          </span>
        </div>
      </div>

      <div className={`relative flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-6 py-4 ${compact ? 'sm:border-l sm:border-t-0' : ''}`}>
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <FileText className="h-4 w-4 text-indigo-500" />
          {fileCount} {fileCount === 1 ? 'file' : 'files'}
        </span>
        <div className="flex items-center gap-2">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open primary file"
              className="rounded-xl bg-indigo-50 px-3 py-2 text-indigo-700 transition hover:bg-indigo-100"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={() => onOpenModal(note)}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800"
            type="button"
          >
            Details
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
