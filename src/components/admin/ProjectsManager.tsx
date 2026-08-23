import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Upload } from 'lucide-react';
import { Project, PortfolioDatabase, saveProjectToSupabase, deleteProjectFromSupabase, uploadFileToSupabase } from '../../services/portfolioStorage';

interface ProjectsManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
  onPreviewProject: (project: Project) => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({ data, onUpdate, onPreviewProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setCurrentProject({
      id: `project-${Date.now()}`,
      title: '',
      category: 'Cybersecurity',
      status: 'Completed',
      featured: false,
      published: true,
      label: 'New Project',
      badge: 'Security Monitoring',
      shortDescription: '',
      description: '',
      technologies: ['Python', 'Security'],
      capabilities: ['Feature 1'],
      metrics: [{ label: 'Metric', value: '100%' }],
      date: '2026',
      role: 'Developer'
    });
    setIsEditing(true);
    setError('');
  };

  const handleOpenEdit = (project: Project) => {
    setCurrentProject({ ...project });
    setIsEditing(true);
    setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');
    try {
      const publicUrl = await uploadFileToSupabase(file, 'projects');
      setCurrentProject(prev => prev ? ({ ...prev, badge: publicUrl }) : null);
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !currentProject.title) return;

    setLoading(true);
    setError('');

    const projectToSave: Project = {
      id: currentProject.id || `project-${Date.now()}`,
      title: currentProject.title || '',
      category: (currentProject.category as any) || 'Cybersecurity',
      status: (currentProject.status as any) || 'Completed',
      featured: !!currentProject.featured,
      published: currentProject.published !== false,
      label: currentProject.label || 'Project',
      badge: currentProject.badge || '',
      shortDescription: currentProject.shortDescription || currentProject.description || '',
      description: currentProject.description || currentProject.shortDescription || '',
      technologies: Array.isArray(currentProject.technologies) ? currentProject.technologies : typeof currentProject.technologies === 'string' ? (currentProject.technologies as string).split(',').map(s => s.trim()) : [],
      capabilities: Array.isArray(currentProject.capabilities) ? currentProject.capabilities : typeof currentProject.capabilities === 'string' ? (currentProject.capabilities as string).split(',').map(s => s.trim()) : [],
      metrics: currentProject.metrics || [],
      architectureSteps: currentProject.architectureSteps || [],
      caseStudy: currentProject.caseStudy || { problem: '', approach: '' },
      githubUrl: currentProject.githubUrl || '',
      demoUrl: currentProject.demoUrl || '',
      date: currentProject.date || '2026',
      role: currentProject.role || 'Developer',
      isFlagship: !!currentProject.isFlagship
    };

    try {
      await saveProjectToSupabase(projectToSave);
      setIsEditing(false);
      setCurrentProject(null);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await deleteProjectFromSupabase(id);
      setDeleteConfirmId(null);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    setLoading(true);
    try {
      const updated = { ...proj, published: proj.published === false ? true : false };
      await saveProjectToSupabase(updated);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Projects Management</h2>
          <p className="text-xs text-[#94A3B8]">Add, edit, publish or archive portfolio projects backed by Supabase.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Projects Table */}
      <div className="bg-[#151F2E] border border-[#263449] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#111827] border-b border-[#263449] text-[#94A3B8] font-mono">
                <th className="p-4">Project Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Visibility</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449] text-[#F8FAFC]">
              {data.projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-sm">{proj.title}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">{proj.label}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono bg-[#111827] border border-[#263449] px-2 py-0.5 rounded text-[11px]">
                      {proj.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`font-mono px-2 py-0.5 rounded text-[10px] ${
                      proj.status === 'Completed' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(proj)}
                      disabled={loading}
                      className={`font-mono px-2 py-0.5 rounded text-[10px] ${
                        proj.published !== false ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#263449] text-[#94A3B8]'
                      }`}
                    >
                      {proj.published !== false ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4">
                    {proj.isFlagship ? (
                      <span className="text-[10px] font-mono bg-[#2563EB]/20 text-[#2563EB] px-2 py-0.5 rounded">Flagship</span>
                    ) : proj.featured ? (
                      <span className="text-[10px] font-mono bg-[#2563EB]/10 text-[#2563EB] px-2 py-0.5 rounded">Featured</span>
                    ) : (
                      <span className="text-[10px] text-[#94A3B8]">Standard</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => onPreviewProject(proj)}
                      title="Preview"
                      className="p-1.5 bg-[#111827] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded border border-[#263449]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      title="Edit"
                      className="p-1.5 bg-[#111827] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded border border-[#263449]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(proj.id)}
                      title="Delete"
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#263449] rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Confirm Project Deletion</h3>
            <p className="text-xs text-[#94A3B8]">Are you sure you want to delete this project? This action removes the record from Supabase permanently.</p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
              >
                {loading ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isEditing && currentProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-[#263449] rounded-xl max-w-3xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#263449] pb-4">
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                {data.projects.some(p => p.id === currentProject.id) ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Project ID (Slug) *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.id || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, id: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.title || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Category</label>
                  <select
                    value={currentProject.category || 'Cybersecurity'}
                    onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value as any })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Web">Web</option>
                    <option value="Data">Data</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Status</label>
                  <select
                    value={currentProject.status || 'Completed'}
                    onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value as any })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Research">Research</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Visibility</label>
                  <div className="flex items-center space-x-4 pt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={currentProject.published !== false}
                        onChange={(e) => setCurrentProject({ ...currentProject, published: e.target.checked })}
                        className="rounded bg-[#151F2E] border-[#263449]"
                      />
                      <span>Published Publicly</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Label (e.g. M.Sc. Research Project)</label>
                  <input
                    type="text"
                    value={currentProject.label || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, label: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Badge (e.g. SIEM Monitoring)</label>
                  <input
                    type="text"
                    value={currentProject.badge || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, badge: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={currentProject.shortDescription || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, shortDescription: e.target.value })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] uppercase font-mono mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={currentProject.description || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value, shortDescription: currentProject.shortDescription || e.target.value })}
                  className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(currentProject.technologies) ? currentProject.technologies.join(', ') : ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Capabilities (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(currentProject.capabilities) ? currentProject.capabilities.join(', ') : ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, capabilities: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={currentProject.githubUrl || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, githubUrl: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] uppercase font-mono mb-1">Demo URL</label>
                  <input
                    type="url"
                    value={currentProject.demoUrl || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, demoUrl: e.target.value })}
                    className="w-full bg-[#151F2E] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!currentProject.isFlagship}
                    onChange={(e) => setCurrentProject({ ...currentProject, isFlagship: e.target.checked })}
                    className="rounded bg-[#151F2E] border-[#263449]"
                  />
                  <span>Mark as Flagship Project</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#263449]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold rounded-lg shadow-sm"
                >
                  {loading ? 'Saving to Supabase...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
