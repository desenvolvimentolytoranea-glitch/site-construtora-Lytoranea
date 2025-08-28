-- Create a helper function to validate admin session from request headers
CREATE OR REPLACE FUNCTION public.is_admin_session()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_headers_json json;
  v_token_text text;
  v_token uuid;
BEGIN
  -- Read incoming request headers (Supabase exposes them via request.headers)
  v_headers_json := to_jsonb(current_setting('request.headers', true)::json);
  v_token_text := COALESCE(v_headers_json ->> 'x-admin-token', NULL);

  IF v_token_text IS NULL OR length(v_token_text) = 0 THEN
    RETURN FALSE;
  END IF;

  BEGIN
    v_token := v_token_text::uuid;
  EXCEPTION WHEN others THEN
    -- Invalid UUID format
    RETURN FALSE;
  END;

  RETURN EXISTS (
    SELECT 1 FROM public.admin_sessions s
    WHERE s.token = v_token
      AND s.revoked = FALSE
      AND s.expires_at > now()
  );
END;
$$;

-- Allow only valid admin sessions to write to the 'services' bucket
-- INSERT (upload)
CREATE POLICY IF NOT EXISTS "Admins can upload to services via admin token"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'services' AND public.is_admin_session()
);

-- UPDATE (replace/move)
CREATE POLICY IF NOT EXISTS "Admins can update services via admin token"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'services' AND public.is_admin_session()
)
WITH CHECK (
  bucket_id = 'services' AND public.is_admin_session()
);

-- DELETE (remove)
CREATE POLICY IF NOT EXISTS "Admins can delete from services via admin token"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'services' AND public.is_admin_session()
);
