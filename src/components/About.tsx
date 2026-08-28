import React, { useState, useEffect } from 'react';
import { Shield, GraduationCap, Target, Cpu, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { getPortfolioData } from '../services/portfolioStorage';

export const About: React.FC = () => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const { about, personal } = data;

  return (
    <section id="about" className="py-20 md:py-28 bg-[#111827] border-b border-[#263449] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Telemetry */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-6"
          >
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
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
                }}
                className="flex items-center space-x-2.5 mb-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                <span className="text-xs font-mono font-semibold text-[#3B82F6] uppercase tracking-wider">
                  PROFESSIONAL PROFILE
                </span>
              </motion.div>

              <motion.h2 
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] tracking-tight mb-2"
              >
                About {personal.name}
              </motion.h2>

              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
                className="text-xs sm:text-sm text-[#94A3B8] font-mono"
              >
                {personal.title || 'Cybersecurity & Tech Specialist'} • {personal.location}
              </motion.p>
            </motion.div>

            {/* Quick credentials cards */}
            <div className="space-y-3">
              <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-4 flex items-start space-x-3.5 hover:border-[#3B82F6]/50 transition-colors">
                <div className="p-2 bg-[#2563EB]/15 text-[#3B82F6] rounded-lg shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Academic Foundation</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-0.5">
                    M.Sc. in IT Cybersecurity (CGPA 8.04) & BCA (SGPA 8.95) with emphasis on systems security and cryptography.
                  </p>
                </div>
              </div>

              <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-4 flex items-start space-x-3.5 hover:border-[#3B82F6]/50 transition-colors">
                <div className="p-2 bg-[#10B981]/15 text-[#10B981] rounded-lg shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Security Philosophy</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-0.5">
                    Proactive threat detection, automated telemetry analysis, and defense-in-depth risk mitigation.
                  </p>
                </div>
              </div>

              <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-4 flex items-start space-x-3.5 hover:border-[#3B82F6]/50 transition-colors">
                <div className="p-2 bg-[#2563EB]/15 text-[#3B82F6] rounded-lg shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Applied Automation</h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-0.5">
                    Building robust Python scripts and ML pipelines for high-accuracy security event classification.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Summary & Focus Grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7 bg-[#151F2E] border border-[#263449] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative"
          >
            <p className="text-[#F8FAFC] text-base sm:text-lg leading-relaxed font-light">
              {about.summary}
            </p>

            <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed font-light">
              With an M.Sc. in IT Cybersecurity from MAKAUT (CGPA 8.04) and a BCA degree from NSHM Knowledge Campus (SGPA 8.95), {personal.name} combines formal academic training in cryptography, network security, and risk analysis with practical implementation in Python, machine learning, and security monitoring workflows.
            </p>

            <div className="border-t border-[#263449] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] font-mono flex items-center space-x-2">
                  <Target className="w-4 h-4 text-[#3B82F6]" />
                  <span>CORE TECHNICAL DISCIPLINES</span>
                </h3>
                <span className="text-[11px] text-[#94A3B8] font-mono">Applied Skills</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.focusAreas.map((area, idx) => (
                  <motion.div
                    whileHover={{ scale: 1.01, x: 3 }}
                    transition={{ duration: 0.15 }}
                    key={idx}
                    className="flex items-center space-x-3 text-xs sm:text-sm text-[#E2E8F0] bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 p-3 rounded-lg transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{area}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
