import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle2, Copy, Check, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { getPortfolioData } from '../services/portfolioStorage';

export const Contact: React.FC = () => {
  const [data, setData] = useState(() => getPortfolioData());
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => setData({ ...getPortfolioData() });
    window.addEventListener('portfolio_updated', handleUpdate);
    return () => window.removeEventListener('portfolio_updated', handleUpdate);
  }, []);

  const personal = data.personal;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields (Name, Email, and Message).');
      return;
    }
    setError(null);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#111827] border-b border-[#263449] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl mb-12"
        >
          <span className="text-xs uppercase tracking-wider font-mono font-semibold text-[#3B82F6] bg-[#2563EB]/10 border border-[#2563EB]/25 px-3 py-1 rounded-md">
            COMMUNICATIONS CHANNEL
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] tracking-tight mt-3 mb-3">
            Get in Touch with {personal.name}
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Open to opportunities in Security Operations (SOC), cybersecurity engineering, and applied systems security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5 bg-[#151F2E] border border-[#263449] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[#263449] pb-4">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#3B82F6]" />
                <span>Direct Contact Channels</span>
              </h3>
              <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                ACTIVE
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-[#111827] border border-[#263449] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-0.5">Primary Email</span>
                  <a
                    href={`mailto:${personal.email}`}
                    className="text-[#F8FAFC] hover:text-[#3B82F6] font-mono text-xs transition-colors block"
                  >
                    {personal.email}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 bg-[#151F2E] hover:bg-[#2563EB]/20 text-[#94A3B8] hover:text-[#3B82F6] rounded-lg border border-[#263449] transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="bg-[#111827] border border-[#263449] rounded-xl p-3.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-0.5">Direct Line</span>
                <a
                  href={`tel:${personal.phone}`}
                  className="text-[#F8FAFC] hover:text-[#3B82F6] font-mono text-xs transition-colors"
                >
                  {personal.phone}
                </a>
              </div>

              <div className="bg-[#111827] border border-[#263449] rounded-xl p-3.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-0.5">Location</span>
                <span className="text-[#F8FAFC] text-xs font-mono">
                  {personal.location}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-[#F8FAFC] hover:text-[#3B82F6] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#3B82F6]" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111827] border border-[#263449] hover:border-[#3B82F6]/50 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-[#F8FAFC] hover:text-[#3B82F6] transition-colors"
                >
                  <Github className="w-4 h-4 text-[#3B82F6]" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 bg-[#151F2E] border border-[#263449] rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[#263449] pb-4 mb-6">
              <h3 className="text-base font-bold text-[#F8FAFC] flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
                <span>Send a Professional Inquiry</span>
              </h3>
              <span className="text-[11px] font-mono text-[#94A3B8]">Fast response</span>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 font-mono">
                {error}
              </div>
            )}

            {submitted ? (
              <div className="bg-[#10B981]/10 border border-[#10B981]/25 rounded-2xl p-8 text-center space-y-3 my-4">
                <div className="w-12 h-12 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#F8FAFC]">Message Transmitted Successfully</h4>
                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Ayush will review your communication and respond shortly via {personal.email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-[#111827] hover:bg-[#263449] text-[#F8FAFC] rounded-xl text-xs font-semibold transition-colors border border-[#263449] mt-2"
                >
                  Send Another Message
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
                      className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
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
                      className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
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
                    className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#94A3B8] mb-1.5 font-mono">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Details regarding role requirements, interview scheduling, or collaboration..."
                    className="w-full bg-[#0B1220] border border-[#263449] focus:border-[#3B82F6] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-[#3B82F6] text-[#F8FAFC] font-semibold py-3 px-5 rounded-xl transition-colors text-xs shadow-sm shadow-[#2563EB]/25"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry</span>
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
