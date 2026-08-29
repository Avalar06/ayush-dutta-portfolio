import React from 'react';
import {
  Shield,
  FolderKanban,
  Award,
  GraduationCap,
  Briefcase,
  FileText,
  Wrench,
  CheckCircle2,
  Lock,
  FileCheck,
  Settings,
  ArrowRight,
  Database
} from 'lucide-react';
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
  const eduCount = data.education.length;
  const skillCatCount = (data.skills || []).length;
  const totalSkillTags = (data.skills || []).reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const secCount = (data.securityPractices || []).length;
  const resumes = data.resumes || [];
  const activeResume = resumes.find(r => r.published !== false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#263449]">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Portfolio CMS Overview</h1>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">
            STRUCTURED CONTENT & BACKEND MANAGEMENT WORKSPACE
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-3 py-1.5 rounded-lg shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>PostgreSQL & RLS Active</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Card */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Projects</span>
            <FolderKanban className="w-5 h-5 text-[#2563EB] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#F8FAFC]">{data.projects.length}</span>
            <span className="text-xs text-[#94A3B8] font-mono">total</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-2 border-t border-[#263449]/60">
            <span className="text-[#10B981]">{publishedProjectsCount} published</span>
            <span className="text-[#94A3B8]">{draftProjectsCount} drafts</span>
          </div>
        </div>

        {/* Certifications Card */}
        <div
          onClick={() => onNavigateTab('certifications')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Certifications</span>
            <Award className="w-5 h-5 text-[#10B981] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#F8FAFC]">{certsCount}</span>
            <span className="text-xs text-[#94A3B8] font-mono">credentials</span>
          </div>
          <div className="text-[11px] font-mono text-[#94A3B8] mt-2 pt-2 border-t border-[#263449]/60">
            Verified badges & documentation
          </div>
        </div>

        {/* Experience Card */}
        <div
          onClick={() => onNavigateTab('experience')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Experience</span>
            <Briefcase className="w-5 h-5 text-[#2563EB] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#F8FAFC]">{expCount}</span>
            <span className="text-xs text-[#94A3B8] font-mono">milestones</span>
          </div>
          <div className="text-[11px] font-mono text-[#94A3B8] mt-2 pt-2 border-t border-[#263449]/60">
            Roles, internships & timelines
          </div>
        </div>

        {/* Skills Card */}
        <div
          onClick={() => onNavigateTab('skills')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Skills Matrix</span>
            <Wrench className="w-5 h-5 text-[#3B82F6] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#F8FAFC]">{skillCatCount}</span>
            <span className="text-xs text-[#94A3B8] font-mono">categories</span>
          </div>
          <div className="text-[11px] font-mono text-[#94A3B8] mt-2 pt-2 border-t border-[#263449]/60">
            {totalSkillTags} tool & framework tags
          </div>
        </div>

        {/* Education Card */}
        <div
          onClick={() => onNavigateTab('education')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Education</span>
            <GraduationCap className="w-5 h-5 text-[#3B82F6] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#F8FAFC]">{eduCount}</span>
            <span className="text-xs text-[#94A3B8] font-mono">degrees</span>
          </div>
          <div className="text-[11px] font-mono text-[#94A3B8] mt-2 pt-2 border-t border-[#263449]/60">
            Academic programs & coursework
          </div>
        </div>

        {/* Security Practices Card */}
        <div
          onClick={() => onNavigateTab('security')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Security Practices</span>
            <Shield className="w-5 h-5 text-[#10B981] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#F8FAFC]">{secCount}</span>
            <span className="text-xs text-[#94A3B8] font-mono">disciplines</span>
          </div>
          <div className="text-[11px] font-mono text-[#94A3B8] mt-2 pt-2 border-t border-[#263449]/60">
            Workflow & operations pillars
          </div>
        </div>

        {/* Resumes Card */}
        <div
          onClick={() => onNavigateTab('resume')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Resume CVs</span>
            <FileText className="w-5 h-5 text-[#2563EB] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#F8FAFC]">{resumes.length}</span>
            <span className="text-xs text-[#94A3B8] font-mono">documents</span>
          </div>
          <div className="text-[11px] font-mono text-[#10B981] mt-2 pt-2 border-t border-[#263449]/60 truncate">
            {activeResume ? `Active: ${activeResume.title}` : 'No active resume'}
          </div>
        </div>

        {/* Site Settings & Config */}
        <div
          onClick={() => onNavigateTab('settings')}
          className="bg-[#111827] border border-[#263449] hover:border-[#2563EB] rounded-xl p-5 cursor-pointer transition-all hover:bg-[#151F2E] shadow-sm group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-mono text-[#94A3B8]">Site Settings</span>
            <Settings className="w-5 h-5 text-[#94A3B8] group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-[#F8FAFC] truncate">{data.personal.name}</span>
          </div>
          <div className="text-[11px] font-mono text-[#94A3B8] mt-2 pt-2 border-t border-[#263449]/60 truncate">
            {data.personal.email}
          </div>
        </div>
      </div>

      {/* Content Status & Security Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Resume Status Card */}
        <div className="bg-[#111827] border border-[#263449] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-bold text-[#F8FAFC]">Public Resume Publication Status</h3>
            </div>
            <button
              onClick={() => onNavigateTab('resume')}
              className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center space-x-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {activeResume ? (
            <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F8FAFC]">{activeResume.title}</span>
                <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded">
                  PUBLISHED TO PUBLIC
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">{activeResume.description || 'Current active portfolio resume'}</p>
              <div className="pt-2 border-t border-[#263449]/60 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                <span>Target: {activeResume.targetRoles || 'General Tech'}</span>
                <span className="text-[#3B82F6]">PDF Format</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-4 text-center text-xs text-[#94A3B8]">
              No resume is currently marked as published.
            </div>
          )}
        </div>

        {/* Backend & Security Controls */}
        <div className="bg-[#111827] border border-[#263449] rounded-xl p-6 space-y-3">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-4 h-4 text-[#3B82F6]" />
            <h3 className="text-sm font-bold text-[#F8FAFC]">Storage & Security Architecture</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 bg-[#151F2E] rounded-lg border border-[#263449]">
              <span className="text-[#94A3B8]">Database Row Level Security (RLS)</span>
              <span className="text-[#10B981] font-semibold">ENFORCED</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#151F2E] rounded-lg border border-[#263449]">
              <span className="text-[#94A3B8]">Admin Role Verification</span>
              <span className="text-[#10B981] font-semibold">admin_users Table</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#151F2E] rounded-lg border border-[#263449]">
              <span className="text-[#94A3B8]">Storage Upload File Type Allowlist</span>
              <span className="text-[#10B981] font-semibold">MIME / Ext Guarded</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#151F2E] rounded-lg border border-[#263449]">
              <span className="text-[#94A3B8]">Maximum Upload Payload Limit</span>
              <span className="text-[#F8FAFC] font-semibold">10 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panel */}
      <div className="bg-[#111827] border border-[#263449] rounded-xl p-6">
        <h3 className="text-sm font-bold text-[#F8FAFC] mb-4">Content Entity Managers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateTab('projects')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Projects
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Case studies & workflows</span>
          </button>

          <button
            onClick={() => onNavigateTab('certifications')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Certifications
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Badges & issuers</span>
          </button>

          <button
            onClick={() => onNavigateTab('skills')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Skills Matrix
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Tools & domains</span>
          </button>

          <button
            onClick={() => onNavigateTab('experience')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Experience
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Roles & milestones</span>
          </button>

          <button
            onClick={() => onNavigateTab('education')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Education
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Academic records</span>
          </button>

          <button
            onClick={() => onNavigateTab('security')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Security Practices
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Pillars & disciplines</span>
          </button>

          <button
            onClick={() => onNavigateTab('resume')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Resume Manager
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Publish & upload CVs</span>
          </button>

          <button
            onClick={() => onNavigateTab('settings')}
            className="p-3.5 bg-[#151F2E] border border-[#263449] hover:border-[#2563EB] rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#2563EB] transition-colors">
                Site Settings
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </div>
            <span className="text-[11px] text-[#94A3B8] font-mono">Contact & bio info</span>
          </button>
        </div>
      </div>
    </div>
  );
};
