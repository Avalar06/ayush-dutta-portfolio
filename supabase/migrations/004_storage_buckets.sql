-- Supabase Storage Buckets and Policies
-- 004_storage_buckets.sql

-- Create storage buckets if not exist
insert into storage.buckets (id, name, public)
values
  ('projects', 'projects', true),
  ('certificates', 'certificates', true),
  ('resumes', 'resumes', true),
  ('profile', 'profile', true)
on conflict (id) do nothing;

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
  with check (
    bucket_id = 'projects' and
    exists (select 1 from admin_users where user_id = auth.uid())
  );

create policy "Admin Update Projects Bucket"
  on storage.objects for update
  using (
    bucket_id = 'projects' and
    exists (select 1 from admin_users where user_id = auth.uid())
  );

create policy "Admin Delete Projects Bucket"
  on storage.objects for delete
  using (
    bucket_id = 'projects' and
    exists (select 1 from admin_users where user_id = auth.uid())
  );

-- Certificates Bucket Admin Policies
create policy "Admin Manage Certificates Bucket"
  on storage.objects for all
  using (
    bucket_id = 'certificates' and
    exists (select 1 from admin_users where user_id = auth.uid())
  )
  with check (
    bucket_id = 'certificates' and
    exists (select 1 from admin_users where user_id = auth.uid())
  );

-- Resumes Bucket Admin Policies
create policy "Admin Manage Resumes Bucket"
  on storage.objects for all
  using (
    bucket_id = 'resumes' and
    exists (select 1 from admin_users where user_id = auth.uid())
  )
  with check (
    bucket_id = 'resumes' and
    exists (select 1 from admin_users where user_id = auth.uid())
  );

-- Profile Bucket Admin Policies
create policy "Admin Manage Profile Bucket"
  on storage.objects for all
  using (
    bucket_id = 'profile' and
    exists (select 1 from admin_users where user_id = auth.uid())
  )
  with check (
    bucket_id = 'profile' and
    exists (select 1 from admin_users where user_id = auth.uid())
  );
