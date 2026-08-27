-- ============================================================================
-- Ayush Dutta Portfolio - Combined Initial Database Setup & Migration
-- File: supabase/migrations/000_combined_portfolio_setup.sql
-- ============================================================================
-- This script initializes an empty Supabase project with:
-- 1. UUID extension
-- 2. Database schema (tables & foreign keys)
-- 3. Performance indexes
-- 4. SECURITY DEFINER helper function for admin authorization
-- 5. Row Level Security (RLS) enablement & idempotent policies
-- 6. Initial seed data (projects, certifications, experience, education, skills, practices, resumes, site settings)
-- 7. Supabase Storage buckets & storage RLS policies
-- ============================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 2. TABLES CREATION
-- ============================================================================

-- Site Settings (Singleton configuration)
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  title text not null,
  location text not null,
  email text not null,
  phone text not null,
  linkedin text not null,
  github text not null,
  status text not null,
  short_bio text not null,
  about_summary text not null,
  focus_areas jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects Table
create table if not exists projects (
  id text primary key,
  title text not null,
  category text not null check (category in ('Cybersecurity', 'AI / ML', 'Web', 'Data', 'Other')),
  status text not null check (status in ('Completed', 'In Progress', 'Research', 'Archived')),
  featured boolean default false,
  published boolean default true,
  label text not null,
  badge text,
  short_description text not null,
  full_description text,
  description text not null,
  technologies jsonb default '[]'::jsonb,
  capabilities jsonb default '[]'::jsonb,
  metrics jsonb default '[]'::jsonb,
  architecture_steps jsonb default '[]'::jsonb,
  case_study jsonb default '{}'::jsonb,
  github_url text,
  demo_url text,
  date text,
  role text,
  is_flagship boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Certifications Table
create table if not exists certifications (
  id text primary key,
  title text not null,
  issuer text not null,
  date text not null,
  duration text,
  credential_id text,
  verification_url text,
  pdf_placeholder text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Experience Table
create table if not exists experience (
  id text primary key,
  role text not null,
  organization text not null,
  period text not null,
  type text not null,
  location text,
  responsibilities jsonb default '[]'::jsonb,
  frameworks jsonb default '[]'::jsonb,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Education Table
create table if not exists education (
  id text primary key,
  degree text not null,
  institution text not null,
  period text not null,
  score text not null,
  score_label text not null,
  highlights jsonb default '[]'::jsonb,
  areas jsonb default '[]'::jsonb,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills Table
create table if not exists skills (
  id text primary key,
  title text not null,
  description text not null,
  skills jsonb default '[]'::jsonb,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Security Practices Table
create table if not exists security_practices (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Resumes Table
create table if not exists resumes (
  id text primary key,
  title text not null,
  target_roles text not null,
  description text not null,
  pdf_path text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admin Users Table (explicit database-enforced admin authorization)
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- 3. INDEXES CREATION
-- ============================================================================
create index if not exists idx_projects_published on projects(published);
create index if not exists idx_projects_category on projects(category);
create index if not exists idx_certifications_published on certifications(published);
create index if not exists idx_experience_published on experience(published);
create index if not exists idx_education_published on education(published);
create index if not exists idx_skills_published on skills(published);

-- ============================================================================
-- 4. SECURITY DEFINER HELPER FUNCTION
-- ============================================================================
create or replace function fn_is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
end;
$$ language plpgsql security definer set search_path = public, auth;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) ENABLEMENT & POLICIES
-- ============================================================================

alter table site_settings enable row level security;
alter table projects enable row level security;
alter table certifications enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table skills enable row level security;
alter table security_practices enable row level security;
alter table resumes enable row level security;
alter table admin_users enable row level security;

-- Drop existing policies if any (for idempotency)
drop policy if exists "Public can view site settings" on site_settings;
drop policy if exists "Admins can modify site settings" on site_settings;

drop policy if exists "Public can view published projects" on projects;
drop policy if exists "Admins can insert projects" on projects;
drop policy if exists "Admins can update projects" on projects;
drop policy if exists "Admins can delete projects" on projects;

drop policy if exists "Public can view published certifications" on certifications;
drop policy if exists "Admins can manage certifications" on certifications;

drop policy if exists "Public can view published experience" on experience;
drop policy if exists "Admins can manage experience" on experience;

drop policy if exists "Public can view published education" on education;
drop policy if exists "Admins can manage education" on education;

drop policy if exists "Public can view published skills" on skills;
drop policy if exists "Admins can manage skills" on skills;

drop policy if exists "Public can view published security practices" on security_practices;
drop policy if exists "Admins can manage security practices" on security_practices;

drop policy if exists "Public can view published resumes" on resumes;
drop policy if exists "Admins can manage resumes" on resumes;

drop policy if exists "Admins can view admin users" on admin_users;
drop policy if exists "Admins can insert admin users" on admin_users;
drop policy if exists "Admins can update admin users" on admin_users;
drop policy if exists "Admins can delete admin users" on admin_users;

-- Create Policies
-- Site Settings
create policy "Public can view site settings" on site_settings
  for select using (true);

create policy "Admins can modify site settings" on site_settings
  for all using (fn_is_admin()) with check (fn_is_admin());

-- Projects
create policy "Public can view published projects" on projects
  for select using (published = true or fn_is_admin());

create policy "Admins can insert projects" on projects
  for insert with check (fn_is_admin());

create policy "Admins can update projects" on projects
  for update using (fn_is_admin()) with check (fn_is_admin());

create policy "Admins can delete projects" on projects
  for delete using (fn_is_admin());

-- Certifications
create policy "Public can view published certifications" on certifications
  for select using (published = true or fn_is_admin());

create policy "Admins can manage certifications" on certifications
  for all using (fn_is_admin()) with check (fn_is_admin());

-- Experience
create policy "Public can view published experience" on experience
  for select using (published = true or fn_is_admin());

create policy "Admins can manage experience" on experience
  for all using (fn_is_admin()) with check (fn_is_admin());

-- Education
create policy "Public can view published education" on education
  for select using (published = true or fn_is_admin());

create policy "Admins can manage education" on education
  for all using (fn_is_admin()) with check (fn_is_admin());

-- Skills
create policy "Public can view published skills" on skills
  for select using (published = true or fn_is_admin());

create policy "Admins can manage skills" on skills
  for all using (fn_is_admin()) with check (fn_is_admin());

-- Security Practices
create policy "Public can view published security practices" on security_practices
  for select using (published = true or fn_is_admin());

create policy "Admins can manage security practices" on security_practices
  for all using (fn_is_admin()) with check (fn_is_admin());

-- Resumes
create policy "Public can view published resumes" on resumes
  for select using (published = true or fn_is_admin());

create policy "Admins can manage resumes" on resumes
  for all using (fn_is_admin()) with check (fn_is_admin());

-- Admin Users (Protected using fn_is_admin without recursion issues)
create policy "Admins can view admin users" on admin_users
  for select using (fn_is_admin());

create policy "Admins can insert admin users" on admin_users
  for insert with check (fn_is_admin());

create policy "Admins can update admin users" on admin_users
  for update using (fn_is_admin()) with check (fn_is_admin());

create policy "Admins can delete admin users" on admin_users
  for delete using (fn_is_admin());

-- Helper function to atomically set the active published resume
create or replace function set_published_resume(p_resume_id text)
returns void as $$
begin
  if not fn_is_admin() then
    raise exception 'Unauthorized: Admin privileges required';
  end if;

  update public.resumes set published = false where id <> p_resume_id;
  update public.resumes set published = true where id = p_resume_id;
end;
$$ language plpgsql security definer set search_path = public, auth;

-- Restrict direct execution to authenticated users only
revoke execute on function public.set_published_resume(text) from public;
grant execute on function public.set_published_resume(text) to authenticated;

-- ============================================================================
-- 6. INITIAL SEED DATA
-- ============================================================================

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

-- ============================================================================
-- 7. STORAGE BUCKETS & STORAGE POLICIES
-- ============================================================================

-- Create storage buckets if not exist
insert into storage.buckets (id, name, public)
values 
  ('projects', 'projects', true),
  ('certificates', 'certificates', true),
  ('resumes', 'resumes', true),
  ('profile', 'profile', true)
on conflict (id) do nothing;

-- Drop existing storage policies if any (for idempotency)
drop policy if exists "Public Access to Projects Bucket" on storage.objects;
drop policy if exists "Public Access to Certificates Bucket" on storage.objects;
drop policy if exists "Public Access to Resumes Bucket" on storage.objects;
drop policy if exists "Public Access to Profile Bucket" on storage.objects;

drop policy if exists "Admin Insert Projects Bucket" on storage.objects;
drop policy if exists "Admin Update Projects Bucket" on storage.objects;
drop policy if exists "Admin Delete Projects Bucket" on storage.objects;
drop policy if exists "Admin Manage Certificates Bucket" on storage.objects;
drop policy if exists "Admin Manage Resumes Bucket" on storage.objects;
drop policy if exists "Admin Manage Profile Bucket" on storage.objects;

-- Storage Policies: Public Read Access
create policy "Public Access to Projects Bucket"
  on storage.objects for select
  using (bucket_id = 'projects');

create policy "Public Access to Certificates Bucket"
  on storage.objects for select
  using (bucket_id = 'certificates');

create policy "Public Access to Resumes Bucket"
  on storage.objects for select
  using (bucket_id = 'resumes');

create policy "Public Access to Profile Bucket"
  on storage.objects for select
  using (bucket_id = 'profile');

-- Storage Policies: Admin Write Access
create policy "Admin Insert Projects Bucket"
  on storage.objects for insert
  with check (bucket_id = 'projects' and fn_is_admin());

create policy "Admin Update Projects Bucket"
  on storage.objects for update
  using (bucket_id = 'projects' and fn_is_admin());

create policy "Admin Delete Projects Bucket"
  on storage.objects for delete
  using (bucket_id = 'projects' and fn_is_admin());

-- Certificates Bucket Admin Policies
create policy "Admin Manage Certificates Bucket"
  on storage.objects for all
  using (bucket_id = 'certificates' and fn_is_admin())
  with check (bucket_id = 'certificates' and fn_is_admin());

-- Resumes Bucket Admin Policies
create policy "Admin Manage Resumes Bucket"
  on storage.objects for all
  using (bucket_id = 'resumes' and fn_is_admin())
  with check (bucket_id = 'resumes' and fn_is_admin());

-- Profile Bucket Admin Policies
create policy "Admin Manage Profile Bucket"
  on storage.objects for all
  using (bucket_id = 'profile' and fn_is_admin())
  with check (bucket_id = 'profile' and fn_is_admin());

-- ============================================================================
-- End of Combined Portfolio Setup
-- ============================================================================
