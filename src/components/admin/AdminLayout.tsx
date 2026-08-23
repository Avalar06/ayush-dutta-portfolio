import React, { useState, useEffect } from 'react';
import { Shield, LayoutDashboard, FolderKanban, Award, Briefcase, GraduationCap, Settings, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { PortfolioDatabase, getPortfolioData, Project } from '../../services/portfolioStorage';
import { AdminDashboardView } from './AdminDashboardView';
import { ProjectsManager } from './ProjectsManager';
import { CertificationsManager } from './CertificationsManager';
import { ExperienceManager } from './ExperienceManager';
import { EducationManager } from './EducationManager';
import { SiteSettingsManager } from './SiteSettingsManager';

interface AdminLayoutProps {
  onLogout: () => void;
  onPreviewProjectModal: (proj: Project) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, onPreviewProjectModal }) => {
  const [data, setData] = useState<PortfolioDatabase>(getPortfolioData());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'certifications' | 'experience' | 'education' | 'settings'>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const refreshData = () => {
    setData(getPortfolioData());
  };

  useEffect(() => {
    const handleStorageChange = () => refreshData();
    window.addEventListener('portfolio_updated', handleStorageChange);
    return () => window.removeEventListener('portfolio_updated', handleStorageChange);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] flex text-[#F8FAFC]">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111827] border-r border-[#263449] fixed inset-y-0 z-30">
        <div className="p-6 border-b border-[#263449]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#F8FAFC] tracking-tight text-sm block">
                Ayush Dutta CMS
              </span>
              <span className="text-[10px] text-[#10B981] font-mono tracking-wider block">
                AUTHENTICATED ADMIN
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-[#F8FAFC]'
                    : 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#263449] space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC] font-mono transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 font-mono transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#111827] border-b border-[#263449] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs">Ayush Dutta Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-[#94A3B8] hover:text-[#F8FAFC]"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm pt-16 px-4">
          <div className="bg-[#111827] border border-[#263449] rounded-xl p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs text-[#F8FAFC] hover:bg-[#151F2E]"
                >
                  <Icon className="w-4 h-4 text-[#2563EB]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-4 border-t border-[#263449] space-y-2">
              <a
                href="/"
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#94A3B8]"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 font-mono"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 p-6 sm:p-10 bg-[#0B1220] min-h-screen">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardView data={data} onNavigateTab={(tab) => setActiveTab(tab as any)} />
          )}
          {activeTab === 'projects' && (
            <ProjectsManager 
              data={data} 
              onUpdate={refreshData} 
              onPreviewProject={(proj) => onPreviewProjectModal(proj)} 
            />
          )}
          {activeTab === 'certifications' && (
            <CertificationsManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'experience' && (
            <ExperienceManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'education' && (
            <EducationManager data={data} onUpdate={refreshData} />
          )}
          {activeTab === 'settings' && (
            <SiteSettingsManager data={data} onUpdate={refreshData} />
          )}
        </div>
      </main>
    </div>
  );
};
