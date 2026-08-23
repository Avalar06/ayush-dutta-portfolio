-- Initial Seed Data
-- 003_seed_data.sql

-- Site Settings
insert into site_settings (
  id, name, title, location, email, phone, linkedin, github, status, short_bio, about_summary, focus_areas
) values (
  '00000000-0000-0000-0000-000000000001',
  'Ayush Dutta',
  'Cybersecurity | Security Monitoring | Applied Machine Learning',
  'Bardhaman, West Bengal, India',
  'Dayush849@gmail.com',
  '+91-6297110058',
  'https://linkedin.com/in/ayushdutta',
  'https://github.com/ayushdutta-sec',
  'Entry-Level Cybersecurity / IT Opportunities',
  'Cybersecurity-focused technology professional building practical security monitoring, anomaly detection, and data-driven solutions.',
  'Ayush Dutta is a cybersecurity-focused graduate with a Bachelor of Computer Applications and an M.Sc. in IT Cybersecurity. He has hands-on experience through independent technical projects and a structured cybersecurity internship.',
  '["Security monitoring & alert triage", "Log analysis & anomaly detection", "Threat and vulnerability identification", "Incident documentation & risk assessment", "Network security fundamentals", "Applied machine learning & Python automation"]'::jsonb
) on conflict (id) do nothing;

-- Projects
insert into projects (
  id, title, category, status, featured, published, label, badge, short_description, full_description, description, technologies, capabilities, metrics, architecture_steps, case_study, github_url, demo_url, date, role, is_flagship
) values (
  'log-anomaly-detection',
  'Adaptive ML-Based Log Anomaly Detection System',
  'Cybersecurity',
  'Completed',
  true,
  true,
  'Major M.Sc. Research Project | MAKAUT',
  'SIEM-Style Security Monitoring',
  'An end-to-end machine-learning-driven security monitoring system designed to ingest system logs, detect anomalies, visualize alerts, and incorporate analyst feedback into an adaptive retraining pipeline.',
  'An end-to-end machine-learning-driven security monitoring system designed to ingest system logs, perform feature engineering and anomaly detection, visualize security events, and incorporate analyst feedback into an adaptive retraining pipeline.',
  'An end-to-end machine-learning-driven security monitoring system designed to ingest system logs, perform feature engineering and anomaly detection, visualize security events, and incorporate analyst feedback into an adaptive retraining pipeline.',
  '["Python", "Pandas", "NumPy", "Scikit-learn", "TF-IDF", "Random Forest", "Logistic Regression", "Linear SVM", "Isolation Forest", "Flask", "Chart.js", "Plotly", "Git", "Linux/Unix"]'::jsonb,
  '["Live log ingestion", "Uploaded log analysis", "Log parsing", "Feature engineering", "TF-IDF vectorization", "Structured security features", "ML-based anomaly detection", "Confidence scoring", "Alert monitoring", "False-positive analysis", "Analyst feedback", "Adaptive model retraining", "Validation gates", "Retraining history", "Visualization dashboard"]'::jsonb,
  '[{"label": "Accuracy", "value": "~96%", "subtext": "Experimental validation result"}, {"label": "ROC-AUC", "value": "0.98", "subtext": "Model discrimination score"}, {"label": "Models Evaluated", "value": "4", "subtext": "Logreg, SVM, IsoForest, RF"}, {"label": "Validation", "value": "5-Fold", "subtext": "Cross-validation scheme"}]'::jsonb,
  '[{"step": "Log Sources", "description": "System logs, authentication logs, and network event streams."}, {"step": "Log Collection", "description": "Aggregating raw log files and real-time stream inputs."}, {"step": "Log Parsing", "description": "Extracting timestamps, IPs, user agents, and status codes."}, {"step": "Data Cleaning", "description": "Handling missing values and normalizing text formats."}, {"step": "Feature Engineering", "description": "Extracting quantitative behavioral and temporal attributes."}, {"step": "TF-IDF + Structured Features", "description": "Combining term frequency-inverse document frequency vectorization with parsed numeric features."}, {"step": "ML Detection", "description": "Evaluating logs through supervised and unsupervised models."}, {"step": "Confidence Scoring", "description": "Computing calibrated anomaly probability scores."}, {"step": "Security Alert", "description": "Generating triage-ready alerts for security analysts."}, {"step": "Analyst Feedback", "description": "Recording true vs. false positive determinations."}, {"step": "Validation", "description": "Passing retrained weights through rigorous validation gates."}, {"step": "Adaptive Retraining", "description": "Updating operational model parameters iteratively."}]'::jsonb,
  '{"problem": "Traditional rule-based monitoring can generate large numbers of alerts and may struggle with complex or evolving log patterns without constant manual rule tuning.", "approach": "Combines log processing, structured features, TF-IDF representation, supervised and unsupervised machine learning, confidence calibration, visualization, and feedback-driven retraining.", "modelsEvaluated": ["Logistic Regression (baseline linear classification)", "Linear SVM (margin-based separation)", "Isolation Forest (unsupervised outlier isolation)", "Random Forest (ensemble decision trees for robust non-linear patterns)"], "finalModel": "Random Forest model was selected and calibrated for the final pipeline due to superior recall and stable ROC-AUC performance.", "dashboard": "Built using Flask, Chart.js, and Plotly to provide live security event monitoring, filter alerts by confidence, and review log anomalies.", "adaptiveFeedback": "Analyst feedback is captured and fed into an offline retraining loop guarded by validation criteria before model promotion."}'::jsonb,
  'https://github.com/ayushdutta-sec/log-anomaly-detector',
  'https://github.com/ayushdutta-sec/log-anomaly-detector',
  '2025 – 2026',
  'Lead Researcher & Developer',
  true
),
(
  'grocery-store-management',
  'Grocery Store Management System',
  'Web',
  'Completed',
  false,
  true,
  'BCA Capstone Project | NSHM Knowledge Campus',
  'Full-Stack Application & Data Integrity',
  'A comprehensive management application focused on requirements gathering, team coordination, secure record maintenance, role-based access control, and data validation.',
  'A comprehensive management application focused on requirements gathering, team coordination, secure record maintenance, role-based access control, and data validation.',
  'A comprehensive management application focused on requirements gathering, team coordination, secure record maintenance, role-based access control, and data validation.',
  '["JavaScript", "HTML/CSS", "Firebase", "Firestore", "Authentication", "Git"]'::jsonb,
  '["Requirements gathering & team coordination", "Application development & data-entry workflows", "Record maintenance & inventory tracking", "Data validation & sanitization", "Role-based access control (RBAC)", "Firebase security rules implementation"]'::jsonb,
  '[{"label": "Process Time", "value": "-40%", "subtext": "Reduction in manual processing time"}, {"label": "Data Integrity", "value": "100%", "subtext": "Enforced via Firebase security rules"}]'::jsonb,
  '[]'::jsonb,
  '{"problem": "Local retail management faced inefficiencies in inventory tracking, manual billing record errors, and lack of role-based permissions.", "approach": "Led a student team through end-to-end SDLC, designing structured data schemas in Firestore and enforcing strict security rules.", "finalModel": "Successfully deployed inventory and sales tracking module reducing manual processing time by approximately 40%."}'::jsonb,
  'https://github.com/ayushdutta-sec/grocery-management',
  'https://github.com/ayushdutta-sec/grocery-management',
  '2023',
  'Project Lead & Full-Stack Developer',
  false
)
on conflict (id) do nothing;

-- Certifications
insert into certifications (
  id, title, issuer, date, duration, credential_id, verification_url, pdf_placeholder, published
) values (
  'nielit-cert',
  'Online Internship Program in Cyber Security',
  'NIELIT Virtual Academy',
  '02 July 2025 – 12 August 2025',
  '6 Weeks',
  'NIELIT-CYB-2025-08',
  'https://nielit.gov.in',
  '/public/resumes/NIELIT_Cybersecurity_Certificate.pdf',
  true
),
(
  'ibm-python',
  'PY0101EN: Python Basics for Data Science',
  'IBM / edX',
  'Issued May 16, 2022',
  null,
  'IBM-PY-2022-16',
  'https://edx.org',
  '/public/resumes/IBM_Python_Certificate.pdf',
  true
),
(
  'usmx-marketing',
  'ENES462x: Marketing Innovative Products and Services',
  'USMx / University System of Maryland (edX)',
  'Issued January 22, 2023',
  null,
  'USMX-ENES-2023-22',
  'https://edx.org',
  '/public/resumes/USMx_Innovation_Certificate.pdf',
  true
)
on conflict (id) do nothing;

-- Experience
insert into experience (
  id, role, organization, period, type, location, responsibilities, frameworks, published
) values (
  'nielit-exp',
  'Cybersecurity Intern',
  'NIELIT Virtual Academy',
  'July 2025 – August 2025',
  'Online Internship Program in Cyber Security (6 Weeks)',
  'Virtual / Remote',
  '["Conducted vulnerability analysis and security assessments across simulated architectures.", "Evaluated TLS/SSL and HTTPS protocol implementations for cryptographic strengths.", "Studied network defense mechanisms, threat modelling methodologies, and risk assessment workflows.", "Documented security findings, drafted mitigation recommendations, and prepared structured reports.", "Completed assignments aligned with OWASP and NIST security guidelines through independent remote work."]'::jsonb,
  '["OWASP", "NIST", "TLS/SSL", "Threat Modelling", "Vulnerability Assessment"]'::jsonb,
  true
)
on conflict (id) do nothing;

-- Education
insert into education (
  id, degree, institution, period, score, score_label, highlights, areas, published
) values (
  'edu-msc',
  'M.Sc. in IT Cybersecurity',
  'MAKAUT (Maulana Abul Kalam Azad University of Technology)',
  '2024 – 2026',
  '8.04 / 10',
  'CGPA',
  '["Advanced academic coursework in cryptographic principles, secure network architectures, and risk analysis.", "Conducted major research project on machine learning-based log anomaly detection."]'::jsonb,
  '["Cryptography", "Network Security", "Risk Analysis", "Secure System Design", "Vulnerability Assessment"]'::jsonb,
  true
),
(
  'edu-bca',
  'Bachelor of Computer Applications (BCA)',
  'NSHM Knowledge Campus',
  '2020 – 2023',
  '8.95 / 10',
  'SGPA / Aggregate',
  '["Led the BCA capstone project team to on-time delivery of a functional retail management application.", "Strong foundation in data structures, database management systems, and software engineering principles."]'::jsonb,
  '["Data Structures", "Database Systems", "Software Engineering", "Web Technologies"]'::jsonb,
  true
)
on conflict (id) do nothing;

-- Skills
insert into skills (
  id, title, description, skills, published
) values (
  'skill-sec-ops',
  'Security Operations & Monitoring',
  'Detecting and investigating anomalous system and network activities.',
  '["Security Event Monitoring", "Alert Triage", "Incident Detection", "Incident Logging", "Log Analysis", "Anomaly Detection", "SIEM Concepts", "False-Positive Reduction"]'::jsonb,
  true
),
(
  'skill-vuln',
  'Vulnerability & Risk',
  'Identifying security weaknesses and applying structured mitigation frameworks.',
  '["Vulnerability Assessment", "Risk Assessment", "Threat Modelling", "Security Documentation", "Security Policy Review", "Secure-by-Design Principles"]'::jsonb,
  true
),
(
  'skill-frameworks',
  'Frameworks & Standards',
  'Familiarity with industry security standards and academic threat frameworks.',
  '["OWASP Top 10", "NIST Cybersecurity Framework", "CIA Triad", "ISO/IEC 27001 Awareness", "MITRE ATT&CK (academic)"]'::jsonb,
  true
),
(
  'skill-net',
  'Networking',
  'Core networking protocols and defensive infrastructure concepts.',
  '["TCP/IP", "DNS", "HTTP/HTTPS", "TLS/SSL", "Firewalls", "IDS/IPS Fundamentals"]'::jsonb,
  true
),
(
  'skill-access',
  'Access & Security Controls',
  'Foundational user permissioning and authorization controls.',
  '["Identity & Access Management concepts", "Role-Based Access Control", "Least-Privilege Awareness"]'::jsonb,
  true
),
(
  'skill-prog',
  'Programming & Technology',
  'Languages, data libraries, and tools used for security and software projects.',
  '["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Flask", "Firebase", "Git", "Linux/Unix", "Windows"]'::jsonb,
  true
)
on conflict (id) do nothing;

-- Security Practices
insert into security_practices (
  title, description, icon, published
) values (
  'Vulnerability Assessment',
  'Analyzing TLS/SSL configurations, HTTPS enforcement, and network defense postures to uncover security gaps.',
  'ShieldAlert',
  true
),
(
  'Threat Modelling',
  'Systematic identification of security risks, threat vectors, and implementation of secure-by-design principles.',
  'Cpu',
  true
),
(
  'Security Documentation',
  'Producing clear security findings, actionable mitigation recommendations, and structured incident reports.',
  'FileText',
  true
),
(
  'Network Security',
  'Applying foundational knowledge of TCP/IP, DNS, HTTP/HTTPS, TLS/SSL, firewalls, and IDS/IPS fundamentals.',
  'Network',
  true
);

-- Resumes
insert into resumes (
  id, title, target_roles, description, pdf_path, published
) values (
  'cybersecurity',
  'Cybersecurity Resume',
  'SOC Analyst, Security Analyst, Cybersecurity Analyst, Security Engineer',
  'Tailored to highlight M.Sc. Cybersecurity coursework, NIELIT internship, SIEM-style ML log anomaly project, and security frameworks (NIST, OWASP).',
  '/public/resumes/Ayush_Dutta_Cybersecurity_CV.pdf',
  true
),
(
  'general',
  'General Technology Resume',
  'IT, Data Analysis, Operations, Support, Technology roles',
  'Broad technology profile emphasizing Python, data science basics, BCA capstone project, system support, and documentation skills.',
  '/public/resumes/Ayush_Dutta_General_CV.pdf',
  true
)
on conflict (id) do nothing;
