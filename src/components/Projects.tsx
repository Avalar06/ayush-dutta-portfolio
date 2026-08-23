import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Search, Filter } from 'lucide-react';
import { Project, getPortfolioData } from '../data/portfolioData';

interface ProjectsProps {
  onOpenCaseStudy: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onOpenCaseStudy }) => {
  const data = getPortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStepHover, setActiveStepHover] = useState<number | null>(null);

  // Filter only published projects for public view
  const publishedProjects = data.projects.filter((p) => p.published !== false);

  const categories = ['All', 'Cybersecurity', 'AI / ML', 'Web', 'Data', 'Other'];

  const filteredProjects = publishedProjects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const flagshipProject = filteredProjects.find((p) => p.isFlagship) || filteredProjects[0];
  const secondaryProjects = filteredProjects.filter((p) => p.id !== flagshipProject?.id);

  return (
    <section id="projects" className="py-20 bg-[#111827] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
              FEATURED TECHNICAL WORK
            </span>
            <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
              Projects & Research
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Practical security monitoring, machine learning log analysis, and full-stack system development.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#151F2E] border border-[#263449] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] w-full sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 pb-2 border-b border-[#263449]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-[#F8FAFC]'
                  : 'bg-[#151F2E] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#263449]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-12 text-center text-[#94A3B8]">
            <p>No projects found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* FLAGSHIP PROJECT (if matching filter) */}
            {flagshipProject && (
              <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-10 mb-10 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-[#263449] pb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/25 px-2.5 py-1 rounded">
                        {flagshipProject.label}
                      </span>
                      {flagshipProject.badge && (
                        <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded">
                          {flagshipProject.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono bg-[#111827] text-[#94A3B8] px-2 py-0.5 rounded border border-[#263449]">
                        {flagshipProject.status}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                      {flagshipProject.title}
                    </h3>
                  </div>

                  {flagshipProject.caseStudy && (
                    <button
                      onClick={() => onOpenCaseStudy(flagshipProject)}
                      className="self-start lg:self-center inline-flex items-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-medium px-5 py-2.5 rounded-lg transition-colors text-xs shadow-sm"
                    >
                      <span>View Case Study</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-[#94A3B8] text-base leading-relaxed mb-8 font-light">
                  {flagshipProject.description}
                </p>

                {/* Metrics Row */}
                {flagshipProject.metrics && flagshipProject.metrics.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {flagshipProject.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-[#111827] border border-[#263449] rounded-lg p-4 text-center">
                        <span className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] block mb-1">{metric.value}</span>
                        <span className="text-xs font-medium text-[#2563EB] block mb-0.5">{metric.label}</span>
                        {metric.subtext && <span className="text-[10px] text-[#94A3B8]">{metric.subtext}</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Architecture Pipeline Diagram */}
                {flagshipProject.architectureSteps && flagshipProject.architectureSteps.length > 0 && (
                  <div className="bg-[#0B1220] border border-[#263449] rounded-xl p-5 mb-8">
                    <h4 className="text-xs font-mono font-semibold text-[#F8FAFC] uppercase tracking-wider mb-4">
                      Security Architecture & ML Pipeline Flow
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                      {flagshipProject.architectureSteps.map((step, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setActiveStepHover(idx)}
                          onMouseLeave={() => setActiveStepHover(null)}
                          className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                            activeStepHover === idx
                              ? 'bg-[#2563EB]/20 border-[#2563EB] text-[#F8FAFC]'
                              : 'bg-[#111827] border-[#263449] text-[#94A3B8] hover:border-[#2563EB]/50'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-[#2563EB] font-semibold mb-1">
                            0{idx + 1}
                          </div>
                          <div className="font-medium text-[#F8FAFC] mb-1 text-xs">{step.step}</div>
                          <p className="text-[11px] text-[#94A3B8] leading-tight line-clamp-2">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capabilities & Tech Stack */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#263449]">
                  <div>
                    <h5 className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                      Key Capabilities
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {flagshipProject.capabilities.slice(0, 8).map((cap, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-[#94A3B8]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">
                      Technology Stack
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {flagshipProject.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="bg-[#111827] text-[#F8FAFC] text-xs px-2.5 py-1 rounded font-mono border border-[#263449]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECONDARY PROJECTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {secondaryProjects.map((project) => (
                <div key={project.id} className="bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-xs font-mono font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded">
                        {project.label}
                      </span>
                      <span className="text-[10px] font-mono bg-[#111827] text-[#94A3B8] px-2 py-0.5 rounded border border-[#263449]">
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-3">{project.title}</h3>
                    <p className="text-[#94A3B8] text-sm mb-6 font-light leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mb-6">
                      <h5 className="text-xs font-mono font-semibold text-[#94A3B8] uppercase tracking-wider mb-2.5">
                        Technologies
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="bg-[#111827] text-[#F8FAFC] text-xs px-2.5 py-1 rounded font-mono border border-[#263449]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {project.caseStudy && (
                    <div className="pt-4 border-t border-[#263449] flex items-center justify-between">
                      <span className="text-xs text-[#94A3B8] font-mono">Case study available</span>
                      <button
                        onClick={() => onOpenCaseStudy(project)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#3B82F6]"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
