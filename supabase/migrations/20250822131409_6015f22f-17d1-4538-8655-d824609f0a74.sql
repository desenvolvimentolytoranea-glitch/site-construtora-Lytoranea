-- Fix security issue: Set proper search_path for the function
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  admin_email TEXT,
  admin_password TEXT
) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
  result JSON;
BEGIN
  -- Find admin user by email
  SELECT id, email, password_hash, name, is_active
  INTO admin_record
  FROM public.admin_users
  WHERE email = admin_email AND is_active = true;
  
  -- Check if admin exists
  IF NOT FOUND THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'message', 'Credenciais inválidas');
  END IF;
  
  -- In a real implementation, you would use proper password hashing
  -- For now, we'll do a simple comparison (REPLACE WITH PROPER HASHING IN PRODUCTION)
  IF admin_record.password_hash = admin_password THEN
    -- Update last login
    UPDATE public.admin_users 
    SET last_login = now() 
    WHERE id = admin_record.id;
    
    -- Return success with admin info
    RETURN JSON_BUILD_OBJECT(
      'success', true, 
      'admin', JSON_BUILD_OBJECT(
        'id', admin_record.id,
        'email', admin_record.email,
        'name', admin_record.name
      )
    );
  ELSE
    RETURN JSON_BUILD_OBJECT('success', false, 'message', 'Credenciais inválidas');
  END IF;
END;
$$;