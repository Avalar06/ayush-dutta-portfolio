import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { SecurityPractice } from './components/SecurityPractice';
import { Experience } from './components/Experience';
import { Certifications } from './components/Certifications';
import { Education } from './components/Education';
import { ResumeSection } from './components/ResumeSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

import { Certification, Project, fetchPortfolioDataFromSupabase, verifyAdminUser } from './services/portfolioStorage';
import { supabase } from './lib/supabase';

// Lazy-loaded Modal components
const CertificateModal = lazy(() => import('./components/CertificateModal').then(m => ({ default: m.CertificateModal })));
const CaseStudyModal = lazy(() => import('./components/CaseStudyModal').then(m => ({ default: m.CaseStudyModal })));
const ResumeModal = lazy(() => import('./components/ResumeModal').then(m => ({ default: m.ResumeModal })));

// Lazy-loaded Admin and Auth components
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const ResetPassword = lazy(() => import('./components/admin/ResetPassword').then(m => ({ default: m.ResetPassword })));

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isResetPasswordRoute, setIsResetPasswordRoute] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [selectedCaseStudyProject, setSelectedCaseStudyProject] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const handleOpenResume = (resumeId?: string) => {
    setSelectedResumeId(resumeId || null);
    setResumeModalOpen(true);
  };

  // Initialize data from Supabase on mount
  useEffect(() => {
    fetchPortfolioDataFromSupabase().catch(err => {
      console.error("Failed to load initial portfolio data:", err);
    });
  }, []);

  // Handle routing and Supabase Auth session
  useEffect(() => {
    const handleRouteChange = async () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isResetPass = path === '/reset-password' || hash === '#reset-password' || hash.includes('type=recovery');
      const isAdmin = path === '/admin' || path.startsWith('/admin') || hash === '#admin';

      setIsResetPasswordRoute(isResetPass);
      setIsAdminRoute(isAdmin);

      if (isAdmin) {
        setAuthChecking(true);
        const authorized = await verifyAdminUser();
        setIsAdminAuth(authorized);
        setAuthChecking(false);
      } else {
        setAuthChecking(false);
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('portfolio_updated', handleRouteChange);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetPasswordRoute(true);
      }
      const authorized = await verifyAdminUser();
      setIsAdminAuth(authorized);
    });

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('portfolio_updated', handleRouteChange);
      subscription.unsubscribe();
    };
  }, []);

  if (isResetPasswordRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-[#94A3B8] font-mono text-xs">Loading secure reset portal...</div>}>
        <ResetPassword
          onSuccess={() => {
            window.location.hash = '';
            window.location.pathname = '/admin';
          }}
        />
      </Suspense>
    );
  }

  // If user is accessing /admin
  if (isAdminRoute) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-[#94A3B8] font-mono text-xs">
          Verifying secure session...
        </div>
      );
    }

    if (!isAdminAuth) {
      return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-[#94A3B8] font-mono text-xs">Loading admin portal...</div>}>
          <AdminLogin
            onLoginSuccess={async () => {
              const authorized = await verifyAdminUser();
              setIsAdminAuth(authorized);
            }}
          />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-[#94A3B8] font-mono text-xs">Loading admin workspace...</div>}>
        <AdminLayout
          onLogout={async () => {
            await supabase.auth.signOut();
            setIsAdminAuth(false);
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          onPreviewProjectModal={(proj) => setPreviewProject(proj)}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Sticky Navigation */}
      <Navbar onOpenResumeModal={() => handleOpenResume()} />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenResumeModal={() => handleOpenResume()} />
        <About />
        <Skills />
        <Projects onOpenCaseStudy={(proj) => setSelectedCaseStudyProject(proj)} />
        <SecurityPractice />
        <Experience />
        <Certifications onSelectCertificate={(cert) => setSelectedCertificate(cert)} />
        <Education />
        <ResumeSection onOpenResumeModal={(resumeId) => handleOpenResume(resumeId)} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Lazy Modals with Suspense */}
      <Suspense fallback={null}>
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />

        <CaseStudyModal
          project={selectedCaseStudyProject}
          onClose={() => setSelectedCaseStudyProject(null)}
        />

        {/* Preview modal triggered from Admin if needed */}
        {previewProject && (
          <CaseStudyModal
            project={previewProject}
            onClose={() => setPreviewProject(null)}
          />
        )}

        <ResumeModal
          isOpen={resumeModalOpen}
          selectedResumeId={selectedResumeId}
          onClose={() => {
            setResumeModalOpen(false);
            setSelectedResumeId(null);
          }}
        />
      </Suspense>
    </div>
  );
}
