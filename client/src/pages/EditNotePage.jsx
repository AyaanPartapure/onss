import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Edit,
  Save,
  FileText,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import api from '../api/apiClient';
import DashboardLayout from '../components/DashboardLayout';

const EditNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: '',
    notesTitle: '',
    notesDescription: '',
    file1: '',
    file2: '',
    file3: '',
    file4: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // File replacement state
  const [activeSlotToReplace, setActiveSlotToReplace] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [replacing, setReplacing] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        if (res.data.success) {
          const n = res.data.note;
          setFormData({
            subject: n.subject,
            notesTitle: n.notesTitle,
            notesDescription: n.notesDescription,
            file1: n.file1,
            file2: n.file2,
            file3: n.file3,
            file4: n.file4,
          });
        }
      } catch (err) {
        setError('Failed to fetch note details.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleMetadataSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await api.put(`/notes/${id}`, {
        subject: formData.subject.trim(),
        notesTitle: formData.notesTitle.trim(),
        notesDescription: formData.notesDescription.trim(),
      });

      if (res.data.success) {
        setSuccess('Notes details updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update note details.');
    } finally {
      setSubmitting(false);
    }
  };

  // Replaces functionality of changefile1.php .. changefile4.php
  const handleFileReplaceSubmit = async (slotNumber) => {
    if (!replacementFile) {
      setError('Please select a replacement file first.');
      return;
    }

    setReplacing(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('file', replacementFile);

      const res = await api.put(`/notes/${id}/file/${slotNumber}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          [`file${slotNumber}`]: res.data.note[`file${slotNumber}`],
        }));
        setSuccess(`File ${slotNumber} updated successfully!`);
        setActiveSlotToReplace(null);
        setReplacementFile(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update file.');
    } finally {
      setReplacing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Update Notes">
        <div className="p-12 text-center text-xs text-slate-400">Loading note details...</div>
      </DashboardLayout>
    );
  }

  const fileSlots = [
    { num: 1, label: 'File 1 (Primary Document)', file: formData.file1, required: true },
    { num: 2, label: 'File 2 (Additional Document)', file: formData.file2, required: false },
    { num: 3, label: 'File 3 (Supplementary Document)', file: formData.file3, required: false },
    { num: 4, label: 'File 4 (Reference Slides)', file: formData.file4, required: false },
  ];

  return (
    <DashboardLayout title="Update Notes">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/manage-notes"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Notes</span>
          </Link>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Note Metadata Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Notes Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update the subject title and description summary.
            </p>
          </div>

          <form onSubmit={handleMetadataSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes Title</label>
              <input
                type="text"
                name="notesTitle"
                value={formData.notesTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes Description
              </label>
              <textarea
                name="notesDescription"
                rows="4"
                value={formData.notesDescription}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Updating...' : 'Update Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Uploaded Files & Replacement Section (Parity with changefile1..4.php) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Manage Attached Files</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              View current files or upload a replacement file for any slot.
            </p>
          </div>

          <div className="space-y-3">
            {fileSlots.map((slot) => {
              const hasFile = Boolean(slot.file && slot.file.trim());
              const isReplacingThis = activeSlotToReplace === slot.num;

              return (
                <div
                  key={slot.num}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{slot.label}</p>
                        {hasFile ? (
                          <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                            {slot.file}
                          </p>
                        ) : (
                          <p className="text-[11px] text-rose-500 font-medium">
                            File is not available
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {hasFile && (
                        <a
                          href={`/uploads/${slot.file}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors inline-flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View/Download</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSlotToReplace(isReplacingThis ? null : slot.num);
                          setReplacementFile(null);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors inline-flex items-center space-x-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{hasFile ? 'Replace File' : 'Upload File'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline Replacement Box */}
                  {isReplacingThis && (
                    <div className="pt-3 border-t border-slate-200/80 animate-fadeIn">
                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        Select new file for Slot {slot.num} (.pdf, .doc, .docx):
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setReplacementFile(e.target.files[0])}
                          className="flex-1 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => handleFileReplaceSubmit(slot.num)}
                          disabled={replacing || !replacementFile}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50 transition-colors shrink-0"
                        >
                          {replacing ? 'Saving...' : 'Save File'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditNotePage;
