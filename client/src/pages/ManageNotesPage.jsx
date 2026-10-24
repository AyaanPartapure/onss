import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Files,
  Edit,
  Trash2,
  FilePlus,
  Search,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
} from 'lucide-react';
import api from '../api/apiClient';
import DashboardLayout from '../components/DashboardLayout';
import DownloadModal from '../components/DownloadModal';

const ManageNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notes/my-notes');
      if (res.data.success) {
        setNotes(res.data.notes);
        setFilteredNotes(res.data.notes);
      }
    } catch (err) {
      console.error('Error fetching user notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const query = searchTerm.trim().toLowerCase();
    const items = notes.filter(n => !query ||
      (n.notesTitle || '').toLowerCase().includes(query) ||
      (n.subject || '').toLowerCase().includes(query)
    );
    items.sort((a,b) => sortBy==='title' ? (a.notesTitle||'').localeCompare(b.notesTitle||'') :
      sortBy==='subject' ? (a.subject||'').localeCompare(b.subject||'') :
      new Date(b.createdAt)-new Date(a.createdAt));
    setFilteredNotes(items);
  }, [searchTerm, sortBy, notes]);

  const exportNotesCSV = () => {
    if (!filteredNotes.length) return;
    // Export only metadata, not private credentials or uploaded file contents.
    const escapeCell = value => {
      const safe = String(value ?? '').replace(/^[=+\-@\t\r]+/, "'");
      return '"' + safe.replace(/"/g,'""') + '"';
    };
    const rows = [
      ['Title', 'Subject', 'Description', 'Created At', 'File Count'],
      ...filteredNotes.map(note => [
        note.notesTitle, note.subject, note.notesDescription,
        note.createdAt ? new Date(note.createdAt).toISOString().slice(0, 10) : '',
        [note.file1,note.file2,note.file3,note.file4].filter(Boolean).length,
      ]),
    ];
    const csv = '\uFEFF' + rows.map(row=>row.map(escapeCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='onss-my-notes.csv';
    document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    try {
      const res = await api.delete(`/notes/${noteToDelete._id}`);
      if (res.data.success) {
        setNotes(notes.filter((n) => n._id !== noteToDelete._id));
        setActionMessage({ type: 'success', text: 'Note has been deleted successfully.' });
        setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete note.',
      });
    } finally {
      setNoteToDelete(null);
    }
  };

  return (
    <DashboardLayout title="Manage My Notes">
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Published Notes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, modify details, replace uploaded files, or delete your materials.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportNotesCSV} disabled={!filteredNotes.length} title="Export visible note details as CSV" className="onss-outline !py-2.5 !px-3 disabled:opacity-40"><Download size={15}/> Export CSV</button>
          <Link
            to="/notes/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-sm shrink-0"
          >
            <FilePlus className="w-4 h-4" />
            <span>Add New Notes</span>
          </Link></div>
        </div>

        {/* Action message */}
        {actionMessage.text && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your notes by title or subject..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div className="flex items-center gap-3"><select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} aria-label="Sort your notes" className="onss-input !py-2 !px-3 !text-xs"><option value="newest">Newest first</option><option value="title">Title A–Z</option><option value="subject">Subject A–Z</option></select><span className="text-xs font-medium text-slate-500">Total: <strong className="text-slate-800">{filteredNotes.length}</strong></span></div>
        </div>

        {/* Notes Data Table (Preserving parity with manage-notes.php) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading your notes...</div>
          ) : filteredNotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">#</th>
                    <th className="py-3.5 px-6">Subject</th>
                    <th className="py-3.5 px-6">Notes Title</th>
                    <th className="py-3.5 px-6">Files</th>
                    <th className="py-3.5 px-6">Creation Date</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredNotes.map((note, index) => {
                    const count = [note.file1, note.file2, note.file3, note.file4].filter(Boolean).length;
                    return (
                      <tr key={note._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/50">
                            {note.subject}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs">
                          <p className="truncate">{note.notesTitle}</p>
                          <p className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                            {note.notesDescription}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => setSelectedNote(note)}
                            className="inline-flex items-center space-x-1 text-slate-600 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 px-2 py-1 rounded-md font-medium text-[11px] transition-colors"
                          >
                            <FileText className="w-3 h-3 text-brand-500" />
                            <span>{count} files</span>
                          </button>
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/notes/edit/${note._id}`}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </Link>

                            <button
                              onClick={() => setNoteToDelete(note)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              <Files className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No notes found</p>
              <p className="text-slate-400 mt-0.5">
                {searchTerm ? 'No notes matched your search query.' : 'You have not uploaded any notes yet.'}
              </p>
              <Link
                to="/notes/new"
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white"
              >
                <FilePlus className="w-4 h-4" />
                <span>Upload Your First Note</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Note?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-800">"{noteToDelete.notesTitle}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setNoteToDelete(null)}
                className="py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Download / View Modal */}
      {selectedNote && (
        <DownloadModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </DashboardLayout>
  );
};

export default ManageNotesPage;
