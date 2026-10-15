import React from 'react';
import { Download, FileText, User, Calendar, ExternalLink } from 'lucide-react';

const NoteCard = ({ note, onOpenModal }) => {
  const fileCount = [note.file1, note.file2, note.file3, note.file4].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner & Subject */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
            {note.subject}
          </span>
          <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>
              {note.createdAt
                ? new Date(note.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent'}
            </span>
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpenModal(note)}
          className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug cursor-pointer"
        >
          {note.notesTitle}
        </h3>

        {/* Author */}
        <div className="flex items-center space-x-1.5 mt-2 text-xs text-slate-500">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>By</span>
          <span className="font-semibold text-slate-700 truncate">
            {note.user?.fullName || 'Anonymous'}
          </span>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {note.notesDescription}
        </p>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-5 pt-4 mt-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <FileText className="w-4 h-4 text-brand-600" />
          <span className="font-medium">
            {fileCount} {fileCount === 1 ? 'file' : 'files'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {note.file1 && (
            <a
              href={`/uploads/${note.file1}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-sm transition-all"
              title="Download Primary File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}

          <button
            onClick={() => onOpenModal(note)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-200/60 transition-colors"
            title="View Details & All Files"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
