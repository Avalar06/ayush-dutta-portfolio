import React from 'react';
import { getPortfolioData } from '../data/portfolioData';

export const Skills: React.FC = () => {
  const data = getPortfolioData();

  return (
    <section id="skills" className="py-20 bg-[#0B1220] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
            TECHNICAL COMPETENCIES
          </span>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Skills & Security Stack
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Grouped technical capabilities developed through academic coursework, independent research, and structured internship training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.skills.map((category, idx) => (
            <div
              key={category.id || idx}
              className="bg-[#111827] border border-[#263449] rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[#F8FAFC] tracking-tight">
                    {category.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#94A3B8]">0{idx + 1}</span>
                </div>
                <p className="text-[#94A3B8] text-xs mb-5 font-light leading-relaxed">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="bg-[#151F2E] border border-[#263449] text-[#F8FAFC] text-xs px-2.5 py-1 rounded font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
