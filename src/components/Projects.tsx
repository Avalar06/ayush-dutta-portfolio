import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, Search, Cpu, ShieldAlert, BarChart3, Layers, Terminal, ExternalLink, Code2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, getPortfolioData } from '../services/portfolioStorage';

interface ProjectsProps {
  onOpenCaseStudy: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onOpenCaseStudy }) => {
  const [data, setData] = useState(() => getPortfolioData());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStepHover, setActiveStepHover] = useState<number | null>(null);

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  // Filter only published projects for public view
  const publishedProjects = data.projects.filter((p) => p.published !== false);

  // Dynamically aggregate categories from published projects while maintaining preferred order
  const categories = Array.from(
    new Set([
      'All',
      'Cybersecurity',
      'AI / ML',
      'Web',
      'Data',
      ...publishedProjects.map((p) => p.category).filter((c): c is string => Boolean(c))
    ])
  );

  const filteredProjects = publishedProjects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      p.title.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower)) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(searchLower))) ||
      (p.category && p.category.toLowerCase().includes(searchLower));
    return matchesCat && matchesSearch;
  });

  const flagshipProject = filteredProjects.find((p) => p.isFlagship) || filteredProjects[0];
  const secondaryProjects = filteredProjects.filter((p) => p.id !== flagshipProject?.id);

  return (
    <section id="projects" className="py-20 md:py-28 bg-[#111827] border-b border-[#263449] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#263449]/70">
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
            className="max-w-3xl"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
              }}
              className="flex items-center space-x-3 mb-3"
            >
              <span className="text-xs font-mono font-bold text-[#3B82F6] tracking-wider">
                01 // PROJECTS
              </span>
              <span className="h-px w-8 bg-[#263449]" />
              <span className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
                APPLIED PROJECTS
              </span>
            </motion.div>

            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
              }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F8FAFC] tracking-tight mb-3"
            >
              Projects &amp; Applied Systems
            </motion.h2>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
              }}
              className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl"
            >
              Practical security monitoring, machine learning log analysis, and applied cybersecurity defenses.
            </motion.p>
          </motion.div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, tools, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#151F2E] border border-[#263449] focus:border-[#3B82F6] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none transition-colors w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-3 border-b border-[#263449]">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'text-[#F8FAFC] shadow-sm'
                    : 'bg-[#151F2E] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] border border-[#263449]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-[#2563EB] rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-[#151F2E] border border-[#263449] rounded-2xl p-12 text-center text-[#94A3B8]">
            <p className="text-sm">No projects found matching your search or category criteria.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* FLAGSHIP SECURITY CASE STUDY */}
            {flagshipProject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45 }}
                className="bg-[#151F2E] border border-[#263449] hover:border-[#3B82F6]/40 rounded-2xl p-6 sm:p-9 shadow-xl transition-colors relative overflow-hidden group"
              >
                {/* Structural Accent Top Line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#2563EB] via-[#3B82F6]/50 to-transparent" />

                {/* Header Strip */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6 pb-6 border-b border-[#263449]">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-mono font-semibold text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-2.5 py-1 rounded-md">
                        {flagshipProject.label}
                      </span>
                      {flagshipProject.badge && (
                        <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded-md">
                          {flagshipProject.badge}
                        </span>
                      )}
                      <span className="text-[11px] font-mono bg-[#111827] text-[#94A3B8] px-2.5 py-0.5 rounded-md border border-[#263449]">
                        {flagshipProject.status}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight mb-3">
                      {flagshipProject.title}
                    </h3>

                    <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed font-normal">
                      {flagshipProject.description}
                    </p>
                  </div>

                  {/* Flagship CTA Actions Group */}
                  <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
                    {flagshipProject.caseStudy && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onOpenCaseStudy(flagshipProject)}
                        className="inline-flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-semibold px-5 py-2.5 rounded-xl transition-colors text-xs shadow-sm shadow-[#2563EB]/25 focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                      >
                        <span>View Case Study</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </motion.button>
                    )}

                    {flagshipProject.github && (
                      <a
                        href={flagshipProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 bg-[#111827] hover:bg-[#1E293B] border border-[#263449] text-[#94A3B8] hover:text-[#F8FAFC] font-mono text-xs px-4 py-2.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-[#3B82F6]"
                      >
                        <Code2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Metrics Row (Subordinate, High-Contrast Typography) */}
                {flagshipProject.metrics && flagshipProject.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
                    {flagshipProject.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-[#111827] border border-[#263449] rounded-xl p-3.5 text-center transition-colors">
                        <span className="text-xl sm:text-2xl font-bold text-[#F8FAFC] block mb-0.5">{metric.value}</span>
                        <span className="text-[11px] font-mono font-medium text-[#3B82F6] block mb-0.5">{metric.label}</span>
                        {metric.subtext && <span className="text-[10px] text-[#94A3B8] font-mono">{metric.subtext}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Architecture Pipeline Flow */}
                {flagshipProject.architectureSteps && flagshipProject.architectureSteps.length > 0 && (
                  <div className="bg-[#0B1220] border border-[#263449] rounded-2xl p-5 mb-8">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#263449]/70">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-4 h-4 text-[#3B82F6]" />
                        <h4 className="text-xs font-mono font-bold text-[#F8FAFC] uppercase tracking-wider">
                          System Architecture &amp; Detection Pipeline
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-[#94A3B8]">Workflow Stages</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                      {flagshipProject.architectureSteps.map((step, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setActiveStepHover(idx)}
                          onMouseLeave={() => setActiveStepHover(null)}
                          className={`p-3 rounded-xl border text-xs transition-all cursor-pointer relative ${
                            activeStepHover === idx
                              ? 'bg-[#2563EB]/20 border-[#3B82F6] text-[#F8FAFC]'
                              : 'bg-[#111827] border-[#263449] text-[#94A3B8] hover:border-[#3B82F6]/40'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-[#3B82F6] font-bold mb-1">
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div className="font-semibold text-[#F8FAFC] mb-1 text-xs">{step.step}</div>
                          <p className="text-[11px] text-[#94A3B8] leading-snug line-clamp-2">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Controls & Applied Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#263449]">
                  {flagshipProject.capabilities && flagshipProject.capabilities.length > 0 && (
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-[#64748B] uppercase tracking-wider block mb-3">
                        Key Capabilities &amp; Security Controls
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {flagshipProject.capabilities.map((cap, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs text-[#E2E8F0]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-mono font-semibold text-[#64748B] uppercase tracking-wider block mb-3">
                      Applied Technology Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(flagshipProject.technologies || []).map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-[#111827] text-[#CBD5E1] text-xs px-2.5 py-1 rounded-lg font-mono border border-[#263449]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECONDARY PROJECTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {secondaryProjects.map((project, pIdx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: Math.min(pIdx * 0.04, 0.25) }}
                  className="bg-[#151F2E] border border-[#263449] hover:border-[#3B82F6]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-colors shadow-sm relative group overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-0.5 rounded-full">
                        {project.label || 'Project'}
                      </span>
                      {project.status && (
                        <span className="text-[10px] font-mono bg-[#111827] text-[#94A3B8] px-2 py-0.5 rounded border border-[#263449]">
                          {project.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-2.5 group-hover:text-[#3B82F6] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#94A3B8] text-xs sm:text-sm mb-5 font-normal leading-relaxed">
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-5">
                        <span className="text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
                          Technologies
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="bg-[#111827] text-[#CBD5E1] text-xs px-2 py-0.5 rounded-md font-mono border border-[#263449]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#263449]/70 flex items-center justify-between gap-3">
                    <span className="text-xs text-[#94A3B8] font-mono">Case Study</span>
                    <div className="flex items-center space-x-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                        >
                          Repo
                        </a>
                      )}
                      {project.caseStudy && (
                        <button
                          onClick={() => onOpenCaseStudy(project)}
                          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
                        >
                          <span>Explore Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
