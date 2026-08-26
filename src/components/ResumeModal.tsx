import React, { useState } from 'react';
import { X, FileText, Download, ShieldCheck, Cpu } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'cybersecurity' | 'general'>('cybersecurity');

  if (!isOpen) return null;

  const activeResume = portfolioData.resumes.find((r) => r.id === selectedTab) || portfolioData.resumes[0];

  const handleDownload = () => {
    if (!activeResume.pdfPath) return;
    const a = document.createElement('a');
    a.href = activeResume.pdfPath.replace('/public/', '/');
    a.target = '_blank';
    a.download = `${activeResume.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    if (activeResume.pdfPath) {
      window.open(activeResume.pdfPath.replace('/public/', '/'), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto py-10">
      <div 
        className="relative w-full max-w-3xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-6 md:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] p-2 rounded-lg transition-colors z-10 border border-[#263449]"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-6 border-b border-[#263449] pb-4">
          <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Ayush Dutta — Resume Viewer</h3>
            <span className="text-xs text-[#94A3B8] font-mono">Select profile version to preview</span>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex space-x-2 bg-[#151F2E] p-1 rounded-lg border border-[#263449] mb-6 max-w-sm">
          <button
            onClick={() => setSelectedTab('cybersecurity')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded text-xs font-semibold transition-colors ${
              selectedTab === 'cybersecurity'
                ? 'bg-[#2563EB] text-[#F8FAFC]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cybersecurity CV</span>
          </button>
          <button
            onClick={() => setSelectedTab('general')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded text-xs font-semibold transition-colors ${
              selectedTab === 'general'
                ? 'bg-[#2563EB] text-[#F8FAFC]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>General Tech CV</span>
          </button>
        </div>

        {/* Resume Preview Box */}
        <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-5 mb-6 max-h-[45vh] overflow-y-auto custom-scrollbar text-xs sm:text-sm space-y-4">
          <div className="border-b border-[#263449] pb-3">
            <h4 className="font-bold text-[#F8FAFC] text-base">{activeResume.title}</h4>
            <span className="text-xs text-[#2563EB] font-mono block mt-0.5">Target: {activeResume.targetRoles}</span>
            <p className="text-xs text-[#94A3B8] mt-1">{activeResume.description}</p>
          </div>

          <div className="space-y-3 text-[#94A3B8]">
            <div className="bg-[#0B1220] p-3.5 rounded border border-[#263449]">
              <span className="text-[#F8FAFC] font-semibold block mb-1 text-xs uppercase font-mono">Contact Info</span>
              <p>Ayush Dutta | Bardhaman, West Bengal, India</p>
              <p>Email: {portfolioData.personal.email} | Phone: {portfolioData.personal.phone}</p>
              <p>LinkedIn: {portfolioData.personal.linkedin}</p>
            </div>

            <div className="bg-[#0B1220] p-3.5 rounded border border-[#263449]">
              <span className="text-[#F8FAFC] font-semibold block mb-1 text-xs uppercase font-mono">Education</span>
              <p>• M.Sc. in IT Cybersecurity — MAKAUT (2024–2026) | CGPA: 8.04 / 10</p>
              <p>• Bachelor of Computer Applications (BCA) — NSHM Knowledge Campus (2020–2023) | SGPA: 8.95 / 10</p>
            </div>

            <div className="bg-[#0B1220] p-3.5 rounded border border-[#263449]">
              <span className="text-[#F8FAFC] font-semibold block mb-1 text-xs uppercase font-mono">Experience & Internship</span>
              <p>• Cybersecurity Intern — NIELIT Virtual Academy (July – August 2025)</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">Vulnerability analysis, TLS/SSL review, network defence, threat modelling, and security reporting aligned with OWASP & NIST.</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#263449]">
          <span className="text-[11px] text-[#94A3B8] font-mono">File: {activeResume.pdfPath}</span>
          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] text-xs font-medium transition-colors border border-[#263449]"
            >
              Close
            </button>
            <button
              onClick={handleOpenNewTab}
              className="inline-flex items-center space-x-1.5 bg-[#151F2E] hover:bg-[#263449] text-[#F8FAFC] font-medium px-3.5 py-2 rounded-lg transition-colors text-xs border border-[#263449]"
            >
              <span>Open in New Tab</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-medium px-4 py-2 rounded-lg transition-colors text-xs shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
