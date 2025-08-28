-- Create admin_users table for administrator authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to prevent any direct access from frontend
-- Admins will be managed only via direct database access
CREATE POLICY "Admin users cannot be accessed directly" 
ON public.admin_users 
FOR ALL 
USING (false);

-- Create function to authenticate admin users
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  admin_email TEXT,
  admin_password TEXT
) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Insert a default admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO public.admin_users (email, password_hash, name) 
VALUES ('admin@lytoranea.com', 'admin123', 'Administrador')
ON CONFLICT (email) DO NOTHING;