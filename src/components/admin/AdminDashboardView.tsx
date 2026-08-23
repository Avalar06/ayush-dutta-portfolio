import React from 'react';
import { Shield, FolderKanban, Award, GraduationCap, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { PortfolioDatabase } from '../../services/portfolioStorage';

interface AdminDashboardViewProps {
  data: PortfolioDatabase;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ data, onNavigateTab }) => {
  const publishedProjectsCount = data.projects.filter(p => p.published !== false).length;
  const draftProjectsCount = data.projects.filter(p => p.published === false).length;
  const certsCount = data.certifications.length;
  const expCount = data.experience.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Admin Dashboard</h1>
        <p className="text-xs text-[#94A3B8] font-mono mt-1">
          SECURE PORTFOLIO MANAGEMENT CONSOLE • AYUSH DUTTA
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab('projects')}
          className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 cursor-pointer hover:border-[#2563EB] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Published Projects</span>
            <FolderKanban className="w-5 h-5 text-[#2563EB]" />
          </div>
          <span className="text-3xl font-bold text-[#F8FAFC]">{publishedProjectsCount}</span>
          <span className="text-[11px] text-[#10B981] block mt-1">{draftProjectsCount} drafts in storage</span>
        </div>

        <div 
          onClick={() => onNavigateTab('certifications')}
          className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 cursor-pointer hover:border-[#2563EB] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Certifications</span>
            <Award className="w-5 h-5 text-[#10B981]" />
          </div>
          <span className="text-3xl font-bold text-[#F8FAFC]">{certsCount}</span>
          <span className="text-[11px] text-[#94A3B8] block mt-1">Verified credentials</span>
        </div>

        <div 
          onClick={() => onNavigateTab('experience')}
          className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 cursor-pointer hover:border-[#2563EB] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Experience Entries</span>
            <Briefcase className="w-5 h-5 text-[#2563EB]" />
          </div>
          <span className="text-3xl font-bold text-[#F8FAFC]">{expCount}</span>
          <span className="text-[11px] text-[#94A3B8] block mt-1">Internships & training</span>
        </div>

        <div 
          onClick={() => onNavigateTab('settings')}
          className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 cursor-pointer hover:border-[#2563EB] transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Database Security</span>
            <Shield className="w-5 h-5 text-[#10B981]" />
          </div>
          <span className="text-3xl font-bold text-[#10B981]">Secure</span>
          <span className="text-[11px] text-[#94A3B8] block mt-1">RBAC & RLS Enabled</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-6">
        <h3 className="text-sm font-bold text-[#F8FAFC] mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab('projects')}
            className="p-4 bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <span className="text-xs font-mono text-[#2563EB] block mb-1">01 // PROJECTS</span>
            <span className="font-semibold text-[#F8FAFC] text-sm block group-hover:text-[#2563EB] transition-colors">Add / Edit Projects</span>
            <span className="text-[11px] text-[#94A3B8]">Manage project portfolio items</span>
          </button>

          <button
            onClick={() => onNavigateTab('certifications')}
            className="p-4 bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <span className="text-xs font-mono text-[#10B981] block mb-1">02 // CREDENTIALS</span>
            <span className="font-semibold text-[#F8FAFC] text-sm block group-hover:text-[#2563EB] transition-colors">Manage Certifications</span>
            <span className="text-[11px] text-[#94A3B8]">Update badges & issuer records</span>
          </button>

          <button
            onClick={() => onNavigateTab('settings')}
            className="p-4 bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <span className="text-xs font-mono text-[#2563EB] block mb-1">03 // SETTINGS</span>
            <span className="font-semibold text-[#F8FAFC] text-sm block group-hover:text-[#2563EB] transition-colors">Site Settings</span>
            <span className="text-[11px] text-[#94A3B8]">Modify contact & profile summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
