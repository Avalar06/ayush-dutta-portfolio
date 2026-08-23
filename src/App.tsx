import React, { useState, useEffect } from 'react';
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

import { CertificateModal } from './components/CertificateModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ResumeModal } from './components/ResumeModal';
import { Certification, Project, fetchPortfolioDataFromSupabase, verifyAdminUser } from './services/portfolioStorage';
import { supabase } from './lib/supabase';

import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [selectedCaseStudyProject, setSelectedCaseStudyProject] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

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
      const isAdmin = path === '/admin' || path.startsWith('/admin') || hash === '#admin';
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
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
        <AdminLogin 
          onLoginSuccess={async () => {
            const authorized = await verifyAdminUser();
            setIsAdminAuth(authorized);
          }} 
        />
      );
    }
    return (
      <AdminLayout 
        onLogout={async () => {
          await supabase.auth.signOut();
          setIsAdminAuth(false);
          window.location.hash = '';
          window.location.pathname = '/';
        }}
        onPreviewProjectModal={(proj) => setPreviewProject(proj)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Sticky Navigation */}
      <Navbar onOpenResumeModal={() => setResumeModalOpen(true)} />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenResumeModal={() => setResumeModalOpen(true)} />
        <About />
        <Skills />
        <Projects onOpenCaseStudy={(proj) => setSelectedCaseStudyProject(proj)} />
        <SecurityPractice />
        <Experience />
        <Certifications onSelectCertificate={(cert) => setSelectedCertificate(cert)} />
        <Education />
        <ResumeSection onOpenResumeModal={() => setResumeModalOpen(true)} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
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
        onClose={() => setResumeModalOpen(false)}
      />
    </div>
  );
}
