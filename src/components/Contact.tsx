import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-[#111827] border-b border-[#263449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Contact Ayush Dutta
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Open to opportunities in SOC analysis, cybersecurity, IT operations, and technology roles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-[#F8FAFC] border-b border-[#263449] pb-3">
              Direct Contact
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">Email</span>
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="text-[#F8FAFC] hover:text-[#2563EB] font-mono text-xs transition-colors"
                >
                  {portfolioData.personal.email}
                </a>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">Phone</span>
                <a
                  href={`tel:${portfolioData.personal.phone}`}
                  className="text-[#F8FAFC] hover:text-[#2563EB] font-mono text-xs transition-colors"
                >
                  {portfolioData.personal.phone}
                </a>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">Location</span>
                <span className="text-[#F8FAFC] text-xs">
                  {portfolioData.personal.location}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">LinkedIn</span>
                <a
                  href={portfolioData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F8FAFC] hover:text-[#2563EB] font-mono text-xs transition-colors"
                >
                  linkedin.com/in/ayushdutta
                </a>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8] block mb-1">GitHub</span>
                <a
                  href={portfolioData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F8FAFC] hover:text-[#2563EB] font-mono text-xs transition-colors"
                >
                  GitHub Repository Placeholder
                </a>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="lg:col-span-2 bg-[#151F2E] border border-[#263449] rounded-xl p-6 sm:p-8">
            <h3 className="text-base font-bold text-[#F8FAFC] border-b border-[#263449] pb-3 mb-6">
              Send a Professional Inquiry
            </h3>

            {submitted ? (
              <div className="bg-[#10B981]/10 border border-[#10B981]/25 rounded-xl p-6 text-center space-y-3 my-8">
                <div className="w-10 h-10 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-[#F8FAFC]">Message Sent Successfully</h4>
                <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
                  Thank you for reaching out. Ayush will review your inquiry and respond at {portfolioData.personal.email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-[#111827] hover:bg-[#263449] text-[#F8FAFC] rounded-lg text-xs font-medium transition-colors border border-[#263449]"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Recruiter or Hiring Manager"
                      className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#2563EB] rounded-lg px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#2563EB] rounded-lg px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. SOC Analyst / Security Engineer Role"
                    className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#2563EB] rounded-lg px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Details regarding role, interview, or opportunity..."
                    className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#2563EB] rounded-lg px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-medium py-2.5 px-5 rounded-lg transition-colors text-xs shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
