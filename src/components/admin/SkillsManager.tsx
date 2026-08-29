import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Wrench, AlertCircle, CheckCircle2, Tag } from 'lucide-react';
import { SkillCategory, PortfolioDatabase, saveSkillCategoryToSupabase, deleteSkillCategoryFromSupabase } from '../../services/portfolioStorage';

interface SkillsManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<SkillCategory> | null>(null);
  const [newSkillTag, setNewSkillTag] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const skillCategories = data.skills || [];

  const handleOpenAdd = () => {
    setCurrentCategory({
      id: `skill-cat-${Date.now()}`,
      title: '',
      description: '',
      skills: []
    });
    setNewSkillTag('');
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleOpenEdit = (category: SkillCategory) => {
    setCurrentCategory({
      ...category,
      skills: [...category.skills]
    });
    setNewSkillTag('');
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleAddSkillTag = () => {
    if (!newSkillTag.trim() || !currentCategory) return;
    const trimmed = newSkillTag.trim();
    const existing = currentCategory.skills || [];
    if (!existing.includes(trimmed)) {
      setCurrentCategory({
        ...currentCategory,
        skills: [...existing, trimmed]
      });
    }
    setNewSkillTag('');
  };

  const handleRemoveSkillTag = (tagToRemove: string) => {
    if (!currentCategory) return;
    setCurrentCategory({
      ...currentCategory,
      skills: (currentCategory.skills || []).filter(s => s !== tagToRemove)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory || !currentCategory.title) {
      setError('Please provide a category title.');
      return;
    }

    setLoading(true);
    setError('');

    const categoryToSave: SkillCategory = {
      id: currentCategory.id || `skill-cat-${Date.now()}`,
      title: currentCategory.title.trim(),
      description: currentCategory.description?.trim() || '',
      skills: currentCategory.skills || []
    };

    try {
      await saveSkillCategoryToSupabase(categoryToSave);
      setSuccess('Skill category saved successfully.');
      setTimeout(() => setSuccess(''), 3000);
      setIsEditing(false);
      setCurrentCategory(null);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to save skill category.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await deleteSkillCategoryFromSupabase(id);
      setDeleteConfirmId(null);
      onUpdate();
    } catch (err: unknown) {
      const errObj = err as Error;
      setError(errObj.message || 'Failed to delete skill category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Technical Skills & Domains</h2>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
            MANAGE CATEGORIES, TOOLS, AND TECHNOLOGY TAGS
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill Category</span>
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

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillCategories.map((category) => (
          <div
            key={category.id}
            className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 rounded-xl p-5 flex flex-col justify-between transition-colors shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#3B82F6] shrink-0">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F8FAFC] truncate">
                    {category.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(category)}
                    className="p-1.5 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#151F2E] rounded-md transition-colors"
                    title="Edit Category"
                    aria-label="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(category.id)}
                    className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Delete Category"
                    aria-label="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {category.description && (
                <p className="text-xs text-[#94A3B8] mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(category.skills || []).map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-[#151F2E] text-[#94A3B8] border border-[#263449]"
                  >
                    {skill}
                  </span>
                ))}
                {(category.skills || []).length === 0 && (
                  <span className="text-[11px] text-[#94A3B8]/60 italic font-mono">
                    No individual skills listed
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#263449]/70 flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
              <span>{category.skills?.length || 0} skills in category</span>
              <span className="text-[#3B82F6]">ID: {category.id.slice(0, 12)}...</span>
            </div>
          </div>
        ))}
      </div>

      {skillCategories.length === 0 && (
        <div className="bg-[#111827] border border-[#263449] rounded-xl p-8 text-center text-[#94A3B8]">
          <p className="text-sm mb-3">No skill categories configured yet.</p>
          <button
            onClick={handleOpenAdd}
            className="text-xs font-semibold text-[#2563EB] hover:underline"
          >
            Create your first skill category
          </button>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditing && currentCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#263449] rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-[#263449] flex items-center justify-between sticky top-0 bg-[#111827] z-10">
              <h3 className="font-bold text-sm text-[#F8FAFC]">
                {currentCategory.id && skillCategories.some(c => c.id === currentCategory.id)
                  ? 'Edit Skill Category'
                  : 'Add New Skill Category'}
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
                  Category Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Security Operations & Threat Detection"
                  value={currentCategory.title || ''}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, title: e.target.value })
                  }
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of this technical area..."
                  value={currentCategory.description || ''}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, description: e.target.value })
                  }
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">
                  Skills & Tools List
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Wireshark, Splunk, Python..."
                    value={newSkillTag}
                    onChange={(e) => setNewSkillTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkillTag();
                      }
                    }}
                    className="flex-1 bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC] focus:border-[#2563EB] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkillTag}
                    className="px-3 py-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white rounded-lg font-semibold shrink-0"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Display Current Tags */}
                <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-3 min-h-[60px] flex flex-wrap gap-1.5">
                  {(currentCategory.skills || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center bg-[#111827] border border-[#263449] text-[#F8FAFC] px-2.5 py-1 rounded text-xs"
                    >
                      <Tag className="w-3 h-3 text-[#3B82F6] mr-1.5" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillTag(tag)}
                        className="ml-1.5 text-[#94A3B8] hover:text-red-400 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(currentCategory.skills || []).length === 0 && (
                    <span className="text-[#94A3B8] text-[11px] font-mono italic self-center">
                      Type a skill above and click 'Add Tag' or press Enter
                    </span>
                  )}
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
                  {loading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#263449] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-[#F8FAFC]">Delete Skill Category?</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              This action cannot be undone. The category and all associated skill tags will be removed from your portfolio database.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
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
