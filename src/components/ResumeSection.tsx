import React, { useState, useEffect } from 'react';
import { Download, Eye, FileText, CheckCircle2, Loader2, Sparkles, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeItem, getPublishedResumes } from '../services/portfolioStorage';

interface ResumeSectionProps {
  onOpenResumeModal: (resumeId?: string) => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onOpenResumeModal }) => {
  const [, setTick] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setTick(t => t + 1);
    };

    window.addEventListener('portfolio_updated', handleUpdate);
    return () => {
      window.removeEventListener('portfolio_updated', handleUpdate);
    };
  }, []);

  const publishedResumes = getPublishedResumes();

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
    setDownloadingId(resume.id);
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
      setDownloadingId(null);
    }
  };

  return (
    <section id="resume" className="py-20 md:py-28 bg-[#0B1220] border-b border-[#263449] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl mb-12"
        >
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-3 py-1 rounded-md">
            CURRICULUM VITAE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Professional Resumes
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Access and download verified technical resumes and specialized profiles for cybersecurity and engineering roles.
          </p>
        </motion.div>

        {publishedResumes.length === 0 ? (
          <div className="bg-[#111827] border border-[#263449] rounded-2xl p-8 sm:p-12 text-center max-w-2xl">
            <div className="w-12 h-12 bg-[#151F2E] border border-[#263449] rounded-full flex items-center justify-center mx-auto mb-4 text-[#94A3B8]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">Resume Currently Updating</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
              The curriculum vitae document is currently undergoing revision. Please connect via email or LinkedIn for immediate inquiries.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <span>Get in Touch</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {publishedResumes.map((resume, idx) => {
              const isDownloading = downloadingId === resume.id;
              return (
                <motion.div
                  key={resume.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/60 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 gap-2">
                      <span className="text-xs font-mono font-semibold text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-2.5 py-1 rounded-md inline-block truncate">
                        TARGET: {resume.targetRoles}
                      </span>
                      <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-0.5 rounded-md flex items-center shrink-0 font-medium">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" /> PUBLISHED
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-2.5">{resume.title}</h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-6 font-light">
                      {resume.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-5 border-t border-[#263449]">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onOpenResumeModal(resume.id)}
                      className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#151F2E] hover:bg-[#263449] text-[#F8FAFC] text-xs font-semibold py-2.5 rounded-xl transition-colors border border-[#263449]"
                    >
                      <Eye className="w-4 h-4 text-[#3B82F6]" />
                      <span>Preview Resume</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDownload(resume)}
                      disabled={isDownloading}
                      className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] disabled:opacity-50 text-[#F8FAFC] text-xs font-semibold py-2.5 rounded-xl transition-colors shadow-sm shadow-[#2563EB]/25"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
