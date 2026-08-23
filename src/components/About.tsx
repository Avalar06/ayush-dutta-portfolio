import React from 'react';
import { getPortfolioData } from '../data/portfolioData';

export const About: React.FC = () => {
  const data = getPortfolioData();
  const { about, personal } = data;

  return (
    <section id="about" className="py-20 bg-[#111827] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
              PROFILE & BACKGROUND
            </span>
            <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-4">
              About {personal.name}
            </h2>
            <p className="text-sm text-[#94A3B8]">
              {personal.location}
            </p>
          </div>

          {/* Right Column: Editorial Summary */}
          <div className="lg:col-span-8 bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-8 space-y-6">
            <p className="text-[#F8FAFC] text-base sm:text-lg leading-relaxed font-light">
              {about.summary}
            </p>

            <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed font-light">
              With an M.Sc. in IT Cybersecurity from MAKAUT (CGPA 8.04) and a BCA degree from NSHM Knowledge Campus (SGPA 8.95), {personal.name} combines formal academic training in cryptography, network security, and risk analysis with practical implementation in Python, machine learning, and security monitoring workflows.
            </p>

            <div className="border-t border-[#263449] pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC] mb-4">
                Core Focus Areas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.focusAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs sm:text-sm text-[#94A3B8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
