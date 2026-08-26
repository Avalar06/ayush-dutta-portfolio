import React from 'react';
import { Download, Eye } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

interface ResumeSectionProps {
  onOpenResumeModal: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onOpenResumeModal }) => {
  const handleDownload = (resumeTitle: string, path: string) => {
    if (!path) return;
    const a = document.createElement('a');
    a.href = path.replace('/public/', '/');
    a.target = '_blank';
    a.download = `${resumeTitle.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section className="py-20 bg-[#0B1220] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
            CURRICULUM VITAE
          </span>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Professional Resumes
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Select the specialized profile suited for security or technology roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {portfolioData.resumes.map((resume) => {
            const isCyber = resume.id === 'cybersecurity';
            return (
              <div
                key={resume.id}
                className="bg-[#111827] border border-[#263449] rounded-xl p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded inline-block mb-3">
                    TARGET: {resume.targetRoles}
                  </span>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{resume.title}</h3>
                  <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-6 font-light">
                    {resume.description}
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-[#263449]">
                  <button
                    onClick={onOpenResumeModal}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#151F2E] hover:bg-[#263449] text-[#F8FAFC] text-xs font-medium py-2.5 rounded-lg transition-colors border border-[#263449]"
                  >
                    <Eye className="w-4 h-4 text-[#2563EB]" />
                    <span>View Resume</span>
                  </button>

                  <button
                    onClick={() => handleDownload(resume.title, resume.pdfPath)}
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-medium py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
