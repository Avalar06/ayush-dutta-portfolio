import React from 'react';
import { X, Award, FileText, Download } from 'lucide-react';
import { Certification } from '../data/portfolioData';

interface CertificateModalProps {
  certificate: Certification | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const handleDownload = () => {
    alert(`Downloading certificate: ${certificate.title}. (PDF reference: ${certificate.pdfPlaceholder})`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] p-2 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
              Verified Credential
            </span>
            <h3 className="text-lg font-bold text-[#F8FAFC] mt-1">{certificate.title}</h3>
          </div>
        </div>

        <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-5 mb-6 space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[#94A3B8] block text-[11px] uppercase font-mono">Issuer</span>
              <span className="text-[#F8FAFC] font-medium">{certificate.issuer}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[11px] uppercase font-mono">Date Issued</span>
              <span className="text-[#F8FAFC] font-medium">{certificate.date}</span>
            </div>
          </div>
          {certificate.duration && (
            <div>
              <span className="text-[#94A3B8] block text-[11px] uppercase font-mono">Duration</span>
              <span className="text-[#F8FAFC] font-medium">{certificate.duration}</span>
            </div>
          )}
          <div>
            <span className="text-[#94A3B8] block text-[11px] uppercase font-mono">Source File</span>
            <span className="text-[#94A3B8] font-mono">{certificate.pdfPlaceholder}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#263449]">
          <div className="flex items-center space-x-2 text-[#94A3B8] text-xs">
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <span>Official Record</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] text-xs font-medium transition-colors border border-[#263449]"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
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
