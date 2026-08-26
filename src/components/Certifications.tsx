import React, { useState, useEffect } from 'react';
import { ExternalLink, Award } from 'lucide-react';
import { Certification, getPortfolioData } from '../services/portfolioStorage';

interface CertificationsProps {
  onSelectCertificate: (cert: Certification) => void;
}

export const Certifications: React.FC<CertificationsProps> = ({ onSelectCertificate }) => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => {
      setData({ ...getPortfolioData() });
    };

    window.addEventListener('portfolio_updated', handleUpdate);
    return () => {
      window.removeEventListener('portfolio_updated', handleUpdate);
    };
  }, []);

  const publishedCerts = data.certifications.filter((c) => c.published !== false);

  return (
    <section id="certifications" className="py-20 bg-[#0B1220] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
            CREDENTIALS & BADGES
          </span>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Certifications
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Verified professional credentials in cybersecurity, data science, and technical innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedCerts.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#111827] border border-[#263449] rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded flex items-center space-x-1">
                    <Award className="w-3 h-3 inline mr-1" /> VERIFIED
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">{cert.date}</span>
                </div>

                <h3 className="text-base font-bold text-[#F8FAFC] mb-2 leading-snug">
                  {cert.title}
                </h3>
                <span className="text-[#2563EB] text-xs font-mono block mb-4">
                  {cert.issuer}
                </span>
                {cert.duration && (
                  <span className="text-[#94A3B8] text-xs block mb-4">Duration: {cert.duration}</span>
                )}
              </div>

              <div className="border-t border-[#263449] pt-4">
                <button
                  onClick={() => onSelectCertificate(cert)}
                  className="w-full flex items-center justify-center space-x-2 bg-[#151F2E] hover:bg-[#2563EB] text-[#F8FAFC] text-xs font-medium py-2 rounded-lg transition-colors border border-[#263449]"
                >
                  <span>View Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
