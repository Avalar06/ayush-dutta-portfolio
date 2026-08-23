import React from 'react';
import { ShieldCheck, GraduationCap, BadgeCheck, Target, ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface HeroProps {
  onOpenResumeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResumeModal }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-44 md:pb-28 bg-[#0B1220] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Subtitle / Category Tag */}
          <div className="inline-flex items-center space-x-2 text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25 px-3 py-1 rounded-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-xs uppercase tracking-wider font-mono font-medium">
              CYBERSECURITY • SECURITY MONITORING • APPLIED ML
            </span>
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#F8FAFC] tracking-tight mb-4">
            {portfolioData.personal.name}
          </h1>

          {/* Primary Statement */}
          <p className="text-xl sm:text-2xl text-[#94A3B8] font-normal mb-6 leading-relaxed max-w-3xl">
            Cybersecurity-focused technology professional building practical security monitoring, anomaly detection, and data-driven security solutions.
          </p>

          <p className="text-sm sm:text-base text-[#94A3B8] font-light max-w-2xl mb-10 leading-relaxed">
            M.Sc. IT Cybersecurity graduate with hands-on experience in log analysis, vulnerability assessment, Python security automation, and applied machine learning models.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14">
            <a
              href="#projects"
              className="inline-flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-medium px-7 py-3 rounded-lg transition-colors text-sm shadow-sm"
            >
              <span>View My Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenResumeModal}
              className="inline-flex items-center justify-center space-x-2 bg-[#111827] hover:bg-[#151F2E] border border-[#263449] text-[#F8FAFC] font-medium px-7 py-3 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4 text-[#2563EB]" />
              <span>Download Resume</span>
            </button>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#263449]">
            <a
              href={`mailto:${portfolioData.personal.email}`}
              className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] border border-[#263449] px-3.5 py-2 rounded-lg text-xs font-mono transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{portfolioData.personal.email}</span>
            </a>
            <a
              href={portfolioData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] border border-[#263449] px-3.5 py-2 rounded-lg text-xs font-mono transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>LinkedIn</span>
            </a>
            <a
              href={portfolioData.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] border border-[#263449] px-3.5 py-2 rounded-lg text-xs font-mono transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Professional Status Bar / Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[#263449]">
          <div className="bg-[#111827] border border-[#263449] rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">M.Sc. IT Cybersecurity</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">CGPA: 8.04 / 10</span>
            <span className="text-xs text-[#10B981] font-mono">MAKAUT (2024–2026)</span>
          </div>

          <div className="bg-[#111827] border border-[#263449] rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">Bachelor of Computer Apps</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">SGPA: 8.95 / 10</span>
            <span className="text-xs text-[#10B981] font-mono">NSHM Campus (2020–2023)</span>
          </div>

          <div className="bg-[#111827] border border-[#263449] rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">Cybersecurity Internship</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">NIELIT Virtual Academy</span>
            <span className="text-xs text-[#10B981] font-mono">July – Aug 2025</span>
          </div>

          <div className="bg-[#111827] border border-[#263449] rounded-xl p-5">
            <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">Current Focus</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">Entry-Level Roles</span>
            <span className="text-xs text-[#2563EB] font-mono">SOC & Security Analysis</span>
          </div>
        </div>
      </div>
    </section>
  );
};
