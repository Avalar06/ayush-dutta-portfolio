import React, { useState, useEffect } from 'react';
import { X, FileText, Download, ExternalLink, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { ResumeItem, getPortfolioData, getPublishedResumes } from '../services/portfolioStorage';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResumeId?: string | null;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, selectedResumeId }) => {
  const [, setTick] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Subscribe to updates from Supabase/admin
  useEffect(() => {
    const handleUpdate = () => setTick(t => t + 1);
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const publishedResumes = getPublishedResumes();

  // Set active resume when modal opens or selectedResumeId changes
  useEffect(() => {
    if (isOpen) {
      setIsFrameLoading(true);
      setIframeError(false);
      if (selectedResumeId && publishedResumes.some(r => r.id === selectedResumeId)) {
        setActiveId(selectedResumeId);
      } else if (publishedResumes.length > 0) {
        setActiveId(publishedResumes[0].id);
      } else {
        setActiveId(null);
      }
    }
  }, [isOpen, selectedResumeId, publishedResumes.length]);

  if (!isOpen) return null;

  const activeResume: ResumeItem | undefined = publishedResumes.find(r => r.id === activeId) || publishedResumes[0];

  const getResolvedUrl = (path?: string): string => {
    if (!path) return '';
    const trimmed = path.trim();
    if (trimmed.startsWith('/public/')) {
      return trimmed.replace('/public/', '/');
    }
    return trimmed;
  };

  const handleDownload = async (resume: ResumeItem) => {
    if (!resume.pdfPath) return;
    setIsDownloading(true);
    try {
      const rawUrl = getResolvedUrl(resume.pdfPath);
      const safeTitle = (resume.title || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const fileName = `${safeTitle}.pdf`;

      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error(`Download HTTP error: ${response.status}`);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        const link = document.createElement('a');
        link.href = rawUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.warn('Blob download fallback triggered:', err);
      const link = document.createElement('a');
      link.href = getResolvedUrl(resume.pdfPath);
      link.target = '_blank';
      link.download = `${(resume.title || 'resume').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenNewTab = (resume: ResumeItem) => {
    if (!resume.pdfPath) return;
    const url = getResolvedUrl(resume.pdfPath);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-5 sm:p-6 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#263449] pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                {activeResume ? activeResume.title : 'Curriculum Vitae Viewer'}
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono">
                {activeResume ? `Target: ${activeResume.targetRoles}` : 'Published Resume Document'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] hover:bg-[#263449] p-2 rounded-lg transition-colors border border-[#263449]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection if multiple published versions exist */}
        {publishedResumes.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4 bg-[#151F2E] p-1.5 rounded-lg border border-[#263449]">
            {publishedResumes.map((resume) => {
              const isSelected = (activeResume?.id === resume.id);
              return (
                <button
                  key={resume.id}
                  onClick={() => {
                    setActiveId(resume.id);
                    setIsFrameLoading(true);
                    setIframeError(false);
                  }}
                  className={`flex items-center space-x-2 py-1.5 px-3 rounded text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-[#2563EB] text-[#F8FAFC] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#263449]/50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{resume.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Area */}
        {!activeResume ? (
          <div className="p-10 text-center bg-[#151F2E] border border-[#263449] rounded-xl my-4">
            <AlertCircle className="w-10 h-10 text-[#94A3B8] mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-bold text-[#F8FAFC] mb-1">Resume Currently Unavailable</h4>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
              The resume document is currently being updated by the administrator. Please check back shortly or contact directly.
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            {/* Description note */}
            {activeResume.description && (
              <p className="text-xs text-[#94A3B8] leading-relaxed bg-[#151F2E] px-3.5 py-2 rounded-lg border border-[#263449]/70">
                {activeResume.description}
              </p>
            )}

            {/* In-Browser PDF Preview Iframe */}
            <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[460px] md:min-h-[520px] bg-[#0B1220] rounded-lg border border-[#263449] overflow-hidden">
              {isFrameLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1220] z-10 text-[#94A3B8]">
                  <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
                  <span className="text-xs font-mono">Loading PDF preview...</span>
                </div>
              )}

              {activeResume.pdfPath ? (
                <iframe
                  src={`${getResolvedUrl(activeResume.pdfPath)}#toolbar=1&navpanes=0&scrollbar=1`}
                  title={`${activeResume.title} Preview`}
                  className="w-full h-full border-0"
                  onLoad={() => setIsFrameLoading(false)}
                  onError={() => {
                    setIsFrameLoading(false);
                    setIframeError(true);
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#94A3B8] p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-[#EF4444] mb-2" />
                  <p className="text-xs font-medium text-[#F8FAFC]">No document path specified for this resume.</p>
                </div>
              )}

              {iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1220] z-10 text-[#94A3B8] p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-[#EF4444] mb-2" />
                  <p className="text-xs font-medium text-[#F8FAFC] mb-2">Direct iframe preview could not be displayed.</p>
                  <button
                    onClick={() => handleOpenNewTab(activeResume)}
                    className="inline-flex items-center space-x-1 text-xs text-[#2563EB] hover:underline"
                  >
                    <span>Open in new tab instead</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-[#263449]">
          <div className="text-[11px] text-[#94A3B8] font-mono truncate max-w-[280px]">
            {activeResume?.pdfPath ? (
              <span className="truncate">Source: {activeResume.pdfPath.split('/').pop()}</span>
            ) : (
              <span>Status: Live Dynamic Resume</span>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] text-xs font-medium transition-colors border border-[#263449]"
            >
              Close
            </button>

            {activeResume && (
              <>
                <button
                  onClick={() => handleOpenNewTab(activeResume)}
                  className="inline-flex items-center space-x-1.5 bg-[#151F2E] hover:bg-[#263449] text-[#F8FAFC] font-medium px-3.5 py-2 rounded-lg transition-colors text-xs border border-[#263449]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Open in New Tab</span>
                  <span className="xs:hidden">Open</span>
                </button>

                <button
                  onClick={() => handleDownload(activeResume)}
                  disabled={isDownloading}
                  className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-50 text-[#F8FAFC] font-semibold px-4 py-2 rounded-lg transition-colors text-xs shadow-sm"
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
