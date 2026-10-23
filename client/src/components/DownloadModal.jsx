
import React from 'react';
import { X, Download, FileText, Calendar, User, BookOpen } from 'lucide-react';

const DownloadModal = ({ note, onClose }) => {
  if (!note) return null;

  const files = [
    { label: 'File 1 (Primary Document)', file: note.file1 },
    { label: 'File 2 (Additional Material)', file: note.file2 },
    { label: 'File 3 (Supplementary Notes)', file: note.file3 },
    { label: 'File 4 (Reference / Slides)', file: note.file4 },
  ];

  const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-500/30 text-brand-200 border border-brand-400/30">
              {note.subject}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {note.notesTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">
                  {note.user?.fullName || 'Anonymous Author'}
                </span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recently added'}
                </span>
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Description & Summary
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {note.notesDescription}
            </p>
          </div>

          {/* Files List */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Download Note Files
            </h3>
            <div className="space-y-2.5">
              {files.map((item, idx) => {
                const isAvailable = Boolean(item.file && item.file.trim());
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isAvailable
                        ? 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm'
                        : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isAvailable
                            ? 'bg-brand-50 text-brand-600'
                            : 'bg-slate-200/50 text-slate-400'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {item.label}
                        </p>
                        {isAvailable ? (
                          <p className="text-[11px] text-slate-400 truncate">
                            Format: {getFileExtension(item.file)}
                          </p>
                        ) : (
                          <p className="text-[11px] text-rose-500 font-medium">
                            File is not available
                          </p>
                        )}
                      </div>
                    </div>

                    {isAvailable ? (
                      <a
                        href={`/uploads/${item.file}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 px-2.5 py-1">
                        Unavailable
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
