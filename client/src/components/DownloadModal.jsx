import React, { useEffect, useState } from 'react';
import { X, Download, FileText, CalendarDays, UserRound, AlertTriangle, Link2, Check, Bookmark } from 'lucide-react';
import { resolveNoteFile, fileExtension } from '../utils/fileLinks';
import { toggleSaved, useSavedNotes } from '../utils/savedNotes';

export default function DownloadModal({ note, onClose }) {
  const [copied, setCopied] = useState(false);
  const ids = useSavedNotes();
  useEffect(() => {
    if (!note) return;
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [note, onClose]);
  if (!note) return null;
  const files = [note.file1,note.file2,note.file3,note.file4];
  const copyLink = async () => {
    const shareLink = `${location.origin}/notes?search=${encodeURIComponent(note.notesTitle || '')}`;
    try {await navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 1800);} catch { /* clipboard unavailable */ }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-slate-950/70 backdrop-blur-md" role="presentation" onMouseDown={(e) => {if(e.target===e.currentTarget)onClose();}}>
      <div role="dialog" aria-modal="true" aria-label="Note details" className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-[28px] shadow-2xl bg-white onss-reveal">
        <div className="relative px-7 pt-8 pb-7 onss-mesh text-white overflow-hidden">
          <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-indigo-400/20 blur-3xl pointer-events-none"/>
          <button onClick={onClose} type="button" aria-label="Close note details" className="absolute right-5 top-5 p-2 rounded-xl text-white/75 hover:bg-white/10 hover:text-white"><X size={19}/></button>
          <span className="inline-flex px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">{note.subject}</span>
          <h2 className="text-2xl font-extrabold mt-4 pr-6 leading-tight">{note.notesTitle}</h2>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-indigo-100"><span className="inline-flex gap-2 items-center"><UserRound size={14}/>{note.user?.fullName || 'Community member'}</span><span className="inline-flex gap-2 items-center"><CalendarDays size={14}/>{note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'Recent'}</span></div>
        </div>
        <div className="px-7 py-7 space-y-7">
          <section><h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">About this note</h3><p className="text-sm leading-7 text-slate-600 whitespace-pre-line">{note.notesDescription}</p></section>
          <section><div className="flex justify-between items-center mb-3"><h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Attached files</h3><span className="text-xs text-slate-400">PDF · DOC · DOCX</span></div>
            <div className="space-y-3">{files.map((file,idx)=>{
              const link=resolveNoteFile(file);return <div key={idx} className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50 flex justify-between items-center gap-3">
                <div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-indigo-600 flex items-center justify-center"><FileText size={19}/></div><div className="min-w-0"><p className="font-bold text-sm text-slate-800">File {idx+1}{idx===0?' · Primary':''}</p><p className="text-xs text-slate-400 truncate">{file ? `${fileExtension(file)} document` : 'Not attached'}</p></div></div>
                {link ? <a href={link} target="_blank" rel="noopener noreferrer" className="onss-primary !py-2.5 !px-3"><Download size={15}/><span className="hidden sm:inline">Open</span></a>:<span className="text-xs text-slate-400 font-semibold">Unavailable</span>}
              </div>})}</div>
            <div className="mt-3 flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-xl"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5"/>Older attachments may be unavailable if the server was redeployed. File storage is being improved.</div>
          </section>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" className="onss-outline !py-2.5" onClick={() => toggleSaved(note._id)}><Bookmark size={16} fill={ids.includes(String(note._id))?'currentColor':'none'}/>{ids.includes(String(note._id))?'Saved':'Save for later'}</button>
            <button type="button" className="onss-outline !py-2.5" onClick={copyLink}>{copied?<Check size={16}/>:<Link2 size={16}/>} {copied?'Copied!':'Copy search link'}</button>
            <button type="button" className="onss-outline !py-2.5 ml-auto" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
