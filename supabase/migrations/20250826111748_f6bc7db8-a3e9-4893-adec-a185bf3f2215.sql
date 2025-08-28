
-- Desbloqueio imediato e temporário para uploads no bucket "portfolio"
-- OBS: Isso permite INSERT para qualquer usuário (anon ou authenticated) no bucket "portfolio".
-- Removeremos após implementar o upload assinado via Edge Function.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Temporary public upload to portfolio'
  ) THEN
    CREATE POLICY "Temporary public upload to portfolio"
      ON storage.objects
      FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'portfolio');
  END IF;
END$$;
