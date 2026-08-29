import React, { useState, useEffect } from 'react';
import { ExternalLink, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
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
    <section id="certifications" className="py-20 md:py-28 bg-[#0B1220] border-b border-[#263449] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          className="max-w-3xl mb-12"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
            }}
            className="flex items-center space-x-3 mb-3"
          >
            <span className="text-xs font-mono font-bold text-[#3B82F6] tracking-wider">
              04 // CERTIFICATIONS
            </span>
            <span className="h-px w-8 bg-[#263449]" />
            <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
              CREDENTIALS
            </span>
          </motion.div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-3"
          >
            Certifications &amp; Badges
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl"
          >
            Verified technical credentials in cybersecurity fundamentals, data science, and security intelligence.
          </motion.p>
        </motion.div>

        {publishedCerts.length === 0 ? (
          <div className="bg-[#111827] border border-[#263449] rounded-2xl p-12 text-center text-[#94A3B8] max-w-2xl mx-auto">
            <Award className="w-10 h-10 text-[#94A3B8] mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-[#F8FAFC] mb-1">Certifications will be added soon.</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Verified technical credentials and licenses will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedCerts.map((cert, idx) => (
              <motion.div
                key={cert.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.25) }}
                className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 rounded-2xl p-6 flex flex-col justify-between transition-colors shadow-sm relative group overflow-hidden"
              >
                {/* Top Accent Ribbon */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#10B981]/50 via-[#3B82F6]/30 to-transparent" />

                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#263449]/70">
                    <span className="text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded-full flex items-center space-x-1.5 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>VERIFIED RECORD</span>
                    </span>
                    {cert.date && (
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        {cert.date}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] mb-2 leading-snug group-hover:text-[#3B82F6] transition-colors break-words">
                    {cert.title}
                  </h3>

                  {cert.issuer && (
                    <div className="flex items-center space-x-1.5 text-[#3B82F6] text-xs font-mono font-medium mb-2">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="break-words">{cert.issuer}</span>
                    </div>
                  )}

                  {cert.duration && (
                    <span className="text-[#94A3B8] text-xs font-mono block mb-4">
                      Program Duration: {cert.duration}
                    </span>
                  )}
                </div>

                <div className="border-t border-[#263449]/80 pt-4 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectCertificate(cert)}
                    className="w-full flex items-center justify-center space-x-2 bg-[#151F2E] hover:bg-[#2563EB] text-[#F8FAFC] text-xs font-semibold py-2.5 rounded-xl transition-colors border border-[#263449] hover:border-[#2563EB] shadow-sm focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                  >
                    <span>Preview Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
