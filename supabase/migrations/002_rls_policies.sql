-- Row Level Security (RLS) Policies
-- 002_rls_policies.sql

-- Helper function to check if current user is an admin
create or replace function fn_is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from admin_users
    where user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

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
  for select using (true);

create policy "Admins can modify site settings" on site_settings
  for all using (
    exists (select 1 from admin_users where user_id = auth.uid())
  ) with check (
    exists (select 1 from admin_users where user_id = auth.uid())
  );

-- 2. Projects Policies
create policy "Public can view published projects" on projects
  for select using (published = true or exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can insert projects" on projects
  for insert with check (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can update projects" on projects
  for update using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can delete projects" on projects
  for delete using (exists (select 1 from admin_users where user_id = auth.uid()));

-- 3. Certifications Policies
create policy "Public can view published certifications" on certifications
  for select using (published = true or exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can manage certifications" on certifications
  for all using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

-- 4. Experience Policies
create policy "Public can view published experience" on experience
  for select using (published = true or exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can manage experience" on experience
  for all using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

-- 5. Education Policies
create policy "Public can view published education" on education
  for select using (published = true or exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can manage education" on education
  for all using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

-- 6. Skills Policies
create policy "Public can view published skills" on skills
  for select using (published = true or exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can manage skills" on skills
  for all using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

-- 7. Security Practices Policies
create policy "Public can view published security practices" on security_practices
  for select using (published = true or exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can manage security practices" on security_practices
  for all using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

-- 8. Resumes Policies
create policy "Public can view published resumes" on resumes
  for select using (published = true or exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can manage resumes" on resumes
  for all using (exists (select 1 from admin_users where user_id = auth.uid()))
  with check (exists (select 1 from admin_users where user_id = auth.uid()));

-- 9. Admin Users Policies
create policy "Admins can view admin users" on admin_users
  for select using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admins can insert admin users" on admin_users
  for insert with check (exists (select 1 from admin_users where user_id = auth.uid()));
