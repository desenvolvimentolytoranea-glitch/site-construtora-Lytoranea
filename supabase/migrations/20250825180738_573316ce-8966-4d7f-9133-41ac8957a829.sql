-- Storage RLS policies for 'portfolio' bucket to allow admin-managed writes
-- Do not change existing read access; bucket is public. We only add write policies bound to is_admin_session().

-- INSERT policy
create policy if not exists "Admins can upload to portfolio"
  on storage.objects
  for insert
  to public
  with check (
    bucket_id = 'portfolio' and public.is_admin_session()
  );

-- UPDATE policy (metadata, renames)
create policy if not exists "Admins can update portfolio objects"
  on storage.objects
  for update
  to public
  using (
    bucket_id = 'portfolio' and public.is_admin_session()
  )
  with check (
    bucket_id = 'portfolio' and public.is_admin_session()
  );

-- DELETE policy
create policy if not exists "Admins can delete from portfolio"
  on storage.objects
  for delete
  to public
  using (
    bucket_id = 'portfolio' and public.is_admin_session()
  );