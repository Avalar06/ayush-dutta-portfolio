import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Download } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface NavbarProps {
  onOpenResumeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResumeModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'education', 'contact'];
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

  const navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Certifications', href: '#certifications', id: 'certifications' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#0B1220]/95 backdrop-blur-md border-b border-[#263449] py-3 shadow-md'
          : 'bg-[#0B1220]/80 backdrop-blur-sm py-4 border-b border-[#263449]/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#home"
            className="flex items-center space-x-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-[#3B82F6] transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#F8FAFC] tracking-tight text-sm md:text-base block group-hover:text-[#3B82F6] transition-colors">
                {portfolioData.personal.name}
              </span>
              <span className="text-[10px] text-[#94A3B8] font-mono tracking-wider block">
                CYBERSECURITY & TECH
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1 bg-[#111827] border border-[#263449] px-2 py-1 rounded-lg">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2563EB] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151F2E]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Download Resume Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenResumeModal}
              className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center xl:hidden space-x-3">
            <button
              onClick={onOpenResumeModal}
              className="md:hidden inline-flex items-center space-x-1 bg-[#2563EB] text-[#F8FAFC] text-xs font-semibold px-3 py-2 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] p-2 rounded-lg bg-[#111827] border border-[#263449] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-[#111827] border-b border-[#263449] shadow-xl py-4 px-6 animate-fadeIn">
          <nav className="flex flex-col space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2563EB] text-[#F8FAFC]'
                      : 'text-[#94A3B8] hover:bg-[#151F2E] hover:text-[#F8FAFC]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-3 border-t border-[#263449]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResumeModal();
                }}
                className="w-full flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume / CV</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
