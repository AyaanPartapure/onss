import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  CloudUpload,
  Compass,
  Download,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import api from '../api/apiClient';
import NoteCard from '../components/NoteCard';
import DownloadModal from '../components/DownloadModal';
import { useAuth } from '../context/AuthContext';

const featureList = [
  {
    icon: Search,
    title: 'Search faster',
    text: 'Find study resources by subject, keyword or title without digging through clutter.',
  },
  {
    icon: CloudUpload,
    title: 'Upload smoothly',
    text: 'Share lecture notes, revision files and useful materials in a clean workflow.',
  },
  {
    icon: ShieldCheck,
    title: 'Study with clarity',
    text: 'Use a straightforward workspace for uploads, bookmarks and profile settings.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const results = await Promise.allSettled([
        api.get('/notes?limit=6'),
        api.get('/notes/categories'),
        api.get('/notes/global/stats'),
      ]);
      if (!active) return;

      if (results[0].status === 'fulfilled' && results[0].value.data.success) {
        setFeatured(results[0].value.data.data || []);
      }
      if (results[1].status === 'fulfilled' && results[1].value.data.success) {
        setCategories(results[1].value.data.categories || []);
      }
      if (results[2].status === 'fulfilled' && results[2].value.data.success) {
        setStats(results[2].value.data.stats || null);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/notes?search=${encodeURIComponent(search.trim())}` : '/notes');
  };

  return (
    <div className="min-h-screen bg-[#f7f9fd]">
      <section className="onss-mesh onss-grid relative overflow-hidden text-white">
        <div className="absolute left-[12%] top-0 h-72 w-72 rounded-full bg-indigo-400/20 blur-[120px]" />
        <div className="absolute right-[8%] top-[20%] h-80 w-80 rounded-full bg-cyan-400/15 blur-[140px]" />

        <div className="onss-shell relative grid gap-14 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pt-20 lg:pb-28">
          <div className="onss-reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-indigo-100">
              <span className="onss-dot" />
              One home for student notes
            </div>

            <h1 className="mt-7 max-w-3xl text-balance text-[42px] font-black leading-[1.04] tracking-[-0.07em] sm:text-[58px] xl:text-[72px]">
              Better notes.
              <span className="onss-gradient-text"> Smarter studying </span>
              starts here.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-indigo-100/82 sm:text-lg">
              Find helpful lecture notes, keep useful resources close and share your own work with classmates. Everything you need for a focused study session, in one place.
            </p>

            <form onSubmit={submit} className="mt-9 flex max-w-2xl items-center gap-2 rounded-[22px] bg-white p-2.5 text-slate-900 shadow-[0_25px_80px_rgba(3,7,28,.28)]">
              <Search size={20} className="ml-2 shrink-0 text-indigo-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search notes"
                placeholder="Search DSA, physics, economics, Java..."
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-slate-400"
              />
              <button type="submit" className="onss-primary shrink-0 !rounded-2xl !px-5 !py-3.5">
                Explore library
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to={isAuthenticated ? '/notes/new' : '/register'} className="onss-primary">
                {isAuthenticated ? 'Upload your notes' : 'Create free account'}
                <ArrowRight size={16} />
              </Link>
              <Link to="/notes" className="onss-outline !border-white/15 !bg-white/10 !text-white hover:!bg-white/15">
                Browse notes
              </Link>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black">{stats?.totalNotes ?? '—'}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[.18em] text-indigo-100/75">Total shared notes</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black">{stats?.totalSubjects ?? '—'}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[.18em] text-indigo-100/75">Subjects</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black">{stats?.totalUsers ?? '—'}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[.18em] text-indigo-100/75">Community members</p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block onss-reveal" style={{ animationDelay: '.1s' }}>
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-[120px]" />
            <div className="relative mx-auto max-w-[560px] rounded-[34px] border border-white/20 bg-white/95 p-5 text-slate-900 shadow-[0_40px_100px_rgba(2,8,32,.42)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                    <BookOpenText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black">ONSS student workspace</p>
                    <p className="text-[11px] text-slate-400">Search · save · share</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {['#fb7185', '#fbbf24', '#34d399'].map((color) => (
                    <span key={color} className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] bg-indigo-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                    <Compass size={18} />
                  </div>
                  <p className="mt-4 text-xl font-black">Find notes, faster</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Browse subjects and open shared resources in a few clicks.</p>
                </div>
                <div className="rounded-[24px] bg-cyan-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm">
                    <Layers3 size={18} />
                  </div>
                  <p className="mt-4 text-xl font-black">Your notes, organized</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Upload documents and keep your shared materials together.</p>
                </div>
              </div>

              <div className="mt-4 rounded-[26px] bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-slate-900">What you can do</p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">Updated UI</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    'Find notes by subject or title',
                    'Save notes to revisit later',
                    'Upload up to four files per note',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                      <CheckCircle2 size={17} className="text-emerald-500" />
                      <span className="text-sm font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white/75">
        <div className="onss-shell py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {categories.slice(0, 6).map((item) => (
              <Link key={item.name} to={`/notes?subject=${encodeURIComponent(item.name)}`} className="onss-tag hover:bg-indigo-50">
                {item.name}
                <span className="opacity-60">{item.count}</span>
              </Link>
            ))}
          </div>
          <Link to="/notes" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
            View full library →
          </Link>
        </div>
      </section>

      <section className="onss-shell onss-section">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="onss-eyebrow"><Sparkles size={14} /> Featured materials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-[-0.05em] text-slate-950">
              Recent notes from the community.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Explore recently uploaded learning materials.
            </p>
          </div>
          <Link to="/notes" className="onss-outline shrink-0">Browse all notes</Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="onss-shimmer h-72 rounded-[28px]" />
            ))}
          </div>
        ) : featured.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((note) => (
              <NoteCard key={note._id} note={note} onOpenModal={setSelected} />
            ))}
          </div>
        ) : (
          <div className="onss-card px-6 py-16 text-center">
            <BookOpenText className="mx-auto text-indigo-300" size={44} />
            <h3 className="mt-4 text-xl font-black text-slate-950">No notes yet</h3>
            <p className="mt-2 text-sm text-slate-500">Start building the library by sharing your first study material.</p>
            <Link to={isAuthenticated ? '/notes/new' : '/register'} className="onss-primary mt-6">
              Get started
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      <section className="onss-shell pb-20">
        <div className="grid gap-6 lg:grid-cols-[.96fr_1.04fr]">
          <div className="onss-card p-8">
            <span className="onss-eyebrow"><Star size={14} /> Built around your study routine</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950">Less searching. More learning.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Your study time matters. ONSS brings note discovery, file sharing and personal organization into a straightforward workspace.
            </p>
            <div className="mt-8 space-y-4">
              {featureList.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[22px] border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="onss-card p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Download size={20} />
              </div>
              <h3 className="mt-5 text-2xl font-black text-slate-950">Open files quickly</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">Primary files can be opened directly, while note details remain clearly structured.</p>
            </div>
            <div className="onss-card p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                <Users size={20} />
              </div>
              <h3 className="mt-5 text-2xl font-black text-slate-950">Community-first</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">The design is made to showcase the note library and help students contribute more confidently.</p>
            </div>
            <div className="onss-card p-7 sm:col-span-2">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-950">Make your next study session easier.</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">Explore existing notes, or contribute a resource that could help another student prepare.</p>
                </div>
                <Link to={isAuthenticated ? '/dashboard' : '/register'} className="onss-primary shrink-0">
                  {isAuthenticated ? 'Open dashboard' : 'Create account'}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selected && <DownloadModal note={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
