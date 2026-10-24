import { useEffect, useState } from 'react';
const KEY = 'onss_saved_notes_v1';
const CHANGE = 'onss-saved-notes-changed';
const read = () => { try { const data = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(data) ? data.filter(x => typeof x === 'string') : []; } catch { return []; } };
export const getSavedIds = read;
export const toggleSaved = (id) => {
  if (!id) return false;
  const ids = read();
  const saved = !ids.includes(String(id));
  const next = saved ? [...ids, String(id)] : ids.filter(x => x !== String(id));
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { return false; }
  window.dispatchEvent(new Event(CHANGE));
  return saved;
};
export function useSavedNotes() {
  const [ids, setIds] = useState(read);
  useEffect(() => { const update = () => setIds(read()); window.addEventListener(CHANGE, update); window.addEventListener('storage', update); return () => {window.removeEventListener(CHANGE, update);window.removeEventListener('storage', update);}; }, []);
  return ids;
}
