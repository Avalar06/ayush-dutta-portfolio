import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Shield, AlertCircle, CheckCircle2, ShieldCheck, Lock, Activity, Eye, Terminal, Server } from 'lucide-react';
import { PortfolioDatabase, saveSecurityPracticesToSupabase } from '../../services/portfolioStorage';

interface SecurityPracticesManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
}

const AVAILABLE_ICONS = [
  { id: 'Shield', label: 'Shield', Icon: Shield },
  { id: 'ShieldCheck', label: 'Shield Check', Icon: ShieldCheck },
  { id: 'Lock', label: 'Lock', Icon: Lock },
  { id: 'Activity', label: 'Activity', Icon: Activity },
  { id: 'Eye', label: 'Monitoring', Icon: Eye },
  { id: 'Terminal', label: 'Terminal', Icon: Terminal },
  { id: 'Server', label: 'Server', Icon: Server }
];

export const SecurityPracticesManager: React.FC<SecurityPracticesManagerProps> = ({ data, onUpdate }) => {
  const [practices, setPractices] = useState(data.securityPractices || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentPractice, setCurrentPractice] = useState<{ title: string; description: string; icon: string }>({
    title: '',
    description: '',
    icon: 'Shield'
  });
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenAdd = () => {
    setCurrentPractice({
      title: '',
      description: '',
      icon: 'Shield'
    });
    setEditIndex(null);
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleOpenEdit = (index: number) => {
    setCurrentPractice({ ...practices[index] });
    setEditIndex(index);
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPractice.title.trim()) {
      setError('Please provide a title.');
      return;
    }

    setLoading(true);
    setError('');

    let updated = [...practices];
    if (editIndex !== null) {
      updated[editIndex] = currentPractice;
    } else {
      updated.push(currentPractice);
    }

    try {
      await saveSecurityPracticesToSupabase(updated);
      setPractices(updated);
      setSuccess('Security practices updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
      setIsEditing(false);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to save security practice.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index: number) => {
    setLoading(true);
    setError('');
    const updated = practices.filter((_, idx) => idx !== index);
    try {
      await saveSecurityPracticesToSupabase(updated);
      setPractices(updated);
      setDeleteConfirmIndex(null);
      setSuccess('Security practice removed.');
      setTimeout(() => setSuccess(''), 3000);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to delete security practice.');
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName: string) => {
    const item = AVAILABLE_ICONS.find(i => i.id === iconName);
    const IconComp = item ? item.Icon : Shield;
    return <IconComp className="w-4 h-4 text-[#3B82F6]" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Security Practices & Disciplines</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            MANAGE CORE SECURITY DISCIPLINES AND WORKFLOW PILLARS
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practice</span>
        </button>
      </div>

      {success && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] p-3 rounded-lg flex items-center space-x-2 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {practices.map((practice, idx) => (
          <div
            key={idx}
            className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center shrink-0">
                    {renderIcon(practice.icon)}
                  </div>
                  <h3 className="text-sm font-bold text-[#F8FAFC] truncate">
                    {practice.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(idx)}
                    className="p-1.5 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#151F2E] rounded-md transition-colors"
                    title="Edit Practice"
                    aria-label="Edit Practice"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmIndex(idx)}
                    className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete Practice"
                    aria-label="Delete Practice"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                {practice.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#263449]/70 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span>Icon: {practice.icon || 'Shield'}</span>
              <span className="text-[#3B82F6]">Pillar #{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {practices.length === 0 && (
        <div className="bg-[#111827] border border-[#263449] rounded-xl p-8 text-center text-[#94A3B8]">
          <p className="text-sm mb-3">No security practices configured yet.</p>
          <button
            onClick={handleOpenAdd}
            className="text-xs font-semibold text-[#2563EB] hover:underline"
          >
            Add your first practice
          </button>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#263449] rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b border-[#263449] flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#F8FAFC]">
                {editIndex !== null ? 'Edit Security Practice' : 'Add Security Practice'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Security Operations & Monitoring"
                  value={currentPractice.title}
                  onChange={(e) =>
                    setCurrentPractice({ ...currentPractice, title: e.target.value })
                  }
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the methodology and operational discipline..."
                  value={currentPractice.description}
                  onChange={(e) =>
                    setCurrentPractice({ ...currentPractice, description: e.target.value })
                  }
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((iconItem) => {
                    const isSelected = currentPractice.icon === iconItem.id;
                    const IconComp = iconItem.Icon;
                    return (
                      <button
                        key={iconItem.id}
                        type="button"
                        onClick={() =>
                          setCurrentPractice({ ...currentPractice, icon: iconItem.id })
                        }
                        className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#2563EB]/20 border-[#2563EB] text-[#F8FAFC]'
                            : 'bg-[#151F2E] border-[#263449] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <IconComp className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-mono">{iconItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#263449] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold rounded-lg shadow-sm"
                >
                  {loading ? 'Saving...' : 'Save Practice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#263449] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-[#F8FAFC]">Delete Security Practice?</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              This action cannot be undone. This security pillar will be removed from your portfolio database.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmIndex(null)}
                className="px-3 py-1.5 border border-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmIndex)}
                disabled={loading}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
