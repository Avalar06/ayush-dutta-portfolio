import React, { useState, useEffect } from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { getPortfolioData } from '../services/portfolioStorage';

export const Footer: React.FC = () => {
  const [data, setData] = useState(() => getPortfolioData());

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const personal = data.personal;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1220] border-t border-[#263449] py-12 text-xs text-[#94A3B8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#263449]/70">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="w-4 h-4 text-[#3B82F6]" />
              <span className="font-bold text-[#F8FAFC] text-sm">{personal.name}</span>
            </div>
            <span className="text-[#94A3B8] font-mono text-xs">
              {personal.title || 'Cybersecurity Specialist • Threat Detection • Applied ML'}
            </span>
          </div>

          <div className="flex items-center space-x-6 text-[#94A3B8] font-mono text-xs">
            <a href={`mailto:${personal.email}`} className="hover:text-[#3B82F6] transition-colors">Email</a>
            <span>•</span>
            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#3B82F6] transition-colors">LinkedIn</a>
            <span>•</span>
            <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#3B82F6] transition-colors">GitHub</a>
            <span>•</span>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-[#94A3B8]/30 hover:text-[#94A3B8] transition-colors p-1 rounded focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
              title="Admin Console"
              aria-label="Admin Console"
            >
              <Shield className="w-3 h-3" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 bg-[#151F2E] hover:bg-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-2 rounded-lg border border-[#263449] transition-colors font-mono text-[11px]"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#94A3B8]">
          <div>
            © {new Date().getFullYear()} {personal.name}. Professional Portfolio.
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block animate-pulse" />
            <span>Open to Opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
