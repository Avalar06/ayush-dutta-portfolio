import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  X,
  Upload,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Download,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Radio
} from 'lucide-react';
import {
  ResumeItem,
  PortfolioDatabase,
  saveResumeToSupabase,
  deleteResumeFromSupabase,
  setPublishedResumeInSupabase,
  uploadFileToSupabase
} from '../../services/portfolioStorage';

interface ResumeManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentResume, setCurrentResume] = useState<Partial<ResumeItem> | null>(null);
  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resumes = data.resumes || [];

  const handleOpenAdd = () => {
    setCurrentResume({
      id: `resume-${Date.now()}`,
      title: '',
      targetRoles: '',
      description: '',
      pdfPath: '',
      published: resumes.length === 0 // Default to published if first resume
    });
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleOpenEdit = (resume: ResumeItem) => {
    setCurrentResume({ ...resume });
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation: PDF documents only
    const isPdfType = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdfType) {
      setError('Invalid file format. Please upload a valid PDF document (.pdf).');
      return;
    }

    // Size limit check (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller PDF file.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const publicUrl = await uploadFileToSupabase(file, 'resumes');
      setCurrentResume(prev => prev ? ({ ...prev, pdfPath: publicUrl }) : null);
      setSuccessMessage('Resume PDF uploaded to Supabase Storage successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Resume upload failed. Please verify your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResume || !currentResume.title || !currentResume.pdfPath) {
      setError('Please provide a Title and a valid PDF file.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const resumeToSave: ResumeItem = {
      id: currentResume.id || `resume-${Date.now()}`,
      title: currentResume.title.trim(),
      targetRoles: currentResume.targetRoles?.trim() || 'General Technology & Security',
      description: currentResume.description?.trim() || '',
      pdfPath: currentResume.pdfPath.trim(),
      published: Boolean(currentResume.published)
    };

    try {
      await saveResumeToSupabase(resumeToSave);
      setIsEditing(false);
      setCurrentResume(null);
      setSuccessMessage('Resume record saved successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to save resume record.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPublished = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await setPublishedResumeInSupabase(id);
      setSuccessMessage('Active published resume updated.');
      setTimeout(() => setSuccessMessage(''), 4000);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to update published resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await deleteResumeFromSupabase(id);
      setDeleteConfirmId(null);
      setSuccessMessage('Resume removed successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to delete resume.');
    } finally {
      setLoading(false);
    }
  };

  // Preview download using native browser APIs
  const handleDownload = async (resume: ResumeItem) => {
    if (!resume.pdfPath) return;

    setIsDownloading(true);
    const safeTitle = resume.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const fileName = `${safeTitle || 'resume'}.pdf`;

    let fileUrl = resume.pdfPath;
    if (fileUrl.startsWith('/public/')) {
      fileUrl = fileUrl.replace('/public/', '/');
    }

    try {
      const response = await fetch(fileUrl, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const resolvedPreviewUrl = useMemo(() => {
    if (!previewResume?.pdfPath) return '';
    let url = previewResume.pdfPath.trim();
    if (url.startsWith('/public/')) {
      url = url.replace('/public/', '/');
    }
    return url;
  }, [previewResume]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Resume Management</h2>
          <p className="text-xs text-[#94A3B8]">
            Upload and publish resume versions. The designated active resume will be served automatically on the public portfolio.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Resume</span>
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs p-3.5 rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Resumes Table */}
      <div className="bg-[#151F2E] border border-[#263449] rounded-xl overflow-hidden shadow-lg">
        {resumes.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <FileText className="w-10 h-10 text-[#94A3B8] mx-auto opacity-40" />
            <p className="text-sm text-[#F8FAFC] font-medium">No resumes found</p>
            <p className="text-xs text-[#94A3B8]">Upload a PDF resume to make it available for download.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#111827] border-b border-[#263449] text-[#94A3B8] font-mono">
                  <th className="p-4">Status</th>
                  <th className="p-4">Resume Title</th>
                  <th className="p-4">Target Roles</th>
                  <th className="p-4">Storage Source</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]">
                {resumes.map((resume) => {
                  const isPublished = Boolean(resume.published);
                  return (
                    <tr
                      key={resume.id}
                      className={`hover:bg-[#1C283B] transition-colors ${
                        isPublished ? 'bg-[#10B981]/5' : ''
                      }`}
                    >
                      {/* Published Status / Toggle */}
                      <td className="p-4 whitespace-nowrap">
                        {isPublished ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-mono">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Active / Published</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetPublished(resume.id)}
                            disabled={loading}
                            title="Set this resume as the active published version"
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-medium text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] hover:bg-[#263449] border border-[#263449] transition-colors font-mono"
                          >
                            <Radio className="w-3 h-3" />
                            <span>Set Active</span>
                          </button>
                        )}
                      </td>

                      {/* Title & Description */}
                      <td className="p-4">
                        <div className="font-semibold text-[#F8FAFC] flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>{resume.title}</span>
                        </div>
                        {resume.description && (
                          <p className="text-[#94A3B8] text-[11px] mt-0.5 line-clamp-1 max-w-md">
                            {resume.description}
                          </p>
                        )}
                      </td>

                      {/* Target Roles */}
                      <td className="p-4 text-[#94A3B8]">
                        <span className="font-mono text-[11px]">{resume.targetRoles}</span>
                      </td>

                      {/* Storage Link */}
                      <td className="p-4">
                        {resume.pdfPath ? (
                          <a
                            href={resume.pdfPath.startsWith('/public/') ? resume.pdfPath.replace('/public/', '/') : resume.pdfPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563EB] hover:underline font-mono text-[11px] inline-flex items-center space-x-1 max-w-[200px] truncate"
                          >
                            <span className="truncate">{resume.pdfPath.split('/').pop() || 'View PDF'}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-amber-400 font-mono text-[11px]">No file attached</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setPreviewResume(resume)}
                            title="Preview Resume"
                            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#263449] rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(resume)}
                            title="Edit / Replace Resume"
                            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#263449] rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(resume.id)}
                            title="Delete Resume"
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal with Guard for Active Resume */}
      {deleteConfirmId && (() => {
        const resumeToDelete = resumes.find(r => r.id === deleteConfirmId);
        const isActive = Boolean(resumeToDelete?.published);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#111827] border border-[#263449] rounded-xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center space-x-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold text-[#F8FAFC]">Confirm Deletion</h3>
              </div>

              {isActive ? (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-3 rounded-lg text-xs space-y-1">
                  <p className="font-semibold">Warning: This is the currently published active resume.</p>
                  <p className="text-amber-300/80">Deleting it will leave visitors without a default published CV until another is marked active.</p>
                </div>
              ) : null}

              <p className="text-xs text-[#94A3B8]">
                Are you sure you want to delete <span className="font-bold text-[#F8FAFC]">{resumeToDelete?.title || 'this resume'}</span>? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] text-xs font-medium transition-colors border border-[#263449]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Resume'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit / Upload Modal */}
      {isEditing && currentResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-6 my-8">
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentResume(null);
              }}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-[#151F2E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  {resumes.some(r => r.id === currentResume.id) ? 'Edit Resume Record' : 'Upload & Publish Resume'}
                </h3>
                <p className="text-xs text-[#94A3B8]">Configure resume details and upload PDF file.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#94A3B8] font-mono mb-1">Resume Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cybersecurity Resume (M.Sc. Specialized)"
                  value={currentResume.title || ''}
                  onChange={e => setCurrentResume({ ...currentResume, title: e.target.value })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg p-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-mono mb-1">Target Roles *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOC Analyst, Incident Responder, Security Engineer"
                  value={currentResume.targetRoles || ''}
                  onChange={e => setCurrentResume({ ...currentResume, targetRoles: e.target.value })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg p-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] font-mono mb-1">Description / Focus Summary</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of skills, certifications, and highlighted achievements in this version..."
                  value={currentResume.description || ''}
                  onChange={e => setCurrentResume({ ...currentResume, description: e.target.value })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg p-2.5 text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              {/* PDF Upload Field */}
              <div className="space-y-2 pt-1">
                <label className="block text-[#94A3B8] font-mono">
                  Resume PDF Document (Supabase Storage) *
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://...supabase.co/storage/v1/object/public/resumes/..."
                    value={currentResume.pdfPath || ''}
                    onChange={e => setCurrentResume({ ...currentResume, pdfPath: e.target.value })}
                    className="flex-1 bg-[#151F2E] border border-[#263449] rounded-lg p-2.5 text-[#F8FAFC] font-mono focus:outline-none focus:border-[#2563EB]"
                  />
                  <label className="cursor-pointer bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] px-4 py-2.5 rounded-lg inline-flex items-center justify-center space-x-1.5 transition-colors shrink-0 shadow-sm">
                    {uploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload PDF</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Select a valid PDF document (Max: 10MB). The file will be stored securely in the Supabase &lsquo;resumes&rsquo; bucket.
                </p>
              </div>

              {/* Publish Checkbox */}
              <div className="pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer select-none bg-[#151F2E] p-3 rounded-lg border border-[#263449]">
                  <input
                    type="checkbox"
                    checked={Boolean(currentResume.published)}
                    onChange={e => setCurrentResume({ ...currentResume, published: e.target.checked })}
                    className="rounded bg-[#111827] border-[#263449] text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
                  />
                  <div>
                    <span className="text-[#F8FAFC] font-semibold block">Set as Active / Published Resume</span>
                    <span className="text-[#94A3B8] text-[11px] block">
                      Setting this will automatically make it the default CV served to portfolio visitors.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#263449]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentResume(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] font-medium transition-colors border border-[#263449]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-semibold transition-colors disabled:opacity-50 shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Resume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Browser PDF Preview Modal */}
      {previewResume && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setPreviewResume(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-5 my-auto max-h-[95vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewResume(null)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] hover:bg-[#263449] p-2 rounded-lg transition-colors z-20 border border-[#263449]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4 shrink-0 pr-12">
              <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                  {previewResume.title}
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono">{previewResume.targetRoles}</p>
              </div>
            </div>

            {/* Native Browser PDF Rendering via Iframe */}
            <div className="w-full flex-1 h-[450px] sm:h-[550px] md:h-[650px] bg-[#0B1220] border border-[#263449] rounded-lg overflow-hidden relative">
              {resolvedPreviewUrl ? (
                <iframe
                  src={`${resolvedPreviewUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  title={`${previewResume.title} Preview`}
                  className="w-full h-full border-0 bg-[#151F2E]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-xs text-[#F8FAFC]">No document URL available for this resume record.</p>
                </div>
              )}
            </div>

            {/* Preview Footer Controls */}
            <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#263449] shrink-0">
              <span className="text-[11px] text-[#94A3B8] font-mono">
                {previewResume.published ? 'Status: Active / Published' : 'Status: Unpublished'}
              </span>

              <div className="flex items-center space-x-2">
                {resolvedPreviewUrl && (
                  <>
                    <button
                      onClick={() => window.open(resolvedPreviewUrl, '_blank', 'noopener,noreferrer')}
                      className="inline-flex items-center space-x-1.5 bg-[#151F2E] hover:bg-[#263449] text-[#F8FAFC] text-xs font-medium px-3.5 py-2 rounded-lg transition-colors border border-[#263449]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in New Tab</span>
                    </button>

                    <button
                      onClick={() => handleDownload(previewResume)}
                      disabled={isDownloading}
                      className="inline-flex items-center space-x-1.5 bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-50 text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setPreviewResume(null)}
                  className="px-4 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-medium transition-colors border border-[#263449]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
