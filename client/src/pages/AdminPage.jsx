import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, Trash2, Search, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../api/apiClient';
import DashboardLayout from '../components/DashboardLayout';
import DownloadModal from '../components/DownloadModal';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [globalStats, setGlobalStats] = useState({ totalNotes: 0, totalUsers: 0, totalFiles: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'notes'
  const [searchTerm, setSearchTerm] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, nRes, sRes] = await Promise.all([
        api.get('/users'),
        api.get('/notes?limit=100'),
        api.get('/notes/global/stats'),
      ]);

      if (uRes.data.success) setUsers(uRes.data.users);
      if (nRes.data.success) setNotes(nRes.data.data);
      if (sRes.data.success) setGlobalStats(sRes.data.stats);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to load admin data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}" and all their notes?`)) {
      return;
    }

    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        setMessage({ type: 'success', text: `User ${userName} deleted successfully.` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete user.',
      });
    }
  };

  const handleDeleteNote = async (noteId, noteTitle) => {
    if (!window.confirm(`Are you sure you want to delete note "${noteTitle}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/notes/${noteId}`);
      if (res.data.success) {
        setNotes(notes.filter((n) => n._id !== noteId));
        setMessage({ type: 'success', text: `Note deleted successfully.` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete note.',
      });
    }
  };

  return (
    <DashboardLayout title="System Administration">
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Admin Management Console</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full governance of student accounts, notes repository, and system metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                {globalStats.totalUsers}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Published Notes
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                {globalStats.totalNotes}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Files Uploaded
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                {globalStats.totalFiles}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Action message */}
        {message.text && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Manage Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notes'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Manage All Notes ({notes.length})
          </button>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6">Mobile</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Notes</th>
                    <th className="py-3.5 px-6">Reg Date</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800">{u.fullName}</td>
                      <td className="py-4 px-6 text-slate-600">{u.email}</td>
                      <td className="py-4 px-6 text-slate-600">{u.mobileNumber}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700">{u.noteCount || 0}</td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(u.regDate || u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id, u.fullName)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete User and their Notes"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Notes Table */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Subject</th>
                    <th className="py-3.5 px-6">Notes Title</th>
                    <th className="py-3.5 px-6">Author</th>
                    <th className="py-3.5 px-6">Upload Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {notes.map((n) => (
                    <tr key={n._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200/50">
                          {n.subject}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate">
                        {n.notesTitle}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {n.user?.fullName || 'User'}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedNote(n)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Preview Files"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(n._id, n.notesTitle)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Note Globally"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedNote && (
        <DownloadModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </DashboardLayout>
  );
};

export default AdminPage;
