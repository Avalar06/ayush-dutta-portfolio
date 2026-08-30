-- Row Level Security (RLS) Policies
-- 002_rls_policies.sql

-- Helper function to check if current user is an admin
create or replace function fn_is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
end;
$$ language plpgsql security definer set search_path = public, auth, pg_temp;

-- Permissions for fn_is_admin (internal helper for authenticated RLS and service operations)
revoke execute on function public.fn_is_admin() from public;
revoke execute on function public.fn_is_admin() from anon;
grant execute on function public.fn_is_admin() to authenticated, service_role;

-- Enable RLS on all tables
alter table site_settings enable row level security;
alter table projects enable row level security;
alter table certifications enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table skills enable row level security;
alter table security_practices enable row level security;
alter table resumes enable row level security;
alter table admin_users enable row level security;

-- 1. Site Settings Policies
create policy "Public can view site settings" on site_settings
  for select to anon, authenticated using (true);

create policy "Admins can modify site settings" on site_settings
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

-- 2. Projects Policies
create policy "Public can view published projects" on projects
  for select to anon, authenticated using (published = true);

create policy "Admins can view all projects" on projects
  for select to authenticated using (fn_is_admin());

create policy "Admins can insert projects" on projects
  for insert to authenticated with check (fn_is_admin());

create policy "Admins can update projects" on projects
  for update to authenticated using (fn_is_admin()) with check (fn_is_admin());

create policy "Admins can delete projects" on projects
  for delete to authenticated using (fn_is_admin());

-- 3. Certifications Policies
create policy "Public can view published certifications" on certifications
  for select to anon, authenticated using (published = true);

create policy "Admins can view all certifications" on certifications
  for select to authenticated using (fn_is_admin());

create policy "Admins can manage certifications" on certifications
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

-- 4. Experience Policies
create policy "Public can view published experience" on experience
  for select to anon, authenticated using (published = true);

create policy "Admins can view all experience" on experience
  for select to authenticated using (fn_is_admin());

create policy "Admins can manage experience" on experience
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

-- 5. Education Policies
create policy "Public can view published education" on education
  for select to anon, authenticated using (published = true);

create policy "Admins can view all education" on education
  for select to authenticated using (fn_is_admin());

create policy "Admins can manage education" on education
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

-- 6. Skills Policies
create policy "Public can view published skills" on skills
  for select to anon, authenticated using (published = true);

create policy "Admins can view all skills" on skills
  for select to authenticated using (fn_is_admin());

create policy "Admins can manage skills" on skills
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

-- 7. Security Practices Policies
create policy "Public can view published security practices" on security_practices
  for select to anon, authenticated using (published = true);

create policy "Admins can view all security practices" on security_practices
  for select to authenticated using (fn_is_admin());

create policy "Admins can manage security practices" on security_practices
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

-- 8. Resumes Policies
create policy "Public can view published resumes" on resumes
  for select to anon, authenticated using (published = true);

create policy "Admins can view all resumes" on resumes
  for select to authenticated using (fn_is_admin());

create policy "Admins can manage resumes" on resumes
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

-- 9. Admin Users Policies
create policy "Authenticated users can verify admin status" on admin_users
  for select to authenticated using (user_id = auth.uid());

create policy "Admins can manage admin users" on admin_users
  for all to authenticated using (fn_is_admin())
  with check (fn_is_admin());

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
$$ language plpgsql security definer set search_path = public, auth, pg_temp;

-- Restrict direct execution to authenticated users only
revoke execute on function public.set_published_resume(text) from public;
revoke execute on function public.set_published_resume(text) from anon;
grant execute on function public.set_published_resume(text) to authenticated, service_role;

-- ============================================================================
-- Explicit Table Grants & Privilege Revocation
-- ============================================================================

-- Revoke all table privileges from anon
revoke all privileges on table public.admin_users from anon;
revoke all privileges on table public.projects from anon;
revoke all privileges on table public.experience from anon;
revoke all privileges on table public.certifications from anon;
revoke all privileges on table public.education from anon;
revoke all privileges on table public.skills from anon;
revoke all privileges on table public.security_practices from anon;
revoke all privileges on table public.site_settings from anon;
revoke all privileges on table public.resumes from anon;

-- Revoke all table privileges from authenticated to ensure no unwanted defaults (REFERENCES, TRIGGER, TRUNCATE)
revoke all privileges on table public.admin_users from authenticated;
revoke all privileges on table public.projects from authenticated;
revoke all privileges on table public.experience from authenticated;
revoke all privileges on table public.certifications from authenticated;
revoke all privileges on table public.education from authenticated;
revoke all privileges on table public.skills from authenticated;
revoke all privileges on table public.security_practices from authenticated;
revoke all privileges on table public.site_settings from authenticated;
revoke all privileges on table public.resumes from authenticated;

-- Grant schema usage
grant usage on schema public to anon, authenticated, service_role;

-- Public read access: Grant SELECT ONLY to anon on genuinely public portfolio tables
grant select on table public.projects to anon;
grant select on table public.experience to anon;
grant select on table public.certifications to anon;
grant select on table public.skills to anon;
grant select on table public.security_practices to anon;
grant select on table public.education to anon;
grant select on table public.site_settings to anon;
grant select on table public.resumes to anon;

-- Authenticated role access: Grant explicit CRUD table privileges to authenticated (row-level authorization enforced by RLS)
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.experience to authenticated;
grant select, insert, update, delete on table public.certifications to authenticated;
grant select, insert, update, delete on table public.skills to authenticated;
grant select, insert, update, delete on table public.security_practices to authenticated;
grant select, insert, update, delete on table public.education to authenticated;
grant select, insert, update, delete on table public.site_settings to authenticated;
grant select, insert, update, delete on table public.resumes to authenticated;
grant select, insert, update, delete on table public.admin_users to authenticated;

-- Service role retains full administrative access
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all routines in schema public to service_role;

