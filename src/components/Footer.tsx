import React from 'react';
import { portfolioData } from '../data/portfolioData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1220] border-t border-[#263449] py-10 text-xs text-[#94A3B8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-[#F8FAFC] block mb-0.5">{portfolioData.personal.name}</span>
          <span className="text-[#94A3B8] font-mono">Cybersecurity • Security Monitoring • Applied ML</span>
        </div>

        <div className="flex items-center space-x-6 text-[#94A3B8] font-mono">
          <a href={`mailto:${portfolioData.personal.email}`} className="hover:text-[#F8FAFC] transition-colors">Email</a>
          <span>·</span>
          <a href={portfolioData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors">LinkedIn</a>
          <span>·</span>
          <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC] transition-colors">GitHub</a>
        </div>

        <div className="text-[#94A3B8]">
          © 2026 Ayush Dutta. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
