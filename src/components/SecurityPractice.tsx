import React from 'react';
import { portfolioData } from '../data/portfolioData';

export const SecurityPractice: React.FC = () => {
  return (
    <section className="py-20 bg-[#0B1220] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
            PRACTICAL EXPERTISE
          </span>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Security Practice
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Core cybersecurity disciplines grounded in academic study, internships, and applied project work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.securityPractices.map((practice, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-[#263449] rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono text-[#2563EB] block mb-3">0{idx + 1} // PRACTICE</span>
                <h3 className="text-base font-bold text-[#F8FAFC] mb-2">{practice.title}</h3>
                <p className="text-[#94A3B8] text-xs font-light leading-relaxed">
                  {practice.description}
                </p>
              </div>
              <div className="border-t border-[#263449] pt-3 mt-6 text-[10px] text-[#94A3B8] font-mono">
                Academic & Internship Grounded
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
