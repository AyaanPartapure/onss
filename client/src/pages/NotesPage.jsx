import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import api from '../api/apiClient';
import NoteCard from '../components/NoteCard';
import DownloadModal from '../components/DownloadModal';

const NotesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState({ totalNotes: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/notes/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Synchronize state whenever URL query params change (e.g. clicking category links)
  useEffect(() => {
    const subj = searchParams.get('subject') || 'all';
    const q = searchParams.get('search') || '';
    const pg = parseInt(searchParams.get('page')) || 1;
    setSelectedSubject(subj);
    setSearchInput(q);
    setAppliedSearch(q);
    setCurrentPage(pg);
  }, [searchParams]);

  // Fetch notes on filter / pagination change
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 9,
        };
        if (selectedSubject && selectedSubject !== 'all') {
          params.subject = selectedSubject;
        }
        if (appliedSearch) {
          params.search = appliedSearch;
        }

        const res = await api.get('/notes', { params });
        if (res.data.success) {
          setNotes(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedSubject, appliedSearch, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(searchInput.trim());
    setCurrentPage(1);
    const newParams = {};
    if (selectedSubject && selectedSubject !== 'all') newParams.subject = selectedSubject;
    if (searchInput.trim()) newParams.search = searchInput.trim();
    setSearchParams(newParams);
  };

  const handleSubjectChange = (subj) => {
    setSelectedSubject(subj);
    setCurrentPage(1);
    const newParams = {};
    if (subj && subj !== 'all') newParams.subject = subj;
    if (appliedSearch) newParams.search = appliedSearch;
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">
            Home &gt; Browse Notes
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Academic Notes Repository
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore, search, and download student verified lecture notes.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium bg-white px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
              Showing <span className="font-bold text-slate-800">{pagination.totalNotes}</span> notes in total
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search notes by title, subject keywords, or author..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
            >
              Search
            </button>
            {(appliedSearch || selectedSubject !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setAppliedSearch('');
                  setSelectedSubject('all');
                  setCurrentPage(1);
                  setSearchParams({});
                }}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </form>

          {/* Subject pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Subject:</span>
            </span>
            <button
              type="button"
              onClick={() => handleSubjectChange('all')}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedSubject === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Subjects
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSubjectChange(cat.name)}
                className={`shrink-0 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedSubject.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-600'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-slate-200/70 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onOpenModal={(selected) => setSelectedNote(selected)}
                />
              ))}
            </div>

            {/* Pagination Controls (Parity with notes.php First / Prev / Next / Last) */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">
                  Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800">{pagination.totalPages}</span>
                </p>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="First Page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  {/* Page indicator pills */}
                  <span className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                    {currentPage}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= pagination.totalPages}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={currentPage >= pagination.totalPages}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Last Page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-lg mx-auto">
            <FolderOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No matching notes found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find any notes matching your query. Try searching for a different subject or keyword.
            </p>
            <button
              onClick={() => {
                setSearchInput('');
                setAppliedSearch('');
                setSelectedSubject('all');
                setCurrentPage(1);
                setSearchParams({});
              }}
              className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

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

export default NotesPage;
