-- Ensure admin write access to 'portfolio' bucket via is_admin_session()
-- Recreate policies idempotently

-- INSERT
drop policy if exists "Admins can upload to portfolio" on storage.objects;
create policy "Admins can upload to portfolio"
  on storage.objects
  for insert
  to public
  with check (
    bucket_id = 'portfolio' and public.is_admin_session()
  );

-- UPDATE
drop policy if exists "Admins can update portfolio objects" on storage.objects;
create policy "Admins can update portfolio objects"
  on storage.objects
  for update
  to public
  using (
    bucket_id = 'portfolio' and public.is_admin_session()
  )
  with check (
    bucket_id = 'portfolio' and public.is_admin_session()
  );

-- DELETE
drop policy if exists "Admins can delete from portfolio" on storage.objects;
create policy "Admins can delete from portfolio"
  on storage.objects
  for delete
  to public
  using (
    bucket_id = 'portfolio' and public.is_admin_session()
  );