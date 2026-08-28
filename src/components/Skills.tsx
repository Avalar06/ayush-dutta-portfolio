import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Shield, Database, Terminal, Network, Code, Layers } from 'lucide-react';
import { getPortfolioData } from '../services/portfolioStorage';

export const Skills: React.FC = () => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const getCategoryIcon = (index: number) => {
    switch (index % 6) {
      case 0: return <Shield className="w-4 h-4 text-[#3B82F6]" />;
      case 1: return <Network className="w-4 h-4 text-[#10B981]" />;
      case 2: return <Terminal className="w-4 h-4 text-[#3B82F6]" />;
      case 3: return <Cpu className="w-4 h-4 text-[#10B981]" />;
      case 4: return <Database className="w-4 h-4 text-[#3B82F6]" />;
      default: return <Code className="w-4 h-4 text-[#10B981]" />;
    }
  };

  return (
    <section id="skills" className="py-20 md:py-28 bg-[#0B1220] border-b border-[#263449] relative">
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
              03 // CORE CAPABILITIES
            </span>
            <span className="h-px w-8 bg-[#263449]" />
            <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
              SYSTEMS &amp; TOOLING
            </span>
          </motion.div>

          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-3"
          >
            Skills &amp; Security Stack
          </motion.h2>

          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl"
          >
            Practical technical capabilities developed through academic coursework, laboratory analysis, and structured cybersecurity training.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.skills.map((category, idx) => (
            <motion.div
              key={category.id || idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/40 rounded-2xl p-6 flex flex-col justify-between transition-colors shadow-sm relative overflow-hidden group"
            >
              {/* Subtle top domain accent indicator */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2563EB]/40 via-[#3B82F6]/20 to-transparent" />

              <div>
                {/* Domain Header */}
                <div className="flex items-center justify-between mb-3.5 pb-3.5 border-b border-[#263449]/70">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-[#151F2E] rounded-xl border border-[#263449] group-hover:border-[#3B82F6]/40 transition-colors">
                      {getCategoryIcon(idx)}
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                      {category.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-[#94A3B8] bg-[#151F2E] px-2.5 py-1 rounded-md border border-[#263449]">
                    {category.skills.length} Tools
                  </span>
                </div>

                <p className="text-[#94A3B8] text-xs mb-5 font-normal leading-relaxed">
                  {category.description}
                </p>

                {/* Technical Tool Matrix */}
                <div className="pt-1">
                  <span className="text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-wider block mb-2.5">
                    Core Stack &amp; Tooling
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-[#151F2E] border border-[#263449] hover:border-[#3B82F6]/50 hover:text-[#F8FAFC] text-[#CBD5E1] text-xs px-2.5 py-1 rounded-lg font-mono transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
