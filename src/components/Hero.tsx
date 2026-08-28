import React, { useState, useEffect } from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail, Shield, Terminal, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getPortfolioData, getActivePublishedResume } from '../services/portfolioStorage';

interface HeroProps {
  onOpenResumeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResumeModal }) => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => {
      setData({ ...getPortfolioData() });
    };

    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const activeResume = getActivePublishedResume();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-[#0B1220] border-b border-[#263449] overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
        >
          {/* Main Hero Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Availability / Category Tag */}
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2.5 text-[#3B82F6] bg-[#111827] border border-[#263449] px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span className="text-[11px] uppercase tracking-wider font-mono font-medium text-[#F8FAFC]">
                AVAILABLE FOR SOC &amp; SECURITY ROLES
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#F8FAFC] tracking-tight mb-3 leading-tight">
              {data.personal.name}
            </motion.h1>

            {/* Role & Core Discipline */}
            <motion.div variants={itemVariants} className="flex items-center space-x-2 text-lg sm:text-xl font-medium text-[#3B82F6] font-mono mb-4">
              <span>Cybersecurity &amp; Technology</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#94A3B8] text-base font-normal">Security Operations</span>
            </motion.div>

            {/* Primary Statement */}
            <motion.p variants={itemVariants} className="text-base sm:text-lg text-[#CBD5E1] font-normal mb-6 leading-relaxed max-w-2xl">
              M.Sc. IT Cybersecurity graduate specializing in SIEM log analysis, threat &amp; vulnerability triage, Python automation, and applied machine learning models for intrusion anomaly detection.
            </motion.p>

            {/* Clear 3-Tier CTA Hierarchy */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 mb-8">
              {/* Primary Action */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#projects"
                className="inline-flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-semibold px-5 sm:px-6 py-3 rounded-xl transition-colors text-xs sm:text-sm shadow-md shadow-[#2563EB]/25 focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <span>Explore Technical Projects</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              {/* Secondary Action */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenResumeModal}
                title={activeResume ? `View & Download ${activeResume.title}` : 'Download Resume'}
                className="inline-flex items-center justify-center space-x-2 bg-[#111827] hover:bg-[#151F2E] border border-[#263449] hover:border-[#3B82F6]/50 text-[#F8FAFC] font-medium px-5 sm:px-6 py-3 rounded-xl transition-colors text-xs sm:text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <Download className="w-4 h-4 text-[#3B82F6]" />
                <span>Download Resume</span>
              </motion.button>

              {/* Tertiary Subtle Link */}
              <motion.a
                whileHover={{ x: 2 }}
                href="#contact"
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-[#94A3B8] hover:text-[#F8FAFC] font-medium px-3 py-2 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
              </motion.a>
            </motion.div>

            {/* Direct Contact & Social Signals */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 pt-5 border-t border-[#263449]/70">
              <a
                href={`mailto:${data.personal.email}`}
                className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/40 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <Mail className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>{data.personal.email}</span>
              </a>
              <a
                href={data.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/40 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>LinkedIn</span>
              </a>
              <a
                href={data.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/40 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              >
                <Github className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>GitHub</span>
              </a>
            </motion.div>
          </div>

          {/* SOC Operational Summary / Security Operations Panel */}
          <motion.div variants={itemVariants} className="lg:col-span-5 xl:col-span-4">
            <div className="bg-[#111827] border border-[#263449] rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
              {/* Header with single restrained operational indicator */}
              <div className="flex items-center justify-between border-b border-[#263449] pb-3.5 mb-4">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-mono font-bold text-[#F8FAFC] uppercase tracking-wider">
                    SECURITY OPERATIONS PROFILE
                  </span>
                </div>
                <span className="flex items-center space-x-1.5 text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>VERIFIED</span>
                </span>
              </div>

              {/* Core Competencies & Real Profile Summary */}
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-[#151F2E] p-3 rounded-xl border border-[#263449]/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#F8FAFC] font-semibold flex items-center space-x-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>SOC Tier-1 &amp; Event Triage</span>
                    </span>
                    <span className="text-[10px] text-[#3B82F6] font-semibold">CORE</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] font-sans leading-relaxed">
                    SIEM alert analysis, log normalization, PCAP inspection &amp; escalation procedures.
                  </p>
                </div>

                <div className="bg-[#151F2E] p-3 rounded-xl border border-[#263449]/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#F8FAFC] font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Threat &amp; Vulnerability Assessment</span>
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">ASSESSMENT</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] font-sans leading-relaxed">
                    Nmap, Wireshark, Metasploit, Burp Suite, CVE remediation guidance.
                  </p>
                </div>

                <div className="bg-[#151F2E] p-3 rounded-xl border border-[#263449]/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#F8FAFC] font-semibold flex items-center space-x-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Threat Detection &amp; Applied ML</span>
                    </span>
                    <span className="text-[10px] text-[#10B981]">98.6% ACC</span>
                  </div>
                  <p className="text-[#94A3B8] text-[11px] font-sans leading-relaxed">
                    Python automation, NSL-KDD intrusion detection, Random Forest classifier.
                  </p>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-[#263449] flex items-center justify-between text-[11px]">
                <span className="text-[#94A3B8] font-mono">Location &amp; Status:</span>
                <span className="text-[#F8FAFC] font-medium font-mono">India / Open to Relocation</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Professional Status Bar / Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#263449]"
        >
          <div className="bg-[#111827] hover:border-[#3B82F6]/50 border border-[#263449] rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-mono block mb-1">M.Sc. IT Cybersecurity</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">CGPA: 8.04 / 10</span>
            <span className="text-xs text-[#10B981] font-mono">MAKAUT (2024–2026)</span>
          </div>

          <div className="bg-[#111827] hover:border-[#3B82F6]/50 border border-[#263449] rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-mono block mb-1">Bachelor of Computer Apps</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">SGPA: 8.95 / 10</span>
            <span className="text-xs text-[#10B981] font-mono">NSHM Campus (2020–2023)</span>
          </div>

          <div className="bg-[#111827] hover:border-[#3B82F6]/50 border border-[#263449] rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-mono block mb-1">Cybersecurity Internship</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">NIELIT Virtual Academy</span>
            <span className="text-xs text-[#10B981] font-mono">July – Aug 2025</span>
          </div>

          <div className="bg-[#111827] hover:border-[#3B82F6]/50 border border-[#263449] rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-mono block mb-1">Target Roles</span>
            <span className="text-lg font-bold text-[#F8FAFC] block mb-0.5">SOC Analyst / IT Sec</span>
            <span className="text-xs text-[#3B82F6] font-mono">GRC &amp; Security Engineering</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
