import React, { useState } from 'react';
import { X, Award, FileText, Download, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Certification } from '../data/portfolioData';

interface CertificateModalProps {
  certificate: Certification | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const [loadError, setLoadError] = useState(false);

  if (!certificate) return null;

  const fileUrl = certificate.pdfPlaceholder;
  const isPdf = fileUrl && (fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.includes('application/pdf'));
  const isImage = fileUrl && /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(fileUrl);
  const hasValidFile = fileUrl && fileUrl !== '/public/resumes/Certificate.pdf' && !fileUrl.includes('placeholder');

  const handleDownload = () => {
    if (!fileUrl) return;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.download = `${certificate.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${isPdf ? 'pdf' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] p-2 rounded-lg transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-6 shrink-0">
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

        {/* Metadata Details */}
        <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-4 mb-4 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#94A3B8] block text-[10px] uppercase font-mono">Issuer</span>
            <span className="text-[#F8FAFC] font-medium">{certificate.issuer}</span>
          </div>
          <div>
            <span className="text-[#94A3B8] block text-[10px] uppercase font-mono">Date Issued</span>
            <span className="text-[#F8FAFC] font-medium">{certificate.date}</span>
          </div>
          {certificate.duration && (
            <div>
              <span className="text-[#94A3B8] block text-[10px] uppercase font-mono">Duration</span>
              <span className="text-[#F8FAFC] font-medium">{certificate.duration}</span>
            </div>
          )}
          {certificate.credentialId && (
            <div>
              <span className="text-[#94A3B8] block text-[10px] uppercase font-mono">Credential ID</span>
              <span className="text-[#F8FAFC] font-mono">{certificate.credentialId}</span>
            </div>
          )}
        </div>

        {/* Certificate File Preview Area */}
        <div className="flex-1 bg-[#0B1220] border border-[#263449] rounded-lg overflow-hidden flex flex-col items-center justify-center min-h-[300px] relative">
          {loadError ? (
            <div className="text-center p-6 space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-[#F8FAFC] font-medium">Unable to preview file directly in browser.</p>
              <p className="text-[11px] text-[#94A3B8]">You can open or download the document using the buttons below.</p>
            </div>
          ) : !hasValidFile ? (
            <div className="text-center p-6 space-y-2">
              <FileText className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <p className="text-xs text-[#F8FAFC] font-medium">No uploaded certificate file associated.</p>
              {certificate.verificationUrl && (
                <a
                  href={certificate.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#2563EB] hover:underline pt-2 font-mono"
                >
                  <span>Visit verification URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : isPdf ? (
            <iframe
              src={`${fileUrl}#toolbar=0`}
              title={certificate.title}
              className="w-full h-[400px] bg-white"
              onError={() => setLoadError(true)}
            />
          ) : isImage ? (
            <div className="w-full h-[400px] flex items-center justify-center p-2">
              <img
                src={fileUrl}
                alt={certificate.title}
                className="max-h-full max-w-full object-contain rounded"
                onError={() => setLoadError(true)}
              />
            </div>
          ) : (
            <div className="text-center p-6 space-y-2">
              <FileText className="w-8 h-8 text-[#2563EB] mx-auto" />
              <p className="text-xs text-[#F8FAFC]">Certificate document available.</p>
              <button
                onClick={handleOpenNewTab}
                className="text-xs text-[#2563EB] hover:underline font-mono"
              >
                Open Document in New Tab →
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#263449] shrink-0">
          <div className="flex items-center space-x-2 text-[#94A3B8] text-xs">
            {certificate.verificationUrl && (
              <a
                href={certificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-[#2563EB] hover:underline font-mono text-xs"
              >
                <span>Verify Issuer Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] text-xs font-medium transition-colors border border-[#263449]"
            >
              Close
            </button>
            {hasValidFile && (
              <>
                <button
                  onClick={handleOpenNewTab}
                  className="inline-flex items-center space-x-1.5 bg-[#151F2E] hover:bg-[#263449] text-[#F8FAFC] text-xs font-medium px-3.5 py-2 rounded-lg transition-colors border border-[#263449]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center space-x-1.5 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
