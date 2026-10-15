import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Files,
  FilePlus,
  ArrowRight,
  Clock,
  User,
  Shield,
  Upload,
} from 'lucide-react';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalFiles: 0,
    recentNotes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/notes/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="space-y-8">
        {/* Welcome Banner (Preserving: "Hello, FullName Welcome to your panel") */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
              Student Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.fullName || 'Student'}!{' '}
              <span className="text-indigo-300 font-normal">Welcome to your panel</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Manage your published lecture notes, upload new revision documents, and update your profile details.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/notes/new"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-all"
              >
                <FilePlus className="w-4 h-4" />
                <span>Upload New Notes</span>
              </Link>
              <Link
                to="/manage-notes"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <Files className="w-4 h-4" />
                <span>Manage My Notes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Cards (Exact parity with dashboard.php metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Uploaded Subject Notes */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-brand-300 transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Subject Notes
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                {loading ? '...' : stats.totalNotes}
              </h3>
              <Link
                to="/manage-notes"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 mt-3"
              >
                <span>View Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
          </div>

          {/* Total Uploaded Notes File (File1 + File2 + File3 + File4) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-indigo-300 transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Document Files
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                {loading ? '...' : stats.totalFiles}
              </h3>
              <Link
                to="/manage-notes"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-3"
              >
                <span>View Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Files className="w-7 h-7" />
            </div>
          </div>

          {/* User Account Status */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-all sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Account Status
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-lg font-bold text-slate-900">Active Member</span>
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-3"
              >
                <span>Edit Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <User className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Recent Uploads Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Uploads</h2>
              <p className="text-xs text-slate-500">Your latest uploaded subject notes</p>
            </div>
            <Link
              to="/manage-notes"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              See All Notes
            </Link>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading recent notes...</div>
          ) : stats.recentNotes && stats.recentNotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-6">Subject</th>
                    <th className="py-3 px-6">Notes Title</th>
                    <th className="py-3 px-6">Date Added</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {stats.recentNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-800">
                        <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-200/50">
                          {note.subject}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-700">
                        {note.notesTitle}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          to={`/notes/edit/${note._id}`}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              You haven't uploaded any notes yet. Click{' '}
              <Link to="/notes/new" className="text-brand-600 font-semibold underline">
                Add Notes
              </Link>{' '}
              to publish your first document!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
