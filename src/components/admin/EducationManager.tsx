import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { EducationItem, PortfolioDatabase, saveEducationToSupabase, deleteEducationFromSupabase } from '../../services/portfolioStorage';

interface EducationManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
}

export const EducationManager: React.FC<EducationManagerProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<Partial<EducationItem> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setCurrentEdu({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      period: '',
      score: '',
      scoreLabel: 'CGPA',
      highlights: ['Highlight 1'],
      areas: ['Cryptography']
    });
    setIsEditing(true);
    setError('');
  };

  const handleOpenEdit = (edu: EducationItem) => {
    setCurrentEdu({ ...edu });
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdu || !currentEdu.degree) return;

    setLoading(true);
    setError('');

    const eduToSave: EducationItem = {
      id: currentEdu.id || `edu-${Date.now()}`,
      degree: currentEdu.degree || '',
      institution: currentEdu.institution || '',
      period: currentEdu.period || '',
      score: currentEdu.score || '',
      scoreLabel: currentEdu.scoreLabel || 'CGPA',
      highlights: Array.isArray(currentEdu.highlights) ? currentEdu.highlights : typeof currentEdu.highlights === 'string' ? (currentEdu.highlights as string).split('\n').filter(Boolean) : [],
      areas: Array.isArray(currentEdu.areas) ? currentEdu.areas : typeof currentEdu.areas === 'string' ? (currentEdu.areas as string).split(',').map(s => s.trim()) : []
    };

    try {
      await saveEducationToSupabase(eduToSave);
      setIsEditing(false);
      setCurrentEdu(null);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await deleteEducationFromSupabase(id);
      setDeleteConfirmId(null);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to delete education');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Education Management</h2>
          <p className="text-xs text-[#94A3B8]">Manage academic degrees, institutions, and areas of study.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
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
              <th className="p-4">Degree</th>
              <th className="p-4">Institution</th>
              <th className="p-4">Period</th>
              <th className="p-4">Score</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263449] text-[#F8FAFC]">
            {data.education.map((edu) => (
              <tr key={edu.id} className="hover:bg-[#111827]/50 transition-colors">
                <td className="p-4 font-semibold">{edu.degree}</td>
                <td className="p-4 text-[#94A3B8]">{edu.institution}</td>
                <td className="p-4 font-mono">{edu.period}</td>
                <td className="p-4 font-mono">{edu.score} ({edu.scoreLabel})</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(edu)}
                    className="p-1.5 bg-[#111827] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded border border-[#263449]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(edu.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded border border-red-500/30"
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
            <h3 className="text-lg font-bold text-[#F8FAFC]">Delete Education</h3>
            <p className="text-xs text-[#94A3B8]">Are you sure you want to delete this education record from Supabase?</p>
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

      {isEditing && currentEdu && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-[#263449] rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#263449] pb-4">
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                {data.education.some(e => e.id === currentEdu.id) ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Degree *</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.degree || ''}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Institution *</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.institution || ''}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, institution: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Period *</label>
                  <input
                    type="text"
                    required
                    value={currentEdu.period || ''}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, period: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Score</label>
                  <input
                    type="text"
                    value={currentEdu.score || ''}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, score: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Score Label</label>
                  <input
                    type="text"
                    value={currentEdu.scoreLabel || 'CGPA'}
                    onChange={(e) => setCurrentEdu({ ...currentEdu, scoreLabel: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Highlights (one per line)</label>
                <textarea
                  rows={3}
                  value={Array.isArray(currentEdu.highlights) ? currentEdu.highlights.join('\n') : ''}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, highlights: e.target.value.split('\n') })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Areas of Study (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(currentEdu.areas) ? currentEdu.areas.join(', ') : ''}
                  onChange={(e) => setCurrentEdu({ ...currentEdu, areas: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
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
                  disabled={loading}
                  className="px-4 py-2 bg-[#2563EB] text-white font-semibold rounded-lg"
                >
                  {loading ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
