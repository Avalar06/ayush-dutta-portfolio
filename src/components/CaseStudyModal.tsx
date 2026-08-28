import React from 'react';
import { X, ShieldAlert, Cpu, BarChart3, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../services/portfolioStorage';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  const cs = project?.caseStudy;

  return (
    <AnimatePresence>
      {project && cs && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-4xl bg-[#111827] border border-[#263449] rounded-2xl shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC] bg-[#151F2E] hover:bg-[#263449] p-2 rounded-xl transition-colors z-10 border border-[#263449]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6 border-b border-[#263449] pb-5 shrink-0 pr-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-2.5 py-1 rounded-md">
                  {project.label}
                </span>
                {project.badge && (
                  <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded-md">
                    {project.badge}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">{project.title} — Case Study</h2>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar text-sm">
              {/* Problem */}
              <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 sm:p-6">
                <div className="flex items-center space-x-2.5 mb-2.5 text-[#3B82F6]">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="font-bold text-[#F8FAFC]">1. Problem Statement</h3>
                </div>
                <p className="text-[#94A3B8] leading-relaxed font-light">
                  {cs.problem}
                </p>
              </div>

              {/* Approach */}
              <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 sm:p-6">
                <div className="flex items-center space-x-2.5 mb-2.5 text-[#3B82F6]">
                  <Cpu className="w-5 h-5" />
                  <h3 className="font-bold text-[#F8FAFC]">2. Technical Approach & Architecture</h3>
                </div>
                <p className="text-[#94A3B8] leading-relaxed mb-4 font-light">
                  {cs.approach}
                </p>
                {project.architectureSteps && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {project.architectureSteps.map((step, idx) => (
                      <div key={idx} className="bg-[#0B1220] border border-[#263449] p-3.5 rounded-xl text-xs">
                        <span className="text-[#3B82F6] font-mono font-semibold block mb-1">0{idx + 1} // {step.step}</span>
                        <span className="text-[#94A3B8]">{step.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Models Evaluated */}
              {cs.modelsEvaluated && (
                <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center space-x-2.5 mb-3 text-[#10B981]">
                    <BarChart3 className="w-5 h-5" />
                    <h3 className="font-bold text-[#F8FAFC]">3. Detection Models & Selection</h3>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {cs.modelsEvaluated.map((model, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#94A3B8]">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                        <span>{model}</span>
                      </li>
                    ))}
                  </ul>
                  {cs.finalModel && (
                    <div className="bg-[#0B1220] border border-[#263449] rounded-xl p-3.5 text-xs text-[#F8FAFC]">
                      <strong className="text-[#3B82F6] font-mono">Selected Baseline Architecture:</strong> {cs.finalModel}
                    </div>
                  )}
                </div>
              )}

              {/* Dashboard & Feedback */}
              {(cs.dashboard || cs.adaptiveFeedback) && (
                <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-5 sm:p-6">
                  <div className="flex items-center space-x-2.5 mb-2.5 text-[#3B82F6]">
                    <RefreshCw className="w-5 h-5" />
                    <h3 className="font-bold text-[#F8FAFC]">4. Monitoring Dashboard & Feedback Loop</h3>
                  </div>
                  {cs.dashboard && (
                    <p className="text-[#94A3B8] mb-3 text-xs sm:text-sm font-light">
                      <strong className="text-[#F8FAFC]">Telemetry Dashboard:</strong> {cs.dashboard}
                    </p>
                  )}
                  {cs.adaptiveFeedback && (
                    <p className="text-[#94A3B8] text-xs sm:text-sm font-light">
                      <strong className="text-[#F8FAFC]">Adaptive Loop:</strong> {cs.adaptiveFeedback}
                    </p>
                  )}
                </div>
              )}

              {/* Metrics summary */}
              {project.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="bg-[#0B1220] border border-[#263449] p-3.5 rounded-xl text-center">
                      <span className="text-xl font-bold text-[#F8FAFC] block mb-0.5">{m.value}</span>
                      <span className="text-xs font-semibold text-[#3B82F6] block mb-0.5">{m.label}</span>
                      {m.subtext && <span className="text-[10px] text-[#94A3B8] font-mono">{m.subtext}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-[#263449] shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] text-xs font-semibold transition-colors shadow-sm shadow-[#2563EB]/25"
              >
                Close Case Study
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
