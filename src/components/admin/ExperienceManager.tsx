import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { ExperienceItem, PortfolioDatabase, saveExperienceToSupabase, deleteExperienceFromSupabase } from '../../services/portfolioStorage';

interface ExperienceManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<ExperienceItem> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setCurrentExp({
      id: `exp-${Date.now()}`,
      role: '',
      organization: '',
      period: '',
      type: 'Internship',
      location: 'Remote',
      responsibilities: ['Responsibility 1'],
      frameworks: ['OWASP', 'NIST']
    });
    setIsEditing(true);
    setError('');
  };

  const handleOpenEdit = (exp: ExperienceItem) => {
    setCurrentExp({ ...exp });
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExp || !currentExp.role) return;

    setLoading(true);
    setError('');

    const expToSave: ExperienceItem = {
      id: currentExp.id || `exp-${Date.now()}`,
      role: currentExp.role || '',
      organization: currentExp.organization || '',
      period: currentExp.period || '',
      type: currentExp.type || 'Internship',
      location: currentExp.location || 'Remote',
      responsibilities: Array.isArray(currentExp.responsibilities) ? currentExp.responsibilities : typeof currentExp.responsibilities === 'string' ? (currentExp.responsibilities as string).split('\n').filter(Boolean) : [],
      frameworks: Array.isArray(currentExp.frameworks) ? currentExp.frameworks : typeof currentExp.frameworks === 'string' ? (currentExp.frameworks as string).split(',').map(s => s.trim()) : []
    };

    try {
      await saveExperienceToSupabase(expToSave);
      setIsEditing(false);
      setCurrentExp(null);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await deleteExperienceFromSupabase(id);
      setDeleteConfirmId(null);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to delete experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Experience Management</h2>
          <p className="text-xs text-[#94A3B8]">Manage professional experience, internships, and security roles.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
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
              <th className="p-4">Role</th>
              <th className="p-4">Organization</th>
              <th className="p-4">Period</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263449] text-[#F8FAFC]">
            {data.experience.map((exp) => (
              <tr key={exp.id} className="hover:bg-[#111827]/50 transition-colors">
                <td className="p-4 font-semibold">{exp.role}</td>
                <td className="p-4 text-[#94A3B8]">{exp.organization}</td>
                <td className="p-4 font-mono">{exp.period}</td>
                <td className="p-4 font-mono">{exp.type}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 bg-[#111827] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded border border-[#263449]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(exp.id)}
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
            <h3 className="text-lg font-bold text-[#F8FAFC]">Delete Experience</h3>
            <p className="text-xs text-[#94A3B8]">Are you sure you want to delete this experience record from Supabase?</p>
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

      {isEditing && currentExp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-[#263449] rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#263449] pb-4">
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                {data.experience.some(e => e.id === currentExp.id) ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Role *</label>
                  <input
                    type="text"
                    required
                    value={currentExp.role || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, role: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={currentExp.organization || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, organization: e.target.value })}
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
                    value={currentExp.period || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, period: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Type</label>
                  <input
                    type="text"
                    value={currentExp.type || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, type: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Location</label>
                  <input
                    type="text"
                    value={currentExp.location || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, location: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Responsibilities (one per line)</label>
                <textarea
                  rows={4}
                  value={Array.isArray(currentExp.responsibilities) ? currentExp.responsibilities.join('\n') : ''}
                  onChange={(e) => setCurrentExp({ ...currentExp, responsibilities: e.target.value.split('\n') })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Frameworks / Skills (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(currentExp.frameworks) ? currentExp.frameworks.join(', ') : ''}
                  onChange={(e) => setCurrentExp({ ...currentExp, frameworks: e.target.value.split(',').map(s => s.trim()) })}
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
                  {loading ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
