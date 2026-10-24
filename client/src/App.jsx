import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SavedNotesPage from './pages/SavedNotesPage';
import QuickSearch from './components/QuickSearch';
import NotesPage from './pages/NotesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AddNotePage from './pages/AddNotePage';
import ManageNotesPage from './pages/ManageNotesPage';
import EditNotePage from './pages/EditNotePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  const location = useLocation();

  // Hide public navbar and footer on dashboard views and auth pages
  const isDashboardRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/notes/new') ||
    location.pathname.startsWith('/manage-notes') ||
    location.pathname.startsWith('/notes/edit') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/admin');

  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname === '/signin' ||
    location.pathname === '/register' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password';

  const showPublicHeaderFooter = !isDashboardRoute && !isAuthRoute;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {showPublicHeaderFooter && <Navbar />}
      <QuickSearch />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/saved" element={<SavedNotesPage />} />

          {/* Authentication Routes (with PHP URL aliases) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected User Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              <ProtectedRoute>
                <AddNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-notes"
            element={
              <ProtectedRoute>
                <AddNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-notes"
            element={
              <ProtectedRoute>
                <ManageNotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/edit/:id"
            element={
              <ProtectedRoute>
                <EditNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-6xl font-black text-slate-300">404</h1>
                <p className="text-lg font-bold text-slate-700 mt-2">Page Not Found</p>
                <p className="text-xs text-slate-500 mt-1">The requested page doesn't exist.</p>
                <Link
                  to="/"
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors"
                >
                  Return Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {showPublicHeaderFooter && <Footer />}
    </div>
  );
};

export default App;
