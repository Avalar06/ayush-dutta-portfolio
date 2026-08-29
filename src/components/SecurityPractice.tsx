import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Activity, Eye, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { getPortfolioData } from '../services/portfolioStorage';

export const SecurityPractice: React.FC = () => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const getPracticeIcon = (idx: number) => {
    switch (idx % 4) {
      case 0: return <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />;
      case 1: return <Activity className="w-5 h-5 text-[#10B981]" />;
      case 2: return <Lock className="w-5 h-5 text-[#3B82F6]" />;
      default: return <Eye className="w-5 h-5 text-[#10B981]" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#0B1220] border-b border-[#263449] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl mb-12"
        >
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-3 py-1 rounded-md">
            Core Disciplines
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Security Practice & Disciplines
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Core cybersecurity disciplines grounded in academic study, hands-on laboratory investigation, and applied project work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.securityPractices.map((practice, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 rounded-2xl p-6 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#151F2E] rounded-lg border border-[#263449]">
                    {getPracticeIcon(idx)}
                  </div>
                  <span className="text-[10px] font-mono text-[#3B82F6] font-semibold bg-[#2563EB]/10 px-2 py-0.5 rounded border border-[#2563EB]/20">
                    0{idx + 1} // PRACTICE
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F8FAFC] mb-2.5 leading-snug">{practice.title}</h3>
                <p className="text-[#94A3B8] text-xs font-light leading-relaxed">
                  {practice.description}
                </p>
              </div>

              <div className="border-t border-[#263449]/70 pt-3 mt-6 text-[10px] text-[#94A3B8] font-mono flex items-center justify-between">
                <span>Applied Methodology</span>
                <span className="text-[#10B981]">Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
