import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getPortfolioData } from '../data/portfolioData';

export const Experience: React.FC = () => {
  const data = getPortfolioData();
  const experiences = data.experience;

  return (
    <section id="experience" className="py-20 bg-[#111827] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
            PROFESSIONAL EXPERIENCE
          </span>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Internship & Training
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Structured cybersecurity training and practical operational exposure.
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-[#263449] pb-5">
                <div>
                  <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded inline-block mb-2">
                    {exp.type}
                  </span>
                  <h3 className="text-xl font-bold text-[#F8FAFC]">{exp.role}</h3>
                  <span className="text-[#94A3B8] font-medium text-sm block mt-0.5">{exp.organization} {exp.location && `• ${exp.location}`}</span>
                </div>
                <div className="text-xs font-mono text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25 px-3 py-1.5 rounded w-fit">
                  {exp.period}
                </div>
              </div>

              <h4 className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                Key Responsibilities & Focus Areas
              </h4>

              <div className="space-y-3 mb-6">
                {exp.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} className="flex items-start space-x-3 text-sm text-[#94A3B8]">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{resp}</span>
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
                        className="bg-[#111827] text-[#F8FAFC] text-xs font-mono px-2.5 py-1 rounded border border-[#263449]"
                      >
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
