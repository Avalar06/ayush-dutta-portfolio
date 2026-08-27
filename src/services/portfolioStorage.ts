import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Project {
  id: string;
  title: string;
  category: 'Cybersecurity' | 'AI / ML' | 'Web' | 'Data' | 'Other';
  status: 'Completed' | 'In Progress' | 'Research' | 'Archived';
  featured: boolean;
  published: boolean;
  label: string;
  badge?: string;
  shortDescription: string;
  fullDescription?: string;
  description: string;
  technologies: string[];
  capabilities: string[];
  metrics?: { label: string; value: string; subtext?: string }[];
  architectureSteps?: { step: string; description: string }[];
  caseStudy?: {
    problem: string;
    approach: string;
    modelsEvaluated?: string[];
    finalModel?: string;
    dashboard?: string;
    adaptiveFeedback?: string;
  };
  githubUrl?: string;
  demoUrl?: string;
  date?: string;
  role?: string;
  isFlagship?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  duration?: string;
  credentialId?: string;
  verificationUrl?: string;
  pdfPlaceholder: string;
  published: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  score: string;
  scoreLabel: string;
  highlights: string[];
  areas?: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  type: string;
  responsibilities: string[];
  frameworks: string[];
  location?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface SiteSettings {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  status: string;
  shortBio: string;
  aboutSummary: string;
  focusAreas: string[];
}

export interface ResumeItem {
  id: string;
  title: string;
  targetRoles: string;
  description: string;
  pdfPath: string;
  published?: boolean;
}

export interface PortfolioDatabase {
  personal: SiteSettings;
  about: {
    summary: string;
    focusAreas: string[];
  };
  projects: Project[];
  certifications: Certification[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  securityPractices: { title: string; description: string; icon: string }[];
  resumes: ResumeItem[];
}

export const initialPortfolioData: PortfolioDatabase = {
  personal: {
    name: "Ayush Dutta",
    title: "Cybersecurity | Security Monitoring | Applied Machine Learning",
    location: "Bardhaman, West Bengal, India",
    email: "Dayush849@gmail.com",
    phone: "+91-6297110058",
    linkedin: "https://linkedin.com/in/ayushdutta",
    github: "https://github.com/ayushdutta-sec",
    status: "Entry-Level Cybersecurity / IT Opportunities",
    shortBio: "Cybersecurity-focused technology professional building practical security monitoring, anomaly detection, and data-driven solutions.",
    aboutSummary: "Ayush Dutta is a cybersecurity-focused graduate with a Bachelor of Computer Applications and an M.Sc. in IT Cybersecurity. He has hands-on experience through independent technical projects and a structured cybersecurity internship.",
    focusAreas: [
      "Security monitoring & alert triage",
      "Log analysis & anomaly detection",
      "Threat and vulnerability identification",
      "Incident documentation & risk assessment",
      "Network security fundamentals",
      "Applied machine learning & Python automation"
    ]
  },
  about: {
    summary: "Ayush Dutta is a cybersecurity-focused graduate with a Bachelor of Computer Applications and an M.Sc. in IT Cybersecurity. He has hands-on experience through independent technical projects and a structured cybersecurity internship.",
    focusAreas: [
      "Security monitoring & alert triage",
      "Log analysis & anomaly detection",
      "Threat and vulnerability identification",
      "Incident documentation & risk assessment",
      "Network security fundamentals",
      "Applied machine learning & Python automation"
    ]
  },
  projects: [
    {
      id: "log-anomaly-detection",
      title: "Adaptive ML-Based Log Anomaly Detection System",
      category: "Cybersecurity",
      status: "Completed",
      featured: true,
      published: true,
      label: "Major M.Sc. Research Project | MAKAUT",
      badge: "SIEM-Style Security Monitoring",
      isFlagship: true,
      shortDescription: "An end-to-end machine-learning-driven security monitoring system designed to ingest system logs, detect anomalies, visualize alerts, and incorporate analyst feedback into an adaptive retraining pipeline.",
      description: "An end-to-end machine-learning-driven security monitoring system designed to ingest system logs, perform feature engineering and anomaly detection, visualize security events, and incorporate analyst feedback into an adaptive retraining pipeline.",
      technologies: [
        "Python",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "TF-IDF",
        "Random Forest",
        "Logistic Regression",
        "Linear SVM",
        "Isolation Forest",
        "Flask",
        "Chart.js",
        "Plotly",
        "Git",
        "Linux/Unix"
      ],
      capabilities: [
        "Live log ingestion",
        "Uploaded log analysis",
        "Log parsing",
        "Feature engineering",
        "TF-IDF vectorization",
        "Structured security features",
        "ML-based anomaly detection",
        "Confidence scoring",
        "Alert monitoring",
        "False-positive analysis",
        "Analyst feedback",
        "Adaptive model retraining",
        "Validation gates",
        "Retraining history",
        "Visualization dashboard"
      ],
      metrics: [
        { label: "Accuracy", value: "~96%", subtext: "Experimental validation result" },
        { label: "ROC-AUC", value: "0.98", subtext: "Model discrimination score" },
        { label: "Models Evaluated", value: "4", subtext: "Logreg, SVM, IsoForest, RF" },
        { label: "Validation", value: "5-Fold", subtext: "Cross-validation scheme" }
      ],
      architectureSteps: [
        { step: "Log Sources", description: "System logs, authentication logs, and network event streams." },
        { step: "Log Collection", description: "Aggregating raw log files and real-time stream inputs." },
        { step: "Log Parsing", description: "Extracting timestamps, IPs, user agents, and status codes." },
        { step: "Data Cleaning", description: "Handling missing values and normalizing text formats." },
        { step: "Feature Engineering", description: "Extracting quantitative behavioral and temporal attributes." },
        { step: "TF-IDF + Structured Features", description: "Combining term frequency-inverse document frequency vectorization with parsed numeric features." },
        { step: "ML Detection", description: "Evaluating logs through supervised and unsupervised models." },
        { step: "Confidence Scoring", description: "Computing calibrated anomaly probability scores." },
        { step: "Security Alert", description: "Generating triage-ready alerts for security analysts." },
        { step: "Analyst Feedback", description: "Recording true vs. false positive determinations." },
        { step: "Validation", description: "Passing retrained weights through rigorous validation gates." },
        { step: "Adaptive Retraining", description: "Updating operational model parameters iteratively." }
      ],
      caseStudy: {
        problem: "Traditional rule-based monitoring can generate large numbers of alerts and may struggle with complex or evolving log patterns without constant manual rule tuning.",
        approach: "Combines log processing, structured features, TF-IDF representation, supervised and unsupervised machine learning, confidence calibration, visualization, and feedback-driven retraining.",
        modelsEvaluated: [
          "Logistic Regression (baseline linear classification)",
          "Linear SVM (margin-based separation)",
          "Isolation Forest (unsupervised outlier isolation)",
          "Random Forest (ensemble decision trees for robust non-linear patterns)"
        ],
        finalModel: "Random Forest model was selected and calibrated for the final pipeline due to superior recall and stable ROC-AUC performance.",
        dashboard: "Built using Flask, Chart.js, and Plotly to provide live security event monitoring, filter alerts by confidence, and review log anomalies.",
        adaptiveFeedback: "Analyst feedback is captured and fed into an offline retraining loop guarded by validation criteria before model promotion."
      },
      githubUrl: "https://github.com/ayushdutta-sec/log-anomaly-detector",
      demoUrl: "https://github.com/ayushdutta-sec/log-anomaly-detector",
      date: "2025 – 2026",
      role: "Lead Researcher & Developer"
    },
    {
      id: "grocery-store-management",
      title: "Grocery Store Management System",
      category: "Web",
      status: "Completed",
      featured: false,
      published: true,
      label: "BCA Capstone Project | NSHM Knowledge Campus",
      badge: "Full-Stack Application & Data Integrity",
      isFlagship: false,
      shortDescription: "A comprehensive management application focused on requirements gathering, team coordination, secure record maintenance, role-based access control, and data validation.",
      description: "A comprehensive management application focused on requirements gathering, team coordination, secure record maintenance, role-based access control, and data validation.",
      technologies: [
        "JavaScript",
        "HTML/CSS",
        "Firebase",
        "Firestore",
        "Authentication",
        "Git"
      ],
      capabilities: [
        "Requirements gathering & team coordination",
        "Application development & data-entry workflows",
        "Record maintenance & inventory tracking",
        "Data validation & sanitization",
        "Role-based access control (RBAC)",
        "Firebase security rules implementation"
      ],
      metrics: [
        { label: "Process Time", value: "-40%", subtext: "Reduction in manual processing time" },
        { label: "Data Integrity", value: "100%", subtext: "Enforced via Firebase security rules" }
      ],
      caseStudy: {
        problem: "Local retail management faced inefficiencies in inventory tracking, manual billing record errors, and lack of role-based permissions.",
        approach: "Led a student team through end-to-end SDLC, designing structured data schemas in Firestore and enforcing strict security rules.",
        finalModel: "Successfully deployed inventory and sales tracking module reducing manual processing time by approximately 40%."
      },
      githubUrl: "https://github.com/ayushdutta-sec/grocery-management",
      demoUrl: "https://github.com/ayushdutta-sec/grocery-management",
      date: "2023",
      role: "Project Lead & Full-Stack Developer"
    }
  ],
  certifications: [
    {
      id: "nielit-cert",
      title: "Online Internship Program in Cyber Security",
      issuer: "NIELIT Virtual Academy",
      date: "02 July 2025 – 12 August 2025",
      duration: "6 Weeks",
      credentialId: "NIELIT-CYB-2025-08",
      verificationUrl: "https://nielit.gov.in",
      pdfPlaceholder: "/public/resumes/NIELIT_Cybersecurity_Certificate.pdf",
      published: true
    },
    {
      id: "ibm-python",
      title: "PY0101EN: Python Basics for Data Science",
      issuer: "IBM / edX",
      date: "Issued May 16, 2022",
      credentialId: "IBM-PY-2022-16",
      verificationUrl: "https://edx.org",
      pdfPlaceholder: "/public/resumes/IBM_Python_Certificate.pdf",
      published: true
    },
    {
      id: "usmx-marketing",
      title: "ENES462x: Marketing Innovative Products and Services",
      issuer: "USMx / University System of Maryland (edX)",
      date: "Issued January 22, 2023",
      credentialId: "USMX-ENES-2023-22",
      verificationUrl: "https://edx.org",
      pdfPlaceholder: "/public/resumes/USMx_Innovation_Certificate.pdf",
      published: true
    }
  ],
  experience: [
    {
      id: "nielit-exp",
      role: "Cybersecurity Intern",
      organization: "NIELIT Virtual Academy",
      period: "July 2025 – August 2025",
      type: "Online Internship Program in Cyber Security (6 Weeks)",
      location: "Virtual / Remote",
      responsibilities: [
        "Conducted vulnerability analysis and security assessments across simulated architectures.",
        "Evaluated TLS/SSL and HTTPS protocol implementations for cryptographic strengths.",
        "Studied network defense mechanisms, threat modelling methodologies, and risk assessment workflows.",
        "Documented security findings, drafted mitigation recommendations, and prepared structured reports.",
        "Completed assignments aligned with OWASP and NIST security guidelines through independent remote work."
      ],
      frameworks: ["OWASP", "NIST", "TLS/SSL", "Threat Modelling", "Vulnerability Assessment"]
    }
  ],
  education: [
    {
      id: "edu-msc",
      degree: "M.Sc. in IT Cybersecurity",
      institution: "MAKAUT (Maulana Abul Kalam Azad University of Technology)",
      period: "2024 – 2026",
      score: "8.04 / 10",
      scoreLabel: "CGPA",
      highlights: [
        "Advanced academic coursework in cryptographic principles, secure network architectures, and risk analysis.",
        "Conducted major research project on machine learning-based log anomaly detection."
      ],
      areas: ["Cryptography", "Network Security", "Risk Analysis", "Secure System Design", "Vulnerability Assessment"]
    },
    {
      id: "edu-bca",
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "NSHM Knowledge Campus",
      period: "2020 – 2023",
      score: "8.95 / 10",
      scoreLabel: "SGPA / Aggregate",
      highlights: [
        "Led the BCA capstone project team to on-time delivery of a functional retail management application.",
        "Strong foundation in data structures, database management systems, and software engineering principles."
      ],
      areas: ["Data Structures", "Database Systems", "Software Engineering", "Web Technologies"]
    }
  ],
  skills: [
    {
      id: "skill-sec-ops",
      title: "Security Operations & Monitoring",
      description: "Detecting and investigating anomalous system and network activities.",
      skills: [
        "Security Event Monitoring",
        "Alert Triage",
        "Incident Detection",
        "Incident Logging",
        "Log Analysis",
        "Anomaly Detection",
        "SIEM Concepts",
        "False-Positive Reduction"
      ]
    },
    {
      id: "skill-vuln",
      title: "Vulnerability & Risk",
      description: "Identifying security weaknesses and applying structured mitigation frameworks.",
      skills: [
        "Vulnerability Assessment",
        "Risk Assessment",
        "Threat Modelling",
        "Security Documentation",
        "Security Policy Review",
        "Secure-by-Design Principles"
      ]
    },
    {
      id: "skill-frameworks",
      title: "Frameworks & Standards",
      description: "Familiarity with industry security standards and academic threat frameworks.",
      skills: [
        "OWASP Top 10",
        "NIST Cybersecurity Framework",
        "CIA Triad",
        "ISO/IEC 27001 Awareness",
        "MITRE ATT&CK (academic)"
      ]
    },
    {
      id: "skill-net",
      title: "Networking",
      description: "Core networking protocols and defensive infrastructure concepts.",
      skills: [
        "TCP/IP",
        "DNS",
        "HTTP/HTTPS",
        "TLS/SSL",
        "Firewalls",
        "IDS/IPS Fundamentals"
      ]
    },
    {
      id: "skill-access",
      title: "Access & Security Controls",
      description: "Foundational user permissioning and authorization controls.",
      skills: [
        "Identity & Access Management concepts",
        "Role-Based Access Control",
        "Least-Privilege Awareness"
      ]
    },
    {
      id: "skill-prog",
      title: "Programming & Technology",
      description: "Languages, data libraries, and tools used for security and software projects.",
      skills: [
        "Python",
        "SQL",
        "Pandas",
        "NumPy",
        "Scikit-learn",
        "Flask",
        "Firebase",
        "Git",
        "Linux/Unix",
        "Windows"
      ]
    }
  ],
  securityPractices: [
    {
      title: "Vulnerability Assessment",
      description: "Analyzing TLS/SSL configurations, HTTPS enforcement, and network defense postures to uncover security gaps.",
      icon: "ShieldAlert"
    },
    {
      title: "Threat Modelling",
      description: "Systematic identification of security risks, threat vectors, and implementation of secure-by-design principles.",
      icon: "Cpu"
    },
    {
      title: "Security Documentation",
      description: "Producing clear security findings, actionable mitigation recommendations, and structured incident reports.",
      icon: "FileText"
    },
    {
      title: "Network Security",
      description: "Applying foundational knowledge of TCP/IP, DNS, HTTP/HTTPS, TLS/SSL, firewalls, and IDS/IPS fundamentals.",
      icon: "Network"
    }
  ],
  resumes: [
    {
      id: "cybersecurity",
      title: "Cybersecurity Resume",
      targetRoles: "SOC Analyst, Security Analyst, Cybersecurity Analyst, Security Engineer",
      description: "Tailored to highlight M.Sc. Cybersecurity coursework, NIELIT internship, SIEM-style ML log anomaly project, and security frameworks (NIST, OWASP).",
      pdfPath: "/public/resumes/Ayush_Dutta_Cybersecurity_CV.pdf",
      published: true
    },
    {
      id: "general",
      title: "General Technology Resume",
      targetRoles: "IT, Data Analysis, Operations, Support, Technology roles",
      description: "Broad technology profile emphasizing Python, data science basics, BCA capstone project, system support, and documentation skills.",
      pdfPath: "/public/resumes/Ayush_Dutta_General_CV.pdf",
      published: true
    }
  ]
};

// In-memory cache & fallback state
let cachedPortfolioData: PortfolioDatabase = { ...initialPortfolioData };

export const getPortfolioData = (): PortfolioDatabase => {
  return cachedPortfolioData;
};

export const getPublishedResumes = (): ResumeItem[] => {
  const resumes = cachedPortfolioData.resumes || [];
  return resumes.filter(r => r.published === true);
};

export const getActivePublishedResume = (): ResumeItem | null => {
  const published = getPublishedResumes();
  if (published.length > 0) {
    return published[0];
  }
  return null;
};

// Fetch data from Supabase asynchronously
export const fetchPortfolioDataFromSupabase = async (): Promise<PortfolioDatabase> => {
  if (!isSupabaseConfigured()) {
    return initialPortfolioData;
  }

  try {
    const [
      settingsRes,
      projectsRes,
      certRes,
      expRes,
      eduRes,
      skillsRes,
      secRes,
      resumesRes
    ] = await Promise.all([
      supabase.from('site_settings').select('*').limit(1),
      supabase.from('projects').select('*'),
      supabase.from('certifications').select('*'),
      supabase.from('experience').select('*'),
      supabase.from('education').select('*'),
      supabase.from('skills').select('*'),
      supabase.from('security_practices').select('*'),
      supabase.from('resumes').select('*')
    ]);

    const settings = settingsRes.data && settingsRes.data[0] ? {
      name: settingsRes.data[0].name,
      title: settingsRes.data[0].title,
      location: settingsRes.data[0].location,
      email: settingsRes.data[0].email,
      phone: settingsRes.data[0].phone,
      linkedin: settingsRes.data[0].linkedin,
      github: settingsRes.data[0].github,
      status: settingsRes.data[0].status,
      shortBio: settingsRes.data[0].short_bio,
      aboutSummary: settingsRes.data[0].about_summary,
      focusAreas: settingsRes.data[0].focus_areas || []
    } : initialPortfolioData.personal;

    const projects: Project[] = (projectsRes.data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      status: p.status,
      featured: p.featured,
      published: p.published,
      label: p.label,
      badge: p.badge,
      shortDescription: p.short_description,
      fullDescription: p.full_description,
      description: p.description,
      technologies: p.technologies || [],
      capabilities: p.capabilities || [],
      metrics: p.metrics || [],
      architectureSteps: p.architecture_steps || [],
      caseStudy: p.case_study || {},
      githubUrl: p.github_url,
      demoUrl: p.demo_url,
      date: p.date,
      role: p.role,
      isFlagship: p.is_flagship
    }));

    const certifications: Certification[] = (certRes.data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      duration: c.duration,
      credentialId: c.credential_id,
      verificationUrl: c.verification_url,
      pdfPlaceholder: c.pdf_placeholder,
      published: c.published
    }));

    const experience: ExperienceItem[] = (expRes.data || []).map((e: any) => ({
      id: e.id,
      role: e.role,
      organization: e.organization,
      period: e.period,
      type: e.type,
      location: e.location,
      responsibilities: e.responsibilities || [],
      frameworks: e.frameworks || []
    }));

    const education: EducationItem[] = (eduRes.data || []).map((ed: any) => ({
      id: ed.id,
      degree: ed.degree,
      institution: ed.institution,
      period: ed.period,
      score: ed.score,
      scoreLabel: ed.score_label,
      highlights: ed.highlights || [],
      areas: ed.areas || []
    }));

    const skills: SkillCategory[] = (skillsRes.data || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      skills: s.skills || []
    }));

    const securityPractices = (secRes.data || []).length > 0 ? secRes.data.map((sp: any) => ({
      title: sp.title,
      description: sp.description,
      icon: sp.icon
    })) : initialPortfolioData.securityPractices;

    const resumes: ResumeItem[] = (resumesRes.data || []).length > 0 ? (resumesRes.data as Array<{
      id: string;
      title: string;
      target_roles: string;
      description: string;
      pdf_path: string;
      published?: boolean;
    }>).map((r) => ({
      id: r.id,
      title: r.title,
      targetRoles: r.target_roles,
      description: r.description,
      pdfPath: r.pdf_path,
      published: r.published ?? true
    })) : initialPortfolioData.resumes;

    cachedPortfolioData = {
      personal: settings,
      about: {
        summary: settings.aboutSummary,
        focusAreas: settings.focusAreas
      },
      projects: projects.length > 0 ? projects : initialPortfolioData.projects,
      certifications: certifications.length > 0 ? certifications : initialPortfolioData.certifications,
      experience: experience.length > 0 ? experience : initialPortfolioData.experience,
      education: education.length > 0 ? education : initialPortfolioData.education,
      skills: skills.length > 0 ? skills : initialPortfolioData.skills,
      securityPractices,
      resumes
    };

    window.dispatchEvent(new Event('portfolio_updated'));
    return cachedPortfolioData;
  } catch (err) {
    console.error("Error fetching from Supabase, using fallback:", err);
    return initialPortfolioData;
  }
};

// Database Mutation Helpers (Admin operations)
export const saveProjectToSupabase = async (project: Project): Promise<void> => {
  if (!isSupabaseConfigured()) {
    // Local fallback for prototyping
    const idx = cachedPortfolioData.projects.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      cachedPortfolioData.projects[idx] = project;
    } else {
      cachedPortfolioData.projects.unshift(project);
    }
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('projects').upsert({
    id: project.id,
    title: project.title,
    category: project.category,
    status: project.status,
    featured: project.featured,
    published: project.published,
    label: project.label,
    badge: project.badge,
    short_description: project.shortDescription,
    full_description: project.fullDescription,
    description: project.description,
    technologies: project.technologies,
    capabilities: project.capabilities,
    metrics: project.metrics,
    architecture_steps: project.architectureSteps,
    case_study: project.caseStudy,
    github_url: project.githubUrl,
    demo_url: project.demoUrl,
    date: project.date,
    role: project.role,
    is_flagship: project.isFlagship,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const deleteProjectFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    cachedPortfolioData.projects = cachedPortfolioData.projects.filter(p => p.id !== id);
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const saveCertificationToSupabase = async (cert: Certification): Promise<void> => {
  if (!isSupabaseConfigured()) {
    const idx = cachedPortfolioData.certifications.findIndex(c => c.id === cert.id);
    if (idx >= 0) cachedPortfolioData.certifications[idx] = cert;
    else cachedPortfolioData.certifications.unshift(cert);
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('certifications').upsert({
    id: cert.id,
    title: cert.title,
    issuer: cert.issuer,
    date: cert.date,
    duration: cert.duration,
    credential_id: cert.credentialId,
    verification_url: cert.verificationUrl,
    pdf_placeholder: cert.pdfPlaceholder,
    published: cert.published,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const deleteCertificationFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    cachedPortfolioData.certifications = cachedPortfolioData.certifications.filter(c => c.id !== id);
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('certifications').delete().eq('id', id);
  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const saveExperienceToSupabase = async (exp: ExperienceItem): Promise<void> => {
  if (!isSupabaseConfigured()) {
    const idx = cachedPortfolioData.experience.findIndex(e => e.id === exp.id);
    if (idx >= 0) cachedPortfolioData.experience[idx] = exp;
    else cachedPortfolioData.experience.unshift(exp);
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('experience').upsert({
    id: exp.id,
    role: exp.role,
    organization: exp.organization,
    period: exp.period,
    type: exp.type,
    location: exp.location,
    responsibilities: exp.responsibilities,
    frameworks: exp.frameworks,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const deleteExperienceFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    cachedPortfolioData.experience = cachedPortfolioData.experience.filter(e => e.id !== id);
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const saveEducationToSupabase = async (edu: EducationItem): Promise<void> => {
  if (!isSupabaseConfigured()) {
    const idx = cachedPortfolioData.education.findIndex(e => e.id === edu.id);
    if (idx >= 0) cachedPortfolioData.education[idx] = edu;
    else cachedPortfolioData.education.unshift(edu);
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('education').upsert({
    id: edu.id,
    degree: edu.degree,
    institution: edu.institution,
    period: edu.period,
    score: edu.score,
    score_label: edu.scoreLabel,
    highlights: edu.highlights,
    areas: edu.areas,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const deleteEducationFromSupabase = async (id: string): Promise<void> => {
  if (!isSupabaseConfigured()) {
    cachedPortfolioData.education = cachedPortfolioData.education.filter(e => e.id !== id);
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('education').delete().eq('id', id);
  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const saveSiteSettingsToSupabase = async (settings: SiteSettings): Promise<void> => {
  if (!isSupabaseConfigured()) {
    cachedPortfolioData.personal = settings;
    cachedPortfolioData.about.summary = settings.aboutSummary;
    cachedPortfolioData.about.focusAreas = settings.focusAreas;
    window.dispatchEvent(new Event('portfolio_updated'));
    return;
  }

  const { error } = await supabase.from('site_settings').upsert({
    id: '00000000-0000-0000-0000-000000000001',
    name: settings.name,
    title: settings.title,
    location: settings.location,
    email: settings.email,
    phone: settings.phone,
    linkedin: settings.linkedin,
    github: settings.github,
    status: settings.status,
    short_bio: settings.shortBio,
    about_summary: settings.aboutSummary,
    focus_areas: settings.focusAreas,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
  await fetchPortfolioDataFromSupabase();
};

export const saveResumeToSupabase = async (resume: ResumeItem): Promise<void> => {
  // Update local cache optimistically
  if (resume.published) {
    cachedPortfolioData.resumes = (cachedPortfolioData.resumes || []).map(r => ({
      ...r,
      published: r.id === resume.id
    }));
  }
  const idx = (cachedPortfolioData.resumes || []).findIndex(r => r.id === resume.id);
  if (idx >= 0) cachedPortfolioData.resumes[idx] = resume;
  else cachedPortfolioData.resumes.unshift(resume);
  window.dispatchEvent(new Event('portfolio_updated'));

  if (!isSupabaseConfigured()) {
    return;
  }

  // If publishing this resume, unpublish all others to maintain exactly one active published resume
  if (resume.published) {
    const { error: unpubError } = await supabase
      .from('resumes')
      .update({ published: false })
      .neq('id', resume.id);

    if (unpubError) {
      console.warn('Warning: Could not unpublish other resumes:', unpubError);
    }
  }

  const { error } = await supabase.from('resumes').upsert({
    id: resume.id,
    title: resume.title,
    target_roles: resume.targetRoles,
    description: resume.description,
    pdf_path: resume.pdfPath,
    published: resume.published ?? false
  });

  if (error) {
    console.error('Error saving resume to Supabase:', error);
    throw new Error(error.message || 'Failed to save resume record.');
  }

  await fetchPortfolioDataFromSupabase();
};

export const setPublishedResumeInSupabase = async (id: string): Promise<void> => {
  // Update local cache immediately
  cachedPortfolioData.resumes = (cachedPortfolioData.resumes || []).map(r => ({
    ...r,
    published: r.id === id
  }));
  window.dispatchEvent(new Event('portfolio_updated'));

  if (!isSupabaseConfigured()) {
    return;
  }

  // Optional: Try atomic database RPC function if installed
  try {
    const { error: rpcError } = await supabase.rpc('set_published_resume', { p_resume_id: id });
    if (!rpcError) {
      await fetchPortfolioDataFromSupabase();
      return;
    }
  } catch {
    // If RPC function does not exist in the database, seamlessly proceed with direct REST queries
  }

  // Step 1: Unpublish all other resumes
  const { error: unpubError } = await supabase
    .from('resumes')
    .update({ published: false })
    .neq('id', id);

  if (unpubError) {
    console.error('Error unpublishing other resumes:', unpubError);
    throw new Error(unpubError.message || 'Failed to unpublish other resumes.');
  }

  // Step 2: Publish target resume
  const { error: pubError } = await supabase
    .from('resumes')
    .update({ published: true })
    .eq('id', id);

  if (pubError) {
    console.error('Error setting active published resume:', pubError);
    throw new Error(pubError.message || 'Failed to publish selected resume.');
  }

  // Step 3: Refresh local state from database
  await fetchPortfolioDataFromSupabase();
};

export const deleteResumeFromSupabase = async (id: string): Promise<void> => {
  // Update local cache optimistically
  cachedPortfolioData.resumes = (cachedPortfolioData.resumes || []).filter(r => r.id !== id);
  window.dispatchEvent(new Event('portfolio_updated'));

  if (!isSupabaseConfigured()) {
    return;
  }

  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) {
    console.error('Error deleting resume:', error);
    throw new Error(error.message || 'Failed to delete resume record.');
  }

  await fetchPortfolioDataFromSupabase();
};

// Strict bucket validation rules for service-level security
interface BucketValidationRule {
  allowedExts: string[];
  allowedMimes: string[];
  description: string;
}

const BUCKET_RULES: Record<'projects' | 'certificates' | 'resumes' | 'profile', BucketValidationRule> = {
  resumes: {
    allowedExts: ['pdf'],
    allowedMimes: ['application/pdf'],
    description: 'PDF documents only (.pdf)'
  },
  certificates: {
    allowedExts: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
    allowedMimes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    description: 'PDF or image files (.pdf, .jpg, .jpeg, .png, .webp)'
  },
  projects: {
    allowedExts: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    description: 'Image files only (.jpg, .jpeg, .png, .webp, .gif)'
  },
  profile: {
    allowedExts: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    description: 'Image files only (.jpg, .jpeg, .png, .webp, .gif)'
  }
};

// Secure File Upload with Strict Bucket-Specific Allowlist Validation
export const uploadFileToSupabase = async (
  file: File,
  bucket: 'projects' | 'certificates' | 'resumes' | 'profile'
): Promise<string> => {
  // Validate file presence and size (max 10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (!file || file.size <= 0) {
    throw new Error('Invalid file provided.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 10MB limit.');
  }

  // Retrieve bucket validation rule
  const rule = BUCKET_RULES[bucket];
  if (!rule) {
    throw new Error(`Unsupported storage bucket: ${bucket}`);
  }

  // Validate extension
  const rawParts = file.name.split('.');
  if (rawParts.length < 2) {
    throw new Error('Files must have a valid file extension.');
  }
  const rawExt = rawParts.pop()?.toLowerCase() || '';
  const sanitizedExt = rawExt.replace(/[^a-z0-9]/g, '');

  if (!sanitizedExt || !rule.allowedExts.includes(sanitizedExt)) {
    throw new Error(`Invalid file type for ${bucket}. Required: ${rule.description}`);
  }

  // Validate MIME type against allowed list
  const fileMime = file.type ? file.type.toLowerCase().trim() : '';
  if (fileMime && !rule.allowedMimes.includes(fileMime)) {
    throw new Error(`Invalid MIME type (${fileMime}) for ${bucket}. Required: ${rule.description}`);
  }

  // Verify consistency between extension and MIME family
  if (sanitizedExt === 'pdf' && fileMime && fileMime !== 'application/pdf') {
    throw new Error('File extension (.pdf) does not match MIME type.');
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(sanitizedExt) && fileMime && !fileMime.startsWith('image/')) {
    throw new Error('Image file extension does not match image MIME type.');
  }

  const sanitizedName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${sanitizedExt}`;
  const filePath = `${sanitizedName}`;

  if (!isSupabaseConfigured()) {
    // Return local object URL for prototype preview if Supabase is not configured
    return URL.createObjectURL(file);
  }

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error(`Error uploading file to bucket ${bucket}:`, uploadError);
    throw new Error(uploadError.message || `Failed to upload file to ${bucket}.`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

// Admin Authorization check via Supabase Auth & admin_users table
export const verifyAdminUser = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    // If not configured, check if localStorage has fallback auth for offline prototype testing
    try {
      return localStorage.getItem('ayush_dutta_admin_auth_v1') === 'true';
    } catch {
      return false;
    }
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return false;

    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    return !error && Boolean(data);
  } catch {
    return false;
  }
};
