import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { getPortfolioData } from '../data/portfolioData';

export const Education: React.FC = () => {
  const data = getPortfolioData();

  return (
    <section id="education" className="py-20 bg-[#111827] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
            ACADEMIC BACKGROUND
          </span>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Education & Degrees
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Rigorous academic foundations in cybersecurity and computer applications.
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {data.education.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-[#263449] pb-4">
                <div>
                  <span className="text-xs font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded inline-block mb-1">
                    {edu.scoreLabel}: {edu.score}
                  </span>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mt-1">{edu.degree}</h3>
                  <span className="text-[#94A3B8] font-medium text-sm block mt-0.5">{edu.institution}</span>
                </div>

                <div className="text-xs font-mono text-[#94A3B8] bg-[#111827] border border-[#263449] px-3 py-1.5 rounded w-fit">
                  {edu.period}
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                {edu.highlights.map((item, hIdx) => (
                  <div key={hIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#94A3B8]">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {edu.areas && edu.areas.length > 0 && (
                <div className="pt-4 border-t border-[#263449]">
                  <h5 className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-2.5">
                    Core Coursework
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {edu.areas.map((area, aIdx) => (
                      <span
                        key={aIdx}
                        className="bg-[#111827] text-[#F8FAFC] text-xs font-mono px-2.5 py-1 rounded border border-[#263449]"
                      >
                        {area}
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
