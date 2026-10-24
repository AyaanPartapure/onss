import React, {useEffect,useState} from 'react';
import {Bookmark,ArrowRight,BookOpenText,Trash2} from 'lucide-react';
import {Link} from 'react-router-dom';
import api from '../api/apiClient';
import NoteCard from '../components/NoteCard';
import DownloadModal from '../components/DownloadModal';
import {getSavedIds,useSavedNotes} from '../utils/savedNotes';
export default function SavedNotesPage(){
  const ids=useSavedNotes(),[notes,setNotes]=useState([]),[loading,setLoading]=useState(true),[selected,setSelected]=useState(null);
  useEffect(()=>{let active=true;setLoading(true);const keys=getSavedIds();if(keys.length===0){setNotes([]);setLoading(false);return;}
    Promise.all(keys.map(id=>api.get(`/notes/${encodeURIComponent(id)}`).then(r=>r.data?.note||null).catch(()=>null))).then(results=>{if(active)setNotes(results.filter(Boolean))}).finally(()=>{if(active)setLoading(false)});
    return()=>{active=false};
  },[ids.join('|')]);
  return <div className="bg-[#f7f9fd] min-h-screen pb-20"><div className="onss-mesh onss-grid text-white"><div className="onss-shell py-14 sm:py-20"><span className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-200 tracking-widest uppercase"><Bookmark size={16}/> Your personal collection</span><h1 className="text-4xl sm:text-5xl font-extrabold mt-4">Saved for <span className="onss-gradient-text">later.</span></h1><p className="text-indigo-100/80 mt-4 text-sm sm:text-base max-w-xl">Keep your important study resources together. Bookmarks are stored in this browser.</p></div></div>
    <div className="onss-shell pt-11"><div className="flex justify-between items-center mb-7 gap-3"><div><h2 className="font-extrabold text-2xl text-slate-900">Your bookmarks</h2><p className="text-sm text-slate-500 mt-1">{ids.length} saved {ids.length===1?'note':'notes'}</p></div><Link to="/notes" className="onss-outline">Explore notes <ArrowRight size={16}/></Link></div>
      {loading?<div className="grid md:grid-cols-3 gap-5">{[1,2,3].map(i=><div className="onss-shimmer rounded-3xl h-64" key={i}/>)}</div>:notes.length?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{notes.map(n=><NoteCard key={n._id} note={n} onOpenModal={setSelected}/>)}</div>:<div className="onss-card py-20 px-6 text-center"><Bookmark size={45} className="text-indigo-300 mx-auto"/><h3 className="text-xl font-extrabold text-slate-900 mt-5">Your collection starts here.</h3><p className="text-sm text-slate-500 mt-2">Tap the bookmark on any note to save it for later.</p><Link to="/notes" className="onss-primary mt-6">Browse notes <ArrowRight size={16}/></Link></div>}
    </div>{selected&&<DownloadModal note={selected} onClose={()=>setSelected(null)}/>}
  </div>;
}
