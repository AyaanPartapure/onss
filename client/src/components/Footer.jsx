import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Shield, Sparkles, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Online Notes Sharing System
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A modern, decentralized collaborative platform built to help students, researchers, and educators freely share, organize, and download lecture notes and study material.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-950/60 text-brand-300 border border-brand-800/40">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Modern MERN Architecture</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>JWT Secured</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-white transition-colors">
                  Featured Notes
                </Link>
              </li>
              <li>
                <Link to="/notes?subject=Computer%20Science" className="hover:text-white transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link to="/notes?subject=Database%20Systems" className="hover:text-white transition-colors">
                  Database Systems
                </Link>
              </li>
              <li>
                <Link to="/notes?subject=Mathematics" className="hover:text-white transition-colors">
                  Mathematics
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link to="/notes/new" className="hover:text-white transition-colors">
                  Upload Notes
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-white transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Online Notes Sharing System (ONSS). All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Modernized with React, Vite & Node.js</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
