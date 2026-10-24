import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FilePlus2,
  FileText,
  Info,
  Paperclip,
  ShieldCheck,
  Sparkles,
  Trash2,
  CloudUpload,
} from 'lucide-react';
import api from '../api/apiClient';
import DashboardLayout from '../components/DashboardLayout';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const FILE_SLOTS = ['file1', 'file2', 'file3', 'file4'];
const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx']);
const EMPTY_FILES = { file1: null, file2: null, file3: null, file4: null };

const formatSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function FileSlot({ index, file, disabled, onSelect, onRemove }) {
  const [dragActive, setDragActive] = useState(false);
  const id = `onss-file-${index}`;
  const required = index === 1;

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (disabled) return;
    const dropped = event.dataTransfer.files;
    if (dropped?.length) onSelect(dropped[0], dropped.length);
  };

  return (
    <div
      className={`relative rounded-[22px] border-2 border-dashed p-4 transition-colors sm:p-5 ${
        dragActive
          ? 'border-teal-600 bg-teal-50'
          : file
            ? 'border-teal-200 bg-teal-50/60'
            : 'border-slate-200 bg-[#f8fafc] hover:border-teal-300 hover:bg-teal-50/30'
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${file ? 'bg-teal-100 text-teal-700' : 'bg-white text-slate-500 shadow-sm'}`}>
            {file ? <Check size={17} /> : <Paperclip size={17} />}
          </span>
          <div>
            <p className="text-sm font-extrabold text-slate-900">{index === 1 ? 'Primary document' : `Supporting file ${index - 1}`}</p>
            <p className="text-[11px] font-medium text-slate-500">File {index} of 4</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${required ? 'bg-[#0d5967] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
          {required ? 'Required' : 'Optional'}
        </span>
      </div>

      {file ? (
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white px-3 py-3 shadow-sm">
          <FileText size={19} className="shrink-0 text-teal-700" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800" title={file.name}>{file.name}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
            title="Remove file"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <>
          <input
            id={id}
            className="sr-only"
            type="file"
            accept=".pdf,.doc,.docx"
            disabled={disabled}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const selected = event.target.files;
              if (selected?.length) onSelect(selected[0], selected.length);
              event.target.value = '';
            }}
          />
          <label
            htmlFor={id}
            className={`flex min-h-[94px] flex-col items-center justify-center rounded-2xl border border-transparent px-2 text-center transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-teal-100 hover:bg-white'}`}
          >
            <CloudUpload size={24} className="text-teal-700" aria-hidden="true" />
            <span className="mt-2 text-xs font-extrabold text-slate-800">Choose a file or drop it here</span>
            <span id={`${id}-hint`} className="mt-1 text-[11px] text-slate-500">PDF, DOC or DOCX · Maximum 25 MB</span>
          </label>
        </>
      )}
    </div>
  );
}

export default function AddNotePage() {
  const [form, setForm] = useState({ notesTitle: '', subject: '', notesDescription: '' });
  const [files, setFiles] = useState(EMPTY_FILES);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const errorRef = useRef(null);
  const redirectRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get('/notes/categories')
      .then((res) => {
        if (active && res.data.success && Array.isArray(res.data.categories)) {
          setCategories(res.data.categories.slice(0, 30));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, []);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const onTextChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError('');
  };

  const selectFile = (slot, file, count = 1) => {
    if (count > 1) {
      setError('Choose one document per upload slot. You can attach up to four documents in total.');
      return;
    }
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      setError(`“${file.name}” is not supported. Please choose a PDF, DOC or DOCX document.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`“${file.name}” exceeds 25 MB. Please select a smaller document.`);
      return;
    }
    if (file.size === 0) {
      setError(`“${file.name}” is empty. Choose a valid document.`);
      return;
    }
    setFiles((previous) => ({ ...previous, [slot]: file }));
    setError('');
  };

  const selectedFiles = FILE_SLOTS.map((slot) => files[slot]).filter(Boolean);
  const totalSize = selectedFiles.reduce((size, file) => size + file.size, 0);
  const completedDetails = ['notesTitle', 'subject', 'notesDescription'].filter((key) => form[key].trim()).length;
  const isReady = completedDetails === 3 && Boolean(files.file1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.notesTitle.trim() || !form.subject.trim() || !form.notesDescription.trim()) {
      setError('Complete the title, subject and description before publishing.');
      return;
    }
    if (!files.file1) {
      setError('Attach a primary document (File 1) to publish this note.');
      return;
    }

    const data = new FormData();
    data.append('notesTitle', form.notesTitle.trim());
    data.append('subject', form.subject.trim());
    data.append('notesDescription', form.notesDescription.trim());
    FILE_SLOTS.forEach((slot) => {
      if (files[slot]) data.append(slot, files[slot]);
    });

    setLoading(true);
    setUploadProgress(0);
    try {
      const response = await api.post('/notes', data, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.min(99, Math.round((progressEvent.loaded / progressEvent.total) * 100)));
          }
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'The server did not confirm publication.');
      }
      setUploadProgress(100);
      setSuccess('Your note was published successfully. Opening your notes…');
      redirectRef.current = setTimeout(() => navigate('/manage-notes'), 1100);
    } catch (err) {
      setUploadProgress(0);
      setError(err.response?.data?.message || err.message || 'Upload failed. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Upload a note">
      <div className="mx-auto max-w-[1250px] space-y-6">
        <div className="onss-mesh onss-grid relative overflow-hidden rounded-[28px] px-6 py-7 shadow-[0_22px_65px_rgba(8,29,50,.14)] sm:px-8 sm:py-8">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-wide text-white">
                <Sparkles size={14} className="text-amber-200" /> Contribute to the community
              </span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-[30px]">Share something worth learning.</h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-6 text-slate-200">Add your details, attach up to four documents and publish your study material.</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-semibold text-white backdrop-blur-sm">
              <FileText size={17} className="text-teal-200" /> PDF · DOC · DOCX
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_315px]">
          <form id="onss-note-publish-form" onSubmit={handleSubmit} noValidate className="space-y-6">
            {error && (
              <div ref={errorRef} tabIndex={-1} role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800 outline-none">
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
                <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <section className="onss-card !overflow-visible px-5 py-6 sm:px-8 sm:py-7" aria-labelledby="note-details-heading">
              <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-800"><FilePlus2 size={19} /></span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.14em] text-teal-700">Step 01</p>
                  <h3 id="note-details-heading" className="mt-1 text-[21px] font-extrabold text-slate-950">Tell us about your notes</h3>
                  <p className="mt-1 text-[13px] text-slate-600">Clear details help other students find your material.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="notesTitle" className="mb-2 block text-[13px] font-bold text-slate-800">Notes title <span className="text-rose-600" aria-hidden="true">*</span></label>
                  <input
                    id="notesTitle"
                    type="text"
                    name="notesTitle"
                    autoComplete="off"
                    required
                    value={form.notesTitle}
                    onChange={onTextChange}
                    disabled={loading}
                    placeholder="e.g. Data Structures – Unit 1 revision notes"
                    className="onss-input w-full !py-3.5 text-sm"
                    aria-describedby="title-hint"
                  />
                  <p id="title-hint" className="mt-1.5 text-[11px] text-slate-500">Use a short and specific title students can recognise.</p>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-[13px] font-bold text-slate-800">Subject or category <span className="text-rose-600" aria-hidden="true">*</span></label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    list="onss-subject-options"
                    required
                    value={form.subject}
                    onChange={onTextChange}
                    disabled={loading}
                    placeholder="e.g. Computer Science"
                    className="onss-input w-full !py-3.5 text-sm"
                    aria-describedby="subject-hint"
                  />
                  <datalist id="onss-subject-options">
                    {categories.map((category) => <option key={category.name} value={category.name} />)}
                  </datalist>
                  <p id="subject-hint" className="mt-1.5 text-[11px] text-slate-500">Choose an existing category or enter a new one.</p>
                  {categories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested categories">
                      {categories.slice(0, 4).map((category) => (
                        <button
                          key={category.name}
                          type="button"
                          disabled={loading}
                          onClick={() => { setForm((previous) => ({ ...previous, subject: category.name })); setError(''); }}
                          className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-800 transition hover:border-teal-400 hover:bg-teal-100 disabled:opacity-50"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="notesDescription" className="text-[13px] font-bold text-slate-800">Description <span className="text-rose-600" aria-hidden="true">*</span></label>
                    <span className="text-[11px] font-medium text-slate-500">{form.notesDescription.length} characters</span>
                  </div>
                  <textarea
                    id="notesDescription"
                    name="notesDescription"
                    value={form.notesDescription}
                    onChange={onTextChange}
                    disabled={loading}
                    rows={5}
                    required
                    placeholder="Explain the units, chapters, topics or exercises covered in these notes."
                    className="onss-input w-full resize-y !py-3.5 text-sm"
                    aria-describedby="description-hint"
                  />
                  <p id="description-hint" className="mt-1.5 text-[11px] text-slate-500">Include useful keywords so others understand what they will receive.</p>
                </div>
              </div>
            </section>

            <section className="onss-card !overflow-visible px-5 py-6 sm:px-8 sm:py-7" aria-labelledby="note-files-heading">
              <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-800"><Paperclip size={19} /></span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[.14em] text-teal-700">Step 02</p>
                  <h3 id="note-files-heading" className="mt-1 text-[21px] font-extrabold text-slate-950">Attach your documents</h3>
                  <p className="mt-1 text-[13px] text-slate-600">One primary document is required. Three additional files are optional.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {FILE_SLOTS.map((slot, index) => (
                  <FileSlot
                    key={slot}
                    index={index + 1}
                    file={files[slot]}
                    disabled={loading}
                    onSelect={(file, count) => selectFile(slot, file, count)}
                    onRemove={() => { setFiles((previous) => ({ ...previous, [slot]: null })); setError(''); }}
                  />
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-[12px] leading-5 text-slate-600">
                <Info size={16} className="mt-0.5 shrink-0 text-teal-700" />
                Maximum 25 MB per document. Accepted formats: PDF, DOC and DOCX.
              </p>
            </section>

            {loading && (
              <div className="rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4" role="status" aria-live="polite">
                <div className="mb-2 flex items-center justify-between text-[13px] font-bold text-teal-900">
                  <span>{uploadProgress < 99 ? 'Uploading files…' : 'Finishing on server…'}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-teal-100" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress">
                  <div className="h-full rounded-full bg-teal-700 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse justify-between gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <Link to="/dashboard" aria-disabled={loading} onClick={loading ? (event) => event.preventDefault() : undefined} className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-[13px] font-bold text-slate-600 hover:bg-slate-100">
                <ArrowLeft size={16} /> Back to dashboard
              </Link>
              <button type="submit" disabled={loading} className="onss-primary !px-6 !py-3.5 !text-sm">
                <CloudUpload size={18} /> {loading ? 'Publishing…' : 'Publish note'} <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <aside className="space-y-5 xl:sticky xl:top-[104px]" aria-label="Upload summary">
            <div className="onss-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-800"><CheckCircle2 size={20} /></span>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-900">Ready to publish?</h3>
                  <p className="text-xs text-slate-500">Your submission checklist</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5">
                  <span className="text-[12px] font-semibold text-slate-700">Note details</span>
                  <span className={`text-[12px] font-bold ${completedDetails === 3 ? 'text-teal-800' : 'text-slate-500'}`}>{completedDetails}/3 completed</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5">
                  <span className="text-[12px] font-semibold text-slate-700">Attachments</span>
                  <span className="text-[12px] font-bold text-teal-800">{selectedFiles.length}/4</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5">
                  <span className="text-[12px] font-semibold text-slate-700">Selected file size</span>
                  <span className="text-[12px] font-bold text-slate-800">{selectedFiles.length ? formatSize(totalSize) : '0 MB'}</span>
                </div>
              </div>
              <div className={`mt-5 flex items-center gap-2 rounded-2xl px-3 py-3 text-xs font-bold ${isReady ? 'bg-teal-50 text-teal-900' : 'bg-amber-50 text-amber-900'}`}>
                {isReady ? <Check size={17} /> : <Info size={17} />}
                {isReady ? 'All required items are ready.' : 'Complete the fields and add File 1.'}
              </div>
            </div>

            <div className="rounded-[26px] border border-[#1e4157] bg-[#10283b] p-5 text-white shadow-[0_20px_55px_rgba(15,38,59,.12)] sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-200"><ShieldCheck size={17} /> Before you upload</div>
              <ul className="mt-4 space-y-3 text-[12px] leading-6 text-slate-200">
                <li>Only share documents you are allowed to distribute.</li>
                <li>Check that your notes do not contain personal or confidential information.</li>
                <li>Uploaded notes can be viewed by visitors to the public library.</li>
              </ul>
              <Link to="/manage-notes" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-teal-200 hover:text-white">
                Manage published notes <ArrowRight size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
