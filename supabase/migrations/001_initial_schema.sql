-- Ayush Dutta Portfolio Database Schema
-- 001_initial_schema.sql

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Site Settings (Singleton or single row config)
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

-- 2. Projects Table
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

-- 3. Certifications Table
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

-- 4. Experience Table
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

-- 5. Education Table
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

-- 6. Skills Table
create table if not exists skills (
  id text primary key,
  title text not null,
  description text not null,
  skills jsonb default '[]'::jsonb,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Security Practices Table
create table if not exists security_practices (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Resumes Table
create table if not exists resumes (
  id text primary key,
  title text not null,
  target_roles text not null,
  description text not null,
  pdf_path text not null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Admin Users Table (explicit database-enforced admin authorization)
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for performance
create index if not exists idx_projects_published on projects(published);
create index if not exists idx_projects_category on projects(category);
create index if not exists idx_certifications_published on certifications(published);
create index if not exists idx_experience_published on experience(published);
create index if not exists idx_education_published on education(published);
create index if not exists idx_skills_published on skills(published);
