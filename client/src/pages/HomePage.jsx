import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ArrowRight,
  Download,
  Users,
  FileCheck,
  Sparkles,
  Layers,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import api from '../api/apiClient';
import NoteCard from '../components/NoteCard';
import DownloadModal from '../components/DownloadModal';

const HomePage = () => {
  const [featuredNotes, setFeaturedNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ totalNotes: 0, totalUsers: 0, totalFiles: 0, totalSubjects: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [notesRes, catRes, statsRes] = await Promise.all([
          api.get('/notes?limit=6'),
          api.get('/notes/categories'),
          api.get('/notes/global/stats'),
        ]);

        if (notesRes.data.success) setFeaturedNotes(notesRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (statsRes.data.success) setStats(statsRes.data.stats);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/notes');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white py-20 lg:py-28">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Modern Decentralized Academic Exchange</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Online Learning & <br />
            <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Notes Sharing Platform
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover, upload, and download comprehensive lecture notes, study guides, and research materials verified by peers and educators worldwide.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto relative flex items-center shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, subject (e.g. Data Structures, Physics)..."
              className="w-full bg-transparent text-white placeholder-slate-400 px-3 py-2.5 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-all duration-150"
            >
              Search
            </button>
          </form>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all"
            >
              Join for Free
            </Link>
            <Link
              to="/notes"
              className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all"
            >
              <span>Explore All Notes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-bold text-brand-400">
                {stats.totalNotes || 12}+
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Uploaded Notes
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-bold text-indigo-400">
                {stats.totalFiles || 24}+
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Document Files
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                {stats.totalSubjects || 6}+
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Subject Fields
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                {stats.totalUsers || 10}+
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                Registered Students
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects Pills */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Popular Categories:
              </span>
              <Link
                to="/notes"
                className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-sm"
              >
                All Subjects
              </Link>
              {categories.slice(0, 8).map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/notes?subject=${encodeURIComponent(cat.name)}`}
                  className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                  {cat.name} ({cat.count})
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Notes Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Curated Knowledge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Notes & Study Materials
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse top-rated lecture notes shared by our active student community.
            </p>
          </div>
          <Link
            to="/notes"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <span>View All Notes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-slate-200/60 animate-pulse"
              />
            ))}
          </div>
        ) : featuredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onOpenModal={(selected) => setSelectedNote(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">No notes found yet</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to upload and share your notes!</p>
            <Link
              to="/notes/new"
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white"
            >
              Upload Notes Now
            </Link>
          </div>
        )}
      </section>

      {/* Services / Feature Cards (Preserving & Modernizing 3 service cards from original index.php) */}
      <section className="bg-slate-100/70 border-t border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Learn With ONSS?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Everything you need to boost your academic preparation in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Documents</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Access verified PDF, DOC, and DOCX study notes uploaded by verified university students and educators.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Structured Curriculum</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter by Subject and specific modules to quickly locate the exact lecture materials needed for your exams.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Direct & Instant Downloads</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Download primary and supplementary course files without paywalls or restrictive download speeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Modal */}
      {selectedNote && (
        <DownloadModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
