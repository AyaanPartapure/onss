import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title = 'Dashboard' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onUploadPage = pathname === '/notes/new' || pathname === '/add-notes';

  const signOut = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fd] lg:flex">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] flex lg:hidden">
          <button
            type="button"
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 max-h-screen overflow-auto">
            <Sidebar mobileClose={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="absolute right-5 top-5 rounded-xl bg-white/15 p-2 text-white"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
          <div className="flex h-[80px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open navigation"
                type="button"
                className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="hidden text-[10px] font-extrabold uppercase tracking-[.18em] text-teal-700 sm:block">
                  Your workspace
                </p>
                <h1 className="text-lg sm:text-[22px] font-black tracking-[-0.05em] text-slate-950">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('onss-open-search'))}
                className="hidden rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 sm:inline-flex"
                aria-label="Search"
              >
                <Search size={17} />
              </button>
              <Link to="/notes" className="hidden sm:flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100">
                <Home size={16} /> Library
              </Link>
              <Link to={onUploadPage ? "/manage-notes" : "/notes/new"} className="onss-primary !px-3.5 !py-2.5">{onUploadPage ? "My notes" : "Upload note"}</Link>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Account menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((v) => !v)}
                  className="h-11 w-11 rounded-2xl border border-teal-100 bg-teal-50 text-teal-800 font-black shadow-sm"
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </button>

                {profileOpen && (
                  <>
                    <button type="button" onClick={() => setProfileOpen(false)} aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" />
                    <div className="absolute right-0 top-14 z-50 w-60 rounded-[24px] border border-slate-200 bg-white p-2 shadow-2xl onss-reveal">
                      <div className="rounded-2xl bg-slate-50 px-3 py-3">
                        <p className="truncate text-sm font-extrabold text-slate-900">{user?.fullName}</p>
                        <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
                      </div>
                      <Link onClick={() => setProfileOpen(false)} to="/profile" className="mt-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-slate-600 hover:bg-teal-50">
                        <UserRound size={16} /> My profile
                      </Link>
                      <button type="button" onClick={signOut} className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
          <div className="mx-auto max-w-[1220px] onss-reveal">{children}</div>
        </main>
      </div>
    </div>
  );
}
