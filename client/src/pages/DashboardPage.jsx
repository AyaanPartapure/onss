import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Clock3,
  FilePlus2,
  FileText,
  Files,
  ShieldCheck,
  Upload,
  UserRound,
} from 'lucide-react';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function StatTile({ label, value, hint, icon: Icon, tone = 'indigo', linkTo, linkLabel }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="onss-card onss-card-lift p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-slate-400">{label}</p>
          <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
          {linkTo && (
            <Link to={linkTo} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700">
              {linkLabel} <ArrowRight size={14} />
            </Link>
          )}
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tones[tone] || tones.indigo}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalNotes: 0, totalFiles: 0, recentNotes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/notes/dashboard/stats')
      .then((res) => {
        if (active && res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => {
        console.error('Error fetching dashboard stats:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <DashboardLayout title="Dashboard Overview">
      <div className="space-y-8">
        <section className="onss-mesh onss-grid relative overflow-hidden rounded-[32px] p-7 text-white shadow-[0_26px_80px_rgba(9,18,40,.22)] sm:p-9 lg:p-10">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-indigo-400/20 blur-[130px]" />
          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-indigo-100">
                <ShieldCheck size={14} /> Student dashboard
              </span>
              <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-[-0.06em] sm:text-4xl lg:text-5xl">
                Hello, {user?.fullName || 'Student'}.
                <span className="block onss-gradient-text">Your study workspace is ready.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100/80 sm:text-base">
                Manage your published notes, monitor files, update your profile and keep your workflow clean.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/notes/new" className="onss-primary">
                  <Upload size={16} /> Upload new note
                </Link>
                <Link to="/manage-notes" className="onss-outline !border-white/15 !bg-white/10 !text-white hover:!bg-white/15">
                  <Files size={16} /> Manage notes
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-indigo-100/75">Account</p>
                <p className="mt-3 text-lg font-black">{user?.role === 'admin' ? 'Administrator' : 'Student member'}</p>
                <p className="mt-2 text-xs text-indigo-100/75">Access to upload, edit and manage notes.</p>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-indigo-100/75">Saved notes</p>
                <p className="mt-3 text-lg font-black">Personal collection</p>
                <p className="mt-2 text-xs text-indigo-100/75">Use bookmarks to revisit useful materials later.</p>
              </div>
              <div className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-indigo-100/75">Status</p>
                <p className="mt-3 text-lg font-black text-emerald-200">Active</p>
                <p className="mt-2 text-xs text-indigo-100/75">Manage your account, notes and documents.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StatTile
            label="Total subject notes"
            value={loading ? '...' : stats.totalNotes}
            hint="All note entries currently uploaded by you."
            icon={FileText}
            tone="indigo"
            linkTo="/manage-notes"
            linkLabel="Review my notes"
          />
          <StatTile
            label="Total document files"
            value={loading ? '...' : stats.totalFiles}
            hint="Across primary and supporting files attached to your notes."
            icon={Files}
            tone="cyan"
            linkTo="/manage-notes"
            linkLabel="Open file manager"
          />
          <StatTile
            label="Profile status"
            value="Active"
            hint="Your account is ready and available for note publishing."
            icon={UserRound}
            tone="emerald"
            linkTo="/profile"
            linkLabel="Edit profile"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <div className="onss-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-black tracking-[-0.04em] text-slate-950">Recent uploads</h3>
                <p className="mt-1 text-xs text-slate-500">Your latest notes and upload activity.</p>
              </div>
              <Link to="/manage-notes" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                See all
              </Link>
            </div>

            {loading ? (
              <div className="p-6 text-sm text-slate-400">Loading your recent uploads...</div>
            ) : stats.recentNotes?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-[.18em] text-slate-400">
                    <tr>
                      <th className="px-6 py-3.5">Subject</th>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Created</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {stats.recentNotes.map((note) => (
                      <tr key={note._id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
                            {note.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{note.notesTitle}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(note.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/notes/edit/${note._id}`} className="inline-flex rounded-xl bg-indigo-50 px-3 py-2 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center">
                <FilePlus2 className="mx-auto text-slate-300" size={42} />
                <h4 className="mt-4 text-base font-black text-slate-900">You have not uploaded notes yet</h4>
                <p className="mt-2 text-sm text-slate-500">Start with your first document and it will appear here.</p>
                <Link to="/notes/new" className="onss-primary mt-5">
                  Upload first note
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="onss-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Clock3 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-[-0.04em] text-slate-950">Quick actions</h3>
                  <p className="text-xs text-slate-500">Your most used actions in one place.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <Link to="/notes/new" className="rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                  Upload new note
                </Link>
                <Link to="/manage-notes" className="rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                  Manage my notes
                </Link>
                <Link to="/saved" className="rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                  <span className="inline-flex items-center gap-2"><Bookmark size={16} /> Open saved notes</span>
                </Link>
              </div>
            </div>

            <div className="onss-card p-6">
              <h3 className="text-lg font-black tracking-[-0.04em] text-slate-950">Workspace summary</h3>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-bold text-slate-800">Uploads</p>
                    <p className="mt-1 text-xs text-slate-500">Keep your materials fresh and well-described.</p>
                  </div>
                  <span className="text-sm font-black text-indigo-600">{loading ? '...' : stats.totalNotes}</span>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-bold text-slate-800">Files attached</p>
                    <p className="mt-1 text-xs text-slate-500">Across primary and supporting documents.</p>
                  </div>
                  <span className="text-sm font-black text-cyan-600">{loading ? '...' : stats.totalFiles}</span>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-bold text-slate-800">Account state</p>
                    <p className="mt-1 text-xs text-slate-500">Profile is active and ready.</p>
                  </div>
                  <span className="text-sm font-black text-emerald-600">Live</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
