import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Heart, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-[#0b1530] text-slate-300 border-t border-white/10">
      <div className="onss-shell pt-14 pb-8">
        <div className="mb-10 rounded-[30px] border border-white/10 bg-white/5 px-6 py-7 sm:px-8 sm:py-8 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.18em] text-cyan-200">
              <Sparkles size={14} /> Learning is better together
            </p>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black tracking-[-0.05em] text-white">
              Share better notes. Create a better learning network.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              ONSS helps students upload, discover and revisit class materials without the clutter.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 lg:mt-0">
            <Link to="/notes" className="onss-outline !border-white/15 !bg-white/10 !text-white hover:!bg-white/15">
              Explore notes
              <ArrowRight size={15} />
            </Link>
            <Link to="/register" className="onss-primary">
              Create account
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr] pb-14 border-b border-white/10">
          <div>
            <BrandLogo subtitle="ONLINE NOTES & STUDENT SPACE" inverse />
            <p className="text-sm text-slate-400 leading-7 max-w-sm mt-5">
              Find, save and share academic resources in one place. Less clutter, more time to learn.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-indigo-200">React + Vite</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-cyan-200">Responsive UI</span>
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-emerald-200">Student workflow</span>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-white mb-5">Explore</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link className="hover:text-white" to="/notes">Browse notes</Link></li>
              <li><Link className="hover:text-white" to="/saved">Saved notes</Link></li>
              <li><Link className="hover:text-white" to="/register">Create account</Link></li>
              <li><Link className="hover:text-white" to="/notes/new">Upload notes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white mb-5">More</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link className="hover:text-white" to="/login">Student login</Link></li>
              <li><Link className="hover:text-white" to="/dashboard">My dashboard</Link></li>
              <li>
                <a
                  className="inline-flex items-center gap-1 hover:text-white"
                  href="https://github.com/AyaanPartapure/onss"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Project on GitHub
                  <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-7 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ONSS. Built for students.</p>
          <p className="inline-flex items-center gap-1">
            Built with <Heart size={13} className="text-rose-400" /> for students.
          </p>
        </div>
      </div>
    </footer>
  );
}
