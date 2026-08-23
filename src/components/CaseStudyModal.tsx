import React from 'react';
import { X, ShieldAlert, Cpu, BarChart3, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Project } from '../data/portfolioData';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  if (!project || !project.caseStudy) return null;

  const cs = project.caseStudy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto py-10">
      <div 
        className="relative w-full max-w-4xl bg-[#111827] border border-[#263449] rounded-xl shadow-2xl p-6 md:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] p-2 rounded-lg transition-colors z-10 border border-[#263449]"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6 border-b border-[#263449] pb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25 px-2.5 py-1 rounded">
              {project.label}
            </span>
            {project.badge && (
              <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded">
                {project.badge}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">{project.title} — Case Study</h2>
        </div>

        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar text-sm">
          {/* Problem */}
          <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-5">
            <div className="flex items-center space-x-2.5 mb-2 text-[#2563EB]">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-semibold text-[#F8FAFC]">1. Problem Statement</h3>
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              {cs.problem}
            </p>
          </div>

          {/* Approach */}
          <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-5">
            <div className="flex items-center space-x-2.5 mb-2 text-[#2563EB]">
              <Cpu className="w-5 h-5" />
              <h3 className="font-semibold text-[#F8FAFC]">2. Technical Approach & Architecture</h3>
            </div>
            <p className="text-[#94A3B8] leading-relaxed mb-4">
              {cs.approach}
            </p>
            {project.architectureSteps && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-3">
                {project.architectureSteps.map((step, idx) => (
                  <div key={idx} className="bg-[#0B1220] border border-[#263449] p-3 rounded text-xs">
                    <span className="text-[#2563EB] font-mono font-semibold block mb-1">0{idx + 1} // {step.step}</span>
                    <span className="text-[#94A3B8]">{step.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Models Evaluated */}
          {cs.modelsEvaluated && (
            <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-5">
              <div className="flex items-center space-x-2.5 mb-3 text-[#10B981]">
                <BarChart3 className="w-5 h-5" />
                <h3 className="font-semibold text-[#F8FAFC]">3. Detection Models & Selection</h3>
              </div>
              <ul className="space-y-2 mb-4">
                {cs.modelsEvaluated.map((model, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-[#94A3B8]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                    <span>{model}</span>
                  </li>
                ))}
              </ul>
              {cs.finalModel && (
                <div className="bg-[#0B1220] border border-[#263449] rounded p-3 text-xs text-[#F8FAFC]">
                  <strong className="text-[#2563EB] font-mono">Selected Model:</strong> {cs.finalModel}
                </div>
              )}
            </div>
          )}

          {/* Dashboard & Feedback */}
          {(cs.dashboard || cs.adaptiveFeedback) && (
            <div className="bg-[#151F2E] border border-[#263449] rounded-lg p-5">
              <div className="flex items-center space-x-2.5 mb-2 text-[#2563EB]">
                <RefreshCw className="w-5 h-5" />
                <h3 className="font-semibold text-[#F8FAFC]">4. Monitoring Dashboard & Adaptive Retraining</h3>
              </div>
              {cs.dashboard && (
                <p className="text-[#94A3B8] mb-3">
                  <strong className="text-[#F8FAFC]">Dashboard:</strong> {cs.dashboard}
                </p>
              )}
              {cs.adaptiveFeedback && (
                <p className="text-[#94A3B8]">
                  <strong className="text-[#F8FAFC]">Feedback Loop:</strong> {cs.adaptiveFeedback}
                </p>
              )}
            </div>
          )}

          {/* Metrics summary */}
          {project.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="bg-[#0B1220] border border-[#263449] p-3 rounded-lg text-center">
                  <span className="text-xl font-bold text-[#F8FAFC] block mb-0.5">{m.value}</span>
                  <span className="text-xs font-medium text-[#2563EB] block mb-0.5">{m.label}</span>
                  {m.subtext && <span className="text-[10px] text-[#94A3B8]">{m.subtext}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-[#263449]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-medium transition-colors shadow-sm"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
};
