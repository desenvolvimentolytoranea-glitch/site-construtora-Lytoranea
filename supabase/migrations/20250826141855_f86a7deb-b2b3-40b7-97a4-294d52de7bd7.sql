-- Improve the admin_update_client_logo function with better error handling
CREATE OR REPLACE FUNCTION public.admin_update_client_logo(p_token uuid, p_client_id uuid, p_logo_url text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_admin UUID;
  v_client_exists BOOLEAN;
BEGIN
  -- Validate admin token
  v_admin := public.get_admin_id_from_token(p_token);
  IF v_admin IS NULL THEN
    RAISE EXCEPTION 'Admin token inválido ou expirado';
  END IF;

  -- Check if client exists
  SELECT EXISTS(SELECT 1 FROM public.clients WHERE id = p_client_id) INTO v_client_exists;
  IF NOT v_client_exists THEN
    RAISE EXCEPTION 'Cliente não encontrado';
  END IF;

  -- Update client logo
  UPDATE public.clients
  SET logo_url = p_logo_url,
      updated_at = now()
  WHERE id = p_client_id;

  -- Verify the update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Falha ao atualizar logo do cliente';
  END IF;
END;
$function$;