import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../api/apiClient';
import DashboardLayout from '../components/DashboardLayout';

const AddNotePage = () => {
  const [formData, setFormData] = useState({
    notesTitle: '',
    subject: '',
    notesDescription: '',
  });

  const [files, setFiles] = useState({
    file1: null,
    file2: null,
    file3: null,
    file4: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e, slot) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        setError(`Invalid format for ${slot.toUpperCase()}. Only .pdf, .doc, and .docx are allowed.`);
        return;
      }
      setFiles((prev) => ({ ...prev, [slot]: file }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.notesTitle.trim() || !formData.subject.trim() || !formData.notesDescription.trim()) {
      setError('Please fill in note title, subject, and description.');
      return;
    }

    if (!files.file1) {
      setError('Primary file (File 1) is mandatory. Please select a valid document.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('notesTitle', formData.notesTitle.trim());
      data.append('subject', formData.subject.trim());
      data.append('notesDescription', formData.notesDescription.trim());

      data.append('file1', files.file1);
      if (files.file2) data.append('file2', files.file2);
      if (files.file3) data.append('file3', files.file3);
      if (files.file4) data.append('file4', files.file4);

      const res = await api.post('/notes', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess('Notes have been added successfully!');
        setTimeout(() => {
          navigate('/manage-notes');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add New Notes">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Upload Notes</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share comprehensive subject materials with your peers.
              </p>
            </div>
            <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/40">
              Supported: PDF, DOC, DOCX
            </span>
          </div>

          {error && (
            <div className="mb-5 flex items-start space-x-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start space-x-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Notes Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="notesTitle"
                value={formData.notesTitle}
                onChange={handleInputChange}
                placeholder="e.g. Data Structures and Algorithms Lecture Notes"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject / Category <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. Computer Science, Mathematics, Mechanical Engineering"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* Notes Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="notesDescription"
                rows="4"
                value={formData.notesDescription}
                onChange={handleInputChange}
                placeholder="Provide a detailed summary of topics, chapters, and keywords covered in this document..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* File Upload Slots */}
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Attach Note Documents
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File 1 (Required) */}
                <div className="p-4 rounded-2xl border-2 border-brand-200 bg-brand-50/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-900">File 1 (Primary Document)</span>
                    <span className="text-[10px] font-bold uppercase bg-brand-600 text-white px-2 py-0.5 rounded">
                      Required
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={(e) => handleFileChange(e, 'file1')}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500"
                  />
                  {files.file1 && (
                    <p className="mt-2 text-[11px] text-brand-700 truncate font-medium">
                      Selected: {files.file1.name}
                    </p>
                  )}
                </div>

                {/* File 2 (Optional) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">File 2 (Optional)</span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'file2')}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                  />
                  {files.file2 && (
                    <p className="mt-2 text-[11px] text-slate-600 truncate font-medium">
                      Selected: {files.file2.name}
                    </p>
                  )}
                </div>

                {/* File 3 (Optional) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">File 3 (Optional)</span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'file3')}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                  />
                  {files.file3 && (
                    <p className="mt-2 text-[11px] text-slate-600 truncate font-medium">
                      Selected: {files.file3.name}
                    </p>
                  )}
                </div>

                {/* File 4 (Optional) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">File 4 (Optional)</span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'file4')}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                  />
                  {files.file4 && (
                    <p className="mt-2 text-[11px] text-slate-600 truncate font-medium">
                      Selected: {files.file4.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/25 transition-all duration-150 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <span>Uploading files...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Publish Notes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddNotePage;
