import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, X, Upload, ExternalLink, FileText } from 'lucide-react';
import { Certification, PortfolioDatabase, saveCertificationToSupabase, deleteCertificationFromSupabase, uploadFileToSupabase } from '../../services/portfolioStorage';

interface CertificationsManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
}

export const CertificationsManager: React.FC<CertificationsManagerProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCert, setCurrentCert] = useState<Partial<Certification> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setCurrentCert({
      id: `cert-${Date.now()}`,
      title: '',
      issuer: '',
      date: '',
      duration: '',
      credentialId: '',
      verificationUrl: '',
      pdfPlaceholder: '',
      published: true
    });
    setIsEditing(true);
    setError('');
  };

  const handleOpenEdit = (cert: Certification) => {
    setCurrentCert({ ...cert });
    setIsEditing(true);
    setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: PDF or images
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !/\.(pdf|jpg|jpeg|png|webp)$/i.test(file.name)) {
      setError('Please upload a valid PDF document or image file (JPEG, PNG, WEBP).');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const publicUrl = await uploadFileToSupabase(file, 'certificates');
      setCurrentCert(prev => prev ? ({ ...prev, pdfPlaceholder: publicUrl }) : null);
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Certificate upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCert || !currentCert.title) return;

    setLoading(true);
    setError('');

    const certToSave: Certification = {
      id: currentCert.id || `cert-${Date.now()}`,
      title: currentCert.title || '',
      issuer: currentCert.issuer || '',
      date: currentCert.date || '',
      duration: currentCert.duration || '',
      credentialId: currentCert.credentialId || '',
      verificationUrl: currentCert.verificationUrl || '',
      pdfPlaceholder: currentCert.pdfPlaceholder || '',
      published: currentCert.published !== false
    };

    try {
      await saveCertificationToSupabase(certToSave);
      setIsEditing(false);
      setCurrentCert(null);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await deleteCertificationFromSupabase(id);
      setDeleteConfirmId(null);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to delete certification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Certifications & Credentials</h2>
          <p className="text-xs text-[#94A3B8]">Manage verified professional certificates and credentials.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-[#151F2E] border border-[#263449] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#111827] border-b border-[#263449] text-[#94A3B8] font-mono">
              <th className="p-4">Title</th>
              <th className="p-4">Issuer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Credential ID</th>
              <th className="p-4">File / Proof</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263449] text-[#F8FAFC]">
            {data.certifications.map((cert) => (
              <tr key={cert.id} className="hover:bg-[#111827]/50 transition-colors">
                <td className="p-4 font-semibold">{cert.title}</td>
                <td className="p-4 text-[#94A3B8]">{cert.issuer}</td>
                <td className="p-4 font-mono">{cert.date}</td>
                <td className="p-4 font-mono text-[#94A3B8]">{cert.credentialId || 'N/A'}</td>
                <td className="p-4">
                  {cert.pdfPlaceholder && cert.pdfPlaceholder !== '/public/resumes/Certificate.pdf' ? (
                    <a
                      href={cert.pdfPlaceholder}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[#2563EB] hover:underline font-mono text-[11px]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View File</span>
                    </a>
                  ) : (
                    <span className="text-[#94A3B8] text-[11px]">No file</span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-1.5 bg-[#111827] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded border border-[#263449]"
                    title="Edit Certification"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cert.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded border border-red-500/30"
                    title="Delete Certification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#263449] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Delete Certification</h3>
            <p className="text-xs text-[#94A3B8]">Are you sure you want to delete this certification from Supabase?</p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#151F2E] text-[#94A3B8] rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && currentCert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-[#263449] rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#263449] pb-4">
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                {data.certifications.some(c => c.id === currentCert.id) ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={currentCert.title || ''}
                  onChange={(e) => setCurrentCert({ ...currentCert, title: e.target.value })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Issuer *</label>
                  <input
                    type="text"
                    required
                    value={currentCert.issuer || ''}
                    onChange={(e) => setCurrentCert({ ...currentCert, issuer: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    value={currentCert.date || ''}
                    onChange={(e) => setCurrentCert({ ...currentCert, date: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Duration</label>
                  <input
                    type="text"
                    value={currentCert.duration || ''}
                    onChange={(e) => setCurrentCert({ ...currentCert, duration: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={currentCert.credentialId || ''}
                    onChange={(e) => setCurrentCert({ ...currentCert, credentialId: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Verification URL</label>
                <input
                  type="url"
                  value={currentCert.verificationUrl || ''}
                  onChange={(e) => setCurrentCert({ ...currentCert, verificationUrl: e.target.value })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Upload Certificate File (PDF / Image)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileUpload}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC] file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-[#2563EB] file:text-white"
                />
                {uploading && <p className="text-[10px] text-[#2563EB] mt-1 font-mono">Uploading to Supabase Storage...</p>}
                {currentCert.pdfPlaceholder && currentCert.pdfPlaceholder !== '/public/resumes/Certificate.pdf' && (
                  <div className="mt-2 flex items-center justify-between bg-[#111827] p-2 rounded border border-[#263449]">
                    <span className="text-[11px] text-[#94A3B8] truncate max-w-[280px]">File: {currentCert.pdfPlaceholder}</span>
                    <a
                      href={currentCert.pdfPlaceholder}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#2563EB] hover:underline font-mono inline-flex items-center space-x-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#263449]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#151F2E] text-[#94A3B8] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                  {loading ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
