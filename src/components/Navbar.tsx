import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getPortfolioData, getActivePublishedResume } from '../services/portfolioStorage';

interface NavbarProps {
  onOpenResumeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResumeModal }) => {
  const [data, setData] = useState(() => getPortfolioData());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleUpdate = () => {
      setData({ ...getPortfolioData() });
    };

    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'education', 'resume', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeResume = getActivePublishedResume();

  const navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Certifications', href: '#certifications', id: 'certifications' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Resume', href: '#resume', id: 'resume' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1220]/90 backdrop-blur-md border-b border-[#263449] py-2.5 shadow-lg shadow-black/20'
          : 'bg-[#0B1220]/75 backdrop-blur-sm py-4 border-b border-[#263449]/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#home"
            className="flex items-center space-x-3 group rounded-lg focus-visible:outline-2 focus-visible:outline-[#3B82F6] focus-visible:outline-offset-4"
          >
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/40 flex items-center justify-center text-[#3B82F6] font-bold text-sm shadow-inner group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#F8FAFC] tracking-tight text-sm sm:text-base block group-hover:text-[#3B82F6] transition-colors">
                  {data.personal.name}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse" title="Available for roles" />
              </div>
              <span className="text-[10px] text-[#94A3B8] font-mono tracking-wider block font-medium">
                CYBERSECURITY & TECH
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1 bg-[#111827]/90 border border-[#263449] p-1 rounded-xl shadow-inner backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6] ${
                    isActive
                      ? 'text-[#F8FAFC] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#2563EB] rounded-lg -z-10 shadow-sm shadow-[#2563EB]/30"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Download Resume Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenResumeModal}
              title={activeResume ? `View & Download ${activeResume.title}` : 'Download Resume'}
              className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-[#2563EB]/25"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </motion.button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center xl:hidden space-x-2.5">
            <button
              onClick={onOpenResumeModal}
              className="md:hidden inline-flex items-center space-x-1 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] p-2 rounded-xl bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="xl:hidden bg-[#111827]/98 border-b border-[#263449] shadow-2xl py-4 px-6 overflow-hidden backdrop-blur-xl"
          >
            <nav className="flex flex-col space-y-1">
              {navItems.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.a
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-[#F8FAFC]'
                        : 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
              <div className="pt-3 border-t border-[#263449]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResumeModal();
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume / CV</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
