import React, { useState, useEffect } from 'react';
import { CheckCircle2, Briefcase, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { getPortfolioData } from '../services/portfolioStorage';

export const Experience: React.FC = () => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const experiences = data.experience;

  return (
    <section id="experience" className="py-20 md:py-28 bg-[#111827] border-b border-[#263449] relative">
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
          className="max-w-3xl mb-12 pb-6 border-b border-[#263449]/70"
        >
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
            }}
            className="flex items-center space-x-3 mb-3"
          >
            <span className="text-xs font-mono font-bold text-[#3B82F6] tracking-wider">
              02 // CAREER TIMELINE
            </span>
            <span className="h-px w-8 bg-[#263449]" />
            <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
              OPERATIONAL TRACK RECORD
            </span>
          </motion.div>

          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-3"
          >
            Internship &amp; Training Experience
          </motion.h2>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl"
          >
            Structured cybersecurity training, laboratory simulation, and practical operational exposure.
          </motion.p>
        </motion.div>

        <div className="max-w-4xl relative">
          {/* Vertical timeline line */}
          <div className="hidden sm:block absolute left-[29px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#2563EB] via-[#263449] to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id || idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative sm:pl-16"
              >
                {/* Timeline node icon */}
                <div className="hidden sm:flex absolute left-4 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-[#111827] border-2 border-[#2563EB] items-center justify-center text-[#3B82F6] shadow-md z-10">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>

                <div className="bg-[#151F2E] border border-[#263449] hover:border-[#3B82F6]/50 rounded-2xl p-6 sm:p-8 transition-colors shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#263449] pb-5">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-0.5 rounded inline-block">
                          {exp.type}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">{exp.role}</h3>
                      <span className="text-[#94A3B8] font-medium text-sm block mt-1 flex items-center space-x-1.5">
                        <span>{exp.organization}</span>
                        {exp.location && <span>• {exp.location}</span>}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs font-mono text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-3 py-1.5 rounded-lg w-fit shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                    Key Responsibilities & Focus Areas
                  </h4>

                  <div className="space-y-3 mb-6">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-start space-x-3 text-sm text-[#E2E8F0]">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                        <span className="leading-relaxed font-light">{resp}</span>
                      </div>
                    ))}
                  </div>

                  {exp.frameworks && exp.frameworks.length > 0 && (
                    <div className="border-t border-[#263449] pt-4">
                      <h5 className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                        Frameworks & Methodologies Applied
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.frameworks.map((fw, fIdx) => (
                          <span
                            key={fIdx}
                            className="bg-[#111827] text-[#F8FAFC] text-xs font-mono px-2.5 py-1 rounded-md border border-[#263449]"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
