import React, { useState, useMemo } from 'react';
import { X, Award, FileText, Download, ExternalLink, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import { Certification } from '../services/portfolioStorage';

interface CertificateModalProps {
  certificate: Certification | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const [loadError, setLoadError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const rawFileUrl = certificate?.pdfPlaceholder?.trim() || '';

  // Normalize file URL (strip leading /public if present for relative public assets)
  const resolvedFileUrl = useMemo(() => {
    if (!rawFileUrl) return '';
    if (rawFileUrl.startsWith('/public/')) {
      return rawFileUrl.replace('/public/', '/');
    }
    return rawFileUrl;
  }, [rawFileUrl]);

  // Determine file type safely by inspecting path without query params
  const isImage = useMemo(() => {
    if (!resolvedFileUrl) return false;
    try {
      const pathname = new URL(resolvedFileUrl, window.location.origin).pathname.toLowerCase();
      return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(pathname);
    } catch {
      return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(resolvedFileUrl.toLowerCase());
    }
  }, [resolvedFileUrl]);

  const isPdf = useMemo(() => {
    if (!resolvedFileUrl) return true;
    return !isImage;
  }, [resolvedFileUrl, isImage]);

  const hasValidFile = Boolean(resolvedFileUrl && resolvedFileUrl !== '');

  if (!certificate) return null;

  const handleDownload = async () => {
    if (!resolvedFileUrl) return;

    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    const ext = isPdf ? 'pdf' : (isImage ? 'png' : 'pdf');
    const safeTitle = certificate.title.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const fileName = `${safeTitle || 'certificate'}.${ext}`;

    try {
      // Attempt real Blob fetch for direct file download
      const response = await fetch(resolvedFileUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP error status ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch {
      // Fallback: direct anchor download if CORS restrictions block blob fetch
      try {
        const link = document.createElement('a');
        link.href = resolvedFileUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } catch {
        setDownloadError('Unable to download automatically. Please use "Open in New Tab" to view or save the certificate.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenNewTab = () => {
    if (resolvedFileUrl) {
      window.open(resolvedFileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-5 sm:p-7 my-auto max-h-[96vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] hover:bg-[#263449] p-2 rounded-lg transition-colors z-20 border border-[#263449]"
          aria-label="Close certificate modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3 mb-4 shrink-0 pr-12">
          <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] rounded-lg shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded flex items-center space-x-1 border border-[#10B981]/20">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Credential</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC] mt-1 leading-snug">
              {certificate.title}
            </h3>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-3.5 sm:p-4 mb-4 shrink-0 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
          <div>
            <span className="text-[#94A3B8] block text-[10px] uppercase font-mono tracking-wider">Issuer</span>
            <span className="text-[#F8FAFC] font-semibold">{certificate.issuer}</span>
          </div>
          <div>
            <span className="text-[#94A3B8] block text-[10px] uppercase font-mono tracking-wider">Date Issued</span>
            <span className="text-[#F8FAFC] font-medium">{certificate.date}</span>
          </div>
          {certificate.duration && (
            <div>
              <span className="text-[#94A3B8] block text-[10px] uppercase font-mono tracking-wider">Duration</span>
              <span className="text-[#F8FAFC] font-medium">{certificate.duration}</span>
            </div>
          )}
          {certificate.credentialId && (
            <div>
              <span className="text-[#94A3B8] block text-[10px] uppercase font-mono tracking-wider">Credential ID</span>
              <span className="text-[#F8FAFC] font-mono font-medium">{certificate.credentialId}</span>
            </div>
          )}
        </div>

        {/* Download Status & Alerts */}
        {downloadError && (
          <div className="mb-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg flex items-start space-x-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{downloadError}</span>
          </div>
        )}

        {downloadSuccess && (
          <div className="mb-3 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs p-3 rounded-lg flex items-center space-x-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Certificate downloaded successfully.</span>
          </div>
        )}

        {/* Certificate Preview Section Header */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
              Certificate Preview
            </h4>
          </div>
          {hasValidFile && (
            <span className="text-[11px] text-[#94A3B8] font-mono bg-[#151F2E] px-2 py-0.5 rounded border border-[#263449]">
              {isPdf ? 'Native PDF Preview' : (isImage ? 'Image Proof' : 'Document Proof')}
            </span>
          )}
        </div>

        {/* Certificate Responsive Preview Container */}
        <div className="w-full flex-1 h-[450px] sm:h-[550px] md:h-[650px] lg:h-[700px] bg-[#0B1220] border border-[#263449] rounded-lg overflow-hidden flex flex-col items-center justify-center relative">
          {loadError ? (
            <div className="text-center p-6 space-y-3 max-w-md">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-sm text-[#F8FAFC] font-medium">In-browser preview is currently unavailable for this document URL.</p>
              <p className="text-xs text-[#94A3B8]">You can open the original file directly in a new tab or download a copy.</p>
              {hasValidFile && (
                <button
                  onClick={handleOpenNewTab}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in New Tab</span>
                </button>
              )}
            </div>
          ) : !hasValidFile ? (
            <div className="text-center p-6 space-y-3 max-w-md">
              <FileText className="w-12 h-12 text-[#94A3B8] mx-auto opacity-60" />
              <p className="text-sm text-[#F8FAFC] font-medium">No document file attached to this credential.</p>
              {certificate.verificationUrl && (
                <a
                  href={certificate.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#2563EB] hover:underline font-mono pt-1"
                >
                  <span>Verify at Issuer Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : isPdf ? (
            <iframe
              src={`${resolvedFileUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title={`${certificate.title} PDF Preview`}
              className="w-full h-full min-h-[420px] md:min-h-[640px] bg-[#151F2E] border-0"
              onError={() => setLoadError(true)}
            />
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center p-4 bg-[#0B1220] overflow-auto">
              <img
                src={resolvedFileUrl}
                alt={certificate.title}
                className="max-h-full max-w-full object-contain rounded border border-[#263449] shadow-lg"
                onError={() => setLoadError(true)}
              />
            </div>
          ) : (
            <iframe
              src={resolvedFileUrl}
              title={`${certificate.title} Document Preview`}
              className="w-full h-full min-h-[420px] md:min-h-[640px] bg-white border-0"
              onError={() => setLoadError(true)}
            />
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t border-[#263449] gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-[#94A3B8] text-xs w-full sm:w-auto justify-start">
            {certificate.verificationUrl && (
              <a
                href={certificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-[#2563EB] hover:underline font-mono text-xs"
              >
                <span>Official Verification Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-medium transition-colors border border-[#263449]"
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
                  <span>Open in New Tab</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center space-x-1.5 bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-60 text-[#F8FAFC] text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
