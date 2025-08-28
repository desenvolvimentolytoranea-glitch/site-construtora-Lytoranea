
-- Storage policies para o bucket 'clients'

-- 1) Leitura pública dos arquivos do bucket 'clients' (útil para listar/checar objetos; a URL pública já funciona por ser bucket público)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read access to clients'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read access to clients"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = ''clients'')';
  END IF;
END$$;

-- 2) Permitir INSERT quando sessão for admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin can insert client logos'
  ) THEN
    EXECUTE 'CREATE POLICY "Admin can insert client logos"
      ON storage.objects
      FOR INSERT
      TO public
      WITH CHECK (
        bucket_id = ''clients'' 
        AND public.is_admin_session()
      )';
  END IF;
END$$;

-- 3) Permitir UPDATE quando sessão for admin (necessário para upsert/overwrite)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin can update client logos'
  ) THEN
    EXECUTE 'CREATE POLICY "Admin can update client logos"
      ON storage.objects
      FOR UPDATE
      TO public
      USING (
        bucket_id = ''clients'' 
        AND public.is_admin_session()
      )
      WITH CHECK (
        bucket_id = ''clients'' 
        AND public.is_admin_session()
      )';
  END IF;
END$$;

-- 4) (Opcional) Permitir DELETE quando sessão for admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin can delete client logos'
  ) THEN
    EXECUTE 'CREATE POLICY "Admin can delete client logos"
      ON storage.objects
      FOR DELETE
      TO public
      USING (
        bucket_id = ''clients'' 
        AND public.is_admin_session()
      )';
  END IF;
END$$;
