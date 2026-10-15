import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  Files,
  User,
  KeyRound,
  Shield,
  LogOut,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ mobileClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
      isActive
        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        {/* Brand */}
        <div className="px-2">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2.5"
            onClick={mobileClose}
          >
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                ONSS Portal
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-brand-600">
                Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-slate-200/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold flex items-center justify-center shadow-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                Administrator
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>

          <NavLink to="/dashboard" end className={navItemClass} onClick={mobileClose}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/notes/new" className={navItemClass} onClick={mobileClose}>
            <FilePlus className="w-4 h-4" />
            <span>Add Notes</span>
          </NavLink>

          <NavLink to="/manage-notes" className={navItemClass} onClick={mobileClose}>
            <Files className="w-4 h-4" />
            <span>Manage Notes</span>
          </NavLink>

          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">
            Account & Security
          </p>

          <NavLink to="/profile" className={navItemClass} onClick={mobileClose}>
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </NavLink>

          <NavLink to="/settings" className={navItemClass} onClick={mobileClose}>
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </NavLink>

          {isAdmin && (
            <>
              <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">
                Administration
              </p>
              <NavLink to="/admin" className={navItemClass} onClick={mobileClose}>
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-slate-200 space-y-1">
        <Link
          to="/notes"
          className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          onClick={mobileClose}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Notes</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
