import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { PortfolioDatabase, saveSiteSettingsToSupabase } from '../../services/portfolioStorage';

interface SiteSettingsManagerProps {
  data: PortfolioDatabase;
  onUpdate: () => void;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({ data, onUpdate }) => {
  const [personal, setPersonal] = useState(data.personal);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await saveSiteSettingsToSupabase(personal);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to save site settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-[#F8FAFC]">Site Settings & Profile Information</h2>
        <p className="text-xs text-[#94A3B8]">Manage personal branding, bio, contact details, and core headline in Supabase.</p>
      </div>

      {savedSuccess && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] p-4 rounded-lg flex items-center space-x-2 text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Site settings updated successfully and saved to Supabase.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-8 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#94A3B8] uppercase font-mono mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={personal.name}
              onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
              className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
            />
          </div>
          <div>
            <label className="block text-[#94A3B8] uppercase font-mono mb-1">Professional Title *</label>
            <input
              type="text"
              required
              value={personal.title}
              onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
              className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#94A3B8] uppercase font-mono mb-1">Location *</label>
            <input
              type="text"
              required
              value={personal.location}
              onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
              className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
            />
          </div>
          <div>
            <label className="block text-[#94A3B8] uppercase font-mono mb-1">Status / Availability *</label>
            <input
              type="text"
              required
              value={personal.status}
              onChange={(e) => setPersonal({ ...personal, status: e.target.value })}
              className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#94A3B8] uppercase font-mono mb-1">Email *</label>
            <input
              type="email"
              required
              value={personal.email}
              onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
              className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
            />
          </div>
          <div>
            <label className="block text-[#94A3B8] uppercase font-mono mb-1">Phone</label>
            <input
              type="text"
              value={personal.phone}
              onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
              className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
            />
          </div>
          <div>
            <label className="block text-[#94A3B8] uppercase font-mono mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={personal.linkedin}
              onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
              className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#94A3B8] uppercase font-mono mb-1">GitHub URL</label>
          <input
            type="url"
            value={personal.github}
            onChange={(e) => setPersonal({ ...personal, github: e.target.value })}
            className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
          />
        </div>

        <div>
          <label className="block text-[#94A3B8] uppercase font-mono mb-1">Short Bio</label>
          <textarea
            rows={2}
            value={personal.shortBio}
            onChange={(e) => setPersonal({ ...personal, shortBio: e.target.value })}
            className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
          />
        </div>

        <div>
          <label className="block text-[#94A3B8] uppercase font-mono mb-1">About Summary</label>
          <textarea
            rows={4}
            value={personal.aboutSummary}
            onChange={(e) => setPersonal({ ...personal, aboutSummary: e.target.value })}
            className="w-full bg-[#111827] border border-[#263449] rounded-lg px-3 py-2 text-[#F8FAFC]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
