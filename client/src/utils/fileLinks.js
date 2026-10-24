/** Supports legacy Render filenames and future HTTPS object-storage URLs. */
export const resolveNoteFile = (file) => {
  if (typeof file !== 'string' || !file.trim()) return null;
  const value = file.trim();
  if (/^https:\/\//i.test(value)) return value;
  if (/^http:\/\//i.test(value)) return null; // avoid insecure mixed-content links
  const cleaned = value.replace(/^\/+/, '').replace(/^uploads\//i, '');
  if (!cleaned || cleaned.includes('..') || cleaned.includes('\\') || cleaned.includes('?') || cleaned.includes('#')) return null;
  return '/uploads/' + cleaned.split('/').map(encodeURIComponent).join('/');
};
export const fileExtension = (file) => {
  if (!file) return 'FILE';
  try { const pathname = new URL(file, window.location.origin).pathname; return (pathname.split('.').pop() || 'FILE').toUpperCase().slice(0,6); } catch {return 'FILE';}
};
