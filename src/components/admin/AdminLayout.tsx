import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  FolderKanban, 
  Award, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Wrench,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioDatabase, getPortfolioData, Project } from '../../services/portfolioStorage';
import { AdminDashboardView } from './AdminDashboardView';
import { ProjectsManager } from './ProjectsManager';
import { CertificationsManager } from './CertificationsManager';
import { ExperienceManager } from './ExperienceManager';
import { SkillsManager } from './SkillsManager';
import { EducationManager } from './EducationManager';
import { SecurityPracticesManager } from './SecurityPracticesManager';
import { ResumeManager } from './ResumeManager';
import { SiteSettingsManager } from './SiteSettingsManager';

interface AdminLayoutProps {
  onLogout: () => void;
  onPreviewProjectModal: (proj: Project) => void;
}

export type AdminTab = 
  | 'dashboard' 
  | 'projects' 
  | 'experience' 
  | 'skills' 
  | 'certifications' 
  | 'education' 
  | 'security' 
  | 'resume' 
  | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, onPreviewProjectModal }) => {
  const [data, setData] = useState<PortfolioDatabase>(() => getPortfolioData());
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const refreshData = () => {
    setData({ ...getPortfolioData() });
  };

  useEffect(() => {
    const handleStorageChange = () => refreshData();
    window.addEventListener('portfolio_updated', handleStorageChange);
    return () => window.removeEventListener('portfolio_updated', handleStorageChange);
  }, []);

  // Keyboard accessibility: Escape key closes mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileSidebarOpen]);

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban, count: data.projects?.length },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: data.experience?.length },
    { id: 'skills', label: 'Skills Matrix', icon: Wrench, count: data.skills?.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: data.certifications?.length },
    { id: 'education', label: 'Education', icon: GraduationCap, count: data.education?.length },
    { id: 'security', label: 'Security Practices', icon: Shield, count: data.securityPractices?.length },
    { id: 'resume', label: 'Resumes', icon: FileText, count: data.resumes?.length },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  const currentTabItem = navItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col lg:flex-row text-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111827] border-r border-[#263449] fixed inset-y-0 z-30 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#263449]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[#F8FAFC] tracking-tight text-sm block truncate">
                {data.personal?.name || 'Portfolio'} CMS
              </span>
              <span className="text-[10px] text-[#10B981] font-mono tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 inline" /> AUTHENTICATED
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-[#F8FAFC] shadow-sm'
                    : 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {typeof item.count === 'number' && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#151F2E] text-[#94A3B8] border border-[#263449]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#263449] space-y-1.5 bg-[#111827]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC] font-mono transition-colors border border-transparent hover:border-[#263449]"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Portfolio</span>
            </div>
          </a>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 font-mono transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#111827]/95 backdrop-blur-md border-b border-[#263449] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs shrink-0">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-xs text-[#F8FAFC] truncate block">Portfolio CMS</span>
            <span className="text-[10px] text-[#94A3B8] font-mono block truncate">
              {currentTabItem?.label || 'Dashboard'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263449] rounded-lg"
            title="View Site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263449] rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm pt-16 px-4 pb-6 overflow-y-auto"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111827] border border-[#263449] rounded-xl p-4 space-y-1.5 shadow-2xl max-w-sm mx-auto"
            >
              <div className="pb-3 border-b border-[#263449] flex items-center justify-between">
                <span className="text-xs font-bold text-[#94A3B8] uppercase font-mono">
                  Navigation Menu
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-[#F8FAFC]'
                        : 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {typeof item.count === 'number' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-[#94A3B8]">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-[#263449] space-y-1">
                <a
                  href="/"
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <span className="font-mono">View Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 font-mono hover:bg-red-500/10 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Workspace */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 p-4 sm:p-8 lg:p-10 bg-[#0B1220] min-h-screen">
        {/* Top Breadcrumb Bar on Desktop */}
        <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b border-[#263449]/70">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
            <span>CMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]/60" />
            <span className="text-[#F8FAFC] font-semibold">{currentTabItem?.label}</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] px-3 py-1.5 rounded-lg border border-[#263449] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 bg-[#111827] px-3 py-1.5 rounded-lg border border-[#263449] hover:border-red-500/30 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Content Rendering */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardView data={data} onNavigateTab={(tab) => setActiveTab(tab as AdminTab)} />
          )}
          {activeTab === 'projects' && (
            <ProjectsManager 
              data={data} 
              onUpdate={refreshData} 
              onPreviewProject={(proj) => onPreviewProjectModal(proj)} 
            />
          )}
          {activeTab === 'experience' && (
            <ExperienceManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'skills' && (
            <SkillsManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'certifications' && (
            <CertificationsManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'education' && (
            <EducationManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'security' && (
            <SecurityPracticesManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'resume' && (
            <ResumeManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'settings' && (
            <SiteSettingsManager data={data} onUpdate={refreshData} />
          )}
        </div>
      </main>
    </div>
  );
};
