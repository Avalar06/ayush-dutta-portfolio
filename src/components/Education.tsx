import React, { useState, useEffect } from 'react';
import { CheckCircle2, GraduationCap, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { getPortfolioData } from '../services/portfolioStorage';

export const Education: React.FC = () => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  return (
    <section id="education" className="py-20 md:py-28 bg-[#111827] border-b border-[#263449] relative">
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
              05 // ACADEMIC FOUNDATION
            </span>
            <span className="h-px w-8 bg-[#263449]" />
            <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
              DEGREES &amp; COURSEWORK
            </span>
          </motion.div>

          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-3"
          >
            Education &amp; Academic Honors
          </motion.h2>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl"
          >
            Rigorous academic foundations in cybersecurity, systems architecture, and computer applications.
          </motion.p>
        </motion.div>

        {/* Academic Timeline Spine */}
        <div className="max-w-4xl relative pl-6 sm:pl-8 border-l-2 border-[#263449] ml-2 sm:ml-4 space-y-10">
          {data.education.map((edu, idx) => (
            <motion.div
              key={edu.id || idx}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="relative"
            >
              {/* Timeline Marker Node */}
              <div className="absolute -left-[33px] sm:-left-[41px] top-6 w-8 h-8 rounded-xl bg-[#0B1220] border-2 border-[#3B82F6] flex items-center justify-center shadow-md">
                <GraduationCap className="w-4 h-4 text-[#3B82F6]" />
              </div>

              {/* Academic Milestone Card */}
              <div className="bg-[#151F2E] border border-[#263449] hover:border-[#3B82F6]/50 rounded-2xl p-6 sm:p-8 transition-colors shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 border-b border-[#263449] pb-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>{edu.scoreLabel}: {edu.score}</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">{edu.degree}</h3>
                    <p className="text-[#94A3B8] font-medium text-sm mt-1.5 flex items-center space-x-1.5">
                      <span>{edu.institution}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-mono text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-3 py-1.5 rounded-lg w-fit shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.period}</span>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2.5 mb-6">
                  {edu.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start space-x-3 text-sm text-[#E2E8F0]">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                      <span className="leading-relaxed font-normal text-xs sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Specialized Coursework */}
                {edu.areas && edu.areas.length > 0 && (
                  <div className="pt-4 border-t border-[#263449]">
                    <span className="text-[11px] font-mono font-semibold text-[#64748B] uppercase tracking-wider block mb-2.5">
                      Specialized Coursework &amp; Modules
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.areas.map((area, aIdx) => (
                        <span
                          key={aIdx}
                          className="bg-[#111827] text-[#CBD5E1] text-xs font-mono px-2.5 py-1 rounded-lg border border-[#263449]"
                        >
                          {area}
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
    </section>
  );
};
