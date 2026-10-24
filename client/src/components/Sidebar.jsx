import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  FilePlus2,
  Files,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Shield,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

export default function Sidebar({ mobileClose }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const nav = ({ isActive }) =>
    `group w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[13px] font-bold transition-all ${
      isActive
        ? 'bg-gradient-to-r from-[#105975] to-[#087F7E] text-white shadow-lg shadow-teal-900/25'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`;

  const signOut = () => {
    logout();
    mobileClose?.();
    navigate('/');
  };

  return (
    <aside className="min-h-screen h-full w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-[#0b1633] px-4 py-7 text-white lg:sticky lg:top-0 flex flex-col">
      <BrandLogo to="/dashboard" subtitle="ONLINE NOTES & STUDENT SPACE" className="px-2 mb-9" inverse />

      <div className="mb-9 rounded-[26px] border border-white/10 bg-white/[0.05] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#105975_0%,#087F7E_100%)] text-lg font-black text-white shadow-lg shadow-indigo-500/20">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-white">{user?.fullName || 'Student'}</p>
            <p className="truncate text-[11px] text-slate-400">{user?.email || 'My account'}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
            <p className="text-[10px] uppercase tracking-[.18em] text-slate-500">Role</p>
            <p className="mt-1 text-xs font-bold text-slate-200">{isAdmin ? 'Admin' : 'Member'}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
            <p className="text-[10px] uppercase tracking-[.18em] text-slate-500">Status</p>
            <p className="mt-1 text-xs font-bold text-emerald-300">Active</p>
          </div>
        </div>
      </div>

      <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-500">Workspace</p>
      <nav className="space-y-1.5" aria-label="Dashboard navigation">
        <NavLink onClick={mobileClose} to="/dashboard" end className={nav}><LayoutDashboard size={18} /> Overview</NavLink>
        <NavLink onClick={mobileClose} to="/notes/new" className={nav}><FilePlus2 size={18} /> Upload notes</NavLink>
        <NavLink onClick={mobileClose} to="/manage-notes" className={nav}><Files size={18} /> Manage my notes</NavLink>
        <NavLink onClick={mobileClose} to="/saved" className={nav}><Bookmark size={18} /> Saved notes</NavLink>
      </nav>

      <p className="mb-3 mt-8 px-3 text-[10px] font-extrabold uppercase tracking-[.2em] text-slate-500">Account</p>
      <nav className="space-y-1.5" aria-label="Account navigation">
        <NavLink onClick={mobileClose} to="/profile" className={nav}><UserRound size={18} /> My profile</NavLink>
        <NavLink onClick={mobileClose} to="/settings" className={nav}><KeyRound size={18} /> Security settings</NavLink>
        {isAdmin && <NavLink onClick={mobileClose} to="/admin" className={nav}><Shield size={18} /> Admin console</NavLink>}
      </nav>

      <div className="mt-auto pt-8 space-y-2">
        <Link onClick={mobileClose} to="/notes" className="flex items-center gap-3 rounded-xl p-3 text-xs font-bold text-teal-200 hover:bg-white/5 hover:text-white">
          <ArrowLeft size={17} /> Browse public library
        </Link>
        <button type="button" onClick={signOut} className="w-full rounded-xl p-3 text-left text-xs font-bold text-rose-300 hover:bg-rose-400/10">
          <LogOut size={17} className="mr-3 inline" /> Sign out
        </button>
        <p className="px-3 pt-2 text-[10px] text-slate-600">ONSS · Your study space.</p>
      </div>
    </aside>
  );
}
