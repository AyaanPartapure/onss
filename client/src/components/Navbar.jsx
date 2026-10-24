import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);

  const linkClass = ({ isActive }) =>
    `px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${
      isActive
        ? 'bg-teal-50 text-teal-800'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    }`;

  const signOut = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <>
      <div className="bg-slate-950 text-slate-200 text-[11px] sm:text-xs py-2.5 text-center px-3 tracking-wide">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-teal-300" />
          Discover notes, share learning resources and study better together.
        </span>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl shadow-[0_6px_30px_rgba(15,23,42,0.05)]">
        <div className="onss-shell flex h-[78px] items-center justify-between gap-4">
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/notes" className={linkClass}>Library</NavLink>
            <NavLink to="/saved" className={linkClass}>Saved notes</NavLink>
            {isAuthenticated && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('onss-open-search'))}
              aria-label="Quick search"
              title="Search (Ctrl+K)"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-500 shadow-sm hover:border-indigo-200 hover:bg-teal-50 hover:text-teal-800"
            >
              <Search size={16} />
              <span>Quick search</span>
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-400">
                <Command size={11} /> K
              </span>
            </button>

            {isAuthenticated ? (
              <>
                <Link className="onss-outline !px-3.5 !py-2.5" to="/dashboard">
                  <LayoutDashboard size={16} />
                  {user?.fullName?.split(' ')[0] || 'Dashboard'}
                </Link>
                <Link to="/notes/new" className="onss-primary !px-4 !py-2.5">
                  <Plus size={17} />
                  Upload notes
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2.5 text-[13px] font-bold text-slate-700 hover:text-indigo-600">
                  Log in
                </Link>
                <Link to="/register" className="onss-primary !py-2.5">
                  Join ONSS
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-100 bg-white shadow-xl px-5 py-5 onss-reveal">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {[['/', 'Home'], ['/notes', 'Library'], ['/saved', 'Saved notes']].map(([url, text]) => (
                <NavLink key={url} to={url} end={url === '/'} className={linkClass}>
                  {text}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                  {isAdmin && (
                    <NavLink to="/admin" className={linkClass}>
                      <ShieldCheck size={15} className="inline mr-2" />
                      Admin
                    </NavLink>
                  )}
                  <NavLink to="/notes/new" className={linkClass}>Upload notes</NavLink>
                  <button
                    type="button"
                    onClick={signOut}
                    className="rounded-xl px-3.5 py-2.5 text-left text-sm font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={16} className="mr-2 inline" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass}>Log in</NavLink>
                  <NavLink to="/register" className={linkClass}>Create account</NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
