
import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  Calendar,
  User
} from 'lucide-react';

import { openNoteFile } from '../openNoteFile';

const DownloadModal = ({ note, onClose }) => {
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState('');

  if (!note) return null;

  const files = [
    { label: 'File 1 (Primary Document)', file: note.file1 },
    { label: 'File 2 (Additional Material)', file: note.file2 },
    { label: 'File 3 (Supplementary Notes)', file: note.file3 },
    { label: 'File 4 (Reference / Slides)', file: note.file4 }
  ];

  const getFileExtension = (filename) => {
    if (!filename) return 'DOCUMENT';

    const path = filename.split('?')[0];
    const extension = path.split('.').pop();

    return extension && extension !== path
      ? extension.toUpperCase()
      : 'DOCUMENT';
  };

  const getFileUrl = (file) => {
    const filename = file.trim();

    if (/^https?:\/\//i.test(filename)) {
      return filename;
    }

    const apiUrl = (
      import.meta.env.VITE_API_URL || ''
    ).replace(/\/+$/, '');

    const backendUrl = apiUrl.replace(/\/api$/, '');

    if (!backendUrl) {
      throw new Error(
        'VITE_API_URL is not configured.'
      );
    }

    const cleanPath = filename.replace(/^\/+/, '');

    const uploadPath = cleanPath.startsWith('uploads/')
      ? cleanPath
      : `uploads/${cleanPath}`;

    return `${backendUrl}/${uploadPath}`;
  };

  const handleDownload = async (file, index) => {
    if (!file || !file.trim()) {
      setError('This file is not available.');
      return;
    }

    setDownloading(index);
    setError('');

    try {
      const fileUrl = getFileUrl(file);

      console.log('ONSS Download URL:', fileUrl);

      await openNoteFile(fileUrl);

    } catch (err) {
      console.error('ONSS download failed:', err);

      setError(
        'Unable to open this document. The file may be missing from the server or the connection failed.'
      );
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">

          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/30 text-indigo-200">
            {note.subject}
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {note.notesTitle}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">

              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {note.user?.fullName || 'Anonymous Author'}
              </span>

              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleDateString()
                  : 'Recently added'}
              </span>

            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h3 className="text-xs font-semibold uppercase text-slate-500 mb-2">
              Description & Summary
            </h3>

            <p className="text-sm text-slate-700 whitespace-pre-line">
              {note.notesDescription}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
            >
              {error}
            </div>
          )}

          {/* Files */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-slate-500 mb-3">
              Download Note Files
            </h3>

            <div className="space-y-2.5">

              {files.map((item, index) => {
                const isAvailable =
                  typeof item.file === 'string' &&
                  item.file.trim().length > 0;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white gap-3"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800">
                          {item.label}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {isAvailable
                            ? `Format: ${getFileExtension(item.file)}`
                            : 'File is not available'}
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      disabled={!isAvailable || downloading !== null}
                      onClick={() =>
                        handleDownload(item.file, index)
                      }
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />

                      <span>
                        {downloading === index
                          ? 'Opening...'
                          : 'Download'}
                      </span>
                    </button>

                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default DownloadModal;
